/* =========================================================
   Movimiento · capa de animaciones encima de las escenas
   - cifras que cuentan hasta su valor (data-count)
   - paralaje de las capas con el cursor
   - luz que sigue al cursor en las tarjetas
   - escaneo ámbar que revela las imágenes (como una placa de rayos X)
   ========================================================= */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = document.getElementById('stage');

  /* ---------- Cifras que cuentan ---------- */
  // data-count="3685" data-dec="0" data-from="0" · separador de miles: espacio fino; decimales: coma
  const fmt = (v, dec) => {
    const [i, d] = v.toFixed(dec).split('.');
    const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return d ? `${int},${d}` : int;
  };
  function count(el) {
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), from = parseFloat(el.dataset.from || 0);
    const dur = +(el.dataset.dur || 1400), delay = +(el.dataset.delay || 0);
    el.getAnimations?.().forEach(a => a.cancel());
    if (reduced) { el.textContent = fmt(to, dec); return; }
    const t0 = performance.now() + delay;
    el.textContent = fmt(from, dec);
    const ease = t => 1 - (1 - t) ** 4;
    const tick = now => {
      const k = Math.min(1, Math.max(0, (now - t0) / dur));
      el.textContent = fmt(from + (to - from) * ease(k), dec);
      if (k < 1 && el.isConnected) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  // Cuenta las cifras visibles de la slide (las que dependen de un estado esperan a que aparezca)
  function runCounts(s) {
    s.querySelectorAll('[data-count]').forEach(el => {
      const gate = el.closest('[data-at]');
      if (gate && !gate.classList.contains('on')) { el.textContent = fmt(parseFloat(el.dataset.from || 0), +(el.dataset.dec || 0)); el.dataset.done = ''; return; }
      if (el.dataset.done === '1') return;
      el.dataset.done = '1';
      count(el);
    });
  }

  /* ---------- Escaneo de imágenes ---------- */
  // Las imágenes que dependen de un estado se escanean cuando aparecen, no antes
  function scan(s, fresh) {
    s.querySelectorAll('.photo').forEach(p => {
      const visible = !p.matches('[data-at]') || p.classList.contains('on');
      if (!visible) { p.classList.remove('scanned'); return; }
      if (!fresh && p.classList.contains('scanned')) return;
      p.classList.remove('scanned');
      void p.offsetWidth;
      p.classList.add('scanned');
    });
  }

  function enter(s) {
    s.querySelectorAll('[data-count]').forEach(el => { el.dataset.done = ''; });
    runCounts(s);
    scan(s, true);
  }
  function state(s) { runCounts(s); scan(s, false); }

  /* ---------- Paralaje y luz en tarjetas ---------- */
  if (!reduced) {
    let tx = 0, ty = 0, x = 0, y = 0;
    addEventListener('mousemove', e => {
      tx = (e.clientX / innerWidth - 0.5) * 2;
      ty = (e.clientY / innerHeight - 0.5) * 2;
      const card = e.target.closest?.('.card');
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      }
    });
    const loop = () => {
      x += (tx - x) * 0.06; y += (ty - y) * 0.06;
      stage.style.setProperty('--px', x.toFixed(3));
      stage.style.setProperty('--py', y.toFixed(3));
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  window.Motion = { enter, state, count };
})();
