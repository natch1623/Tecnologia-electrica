/* El Capacitor · TEM I — motor de la presentación (demo: slides 01–03). */
(() => {
  'use strict';

  const W = 1920, H = 1080;
  const stage = document.getElementById('stage');
  const slides = [...document.querySelectorAll('.slide')];
  const plateTop = document.getElementById('plate-top');
  const plateBot = document.getElementById('plate-bot');
  const fx = document.getElementById('fx');
  const fxc = fx.getContext('2d');
  const gauss = document.getElementById('gauss');
  const hudN = document.getElementById('hud-n');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOTAL = 9;
  const SVGNS = 'http://www.w3.org/2000/svg';

  const ICE = '143,227,255', ABYSS = '168,139,255', STAR = '242,244,250';
  const EASE_IO = 'cubic-bezier(.65,0,.35,1)';
  const EASE_OUT = 'cubic-bezier(.16,1,.3,1)';

  const ease = {
    io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    out: t => 1 - Math.pow(1 - t, 3),
    in: t => t * t * t,
    inOutQuad: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* ---------- Escala del escenario ---------- */
  let scale = 1;
  function fit() {
    scale = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `translate(-50%,-50%) scale(${scale})`;
  }
  addEventListener('resize', fit);
  fit();

  /* ---------- Cielo estelar ---------- */
  const sc = document.getElementById('stars').getContext('2d');
  const stars = Array.from({ length: 460 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() < .08 ? rand(1.1, 1.8) : rand(.35, .95),
    a: rand(.15, .75), tw: Math.random() < .07, ph: rand(0, Math.PI * 2), sp: rand(.4, 1.1),
  }));
  function drawStars(time) {
    sc.clearRect(0, 0, W, H);
    for (const s of stars) {
      const a = s.tw && !reduced ? s.a * (.55 + .45 * Math.sin(time / 1000 * s.sp + s.ph)) : s.a;
      sc.fillStyle = `rgba(${STAR},${a})`;
      sc.beginPath(); sc.arc(s.x, s.y, s.r, 0, Math.PI * 2); sc.fill();
    }
  }
  let lastStar = 0;
  function starLoop(t) {
    if (t - lastStar > 60) { drawStars(t); lastStar = t; }
    if (!document.hidden) requestAnimationFrame(starLoop);
  }
  drawStars(0);
  if (!reduced) requestAnimationFrame(starLoop);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduced) requestAnimationFrame(starLoop); });

  /* ---------- Placas persistentes ---------- */
  const PLATES = {
    s01: { x: 160, w: 1600, top: 128, bot: 952, op: 1 },
    s02: { x: 180, w: 680, top: 300, bot: 780, op: 1 },
    s03: { x: 160, w: 1600, top: 128, bot: 952, op: .5 },
  };
  let plateNow = { x: 960, w: 0, top: 128, bot: 952, op: 1 };
  const plateCSS = (p, y) => ({ transform: `translate3d(${p.x}px,${y - 2}px,0)`, width: `${p.w}px`, opacity: p.op });
  function applyPlates(p) {
    Object.assign(plateTop.style, plateCSS(p, p.top));
    Object.assign(plateBot.style, plateCSS(p, p.bot));
    plateNow = { ...p };
  }
  function movePlates(target, duration = 1400, delay = 0, easing = EASE_IO) {
    const from = { ...plateNow };
    if (reduced) duration = 1;
    const a1 = plateTop.animate([plateCSS(from, from.top), plateCSS(target, target.top)], { duration, delay, easing, fill: 'forwards' });
    const a2 = plateBot.animate([plateCSS(from, from.bot), plateCSS(target, target.bot)], { duration, delay, easing, fill: 'forwards' });
    return Promise.all([a1.finished, a2.finished]).then(() => {
      applyPlates(target); a1.cancel(); a2.cancel();
    });
  }
  applyPlates(plateNow);

  /* ---------- Slide 02: cargas y líneas de campo ---------- */
  const s02 = document.querySelector('.s02');
  const gTop = s02.querySelector('.charges-top');
  const gBot = s02.querySelector('.charges-bot');
  const gLines = s02.querySelector('.field-lines');
  const gArrows = s02.querySelector('.field-arrows');
  const P2 = PLATES.s02;
  const CH_TOP_Y = P2.top + 9, CH_BOT_Y = P2.bot - 9;
  for (let i = 0; i <= 84; i++) {
    const x = P2.x + 14 + i * ((P2.w - 28) / 84);
    for (const [g, y] of [[gTop, CH_TOP_Y], [gBot, CH_BOT_Y]]) {
      const c = document.createElementNS(SVGNS, 'circle');
      c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y); c.setAttribute('r', 2.6);
      c.dataset.base = i % 2 === 0 ? '1' : '0';
      g.appendChild(c);
    }
  }
  const NL = 12;
  for (let i = 0; i < NL; i++) {
    const x = P2.x + 40 + i * ((P2.w - 80) / (NL - 1));
    const l = document.createElementNS(SVGNS, 'line');
    l.setAttribute('x1', x.toFixed(1)); l.setAttribute('x2', x.toFixed(1));
    l.setAttribute('y1', P2.top + 20); l.setAttribute('y2', P2.bot - 24);
    l.dataset.base = i % 2 === 0 ? '1' : '0';
    gLines.appendChild(l);
    const ym = (P2.top + P2.bot) / 2 + 14;
    const ah = document.createElementNS(SVGNS, 'path');
    ah.setAttribute('class', 'fl-arrow');
    ah.setAttribute('d', `M${(x - 9).toFixed(1)} ${ym - 14} L${x.toFixed(1)} ${ym + 4} L${(x + 9).toFixed(1)} ${ym - 14} Z`);
    ah.dataset.base = l.dataset.base;
    gArrows.appendChild(ah);
  }
  const roQ = document.getElementById('ro-q'), roV = document.getElementById('ro-v'), roC = document.getElementById('ro-c');
  const qTop = document.getElementById('q-top'), qBot = document.getElementById('q-bot'), vLab = document.getElementById('v-label');

  function setText(el, txt) {
    if (el.textContent === txt) return;
    el.textContent = txt; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }
  function s02Render(state, instant = false) {
    s02.dataset.state = state;
    const dbl = state >= 1;
    [...gTop.children, ...gBot.children].forEach(c => c.classList.toggle('on', dbl || c.dataset.base === '1'));
    let k = 0;
    [...gLines.children].forEach(l => {
      const on = dbl || l.dataset.base === '1';
      if (on && !l.classList.contains('on')) l.style.setProperty('--d', instant ? '0ms' : `${(k++) * 70}ms`);
      l.classList.toggle('on', on);
    });
    [...gArrows.children].forEach((a, i) => {
      const l = gLines.children[i];
      a.style.setProperty('--d', instant ? '0ms' : `calc(${l.style.getPropertyValue('--d') || '0ms'} + 650ms)`);
      a.classList.toggle('on', l.classList.contains('on'));
    });
    if (instant) gLines.querySelectorAll('line').forEach(l => l.style.transition = 'none');
    else gLines.querySelectorAll('line').forEach(l => l.style.transition = '');
    setText(roQ, dbl ? '2Q' : 'Q'); setText(roV, dbl ? '2V' : 'V');
    qTop.textContent = dbl ? '+2Q' : '+Q'; qBot.textContent = dbl ? '−2Q' : '−Q';
    vLab.textContent = dbl ? '2V' : 'V';
    roC.parentElement.classList.toggle('hold', dbl);
    if (dbl) { roC.classList.remove('bump'); void roC.offsetWidth; roC.classList.add('bump'); }
  }
  function s02Reset() {
    s02.classList.remove('landed');
    [...gTop.children, ...gBot.children, ...gLines.children, ...gArrows.children].forEach(e => { e.classList.remove('on'); e.style.transition = 'none'; });
    void s02.offsetWidth;
    gLines.querySelectorAll('line').forEach(l => l.style.transition = '');
    [...gTop.children, ...gBot.children].forEach(c => c.style.transition = '');
    s02.dataset.state = 0;
    roQ.textContent = 'Q'; roV.textContent = 'V'; qTop.textContent = '+Q'; qBot.textContent = '−Q'; vLab.textContent = 'V';
    roC.parentElement.classList.remove('hold');
  }

  /* ---------- Estado de la navegación ---------- */
  let idx = 0, state = 0, busy = false;
  const byId = id => slides.find(s => s.dataset.id === id);
  const statesOf = s => +(s.dataset.states || 0);
  function hud() { hudN.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`; }

  function activate(el) { el.classList.remove('is-entering', 'is-leaving'); el.classList.add('is-active'); }
  function deactivate(el) { el.classList.remove('is-active', 'is-entering', 'is-leaving', 'quick'); el.style.clipPath = ''; el.style.opacity = ''; }

  /* ---------- Partículas ---------- */
  function sampleTitle() {
    const title = document.getElementById('s01-title');
    const cs = getComputedStyle(title);
    const off = document.createElement('canvas'); off.width = W; off.height = H;
    const o = off.getContext('2d');
    o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ('letterSpacing' in o) o.letterSpacing = cs.letterSpacing;
    o.textAlign = 'center'; o.textBaseline = 'alphabetic'; o.fillStyle = '#fff';
    const m = o.measureText(title.textContent);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize);
    const top = title.offsetTop;
    const baseline = top + (lh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
    o.fillText(title.textContent, W / 2, baseline);
    const d = o.getImageData(0, 0, W, H).data;
    const pts = [];
    const step = 3;
    for (let y = top - 20; y < top + lh + 40; y += step)
      for (let x = 0; x < W; x += step)
        if (d[(y * W + x) * 4 + 3] > 120) pts.push([x + rand(-.8, .8), y + rand(-.8, .8)]);
    return pts;
  }

  function buildCharges(pts) {
    let minX = Infinity, maxX = -Infinity;
    for (const [x] of pts) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
    return pts.map(([x, y], i) => {
      const pos = i % 2 === 0;
      const tx = rand(P2.x + 10, P2.x + P2.w - 10);
      const ty = pos ? CH_TOP_Y + rand(-2, 2) : CH_BOT_Y + rand(-2, 2);
      const sweep = rand(-260, 260);
      return {
        x0: x, y0: y, x1: tx, y1: ty,
        cx: lerp(x, tx, .45) + sweep, cy: lerp(y, ty, .25) + rand(-140, 140),
        delay: ((x - minX) / (maxX - minX)) * 380 + rand(0, 140),
        dur: rand(1050, 1250),
        col: pos ? ICE : ABYSS, jx: rand(-1, 1), jy: rand(-1, 1),
      };
    });
  }

  function runParticles(parts, { reverse = false, total, excite = 260 }) {
    return new Promise(resolve => {
      const t0 = performance.now();
      fx.style.opacity = 1;
      function frame(now) {
        const el = now - t0;
        fxc.globalCompositeOperation = 'destination-out';
        fxc.fillStyle = 'rgba(0,0,0,.34)';
        fxc.fillRect(0, 0, W, H);
        fxc.globalCompositeOperation = 'lighter';
        for (const p of parts) {
          let x, y, col, a, r;
          if (!reverse) {
            const ex = clamp(el / excite);
            const t = ease.io(clamp((el - excite - p.delay) / p.dur));
            const u = 1 - t;
            const jit = Math.sin(el / 30 + p.jx * 9) * 1.4 * ex * (1 - t);
            x = u * u * p.x0 + 2 * u * t * p.cx + t * t * p.x1 + jit * p.jx;
            y = u * u * p.y0 + 2 * u * t * p.cy + t * t * p.y1 + jit * p.jy;
            col = t < .15 ? STAR : p.col;
            a = .55 + .45 * ex; r = 1.5 + ex * .4 * (1 - t);
          } else {
            const t = ease.io(clamp((el - p.delay) / p.dur));
            const u = 1 - t;
            x = u * u * p.x1 + 2 * u * t * p.cx + t * t * p.x0;
            y = u * u * p.y1 + 2 * u * t * p.cy + t * t * p.y0;
            col = t > .85 ? STAR : p.col; a = .9; r = 1.6;
          }
          fxc.fillStyle = `rgba(${col},${a})`;
          fxc.fillRect(x - r / 2, y - r / 2, r, r);
        }
        if (el < total) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }
  function fadeFx(ms = 380) {
    const a = fx.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: 'ease-out', fill: 'forwards' });
    return a.finished.then(() => { fxc.clearRect(0, 0, W, H); fx.style.opacity = 0; a.cancel(); });
  }

  /* ---------- Superficie gaussiana ---------- */
  const G_ORIGIN = { x: P2.x + P2.w / 2, y: P2.top };
  function gaussDraw(r, alpha, label) {
    gauss.innerHTML = '';
    if (alpha <= 0) return;
    const g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('opacity', alpha);
    const halo = document.createElementNS(SVGNS, 'circle');
    halo.setAttribute('class', 'ring-halo'); halo.setAttribute('cx', G_ORIGIN.x); halo.setAttribute('cy', G_ORIGIN.y); halo.setAttribute('r', r);
    const ring = document.createElementNS(SVGNS, 'circle');
    ring.setAttribute('class', 'ring'); ring.setAttribute('cx', G_ORIGIN.x); ring.setAttribute('cy', G_ORIGIN.y); ring.setAttribute('r', r);
    ring.setAttribute('stroke-dashoffset', (-r * .35).toFixed(1));
    g.append(halo, ring);
    const n = 28;
    for (let i = 0; i < n; i++) {
      const th = i / n * Math.PI * 2 + r / 900;
      const c = Math.cos(th), s = Math.sin(th);
      const b = r + 14, tip = r + 44;
      const px = -s * 8, py = c * 8;
      const p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('class', 'flux');
      p.setAttribute('d', `M${G_ORIGIN.x + c * b + px} ${G_ORIGIN.y + s * b + py} L${G_ORIGIN.x + c * tip} ${G_ORIGIN.y + s * tip} L${G_ORIGIN.x + c * b - px} ${G_ORIGIN.y + s * b - py} Z`);
      p.setAttribute('opacity', .75);
      g.appendChild(p);
    }
    if (label > 0) {
      const t = document.createElementNS(SVGNS, 'text');
      t.setAttribute('x', G_ORIGIN.x); t.setAttribute('y', G_ORIGIN.y + 250);
      t.setAttribute('text-anchor', 'middle'); t.setAttribute('opacity', label);
      t.textContent = '∮ D · dS = Q';
      g.appendChild(t);
    }
    gauss.appendChild(g);
  }
  function maskOut(el, r) {
    const m = r == null ? '' : `radial-gradient(circle at ${G_ORIGIN.x}px ${G_ORIGIN.y}px, transparent ${r}px, #000 ${r + 1}px)`;
    el.style.webkitMaskImage = m; el.style.maskImage = m;
  }
  function tween(ms, fn) {
    return new Promise(res => {
      const t0 = performance.now();
      (function f(now) {
        const t = clamp((now - t0) / ms);
        fn(t);
        if (t < 1) requestAnimationFrame(f); else res();
      })(t0);
    });
  }

  /* ---------- Transiciones ---------- */
  const T = {};

  // 01 → 02 · Separación de carga: el título se deshace y la carga se separa en las placas.
  T['s01>s02'] = async (from, to) => {
    const pts = sampleTitle();
    const parts = buildCharges(pts);
    s02Reset();
    from.classList.remove('is-active'); from.classList.add('is-leaving');
    from.querySelectorAll('.rv, .s01-field').forEach(e => e.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, fill: 'forwards' }));
    const title = document.getElementById('s01-title');
    title.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' });
    to.classList.add('is-entering');
    movePlates(PLATES.s02, 1500, 300);
    const total = 260 + 520 + 1250;
    const run = runParticles(parts, { total });
    await wait(total - 120);
    activate(to);
    to.classList.add('landed');
    s02Render(0);
    await run;
    await fadeFx(420);
    deactivate(from);
    from.getAnimations({ subtree: true }).forEach(a => a.cancel());
  };

  // 02 → 01 · Recombinación: la carga vuelve a formar el título.
  T['s02>s01'] = async (from, to) => {
    const pts = sampleTitle();
    const parts = buildCharges(pts).map(p => ({ ...p, delay: rand(0, 380) }));
    [...gTop.children, ...gBot.children, ...gLines.children, ...gArrows.children].forEach(e => e.classList.remove('on'));
    from.querySelectorAll('.s02-text, .v-bracket, .plate-label, .gap-label').forEach(e => e.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }));
    movePlates(PLATES.s01, 1500, 150);
    const total = 380 + 1250;
    await runParticles(parts, { reverse: true, total });
    to.classList.add('quick');
    activate(to);
    await fadeFx(600);
    from.getAnimations({ subtree: true }).forEach(a => a.cancel());
    deactivate(from); s02Reset();
    to.classList.remove('quick');
  };

  // 02 → 03 · Superficie gaussiana: encierra la carga, se expande y revela el método.
  T['s02>s03'] = async (from, to) => {
    from.classList.remove('is-active'); from.classList.add('is-leaving');
    const R0 = 400, R1 = 2450;
    from.querySelectorAll('.field-lines, .field-arrows, .v-bracket, .gap-label').forEach(e => e.animate([{ opacity: 1 }, { opacity: .18 }], { duration: 500, fill: 'forwards' }));
    await tween(520, t => gaussDraw(lerp(0, R0, ease.out(t)), ease.out(t), ease.out(t)));
    await wait(260);
    to.classList.add('is-entering');
    to.style.clipPath = `circle(${R0}px at ${G_ORIGIN.x}px ${G_ORIGIN.y}px)`;
    activate(to);
    to.style.clipPath = `circle(${R0}px at ${G_ORIGIN.x}px ${G_ORIGIN.y}px)`;
    movePlates(PLATES.s03, 1300, 120);
    await tween(1350, t => {
      const r = lerp(R0, R1, ease.in(t) * .6 + ease.io(t) * .4);
      to.style.clipPath = `circle(${r}px at ${G_ORIGIN.x}px ${G_ORIGIN.y}px)`;
      maskOut(from, r);
      gaussDraw(r, 1 - clamp((t - .7) / .3), 1 - clamp(t / .25));
    });
    gauss.innerHTML = '';
    to.style.clipPath = '';
    maskOut(from, null);
    from.getAnimations({ subtree: true }).forEach(a => a.cancel());
    deactivate(from); s02Reset();
  };

  // 03 → 02 · La superficie se contrae de vuelta sobre la carga.
  T['s03>s02'] = async (from, to) => {
    const R0 = 400, R1 = 2450;
    s02Reset();
    to.classList.add('is-entering', 'landed');
    activate(to); to.classList.add('landed');
    s02Render(0, true);
    from.classList.remove('is-active'); from.classList.add('is-leaving');
    from.style.zIndex = 13;
    movePlates(PLATES.s02, 1200, 0);
    await tween(1250, t => {
      const r = lerp(R1, R0, ease.io(t));
      from.style.clipPath = `circle(${r}px at ${G_ORIGIN.x}px ${G_ORIGIN.y}px)`;
      maskOut(to, r);
      gaussDraw(r, clamp(t / .3), clamp((t - .7) / .3));
    });
    from.style.zIndex = '';
    maskOut(to, null);
    deactivate(from);
    await tween(420, t => gaussDraw(lerp(R0, R0 * .85, t), 1 - t, 1 - t));
    gauss.innerHTML = '';
  };

  /* =====================================================================
     Escenas 04–09, controladores de estado y navegación genérica
     ===================================================================== */
  function svg(tag, attrs = {}, parent) {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const nf1 = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const nf2 = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtC = v => v >= 100 ? String(Math.round(v)) : nf1.format(v);
  const noTr = (el, fn) => { el.classList.add('no-tr'); fn(); void el.offsetWidth; el.classList.remove('no-tr'); };
  const fadeOut = (els, ms = 400, delay = 0) => els.forEach(e => e.animate([{ opacity: getComputedStyle(e).opacity }, { opacity: 0 }], { duration: ms, delay, fill: 'forwards', easing: 'ease-out' }));
  const cancelAnims = el => el.getAnimations({ subtree: true }).forEach(a => a.cancel());
  const counters = new WeakMap();
  function countTo(el, from, to, fmt, ms = 1000) {
    const id = {}; counters.set(el, id);
    if (ms <= 1) { el.textContent = fmt(to); return Promise.resolve(); }
    return tween(ms, t => { if (counters.get(el) === id) el.textContent = fmt(lerp(from, to, ease.io(t))); });
  }
  function leaveSlide(el) { el.classList.remove('is-active'); el.classList.add('is-leaving'); }
  function fxClear() { fx.getAnimations().forEach(a => a.cancel()); fxc.globalCompositeOperation = 'source-over'; fxc.clearRect(0, 0, W, H); fx.style.opacity = 1; }

  const CTRL = {};
  CTRL.s02 = {
    states: 1,
    render(st, inst, dir) {
      if (dir < 0) {
        [...gLines.children].forEach(l => { if (l.dataset.base === '0') { l.style.transition = 'none'; l.classList.remove('on'); } });
        void gLines.offsetWidth;
      }
      s02Render(st, inst);
    },
    reset() { s02Reset(); s02.classList.add('landed'); },
  };

  /* ---------- 04 · Placas paralelas ---------- */
  const s04 = byId('s04');
  const S04 = [
    { A: 100, d: 4, er: 1, w: 460, gap: 480, C: 22.135, hl: null },
    { A: 200, d: 4, er: 1, w: 650, gap: 480, C: 44.27, hl: 'A' },
    { A: 200, d: 2, er: 1, w: 650, gap: 240, C: 88.54, hl: 'd' },
    { A: 200, d: 2, er: 5, w: 650, gap: 240, C: 442.7, hl: 'e' },
  ];
  const CX4 = 520, CY4 = 540;
  const s04plates = st => { const c = S04[st]; return { x: CX4 - c.w / 2, w: c.w, top: CY4 - c.gap / 2, bot: CY4 + c.gap / 2, op: 1 }; };
  const s04Lines = document.getElementById('s04-lines');
  for (let i = 0; i < 9; i++) {
    const x = -0.86 + i * (1.72 / 8);
    svg('line', { x1: x, x2: x, y1: -0.93, y2: 0.93, 'vector-effect': 'non-scaling-stroke', style: `--d:${i * 60}ms` }, s04Lines);
  }
  const s04f = { field: byId('s04').querySelector('#s04-field'), dim: document.getElementById('s04-dim'), tt: document.getElementById('s04-tick-t'),
    tb: document.getElementById('s04-tick-b'), dl: document.getElementById('s04-dlab'), cval: document.getElementById('c-val'),
    kA: document.getElementById('k-A'), kd: document.getElementById('k-d'), ke: document.getElementById('k-e') };
  let s04cur = 0;
  function s04Geometry(st) {
    const c = S04[st], xd = CX4 + c.w / 2 + 64;
    s04f.field.style.transform = `translate(${CX4}px,${CY4}px) scale(${c.w / 2},${c.gap / 2})`;
    s04f.dim.style.transform = `translate(${xd}px,${CY4}px) scale(1,${c.gap / 2})`;
    s04f.tt.style.transform = `translate(${xd}px,${CY4 - c.gap / 2}px)`;
    s04f.tb.style.transform = `translate(${xd}px,${CY4 + c.gap / 2}px)`;
    s04f.dl.style.transform = `translate(${xd + 22}px,${CY4 + 16}px)`;
  }
  CTRL.s04 = {
    states: 3,
    plates: s04plates,
    render(st, inst, dir, noPlates) {
      const c = S04[st], prevC = S04[s04cur].C;
      s04.dataset.state = st;
      if (inst) noTr(s04, () => s04Geometry(st)); else s04Geometry(st);
      if (!noPlates) { if (inst) applyPlates(s04plates(st)); else movePlates(s04plates(st), 1000, 0); }
      s04f.kA.textContent = `${c.A} cm²`;
      s04f.kd.textContent = `${c.d} mm`;
      s04f.ke.textContent = c.er > 1 ? 'vidrio · εr = 5' : 'aire · εr = 1';
      s04.querySelectorAll('.knob').forEach(k => k.classList.toggle('hl', k.dataset.k === c.hl));
      countTo(s04f.cval, prevC, c.C, fmtC, inst ? 1 : 1000);
      s04cur = st;
    },
    reset() { s04.classList.remove('lines-on', 'dim-on'); s04cur = 0; this.render(0, true, 0, true); },
    prepare() { s04.classList.add('lines-on', 'dim-on'); },
  };

  /* ---------- 05 · Coaxial y esférico ---------- */
  const s05 = byId('s05');
  for (const [id, cx] of [['radials-coax', 480], ['radials-sph', 1440]]) {
    const g = document.getElementById(id);
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2 + Math.PI / 16;
      svg('line', { x1: cx + Math.cos(a) * 58, y1: 500 + Math.sin(a) * 58, x2: cx + Math.cos(a) * 180, y2: 500 + Math.sin(a) * 180, style: `--d:${300 + i * 35}ms` }, g);
    }
  }
  CTRL.s05 = {
    states: 1,
    plates: () => ({ ...plateNow, op: 0 }),
    render(st) { s05.dataset.state = st; },
    reset() { s05.dataset.state = 0; },
  };

  /* ---------- 06 · Dieléctrico ---------- */
  const s06 = byId('s06');
  const SLAB = { x0: 200, x1: 920, y0: 324, y1: 756 };
  const P6 = { x: 200, w: 720, top: 300, bot: 780, op: 1 };
  PLATES.s06 = P6; PLATES.s07 = P6; PLATES.s08 = P6;
  PLATES.s09 = { x: 160, w: 1600, top: 128, bot: 952, op: .4 };
  const s06L = document.getElementById('s06-lines');
  for (let i = 0; i < 10; i++) {
    const x = 236 + i * 72;
    const keep = i === 2 || i === 7;
    svg('line', { x1: x, x2: x, y1: 302, y2: SLAB.y0 }, s06L);
    svg('line', { x1: x, x2: x, y1: SLAB.y0, y2: SLAB.y1, class: keep ? 'keep' : 'fade', style: `--d:${600 + i * 40}ms` }, s06L);
    svg('line', { x1: x, x2: x, y1: SLAB.y1, y2: 778 }, s06L);
  }
  const s06D = document.getElementById('s06-dipoles');
  const dipoles = [];
  for (let j = 0; j < 4; j++) for (let i = 0; i < 9; i++) {
    const x = 240 + i * 80 + (j % 2 ? 20 : -20), y = 378 + j * 108;
    const g = svg('g', { class: 'dip' }, s06D);
    svg('line', { x1: -13, y1: 0, x2: 13, y2: 0 }, g);
    svg('circle', { class: 'dn', cx: -16, cy: 0, r: 7 }, g);
    svg('circle', { class: 'dp', cx: 16, cy: 0, r: 7 }, g);
    const rnd = rand(-180, 180);
    g.style.setProperty('--d', `${Math.round((j * 9 + i) * 18)}ms`);
    dipoles.push({ g, x, y, rnd });
  }
  function s06Dip(st) { for (const d of dipoles) d.g.style.transform = `translate(${d.x}px,${d.y}px) rotate(${st ? 90 : d.rnd}deg)`; }
  CTRL.s06 = {
    states: 1,
    render(st, inst) { s06.dataset.state = st; if (inst) noTr(s06, () => s06Dip(st)); else s06Dip(st); },
    reset() { this.render(0, true); },
  };

  /* ---------- 07 · Grieta de aire ---------- */
  const s07 = byId('s07');
  const crackPts = [];
  for (let x = 200; x <= 920; x += 24) crackPts.push([x, 340 + (x === 200 || x >= 920 ? 0 : Math.round(rand(-5, 5)))]);
  document.getElementById('crack').setAttribute('d', `M200 304 L920 304 L920 340 ${crackPts.slice().reverse().map(p => `L${p[0]} ${p[1]}`).join(' ')} Z`);
  const aL = document.getElementById('s07-alines'), gL = document.getElementById('s07-glines');
  for (let x = 212; x <= 908; x += 16) svg('line', { x1: x, x2: x, y1: 308, y2: 333 }, aL);
  for (let i = 0; i < 6; i++) { const x = 260 + i * 120; svg('line', { x1: x, x2: x, y1: 350, y2: 774 }, gL); }
  const S07 = [{ V: 1000, ea: 2.083, eg: .417, va: 208 }, { V: 1200, ea: 2.5, eg: .5, va: 250 }, { V: 1440, ea: 3.0, eg: .6, va: 300 }];
  const s07f = { v: document.getElementById('v07'), ea: document.getElementById('e-air'), eg: document.getElementById('e-gl'), va: document.getElementById('v-air'), m: document.getElementById('meter-fill') };
  let s07cur = 0, ionRaf = 0;
  function ionizeStop() { cancelAnimationFrame(ionRaf); ionRaf = 0; fxClear(); }
  function ionize() {
    ionizeStop();
    const t0 = performance.now(), dur = 2600;
    (function f(now) {
      const el = now - t0, k = 1 - clamp(el / dur);
      fxc.globalCompositeOperation = 'source-over';
      fxc.clearRect(0, 0, W, H);
      fxc.globalCompositeOperation = 'lighter';
      const n = Math.round(4 + 10 * k);
      for (let i = 0; i < n; i++) {
        let x = rand(214, 906), y = 308;
        fxc.strokeStyle = `rgba(255,${Math.round(rand(120, 200))},${Math.round(rand(150, 210))},${rand(.4, .95) * (.35 + .65 * k)})`;
        fxc.lineWidth = rand(1, 2.4);
        fxc.shadowColor = 'rgba(255,77,106,.9)'; fxc.shadowBlur = 14;
        fxc.beginPath(); fxc.moveTo(x, y);
        while (y < 334) { y += rand(4, 8); x += rand(-7, 7); fxc.lineTo(x, Math.min(y, 336)); }
        fxc.stroke();
      }
      fxc.shadowBlur = 0;
      if (el < dur) ionRaf = requestAnimationFrame(f);
      else { fxc.globalCompositeOperation = 'source-over'; fxc.clearRect(0, 0, W, H); ionRaf = 0; }
    })(t0);
  }
  CTRL.s07 = {
    states: 2,
    render(st, inst) {
      const a = S07[s07cur], b = S07[st], ms = inst ? 1 : 1000;
      s07.dataset.state = st;
      countTo(s07f.v, a.V, b.V, v => String(Math.round(v)), ms);
      countTo(s07f.ea, a.ea, b.ea, v => nf2.format(v), ms);
      countTo(s07f.eg, a.eg, b.eg, v => nf2.format(v), ms);
      countTo(s07f.va, a.va, b.va, v => String(Math.round(v)), ms);
      if (inst) noTr(s07, () => { s07f.m.style.width = `${b.ea / 3 * 100}%`; }); else s07f.m.style.width = `${b.ea / 3 * 100}%`;
      if (st === 2 && !inst) setTimeout(() => { if (s07.dataset.state === '2' && slides[idx] === s07) ionize(); }, 650);
      if (st !== 2) ionizeStop();
      s07cur = st;
    },
    reset() { s07cur = 0; this.render(0, true); },
    leave() { ionizeStop(); },
  };

  /* ---------- 08 · Energía ---------- */
  const s08 = byId('s08');
  CTRL.s08 = { states: 1, render(st) { s08.dataset.state = st; }, reset() { s08.dataset.state = 0; } };

  /* ---------- 09 · Cierre ---------- */
  const s09 = byId('s09');
  CTRL.s09 = { states: 1, plates: () => PLATES.s09, render(st) { s09.dataset.state = st; }, reset() { s09.dataset.state = 0; } };


  /* ---------- Overlay SVG compartido ---------- */
  const ov = gauss;
  function ovClear() { ov.innerHTML = ''; ov.getAnimations().forEach(a => a.cancel()); ov.style.opacity = ''; }

  /* ---------- 03 → 04 · Integral de línea ---------- */
  T['s03>s04'] = async (from, to) => {
    leaveSlide(from);
    const nodes = [...from.querySelectorAll('.node')], vNode = nodes[2];
    fadeOut([...from.querySelectorAll('.rv, .lk'), ...nodes.filter(n => n !== vNode)], 450);
    CTRL.s04.reset();
    movePlates(s04plates(0), 1400, 200);
    const P0 = { x: 1170, y: 680 }, CP = { x: 1060, y: 960 };
    const xd = CX4 + S04[0].w / 2 + 64, yB = CY4 + S04[0].gap / 2, yT = CY4 - S04[0].gap / 2;
    const dot = (x, y, a = 1) => `<circle cx="${x}" cy="${y}" r="26" fill="rgba(143,227,255,.18)" opacity="${a}"/><circle cx="${x}" cy="${y}" r="8" fill="#f2f4fa" opacity="${a}"/>`;
    await wait(250);
    fadeOut([vNode], 300, 150);
    await tween(750, t => {
      const e = ease.io(t), u = 1 - e;
      const x = u * u * P0.x + 2 * u * e * CP.x + e * e * xd, y = u * u * P0.y + 2 * u * e * CP.y + e * e * yB;
      ov.innerHTML = dot(x, y);
    });
    await tween(1000, t => {
      const e = ease.inOutQuad(t), y = lerp(yB, yT, e);
      let ticks = '';
      for (let ty = yB - 24; ty > y; ty -= 24) ticks += `<line x1="${xd - 9}" x2="${xd + 9}" y1="${ty}" y2="${ty}" stroke="#8fe3ff" stroke-width="1.5" opacity=".8"/>`;
      ov.innerHTML = `<line x1="${xd}" x2="${xd}" y1="${yB}" y2="${y}" stroke="#9aa6bd" stroke-width="1.6"/>${ticks}${dot(xd, y)}` +
        `<text x="${xd + 40}" y="${y + 14}" style="font:italic 400 44px var(--serif);fill:#f2f4fa" opacity="${clamp(t * 4) * (1 - clamp((t - .75) / .25))}">−∫ E · dl</text>`;
    });
    deactivate(from); cancelAnims(from);
    to.classList.add('is-entering');
    activate(to);
    CTRL.s04.prepare();
    await ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' }).finished;
    ovClear();
  };

  /* ---------- 04 → 05 · Curvatura: las placas se enrollan ---------- */
  function drawArc(cx0, cy0, L0, tc, r, k, col, wdt = 4) {
    const L = lerp(L0, 2 * Math.PI * r, k), th = k * 2 * Math.PI;
    const M = { x: lerp(cx0, tc.x, k), y: lerp(cy0, tc.y - r, k) };
    fxc.strokeStyle = `rgb(${col})`; fxc.lineWidth = wdt; fxc.shadowColor = `rgba(${col},.8)`; fxc.shadowBlur = 16;
    fxc.beginPath();
    if (th < 1e-3) { fxc.moveTo(M.x - L / 2, M.y); fxc.lineTo(M.x + L / 2, M.y); }
    else {
      const R = L / th, O = { x: M.x, y: M.y + R };
      fxc.arc(O.x, O.y, R, -Math.PI / 2 - th / 2, -Math.PI / 2 + th / 2);
    }
    fxc.stroke(); fxc.shadowBlur = 0;
  }
  T['s04>s05'] = async (from, to) => {
    leaveSlide(from);
    fadeOut([...from.querySelectorAll('.col, .s04-field, .s04-dim, .s04-tick, .s04-dlab')], 400);
    const p = { ...plateNow };
    applyPlates({ ...p, op: 0 });
    fxClear();
    const coax = { x: 480, y: 500 }, sph = { x: 1440, y: 500 };
    await tween(1250, t => {
      const k = ease.io(t);
      fxc.clearRect(0, 0, W, H);
      drawArc(p.x + p.w / 2, p.top, p.w, coax, 46, k, ICE, lerp(4, 6, k));
      drawArc(p.x + p.w / 2, p.bot, p.w, coax, 190, k, ABYSS);
      if (k > .98) { fxc.fillStyle = `rgba(${ICE},${(k - .98) * 50})`; fxc.beginPath(); fxc.arc(coax.x, coax.y, 46, 0, Math.PI * 2); fxc.fill(); }
    });
    deactivate(from); cancelAnims(from);
    CTRL.s05.reset();
    to.classList.add('is-entering');
    to.querySelector('.geo-coax').style.opacity = 0;
    to.querySelector('.geo-sph').style.opacity = 0;
    activate(to);
    await tween(800, t => {
      const k = ease.io(t), x = lerp(coax.x, sph.x, k);
      fxc.clearRect(0, 0, W, H);
      for (const cx of [coax.x, x]) {
        fxc.fillStyle = `rgb(${ICE})`; fxc.shadowColor = `rgba(${ICE},.8)`; fxc.shadowBlur = 14;
        fxc.beginPath(); fxc.arc(cx, coax.y, 46, 0, Math.PI * 2); fxc.fill();
        fxc.strokeStyle = `rgb(${ABYSS})`; fxc.lineWidth = 4; fxc.shadowColor = `rgba(${ABYSS},.8)`;
        fxc.beginPath(); fxc.arc(cx, coax.y, 190, 0, Math.PI * 2); fxc.stroke();
      }
      fxc.shadowBlur = 0;
      fxc.strokeStyle = `rgba(${ABYSS},.35)`; fxc.lineWidth = 1.4;
      fxc.beginPath(); fxc.ellipse(x, coax.y, 190, 58 * k, 0, 0, Math.PI * 2); fxc.stroke();
      fxc.beginPath(); fxc.ellipse(x, coax.y, 190 - 118 * k, 190, 0, 0, Math.PI * 2); fxc.stroke();
    });
    to.querySelector('.geo-coax').style.opacity = '';
    to.querySelector('.geo-sph').style.opacity = '';
    await fadeFx(300);
  };

  /* ---------- 05 → 06 · Cristalización ---------- */
  function growIce(r) {
    const segs = [], speed = .5, stack = [];
    for (let i = 0; i < 16; i++) {
      stack.push({ x: rand(r.x0, r.x1), y: r.y0, a: Math.PI / 2, t: rand(0, 220), depth: 0, len: rand(150, 300) });
      stack.push({ x: rand(r.x0, r.x1), y: r.y1, a: -Math.PI / 2, t: rand(0, 220), depth: 0, len: rand(150, 300) });
    }
    for (let i = 0; i < 6; i++) {
      stack.push({ x: r.x0, y: rand(r.y0, r.y1), a: 0, t: rand(0, 220), depth: 0, len: rand(150, 280) });
      stack.push({ x: r.x1, y: rand(r.y0, r.y1), a: Math.PI, t: rand(0, 220), depth: 0, len: rand(150, 280) });
    }
    while (stack.length && segs.length < 2200) {
      const b = stack.pop(); let { x, y, a, t } = b, run = 0;
      while (run < b.len) {
        const L = rand(9, 16), nx = x + Math.cos(a) * L, ny = y + Math.sin(a) * L;
        if (nx < r.x0 || nx > r.x1 || ny < r.y0 || ny > r.y1) break;
        segs.push({ x0: x, y0: y, x1: nx, y1: ny, t0: t, t1: t + L / speed, w: Math.max(.7, 2.4 - b.depth * .6) });
        x = nx; y = ny; t += L / speed; run += L;
        if (b.depth < 3 && Math.random() < .24) stack.push({ x, y, a: a + (Math.random() < .5 ? 1 : -1) * Math.PI / 3, t, depth: b.depth + 1, len: b.len * rand(.3, .55) });
        a += rand(-.05, .05);
      }
    }
    return segs;
  }
  T['s05>s06'] = async (from, to) => {
    leaveSlide(from);
    fadeOut([from], 450);
    applyPlates({ ...P6, op: 0 });
    movePlates(P6, 600, 250, 'ease-out');
    CTRL.s06.reset();
    const segs = growIce(SLAB), total = Math.max(...segs.map(s => s.t1));
    fxClear();
    await wait(450);
    deactivate(from); cancelAnims(from);
    const dur = Math.min(total, 1500), sc = dur / total;
    const growing = tween(dur + 100, t => {
      const now = t * (dur + 100) / sc;
      fxc.clearRect(0, 0, W, H);
      fxc.globalCompositeOperation = 'lighter';
      fxc.lineCap = 'round';
      for (const s of segs) {
        if (now < s.t0) continue;
        const k = clamp((now - s.t0) / (s.t1 - s.t0));
        fxc.strokeStyle = `rgba(${ICE},${.75 - s.w * .08})`;
        fxc.lineWidth = s.w;
        fxc.beginPath(); fxc.moveTo(s.x0, s.y0); fxc.lineTo(lerp(s.x0, s.x1, k), lerp(s.y0, s.y1, k)); fxc.stroke();
      }
      fxc.globalCompositeOperation = 'source-over';
    });
    await wait(dur * .7);
    to.classList.add('is-entering');
    to.style.opacity = 0;
    activate(to);
    const inA = to.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, fill: 'forwards' });
    inA.finished.then(() => { to.style.opacity = ''; inA.cancel(); });
    await growing;
    await fadeFx(700);
  };

  /* ---------- 06 → 07 · Fisura ---------- */
  T['s06>s07'] = async (from, to) => {
    leaveSlide(from);
    fadeOut([...from.querySelectorAll('.col, #s06-dipoles, .bound, .bound-lbl')], 400);
    CTRL.s07.reset();
    fxClear();
    const pts = crackPts;
    const shards = [];
    await tween(750, t => {
      const xTip = lerp(200, 920, ease.io(t));
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (const [x, y] of pts) { if (x > xTip) break; d += ` L${x} ${y}`; }
      ov.innerHTML = `<path d="${d}" fill="none" stroke="#8fe3ff" stroke-width="10" opacity=".25"/><path d="${d}" fill="none" stroke="#f2f4fa" stroke-width="2.4"/>`;
      if (Math.random() < .9) for (let i = 0; i < 3; i++) shards.push({ x: xTip, y: 340, vx: rand(-.6, .6), vy: rand(-1.4, 1.4), r: rand(2, 5), born: performance.now() });
      fxc.clearRect(0, 0, W, H);
      const now = performance.now();
      for (const s of shards) {
        const a = (now - s.born) / 600; if (a > 1) continue;
        const x = s.x + s.vx * (now - s.born) * .25, y = s.y + s.vy * (now - s.born) * .25;
        fxc.fillStyle = `rgba(${ICE},${1 - a})`;
        fxc.beginPath(); fxc.moveTo(x, y - s.r); fxc.lineTo(x + s.r * .7, y + s.r); fxc.lineTo(x - s.r * .7, y + s.r * .4); fxc.closePath(); fxc.fill();
      }
    });
    to.classList.add('is-entering');
    activate(to);
    const inA = to.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 650, fill: 'forwards' });
    inA.finished.then(() => inA.cancel());
    from.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 650, fill: 'forwards' });
    await ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 650, fill: 'forwards' }).finished;
    ovClear(); fxc.clearRect(0, 0, W, H);
    deactivate(from); cancelAnims(from);
  };

  /* ---------- 07 → 08 · Llenado ---------- */
  T['s07>s08'] = async (from, to) => {
    const hot = from.dataset.state === '2';
    leaveSlide(from);
    fadeOut([from.querySelector('.col')], 400);
    fxClear();
    CTRL.s08.reset();
    const xs = []; for (let x = 212; x <= 908; x += 24) xs.push(x);
    await tween(1400, t => {
      fxc.clearRect(0, 0, W, H);
      const spread = ease.out(clamp(t / .45)), widen = ease.io(clamp((t - .2) / .8));
      if (hot) {
        const g = fxc.createLinearGradient(0, 304, 0, 304 + 472 * spread);
        g.addColorStop(0, `rgba(255,77,106,${.6 * (1 - widen)})`); g.addColorStop(1, 'rgba(255,77,106,0)');
        fxc.fillStyle = g; fxc.fillRect(200, 304, 720, 472 * spread);
      }
      const grad = fxc.createLinearGradient(0, 304, 0, 776);
      grad.addColorStop(0, `rgba(${ICE},${.25 + .2 * widen})`); grad.addColorStop(.5, `rgba(201,212,255,${.12 + .12 * widen})`); grad.addColorStop(1, `rgba(${ABYSS},${.25 + .2 * widen})`);
      fxc.fillStyle = grad;
      const w = lerp(2, 25, widen);
      for (const x of xs) fxc.fillRect(x - w / 2, 304, w, 472);
      from.style.opacity = 1 - clamp(t / .5);
    });
    deactivate(from); cancelAnims(from); from.style.opacity = '';
    to.classList.add('is-entering');
    activate(to);
    await fadeFx(600);
  };

  /* ---------- 08 → 09 · Descarga final ---------- */
  T['s08>s09'] = async (from, to) => {
    leaveSlide(from);
    fadeOut([from.querySelector('.col'), ...from.querySelectorAll('.vol-lbl, .vol-val')], 350);
    from.querySelectorAll('.vol, .vol-dots').forEach(e => e.style.opacity = 0);
    fxClear();
    CTRL.s09.reset();
    movePlates(PLATES.s09, 1500, 200);
    const C0 = { x: 560, y: 540 }, mid = { x: 960, y: 520 };
    const targets = [420, 960, 1500].map(x => ({ x, y: 400 }));
    await tween(900, t => {
      const k = ease.in(t);
      const w = lerp(720, 8, k), h = lerp(472, 8, ease.io(t));
      const cx = lerp(C0.x, mid.x, ease.io(t)), cy = lerp(C0.y, mid.y, ease.io(t));
      fxc.clearRect(0, 0, W, H);
      const g = fxc.createLinearGradient(0, cy - h / 2, 0, cy + h / 2);
      g.addColorStop(0, `rgba(${ICE},${.42 + .5 * k})`); g.addColorStop(.5, `rgba(242,244,250,${.25 + .7 * k})`); g.addColorStop(1, `rgba(${ABYSS},${.42 + .5 * k})`);
      fxc.fillStyle = g; fxc.shadowColor = `rgba(${STAR},.9)`; fxc.shadowBlur = 30 * k;
      fxc.fillRect(cx - w / 2, cy - h / 2, w, h); fxc.shadowBlur = 0;
    });
    deactivate(from); cancelAnims(from); from.querySelectorAll('.vol, .vol-dots').forEach(e => e.style.opacity = '');
    const trail = targets.map(() => []);
    await tween(900, t => {
      const k = ease.io(t);
      fxc.globalCompositeOperation = 'destination-out'; fxc.fillStyle = 'rgba(0,0,0,.3)'; fxc.fillRect(0, 0, W, H);
      fxc.globalCompositeOperation = 'lighter';
      targets.forEach((p, i) => {
        const cpx = lerp(mid.x, p.x, .5), cpy = mid.y - 160;
        const u = 1 - k, x = u * u * mid.x + 2 * u * k * cpx + k * k * p.x, y = u * u * mid.y + 2 * u * k * cpy + k * k * p.y;
        fxc.fillStyle = `rgba(${STAR},1)`; fxc.shadowColor = `rgba(${ICE},1)`; fxc.shadowBlur = 20;
        fxc.beginPath(); fxc.arc(x, y, 6, 0, Math.PI * 2); fxc.fill();
      });
      fxc.shadowBlur = 0; fxc.globalCompositeOperation = 'source-over';
    });
    to.classList.add('is-entering');
    activate(to);
    await fadeFx(500);
  };

  /* ---------- Transiciones inversas (←): cada fenómeno se deshace ---------- */

  // 04 → 03 · La cota d se vuelve a recorrer hacia abajo y regresa a la estrella V.
  T['s04>s03'] = async (from, to) => {
    leaveSlide(from);
    const cur = S04[s04cur];
    const xd = CX4 + cur.w / 2 + 64, yB = CY4 + cur.gap / 2, yT = CY4 - cur.gap / 2;
    fadeOut([...from.querySelectorAll('.col, .s04-field, .s04-dim, .s04-tick, .s04-dlab')], 350);
    movePlates(PLATES.s03, 1500, 500);
    const P0 = { x: 1170, y: 680 }, CP = { x: 1060, y: 960 };
    const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="26" fill="rgba(143,227,255,.18)"/><circle cx="${x}" cy="${y}" r="8" fill="#f2f4fa"/>`;
    await tween(900, t => {
      const e = ease.inOutQuad(t), y = lerp(yT, yB, e);
      let ticks = '';
      for (let ty = yB - 24; ty > y; ty -= 24) ticks += `<line x1="${xd - 9}" x2="${xd + 9}" y1="${ty}" y2="${ty}" stroke="#8fe3ff" stroke-width="1.5" opacity=".8"/>`;
      ov.innerHTML = `<line x1="${xd}" x2="${xd}" y1="${yB}" y2="${y}" stroke="#9aa6bd" stroke-width="1.6"/>${ticks}${dot(xd, y)}` +
        `<text x="${xd + 40}" y="${y + 14}" style="font:italic 400 44px var(--serif);fill:#f2f4fa" opacity="${clamp(t * 4) * (1 - clamp((t - .75) / .25))}">−∫ E · dl</text>`;
    });
    deactivate(from); cancelAnims(from); CTRL.s04.reset();
    await tween(700, t => {
      const e = ease.io(t), u = 1 - e;
      const x = u * u * xd + 2 * u * e * CP.x + e * e * P0.x, y = u * u * yB + 2 * u * e * CP.y + e * e * P0.y;
      ov.innerHTML = dot(x, y);
    });
    to.classList.add('is-entering');
    activate(to);
    await ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' }).finished;
    ovClear();
  };

  // 05 → 04 · La esfera regresa al coaxial y los cilindros se desenrollan en placas.
  T['s05>s04'] = async (from, to) => {
    leaveSlide(from);
    fadeOut([from], 350);
    fxClear();
    const coax = { x: 480, y: 500 }, sph = { x: 1440, y: 500 };
    await wait(250);
    deactivate(from); cancelAnims(from); CTRL.s05.reset();
    await tween(700, t => {
      const k = 1 - ease.io(t), x = lerp(coax.x, sph.x, k);
      fxc.clearRect(0, 0, W, H);
      for (const cx of [coax.x, x]) {
        fxc.fillStyle = `rgb(${ICE})`; fxc.shadowColor = `rgba(${ICE},.8)`; fxc.shadowBlur = 14;
        fxc.beginPath(); fxc.arc(cx, coax.y, 46, 0, Math.PI * 2); fxc.fill();
        fxc.strokeStyle = `rgb(${ABYSS})`; fxc.lineWidth = 4; fxc.shadowColor = `rgba(${ABYSS},.8)`;
        fxc.beginPath(); fxc.arc(cx, coax.y, 190, 0, Math.PI * 2); fxc.stroke();
      }
      fxc.shadowBlur = 0;
      fxc.strokeStyle = `rgba(${ABYSS},.35)`; fxc.lineWidth = 1.4;
      fxc.beginPath(); fxc.ellipse(x, coax.y, 190, 58 * k, 0, 0, Math.PI * 2); fxc.stroke();
      fxc.beginPath(); fxc.ellipse(x, coax.y, 190 - 118 * k, 190, 0, 0, Math.PI * 2); fxc.stroke();
    });
    const p = s04plates(3);
    await tween(1150, t => {
      const k = 1 - ease.io(t);
      fxc.clearRect(0, 0, W, H);
      drawArc(p.x + p.w / 2, p.top, p.w, coax, 46, k, ICE, lerp(4, 6, k));
      drawArc(p.x + p.w / 2, p.bot, p.w, coax, 190, k, ABYSS);
    });
    applyPlates(p);
    fxClear();
    CTRL.s04.reset(); CTRL.s04.prepare(); CTRL.s04.render(3, true, 0, true);
    to.classList.add('is-entering');
    activate(to);
  };

  // 06 → 05 · El hielo se derrite hacia los bordes y reaparecen las otras simetrías.
  T['s06>s05'] = async (from, to) => {
    leaveSlide(from);
    const segs = growIce(SLAB), total = Math.max(...segs.map(s => s.t1));
    fxClear();
    fadeOut([from], 500);
    const dur = Math.min(total, 1400), sc = dur / total;
    await tween(dur + 100, t => {
      const now = (1 - t) * (dur + 100) / sc;
      fxc.clearRect(0, 0, W, H);
      fxc.globalCompositeOperation = 'lighter'; fxc.lineCap = 'round';
      for (const s of segs) {
        if (now < s.t0) continue;
        const k = clamp((now - s.t0) / (s.t1 - s.t0));
        fxc.strokeStyle = `rgba(${ICE},${.75 - s.w * .08})`; fxc.lineWidth = s.w;
        fxc.beginPath(); fxc.moveTo(s.x0, s.y0); fxc.lineTo(lerp(s.x0, s.x1, k), lerp(s.y0, s.y1, k)); fxc.stroke();
      }
      fxc.globalCompositeOperation = 'source-over';
    });
    deactivate(from); cancelAnims(from); CTRL.s06.reset();
    movePlates({ ...plateNow, op: 0 }, 500, 0, 'ease-in');
    CTRL.s05.reset(); CTRL.s05.render(1, true);
    to.classList.add('is-entering');
    activate(to);
    const inA = to.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, fill: 'forwards' });
    await inA.finished; inA.cancel();
    fxClear();
  };

  // 07 → 06 · La grieta se suelda de derecha a izquierda y el hielo vuelve a polarizarse.
  T['s07>s06'] = async (from, to) => {
    CTRL.s07.leave();
    leaveSlide(from);
    const pts = crackPts;
    from.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
    CTRL.s06.reset(); CTRL.s06.render(1, true);
    to.classList.add('is-entering');
    await tween(800, t => {
      const xTip = lerp(920, 200, ease.io(t));
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (const [x, y] of pts) { if (x > xTip) break; d += ` L${x} ${y}`; }
      ov.innerHTML = `<path d="${d}" fill="none" stroke="#8fe3ff" stroke-width="10" opacity=".25"/><path d="${d}" fill="none" stroke="#f2f4fa" stroke-width="2.4"/>`;
      if (t > .45 && !to.classList.contains('is-active')) {
        activate(to);
        const inA = to.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, fill: 'forwards' });
        inA.finished.then(() => inA.cancel());
      }
    });
    await ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).finished;
    ovClear();
    deactivate(from); cancelAnims(from); CTRL.s07.reset();
  };

  // 08 → 07 · El volumen de energía se adelgaza de nuevo en líneas de campo.
  T['s08>s07'] = async (from, to) => {
    leaveSlide(from);
    fadeOut([from.querySelector('.col'), ...from.querySelectorAll('.vol-lbl, .vol-val')], 350);
    from.querySelectorAll('.vol, .vol-dots').forEach(e => e.style.opacity = 0);
    fxClear();
    CTRL.s07.reset(); CTRL.s07.render(2, true);
    const xs = []; for (let x = 212; x <= 908; x += 24) xs.push(x);
    to.classList.add('is-entering');
    to.style.opacity = 0;
    activate(to);
    await tween(1300, t => {
      const widen = 1 - ease.io(t);
      fxc.clearRect(0, 0, W, H);
      const grad = fxc.createLinearGradient(0, 304, 0, 776);
      grad.addColorStop(0, `rgba(${ICE},${.25 + .2 * widen})`); grad.addColorStop(.5, `rgba(201,212,255,${.12 + .12 * widen})`); grad.addColorStop(1, `rgba(${ABYSS},${.25 + .2 * widen})`);
      fxc.fillStyle = grad;
      const w = lerp(2, 25, widen);
      for (const x of xs) fxc.fillRect(x - w / 2, 304, w, 472);
      to.style.opacity = clamp((t - .45) / .55);
    });
    to.style.opacity = '';
    deactivate(from); cancelAnims(from); from.querySelectorAll('.vol, .vol-dots').forEach(e => e.style.opacity = '');
    await fadeFx(400);
  };

  // 09 → 08 · Las tres estrellas regresan, se funden y recargan el volumen.
  T['s09>s08'] = async (from, to) => {
    leaveSlide(from);
    fadeOut([from], 400);
    fxClear();
    movePlates(P6, 1500, 300);
    const mid = { x: 960, y: 520 }, C0 = { x: 560, y: 540 };
    const sy = from.dataset.state === '1' ? 380 : 400;
    const starts = [420, 960, 1500].map(x => ({ x, y: sy }));
    await tween(900, t => {
      const k = ease.io(t);
      fxc.globalCompositeOperation = 'destination-out'; fxc.fillStyle = 'rgba(0,0,0,.3)'; fxc.fillRect(0, 0, W, H);
      fxc.globalCompositeOperation = 'lighter';
      starts.forEach(p => {
        const cpx = lerp(mid.x, p.x, .5), cpy = mid.y - 160, u = 1 - k;
        const x = u * u * p.x + 2 * u * k * cpx + k * k * mid.x, y = u * u * p.y + 2 * u * k * cpy + k * k * mid.y;
        fxc.fillStyle = `rgba(${STAR},1)`; fxc.shadowColor = `rgba(${ICE},1)`; fxc.shadowBlur = 20;
        fxc.beginPath(); fxc.arc(x, y, 6, 0, Math.PI * 2); fxc.fill();
      });
      fxc.shadowBlur = 0; fxc.globalCompositeOperation = 'source-over';
    });
    deactivate(from); cancelAnims(from); CTRL.s09.reset();
    await tween(900, t => {
      const k = 1 - ease.in(1 - t);
      const w = lerp(8, 720, ease.io(t)), h = lerp(8, 472, ease.io(t));
      const cx = lerp(mid.x, C0.x, ease.io(t)), cy = lerp(mid.y, C0.y, ease.io(t));
      fxc.clearRect(0, 0, W, H);
      const g = fxc.createLinearGradient(0, cy - h / 2, 0, cy + h / 2);
      g.addColorStop(0, `rgba(${ICE},${.42 + .5 * (1 - k)})`); g.addColorStop(.5, `rgba(242,244,250,${.25 + .7 * (1 - k)})`); g.addColorStop(1, `rgba(${ABYSS},${.42 + .5 * (1 - k)})`);
      fxc.fillStyle = g; fxc.fillRect(cx - w / 2, cy - h / 2, w, h);
    });
    CTRL.s08.reset(); CTRL.s08.render(1, true);
    to.classList.add('is-entering');
    activate(to);
    await fadeFx(500);
  };

  /* ---------- Navegación genérica ---------- */
  async function fallback(from, to, backward) {
    const tid = to.dataset.id, c = CTRL[tid];
    leaveSlide(from);
    const st = backward ? (c?.states || 0) : 0;
    const target = c?.plates ? c.plates(st) : PLATES[tid];
    if (target) movePlates(target, reduced ? 1 : 800, 0);
    await from.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduced ? 200 : 450, fill: 'forwards' }).finished;
    deactivate(from); cancelAnims(from);
    CTRL[from.dataset.id]?.reset?.();
    if (c) { c.reset?.(); c.prepare?.(); c.render?.(st, true, 0); }
    to.classList.add('is-entering');
    activate(to);
    if (!reduced) await to.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500 }).finished;
  }

  async function go(nextIdx) {
    if (busy || nextIdx < 0 || nextIdx >= slides.length || nextIdx === idx) return;
    busy = true;
    const from = slides[idx], to = slides[nextIdx];
    const key = `${from.dataset.id}>${to.dataset.id}`;
    const backward = nextIdx < idx;
    CTRL[from.dataset.id]?.leave?.();
    try {
      if (!reduced && T[key]) await T[key](from, to);
      else await fallback(from, to, backward);
    } catch (err) {
      console.error(err);
      slides.forEach(s => { if (s !== to) deactivate(s); });
      activate(to);
    } finally {
      idx = nextIdx;
      const c = CTRL[to.dataset.id];
      state = backward ? (c?.states || 0) : 0;
      if (backward && c && state && T[key]) c.render(state, true, 0);
      hud();
      busy = false;
    }
  }

  function next() {
    if (busy) return;
    const c = CTRL[slides[idx].dataset.id];
    if (c && state < c.states) { state++; c.render(state, false, 1); return; }
    go(idx + 1);
  }
  function prev() {
    if (busy) return;
    const c = CTRL[slides[idx].dataset.id];
    if (c && state > 0) { state--; c.render(state, false, -1); return; }
    go(idx - 1);
  }

  addEventListener('keydown', e => {
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'f' || e.key === 'F') {
      if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.();
    }
  });
  stage.addEventListener('click', next);
  stage.addEventListener('contextmenu', e => { e.preventDefault(); prev(); });

  /* ---------- Entrada inicial: las placas se encienden desde el centro ---------- */
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    const start = parseInt(location.hash.slice(1), 10);
    if (start > 1 && start <= slides.length) {
      idx = start - 1;
      const to = slides[idx], c = CTRL[to.dataset.id];
      deactivate(byId('s01'));
      if (c) { c.reset?.(); c.prepare?.(); c.render?.(0, true, 0); }
      const p = c?.plates ? c.plates(0) : PLATES[to.dataset.id];
      applyPlates(p || { ...plateNow, op: 0 });
      activate(to); hud();
      return;
    }
    hud();
    const s01 = byId('s01');
    s01.classList.remove('is-active');
    void s01.offsetWidth;
    movePlates(PLATES.s01, reduced ? 1 : 1600, 150, EASE_OUT);
    requestAnimationFrame(() => s01.classList.add('is-active'));
  });
})();
