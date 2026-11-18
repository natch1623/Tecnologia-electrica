(function () {
  'use strict';
  const SVG = 'http://www.w3.org/2000/svg';
  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }
  function svgDiagram(type, id) {
    if(window.DielectricPhenomena) return window.DielectricPhenomena.molecular(type,id);
    const arrow = `<defs><marker id="${id}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor"/></marker></defs>`;
    const field = `<g class="dm-field"><line x1="90" y1="35" x2="400" y2="35" marker-end="url(#${id})"/><text x="250" y="22" text-anchor="middle">Campo externo E</text></g>`;
    let scene;
    if (type === 'nonpolar') {
      scene = `<g class="dm-cloud"><ellipse cx="250" cy="150" rx="100" ry="66"/><text x="193" y="156">−</text><text x="291" y="156">−</text></g><g class="dm-positive"><circle cx="250" cy="150" r="25"/><text x="250" y="159" text-anchor="middle">+</text></g><g class="dm-induced"><line x1="226" y1="245" x2="288" y2="245" marker-end="url(#${id})"/><text x="320" y="251">p</text></g><text class="dm-caption" x="250" y="285" text-anchor="middle">Modelo esquemático: desplazamiento ligado</text>`;
    } else {
      const initial = [-135, 85, -45, 145, -85, 25];
      const final = [-20, 30, -35, 15, 45, -15];
      scene = initial.map((angle, i) => {
        const x = 100 + (i % 3) * 145, y = 115 + Math.floor(i / 3) * 105;
        return `<g transform="translate(${x} ${y})"><g class="dm-dipole" style="--dm-start:${angle}deg;--dm-end:${final[i]}deg"><line x1="-23" y1="0" x2="23" y2="0"/><circle class="dm-minus" cx="-23" cy="0" r="13"/><circle class="dm-plus" cx="23" cy="0" r="13"/><g transform="translate(-23 0)"><text class="dm-charge-label" x="0" y="6" text-anchor="middle">−</text></g><g transform="translate(23 0)"><text class="dm-charge-label" x="0" y="6" text-anchor="middle">+</text></g><line class="dm-p-vector" x1="-18" y1="24" x2="18" y2="24" marker-end="url(#${id})"/></g></g>`;
      }).join('') + '<text class="dm-caption" x="250" y="285" text-anchor="middle">p: del signo − al + · Orientación parcial</text>';
    }
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('viewBox', '0 0 500 300');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', type === 'polar' ? 'Dipolos permanentes. Al aplicar campo a la derecha adquieren orientación preferente, conservando dispersión angular.' : 'Dieléctrico no polar. El campo a la derecha separa ligeramente los centros de carga ligados y crea un dipolo inducido.');
    svg.innerHTML = arrow + field + scene;
    return svg;
  }
  function science(el, i) {
    if (el.dataset.motionReady) return;
    el.dataset.motionReady = 'true';
    const type = el.dataset.science;
    el.classList.add('dm-science');
    const name = make('div', 'dm-science-heading', type === 'polar' ? 'Dipolos permanentes' : 'Dipolo inducido');
    const svg = svgDiagram(type, 'dm-arrow-' + i);
    const state = make('p', 'dm-state', 'Sin campo externo');
    state.setAttribute('aria-live', 'polite');
    let timer = null;
    function stop() { clearTimeout(timer); timer = null; }
    function apply() {
      el.classList.add('dm-on');
      state.textContent = type === 'polar' ? 'Con campo: orientación preferente, sin alineación perfecta' : 'Con campo: separación relativa de cargas ligadas';
      window.DielectricEmphasis?.pulse(el);
    }
    function clear() {
      stop();
      el.classList.remove('dm-on');
      state.textContent = 'Sin campo externo';
    }
    function start() {
      clear();
      if(document.body.classList.contains('plain')) { apply(); return; }
      timer=setTimeout(() => { timer=null;if(!el.closest('.slide').hidden)apply(); },1200);
    }
    el._dmReset = clear;
    el._dmStart = start;
    el._dmStop = stop;
    el.replaceChildren(name, svg, state);
  }
  function candidates(slide) {
    const body = slide.querySelector('.body');
    if (!body) return [];
    const custom = Array.from(body.querySelectorAll('.map-item, .material-state'));
    if (custom.length) return custom;
    const rows = Array.from(body.querySelectorAll('tbody tr'));
    if (rows.length) return rows;
    const items = Array.from(body.querySelectorAll('li'));
    if (items.length) return items;
    const columns = Array.from(body.querySelectorAll('.columns > div'));
    if (columns.length) return columns;
    return Array.from(body.children).filter(el => !el.classList.contains('dm-reveal-controls'));
  }
  function responseCharts(slide) {
    slide.querySelectorAll('.columns > div').forEach(function (column, index) {
      if (column.querySelector('.dm-response')) return;
      const chart = document.createElementNS(SVG, 'svg');
      chart.setAttribute('viewBox', '0 0 340 205');
      chart.setAttribute('role', 'img');
      chart.setAttribute('aria-label', index === 0 ? 'Esquema cualitativo de P frente a E: relación proporcional recta.' : 'Esquema cualitativo de P frente a E: ejemplo de relación no lineal sin histéresis.');
      chart.classList.add('dm-response');
      const d = index === 0 ? 'M40 155 L290 30' : 'M40 155 Q165 155 290 30';
      const examples=[.33,.66].map(t=>({x:40+250*t,y:155-125*(index?t*t:t)}));
      chart.innerHTML = `<path class="dm-chart-axis" d="M40 15V155H315"/><text x="17" y="26">P</text><text x="319" y="163">E</text><text x="22" y="171">0</text>${examples.map(({x,y},n)=>`<path class="ph-chart-guide" d="M${x} 155V${y}H40"/><circle class="ph-chart-sample" cx="${x}" cy="${y}" r="4"/><text class="ph-chart-label" x="${x}" y="181" text-anchor="middle">E${n?'₂':'₁'}</text>`).join('')}<path class="dm-chart-curve" d="${d}"/><circle class="dm-chart-point" cx="0" cy="0" r="5"/><text class="dm-chart-caption" x="180" y="203" text-anchor="middle">${index?'Ejemplo de respuesta no proporcional':'Igual proporción entre P y E'}</text>`;
      const curve = chart.querySelector('.dm-chart-curve');
      const point = chart.querySelector('.dm-chart-point');
      let animation = null;
      function reset() {
        if (animation) { animation.cancel(); animation = null; }
        point.style.transform = 'translate(40px, 155px)';
        chart.classList.remove('dm-chart-active');
      }
      chart._dmRun = function () {
        reset();
        chart.classList.add('dm-chart-active');
        const length = curve.getTotalLength();
        const end = curve.getPointAtLength(length);
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !point.animate) {
          point.style.transform = `translate(${end.x}px, ${end.y}px)`;
          return;
        }
        const frames = Array.from({ length: 41 }, function (_, i) {
          const p = curve.getPointAtLength(length * i / 40);
          return { transform: `translate(${p.x}px, ${p.y}px)`, offset: i / 40 };
        });
        animation = point.animate(frames, { duration: 900, easing: 'linear', fill: 'forwards' });
      };
      chart._dmReset = reset;
      column.append(chart);
      reset();
    });
  }
  function reveal(slide) {
    if (slide.dataset.revealReady) return;
    const number = Number(slide.dataset.slide);
    if (number === 9) responseCharts(slide);
    const items = candidates(slide);
    if (!items.length) return;
    slide.dataset.revealReady = 'true';
    items.forEach(el => el.classList.add('dm-step'));
    const groupSize = number === 7 ? 2 : Math.ceil(items.length / 2);
    let count = 0;
    const timers = new Set();
    function stop() { timers.forEach(clearTimeout); timers.clear(); }
    function later(fn, delay) { const id=setTimeout(() => {timers.delete(id);fn();},delay);timers.add(id); }
    function clear() {
      stop();
      count = 0;
      slide.classList.remove('dm-started');
      items.forEach(el => el.classList.remove('dm-shown', 'dm-current'));
      slide.querySelectorAll('.dm-response').forEach(chart => chart._dmReset());
    }
    function step() {
      if(slide.hidden || document.body.classList.contains('plain')) return stop();
      slide.classList.add('dm-started');
      items.forEach(el => el.classList.remove('dm-current'));
      items.slice(count, count + groupSize).forEach(function (el) {
        el.classList.add('dm-shown', 'dm-current');
        window.DielectricEmphasis?.pulse(el);
        el.querySelectorAll('.dm-response').forEach(chart => chart._dmRun());
      });
      count = Math.min(count + groupSize, items.length);
      const done = count >= items.length;
      if(!done) later(step,1600);
      else later(() => {slide.classList.remove('dm-started');items.forEach(el=>el.classList.remove('dm-current'));},1400);
    }
    function start() { clear();if(!document.body.classList.contains('plain'))later(step,800); }
    slide._dmReset = clear;
    slide._dmStart = start;
    slide._dmStop = stop;
    clear();
  }
  let listening = false;
  window.DielectricMotion = {
    init: function () {
      document.querySelectorAll('.science[data-science]').forEach(science);
      document.querySelectorAll('.slide').forEach(function (slide) {
        if ([3, 6, 7, 8, 9, 10, 11].includes(Number(slide.dataset.slide))) reveal(slide);
      });
      if (!listening) {
        window.addEventListener('slidechange', function (event) {
          document.querySelectorAll('.dm-science, .slide[data-reveal-ready]').forEach(el => { if (el._dmReset) el._dmReset(); });
          document.querySelector(`.slide[data-slide="${event.detail.index+1}"]`)?._dmStart?.();
          document.querySelectorAll(`.slide[data-slide="${event.detail.index+1}"] .dm-science`).forEach(el=>el._dmStart?.());
        });
        listening = true;
      }
    },
    stopAuto: function(){window.DielectricEmphasis?.clear();document.querySelectorAll('.dm-science, .slide[data-reveal-ready]').forEach(el=>el._dmStop?.());},
    refreshAuto: function(){window.DielectricEmphasis?.clear();document.querySelectorAll('.dm-science, .slide[data-reveal-ready]').forEach(el=>el._dmReset?.());document.querySelector('.slide:not([hidden])')?._dmStart?.();document.querySelectorAll('.slide:not([hidden]) .dm-science').forEach(el=>el._dmStart?.());}
  };
})();
