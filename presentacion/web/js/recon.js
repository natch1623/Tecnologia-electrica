/* =========================================================
   R6 · Reconstrucción animada de los hechos del Caso 4
   Diapositiva adicional: no altera las 19 principales.
   Todo se deriva de un tiempo t (s): se puede pausar, saltar y rebobinar.
   Espacio pausa · → / ← salta entre hechos · R repite
   ========================================================= */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const deck = () => window.Deck;

  function el(tag, attrs = {}, parent, text) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const lin = p => p;
  const out = p => 1 - Math.pow(1 - p, 3);
  const win = (t, a, b) => clamp((t - a) / (b - a));
  // Opacidad: entra en a, sale al llegar a b
  const vis = (t, a, b = Infinity, f = 0.5) => Math.min(win(t, a, a + f), b === Infinity ? 1 : 1 - win(t, b - f, b));
  // Pista de fotogramas clave [[t, valor]] con valor número o arreglo
  function tr(t, keys, e = ease) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      if (t > keys[i][0]) continue;
      const [t0, a] = keys[i - 1], [t1, b] = keys[i];
      const p = e(t1 > t0 ? (t - t0) / (t1 - t0) : 1);
      return Array.isArray(a) ? a.map((v, j) => v + (b[j] - v) * p) : a + (b - a) * p;
    }
    return keys[keys.length - 1][1];
  }
  const rnd = (i, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

  /* ---------- Geometría: elevación de la sala, 220 px/m ---------- */
  const FY = 870, CY = 210, WL = 300, WR = 1620;
  const RAIL = 540;                 // larguero superior (1,5 m)
  const UP = 574, LO = 728, CH = 84; // parte superior de las celdas de cada nivel
  const X0 = 520, X1 = 1300, STEP = (X1 - X0) / 63, CW = 10;
  const upX = n => X1 - (n - 62) * STEP + 1.2;  // nivel superior: 63 → 125 de derecha a izquierda
  const loX = n => X0 + (n - 1) * STEP + 1.2;   // nivel inferior: 1 → 62
  const CAB = 1311, FAULT = [CAB, 650];         // cable puente y su contacto con el bastidor
  const SX = upX(118) + 2.5;                    // borne + de la celda 118
  const AP = [SX, RAIL + 4];                    // punto del arco: cabeza de la matraca contra el larguero
  const CAP = [upX(119) + CW / 2, UP - 3];      // tapón de la celda 119
  const BRK = { x: 1664, y: 330, w: 112, h: 90 };
  const END = 60;

  // Hechos (inicio en t, hora, texto)
  const BEATS = [
    [0, '01:30', 'Sala de Baterías B, UPS-2. Antes de esa noche ya hay <b>barreras de mantenimiento fuera de servicio</b> y una falla a tierra que nadie ve.'],
    [5, '01:30', 'S1 autoriza el acceso con una orden genérica: <b>"reapriete de conexiones"</b>. Entran T1 (12 años en CA, primer banco inundado) y T2 (8 meses de experiencia).'],
    [9, '01:45', 'Conversación verbal entre T1 y T2. <b class="c-danger">Sin evaluación de riesgos, sin plan de trabajo, sin permiso de trabajo energizado.</b>'],
    [13, '01:55', 'T1 retira <b>todas</b> las cubiertas del nivel superior "para agilizar": <b class="c-danger">62 conexiones expuestas a la vez</b>.'],
    [19, '02:10', 'Medición con micro-óhmetro en C-40/41, C-77/78 y C-118/119: más de 20 % sobre la línea base. T2 registra.'],
    [23, '02:25', 'T2 toma densidades con hidrómetro de bulbo, sin protector facial ni delantal. La igualación terminó hace 20 h y el extractor sigue detenido.'],
    [27, '02:38', 'T1 reaprieta C-118/119 con una <b>matraca de acero sin aislamiento</b>, junto al larguero del bastidor. Lleva anillo y reloj metálico.'],
    [31.6, '02:38:14', 'El dado está en el borne + de la celda 118 y la cabeza de la matraca <b class="c-danger">toca el larguero</b>.'],
    [33.2, '02:38:14', 'Se cierra el lazo <b class="c-danger">C-118 → 117…63 → cable puente → bastidor → matraca</b>: ≈ 126 V CC y varios kA. El interruptor de 400 A está <b>fuera del lazo</b>: nada despeja el arco.'],
    [34.8, '02:38:14', 'El plasma alcanza el tapón de la celda 119, <b>sin apagallamas</b>: la mezcla H₂/O₂ interior detona, la tapa se fractura y salta electrolito.'],
    [37.4, '02:38:15', 'La matraca sale expulsada y el arco se extingue: <b>≈ 0,9 s</b>, 27 fotogramas del CCTV.'],
    [40, '02:39', 'T1 retrocede. T2 corre al lavaojos: <b class="c-danger">la botella está vacía</b> y vencida.'],
    [44, '02:40', 'T2 lleva a T1 a un lavamanos a 15 m: ≈ 1 minuto de retraso para lavar los ojos.'],
    [48, '02:41', 'La UPS registra "falla de batería". La alarma de falla a tierra <b>no se anuncia</b>: seguía inhibida.'],
    [52, '', '<b>Cuatro barreras de mantenimiento</b> ya estaban fuera de servicio antes de que T1 tomara la llave: aislamiento del cable puente, alarma de falla a tierra, ventilación con detección y apagallamas.']
  ];
  const JUMPS = [0, 5, 9, 13, 19, 23, 27, 31.6, 40, 44, 48, 52];
  const MARKS = [[0, '01:30'], [9, '01:45'], [13, '01:55'], [19, '02:10'], [23, '02:25'], [31.6, '02:38:14'], [40, '02:39'], [44, '02:40'], [48, '02:41'], [52, 'BARRERAS']];

  // Reloj de la noche (segundos desde medianoche)
  const CLOCK = [[0, 5400], [5, 5400], [9, 6300], [13, 6900], [19, 7800], [23, 8700], [27, 9420], [31, 9493.6], [32, 9494], [38, 9494.9], [40, 9540], [44, 9600], [48, 9660], [END, 9660]];
  const hms = s => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(Math.floor(x)).padStart(2, '0')}`;
  };

  // Cámara: [centro x, centro y, escala]
  const CAM = [[0, [960, 540, 1]], [28, [960, 540, 1]], [31, [622, 560, 4.6]], [32.7, [622, 560, 4.6]], [33.7, [1040, 600, 1.2]], [38.6, [1040, 600, 1.2]], [39.8, [960, 540, 1]]];

  // Personas: posición x, flexión y mano activa
  const T1X = [[0, 1520], [5, 1520], [8.5, 1250], [13, 1250], [13.4, 1340], [18.6, 570], [19.4, 1050], [20.4, 1050], [20.8, 1150], [21.6, 1150], [22.2, 650], [23, 650], [27, 650], [28.4, 740], [38.2, 740], [39.6, 880], [44.4, 880], [47.2, 1520]];
  const T2X = [[0, 1520], [5.4, 1520], [9, 1300], [13, 1300], [13.6, 1380], [23, 1380], [24, 890], [39.4, 890], [41.2, 1400], [42.8, 1400], [44, 930], [44.4, 930], [47, 1540]];

  // Condiciones latentes (barreras de mantenimiento): [x, y, rótulo final]
  const BARRIERS = [
    [FAULT[0], FAULT[1], '1 · AISLAMIENTO DEL CABLE PUENTE', 1336, 832, 'start'],
    [420, 300, '2 · ALARMA DE FALLA A TIERRA', 330, 430, 'start'],
    [1200, CY + 14, '3 · VENTILACIÓN Y DETECCIÓN DE H₂', 1200, 318, 'middle'],
    [CAP[0], CAP[1], '4 · APAGALLAMAS', 312, 520, 'start']
  ];

  function build(slide) {
    const svg = slide.querySelector('svg.rc');
    const defs = el('defs', {}, svg);
    const cp = el('clipPath', { id: 'rc-clip' }, defs);
    el('rect', { x: 0, y: 188, width: 1920, height: 692 }, cp);
    const rg = el('radialGradient', { id: 'rc-fire' }, defs);
    [[0, '#ffffff', 1], [0.25, '#fff1d6', 0.95], [0.5, '#ffb070', 0.7], [0.75, '#ff4d6d', 0.3], [1, '#ff4d6d', 0]].forEach(([o, c, a]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, rg));

    // Clic en la escena: pausa / continúa (no avanza la diapositiva)
    const bg = el('rect', { x: 0, y: 188, width: 1920, height: 692, class: 'hitbox hit' }, svg);
    bg.addEventListener('click', e => { e.stopPropagation(); toggle(slide); });

    const clip = el('g', { 'clip-path': 'url(#rc-clip)' }, svg);
    const world = el('g', { class: 'rc-world' }, clip);
    const R = {};
    R.world = world;
    // Las marcas finales van encima y no se atenúan con la sala
    const top = el('g', { class: 'rc-world rc-top' });
    R.top = top;

    // Sala
    el('path', { d: `M${WL} ${CY} H${WR} M${WL} ${CY} V${FY} M${WR} ${CY} V${FY}`, class: 'rc-wall' }, world);
    el('line', { x1: WL - 60, y1: FY, x2: WR + 60, y2: FY, class: 'rc-floor' }, world);
    el('text', { x: WL, y: CY - 10, class: 'rc-s' }, world, 'SALA DE BATERÍAS B · 6 × 4 × 3 m · ELEVACIÓN · BANCO ESQUEMÁTICO');
    // Puerta
    el('rect', { x: 1470, y: FY - 462, width: 100, height: 462, class: 'rc-door' }, world);
    el('text', { x: 1520, y: FY - 474, class: 'rc-s', 'text-anchor': 'middle' }, world, 'ACCESO');

    // Salida del banco hacia el interruptor (fuera de la sala, a 6 m)
    el('path', { d: `M${upX(125) + 2} ${UP - 6} V380 H${BRK.x}`, class: 'rc-out' }, world);
    el('text', { x: 1000, y: 370, class: 'rc-s', 'text-anchor': 'middle' }, world, 'SALIDA DEL BANCO → INTERRUPTOR A 6 m');
    el('rect', { x: BRK.x, y: BRK.y, width: BRK.w, height: BRK.h, class: 'rc-box' }, world);
    el('text', { x: BRK.x + BRK.w / 2, y: BRK.y + 38, class: 'rc-bt', 'text-anchor': 'middle' }, world, 'INT. CC');
    el('text', { x: BRK.x + BRK.w / 2, y: BRK.y + 66, class: 'rc-bv', 'text-anchor': 'middle' }, world, '400 A');
    el('rect', { x: BRK.x, y: 470, width: BRK.w, height: 70, class: 'rc-box' }, world);
    el('text', { x: BRK.x + BRK.w / 2, y: 512, class: 'rc-bt', 'text-anchor': 'middle' }, world, 'UPS-2');
    el('line', { x1: BRK.x + BRK.w / 2, y1: BRK.y + BRK.h, x2: BRK.x + BRK.w / 2, y2: 470, class: 'rc-out' }, world);
    R.brk0 = el('g', { class: 'rc-brk0' }, world);
    el('rect', { x: BRK.x - 8, y: BRK.y - 8, width: BRK.w + 16, height: BRK.h + 16, class: 'rc-outl' }, R.brk0);
    el('text', { x: BRK.x + BRK.w / 2, y: BRK.y - 22, class: 'rc-f', 'text-anchor': 'middle' }, R.brk0, '0 A · FUERA DEL LAZO');

    // Techo: extractor y detector de H₂
    el('rect', { x: 1160, y: CY, width: 80, height: 28, class: 'rc-box' }, world);
    R.fan = el('g', { transform: `translate(1200 ${CY + 14})` }, world);
    el('path', { d: 'M0 0 L-10 -8 M0 0 L10 8 M0 0 L8 -10 M0 0 L-8 10', class: 'rc-fan' }, R.fan);
    el('rect', { x: 786, y: CY, width: 28, height: 16, class: 'rc-box' }, world);
    el('circle', { cx: 800, cy: CY + 8, r: 3, class: 'rc-led' }, world);

    // BMS
    el('rect', { x: 320, y: 250, width: 200, height: 112, class: 'rc-box' }, world);
    el('text', { x: 334, y: 276, class: 'rc-bms' }, world, 'BMS · UPS-2');
    el('text', { x: 334, y: 300, class: 'rc-bms bad' }, world, 'F. TIERRA: INHIBIDA');
    R.log1 = el('text', { x: 334, y: 326, class: 'rc-bms bad' }, world, '02:41 FALLA DE BATERÍA');
    R.log2 = el('text', { x: 334, y: 348, class: 'rc-bms' }, world, 'F. TIERRA: NO ANUNCIADA');

    // Lavaojos portátil
    R.eye = el('g', {}, world);
    el('path', { d: 'M1410 594 h20 v6 l6 8 v44 h-32 v-44 l6 -8 z', class: 'rc-bottle' }, R.eye);
    el('text', { x: 1420, y: 678, class: 'rc-s', 'text-anchor': 'middle' }, R.eye, 'LAVAOJOS');
    R.eyeBad = el('text', { x: 1420, y: 700, class: 'rc-f', 'text-anchor': 'middle' }, world, 'VACÍO · VENCIDO');

    // Bastidor
    const metal = { class: 'rc-metal' };
    el('rect', { x: 492, y: RAIL - 4, width: 829, height: 8, ...metal }, world);
    el('rect', { x: 492, y: UP + CH, width: 829, height: 6, ...metal }, world);
    el('rect', { x: 492, y: LO + CH, width: 829, height: 6, ...metal }, world);
    el('rect', { x: 492, y: RAIL - 4, width: 8, height: FY - RAIL + 4, ...metal }, world);
    el('rect', { x: 1313, y: RAIL - 4, width: 8, height: FY - RAIL + 4, ...metal }, world);
    // Celdas, conectores y cubiertas
    R.hot = [];
    for (let n = 1; n <= 125; n++) {
      const up = n >= 63, x = up ? upX(n) : loX(n), y = up ? UP : LO;
      const c = el('rect', { x, y, width: CW, height: CH, class: 'rc-cell' }, world);
      if (up && n <= 118) R.hot.push(c);
      if (n === 119) R.c119 = c;
    }
    el('text', { x: upX(125), y: UP + CH + 26, class: 'rc-s' }, world, '125');
    el('text', { x: upX(63) + CW, y: UP + CH + 26, class: 'rc-s', 'text-anchor': 'end' }, world, '63');
    el('text', { x: loX(1), y: LO + CH + 26, class: 'rc-s' }, world, '1');
    el('text', { x: loX(62) + CW, y: LO + CH + 26, class: 'rc-s', 'text-anchor': 'end' }, world, '62');
    el('text', { x: upX(118), y: UP + CH + 26, class: 'rc-s', 'text-anchor': 'middle' }, world, '119 · 118');
    for (let n = 1; n < 62; n++) el('rect', { x: loX(n) + 6, y: LO - 5, width: STEP - 2, height: 3, class: 'rc-conn' }, world);
    for (let n = 1; n < 62; n++) el('rect', { x: loX(n) + 4.5, y: LO - 10, width: STEP + 1, height: 5, class: 'rc-cover' }, world);
    R.covers = [];
    for (let n = 63; n < 125; n++) {
      el('rect', { x: upX(n + 1) + 6, y: UP - 5, width: STEP - 2, height: 3, class: 'rc-conn' }, world);
      const cx = upX(n + 1) + 5 + STEP / 2;
      const c = el('rect', { x: -STEP / 2 - 0.5, y: -3, width: STEP + 1, height: 5, class: 'rc-cover' }, world);
      R.covers.push({ c, cx, i: n - 63 });
    }
    // Tapón de la 119 y tapa que se fractura
    R.lid = el('rect', { x: upX(119), y: UP, width: CW, height: 4, class: 'rc-lid' }, world);
    el('rect', { x: CAP[0] - 2, y: UP - 5, width: 4, height: 5, class: 'rc-plug' }, world);
    R.crack = el('path', { d: `M${upX(119) + 2} ${UP} l3 12 l-2 10 l4 14 M${upX(119) + 8} ${UP} l-2 16 l3 9`, class: 'rc-crack' }, world);

    // Cable puente
    el('path', { d: `M${loX(62) + 5} ${LO - 6} H${CAB} V${UP - 2} H${upX(63) + 5}`, class: 'rc-bridge' }, world);
    R.fault = el('circle', { cx: FAULT[0], cy: FAULT[1], r: 6, class: 'rc-fault' }, world);
    R.faultH = el('circle', { cx: FAULT[0], cy: FAULT[1], r: 16, class: 'rc-fault-h' }, world);

    // Lazo de falla
    const loopD = `M${SX} ${UP - 6} H${upX(63) + 5} L${CAB} ${UP - 2} V${FAULT[1]} H1317 V${RAIL} H${SX} Z`;
    R.loop = el('path', { d: loopD, class: 'rc-loop' }, world);
    R.flow = el('path', { d: loopD, class: 'rc-flow' }, world);
    R.loopT = el('text', { x: 1120, y: RAIL - 14, class: 'rc-f', 'text-anchor': 'middle' }, world, '≈ 126 V CC · VARIOS kA · 0 INTERRUPTORES');

    // Rótulos de condiciones latentes (violeta = mantenimiento)
    R.tags = [];
    const tag = (x, y, lines, anchor, at, leader) => {
      const g = el('g', { class: 'rc-tag' }, world);
      if (leader) el('path', { d: leader, class: 'rc-lead' }, g);
      lines.forEach((l, i) => el('text', { x, y: y + i * 20, 'text-anchor': anchor }, g, l));
      R.tags.push({ g, at });
      return g;
    };
    tag(1336, 770, ['FALLA A TIERRA', 'OCULTA · ≈ 0 Ω'], 'start', 3.4, `M${FAULT[0] + 12} ${FAULT[1] + 12} L1348 752`);
    tag(420, 400 - 18, ['INHIBIDA HACE 5 MESES'], 'middle', 1.4);
    tag(1200, CY + 60, ['EXTRACTOR · DETENIDO HACE 19 DÍAS'], 'middle', 2.0);
    tag(800, CY + 44, ['DETECTOR H₂ · CALIBRACIÓN VENCIDA 26 MESES'], 'middle', 2.6);
    tag(312, 470, ['TAPÓN C-119', 'SIN APAGALLAMAS'], 'start', 3.0, `M430 ${496} L${CAP[0] - 4} ${CAP[1] - 4}`);

    // Personas (figuras de líneas, sin rasgos)
    const fig = cls => {
      const g = el('g', { class: `rc-fig ${cls}` }, world);
      return { g, body: el('path', {}, g), head: el('circle', { r: 21 }, g), lbl: el('text', { class: 'rc-who', 'text-anchor': 'middle' }, g, cls.toUpperCase()) };
    };
    R.t1 = fig('t1');
    R.t2 = fig('t2');
    R.hydro = el('path', { d: 'M0 0 v34 m-5 0 h10 l-2 16 h-6 z', class: 'rc-tool' }, world);
    R.clip = el('rect', { width: 22, height: 28, class: 'rc-tool' }, world);
    R.meter = el('g', {}, world);
    R.reads = [[loX(40) + 5 + STEP / 2, LO - 8], [upX(78) + 5 + STEP / 2, UP - 8], [upX(119) + 5 + STEP / 2, UP - 8]].map(([x, y]) => {
      const g = el('g', { class: 'rc-read' }, R.meter);
      el('circle', { cx: x, cy: y, r: 7 }, g);
      el('text', { x, y: y - 16, 'text-anchor': 'middle' }, g, '+20 %');
      return g;
    });

    // Matraca: dado en el borne + de la 118, cabeza a la altura del larguero
    R.wr = el('g', { class: 'rc-wrench' }, world);
    el('rect', { x: -3.5, y: 6, width: 7, height: 10, class: 'rc-sock' }, R.wr);
    el('circle', { cx: 0, cy: 0, r: 6, class: 'rc-head' }, R.wr);
    R.handle = el('line', { x1: 0, y1: 0, x2: 58, y2: 0, class: 'rc-handle' }, R.wr);

    // Arco, bola de fuego, fragmentos y electrolito
    R.glow = el('circle', { cx: AP[0], cy: AP[1], r: 10, fill: 'url(#rc-fire)' }, world);
    R.arc = el('path', { class: 'rc-arc' }, world);
    R.fire = el('circle', { cx: CAP[0], cy: CAP[1], r: 0, fill: 'url(#rc-fire)' }, world);
    R.frags = Array.from({ length: 6 }, (_, i) => ({
      e: el('rect', { width: 3 + rnd(i, 2) * 3, height: 2, class: 'rc-frag' }, world),
      vx: (rnd(i, 3) - 0.5) * 140, vy: -60 - rnd(i, 4) * 90, r: (rnd(i, 5) - 0.5) * 900
    }));
    R.drops = Array.from({ length: 22 }, (_, i) => ({
      e: el('circle', { r: 1.8 + rnd(i, 6) * 1.6, class: 'rc-drop' }, world),
      vx: -30 + rnd(i, 7) * 170, vy: -40 - rnd(i, 8) * 110
    }));

    // Marcas finales: las cuatro barreras de mantenimiento
    clip.appendChild(top);
    R.marks = BARRIERS.map(([x, y, txt, lx, ly, anchor], i) => {
      const g = el('g', { class: 'rc-mark' }, top);
      el('circle', { cx: x, cy: y, r: 22, class: 'rc-ring' }, g);
      el('text', { x: lx, y: ly, 'text-anchor': anchor }, g, `${txt}  ✕`);
      return { g, at: 52.4 + i * 0.9 };
    });

    // Línea de hechos (screen): clic para saltar
    const sc = el('g', { class: 'rc-scrub' }, svg);
    const x0 = 150, x1 = 1770, y = 992;
    const tx = t => x0 + (t / END) * (x1 - x0);
    el('line', { x1: x0, y1: y, x2: x1, y2: y, class: 'rc-sc-bg' }, sc);
    R.scFill = el('line', { x1: x0, y1: y, x2: x0, y2: y, class: 'rc-sc-fg' }, sc);
    MARKS.forEach(([t, l]) => {
      const x = tx(t), bad = t === 31.6;
      el('path', { d: `M${x} ${y - 5} L${x + 5} ${y} L${x} ${y + 5} L${x - 5} ${y} Z`, class: bad ? 'rc-sc-d bad' : 'rc-sc-d' }, sc);
      el('text', { x, y: y - 14, class: bad ? 'rc-sc-t bad' : 'rc-sc-t', 'text-anchor': t === 0 ? 'start' : t === 52 ? 'middle' : 'middle' }, sc, l);
    });
    R.head = el('circle', { cx: x0, cy: y, r: 6, class: 'rc-sc-h' }, sc);
    const hit = el('rect', { x: x0 - 10, y: y - 34, width: x1 - x0 + 20, height: 52, class: 'hitbox hit' }, sc);
    hit.addEventListener('click', e => {
      e.stopPropagation();
      const r = svg.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * 1920;
      seek(slide, clamp((px - x0) / (x1 - x0)) * END);
    });
    R.tx = tx;

    R.cap = slide.querySelector('.rc-cap');
    R.clock = slide.querySelector('.rc-clock b');
    R.sub = slide.querySelector('.rc-clock span');
    st.R = R;
  }

  /* ---------- Figura de líneas ---------- */
  function pose(f, x, { swing = 0, crouch = 0, hand = null, face = false, o = 1 }) {
    const hy = FY - 364 + crouch, sy = FY - 318 + crouch, py = FY - 196 + crouch * 0.8;
    const s = swing ? Math.sin(swing) * 26 : 0;
    const kx = crouch * 0.45;
    const arm = (sx, [hx, hy2], side) => {
      const mx = (sx + hx) / 2, my = (sy + hy2) / 2;
      return `M${sx} ${sy} L${mx + side * 8} ${my + 12} L${hx} ${hy2}`;
    };
    const rest = side => [x + side * 24, FY - 186 + crouch];
    const faceH = side => [x + side * 7, hy + 10];
    const hL = face ? faceH(-1) : hand && hand[0] <= x ? hand : rest(-1);
    const hR = face ? faceH(1) : hand && hand[0] > x ? hand : rest(1);
    const d = `M${x} ${hy + 21} L${x} ${py}` +
      `M${x} ${py} L${x - s * 0.5 + kx} ${(py + FY) / 2} L${x - s} ${FY}` +
      `M${x} ${py} L${x + s * 0.5 + kx} ${(py + FY) / 2} L${x + s} ${FY}` +
      arm(x - 10, hL, -1) + arm(x + 10, hR, 1);
    f.body.setAttribute('d', d);
    f.head.setAttribute('cx', x); f.head.setAttribute('cy', hy);
    f.lbl.setAttribute('x', x); f.lbl.setAttribute('y', hy - 34);
    f.g.style.opacity = o;
  }

  /* ---------- Render: todo sale de t ---------- */
  const st = { t: 0, playing: false, raf: 0, last: 0, R: null, beat: -1 };

  function render(t) {
    const R = st.R;
    // Cámara con sacudida en el contacto y en la detonación
    let [cx, cy, s] = tr(t, CAM);
    if (!reduced) {
      const k = 1 - win(t, 31.8, 32.6) + (1 - win(t, 34.8, 35.6)) * 1.4;
      if (t > 31.8 && k > 0 && k < 2.4) { cx += (Math.random() - 0.5) * k * 6 / s; cy += (Math.random() - 0.5) * k * 6 / s; }
    }
    const cam = `translate(960 540) scale(${s.toFixed(4)}) translate(${-cx.toFixed(2)} ${-cy.toFixed(2)})`;
    R.world.setAttribute('transform', cam);
    R.top.setAttribute('transform', cam);
    const txtO = clamp(1 - (s - 1) / 0.25);
    R.world.style.opacity = (1 - 0.6 * win(t, 52, 53)).toFixed(3);

    // Condiciones latentes
    R.tags.forEach(g => { g.g.style.opacity = (vis(t, g.at) * txtO).toFixed(3); });
    R.fault.style.opacity = 0.35 + 0.65 * win(t, 33.2, 33.6) - 0.3 * win(t, 38.6, 39.4);
    R.faultH.style.opacity = (0.25 + 0.5 * win(t, 33.2, 33.6)) * (0.6 + 0.4 * Math.sin(t * 4));

    // Cubiertas: T1 las retira de derecha a izquierda y caen al piso
    R.covers.forEach(({ c, cx: x, i }) => {
      const t0 = 13.4 + ((1300 - x) / (1300 - 530)) * 5.2;
      const p = clamp((t - t0) / 0.7);
      const dx = (rnd(i, 9) - 0.5) * 60 * p, y = UP - 7 + (FY - 3 - (UP - 7)) * p * p;
      c.setAttribute('transform', `translate(${(x + dx).toFixed(1)} ${y.toFixed(1)}) rotate(${(p * (rnd(i, 10) - 0.5) * 300).toFixed(0)})`);
      c.classList.toggle('off', p > 0);
    });

    // Mediciones
    R.reads.forEach((g, i) => { g.style.opacity = vis(t, 19.9 + i * 0.95, 27, 0.3) * txtO; });

    // T1
    const x1 = tr(t, T1X, lin);
    const x1p = tr(t - 0.08, T1X, lin);
    const walk1 = Math.abs(x1 - x1p) > 0.6 ? x1 / 16 : 0;
    let hand1 = null, crouch1 = 0, face = false;
    if (t >= 13.4 && t < 18.8) hand1 = [x1 - 40, UP - 10];
    else if (t >= 19.4 && t < 20.4) { hand1 = [R.reads[0].firstChild.getAttribute('cx') * 1, LO - 8]; crouch1 = 92; }
    else if (t >= 20.8 && t < 21.6) hand1 = [+R.reads[1].firstChild.getAttribute('cx'), UP - 8];
    else if (t >= 22.2 && t < 27) hand1 = [+R.reads[2].firstChild.getAttribute('cx'), UP - 8];
    else if (t >= 28.4 && t < 37.4) hand1 = [SX + 58, AP[1] + 6];
    else if (t >= 38.2 && t < 44.4) { face = true; crouch1 = 18; }
    // En el primer plano la figura se atenúa para no tapar el borne
    const near = clamp((s - 1.6) / 1.5);
    pose(R.t1, x1, { swing: walk1, crouch: crouch1, hand: hand1, face, o: vis(t, 5, 47.8) * (1 - 0.7 * near) });

    // T2
    const x2 = tr(t, T2X, lin);
    const x2p = tr(t - 0.08, T2X, lin);
    const walk2 = Math.abs(x2 - x2p) > 0.6 ? x2 / 16 : 0;
    let hand2 = null, crouch2 = 0;
    const clip = (t >= 13.6 && t < 23);
    if (clip) hand2 = [x2 - 30, FY - 250];
    if (t >= 24 && t < 27.5) { hand2 = [x2 - 14, LO - 44]; crouch2 = 70; }
    if (t >= 41.2 && t < 42.8) hand2 = [1414, 612];
    if (t >= 44 && t < 47) hand2 = [x1 + 24, FY - 250];
    pose(R.t2, x2, { swing: walk2, crouch: crouch2, hand: hand2, o: vis(t, 5.4, 47.6) * (1 - 0.7 * near) });
    R.clip.setAttribute('x', x2 - 44); R.clip.setAttribute('y', FY - 266);
    R.clip.style.opacity = clip ? 1 : 0;
    R.hydro.setAttribute('transform', `translate(${x2 - 14} ${LO - 44})`);
    R.hydro.style.opacity = t >= 24.2 && t < 27.4 ? 1 : 0;

    // Matraca: aparece, trinquetea, toca el larguero y sale expulsada
    const wo = vis(t, 28.6, Infinity, 0.3);
    let wx = SX, wy = AP[1] + 6 + 6 * (1 - win(t, 31.2, 31.8)), rot = 0;
    if (t < 31.8) rot = Math.sin(t * 7) * 7 * win(t, 29.4, 29.8);
    if (t >= 37.4) {
      const u = t - 37.4;
      wx = SX + 120 * u;
      wy = Math.min(FY - 4, AP[1] + 6 - 170 * u + 150 * u * u);
      rot = wy >= FY - 4 ? 160 : 380 * u;
    }
    R.wr.setAttribute('transform', `translate(${wx.toFixed(1)} ${(wy - 6).toFixed(1)}) rotate(${rot.toFixed(1)})`);
    R.wr.style.opacity = wo * (1 - win(t, 47.5, 48.5));

    // Arco sostenido ≈ 0,9 s (32 → 37,4 en cámara lenta)
    const arcOn = t >= 31.8 && t < 37.6;
    const fl = arcOn ? 0.75 + Math.random() * 0.5 : 0;
    R.glow.setAttribute('r', (arcOn ? 16 + 10 * fl + 18 * win(t, 32.8, 34) : 0).toFixed(1));
    R.glow.style.opacity = arcOn ? 0.9 : 0;
    if (arcOn) {
      let d = '';
      const reach = win(t, 33.8, 34.8);
      for (let k = 0; k < 4; k++) {
        const tgt = k === 3 && reach > 0 ? [AP[0] + (CAP[0] - AP[0]) * reach, AP[1] + (CAP[1] - AP[1]) * reach] : [AP[0] + (Math.random() - 0.5) * 22, AP[1] + (Math.random() - 0.3) * 18];
        d += `M${AP[0]} ${AP[1]}`;
        for (let j = 1; j <= 4; j++) {
          const p = j / 4;
          d += ` L${(AP[0] + (tgt[0] - AP[0]) * p + (j < 4 ? (Math.random() - 0.5) * 6 : 0)).toFixed(1)} ${(AP[1] + (tgt[1] - AP[1]) * p + (j < 4 ? (Math.random() - 0.5) * 6 : 0)).toFixed(1)}`;
        }
      }
      R.arc.setAttribute('d', d);
    } else R.arc.setAttribute('d', '');

    // Lazo de falla y celdas del lazo
    const lo = vis(t, 33.2, 38.6, 0.4);
    R.loop.style.opacity = lo;
    R.flow.style.opacity = lo;
    R.flow.style.strokeDashoffset = (-t * 60).toFixed(1);
    R.loopT.style.opacity = lo * clamp(1 - (s - 1.2) / 0.3);
    R.hot.forEach(c => c.classList.toggle('hot', lo > 0.3));
    R.brk0.style.opacity = lo;

    // Detonación de la celda 119
    const dt = t - 34.8;
    R.fire.setAttribute('r', dt > 0 ? (58 * out(clamp(dt / 0.7))).toFixed(1) : 0);
    R.fire.style.opacity = dt > 0 ? 1 - win(t, 35.1, 36.6) : 0;
    R.lid.style.opacity = dt > 0 ? 0 : 1;
    R.crack.style.opacity = dt > 0 ? 1 : 0;
    R.frags.forEach(f => {
      if (dt <= 0) { f.e.style.opacity = 0; return; }
      const x = CAP[0] + f.vx * dt, y = Math.min(FY - 2, CAP[1] + f.vy * dt + 70 * dt * dt);
      f.e.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(f.r * Math.min(dt, 2)).toFixed(0)})`);
      f.e.style.opacity = 1 - win(t, 44, 46);
    });
    R.drops.forEach(p => {
      if (dt <= 0) { p.e.style.opacity = 0; return; }
      const x = CAP[0] + p.vx * dt, y = Math.min(FY - 2, CAP[1] + p.vy * dt + 90 * dt * dt);
      p.e.setAttribute('cx', x.toFixed(1)); p.e.setAttribute('cy', y.toFixed(1));
      p.e.style.opacity = 1 - win(t, 44, 46);
    });

    // Lavaojos vacío y registro del BMS
    R.eyeBad.style.opacity = vis(t, 42.2, Infinity, 0.3);
    R.eye.classList.toggle('bad', t >= 42.2);
    R.log1.style.opacity = vis(t, 48.4, Infinity, 0.3);
    R.log2.style.opacity = vis(t, 49.4, Infinity, 0.3);

    // Barreras de mantenimiento
    R.marks.forEach(m => { m.g.style.opacity = vis(t, m.at, Infinity, 0.4); });

    // Reloj
    const c = tr(t, CLOCK, lin);
    R.clock.textContent = t >= 31.6 && t < 38.6 ? `${hms(c)},${Math.floor((c % 1) * 10)}` : hms(c);
    R.clock.classList.toggle('bad', t >= 31.6 && t < 40);
    let sub = '14 AGO 2026 · ESCENARIO HIPOTÉTICO';
    if (t >= 31.8 && t < 38.6) sub = `CÁMARA LENTA · FOTOGRAMA ${Math.min(27, Math.max(1, Math.ceil(((t - 31.8) / 5.6) * 27)))} / 27`;
    else if (t >= 27 && t < 31.6) sub = 'AVANCE RÁPIDO →';
    if (!st.playing) sub = t >= END ? 'FIN · R PARA REPETIR' : `❚❚ PAUSA · ${sub}`;
    R.sub.textContent = sub;

    // Leyenda del hecho actual
    let b = 0;
    BEATS.forEach(([bt], i) => { if (t >= bt) b = i; });
    if (b !== st.beat) {
      st.beat = b;
      const [, h, txt] = BEATS[b];
      R.cap.innerHTML = `${h ? `<span class="h">${h}</span>` : '<span class="h ok">PERITAJE</span>'}${txt}`;
      if (!reduced) R.cap.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' });
    }

    // Línea de hechos
    const hx = R.tx(Math.min(t, END));
    R.scFill.setAttribute('x2', hx);
    R.head.setAttribute('cx', hx);
  }

  // Punto del mundo → coordenadas del escenario (para destellos)
  function toStage(t, [x, y]) {
    const [cx, cy, s] = tr(t, CAM);
    return [960 + (x - cx) * s, 540 + (y - cy) * s];
  }
  const FX = [
    [31.8, t => { deck().flash(); deck().burst(...toStage(t, AP), [255, 238, 220], 40); }],
    [34.8, t => { deck().flash(); deck().burst(...toStage(t, CAP), [255, 77, 109], 70); }],
    [37.4, t => deck().burst(...toStage(t, AP), [255, 170, 120], 18)]
  ];

  function tick(now) {
    const dt = Math.min(0.1, (now - st.last) / 1000);
    st.last = now;
    if (st.playing) {
      const prev = st.t;
      st.t = Math.min(END, st.t + dt);
      if (!reduced) FX.forEach(([ft, fn]) => { if (prev < ft && st.t >= ft) fn(st.t); });
      if (st.t >= END) st.playing = false;
    }
    render(st.t);
    st.raf = requestAnimationFrame(tick);
  }

  function seek(slide, t) {
    st.t = clamp(t, 0, END);
    if (st.t < END && !st.playing) st.playing = true;
    render(st.t);
  }
  function toggle() {
    if (st.t >= END) { st.t = 0; st.playing = true; return; }
    st.playing = !st.playing;
  }

  const scene = {
    build,
    enter() {
      st.t = 0; st.beat = -1; st.playing = true;
      st.last = performance.now();
      cancelAnimationFrame(st.raf);
      st.raf = requestAnimationFrame(tick);
      window.Thread?.style({ o: 0 });
    },
    leave() { cancelAnimationFrame(st.raf); st.playing = false; },
    // Teclas propias; devuelve true si las consume
    key(slide, k) {
      if (k === ' ') { toggle(); return true; }
      if (k === 'r' || k === 'R') { seek(slide, 0); return true; }
      if (k === 'ArrowRight') {
        const n = JUMPS.find(j => j > st.t + 0.05);
        if (n == null) return false;
        seek(slide, n); return true;
      }
      if (k === 'ArrowLeft') {
        if (st.t < 0.3) return false;
        const cur = [...JUMPS].reverse().find(j => j <= st.t - 0.6);
        seek(slide, cur ?? 0); return true;
      }
      return false;
    }
  };

  window.Scenes = window.Scenes || {};
  window.Scenes.r6 = scene;
})();
