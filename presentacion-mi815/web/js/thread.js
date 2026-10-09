/* =========================================================
   Hilo conductor · una sola línea ámbar que se transforma
   órbita de la fuente → límite de dosis (techo) → línea de tiempo → frontera vacío/respuesta
   → límite de la clínica → base de los pilares → escalera de objetivos → fiel de las hipótesis
   → eje de distancia → flujo de las fases → división población/instrumentos → integración
   → eje de meses → eje del presupuesto → núcleo del impacto → horizonte
   Todas las formas tienen N puntos, así que se interpolan entre sí.
   ========================================================= */
(() => {
  const N = 72;
  const svg = document.getElementById('thread');
  const pathEl = svg.querySelector('.th-path');
  const glowEl = svg.querySelector('.th-glow');
  const spark = svg.querySelector('.th-spark');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const line = (x1, y1, x2, y2) => Array.from({ length: N }, (_, i) => { const t = i / (N - 1); return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]; });
  const circle = (cx, cy, r, a0 = -Math.PI / 2) => Array.from({ length: N }, (_, i) => { const a = a0 + (i / (N - 1)) * Math.PI * 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
  const wave = (y, amp, x1, x2, k = 2.2) => Array.from({ length: N }, (_, i) => { const t = i / (N - 1); return [x1 + (x2 - x1) * t, y + Math.sin(t * Math.PI * k) * amp]; });
  const bezier = (p0, p1, p2, p3) => Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1), u = 1 - t;
    return [0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
  });
  // Remuestrea una poligonal a N puntos equidistantes
  function poly(pts) {
    const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    const total = seg.reduce((a, b) => a + b, 0);
    return Array.from({ length: N }, (_, i) => {
      let d = (i / (N - 1)) * total, j = 0;
      while (j < seg.length - 1 && d > seg[j]) { d -= seg[j]; j++; }
      const t = seg[j] ? Math.min(1, d / seg[j]) : 0;
      return [pts[j][0] + (pts[j + 1][0] - pts[j][0]) * t, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * t];
    });
  }

  const SHAPES = {
    hero: circle(1530, 540, 330),
    ceiling: line(150, 300, 1770, 300),
    timeline: line(150, 600, 1770, 600),
    divider: line(985, 340, 985, 880),
    limit: line(1060, 360, 1770, 360),
    ground: line(150, 624, 1770, 624),
    rise: poly([[150, 905], [300, 862], [720, 791], [1140, 720], [1560, 650], [1770, 615]]),
    balance: line(150, 484, 1770, 484),
    axis: line(1240, 760, 1600, 760),
    flow: line(150, 560, 1770, 560),
    split: line(770, 330, 770, 760),
    merge: bezier([850, 690], [990, 690], [1000, 560], [1130, 560]),
    months: line(410, 364, 1770, 364),
    stack: line(150, 604, 1770, 604),
    core: circle(960, 560, 150),
    horizon: wave(950, 12, 150, 1770)
  };

  // Catmull-Rom → Bézier cúbicas: curva suave por todos los puntos
  function toPath(p) {
    let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  }

  let cur = SHAPES.hero.map(p => [...p]);
  let from = cur, to = cur, t0 = 0, dur = 1300, morphing = false;
  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

  function render() {
    const d = toPath(cur);
    pathEl.setAttribute('d', d);
    glowEl.setAttribute('d', d);
  }

  let first = true;
  function go(name) {
    const target = SHAPES[name] || SHAPES.horizon;
    if (first || reduced) {
      cur = target.map(p => [...p]); from = to = cur; render();
      if (first && !reduced) {
        // Primer trazo: la órbita se dibuja
        const len = pathEl.getTotalLength();
        [pathEl, glowEl].forEach(el => el.animate([{ strokeDasharray: `0 ${len}` }, { strokeDasharray: `${len} 0` }], { duration: 2200, easing: 'cubic-bezier(0.77,0,0.175,1)' }));
      }
      first = false;
      return;
    }
    from = cur.map(p => [...p]);
    to = target;
    t0 = performance.now();
    morphing = true;
  }

  let u = 0, last = performance.now();
  function frame(now) {
    if (morphing) {
      const k = Math.min(1, (now - t0) / dur), e = ease(k);
      cur = from.map((p, i) => [p[0] + (to[i][0] - p[0]) * e, p[1] + (to[i][1] - p[1]) * e]);
      render();
      if (k >= 1) morphing = false;
    }
    // La chispa recorre el hilo
    const len = pathEl.getTotalLength();
    if (len > 0) {
      u = (u + (now - last) / 7000) % 1;
      const pt = pathEl.getPointAtLength(u * len);
      spark.setAttribute('cx', pt.x); spark.setAttribute('cy', pt.y);
      spark.style.opacity = Math.sin(u * Math.PI).toFixed(2);
    }
    last = now;
    requestAnimationFrame(frame);
  }
  render();
  if (!reduced) requestAnimationFrame(frame); else spark.style.display = 'none';

  window.Thread = { to: go, SHAPES };
})();
