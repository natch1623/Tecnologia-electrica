/* Lector de la plantilla, con los conceptos del dipolo. */
(() => {
  const E = {
  "01": {
    "code": "ΔV",
    "kind": "Concepto",
    "tone": "ice",
    "title": "Diferencia de potencial",
    "short": "Diferencia de potencial",
    "says": [
      [
        "Idea",
        "El voltímetro compara dos puntos."
      ]
    ],
    "key": "Entre B y A mide V<sub>B</sub> − V<sub>A</sub>."
  },
  "02": {
    "code": "p = qd",
    "kind": "Concepto",
    "tone": "ice",
    "title": "Momento dipolar",
    "short": "Momento dipolar",
    "says": [
      [
        "Idea",
        "p apunta de −q a +q y su magnitud es qd."
      ]
    ],
    "key": "r parte del punto medio. Las distancias r₊ y r₋ parten de cada carga."
  },
  "03": {
    "code": "Superposición",
    "kind": "Concepto",
    "tone": "ice",
    "title": "Potencial exacto",
    "short": "Potencial exacto",
    "says": [
      [
        "Idea",
        "Los potenciales se suman como escalares."
      ]
    ],
    "key": "V(P) = kq(1/r₊ − 1/r₋), tomando V(∞) = 0."
  },
  "04": {
    "code": "V = 0",
    "kind": "Concepto",
    "tone": "ice",
    "title": "Plano mediador",
    "short": "Plano mediador",
    "says": [
      [
        "Idea",
        "En el plano mediador, r₊ = r₋."
      ]
    ],
    "key": "El campo puede ser distinto de cero porque el potencial cambia en la dirección normal al plano."
  },
  "05": {
    "code": "r ≫ d",
    "kind": "Concepto",
    "tone": "ice",
    "title": "Aproximación dipolar",
    "short": "Aproximación dipolar",
    "says": [
      [
        "Idea",
        "Los términos monopolares se cancelan."
      ]
    ],
    "key": "El término dipolar es kp cos θ/r². Vale en la zona lejana."
  },
  "06": {
    "code": "Equipotenciales",
    "kind": "Concepto",
    "tone": "ice",
    "title": "Lectura del mapa",
    "short": "Lectura del mapa",
    "says": [
      [
        "Idea",
        "Cada curva une puntos del mismo potencial."
      ]
    ],
    "key": "El plano mediador aparece como la línea vertical de 0 V en el corte."
  },
  "07": {
    "code": "8,91 V",
    "kind": "Concepto",
    "tone": "ice",
    "title": "Ejemplo numérico",
    "short": "Ejemplo numérico",
    "says": [
      [
        "Idea",
        "Con r = 0,20 m y θ = 60°, el valor exacto es 8,91 V."
      ]
    ],
    "key": "El valor lejano es 8,99 V y el error relativo es 0,88 %."
  },
  "08": {
    "code": "ΔV = 0",
    "kind": "Concepto",
    "tone": "ice",
    "title": "Pregunta de cierre",
    "short": "Pregunta de cierre",
    "says": [
      [
        "Idea",
        "Las puntas tocan la misma equipotencial."
      ]
    ],
    "key": "La lectura es cero. Una carga positiva acelera en el sentido de E, hacia el lado de −q."
  }
};
  const MAP = {"01": ["01"], "02": ["02"], "03": ["03"], "04": ["04"], "05": ["05"], "06": ["06"], "07": ["07"], "08": ["08"]};

  const code = k => E[k].code || k;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Capa ---------- */
  const root = document.createElement('div');
  root.className = 'codex';
  root.id = 'codex';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Lector de conceptos');
  root.innerHTML = `
    <div class="cx-stage">
      <p class="cx-brand"><span class="sparkle">✦</span>LECTOR DE CONCEPTOS · ELECTROSTÁTICA</p>
      <button class="cx-back" type="button"><span class="ar">←</span> REGRESAR A LA PRESENTACIÓN <b class="cx-from"></b></button>
      <nav class="cx-rail" aria-label="Referencias de la diapositiva"><p class="cx-rl">EN ESTA DIAPOSITIVA</p><ol></ol></nav>
      <article class="cx-body" tabindex="-1"></article>
      <p class="cx-foot">↑ ↓ CAMBIAR REFERENCIA · ESC REGRESAR</p>
      <p class="cx-src">OPENSTAX · UNIVERSITY PHYSICS, VOL. 2 · §7.3</p>
    </div>`;
  document.body.appendChild(root);
  const cxStage = root.querySelector('.cx-stage');
  const rail = root.querySelector('.cx-rail ol');
  const body = root.querySelector('.cx-body');
  const from = root.querySelector('.cx-from');

  let keys = [];
  let cur = 0;
  let onClose = null;
  let lastFocus = null;

  function fit() {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    cxStage.style.setProperty('--s', s);
  }
  addEventListener('resize', fit);
  fit();

  function renderTable(t, e) {
    const num = new Set(t.num || []);
    const hot = new Set(t.hot || []);
    return `<table class="cx-table">
      <thead><tr>${t.cols.map((c, i) => `<th data-c="${i}">${c}</th>`).join('')}</tr></thead>
      <tbody>${t.rows.map((r, ri) => `<tr class="${hot.has(ri) ? 'hot' : ''}" style="--i:${ri}" data-r="${ri}">${r.map((c, ci) =>
        `<td data-c="${ci}" class="${num.has(ci) ? 'num' : ''}${c === 'Sí' ? ' yes' : c === 'No' ? ' no' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
    ${t.hot?.length ? `<p class="cx-legend"><i></i>FILA${t.hot.length > 1 ? 'S' : ''} DEL CASO 4</p>` : ''}`;
  }

  function render() {
    const k = keys[cur];
    const e = E[k];
    rail.querySelectorAll('button').forEach((b, i) => { b.classList.toggle('cur', i === cur); b.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
    body.dataset.tone = e.tone;
    body.innerHTML = `
      <p class="cx-kicker">${e.kind.toUpperCase()} · ELECTROSTÁTICA</p>
      <h2 class="cx-code">${code(k)}</h2>
      <p class="cx-title">${e.title}</p>
      ${e.formula ? `<p class="cx-formula">${e.formula}</p>` : ''}
      <section class="cx-says"><p class="cx-h">QUÉ DICE</p>
        ${e.says.map(([l, t], i) => `<div class="cx-say" style="--i:${i}"><b>${l}</b><p>${t}</p></div>`).join('')}
      </section>
      ${e.table ? `<section class="cx-tbl"><p class="cx-h">${e.kind === 'Tabla' ? 'LA TABLA' : 'EN TABLA'}</p>
        ${e.pick ? `<div class="cx-pick" role="group" aria-label="${esc(e.pick.label)}"><span>${e.pick.label}</span>${e.pick.options.map((o, i) => `<button type="button" data-row="${o.row}" class="${i === 0 ? 'on' : ''}">${o.t}</button>`).join('')}</div>` : ''}
        ${renderTable(e.table, e)}
        ${e.notes ? `<ul class="cx-notes">${e.notes.map(n => `<li>${n}</li>`).join('')}</ul>` : ''}
      </section>` : ''}
      ${e.read ? `<section class="cx-read"><p class="cx-h">CÓMO SE LEE</p><ol>
        ${e.read.map((r, i) => `<li tabindex="0" ${r.col !== undefined ? `data-col="${r.col}"` : ''} style="--i:${i}"><span class="n">${String(i + 1).padStart(2, '0')}</span><p>${r.t}</p></li>`).join('')}
      </ol></section>` : ''}
      ${e.key ? `<p class="cx-key">${e.key}</p>` : ''}
      ${e.caso ? `<section class="cx-caso"><p class="cx-h">APLICACIÓN</p><p>${e.caso}</p></section>` : ''}`;
    body.scrollTop = 0;
    if (e.pick) pickRow(e.pick.options[0].row);
  }

  function pickRow(r) {
    body.querySelectorAll('.cx-table tbody tr').forEach(tr => tr.classList.toggle('pick', +tr.dataset.r === r));
  }

  body.addEventListener('click', ev => {
    const b = ev.target.closest('.cx-pick button');
    if (!b) return;
    b.parentElement.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    pickRow(+b.dataset.row);
  });
  // Cada paso de lectura ilumina la columna que usa
  const hcol = c => { const t = body.querySelector('.cx-table'); if (t) t.dataset.hcol = c ?? ''; };
  body.addEventListener('pointerover', ev => { const li = ev.target.closest('.cx-read li'); hcol(li?.dataset.col); });
  body.addEventListener('pointerleave', () => hcol());
  body.addEventListener('focusin', ev => { const li = ev.target.closest('.cx-read li'); if (li) hcol(li.dataset.col); });

  rail.addEventListener('click', ev => {
    const b = ev.target.closest('button');
    if (!b) return;
    cur = +b.dataset.i;
    render();
  });
  root.querySelector('.cx-back').addEventListener('click', () => close());

  function open(label, { mood, slideTitle, done } = {}) {
    keys = (MAP[label] || []).filter(k => E[k]);
    if (!keys.length) return false;
    cur = 0;
    onClose = done;
    lastFocus = document.activeElement;
    root.dataset.mood = mood || 'maint';
    from.textContent = label;
    from.title = slideTitle || '';
    rail.innerHTML = keys.map((k, i) =>
      `<li style="--i:${i}"><button type="button" data-i="${i}"><i class="d"></i><span class="c">${code(k)}</span><span class="s">${E[k].short}</span></button></li>`).join('');
    fit();
    render();
    root.classList.add('open');
    root.querySelector('.cx-back').focus({ preventScroll: true });
    return true;
  }

  function close() {
    if (!root.classList.contains('open')) return;
    root.classList.remove('open');
    lastFocus?.focus?.({ preventScroll: true });
    onClose?.();
  }

  // Devuelve true si la tecla se consumió
  function key(k) {
    if (!root.classList.contains('open') || k === 'Tab') return false;
    if (k === 'Escape' || k === 'Backspace') close();
    else if (k === 'ArrowDown' || k === 'ArrowRight') { cur = (cur + 1) % keys.length; render(); }
    else if (k === 'ArrowUp' || k === 'ArrowLeft') { cur = (cur - 1 + keys.length) % keys.length; render(); }
    else if (k === 'Enter' || k === ' ') {
      const a = document.activeElement;
      if (a && root.contains(a) && a.matches('button')) a.click();
      else return true;
    }
    return true;
  }

  window.Codex = {
    has: label => !!(MAP[label] || []).some(k => E[k]),
    open, close, key,
    isOpen: () => root.classList.contains('open')
  };
})();
