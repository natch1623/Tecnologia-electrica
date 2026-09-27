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
  // Solo el sigilo de la portada usa --mx/--my: se fijan en él y no en el escenario,
  // para no invalidar el estilo de todo el árbol en cada movimiento del cursor
  const sigil = stage.querySelector('.hero .sigil');
  let pointer = null;
  addEventListener('mousemove', e => {
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
  // Ritmo global de las transiciones: > 1 las hace más lentas para que se aprecien los detalles
  const SLOW = 1.4;

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
    const kind = back ? (REWIND.has(prevEl?.dataset.tx) ? prevEl.dataset.tx : 'dissolve') : nextEl.dataset.tx || 'dissolve';
    if (reduced || !prevEl) {
      nextEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduced ? 400 : 900, easing: 'ease-out' });
      if (prevEl) leave(prevEl, 400, false);
      return;
    }
    const origin = pt(nextEl.dataset.origin);
    const t = (TX[kind] || TX.dissolve)(back, origin);
    const opt = { duration: t.dur * SLOW, easing: t.easing, delay: (t.delay || 0) * SLOW };

    // Salida
    if (t.frames?.[0].prev) {
      prevEl.animate(t.frames.map(f => ({ clipPath: f.prev })), { ...opt, fill: 'forwards' });
      leave(prevEl, opt.duration + opt.delay, true);
    } else if (kind === 'absorb' && prevEl.dataset.zoom) {
      const z = pt(prevEl.dataset.zoom);
      prevEl.style.transformOrigin = `${z[0]}px ${z[1]}px`;
      prevEl.animate([{ transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' }, { transform: 'scale(4.5)', opacity: 0, filter: 'blur(6px)' }],
        { duration: 1000 * SLOW, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' });
      window.Ambient?.burst(...toWin(...z), [143, 227, 255], 30);
      leave(prevEl, 1000 * SLOW, true);
    } else if (kind === 'fracture' || kind === 'cleave') {
      const dur = kind === 'cleave' ? cleave(prevEl) : shatter(prevEl, origin);
      prevEl.animate([{ opacity: 0 }, { opacity: 0 }], { duration: dur, fill: 'forwards' });
      leave(prevEl, dur, true);
    } else if (kind === 'reconstruct') {
      prevEl.animate([{ opacity: 1, filter: 'blur(0px) saturate(1)' }, { opacity: 0, filter: 'blur(4px) saturate(0)' }], { duration: 800 * SLOW, easing: 'ease-in', fill: 'forwards' });
      leave(prevEl, 800 * SLOW, true);
    } else {
      leave(prevEl, (back ? 500 : 650) * SLOW, false);
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
    requestAnimationFrame(() => {
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
        setTimeout(() => window.Ambient?.burst(...toWin(...at((L * k) / 6, 0)), k % 2 ? [143, 227, 255] : [201, 184, 255], 16), (draw * k) / 6);
      }
      setTimeout(() => { box.remove(); stage.querySelectorAll('.fx [data-cut]').forEach(e => e.remove()); }, last + 80);
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
    requestAnimationFrame(() => {
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
      setTimeout(() => { box.remove(); stage.querySelectorAll('.fx [data-cut]').forEach(e => e.remove()); }, last + 80);
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
