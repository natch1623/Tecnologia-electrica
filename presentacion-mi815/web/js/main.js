/* =========================================================
   Motor de la presentación · Perfil MI 815
   Navegación, estados internos, transiciones con corte de luz, cromo, notas y presentador
   ========================================================= */
(() => {
  const stage = document.getElementById('stage');
  const slides = [...stage.querySelectorAll('.slide')];
  const total = slides.length;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPresenter = new URLSearchParams(location.search).has('presentador');
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel('mi815-perfil') : null;
  const W = 1920, H = 1080;
  const EASE = 'cubic-bezier(0.77, 0, 0.175, 1)';
  const LIMIT_MS = 18 * 60 * 1000;

  let idx = 0;
  let scale = 0.5;

  /* ---------- Escala 16:9 ---------- */
  const slot = document.getElementById('pv-slot');
  function fit() {
    if (isPresenter) {
      const r = slot.getBoundingClientRect();
      scale = r.width / W;
      Object.assign(stage.style, { position: 'fixed', left: `${r.left + r.width / 2}px`, top: `${r.top + r.height / 2}px` });
    } else {
      scale = Math.min(innerWidth / W, innerHeight / H);
    }
    stage.style.setProperty('--s', scale);
  }
  addEventListener('resize', () => { fit(); anchorTo(slides[idx]); });

  function toWin(x, y) {
    const r = stage.getBoundingClientRect();
    return [r.left + x * scale, r.top + y * scale];
  }
  function anchorTo(s) {
    const [x, y] = (s.dataset.anchor || '1500 540').split(' ').map(Number);
    window.Ambient?.setAnchor(...toWin(x, y));
  }

  /* ---------- Estados internos ---------- */
  const nStates = s => +(s.dataset.states || 0);
  function setState(s, n) {
    s.dataset.s = n;
    s.querySelectorAll('[data-at]').forEach(el => el.classList.toggle('on', n >= +el.dataset.at));
    s.querySelectorAll('[data-only]').forEach(el => el.classList.toggle('on', n === +el.dataset.only));
    window.Scenes?.[s.id]?.state?.(s, n);
    window.Motion?.state(s, n);
    updateDots();
  }

  /* ---------- Navegación ---------- */
  function go(n, { silent = false, back = null, state = null } = {}) {
    n = Math.max(0, Math.min(total - 1, n));
    const prev = slides[idx];
    const next = slides[n];
    if (n === idx && next.classList.contains('is-active')) return;
    back = back ?? n < idx;

    clearTransition();
    if (prev !== next) {
      prev.classList.remove('is-active');
      prev.classList.add('is-leaving');
    }
    next.classList.remove('is-active');
    void next.offsetWidth;
    next.classList.add('is-active');
    idx = n;

    window.Ambient?.setMood(next.dataset.mood || 'calm');
    anchorTo(next);
    window.Thread?.to(next.dataset.thread || 'horizon');
    setState(next, state ?? (back ? nStates(next) : 0));
    window.Motion?.enter(next);
    transition(prev !== next ? prev : null, next, back);
    updateChrome();
    if (!silent) broadcast();
  }
  function next() {
    const s = slides[idx];
    if (+s.dataset.s < nStates(s)) { setState(s, +s.dataset.s + 1); broadcast(); return; }
    if (idx < total - 1) go(idx + 1);
  }
  function prev() {
    const s = slides[idx];
    if (+s.dataset.s > 0) { setState(s, +s.dataset.s - 1); broadcast(); return; }
    if (idx > 0) go(idx - 1, { back: true });
  }

  /* ---------- Transiciones ----------
     slash: corte diagonal con filo de luz · sweep: barrido vertical · rise: emerge desde abajo
     expand: se abre desde un punto del contenido · dissolve: fundido sereno.
     Al retroceder se rebobina la transición de la slide que se abandona. */
  const fx = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  fx.setAttribute('class', 'fx');
  fx.setAttribute('viewBox', `0 0 ${W} ${H}`);
  stage.appendChild(fx);
  let anims = [];

  function clearTransition() {
    anims.forEach(a => a.cancel());
    anims = [];
    fx.replaceChildren();
    slides.forEach(s => { if (s.classList.contains('is-leaving')) s.classList.remove('is-leaving'); s.style.zIndex = ''; });
  }
  function track(a) { anims.push(a); return a; }
  function edge(tag, attrs) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    ['halo', 'glow', 'core'].forEach(c => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      el.setAttribute('class', c);
      g.appendChild(el);
    });
    fx.appendChild(g);
    return g;
  }
  function finish(prevEl, a) {
    a.finished.then(() => {
      if (prevEl) prevEl.classList.remove('is-leaving');
      anims.forEach(x => x.cancel());
      anims = [];
      fx.replaceChildren();
      slides.forEach(s => { s.style.zIndex = ''; });
    }).catch(() => {});
  }

  function transition(prevEl, nextEl, back) {
    const kind = (back && prevEl ? prevEl.dataset.tx : nextEl.dataset.tx) || 'dissolve';
    if (!prevEl) {
      finish(null, track(nextEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduced ? 200 : 1200, easing: 'ease-out' })));
      return;
    }
    if (reduced || kind === 'dissolve') {
      const d = reduced ? 220 : 1000;
      track(prevEl.animate([{ opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(6px)' }], { duration: d * 0.8, easing: 'ease-in', fill: 'forwards' }));
      finish(prevEl, track(nextEl.animate([{ opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)' }], { duration: d, easing: 'ease-out', delay: d * 0.25, fill: 'backwards' })));
      return;
    }
    const dur = 1150;
    const opt = { duration: dur, easing: EASE, fill: 'forwards' };

    if (kind === 'slash' || kind === 'sweep') {
      const k = kind === 'slash' ? 420 : 0;
      const L = -k - 20, R = W + k + 20;
      const left = e => `polygon(${L}px 0px, ${e}px 0px, ${e - k}px ${H}px, ${L}px ${H}px)`;
      const right = e => `polygon(${e}px 0px, ${R}px 0px, ${R}px ${H}px, ${e - k}px ${H}px)`;
      const [e0, e1] = back ? [W + k, 0] : [0, W + k];
      const inShape = back ? right : left, outShape = back ? left : right;
      track(prevEl.animate([{ clipPath: outShape(e0) }, { clipPath: outShape(e1) }], opt));
      const a = track(nextEl.animate([{ clipPath: inShape(e0) }, { clipPath: inShape(e1) }], opt));
      const g = edge('line', { x1: 0, y1: -20, x2: -k * (1 + 40 / H), y2: H + 20 });
      track(g.animate([{ transform: `translateX(${e0}px)` }, { transform: `translateX(${e1}px)` }], opt));
      finish(prevEl, a);
      return;
    }
    if (kind === 'rise') {
      const top = y => `polygon(0px -20px, ${W}px -20px, ${W}px ${y}px, 0px ${y}px)`;
      const bottom = y => `polygon(0px ${y}px, ${W}px ${y}px, ${W}px ${H + 20}px, 0px ${H + 20}px)`;
      const [y0, y1] = back ? [0, H] : [H, 0];
      const inShape = back ? top : bottom, outShape = back ? bottom : top;
      track(prevEl.animate([{ clipPath: outShape(y0) }, { clipPath: outShape(y1) }], opt));
      const a = track(nextEl.animate([{ clipPath: inShape(y0) }, { clipPath: inShape(y1) }], opt));
      const g = edge('line', { x1: -20, y1: 0, x2: W + 20, y2: 0 });
      track(g.animate([{ transform: `translateY(${y0}px)` }, { transform: `translateY(${y1}px)` }], opt));
      finish(prevEl, a);
      return;
    }
    if (kind === 'expand') {
      // Al avanzar se abre desde el origen de la slide que entra; al retroceder, la que sale se cierra hacia su origen
      const host = back ? prevEl : nextEl;
      const [ox, oy] = (host.dataset.origin || '960 540').split(' ').map(Number);
      const big = Math.hypot(Math.max(ox, W - ox), Math.max(oy, H - oy)) + 40;
      const circ = r => `circle(${r}px at ${ox}px ${oy}px)`;
      const ring = edge('circle', { cx: ox, cy: oy, r: 100 });
      ring.style.transformOrigin = `${ox}px ${oy}px`;
      ring.querySelectorAll('circle').forEach(c => c.setAttribute('vector-effect', 'non-scaling-stroke'));
      const rs = [0.01, big / 100];
      if (back) {
        prevEl.style.zIndex = 4;
        const a = track(prevEl.animate([{ clipPath: circ(big) }, { clipPath: circ(0) }], opt));
        track(ring.animate([{ transform: `scale(${rs[1]})` }, { transform: `scale(${rs[0]})` }], opt));
        finish(prevEl, a);
      } else {
        track(prevEl.animate([{ opacity: 1 }, { opacity: 0 }], { ...opt, duration: dur * 0.9 }));
        const a = track(nextEl.animate([{ clipPath: circ(0) }, { clipPath: circ(big) }], opt));
        track(ring.animate([{ transform: `scale(${rs[0]})`, opacity: 1 }, { transform: `scale(${rs[1]})`, opacity: 0.4 }], opt));
        finish(prevEl, a);
      }
    }
  }

  /* ---------- Cromo ---------- */
  const cBlock = document.getElementById('c-block');
  const cRef = document.getElementById('c-ref');
  const cWho = document.getElementById('c-who');
  const cCount = document.getElementById('c-count');
  const cDots = document.getElementById('c-dots');
  const cProg = document.getElementById('c-prog');
  const num = i => String(i + 1).padStart(2, '0');

  function updateChrome() {
    const s = slides[idx];
    stage.classList.toggle('is-hero', idx === 0);
    cBlock.textContent = `MI 815 · ${s.dataset.block || ''}`.toUpperCase();
    cRef.textContent = s.dataset.ref || '';
    cWho.innerHTML = `<b>${s.dataset.who || ''}</b> · ${s.dataset.time || ''}`;
    cCount.innerHTML = `<b>${num(idx)}</b> / ${num(total - 1)}`;
    cProg.parentElement.style.setProperty('--p', (idx + 1) / total);
    [cBlock.parentElement, cRef, cWho, cCount].forEach((el, i) => {
      el.getAnimations().forEach(a => a.cancel());
      if (!reduced) el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: i * 60, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'backwards' });
    });
    history.replaceState(null, '', `${location.search}#${idx + 1}`);
    updateNotes();
    renderMenu();
    updateDots();
  }
  function updateDots() {
    const s = slides[idx];
    if (!s) return;
    const n = nStates(s), cur = +(s.dataset.s || 0);
    if (cDots.dataset.k !== String(idx)) {
      cDots.dataset.k = idx;
      cDots.innerHTML = n ? Array.from({ length: n + 1 }, () => '<i></i>').join('') : '';
    }
    [...cDots.children].forEach((d, i) => { d.classList.toggle('on', i <= cur); d.classList.toggle('cur', i === cur); });
    if (isPresenter) updateClock();
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
  const notesHtml = s => s.querySelector('aside.notes')?.innerHTML || '<p>Sin notas.</p>';
  let startedAt = Date.now();
  let slideStart = Date.now();
  function updateNotes() {
    const s = slides[idx];
    document.getElementById('d-meta').innerHTML = `<span>${num(idx)} · ${s.dataset.title}</span><span>Habla: ${s.dataset.who}</span><span>⏱ ${s.dataset.time}</span>`;
    document.getElementById('d-txt').innerHTML = notesHtml(s);
    if (isPresenter) {
      document.getElementById('pv-title').textContent = `${num(idx)} · ${s.dataset.title}`;
      document.getElementById('pv-meta').textContent = `Habla: ${s.dataset.who} · objetivo ${s.dataset.time}`;
      document.getElementById('pv-notes').innerHTML = notesHtml(s);
      const nx = slides[idx + 1];
      document.getElementById('pv-next').textContent = nx ? `${num(idx + 1)} · ${nx.dataset.title} (${nx.dataset.who})` : 'Fin';
      slideStart = Date.now();
    }
  }
  const mmss = ms => { const t = Math.max(0, Math.floor(ms / 1000)); return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };
  function updateClock() {
    const elapsed = Date.now() - startedAt;
    const clock = document.getElementById('pv-clock');
    clock.textContent = mmss(elapsed);
    clock.classList.toggle('over', elapsed > LIMIT_MS);
    const s = slides[idx];
    document.getElementById('pv-sclock').textContent = `en esta: ${mmss(Date.now() - slideStart)} de ${s.dataset.time} · estado ${s.dataset.s}/${nStates(s)}`;
  }
  if (isPresenter) {
    document.body.classList.add('presenter');
    setInterval(updateClock, 500);
    document.querySelectorAll('.pv button').forEach(b => b.addEventListener('click', () => {
      const cmd = b.dataset.cmd;
      if (cmd === 'next') next();
      if (cmd === 'prev') prev();
      if (cmd === 'reset') { startedAt = Date.now(); slideStart = Date.now(); updateClock(); }
    }));
  }

  function broadcast() { channel?.postMessage({ idx, s: +slides[idx].dataset.s }); }
  if (channel) {
    channel.onmessage = ({ data }) => {
      if (data.idx !== idx) go(data.idx, { silent: true, back: data.idx < idx, state: data.s });
      else setState(slides[idx], data.s);
    };
  }

  /* ---------- Índice ---------- */
  const menu = document.getElementById('menu');
  const menuList = document.getElementById('menu-list');
  function renderMenu() {
    menuList.innerHTML = slides.map((s, i) =>
      `<li><button data-i="${i}" class="${i === idx ? 'cur' : ''}"><span class="n">${num(i)}</span><span>${s.dataset.title}</span><span class="w">${s.dataset.who} · ${s.dataset.time}</span></button></li>`
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

  /* ---------- Teclado, clic y gestos ---------- */
  addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const k = e.key;
    if (k === 'Escape') { closeOverlays(); drawer.classList.remove('open'); return; }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(total - 1);
    else if (k === 'm' || k === 'M') { document.getElementById('help').classList.remove('open'); menu.classList.toggle('open'); }
    else if (k === '?' || k === 'h' || k === 'H') { menu.classList.remove('open'); document.getElementById('help').classList.toggle('open'); }
    else if (k === 'n' || k === 'N') drawer.classList.toggle('open');
    else if (k === 'f' || k === 'F') toggleFullscreen();
    else if (k === 'p' || k === 'P') window.open(`${location.pathname}?presentador#${idx + 1}`, 'presentador', 'width=1280,height=760');
  });

  stage.addEventListener('click', e => {
    if (isPresenter || e.target.closest('button, a')) return;
    const r = stage.getBoundingClientRect();
    if (e.clientX - r.left < r.width * 0.25) prev(); else next();
  });

  let tx0 = null;
  addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', e => {
    if (tx0 === null) return;
    const dx = e.changedTouches[0].clientX - tx0;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    tx0 = null;
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
  idx = Number.isFinite(start) ? Math.max(0, Math.min(total - 1, start - 1)) : 0;
  // La portada espera a las fuentes para que el título no cambie de tipografía al animarse
  const boot = () => go(idx, { silent: true });
  if (idx === 0 && !reduced && document.fonts) Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]).then(boot);
  else boot();
  addEventListener('hashchange', () => {
    const h = parseInt(location.hash.slice(1), 10);
    if (Number.isFinite(h) && h - 1 !== idx) go(h - 1);
  });
})();
