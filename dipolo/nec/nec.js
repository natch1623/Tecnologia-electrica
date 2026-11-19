(() => {
  'use strict';
  if (document.documentElement.dataset.theme !== 'nec') return;

  const sky = '#07060f', ice = '#8fe3ff', lilac = '#a58bff', bright = '#f4f1ff', green = '#5ef0c8';
  const tau = 2 * Math.PI;
  const notes = [
    ['1:10', 'Abrir con el voltímetro. Entre dos puntos mide una diferencia de potencial, en joules por coulomb. En el modelo tomamos V(∞) = 0.'],
    ['1:25', 'Ubicar las cargas, el origen y el punto P. Distinguir r de r₊ y r₋. Señalar que p apunta de −q a +q.'],
    ['1:50', 'Sumar algebraicamente los aportes de cada carga. Usar las tres posiciones de P para comparar el signo y los aportes.'],
    ['1:40', 'El plano mediador está a igual distancia de ambas cargas. El potencial vale cero. Las componentes del campo en el eje del dipolo se suman hacia −q.'],
    ['2:00', 'Explicar la cancelación de los términos 1/r. Mantener el ángulo fijo al mostrar que, para r ≫ d, duplicar r reduce el potencial a un cuarto.'],
    ['2:35', 'Empezar con el preset Ejemplo. Probar el plano mediador y el lado negativo. Después, mantener θ fijo y cambiar solo r. El recorrido automático es opcional.'],
    ['2:25', 'Calcular r₊, r₋ y p. La fórmula exacta da 8,91 V y la aproximación 8,99 V. Dividir la diferencia absoluta por el valor exacto para obtener 0,88 %.'],
    ['0:45', 'Dejar unos segundos para la respuesta. El voltímetro marca 0 V entre puntos del plano mediador. Una carga de prueba positiva acelera hacia el lado de −q.']
  ];
  const cues = [
    'El voltímetro mide ΔV entre sus puntas. En el modelo del dipolo se fija V(∞) = 0.',
    'El momento dipolar apunta de la carga negativa a la positiva y tiene magnitud qd.',
    'El potencial es escalar. Los aportes kq/r₊ y −kq/r₋ se suman con sus signos.',
    'El campo es el gradiente negativo de V. Un plano equipotencial puede tener un campo perpendicular distinto de cero.',
    'En la zona lejana, el primer término que sobrevive a la cancelación monopolar es proporcional a cos θ/r².',
    'El mapa muestra un corte de las superficies equipotenciales. Cada curva une puntos con el mismo V.',
    'Para este ejemplo, las distancias se calculan con la ley del coseno antes de sustituirlas en la expresión exacta.',
    'Dos puntos de la misma equipotencial producen una diferencia de potencial igual a cero.'
  ];
  const titles = ['Potencial eléctrico de un dipolo', 'Dos cargas, un eje', 'El signo está en la distancia', 'Potencial cero. Campo presente.', 'A gran distancia', 'Mapa de potencial', 'Una diferencia de 0,08 V', '¿Qué marca el voltímetro?'];
  const palettes = [lilac, lilac, '#c9b8ff', ice, ice, ice, green, lilac];
  const spectral = ['tajo', 'grieta', 'convergencia', 'onda', 'inmersion', 'barrido', 'horizonte'];
  let stage, chrome, drawer, reference, clock, dots, active = 0, jumpTo, popup, clockHandle;
  let ambient, thread, frame = 0, running = false, interval, sceneTime = performance.now(), totalTime = sceneTime;
  const mouse = [0, 0];
  const lerp = (a, b, n) => a + (b - a) * n;
  const bound = n => Math.max(0, Math.min(1, n));
  const smooth = n => bound(n) ** 2 * (3 - 2 * bound(n));

  function sketch(ctx, points, tint, width = 1, fill) {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    points.slice(1).forEach(pt => ctx.lineTo(...pt));
    if (fill) { ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
    if (tint) { ctx.strokeStyle = tint; ctx.lineWidth = width; ctx.stroke(); }
  }

  function canvasLayer(name) {
    const canvas = document.createElement('canvas');
    canvas.className = name;
    canvas.setAttribute('aria-hidden', 'true');
    return canvas;
  }

  function fit(canvas, w, h, cap) {
    const ratio = Math.min(devicePixelRatio || 1, cap);
    canvas.width = Math.max(1, Math.round(w * ratio));
    canvas.height = Math.max(1, Math.round(h * ratio));
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    return ctx;
  }

  function crest(canvas, ending) {
    const width = Number(canvas.getAttribute('width')), height = Number(canvas.getAttribute('height'));
    const ctx = fit(canvas, width, height, 2);
    const x = width / 2, y = height / 2, radius = Math.min(width, height) * .43;
    const haze = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.15);
    haze.addColorStop(0, '#7253d979');
    haze.addColorStop(.43, '#5b3fd633');
    haze.addColorStop(1, '#5b3fd600');
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, width, height);
    [1, .78, .61].forEach((ratio, i) => {
      ctx.beginPath();
      ctx.setLineDash(i === 1 ? [18, 9, 2, 8] : i === 0 ? [2, 8] : []);
      ctx.arc(x, y, radius * ratio, 0, tau);
      ctx.strokeStyle = i === 1 ? '#8fe3ff75' : '#a58bff7e';
      ctx.lineWidth = 1.15;
      ctx.stroke();
    });
    ctx.setLineDash([]);
    if (!ending) {
      for (const [angle, ratio, color] of [[0, .86, '#a58bff85'], [Math.PI / 4, .64, '#8fe3ff72']]) {
        const vertices = Array.from({ length: 8 }, (_, i) => {
          const angleAt = angle + i * Math.PI / 4;
          const arm = radius * ratio * (i % 2 ? .17 : 1);
          return [x + Math.cos(angleAt) * arm, y + Math.sin(angleAt) * arm];
        });
        sketch(ctx, [...vertices, vertices[0]], color, 1.4, '#29205b42');
      }
    } else {
      ctx.setLineDash([6, 8]);
      sketch(ctx, [[x, y - radius * .80], [x, y + radius * .80]], '#5ef0c8a7', 1.5);
      ctx.setLineDash([]);
    }
    const left = [x - radius * .47, y], right = [x + radius * .47, y];
    sketch(ctx, [left, right], ending ? '#5ef0c8a6' : '#c9b8ffa6', 1.1);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '500 27px "JetBrains Mono", Consolas, monospace';
    for (const [pt, sign, tint] of [[left, '−', '#ff9ab0'], [right, '+', ice]]) {
      ctx.beginPath();
      ctx.arc(...pt, 21, 0, tau);
      ctx.fillStyle = '#0e0a20';
      ctx.fill();
      ctx.strokeStyle = tint;
      ctx.stroke();
      ctx.fillStyle = tint;
      ctx.fillText(sign, ...pt);
    }
    for (let i = 0; i < 21; i += 1) {
      const angle = i * 2.399;
      const span = radius * (.78 + (i * .116 % .33));
      const cx = x + Math.cos(angle) * span, cy = y + Math.sin(angle) * span;
      if (i % 6 === 0) sketch(ctx, [[cx-5,cy],[cx,cy-5],[cx+5,cy],[cx,cy+5]], null, 0, bright);
      else sketch(ctx, [[cx,cy],[cx+.8,cy]], '#a58bffb0', 1.3);
    }
  }

  const threadForms = [
    [[.48,.83],[.56,.72],[.65,.76],[.81,.75],[.94,.68]],
    [[.45,.71],[.53,.71],[.66,.71],[.81,.71],[.96,.71]],
    [[.45,.77],[.54,.77],[.67,.65],[.81,.65],[.97,.73]],
    [[.52,.82],[.65,.82],[.74,.73],[.74,.54],[.74,.32]],
    [[.46,.74],[.58,.69],[.69,.77],[.81,.85],[.96,.88]],
    [[.17,.85],[.33,.85],[.50,.83],[.66,.83],[.86,.78]],
    [[.46,.72],[.56,.72],[.69,.72],[.83,.72],[.97,.72]],
    [[.06,.77],[.26,.73],[.47,.76],[.73,.76],[.95,.76]]
  ];
  let threadFrom = threadForms[0], threadTo = threadFrom, threadStart = 0;
  const stars = Array.from({ length: 175 }, (_, i) => [
    ((i * 2089 + 529) % 17389) / 17389,
    ((i * 1177 + 271) % 15121) / 15121,
    .40 + (i % 9) / 10
  ]);
  let width, height, mist, route;

  function size() {
    const box = stage.getBoundingClientRect();
    width = box.width; height = box.height;
    mist = fit(ambient, width, height, 1.25);
    route = fit(thread, width, height, 1.25);
    draw(performance.now());
  }

  function draw(now) {
    if (!mist || !width || !height) return;
    mist.fillStyle = sky;
    mist.fillRect(0, 0, width, height);
    const offset = running ? Math.sin(now / 5200) : 0;
    for (const [x, y, radius, tint] of [
      [width * (.79 + mouse[0] * .011), height * (.34 + offset * .025), Math.max(width,height)*.63, '#5b3fd629'],
      [width * .38, height * .76, Math.max(width,height)*.47, active === 3 || active === 5 ? '#366f9655' : '#36245051']
    ]) {
      const gradient = mist.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, tint);
      gradient.addColorStop(1, '#17102e00');
      mist.fillStyle = gradient;
      mist.fillRect(0, 0, width, height);
    }
    stars.forEach(([x, y, size], i) => {
      const alpha = running ? .19 + (Math.sin(now / (1150 + i * 3) + i * .8) + 1) * .14 : .32;
      mist.globalAlpha = alpha;
      mist.fillStyle = i % 7 === 0 ? ice : bright;
      mist.fillRect(x * width + offset * size + mouse[0] * size, y * height + mouse[1] * size, size, size);
    });
    mist.globalAlpha = 1;
    const blend = running ? smooth((now - threadStart) / 910) : 1;
    const path = threadTo.map((pt, i) => [lerp(threadFrom[i][0], pt[0], blend) * width, lerp(threadFrom[i][1], pt[1], blend) * height]);
    route.clearRect(0, 0, width, height);
    route.globalAlpha = .26;
    sketch(route, path, palettes[active], 1.05);
    route.globalAlpha = .51;
    path.forEach(([x, y], i) => { if (i % 2 === 0) sketch(route, [[x - 3, y],[x, y - 3],[x + 3,y],[x,y + 3]], null, 0, palettes[active]); });
    route.globalAlpha = 1;
  }

  function animate(now) {
    frame = 0;
    if (!running || document.hidden) return;
    draw(now);
    frame = requestAnimationFrame(animate);
  }

  function motion(enabled) {
    running = enabled;
    cancelAnimationFrame(frame);
    frame = 0;
    if (running && !document.hidden) frame = requestAnimationFrame(animate);
    else draw(performance.now());
  }

  function play(stage, pair, backwards, commit, settle) {
    const name = spectral[pair] || 'disolucion';
    const box = stage.getBoundingClientRect();
    const w = box.width, h = box.height;
    const canvas = canvasLayer('nec-transition');
    canvas.id = 'transition';
    canvas.dataset.effect = name;
    const ctx = fit(canvas, w, h, 1.35);
    stage.append(canvas);
    const color = palettes[Math.max(0, pair)];
    let id, start, swapped = false, done = false;

    function swap() { if (!swapped) { swapped = true; commit(); } }
    function finish() {
      if (done) return;
      done = true;
      cancelAnimationFrame(id);
      swap();
      canvas.remove();
      settle();
    }
    function tick(now) {
      start ??= now;
      const t = bound((now - start) / (pair < 0 ? 430 : 1040));
      const amount = t < .5 ? smooth(t / .44) : 1 - smooth((t - .54) / .46);
      const backward = t < .5 ? backwards : !backwards;
      const fx = Math.sin(Math.PI * amount);
      ctx.clearRect(0, 0, w, h);
      const shade = ctx.createLinearGradient(0, 0, w, h);
      shade.addColorStop(0, '#16102e');
      shade.addColorStop(.62, '#07060f');
      shade.addColorStop(1, '#211536');
      if (name === 'disolucion') {
        ctx.globalAlpha = amount;
        ctx.fillStyle = shade;
        ctx.fillRect(0,0,w,h);
        ctx.globalAlpha = 1;
      } else if (name === 'convergencia' || name === 'inmersion') {
        const origin = name === 'convergencia' ? [.68*w, .5*h] : [.37*w,.57*h];
        const radius = Math.hypot(w,h) * .99 * amount;
        ctx.beginPath();
        ctx.arc(...origin, radius, 0, tau);
        ctx.fillStyle = shade;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = fx;
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (name === 'barrido') {
        for (let i=0;i<12;i+=1) {
          const y = i*h/12;
          const z = Math.min(w, w*(amount + fx * .11 * Math.sin(i * 1.9)));
          const x = backward ? w-z : 0;
          ctx.fillStyle = shade;
          ctx.fillRect(x,y,z,h/12+1);
          ctx.globalAlpha = fx*.8;
          sketch(ctx, [[backward?x:z,y],[backward?x:z,y+h/12]],color, 1.1);
          ctx.globalAlpha = 1;
        }
      } else if (name === 'horizonte') {
        const span = h * .56 * amount;
        ctx.fillStyle = shade;
        ctx.fillRect(0,h*.5-span,w,span*2);
        ctx.globalAlpha = fx*.8;
        for(const y of [h*.5-span,h*.5+span]) sketch(ctx,[[0,y],[w,y]],color,1.3);
        ctx.globalAlpha = 1;
      } else {
        const edge = Array.from({length:25}, (_,i) => {
          const y=i*h/24;
          const wave = name === 'onda' ? .12*Math.sin(i*.55+t*4) : name === 'grieta' ? (i%3-.95)*.035 : (.5-i/24)*.73;
          const x = (w+80)*amount-40 + w*wave*fx;
          return [backward?w-x:x,y];
        });
        const side = backward?w+1:-1;
        sketch(ctx,[...edge,[side,h],[side,0]],null,0,shade);
        ctx.globalAlpha = fx*.27;
        sketch(ctx,edge,color,14);
        ctx.globalAlpha = fx*.92;
        sketch(ctx,edge,bright,1.35);
        ctx.globalAlpha = 1;
      }
      ctx.globalAlpha = Math.sin(Math.PI*t)*.37;
      for (let i=0;i<17;i+=1) {
        const x=((i*.173+t*(backward?-.4:.4)+1)%1)*w;
        const y=(i*.307%1)*h;
        sketch(ctx,[[x,y-3],[x+5,y],[x,y+3],[x-5,y]],null,0,i%3?color:bright);
      }
      ctx.globalAlpha=1;
      if (t >= .5) swap();
      if (t < 1) id=requestAnimationFrame(tick);
      else finish();
    }
    id=requestAnimationFrame(tick);
    return finish;
  }

  function update(index) {
    if (!chrome) return;
    threadFrom = threadTo;
    threadTo = threadForms[index];
    active = index;
    threadStart = performance.now();
    sceneTime = threadStart;
    chrome.querySelector('.nec-count').textContent = String(index + 1).padStart(2,'0') + ' / 08';
    chrome.querySelector('.nec-progress i').style.transform = 'scaleX(' + (index + 1) / 8 + ')';
    dots.forEach((dot, i) => {
      if (index === i) dot.setAttribute('aria-current','step');
      else dot.removeAttribute('aria-current');
    });
    drawer.querySelector('.meta').textContent = titles[index] + ' · ' + notes[index][0];
    drawer.querySelector('.note').textContent = notes[index][1];
    reference.querySelector('.note').textContent = cues[index];
    if (!running) draw(threadStart);
    broadcast();
  }

  const time = ms => String(Math.floor(ms/60000)).padStart(2,'0') + ':' + String(Math.floor(ms/1000)%60).padStart(2,'0');
  function broadcast() {
    if (!popup || popup.closed) {
      clearInterval(interval);
      interval = undefined;
      return;
    }
    const now = performance.now();
    popup.postMessage({ type:'dipole-presenter-state', title:titles[active], note:notes[active][1], estimate:notes[active][0],
      upcoming:titles[active+1] || 'Fin', total:time(now-totalTime), step:time(now-sceneTime) }, '*');
  }
  function present() {
    if (popup && !popup.closed) { popup.focus(); return; }
    popup = window.open('../nec/presentador.html', 'dipolo-presentador', 'popup,width=950,height=680');
    if (popup && !interval) interval = setInterval(broadcast, 500);
  }
  function countdown() {
    if (!clock.hidden) { clock.hidden = true; clearTimeout(clockHandle); return; }
    const start = performance.now();
    clock.hidden = false;
    function count() {
      if (clock.hidden) return;
      const seconds = Math.max(0, 30 - Math.floor((performance.now()-start)/1000));
      clock.textContent = '00:' + String(seconds).padStart(2,'0');
      if (seconds) clockHandle = setTimeout(count, 240);
    }
    count();
  }
  function toggle(dialog) { if (dialog.open) dialog.close(); else dialog.showModal(); }
  function key(key) {
    if (drawer.open || reference.open) {
      if (key === 'n' && drawer.open) drawer.close();
      else if (key === 'l' && reference.open) reference.close();
      else if (key === 'm') {
        if (drawer.open) drawer.close();
        if (reference.open) reference.close();
        return false;
      } else return ['arrowleft', 'arrowright', 'backspace', 'home', 'end', ' '].includes(key);
      return true;
    }
    if (key === 'n') toggle(drawer);
    else if (key === 'l') toggle(reference);
    else if (key === 'p') present();
    else if (key === 't') countdown();
    else if (key === 'backspace') jumpTo(active - 1);
    else return false;
    return true;
  }

  function decorate(scenes, choose) {
    jumpTo = choose;
    stage = document.querySelector('#stage');
    ambient = canvasLayer('nec-sky');
    thread = canvasLayer('nec-thread');
    stage.prepend(ambient, thread);
    chrome = document.createElement('div');
    chrome.className = 'nec-chrome';
    chrome.innerHTML = '<div class="nec-ruler" aria-hidden="true"></div><div class="nec-brand"><b aria-hidden="true">✦</b>Dipolo eléctrico</div><button class="nec-reference" type="button">Ver referencia ↗</button><nav class="nec-dots" aria-label="Escenas"></nav><div class="nec-count" aria-hidden="true"></div><div class="nec-progress" aria-hidden="true"><i></i></div>';
    const nav = chrome.querySelector('nav');
    dots = scenes.map((scene,i) => {
      const dot=document.createElement('button');
      dot.type='button';
      dot.setAttribute('aria-label', titles[i]);
      dot.title=titles[i];
      dot.addEventListener('click',()=>jumpTo(i));
      nav.append(dot);
      return dot;
    });
    stage.append(chrome);
    drawer = document.createElement('dialog');
    drawer.className = 'nec-drawer';
    drawer.innerHTML = '<form method="dialog" class="menu-top"><h2>Notas del orador</h2><button aria-label="Cerrar notas">×</button></form><p class="meta"></p><p class="note"></p><a href="../Guion-dipolo.pdf" target="_blank" rel="noopener">Guion completo</a>';
    reference = document.createElement('dialog');
    reference.className = 'nec-reference-sheet';
    reference.innerHTML = '<form method="dialog" class="menu-top"><h2>Referencia</h2><button aria-label="Cerrar referencia">×</button></form><p class="meta">Potencial eléctrico</p><p class="note"></p><a href="https://openstax.org/books/university-physics-volume-2/pages/7-3-calculations-of-electric-potential" target="_blank" rel="noopener">OpenStax · Cálculo del potencial</a>';
    clock=document.createElement('output');
    clock.className='nec-clock'; clock.hidden=true; clock.setAttribute('aria-label','Cuenta regresiva');
    stage.append(clock);
    document.body.append(drawer,reference);
    chrome.querySelector('.nec-reference').addEventListener('click',()=>toggle(reference));
    const menuHint=document.querySelector('#menu > p');
    menuHint.textContent='← → Navegar · M Índice · N Notas · P Presentador · L Referencia · F Pantalla completa · T Reloj de 30 s';
    for (const [label, action] of [['Notas',()=>toggle(drawer)],['Presentador',present]]) {
      const button=document.createElement('button');
      button.type='button'; button.textContent=label;
      button.addEventListener('click',()=>{ document.querySelector('#menu').close(); action(); });
      document.querySelector('#menu .menu-tools').append(button);
    }
    stage.addEventListener('click', event => {
      if (event.target.classList.contains('pan') || event.target.classList.contains('scene')) {
        jumpTo(active + 1);
      }
    });
    stage.addEventListener('mousemove', e => { mouse[0]=e.clientX/innerWidth*2-1; mouse[1]=e.clientY/innerHeight*2-1; },{passive:true});
    window.addEventListener('resize',size);
    document.addEventListener('visibilitychange',()=>motion(running));
    window.addEventListener('message',event=>{
      if (event.source!==popup) return;
      if (event.data?.type==='dipole-presenter-ready') broadcast();
      if (event.data?.type!=='dipole-presenter-command') return;
      if (event.data.command==='reset') totalTime=sceneTime=performance.now();
      else if (event.data.command==='next') jumpTo(active+1);
      else if (event.data.command==='prev') jumpTo(active-1);
      broadcast();
    });
    size();
  }

  window.NecTheme={ play, decorate, update, motion, key, crest };
})();


