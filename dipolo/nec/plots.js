(() => {
  'use strict';
  const kq = 8.9875517923e9 * 2e-9;
  const d = .04;
  const abyssal = document.documentElement.dataset.theme === 'nec';
  const c = abyssal ? { cyan: '#8fe3ff', rose: '#ff9ab0', frost: '#f4f1ff', dim: '#c5c3dc', red: '#ff4d6d', amber: '#c9b8ff', dark: '#16102a' } : { cyan: '#abedf0', rose: '#fac1cb', frost: '#daeef3', dim: '#a6c5d3', red: '#e68c9d', amber: '#eddbab', dark: '#142c3a' };
  const number = new Intl.NumberFormat('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const volts = n => Number.isFinite(n) ? number.format(Math.abs(n) < .005 ? 0 : n) + ' V' : 'Indefinido';

  function potential(x, y) {
    return kq * (1 / Math.hypot(x - d / 2, y) - 1 / Math.hypot(x + d / 2, y));
  }

  function surface(canvas) {
    const w = Number(canvas.getAttribute('width'));
    const h = Number(canvas.getAttribute('height'));
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * ratio);
    canvas.height = Math.round(h * ratio);
    const ctx = canvas.getContext('2d');
    ctx.scale(canvas.width / w, canvas.height / h);
    return { ctx, w, h };
  }

  function line(ctx, from, to, color, width = 1, dash = []) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(...from);
    ctx.lineTo(...to);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function arrow(ctx, from, to, color, width = 2) {
    line(ctx, from, to, color, width);
    const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(...to);
    for (const a of [angle - .46, angle + .46]) ctx.lineTo(to[0] - 13 * Math.cos(a), to[1] - 13 * Math.sin(a));
    ctx.closePath();
    ctx.fill();
  }

  function label(ctx, value, [x, y], color = c.frost, size = 18, align = 'center') {
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.font = '600 ' + size + 'px system-ui, sans-serif';
    ctx.fillText(value, x, y);
  }

  function circle(ctx, [x, y], radius, fill, rim) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (rim) {
      ctx.strokeStyle = rim;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
  }

  function charge(ctx, pt, sign, color, radius = 16) {
    circle(ctx, pt, radius, c.dark, color);
    label(ctx, sign, pt, color, radius + 4);
  }

  function crystal(ctx, x, y, w, h, sign, warm = false) {
    const tip = [x + w * .13, y - h * .51];
    const heel = [x - w * .12, y + h * .51];
    const left = [x - w * .50, y + 5];
    const right = [x + w * .50, y - 18];
    const cleft = [x + w * .14, y + 28];
    const faces = [[tip, left, cleft], [tip, cleft, right], [left, heel, cleft], [cleft, heel, right]];
    const tones = warm ? ['#bad0e1', '#fff0ef', '#794f70', '#9487b2'] : ['#86c7dc', '#e0f9f8', '#376c91', '#77a6c8'];
    ctx.save();
    faces.forEach((face, index) => {
      const wash = ctx.createLinearGradient(x - w / 2, y - h * .5, x + w / 2, y + h * .5);
      wash.addColorStop(0, tones[index]);
      wash.addColorStop(1, '#243e5a90');
      ctx.beginPath();
      ctx.moveTo(...face[0]);
      face.slice(1).forEach(pt => ctx.lineTo(...pt));
      ctx.closePath();
      ctx.fillStyle = wash;
      ctx.fill();
      ctx.strokeStyle = '#e5f8fa98';
      ctx.lineWidth = 1.15;
      ctx.stroke();
    });
    line(ctx, tip, [x + w * .17, y - h * .1], '#ffffef9e', 2);
    line(ctx, [x - w * .29, y + h * .1], [x + w * .06, y + h * .29], '#f7fbfb67');
    charge(ctx, [x + w * .04, y + 1], sign, warm ? c.rose : c.cyan, 22);
    ctx.restore();
  }

  function crest(canvas, ending) {
    const { ctx, w, h } = surface(canvas);
    const x = w / 2, y = h * .49;
    const aura = ctx.createRadialGradient(x, y, 16, x, y, 293);
    aura.addColorStop(0, '#7cb3c94a');
    aura.addColorStop(.53, '#42678636');
    aura.addColorStop(1, '#42678600');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, w, h);
    for (const [r, phase] of [[217, .23], [188, 1.33], [162, 2.54]]) {
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * .84, -.29, phase, phase + 5.35);
      ctx.strokeStyle = '#bae4f062';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    for (let i = 0; i < 64; i += 1) {
      const angle = i * Math.PI / 32;
      line(ctx, [x + Math.cos(angle) * 212, y + Math.sin(angle) * 178],
        [x + Math.cos(angle) * (i % 4 ? 217 : 223), y + Math.sin(angle) * (i % 4 ? 182 : 188)], '#bce1eb44');
    }
    if (ending) {
      line(ctx, [x, y - 155], [x, y + 157], c.amber, 1.35, [5, 9]);
      line(ctx, [x - 134, y], [x + 134, y], '#bce1eb83');
      charge(ctx, [x - 92, y], '−', c.rose, 24);
      charge(ctx, [x + 92, y], '+', c.cyan, 24);
      for (const offset of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(x + offset * 78, y, 64, 118, .13 * offset, .7, 5.86);
        ctx.strokeStyle = offset < 0 ? '#e4a6c192' : '#9ce9e592';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    } else {
      ctx.strokeStyle = '#eea4b2';
      ctx.lineWidth = 2.85;
      ctx.beginPath();
      ctx.moveTo(58, y + 74);
      ctx.bezierCurveTo(220, y + 6, 403, y + 80, 546, y - 56);
      ctx.bezierCurveTo(497, y - 100, 441, y - 51, 563, y + 14);
      ctx.stroke();
      crystal(ctx, x - 96, y + 25, 126, 270, '−', true);
      crystal(ctx, x + 92, y - 42, 147, 315, '+');
      ctx.strokeStyle = '#ffb1bdbd';
      ctx.lineWidth = 1.55;
      ctx.beginPath();
      ctx.moveTo(62, y + 78);
      ctx.bezierCurveTo(180, y + 23, 244, y + 30, 332, y + 42);
      ctx.bezierCurveTo(451, y + 45, 486, y + 0, 554, y - 56);
      ctx.stroke();
    }
    for (let i = 0; i < 24; i += 1) {
      const angle = i * 2.399;
      const r = 113 + (i * 23 % 143);
      const pt = [x + Math.cos(angle) * r, y + Math.sin(angle) * r * .84];
      circle(ctx, pt, i % 6 === 0 ? 2 : 1, i % 5 ? '#c4e8ed9a' : '#f6b2be');
    }
  }

  function topology(canvas, plane) {
    const { ctx, h } = surface(canvas);
    const palette = plane || abyssal
      ? { text: c.frost, a: c.rose, b: c.cyan, edge: '#8cb9cb70', grid: '#89b9c521', gold: c.amber }
      : { text: '#1c4058', a: '#a44368', b: '#296a82', edge: '#4671878b', grid: '#65939523', gold: '#8c5450' };
    const origin = [320, 263], left = [184, 263], right = [456, 263];
    const pt = plane ? [320, 130] : [478, 73];
    for (let x = 60; x <= 580; x += 52) line(ctx, [x, 32], [x, h - 54], palette.grid);
    for (let y = 43; y <= h - 36; y += 44) line(ctx, [59, y], [581, y], palette.grid);
    arrow(ctx, [60, 263], [597, 263], palette.edge, 1.3);
    label(ctx, 'x', [610, 262], palette.text, 17);
    line(ctx, left, pt, palette.a, 1.8, [6, 6]);
    line(ctx, right, pt, palette.b, 1.8, [6, 6]);
    if (plane) {
      line(ctx, [320, 42], [320, 317], palette.gold, 1.35, [5, 7]);
      arrow(ctx, pt, [251, 63], palette.b, 2.4);
      arrow(ctx, pt, [251, 197], palette.a, 2.4);
      arrow(ctx, pt, [180, 130], palette.text, 3.2);
      label(ctx, 'E₊', [229, 52], palette.b);
      label(ctx, 'E₋', [226, 209], palette.a);
      label(ctx, 'E', [160, 130], palette.text);
      label(ctx, 'V = 0', [320, 342], palette.gold, 19);
    } else {
      arrow(ctx, origin, pt, palette.gold, 2.5);
      label(ctx, 'r₋', [297, 159], palette.a);
      label(ctx, 'r₊', [510, 167], palette.b);
      label(ctx, 'r', [397, 157], palette.gold);
      ctx.beginPath();
      ctx.arc(...origin, 57, -Math.atan2(190, 158), 0);
      ctx.strokeStyle = palette.gold;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      label(ctx, 'θ', [392, 233], palette.gold);
      arrow(ctx, [203, 319], [438, 319], palette.gold);
      label(ctx, 'p', [320, 335], palette.gold);
      line(ctx, [184, 357], [456, 357], palette.edge);
      for (const x of [184, 456]) line(ctx, [x, 349], [x, 365], palette.edge);
      label(ctx, 'd', [320, 371], palette.gold);
    }
    circle(ctx, pt, 5, palette.text);
    label(ctx, 'P', [pt[0] + 17, pt[1] - 15], palette.text);
    circle(ctx, origin, 3.5, palette.text);
    label(ctx, 'O', [320, 282], palette.text, 15);
    charge(ctx, left, '−', palette.a, 19);
    charge(ctx, right, '+', palette.b, 19);
    label(ctx, '−q', [184, 292], palette.a);
    label(ctx, '+q', [456, 292], palette.b);
  }

  function decay(canvas) {
    const { ctx } = surface(canvas);
    const X = n => 82 + (n - 1) * 165;
    const Y = n => 265 - n * 226;
    for (const y of [0, .25, .5, .75, 1]) {
      line(ctx, [82, Y(y)], [577, Y(y)], '#b5e7ee40');
      label(ctx, String(y).replace('.', ','), [69, Y(y)], c.dim, 17, 'right');
    }
    for (const x of [1, 2, 3, 4]) {
      line(ctx, [X(x), 265], [X(x), 273], c.dim);
      label(ctx, String(x), [X(x), 287], c.dim, 17);
    }
    label(ctx, 'V / V(r₀)', [82, 17], c.cyan, 17, 'left');
    label(ctx, 'r / r₀', [577, 315], c.cyan, 17, 'right');
    ctx.beginPath();
    ctx.moveTo(X(1), Y(1));
    for (let i = 1; i <= 120; i += 1) {
      const x = 1 + i / 40;
      ctx.lineTo(X(x), Y(1 / x ** 2));
    }
    ctx.strokeStyle = c.cyan;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.lineTo(X(4), Y(0));
    ctx.lineTo(X(1), Y(0));
    const wash = ctx.createLinearGradient(0, 40, 0, 265);
    wash.addColorStop(0, '#a4e4e465');
    wash.addColorStop(1, '#a4e4e400');
    ctx.fillStyle = wash;
    ctx.fill();
    for (const [x, name] of [[2, '0,25'], [3, '0,11']]) {
      const y = Y(1 / x ** 2);
      line(ctx, [X(x), 265], [X(x), y], '#ffbdc29a', 1, [4, 6]);
      circle(ctx, [X(x), y], 5, c.rose);
      label(ctx, name, [X(x) + 13, y - 13], c.rose, 18, 'left');
    }
  }

  function makeSum(canvas) {
    const { ctx, w, h } = surface(canvas);
    return function draw(x) {
      const left = [w / 2 - 36, 169], right = [w / 2 + 36, 169];
      const point = [w / 2 + x * 1800, 59.2];
      ctx.clearRect(0, 0, w, h);
      line(ctx, [36, 169], [w - 36, 169], '#b6cfdc73');
      line(ctx, [w / 2, 29], [w / 2, 204], '#eddbab72', 1, [5, 7]);
      for (const [position, tint, name, offset] of [[left, c.rose, 'r₋', -16], [right, c.cyan, 'r₊', 17]]) {
        line(ctx, position, point, tint, 1.5, [5, 5]);
        label(ctx, name, [(position[0] + point[0]) / 2 + offset, 111], tint, 17);
      }
      charge(ctx, left, '−', c.rose);
      charge(ctx, right, '+', c.cyan);
      charge(ctx, point, 'P', c.amber, 17);
      const height = .061;
      return [-kq / Math.hypot(x + d / 2, height), kq / Math.hypot(x - d / 2, height)];
    };
  }

  function makeMap(canvas) {
    const { ctx, w, h } = surface(canvas);
    const frame = { left: 46, top: 19, right: w - 19, bottom: h - 39 };
    const center = [w / 2, 198], scale = 545;
    const levels = [-120, -40, -15, -5, 5, 15, 40, 120];
    const base = document.createElement('canvas');
    base.width = w;
    base.height = h;
    const film = base.getContext('2d');
    film.fillStyle = abyssal ? '#100d21' : '#101f33';
    film.fillRect(0, 0, w, h);
    film.save();
    film.beginPath();
    film.rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
    film.clip();
    const tile = 5;
    const cols = Math.ceil(w / tile), rows = Math.ceil(h / tile);
    const grid = Array.from({ length: rows + 1 }, (_, y) =>
      Array.from({ length: cols + 1 }, (_, x) => potential((x * tile - center[0]) / scale, (center[1] - y * tile) / scale)));
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const v = potential(((col + .5) * tile - center[0]) / scale, (center[1] - (row + .5) * tile) / scale);
        const level = Math.min(1, Math.log1p(Math.abs(v) / 4) / 4);
        film.fillStyle = v < 0 ? 'rgba(160,89,128,' + level * .56 + ')' : 'rgba(52,167,185,' + level * .55 + ')';
        film.fillRect(col * tile, row * tile, tile, tile);
      }
    }
    for (let cm = -50; cm <= 50; cm += 10) {
      const x = center[0] + cm * scale / 100, y = center[1] - cm * scale / 100;
      line(film, [x, frame.top], [x, frame.bottom], '#abcbe531');
      line(film, [frame.left, y], [frame.right, y], '#abcbe531');
    }
    for (const level of levels) {
      film.strokeStyle = level < 0 ? '#f5b8caad' : '#a7eef0b5';
      film.lineWidth = 1.05;
      film.beginPath();
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const v = [grid[row][col], grid[row][col + 1], grid[row + 1][col + 1], grid[row + 1][col]];
          const coords = [[0, 0], [1, 0], [1, 1], [0, 1]];
          const crossings = [];
          for (let i = 0; i < 4; i += 1) {
            const next = (i + 1) % 4;
            if ((v[i] >= level) === (v[next] >= level)) continue;
            const weight = (level - v[i]) / (v[next] - v[i]);
            crossings.push(coords[i].map((n, j) => ((j ? row : col) + n + weight * (coords[next][j] - n)) * tile));
          }
          if (crossings.length === 4) {
            const local = potential(((col + .5) * tile - center[0]) / scale, (center[1] - (row + .5) * tile) / scale);
            if ((local >= level) !== (v[0] >= level)) crossings.push(crossings.shift());
          }
          for (let i = 0; i < crossings.length; i += 2) {
            film.moveTo(...crossings[i]);
            film.lineTo(...crossings[i + 1]);
          }
        }
      }
      film.stroke();
    }
    film.restore();
    film.strokeStyle = '#c2d7e16f';
    film.lineWidth = 1;
    film.strokeRect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
    line(film, [center[0], frame.top], [center[0], frame.bottom], c.amber, 1.45, [6, 7]);
    line(film, [frame.left, center[1]], [frame.right, center[1]], '#d8ebf08c');
    for (const tick of [-40, -20, 0, 20, 40]) label(film, String(tick).replace('-', '−'), [center[0] + tick * scale / 100, h - 22], c.dim, 13);
    for (const tick of [-30, -20, -10, 0, 10, 20, 30]) label(film, String(tick).replace('-', '−'), [38, center[1] - tick * scale / 100], c.dim, 13, 'right');
    label(film, 'x (cm)', [frame.right, h - 13], c.frost, 14, 'right');
    film.save();
    film.translate(12, center[1]);
    film.rotate(-Math.PI / 2);
    label(film, 'y (cm)', [0, 0], c.frost, 14);
    film.restore();
    label(film, 'V = 0', [center[0] + 12, frame.bottom - 12], c.amber, 13, 'left');
    for (const value of [5, 15, 40]) {
      const radius = Math.sqrt((d / 2) ** 2 + kq * d / value) * scale;
      for (const sign of [-1, 1]) {
        const x = center[0] + sign * radius;
        label(film, (sign < 0 ? '−' : '+') + value + ' V', [x, center[1] + 16], sign < 0 ? c.rose : c.cyan, 12);
      }
    }

    return {
      draw(r, degrees) {
        const angle = degrees * Math.PI / 180;
        const probe = [center[0] + Math.cos(angle) * r * scale, center[1] - Math.sin(angle) * r * scale];
        ctx.drawImage(base, 0, 0);
        line(ctx, center, probe, c.amber, 1.9);
        if (degrees > 0 && r > .075) {
          ctx.beginPath();
          ctx.arc(...center, 36, -angle, 0);
          ctx.strokeStyle = '#eddbabac';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          label(ctx, 'θ', [center[0] + 51 * Math.cos(angle / 2), center[1] - 51 * Math.sin(angle / 2)], c.amber, 16);
        }
        charge(ctx, [center[0] - scale * d / 2, center[1]], '−', c.rose, 8);
        charge(ctx, [center[0] + scale * d / 2, center[1]], '+', c.cyan, 8);
        circle(ctx, probe, 6.7, '#142638', c.amber);
        label(ctx, 'P', [probe[0] + 12, probe[1] + (probe[1] < 43 ? 21 : -14)], c.amber, 20, 'left');
      },
      position(event) {
        const box = canvas.getBoundingClientRect();
        const x = (event.clientX - box.left) * w / box.width - center[0];
        const y = Math.max(0, center[1] - (event.clientY - box.top) * h / box.height);
        return [Math.max(.03, Math.min(.32, Math.hypot(x, y) / scale)), Math.atan2(y, x) * 180 / Math.PI];
      }
    };
  }

  window.DipolePlots = { kq, d, volts, potential, crest, topology, decay, makeSum, makeMap };
})();

