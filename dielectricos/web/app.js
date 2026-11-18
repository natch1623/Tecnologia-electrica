(() => {
  'use strict';
  const slides = window.DIELECTRICOS;
  const $ = s => document.querySelector(s);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const format = n => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
  const sources = {
    folleto: ['Folleto facilitado, página 1', null],
    iupac: ['IUPAC Gold Book · Dielectric material', 'https://goldbook.iupac.org/terms/view/08790'],
    openstax: ['OpenStax · Molecular Model of a Dielectric', 'https://openstax.org/books/university-physics-volume-2/pages/8-5-molecular-model-of-a-dielectric'],
    ncert: ['NCERT · Electric Potential and Capacitance, §2.10', 'https://bepclots.bihar.gov.in/wp-content/uploads/2021/04/12-Physics-Ncert-Chapter-2.pdf'],
    uri: ['University of Rhode Island · Dielectrics I', 'https://penrose.uri.edu/Gerhard/PHY331N/lln9.pdf'],
    cambridge: ['University of Cambridge · Materials for Devices', 'https://www.tcm.phy.cam.ac.uk/~bm418/documents/teaching/ia-materials/lecture-notes.pdf'],
    nptel: ['NPTEL · Electrical Insulation and Dielectrics', 'https://archive.nptel.ac.in/content/storage2/courses/108104048/lecture1_A/slide4.htm']
  };
  const sourceLink = key => {
    const [title, url] = sources[key];
    return url ? `<a href="${url}" target="_blank" rel="noopener">${escape(title)}</a>` : escape(title);
  };
  function table(d, i) {
    return `<table class="${i === 2 ? 'criteria' : ''}"><thead><tr>${d.table[0].map(x => `<th scope="col">${escape(x)}</th>`).join('')}</tr></thead><tbody>${d.table.slice(1).map(row => `<tr>${row.map(x => `<td>${escape(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function coverConstruct() {
    return `<div class="hero-construct" aria-hidden="true"><div class="construct-aura"></div><div class="construct-dial">${Array.from({length:36},(_,i)=>`<i style="transform:rotate(${i*10}deg)"></i>`).join('')}</div><div class="construct-orbit orbit-one"><i class="orbit-mote"></i></div><div class="construct-orbit orbit-two"><i class="orbit-mote"></i></div><div class="construct-orbit orbit-three"><i class="orbit-mote"></i></div><div class="crystal-float"><div class="crystal-shape"><i class="crystal-face face-a"></i><i class="crystal-face face-b"></i><i class="crystal-face face-c"></i><i class="crystal-face face-d"></i><i class="crystal-spine"></i></div><div class="crystal-light"></div></div>${Array.from({length:8},(_,i)=>`<div class="construct-satellite" style="--angle:${i*45}deg;--phase:${-i*.75}s"><i></i></div>`).join('')}<svg class="construct-arcs" viewBox="0 0 600 600" fill="none"><path d="M127 390 168 365 183 373 200 343 226 351 252 319"/><path d="M348 283 369 260 387 268 402 231 428 236 463 207"/><path d="M253 137 268 170 259 187 286 221"/><path d="M314 384 331 415 321 432 347 470"/></svg><div class="construct-horizon"></div></div>`;
  }
  function render(d, i) {
    const title = escape(d.title.replaceAll('\n', ' '));
    const number = `<span class="slide-number">${String(i + 1).padStart(2, '0')}</span>`;
    if (i === 0) return `<section class="slide dark cover" data-slide="1" aria-label="1 de 12: ${title}">${coverConstruct()}<p class="cover-top">Electromagnetismo</p><div class="cover-layout"><div><h1>Clasificación<br>de dieléctricos</h1><p class="subtitle">${escape(d.lines[0])}</p><p class="authors">${escape(d.lines[1])}</p></div></div>${number}</section>`;
    let body;
    if (i === 2) body = `<div class="classification-map"><div class="map-core"><span>Un mismo</span><strong>material</strong></div>${d.table.slice(1).map(([criterion, categories], n) => `<div class="map-item map-item-${n}"><span>${escape(criterion)}</span><strong>${escape(categories)}</strong></div>`).join('')}</div>`;
    else if (i === 6) body = `<ul class="mechanism-list">${d.table.slice(1).map(([name, text]) => `<li><h3>${escape(name)}</h3><p>${escape(text)}</p></li>`).join('')}</ul>`;
    else if (i === 7) body = `<div class="material-states">${d.table.slice(1).map(([state, example, use], n) => `<article class="material-state material-state-${n}"><span class="state-symbol" aria-hidden="true">${['◇','≈','∴'][n]}</span><h3>${escape(state)}</h3><p>${escape(example)}</p><span class="state-use">${escape(use)}</span></article>`).join('')}</div>`;
    else if (d.table) body = table(d, i);
    else if (d.columns) body = `<div class="columns">${d.columns.map(([heading, text]) => `<div><h3>${escape(heading[0] + heading.slice(1).toLowerCase())}</h3>${text.split('\n\n').map(p => `<p>${escape(p)}</p>`).join('')}</div>`).join('')}</div>`;
    else body = `<ul class="${i === 10 ? 'case-list' : i === 11 ? 'conclusions' : 'text-list'}">${d.lines.map(x => `<li>${escape(x)}</li>`).join('')}</ul>`;
    if (i === 3 || i === 4) body = `<div class="explanation">${body}</div><div class="science" data-science="${i === 3 ? 'nonpolar' : 'polar'}"></div>`;
    else if (i === 1) body = `<div class="definition-layout">${body}<div class="field-emblem" aria-label="Campo eléctrico"><i></i><i></i><i></i><strong>E</strong><span>Campo eléctrico</span></div></div>`;
    else if (d.compare) body += `<div class="states">${d.compare.map(([label, text]) => `<div><span>${escape(label.toLowerCase())}</span><strong>${escape(text)}</strong></div>`).join('')}</div>`;
    if (i === 11) body += `<div class="sources">${d.source.map(sourceLink).join('')}</div>`;
    return `<section class="slide ${i === 11 ? 'dark ending' : ''}" data-slide="${i + 1}" aria-label="${i + 1} de 12: ${title}" hidden><h2>${title}</h2><div class="body ${i === 3 || i === 4 ? 'motion-layout' : ''}">${body}</div>${d.bottom ? `<p class="takeaway">${escape(d.bottom)}</p>` : ''}${number}</section>`;
  }
  $('#stage').innerHTML = slides.map(render).join('');
  let index = 0;
  let requestedIndex = 0, transitioning = false, queued = null;
  const sections = [...document.querySelectorAll('.slide')];
  function notes() {
    const d = slides[index];
    $('#notes-content').innerHTML = `<h3>${escape(d.title.replaceAll('\n', ' '))}</h3><p class="muted">${index < 6 ? 'Laura Montuto' : 'Michaell Chirú'} · ${format(d.time)} en esta diapositiva · acumulado previsto ${format(slides.slice(0, index + 1).reduce((s, x) => s + x.time, 0))}</p><p>${escape(d.note)}</p><h4>Fuentes</h4><ul>${d.source.length ? d.source.map(key => `<li>${sourceLink(key)}</li>`).join('') : '<li>Asignación del tema facilitada por el usuario.</li>'}</ul>`;
  }
  function commit(value, updateHash = true) {
    index = value;
    sections.forEach((s, i) => { s.hidden = i !== index; });
    $('#counter').textContent = `${String(index + 1).padStart(2, '0')} / ${slides.length}`;
    $('#presenter').textContent = `${index < 6 ? 'Laura Montuto' : 'Michaell Chirú'} · ${format(slides[index].time)} previstos`;
    $('#previous').disabled = index === 0;
    $('#next').disabled = index === slides.length - 1;
    $('#progress').style.width = `${(index + 1) / slides.length * 100}%`;
    $('#announcement').textContent = `Diapositiva ${index + 1}: ${slides[index].title.replaceAll('\n', ' ')}`;
    document.querySelectorAll('#index-list button').forEach((b, i) => b.setAttribute('aria-current', String(i === index)));
    if (updateHash) history.replaceState(null, '', `#slide-${index + 1}`);
    $('#viewport').scrollTop = 0;
    notes();
    window.dispatchEvent(new CustomEvent('slidechange', { detail: { index } }));
  }
  async function go(value, updateHash = true, animate = true) {
    const target = Math.max(0, Math.min(slides.length - 1, value));
    requestedIndex = target;
    if (transitioning) { queued = { target, updateHash, animate }; return; }
    if (target === index || !animate || !window.DielectricTransitions) {
      window.DielectricTransitions?.cancel();
      commit(target, updateHash);
      return;
    }
    transitioning = true;
    window.DielectricKinetic?.stopEntries();
    window.DielectricMotion?.stopAuto();
    $('#stage').inert = true;
    $('#stage').setAttribute('aria-busy', 'true');
    try {
      await window.DielectricTransitions.run(sections[index], sections[target], { fromIndex: index, toIndex: target, direction: target > index ? 1 : -1 });
    } catch (error) {
      window.DielectricTransitions.cancel();
      console.warn('Cambio de diapositiva completado sin efecto:', error);
    } finally {
      commit(target, updateHash);
      transitioning = false;
      $('#stage').inert = false;
      $('#stage').setAttribute('aria-busy', 'false');
    }
    if (queued) { const next = queued; queued = null; go(next.target, next.updateHash, next.animate); }
  }
  $('#index-list').innerHTML = slides.map((d, i) => `<button data-go="${i}" aria-current="false"><span class="num">${String(i + 1).padStart(2, '0')}</span><span>${escape(d.title.replaceAll('\n', ' '))}<small>${i < 6 ? 'Laura' : 'Michaell'} · ${format(d.time)}</small></span></button>`).join('');
  $('#index-list').addEventListener('click', e => {
    const button = e.target.closest('[data-go]');
    if (button) { $('#index-dialog').close(); go(Number(button.dataset.go)); $('#stage').focus(); }
  });
  const openDialog = id => { const d = $(id); if (!d.open) d.showModal(); };
  $('#open-index').onclick = () => openDialog('#index-dialog');
  $('#open-notes').onclick = () => openDialog('#notes-dialog');
  $('#open-help').onclick = () => openDialog('#help-dialog');
  document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => b.closest('dialog').close());
  document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d && (e.clientX < d.getBoundingClientRect().left || e.clientX > d.getBoundingClientRect().right || e.clientY < d.getBoundingClientRect().top || e.clientY > d.getBoundingClientRect().bottom)) d.close(); }));
  $('#previous').onclick = () => go(requestedIndex - 1);
  $('#next').onclick = () => go(requestedIndex + 1);
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { $('#announcement').textContent = 'El navegador no permite pantalla completa. Puedes usar su opción de pantalla completa.'; }
  }
  $('#fullscreen').onclick = fullscreen;
  document.addEventListener('fullscreenchange', () => $('#fullscreen').setAttribute('aria-label', document.fullscreenElement ? 'Salir de pantalla completa' : 'Activar pantalla completa'));
  $('#plain').onclick = () => {
    window.DielectricTransitions?.cancel();
    const plain = document.body.classList.toggle('plain');
    $('#plain').setAttribute('aria-pressed', String(plain));
    $('#plain').textContent = plain ? 'Diseño Clorinde' : 'Vista plana';
    window.DielectricMotion?.refreshAuto();
  };
  if (new URLSearchParams(location.search).get('plano') === '1') $('#plain').click();
  document.addEventListener('keydown', e => {
    if (document.querySelector('dialog[open]') || e.altKey || e.ctrlKey || e.metaKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable) return;
    const onControl = e.target.closest('button,a');
    if (e.key === ' ' && onControl) return;
    const key = e.key.toLowerCase();
    if (['arrowright', 'pagedown', ' '].includes(key)) { e.preventDefault(); go(requestedIndex + 1); }
    else if (['arrowleft', 'pageup'].includes(key)) { e.preventDefault(); go(requestedIndex - 1); }
    else if (key === 'home') { e.preventDefault(); go(0); }
    else if (key === 'end') { e.preventDefault(); go(slides.length - 1); }
    else if (key === 'm') openDialog('#index-dialog');
    else if (key === 'n') openDialog('#notes-dialog');
    else if (key === 'f') fullscreen();
    else if (key === '?' || key === 'h') openDialog('#help-dialog');
  });
  const fromHash = (animate = true) => { const m = location.hash.match(/^#slide-(\d+)$/); go(m ? Number(m[1]) - 1 : 0, false, animate); };
  window.addEventListener('hashchange', () => fromHash());
  function resize() {
    if (matchMedia('(max-width:700px)').matches) return;
    const v = $('#viewport');
    const scale = Math.min(v.clientWidth / 1280, v.clientHeight / 720);
    $('#stage').style.transform = `scale(${scale})`;
    $('#frame').style.width = `${1280 * scale}px`;
    $('#frame').style.height = `${720 * scale}px`;
  }
  window.addEventListener('resize', resize);
  let touch = null;
  $('#viewport').addEventListener('touchstart', e => { if (e.touches.length === 1 && !e.target.closest('button,a')) touch = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
  $('#viewport').addEventListener('touchend', e => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) go(requestedIndex + (dx < 0 ? 1 : -1));
    touch = null;
  }, { passive: true });
  let started = null, accumulated = 0;
  function updateClock() {
    const secs = Math.floor((accumulated + (started === null ? 0 : performance.now() - started)) / 1000);
    $('#clock').textContent = format(secs);
    $('#clock').classList.toggle('over', secs >= 900);
  }
  $('#timer-toggle').onclick = () => {
    if (started === null) { started = performance.now(); $('#timer-toggle').textContent = 'Pausar ensayo'; }
    else { accumulated += performance.now() - started; started = null; $('#timer-toggle').textContent = 'Continuar ensayo'; }
    updateClock();
  };
  $('#timer-reset').onclick = () => { started = null; accumulated = 0; $('#timer-toggle').textContent = 'Iniciar ensayo'; updateClock(); };
  setInterval(updateClock, 1000);
  window.DielectricMotion?.init();
  window.DielectricKinetic?.init();
  resize();
  fromHash(false);
  if (index === 0 && !document.body.classList.contains('plain')) {
    window.DielectricTransitions?.open(sections[0]);
  }
})();
