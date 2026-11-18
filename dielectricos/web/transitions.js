/* Public API: run/from-to, open, cancel and isActive. Organic scenery only. */
(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:700px)');let active=null;
 const OUT='cubic-bezier(.23,1,.32,1)';
 function transaction(stage,elements,effect){
  let resolve,done=false,timer;const promise=new Promise(r=>resolve=r),hidden=new Map(elements.map(e=>[e,e.hidden])),saved=new Map(),animations=[];let overlay;
  const tx={promise,effect,
   style(el,key,value){if(!saved.has(el))saved.set(el,new Map());if(!saved.get(el).has(key))saved.get(el).set(key,[el.style.getPropertyValue(key),el.style.getPropertyPriority(key)]);el.style.setProperty(key,value);},
   animate(el,frames,duration,delay=0){const a=el.animate(frames,{duration,delay,easing:OUT,fill:'both'});animations.push(a);return a;},
   overlay(){if(!overlay){overlay=document.createElement('div');overlay.className=`dt-overlay dtx-scene organic-scene organic-${effect}`;overlay.setAttribute('aria-hidden','true');stage.append(overlay);}return overlay;},
   finish(cancelled=false){if(done)return;done=true;clearTimeout(timer);window.DielectricOrganic?.stop(overlay);animations.forEach(a=>a.cancel());overlay?.remove();for(const[el,props]of saved)for(const[key,[value,priority]]of props)value?el.style.setProperty(key,value,priority):el.style.removeProperty(key);for(const[el,value]of hidden)el.hidden=value;stage.classList.remove('dt-running');if(active===tx)active=null;resolve({cancelled,effect});},
   play(duration){timer=setTimeout(()=>tx.finish(),duration+800);Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(()=>tx.finish());}
  };stage.classList.add('dt-running');active=tx;return tx;
 }
 function cancel(){active?.finish(true);}
 function position(tx,from,to){for(const el of[from,to]){tx.style(el,'position','absolute');tx.style(el,'left','0');tx.style(el,'top','0');el.hidden=false;}tx.style(from,'z-index','2');tx.style(to,'z-index','1');}
 function fade(from,to,duration){const tx=transaction(to.closest('#stage'),[from,to],'fade');if(mobile.matches){const first=tx.animate(from,[{opacity:1},{opacity:0}],duration/2);first.finished.then(()=>{if(active!==tx)return;from.hidden=true;to.hidden=false;tx.animate(to,[{opacity:0},{opacity:1}],duration/2);tx.play(duration/2);}).catch(()=>tx.finish(true));}else{position(tx,from,to);tx.animate(from,[{opacity:1},{opacity:0}],duration);tx.animate(to,[{opacity:0},{opacity:1}],duration);tx.play(duration);}return tx.promise;}
 function run(from,to,options={}){
  cancel();if(!from||!to||from===to||document.body.classList.contains('plain'))return Promise.resolve({cancelled:false,effect:'none'});
  const a=Number(from.dataset.slide)||Number(options.fromIndex)+1,b=Number(to.dataset.slide)||Number(options.toIndex)+1;
  const profile=b===a+1&&options.direction!==-1&&!mobile.matches&&!reduced.matches?window.DielectricOrganic?.profiles[a-1]:null;
  if(!profile)return fade(from,to,reduced.matches?150:200);
  const tx=transaction(to.closest('#stage'),[from,to],profile.name);
  try{position(tx,from,to);const root=tx.overlay();window.DielectricOrganic.paint(root,profile);tx.animate(root,[{opacity:1},{opacity:1}],profile.duration);tx.animate(from,[{opacity:1},{opacity:0}],250,50);tx.animate(to,[{opacity:0},{opacity:1}],310,profile.duration*.48);tx.play(profile.duration);}catch(error){tx.finish(true);console.warn('Escenario retirado sin alterar el contenido.',error);}return tx.promise;
 }
 function open(el){
  cancel();if(!el||mobile.matches||reduced.matches||document.body.classList.contains('plain'))return Promise.resolve({cancelled:false,effect:'none'});
  const profile={name:'opening',kind:'flourish',palette:'violet',direction:1,duration:1500,seed:41},tx=transaction(el.closest('#stage'),[el],'opening');
  try{el.hidden=false;const root=tx.overlay();window.DielectricOrganic.paint(root,profile);tx.animate(root,[{opacity:1},{opacity:1}],1500);tx.animate(el,[{opacity:0},{opacity:1}],760,450);tx.play(1500);}catch(error){tx.finish(true);console.warn('Apertura retirada sin alterar la portada.',error);}return tx.promise;
 }
 window.DielectricTransitions=Object.freeze({run,open,cancel,get isActive(){return active!==null;}});
 mobile.addEventListener('change',cancel);reduced.addEventListener('change',cancel);window.addEventListener('beforeprint',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
})();
