/* =========================================================
   Motor de la presentación · Módulo D · NFPA 70E
   Navegación, estados internos, transiciones, cromo, notas y presentador
   ========================================================= */
(() => {
  const stage = document.getElementById('stage');
  const slides = [...stage.querySelectorAll('.slide')];
  const mainCount = slides.filter(s => !s.dataset.backup).length;
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = motionPreference.matches;
  motionPreference.addEventListener('change', e => { reduced = e.matches; });
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
  // Solo el sigilo de la portada usa --mx/--my: se fijan en él y no en el escenario,
  // para no invalidar el estilo de todo el árbol en cada movimiento del cursor
  const sigil = stage.querySelector('.hero .sigil');
  let pointer = null;
  addEventListener('mousemove', e => {
    if (reduced) return;
    if (!pointer) requestAnimationFrame(() => {
      if (slides[idx].classList.contains('hero')) {
        sigil.style.setProperty('--mx', ((pointer.clientX / innerWidth) * 2 - 1).toFixed(3));
        sigil.style.setProperty('--my', ((pointer.clientY / innerHeight) * 2 - 1).toFixed(3));
      }
      pointer = null;
    });
    pointer = e;
  });

  /* ---------- Construcción de escenas ---------- */
  slides.forEach(s => { s.dataset.s = 0; try { scene(s).build?.(s); } catch (err) { console.error(s.id, err); } });

  /* ---------- Retrasos escalonados ---------- */
  slides.forEach(slide => {
    slide.querySelectorAll('.rv').forEach((el, i) => el.style.setProperty('--d', `${180 + Math.min(i, 9) * 60}ms`));
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
  // A navigation owns its delayed effects; interrupted cuts cannot reappear later.
  const txTimers = new Set(), txFrames = new Set();
  function txLater(fn, delay) {
    const id = setTimeout(() => { txTimers.delete(id); fn(); }, delay);
    txTimers.add(id); return id;
  }
  function txFrame(fn) {
    const id = requestAnimationFrame(() => { txFrames.delete(id); fn(); });
    txFrames.add(id); return id;
  }
  function cancelTransitionWork() {
    txTimers.forEach(clearTimeout); txTimers.clear();
    txFrames.forEach(cancelAnimationFrame); txFrames.clear();
    fxG.getAnimations({ subtree: true }).forEach(a => a.cancel());
    fxG.replaceChildren();
    cracks.getAnimations({ subtree: true }).forEach(a => a.cancel());
    cracks.replaceChildren();
    flashEl.getAnimations().forEach(a => a.cancel());
  }

  function go(n, { silent = false, back = false, state = null } = {}) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    const prev = slides[idx];
    const next = slides[n];
    if (n === idx && next.classList.contains('is-active')) return;
    back = back || n < idx;
    cancelTransitionWork();

    // Restos de una transición interrumpida: mira, fragmentos y esquirlas
    stage.querySelectorAll('.dive-fx, .shards, .fx [data-cut]').forEach(e => e.remove());
    stage.querySelectorAll('.breaking').forEach(e => e.classList.remove('breaking'));
    clearTimeout(collapseT);
    if (leaving) { leaving.getAnimations().forEach(a => a.cancel()); leaving.classList.remove('is-leaving'); leaving.style.zIndex = ''; leaving.style.transformOrigin = ''; }
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

  /* ---------- Salto a una slide adicional y regreso ---------- */
  let returnTo = null;
  function jumpTo(id) {
    const n = slides.findIndex(s => s.id === id);
    if (n < 0) return;
    returnTo = idx;
    slides[n].querySelectorAll('[data-return]').forEach(b => { b.hidden = false; });
    go(n);
  }
  function jumpBack() {
    if (returnTo === null) return false;
    const n = returnTo;
    returnTo = null;
    slides.forEach(s => s.querySelectorAll('[data-return]').forEach(b => { b.hidden = true; }));
    go(n, { back: true });
    return true;
  }
  stage.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); jumpTo(b.dataset.goto); }));
  stage.querySelectorAll('[data-return]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); jumpBack(); }));

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
  const NARRATIVE_TX = new Set(['cleave', 'absorb', 'converge', 'collapse', 'fracture']);
  // Ritmo global: conserva las transiciones narrativas, pero libera la escena
  // antes para que una navegación rápida no deje fragmentos sobre la siguiente slide.
  const SLOW = 1.18;

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

  /* Tajo (02 → 03): geometría del corte diagonal. s recorre el corte, d es la
     distancia perpendicular (+ hacia abajo a la derecha). */
  const CUT = (() => {
    const a = [-200, 960], b = [2120, 140];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [-u[1], u[0]];
    const at = (s, d) => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d];
    return { L, u, n, at, open: 1200, delay: 300, dur: 1600, easing: 'cubic-bezier(.6,0,.2,1)' };
  })();
  // La 03 aparece en la brecha: una banda que se abre al mismo ritmo que se separan las mitades
  TX.cleave = () => ({
    dur: CUT.dur, easing: CUT.easing, delay: CUT.delay,
    frames: sample(1, p => {
      const g = CUT.open * p, { L, at } = CUT;
      return { next: poly([at(-2000, -g), at(L + 2000, -g), at(L + 2000, g), at(-2000, g)]) };
    })
  });

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
    const ptx = prevEl?.dataset.tx;
    const requestedKind = back ? ptx : nextEl.dataset.tx;
    const kind = NARRATIVE_TX.has(requestedKind) ? requestedKind : 'dissolve';
    if (reduced || !prevEl || kind === 'dissolve') {
      const duration = reduced ? 180 : 360;
      // La salida es más corta que la entrada y se desenfoca: así las dos slides
      // no se superponen a media opacidad (doble imagen) durante el fundido.
      const exit = reduced ? duration : Math.round(duration * 0.6);
      nextEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing: EXPO, fill: 'backwards' });
      if (prevEl) {
        const out = reduced ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(6px)' }];
        prevEl.animate(out, { duration: exit, easing: EXPO, fill: 'forwards' });
        leave(prevEl, exit, true);
      }
      return;
    }
    if (kind === 'collapse' && (back ? nextEl : prevEl).id === 's14') {
      collapse(back ? nextEl : prevEl, back ? prevEl : nextEl, back);
      return;
    }
    if (kind === 'converge' && (back ? nextEl : prevEl).id === 's13') {
      converge(back ? nextEl : prevEl, back ? prevEl : nextEl, back);
      return;
    }
    if (kind === 'absorb' && (back ? nextEl : prevEl).dataset.zoom && (back ? prevEl : nextEl).dataset.focus) {
      dive(back ? nextEl : prevEl, back ? prevEl : nextEl, back);
      return;
    }
    const origin = pt(nextEl.dataset.origin);
    const t = TX[kind](back, origin);
    const opt = { duration: t.dur * SLOW, easing: t.easing, delay: (t.delay || 0) * SLOW };

    // Salida
    if (t.frames?.[0].prev) {
      prevEl.animate(t.frames.map(f => ({ clipPath: f.prev })), { ...opt, fill: 'forwards' });
      leave(prevEl, opt.duration + opt.delay, true);
    } else if (kind === 'fracture' || kind === 'cleave') {
      const dur = kind === 'cleave' ? cleave(prevEl) : shatter(prevEl, origin);
      prevEl.animate([{ opacity: 0 }, { opacity: 0 }], { duration: dur, fill: 'forwards' });
      leave(prevEl, dur, true);
    } else if (kind === 'reconstruct') {
      prevEl.animate([{ opacity: 1, filter: 'blur(0px) saturate(1)' }, { opacity: 0, filter: 'blur(4px) saturate(0)' }], { duration: 800 * SLOW, easing: EXPO, fill: 'forwards' });
      leave(prevEl, 800 * SLOW, true);
    } else {
      leave(prevEl, (back ? 500 : 650) * SLOW, false);
    }

    // Entrada
    nextEl.animate(t.raw || t.frames.map(f => ({ clipPath: f.next })), { ...opt, fill: 'backwards' });
    if (t.frames?.[0].edge != null) edgeLight(t.frames.map(f => f.edge), opt, t.dir, kind === 'slash', kind);
    if (kind === 'expand') window.Ambient?.burst(...toWin(...origin), [143, 227, 255], 36);
  }

  /* Inmersión (12 → 13): una mira fija la celda 119, la cámara entra en ella y su
     contorno se convierte en el recipiente del corte de la 13, que se abre hasta
     llenar la pantalla. data-zoom = celda en la 12 · data-focus = celda en la 13.
     Al retroceder, la cámara sale: la 13 se cierra en su celda y la 12 se aleja. */
  const rectD = ([x, y, w, h]) => `M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z`;
  const insetOf = ([x, y, w, h]) => `inset(${y}px ${W - x - w}px ${H - y - h}px ${x}px)`;
  function dive(outer, inner, back) {
    const src = pt(outer.dataset.zoom), dst = pt(inner.dataset.focus);
    const [sx, sy, sw, sh] = src, [dx, dy, dw, dh] = dst;
    // La celda 119 queda exactamente sobre la celda de la 13
    const kx = dw / sw, ky = dh / sh;
    const tx = dx + dw / 2 - kx * (sx + sw / 2), ty = dy + dh / 2 - ky * (sy + sh / 2);
    const zoomed = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${kx.toFixed(3)}, ${ky.toFixed(3)})`;
    const DIVE = 'cubic-bezier(.66,0,.24,1)';
    const full = [-6, -6, W + 12, H + 12], out = [-90, -90, W + 180, H + 180];
    const cellC = [dx + dw / 2, dy + dh / 2];
    outer.style.transformOrigin = '0 0';

    if (!back) {
      const lock = 420 * SLOW, zoom = 1150 * SLOW, zStart = 260 * SLOW;
      const open = 1500 * SLOW, oStart = zStart + zoom * 0.86, hold = 0.24;
      // Mira y velo: viven dentro de la 12, así entran con la cámara
      const fx = document.createElementNS(SVGNS, 'svg');
      fx.setAttribute('viewBox', `0 0 ${W} ${H}`);
      fx.setAttribute('class', 'dive-fx');
      const m = 10, [bx, by, bw, bh] = [sx - m, sy - m, sw + 2 * m, sh + 2 * m];
      const veil = fxEl('path', { class: 'dive-veil', d: `M-40 -40 H${W + 40} V${H + 40} H-40 Z ${rectD([bx, by, bw, bh])}` }, fx);
      const ret = fxEl('g', { class: 'dive-ret' }, fx);
      const c = 14;
      [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx + bw, by + bh, -1, -1], [bx, by + bh, 1, -1]].forEach(([x, y, u, v]) =>
        fxEl('path', { d: `M${x} ${y + v * c} L${x} ${y} L${x + u * c} ${y}` }, ret));
      fxEl('text', { x: bx + bw / 2, y: by - 16, 'text-anchor': 'middle', class: 'dive-t' }, ret).textContent = 'CELDA 119';
      for (let i = 0; i < 9; i++) {
        const b = fxEl('circle', { cx: (sx + 6 + Math.random() * (sw - 12)).toFixed(1), cy: (sy + sh - 6).toFixed(1), r: (0.6 + Math.random() * 0.5).toFixed(2), class: 'dive-b' }, fx);
        b.animate([{ transform: 'translateY(0)', opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: `translateY(${-(sh * 0.7).toFixed(0)}px)`, opacity: 0 }],
          { duration: 700 + Math.random() * 500, delay: zStart + Math.random() * zoom * 0.6, iterations: 2, fill: 'both' });
      }
      outer.appendChild(fx);
      veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: lock, easing: EXPO, fill: 'both' });
      ret.style.transformOrigin = `${sx + sw / 2}px ${sy + sh / 2}px`;
      ret.animate([{ opacity: 0, transform: 'scale(2.2) rotate(-8deg)' }, { opacity: 1, transform: 'none' }], { duration: lock, easing: EXPO, fill: 'both' });
      ret.animate([{ opacity: 1 }, { opacity: 0 }], { duration: zoom * 0.4, delay: zStart + zoom * 0.35, fill: 'forwards', composite: 'replace' });
      window.Ambient?.burst(...toWin(sx + sw / 2, sy + sh / 2), [143, 227, 255], 22);

      // La cámara entra
      outer.animate([{ transform: 'none', filter: 'blur(0px)' }, { transform: zoomed, filter: 'blur(1.5px)' }],
        { duration: zoom, delay: zStart, easing: DIVE, fill: 'forwards' });
      outer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: open * 0.35, delay: oStart + open * hold, easing: 'ease-in', fill: 'forwards' });

      // La celda de la 13 aparece sobre la 119 y se abre hasta llenar la pantalla
      inner.style.transformOrigin = `${cellC[0]}px ${cellC[1]}px`;
      inner.animate([
        { clipPath: insetOf(dst), opacity: 0, transform: 'scale(1.04)', easing: 'linear' },
        { clipPath: insetOf(dst), opacity: 1, transform: 'scale(1.04)', offset: hold, easing: EXPO },
        { clipPath: insetOf(full), opacity: 1, transform: 'none' }
      ], { duration: open, delay: oStart, fill: 'backwards' });
      edgeLight([rectD(dst), rectD(out)], { duration: open * (1 - hold), delay: oStart + open * hold, easing: EXPO }, 'c', false);
      txLater(() => window.Ambient?.burst(...toWin(...cellC), [143, 227, 255], 34), oStart + open * hold);
      const total = oStart + open;
      txLater(() => { fx.remove(); if (inner.classList.contains('is-active')) inner.style.transformOrigin = ''; }, total + 80);
      leave(outer, total, true);
    } else {
      // La cámara sale: la 13 se cierra en su celda y la 12 retrocede hasta su escala
      const close = 800 * SLOW, zoom = 1050 * SLOW, zStart = close * 0.55;
      inner.animate([
        { clipPath: insetOf(full), opacity: 1, easing: 'cubic-bezier(.7,0,.3,1)' },
        { clipPath: insetOf(dst), opacity: 1, offset: 0.7 },
        { clipPath: insetOf(dst), opacity: 0 }
      ], { duration: close, fill: 'forwards' });
      edgeLight([rectD(out), rectD(dst)], { duration: close * 0.7, easing: 'cubic-bezier(.7,0,.3,1)' }, 'c', false);
      outer.animate([
        { transform: zoomed, opacity: 0, filter: 'blur(1.5px)' },
        { opacity: 1, offset: 0.25 },
        { transform: 'none', opacity: 1, filter: 'blur(0px)' }
      ], { duration: zoom, delay: zStart, easing: DIVE, fill: 'backwards' });
      txLater(() => { if (outer.classList.contains('is-active')) outer.style.transformOrigin = ''; }, zStart + zoom + 60);
      leave(inner, close, true);
    }
  }

  /* Convergencia (13 → 14): los tres ingredientes que se ven en la celda —H₂ y O₂ del
     espacio de gas y la chispa externa— se desprenden, vuelan y se convierten en los
     vértices del triángulo del fuego; el hilo se cierra entre ellos. Al retroceder,
     los vértices regresan a la celda. */
  const TOKENS = [
    { t: 'H₂', from: [426, 460], to: 'h', col: '#8fe3ff', end: '#ff4d6d', burst: [255, 77, 109] },
    { t: 'O₂', from: [496, 460], to: 'o', col: '#ece9f7', end: 'rgba(236,233,247,.58)', burst: [201, 184, 255] },
    { t: 'IGN', from: [460, 226], to: 'ig', col: '#ff8a64', end: '#ff4d6d', burst: [255, 138, 100] }
  ];
  function converge(cell, tri, back) {
    const T = window.GEO.tri;
    const fly = 1150 * SLOW, fStart = back ? 160 * SLOW : (BLAST.at + 60) * SLOW, arrive = fStart + fly;
    // El hilo se tiende entre las fichas mientras vuelan: el triángulo se cierra cuando llegan
    window.Thread?.to(back ? 'gas' : 'tri', { dur: arrive });
    const layers = TOKENS.map((k, i) => {
      const a = k.from, b = T[k.to];
      const [p0, p1] = back ? [b, a] : [a, b];
      const l = fxLayer([p0[0] - 80, p0[1] - 80, 160, 160], 'fx-tok', p0);
      const c = fxEl('circle', { cx: p0[0], cy: p0[1], r: 52, class: 'fx-tok-c' }, l);
      fxEl('text', { x: p0[0], y: p0[1] + 11, 'text-anchor': 'middle', class: 'fx-tok-t' }, l).textContent = k.t;
      // Trayectoria curva: se abre hacia afuera del centro del triángulo
      const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
      const bend = (i === 1 ? -1 : 1) * 0.22;
      const mx = dx * 0.5 - dy * bend, my = dy * 0.5 + dx * bend;
      const [s0, s1] = back ? [1, 0.42] : [0.42, 1];
      const delay = fStart + i * 90 * SLOW;
      l.animate([
        { transform: `translate(0,0) scale(${s0})`, opacity: 0 },
        { transform: `translate(0,0) scale(${s0})`, opacity: 1, offset: 0.1 },
        { transform: `translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px) scale(${(s0 + s1) / 2})`, opacity: 1, offset: 0.55 },
        { transform: `translate(${dx}px, ${dy}px) scale(${s1})`, opacity: 1, offset: 0.9 },
        { transform: `translate(${dx}px, ${dy}px) scale(${s1})`, opacity: 0 }
      ], { duration: fly, delay, easing: 'cubic-bezier(.55,0,.25,1)', fill: 'both' });
      const [c0, c1] = back ? [k.end, k.col] : [k.col, k.end];
      c.animate([{ stroke: c0 }, { stroke: c0, offset: 0.45 }, { stroke: c1 }], { duration: fly, delay, fill: 'both' });
      txLater(() => window.Ambient?.burst(...toWin(...p1), back ? [143, 227, 255] : k.burst, 20), delay + fly * 0.9);
      return l;
    });
    if (!back) batteryBlast(layers.map((l, i) => [T[TOKENS[i].to], fStart + i * 90 * SLOW + fly * 0.9]));
    const gone = back ? tri : cell, come = back ? cell : tri;
    // La celda sale subiendo, como el gas; el triángulo se enciende cuando llegan los vértices
    if (back) {
      gone.animate([{ opacity: 1, transform: 'none', filter: 'blur(0px)' }, { opacity: 0, transform: 'translateY(60px)', filter: 'blur(8px)' }],
        { duration: 900 * SLOW, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' });
    } else {
      // Presión: la 13 se hincha alrededor de la celda y tiembla; al detonar se apaga de golpe
      const D = BLAST.at * SLOW;
      gone.style.transformOrigin = `${BLAST.x}px ${BLAST.y + 180}px`;
      gone.animate([
        { transform: 'none', opacity: 1, easing: 'cubic-bezier(.5,0,1,1)' },
        { transform: 'scale(1.012) translate(2px, -1px)', opacity: 1, offset: 0.45 },
        { transform: 'scale(1.02) translate(-2px, 1px)', opacity: 1, offset: 0.7 },
        { transform: 'scale(1.035) translate(2px, 0)', opacity: 1, offset: 0.92 },
        { transform: 'scale(1.05)', opacity: 0 }
      ], { duration: D + 90, fill: 'forwards' });
    }
    // Solo opacidad y transformación: la GPU compone la entrada sin repintar la slide
    come.animate([
      { opacity: 0, transform: back ? 'translateY(-60px)' : 'scale(.97)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 800 * SLOW, delay: arrive - 380 * SLOW, easing: EXPO, fill: 'backwards' });
    const total = arrive + 2 * 90 * SLOW;
    txLater(() => layers.forEach(l => l.remove()), total + 80);
    leave(gone, 900 * SLOW, true);
  }

  /* La batería estalla (13 → 14). Presión: la celda se hincha y la tapa se agrieta.
     Detonación en el espacio de gas: bola de fuego, onda expansiva y destello; las piezas
     reales de la celda —tapa, apagallamas, bornes, paredes, fondo y placas— salen
     despedidas en todas direcciones con giro y caída, y el electrolito sale en gotas.
     Cada pieza es una capa SVG pequeña que se pinta una vez: la GPU solo la mueve. */
  const BLAST = { x: 460, y: 460, at: 300 };
  function batteryBlast(hits) {
    const D = BLAST.at * SLOW, { x: ox, y: oy } = BLAST;
    let last = 0;
    const layer = (pts, cls, c) => {
      const l = fxLayer(bboxOf(pts, 6), 'fx-blast', c);
      fxEl('polygon', { class: cls, points: pts2(pts) }, l);
      return l;
    };
    // Presión: grietas que corren por la tapa y las paredes
    const cracksG = fxLayer([220, 320, 480, 600], '', [ox, oy]);
    [[[300, 380], [340, 392], [372, 384], [404, 396]], [[560, 386], [600, 380], [640, 392]], [[244, 430], [256, 470], [248, 520]],
      [[676, 450], [668, 500], [678, 540]], [[440, 372], [452, 360], [470, 372], [486, 360]]].forEach(c => {
      const path = fxEl('polyline', { class: 'fx-crack', points: pts2(c), pathLength: 1 }, cracksG);
      path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: D * 0.8, delay: D * 0.15, easing: 'ease-in', fill: 'both' });
    });
    cracksG.animate([{ opacity: 1 }, { opacity: 1, offset: 0.95 }, { opacity: 0 }], { duration: D + 40, fill: 'both' });
    // Brillo interior creciente en el espacio de gas
    const pre = fxLayer([ox - 220, oy - 80, 440, 160], '', [ox, oy]);
    fxEl('ellipse', { cx: ox, cy: oy, rx: 220, ry: 80, class: 'fx-fire' }, pre);
    pre.animate([{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(.8)', opacity: 0.9 }], { duration: D, easing: 'cubic-bezier(.6,0,1,1)', fill: 'both' });
    pre.animate([{ opacity: 0.9 }, { opacity: 0 }], { duration: 160, delay: D, fill: 'forwards' });

    // Las capas se crean en lotes durante la fase de presión: ningún cuadro carga con todo.
    // dl() = lo que falta para la detonación en el instante en que se crea cada lote.
    const t0 = performance.now();
    const dl = () => Math.max(0, D - (performance.now() - t0));
    const later = (t, fn) => txLater(fn, t);

    // Detonación
    txLater(() => { flash(); window.Ambient?.burst(...toWin(ox, oy), [255, 170, 120], 70); }, D);
    later(D * 0.25, () => {
    const D = dl();
    const fire = fxLayer([ox - 420, oy - 420, 840, 840], '', [ox, oy]);
    fxEl('circle', { cx: ox, cy: oy, r: 420, class: 'fx-fire' }, fire);
    fire.animate([
      { transform: 'scale(.05)', opacity: 0 },
      { transform: 'scale(.55)', opacity: 1, offset: 0.12 },
      { transform: 'scale(1.1)', opacity: 0 }
    ], { duration: 950 * SLOW, delay: D, easing: 'cubic-bezier(.1,.8,.3,1)', fill: 'both' });
    const shock = fxLayer([ox - 900, oy - 900, 1800, 1800], '', [ox, oy]);
    fxEl('circle', { cx: ox, cy: oy, r: 880, class: 'fx-shock' }, shock);
    shock.animate([{ transform: 'scale(.04)', opacity: 1 }, { transform: 'scale(1)', opacity: 0 }],
      { duration: 900 * SLOW, delay: D, easing: 'cubic-bezier(.1,.7,.3,1)', fill: 'both' });
    glint(ox, oy, 120, D, 520 * SLOW, true);
    });

    // Piezas de la celda: cada una huye del punto de detonación
    later(D * 0.45, () => {
    const D = dl();
    const R = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    const parts = [
      // tapa en tres trozos, apagallamas y bornes: salen hacia arriba y a los lados
      [R(232, 372, 150, 26), 'fx-case'], [R(382, 372, 150, 26), 'fx-case'], [R(532, 372, 156, 26), 'fx-case'],
      [R(430, 330, 60, 50), 'fx-cap'], [R(284, 330, 32, 90), 'fx-post'], [R(604, 330, 32, 90), 'fx-post'],
      // paredes partidas y fondo
      [R(236, 398, 8, 250), 'fx-case'], [R(236, 648, 8, 252), 'fx-case'], [R(676, 398, 8, 250), 'fx-case'], [R(676, 648, 8, 252), 'fx-case'],
      [R(240, 892, 220, 8), 'fx-case'], [R(460, 892, 220, 8), 'fx-case'],
      // placas (negativas y positivas alternadas)
      ...Array.from({ length: 9 }, (_, j) => [R(282 + j * 44, 592, 12, 260), j % 2 ? 'fx-plate-p' : 'fx-plate-n'])
    ];
    parts.forEach(([pts, cls]) => {
      const cx = pts.reduce((a, p) => a + p[0], 0) / 4, cy = pts.reduce((a, p) => a + p[1], 0) / 4;
      let dx = cx - ox, dy = cy - oy;
      const L = Math.hypot(dx, dy) || 1;
      dx /= L; dy /= L;
      const heavy = cls.startsWith('fx-plate') ? 0.7 : 1;
      const v = (560 + Math.random() * 480) * heavy;
      const rot = (Math.random() - 0.5) * 540;
      const l = layer(pts, cls, [cx, cy]);
      const tx = dx * v, ty = dy * v;
      l.animate([
        { transform: 'none', easing: 'cubic-bezier(.12,.6,.35,1)' },
        { transform: `translate(${(tx * 0.75).toFixed(1)}px, ${(ty * 0.75).toFixed(1)}px) rotate(${(rot * 0.6).toFixed(0)}deg)`, offset: 0.55, easing: 'cubic-bezier(.4,0,1,1)' },
        { transform: `translate(${tx.toFixed(1)}px, ${(ty + 260).toFixed(1)}px) rotate(${rot.toFixed(0)}deg)` }
      ], { duration: (1500 + Math.random() * 400) * SLOW, delay: D, fill: 'both' });
      l.animate([{ opacity: 1 }, { opacity: 1, offset: 0.55 }, { opacity: 0 }], { duration: 1500 * SLOW, delay: D, fill: 'both' });
    });
    });

    // Electrolito: gotas en todas direcciones que caen
    later(D * 0.65, () => {
    const D = dl();
    for (let k = 0; k < 24; k++) {
      const a = Math.random() * Math.PI * 2, v = 300 + Math.random() * 700;
      const x = ox + Math.cos(a) * 30, y = oy + 80 + Math.sin(a) * 30, r = 2 + Math.random() * 4;
      const d = fxLayer([x - r - 2, y - r - 2, 2 * r + 4, 2 * r + 4], '', [x, y]);
      fxEl('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: r.toFixed(1), class: 'fx-drop' }, d);
      d.animate([
        { transform: 'translate(0,0)', opacity: 1, easing: 'cubic-bezier(.05,.7,.4,1)' },
        { transform: `translate(${(Math.cos(a) * v * 0.85).toFixed(0)}px, ${(Math.sin(a) * v * 0.85).toFixed(0)}px)`, opacity: 1, offset: 0.5, easing: 'cubic-bezier(.4,0,1,1)' },
        { transform: `translate(${(Math.cos(a) * v).toFixed(0)}px, ${(Math.sin(a) * v + 320).toFixed(0)}px)`, opacity: 0 }
      ], { duration: (1100 + Math.random() * 500) * SLOW, delay: D + Math.random() * 60, fill: 'both' });
    }
    // Pocas esquirlas de cristal de acento
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2 + Math.random() * 0.5;
      const cx = ox + Math.cos(a) * 60, cy = oy + Math.sin(a) * 60;
      const e = svgShard(sliver(cx, cy, 70 + Math.random() * 60, 16 + Math.random() * 12, a), 'ice', [cx, cy]);
      const v = 800 + Math.random() * 600;
      const timing = { duration: 1300 * SLOW, delay: D, easing: 'cubic-bezier(.05,.75,.3,1)', fill: 'both' };
      e.animate([{ transform: 'scale(.3)' }, { transform: `translate(${(Math.cos(a) * v).toFixed(0)}px, ${(Math.sin(a) * v + 150).toFixed(0)}px) rotate(${((Math.random() - 0.5) * 300).toFixed(0)}deg)` }], timing);
      e.animate([{ opacity: 0 }, { opacity: 1, offset: 0.06 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { ...timing, easing: 'linear' });
    }
    });

    // Cada vértice estalla al recibir su ficha (sus esquirlas se crean poco antes)
    hits.forEach(([[vx, vy], t]) => later(t - 220, () => {
      const lag = Math.max(0, t - (performance.now() - t0));
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2 + Math.random() * 0.5;
        const cx = vx + Math.cos(a) * 56, cy = vy + Math.sin(a) * 56;
        const e = svgShard(sliver(cx, cy, 44 + Math.random() * 40, 10 + Math.random() * 8, a), 'ice', [cx, cy]);
        const v = 110 + Math.random() * 130;
        const timing = { duration: 800 * SLOW, delay: Math.max(0, lag - 40), easing: 'cubic-bezier(.08,.75,.3,1)', fill: 'both' };
        e.animate([{ transform: 'scale(.3)' }, { transform: `translate(${(Math.cos(a) * v).toFixed(0)}px, ${(Math.sin(a) * v + 30).toFixed(0)}px) rotate(${((Math.random() - 0.5) * 200).toFixed(0)}deg)` }], timing);
        e.animate([{ opacity: 0 }, { opacity: 1, offset: 0.08 }, { opacity: 1, offset: 0.45 }, { opacity: 0 }], { ...timing, easing: 'linear' });
      }
    }));
    last = Math.max(D + 1900 * SLOW, ...hits.map(h => h[1] + 800 * SLOW));
    txLater(() => stage.querySelectorAll('.fx [data-cut]').forEach(e => e.remove()), last + 80);
  }

  /* La teoría se rompe (14 → 15): en el Caso 4 las barreras no estaban. Los escudos
     estallan en esquirlas, los vértices vuelven a rojo y el triángulo se cierra; luego la
     slide colapsa en una línea —el triángulo se estira hasta ser la línea de tiempo— y
     la 15 se abre desde esa línea con dos filos de luz que se separan. */
  let collapseT = 0;
  function collapse(tri, tl, back) {
    const y = window.GEO.tl.y;
    const fail = back ? 0 : 380 * SLOW, shut = 420 * SLOW, open = 820 * SLOW;
    const oStart = fail + shut * 0.8;
    const gone = back ? tl : tri, come = back ? tri : tl;
    if (!back) {
      // 1 · Fallan las barreras
      tri.classList.add('breaking');
      const boom = tri.querySelector('.boom-t');
      if (boom) window.Scramble?.(boom, 'CASO 4 · FALLARON', '', 340 * SLOW);
      window.Thread?.to('tri', { dur: 320 });
      const T = window.GEO.tri;
      const c = [(T.o[0] + T.h[0] + T.ig[0]) / 3, (T.o[1] + T.h[1] + T.ig[1]) / 3];
      [T.h, T.ig].forEach(([vx, vy], j) => {
        const a0 = Math.atan2(c[1] - vy, c[0] - vx);
        for (let k = 0; k < 7; k++) {
          const a = a0 + (k - 3) * 0.3;
          const cx = vx + Math.cos(a) * 84, cy = vy + Math.sin(a) * 84;
          const e = svgShard(sliver(cx, cy, 34 + Math.random() * 26, 9 + Math.random() * 6, a + Math.PI / 2), 'ice', [cx, cy]);
          const v = 90 + Math.random() * 160;
          const timing = { duration: 700 * SLOW, delay: j * 90 + Math.random() * 60, easing: 'cubic-bezier(.08,.75,.3,1)', fill: 'both' };
          e.animate([{ transform: 'none' }, { transform: `translate(${(Math.cos(a) * v).toFixed(0)}px, ${(Math.sin(a) * v + 60).toFixed(0)}px) rotate(${((Math.random() - 0.5) * 260).toFixed(0)}deg)` }], timing);
          e.animate([{ opacity: 1 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], { ...timing, easing: 'linear' });
        }
        txLater(() => window.Ambient?.burst(...toWin(vx, vy), [255, 77, 109], 18), j * 90);
      });
      // El triángulo se aplasta junto con la slide hasta ser la línea de tiempo
      collapseT = txLater(() => window.Thread?.to('tl', { dur: shut }), fail);
    }
    // 2 · Colapso sobre la línea (solo transformación y opacidad: la GPU compone)
    gone.style.transformOrigin = `960px ${y}px`;
    gone.animate([
      { transform: 'none', opacity: 1, easing: 'cubic-bezier(.7,0,.9,.4)' },
      { transform: 'scale(1.03, .006)', opacity: 1, offset: 0.85 },
      { transform: 'scale(1.1, .002)', opacity: 0 }
    ], { duration: shut, delay: fail, fill: 'forwards' });
    txLater(() => window.Ambient?.burst(...toWin(960, y), back ? [255, 138, 160] : [255, 77, 109], 40), fail + shut * 0.8);
    // 3 · Apertura desde la línea con dos filos que se separan
    come.style.transformOrigin = `960px ${y}px`;
    come.animate([
      { transform: 'scale(1.06, .004)', opacity: 0 },
      { transform: 'scale(1.04, .02)', opacity: 1, offset: 0.08 },
      { transform: 'none', opacity: 1 }
    ], { duration: open, delay: oStart, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    edgeLight([`M-40 ${y} L1960 ${y} M-40 ${y} L1960 ${y}`, `M-40 -6 L1960 -6 M-40 ${H + 6} L1960 ${H + 6}`],
      { duration: open, delay: oStart, easing: 'cubic-bezier(.16,1,.3,1)' }, 'h', false);
    const total = oStart + open;
    txLater(() => {
      tri.classList.remove('breaking');
      [gone, come].forEach(e => { if (e.classList.contains('is-active')) e.style.transformOrigin = ''; });
      stage.querySelectorAll('.fx [data-cut]').forEach(e => e.remove());
    }, total + 80);
    leave(gone, fail + shut, true);
  }

  function leave(el, dur, custom) {
    if (!custom) el.animate([{ opacity: 1, filter: 'blur(0px)', transform: 'none' }, { opacity: 0, filter: 'blur(8px)', transform: 'scale(.975)' }], { duration: dur, easing: EXPO, fill: 'forwards' });
    txLater(() => {
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
  function edgeLight(ds, opt, dir, blade, variant = '') {
    fxG.getAnimations({ subtree: true }).forEach(a => a.cancel());
    fxG.replaceChildren();
    if (!canMorphD) return;
    fxG.setAttribute('class', blade ? `blade ${isSkirkTx(variant) ? `skirk ${variant}` : ''}`.trim() : '');
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

  /* ---------- Esquirlas de cristal (tajo 02 → 03 y estallido 15 → 16) ----------
     Astillas largas y afiladas como dagas. Materiales: 'frag' (fragmento real de la
     slide, con arista de vidrio), 'void' (vacío abisal con estrellas), 'ice' (cristal
     translúcido; en el bloque del accidente se tiñe de carmesí por CSS). */
  const pts2 = pts => pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');
  const sliver = (cx, cy, len, wid, ang) => {
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const P = (a, b) => [cx + ca * a - sa * b, cy + sa * a + ca * b];
    return [P(-len / 2, 0), P(len * (-0.15 + Math.random() * 0.35), -wid * (0.55 + Math.random() * 0.45)),
      P(len / 2, 0), P(len * (-0.3 + Math.random() * 0.35), wid * (0.25 + Math.random() * 0.45))];
  };
  /* Cada efecto de luz o cristal vive en su propia capa SVG del tamaño justo: su viewBox es
     su caja en coordenadas del escenario, así el dibujo no cambia. Se anima la capa entera
     (transform/opacity): el navegador la pinta una vez y la GPU solo la mueve, en vez de
     repintar un SVG a pantalla completa —con sus desenfoques— en cada cuadro. */
  const SVGNS = 'http://www.w3.org/2000/svg';
  const fxLayers = document.getElementById('fx-layers');
  const bboxOf = (pts, m) => {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.min(...xs) - m, y0 = Math.min(...ys) - m;
    return [x0, y0, Math.max(...xs) + m - x0, Math.max(...ys) + m - y0];
  };
  function fxLayer([x, y, w, h], cls, [ox, oy]) {
    x = Math.floor(x); y = Math.floor(y); w = Math.ceil(w); h = Math.ceil(h);
    const l = document.createElementNS(SVGNS, 'svg');
    l.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
    l.setAttribute('class', `fxl ${cls}`);
    l.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform-origin:${(ox - x).toFixed(0)}px ${(oy - y).toFixed(0)}px`;
    l.dataset.cut = '';
    fxLayers.appendChild(l);
    return l;
  }
  const fxEl = (tag, attrs, parent) => {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
  };
  const svgShard = (pts, cls, c) => {
    const l = fxLayer(bboxOf(pts, 8), `fx-sl ${cls}`, c);
    const layer = (cl, p) => fxEl('polygon', { class: cl, points: pts2(p) }, l);
    if (cls !== 'wedge') {
      if (cls === 'void') { layer('fx-void', pts); layer('fx-sheen', pts); }
      if (cls === 'ice') layer('fx-ice', pts);
      layer('fx-facet', [pts[0], pts[1], pts[2]]);
    }
    layer('fx-rim-glow', pts);
    layer('fx-rim', pts);
    return l;
  };

  /* Efectos de luz de las rupturas (referencias: luz cegadora, paneles de vidrio que giran,
     destellos de cuatro puntas y picos de luz verticales). Se retiran junto con las
     esquirlas ([data-cut]). */
  // Resplandor: blanco en el centro, vira al color del bloque hacia el borde
  function bloom(cx, cy, rx, ry, rot, delay, dur) {
    const l = fxLayer([cx - rx, cy - ry, 2 * rx, 2 * ry], '', [cx, cy]);
    fxEl('ellipse', { cx: cx.toFixed(0), cy: cy.toFixed(0), rx: rx.toFixed(0), ry: ry.toFixed(0), class: 'fx-bloom' }, l);
    const r = `rotate(${rot.toFixed(1)}deg)`;
    l.animate([
      { transform: `${r} scale(.12, .04)`, opacity: 0 },
      { transform: `${r} scale(1, 1)`, opacity: 1, offset: 0.18 },
      { transform: `${r} scale(1.2, 1.45)`, opacity: 0 }
    ], { duration: dur, delay, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' });
    return delay + dur;
  }
  // Destello de cuatro puntas; 'tall' = pico vertical de luz
  function glint(x, y, size, delay, dur, tall) {
    const hy = tall ? size * 1.9 : size, hx = tall ? size * 0.42 : size, w = size * 0.16, m = 24;
    const l = fxLayer([x - hx - m, y - hy - m, 2 * (hx + m), 2 * (hy + m)], '', [x, y]);
    const g = fxEl('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }, l);
    fxEl('path', { class: 'fx-glint', d: `M0 ${-hy} L${w} ${-w} L${hx} 0 L${w} ${w} L0 ${hy} L${-w} ${w} L${-hx} 0 L${-w} ${-w} Z` }, g);
    const r = tall ? 0 : 35;
    l.animate([
      { transform: `scale(0) rotate(${-r}deg)`, opacity: 0 },
      { transform: 'scale(1) rotate(0deg)', opacity: 1, offset: 0.3 },
      { transform: 'scale(.85) rotate(0deg)', opacity: 1, offset: 0.6 },
      { transform: `scale(0) rotate(${r}deg)`, opacity: 0 }
    ], { duration: dur, delay, easing: 'ease-in-out', fill: 'both' });
    return delay + dur;
  }
  // Panel de vidrio translúcido que gira sobre su eje mientras vuela
  function pane(cx, cy, w, h, ang, [tx, ty], delay, dur) {
    const ca = Math.cos(ang), sa = Math.sin(ang), k = (Math.random() - 0.5) * 0.5 * w;
    const P = (a, b) => [cx + ca * a - sa * b, cy + sa * a + ca * b];
    const pts = [P(-w / 2 + k, -h / 2), P(w / 2 + k, -h / 2), P(w / 2 - k, h / 2), P(-w / 2 - k, h / 2)];
    const l = fxLayer(bboxOf(pts, 8), '', [cx, cy]);
    fxEl('polygon', { class: 'fx-pane', points: pts2(pts) }, l);
    fxEl('polygon', { class: 'fx-rim-glow', points: pts2(pts) }, l);
    fxEl('polygon', { class: 'fx-rim', points: pts2(pts) }, l);
    const spin = (Math.random() - 0.5) * 300;
    const F = [0, 0.5, 0.78, 0.92, 1], S = [1, 0.12, -0.85, 0.3, 0.9];
    l.animate(F.map((f, i) => ({
      offset: i / 4,
      transform: `translate(${(tx * f).toFixed(1)}px, ${(ty * f).toFixed(1)}px) rotate(${((spin * i) / 4).toFixed(0)}deg) scaleX(${S[i]})`
    })), { duration: dur, delay, easing: 'linear', fill: 'both' });
    l.animate([{ opacity: 0 }, { opacity: 1, offset: 0.06 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }], { duration: dur, delay, fill: 'both' });
    return delay + dur;
  }

  // Copia de la slide recortada a un polígono (fragmento real, con su contenido)
  // Va dentro de un marco del tamaño de la caja del polígono: la capa que se anima es
  // pequeña en vez de una pantalla completa por fragmento
  function fragment(el, pts, box, [ox, oy]) {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.floor(Math.max(-40, Math.min(...xs))), y0 = Math.floor(Math.max(-40, Math.min(...ys)));
    const x1 = Math.ceil(Math.min(W + 40, Math.max(...xs))), y1 = Math.ceil(Math.min(H + 40, Math.max(...ys)));
    const frame = document.createElement('div');
    frame.className = 'shard';
    frame.style.cssText = `left:${x0}px;top:${y0}px;width:${Math.max(1, x1 - x0)}px;height:${Math.max(1, y1 - y0)}px;transform-origin:${(ox - x0).toFixed(0)}px ${(oy - y0).toFixed(0)}px`;
    const c = el.cloneNode(true);
    c.removeAttribute('id');
    c.classList.remove('is-active');
    c.classList.add('is-leaving');
    c.style.cssText = `inset:auto;left:${-x0}px;top:${-y0}px;width:${W}px;height:${H}px;clip-path:${poly(pts.map(([x, y]) => [x, y]))}`;
    frame.appendChild(c);
    box.appendChild(frame);
    return frame;
  }

  /* Tajo (02 → 03): un corte diagonal de luz cruza la pantalla; la slide se parte en
     dos mitades que se separan a lo largo del corte, esquirlas de la propia slide
     salen despedidas del filo en la dirección del tajo y la 03 aparece en la brecha. */
  function cleave(el) {
    const { L, u, n, at, open, easing } = CUT;
    const delay = CUT.delay * SLOW, dur = CUT.dur * SLOW;
    const draw = 260 * SLOW, total = delay + dur;
    const box = document.createElement('div');
    box.className = 'shards';
    stage.insertBefore(box, cracks);

    // Mitades: se abren en perpendicular (igual que la brecha) y resbalan a lo largo del corte
    fxG.replaceChildren();
    fxG.setAttribute('class', '');
    [-1, 1].forEach(side => {
      const pivot = at(L / 2, 0);
      const c = fragment(el, [at(-2000, 0), at(L + 2000, 0), at(L + 2000, side * 4000), at(-2000, side * 4000)], box, pivot);
      const tx = n[0] * open * side + u[0] * 150 * side, ty = n[1] * open * side + u[1] * 150 * side;
      const move = [{ transform: 'none' }, { transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)` }];
      c.animate([{ transform: 'none' }, { transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${side * 1.5}deg)` }],
        { duration: dur, delay, easing, fill: 'both' });
      c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur * 0.45, delay: delay + dur * 0.5, easing: 'ease-in', fill: 'both' });
      // Filo luminoso de cada mitad, que viaja con ella (capa propia: el desenfoque se pinta una vez)
      const edge = [at(-400, 0), at(L + 400, 0)];
      const g = fxLayer(bboxOf(edge, 24), '', pivot);
      ['fx-glow', 'fx-core'].forEach(cls => fxEl('path', { class: `${cls} c`, d: line(edge) }, g));
      g.animate(move, { duration: dur, delay, easing, fill: 'both' });
      g.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: dur * 0.8, delay: delay - 40, easing: 'ease-out', fill: 'both' });
    });

    // El tajo: se traza de un extremo a otro y se apaga mientras se abre la brecha
    const cutLine = [at(0, 0), at(L, 0)];
    const blade = fxLayer(bboxOf(cutLine, 90), 'blade', at(L / 2, 0));
    ['fx-halo', 'fx-glow', 'fx-core'].forEach(cls => {
      const p = fxEl('path', { class: `${cls} c`, d: line(cutLine), pathLength: 1 }, blade);
      p.style.strokeDasharray = 1;
      p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: draw, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'both' });
    });
    blade.animate([{ opacity: 1 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], { duration: delay + 600 * SLOW, fill: 'both' });

    // Esquirlas: astillas largas y afiladas, como dagas de cristal. Tres materiales:
    //  · slide: fragmento real de la 02 con arista de vidrio
    //  · vacío: el espacio abisal que asoma por la grieta (estrellas dentro)
    //  · hielo: cristal azul translucido
    // Salen disparadas casi en la dirección de su eje mayor, en el sentido del tajo, con
    // brillo constante; se desvanecen por completo antes de retirarse (sin parpadeo).
    const axis = Math.atan2(u[1], u[0]);
    // Esquirlas y luz se crean en el cuadro siguiente: el primero solo lleva las mitades y la hoja
    txFrame(() => {
      let last = total;
      const kinds = [...Array(12).fill('frag'), ...Array(14).fill('void'), ...Array(9).fill('ice')];
      kinds.forEach((kind, i) => {
        const s = L * (0.03 + 0.94 * Math.random()), side = i % 2 ? -1 : 1;
        const big = kind === 'frag' ? 1 : kind === 'void' ? 0.8 : 0.45;
        const len = (180 + Math.random() * 280) * big, wid = (26 + Math.random() * 38) * big;
        const ang = axis + side * (0.12 + Math.random() * 0.5) + (Math.random() - 0.5) * 0.3;
        const [cx, cy] = at(s, side * (8 + Math.random() * 40));
        const pts = sliver(cx, cy, len, wid, ang);
        // Vuelo a lo largo del eje de la astilla, abriéndose hacia su lado del corte
        const v = 520 + Math.random() * 760, vn = side * (90 + Math.random() * 260);
        const tx = Math.cos(ang) * v + n[0] * vn, ty = Math.sin(ang) * v + n[1] * vn + 60;
        const spin = (Math.random() - 0.5) * (kind === 'ice' ? 160 : 50);
        const move = [
          { transform: kind === 'frag' ? 'none' : 'scale(.35)' },
          { transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${spin.toFixed(0)}deg) scale(${kind === 'frag' ? 0.75 : 1})` }
        ];
        const t0 = (draw * s) / L;
        const timing = { duration: (1300 + Math.random() * 500) * SLOW, delay: t0, easing: 'cubic-bezier(.1,.7,.3,1)', fill: 'both' };
        const fade = [{ opacity: kind === 'frag' ? 1 : 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.55 }, { opacity: 0 }];
        const targets = [svgShard(pts, kind, [cx, cy])];
        if (kind === 'frag') {
          const c = fragment(el, pts, box, [cx, cy]);
          targets.push(c);
        }
        targets.forEach(e => { e.animate(move, timing); e.animate(fade, { ...timing, easing: 'linear' }); });
        last = Math.max(last, t0 + timing.duration);
      });

      // Luz cegadora que se abre a lo largo del tajo, paneles de vidrio y destellos del filo
      const deg = (axis * 180) / Math.PI;
      last = Math.max(last, bloom(...at(L / 2, 0), L / 2 + 260, 190, deg, draw * 0.35, 1150 * SLOW));
      for (let i = 0; i < 10; i++) {
        const s = L * (0.06 + 0.88 * Math.random()), side = i % 2 ? -1 : 1;
        const v = 300 + Math.random() * 500, vn = side * (160 + Math.random() * 380);
        last = Math.max(last, pane(...at(s, side * Math.random() * 40), 70 + Math.random() * 90, 45 + Math.random() * 70, axis + (Math.random() - 0.5) * 1.2,
          [u[0] * v + n[0] * vn, u[1] * v + n[1] * vn + 90], (draw * s) / L, (1500 + Math.random() * 600) * SLOW));
      }
      for (let i = 0; i < 16; i++) {
        const s = L * (0.04 + 0.92 * Math.random());
        last = Math.max(last, glint(...at(s, (Math.random() - 0.5) * 300), 14 + Math.random() * 22, (draw * s) / L + Math.random() * 500 * SLOW, 900 * SLOW, i % 3 === 0));
      }
      for (let k = 0; k <= 6; k++) {
        txLater(() => window.Ambient?.burst(...toWin(...at((L * k) / 6, 0)), k % 2 ? [143, 227, 255] : [201, 184, 255], 16), (draw * k) / 6);
      }
      txLater(() => { box.remove(); stage.querySelectorAll('.fx [data-cut]').forEach(e => e.remove()); }, last + 80);
    });
    return total;
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
    fxG.replaceChildren();
    fxG.setAttribute('class', '');
    const hold = 260 * SLOW, fly = 1500 * SLOW, total = hold + fly;
    pieces.forEach(({ pts, inner }) => {
      const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
      const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
      const dx = cx - ox, dy = cy - oy, L = Math.hypot(dx, dy) || 1;
      const push = (inner ? 560 : 340) + Math.random() * 260;
      const c = fragment(el, pts, box, [cx, cy]);
      const rot = (Math.random() - 0.5) * (inner ? 70 : 30);
      const nx = (dx / L) * 8, ny = (dy / L) * 8;
      // Tensión (se abren las juntas) → estallido: sale rápido y frena, con algo de caída
      const flight = [
        { transform: 'none', easing: 'cubic-bezier(.5,0,.9,.5)' },
        { transform: `translate(${nx}px, ${ny}px)`, offset: hold / total, easing: 'cubic-bezier(.12,.75,.3,1)' },
        { transform: `translate(${(dx / L) * push}px, ${(dy / L) * push + 160}px) rotate(${rot}deg) scale(${inner ? 0.62 : 0.85})` }
      ];
      c.animate(flight, { duration: total, fill: 'forwards' });
      c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: fly * 0.45, delay: hold + fly * 0.45, easing: 'ease-in', fill: 'forwards' });
      // Arista de vidrio que viaja con el fragmento
      const rim = svgShard(pts, 'wedge', [cx, cy]);
      rim.animate(flight, { duration: total, fill: 'forwards' });
      rim.animate([{ opacity: 0 }, { opacity: 1, offset: hold / total }, { opacity: 1, offset: (hold + fly * 0.45) / total }, { opacity: 0, offset: (hold + fly * 0.9) / total }, { opacity: 0 }], { duration: total, fill: 'forwards' });
    });

    // Astillas, paneles y destellos en el cuadro siguiente: el primero solo lleva los fragmentos grandes
    txFrame(() => {
      // Astillas radiales desde el punto del arco, en el instante del estallido. La mayoría
      // son trozos reales de la 15 tomados de toda la slide; vacío y cristal solo como acento.
      let last = total;
      [...Array(18).fill('frag'), ...Array(6).fill('void'), ...Array(6).fill('ice')].forEach((kind, i) => {
        const a = kind === 'frag' ? (i / 18) * Math.PI * 2 + Math.random() * 0.3 : Math.random() * Math.PI * 2;
        const r0 = kind === 'frag' ? 120 + Math.random() * 520 : 20 + Math.random() * 180;
        const big = kind === 'frag' ? 1.15 : kind === 'void' ? 0.85 : 0.5;
        const len = (190 + Math.random() * 260) * big, wid = (34 + Math.random() * 44) * big;
        const ang = a + (Math.random() - 0.5) * 0.35;
        const cx = ox + Math.cos(a) * r0, cy = oy + Math.sin(a) * r0;
        const pts = sliver(cx, cy, len, wid, ang);
        const v = kind === 'frag' ? 420 + Math.random() * 520 : 650 + Math.random() * 800;
        const move = [
          { transform: kind === 'frag' ? 'none' : 'scale(.3)' },
          { transform: `translate(${(Math.cos(a) * v).toFixed(1)}px, ${(Math.sin(a) * v + 120).toFixed(1)}px) rotate(${((Math.random() - 0.5) * (kind === 'ice' ? 200 : 60)).toFixed(0)}deg) scale(${kind === 'frag' ? 0.7 : 1})` }
        ];
        const timing = { duration: (1300 + Math.random() * 500) * SLOW, delay: hold - 20 + Math.random() * 60, easing: 'cubic-bezier(.08,.75,.3,1)', fill: 'both' };
        const fade = [{ opacity: kind === 'frag' ? 1 : 0 }, { opacity: 1, offset: 0.08 }, { opacity: 1, offset: kind === 'frag' ? 0.62 : 0.5 }, { opacity: 0 }];
        const targets = [svgShard(pts, kind, [cx, cy])];
        if (kind === 'frag') {
          const c = fragment(el, pts, box, [cx, cy]);
          targets.push(c);
        }
        targets.forEach(e => { e.animate(move, timing); e.animate(fade, { ...timing, easing: 'linear' }); });
        last = Math.max(last, timing.delay + timing.duration);
      });
      // Luz cegadora en el punto del arco, paneles de vidrio y destellos alrededor
      last = Math.max(last, bloom(ox, oy, 460, 460, 0, hold * 0.7, 1300 * SLOW));
      for (let i = 0; i < 12; i++) {
        const a = Math.random() * Math.PI * 2, r0 = 30 + Math.random() * 200, v = 450 + Math.random() * 600;
        last = Math.max(last, pane(ox + Math.cos(a) * r0, oy + Math.sin(a) * r0, 70 + Math.random() * 100, 45 + Math.random() * 80, a + (Math.random() - 0.5),
          [Math.cos(a) * v, Math.sin(a) * v + 110], hold, (1500 + Math.random() * 600) * SLOW));
      }
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2, r = 60 + Math.random() * 560;
        last = Math.max(last, glint(ox + Math.cos(a) * r, oy + Math.sin(a) * r, 14 + Math.random() * 24, hold + Math.random() * 800 * SLOW, 900 * SLOW, i % 3 === 0));
      }
      txLater(() => { box.remove(); stage.querySelectorAll('.fx [data-cut]').forEach(e => e.remove()); }, last + 80);
    });

    // Grietas sobre las juntas: aparecen en el instante del arco y se apagan al separarse
    cracks.innerHTML = '';
    [...spokes.map(s => s.slice(0, 4)), ...ring].forEach((pts, i) => {
      ['glow', 'core'].forEach(cls => {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', line(pts));
        p.setAttribute('class', cls);
        p.setAttribute('pathLength', 1);
        cracks.appendChild(p);
        p.animate([{ strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, opacity: 1, offset: 0.35 }, { strokeDashoffset: 0, opacity: 0 }],
          { duration: hold + 500 * SLOW, delay: i < n ? 0 : 60, easing: 'ease-out', fill: 'both' });
      });
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
    cRef.querySelector('.t').textContent = s.dataset.ref || '';
    const hasCx = !!window.Codex?.has(label(s));
    cRef.classList.toggle('has-cx', hasCx);
    cRef.disabled = !hasCx;
    [cRef, cWho, cCount].forEach((el, i) => {
      el.getAnimations().forEach(a => a.cancel());
      el.animate([{ opacity: 0, transform: reduced ? 'none' : i ? 'translateY(10px)' : 'translateX(12px)' }, { opacity: 1, transform: 'none' }],
        { duration: reduced ? 180 : 700, delay: reduced ? 0 : i * 70, easing: EXPO, fill: 'backwards' });
    });
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
  /* ---------- Lector normativo (clic en la referencia) ---------- */
  function openCodex() {
    const s = slides[idx];
    if (!window.Codex) return;
    closeOverlays();
    drawer.classList.remove('open');
    const done = () => stage.classList.remove('is-reading');
    if (Codex.open(label(s), { mood: stage.dataset.mood, slideTitle: s.dataset.title, done })) stage.classList.add('is-reading');
  }
  cRef.addEventListener('click', e => { e.stopPropagation(); openCodex(); });

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
    // El lector normativo se queda con el teclado mientras está abierto
    if (window.Codex?.isOpen()) { if (Codex.key(k)) e.preventDefault(); return; }
    // Una escena puede consumir teclas propias (p. ej. la reconstrucción R6)
    if (!document.querySelector('.overlay.open') && scene(slides[idx]).key?.(slides[idx], k)) { e.preventDefault(); return; }
    if (k === 'Escape' && !document.querySelector('.overlay.open') && !drawer.classList.contains('open') && jumpBack()) { e.preventDefault(); return; }
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
    else if (k === 'l' || k === 'L') openCodex();
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
    if (tx === null || window.Codex?.isOpen()) { tx = null; return; }
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
