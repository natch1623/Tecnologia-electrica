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
  addEventListener('mousemove', e => {
    stage.style.setProperty('--mx', ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
    stage.style.setProperty('--my', ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
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
  const slash = document.getElementById('slash');
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

  /* ---------- Familia de transiciones ---------- */
  const EASE = 'cubic-bezier(.77,0,.175,1)';
  const EXPO = 'cubic-bezier(.16,1,.3,1)';
  const pt = s => (s || '960 540').split(' ').map(Number);

  function poly(points) { return `polygon(${points.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`; }

  const TX = {
    rift: back => ({
      frames: back
        ? [{ clipPath: 'polygon(130% 0,130% 0,150% 100%,150% 100%)' }, { clipPath: 'polygon(-30% 0,130% 0,150% 100%,-30% 100%)' }]
        : [{ clipPath: 'polygon(-30% 0,-30% 0,-10% 100%,-10% 100%)' }, { clipPath: 'polygon(-30% 0,130% 0,150% 100%,-10% 100%)' }],
      dur: 950, easing: EASE
    }),
    expand: (back, o) => ({
      frames: [{ clipPath: `circle(0px at ${o[0]}px ${o[1]}px)` }, { clipPath: `circle(2300px at ${o[0]}px ${o[1]}px)` }],
      dur: 1300, easing: 'cubic-bezier(.7,0,.2,1)'
    }),
    sweep: () => ({
      frames: [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }],
      dur: 1100, easing: EASE
    }),
    rise: () => ({
      frames: [{ clipPath: 'inset(100% 0 0 0)', transform: 'translateY(40px)' }, { clipPath: 'inset(0% 0 0 0)', transform: 'none' }],
      dur: 1100, easing: EXPO
    }),
    dissolve: () => ({
      frames: [{ opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)' }, { opacity: 1, filter: 'blur(0px)', transform: 'none' }],
      dur: 1100, easing: EXPO
    }),
    absorb: () => ({
      frames: [{ opacity: 0, transform: 'scale(.86)', filter: 'blur(10px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }],
      dur: 1200, easing: EXPO, delay: 250
    }),
    wave: () => {
      const frames = [];
      for (let f = 0; f <= 12; f++) {
        const p = f / 12;
        const edge = -260 + p * 2440;
        const pts = [[-20, -20]];
        for (let k = 0; k <= 18; k++) {
          const y = (k / 18) * 1120 - 20;
          pts.push([edge + 70 * Math.sin((y / 1080) * Math.PI * 3 + p * 8), y]);
        }
        pts.push([-20, 1100]);
        frames.push({ clipPath: poly(pts) });
      }
      return { frames, dur: 1300, easing: 'cubic-bezier(.45,0,.2,1)' };
    },
    scan: () => bands(14, true),
    reconstruct: () => bands(10, false),
    fracture: (back, o) => {
      const n = 16;
      const rad = Array.from({ length: n }, () => 0.55 + Math.random() * 0.9);
      const ang = Array.from({ length: n }, (_, j) => (j / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.3);
      const frames = [];
      for (let f = 0; f <= 10; f++) {
        const p = f / 10;
        const R = 2600 * p * p;
        frames.push({ clipPath: poly(ang.map((a, j) => [o[0] + Math.cos(a) * R * rad[j], o[1] + Math.sin(a) * R * rad[j]])) });
      }
      frames[frames.length - 1] = { clipPath: poly(ang.map(a => [o[0] + Math.cos(a) * 4000, o[1] + Math.sin(a) * 4000])) };
      return { frames, dur: 1150, easing: 'linear', delay: 220 };
    }
  };
  TX.slash = TX.rift;

  function bands(n, ltr) {
    const frames = [];
    const h = 1080 / n;
    for (let f = 0; f <= 12; f++) {
      const p = f / 12;
      const pts = [];
      for (let k = 0; k < n; k++) {
        const kk = ltr ? k : (k * 7) % n;
        const q = Math.max(0, Math.min(1, (p * 1.5 - kk * (0.5 / n))));
        const w = 1920 * (1 - Math.pow(1 - q, 3));
        const y0 = k * h, y1 = (k + 1) * h + 0.5;
        const x0 = ltr ? 0 : k % 2 ? 1920 - w : 0;
        pts.push([x0, y0], [x0 + w, y0], [x0 + w, y1], [x0, y1]);
      }
      frames.push({ clipPath: poly(pts) });
    }
    return { frames, dur: 1250, easing: 'linear' };
  }

  function transition(prevEl, nextEl, back) {
    const kind = back ? (nextEl.dataset.tx === 'slash' ? 'rift' : 'dissolve') : nextEl.dataset.tx || 'dissolve';
    if (reduced || !prevEl) {
      nextEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduced ? 400 : 900, easing: 'ease-out' });
      if (prevEl) leave(prevEl, 400, false);
      return;
    }
    const origin = pt(nextEl.dataset.origin);

    // Salida
    if (kind === 'absorb' && prevEl.dataset.zoom) {
      const z = pt(prevEl.dataset.zoom);
      prevEl.style.transformOrigin = `${z[0]}px ${z[1]}px`;
      prevEl.animate([{ transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' }, { transform: 'scale(4.5)', opacity: 0, filter: 'blur(6px)' }],
        { duration: 1000, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' });
      window.Ambient?.burst(...toWin(...z), [143, 227, 255], 30);
      leave(prevEl, 1000, true);
    } else if (kind === 'fracture') {
      prevEl.animate([{ opacity: 1, transform: 'none' }, { opacity: 1, transform: 'translateX(-6px)', offset: 0.1 }, { opacity: 1, transform: 'translateX(5px)', offset: 0.2 }, { opacity: 0, transform: 'scale(.98)' }],
        { duration: 900, easing: 'ease-in', fill: 'forwards' });
      drawCracks(origin);
      window.Ambient?.burst(...toWin(...origin), [255, 77, 109], 70);
      leave(prevEl, 900, true);
    } else if (kind === 'reconstruct') {
      prevEl.animate([{ opacity: 1, filter: 'blur(0px) saturate(1)' }, { opacity: 0, filter: 'blur(4px) saturate(0)' }], { duration: 800, easing: 'ease-in', fill: 'forwards' });
      leave(prevEl, 800, true);
    } else {
      leave(prevEl, 650, false);
    }

    // Entrada
    const t = (TX[kind] || TX.dissolve)(back, origin);
    nextEl.animate(t.frames, { duration: t.dur, easing: t.easing, delay: t.delay || 0, fill: 'backwards' });
    if (kind === 'slash' || (back && kind === 'rift')) swordSlash(back);
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

  function swordSlash(back) {
    const from = back ? 2100 : -180, to = back ? -180 : 2100;
    slash.animate([
      { transform: `translateX(${from}px) rotate(12deg)`, opacity: 0 },
      { opacity: 1, offset: 0.25 }, { opacity: 1, offset: 0.7 },
      { transform: `translateX(${to}px) rotate(12deg)`, opacity: 0 }
    ], { duration: 900, easing: EASE });
  }

  function drawCracks([ox, oy]) {
    cracks.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      let x = ox, y = oy, d = `M${x} ${y}`;
      const a0 = (i / 9) * Math.PI * 2 + Math.random() * 0.4;
      for (let k = 0; k < 7; k++) {
        const a = a0 + (Math.random() - 0.5) * 0.9, l = 50 + Math.random() * 120;
        x += Math.cos(a) * l; y += Math.sin(a) * l;
        d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
      }
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d);
      cracks.appendChild(p);
      const L = p.getTotalLength();
      p.style.strokeDasharray = L;
      p.animate([{ strokeDashoffset: L, opacity: 1 }, { strokeDashoffset: 0, opacity: 1, offset: 0.4 }, { strokeDashoffset: 0, opacity: 0 }], { duration: 1100, easing: 'ease-out', fill: 'forwards' });
    }
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
    cRef.animate([{ opacity: 0, transform: 'translateX(12px)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: EXPO });
    cWho.innerHTML = s.dataset.backup
      ? '<b>RESPALDO</b> · SOLO SI PREGUNTAN'
      : `<b>${(s.dataset.who || '').replace('I', 'INTEGRANTE ')}</b> · ${s.dataset.time || ''}`;
    cCount.innerHTML = s.dataset.backup
      ? `<b>${s.dataset.backup}</b>`
      : `<b>${String(idx + 1).padStart(2, '0')}</b> / ${String(mainCount).padStart(2, '0')}`;
    cProg.style.setProperty('--p', Math.min(1, (idx + 1) / mainCount));
    history.replaceState(null, '', `${location.search}#${idx + 1}`);
    updateNotes();
    renderMenu();
    updateDots();
  }
  function updateDots() {
    const s = slides[idx];
    const n = nStates(s);
    cDots.innerHTML = n ? Array.from({ length: n + 1 }, (_, i) => `<i class="${i <= +s.dataset.s ? 'on' : ''}"></i>`).join('') : '';
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
      `<li><button data-i="${i}" class="${i === idx ? 'cur' : ''}"><span class="n">${label(s)}</span><span>${s.dataset.title}</span><span class="w">${s.dataset.backup ? 'R' : s.dataset.who}</span></button></li>`
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
