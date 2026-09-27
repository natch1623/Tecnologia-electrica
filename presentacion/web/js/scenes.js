/* =========================================================
   Escenas · diagramas técnicos interactivos
   Cada escena: build(slide) · enter(slide) · state(slide, n, prev) · leave(slide) · states
   ========================================================= */
(() => {
  const G = window.GEO;
  const NS = 'http://www.w3.org/2000/svg';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, attrs = {}, parent, text) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  const svgOf = s => s.querySelector('svg.scene');
  const fmt = (v, d = 1) => v.toFixed(d).replace('.', ',');
  const diamond = (x, y, r) => `M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y} Z`;
  const deck = () => window.Deck;
  // Retraso de entrada (ms) para las clases pop · rise · fade · draw · grow
  const pd = ms => `--pd:${Math.round(ms)}ms`;

  const S = {};

  /* ---------- 04 · Condición normal (radial) ---------- */
  const COND = [
    ['01', 'Correctamente instalado', '110.4(D)(1)', 'Instalado según el fabricante y el código aplicable, sin modificaciones improvisadas.', 'Instalado'],
    ['02', 'Adecuadamente mantenido', '110.4(D)(2)', 'Mantenido según el fabricante o normas de consenso (205.3). Es la condición que controla el Capítulo 2: sin ella, el equipo no despeja la falla en el tiempo que la tabla supone.', 'Mantenido'],
    ['03', 'Usado según instrucciones del fabricante', '110.4(D)(3)', 'Operado dentro de sus valores nominales y del uso previsto.', 'Uso según fabricante'],
    ['04', 'Puertas cerradas y aseguradas', '110.4(D)(4)', 'La envolvente solo contiene y desvía el arco si las puertas están cerradas y aseguradas.', 'Puertas cerradas'],
    ['05', 'Cubiertas en su lugar y aseguradas', '110.4(D)(5)', 'Sin cubiertas, las partes energizadas quedan expuestas al contacto y al arco.', 'Cubiertas puestas'],
    ['06', 'Sin evidencia de falla inminente', '110.4(D)(6)', 'Sin señales de falla inminente: calor, ruido, olor, arcos o daño visible.', 'Sin falla inminente']
  ];
  S.s04 = {
    states: 1,
    build(slide) {
      const svg = svgOf(slide);
      const { cx, cy, r } = G.ring;
      el('circle', { cx, cy, r: r - 70, class: 'ring-inner fade', style: pd(200) }, svg);
      el('text', { x: cx, y: cy - 14, class: 'ring-c' }, svg, 'CONDICIÓN NORMAL');
      el('text', { x: cx, y: cy + 16, class: 'ring-c' }, svg, 'DE OPERACIÓN');
      el('text', { x: cx, y: cy + 56, class: 'ring-ref' }, svg, '110.4(D)');
      COND.forEach((c, i) => {
        const a = ((-60 + i * 60) * Math.PI) / 180;
        const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        el('line', { x1: cx + (r - 70) * Math.cos(a), y1: cy + (r - 70) * Math.sin(a), x2: x, y2: y, class: 'spoke draw', pathLength: 1, style: pd(300 + i * 90) }, svg);
        const g = el('g', { class: `node hit${i === 1 ? ' key' : ''}`, 'data-i': i, tabindex: 0, role: 'button', 'aria-label': c[1] }, svg);
        el('circle', { cx: x, cy: y, r: 40, class: 'halo' }, g);
        el('circle', { cx: x, cy: y, r: i === 1 ? 15 : 10, class: 'core pop', style: pd(620 + i * 90) }, g);
        const cos = Math.cos(a);
        const lx = cx + (r + 40) * Math.cos(a), ly = cy + (r + 40) * Math.sin(a) + 8;
        el('text', { x: lx, y: ly - 26, class: 'node-n fade', style: pd(760 + i * 90), 'text-anchor': cos > 0.2 ? 'start' : cos < -0.2 ? 'end' : 'middle' }, g, c[0]);
        el('text', { x: lx, y: ly, class: 'node-l fade', style: pd(760 + i * 90), 'text-anchor': cos > 0.2 ? 'start' : cos < -0.2 ? 'end' : 'middle' }, g, c[4]);
        if (i === 1) {
          const cr = el('g', { class: 'crack', 'data-at': 1 }, svg);
          el('path', { d: `M${x - 6} ${y - 40} l8 14 l-10 10 l12 12 l-6 12 M${x + 20} ${y - 30} l-10 16 l14 6 M${x + 10} ${y + 22} l14 10 l-4 16` }, cr);
        }
        g.addEventListener('click', e => { e.stopPropagation(); this.select(slide, i); });
      });
    },
    select(slide, i) {
      const c = COND[i];
      slide.querySelectorAll('.node').forEach(n => n.classList.toggle('sel', +n.dataset.i === i));
      const d = slide.querySelector('.detail');
      d.classList.remove('swap'); void d.offsetWidth; d.classList.add('swap');
      d.classList.toggle('key', i === 1);
      d.querySelector('.dn').textContent = c[0];
      d.querySelector('.dh').textContent = c[1];
      d.querySelector('.dr').textContent = c[2];
      d.querySelector('.dp').textContent = c[3];
    },
    enter(slide) { this.select(slide, 1); },
    state(slide, n) {
      if (n >= 1) this.select(slide, 1);
      window.Thread.style({ color: n >= 1 ? '#ff4d6d' : '#a58bff' });
    }
  };

  /* ---------- 05 · Sistema de barreras ---------- */
  S.s05 = {
    states: 1,
    build(slide) {
      const svg = svgOf(slide);
      const { xs, y0, y1, y } = G.gates;
      xs.forEach((x, i) => {
        const g = el('g', { class: `gate${i === 2 ? ' hot' : ''}` }, svg);
        const t = 300 + i * 110;
        const ln = { class: 'draw', pathLength: 1, style: pd(t) };
        if (i === 2) {
          el('line', { x1: x, y1: y0, x2: x, y2: y - 34, ...ln }, g);
          el('line', { x1: x, y1: y + 34, x2: x, y2: y1, ...ln }, g);
          el('line', { x1: x, y1: y - 34, x2: x, y2: y + 34, ...ln, class: 'mid draw' }, g);
        } else {
          el('line', { x1: x, y1: y0, x2: x, y2: y1, ...ln }, g);
        }
        el('path', { d: diamond(x, y0, 6), class: 'cap pop', style: pd(t) }, g);
        el('path', { d: diamond(x, y1, 6), class: 'cap pop', style: pd(t + 700) }, g);
      });
      const x = xs[2];
      const cr = el('g', { class: 'crack', 'data-at': 1 }, svg);
      el('path', { d: `M${x} ${y - 34} l-12 -18 l8 -16 l-10 -20 M${x} ${y - 34} l14 -12 l-4 -18 M${x} ${y + 34} l-10 16 l12 14 l-6 22 M${x} ${y + 34} l12 20 l-2 16` }, cr);
      el('text', { x, y: y0 - 22, class: 'tag-danger', 'text-anchor': 'middle', 'data-at': 1 }, svg, 'CASO 4');
    }
  };

  /* ---------- 06 · Tiempos de despeje ---------- */
  S.s06 = {
    build(slide) {
      const svg = svgOf(slide);
      G.clear.xs.forEach((x, i) => {
        el('path', { d: diamond(x, G.clear.y, i === 4 ? 12 : 9), class: `${i === 4 ? 'dm bad' : 'dm'} pop`, style: pd(500 + i * 130) }, svg);
        el('line', { x1: x, y1: G.clear.y - 42, x2: x, y2: G.clear.y - 18, class: 'tick draw', pathLength: 1, style: pd(560 + i * 130) }, svg);
      });
      el('text', { x: 1790, y: G.clear.y + 6, class: 'axis-t' }, svg, 't');
    }
  };

  /* ---------- 07 · Tiempo → energía ---------- */
  S.s07 = {
    states: 2,
    build(slide) {
      const svg = svgOf(slide);
      const E = G.energy;
      const xEnd = E.ox + E.tmax * E.sx;
      el('line', { x1: E.ox, y1: E.oy, x2: xEnd + 20, y2: E.oy, class: 'axis draw', pathLength: 1, style: pd(250) }, svg);
      el('line', { x1: E.ox, y1: E.oy, x2: E.ox, y2: 240, class: 'axis draw', pathLength: 1, style: pd(250) }, svg);
      [0.1, 0.2, 0.3, 0.4, 0.5].forEach(t => {
        const x = E.ox + t * E.sx;
        el('line', { x1: x, y1: E.oy, x2: x, y2: E.oy + 10, class: 'axis' }, svg);
        el('line', { x1: x, y1: E.oy, x2: x, y2: 250, class: 'grid fade', style: pd(700 + t * 600) }, svg);
        el('text', { x, y: E.oy + 38, class: 'tick-l', 'text-anchor': 'middle' }, svg, fmt(t));
        el('text', { x, y: E.oy + 62, class: 'tick-s', 'text-anchor': 'middle' }, svg, `${Math.round(t * 60)} ciclos`);
      });
      [4, 8, 12, 16].forEach(e => {
        const y = E.yE(e);
        el('line', { x1: E.ox - 10, y1: y, x2: E.ox, y2: y, class: 'axis' }, svg);
        el('text', { x: E.ox - 18, y: y + 7, class: 'tick-l', 'text-anchor': 'end' }, svg, e);
      });
      el('text', { x: xEnd + 26, y: E.oy + 7, class: 'axis-t' }, svg, 't (s)');
      el('text', { x: E.ox, y: 222, class: 'axis-t', 'text-anchor': 'middle' }, svg, 'E (cal/cm²)');
      const y8 = E.yE(8);
      const x8 = E.pt(0.25)[0];
      el('polygon', { points: `${x8},${y8} ${xEnd},${y8} ${xEnd},${E.pt(E.tmax)[1]}`, class: 'over', 'data-at': 2 }, svg);
      el('line', { x1: E.ox, y1: y8, x2: xEnd + 20, y2: y8, class: 'limit' }, svg);
      el('text', { x: E.ox + 14, y: y8 - 14, class: 'limit-l' }, svg, 'EPP CAT. 2 · 8 cal/cm²');
      const [ax, ay] = E.pt(0.05);
      const a = el('g', { 'data-at': 1 }, svg);
      el('line', { x1: ax, y1: E.oy, x2: ax, y2: ay, class: 'col ok' }, a);
      el('line', { x1: ax, y1: ay - 16, x2: ax, y2: 700, class: 'leader' }, a);
      el('circle', { cx: ax, cy: ay, r: 8, class: 'pt ok' }, a);
      const tr = el('g', { class: 'trav', 'data-at': 2 }, svg);
      this.col = el('line', { x1: ax, y1: E.oy, x2: ax, y2: ay, class: 'col' }, tr);
      this.dot = el('circle', { cx: ax, cy: ay, r: 9, class: 'pt' }, tr);
      this.counter = slide.querySelector('.counter');
      slide.querySelector('.pt-lbl.ok').style.cssText += ';left:1030px;top:628px;width:250px';
      slide.querySelector('.pt-lbl.bad').style.cssText += ';left:1200px;top:250px;width:470px;text-align:right';
    },
    place(t) {
      const E = G.energy;
      const [x, y] = E.pt(t);
      const e = E.k * t;
      const c = e >= 8 ? '#ff4d6d' : '#8fe3ff';
      this.col.setAttribute('x1', x); this.col.setAttribute('x2', x); this.col.setAttribute('y2', y);
      this.col.style.stroke = c;
      this.dot.setAttribute('cx', x); this.dot.setAttribute('cy', y);
      this.dot.style.fill = c;
      this.counter.style.left = `${x + 22}px`;
      this.counter.style.top = `${y - 46}px`;
      this.counter.querySelector('b').textContent = fmt(e);
      this.counter.classList.toggle('hot', e >= 8);
    },
    state(slide, n, prev) {
      cancelAnimationFrame(this.raf);
      clearTimeout(this.wait);
      this.counter.classList.remove('done');
      if (n < 2) { this.place(0.05); return; }
      if (prev >= 2 || reduced) { this.place(0.5); this.counter.classList.add('done'); return; }
      const t0 = performance.now(), dur = 2600;
      const step = now => {
        const p = Math.min(1, (now - t0) / dur);
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        this.place(0.05 + 0.45 * e);
        if (p < 1) this.raf = requestAnimationFrame(step);
        else this.counter.classList.add('done');
      };
      this.place(0.05);
      this.wait = setTimeout(() => { this.raf = requestAnimationFrame(step); }, 350);
    },
    leave() { cancelAnimationFrame(this.raf); clearTimeout(this.wait); }
  };

  /* ---------- 08 · Cadena causal ---------- */
  S.s08 = {
    states: 1,
    build(slide) {
      const svg = svgOf(slide);
      const { xs, y } = G.chain;
      xs.forEach((x, i) => {
        el('circle', { cx: x, cy: y, r: 11, class: `cn${i < 2 ? ' m' : ''}${i === 6 ? ' e' : ''} pop`, style: `--i:${i}; ${pd(350 + i * 90)}` }, svg);
        el('text', { x, y: y - 40, class: 'cn-n', 'text-anchor': 'middle' }, svg, String(i + 1).padStart(2, '0'));
      });
      el('circle', { cx: xs[0], cy: y, r: 7, class: 'pulse-dot' }, svg);
      slide.querySelectorAll('.lk .n').forEach(n => n.remove());
    },
    state(slide, n, prev) {
      clearTimeout(this.hit);
      // Mismo instante en que el pulso alcanza el eslabón 07 (0,2 s + 6 · 0,28 s)
      if (n >= 1 && prev === 0 && !reduced) this.hit = setTimeout(() => deck().burst(G.chain.xs[6], G.chain.y, [255, 77, 109], 44), 1880);
    },
    leave() { clearTimeout(this.hit); }
  };

  /* ---------- 10 · CA vs CC ---------- */
  S.s10 = {
    build(slide) {
      const svg = svgOf(slide);
      const { ac, dc } = G.waves;
      el('line', { x1: ac.x0, y1: ac.cy, x2: ac.x1, y2: ac.cy, class: 'base' }, svg);
      el('line', { x1: dc.x0, y1: dc.base, x2: dc.x1, y2: dc.base, class: 'base' }, svg);
      el('text', { x: ac.x1 + 14, y: ac.cy + 6, class: 'tick-l' }, svg, '0');
      el('text', { x: dc.x1 + 14, y: dc.base + 6, class: 'tick-l' }, svg, '0');
      el('text', { x: dc.x1 + 14, y: dc.y + 6, class: 'tick-l c-danger-f' }, svg, 'I');
      this.zc = [];
      for (let k = 0; k <= 6; k++) this.zc.push(el('circle', { cx: ac.x0 + k * (ac.period / 2), cy: ac.cy, r: 7, class: 'zc' }, svg));
      el('text', { x: ac.x0, y: 380, class: 'tick-s' }, svg, '● CRUCE POR CERO');
      const arcG = (x, y, label) => {
        const g = el('g', { class: 'arcg' }, svg);
        el('rect', { x: x - 44, y: y - 14, width: 12, height: 28, class: 'elec' }, g);
        el('rect', { x: x + 32, y: y - 14, width: 12, height: 28, class: 'elec' }, g);
        const glow = el('circle', { cx: x, cy: y, r: 34, class: 'arc-glow' }, g);
        const bolt = el('path', { class: 'bolt' }, g);
        el('text', { x, y: y - 36, class: 'tick-s', 'text-anchor': 'middle' }, g, label);
        return { x, y, glow, bolt };
      };
      this.arcAC = arcG(780, 390, 'ARCO');
      this.arcDC = arcG(1690, 350, 'ARCO');
      this.curAC = el('circle', { r: 7, class: 'cur' }, svg);
      this.curDC = el('circle', { r: 7, class: 'cur hot' }, svg);
      this.lineAC = el('line', { class: 'cur-l' }, svg);
      this.lineDC = el('line', { class: 'cur-l' }, svg);
      this.draw(0.35);
    },
    bolt(a, k) {
      if (k < 0.07) { a.bolt.setAttribute('d', ''); a.glow.style.opacity = 0; return; }
      let d = `M${a.x - 32} ${a.y}`;
      for (let i = 1; i < 8; i++) d += ` L${a.x - 32 + i * 8} ${a.y + (Math.random() - 0.5) * 22 * k}`;
      d += ` L${a.x + 32} ${a.y}`;
      a.bolt.setAttribute('d', d);
      a.bolt.style.opacity = 0.35 + 0.65 * k;
      a.glow.style.opacity = 0.15 + 0.6 * k;
      a.glow.setAttribute('r', 16 + 22 * k);
    },
    draw(tau) {
      const { ac, dc } = G.waves;
      const span = ac.x1 - ac.x0;
      const xa = ac.x0 + ((tau * 110) % span);
      const s = Math.sin(((xa - ac.x0) / ac.period) * Math.PI * 2);
      const ya = ac.cy - ac.amp * s;
      this.curAC.setAttribute('cx', xa); this.curAC.setAttribute('cy', ya);
      this.lineAC.setAttribute('x1', xa); this.lineAC.setAttribute('x2', xa); this.lineAC.setAttribute('y1', ac.cy - ac.amp - 20); this.lineAC.setAttribute('y2', ac.cy + ac.amp + 20);
      const k = Math.pow(Math.abs(s), 0.8);
      this.bolt(this.arcAC, k);
      this.zc.forEach(z => z.classList.toggle('flash', Math.abs(+z.getAttribute('cx') - xa) < 10));
      const xd = dc.x0 + ((tau * 110) % (dc.x1 - dc.x0));
      this.curDC.setAttribute('cx', xd); this.curDC.setAttribute('cy', dc.y);
      this.lineDC.setAttribute('x1', xd); this.lineDC.setAttribute('x2', xd); this.lineDC.setAttribute('y1', dc.y - 60); this.lineDC.setAttribute('y2', dc.base + 20);
      this.bolt(this.arcDC, 0.85 + Math.random() * 0.15);
    },
    enter() {
      if (reduced) return;
      let last = performance.now(), tau = 0, f = 0;
      const loop = now => {
        tau += (now - last) / 1000; last = now;
        if (++f % 2 === 0) this.draw(tau);
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    },
    leave() { cancelAnimationFrame(this.raf); }
  };

  /* ---------- 11 · Fronteras en CC ---------- */
  S.s11 = {
    states: 1,
    build(slide) {
      const svg = svgOf(slide);
      const F = G.front;
      const arcD = r => {
        const a = (F.a * Math.PI) / 180;
        return `M${F.cx + r * Math.cos(-a)} ${F.cy + r * Math.sin(-a)} A${r} ${r} 0 0 1 ${F.cx + r * Math.cos(a)} ${F.cy + r * Math.sin(a)}`;
      };
      const face = el('g', { class: 'face' }, svg);
      el('rect', { x: F.cx - 34, y: F.cy - 280, width: 34, height: 560 }, face);
      for (let y = F.cy - 260; y < F.cy + 280; y += 30) el('line', { x1: F.cx - 34, y1: y, x2: F.cx, y2: y }, face);
      el('text', { x: F.cx - 17, y: F.cy - 296, class: 'tick-s', 'text-anchor': 'middle' }, svg, 'BANCO');
      el('line', { x1: F.cx, y1: F.cy, x2: F.cx + 2.6 * F.k, y2: F.cy, class: 'base' }, svg);
      [0.5, 1, 1.5, 2, 2.5].forEach(m => {
        const x = F.cx + m * F.k;
        el('line', { x1: x, y1: F.cy - 6, x2: x, y2: F.cy + 6, class: 'axis' }, svg);
        el('text', { x, y: F.cy - 14, class: 'tick-s', 'text-anchor': 'middle' }, svg, `${fmt(m)} m`);
      });
      el('path', { d: arcD(1.0 * F.k), class: 'fr ice grow', style: `${pd(450)}; transform-origin: ${F.cx}px ${F.cy}px` }, svg);
      el('path', { d: arcD(2.5 * F.k), class: 'fr danger', 'data-at': 1 }, svg);
      const lab = (m, t1, t2, cls, at) => {
        const a = (F.a * Math.PI) / 180, r = m * F.k;
        const g = el('g', at ? { 'data-at': at } : {}, svg);
        el('text', { x: F.cx + r * Math.cos(a) + 12, y: F.cy + r * Math.sin(a) + 6, class: `fr-l ${cls}` }, g, t1);
        el('text', { x: F.cx + r * Math.cos(a) + 12, y: F.cy + r * Math.sin(a) + 30, class: 'tick-s' }, g, t2);
      };
      lab(1.0, '1,0 m', 'LIMITADA · CHOQUE', 'ice');
      lab(1.8, '1,8 m', 'FRONTERA DE ARCO · CAT. 3', '');
      lab(2.5, '2,5 m', 'CAT. 4 · SI 281 V', 'danger', 1);
      const wx = F.cx + 0.455 * F.k;
      el('circle', { cx: wx, cy: F.cy, r: 6, class: 'wd pop', style: pd(800) }, svg);
      el('text', { x: wx, y: F.cy + 30, class: 'tick-s', 'text-anchor': 'middle' }, svg, '455 mm');
      el('text', { x: F.cx + 12, y: F.cy - 250, class: 'tick-s' }, svg, 'RESTRINGIDA: EVITAR EL CONTACTO');
      slide.querySelector('.toggle').addEventListener('click', e => {
        e.stopPropagation();
        deck().set(slide, +slide.dataset.s ? 0 : 1);
      });
    }
  };

  /* ---------- 12 · Banco de baterías ---------- */
  S.s12 = {
    states: 4,
    build(slide) {
      const svg = svgOf(slide);
      const R = G.rack;
      const base = el('g', { class: 'rack' }, svg);
      // Bastidor
      el('rect', { x: R.upL, y: R.railTop, width: R.upR - R.upL + 8, height: 7, class: 'metal' }, base);
      el('rect', { x: R.upL, y: R.shelfUp, width: R.upR - R.upL + 8, height: 7, class: 'metal' }, base);
      el('rect', { x: R.upL, y: R.shelfLo, width: R.upR - R.upL + 8, height: 7, class: 'metal' }, base);
      el('rect', { x: R.upL, y: R.railTop, width: 8, height: R.shelfLo - R.railTop + 7, class: 'metal' }, base);
      el('rect', { x: R.upR - 4, y: R.railTop, width: 8, height: R.shelfLo - R.railTop + 7, class: 'metal' }, base);
      el('text', { x: R.upR + 4, y: R.shelfLo + 40, class: 'tick-s', 'text-anchor': 'end' }, base, 'BASTIDOR METÁLICO');
      // Celdas
      // Orden serie: abajo 1 → 62 de izquierda a derecha; arriba 63 → 125 de derecha a izquierda
      const row = (labels, up) => labels.forEach((lb, i) => {
        const x = R.x0 + i * R.step, y = up ? R.upY : R.loY;
        const g = el('g', { class: 'rise', style: pd(350 + (up ? 25 - i : i) * 34) }, base);
        if (lb === '…') { el('text', { x: x + R.w / 2, y: y + R.h - 14, class: 'cell-l dim', 'text-anchor': 'middle' }, g, '···'); return; }
        el('rect', { x, y, width: R.w, height: R.h, rx: 3, class: 'cell' }, g);
        el('rect', { x: x + 6, y: y - 7, width: 10, height: 7, class: 'post' }, g);
        el('rect', { x: x + R.w - 16, y: y - 7, width: 10, height: 7, class: 'post' }, g);
        el('text', { x: x + R.w / 2, y: y + R.h - 12, class: 'cell-l', 'text-anchor': 'middle' }, g, lb);
      });
      row(R.upper, true);
      row(R.lower, false);
      el('text', { x: R.upR - 6, y: R.shelfUp + 32, class: 'tick-s', 'text-anchor': 'end' }, base, 'NIVEL SUPERIOR · 63 → 125, DE DERECHA A IZQUIERDA');
      el('text', { x: R.x0, y: R.loY + R.h + 34, class: 'tick-s' }, base, 'NIVEL INFERIOR · 1 → 62');
      // Cable puente
      const cy0 = R.cy(false), cy1 = R.cy(true);
      el('path', { d: `M${R.cx(12) + R.w / 2} ${cy0} L${R.cableX} ${cy0} L${R.cableX} 520 L1630 490 L${R.cableX} 460 L${R.cableX} ${cy1} L${R.cx(12) + R.w / 2} ${cy1}`, class: 'bridge draw', pathLength: 1, style: pd(350 + 12.5 * 34) }, base);
      el('text', { x: R.cableX + 16, y: 420, class: 'tick-s' }, base, 'CABLE');
      el('text', { x: R.cableX + 16, y: 444, class: 'tick-s' }, base, 'PUENTE');
      // Interruptor y UPS
      const b = R.brk, u = R.ups;
      el('rect', { x: b.x, y: b.y, width: b.w, height: b.h, class: 'box brk' }, base);
      el('text', { x: b.x + b.w / 2, y: b.y + 42, class: 'box-t', 'text-anchor': 'middle' }, base, 'INT. CC');
      el('text', { x: b.x + b.w / 2, y: b.y + 74, class: 'box-v', 'text-anchor': 'middle' }, base, '400 A');
      el('rect', { x: u.x, y: u.y, width: u.w, height: u.h, class: 'box ups' }, base);
      el('text', { x: u.x + u.w / 2, y: u.y + 58, class: 'box-u', 'text-anchor': 'middle' }, base, 'UPS-2');
      el('line', { x1: b.x + b.w / 2, y1: b.y + b.h, x2: u.x + u.w / 2, y2: u.y, class: 'flow-ok' }, base);
      el('text', { x: b.x + b.w / 2 + 14, y: 560, class: 'tick-s' }, base, 'A 6 m');

      // 1 · Tensiones
      const v = el('g', { class: 'volt', 'data-at': 1 }, svg);
      el('text', { x: 455, y: cy1 - 22, class: 'v-l', 'text-anchor': 'end' }, v, '+ ≈ 281 V');
      el('text', { x: 462, y: 540, class: 'v-l', 'text-anchor': 'end' }, v, '− 0 V');
      el('text', { x: R.cableX + 16, y: cy0 + 44, class: 'v-l' }, v, '≈ 140 V');
      el('text', { x: R.x0, y: R.loY + R.h + 64, class: 'tick-s' }, v, '≈ 2,25 V POR CELDA EN FLOTACIÓN');

      // 2 · Punto de falla
      const f = el('g', { 'data-at': 2 }, svg);
      el('circle', { cx: R.contact[0], cy: R.contact[1], r: 18, class: 'pulse fault-h' }, f);
      el('circle', { cx: R.contact[0], cy: R.contact[1], r: 7, class: 'fault' }, f);
      el('text', { x: R.contact[0] - 20, y: R.contact[1] + 6, class: 'f-l', 'text-anchor': 'end' }, f, 'contacto cable–bastidor · ≈ 0 Ω');

      // 3 · Trayectoria del lazo
      const lp = el('g', { 'data-at': 3 }, svg);
      for (let i = 5; i < 13; i++) {
        if (R.upper[i] === '…') continue;
        el('rect', { x: R.x0 + i * R.step, y: R.upY, width: R.w, height: R.h, rx: 3, class: 'cell hot' }, lp);
      }
      const px = R.x0 + 5 * R.step + 10;
      const loopD = `M${px} ${R.upY - 4} L${px} ${R.railTop + 3} L${R.upR} ${R.railTop + 3} L${R.upR} ${R.contact[1]} L1630 490 L${R.cableX} 460 L${R.cableX} ${cy1} L${R.cx(12)} ${cy1} L${R.cx(5)} ${cy1} L${px} ${R.upY - 4}`;
      this.loop = el('path', { d: loopD, class: 'loop', pathLength: 1 }, lp);
      el('path', { d: loopD, class: 'loop-flow' }, lp);
      el('rect', { x: px - 6, y: R.railTop - 2, width: 12, height: R.upY - R.railTop, rx: 3, class: 'wrench' }, lp);
      el('text', { x: px, y: R.railTop - 16, class: 'f-l', 'text-anchor': 'middle' }, lp, 'matraca · borne + celda 118');
      el('text', { x: 1300, y: R.railTop - 16, class: 'f-l', 'text-anchor': 'middle' }, lp, '≈ 126 V · varios kA');

      // 4 · Consecuencia
      const c = el('g', { 'data-at': 4 }, svg);
      el('rect', { x: b.x - 8, y: b.y - 8, width: b.w + 16, height: b.h + 16, class: 'out' }, c);
      el('text', { x: b.x + b.w / 2, y: b.y - 22, class: 'f-l', 'text-anchor': 'middle' }, c, 'FUERA DE LA CADENA');
      el('text', { x: b.x + b.w / 2 + 14, y: 640, class: 'tick-s' }, c, '0 A DE FALLA');
    },
    state(slide, n) {
      slide.querySelectorAll('.rail li').forEach(li => {
        li.classList.toggle('cur', +li.dataset.k === n);
        li.classList.toggle('done', +li.dataset.k < n);
      });
      window.Thread.style({ o: n >= 3 ? 0.3 : 0.9 });
    }
  };

  /* ---------- 13 · Corte de celda ---------- */
  S.s13 = {
    states: 2,
    build(slide) {
      const svg = svgOf(slide);
      const C = G.cell;
      // Techo y extracción (estado 2)
      const top = el('g', { 'data-at': 2 }, svg);
      el('rect', { x: 150, y: 104, width: 730, height: 46, class: 'h2-band' }, top);
      el('line', { x1: 150, y1: 104, x2: 880, y2: 104, class: 'ceil' }, top);
      
      const fan = el('g', { class: 'fan' }, top);
      el('circle', { cx: 880, cy: 136, r: 24, class: 'fan-c' }, fan);
      el('path', { d: 'M880 136 l0 -18 M880 136 l16 9 M880 136 l-16 9', class: 'fan-b' }, fan);
      el('text', { x: 860, y: 184, class: 'tick-s', 'text-anchor': 'end' }, top, 'TECHO: EL H₂ SUBE Y SE ACUMULA · EXTRACCIÓN ALTA');
      // Celda
      el('rect', { x: C.x0, y: C.top, width: C.x1 - C.x0, height: C.bot - C.top, rx: 8, class: 'cellbox' }, svg);
      el('rect', { x: C.x0 + 2, y: C.level, width: C.x1 - C.x0 - 4, height: C.bot - C.level - 2, class: 'electrolyte' }, svg);
      el('line', { x1: C.x0 + 2, y1: C.level, x2: C.x1 - 2, y2: C.level, class: 'surface' }, svg);
      const plates = [];
      for (let j = 0; j < 8; j++) {
        const x = 290 + j * 52;
        plates.push([x, j % 2 === 0]);
        el('rect', { x, y: 440, width: 14, height: 430, rx: 2, class: j % 2 === 0 ? 'plate pos' : 'plate neg' }, svg);
      }
      el('rect', { x: 290, y: C.top - 30, width: 20, height: 30, class: 'post' }, svg);
      el('rect', { x: 610, y: C.top - 30, width: 20, height: 30, class: 'post' }, svg);
      el('text', { x: 300, y: C.top - 42, class: 'pol', 'text-anchor': 'middle' }, svg, '+');
      el('text', { x: 620, y: C.top - 42, class: 'pol', 'text-anchor': 'middle' }, svg, '−');
      el('text', { x: 460, y: 470, class: 'gas-l', 'text-anchor': 'middle' }, svg, 'H₂ + O₂');
      el('text', { x: 460, y: 720, class: 'elec-l', 'text-anchor': 'middle' }, svg, 'H₂SO₄ diluido');
      // Burbujas: H₂ en placas negativas, O₂ en positivas
      plates.forEach(([x, pos]) => {
        for (let k = 0; k < 3; k++) {
          const y0 = 850 - Math.random() * 260;
          el('circle', {
            cx: x + 7 + (Math.random() - 0.5) * 22, cy: y0, r: pos ? 2.6 : 3.6 + Math.random() * 2,
            class: `bub ${pos ? 'o2' : 'h2'}`,
            style: `--rise:${y0 - C.level - 4}px; --t:${(2.2 + Math.random() * 2).toFixed(2)}s; --dl:${(-Math.random() * 4).toFixed(2)}s`
          }, svg);
        }
      });
      for (let k = 0; k < 10; k++) {
        el('circle', { cx: 290 + Math.random() * 340, cy: C.level - 8, r: 2.2, class: 'gas', style: `--dx:${(460 - (290 + k * 34)).toFixed(0)}px; --t:${(2.4 + Math.random() * 1.6).toFixed(2)}s; --dl:${(-Math.random() * 3).toFixed(2)}s` }, svg);
      }
      el('text', { x: C.x0, y: C.bot + 40, class: 'tick-s' }, svg, '○ H₂ EN LA PLACA NEGATIVA    ● O₂ EN LA POSITIVA');
      // Apagallamas
      const [cx0, cx1, cy0, cy1] = C.cap;
      el('rect', { x: cx0, y: cy0, width: cx1 - cx0, height: cy1 - cy0, rx: 5, class: 'arrester' }, svg);
      [cy0 + 12, cy0 + 24, cy0 + 36].forEach(y => el('line', { x1: cx0 + 8, y1: y, x2: cx1 - 8, y2: y, class: 'mesh' }, svg));
      const fl = el('g', { 'data-at': 1 }, svg);
      el('path', { d: 'M460 250 c -14 -16 -4 -30 0 -44 c 4 14 14 26 0 44 z', class: 'flame' }, fl);
      el('path', { d: `M${cx0 - 16} ${cy0 - 12} l22 0 M${cx1 - 6} ${cy0 - 12} l22 0`, class: 'block' }, fl);
      el('text', { x: 520, y: 262, class: 'ctrl-l' }, fl, 'APAGALLAMAS · 320.3(D)');
      el('text', { x: 520, y: 290, class: 'tick-s' }, fl, 'EL GAS SALE · LA LLAMA NO ENTRA');
    },
    state(slide, n) {
      window.Thread.style({ o: n >= 2 ? 1 : 0.7 });
    }
  };

  /* ---------- 14 · Triángulo del fuego ---------- */
  S.s14 = {
    states: 2,
    build(slide) {
      const svg = svgOf(slide);
      const T = G.tri;
      const cx = (T.o[0] + T.h[0] + T.ig[0]) / 3, cy = (T.o[1] + T.h[1] + T.ig[1]) / 3;
      const node = (p, key, txt, delay) => {
        const g = el('g', { class: `vtx ${key} pop`, 'data-v': key, style: pd(delay) }, svg);
        el('circle', { cx: p[0], cy: p[1], r: 52, class: 'vtx-c' }, g);
        el('text', { x: p[0], y: p[1] + 12, class: 'vtx-t', 'text-anchor': 'middle' }, g, txt);
        return g;
      };
      node(T.o, 'o', 'O₂', 350);
      node(T.h, 'h', 'H₂', 500);
      node(T.ig, 'ig', 'IGN', 650);
      el('text', { x: T.o[0] + 72, y: T.o[1] - 6, class: 'v-name' }, svg, 'OXÍGENO');
      el('text', { x: T.o[0] + 72, y: T.o[1] + 22, class: 'tick-s' }, svg, 'SIEMPRE PRESENTE · NO SE CONTROLA');
      el('text', { x: T.h[0], y: T.h[1] + 90, class: 'v-name', 'text-anchor': 'middle' }, svg, 'COMBUSTIBLE');
      el('text', { x: T.h[0], y: T.h[1] + 116, class: 'tick-s', 'text-anchor': 'middle' }, svg, 'H₂ · INFLAMABLE DESDE 4 %');
      el('text', { x: T.ig[0], y: T.ig[1] + 90, class: 'v-name', 'text-anchor': 'middle' }, svg, 'IGNICIÓN');
      el('text', { x: T.ig[0], y: T.ig[1] + 116, class: 'tick-s', 'text-anchor': 'middle' }, svg, 'BASTA 0,02 mJ');
      const shield = (p, at, label) => {
        const a = Math.atan2(cy - p[1], cx - p[0]);
        const r = 84, s = 0.95;
        const g = el('g', { class: 'shield', 'data-at': at }, svg);
        el('path', { d: `M${p[0] + r * Math.cos(a - s)} ${p[1] + r * Math.sin(a - s)} A${r} ${r} 0 0 1 ${p[0] + r * Math.cos(a + s)} ${p[1] + r * Math.sin(a + s)}` }, g);
        el('text', { x: p[0] + (r + 34) * Math.cos(a), y: p[1] + (r + 34) * Math.sin(a) + 6, class: 'ctrl-l', 'text-anchor': 'middle' }, g, label);
      };
      shield(T.h, 1, '1');
      shield(T.ig, 2, '2 · 3');
      el('text', { x: cx, y: cy - 10, class: 'boom-t', 'text-anchor': 'middle', 'data-only': 0 }, svg, 'EXPLOSIÓN POSIBLE');
      el('text', { x: cx, y: cy - 10, class: 'boom-t warn', 'text-anchor': 'middle', 'data-only': 1 }, svg, 'SALA CONTROLADA');
      el('text', { x: cx, y: cy - 10, class: 'boom-t ok', 'text-anchor': 'middle', 'data-only': 2 }, svg, 'SIN EXPLOSIÓN');
      const note = (n, t) => {
        const f = el('foreignObject', { x: cx - 210, y: cy + 14, width: 420, height: 120, 'data-only': n }, svg);
        const d = document.createElement('p');
        d.className = 'tri-note';
        d.innerHTML = t;
        f.appendChild(d);
      };
      note(0, 'Combustible, oxígeno e ignición presentes a la vez.');
      note(1, 'La ventilación mantiene la sala bajo el 1 %. <b>Dentro de la celda</b> siempre hay mezcla H₂/O₂.');
      note(2, 'Apagallamas y control de fuentes: la llama no alcanza la mezcla interior.');
      slide.querySelectorAll('.barrier-list li').forEach(li => {
        li.addEventListener('mouseenter', () => svg.querySelector(`.vtx.${li.dataset.v}`).classList.add('hl'));
        li.addEventListener('mouseleave', () => svg.querySelector(`.vtx.${li.dataset.v}`).classList.remove('hl'));
      });
    },
    state(slide, n) {
      window.Thread.style({ color: n >= 2 ? '#5ef0c8' : n === 1 ? '#ff8aa0' : '#ff4d6d', spark: n >= 2 ? 0 : 0.06 });
    }
  };

  /* ---------- 15 · Reconstrucción forense ---------- */
  const EVENTS = [
    [0, '01:30', 'Acceso con orden genérica', 0],
    [15, '01:45', 'Sin plan ni informe previo', 0],
    [25, '01:55', 'Retira <b>todas</b> las cubiertas del nivel superior', 0],
    [55, '02:25', 'Densidades con hidrómetro', 0],
    [68, '02:38', '', 1],
    [69, '02:39', 'Lavaojos <b>vacío</b>', 2],
    [71, '02:41', 'UPS: "falla de batería"', 2]
  ];
  S.s15 = {
    states: 3,
    build(slide) {
      const svg = svgOf(slide);
      const T = G.tl;
      const bx = T.brk;
      el('path', { d: `M${bx - 8} ${T.y - 14} l8 28 M${bx + 4} ${T.y - 14} l8 28`, class: 'brk' }, svg);
      el('text', { x: 1180, y: T.y + 118, class: 'tick-s' }, svg, 'LUPA · 02:35 → 02:42 · ESCALA ×6');
      EVENTS.forEach(([m, h, d, at]) => {
        const x = T.x(m);
        const g = el('g', at ? { 'data-at': at } : {}, svg);
        el('path', { d: diamond(x, T.y, at === 1 ? 11 : 8), class: at === 1 ? 'dm bad' : 'dm pop', style: at ? '' : pd(900 + m * 12) }, g);
        if (at === 1) return;
        const t = document.createElement('div');
        t.className = at ? 'ev' : 'ev rv';
        if (at) t.dataset.at = at;
        t.style.left = `${x}px`;
        t.innerHTML = `<b>${h}</b><span>${d}</span>`;
        slide.appendChild(t);
      });
      // Condiciones latentes que convergen en 02:38
      const conv = el('g', { class: 'conv', 'data-at': 1 }, svg);
      const sx = T.x(68);
      [250, 560, 870].forEach(x => el('path', { d: `M${x} 404 C ${x} 520, ${sx - 200} ${T.y - 150}, ${sx - 4} ${T.y - 120}` }, conv));
    },
    state(slide, n, prev) {
      window.Thread.to(n >= 1 ? 'tlSpike' : 'tl', { dur: n >= 1 ? 600 : 900 });
      if (n >= 1 && prev < 1) {
        deck().flash();
        deck().burst(G.tl.x(68), G.tl.y - 60, [255, 77, 109]);
      }
    }
  };

  /* ---------- 16 · Barreras espaciales ---------- */
  const BARS = [
    ['Aislamiento del cable puente', 1, 'stop', 'Con el aislamiento intacto, el bastidor no queda unido a la cadena: no existe el lazo.'],
    ['Alarma de falla a tierra', 1, 'stop', 'Con la alarma operativa, la falla a tierra preexistente se habría detectado y corregido: no hay lazo.'],
    ['Ventilación y detección de H₂', 1, 'reduce', 'Reduce el H₂ de la sala, pero no evita el arco ni la mezcla dentro de la celda.'],
    ['Apagallamas', 1, 'split', 'Evita la detonación de la celda 119; el arco ocurre igual.'],
    ['Evaluación, plan y permiso', 0, 'stop', 'La evaluación exige verificar la tensión polo–bastidor: la falla se habría encontrado antes.'],
    ['Una conexión a la vez', 0, 'reduce', 'Menos partes expuestas: baja la probabilidad de contacto, no la elimina.'],
    ['Herramienta aislada, sin joyas', 0, 'stop', 'Una herramienta aislada no une el borne con el bastidor: el circuito no se cierra.'],
    ['EPP y lavaojos', 0, 'mitigate', 'Reduce la lesión; no evita el evento.']
  ];
  const FACTOR = { stop: 0, reduce: 0.6, split: 0.6, mitigate: 0.5 };
  S.s16 = {
    states: 1,
    build(slide) {
      const svg = svgOf(slide);
      const B = G.bar;
      const bounds = [B.x0, ...B.xs, B.x1];
      this.segs = [];
      for (let k = 0; k < 9; k++) this.segs.push(el('line', { x1: bounds[k], y1: B.y, x2: bounds[k + 1], y2: B.y, class: 'seg', style: `--k:${k}` }, svg));
      this.planes = BARS.map((b, i) => {
        const x = B.xs[i];
        const g = el('g', { class: `plane hit${b[1] ? ' m' : ''}`, transform: `translate(${x} ${B.y}) skewY(-26)`, tabindex: 0, role: 'button', 'aria-label': `Barrera ${i + 1}: ${b[0]}` }, svg);
        el('rect', { x: -40, y: -170, width: 80, height: 330, class: 'hitbox' }, g);
        const p = el('path', { 'fill-rule': 'evenodd', class: 'rise', style: pd(450 + i * 80) }, g);
        el('text', { x: 0, y: -150, class: 'pl-n fade', style: pd(600 + i * 80), 'text-anchor': 'middle' }, g, i + 1);
        const lbl = document.createElement('div');
        lbl.className = `plane-lbl rv${b[1] ? ' m' : ''}`;
        lbl.style.left = `${x}px`;
        lbl.textContent = b[0];
        slide.appendChild(lbl);
        g.addEventListener('click', e => { e.stopPropagation(); this.toggle(slide, i); });
        return { g, p, lbl, on: false };
      });
      this.stopMark = el('g', { class: 'stop-mark' }, svg);
      el('circle', { r: 16 }, this.stopMark);
      el('path', { d: 'M-8 -8 L8 8 M8 -8 L-8 8' }, this.stopMark);
      this.render(slide);
    },
    hole(on) {
      const hy = on ? -92 : 0;
      return `M-28 -140 H28 V140 H-28 Z M0 ${hy - 26} a12 26 0 1 0 0.1 0 Z M-10 72 a7 7 0 1 0 0.1 0 Z M12 110 a5 5 0 1 0 0.1 0 Z`;
    },
    toggle(slide, i) {
      this.planes[i].on = !this.planes[i].on;
      this.last = this.planes[i].on ? i : null;
      this.render(slide);
      if (this.planes[i].on) deck().burst(G.bar.xs[i], G.bar.y, [94, 240, 200], 26);
    },
    render(slide) {
      let s = 1, stopAt = -1;
      const str = [1];
      this.planes.forEach((p, i) => {
        p.p.setAttribute('d', this.hole(p.on));
        p.g.classList.toggle('on', p.on);
        p.lbl.classList.toggle('on', p.on);
        if (p.on) { s *= FACTOR[BARS[i][2]]; if (s === 0 && stopAt < 0) stopAt = i; }
        str.push(s);
      });
      this.segs.forEach((seg, k) => {
        const v = str[k];
        seg.style.opacity = v > 0 ? 0.3 + 0.7 * v : 0;
        seg.style.strokeWidth = 1.5 + 4.5 * v;
      });
      this.stopMark.style.opacity = stopAt >= 0 ? 1 : 0;
      if (stopAt >= 0) this.stopMark.setAttribute('transform', `translate(${G.bar.xs[stopAt] - 40} ${G.bar.y})`);
      const txt = slide.querySelector('.st-txt');
      const any = this.planes.some(p => p.on);
      let msg;
      if (!any) msg = +slide.dataset.s >= 1
        ? 'Barreras 1–2: sin ellas no hay lazo. Barrera 4: sin ella no hay explosión.'
        : 'Las ocho barreras fallaron y sus aberturas terminaron alineadas.';
      else if (stopAt >= 0) msg = `<b class="c-ctrl">El accidente no ocurre: se detiene en la barrera ${stopAt + 1}.</b> ${BARS[stopAt][3]}`;
      else msg = this.last != null ? `<b>Barrera ${this.last + 1}:</b> ${BARS[this.last][3]}` : 'El accidente ocurre, con consecuencias reducidas.';
      txt.innerHTML = msg;
    },
    enter(slide) {
      this.planes.forEach(p => { p.on = false; });
      this.last = null;
      this.render(slide);
    },
    state(slide) { this.render(slide); }
  };

  /* ---------- 17 · Jerarquía de controles ---------- */
  const LEVELS = [
    ['Eliminación', 'Monitoreo en línea en vez de reapriete en caliente', 'Elimina la tarea expuesta: el peligro deja de estar al alcance de la persona.', 'ctrl'],
    ['Sustitución', 'Seccionar la cadena en tramos < 100 V', 'Reduce la energía disponible en el punto de trabajo.', 'ctrl'],
    ['Ingeniería', 'Proteger el cable puente · alarma de falla a tierra no inhibible · extractor interbloqueado', 'Actúa en la fuente sin depender de la conducta de la persona.', 'ctrl'],
    ['Concientización', 'Letreros de arco y químicos · 320.3(A)(6)', 'Advierte del peligro; no lo controla.', 'ice'],
    ['Administrativos', 'Evaluación, plan, permiso, gestión de alarmas', 'Depende de que las personas cumplan el procedimiento.', 'ice'],
    ['EPP', 'Cat. 3 o por análisis · EPP químico', 'Última barrera: reduce la lesión, no evita el evento.', 'danger']
  ];
  S.s17 = {
    states: 6,
    build(slide) {
      const svg = svgOf(slide);
      const P = G.pyr;
      const mid = (P.x0 + P.x1) / 2, half = (P.x1 - P.x0) / 2, H = P.apex - P.top, h = H / 6;
      const hw = y => (half * (P.apex - y)) / H;
      const alpha = [0.34, 0.27, 0.2, 0.13, 0.09, 0.3];
      this.lv = LEVELS.map((L, k) => {
        const y0 = P.top + k * h + 3, y1 = P.top + (k + 1) * h - 3;
        const g = el('g', { class: `lv hit ${L[3]} rise`, style: `--a:${alpha[k]}; --k:${k}; ${pd(350 + k * 110)}`, tabindex: 0, role: 'button', 'aria-label': L[0] }, svg);
        el('polygon', { points: `${mid - hw(y0)},${y0} ${mid + hw(y0)},${y0} ${mid + hw(y1)},${y1} ${mid - hw(y1)},${y1}` }, g);
        el('text', { x: mid, y: k === 5 ? y0 + 36 : (y0 + y1) / 2 + 9, class: 'lv-t', 'text-anchor': 'middle' }, g, k === 5 ? '6 · EPP' : `${k + 1} · ${L[0]}`);
        g.addEventListener('click', e => { e.stopPropagation(); this.select(slide, k); });
        return g;
      });
      el('text', { x: P.x0, y: P.top - 18, class: 'tick-s' }, svg, 'MÁS EFICAZ · ACTÚA EN LA FUENTE');
      el('text', { x: mid + 70, y: P.apex - 6, class: 'tick-s' }, svg, 'MENOS EFICAZ · DEPENDE DE LA PERSONA');
    },
    select(slide, k) {
      this.lv.forEach((g, i) => { g.classList.toggle('sel', i === k); g.classList.toggle('dim', k != null && k >= 0 && i !== k); });
      const p = slide.querySelector('.lvl');
      p.classList.remove('swap', 'ctrl', 'ice', 'danger'); void p.offsetWidth;
      if (k == null || k < 0) {
        p.querySelector('.lh').textContent = 'Selecciona un nivel';
        p.querySelector('.lm').textContent = '';
        p.querySelector('.lf').textContent = 'Cada nivel contiene una medida del Caso 4.';
        return;
      }
      const L = LEVELS[k];
      p.classList.add('swap', L[3]);
      p.querySelector('.lh').textContent = `${k + 1} · ${L[0]}`;
      p.querySelector('.lm').textContent = L[1];
      p.querySelector('.lf').textContent = L[2];
    },
    state(slide, n) { this.select(slide, n - 1); }
  };

  /* ---------- 18 · Pregunta de control ---------- */
  S.s18 = {
    states: 1,
    build(slide) {
      slide.querySelectorAll('.opt').forEach(o => o.addEventListener('click', e => {
        e.stopPropagation();
        this.choose(slide, o.dataset.k);
      }));
    },
    choose(slide, k) {
      slide.querySelectorAll('.opt').forEach(o => o.classList.toggle('chosen', o.dataset.k === k));
      deck().set(slide, 1);
    },
    state(slide, n) {
      slide.classList.toggle('revealed', n >= 1);
      if (n < 1) slide.querySelectorAll('.opt').forEach(o => o.classList.remove('chosen'));
      window.Thread.style({ color: n >= 1 ? '#5ef0c8' : '#8fe3ff' });
    }
  };

  window.Scenes = S;
})();
