(() => {
  'use strict';
  const active=new Set(), reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const ease='cubic-bezier(.23,1,.32,1)';
  function clear(){[...active].forEach(effect=>effect.finish());}
  function pulse(element){
    if(document.body.classList.contains('plain')||element.closest('.slide')?.hidden)return;
    const stage=document.querySelector('#stage'),bounds=stage.getBoundingClientRect(),rect=element.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const scale=bounds.width/stage.offsetWidth;
    const width=rect.width/scale+20,height=rect.height/scale+18;
    const root=document.createElement('div');root.className='electric-emphasis';root.setAttribute('aria-hidden','true');
    Object.assign(root.style,{left:`${(rect.left-bounds.left)/scale-10}px`,top:`${(rect.top-bounds.top)/scale-9}px`,width:`${width}px`,height:`${height}px`});
    const glow=document.createElement('i');glow.className='electric-charge';root.append(glow);
    const animations=[];let finished=false;
    const effect={finish(){if(finished)return;finished=true;animations.forEach(a=>a.cancel());root.remove();active.delete(effect);}};
    function animate(el,frames,duration,delay=0){const a=el.animate(frames,{duration,delay,easing:ease,fill:'both'});animations.push(a);return a;}
    stage.append(root);active.add(effect);
    if(reduced.matches){
      root.classList.add('electric-reduced');animate(glow,[{opacity:0},{opacity:.65,offset:.3},{opacity:0}],320);
    }else{
      const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.classList.add('electric-arcs');
      const y=height-7;
      const lower=`M3 ${y} L${width*.16} ${y} l12 -5 9 8 12 -7 L${width*.48} ${y-3} l12 -5 9 8 11 -4 L${width-3} ${y-2}`;
      const upper=`M4 ${Math.min(height-10,25)} L8 7 L${width*.22} 7 l11 4 8 -7 12 4 L${width*.71} 7 l10 -4 8 7 9 -3 L${width-6} 7 L${width-3} ${Math.min(height-10,24)}`;
      svg.innerHTML=`<path class="arc-bloom" d="${lower}"/><path class="arc-core" d="${lower}"/><path class="arc-upper" d="${upper}"/>`;
      root.append(svg);
      animate(glow,[{transform:'scaleX(.25)',opacity:0},{opacity:.9,offset:.3},{transform:'scaleX(1)',opacity:0}],720);
      animate(svg,[{clipPath:'inset(0 100% 0 0)',opacity:0},{clipPath:'inset(0 45% 0 0)',opacity:1,offset:.24},{clipPath:'inset(0 0 0 0)',opacity:1,offset:.57},{clipPath:'inset(0 0 0 0)',opacity:0}],760);
      for(let i=0;i<7;i++){
        const spark=document.createElement('i');spark.className=`electric-spark${i%3===0?' warm':''}`;
        const x=width*(.08+i*.14),sy=i%2?7:y;
        Object.assign(spark.style,{left:`${x}px`,top:`${sy}px`});root.append(spark);
        animate(spark,[{transform:'translate3d(0,0,0) scale(.3) rotate(0deg)',opacity:0},{opacity:1,offset:.18},{transform:`translate3d(${(i%3-1)*19}px,${i%2?-24:22}px,0) scale(.1) rotate(${i*35+50}deg)`,opacity:0}],430,90+i*35);
      }
    }
    Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(()=>effect.finish());
  }
  window.addEventListener('resize',clear);window.addEventListener('slidechange',clear);reduced.addEventListener('change',clear);window.addEventListener('beforeprint',clear);
  window.DielectricEmphasis={pulse,clear,get activeCount(){return active.size;}};
})();
