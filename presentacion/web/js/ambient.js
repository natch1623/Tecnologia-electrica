/* =========================================================
   Ambiente vivo · estrellas → nebulosa → partículas → geometría
   El ánimo (mood) cambia con el bloque de la exposición
   ========================================================= */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = document.getElementById('sky');
  const ctx = cv.getContext('2d');
  const neb = document.createElement('canvas');
  const nctx = neb.getContext('2d');

  const MOODS = {
    maint:  { a: [165, 139, 255], b: [143, 227, 255], c: [91, 63, 214],  mode: 'drift',   speed: 1,   glow: 0.24 },
    energy: { a: [201, 184, 255], b: [143, 227, 255], c: [91, 63, 214],  mode: 'pulse',   speed: 1.6, glow: 0.3 },
    dc:     { a: [143, 227, 255], b: [165, 139, 255], c: [36, 72, 170],  mode: 'circuit', speed: 1.3, glow: 0.26 },
    h2:     { a: [143, 227, 255], b: [94, 240, 200],  c: [28, 96, 150],  mode: 'rise',    speed: 1,   glow: 0.24 },
    crisis: { a: [255, 77, 109],  b: [165, 139, 255], c: [130, 14, 46],  mode: 'ember',   speed: 1.5, glow: 0.32 },
    order:  { a: [94, 240, 200],  b: [143, 227, 255], c: [30, 80, 120],  mode: 'drift',   speed: 0.8, glow: 0.22 },
    calm:   { a: [201, 184, 255], b: [94, 240, 200],  c: [70, 48, 160],  mode: 'drift',   speed: 0.6, glow: 0.2 }
  };
  let mood = MOODS.maint;
  const pal = { a: [...mood.a], b: [...mood.b], c: [...mood.c], glow: mood.glow, speed: mood.speed };

  let W, H, dpr;
  let stars = [], parts = [], bursts = [], streaks = [], glitches = [];
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const anchor = { x: 0, y: 0, tx: 0, ty: 0 };
  let anchorSet = false;

  function resize() {
    // El fondo es difuso: 1,25× basta y reduce a la mitad los píxeles por cuadro frente a 1,75×
    dpr = Math.min(1.25, devicePixelRatio || 1);
    W = cv.width = Math.max(1, innerWidth * dpr);
    H = cv.height = Math.max(1, innerHeight * dpr);
    neb.width = Math.ceil(W / 8);
    neb.height = Math.ceil(H / 8);
    const n = Math.round((innerWidth * innerHeight) / 4200);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: (Math.random() ** 3 * 1.5 + 0.3) * dpr,
      z: 0.15 + Math.random() * 0.85,
      a: Math.random() * Math.PI * 2, tw: 0.3 + Math.random() * 1.4,
      hue: Math.random() < 0.25 ? 1 : Math.random() < 0.3 ? 2 : 0
    })).sort((a, b) => a.hue - b.hue); // agrupadas por color: un solo fillStyle por grupo
    if (!anchorSet) { anchor.x = anchor.tx = W * 0.78; anchor.y = anchor.ty = H * 0.3; }
    if (reduced) draw(0);
  }

  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- Partículas ---------- */
  function spawn(fresh) {
    const m = mood.mode;
    const p = { mode: m, life: 0, max: 400 + Math.random() * 500, x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, s: (0.6 + Math.random() * 1.6) * dpr, trail: [] };
    if (m === 'drift' || m === 'pulse') { p.vx = (Math.random() - 0.5) * 0.25 * dpr; p.vy = (Math.random() - 0.5) * 0.25 * dpr; }
    if (m === 'circuit') {
      const g = 72 * dpr;
      p.x = Math.round(p.x / g) * g; p.y = Math.round(p.y / g) * g;
      const d = [[1, 0], [-1, 0], [0, 1], [0, -1]][(Math.random() * 4) | 0];
      p.vx = d[0] * 1.3 * dpr; p.vy = d[1] * 1.3 * dpr; p.g = g; p.max = 260 + Math.random() * 260;
    }
    if (m === 'rise') { p.y = fresh ? Math.random() * H : H + 10; p.vy = -(0.35 + Math.random() * 0.8) * dpr; p.s = (1.5 + Math.random() * 4) * dpr; p.ph = Math.random() * 6; }
    if (m === 'ember') { p.y = fresh ? Math.random() * H : H + 10; p.vy = -(0.25 + Math.random() * 0.6) * dpr; p.vx = (Math.random() - 0.5) * 0.3 * dpr; p.ph = Math.random() * 6; }
    return p;
  }
  const COUNT = 80;

  function setMood(name) {
    const m = MOODS[name] || MOODS.maint;
    if (m === mood) return;
    const modeChanged = m.mode !== mood.mode;
    mood = m;
    if (modeChanged) parts.forEach(p => { p.max = Math.min(p.max, p.life + 50 + Math.random() * 60); });
  }

  function setAnchor(x, y) {
    anchor.tx = x * dpr; anchor.ty = y * dpr;
    if (!anchorSet) { anchor.x = anchor.tx; anchor.y = anchor.ty; anchorSet = true; }
  }

  function burst(x, y, c = [201, 184, 255], n = 46) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = (1 + Math.random() * 6) * dpr;
      bursts.push({ x: x * dpr, y: y * dpr, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, c, s: (0.8 + Math.random() * 1.8) * dpr });
    }
  }

  addEventListener('mousemove', e => {
    mouse.tx = (e.clientX / innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / innerHeight) * 2 - 1;
  });

  /* ---------- Dibujo ---------- */
  let frameN = 0, lastT = -1e9, raf = 0, running = document.visibilityState === 'visible';
  const schedule = () => { if (!reduced && running && !raf) raf = requestAnimationFrame(draw); };
  function draw(t) {
    raf = 0;
    if (!running) return;
    // Como máximo 60 cuadros por segundo: en pantallas de 120/144 Hz el fondo no corre el doble
    if (!reduced && t - lastT < 15) { schedule(); return; }
    lastT = t;
    frameN++;
    for (const k of ['a', 'b', 'c']) for (let i = 0; i < 3; i++) pal[k][i] = lerp(pal[k][i], mood[k][i], 0.02);
    pal.glow = lerp(pal.glow, mood.glow, 0.02);
    pal.speed = lerp(pal.speed, mood.speed, 0.02);
    mouse.x = lerp(mouse.x, mouse.tx, 0.04);
    mouse.y = lerp(mouse.y, mouse.ty, 0.04);
    anchor.x = lerp(anchor.x, anchor.tx, 0.03);
    anchor.y = lerp(anchor.y, anchor.ty, 0.03);

    ctx.globalCompositeOperation = 'source-over';

    // Nebulosa (baja resolución, escalada): lleva el color del vacío de fondo, así cubre todo el lienzo
    if (frameN % 2 === 1 || reduced) {
      const w = neb.width, h = neb.height, s = t * 0.00005;
      nctx.fillStyle = '#07060f';
      nctx.fillRect(0, 0, w, h);
      const blob = (x, y, r, c, a) => {
        const g = nctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, rgba(c, a)); g.addColorStop(1, rgba(c, 0));
        nctx.fillStyle = g; nctx.fillRect(0, 0, w, h);
      };
      const ax = anchor.x / 8, ay = anchor.y / 8;
      blob(ax + Math.sin(s * 3) * w * 0.05, ay + Math.cos(s * 2) * h * 0.05, w * 0.5, pal.c, pal.glow);
      blob(w * (0.18 + Math.sin(s * 2.3) * 0.04), h * (0.82 + Math.cos(s * 1.7) * 0.04), w * 0.42, pal.a, 0.07);
      blob(w * (0.5 + Math.cos(s * 1.3) * 0.08), h * (0.5 + Math.sin(s * 1.1) * 0.06), w * 0.6, pal.b, 0.035);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(neb, 0, 0, W, H);

    // Estrellas con parallax
    const px = mouse.x * 16 * dpr, py = mouse.y * 12 * dpr;
    // Color fijo por grupo y transparencia con globalAlpha (evita crear un rgba() por estrella y cuadro)
    const cols = [[244, 241, 255], pal.a, pal.b];
    let hue = -1;
    ctx.lineWidth = 0.6 * dpr;
    for (const st of stars) {
      if (st.hue !== hue) { hue = st.hue; ctx.fillStyle = ctx.strokeStyle = rgba(cols[hue], 1); }
      if (!reduced) { st.x -= 0.04 * st.z * dpr * pal.speed; if (st.x < -5) st.x = W + 5; }
      const x = st.x - px * st.z, y = st.y - py * st.z;
      const al = 0.3 + 0.7 * Math.abs(Math.sin(st.a + t * 0.001 * st.tw));
      ctx.globalAlpha = al * (0.4 + st.z * 0.6);
      if (st.r < 1.1 * dpr) ctx.fillRect(x - st.r, y - st.r, st.r * 2, st.r * 2);
      else { ctx.beginPath(); ctx.arc(x, y, st.r, 0, 6.283); ctx.fill(); }
      if (st.r > 1.45 * dpr) {
        ctx.globalAlpha = al * 0.35;
        ctx.beginPath();
        ctx.moveTo(x - st.r * 4, y); ctx.lineTo(x + st.r * 4, y);
        ctx.moveTo(x, y - st.r * 4); ctx.lineTo(x, y + st.r * 4);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // Geometría: anillos que respiran alrededor del ancla
    const ax = anchor.x - px * 0.4, ay = anchor.y - py * 0.4;
    const br = 1 + Math.sin(t * 0.0006) * 0.018;
    ctx.lineWidth = dpr;
    [[190, 0.07, null], [300, 0.05, [2 * dpr, 12 * dpr]], [470, 0.045, null], [680, 0.03, [30 * dpr, 10 * dpr, 3 * dpr, 10 * dpr]]].forEach(([r, a, dash], i) => {
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(t * 0.00002 * (i % 2 ? -1 : 1) * (i + 1));
      ctx.setLineDash(dash || []);
      ctx.strokeStyle = rgba(pal.a, a);
      ctx.beginPath(); ctx.arc(0, 0, r * dpr * br, 0, 6.283); ctx.stroke();
      if (i === 2) {
        ctx.setLineDash([]);
        for (let k = 0; k < 72; k++) {
          const an = (k / 72) * 6.283, r0 = r * dpr * br, r1 = r0 + (k % 6 ? 6 : 16) * dpr;
          ctx.moveTo(Math.cos(an) * r0, Math.sin(an) * r0); ctx.lineTo(Math.cos(an) * r1, Math.sin(an) * r1);
        }
        ctx.stroke();
      }
      ctx.restore();
    });
    ctx.setLineDash([]);
    ctx.strokeStyle = rgba(pal.a, 0.03);
    ctx.beginPath(); ctx.moveTo(0, ay); ctx.lineTo(W, ay); ctx.moveTo(ax, 0); ctx.lineTo(ax, H); ctx.stroke();

    if (reduced) return;

    // Partículas por modo
    while (parts.length < COUNT) parts.push(spawn(parts.length < COUNT && frameN < 3));
    ctx.globalCompositeOperation = 'lighter';
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life++;
      const k = Math.sin(Math.PI * Math.min(1, p.life / p.max));
      const sp = pal.speed;
      if (p.mode === 'drift' || p.mode === 'pulse') {
        p.x += p.vx * sp; p.y += p.vy * sp;
        ctx.fillStyle = rgba(i % 3 ? pal.a : pal.b, 0.55 * k);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill();
      } else if (p.mode === 'circuit') {
        p.trail.push(p.x, p.y); if (p.trail.length > 36) p.trail.splice(0, 2);
        p.x += p.vx * sp; p.y += p.vy * sp;
        const g = p.g;
        if (Math.abs(p.x / g - Math.round(p.x / g)) < 0.02 && Math.abs(p.y / g - Math.round(p.y / g)) < 0.02 && Math.random() < 0.35) {
          const v = Math.hypot(p.vx, p.vy);
          if (p.vx) { p.vy = (Math.random() < 0.5 ? -1 : 1) * v; p.vx = 0; } else { p.vx = (Math.random() < 0.5 ? -1 : 1) * v; p.vy = 0; }
        }
        ctx.strokeStyle = rgba(pal.a, 0.35 * k); ctx.lineWidth = 1.1 * dpr;
        ctx.beginPath(); ctx.moveTo(p.trail[0] ?? p.x, p.trail[1] ?? p.y);
        for (let j = 2; j < p.trail.length; j += 2) ctx.lineTo(p.trail[j], p.trail[j + 1]);
        ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.fillStyle = rgba(pal.b, 0.8 * k);
        ctx.fillRect(p.x - 1.5 * dpr, p.y - 1.5 * dpr, 3 * dpr, 3 * dpr);
      } else if (p.mode === 'rise') {
        p.y += p.vy * sp; p.x += Math.sin(p.life * 0.03 + p.ph) * 0.25 * dpr;
        ctx.strokeStyle = rgba(i % 2 ? pal.a : pal.b, 0.45 * k); ctx.lineWidth = 0.9 * dpr;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.stroke();
        if (p.y < -20) p.life = p.max;
      } else if (p.mode === 'ember') {
        p.y += p.vy * sp; p.x += p.vx + Math.sin(p.life * 0.05 + p.ph) * 0.2 * dpr;
        const fl = 0.5 + 0.5 * Math.sin(p.life * 0.4 + p.ph);
        ctx.fillStyle = rgba(i % 4 ? pal.a : [255, 190, 150], (0.35 + 0.45 * fl) * k);
        ctx.fillRect(p.x, p.y, p.s * 1.3, p.s * 1.3);
        if (p.y < -20) p.life = p.max;
      }
      if (p.life >= p.max) parts.splice(i, 1);
    }

    // Rayas de energía (bloque II)
    if (mood.mode === 'pulse' && Math.random() < 0.02) streaks.push({ y: Math.random() * H, x: -300 * dpr, v: (16 + Math.random() * 18) * dpr, len: (180 + Math.random() * 320) * dpr });
    for (let i = streaks.length - 1; i >= 0; i--) {
      const s = streaks[i];
      s.x += s.v;
      const g = ctx.createLinearGradient(s.x - s.len, s.y, s.x, s.y);
      g.addColorStop(0, rgba(pal.a, 0)); g.addColorStop(1, rgba(pal.b, 0.5));
      ctx.strokeStyle = g; ctx.lineWidth = 1.2 * dpr;
      ctx.beginPath(); ctx.moveTo(s.x - s.len, s.y); ctx.lineTo(s.x, s.y); ctx.stroke();
      if (s.x - s.len > W) streaks.splice(i, 1);
    }

    // Grietas fugaces (bloque V)
    if (mood.mode === 'ember' && Math.random() < 0.006) {
      const pts = []; let x = Math.random() * W, y = Math.random() * H;
      for (let j = 0; j < 7; j++) { pts.push(x, y); x += (Math.random() - 0.3) * 70 * dpr; y += (Math.random() - 0.5) * 70 * dpr; }
      glitches.push({ pts, life: 1 });
    }
    for (let i = glitches.length - 1; i >= 0; i--) {
      const gl = glitches[i];
      ctx.strokeStyle = rgba(pal.a, 0.5 * gl.life); ctx.lineWidth = 1 * dpr;
      ctx.beginPath(); ctx.moveTo(gl.pts[0], gl.pts[1]);
      for (let j = 2; j < gl.pts.length; j += 2) ctx.lineTo(gl.pts[j], gl.pts[j + 1]);
      ctx.stroke();
      gl.life -= 0.03; if (gl.life <= 0) glitches.splice(i, 1);
    }

    // Estallidos de transición
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.x += b.vx; b.y += b.vy; b.vx *= 0.94; b.vy *= 0.94; b.life -= 0.018;
      ctx.fillStyle = rgba(b.c, Math.max(0, b.life));
      ctx.beginPath(); ctx.arc(b.x, b.y, b.s, 0, 6.283); ctx.fill();
      if (b.life <= 0) bursts.splice(i, 1);
    }
    ctx.globalCompositeOperation = 'source-over';
    schedule();
  }

  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
    if (running) { lastT = -1e9; schedule(); }
  });
  resize();
  schedule();

  window.Ambient = { setMood, setAnchor, burst, mouse };
})();
