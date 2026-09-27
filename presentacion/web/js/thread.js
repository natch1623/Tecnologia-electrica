/* =========================================================
   Hilo conductor · una sola línea que se transforma de slide en slide
   GEO: geometría compartida (coordenadas del escenario 1920 × 1080)
   ========================================================= */
(() => {
  const G = {
    hero: { cx: 1440, cy: 540, r: 400 },
    route: { y: 640, x0: 150, x1: 1770, xs: [250, 605, 960, 1315, 1670] },
    def: { x: 960, y0: 650, y1: 930 },
    ring: { cx: 700, cy: 640, r: 240 },
    gates: { y: 470, x0: 150, x1: 1370, y0: 330, y1: 610, xs: [230, 480, 730, 980, 1230] },
    clear: { y: 660, x0: 150, x1: 1770, xs: [215, 555, 895, 1235, 1608] },
    // E = 32·t (cal/cm², t en s) → 1,6 a 0,05 s · 16 a 0,5 s
    energy: { ox: 1010, oy: 900, sx: 1380, sy: 36, tmax: 0.55, k: 32 },
    chain: { y: 480, xs: [270, 500, 730, 960, 1190, 1420, 1650] },
    horizon: { y: 830 },
    waves: { ac: { x0: 150, x1: 870, cy: 560, amp: 140, period: 240 }, dc: { x0: 1050, x1: 1770, y: 440, base: 560 } },
    front: { cx: 220, cy: 620, k: 240, a: 34 },
    rack: {
      n: 13, x0: 540, step: 82, w: 58, h: 84, upY: 330, loY: 560,
      upper: ['125', '124', '…', '120', '119', '118', '117', '…', '67', '66', '65', '64', '63'],
      lower: ['1', '2', '3', '4', '5', '…', '56', '57', '58', '59', '60', '61', '62'],
      railTop: 300, shelfUp: 422, shelfLo: 652, upL: 505, upR: 1620, cableX: 1665,
      contact: [1624, 490],
      brk: { x: 180, y: 400, w: 220, h: 100 }, ups: { x: 180, y: 700, w: 220, h: 100 }
    },
    cell: { x0: 240, x1: 680, top: 380, bot: 900, level: 520, cap: [430, 490, 330, 380] },
    tri: { o: [540, 250], h: [200, 850], ig: [880, 850] },
    tl: { y: 600, x0: 150, x1: 1770, brk: 1150 },
    bar: { y: 480, x0: 150, x1: 1770, xs: [300, 465, 630, 795, 960, 1125, 1290, 1455] },
    pyr: { top: 330, apex: 960, x0: 150, x1: 1030 },
    timer: { cx: 1650, cy: 230, r: 110 },
    close: { y: 870 }
  };
  const R = G.rack;
  R.cx = i => R.x0 + i * R.step + R.w / 2;
  R.cy = up => (up ? R.upY : R.loY) + R.h / 2;
  // Minutos desde 01:30 → x, con lupa ×6 a partir de 02:35
  G.tl.x = m => (m <= 65 ? 150 + m * (950 / 65) : 1180 + (m - 65) * (590 / 7));
  G.energy.pt = t => [G.energy.ox + t * G.energy.sx, G.energy.oy - G.energy.k * t * G.energy.sy];
  G.energy.yE = e => G.energy.oy - e * G.energy.sy;
  window.GEO = G;

  /* ---------- Primitivas ---------- */
  const line = (x0, y0, x1, y1) => [[x0, y0], [x1, y1]];
  const arc = (cx, cy, r, a0, a1, n = 120) => {
    const p = [];
    for (let i = 0; i <= n; i++) {
      const a = ((a0 + (a1 - a0) * i / n) * Math.PI) / 180;
      p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return p;
  };
  const sine = (x0, x1, cy, amp, period) => {
    const p = [];
    for (let x = x0; x <= x1 + 0.1; x += 3) p.push([x, cy - amp * Math.sin(((x - x0) / period) * Math.PI * 2)]);
    return p;
  };

  const rackString = [
    [400, 470], [470, 470], [470, R.cy(false)], [R.cx(12) + R.w / 2, R.cy(false)],
    [R.cableX, R.cy(false)], [R.cableX, 520], [1630, 490], [R.cableX, 460], [R.cableX, R.cy(true)],
    [R.cx(12) + R.w / 2, R.cy(true)], [R.x0, R.cy(true)], [470, R.cy(true)], [470, 430], [400, 430]
  ];

  const tl = G.tl;
  const xs = tl.x(68);
  const tlFlat = [[tl.x0, tl.y], [tl.x1, tl.y]];
  const tlSpike = [[tl.x0, tl.y], [xs - 14, tl.y], [xs - 6, tl.y - 60], [xs - 1, tl.y + 40], [xs + 4, tl.y - 150],
    [xs + 9, tl.y + 26], [xs + 15, tl.y - 70], [xs + 22, tl.y], [tl.x1, tl.y]];

  const T = G.tri;
  // Punto a distancia g de a, hacia b: el triángulo se abre alrededor del vértice que rompe cada barrera
  const toward = (a, b, g) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [a[0] + (b[0] - a[0]) * g / L, a[1] + (b[1] - a[1]) * g / L]; };
  const gap = 112;
  const P = G.pyr;
  const pyrMid = (P.x0 + P.x1) / 2;

  const SHAPES = {
    hero:    { subs: [arc(G.hero.cx, G.hero.cy, G.hero.r, -90, 270)], color: '#a58bff', w: 1.4, o: 0.55, spark: 0.035 },
    route:   { subs: [line(150, 640, 1770, 640)], color: 'url(#thg-route)', w: 2, o: 0.95, spark: 0.08 },
    def:     { subs: [line(G.def.x, G.def.y0, G.def.x, G.def.y1)], color: '#a58bff', w: 2, o: 0.8 },
    ring:    { subs: [arc(G.ring.cx, G.ring.cy, G.ring.r, -60, 300)], color: '#a58bff', w: 2, o: 0.9, spark: 0.05 },
    gates:   { subs: [line(150, G.gates.y, G.gates.x1, G.gates.y)], color: '#c9b8ff', w: 2, o: 0.85, spark: 0.09 },
    clear:   { subs: [line(150, G.clear.y, 1770, G.clear.y)], color: 'url(#thg-clear)', w: 2.5, o: 1, spark: 0.1 },
    energy:  { subs: [[[G.energy.ox, G.energy.oy], G.energy.pt(G.energy.tmax)]], color: 'url(#thg-energy)', w: 3, o: 1 },
    chain:   { subs: [line(150, G.chain.y, 1770, G.chain.y)], color: '#c9b8ff', w: 2, o: 0.8, spark: 0.1 },
    horizon: { subs: [line(150, G.horizon.y, 1770, G.horizon.y)], color: '#8fe3ff', w: 1.2, o: 0.45 },
    waves:   { subs: [sine(150, 870, 560, 140, 240), line(1050, 440, 1770, 440)], color: '#8fe3ff', w: 3, o: 1 },
    front:   { subs: [arc(G.front.cx, G.front.cy, 1.8 * G.front.k, -G.front.a, G.front.a)], color: '#c9b8ff', w: 2.5, o: 1 },
    string:  { subs: [rackString], color: '#8fe3ff', w: 2.5, o: 0.9, spark: 0.06 },
    gas:     { subs: [[[460, 330], [460, 230], [476, 170], [530, 142], [600, 136], [880, 136]]], color: '#8fe3ff', w: 2, o: 0.7, spark: 0.12 },
    tri:     { subs: [[T.o, T.h, T.ig, T.o]], color: '#ff4d6d', w: 3, o: 1, spark: 0.06 },
    triH:    { subs: [[T.o, toward(T.h, T.o, gap)], [toward(T.h, T.ig, gap), T.ig, T.o]], color: '#ff8aa0', w: 3, o: 1, spark: 0.05 },
    triHI:   { subs: [[T.o, toward(T.h, T.o, gap)], [toward(T.h, T.ig, gap), toward(T.ig, T.h, gap)], [toward(T.ig, T.o, gap), T.o]], color: '#5ef0c8', w: 2.5, o: 0.9 },
    tl:      { subs: [tlFlat], color: '#c9b8ff', w: 2, o: 0.9 },
    tlSpike: { subs: [tlSpike], color: '#ff4d6d', w: 2.5, o: 1 },
    vector:  { subs: [line(150, G.bar.y, 1770, G.bar.y)], color: '#ff4d6d', w: 2, o: 0.3 },
    pyr:     { subs: [[[P.x0, P.top], [P.x1, P.top], [pyrMid, P.apex], [P.x0, P.top]]], color: '#5ef0c8', w: 2, o: 0.9 },
    timer:   { subs: [arc(G.timer.cx, G.timer.cy, 136, -90, 270)], color: '#8fe3ff', w: 1.2, o: 0.5, spark: 0.08 },
    close:   { subs: [line(150, G.close.y, 1770, G.close.y)], color: 'url(#thg-close)', w: 1.5, o: 0.7 },
    rest:    { subs: [line(150, 112, 420, 112)], color: '#a58bff', w: 1, o: 0.35 }
  };

  /* ---------- Motor ---------- */
  const N = 240;
  const svg = document.getElementById('thread');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); svg.appendChild(n); return n; };
  const glow = mk('path', { class: 'th-glow' });
  const path = mk('path', { class: 'th-path' });
  // La chispa y su estela van en otra capa: moverlas cada cuadro no obliga a repintar el resplandor
  const svgSpark = document.getElementById('thread-spark');
  const mkS = (tag, attrs) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); svgSpark.appendChild(n); return n; };
  const tail = mkS('path', { class: 'th-tail' });
  const spark = mkS('circle', { class: 'th-spark', r: 4 });

  const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

  function resample(subs) {
    const lens = subs.map(s => { let L = 0; for (let i = 1; i < s.length; i++) L += dist(s[i - 1], s[i]); return L; });
    const tot = lens.reduce((a, b) => a + b, 0) || 1;
    const counts = lens.map(L => Math.max(2, Math.round((N * L) / tot)));
    counts[lens.indexOf(Math.max(...lens))] += N - counts.reduce((a, b) => a + b, 0);
    const pts = new Float32Array(N * 2);
    const brk = new Uint8Array(N);
    let k = 0;
    subs.forEach((s, si) => {
      const n = counts[si];
      const L = lens[si];
      let seg = 1, acc = 0, segLen = dist(s[0], s[1]);
      for (let j = 0; j < n; j++) {
        const target = (L * j) / (n - 1);
        while (seg < s.length - 1 && acc + segLen < target) { acc += segLen; seg++; segLen = dist(s[seg - 1], s[seg]); }
        const u = segLen ? Math.min(1, (target - acc) / segLen) : 0;
        pts[2 * k] = s[seg - 1][0] + (s[seg][0] - s[seg - 1][0]) * u;
        pts[2 * k + 1] = s[seg - 1][1] + (s[seg][1] - s[seg - 1][1]) * u;
        if (j === 0 && si > 0) brk[k] = 1;
        k++;
      }
    });
    return { pts, brk };
  }

  const cache = {};
  const shapeOf = key => (cache[key] ||= resample(SHAPES[key].subs));

  let cur = resample(SHAPES.rest.subs);
  let from = cur.pts.slice();
  let target = cur;
  let t0 = 0, dur = 1, morphing = false;
  let sparkSpeed = 0, sparkPos = 0;

  function d(pts, brk, i0 = 0, i1 = N) {
    let s = '';
    for (let i = i0; i < i1; i++) s += (i === i0 || brk[i] ? 'M' : 'L') + pts[2 * i].toFixed(1) + ' ' + pts[2 * i + 1].toFixed(1);
    return s;
  }
  function paint() {
    const s = d(cur.pts, cur.brk);
    path.setAttribute('d', s);
    glow.setAttribute('d', s);
  }

  function style({ color, w, o, spark: sp } = {}) {
    if (color != null) { path.style.stroke = color; glow.style.stroke = color; tail.style.stroke = color; }
    if (w != null) { path.style.strokeWidth = w; glow.style.strokeWidth = w * 5; }
    if (o != null) { svg.style.opacity = o; svgSpark.style.opacity = o; }
    if (sp != null) sparkSpeed = sp;
    spark.style.opacity = sparkSpeed > 0 ? 1 : 0;
    tail.style.opacity = sparkSpeed > 0 ? 1 : 0;
  }

  function to(key, opts = {}) {
    const def = typeof key === 'string' ? SHAPES[key] || SHAPES.rest : key;
    target = typeof key === 'string' ? shapeOf(SHAPES[key] ? key : 'rest') : resample(def.subs);
    from = cur.pts.slice();
    cur = { pts: cur.pts, brk: target.brk };
    style({ color: def.color, w: def.w, o: def.o, spark: def.spark || 0 });
    dur = reduced ? 1 : opts.dur || 1300;
    t0 = performance.now();
    morphing = true;
  }

  const ease = x => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
  let lastFrame = 0;
  function frame(now) {
    if (now - lastFrame < 15) { requestAnimationFrame(frame); return; }
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    if (morphing) {
      const p = ease(Math.min(1, (now - t0) / dur));
      for (let i = 0; i < N * 2; i++) cur.pts[i] = from[i] + (target.pts[i] - from[i]) * p;
      paint();
      if (p >= 1) morphing = false;
    }
    if (sparkSpeed > 0 && !reduced) {
      sparkPos = (sparkPos + sparkSpeed * dt) % 1;
      const i = Math.floor(sparkPos * (N - 1));
      spark.setAttribute('cx', cur.pts[2 * i]);
      spark.setAttribute('cy', cur.pts[2 * i + 1]);
      let i0 = Math.max(0, i - 16);
      for (let j = i; j > i0; j--) if (cur.brk[j]) { i0 = j; break; }
      tail.setAttribute('d', i - i0 > 1 ? d(cur.pts, cur.brk, i0, i + 1) : '');
    }
    requestAnimationFrame(frame);
  }
  paint();
  requestAnimationFrame(frame);

  window.Thread = { to, style, shapes: SHAPES };
})();
