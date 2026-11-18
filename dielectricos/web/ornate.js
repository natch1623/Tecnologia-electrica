(() => {
  'use strict';
  function build(index) {
    const ticks=Array.from({length:60},(_,n)=>`<path d="M360 ${n%5?40:25}v${n%5?8:24}" transform="rotate(${n*6} 360 360)" opacity="${n%5?.5:.95}"/>`).join('');
    const petals=Array.from({length:12},(_,n)=>`<g transform="rotate(${n*30} 360 360)"><path d="M360 85 Q388 119 360 158 Q332 119 360 85Z"/><path d="M360 168 370 188 360 208 350 188Z"/><circle cx="360" cy="70" r="3"/></g>`).join('');
    const compass=`<svg class="astral-wheel" viewBox="0 0 720 720" fill="none" stroke="currentColor" stroke-width="1"><circle cx="360" cy="360" r="338" stroke-dasharray="160 12 3 12"/><circle cx="360" cy="360" r="310"/><circle cx="360" cy="360" r="282" stroke-dasharray="2 12"/><circle cx="360" cy="360" r="215"/><circle cx="360" cy="360" r="197" stroke-dasharray="36 12"/>${ticks}${petals}<path d="M360 128 568 360 360 592 152 360Z" opacity=".45"/><path d="M360 193 527 360 360 527 193 360Z" opacity=".4"/></svg>`;
    const filigree=`<svg class="fontaine-lace" viewBox="0 0 640 720" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M610 10C340 16 593 176 404 194S526 360 354 389 427 533 232 583 395 699 69 712"/><path d="M627 12C374 39 612 149 438 218S542 364 389 408 446 565 268 605 385 711 135 720" opacity=".4"/><path d="M541 65c-113-16-119 78-44 58 50-14-1-52-25-13M453 232c-104-24-138 64-59 61 58-2 8-61-18-26M385 421c-103-17-134 75-54 57 54-12 1-58-23-25M257 601c-110-14-123 75-43 54 45-12-9-52-27-23"/><path d="m593 32 12 20-12 20-12-20Zm-136 142 10 17-10 17-10-17Zm-70 194 10 17-10 17-10-17Zm-113 176 10 17-10 17-10-17Z" fill="currentColor" opacity=".5"/></svg>`;
    const constellations=`<svg class="astral-stars" viewBox="0 0 1280 720" fill="none" stroke="currentColor"><path d="M827 34 955 83 1102 47 1161 175 1235 230M969 623 1065 570 1197 599 1260 494M36 608 123 654 256 621" opacity=".5"/>${[[827,34],[955,83],[1102,47],[1161,175],[1235,230],[969,623],[1065,570],[1197,599],[1260,494],[36,608],[123,654],[256,621]].map(([x,y],n)=>`<g transform="translate(${x} ${y})"><path d="M-5 0H5M0-5V5"/><circle r="${n%3?2:4}" fill="currentColor"/></g>`).join('')}</svg>`;
    const arcs=Array.from({length:4},(_,n)=>`<i class="brocade-arc brocade-${n}"></i>`).join('');
    const shards=Array.from({length:9},(_,n)=>`<i class="prismatic-dust" style="right:${(n*47+index*13)%510-80}px;top:${(n*83+index*29)%650}px;--shard-rotation:${n*24-40}deg;animation-delay:${-n*.9}s"></i>`).join('');
    const tracers=Array.from({length:5},(_,n)=>`<i class="silver-tracer" style="top:${n*130+40}px;right:${n*110-180}px;animation-delay:${-n*1.7}s"></i>`).join('');
    return `<div class="nocturne-grain"></div><div class="silk-light"></div>${compass}${filigree}${constellations}${arcs}${shards}${tracers}<div class="electro-horizon"></div><div class="edge-jewel jewel-top"></div><div class="edge-jewel jewel-bottom"></div>`;
  }
  window.DielectricOrnaments={build};
})();
