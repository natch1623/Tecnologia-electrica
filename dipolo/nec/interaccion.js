(() => {
  'use strict';
  const selector = key => document.getElementById(key);
  const number = new Intl.NumberFormat('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const plots = window.DipolePlots;
  const effectsOn = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sum = selector('s03');
  const renderSum = plots.makeSum(sum.querySelector('canvas'));
  const options = [...sum.querySelectorAll('[data-side]')];
  const terms = [...sum.querySelectorAll('[data-term]')];
  const total = selector('total');
  const negative = selector('negative');
  const positive = selector('positive');
  let pointX = 0;
  let sumFrame = 0;

  function showSum(x, side) {
    const [a, b] = renderSum(x);
    negative.textContent = plots.volts(a);
    positive.textContent = '+' + plots.volts(b);
    if (side !== undefined) {
      total.value = side === '0' ? 'V = 0 V · Aportes de igual magnitud'
        : 'V ' + (side === '1' ? '> 0' : '< 0') + ' · ' + plots.volts(a + b);
    }
  }

  options.forEach(button => button.addEventListener('click', () => {
    cancelAnimationFrame(sumFrame);
    const side = button.dataset.side;
    const target = Number(side) * .082;
    options.forEach(item => item.setAttribute('aria-pressed', String(button === item)));
    terms.forEach(term => term.classList.toggle('emphasis', term.dataset.term === side));
    const from = pointX;
    const start = performance.now();
    function frame(now) {
      const time = effectsOn() ? Math.min(1, (now - start) / 380) : 1;
      pointX = from + (target - from) * (1 - (1 - time) ** 3);
      showSum(pointX, time === 1 ? side : undefined);
      if (time < 1) sumFrame = requestAnimationFrame(frame);
    }
    frame(start);
  }));
  showSum(0, '0');

  const rangeR = selector('distance');
  const rangeA = selector('angle');
  const outputR = selector('distance-value');
  const outputA = selector('angle-value');
  const exact = selector('exact');
  const approx = selector('approx');
  const difference = selector('difference');
  const controlManual = selector('manual');
  const controlAuto = selector('auto');
  const canvas = document.querySelector('[data-plot="map"]');
  const map = plots.makeMap(canvas);
  let autoFrame = 0, moving = false, position = [.2, 60];

  function update(r = Number(rangeR.value), degrees = Number(rangeA.value)) {
    position = [r, degrees];
    const theta = degrees * Math.PI / 180;
    const x = Math.cos(theta) * r, y = degrees === 180 ? 0 : Math.sin(theta) * r;
    const volts = plots.potential(x, y), far = plots.kq * plots.d * Math.cos(theta) / r ** 2;
    outputR.value = number.format(r) + ' m';
    outputA.value = Math.round(degrees) + '°';
    rangeR.setAttribute('aria-valuetext', outputR.value);
    rangeA.setAttribute('aria-valuetext', outputA.value);
    exact.textContent = plots.volts(volts);
    approx.textContent = plots.volts(far);
    difference.textContent = Number.isFinite(volts) ? plots.volts(Math.abs(volts - far)) : '—';
    map.draw(r, degrees);
  }

  function stopAuto() {
    if (!moving) return;
    moving = false;
    cancelAnimationFrame(autoFrame);
    controlManual.setAttribute('aria-pressed', 'true');
    controlAuto.setAttribute('aria-pressed', 'false');
    update();
  }
  function moveAuto() {
    if (moving) return;
    moving = true;
    controlManual.setAttribute('aria-pressed', 'false');
    controlAuto.setAttribute('aria-pressed', 'true');
    const from = position;
    let started;
    function frame(now) {
      started ??= now;
      const seconds = (now - started) / 1000;
      const phase = Math.PI * seconds / 5.7;
      const blend = Math.min(1, seconds / 1.4);
      const r = from[0] + (.206 + .055 * Math.sin(phase) - from[0]) * blend;
      const angle = from[1] + (90 - 62 * Math.cos(phase) - from[1]) * blend;
      rangeR.value = r;
      rangeA.value = angle;
      update(r, angle);
      autoFrame = requestAnimationFrame(frame);
    }
    autoFrame = requestAnimationFrame(frame);
  }
  controlManual.addEventListener('click', stopAuto);
  controlAuto.addEventListener('click', moveAuto);
  for (const input of [rangeR, rangeA]) {
    input.addEventListener('pointerdown', stopAuto);
    input.addEventListener('keydown', event => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) stopAuto();
    });
    input.addEventListener('input', () => {
      stopAuto();
      update();
    });
  }
  selector('s11').querySelectorAll('[data-angle]').forEach(button => button.addEventListener('click', () => {
    stopAuto();
    rangeR.value = .20;
    rangeA.value = button.dataset.angle;
    update();
  }));
  function pull(event) {
    const [r, degrees] = map.position(event);
    rangeR.value = r;
    rangeA.value = degrees;
    update();
  }
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    stopAuto();
    canvas.setPointerCapture(event.pointerId);
    pull(event);
  });
  canvas.addEventListener('pointermove', event => {
    if (canvas.hasPointerCapture(event.pointerId)) pull(event);
  });
  update();

  plots.topology(document.querySelector('[data-plot="plane"]'), true);
  plots.decay(document.querySelector('[data-plot="decay"]'));
  window.Scenes = { s11: { leave: stopAuto } };
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopAuto(); });
})();
