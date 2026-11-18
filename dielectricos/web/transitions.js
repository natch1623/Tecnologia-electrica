/* run(from,to,{fromIndex,toIndex,direction}), open(el), cancel(), isActive.
 * data-slide is 1-based; fallback indices are 0-based. Await before app commit.
 * Cleanup restores original hidden/temporary styles. Result: {cancelled,effect}.
 * All scenery is original DOM decoration: slides/scientific SVGs are never cloned.
 */
(() => {
  'use strict';
  const OUT='cubic-bezier(0.23,1,0.32,1)', INOUT='cubic-bezier(0.77,0,0.175,1)';
  const mobile=matchMedia('(max-width:700px)'), reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let active=null;
  function node(parent,name,style={}) { const el=document.createElement('div');el.className=name;Object.assign(el.style,style);parent.append(el);return el; }
  function transaction(stage,elements,effect) {
    let resolve,settled=false,watchdog;
    const promise=new Promise(done=>{resolve=done;});
    const hidden=new Map(elements.map(el=>[el,el.hidden])),saved=new Map(),animations=[],properties=new Map();
    const hadRunning=stage.classList.contains('dt-running');let overlay;
    const tx={promise,effect,animations,
      style(el,key,value) {if(!saved.has(el))saved.set(el,new Map());const props=saved.get(el);if(!props.has(key))props.set(key,[el.style.getPropertyValue(key),el.style.getPropertyPriority(key)]);el.style.setProperty(key,value);},
      animate(el,frames,duration,delay=0,easing=OUT) {
        const keys=new Set(frames.flatMap(frame=>Object.keys(frame)).filter(key=>!['offset','easing','composite'].includes(key)));
        const previous=properties.get(el)||new Set();
        const continuation=delay>0&&[...keys].some(key=>previous.has(key));
        const animation=el.animate(frames,{duration,delay,easing,fill:continuation?'forwards':'both'});
        properties.set(el,new Set([...previous,...keys]));animations.push(animation);return animation;
      },
      overlay() {if(!overlay){overlay=node(stage,`dt-overlay dtx-scene dtx-effect-${effect}`);overlay.setAttribute('aria-hidden','true');}return overlay;},
      finish(cancelled=false) {
        if(settled)return;settled=true;clearTimeout(watchdog);
        animations.forEach(animation=>animation.cancel());overlay?.remove();
        for(const[el,props]of saved)for(const[key,[value,priority]]of props)value?el.style.setProperty(key,value,priority):el.style.removeProperty(key);
        for(const[el,value]of hidden)el.hidden=value;
        if(!hadRunning)stage.classList.remove('dt-running');if(active===tx)active=null;resolve({cancelled,effect});
      },
      play() {clearTimeout(watchdog);watchdog=setTimeout(()=>tx.finish(),2600);Promise.all(animations.map(a=>a.finished.catch(()=>null))).then(()=>tx.finish());}
    };
    stage.classList.add('dt-running');active=tx;watchdog=setTimeout(()=>tx.finish(),2600);return tx;
  }
  function cancel(){active?.finish(true);}
  function position(tx,from,to){for(const el of[from,to]){tx.style(el,'position','absolute');tx.style(el,'left','0');tx.style(el,'top','0');tx.style(el,'margin','0');el.hidden=false;}tx.style(from,'z-index','2');tx.style(to,'z-index','1');}
  function scene(tx,duration){
    const root=tx.overlay(),night=node(root,'dtx-night'),frame=node(root,'dtx-frame');
    tx.animate(night,[{opacity:0},{opacity:1,offset:.21},{opacity:1,offset:.54},{opacity:0}],duration,0,INOUT);
    tx.animate(frame,[{transform:'scale(.94)',opacity:0},{transform:'scale(1)',opacity:1,offset:.32},{transform:'scale(1.05)',opacity:0}],duration);
    if(window.DielectricOrnaments){
      const lace=node(root,'electro-scene dtx-filigree-scene');
      lace.innerHTML=window.DielectricOrnaments.build(0);
      tx.animate(lace,[{transform:'scale(.94) rotate(-3deg)',opacity:0},{transform:'scale(1) rotate(0)',opacity:.85,offset:.3},{transform:'scale(1.07) rotate(3deg)',opacity:0}],duration);
    }
    return root;
  }
  function swap(tx,from,to,duration){position(tx,from,to);tx.animate(from,[{opacity:1},{opacity:0}],260,80);tx.animate(to,[{opacity:0},{opacity:1}],220,Math.min(420,duration*.35));}
  function sparkle(tx,root,duration,count=10,radial=false){
    for(let i=0;i<count;i++){
      const angle=(i/count)*Math.PI*2, x=radial?640+Math.cos(angle)*150:80+(i*179)%1120,y=radial?360+Math.sin(angle)*100:50+(i*113)%610;
      const el=node(root,i%3===0?'dtx-star':'dtx-fleck',{left:`${x}px`,top:`${y}px`});
      const dx=radial?Math.cos(angle)*390:-100-i*7,dy=radial?Math.sin(angle)*260:-100+(i%4)*60;
      tx.animate(el,[{transform:'translate(0,0) rotate(0deg) scale(.35)',opacity:0},{opacity:.95,offset:.25},{transform:`translate(${dx}px,${dy}px) rotate(${45+i*20}deg) scale(.15)`,opacity:0}],duration*.68,duration*.14+(i%4)*25);
    }
  }
  function orbits(tx,root,duration,count=2){for(let i=0;i<count;i++){const ring=node(root,`dtx-orbit${i%2?' gold':''}`);tx.animate(ring,[{transform:`rotate(${-65+i*70}deg) scale(.7)`,opacity:0},{opacity:.8,offset:.3},{transform:`rotate(${100+i*90}deg) scale(1.5)`,opacity:0}],duration,0,INOUT);}}
  function fade(tx,from,to,duration){
    if(mobile.matches){
      const first=tx.animate(from,[{opacity:1},{opacity:0}],duration/2);
      first.finished.then(()=>{if(active!==tx)return;from.hidden=true;to.hidden=false;tx.animate(to,[{opacity:0},{opacity:1}],duration/2);tx.play();}).catch(()=>tx.finish(true));return false;
    }
    position(tx,from,to);tx.animate(from,[{opacity:1},{opacity:0}],duration);tx.animate(to,[{opacity:0},{opacity:1}],duration);return true;
  }
  function veil(tx,from,to){
    const d=1180;swap(tx,from,to,d);const root=scene(tx,d);
    for(let i=0;i<3;i++){
      const cloth=node(root,`dtx-veil${i===1?' secondary':''}`);
      tx.animate(cloth,[{transform:`translate(110%,-40%) rotate(${-15+i*5}deg)`,opacity:0},{transform:`translate(${i*4}%,0) rotate(0deg)`,opacity:1,offset:.36},{transform:'translate(-115%,45%) rotate(12deg)',opacity:0}],d-i*65,i*35,INOUT);
      const stitch=node(root,'dtx-stitch',{width:'920px',left:'120px',top:`${220+i*85}px`});
      tx.animate(stitch,[{transform:'rotate(-28deg) scaleX(0)',opacity:0},{transform:'rotate(-28deg) scaleX(1)',opacity:1,offset:.45},{transform:'translate(-450px,180px) rotate(-28deg) scaleX(1)',opacity:0}],800,120+i*45);
    }
    sparkle(tx,root,d,13);
  }
  function weave(tx,from,to){
    const d=1200;swap(tx,from,to,d);const root=scene(tx,d);orbits(tx,root,d);
    for(let i=0;i<8;i++){
      const wire=node(root,'dtx-wire thick',{left:`${-120+(i%2)*700}px`,top:`${40+i*84}px`,width:'760px'});
      const sign=i%2?-1:1;
      tx.animate(wire,[{transform:`rotate(${sign*16}deg) scaleX(0)`,opacity:0},{transform:`rotate(${sign*16}deg) scaleX(1)`,opacity:1,offset:.42},{transform:`translate(${sign*170}px,0) rotate(${sign*16}deg) scaleX(1.15)`,opacity:0}],820,i*35+70);
    }
    sparkle(tx,root,d,18);
  }
  function cuts(tx,from,to){
    const d=1150;swap(tx,from,to,d);const root=scene(tx,d);
    for(let i=0;i<2;i++){
      const panel=node(root,`dtx-cut-panel${i?' lower':''}`),sign=i?1:-1;
      tx.animate(panel,[{opacity:0},{opacity:1,offset:.2},{opacity:1,offset:.48},{transform:`translate(${sign*70}%,${sign*110}%)`,opacity:0}],d,0,INOUT);
    }
    for(let i=0;i<5;i++){
      const blade=node(root,`dtx-blade${i%2?' gold':''}`,{top:`${37+i*7}%`});
      tx.animate(blade,[{transform:`rotate(${-31+i*1.4}deg) scaleX(0)`,opacity:0},{transform:`rotate(${-31+i*1.4}deg) scaleX(1)`,opacity:1,offset:.42},{transform:`translate(${i*35}px,-30px) rotate(${-31+i*1.4}deg) scaleX(1.1)`,opacity:0}],620,120+i*45);
    }
    sparkle(tx,root,d,18,true);
  }
  function echoes(tx,from,to){
    const d=1050;swap(tx,from,to,d);const root=scene(tx,d);
    for(let i=0;i<5;i++){
      const ribbon=node(root,`dtx-ribbon${i===2?' gold':''}`,{top:`${-27+i*10}%`});
      tx.animate(ribbon,[{transform:`translate(${90+i*8}%,-${20+i*8}%)`,opacity:0},{transform:'translate(0,0)',opacity:i===2?.9:.75,offset:.4},{transform:'translate(-120%,55%)',opacity:0}],800,i*40,INOUT);
    }
    for(let i=0;i<3;i++){const stroke=node(root,'dtx-blade gold',{top:`${35+i*17}%`});tx.animate(stroke,[{transform:'translate(120px,-70px) rotate(-28deg) scaleX(.3)',opacity:0},{opacity:.9,offset:.4},{transform:'translate(-320px,180px) rotate(-28deg) scaleX(1.1)',opacity:0}],700,120+i*45);}
    sparkle(tx,root,d,12);
  }
  function reticle(tx,from,to){
    const d=1100;swap(tx,from,to,d);const root=scene(tx,d);orbits(tx,root,d);
    const spots=[[265,180,0],[845,180,90],[845,430,180],[265,430,270]];
    spots.forEach(([x,y,r],i)=>{const bracket=node(root,'dtx-bracket',{left:`${x}px`,top:`${y}px`});tx.animate(bracket,[{transform:`translate(${i%2?150:-150}px,${i<2?-100:100}px) rotate(${r}deg)`,opacity:0},{transform:`translate(0,0) rotate(${r}deg)`,opacity:1,offset:.4},{transform:`translate(${i%2?110:-110}px,${i<2?-70:70}px) rotate(${r}deg)`,opacity:0}],1000,i*15,INOUT);});
    const core=node(root,'dtx-crosshair');tx.animate(core,[{transform:'rotate(-45deg) scale(1.5)',opacity:0},{transform:'rotate(0) scale(.85)',opacity:1,offset:.48},{transform:'rotate(45deg) scale(1.2)',opacity:0}],d);
    sparkle(tx,root,d,12,true);
  }
  function aperture(radius){
    const points=['0% 0%','100% 0%','100% 100%','0% 100%','0% 0%'];
    for(let i=0;i<=64;i++){const a=i/64*Math.PI*2;points.push(`${50+Math.cos(a)*radius/12.8}% ${50+Math.sin(a)*radius/7.2}%`);}
    return `polygon(evenodd,${points.join(',')})`;
  }
  function iris(tx,from,to){
    const d=1250;swap(tx,from,to,d);const root=scene(tx,d),shutter=node(root,'dtx-shutter');
    tx.animate(shutter,[{opacity:0,clipPath:aperture(0)},{opacity:1,clipPath:aperture(0),offset:.22},{opacity:1,clipPath:aperture(0),offset:.45},{opacity:1,clipPath:aperture(960)}],d,0,INOUT);
    const barrel=node(root,'dtx-cylinder');node(barrel,'dtx-hub');
    for(let i=0;i<6;i++)node(barrel,'dtx-chamber',{transform:`rotate(${i*60}deg) translateY(-157px)`});
    for(let i=0;i<18;i++){const tick=node(barrel,'dtx-tick',{top:'8px',transformOrigin:'1px 240px',transform:`rotate(${i*20}deg)`});if(i%3)tick.style.opacity='.35';}
    tx.animate(barrel,[{transform:'scale(.7) rotate(-50deg)',opacity:0},{transform:'scale(1) rotate(10deg)',opacity:1,offset:.38},{transform:'scale(1) rotate(35deg)',opacity:1,offset:.57},{transform:'scale(3.8) rotate(95deg)',opacity:0}],d,0,INOUT);
    orbits(tx,root,d);sparkle(tx,root,d,18,true);
  }
  function hall(tx,from,to){
    const d=1250;swap(tx,from,to,d);const root=scene(tx,d);
    tx.animate(from,[{transform:'perspective(1400px) translateZ(0)'},{transform:'perspective(1400px) translateZ(-130px)'}],350);
    tx.animate(to,[{transform:'perspective(1400px) translateZ(-90px)'},{transform:'perspective(1400px) translateZ(0)'}],700,400);
    for(let i=0;i<2;i++){const sign=i?1:-1,side=node(root,`dtx-hall-side ${i?'right':'left'}`);tx.animate(side,[{transform:`translateX(${sign*105}%)`,opacity:0},{transform:'translateX(0)',opacity:1,offset:.32},{transform:'translateX(0)',opacity:1,offset:.46},{transform:`perspective(900px) rotateY(${sign*65}deg) translateX(${sign*105}%)`,opacity:0}],d,0,INOUT);}
    for(let i=0;i<2;i++){const lintel=node(root,`dtx-hall-lintel ${i?'bottom':'top'}`),r=i?' rotate(180deg)':'';tx.animate(lintel,[{transform:`translateY(${i?105:-105}%)${r}`,opacity:0},{transform:`translateY(0)${r}`,opacity:1,offset:.3},{transform:`translateY(0)${r}`,opacity:1,offset:.5},{transform:`translateY(${i?130:-130}%)${r}`,opacity:0}],d);}
    orbits(tx,root,d);sparkle(tx,root,d,16);
  }
  function edges(tx,from,to){
    const d=1100;swap(tx,from,to,d);const root=scene(tx,d);
    const configs=[['horizontal',{top:'18px'},0],['vertical',{right:'18px'},100],['horizontal',{bottom:'18px'},180],['vertical',{left:'18px'},270]];
    configs.forEach(([kind,style,delay],i)=>{const el=node(root,`dtx-edge ${kind}`,style);tx.animate(el,[{transform:kind==='horizontal'?'scaleX(0)':'scaleY(0)',opacity:0},{transform:'scale(1)',opacity:1,offset:.4},{transform:'scale(1)',opacity:0}],720,delay);});
    for(let i=0;i<5;i++){const wire=node(root,'dtx-wire thick',{width:'780px',left:`${i%2?-200:700}px`,top:`${60+i*132}px`});tx.animate(wire,[{transform:'rotate(-32deg) scaleX(0)',opacity:0},{transform:'rotate(-32deg) scaleX(1)',opacity:1,offset:.4},{transform:'translate(-130px,65px) rotate(-32deg) scaleX(1)',opacity:0}],710,80+i*42);}
    sparkle(tx,root,d,22);
  }
  function prisms(tx,from,to){
    const d=1200;swap(tx,from,to,d);const root=scene(tx,d);
    for(let i=0;i<5;i++){
      const prism=node(root,'dtx-prism',{left:`${-18+i*25}%`});
      tx.animate(prism,[{transform:`perspective(1000px) rotateY(${i%2?-65:65}deg) translateY(-75%)`,opacity:0},{transform:'perspective(1000px) rotateY(0) translateY(0)',opacity:1,offset:.38},{transform:'perspective(1000px) rotateY(0) translateY(0)',opacity:.9,offset:.53},{transform:`perspective(1000px) rotateY(${i%2?75:-75}deg) translateY(80%)`,opacity:0}],1000,i*35,INOUT);
    }
    for(let i=0;i<3;i++){const line=node(root,'dtx-blade gold',{left:`${-40+i*28}%`});tx.animate(line,[{transform:'rotate(-65deg) scaleX(0)',opacity:0},{transform:'rotate(-65deg) scaleX(1)',opacity:.8,offset:.45},{transform:'rotate(-65deg) scaleX(1.2)',opacity:0}],900,i*45);}
    sparkle(tx,root,d,16);
  }
  function radial(tx,from,to){
    const d=1150;swap(tx,from,to,d);const root=scene(tx,d);
    for(let i=0;i<3;i++){const ring=node(root,'dtx-pulse');tx.animate(ring,[{transform:'scale(.08)',opacity:0},{opacity:.95,offset:.2},{transform:`scale(${4.2+i*.2})`,opacity:0}],930,i*65,INOUT);}
    for(let i=0;i<9;i++){
      const a=i/9*Math.PI*2,shard=node(root,'dtx-shard');
      tx.animate(shard,[{transform:`rotate(${i*40}deg) scale(.1)`,opacity:0},{transform:`translate(${Math.cos(a)*130}px,${Math.sin(a)*90}px) rotate(${i*40+20}deg) scale(.8)`,opacity:.85,offset:.32},{transform:`translate(${Math.cos(a)*750}px,${Math.sin(a)*500}px) rotate(${i*40+80}deg) scale(.5)`,opacity:0}],1000,i%3*35,INOUT);
    }
    sparkle(tx,root,d,20,true);
  }
  function emblem(root){const el=node(root,'dtx-seal');node(el,'dtx-seal-center');node(el,'dtx-arc');for(let i=0;i<24;i++)node(el,'dtx-tick',{transform:`rotate(${i*15}deg)`,opacity:i%2?'.45':'1'});return el;}
  function seal(tx,from,to){
    const d=1300;swap(tx,from,to,d);const root=scene(tx,d),mark=emblem(root);orbits(tx,root,d,3);
    tx.animate(mark,[{transform:'rotate(-60deg) scale(1.5)',opacity:0},{transform:'rotate(0) scale(1)',opacity:1,offset:.38},{transform:'rotate(0) scale(1)',opacity:1,offset:.58},{transform:'translate(545px,280px) rotate(45deg) scale(.13)',opacity:0}],d,0,INOUT);
    tx.animate(mark.querySelector('.dtx-arc'),[{transform:'rotate(-90deg)'},{transform:'rotate(150deg)'}],d);
    for(let i=0;i<4;i++){const line=node(root,'dtx-stitch',{width:'440px',left:i%2?'720px':'120px',top:`${170+i*115}px`});tx.animate(line,[{transform:`rotate(${i%2?-12:12}deg) scaleX(0)`,opacity:0},{transform:`rotate(${i%2?-12:12}deg) scaleX(1)`,opacity:.9,offset:.4},{transform:`rotate(${i%2?-12:12}deg) scaleX(1)`,opacity:0}],960,80+i*35);}
    sparkle(tx,root,d,18,true);
  }
  const effects=[['veil',veil,1180],['electro-weave',weave,1200],['rapier-cuts',cuts,1150],['diagonal-echoes',echoes,1050],['duel-reticle',reticle,1100],['mechanical-iris',iris,1250],['perspective-hall',hall,1250],['edge-lightning',edges,1100],['bevel-prisms',prisms,1200],['radial-fragments',radial,1150],['fontaine-seal',seal,1300]];
  function number(el,fallback){const n=Number(el?.dataset.slide);return Number.isFinite(n)&&n>0?n:Number(fallback)+1;}
  function run(from,to,options={}){
    cancel();
    if(!from||!to||from===to||document.body.classList.contains('plain')||typeof to.animate!=='function')return Promise.resolve({cancelled:false,effect:'none'});
    const stage=to.closest('#stage');if(!stage||from.closest('#stage')!==stage)return Promise.resolve({cancelled:false,effect:'none'});
    const a=number(from,options.fromIndex),b=number(to,options.toIndex),forward=b===a+1&&options.direction!==-1&&options.direction!=='backward';
    const selected=forward&&!mobile.matches&&!reduced.matches?effects[a-1]:null;
    const effect=selected?selected[0]:'fade',tx=transaction(stage,[from,to],effect);
    try{let auto=true;if(selected)selected[1](tx,from,to);else auto=fade(tx,from,to,reduced.matches?150:200);if(auto)tx.play();}catch(error){tx.finish(true);console.warn('Transición cancelada sin alterar el contenido.',error);}
    return tx.promise;
  }
  function open(el){
    cancel();
    if(!el||document.body.classList.contains('plain')||mobile.matches||reduced.matches||typeof el.animate!=='function')return Promise.resolve({cancelled:false,effect:'none'});
    const stage=el.closest('#stage');if(!stage)return Promise.resolve({cancelled:false,effect:'none'});
    const tx=transaction(stage,[el],'opening');
    try{
      el.hidden=false;const root=scene(tx,1750),left=node(root,'dtx-opening-wing left'),right=node(root,'dtx-opening-wing right'),mark=emblem(root);
      tx.animate(mark,[{transform:'rotate(-50deg) scale(.6)',opacity:0},{transform:'rotate(0) scale(1)',opacity:1,offset:.4},{transform:'rotate(10deg) scale(1.15)',opacity:0}],1250);
      tx.animate(mark.querySelector('.dtx-arc'),[{transform:'rotate(-80deg)'},{transform:'rotate(130deg)'}],1200);
      tx.animate(left,[{transform:'translateX(0)'},{transform:'translateX(-105%)'}],750,900,INOUT);
      tx.animate(right,[{transform:'translateX(0)'},{transform:'translateX(105%)'}],750,900,INOUT);
      orbits(tx,root,1500,3);sparkle(tx,root,1700,24,true);
      for(let i=0;i<4;i++){const blade=node(root,`dtx-blade${i%2?' gold':''}`,{top:`${25+i*18}%`});tx.animate(blade,[{transform:'rotate(-28deg) scaleX(0)',opacity:0},{transform:'rotate(-28deg) scaleX(1)',opacity:.9,offset:.4},{transform:'translate(-150px,60px) rotate(-28deg) scaleX(1.1)',opacity:0}],850,180+i*60);}
      tx.animate(el,[{opacity:0},{opacity:1}],500,1250);tx.play();
    }catch(error){tx.finish(true);console.warn('Apertura cancelada sin alterar la portada.',error);}return tx.promise;
  }
  window.DielectricTransitions=Object.freeze({run,open,cancel,get isActive(){return active!==null;}});
  mobile.addEventListener('change',cancel);reduced.addEventListener('change',cancel);window.addEventListener('beforeprint',cancel);
})();
