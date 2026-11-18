(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let entries = [], initialized = false, userPaused = false;
  function stopEntries() { entries.forEach(a => a.cancel()); entries = []; }
  function enter(index) {
    stopEntries();
    const slide = document.querySelector(`.slide[data-slide="${index + 1}"]`);
    if (!slide || document.body.classList.contains('plain')) return;
    const targets = [slide.querySelector('h1,h2'), ...slide.querySelectorAll('.explanation li,.text-list>li,.map-item,.material-state,.mechanism-list li,.columns>div,.conclusions li,.case-list li,table tbody tr,.subtitle,.authors')].filter(Boolean);
    targets.forEach((el, i) => {
      const translate = reduced.matches ? 0 : (i % 2 ? 34 : -34);
      const finalOpacity = getComputedStyle(el).opacity;
      const a = el.animate([{opacity:0, transform:`translate3d(${translate}px,${reduced.matches ? 0 : 9}px,0)`},{opacity:finalOpacity,transform:'translate3d(0,0,0)'}], {duration:reduced.matches ? 140 : 470,delay:reduced.matches ? 0 : Math.min(i * 45,240),easing:'cubic-bezier(.23,1,.32,1)',fill:'both'});
      a.finished.then(() => a.cancel()).catch(() => {});
      entries.push(a);
    });
  }
  function syncPause() {
    const paused = userPaused || reduced.matches || document.hidden;
    document.body.classList.toggle('ambient-paused', paused);
    const button = document.querySelector('#ambient-toggle');
    if (button) { button.setAttribute('aria-pressed', String(!paused)); button.setAttribute('aria-label', paused ? 'Reanudar ambiente animado' : 'Pausar ambiente animado'); button.innerHTML=`<span aria-hidden="true">✧</span><span class="ambient-label">${paused ? 'Reanudar ambiente' : 'Pausar ambiente'}</span>`; }
  }
  function init() {
    if (initialized) return;
    initialized = true;
    document.querySelectorAll('.slide').forEach((slide, index) => {
      const scene = document.createElement('div');
      scene.className='electro-scene';scene.setAttribute('aria-hidden','true');
      scene.innerHTML='<div class="energy-halo"></div><div class="energy-orbit orbit-a"></div><div class="energy-orbit orbit-b"></div>'+Array.from({length:3},(_,i)=>`<i class="energy-ribbon ribbon-${i}"></i>`).join('')+Array.from({length:13},(_,i)=>`<i class="electro-spark" style="left:${10+(i*37+index*11)%87}%;top:${8+(i*23+index*7)%83}%;animation-delay:${-i*.73}s;animation-duration:${4+i%4}s"></i>`).join('');
      scene.insertAdjacentHTML('beforeend',window.DielectricOrnaments?.build(index)||'');
      scene.dataset.variant=String(index%4);
      slide.prepend(scene);
      slide.style.setProperty('--scene-angle', `${index % 2 ? 16 : -18}deg`);
    });
    const button=document.createElement('button');button.id='ambient-toggle';button.type='button';button.onclick=()=>{userPaused=!userPaused;syncPause();};
    document.querySelector('.tools').prepend(button);
    window.addEventListener('slidechange',e=>enter(e.detail.index));
    document.addEventListener('visibilitychange',syncPause);reduced.addEventListener('change',syncPause);
    const hero=document.querySelector('.hero-construct,.hero-portrait');
    document.querySelector('#viewport').addEventListener('pointermove',e=>{
      if(!hero||reduced.matches||userPaused||document.body.classList.contains('plain')||e.pointerType!=='mouse')return;
      const area=e.currentTarget.getBoundingClientRect();
      hero.style.transform=`translate3d(${(e.clientX/area.width-.5)*16}px,${(e.clientY/area.height-.5)*12}px,0)`;
    },{passive:true});
    document.querySelector('#viewport').addEventListener('pointerleave',()=>{if(hero)hero.style.transform='translate3d(0,0,0)';});
    syncPause();
  }
  window.DielectricKinetic={init,stopEntries};
})();
