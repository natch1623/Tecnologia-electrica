/* R6 · escena WebGL de la reconstrucción del Caso 4
   Sala de baterías a escala del caso: 6 × 4 × 3 m (72 m³), dos bastidores de dos
   niveles con las 125 celdas de la cadena. Materiales PBR, instancing para las
   celdas y una capa SVG separada para la información pericial.
   La escena se carga solo al acercarse a R6 (slide del botón o R6 misma). */
(() => {
  const slide = document.getElementById('r6');
  if (!slide) return;

  let started = false;
  const watch = [slide, document.querySelector('[data-goto="r6"]')?.closest('.slide')].filter(Boolean);
  const check = () => { if (!started && watch.some(s => s.classList.contains('is-active'))) { started = true; init(); } };
  watch.forEach(s => new MutationObserver(check).observe(s, { attributes: true, attributeFilter: ['class'] }));
  check();

  async function init() {
  let raf = 0;
  const fallback = () => {
    slide.classList.add('recon-webgl-fallback');
    slide.classList.remove('rc-gl');
    for (const sel of ['.rc-webgl', '.rc-veil', '.rc-hint', '.rc-3d-hud']) slide.querySelector(sel)?.remove();
    window.Recon3D = { isWebGL: false, setTime() {} };
    window.dispatchEvent(new CustomEvent('recon3d-lost'));
  };

  // Copia local de three.js para funcionar sin red. Sin WebGL, R6 usa el SVG 2.5D.
  let THREE;
  try {
    const probe = document.createElement('canvas');
    if (!probe.getContext('webgl') && !probe.getContext('experimental-webgl')) throw new Error('WebGL unavailable');
    THREE = await import('./vendor/three.module.js');
  } catch (error) {
    fallback();
    return;
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const svg = slide.querySelector('svg.rc');
  const canvas = document.createElement('canvas');
  canvas.className = 'rc-webgl';
  canvas.setAttribute('aria-hidden', 'true');
  slide.insertBefore(canvas, svg);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.14;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  // Resolución según el tamaño real en pantalla (el escenario se escala con CSS):
  // en una ventana pequeña no se dibujan 2400 × 1350 px.
  let drawW = 0;
  const fitCanvas = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    const w = Math.round(Math.min(1920 * 1.5, Math.max(640, r.width * Math.min(window.devicePixelRatio || 1, 1.5))));
    if (Math.abs(w - drawW) < 24) return;
    drawW = w;
    renderer.setSize(w, Math.round(w * 9 / 16), false);
  };
  fitCanvas();
  addEventListener('resize', () => { drawW = 0; fitCanvas(); });

  // Si la GPU pierde el contexto (frecuente en gráficos integrados), R6 pasa sola al 2.5D.
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; fallback(); });

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x101722, 9, 20);
  const camera = new THREE.PerspectiveCamera(35, 16 / 9, 0.05, 60);
  camera.position.set(0, 2.0, 7.2);
  const desiredTarget = new THREE.Vector3(0, 1.25, -0.7);
  const userOrbit = { active: false, yaw: 0, pitch: 0, distance: 0 };

  const room = new THREE.Group(), equipment = new THREE.Group(), workers = new THREE.Group(), effects = new THREE.Group();
  scene.add(room, equipment, workers, effects);

  const mat = (color, roughness = 0.5, metalness = 0, opts = {}) => new THREE.MeshStandardMaterial({
    color, roughness, metalness, transparent: !!opts.transparent, opacity: opts.opacity ?? 1,
    emissive: opts.emissive || 0x000000, emissiveIntensity: opts.emissiveIntensity || 0,
    side: opts.side || THREE.FrontSide
  });
  const concrete = mat(0x4a535d, 0.88, 0.05, { side: THREE.DoubleSide });
  const concreteDark = mat(0x252e38, 0.96, 0.02, { side: THREE.DoubleSide });
  const paintedSteel = mat(0x303a45, 0.48, 0.75);
  const galvanized = mat(0x84909a, 0.38, 0.92);
  const darkSteel = mat(0x101720, 0.42, 0.86);
  const rubber = mat(0x11151a, 0.76, 0.08);
  const copper = mat(0xb66a34, 0.3, 0.92);
  const copperHot = mat(0xd26f2f, 0.24, 0.9, { emissive: 0x3a1006, emissiveIntensity: 0.25 });
  const plastic = mat(0x26313a, 0.58, 0.18);
  const ceramic = mat(0x8b9294, 0.34, 0.08);
  // Celdas inundadas: vaso translúcido con el electrolito y las placas a la vista
  const batteryMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.12, metalness: 0.0, transparent: true, opacity: 0.34, depthWrite: false, emissive: 0x16363a, emissiveIntensity: 0.25 });
  const electrolyteMat = new THREE.MeshStandardMaterial({ color: 0x86c9d6, roughness: 0.2, transparent: true, opacity: 0.45, depthWrite: false, emissive: 0x0d3a44, emissiveIntensity: 0.35 });
  const plateMat = mat(0x3a4046, 0.7, 0.4);
  const batteryTopMat = mat(0xffffff, 0.3, 0.5, { emissive: 0x17343a, emissiveIntensity: 0.18 });
  const labelMat = mat(0xe8ecee, 0.8, 0.0);
  const green = mat(0x4c8e63, 0.62, 0.25);
  const cyanGlow = mat(0x0c3c4e, 0.3, 0.1, { emissive: 0x49d8ff, emissiveIntensity: 0.18, transparent: true, opacity: 0.78 });

  const box = (w, h, d, material, parent, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true;
    parent.add(mesh); return mesh;
  };
  const cyl = (radius, height, material, parent, x = 0, y = 0, z = 0, radial = 12) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, radial), material);
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true;
    parent.add(mesh); return mesh;
  };
  const line = (a, b, radius, material, parent = equipment, tubular = 8) => {
    const curve = new THREE.LineCurve3(new THREE.Vector3(...a), new THREE.Vector3(...b));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 8, radius, tubular, false), material);
    mesh.castShadow = true; mesh.receiveShadow = true;
    parent.add(mesh); return mesh;
  };
  const path = (pts, radius, material, parent = equipment) => { for (let i = 1; i < pts.length; i++) line(pts[i - 1], pts[i], radius, material, parent, 6); };
  const between = (mesh, a, b) => {
    const av = new THREE.Vector3(...a), bv = new THREE.Vector3(...b);
    mesh.position.copy(av).add(bv).multiplyScalar(0.5);
    mesh.scale.y = av.distanceTo(bv) / (mesh.userData.baseLength || 1);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bv.clone().sub(av).normalize());
  };
  const polyPoints = (pts, step = 0.05) => {
    const out = [];
    for (let i = 1; i < pts.length; i++) {
      const a = new THREE.Vector3(...pts[i - 1]), b = new THREE.Vector3(...pts[i]);
      const n = Math.max(1, Math.ceil(a.distanceTo(b) / step));
      for (let k = 0; k < n; k++) out.push(a.clone().lerp(b, k / n));
    }
    out.push(new THREE.Vector3(...pts[pts.length - 1]));
    return out;
  };
  const sstep = (a, b, t) => THREE.MathUtils.smoothstep(t, a, b);
  const rand = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  // Texturas de lienzo: resplandor radial suave y rótulos de texto.
  const glowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.32)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const glow = (color, opacity = 1) => new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
  const textSprite = (text, color = '#ece9f7', h = 0.09) => {
    // El lienzo se ajusta al ancho del texto: nada queda recortado
    const font = '600 38px "JetBrains Mono", Consolas, monospace';
    const probe = document.createElement('canvas').getContext('2d'); probe.font = font;
    const c = document.createElement('canvas'); c.width = Math.ceil(probe.measureText(text).width + 28); c.height = 64;
    const x = c.getContext('2d');
    x.font = font; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.lineWidth = 8; x.strokeStyle = 'rgba(7,6,15,0.85)'; x.strokeText(text, c.width / 2, 34);
    x.fillStyle = color; x.fillText(text, c.width / 2, 34);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
    s.scale.set(h * c.width / 64, h, 1);
    return s;
  };

  /* ---------- Sala: 6 × 4 × 3 m ----------
     x ∈ [-3, 3], z ∈ [-2, 2], techo a 3 m. Se omite el muro frontal (corte).
     Puerta con lector de tarjeta en el muro derecho (z 0,9 → 1,8). */
  const RW = 3, RD = 2, RH = 3;
  box(6, 0.1, 4, concreteDark, room, 0, -0.05, 0);
  box(6, 0.06, 4, concrete, room, 0, 0.0, 0);
  box(6, RH, 0.12, concreteDark, room, 0, RH / 2, -RD);
  box(0.12, RH, 4, concreteDark, room, -RW, RH / 2, 0);
  box(0.12, RH, 2.9, concreteDark, room, RW, RH / 2, -0.55);
  box(0.12, RH, 0.2, concreteDark, room, RW, RH / 2, 1.9);
  box(0.12, 0.9, 0.9, concreteDark, room, RW, 2.55, 1.35);
  box(6, 0.08, 4, concreteDark, room, 0, RH + 0.04, 0);
  for (let x = -2.4; x <= 2.4; x += 1.2) box(0.02, 0.012, 3.9, darkSteel, room, x, 0.04, 0);
  // Lector de tarjeta junto a la puerta
  const readerLed = mat(0x0a2a14, 0.4, 0.1, { emissive: 0x3cff7a, emissiveIntensity: 0 });
  const READER = V(RW - 0.08, 1.15, 0.84);
  box(0.04, 0.14, 0.09, plastic, room, READER.x, READER.y, READER.z);
  box(0.01, 0.03, 0.03, readerLed, room, READER.x - 0.02, READER.y + 0.05, READER.z);
  // Bandeja de cables bajo el techo
  box(5.6, 0.04, 0.3, darkSteel, room, 0, 2.62, 0.05);
  // La sala no proyecta sombras (las bandejas rayaban el banco)
  room.traverse(m => { if (m.isMesh) m.castShadow = false; });

  /* ---------- Bastidores A (posterior) y B (frontal), dos niveles cada uno ----------
     Cadena de 125 celdas:
       B inferior  1 → 31   (izq → der)   · cruce a A
       A inferior 32 → 62   (der → izq)   · cable puente 62/63 en el extremo izquierdo de A
       A superior 63 → 94   (izq → der)   · cruce a B
       B superior 95 → 125  (der → izq)
     El lazo C-118 → 63 recorre 56 celdas: B superior 118 → 95 y A superior 94 → 63. */
  const P = 0.15, CW = 0.135, CD = 0.62, CELL_H = 0.5;
  const ZB = 0.05, ZA = -1.55, HALF = 0.4;
  const LO_Y = 0.5, UP_Y = 1.4;
  const TOP_LO = LO_Y + CELL_H / 2, TOP_UP = UP_Y + CELL_H / 2;
  const RAIL_LO = 0.95, RAIL_UP = 1.86;
  const RAIL_B = ZB + HALF;                       // larguero frontal de B (0,45)
  const cellPos = c => {
    if (c <= 31) return V(-2.05 + (c - 1) * P, LO_Y, ZB);
    if (c <= 62) return V(-2.75 + (62 - c) * P, LO_Y, ZA);
    if (c <= 94) return V(-2.75 + (c - 63) * P, UP_Y, ZA);
    return V(2.45 - (c - 95) * P, UP_Y, ZB);
  };
  const sameRow = c => (c >= 1 && c < 31) || (c >= 32 && c < 62) || (c >= 63 && c < 94) || (c >= 95 && c < 125);
  const conn = c => cellPos(c).add(cellPos(c + 1)).multiplyScalar(0.5).add(V(0, CELL_H / 2 + 0.03, 0.2));

  const makeRack = (x0, x1, z) => {
    const g = new THREE.Group(); equipment.add(g);
    for (const x of [x0, x1]) for (const dz of [-HALF, HALF]) box(0.08, 2.0, 0.08, paintedSteel, g, x, 1.0, z + dz);
    for (const y of [LO_Y - CELL_H / 2 - 0.04, UP_Y - CELL_H / 2 - 0.04]) box(x1 - x0 + 0.08, 0.08, HALF * 2, galvanized, g, (x0 + x1) / 2, y, z);
    for (const y of [RAIL_LO, RAIL_UP]) for (const dz of [-HALF, HALF]) box(x1 - x0 + 0.08, 0.08, 0.06, galvanized, g, (x0 + x1) / 2, y, z + dz);
    return g;
  };
  makeRack(-2.15, 2.55, ZB);   // B
  makeRack(-2.85, 2.0, ZA);    // A

  const cells = new THREE.InstancedMesh(new THREE.BoxGeometry(CW, CELL_H, CD), batteryMat, 125);
  cells.renderOrder = 2;
  const liquid = new THREE.InstancedMesh(new THREE.BoxGeometry(CW - 0.024, CELL_H * 0.7, CD - 0.05), electrolyteMat, 125);
  liquid.renderOrder = 1;
  const plates = new THREE.InstancedMesh(new THREE.BoxGeometry(CW - 0.04, CELL_H * 0.56, 0.012), plateMat, 125 * 3);
  const stickers = new THREE.InstancedMesh(new THREE.BoxGeometry(0.07, 0.035, 0.004), labelMat, 125);
  const tops = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 8), batteryTopMat, 125);
  const dummy = new THREE.Object3D();
  // Tapones no originales (violeta = defecto de mantenimiento): el de la 119, sin apagallamas, y otros tres.
  const GENERIC = new Set([119, 101, 70, 12]);
  const WHITE = new THREE.Color(0xc2d0cf), VIOLET3D = new THREE.Color(0xa58bff), GLASS = new THREE.Color(0xb6d6da);
  const capPos = c => cellPos(c).add(V(0.02, CELL_H / 2 + 0.02, 0.2));
  for (let c = 1; c <= 125; c++) {
    const p = cellPos(c), i = c - 1;
    dummy.position.copy(p); dummy.updateMatrix(); cells.setMatrixAt(i, dummy.matrix);
    cells.setColorAt(i, GLASS.clone().offsetHSL(0, 0, (rand(i, 20) - 0.5) * 0.08));
    dummy.position.set(p.x, p.y - CELL_H * 0.14, p.z); dummy.updateMatrix(); liquid.setMatrixAt(i, dummy.matrix);
    [-0.18, 0, 0.18].forEach((dz, k) => { dummy.position.set(p.x, p.y - 0.06, p.z + dz); dummy.updateMatrix(); plates.setMatrixAt(i * 3 + k, dummy.matrix); });
    dummy.position.set(p.x, p.y + 0.17, p.z + CD / 2 + 0.003); dummy.updateMatrix(); stickers.setMatrixAt(i, dummy.matrix);
    dummy.position.copy(capPos(c)); dummy.updateMatrix(); tops.setMatrixAt(i, dummy.matrix);
    tops.setColorAt(i, GENERIC.has(c) ? VIOLET3D : WHITE);
  }
  equipment.add(plates, liquid, cells, stickers, tops);

  const X118 = cellPos(118).x, X119 = cellPos(119).x;
  const CAP119 = capPos(119);
  const CONTACT = V(X118 + 0.02, RAIL_UP - 0.05, RAIL_B - 0.03);

  // Conexiones de cobre finas (≈ 5 cm) entre celdas de cada fila
  for (let c = 1; c < 125; c++) if (sameRow(c)) { const p = conn(c); box(P - 0.02, 0.012, 0.05, copper, equipment, p.x, p.y - 0.015, p.z); }
  // Cruces entre bastidores (31/32 abajo y 94/95 arriba), por el extremo derecho
  path([[2.45, TOP_LO + 0.04, ZB + 0.2], [2.68, TOP_LO + 0.04, ZB + 0.2], [2.68, TOP_LO + 0.04, ZA + 0.2], [1.75, TOP_LO + 0.04, ZA + 0.2]], 0.022, rubber);
  path([[2.45, TOP_UP + 0.04, ZB + 0.2], [2.72, TOP_UP + 0.04, ZB + 0.2], [2.72, TOP_UP + 0.04, ZA + 0.2], [1.9, TOP_UP + 0.04, ZA + 0.2]], 0.022, rubber);
  // Borne + de la 118 y conexión C-118/119, la que se reaprieta
  cyl(0.022, 0.06, copperHot, equipment, X118 + 0.02, TOP_UP + 0.03, ZB + 0.2, 10);
  box(P + 0.02, 0.02, 0.06, copperHot, equipment, (X118 + X119) / 2 + 0.02, TOP_UP + 0.035, ZB + 0.2);

  // Cable puente 62/63 por el extremo izquierdo de A. El aislamiento está gastado
  // contra el poste frontal izquierdo: cobre desnudo en contacto con el bastidor.
  const BX = -2.93;
  path([[-2.75, TOP_LO + 0.04, ZA + 0.2], [BX, TOP_LO + 0.04, ZA + 0.2], [BX, TOP_UP + 0.04, ZA + 0.2], [-2.75, TOP_UP + 0.04, ZA + 0.2]], 0.024, rubber);
  const FAULT = V(BX + 0.02, 1.08, ZA + 0.32);
  const bare = mat(0xd88a4a, 0.25, 0.95, { emissive: 0x5a1a06, emissiveIntensity: 0.6 });
  line([BX, 0.98, ZA + 0.2], [BX, 1.18, ZA + 0.2], 0.026, bare, equipment, 8);
  for (const y of [0.98, 1.18]) cyl(0.03, 0.012, mat(0x0d0f12, 0.9, 0), equipment, BX, y, ZA + 0.2, 10);
  const faultMat = new THREE.MeshBasicMaterial({ color: 0xff3048, transparent: true, opacity: 0.6, toneMapped: false });
  const faultDot = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), faultMat);
  faultDot.position.copy(FAULT); effects.add(faultDot);
  // Puesta a tierra: los dos bastidores unidos por un conductor verde/amarillo
  path([[-2.85, 0.05, ZA + HALF], [-2.15, 0.05, ZB + HALF]], 0.016, green);
  path([[-2.85, 0.05, ZA + HALF], [-2.95, 0.05, -0.5], [-2.95, 0.35, -0.5]], 0.016, green);
  box(0.04, 0.2, 0.45, green, equipment, -2.95, 0.4, -0.5);

  // Salida del banco (celdas 1 y 125, extremo izquierdo de B) hacia el interruptor
  // de 400 A, a 6 m fuera de la sala: por la bandeja y a través del muro izquierdo.
  const outMat = mat(0x11151a, 0.6, 0.1, { emissive: 0x49d8ff, emissiveIntensity: 0 });
  path([[-2.05, TOP_UP + 0.04, ZB + 0.2], [-2.3, TOP_UP + 0.04, ZB + 0.2], [-2.3, 2.6, ZB + 0.05], [-3.0, 2.6, ZB + 0.05], [-4.2, 2.6, ZB + 0.05]], 0.028, outMat);
  path([[-2.05, TOP_LO + 0.04, ZB + 0.2], [-2.32, TOP_LO + 0.04, ZB + 0.2], [-2.32, 2.6, ZB - 0.05], [-4.2, 2.6, ZB - 0.05]], 0.028, outMat);
  const breakerTag = textSprite('→ INT. CC 400 A · 6 m', '#8fe3ff', 0.1);
  breakerTag.position.set(-3.75, 2.82, ZB); effects.add(breakerTag);

  // Cubiertas de conectores (violeta = mantenimiento): T1 retira las del nivel
  // superior "para agilizar"; las del inferior quedan en su sitio.
  const coverMat = mat(0xa58bff, 0.5, 0.1, { emissive: 0x3a2a7a, emissiveIntensity: 0.6 });
  const coverGeo = new THREE.BoxGeometry(P, 0.035, 0.11);
  const lowConns = [], upConns = [];
  for (let c = 1; c < 125; c++) if (sameRow(c)) (c <= 62 ? lowConns : upConns).push(c);
  const lowCovers = new THREE.InstancedMesh(coverGeo, coverMat, lowConns.length);
  lowConns.forEach((c, i) => { dummy.position.copy(conn(c)).add(V(0, 0.03, 0)); dummy.updateMatrix(); lowCovers.setMatrixAt(i, dummy.matrix); });
  equipment.add(lowCovers);
  // Orden de retiro: B superior de derecha a izquierda, luego A superior de izquierda a derecha
  // 62 conexiones del nivel superior: 30 en B, 31 en A y el cruce 94/95 en el extremo derecho.
  // Los tiempos de retiro se sincronizan con el paso de T1 (ver recorridos).
  const upAnchors = [V(2.6, TOP_UP + 0.07, ZB + 0.2)].concat(upConns.filter(c => c >= 95).map(c => conn(c).add(V(0, 0.03, 0))))
    .concat(upConns.filter(c => c < 95).map(c => conn(c).add(V(0, 0.03, 0))));
  const upCovers = new THREE.InstancedMesh(coverGeo, coverMat, upAnchors.length);
  upCovers.castShadow = true; effects.add(upCovers);
  const coverPlan = upAnchors.map((a, i) => {
    const onB = a.z > ZA + 0.5;
    return { a, onB, t0: 99, b: V(a.x + (rand(i, 1) - 0.5) * 0.4, 0.05, onB ? 0.7 + rand(i, 2) * 0.35 : -0.95 + rand(i, 2) * 0.25) };
  });

  // Tramo de ida encendido (63 → 118) cuando se cierra el lazo
  const busHotMat = new THREE.MeshBasicMaterial({ color: 0xff3048, transparent: true, opacity: 0, toneMapped: false });
  path([[X118, TOP_UP + 0.05, ZB + 0.2], [2.45, TOP_UP + 0.05, ZB + 0.2]], 0.016, busHotMat, effects);
  path([[1.9, TOP_UP + 0.05, ZA + 0.2], [-2.75, TOP_UP + 0.05, ZA + 0.2]], 0.016, busHotMat, effects);

  /* ---------- Lazo de falla: ida por 56 celdas, vuelta por los bastidores ---------- */
  const IDA = polyPoints([
    [X118, TOP_UP + 0.07, ZB + 0.2], [2.45, TOP_UP + 0.07, ZB + 0.2], [2.72, TOP_UP + 0.07, ZB + 0.2],
    [2.72, TOP_UP + 0.07, ZA + 0.2], [1.9, TOP_UP + 0.07, ZA + 0.2], [-2.75, TOP_UP + 0.07, ZA + 0.2], [BX, TOP_UP + 0.07, ZA + 0.2]
  ]);
  const VUELTA = polyPoints([
    [BX, TOP_UP + 0.07, ZA + 0.2], [BX, FAULT.y, ZA + 0.2], [FAULT.x, FAULT.y, FAULT.z], [-2.85, FAULT.y, ZA + HALF + 0.04],
    [-2.85, 0.08, ZA + HALF + 0.04], [-2.15, 0.08, ZB + HALF + 0.04], [-2.15, RAIL_UP + 0.07, ZB + HALF + 0.05],
    [X118, RAIL_UP + 0.07, ZB + HALF + 0.05], [CONTACT.x, CONTACT.y, CONTACT.z]
  ]);
  const tubeOf = (pts, color, r, opacity = 0.95) => {
    const m = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.02), pts.length * 2, r, 6, false),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity, toneMapped: false })
    );
    m.userData.idx = m.geometry.index.count; m.geometry.setDrawRange(0, 0); effects.add(m); return m;
  };
  const idaTube = tubeOf(IDA, 0xff3048, 0.02);         // carmesí: corriente por 56 celdas
  const vueltaTube = tubeOf(VUELTA, 0xff3048, 0.013, 0.5); // carmesí tenue: puente → bastidor A → tierra → bastidor B → matraca
  const LOOP = IDA.concat(VUELTA);
  const pulses = Array.from({ length: 3 }, () => { const s = glow(0xffffff, 0.95); s.scale.setScalar(0.16); effects.add(s); return s; });

  // Números de celda, como en la elevación 2D
  [
    ['1', cellPos(1), 'B'], ['31', cellPos(31), 'B'], ['125', cellPos(125), 'B'], ['95', cellPos(95), 'B'],
    ['119·118', V((X118 + X119) / 2, UP_Y, ZB), 'B', '#ff9879'],
    ['A · 63', cellPos(63), 'A'], ['A · 94', cellPos(94), 'A'], ['62·63', V(BX, 1.0, ZA), 'P']
  ].forEach(([txt, p, where, color]) => {
    const s = textSprite(txt, color);
    if (where === 'A') s.position.set(p.x, 2.12, ZA + HALF);
    else if (where === 'P') s.position.set(BX - 0.02, 1.55, ZA + HALF + 0.1);
    else s.position.set(p.x, p.y - 0.36, RAIL_B + 0.06);
    effects.add(s);
  });

  /* ---------- Monitor de baterías (BMS) en el muro posterior ---------- */
  const BMS = V(1.0, 2.42, -RD + 0.08);
  const bmsCanvas = document.createElement('canvas'); bmsCanvas.width = 512; bmsCanvas.height = 256;
  const bmsTex = new THREE.CanvasTexture(bmsCanvas); bmsTex.colorSpace = THREE.SRGBColorSpace;
  let bmsState = -1;
  const drawBMS = failed => {
    const x = bmsCanvas.getContext('2d');
    x.fillStyle = '#07101a'; x.fillRect(0, 0, 512, 256);
    x.font = '600 30px ui-monospace, monospace'; x.textBaseline = 'top';
    x.fillStyle = '#8fe3ff'; x.fillText('BMS · UPS-2', 22, 18);
    x.fillStyle = '#ff4d6d'; x.fillText(failed ? 'F. TIERRA: NO ANUNCIADA' : 'F. TIERRA: INHIBIDA', 22, 70);
    x.fillStyle = '#ffd27a'; x.fillText('H2 0,4 % · SENSOR S/CAL.', 22, 118);
    x.fillStyle = failed ? '#ff4d6d' : '#c9b8ff'; x.fillText(failed ? '02:41 FALLA DE BATERÍA' : 'EXTRACTOR: DISPARO TÉRM.', 22, 166);
    bmsTex.needsUpdate = true;
  };
  box(0.98, 0.54, 0.05, paintedSteel, equipment, BMS.x, BMS.y, -RD + 0.04);
  const bmsScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.45), new THREE.MeshBasicMaterial({ map: bmsTex, toneMapped: false }));
  bmsScreen.position.copy(BMS); equipment.add(bmsScreen);
  const bmsLedMat = mat(0x3a1006, 0.3, 0.1, { emissive: 0xff3048, emissiveIntensity: 0.15 });
  box(0.05, 0.05, 0.02, bmsLedMat, equipment, BMS.x + 0.42, BMS.y + 0.2, -RD + 0.09);

  // Extractor de techo (detenido, testigo rojo) y detector de H₂ en cielo raso (sin calibrar)
  const FAN = V(1.3, RH - 0.06, 0.2), DET = V(-0.5, RH - 0.05, 0.6);
  box(0.7, 0.06, 0.7, galvanized, equipment, FAN.x, FAN.y, FAN.z);
  cyl(0.28, 0.04, darkSteel, equipment, FAN.x, FAN.y - 0.04, FAN.z, 24);
  for (let i = 0; i < 5; i++) { const b = box(0.05, 0.012, 0.4, cyanGlow, equipment, FAN.x, FAN.y - 0.07, FAN.z); b.rotation.y = i * Math.PI * 0.4; }
  const fanLedMat = mat(0x3a1006, 0.3, 0.1, { emissive: 0xff3048, emissiveIntensity: 1 });
  box(0.06, 0.03, 0.06, fanLedMat, equipment, FAN.x + 0.3, FAN.y - 0.04, FAN.z + 0.3);
  cyl(0.08, 0.05, plastic, equipment, DET.x, DET.y - 0.02, DET.z, 14);
  cyl(0.05, 0.02, cyanGlow, equipment, DET.x, DET.y - 0.055, DET.z, 14);
  box(0.16, 0.005, 0.06, mat(0xffd27a, 0.6, 0.05, { emissive: 0x5a4400, emissiveIntensity: 0.6 }), equipment, DET.x, DET.y - 0.03, DET.z + 0.12);

  // H₂: brillo tenue en el tapón de la 119 y acumulación bajo el techo (sin extracción)
  const capGlow = glow(0x9fe8ff, 0.4); capGlow.position.copy(CAP119).add(V(0, 0.05, 0)); effects.add(capGlow);
  const hazeMat = new THREE.MeshBasicMaterial({ map: glowTex, color: 0x8fe3ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  [2.92, 2.78, 2.62].forEach((y, i) => {
    const h = new THREE.Mesh(new THREE.PlaneGeometry(7, 4.6), hazeMat);
    h.rotation.x = -Math.PI / 2; h.position.set(0.3 - i * 0.4, y, 0); effects.add(h);
  });

  // Lavaojos portátil tipo botella, colgado en el muro derecho: vacío y vencido
  const BOTTLE = V(RW - 0.09, 1.45, 0.58);
  box(0.02, 0.42, 0.22, mat(0xd8dde0, 0.6, 0.1), equipment, RW - 0.06, BOTTLE.y + 0.03, BOTTLE.z);
  cyl(0.055, 0.24, mat(0xcfe8f0, 0.12, 0.02, { transparent: true, opacity: 0.32, side: THREE.DoubleSide }), equipment, BOTTLE.x, BOTTLE.y, BOTTLE.z, 16);
  cyl(0.026, 0.045, mat(0x2f9d6a, 0.5, 0.1), equipment, BOTTLE.x, BOTTLE.y + 0.14, BOTTLE.z, 12);
  // Ruta de 15 m al lavamanos: sale por la puerta
  const routePts = polyPoints([[-0.5, 0.04, 1.55], [1.6, 0.04, 1.45], [RW, 0.04, 1.35], [4.4, 0.04, 1.35]], 0.3);
  const routeMat = new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0, toneMapped: false, fog: false });
  const route = new THREE.InstancedMesh(new THREE.BoxGeometry(0.08, 0.01, 0.18), routeMat, routePts.length);
  routePts.forEach((pt, i) => {
    const nx = routePts[Math.min(i + 1, routePts.length - 1)], pv = routePts[Math.max(i - 1, 0)];
    dummy.position.copy(pt); dummy.rotation.set(0, Math.atan2(nx.x - pv.x, nx.z - pv.z), 0);
    dummy.updateMatrix(); route.setMatrixAt(i, dummy.matrix);
  });
  dummy.rotation.set(0, 0, 0);
  route.count = 0; effects.add(route);

  /* ---------- Personas: como estaban vestidas según el caso ----------
     T1: camisa de algodón clara, gafas, guantes de nitrilo, anillo y reloj.
     T2: ropa de trabajo, sin delantal ni careta. S1: supervisor de turno.
     Sin casco, sin chaleco y sin EPP de arco. El acento de la manga los distingue. */
  const person = (name, opts) => {
    const g = new THREE.Group(); g.rotation.order = 'YXZ';
    const upper = new THREE.Group(); g.add(upper);     // tronco y cabeza: bajan al agacharse
    const mats = [];
    const own = m => { mats.push(m); return m; };
    const shirt = own(mat(opts.shirt, 0.9, 0.02)), pants = own(mat(0x2e3542, 0.86, 0.04));
    const skin = own(mat(0x9a6c52, 0.8, 0.02)), hair = own(mat(0x1d1714, 0.9, 0.02));
    const shoe = own(mat(0x15181d, 0.55, 0.15)), dark = own(mat(0x16120f, 0.6, 0.05));
    const handMat = opts.gloves ? own(mat(opts.gloves, 0.55, 0.05)) : skin;
    const add = (geo, material, x = 0, y = 0, z = 0, parent = g) => { const m = new THREE.Mesh(geo, material); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
    add(new THREE.CapsuleGeometry(0.17, 0.4, 5, 12), shirt, 0, 1.17, 0, upper).scale.set(1.18, 1, 0.7);
    add(new THREE.CylinderGeometry(0.075, 0.09, 0.05, 14), shirt, 0, 1.53, 0, upper);
    add(new THREE.BoxGeometry(0.33, 0.16, 0.2), pants, 0, 0.84, 0, upper);
    add(new THREE.CylinderGeometry(0.045, 0.05, 0.12, 10), skin, 0, 1.6, 0, upper);
    add(new THREE.SphereGeometry(0.11, 18, 14), skin, 0, 1.73, 0, upper).scale.set(0.9, 1.12, 1.0);
    add(new THREE.SphereGeometry(0.116, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.52), hair, 0, 1.76, -0.012, upper).scale.set(0.95, 0.92, 1.02);
    add(new THREE.SphereGeometry(0.018, 8, 6), skin, 0, 1.715, 0.108, upper);
    for (const sx of [-1, 1]) add(new THREE.SphereGeometry(0.022, 8, 6), skin, sx * 0.1, 1.73, 0, upper);
    if (opts.glasses) add(new THREE.BoxGeometry(0.19, 0.035, 0.02), own(mat(0x1d2a30, 0.2, 0.3, { transparent: true, opacity: 0.85 })), 0, 1.745, 0.1, upper);
    else for (const sx of [-1, 1]) add(new THREE.SphereGeometry(0.012, 6, 6), dark, sx * 0.038, 1.748, 0.098, upper);
    if (opts.card) add(new THREE.BoxGeometry(0.06, 0.09, 0.005), own(mat(0xece9f7, 0.5, 0.1)), 0.09, 1.35, 0.13, upper);
    const armGeo = new THREE.CapsuleGeometry(0.048, 0.22, 4, 8), legGeo = new THREE.CapsuleGeometry(0.06, 0.32, 4, 8);
    const limb = (geo, material, base) => { const m = add(geo, material); m.userData.baseLength = base; return m; };
    const leftArm = limb(armGeo, shirt, 0.316), rightArm = limb(armGeo, shirt, 0.316);
    const leftFore = limb(armGeo, shirt, 0.316), rightFore = limb(armGeo, shirt, 0.316);
    // Antebrazo derecho: quemadura (T1) o salpicadura de electrolito (T2)
    const armMat = own(mat(opts.armColor || 0xd8a040, 0.6, 0.05, { emissive: opts.armColor ? 0x2a1e00 : 0xff3048, emissiveIntensity: 0.4, transparent: true, opacity: 0 }));
    add(new THREE.CylinderGeometry(0.052, 0.052, 0.12, 12), armMat, 0, 0.04, 0, rightFore);
    const leftLeg = limb(legGeo, pants, 0.44), rightLeg = limb(legGeo, pants, 0.44);
    const leftCalf = limb(legGeo, pants, 0.44), rightCalf = limb(legGeo, pants, 0.44);
    const handGeo = new THREE.SphereGeometry(0.045, 10, 8);
    const handL = add(handGeo, handMat), handR = add(handGeo, handMat);
    handL.scale.set(0.85, 1.15, 0.7); handR.scale.set(0.85, 1.15, 0.7);
    const foot = () => { const f = new THREE.Group(); add(new THREE.BoxGeometry(0.1, 0.05, 0.26), shoe, 0, -0.015, 0.03, f); add(new THREE.SphereGeometry(0.05, 10, 8), shoe, 0, 0.005, 0.13, f).scale.set(1, 0.6, 1); g.add(f); return f; };
    const bootL = foot(), bootR = foot();
    if (opts.jewelry) {
      const gold = own(mat(0xe8c77a, 0.25, 0.9, { emissive: 0x8a6a1a, emissiveIntensity: 0.9 }));
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.008, 6, 14), gold); ring.position.set(0, -0.02, 0.03); handR.add(ring);
      const watch = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.03, 0.045), gold); watch.position.set(0, 0.05, 0); handL.add(watch);
    }
    const burnMat = own(mat(0xd8a040, 0.5, 0.05, { emissive: 0xff3048, emissiveIntensity: 0.45, transparent: true, opacity: 0 }));
    const faceBurn = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), burnMat);
    faceBurn.scale.set(1.15, 0.9, 0.35); faceBurn.position.set(-0.03, 1.71, 0.1); upper.add(faceBurn);
    handR.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), burnMat));
    const stainMat = own(mat(0xb08a2a, 0.9, 0.0, { transparent: true, opacity: 0 }));
    const stain = new THREE.Mesh(new THREE.CircleGeometry(0.09, 14), stainMat); stain.position.set(-0.06, 1.3, 0.125); upper.add(stain);
    g.userData = { name, upper, parts: { leftArm, rightArm, leftFore, rightFore, leftLeg, rightLeg, leftCalf, rightCalf, handL, handR, bootL, bootR }, mats, burnMat, stainMat, armMat };
    return g;
  };
  const t1 = person('T1', { shirt: 0xd3c9b4, gloves: 0x5a86d8, glasses: true, jewelry: true });
  const t2 = person('T2', { shirt: 0x3f5566, armColor: 0xc9a23a });
  const s1 = person('S1', { shirt: 0x6f7682, card: true });
  workers.add(t1, t2, s1);

  // Herramientas: matraca de acero sin aislar, micro-óhmetro, hidrómetro y hoja de registro
  const steel = mat(0xc9d0da, 0.3, 0.95);
  const wrench = new THREE.Group(); effects.add(wrench);
  cyl(0.032, 0.045, steel, wrench, 0, 0, 0, 14);
  cyl(0.018, 0.07, steel, wrench, 0, -0.05, 0, 10);
  const wrHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 1, 8), steel);
  wrHandle.userData.baseLength = 1; wrHandle.castShadow = true; effects.add(wrHandle);
  const meter = new THREE.Group(); effects.add(meter);
  box(0.09, 0.13, 0.04, mat(0xd8a83d, 0.5, 0.1), meter);
  box(0.07, 0.05, 0.005, mat(0x0c1a20, 0.3, 0.1, { emissive: 0x49d8ff, emissiveIntensity: 0.5 }), meter, 0, 0.025, 0.022);
  const hydro = new THREE.Group();
  // Hidrómetro de bulbo: tubo de vidrio con electrolito aspirado y pera de caucho
  cyl(0.022, 0.34, mat(0xd8f2f8, 0.1, 0.05, { transparent: true, opacity: 0.85, emissive: 0x49d8ff, emissiveIntensity: 0.35 }), hydro, 0, 0.15, 0, 12);
  cyl(0.014, 0.16, mat(0x86c9d6, 0.2, 0.0, { emissive: 0x0d3a44, emissiveIntensity: 0.6 }), hydro, 0, 0.06, 0, 10);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), mat(0x1a1d22, 0.7, 0.05)); bulb.position.y = 0.34; bulb.scale.y = 1.3; hydro.add(bulb);
  effects.add(hydro);
  const sheet = box(0.16, 0.22, 0.01, mat(0xece9f7, 0.7, 0.0), effects);

  // Mediciones: +20 % sobre la línea base en C-40/41, C-77/78 y C-118/119
  const READS = [
    { at: 19.1, c: 77, text: 'C-77/78 · +20 %' },
    { at: 20.6, c: 40, text: 'C-40/41 · +20 %' },
    { at: 27.0, c: 118, text: 'C-118/119 · +20 %' }
  ].map(r => ({ ...r, p: conn(r.c) }));
  READS.forEach(r => {
    r.ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.008, 8, 28), new THREE.MeshBasicMaterial({ color: 0xff4d6d, transparent: true, opacity: 0, toneMapped: false }));
    r.ring.rotation.x = Math.PI / 2; r.ring.position.copy(r.p); effects.add(r.ring);
  });

  /* ---------- Evento: arco, detonación de la 119 y electrolito ---------- */
  const arcCore = glow(0xffffff); arcCore.scale.setScalar(0.09);
  const arcHalo = glow(0xff8a50, 0.7);
  arcCore.position.copy(CONTACT); arcHalo.position.copy(CONTACT); effects.add(arcCore, arcHalo);
  const arcStrands = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xfff4e0, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending }));
  arcStrands.geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(8 * 6), 3));
  effects.add(arcStrands);
  const contactLight = new THREE.PointLight(0xffb070, 0, 3.5, 2); contactLight.position.copy(CONTACT).add(V(0, 0, 0.25)); effects.add(contactLight);

  // Con "reducir movimiento" el destello es moderado y no hay sacudida ni parpadeo
  const BLAST = reduced ? 3 : 9;
  const blastLight = new THREE.PointLight(0xffffff, 0, 6, 2); blastLight.position.copy(CAP119).add(V(0, 0.15, 0.4)); effects.add(blastLight);
  const fireCore = glow(0xffffff, reduced ? 0.6 : 1), fireShell = glow(0xff6a2a, 0.9);
  fireCore.position.copy(CAP119).add(V(0, 0.12, 0.1)); fireShell.position.copy(fireCore.position);
  for (const f of [fireCore, fireShell]) { f.material.depthTest = false; f.renderOrder = 10; }
  effects.add(fireCore, fireShell);
  const shellA = new THREE.Color(0xffa040), shellB = new THREE.Color(0xff2a40);

  // En cámara lenta (34,8 → 37,4 s) la física corre a 0,3×; después, a tiempo real
  const slowT = q => Math.min(q, 2.6) * 0.3 + Math.max(0, q - 2.6);
  const landTime = (o, v, g = 9.8, floor = 0.04) => (v.y + Math.sqrt(v.y * v.y + 2 * g * Math.max(0, o.y - floor))) / g;
  const ballistic = (out, o, v, q, g = 9.8, floor = 0.04) => {
    const k = Math.min(q, landTime(o, v, g, floor));
    out.set(o.x + v.x * k, o.y + v.y * k - 0.5 * g * k * k, o.z + v.z * k);
    if (out.y < floor) out.y = floor;
    return out;
  };
  const SPARKS = 60;
  const sparkV = Array.from({ length: SPARKS }, (_, i) => {
    const a = rand(i, 1) * Math.PI * 2, up = 0.4 + rand(i, 2) * 0.9, sp = 1.0 + rand(i, 3) * 1.8;
    return V(Math.cos(a) * sp * 0.55, up * sp, Math.abs(Math.sin(a)) * sp * 0.6 + 0.3);
  });
  const sparks = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0xffd9a0, size: 0.03, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  sparks.geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(SPARKS * 3), 3));
  effects.add(sparks);
  // Electrolito: 8 gotas alcanzan el rostro de T1; el resto cae y forma un charco
  const DROPS = 30, FACE_HITS = 8;
  const dropV = Array.from({ length: DROPS }, (_, i) => V((rand(i, 4) - 0.35) * 0.9, 0.4 + rand(i, 5) * 1.1, 0.7 + rand(i, 6) * 1.2));
  const drops = new THREE.InstancedMesh(new THREE.SphereGeometry(0.02, 8, 6), mat(0xffd27a, 0.25, 0.05, { emissive: 0x6a4a00, emissiveIntensity: 0.9 }), DROPS);
  effects.add(drops);
  const puddleMat = new THREE.MeshStandardMaterial({ color: 0xc9a23a, roughness: 0.15, metalness: 0.1, emissive: 0x3a2a00, emissiveIntensity: 0.6, transparent: true, opacity: 0 });
  const puddle = new THREE.Mesh(new THREE.CircleGeometry(0.34, 28), puddleMat);
  puddle.rotation.x = -Math.PI / 2; puddle.position.set(X119 + 0.25, 0.04, 0.85); puddle.scale.set(1.3, 0.8, 1); effects.add(puddle);
  const lidMat = mat(0xd4dcda, 0.4, 0.2);
  const lidPieces = Array.from({ length: 4 }, (_, i) => {
    const m = box(0.06, 0.014, 0.14, lidMat, effects);
    m.userData.v = V((i - 1.5) * 0.4, 1.0 + rand(i, 7) * 0.7, 0.4 + rand(i, 8) * 0.6);
    m.userData.r = V(rand(i, 9) * 9, rand(i, 10) * 7, rand(i, 11) * 9);
    m.visible = false; return m;
  });
  const smokeMat = mat(0x5d6670, 0.98, 0, { transparent: true, opacity: 0.18 });
  const smoke = Array.from({ length: 9 }, (_, i) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.08 + (i % 3) * 0.035, 8, 6), smokeMat);
    puff.userData.offset = V((i % 3 - 1) * 0.08, (i % 4) * 0.1, (i % 2 ? 0.05 : -0.05));
    puff.userData.phase = i * 0.42; puff.visible = false; effects.add(puff); return puff;
  });

  /* ---------- Iluminación: noche fría que vira a carmesí en el accidente ---------- */
  const COLD_FOG = new THREE.Color(0x101722), RED_FOG = new THREE.Color(0x240a12);
  const HEMI_I = 1.0, KEY_I = 1.5, LAMP_I = 2.6;
  const hemi = new THREE.HemisphereLight(0xb4cfda, 0x242b34, HEMI_I); scene.add(hemi);
  const HEMI_COLD = new THREE.Color(0xb4cfda), HEMI_RED = new THREE.Color(0x8a3442);
  const key = new THREE.DirectionalLight(0xe3f1f4, KEY_I); key.position.set(-1.5, 7, 6); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 4;
  key.shadow.camera.left = -4; key.shadow.camera.right = 4; key.shadow.camera.top = 4; key.shadow.camera.bottom = -2; scene.add(key);
  const KEY_COLD = new THREE.Color(0xe3f1f4), KEY_RED = new THREE.Color(0xff8a96);
  // Dos luminarias fluorescentes en el techo: la luz de la sala tiene una fuente visible
  const lampMat = mat(0xe8f6ff, 0.4, 0.0, { emissive: 0xdff4ff, emissiveIntensity: 1.6 });
  const lamps = [-1.3, 1.3].map(x => {
    box(1.2, 0.05, 0.16, darkSteel, room, x, RH - 0.03, 0.9).castShadow = false;
    box(1.12, 0.02, 0.1, lampMat, room, x, RH - 0.065, 0.9).castShadow = false;
    const l = new THREE.PointLight(0xdff4ff, LAMP_I, 6.5, 2); l.position.set(x, RH - 0.15, 0.9); scene.add(l); return l;
  });

  /* ---------- Fronteras de aproximación alrededor de C-118 ----------
     Frontera de arco 1,8 m (Tabla 130.7(C)(15)(b), 100–250 V, 7–15 kA) y
     frontera limitada de choque 1,0 m (Tabla 130.4(E)(b)), en el piso. */
  const zoneMats = [];
  const floorRing = (r0, r1, color, base) => {
    const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, toneMapped: false, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.RingGeometry(r0, r1, 120), m);
    ring.rotation.x = -Math.PI / 2; ring.position.set(CONTACT.x, 0.035, CONTACT.z); effects.add(ring);
    zoneMats.push([m, base]); return ring;
  };
  floorRing(0, 1.8, 0xff3048, 0.08);
  floorRing(1.76, 1.8, 0xff3048, 0.95);
  floorRing(0.98, 1.0, 0xece9f7, 0.8);
  const zoneTags = [['FRONTERA DE ARCO · 1,8 m', '#ff6d7e', 1.8], ['LIMITADA DE CHOQUE · 1,0 m', '#ece9f7', 1.0]].map(([txt, col, r]) => {
    const s = textSprite(txt, col, 0.08); s.material.opacity = 0;
    s.position.set(CONTACT.x + r * 0.71 + 0.55, 0.09, CONTACT.z + r * 0.71); effects.add(s); return s;
  });

  /* ---------- Evidencias numeradas del peritaje (cadena de custodia) ----------
     1 CCTV · 2 registros del BMS · 3 matraca · 4 larguero y borne + de la 118 ·
     5 cable puente · 6 tapón y fragmentos de la 119 · 7 botella del lavaojos */
  const cctv = new THREE.Group(); equipment.add(cctv);
  box(0.16, 0.1, 0.24, mat(0xd8dde0, 0.6, 0.2), cctv, 0, 0, 0);
  cyl(0.035, 0.04, darkSteel, cctv, 0, 0, 0.13, 12).rotation.x = Math.PI / 2;
  cctv.position.set(-2.8, 2.82, 1.85); cctv.rotation.set(-0.35, -2.6, 0);
  const tentMat = mat(0xf2f4f6, 0.6, 0.0);
  const evidence = [];
  const tag = (n, x, y, z, tent = true) => {
    const g = new THREE.Group(); g.position.set(x, y, z); g.visible = false; effects.add(g);
    if (tent) { const m = cyl(0.07, 0.12, tentMat, g, 0, 0.035, 0, 3); m.rotation.z = Math.PI / 2; }
    const s = textSprite(String(n), '#ece9f7', 0.1); s.position.set(0, tent ? 0.17 : 0, 0); g.add(s);
    evidence.push(g); return g;
  };
  const dangerLight = new THREE.PointLight(0xff2a40, 0, 7, 1.6); dangerLight.position.set(X118 + 1.0, 2.3, 2.0); scene.add(dangerLight);
  const veil = document.createElement('div'); veil.className = 'rc-veil'; veil.setAttribute('aria-hidden', 'true'); canvas.after(veil);
  // Pista de interacción: aparece unos segundos y desaparece al primer arrastre
  const hint = document.createElement('p'); hint.className = 'rc-hint'; hint.textContent = 'ARRASTRA PARA GIRAR · AL SOLTAR VUELVE AL PLANO';
  veil.after(hint);
  let hintShown = 0;

  /* ---------- Recorridos [t, x, z] a velocidad humana (≤ 1,9 m/s caminando) ---------- */
  const X118W = X118 - 0.3, ZFRONT = RAIL_B + 0.47, ZAISLE = -0.75;
  const STAND = c => (cellPos(c).x + cellPos(c + 1).x) / 2 - 0.25;
  const T1P = [
    [0, 3.9, 1.35], [5.6, 3.5, 1.35], [7.0, 2.1, 1.3], [8.6, 1.15, 1.3], [13.0, 1.15, 1.3],
    [14.0, 2.35, ZFRONT], [16.4, -2.05, ZFRONT],                                   // cubiertas de B, der → izq
    [16.9, -2.55, 0.9], [17.6, -2.55, ZAISLE],                                     // entra al pasillo por la izquierda
    [18.8, STAND(77), ZAISLE], [19.9, STAND(77), ZAISLE],                          // cubiertas de A y C-77/78
    [20.4, STAND(40), ZAISLE], [21.3, STAND(40), ZAISLE],                          // C-40/41 (en cuclillas)
    [22.1, 1.85, ZAISLE], [22.4, 1.85, ZAISLE],                                    // termina las cubiertas de A
    [25.0, -2.55, ZAISLE], [25.9, -2.55, 0.9], [26.6, X118W, ZFRONT],              // vuelve al frente
    [34.9, X118W, ZFRONT], [35.6, X118W, ZFRONT + 0.35], [38.2, X118W, ZFRONT + 0.35],
    [39.6, -0.4, 1.6], [42.4, -0.4, 1.6], [44.4, 1.6, 1.5], [46.6, RW - 0.1, 1.35], [48, 4.3, 1.35]
  ];
  const T2P = [
    [0, 3.9, 1.6], [6.0, 3.5, 1.6], [7.4, 2.4, 1.6], [8.6, 1.85, 1.3], [13.0, 1.85, 1.3],
    [13.8, 2.6, 1.65], [23.0, 2.6, 1.65], [24.0, cellPos(28).x - 0.25, ZFRONT - 0.02], [27.5, cellPos(28).x - 0.25, ZFRONT - 0.02],
    [29.0, 2.65, 1.85], [39.4, 2.65, 1.85], [40.4, 2.5, 0.85], [42.8, 2.5, 0.85],
    [44.4, 0.1, 1.5], [46.8, RW - 0.1, 1.55], [48.2, 4.3, 1.45]
  ];
  const S1P = [[0, 3.9, 1.1], [3.0, 3.9, 1.1], [4.0, 3.25, 1.05], [8.4, 3.25, 1.05], [9.4, 4.2, 1.1]];
  const at = (Pth, t) => {
    if (t <= Pth[0][0]) return { x: Pth[0][1], z: Pth[0][2] };
    for (let i = 1; i < Pth.length; i++) if (t <= Pth[i][0]) {
      const k = (t - Pth[i - 1][0]) / Math.max(0.0001, Pth[i][0] - Pth[i - 1][0]);
      return { x: Pth[i - 1][1] + (Pth[i][1] - Pth[i - 1][1]) * k, z: Pth[i - 1][2] + (Pth[i][2] - Pth[i - 1][2]) * k };
    }
    const l = Pth[Pth.length - 1]; return { x: l[1], z: l[2] };
  };
  // Distancia recorrida acumulada: el paso avanza con la distancia, no con el reloj (sin pies que patinan)
  const odometer = Pth => {
    const out = [0]; let prev = at(Pth, 0);
    for (let i = 1; i <= 3000; i++) { const p = at(Pth, i * 0.02); out.push(out[i - 1] + Math.hypot(p.x - prev.x, p.z - prev.z)); prev = p; }
    return t => out[Math.max(0, Math.min(3000, Math.round(t / 0.02)))];
  };
  const odo = new Map([[T1P, odometer(T1P)], [T2P, odometer(T2P)], [S1P, odometer(S1P)]]);
  const motion = (Pth, t) => {
    const a = at(Pth, t - 0.05), b = at(Pth, t + 0.05), dx = b.x - a.x, dz = b.z - a.z;
    const speed = Math.hypot(dx, dz) / 0.1;
    return { ...at(Pth, t), moving: speed > 0.05, speed, yaw: Math.atan2(dx, dz), phase: odo.get(Pth)(t) * (Math.PI * 2 / 1.1) };
  };

  // Retiro de cubiertas sincronizado con el paso de T1 por cada conexión
  const t1x = t => at(T1P, t).x;
  const firstTime = (from, to, test) => { for (let t = from; t <= to; t += 0.02) if (test(t)) return t; return to; };
  coverPlan.forEach(cv => {
    cv.t0 = cv.onB ? firstTime(14.0, 16.4, t => t1x(t) + 0.25 <= cv.a.x + 0.02) : firstTime(17.6, 22.1, t => t1x(t) + 0.25 >= cv.a.x - 0.02);
  });

  /* ---------- HUD SVG: información anclada a objetos 3D ----------
     Dos líneas como máximo: el dato arriba y el contexto debajo, más pequeño.
     Color con un solo significado: violeta mantenimiento, carmesí peligro,
     cian datos, amarillo químico (electrolito, lavaojos), blanco información. */
  const NS = 'http://www.w3.org/2000/svg';
  const hud = document.createElementNS(NS, 'g'); hud.setAttribute('class', 'rc-3d-hud'); svg.appendChild(hud);
  const C = { maint: '#c9b8ff', danger: '#ff6d7e', data: '#8fe3ff', chem: '#ffd27a', info: '#ece9f7' };
  const headOf = g => () => g.localToWorld(V(0, 1.74, 0.1));
  const between2 = (a, b) => () => a.localToWorld(V(0, 1.95, 0)).add(b.localToWorld(V(0, 1.95, 0))).multiplyScalar(0.5);
  const fmt = n => n.toFixed(1).replace('.', ',');
  const horiz = g => Math.hypot(g.position.x - CONTACT.x, g.position.z - CONTACT.z);
  const STOP2 = 2.9;
  const hudItems = [
    { id: 'bms', text: 'ALARMA F. TIERRA INHIBIDA', sub: 'hace 5 meses', point: BMS, dx: -420, dy: 60, color: C.maint, when: t => t >= 1.0 && t < STOP2 },
    { id: 'ext', text: 'EXTRACTOR DETENIDO', sub: 'hace 19 días', point: FAN, dx: 40, dy: 40, color: C.maint, when: t => t >= 1.2 && t < STOP2 },
    { id: 'det', text: 'DETECTOR H₂ SIN CALIBRAR', sub: 'vencido hace 26 meses', point: DET, dx: -360, dy: 70, color: C.maint, when: t => t >= 1.4 && t < STOP2 },
    { id: 'capTag', text: 'TAPÓN C-119 SIN APAGALLAMAS', sub: '+3 tapones no originales', point: CAP119, dx: 60, dy: -90, color: C.maint, when: t => t >= STOP2 + 0.2 && t < 5.2 },
    { id: 'faultTag', text: 'CABLE PUENTE 62/63', sub: 'aislamiento gastado contra el bastidor', point: FAULT, dx: 60, dy: 70, color: C.maint, when: t => t >= STOP2 + 0.4 && t < 5.2 },
    { id: 's1', text: 'S1 AUTORIZA', sub: 'con una orden genérica', point: null, follow: headOf(s1), dx: -300, dy: -50, color: C.info, when: t => t >= 5.4 && t < 8.6 },
    { id: 'talk', text: 'SIN PLAN NI PERMISO', sub: 'sin evaluación de riesgos', point: null, follow: between2(t1, t2), dx: -150, dy: -70, color: C.danger, when: t => t >= 9.4 && t < 12.8 },
    { id: 'covers', text: '62 CUBIERTAS RETIRADAS', sub: 'nivel superior expuesto', point: V(0.2, TOP_UP + 0.1, ZB + 0.2), dx: -200, dy: -90, color: C.danger, when: t => t >= 15.0 && t < 17.4 },
    ...READS.map((r, i) => ({ id: `read${i}`, text: r.text, sub: 'sobre la línea base', point: r.p, dx: -80, dy: -70, color: C.danger, when: t => t >= r.at && t < (r.c === 118 ? 28.0 : 23.4) })),
    { id: 'hydro', text: 'T2 · HIDRÓMETRO', sub: 'sin careta ni delantal', point: null, follow: () => hydro.position.clone().add(V(0, 0.3, 0)), dx: -380, dy: -40, color: C.chem, when: t => t >= 23.8 && t < 27 },
    { id: 'h2', text: 'H₂ SE ACUMULA', sub: '72 m³ sin extracción', point: V(0.3, 2.85, 0.4), dx: -200, dy: 40, color: C.data, when: t => t >= 27.1 && t < 28.6 },
    { id: 'zone', text: 'T1 DENTRO DE LA FRONTERA', sub: '', subFn: () => `T1 a ${fmt(horiz(t1))} m sin EPP · T2 a ${fmt(horiz(t2))} m`, point: V(CONTACT.x + 1.27, 0.04, CONTACT.z + 1.27), dx: 40, dy: -20, color: C.danger, when: t => t >= 28.6 && t < 31.5 },
    { id: 't1', text: 'MATRACA DE ACERO', sub: 'sin aislar', point: CONTACT, dx: 70, dy: -80, color: C.info, when: t => t >= 28.6 && t < 31.6 },
    { id: 'arc', text: 'ARCO CONTRA EL LARGUERO', sub: '≈ 0,9 s · nada lo despeja', point: CONTACT, dx: 70, dy: -80, color: C.danger, when: t => t >= 31.8 && t < 33.4 },
    { id: 'ida', text: 'IDA · 56 CELDAS', sub: 'C-118 → 63 · ≈ 126 V CC', point: V(0.6, TOP_UP + 0.07, ZA + 0.2), dx: -200, dy: -110, color: C.danger, when: t => t >= 33.4 && t < 34.8 },
    { id: 'vuelta', text: 'VUELTA POR LOS BASTIDORES', sub: 'puente → A → tierra → B → matraca', point: V(0.4, RAIL_UP + 0.07, ZB + HALF + 0.05), dx: -240, dy: 150, color: C.danger, when: t => t >= 33.4 && t < 34.8 },
    { id: 'fault', text: 'FALLA A TIERRA', sub: '', point: FAULT, dx: 40, dy: 110, color: C.danger, when: t => t >= 33.4 && t < 34.8 },
    { id: 'out', text: 'INT. 400 A · 0 A', sub: 'fuera del lazo, a 6 m', point: V(-3.0, 2.6, ZB), dx: 40, dy: -50, color: C.data, when: t => t >= 33.4 && t < 34.8 },
    { id: 'cap', text: 'DETONA LA C-119', sub: 'sin apagallamas', point: CAP119, dx: 80, dy: -90, color: C.danger, when: t => t >= 34.85 && t < 35.6 },
    { id: 'burn', text: 'T1 · QUEMADURAS', sub: 'electrolito en los ojos', point: null, follow: headOf(t1), dx: 80, dy: -70, color: C.danger, when: t => t >= 35.8 && t < 37.6 },
    { id: 'jewel', text: 'ANILLO Y RELOJ', sub: 'metálicos, bajo la quemadura', point: null, follow: () => t1.userData.parts.handR.getWorldPosition(V(0, 0, 0)), dx: 80, dy: 60, color: C.info, when: t => t >= 35.8 && t < 37.6 },
    { id: 'wash', text: 'LAVAOJOS VACÍO', sub: 'y vencido', point: BOTTLE, dx: -320, dy: -50, color: C.chem, when: t => t >= 40.6 && t < 48 },
    { id: 'sink', text: 'LAVAMANOS · 15 m →', sub: '≈ 1 min de retraso', point: V(RW, 0.5, 1.35), dx: -220, dy: 40, color: C.chem, when: t => t >= 44 && t < 48 },
    { id: 'bms241', text: 'FALLA DE BATERÍA', sub: 'falla a tierra no anunciada', point: BMS, dx: -300, dy: 120, color: C.danger, when: t => t >= 48.4 && t < 50.5 },
    { id: 'evid', text: 'EVIDENCIA 1–7', sub: 'bajo cadena de custodia', point: V(0.4, 0.05, 1.3), dx: 60, dy: 40, color: C.info, when: t => t >= 50.8 && t < 52.4 }
  ];
  const marks = [
    { text: '1 · DETECCIÓN F. TIERRA ✕', point: BMS, dx: -330, dy: -60 },
    { text: '2 · VENTILACIÓN Y H₂ ✕', point: FAN, dx: 40, dy: 30 },
    { text: '3 · APAGALLAMAS C-119 ✕', point: CAP119, dx: -60, dy: -90 },
    { text: '4 · LAVAOJOS ✕', point: BOTTLE, dx: -230, dy: 70 }
  ].map((m, i) => ({ ...m, sub: '', id: `mark${i}`, mark: true, color: '#ff4d6d', when: t => t >= 52.4 + i * 0.9 }));
  hudItems.push(...marks);
  for (const item of hudItems) {
    item.g = document.createElementNS(NS, 'g'); item.g.setAttribute('class', `rc-3d-hud-item ${item.id}${item.mark ? ' rc-3d-mark' : ''}`); hud.appendChild(item.g);
    item.lead = document.createElementNS(NS, 'line'); item.lead.setAttribute('class', 'rc-3d-lead'); item.g.appendChild(item.lead);
    item.dot = document.createElementNS(NS, 'circle'); item.dot.setAttribute('r', item.mark ? '22' : '3.5'); item.dot.setAttribute('class', item.mark ? 'rc-3d-ring' : 'rc-3d-dot'); item.g.appendChild(item.dot);
    item.label = document.createElementNS(NS, 'text'); item.label.setAttribute('class', 'rc-3d-label'); item.g.appendChild(item.label);
    item.main = document.createElementNS(NS, 'tspan'); item.main.textContent = item.text; item.label.appendChild(item.main);
    item.subT = document.createElementNS(NS, 'tspan'); item.subT.setAttribute('class', 'rc-3d-sub'); item.subT.setAttribute('dy', '1.35em'); item.subT.textContent = item.sub || ''; item.label.appendChild(item.subT);
    item.lead.style.stroke = item.color; item.label.style.fill = item.mark ? C.info : item.color;
    if (item.mark) item.dot.style.stroke = item.color; else item.dot.style.fill = item.color;
  }

  // El esquema SVG sigue vivo para 2D y 2.5D; en 3D el CSS lo oculta y deja HUD y línea de hechos.
  slide.classList.add('rc-gl');

  let time = 0, snap = true, lastInteract = 0, lastShot = -1, frame = 0;

  /* ---------- Postura: manos con objetivo en el mundo, brazos de dos tramos y cuclillas ---------- */
  // La figura mira hacia su +z local; su mano derecha está en -x local.
  const SH = { R: V(-0.19, 1.47, 0), L: V(0.19, 1.47, 0) };
  const REST = { R: V(-0.24, 0.9, 0.06), L: V(0.24, 0.9, 0.06) };
  const tmp = new THREE.Vector3();
  function place(g, s) {
    const c = s.crouch || 0;
    g.position.set(s.x, 0, s.z);
    g.rotation.set(s.lean || 0, s.yaw, 0);
    g.userData.upper.position.y = -c;
    g.updateMatrixWorld(true);
    const p = g.userData.parts;
    const sh = { R: SH.R.clone().add(V(0, -c, 0)), L: SH.L.clone().add(V(0, -c, 0)) };
    const target = (side, world, local) => {
      let h = world ? g.worldToLocal(tmp.copy(world)).clone() : (local ? local.clone().add(V(0, -c, 0)) : REST[side].clone().add(V(0, -c, 0)));
      const d = h.clone().sub(sh[side]), len = d.length();
      if (len > 0.6) h = sh[side].clone().add(d.multiplyScalar(0.6 / len));
      return h;
    };
    const hR = target('R', s.worldR, s.localR), hL = target('L', s.worldL, s.localL);
    const arm = (a, h, upperArm, fore, side) => {
      const elbow = a.clone().add(h).multiplyScalar(0.5).add(V(side * 0.07, -0.07, -0.04));
      between(upperArm, a.toArray(), elbow.toArray()); between(fore, elbow.toArray(), h.toArray());
    };
    arm(sh.R, hR, p.rightArm, p.rightFore, -1); arm(sh.L, hL, p.leftArm, p.leftFore, 1);
    p.handR.position.copy(hR); p.handL.position.copy(hL);
    // Paso: la amplitud depende de la velocidad y la fase de la distancia recorrida
    const amp = s.walking ? Math.min(1, (s.speed || 1) / 1.3) * 0.16 : 0, ph = s.phase || 0;
    const stride = Math.sin(ph) * amp;
    const liftL = Math.max(0, Math.sin(ph)) * amp * 0.45, liftR = Math.max(0, Math.sin(ph + Math.PI)) * amp * 0.45;
    const hipY = 0.82 - c, kneeY = 0.46 - c * 0.45, kneeZ = 0.02 + c * 0.75;
    const hipL = [0.09, hipY, 0], kneeL = [0.09, kneeY + liftL * 0.3, kneeZ + stride * 0.6], ankleL = [0.09, 0.1 + liftL, stride];
    const hipR = [-0.09, hipY, 0], kneeR = [-0.09, kneeY + liftR * 0.3, kneeZ - stride * 0.6], ankleR = [-0.09, 0.1 + liftR, -stride];
    between(p.leftLeg, hipL, kneeL); between(p.leftCalf, kneeL, ankleL);
    between(p.rightLeg, hipR, kneeR); between(p.rightCalf, kneeR, ankleR);
    p.bootL.position.set(ankleL[0], ankleL[1] - 0.04, ankleL[2]);
    p.bootR.position.set(ankleR[0], ankleR[1] - 0.04, ankleR[2]);
    g.updateMatrixWorld(true);
    return { R: g.localToWorld(hR.clone()), L: g.localToWorld(hL.clone()) };
  }

  function setTime(t) {
    const next = Math.max(0, Math.min(60, t));
    if (Math.abs(next - time) > 0.4) snap = true;   // salto en la línea de hechos: plano directo
    time = next;
  }

  /* ---------- Guion de cámara ----------
     [t, posición, objetivo, corte]. Planos frontales; el pasillo y el contraplano
     miran desde entre los bastidores. Con corte = true el cambio es seco. */
  const WIDE = [[0, 2.0, 7.2], [0, 1.25, -0.7]];
  const shotPlan = [
    [0, ...WIDE],                                                               // la sala, vacía
    [0.8, [0.4, 1.45, 3.9], [0.5, 2.75, -0.6]],                                 // barreras 1–2: BMS, extractor y detector
    [STOP2, [-2.4, 1.6, 2.4], [-2.0, 1.3, -0.5]],                               // barreras 3–4: tapón de la 119 y cable puente
    [5.2, [1.7, 1.7, 5.2], [2.4, 1.15, 1.1]],                                   // S1 abre la puerta; entran T1 y T2
    [8.8, [1.5, 1.6, 4.3], [1.5, 1.3, 1.2]],                                    // conversación sin plan
    [13, [0, 2.85, 5.8], [0, 1.25, -0.6]],                                      // cubiertas del bastidor B
    [17.4, [-2.55, 1.75, -0.45], [0.4, 1.0, -1.25], true],                      // pasillo: cubiertas de A y mediciones
    [23.4, [2.75, 1.55, 2.6], [2.0, 0.78, 0.3], true],                          // hidrómetro dentro de la celda piloto (desde la derecha de T2)
    [27, [X118 + 0.4, 3.0, 6.6], [X118 + 0.2, 0.9, 0.4], true],                 // T1 mide C-118/119 · frontera de arco
    [31.6, [X118 + 0.6, 1.95, 3.0], [X118 + 0.05, 1.72, 0.4]],                  // contacto: borne, matraca y larguero
    [33.6, [0, 2.9, 6.4], [-0.2, 1.1, -0.7]],                                   // lazo completo, con la salida al interruptor
    [34.8, [X119 + 1.1, 2.4, 3.8], [X119 + 0.2, 1.5, 0.5], true],               // detonación de la 119 (0,8 s)
    [35.6, [X118 - 0.15, 2.8, -1.0], [X118 - 0.3, 1.45, 1.4], true],            // contraplano: el rostro de T1
    [37.6, [X118 + 0.6, 2.1, 6.0], [X118 + 0.2, 1.2, 1.3], true],               // T1 retrocede; matraca en el piso
    [39.6, [0.6, 1.9, 7.0], [0.8, 1.15, 0.5]],                                  // retirada: T1 herido, T2 al lavaojos
    [44, [1.2, 2.0, 6.2], [1.8, 1.0, 1.0]],                                     // ruta de 15 m por la puerta
    [48, [1.0, 2.2, 1.0], [1.0, 2.4, -1.95], true],                             // 02:41: la pantalla del BMS
    [50.5, [0.1, 3.3, 5.2], [-0.4, 0.25, 0.3], true],                           // cierre 1: evidencias numeradas en el piso
    [52.2, [0, 1.8, 8.2], [0, 1.7, -0.5], true],                                // cierre 2: las cuatro barreras
    [60, [0, 1.8, 8.2], [0, 1.7, -0.5]]
  ];
  function cameraShot(t) {
    let i = 1;
    while (i < shotPlan.length && t > shotPlan[i][0]) i++;
    if (i >= shotPlan.length) i = shotPlan.length - 1;
    const a = shotPlan[i - 1], b = shotPlan[i];
    const move = b[3] ? 0 : Math.min(1.6, (b[0] - a[0]) * 0.3);
    const p = move ? THREE.MathUtils.smoothstep((t - (b[0] - move)) / move, 0, 1) : 0;
    return { index: i - 1, cut: !!a[3], pos: a[1].map((v, j) => v + (b[1][j] - v) * p), look: a[2].map((v, j) => v + (b[2][j] - v) * p) };
  }

  const RACK_YAW = Math.PI;
  const PILOT = capPos(28);
  const wrenchHead = new THREE.Vector3(), wrenchEnd = new THREE.Vector3();
  const HEAD0 = V(X118 + 0.02, TOP_UP + 0.12, ZB + 0.2);
  const L_FACE = V(0.05, 1.68, 0.16), R_FACE = V(-0.05, 1.68, 0.16);
  const inRoom = x => x < RW - 0.05;
  const WRENCH_V = V(0.4, 0.9, 1.0);
  // Ubicación de las evidencias: donde quedaron los objetos tras el evento
  const wrenchRest = ballistic(V(0, 0, 0), CONTACT, WRENCH_V, 9);
  const lidRest = ballistic(V(0, 0, 0), CAP119, lidPieces[0].userData.v, 9, 9.8, 0.03);
  tag(1, -2.55, 2.62, 1.85, false);
  tag(2, BMS.x + 0.6, BMS.y, BMS.z + 0.05, false);
  tag(3, wrenchRest.x + 0.2, 0, wrenchRest.z + 0.12);
  tag(4, CONTACT.x + 0.14, 0, RAIL_B + 0.2);
  tag(5, -2.62, 0, -0.95);
  tag(6, lidRest.x + 0.18, 0, lidRest.z + 0.1);
  tag(7, BOTTLE.x - 0.14, BOTTLE.y + 0.26, BOTTLE.z, false);

  function updatePeople() {
    const t = time;
    // T1
    const m1 = motion(T1P, t);
    const s = { x: m1.x, z: m1.z, yaw: m1.moving ? m1.yaw : RACK_YAW, walking: m1.moving, speed: m1.speed, phase: m1.phase };
    const toolOn = t >= 28.0 && t < 37.4;
    if (t >= 9.2 && t < 13) { const o = at(T2P, t); s.yaw = Math.atan2(o.x - s.x, o.z - s.z); }        // conversa con T2
    else if ((t >= 14.0 && t < 16.4) || (t >= 17.6 && t < 22.1 && !(t >= 18.8 && t < 21.3))) {
      // Retira cubiertas de lado, de frente al bastidor, a la altura del pecho
      s.yaw = RACK_YAW; s.lean = 0.16;
      s.worldR = V(s.x + 0.25, TOP_UP + 0.05, (t < 16.4 ? ZB : ZA) + 0.25);
    } else if ((t >= 18.8 && t < 21.3 && !m1.moving) || (t >= 26.6 && t < 28.0)) {
      const r = t < 20.1 ? READS.find(x => x.c === 77) : t < 22 ? READS.find(x => x.c === 40) : READS.find(x => x.c === 118);
      s.yaw = RACK_YAW; s.worldR = r.p; s.localL = V(0.14, 1.2, 0.32);
      if (r.c === 40) { s.crouch = 0.42; s.lean = 0.18; } else s.lean = 0.08;
    } else if (t >= 37.4 && t < 44.4) {
      s.localR = R_FACE; s.localL = L_FACE; s.lean = 0.16; if (!m1.moving) s.yaw = 0;
    } else if (toolOn) {
      wrenchHead.copy(HEAD0).lerp(CONTACT, sstep(31.0, 31.6, t));
      const rat = t < 31 && !reduced ? Math.sin(t * 7) * 0.035 * sstep(28.4, 28.8, t) : 0;
      wrenchEnd.set(wrenchHead.x + 0.12 + rat, wrenchHead.y - 0.16, wrenchHead.z + 0.3);
      s.worldR = wrenchEnd; s.lean = 0.1; s.localL = V(0.22, 1.25, 0.25);
      if (t >= 34.9) { const k = sstep(34.9, 35.25, t); s.lean = 0.1 - 0.28 * k; s.localL = s.localL.lerp(L_FACE, k); }
    }
    const h1 = place(t1, s);
    t1.visible = t > 5.2 && inRoom(m1.x);
    const burn = t >= 35.0 ? Math.min(1, (t - 35.0) / 0.4) : 0;
    t1.userData.burnMat.opacity = burn; t1.userData.armMat.opacity = burn;
    t1.userData.stainMat.opacity = t >= 35.1 ? 0.75 * Math.min(1, (t - 35.1) / 0.5) : 0;

    // T2: registra, toma densidad, se aparta, reacciona a la detonación y busca el lavaojos
    const m2 = motion(T2P, t);
    const s2 = { x: m2.x, z: m2.z, yaw: m2.moving ? m2.yaw : RACK_YAW, walking: m2.moving, speed: m2.speed, phase: m2.phase };
    if (t >= 9.2 && t < 13) { const o = at(T1P, t); s2.yaw = Math.atan2(o.x - s2.x, o.z - s2.z); }
    if (t >= 13.8 && t < 23 && !m2.moving) s2.localL = V(0.18, 1.15, 0.28);
    if (t >= 24 && t < 27.5) { s2.worldR = hydro.position.clone().add(V(0, 0.34, 0)); s2.crouch = 0.3; s2.lean = 0.2; }
    if (t >= 29.0 && t < 39.4 && !m2.moving) s2.yaw = Math.atan2(CONTACT.x - s2.x, CONTACT.z - s2.z) * 0.4 + RACK_YAW * 0.6;
    if (t >= 34.9 && t < 37.0) {                                         // se cubre: antebrazo derecho delante del rostro
      const k = sstep(34.9, 35.2, t) * (1 - sstep(36.4, 37.0, t));
      s2.lean = -0.18 * k; s2.localR = V(-0.02, 1.62, 0.22).lerp(REST.R, 1 - k); s2.localL = V(0.1, 1.5, 0.2).lerp(REST.L, 1 - k);
    }
    if (t >= 40.4 && t < 42.8) { s2.yaw = Math.PI / 2; s2.worldR = BOTTLE; }
    if (t >= 44.4 && t < 47.4) s2.localL = V(0.3, 1.2, -0.2);
    const h2 = place(t2, s2);
    t2.visible = t > 5.6 && inRoom(m2.x);
    t2.userData.armMat.opacity = t >= 35.4 ? 0.8 : 0;                     // salpicadura leve en el antebrazo

    // S1: abre con la tarjeta, autoriza y se va
    const m3 = motion(S1P, t);
    const s3 = { x: m3.x, z: m3.z, yaw: m3.moving ? m3.yaw : -Math.PI / 2, walking: m3.moving, speed: m3.speed, phase: m3.phase };
    if (t >= 4.0 && t < 5.0) { s3.yaw = Math.PI / 2; s3.worldR = READER; }
    place(s1, s3);
    s1.visible = t > 3.0 && t < 9.3;
    readerLed.emissiveIntensity = t >= 4.5 && t < 6.5 ? 2 : 0;

    // Matraca: en la mano hasta 37,4 s; luego sale despedida, cae y queda como evidencia
    wrench.visible = wrHandle.visible = t >= 27.6;
    if (toolOn || t < 28.0) {
      wrenchHead.copy(t < 28.0 ? HEAD0 : wrenchHead);
      wrench.position.copy(wrenchHead);
      between(wrHandle, wrenchHead.toArray(), (toolOn ? h1.R : wrenchHead.clone().add(V(0.12, -0.16, 0.3))).toArray());
    } else {
      const q = t - 37.4, land = landTime(CONTACT, WRENCH_V, 9.8, 0.05);
      ballistic(wrench.position, CONTACT, WRENCH_V, q, 9.8, 0.05);
      const ang = Math.min(q, land) * 9;
      const onFloor = q >= land;
      const end = wrench.position.clone().add(V(Math.cos(ang) * 0.28, onFloor ? 0 : Math.sin(ang) * 0.28, 0.05));
      between(wrHandle, wrench.position.toArray(), end.toArray());
    }
    meter.visible = (t >= 18.8 && t < 21.4) || (t >= 26.6 && t < 28.0);
    if (meter.visible) { meter.position.copy(h1.L); meter.rotation.set(-0.4, t1.rotation.y, 0); }
    // Hidrómetro: el tubo entra en la celda piloto y sube y baja al aspirar
    hydro.visible = t >= 23.6 && t < 27.5;
    if (hydro.visible) { hydro.position.copy(PILOT).add(V(0, -0.12 + (reduced ? 0 : 0.03 * Math.sin(t * 2.2)), 0)); hydro.rotation.set(0, 0, 0); }
    sheet.visible = t >= 13.8 && t < 23;
    if (sheet.visible) { sheet.position.copy(h2.L); sheet.rotation.set(-0.5, t2.rotation.y, 0); }
  }

  /* ---------- Evento ---------- */
  const tmpQ = new THREE.Vector3();
  let lidGone = false;
  function updateEvent() {
    const t = time;
    // Cubiertas del nivel superior: se retiran una a una y quedan en el piso
    coverPlan.forEach((cv, i) => {
      const p = THREE.MathUtils.clamp((t - cv.t0) / 0.7, 0, 1);
      dummy.position.set(cv.a.x + (cv.b.x - cv.a.x) * p, cv.a.y + (cv.b.y - cv.a.y) * p * p + Math.sin(p * Math.PI) * 0.12, cv.a.z + (cv.b.z - cv.a.z) * p);
      dummy.rotation.set(p * rand(i, 3) * 3, p * rand(i, 4) * 4, p * (rand(i, 5) - 0.5) * 3);
      dummy.updateMatrix(); upCovers.setMatrixAt(i, dummy.matrix);
    });
    dummy.rotation.set(0, 0, 0);
    upCovers.instanceMatrix.needsUpdate = true;

    READS.forEach(r => { r.ring.material.opacity = t >= r.at && t < (r.c === 118 ? 28.0 : 23.4) ? 0.95 : 0; r.ring.scale.setScalar(reduced ? 1 : 1 + 0.15 * Math.sin(t * 5)); });

    // Fronteras de aproximación alrededor de C-118 (Tablas 130.4(E)(b) y 130.7(C)(15)(b))
    const zoneOn = (t >= 27.6 && t < 34.8) || t >= 50.5 ? 1 : 0;
    const zk = t < 34.8 ? sstep(27.6, 28.2, t) * (1 - sstep(34.4, 34.8, t)) : sstep(50.5, 51.0, t);
    zoneMats.forEach(([m, base]) => { m.opacity = zoneOn * zk * base; });
    zoneTags.forEach(s => { s.material.opacity = zoneOn * zk; });

    // Arco sostenido ≈ 0,9 s, en cámara lenta de 31,8 a 37,4 s
    const arcOn = t >= 31.8 && t < 37.4;
    arcCore.visible = arcHalo.visible = arcStrands.visible = arcOn;
    if (arcOn) {
      const f = reduced ? 1 : 0.75 + Math.random() * 0.5;
      arcCore.scale.setScalar(0.09 * f); arcHalo.scale.setScalar(0.2 + f * 0.1 + 0.1 * sstep(32.6, 33.6, t));
      const pos = arcStrands.geometry.attributes.position;
      for (let k = 0; k < 8; k++) {
        const a = (reduced ? k / 8 : Math.random()) * Math.PI * 2, r = 0.04 + (reduced ? 0.05 : Math.random() * 0.08);
        pos.setXYZ(k * 2, CONTACT.x, CONTACT.y, CONTACT.z);
        pos.setXYZ(k * 2 + 1, CONTACT.x + Math.cos(a) * r, CONTACT.y + Math.sin(a) * r * 0.7, CONTACT.z + 0.02);
      }
      pos.needsUpdate = true;
    }
    contactLight.intensity = arcOn ? (reduced ? 2.5 : 2.5 + Math.random() * 2) : 0;

    // Lazo: ida (32,2 → 32,8) y vuelta (32,8 → 33,3); luego tres pulsos lo recorren
    const loopOn = t >= 32.2 && t < 38.6;
    idaTube.visible = vueltaTube.visible = loopOn;
    const draw = (m, a, b) => m.geometry.setDrawRange(0, loopOn ? Math.floor(m.userData.idx * sstep(a, b, t) / 3) * 3 : 0);
    draw(idaTube, 32.2, 32.8); draw(vueltaTube, 32.8, 33.3);
    pulses.forEach((sp, k) => {
      sp.visible = t >= 33.3 && t < 38.6;
      if (sp.visible) sp.position.copy(LOOP[Math.floor((((t - 33.3) / (reduced ? 4 : 1.6) + k / 3) % 1) * (LOOP.length - 1))]);
    });
    busHotMat.opacity = loopOn ? 0.9 * sstep(32.2, 32.8, t) : 0;
    faultMat.opacity = t >= 31.6 && t < 39.6 ? (reduced ? 0.9 : 0.6 + 0.4 * Math.sin(t * 6)) : 0.45;
    const outOn = t >= 33.3 && t < 38.6 ? 1 : 0;
    outMat.emissiveIntensity = outOn * (reduced ? 1 : 0.9 + 0.3 * Math.sin(t * 4));
    breakerTag.material.opacity = outOn ? 1 : 0.35;

    // H₂: brillo en el tapón y acumulación bajo el techo mientras no hay extracción
    capGlow.visible = t >= 20 && t < 34.8;
    capGlow.material.opacity = reduced ? 0.35 : 0.25 + 0.2 * Math.sin(t * 2.4);
    capGlow.scale.setScalar(0.16 + (reduced ? 0 : 0.04 * Math.sin(t * 1.7)));
    hazeMat.opacity = 0.06 + 0.22 * sstep(0, 34.8, t);
    fanLedMat.emissiveIntensity = reduced ? 1 : 0.6 + 0.5 * Math.sin(t * 5);

    // Detonación de la 119 (física en cámara lenta)
    const q = t - 34.8, qs = slowT(Math.max(0, q));
    blastLight.intensity = q >= 0 && q < 1 ? (q < 0.1 ? BLAST : BLAST * Math.exp(-(q - 0.1) * 7)) : 0;
    blastLight.color.setHex(q < 0.12 ? 0xffffff : 0xff6a3a);
    fireCore.visible = q >= 0 && q < 0.5;
    if (fireCore.visible) { fireCore.scale.setScalar(1.0 * sstep(0, 0.12, q) + 0.001); fireCore.material.opacity = (reduced ? 0.6 : 0.9) * (1 - sstep(0.15, 0.5, q)); }
    fireShell.visible = q >= 0 && q < 1.2;
    if (fireShell.visible) {
      fireShell.scale.setScalar(1.8 * sstep(0, reduced ? 0.4 : 0.15, q) + 0.8 * sstep(0.15, 1.1, q) + 0.001);
      fireShell.material.color.copy(shellA).lerp(shellB, sstep(0.1, 0.8, q));
      fireShell.material.opacity = 1 - sstep(0.35, 1.2, q);
    }
    sparks.visible = q >= 0 && q < 2.4;
    if (sparks.visible) {
      const pos = sparks.geometry.attributes.position;
      for (let i = 0; i < SPARKS; i++) { ballistic(tmpQ, CAP119, sparkV[i], qs * 1.6 * (0.85 + rand(i, 12) * 0.3), 6); pos.setXYZ(i, tmpQ.x, tmpQ.y, tmpQ.z); }
      pos.needsUpdate = true;
      sparks.material.opacity = 1 - sstep(0.9, 2.4, q);
    }
    // Electrolito, fragmentos de la tapa y charco: quedan en el piso como evidencia
    drops.visible = q >= 0;
    if (drops.visible) {
      const face = headOf(t1)();
      for (let i = 0; i < DROPS; i++) {
        if (i < FACE_HITS) {
          const k = Math.min(1, qs / 0.35);
          tmpQ.copy(CAP119).lerp(face, k); tmpQ.y += Math.sin(k * Math.PI) * 0.1 + (rand(i, 13) - 0.5) * 0.05 * k;
          dummy.scale.setScalar(k >= 1 ? 0.0001 : 1);
        } else {
          ballistic(tmpQ, CAP119, dropV[i], qs, 9.8, 0.05);
          dummy.scale.set(1, tmpQ.y <= 0.051 ? 0.3 : 1, 1);
        }
        dummy.position.copy(tmpQ); dummy.updateMatrix(); drops.setMatrixAt(i, dummy.matrix);
      }
      dummy.scale.set(1, 1, 1);
      drops.instanceMatrix.needsUpdate = true;
    }
    puddleMat.opacity = q >= 0.6 ? 0.6 * sstep(0.6, 1.8, q) : 0;
    const ps = 0.4 + 0.6 * sstep(0.6, 2.0, q);
    puddle.scale.set(1.3 * ps, 0.8 * ps, 1);
    lidPieces.forEach(m => {
      m.visible = q >= 0;
      if (!m.visible) return;
      ballistic(m.position, CAP119, m.userData.v, qs, 9.8, 0.03);
      const air = Math.min(qs, landTime(CAP119, m.userData.v, 9.8, 0.03));
      m.rotation.set(m.userData.r.x * air, m.userData.r.y * air, m.userData.r.z * air);
    });
    const gone = q >= 0;
    if (gone !== lidGone) {
      lidGone = gone;
      dummy.position.copy(CAP119); dummy.scale.setScalar(gone ? 0.0001 : 1); dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix(); tops.setMatrixAt(118, dummy.matrix); tops.instanceMatrix.needsUpdate = true;
      dummy.scale.setScalar(1);
    }
    smoke.forEach(puff => {
      const on = q >= 0.2 && q < 5.2;
      puff.visible = on;
      if (on) {
        const k = THREE.MathUtils.clamp((q - 0.2) / 4.8, 0, 1);
        puff.position.set(CAP119.x + puff.userData.offset.x * (1 + k * 2), CAP119.y + 0.08 + puff.userData.offset.y + k * 0.6 + Math.sin(t * 0.7 + puff.userData.phase) * 0.03, CAP119.z + puff.userData.offset.z);
        puff.scale.setScalar(0.7 + k * 1.4);
      }
    });

    // Ruta al lavamanos, BMS y evidencias del cierre
    routeMat.opacity = t >= 44 && t < 50 ? 0.95 * (1 - sstep(49, 50, t)) : 0;
    route.count = t >= 44 ? Math.round(routePts.length * sstep(44, 47.4, t)) : 0;
    const failed = t >= 48 ? 1 : 0;
    if (failed !== bmsState) { bmsState = failed; drawBMS(!!failed); }
    bmsLedMat.emissiveIntensity = t >= 48 ? (reduced ? 1.4 : 1.2 + 0.6 * Math.sin(t * 6)) : 0.15;
    evidence.forEach((e, i) => { e.visible = t >= 50.6 + i * 0.12; });

    // Peligro: de la luz fría de la noche al carmesí, y de vuelta en el cierre
    const d = sstep(31.6, 32.0, t) * (1 - sstep(47.5, 49, t));
    hemi.color.copy(HEMI_COLD).lerp(HEMI_RED, d * 0.75);
    hemi.intensity = HEMI_I - 0.25 * d;
    key.color.copy(KEY_COLD).lerp(KEY_RED, d * 0.6);
    key.intensity = KEY_I - 0.6 * d;
    lamps.forEach(l => { l.intensity = LAMP_I * (1 - 0.6 * d); });
    lampMat.emissiveIntensity = 1.6 * (1 - 0.5 * d);
    dangerLight.intensity = d * (reduced ? 3 : 3 + Math.sin(t * 3) * 0.5);
    scene.fog.color.copy(COLD_FOG).lerp(RED_FOG, d);
    veil.style.opacity = (d * 0.9).toFixed(3);
  }

  function updateCamera(now) {
    const shot = cameraShot(time);
    if (shot.index !== lastShot) { if (shot.cut && lastShot !== -1) snap = true; lastShot = shot.index; }
    const pos = V(...shot.pos), look = V(...shot.look);
    if (!userOrbit.active && now - lastInteract > 1500) { userOrbit.yaw *= 0.94; userOrbit.pitch *= 0.94; userOrbit.distance *= 0.94; }
    const basis = pos.clone().sub(look), d = basis.length();
    const yaw = Math.atan2(basis.x, basis.z) + userOrbit.yaw, pitch = Math.asin(basis.y / d) + userOrbit.pitch, dist = d + userOrbit.distance;
    const nextPos = V(look.x + Math.sin(yaw) * Math.cos(pitch) * dist, look.y + Math.sin(pitch) * dist, look.z + Math.cos(yaw) * Math.cos(pitch) * dist);
    const q = time - 34.8;
    if (!reduced && q >= 0 && q < 0.35) {
      const shake = sstep(0, 0.03, q) * (1 - sstep(0.05, 0.35, q));
      nextPos.x += (Math.random() - 0.5) * 0.24 * shake; nextPos.y += (Math.random() - 0.5) * 0.18 * shake; nextPos.z += (Math.random() - 0.5) * 0.18 * shake;
    }
    if (snap) { camera.position.copy(nextPos); desiredTarget.copy(look); snap = false; }
    else { camera.position.lerp(nextPos, 0.18); desiredTarget.lerp(look, 0.16); }
    camera.lookAt(desiredTarget);
  }

  // Etiquetas: dentro de la franja útil y sin encimarse (se apilan)
  const placed = [];
  function updateHud() {
    const v = new THREE.Vector3();
    placed.length = 0;
    for (const item of hudItems) {
      const on = item.when ? item.when(time) : true;
      item.g.style.opacity = on ? '1' : '0';
      if (!on) continue;
      if (item.subFn) item.subT.textContent = item.subFn();
      v.copy(item.follow ? item.follow() : item.point).project(camera);
      const x = (v.x + 1) * 960, y = (1 - v.y) * 540;
      const sub = item.subT.textContent;
      const w = Math.max(item.text.length * 10.2, sub.length * 8.2);
      const h = sub ? 48 : 26;
      const tx = Math.min(1870 - w, Math.max(40, x + item.dx));
      let ty = Math.min(820, Math.max(250, y + item.dy));
      for (let guard = 0; guard < 12; guard++) {
        const hit = placed.find(b => ty < b.y + b.h && b.y < ty + h && tx < b.x + b.w && b.x < tx + w);
        if (!hit) break;
        ty = ty >= hit.y ? hit.y + hit.h + 4 : hit.y - h - 4;
      }
      ty = Math.min(840, Math.max(240, ty));
      placed.push({ x: tx, y: ty - 18, w, h });
      item.lead.setAttribute('x1', x.toFixed(1)); item.lead.setAttribute('y1', y.toFixed(1)); item.lead.setAttribute('x2', tx.toFixed(1)); item.lead.setAttribute('y2', (ty - 5).toFixed(1));
      item.dot.setAttribute('cx', x.toFixed(1)); item.dot.setAttribute('cy', y.toFixed(1));
      item.label.setAttribute('x', tx.toFixed(1)); item.label.setAttribute('y', ty.toFixed(1));
      item.subT.setAttribute('x', tx.toFixed(1));
    }
  }

  const webglView = () => !slide.classList.contains('rc-2d') && !slide.classList.contains('rc-iso');

  function animate(now) {
    if (!slide.classList.contains('is-active') || !webglView()) { raf = 0; return; }
    if (frame++ % 30 === 0) fitCanvas();
    if (!hintShown) hintShown = now;
    hint.classList.toggle('on', now - hintShown < 6000 && !lastInteract);
    updatePeople(); updateEvent(); updateCamera(now); updateHud();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }

  const syncRenderLoop = () => {
    if (slide.classList.contains('is-active') && webglView()) {
      if (!raf) { snap = true; hintShown = 0; raf = requestAnimationFrame(animate); }
    } else if (raf) { cancelAnimationFrame(raf); raf = 0; }
  };
  new MutationObserver(syncRenderLoop).observe(slide, { attributes: true, attributeFilter: ['class'] });

  canvas.addEventListener('pointerdown', e => { userOrbit.active = true; userOrbit.lastX = e.clientX; userOrbit.lastY = e.clientY; lastInteract = performance.now(); canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if (!userOrbit.active) return;
    const dx = e.clientX - userOrbit.lastX, dy = e.clientY - userOrbit.lastY; userOrbit.lastX = e.clientX; userOrbit.lastY = e.clientY;
    userOrbit.yaw -= dx * 0.008; userOrbit.pitch = THREE.MathUtils.clamp(userOrbit.pitch - dy * 0.006, -0.4, 0.45);
    lastInteract = performance.now();
  });
  canvas.addEventListener('pointerup', e => { userOrbit.active = false; lastInteract = performance.now(); canvas.releasePointerCapture(e.pointerId); });
  canvas.addEventListener('wheel', e => { e.preventDefault(); userOrbit.distance = THREE.MathUtils.clamp(userOrbit.distance + e.deltaY * 0.003, -3, 4); lastInteract = performance.now(); }, { passive: false });

  window.Recon3D = { isWebGL: true, setTime };
  window.dispatchEvent(new CustomEvent('recon3d-ready'));
  syncRenderLoop();
  }
})();
