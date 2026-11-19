/* Clorinde-inspired choreography: embroidered cape, plumes, pistol cadence and rapier wakes. */
(() => {
 'use strict';
 const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
 const envelope=t=>smooth(t/.2)*(1-smooth((t-.73)/.27));
 const palettes={violet:['#9458f0','#d8b8ff','#f8e9ff'],ice:['#767bda','#b8dbff','#eff9ff'],gold:['#9971c9','#e4c29b','#fff1d6']};
 const profiles=[['silk-veil','silk','violet',1,1180,2],['ink-reveal','ink','ice',-1,1130,5],['rapier-wake','blade','violet',1,980,8],['feather-drift','feather','ice',-1,1140,11],['crossed-riposte','cross','gold',1,1050,13],['branched-electro','storm','violet',1,1170,17],['silk-unfold','silk','gold',-1,1240,19],['wind-rush','wind','ice',1,990,23],['liquid-ribbon','liquid','violet',-1,1210,29],['afterimage-wake','wake','ice',1,1080,31],['calligraphic-finale','flourish','gold',1,1340,37]].map(([name,kind,palette,direction,duration,seed])=>({name,kind,palette,direction,duration,seed}));
 // Three precise pulses followed by a long thrust; cloth/plumes carry the quieter scenes.
 const gestures=['cape','salute','thrust','plume','riposte','vigil','cape','dash','cape','vigil','finale'];
 profiles.forEach((profile,i)=>profile.gesture=gestures[i]);
 const painters=new Map();
 function random(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
 function curve(profile,u,lane=0){
  let x=-160+1600*u,y=650-650*u+Math.sin(u*Math.PI*1.6+profile.seed*.15)*130;
  if(profile.kind==='silk'){x=-250+1750*u;y=610-560*u+Math.sin(u*Math.PI*1.7)*175;}
  if(profile.kind==='ink')y=410+Math.sin(u*5.1+profile.seed)*190-190*u;
  if(profile.kind==='feather'){x=80+1300*u;y=790-1050*u+Math.sin(u*3.3)*160;}
  if(profile.kind==='wind')y=270+Math.sin(u*5.5+lane*.02)*140-90*u;
  if(profile.kind==='liquid')y=470+Math.sin(u*6.2+lane*.015)*220-280*u;
  if(profile.kind==='wake')y=690-700*u+Math.sin(u*5.3)*170;
  if(profile.kind==='flourish'){x=-100+1450*u;y=490-240*u+Math.sin(u*8.4)*180;}
  return{x:profile.direction>0?x:1280-x,y:y+lane};
 }
 function segment(ctx,points,start,end){start=Math.max(0,Math.floor(start));end=Math.min(points.length-1,Math.ceil(end));if(end<=start)return;ctx.beginPath();ctx.moveTo(points[start].x,points[start].y);for(let i=start+1;i<=end;i++)ctx.lineTo(points[i].x,points[i].y);}
 function ribbon(ctx,points,start,end,width){
  const a=Math.max(0,Math.floor(start)),b=Math.min(points.length-1,Math.ceil(end));if(b-a<2)return;
  const edge=[];
  for(let i=a;i<=b;i++){const prev=points[Math.max(0,i-1)],next=points[Math.min(points.length-1,i+1)],dx=next.x-prev.x,dy=next.y-prev.y,length=Math.hypot(dx,dy)||1,pressure=Math.pow(Math.sin((i-a)/(b-a)*Math.PI),.75),w=width*.5*pressure*(.95+Math.sin(i*.37)*.05);edge.push({p:points[i],nx:-dy/length*w,ny:dx/length*w});}
  ctx.beginPath();edge.forEach(({p,nx,ny},i)=>i?ctx.lineTo(p.x+nx,p.y+ny):ctx.moveTo(p.x+nx,p.y+ny));edge.reverse().forEach(({p,nx,ny})=>ctx.lineTo(p.x-nx,p.y-ny));ctx.closePath();ctx.fill();
 }
 function renderer(canvas,profile){
  const ctx=canvas.getContext('2d',{alpha:true}),rnd=random(profile.seed),colors=palettes[profile.palette];
  const strands=Array.from({length:profile.kind==='feather'?66:48},(_,i)=>{const lane=(rnd()-.5)*(profile.kind==='wind'?350:170),phase=rnd()*6.28;return{points:Array.from({length:81},(_,j)=>{const u=j/80,p=curve(profile,u,lane);return{x:p.x+Math.sin(u*11+phase)*4,y:p.y+Math.sin(u*14+phase)*7};}),width:.5+rnd()*2,delay:rnd()*.13,alpha:.2+rnd()*.5,index:i};});
  const sparks=Array.from({length:38},()=>({u:rnd(),lane:(rnd()-.5)*260,phase:rnd()*6.28,length:3+rnd()*12}));
  const bolts=Array.from({length:profile.kind==='storm'?5:2},(_,k)=>{const points=Array.from({length:34},(_,i)=>{const u=i/33;return{x:-80+1440*u,y:140+k*110+Math.sin(u*8+k)*65+(rnd()-.5)*70};});return{points,branches:[8,16,24].map(n=>{const a=points[n];return Array.from({length:8},(_,i)=>({x:a.x+i*20+(rnd()-.5)*18,y:a.y+(k%2?-1:1)*i*20+(rnd()-.5)*22}));}),delay:k*.04};});
  const plumes=Array.from({length:profile.kind==='feather'?5:3},(_,k)=>({x:190+k*285,y:620-k*130,angle:-.85+k*.16,length:300+k*35,bend:(k%2?1:-1)*52,delay:k*.08}));
  const cloth=Array.from({length:81},(_,i)=>curve(profile,i/80));
  const fabric=ctx.createLinearGradient(0,650,1280,90);fabric.addColorStop(0,'#0b0c28');fabric.addColorStop(.4,'#41245b');fabric.addColorStop(.72,'#8b55b4');fabric.addColorStop(1,'#1b173b');
  const shade=ctx.createLinearGradient(0,0,1280,720);shade.addColorStop(0,'#0a0d24');shade.addColorStop(.6,'#231334');shade.addColorStop(1,'#122039');
  function brush(t){
   const kind=profile.kind,head=smooth((t-.04)/.78),tail=Math.max(0,head-(kind==='wind'?.48:.7));
   if(['silk','ink','liquid','wake','flourish'].includes(kind)){
    ctx.globalCompositeOperation='source-over';ctx.globalAlpha=envelope(t)*.92;ctx.fillStyle=fabric;ribbon(ctx,cloth,tail*80,head*80,kind==='silk'?240:kind==='liquid'?140:85);
    ctx.globalAlpha=envelope(t)*.5;ctx.fillStyle=colors[0];ribbon(ctx,cloth,(tail+.04)*80,head*80,35);
   }
   ctx.globalCompositeOperation='lighter';
   for(const strand of strands){const end=smooth(clamp((t-strand.delay)/.76))*80,start=Math.max(0,end-(kind==='feather'?48:60));ctx.globalAlpha=envelope(t)*strand.alpha;ctx.strokeStyle=strand.index%9===0?colors[2]:strand.index%5===0?colors[1]:colors[0];ctx.lineWidth=strand.width;ctx.lineCap='round';segment(ctx,strand.points,start,end);ctx.stroke();if(strand.index%8===0){ctx.globalAlpha=envelope(t)*.11;ctx.lineWidth=12;ctx.stroke();}}
  }
  function embroidery(t){
   const head=smooth((t-.06)/.72)*80,tail=Math.max(0,head-53);
   ctx.globalCompositeOperation='lighter';
   // The gold seam follows the changing cloth tangent rather than forming a frame.
   for(const side of [-1,1]){
    const seam=cloth.map((p,i)=>{const prev=cloth[Math.max(0,i-1)],next=cloth[Math.min(80,i+1)],dx=next.x-prev.x,dy=next.y-prev.y,n=Math.hypot(dx,dy)||1,w=Math.sin(i/80*Math.PI)*side*65;return{x:p.x-dy/n*w,y:p.y+dx/n*w};});
    ctx.globalAlpha=envelope(t)*.7;ctx.strokeStyle='#dfbb80';ctx.lineWidth=1.15;segment(ctx,seam,tail,head);ctx.stroke();
    ctx.globalAlpha=envelope(t)*.38;ctx.strokeStyle='#fff1d7';ctx.lineWidth=.6;ctx.setLineDash([2,9]);segment(ctx,seam,tail,head);ctx.stroke();ctx.setLineDash([]);
   }
  }
  function feathers(t){
   ctx.globalCompositeOperation='lighter';
   for(const plume of plumes){
    const age=clamp((t-plume.delay)/.75),a=Math.sin(age*Math.PI)*envelope(t);if(a<=0)continue;
    ctx.save();ctx.translate(profile.direction>0?plume.x:1280-plume.x,plume.y-age*160);ctx.rotate(plume.angle+(age-.5)*.3);
    const spine=Array.from({length:45},(_,i)=>{const u=i/44;return{x:u*plume.length,y:Math.sin(u*Math.PI)*plume.bend};});
    ctx.globalAlpha=a*.8;ctx.lineWidth=1.2;ctx.strokeStyle='#f5eaff';segment(ctx,spine,0,44);ctx.stroke();
    for(let j=2;j<42;j++){
     const u=j/44,q=spine[j],breadth=Math.pow(Math.sin(u*Math.PI),.85)*(45+plume.length*.1);
     for(const side of [-1,1]){
      ctx.globalAlpha=a*(j%4===0?.78:.36);ctx.strokeStyle=j%4===0?'#eee8ff':j%3===0?'#9d79ed':'#c5c8ff';ctx.lineWidth=j%5===0?1.3:.65;
      ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.bezierCurveTo(q.x-12,q.y+side*breadth*.35,q.x-30,q.y+side*breadth,q.x-47+age*18,q.y+side*breadth*(.8+.15*Math.sin(j)));ctx.stroke();
     }
    }ctx.restore();
   }
  }
  function pistolCadence(t){
   ctx.globalCompositeOperation='lighter';
   // Local muzzle wisps and narrow projectiles: three accents, never a full-screen flash.
   for(let k=0;k<3;k++){
    const age=(t-(.06+k*.135))/.28;if(age<0||age>1)continue;
    const energy=Math.sin(age*Math.PI),x=profile.direction>0?180+k*72:1100-k*72,y=510-k*112;
    ctx.globalAlpha=energy*.8;
    for(let j=0;j<13;j++){
     const angle=j*2.399+k*.7,length=(18+j%5*7)*(1+age*.9);
     ctx.strokeStyle=j%3?'#b290ff':'#fff2ff';ctx.lineWidth=j%4===0?1.5:.7;
     ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.cos(angle+.4)*length*.5,y+Math.sin(angle+.4)*length*.5,x+Math.cos(angle)*length,y+Math.sin(angle)*length);ctx.stroke();
    }
    const travel=smooth(age)*920,tip=x+profile.direction*travel,ty=y-travel*.3;
    for(const [width,color,opacity] of [[14,'#8a52db',.12],[3,'#b99dff',.6],[1.2,'#fff0ff',1]]){
     ctx.globalAlpha=energy*opacity;ctx.strokeStyle=color;ctx.lineWidth=width;
     ctx.beginPath();ctx.moveTo(tip-profile.direction*(70+age*190),ty+30+age*38);ctx.quadraticCurveTo(tip-profile.direction*35,ty+12,tip,ty);ctx.stroke();
    }
   }
  }
  const bladePaths=[1,-1].map(direction=>Array.from({length:12},(_,k)=>Array.from({length:71},(_,i)=>{const u=i/70,p=curve({...profile,direction:direction*profile.direction,kind:'blade'},u,(k-5.5)*5);return{x:p.x,y:p.y+Math.sin(u*5.4)*26};})));
  function blade(t,reverse=false){const head=smooth((t-.08)/.53),tail=Math.max(0,head-.58);ctx.globalCompositeOperation='lighter';bladePaths[reverse?1:0].forEach((points,k)=>{ctx.lineWidth=k===5?3:k%4===0?1.4:.65;ctx.strokeStyle=k===5?colors[2]:colors[k%2];ctx.globalAlpha=envelope(t)*(k===5?.95:.55);segment(ctx,points,tail*70,head*70);ctx.stroke();if(k===5){ctx.globalAlpha=envelope(t)*.15;ctx.lineWidth=22;ctx.strokeStyle=colors[0];ctx.stroke();}});}
  function lightning(t){ctx.globalCompositeOperation='lighter';bolts.forEach((bolt,k)=>{const head=smooth((t-.1-bolt.delay)/.55),end=head*33,start=Math.max(0,end-25),alpha=envelope(t)*(.8-k*.07);[[14,colors[0],alpha*.13],[4,colors[0],alpha*.6],[1.2,colors[2],alpha]].forEach(([w,c,a])=>{ctx.lineWidth=w;ctx.strokeStyle=c;ctx.globalAlpha=a;segment(ctx,bolt.points,start,end);ctx.stroke();});bolt.branches.forEach((branch,j)=>{if(head<(j+1)*.21)return;ctx.globalAlpha=alpha*.6;ctx.lineWidth=.9;ctx.strokeStyle=colors[1];segment(ctx,branch,0,7);ctx.stroke();});});}
  return t=>{
   ctx.clearRect(0,0,1280,720);ctx.globalCompositeOperation='source-over';const alpha=envelope(t);ctx.globalAlpha=alpha*.68;ctx.fillStyle=shade;ctx.fillRect(0,0,1280,720);
   if(profile.kind==='storm'){lightning(t);blade(clamp((t-.32)/.68));}else if(profile.kind==='blade')blade(t);else if(profile.kind==='cross'){blade(t);blade(clamp(t-.13),true);}else{brush(t);if(['wake','flourish'].includes(profile.kind))lightning(clamp(t-.12));}
   const gesture=profile.gesture||'finale';
   if(['cape','salute','finale'].includes(gesture))embroidery(t);
   if(['plume','salute','dash','finale'].includes(gesture))feathers(t);
   if(['thrust','riposte','vigil','finale'].includes(gesture))pistolCadence(t);
   if(gesture==='vigil')blade(clamp((t-.38)/.62));
   if(gesture==='dash'){ctx.globalAlpha=.3;blade(clamp((t-.15)/.8));}
   ctx.globalCompositeOperation='lighter';ctx.lineCap='round';sparks.forEach((spark,i)=>{const p=curve(profile,clamp(spark.u+(t-.5)*.24),spark.lane);ctx.globalAlpha=Math.max(0,alpha*(.25+Math.sin(t*2+spark.phase)*.16));ctx.strokeStyle=i%7===0?'#f0ce99':colors[1];ctx.lineWidth=i%4===0?1.8:.8;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+spark.length,p.y-spark.length*.5);ctx.stroke();});ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  };
 }
 function stop(root){const id=painters.get(root);if(id)cancelAnimationFrame(id);painters.delete(root);}
 function paint(root,profile){
  const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=720;canvas.className='organic-painter';root.append(canvas);
  const draw=renderer(canvas,profile),start=performance.now();
  const tick=now=>{if(!root.isConnected){stop(root);return;}const t=clamp((now-start)/profile.duration);draw(t);if(t<1)painters.set(root,requestAnimationFrame(tick));else painters.delete(root);};
  painters.set(root,requestAnimationFrame(tick));
 }
 window.DielectricOrganic={profiles,paint,stop,get activeCount(){return painters.size;}};
})();
