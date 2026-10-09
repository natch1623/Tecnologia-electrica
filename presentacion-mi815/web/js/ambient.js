/* =========================================================
   Ambiente vivo · estrellas → resplandor → partículas → ondas de emisión
   Las ondas salen de un punto de cada slide y se atenúan con la distancia,
   como la radiación de una fuente: la pantalla respira, sin distraer.
   ========================================================= */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = document.getElementById('sky');
  const ctx = cv.getContext('2d');

  const CREAM = [245, 242, 236];
  const AMBER = [224, 163, 46];
  // Cada ánimo cambia el ritmo de las ondas y el movimiento de las partículas
  const MOODS = {
    calm:  { every: 5200, speed: 0.55, mode: 'drift', glow: 0.22 },
    dose:  { every: 3600, speed: 0.8,  mode: 'drift', glow: 0.2 },
    order: { every: 6000, speed: 0.5,  mode: 'drift', glow: 0.17 },
    field: { every: 2800, speed: 0.9,  mode: 'radial', glow: 0.24 },
    flow:  { every: 4800, speed: 0.7,  mode: 'flow', glow: 0.18 }
  };
  let mood = MOODS.calm;
  let glow = mood.glow;

  let W, H, dpr;
  let stars = [], parts = [], waves = [];
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const anchor = { x: 0, y: 0, tx: 0, ty: 0, set: false };
  let lastWave = 0;

  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  function resize() {
    dpr = Math.min(1.25, devicePixelRatio || 1);
    W = cv.width = Math.max(1, innerWidth * dpr);
    H = cv.height = Math.max(1, innerHeight * dpr);
    const n = Math.round((innerWidth * innerHeight) / 5200);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: (Math.random() ** 3 * 1.4 + 0.3) * dpr,
      z: 0.15 + Math.random() * 0.85,
      a: Math.random() * Math.PI * 2, tw: 0.3 + Math.random() * 1.2,
      amber: Math.random() < 0.12
    }));
    if (!anchor.set) { anchor.x = anchor.tx = W * 0.78; anchor.y = anchor.ty = H * 0.5; }
    if (reduced) draw(0);
  }

  function spawn(fresh) {
    const p = { life: 0, max: 500 + Math.random() * 600, x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, s: (0.6 + Math.random() * 1.3) * dpr, amber: Math.random() < 0.3 };
    if (mood.mode === 'drift') { p.vx = (Math.random() - 0.5) * 0.22 * dpr; p.vy = (Math.random() - 0.5) * 0.22 * dpr; }
    if (mood.mode === 'flow') { p.x = fresh ? p.x : -10; p.vx = (0.4 + Math.random() * 0.7) * dpr; p.vy = 0; p.lane = Math.round(p.y / (60 * dpr)) * 60 * dpr; p.y = p.lane; }
    if (mood.mode === 'radial') {
      const a = Math.random() * Math.PI * 2;
      const r = fresh ? Math.random() * 500 * dpr : 20 * dpr;
      p.x = anchor.x + Math.cos(a) * r; p.y = anchor.y + Math.sin(a) * r;
      const v = (0.25 + Math.random() * 0.5) * dpr;
      p.vx = Math.cos(a) * v; p.vy = Math.sin(a) * v;
    }
    return p;
  }

  function setMood(name) {
    const m = MOODS[name] || MOODS.calm;
    if (m === mood) return;
    const changed = m.mode !== mood.mode;
    mood = m;
    if (changed) parts.forEach(p => { p.max = Math.min(p.max, p.life + 40 + Math.random() * 60); });
  }

  function setAnchor(x, y) {
    anchor.tx = x * dpr; anchor.ty = y * dpr;
    if (!anchor.set) { anchor.x = anchor.tx; anchor.y = anchor.ty; anchor.set = true; }
  }

  function draw(t) {
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    anchor.x += (anchor.tx - anchor.x) * 0.03;
    anchor.y += (anchor.ty - anchor.y) * 0.03;
    glow += (mood.glow - glow) * 0.02;

    // Fondo: azul marino con viñeta
    const bg = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.5, Math.hypot(W, H) * 0.62);
    bg.addColorStop(0, '#16294a');
    bg.addColorStop(0.55, '#10203a');
    bg.addColorStop(1, '#08111f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Resplandor cálido alrededor de la fuente
    const R = Math.max(W, H) * 0.55;
    const g = ctx.createRadialGradient(anchor.x, anchor.y, 0, anchor.x, anchor.y, R);
    g.addColorStop(0, rgba(AMBER, glow * 0.55));
    g.addColorStop(0.35, rgba(AMBER, glow * 0.12));
    g.addColorStop(1, rgba(AMBER, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Estrellas con paralaje
    const ox = (mouse.x - W / 2) * 0.012, oy = (mouse.y - H / 2) * 0.012;
    for (const s of stars) {
      const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.a + t * 0.001 * s.tw));
      ctx.fillStyle = rgba(s.amber ? AMBER : CREAM, a * (0.35 + s.z * 0.5));
      ctx.beginPath();
      ctx.arc(s.x - ox * s.z, s.y - oy * s.z, s.r, 0, 6.283);
      ctx.fill();
    }

    // Ondas de emisión: la intensidad cae con la distancia
    if (!reduced && t - lastWave > mood.every) { waves.push({ t0: t }); lastWave = t; }
    const maxR = Math.hypot(W, H) * 0.6;
    waves = waves.filter(w => {
      const k = (t - w.t0) / (9000 / mood.speed);
      if (k >= 1) return false;
      const r = 30 * dpr + k * maxR;
      const a = 0.22 * (1 - k) * (1 - k);
      ctx.strokeStyle = rgba(AMBER, a);
      ctx.lineWidth = (1.6 - k) * dpr;
      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, r, 0, 6.283);
      ctx.stroke();
      return true;
    });

    // Partículas
    while (parts.length < 70) parts.push(spawn(parts.length < 70 && t < 100));
    parts = parts.filter(p => {
      p.life += mood.speed;
      p.x += p.vx * mood.speed; p.y += p.vy * mood.speed;
      const fade = Math.min(1, p.life / 60, (p.max - p.life) / 60);
      if (fade <= 0 || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) return false;
      ctx.fillStyle = rgba(p.amber ? AMBER : CREAM, 0.5 * fade);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s, 0, 6.283);
      ctx.fill();
      return true;
    });

    if (!reduced) requestAnimationFrame(draw);
  }

  addEventListener('resize', resize);
  addEventListener('mousemove', e => { mouse.tx = e.clientX * dpr; mouse.ty = e.clientY * dpr; });
  resize();
  if (!reduced) requestAnimationFrame(draw);

  window.Ambient = { setMood, setAnchor };
})();
