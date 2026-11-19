/* =========================================================
   Acabado por slide (Claude · ver COORDINACION-CODEX-CLAUDE.md)
   Corre después de scenes.js/main.js: añade, DETRÁS de cada diagrama, piezas
   propias de la temática (abismo, hielo, cortes de luz, energía eléctrica).
   No cambia textos, cifras, estados ni interacción.
   ========================================================= */
(() => {
  const G = window.GEO;
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const sceneOf = id => document.querySelector(`#${id} svg.scene`);
  // capa decorativa al fondo del diagrama (no recibe toques)
  const under = id => {
    let svg = sceneOf(id);
    const slide = document.getElementById(id);
    if (!slide) return null;
    // slides sin diagrama propio: se crea una capa al fondo
    if (!svg) { svg = el('svg', { class: 'scene pro-layer', viewBox: '0 0 1920 1080', 'aria-hidden': 'true' }); slide.insertBefore(svg, slide.firstChild); }
    const g = el('g', { class: 'pro', 'aria-hidden': 'true' });
    svg.insertBefore(g, svg.firstChild);
    return g;
  };

  /* ---------- degradados compartidos ---------- */
  const defsSvg = el('svg', { width: 0, height: 0, style: 'position:absolute', 'aria-hidden': 'true' });
  document.body.appendChild(defsSvg);
  const defs = el('defs', {}, defsSvg);
  const grad = (id, stops, a = { x1: 0, y1: 0, x2: 0, y2: 1 }) => {
    const g = el('linearGradient', { id, ...a }, defs);
    stops.forEach(([o, c, op = 1]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': op }, g));
  };
  // lámina de hielo: más clara arriba, casi transparente abajo
  grad('pro-pane', [[0, '#eef0ff', 0.22], [0.45, '#a58bff', 0.08], [1, '#8fe3ff', 0.03]]);
  grad('pro-pane-hot', [[0, '#ffe1e7', 0.26], [0.45, '#ff4d6d', 0.14], [1, '#ff4d6d', 0.04]]);
  // corte de luz: del mantenimiento (violeta) al peligro (carmesí)
  grad('pro-cut', [[0, '#5b3fd6', 0], [0.08, '#a58bff'], [0.5, '#8fe3ff'], [0.88, '#ff4d6d'], [1, '#ff4d6d', 0]], { x1: 0, y1: 0, x2: 1, y2: 0 });
  grad('pro-wedge', [[0, '#a58bff', 0.05], [0.6, '#c9b8ff', 0.16], [0.85, '#ff4d6d', 0.3], [1, '#ff4d6d', 0.5]], { x1: 0, y1: 0, x2: 1, y2: 0 });
  grad('pro-shard', [[0, '#eef0ff', 0.55], [0.5, '#a58bff', 0.14], [1, '#a58bff', 0]]);
  grad('pro-crystal', [[0, '#ff4d6d', 0.16], [1, '#ff4d6d', 0.02]]);

  /* ---------- 02 · Ruta: un corte de luz y una esquirla de hielo por paso ---------- */
  {
    const g = under('s02'), R = G.route;
    if (g) {
      el('path', { class: 'pro-cut-halo', d: `M${R.x0} ${R.y}H${R.x1}` }, g);
      el('path', { class: 'pro-cut', d: `M${R.x0} ${R.y}H${R.x1}` }, g);
      // cada número nace de una esquirla de hielo clavada en el corte
      R.xs.forEach((x, i) => {
        const h = 250 + (i % 2 ? 30 : 0), w = 46;
        el('path', { class: 'pro-shard', d: `M${x + 6} ${R.y - h}L${x + w} ${R.y - 40}L${x} ${R.y - 4}L${x - w} ${R.y - 52}Z`, style: `--d:${300 + i * 140}ms` }, g);
        el('path', { class: 'pro-shard-facet', d: `M${x + 6} ${R.y - h}L${x} ${R.y - 4}`, style: `--d:${300 + i * 140}ms` }, g);
      });
    }
  }

  /* ---------- 05 · Barreras: cada una es una lámina de hielo que el riesgo debe atravesar ---------- */
  {
    const g = under('s05'), B = G.gates;
    if (g) B.xs.forEach((x, i) => {
      const w = 30, k = 16;
      const pts = `${x - w},${B.y0 - 8 + k} ${x + w},${B.y0 - 8} ${x + w},${B.y1 + 8 - k} ${x - w},${B.y1 + 8}`;
      const p = el('g', { class: `pro-pane${i === 2 ? ' hot' : ''}`, style: `--d:${250 + i * 110}ms` }, g);
      el('polygon', { class: 'pp-body', points: pts }, p);
      el('path', { class: 'pp-edge', d: `M${x - w} ${B.y0 - 8 + k}L${x + w} ${B.y0 - 8}` }, p);
      el('path', { class: 'pp-facet', d: `M${x - w} ${B.y0 + 60}L${x + w} ${B.y0 + 20}M${x - w} ${B.y1 - 30}L${x + w} ${B.y1 - 70}` }, p);
    });
  }

  /* ---------- 06 · Tiempo: la energía se ensancha a medida que el despeje tarda ---------- */
  {
    const g = under('s06'), C = G.clear;
    if (g) {
      // el ancho crece con el tiempo de cada punto (escala logarítmica, como el eje)
      const T = [8, 25, 50, 83, 415], hw = t => 3 + Math.log(t / 6) * 9.5;
      const top = C.xs.map((x, i) => [x, C.y - hw(T[i])]), bot = C.xs.map((x, i) => [x, C.y + hw(T[i])]).reverse();
      const d = `M${C.x0} ${C.y}` + top.map(([x, y]) => `L${x} ${y}`).join('') + `L${C.x1} ${C.y - hw(500)}L${C.x1} ${C.y + hw(500)}` + bot.map(([x, y]) => `L${x} ${y}`).join('') + 'Z';
      el('path', { class: 'pro-wedge', d }, g);
      el('path', { class: 'pro-cut', d: `M${C.x0} ${C.y}H${C.x1}` }, g);
    }
  }

  /* ---------- 08 · Cadena: una fisura que nace en el mantenimiento y se propaga hasta la consecuencia ---------- */
  {
    const g = under('s08'), C = G.chain;
    if (g) {
      let d = `M${C.xs[0] - 120} ${C.y}`;
      C.xs.forEach((x, i) => { if (i) { const m = (C.xs[i - 1] + x) / 2; d += `L${m - 30} ${C.y - 7}L${m} ${C.y + 6}L${m + 30} ${C.y - 4}L${x} ${C.y}`; } });
      d += `L${C.xs[C.xs.length - 1] + 120} ${C.y}`;
      el('path', { class: 'pro-cut-halo', d }, g);
      el('path', { class: 'pro-fissure', d, pathLength: 1 }, g);
      C.xs.forEach((x, i) => el('path', { class: `pro-node${i < 2 ? ' m' : i === 6 ? ' e' : ''}`, d: `M${x} ${C.y - 22}L${x + 14} ${C.y}L${x} ${C.y + 22}L${x - 14} ${C.y}Z`, style: `--d:${400 + i * 120}ms` }, g));
    }
  }

  /* ---------- 14 · Triángulo del fuego: un cristal facetado ---------- */
  {
    const g = under('s14'), T = G.tri;
    if (g) {
      const c = [(T.o[0] + T.h[0] + T.ig[0]) / 3, (T.o[1] + T.h[1] + T.ig[1]) / 3];
      el('polygon', { class: 'pro-crystal', points: [T.o, T.h, T.ig].map(p => p.join(',')).join(' ') }, g);
      el('path', { class: 'pro-facet', d: [T.o, T.h, T.ig].map(p => `M${c[0]} ${c[1]}L${p[0]} ${p[1]}`).join('') }, g);
      const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const m = [mid(T.o, T.h), mid(T.h, T.ig), mid(T.ig, T.o)];
      el('polygon', { class: 'pro-facet-in', points: m.map(p => p.join(',')).join(' ') }, g);
    }
  }
})();

/* =========================================================
   Mundo abisal: cada slide vive dentro de una caverna de cristal
   - tres planos de profundidad (lejano, medio, cercano) de formaciones de hielo
   - haces de luz que caen desde arriba y respiran
   - un suelo helado con su reflejo que ancla el contenido
   - parallax suave con el puntero
   El color lo da el bloque (--acc). Nada tapa el área de contenido.
   ========================================================= */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  // azar reproducible por slide: cada caverna es distinta pero siempre la misma
  const rng = seed => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const f = n => n.toFixed(1);

  /* un cristal: prisma inclinado con cara iluminada, cara en sombra y arista brillante */
  function crystal(g, x, base, w, h, tilt, up = true) {
    const s = up ? -1 : 1;
    const tx = x + tilt * h, ty = base + s * h;                 // punta
    const sh = base + s * h * 0.78;                              // donde empieza la punta
    const L = [x - w, base], M = [x + w * 0.15, base], R = [x + w, base];
    const Lt = [x - w + tilt * h * 0.78, sh], Mt = [x + w * 0.15 + tilt * h * 0.78, sh], Rt = [x + w + tilt * h * 0.78, sh];
    const P = a => a.map(p => `${f(p[0])},${f(p[1])}`).join(' ');
    el('polygon', { class: 'cx-lit', points: P([L, M, Mt, [tx, ty], Lt]) }, g);
    el('polygon', { class: 'cx-dark', points: P([M, R, Rt, [tx, ty], Mt]) }, g);
    el('path', { class: 'cx-edge', d: `M${f(M[0])} ${f(M[1])}L${f(Mt[0])} ${f(Mt[1])}L${f(tx)} ${f(ty)}` }, g);
  }
  /* un racimo de cristales alrededor de x */
  function cluster(g, r, x, base, scale, up = true, n = 5) {
    for (let i = 0; i < n; i++) {
      const dx = (r() - 0.5) * 160 * scale, w = (14 + r() * 26) * scale, h = (120 + r() * 360) * scale * (i === 0 ? 1.35 : 1);
      crystal(g, x + dx, base, w, h, (r() - 0.5) * 0.5, up);
    }
  }

  function world(slide, idx) {
    const r = rng(idx * 7919 + 13);
    const svg = el('svg', { class: 'abyss', viewBox: '0 0 1920 1080', preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': 'true' });
    // haces de luz desde la bóveda
    const shafts = el('g', { class: 'ab-shafts' }, svg);
    for (let i = 0; i < 3; i++) {
      const x = 380 + i * 560 + (r() - 0.5) * 240, w = 70 + r() * 90, k = (r() - 0.5) * 260;
      el('polygon', { class: 'ab-shaft', points: `${f(x - w * 0.3)},-40 ${f(x + w * 0.3)},-40 ${f(x + k + w * 1.6)},1080 ${f(x + k - w * 1.6)},1080`, style: `--i:${i}` }, shafts);
    }
    // plano lejano: formaciones bajas y estalactitas, apenas visibles
    const far = el('g', { class: 'ab-far ab-par', style: '--z:6' }, svg);
    for (let x = 60; x < 1920; x += 150 + r() * 120) cluster(far, r, x, 1080, 0.55, true, 3);
    for (let x = 120; x < 1920; x += 220 + r() * 200) cluster(far, r, x, 0, 0.4, false, 2);
    // plano medio: dos macizos a los costados
    const mid = el('g', { class: 'ab-mid ab-par', style: '--z:14' }, svg);
    cluster(mid, r, 90 + r() * 60, 1080, 1, true, 6);
    cluster(mid, r, 1830 - r() * 60, 1080, 1.1, true, 6);
    cluster(mid, r, 1700 + r() * 120, 0, 0.7, false, 3);
    // suelo helado: horizonte y reflejo que anclan el contenido
    const floor = el('g', { class: 'ab-floor' }, svg);
    el('ellipse', { class: 'ab-pool', cx: 960, cy: 1010, rx: 900, ry: 120 }, floor);
    el('path', { class: 'ab-horizon', d: 'M0 1000Q960 970 1920 1000' }, floor);
    // plano cercano: esquirlas grandes que enmarcan desde las esquinas inferiores (fuera del área de texto)
    const near = el('g', { class: 'ab-near ab-par', style: '--z:28' }, svg);
    crystal(near, -10, 1100, 70, 560, 0.18);
    crystal(near, 70, 1100, 40, 330, 0.32);
    crystal(near, 1935, 1100, 80, 640, -0.16);
    crystal(near, 1850, 1100, 44, 360, -0.3);
    slide.insertBefore(svg, slide.firstChild);
  }

  const slides = [...document.querySelectorAll('.slide')].filter(s => !s.classList.contains('hero') && !s.classList.contains('recon'));
  slides.forEach((s, i) => world(s, i + 2));

  // parallax con el puntero (solo la slide visible, solo transformaciones)
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let px = 0, py = 0, raf = 0;
    addEventListener('pointermove', e => {
      px = (e.clientX / innerWidth) * 2 - 1; py = (e.clientY / innerHeight) * 2 - 1;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const a = document.querySelector('.slide.is-active .abyss');
        if (a) { a.style.setProperty('--px', px.toFixed(3)); a.style.setProperty('--py', py.toFixed(3)); }
      });
    });
  }
})();
