/* =========================================================
   Motor de la presentación · Módulo D · NFPA 70E
   Navegación, estados internos, transiciones, cromo, notas y presentador
   ========================================================= */
(() => {
  const stage = document.getElementById('stage');
  const slides = [...stage.querySelectorAll('.slide')];
  const mainCount = slides.filter(s => !s.dataset.backup).length;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPresenter = new URLSearchParams(location.search).has('presentador');
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel('modulo-d') : null;
  const Scenes = window.Scenes || {};
  const scene = s => Scenes[s.id] || {};

  let idx = 0;
  let scale = 0.5;

  /* ---------- Escala 16:9 y coordenadas ---------- */
  function fit() {
    scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.setProperty('--s', scale);
    anchorTo(slides[idx]);
  }
  function toWin(x, y) {
    const r = stage.getBoundingClientRect();
    return [r.left + x * scale, r.top + y * scale];
  }
  function anchorTo(s) {
    if (!s || !window.Ambient) return;
    const [x, y] = (s.dataset.anchor || '1500 300').split(' ').map(Number);
    window.Ambient.setAnchor(...toWin(x, y));
  }
  addEventListener('resize', fit);

  /* ---------- Parallax del cursor ---------- */
  let pointer = null;
  addEventListener('mousemove', e => {
    if (!pointer) requestAnimationFrame(() => {
      stage.style.setProperty('--mx', ((pointer.clientX / innerWidth) * 2 - 1).toFixed(3));
      stage.style.setProperty('--my', ((pointer.clientY / innerHeight) * 2 - 1).toFixed(3));
      pointer = null;
    });
    pointer = e;
  });

  /* ---------- Construcción de escenas ---------- */
  slides.forEach(s => { s.dataset.s = 0; try { scene(s).build?.(s); } catch (err) { console.error(s.id, err); } });

  /* ---------- Retrasos escalonados ---------- */
  slides.forEach(slide => {
    slide.querySelectorAll('.rv').forEach((el, i) => el.style.setProperty('--d', `${180 + i * 70}ms`));
    slide.querySelectorAll('h1 .w > span').forEach((el, i) => el.style.setProperty('--d', `${250 + i * 80}ms`));
  });

  /* ---------- Estados internos ---------- */
  const nStates = s => scene(s).states ?? (+s.dataset.states || 0);
  function setState(s, n, { silent = false, from = null } = {}) {
    n = Math.max(0, Math.min(nStates(s), n));
    const prev = from ?? (+s.dataset.s || 0);
    s.dataset.s = n;
    s.querySelectorAll('[data-at]').forEach(e => e.classList.toggle('on', n >= +e.dataset.at));
    s.querySelectorAll('[data-only]').forEach(e => e.classList.toggle('on', n === +e.dataset.only));
    if (s.classList.contains('is-active')) scene(s).state?.(s, n, prev);
    if (!silent && s === slides[idx]) broadcast();
    updateDots();
  }

  /* ---------- Navegación ---------- */
  const fxG = document.getElementById('fx-g');
  const cracks = document.getElementById('cracks');
  const flashEl = document.getElementById('flash');
  const cRef = document.getElementById('c-ref');
  const cWho = document.getElementById('c-who');
  const cCount = document.getElementById('c-count');
  const cProg = document.getElementById('c-prog');
  const cDots = document.getElementById('c-dots');
  let leaving = null;

  function go(n, { silent = false, back = false, state = null } = {}) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    const prev = slides[idx];
    const next = slides[n];
    if (n === idx && next.classList.contains('is-active')) return;
    back = back || n < idx;

    if (leaving) { leaving.getAnimations().forEach(a => a.cancel()); leaving.classList.remove('is-leaving'); leaving.style.zIndex = ''; }
    if (prev && prev !== next) {
      scene(prev).leave?.(prev);
      prev.classList.remove('is-active');
      prev.classList.add('is-leaving');
      prev.style.zIndex = 2;
      leaving = prev;
      stopQuizTimer(prev);
    }

    next.getAnimations().forEach(a => a.cancel());
    next.classList.remove('is-active');
    void next.offsetWidth;
    next.classList.add('is-active');
    next.style.zIndex = 3;
    idx = n;

    stage.dataset.mood = next.dataset.mood || 'maint';
    window.Ambient?.setMood(next.dataset.mood || 'maint');
    anchorTo(next);
    window.Thread?.to(next.dataset.thread || 'rest');

    scene(next).enter?.(next);
    setState(next, state ?? (back ? nStates(next) : 0), { silent: true, from: -1 });

    transition(prev !== next ? prev : null, next, back);

    updateChrome();
    if (!silent) broadcast();
  }

  function next() {
    const s = slides[idx];
    if (+s.dataset.s < nStates(s)) { setState(s, +s.dataset.s + 1); return; }
    if (idx < slides.length - 1) go(idx + 1);
  }
  function prev() {
    const s = slides[idx];
    if (+s.dataset.s > 0) { setState(s, +s.dataset.s - 1); return; }
    if (idx > 0) go(idx - 1, { back: true });
  }

  /* ---------- Familia de transiciones ----------
     Las de barrido (slash, rift, sweep, wave, rise) recortan la salida con la
     forma complementaria de la entrada: el corte es un borde real entre dos
     escenas y una línea de luz (color del bloque) viaja sobre él.
     Al retroceder se rebobina la transición de la slide que se abandona. */
  const EASE = 'cubic-bezier(.77,0,.175,1)';
  const EXPO = 'cubic-bezier(.16,1,.3,1)';
  const W = 1920, H = 1080;
  const pt = s => (s || '960 540').split(' ').map(Number);
  const mix = (a, b, p) => a + (b - a) * p;
  const poly = points => `polygon(${points.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
  const line = points => 'M' + points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
  // f(p) → { next, prev?, edge? } muestreado en n + 1 cuadros equiespaciados
  const sample = (n, f) => Array.from({ length: n + 1 }, (_, i) => f(i / n));
  const REWIND = new Set(['slash', 'rift', 'sweep', 'wave', 'rise']);

  const TX = {
    rift: back => ({
      dur: 950, easing: EASE, dir: 'v',
      frames: sample(1, p => {
        const xt = mix(-600, 2520, back ? 1 - p : p), xb = xt + 384;
        const left = poly([[-800, 0], [xt, 0], [xb, H], [-800, H]]);
        const right = poly([[xt, 0], [3000, 0], [3000, H], [xb, H]]);
        return { next: back ? right : left, prev: back ? left : right, edge: line([[xt - 14, -40], [xb + 14, H + 40]]) };
      })
    }),
    sweep: back => ({
      dur: 1100, easing: EASE, dir: 'v',
      frames: sample(1, p => {
        const x = W * (back ? 1 - p : p);
        const left = `inset(0 ${W - x}px 0 0)`, right = `inset(0 0 0 ${x}px)`;
        return { next: back ? right : left, prev: back ? left : right, edge: line([[x, -40], [x, H + 40]]) };
      })
    }),
    rise: back => ({
      dur: 1100, easing: EXPO, dir: 'h',
      frames: sample(1, p => {
        const y = H * (back ? p : 1 - p);
        const top = `inset(0 0 ${H - y}px 0)`, bottom = `inset(${y}px 0 0 0)`;
        return { next: back ? top : bottom, prev: back ? bottom : top, edge: line([[-40, y], [W + 40, y]]) };
      })
    }),
    wave: back => ({
      dur: 1300, easing: 'cubic-bezier(.45,0,.2,1)', dir: 'v',
      frames: sample(12, p => {
        const q = back ? 1 - p : p;
        const base = -260 + q * 2440;
        const e = Array.from({ length: 37 }, (_, k) => {
          const y = (k / 36) * (H + 80) - 40;
          return [base + 70 * Math.sin((y / H) * Math.PI * 3 + q * 8), y];
        });
        const left = poly([[-400, -40], ...e, [-400, H + 40]]);
        const right = poly([...e, [2600, H + 40], [2600, -40]]);
        return { next: back ? right : left, prev: back ? left : right, edge: line(e) };
      })
    }),
    expand: (back, o) => ({
      dur: 1300, easing: 'cubic-bezier(.7,0,.2,1)', dir: 'c',
      frames: sample(1, p => {
        const r = 2300 * p;
        return { next: `circle(${r}px at ${o[0]}px ${o[1]}px)`, edge: `M${o[0] - r} ${o[1]} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0` };
      })
    }),
    dissolve: back => ({
      raw: [{ opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)' }, { opacity: 1, filter: 'blur(0px)', transform: 'none' }],
      dur: back ? 800 : 1100, easing: EXPO
    }),
    absorb: () => ({
      raw: [{ opacity: 0, transform: 'scale(.86)', filter: 'blur(10px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }],
      dur: 1200, easing: EXPO, delay: 250
    }),
    scan: () => bands(14, true),
    reconstruct: () => bands(10, false),
    // La 16 aparece detrás mientras los fragmentos de la 15 salen despedidos (ver shatter)
    fracture: () => ({
      raw: [{ opacity: 0, filter: 'blur(10px)', transform: 'scale(.94)' }, { opacity: 1, filter: 'blur(0px)', transform: 'none' }],
      dur: 1300, easing: EXPO, delay: 560
    })
  };
  TX.slash = TX.rift;

  // Franjas (forense): cada franja avanza con su propio retraso; su frente es el borde de luz
  function bands(n, ltr) {
    const h = H / n;
    return {
      dur: 1250, easing: 'linear', dir: 'v',
      frames: sample(12, p => {
        const pts = [], edge = [];
        for (let k = 0; k < n; k++) {
          const kk = ltr ? k : (k * 7) % n;
          const q = Math.max(0, Math.min(1, p * 1.5 - kk * (0.5 / n)));
          const w = W * (1 - Math.pow(1 - q, 3));
          const y0 = k * h, y1 = (k + 1) * h + 0.5;
          const rtl = !ltr && k % 2;
          const x0 = rtl ? W - w : 0;
          pts.push([x0, y0], [x0 + w, y0], [x0 + w, y1], [x0, y1]);
          const fx = q <= 0 ? (rtl ? W + 40 : -40) : q >= 1 ? (rtl ? -40 : W + 40) : rtl ? W - w : w;
          edge.push(line([[fx, y0], [fx, y1]]));
        }
        return { next: poly(pts), edge: edge.join(' ') };
      })
    };
  }

  function transition(prevEl, nextEl, back) {
    const kind = back ? (REWIND.has(prevEl?.dataset.tx) ? prevEl.dataset.tx : 'dissolve') : nextEl.dataset.tx || 'dissolve';
    if (reduced || !prevEl) {
      nextEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduced ? 400 : 900, easing: 'ease-out' });
      if (prevEl) leave(prevEl, 400, false);
      return;
    }
    const origin = pt(nextEl.dataset.origin);
    const t = (TX[kind] || TX.dissolve)(back, origin);
    const opt = { duration: t.dur, easing: t.easing, delay: t.delay || 0 };

    // Salida
    if (t.frames?.[0].prev) {
      prevEl.animate(t.frames.map(f => ({ clipPath: f.prev })), { ...opt, fill: 'forwards' });
      leave(prevEl, t.dur + opt.delay, true);
    } else if (kind === 'absorb' && prevEl.dataset.zoom) {
      const z = pt(prevEl.dataset.zoom);
      prevEl.style.transformOrigin = `${z[0]}px ${z[1]}px`;
      prevEl.animate([{ transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' }, { transform: 'scale(4.5)', opacity: 0, filter: 'blur(6px)' }],
        { duration: 1000, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' });
      window.Ambient?.burst(...toWin(...z), [143, 227, 255], 30);
      leave(prevEl, 1000, true);
    } else if (kind === 'fracture') {
      const dur = shatter(prevEl, origin);
      prevEl.animate([{ opacity: 0 }, { opacity: 0 }], { duration: dur, fill: 'forwards' });
      leave(prevEl, dur, true);
    } else if (kind === 'reconstruct') {
      prevEl.animate([{ opacity: 1, filter: 'blur(0px) saturate(1)' }, { opacity: 0, filter: 'blur(4px) saturate(0)' }], { duration: 800, easing: 'ease-in', fill: 'forwards' });
      leave(prevEl, 800, true);
    } else {
      leave(prevEl, back ? 500 : 650, false);
    }

    // Entrada
    nextEl.animate(t.raw || t.frames.map(f => ({ clipPath: f.next })), { ...opt, fill: 'backwards' });
    if (t.frames?.[0].edge != null) edgeLight(t.frames.map(f => f.edge), opt, t.dir, kind === 'slash');
    if (kind === 'expand') window.Ambient?.burst(...toWin(...origin), [143, 227, 255], 36);
  }

  function leave(el, dur, custom) {
    if (!custom) el.animate([{ opacity: 1, filter: 'blur(0px)', transform: 'none' }, { opacity: 0, filter: 'blur(8px)', transform: 'scale(.975)' }], { duration: dur, easing: EXPO, fill: 'forwards' });
    setTimeout(() => {
      if (el.classList.contains('is-active')) return;
      el.getAnimations().forEach(a => a.cancel());
      el.classList.remove('is-leaving');
      el.style.transformOrigin = '';
      el.style.zIndex = '';
      if (leaving === el) leaving = null;
    }, dur + 60);
  }

  // Borde de luz: mismo muestreo, duración y curva que el recorte, así viaja pegado al corte
  const canMorphD = window.CSS?.supports?.('d', 'path("M0 0")');
  function edgeLight(ds, opt, dir, blade) {
    fxG.replaceChildren();
    if (!canMorphD) return;
    fxG.setAttribute('class', blade ? 'blade' : '');
    const frames = ds.map(d => ({ d: `path("${d}")` }));
    ['fx-halo', 'fx-glow', 'fx-core'].forEach(c => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('class', `${c} ${dir}`);
      p.setAttribute('d', ds[0]);
      fxG.appendChild(p);
      p.animate(frames, { ...opt, fill: 'both' });
    });
    fxG.animate([{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.72 }, { opacity: 0 }], { ...opt, easing: 'linear', fill: 'both' });
  }

  /* Estallido (15 → 16): la slide saliente se parte de verdad. Cada fragmento es una
     copia de la slide recortada a su polígono; las grietas se dibujan sobre las
     juntas y luego los fragmentos salen despedidos desde el punto del arco. */
  function shatter(el, [ox, oy]) {
    const n = 9;
    const ang = Array.from({ length: n }, (_, j) => (j / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.45);
    const r1 = ang.map(() => 230 + Math.random() * 260);
    const at = (j, r) => [ox + Math.cos(ang[j % n]) * r, oy + Math.sin(ang[j % n]) * r];
    // Polilínea quebrada entre dos radios, para que las juntas no sean rectas perfectas
    const jag = (a, b) => {
      const m = [(a[0] + b[0]) / 2 + (Math.random() - 0.5) * 60, (a[1] + b[1]) / 2 + (Math.random() - 0.5) * 60];
      return [a, m, b];
    };
    const spokes = ang.map((_, j) => jag(at(j, 0), at(j, r1[j])).concat([at(j, r1[j] * 2.2), at(j, 4000)]));
    const ring = ang.map((_, j) => jag(at(j, r1[j]), at(j + 1, r1[(j + 1) % n])));
    const pieces = [];
    for (let j = 0; j < n; j++) {
      const k = (j + 1) % n;
      pieces.push({ pts: [...spokes[j].slice(0, 3), ...ring[j].slice(1, 2), ...spokes[k].slice(0, 3).reverse()], inner: true });
      pieces.push({ pts: [...spokes[j].slice(2), ...spokes[k].slice(2).reverse(), ...ring[j].slice(1, 2)], inner: false });
    }

    const box = document.createElement('div');
    box.className = 'shards';
    stage.insertBefore(box, cracks);
    const hold = 260, fly = 1250, total = hold + fly;
    pieces.forEach(({ pts, inner }) => {
      const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
      const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
      const dx = cx - ox, dy = cy - oy, L = Math.hypot(dx, dy) || 1;
      const push = (inner ? 820 : 520) + Math.random() * 360;
      const c = el.cloneNode(true);
      c.removeAttribute('id');
      c.classList.remove('is-active');
      c.classList.add('is-leaving', 'shard');
      c.style.clipPath = poly(pts);
      c.style.transformOrigin = `${cx.toFixed(0)}px ${cy.toFixed(0)}px`;
      box.appendChild(c);
      const rot = (Math.random() - 0.5) * (inner ? 70 : 30);
      const nx = (dx / L) * 8, ny = (dy / L) * 8;
      // Tensión (se abren las juntas) → estallido: sale rápido y frena, con algo de caída
      c.animate([
        { transform: 'none', filter: 'brightness(1)', easing: 'cubic-bezier(.5,0,.9,.5)' },
        { transform: `translate(${nx}px, ${ny}px)`, filter: 'brightness(1.6)', offset: hold / total, easing: 'cubic-bezier(.12,.75,.3,1)' },
        { transform: `translate(${(dx / L) * push}px, ${(dy / L) * push + 160}px) rotate(${rot}deg) scale(${inner ? 0.62 : 0.85})`, filter: 'brightness(.5) blur(4px)' }
      ], { duration: total, fill: 'forwards' });
      c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: fly * 0.55, delay: hold + fly * 0.3, easing: 'ease-in', fill: 'forwards' });
    });
    setTimeout(() => box.remove(), total + 80);

    // Grietas sobre las juntas: aparecen en el instante del arco y se apagan al separarse
    cracks.innerHTML = '';
    [...spokes.map(s => s.slice(0, 4)), ...ring].forEach((pts, i) => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', line(pts));
      cracks.appendChild(p);
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.animate([{ strokeDashoffset: len, opacity: 1 }, { strokeDashoffset: 0, opacity: 1, offset: 0.35 }, { strokeDashoffset: 0, opacity: 0 }],
        { duration: hold + 500, delay: i < n ? 0 : 60, easing: 'ease-out', fill: 'both' });
    });
    window.Ambient?.burst(...toWin(ox, oy), [255, 77, 109], 80);
    flash();
    return total;
  }

  function flash() {
    if (reduced) return;
    flashEl.animate([{ opacity: 0 }, { opacity: 0.55, offset: 0.08 }, { opacity: 0 }], { duration: 900, easing: 'ease-out' });
  }

  window.Deck = {
    set: (s, n) => setState(s, n),
    flash,
    burst: (x, y, c, n) => window.Ambient?.burst(...toWin(x, y), c, n)
  };

  /* ---------- Cromo ---------- */
  function label(s) {
    const i = slides.indexOf(s);
    return s.dataset.backup || String(i + 1).padStart(2, '0');
  }
  function updateChrome() {
    const s = slides[idx];
    stage.classList.toggle('is-hero', idx === 0);
    cRef.textContent = s.dataset.ref || '';
    [cRef, cWho, cCount].forEach((el, i) => el.animate([{ opacity: 0, transform: i ? 'translateY(10px)' : 'translateX(12px)' }, { opacity: 1, transform: 'none' }],
      { duration: 700, delay: i * 70, easing: EXPO, fill: 'backwards' }));
    cWho.innerHTML = s.dataset.backup
      ? '<b>RESPALDO</b> · SOLO SI PREGUNTAN'
      : `<b>${(s.dataset.who || '').replace('I', 'INTEGRANTE ')}</b> · ${s.dataset.time || ''}`;
    cCount.innerHTML = s.dataset.backup
      ? `<b>${s.dataset.backup}</b>`
      : `<b>${String(idx + 1).padStart(2, '0')}</b> / ${String(mainCount).padStart(2, '0')}`;
    cProg.parentElement.style.setProperty('--p', Math.min(1, (idx + 1) / mainCount));
    history.replaceState(null, '', `${location.search}#${idx + 1}`);
    updateNotes();
    renderMenu();
    updateDots();
  }
  function updateDots() {
    const s = slides[idx];
    const n = nStates(s);
    const cur = +s.dataset.s;
    if (cDots.dataset.k !== String(idx)) {
      cDots.dataset.k = idx;
      cDots.innerHTML = n ? Array.from({ length: n + 1 }, (_, i) => `<i style="--i:${i}"></i>`).join('') : '';
    }
    [...cDots.children].forEach((d, i) => { d.classList.toggle('on', i <= cur); d.classList.toggle('cur', i === cur); });
  }

  // Regla técnica en los bordes
  (() => {
    const svg = document.querySelector('.chrome .ruler');
    let d = '';
    for (let x = 150; x <= 1770; x += 30) d += `M${x} 1080 v${x % 150 === 0 ? -10 : -5}`;
    for (let y = 150; y <= 930; y += 30) d += `M1920 ${y} h${y % 150 === 0 ? -10 : -5}`;
    svg.innerHTML = `<path d="${d}"/>`;
  })();

  /* ---------- Notas y vista de presentador ---------- */
  const drawer = document.getElementById('drawer');
  const notesHtml = s => { const n = s.querySelector('aside.notes'); return n ? n.innerHTML : '<p>Sin notas.</p>'; };
  let startedAt = Date.now();
  let slideStart = Date.now();
  function updateNotes() {
    const s = slides[idx];
    document.getElementById('d-meta').innerHTML = `<span>${label(s)} · ${s.dataset.title}</span><span>${s.dataset.who || ''}</span><span>⏱ ${s.dataset.time || ''}</span>`;
    document.getElementById('d-txt').innerHTML = notesHtml(s);
    if (isPresenter) {
      document.getElementById('pv-title').textContent = `${label(s)} · ${s.dataset.title}`;
      document.getElementById('pv-meta').textContent = `${s.dataset.who || ''} · objetivo ${s.dataset.time || '—'} · ${s.dataset.ref || ''}`;
      document.getElementById('pv-notes').innerHTML = notesHtml(s);
      const nx = slides[idx + 1];
      document.getElementById('pv-next').textContent = nx ? `${label(nx)} · ${nx.dataset.title}` : 'Fin';
      slideStart = Date.now();
    }
  }
  if (isPresenter) {
    document.body.classList.add('presenter');
    const f = ms => { const t = Math.floor(ms / 1000); return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };
    setInterval(() => {
      const total = Date.now() - startedAt;
      const clock = document.getElementById('pv-clock');
      clock.textContent = f(total);
      clock.classList.toggle('over', total > 30 * 60 * 1000);
      document.getElementById('pv-sclock').textContent = `en esta: ${f(Date.now() - slideStart)} · estado ${slides[idx].dataset.s}/${nStates(slides[idx])}`;
    }, 500);
    document.querySelectorAll('.pv button').forEach(b => b.addEventListener('click', () => {
      const cmd = b.dataset.cmd;
      if (cmd === 'next') next();
      if (cmd === 'prev') prev();
      if (cmd === 'reset') { startedAt = Date.now(); slideStart = Date.now(); }
    }));
  }

  function broadcast() { channel?.postMessage({ idx, s: +slides[idx].dataset.s }); }
  if (channel) {
    channel.onmessage = ({ data }) => {
      if (data.idx !== idx) go(data.idx, { silent: true, back: data.idx < idx, state: data.s });
      else setState(slides[idx], data.s, { silent: true });
    };
  }

  /* ---------- Índice ---------- */
  const menu = document.getElementById('menu');
  const menuList = document.getElementById('menu-list');
  function renderMenu() {
    menuList.innerHTML = slides.map((s, i) =>
      `<li style="--i:${i}"><button data-i="${i}" class="${i === idx ? 'cur' : ''}"><span class="n">${label(s)}</span><span>${s.dataset.title}</span><span class="w">${s.dataset.backup ? 'R' : s.dataset.who}</span></button></li>`
    ).join('');
  }
  menuList.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    closeOverlays();
    go(+b.dataset.i);
  });
  function closeOverlays() { document.querySelectorAll('.overlay.open').forEach(o => o.classList.remove('open')); }
  document.querySelectorAll('.overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); }));

  /* ---------- Reloj de la pregunta de control ---------- */
  let quizTimer = null;
  function startQuizTimer() {
    const s = slides[idx];
    const ring = s.querySelector('.timer-ring');
    if (!ring) return;
    stopQuizTimer(s);
    const fg = ring.querySelector('.fg');
    const txt = ring.querySelector('text');
    const len = 2 * Math.PI * 100;
    fg.style.strokeDasharray = len;
    const t0 = Date.now();
    quizTimer = setInterval(() => {
      const left = Math.max(0, 30 - (Date.now() - t0) / 1000);
      txt.textContent = Math.ceil(left);
      fg.style.strokeDashoffset = len * (1 - left / 30);
      fg.style.stroke = left < 8 ? 'var(--danger)' : 'var(--ice)';
      if (left <= 0) stopQuizTimer(s);
    }, 100);
  }
  function stopQuizTimer(s) {
    clearInterval(quizTimer);
    quizTimer = null;
    const ring = s && s.querySelector('.timer-ring');
    if (ring && !s.classList.contains('is-active')) {
      ring.querySelector('text').textContent = '30';
      ring.querySelector('.fg').style.strokeDashoffset = 0;
      ring.querySelector('.fg').style.stroke = '';
    }
  }
  document.querySelectorAll('.timer-ring').forEach(r => r.addEventListener('click', e => { e.stopPropagation(); startQuizTimer(); }));

  /* ---------- Teclado, clic y gestos ---------- */
  addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key;
    if (k === 'Escape') { closeOverlays(); drawer.classList.remove('open'); return; }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) {
      if (k === 'Enter' && document.activeElement?.closest?.('.hit, button')) { document.activeElement.dispatchEvent(new MouseEvent('click', { bubbles: true })); e.preventDefault(); return; }
      e.preventDefault(); next();
    }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(mainCount - 1);
    else if (k === 'm' || k === 'M') { document.getElementById('help').classList.remove('open'); menu.classList.toggle('open'); }
    else if (k === '?' || k === 'h' || k === 'H') { menu.classList.remove('open'); document.getElementById('help').classList.toggle('open'); }
    else if (k === 'n' || k === 'N') drawer.classList.toggle('open');
    else if (k === 'f' || k === 'F') toggleFullscreen();
    else if (k === 'p' || k === 'P') window.open(`${location.pathname}?presentador#${idx + 1}`, 'presentador', 'width=1100,height=700');
    else if (k === 't' || k === 'T') startQuizTimer();
    else if (/^[abcd]$/i.test(k) && slides[idx].querySelector('.opt')) scene(slides[idx]).choose?.(slides[idx], k.toLowerCase());
  });

  stage.addEventListener('click', e => {
    if (e.target.closest('button, a, .hit, .timer-ring')) return;
    const r = stage.getBoundingClientRect();
    if (e.clientX - r.left < r.width * 0.25) prev(); else next();
  });

  let tx = null;
  addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    tx = null;
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  const hint = document.getElementById('hint');
  setTimeout(() => { hint.style.opacity = 0; }, 6000);

  /* ---------- Inicio ---------- */
  fit();
  const start = parseInt(location.hash.slice(1), 10);
  const first = Number.isFinite(start) ? Math.max(0, Math.min(slides.length - 1, start - 1)) : 0;
  idx = first;
  go(first, { silent: true });
  addEventListener('hashchange', () => {
    const h = parseInt(location.hash.slice(1), 10);
    if (Number.isFinite(h) && h - 1 !== idx) go(h - 1);
  });
})();
