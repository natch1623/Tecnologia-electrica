/* =========================================================
   Escenas · piezas que se construyen desde datos del perfil
   (título de la portada, cronograma y presupuesto)
   ========================================================= */
(() => {
  /* ---------- 01 · Título palabra por palabra ---------- */
  document.querySelectorAll('[data-split], h2.title').forEach(h => {
    h.setAttribute('data-split', '');
    let i = 0;
    const wrap = (word, accent) => `<span class="w"><span class="${accent ? 'accent' : ''}" style="--i:${i++}">${word}</span></span>`;
    h.innerHTML = [...h.childNodes].map(n => {
      const accent = n.nodeType === 1;
      return n.textContent.split(/\s+/).filter(Boolean).map(w => wrap(w, accent)).join(' ');
    }).join(' ');
  });

  /* ---------- 13 · Cronograma (perfil, § 11) ---------- */
  const MONTHS = ['N', 'D', 'E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']; // nov. 2026 – dic. 2027
  const ACTS = [
    ['Ética', 0, 1, 'prep'], ['Validación', 2, 2, 'prep'], ['Diagnóstico', 3, 3], ['Entrevistas', 4, 4],
    ['Programa', 5, 8, 'hot'], ['Medición', 9, 9], ['Cierre', 10, 10], ['Seguimiento', 11, 11],
    ['Análisis', 12, 12], ['Informe', 13, 13]
  ];
  const gantt = document.getElementById('gantt');
  if (gantt) {
    const X0 = 260, CW = (1620 - X0) / MONTHS.length, R0 = 90, RH = 56;
    let html = `<div class="yr" style="left:${X0 + 8}px">2026</div><div class="yr" style="left:${X0 + 2 * CW + 8}px">2027</div>`;
    MONTHS.forEach((m, i) => { html += `<div class="mo" style="left:${X0 + i * CW}px; width:${CW}px">${m}</div>`; });
    for (let i = 0; i <= MONTHS.length; i++) html += `<div class="grid${i === 2 ? ' y' : ''}" style="left:${X0 + i * CW}px; height:${R0 + ACTS.length * RH - 74}px"></div>`;
    ACTS.forEach(([name, a, b, cls], r) => {
      const top = R0 + r * RH;
      html += `<div class="act" style="top:${top + 14}px">${name}</div>`;
      html += `<div class="bar ${cls || ''}" style="--i:${r}; top:${top + 15}px; left:${X0 + a * CW + 6}px; width:${(b - a + 1) * CW - 12}px"></div>`;
    });
    html += `<div class="playhead" style="height:${R0 + ACTS.length * RH - 60}px"></div>`;
    gantt.innerHTML = html;
  }

  /* ---------- 14 · Presupuesto (perfil, § 12) ---------- */
  const BUDGET = [
    [900, 'Tasa de dosis', 'rgba(224,163,46,1)', true],
    [800, 'Capacitación', 'rgba(224,163,46,.78)', true],
    [360, 'Transporte', 'rgba(224,163,46,.56)'],
    [300, 'Observador', 'rgba(224,163,46,.4)'],
    [990, 'Otros', 'rgba(245,242,236,.28)'],
    [335, 'Imprevistos', 'repeating-linear-gradient(135deg, rgba(245,242,236,.35) 0 8px, rgba(245,242,236,.08) 8px 16px)']
  ];
  const stack = document.getElementById('stack');
  const legend = document.getElementById('legend');
  if (stack && legend) {
    stack.innerHTML = BUDGET.map(([v, , c], i) => `<i style="flex:${v} 1 0; background:${c}; --i:${i}"></i>`).join('');
    legend.innerHTML = BUDGET.map(([v, l, , hot], i) => `<div class="${hot ? 'hot' : ''}" style="flex:${v} 1 0"><b data-count="${v}" data-dur="1200" data-delay="${500 + i * 120}">${v}</b><span>${l}</span></div>`).join('');
  }

  window.Scenes = {};
})();
