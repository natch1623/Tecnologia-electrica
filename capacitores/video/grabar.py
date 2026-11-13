"""Graba el ensayo narrado de la presentación «El Capacitor».

Uso:
    python grabar.py audio      # genera la voz de cada bloque y muestra la duración total
    python grabar.py video      # graba la presentación sincronizada y produce el MP4

Requisitos: edge-tts, playwright (chromium), imageio-ffmpeg, numpy.
La voz se genera con el servicio de voces neuronales de Microsoft Edge (requiere internet).
"""
import asyncio
import hashlib
import http.server
import json
import subprocess
import sys
import threading
import time
from functools import partial
from pathlib import Path

import imageio_ffmpeg
import numpy as np

AQUI = Path(__file__).resolve().parent
WEB = AQUI.parent / "web"
CACHE = AQUI / "_cache"
SALIDA = AQUI / "ensayo-capacitores.mp4"
SR = 24000
PUERTO = 5191
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def cargar():
    return json.loads((AQUI / "narracion.json").read_text(encoding="utf-8"))


def clip_path(texto, voz, vel):
    h = hashlib.sha1(f"{voz}|{vel}|{texto}".encode("utf-8")).hexdigest()[:16]
    return CACHE / f"{h}.mp3"


async def sintetizar(cfg):
    import edge_tts
    CACHE.mkdir(exist_ok=True)
    for i, b in enumerate(cfg["bloques"]):
        p = clip_path(b["texto"], cfg["voz"], cfg["velocidad"])
        if p.exists():
            continue
        print(f"  voz {i + 1}/{len(cfg['bloques'])}", flush=True)
        tmp = p.with_suffix(".part")
        for intento in range(5):
            try:
                await edge_tts.Communicate(b["texto"], cfg["voz"], rate=cfg["velocidad"]).save(str(tmp))
                tmp.replace(p)
                break
            except Exception as e:  # el servicio a veces corta la conexión: reintentar
                print(f"    reintento {intento + 1}: {type(e).__name__}", flush=True)
                tmp.unlink(missing_ok=True)
                await asyncio.sleep(2 + intento * 2)
        else:
            raise RuntimeError(f"No se pudo sintetizar el bloque {i + 1}")


def decodificar(p):
    raw = subprocess.run([FFMPEG, "-v", "error", "-i", str(p), "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0


def plan(cfg):
    """Duración de cada clip y pausa posterior para llegar a la duración objetivo."""
    clips = [decodificar(clip_path(b["texto"], cfg["voz"], cfg["velocidad"])) for b in cfg["bloques"]]
    durs = [len(c) / SR for c in clips]
    esperas = [b["espera"] for b in cfg["bloques"]]
    cola = 5.0
    fijo = sum(durs) + sum(esperas) + cola
    libre = cfg["duracion_objetivo_s"] - fijo
    n = len(clips)
    # Pausa de reflexión tras cada bloque: mínimo 1,2 s; los bloques largos reciben más.
    pesos = [d for d in durs]
    pausas = [max(1.2, libre * w / sum(pesos)) if libre > 0 else 1.2 for w in pesos]
    pausas[-1] = 0.0
    return clips, durs, esperas, pausas, cola


def resumen(cfg):
    clips, durs, esperas, pausas, cola = plan(cfg)
    total = sum(durs) + sum(esperas) + sum(pausas) + cola
    palabras = sum(len(b["texto"].split()) for b in cfg["bloques"])
    print(f"Voz: {sum(durs) / 60:.1f} min · {palabras} palabras · {palabras / (sum(durs) / 60):.0f} palabras/min")
    print(f"Pausas: {sum(pausas):.0f} s (~{np.mean(pausas[:-1]):.1f} s por bloque) · Total: {total / 60:.2f} min")
    return clips, durs, esperas, pausas, cola


def servidor():
    handler = partial(http.server.SimpleHTTPRequestHandler, directory=str(WEB))
    handler.log_message = lambda *a, **k: None
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PUERTO), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def grabar(cfg):
    """Graba con Chrome sin ventana: captura cada cuadro (protocolo DevTools) y lo codifica a 30 fps."""
    import base64
    import wave
    from playwright.sync_api import sync_playwright
    clips, durs, esperas, pausas, cola = resumen(cfg)
    srv = servidor()
    FPS = 30
    solo_video = CACHE / "video.mp4"
    enc = subprocess.Popen([FFMPEG, "-y", "-v", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                            "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p", str(solo_video)],
                           stdin=subprocess.PIPE)
    est = {"t0": None, "ultimo": None, "n": 0}

    def emitir_hasta(t):
        while est["ultimo"] is not None and est["n"] < int(t * FPS):
            enc.stdin.write(est["ultimo"]); est["n"] += 1

    marcas = []
    with sync_playwright() as pw:
        nav = pw.chromium.launch(channel="chrome", headless=True, args=["--ignore-gpu-blocklist", "--enable-gpu-rasterization"])
        ctx = nav.new_context(viewport={"width": 1920, "height": 1080})
        pag = ctx.new_page()
        pag.set_content("<html style='background:#000'></html>")
        cdp = ctx.new_cdp_session(pag)

        def cuadro(ev):
            ts = ev["metadata"]["timestamp"]
            if est["t0"] is None:
                est["t0"] = ts
            emitir_hasta(ts - est["t0"])
            est["ultimo"] = base64.b64decode(ev["data"])
            cdp.send("Page.screencastFrameAck", {"sessionId": ev["sessionId"]})

        cdp.on("Page.screencastFrame", cuadro)
        cdp.send("Page.startScreencast", {"format": "jpeg", "quality": 90, "maxWidth": 1920, "maxHeight": 1080, "everyNthFrame": 1})
        pag.wait_for_timeout(400)
        pag.goto(f"http://127.0.0.1:{PUERTO}/")
        pag.evaluate("document.fonts.ready.then(() => true)")
        rel = lambda: time.time() - (est["t0"] or time.time())
        for i, b in enumerate(cfg["bloques"]):
            if b["tecla"]:
                pag.keyboard.press("ArrowRight")
            pag.wait_for_timeout(int(esperas[i] * 1000))
            marcas.append(rel())
            print(f"  bloque {i + 1:02d} · slide {b['slide']} · {marcas[-1]:6.1f} s", flush=True)
            pag.wait_for_timeout(int((durs[i] + pausas[i]) * 1000))
        pag.wait_for_timeout(int(cola * 1000))
        cdp.send("Page.stopScreencast")
        fin = rel()
        ctx.close()
        nav.close()
    srv.shutdown()
    emitir_hasta(fin)
    enc.stdin.close(); enc.wait()

    # Pista de audio alineada con los instantes reales de cada bloque.
    pista = np.zeros(int((fin + 1) * SR), dtype=np.float32)
    for m, c in zip(marcas, clips):
        a = int(m * SR)
        pista[a:a + len(c)] += c[: max(0, len(pista) - a)]
    wav = CACHE / "pista.wav"
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(pista, -1, 1) * 32767).astype("<i2").tobytes())

    subprocess.run([FFMPEG, "-y", "-v", "error", "-i", str(solo_video), "-i", str(wav), "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", str(SALIDA)], check=True)
    (CACHE / "marcas.json").write_text(json.dumps({"marcas": marcas, "fin": fin}, indent=1), encoding="utf-8")
    print(f"Listo: {SALIDA} · {fin / 60:.2f} min")

if __name__ == "__main__":
    cfg = cargar()
    modo = sys.argv[1] if len(sys.argv) > 1 else "audio"
    asyncio.run(sintetizar(cfg))
    if modo == "audio":
        resumen(cfg)
    else:
        grabar(cfg)
