"""Reescribe la Parte 1 de capacitores/GUION.md a partir de narracion.json.

Uso: python guion_desde_narracion.py   (requiere haber corrido antes «python grabar.py audio»)
Conserva las partes 2 y 3 del guion tal como están.
"""
import json
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
import grabar  # noqa: E402
GUION = AQUI.parent / "GUION.md"
TITULOS = {
    "01": "Portada", "02": "Definición", "03": "El procedimiento", "04": "Placas paralelas",
    "05": "Coaxial, esfera y la Tierra", "06": "El dieléctrico por dentro", "07": "La grieta de aire y el límite del material",
    "08": "Respuesta en DC", "09": "Respuesta en AC", "10": "Aplicaciones y corriente de desplazamiento",
    "11": "Capacitores en semiconductores", "12": "Energía almacenada", "13": "Cierre",
}
BLOQUES = [("I", "Qué es un capacitor y cómo se calcula", ["01", "02", "03"]),
           ("II", "Las geometrías", ["04", "05"]),
           ("III", "El dieléctrico y su límite", ["06", "07"]),
           ("IV", "El capacitor en el circuito y en el chip", ["08", "09", "10", "11"]),
           ("V", "Energía y cierre", ["12", "13"])]


def mmss(s):
    return f"{int(s // 60)}:{int(round(s % 60)):02d}"


def main():
    cfg = json.loads((AQUI / "narracion.json").read_text(encoding="utf-8"))
    _, durs, esperas, pausas, _ = grabar.plan(cfg)
    t, inicio, fin = 0.0, {}, {}
    for b, d, e, p in zip(cfg["bloques"], durs, esperas, pausas):
        inicio.setdefault(b["slide"], t)
        t += e + d + p
        fin[b["slide"]] = t
    total = t
    out = ["# Parte 1 · Guion slide por slide", ""]
    out += ["| Bloque | Slides | Tema | Reloj |", "| --- | --- | --- | --- |"]
    for rom, tema, sl in BLOQUES:
        out.append(f"| {rom} | {sl[0]}–{sl[-1]} | {tema} | {mmss(inicio[sl[0]])} → {mmss(fin[sl[-1]])} |")
    out += ["", f"Duración total con transiciones y pausas: **{mmss(total)}**.", ""]
    for rom, tema, sl in BLOQUES:
        out += ["---", "", f"## Bloque {rom} — {tema}", ""]
        for s in sl:
            bl = [b for b in cfg["bloques"] if b["slide"] == s]
            out += [f"### {s} · {TITULOS[s]} · reloj {mmss(inicio[s])} · {mmss(fin[s] - inicio[s])}", ""]
            for i, b in enumerate(bl):
                if i == 0:
                    out += [f"**En pantalla:** {b['pantalla']}", ""]
                else:
                    out += [f"**[→]** *({b['pantalla']})*", ""]
                out += [f"> \"{b['texto']}\"", ""]
    parte1 = "\n".join(out)
    g = GUION.read_text(encoding="utf-8")
    a, z = g.index("# Parte 1"), g.index("# Parte 2")
    cab = g[:a]
    GUION.write_text(cab + parte1 + "\n---\n\n" + g[z:], encoding="utf-8")
    print(f"Guion actualizado · {mmss(total)}")


if __name__ == "__main__":
    main()
