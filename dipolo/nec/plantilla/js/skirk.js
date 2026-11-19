/* Vocabulario de movimiento abisal, sin arte ni personajes del juego.
   Referencia primaria: HoYoverse, presentación de Skirk / versión 5.7:
   https://blog.playstation.com/2025/06/06/genshin-impact-version-5-7-arrives-with-skirk-on-june-18/
   Grietas absorbidas, desplazamiento veloz, ráfagas de cortes. Cada composición
   responde al diagrama que recibe; los gestos no representan fenómenos físicos.
   Las especiales cleave / absorb / converge / collapse / fracture siguen en main.
*/
(() => {
  'use strict';
  const W = 1920, H = 1080, NS = 'http://www.w3.org/2000/svg';
  const profiles = {
    s01: { name: 'Nacimiento del vacío', mode: 'star', x: 1440, y: 540, duration: 1500 },
    s02: { name: 'Constelación de cinco destinos', mode: 'route', x: 960, y: 640, duration: 1420 },
    s04: { name: 'Órbita de seis condiciones', mode: 'orbit', x: 700, y: 640, duration: 1480 },
    s05: { name: 'Cinco planos de resguardo', mode: 'gates', x: 730, y: 470, duration: 1420 },
    s06: { name: 'Ecos del tiempo', mode: 'echo', x: 960, y: 660, duration: 1400 },
    s07: { name: 'Absorción de energía', mode: 'gravity', x: 1390, y: 580, duration: 1520 },
    s08: { name: 'Siete cortes encadenados', mode: 'seven', x: 960, y: 480, duration: 1540 },
    s09: { name: 'Umbral entre mundos', mode: 'horizon', x: 960, y: 830, duration: 1440 },
    s10: { name: 'Dos naturalezas', mode: 'wave', x: 960, y: 540, duration: 1480 },
    s11: { name: 'Expansión del límite', mode: 'boundary', x: 220, y: 620, duration: 1480 },
    s12: { name: 'Ensamblaje en serie', mode: 'series', x: 960, y: 550, duration: 1520 },
    s17: { name: 'Restitución del orden', mode: 'pyramid', x: 590, y: 600, duration: 1560 },
    s18: { name: 'Iris del instante', mode: 'iris', x: 1650, y: 230, duration: 1420 },
    s19: { name: 'Última estrella', mode: 'silence', x: 960, y: 870, duration: 1700 },
    R1: { name: 'Prisma de máxima potencia', mode: 'prism', x: 940, y: 540, duration: 1450 },
    R2: { name: 'Estratos de cristal', mode: 'strata', x: 960, y: 600, duration: 1500 },
    R3: { name: 'Ascenso etéreo', mode: 'plume', x: 960, y: 700, duration: 1550 },
    R4: { name: 'Tres fisuras', mode: 'trident', x: 960, y: 540, duration: 1380 },
    R5: { name: 'Atlas de estrellas', mode: 'atlas', x: 960, y: 540, duration: 1500 },
    R6: { name: 'Entrada al espacio forense', mode: 'corridor', x: 960, y: 570, duration: 1540 }
  };
  const special = { s03: 'Tajo de cristal', s13: 'Inmersión en la celda 119', s14: 'Convergencia química', s15: 'Colapso de las barreras', s16: 'Fractura del accidente' };
  let stage, root, active = null, serial = 0, ease, out;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const key = s => s.dataset.backup || s.id;
  const point = (x, y) => [Number(x.toFixed(2)), Number(y.toFixed(2))];
  const polygon = points => `polygon(${points.map(p => `${p[0]}px ${p[1]}px`).join(',')})`;
  const line = points => points.map((p, i) => `${i ? 'L' : 'M'}${p.join(' ')}`).join(' ');
  const rectangle = (x, y, w, h) => [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
  function svg(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k, v));
    parent.appendChild(e);
    return e;
  }
  function animate(el, frames, timing) {
    const a = el.animate(frames, { fill: 'both', easing: out, ...timing });
    active.animations.push(a);
    return a;
  }
  function cleanup() {
    if (!active) return;
    clearTimeout(active.timer);
    active.animations.forEach(a => a.cancel());
    active.nodes.forEach(n => n.remove());
    if (active.prev && !active.prev.classList.contains('is-active')) {
      active.prev.classList.remove('is-leaving');
      active.prev.style.zIndex = '';
    }
    active = null;
  }

  // Every aperture ends beyond ALL four corners, including off-centre anchors.
  function aperture(p, q) {
    const r = Math.max(...[[0,0],[W,0],[W,H],[0,H]].map(([x,y]) => Math.hypot(x-p.x,y-p.y))) + 100;
    switch (p.mode) {
      case 'star': case 'gravity': case 'boundary': case 'orbit': case 'iris':
        return `circle(${(r*q).toFixed(2)}px at ${p.x}px ${p.y}px)`;
      case 'horizon': case 'silence': case 'echo': {
        const h = Math.max(p.y, H-p.y)+20;
        return `inset(${Math.max(0,p.y-h*q)}px 0 ${Math.max(0,H-p.y-h*q)}px 0)`;
      }
      case 'prism': case 'trident': {
        const d = 3100*q;
        return polygon([[p.x-d,p.y],[p.x,p.y-d*.7],[p.x+d,p.y],[p.x,p.y+d*.7]]);
      }
      case 'corridor': {
        const w = 1160*q, h = 750*q, b = 170*q;
        return polygon([[960-w+b,570-h],[960+w-b,570-h],[960+w,570-h+b],
          [960+w,570+h-b],[960+w-b,570+h],[960-w+b,570+h],[960-w,570+h-b],[960-w,570-h+b]]);
      }
      case 'pyramid': {
        const d = 5000*q;
        return polygon([[p.x-d,p.y-d],[p.x+d,p.y-d],[p.x,p.y+d]]);
      }
      case 'wave': case 'plume': {
        const pts = Array.from({length:33}, (_,i) => {
          const x = i*W/32;
          const y = (1-q)*(H+180)-q*180 + Math.sin(i/32*Math.PI*(p.mode==='wave'?4:2))*95*Math.sin(q*Math.PI);
          return point(x,y);
        });
        return polygon([[0,H+200],...pts,[W,H+200]]);
      }
      case 'series': case 'strata': {
        const y = H*(1-q);
        return polygon([[0,y],[W,y],[W,H],[0,H]]);
      }
      default: {
        const x = -340 + (W+680)*q;
        return polygon([[-400,-100],[x,-100],[x+280,H+100],[-400,H+100]]);
      }
    }
  }


  // Real pieces of the outgoing slide, at most six DOM copies (never the WebGL
  // reconstruction). Clone ids are namespaced so gradients/clipPaths stay local.
  function clonePiece(source, pts, pivot) {
    const xs=pts.map(v=>v[0]),ys=pts.map(v=>v[1]);
    const x=Math.max(0,Math.min(...xs)),y=Math.max(0,Math.min(...ys));
    const w=Math.min(W,Math.max(...xs))-x,h=Math.min(H,Math.max(...ys))-y;
    const frame=document.createElement('div');
    frame.className='abyss-piece';
    frame.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform-origin:${pivot[0]-x}px ${pivot[1]-y}px`;
    const c=source.cloneNode(true), prefix=`tx-${++serial}-`, ids=new Map();
    c.dataset.snapshot=source.id;
    [c,...c.querySelectorAll('[id]')].forEach(n=>{
      if(n.id) { ids.set(n.id,prefix+n.id); n.id=prefix+n.id; }
    });
    c.querySelectorAll('*').forEach(n=>{
      [...n.attributes].forEach(a=>{
        let v=a.value.replace(/url\(#([^)]*)\)/g,(m,id)=>ids.has(id)?`url(#${ids.get(id)})`:m);
        if((a.name==='href'||a.name==='xlink:href')&&ids.has(v.slice(1))) v='#'+ids.get(v.slice(1));
        if(v!==a.value)n.setAttribute(a.name,v);
      });
    });
    c.querySelectorAll('.notes,.abyss-accent,canvas').forEach(n=>n.remove());
    c.classList.remove('is-active'); c.classList.add('is-leaving');
    c.style.cssText=`inset:auto;left:${-x}px;top:${-y}px;width:${W}px;height:${H}px;clip-path:${polygon(pts)};pointer-events:none`;
    c.setAttribute('aria-hidden','true'); c.inert=true;
    frame.appendChild(c);root.appendChild(frame);active.nodes.push(frame);
    return frame;
  }
  function pieces(p) {
    const n = p.mode==='seven'?6:p.mode==='trident'?3:p.mode==='wave'?2:p.mode==='orbit'?6:5;
    const radial=['star','gravity','orbit','boundary','iris','prism'].includes(p.mode);
    return Array.from({length:n},(_,i)=>{
      let pts,dx,dy,rot=0,k=.96;
      if(radial) {
        const a=i*Math.PI*2/n,b=(i+1)*Math.PI*2/n,mid=(a+b)/2;
        pts=[[p.x,p.y],point(p.x+3500*Math.cos(a),p.y+3500*Math.sin(a)),point(p.x+3500*Math.cos(b),p.y+3500*Math.sin(b))];
        // Polygons are clipped to the stage by the fragment's bounded frame.
        dx=Math.cos(mid)*440;dy=Math.sin(mid)*350;rot=(i%2?1:-1)*9;
        if(p.mode==='gravity'){ dx=-Math.cos(mid)*110;dy=-Math.sin(mid)*110;k=.12;rot=25; }
      } else if(['echo','horizon','strata','pyramid','silence'].includes(p.mode)) {
        pts=rectangle(0,i*H/n,W,H/n+.5);dx=(i%2?1:-1)*430;dy=(i-(n-1)/2)*75;
        if(p.mode==='pyramid'){dx=0;dy=150;k=.65;}
        if(p.mode==='silence'){dx=0;dy=(p.y-(i+.5)*H/n)*.4;k=1;}
      } else {
        const a=i*W/n,b=(i+1)*W/n;
        const slant=['route','seven','trident'].includes(p.mode)?120:0;
        const left=i===0?a-slant:a, right=i===n-1?b+slant:b;
        pts=[[left,0],[right,0],[right,H],[left,H]].map(([x,y])=>[x+slant*(y/H-.5),y]);
        dx=(i-(n-1)/2)*70;dy=(i%2?1:-1)*350;rot=(i-(n-1)/2)*3;
        if(p.mode==='plume'){dx=(i-(n-1)/2)*40;dy=-450-i*50;rot=0;}
        if(p.mode==='corridor'){dx=(i-(n-1)/2)*320;dy=0;rot=0;k=1.08;}
      }
      return {pts,dx,dy,rot,k,delay:i*42};
    });
  }

  // Void VFX, not CAD ornaments: black tears and sharp floating facets.
  // Sword trails were removed because they competed with the transition itself.
  // No filters, animated turbulence, video, textures or perpetual particle loop.
  function vfxLayer(x,y,w,h,angle=0) {
    const el=svg('svg',{viewBox:'-600 -400 1200 800',preserveAspectRatio:'none',class:'abyss-vfx'},root);
    el.style.cssText=`left:${x-w/2}px;top:${y-h/2}px;width:${w}px;height:${h}px;transform:rotate(${angle}deg)`;
    const id=`void-${++serial}`,defs=svg('defs',{},el);
    const edge=svg('linearGradient',{id:id+'-edge',x1:'0%',y1:'0%',x2:'100%',y2:'100%'},defs);
    [[0,'#3440bb'],[.24,'#9270ff'],[.48,'#f0faff'],[.60,'#65d7ff'],[.81,'#7650d6'],[1,'#201349']].forEach(([n,c])=>svg('stop',{offset:n,'stop-color':c},edge));
    const body=svg('radialGradient',{id:id+'-body',cx:'42%',cy:'48%',r:'66%'},defs);
    [[0,'#010208'],[.52,'#060416'],[.76,'#25165c'],[.9,'#46348a'],[1,'#88baff']].forEach(([n,c])=>svg('stop',{offset:n,'stop-color':c},body));
    active.nodes.push(el);
    return {el,id,angle};
  }
  function pulse(el,p,delay,from,impact,to,peak=.95) {
    animate(el,[{opacity:0,transform:from,offset:0},
      {opacity:peak*.55,transform:from,offset:.12},
      {opacity:peak,transform:impact,offset:.30},
      {opacity:peak*.78,transform:impact,offset:.50},
      {opacity:0,transform:to,offset:1}],
      {duration:p.duration-delay-60,delay,easing:'cubic-bezier(.16,.75,.25,1)',direction:active.back?'reverse':'normal'});
  }
  function rift(p,x,y,size,angle,delay=0,absorb=false) {
    const {el,id}=vfxLayer(x,y,size*.8,size,angle);
    // Asymmetric serrated silhouette: never a smooth circular portal / diamond.
    const d='M-38 -370 L32 -288 16 -241 104 -205 67 -151 160 -80 113 -22 185 45 129 93 162 157 80 143 62 228 5 205 -22 373 -60 260 -100 281 -83 178 -170 130 -134 69 -200 25 -133 -39 -159 -96 -94 -150 -109 -236 -53 -217 Z';
    svg('path',{d,fill:'none',stroke:`url(#${id}-edge)`,'stroke-width':20,opacity:.16},el);
    svg('path',{d,fill:`url(#${id}-body)`,stroke:`url(#${id}-edge)`,'stroke-width':2.5},el);
    svg('path',{d:'M-38 -370 L32 -288 -15 -162Z M104 -205 L67 -151 22 45Z M185 45 L129 93 28 81Z M-22 373 L-60 260 -9 160Z M-170 130 L-134 69 -25 12Z',fill:`url(#${id}-edge)`,opacity:.48},el);
    svg('path',{d:'M-38 -370 L32 -288 16 -241 M160 -80 L113 -22 M162 157 L80 143 62 228 M-22 373 L-60 260 M-200 25 L-133 -39',fill:'none',stroke:'#c7ebff','stroke-width':1.7,opacity:.8},el);
    for(let i=0;i<17;i++) {
      const xx=Math.sin(i*4.71)*82,yy=-215+(i*79)%420,r=i%4===0?7:2;
      svg('path',{d:`M${xx} ${yy-r}l${r*.22} ${r*.78} ${r*.78} ${r*.22} -${r*.78} ${r*.22} -${r*.22} ${r*.78} -${r*.22} -${r*.78} -${r*.78} -${r*.22} ${r*.78} -${r*.22}Z`,fill:'#c1cbff',opacity:.35+i%3*.2},el);
    }
    const base=`rotate(${angle}deg)`;
    pulse(el,p,delay,`${base} scale(.06,.8)`,`${base} scale(1)`,absorb?
      `translate(${p.x-x}px,${p.y-y}px) rotate(${angle+80}deg) scale(.02)`:
      `${base} scale(1.35,.72)`,.96);
  }
  function facets(p,x,y,count=9,delay=100,inward=false) {
    const {el,id}=vfxLayer(x,y,1100,820);
    for(let i=0;i<count;i++) {
      const a=i*2.399, radius=160+(i%3)*85;
      const xx=Math.cos(a)*radius,yy=Math.sin(a)*radius*.78;
      const g=svg('g',{transform:`translate(${xx} ${yy}) rotate(${i*71})`},el);
      const z=18+i%4*9;
      svg('path',{d:`M0 ${-z*2}L${z*.7} 0 0 ${z} ${-z*.7} ${z*.4}Z`,fill:`url(#${id}-body)`,stroke:'#8279e5','stroke-width':1},g);
      svg('path',{d:`M0 ${-z*2}L${z*.7} 0 0 ${z}Z`,fill:`url(#${id}-edge)`,opacity:.8},g);
      svg('path',{d:`M0 ${-z*2}L-3 0 0 ${z}`,fill:'none',stroke:'#c9f4ff','stroke-width':1.4},g);
    }
    pulse(el,p,delay,inward?'scale(1.7) rotate(-12deg)':'scale(.32) rotate(-12deg)',
      'scale(1) rotate(0deg)',inward?'scale(.02) rotate(35deg)':'scale(1.5) rotate(18deg)',.82);
  }
  function play(prev, next, back) {
    const p=profiles[key(back&&prev?prev:next)];
    if(media.matches) return false;
    if(!p) {
      // Only the cell-119 absorption keeps a void prelude. The four other
      // engineering transformations retain their original animation alone.
      const id=key(back&&prev?prev:next);
      if(id!=='s13') return false;
      cleanup(); active={prev:null,back,nodes:[],animations:[],timer:0};
      const q={duration:1080,x:960,y:540};
      if(id==='s13') {
        // Match the cell, not an unrelated point of the battery rack.
        const box=(back?prev?.dataset.focus:prev?.dataset.zoom)?.split(' ').map(Number);
        [q.x,q.y]=box?.length===4?[box[0]+box[2]/2,box[1]+box[3]/2]:[897,372];
        rift(q,q.x,q.y,540,-24,0,true);facets(q,q.x,q.y,7,0,true);
      }
      active.timer=setTimeout(cleanup,1120);
      return false;
    }
    cleanup();
    active={prev,back,nodes:[],animations:[],timer:0};
    root.dataset.direction=back?'back':'forward';
    root.style.setProperty('--abyss-tone',getComputedStyle(stage).getPropertyValue('--acc'));
    const duration=p.duration;
    // Rewind the same aperture; no arbitrary new effect when going backwards.
    const frames=Array.from({length:25},(_,i)=>({clipPath:aperture(p,i/24)}));
    if(prev && back) {
      prev.style.zIndex=4;
      animate(prev,frames.slice().reverse(),{duration,easing:ease});
      animate(next,[{opacity:0},{opacity:1}],{duration:duration*.5});
    } else {
      if(prev) {
        const safeToClone=!prev.querySelector('canvas')&&prev.id!=='r6';
        if(safeToClone) {
          pieces(p).forEach(({pts,dx,dy,rot,k,delay})=>{
            const piece=clonePiece(prev,pts,[p.x,p.y]);
            animate(piece,[{opacity:1,transform:'none'},{opacity:.9,offset:.24},
              {opacity:0,transform:`translate(${dx}px,${dy}px) rotate(${rot}deg) scale(${k})`}],
              {duration:duration*.72,delay,easing:ease});
          });
          animate(prev,[{opacity:0},{opacity:0}],{duration});
        } else animate(prev,[{opacity:1},{opacity:0}],{duration:duration*.5});
      }
      animate(next,frames,{duration:duration-200,delay:200,easing:ease});
    }
    active.timer=setTimeout(cleanup,duration+340);
    return true;
  }

  // Small fixed accents in the empty outer margin. No animated text, decorative
  // particles or fictional measurements over technical diagrams during reading.
  function mount(slides) {
    slides.forEach((s,i)=>{
      const p=profiles[key(s)], mode=p?.mode||['cleave','cell','triangle','collapse','fracture'][Object.keys(special).indexOf(s.id)];
      s.dataset.signature=p?.name||special[s.id];
      s.dataset.abyss=mode;
      const accent=svg('svg',{viewBox:'0 0 1920 1080',class:'abyss-accent','aria-hidden':'true'},s);
      const x=1847,cy=430+(i%4)*55;
      // Distinct compact silhouettes: orbital, planar, crystalline or star chart.
      if(['orbit','boundary','iris','star','silence'].includes(mode)) {
        [18,31,45].forEach((r,j)=>svg('path',{d:line(Array.from({length:25},(_,k)=>{
          const a=(k/24*1.5+j*.2)*Math.PI;return point(x+r*Math.cos(a),cy+r*Math.sin(a));
        })),class:'accent-line'},accent));
      } else if(['route','atlas','seven','series'].includes(mode)) {
        const n=mode==='seven'?7:mode==='atlas'?6:5;
        const pts=Array.from({length:n},(_,j)=>[x+(j%2?18:-18),cy-110+j*40]);
        svg('path',{d:line(pts),class:'accent-line'},accent);
        pts.forEach(([xx,yy])=>svg('path',{d:`M${xx} ${yy-4}l4 4 -4 4 -4 -4Z`,class:'accent-gem'},accent));
      } else {
        const n=mode==='trident'?3:mode==='strata'?7:4;
        for(let j=0;j<n;j++){
          const yy=cy+j*32;
          svg('path',{d:`M${x-28+j*3} ${yy+12}l${40-j*4} -25 -12 31Z`,class:'accent-line'},accent);
        }
      }
      svg('path',{d:`M73 ${760-i%5*32}v92m-4-46h8`,class:'accent-line'},accent);
    });
  }
  function init(s, slides) {
    stage=s;
    const style=getComputedStyle(stage);
    ease=style.getPropertyValue('--ease-inout').trim();out=style.getPropertyValue('--ease-out').trim();
    root=document.createElement('div');root.className='abyss-transition';root.setAttribute('aria-hidden','true');root.inert=true;
    stage.appendChild(root);mount(slides);
    // Keep state-dependent technical styling in snapshots (e.g. only the active
    // 250 V OR 281 V values). Never retain duplicate original DOM ids.
    const aliases=[];
    function collect(rules) {
      for(const rule of rules) {
        if(rule.selectorText && /#s\d{2}\b/.test(rule.selectorText)) {
          aliases.push(`${rule.selectorText.replace(/#(s\d{2})\b/g,'[data-snapshot="$1"]')}{${rule.style.cssText}}`);
        }
      }
    }
    for(const sheet of document.styleSheets) {
      try { collect(sheet.cssRules); } catch { /* Cross-origin font sheet has no scene rules. */ }
    }
    const snapshotStyle=document.createElement('style');
    snapshotStyle.textContent=aliases.join('\n');document.head.appendChild(snapshotStyle);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cleanup();});
  media.addEventListener('change',()=>{if(media.matches)cleanup();});
  window.AbyssTransitions=Object.freeze({init,play,cancel:cleanup});
})();
