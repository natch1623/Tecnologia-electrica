(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const arrow=id=>`<defs><marker id="${id}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 6 3 0 6Z" fill="currentColor"/></marker></defs>`;
  function svg(content,label,view='0 0 400 200',cls='') {return `<svg class="ph-svg ${cls}" viewBox="${view}" role="img" aria-label="${label}">${content}</svg>`;}
  function dipole(x,y,angle,end,animated=false,id='') {
    return `<g transform="translate(${x} ${y})"><g class="${animated?'dm-dipole':'ph-static-dipole'}" ${animated?`style="--dm-start:${angle}deg;--dm-end:${end}deg"`:`transform="rotate(${angle})"`}><line class="ph-bond" x1="-16" x2="16"/><circle class="ph-negative" cx="-16" r="10"/><circle class="ph-positive" cx="16" r="10"/>${[-16,16].map((cx,i)=>`<g transform="translate(${cx} 0)"><text class="${animated?'dm-charge-label':'ph-sign'}" ${animated?'':`transform="rotate(${-angle})"`} y="4" text-anchor="middle">${i?'+':'−'}</text></g>`).join('')}<path class="ph-vector" d="M-12 19H12" marker-end="url(#${id})"/></g></g>`;
  }
  function molecular(type,id) {
    const root=document.createElement('div');root.className='ph-molecular-compare';
    const initial=[-140,75,-50,140,-80,20],final=[-20,30,-35,15,45,-15];
    for(let side=0;side<2;side++) {
      const key=`${id}-${side}`;let content=arrow(key);
      if(side) content+=`<g class="dm-field"><path class="ph-field-arrow" d="M40 24H260" marker-end="url(#${key})"/><text x="150" y="15" text-anchor="middle" class="ph-small">E externo</text></g>`;
      for(let i=0;i<6;i++) {
        const x=78+i%2*144,y=66+Math.floor(i/2)*60;
        if(type==='polar')content+=dipole(x,y,initial[i],final[i],Boolean(side),key);
        else content+=`<g transform="translate(${x} ${y})"><g class="ph-electron-cloud ${side?'ph-induced-cloud':''}"><ellipse rx="29" ry="23"/><text x="-19" y="5">−</text><text x="12" y="5">−</text></g><circle class="ph-positive" r="10"/><text class="ph-sign" text-anchor="middle" y="4">+</text>${side?`<g class="ph-induced-vector"><path class="ph-vector" d="M-17 33H15" marker-end="url(#${key})"/></g>`:''}</g>`;
      }
      const figure=document.createElement('figure');figure.className=side?'ph-after':'ph-before';
      const caption=type==='polar'?(side?'Orientación preferente':'Dipolos ya existentes'):(side?'Separación inducida':'Centros coincidentes');
      figure.innerHTML=`<figcaption>${side?'Con campo':'Sin campo'}</figcaption>${svg(content,`${type==='polar'?'Moléculas polares':'Moléculas no polares'} ${side?'bajo un campo aplicado a la derecha':'sin campo externo'}`,'0 0 300 235')}<p>${caption}</p>`;
      root.append(figure);
    }
    const legend=document.createElement('div');legend.className='ph-charge-legend';legend.innerHTML='<span><i class="positive-key"></i> Carga positiva</span><span><i class="negative-key"></i> Carga negativa</span>';root.append(legend);
    return root;
  }
  function mechanism(n) {
    const key=`ph-mechanism-${n}`;let inner=arrow(key)+`<path class="ph-field-arrow" d="M275 25H350" marker-end="url(#${key})"/><text class="ph-small" x="300" y="17">E</text>`;
    if(n===0)inner+=`<g transform="translate(175 75)"><g class="ph-electron-cloud ph-mechanism-cloud"><ellipse rx="65" ry="34"/><text x="-45" y="6">−</text><text x="40" y="6">−</text></g><circle class="ph-positive" r="15"/><text class="ph-sign" text-anchor="middle" y="5">+</text></g><text class="ph-small" x="175" y="132" text-anchor="middle">La nube se desplaza respecto del centro positivo</text>`;
    if(n===1)inner+=Array.from({length:8},(_,i)=>`<g transform="translate(${70+i%4*70} ${55+Math.floor(i/4)*55})"><g class="${i%2?'ph-ion-negative':'ph-ion-positive'}"><circle class="${i%2?'ph-negative':'ph-positive'}" r="18"/><text class="ph-sign" y="6" text-anchor="middle">${i%2?'−':'+'}</text></g></g>`).join('');
    if(n===2)inner+=[-60,80,-30,130].map((a,i)=>dipole(60+i*80,78,a,15,true,key)).join('');
    if(n===3)inner+=`<path class="ph-slab" d="M45 35H180V120H45Z"/><path class="ph-slab secondary" d="M180 35H315V120H180Z"/><path class="ph-interface" d="M180 35V120"/><text class="ph-small" x="100" y="25">Medio A</text><text class="ph-small" x="235" y="25">Medio B</text>${Array.from({length:4},(_,i)=>`<g class="ph-interface-charge"><text class="ph-plus-label" x="159" y="${53+i*19}">+</text><text class="ph-minus-label" x="188" y="${53+i*19}">−</text></g>`).join('')}`;
    return svg(inner,['Desplazamiento de la nube electrónica','Desplazamiento relativo de iones de signo opuesto','Dipolos permanentes con orientaciones diferentes','Acumulación de cargas junto a una interfaz'][n],'0 0 400 150','ph-mechanism-graphic');
  }
  function particles(state) {
    const points=Array.from({length:state===2?9:20},(_,i)=>state===0?[70+i%5*42+(i%3-1)*6,34+Math.floor(i/5)*33+(i%4-1.5)*4]:state===1?[45+(i*47)%230,24+(i*31)%110]:[35+(i*83)%280,20+(i*57)%120]);
    return svg(`<rect class="ph-container" x="15" y="8" width="320" height="145" rx="20"/>${points.map(([x,y],i)=>`<g transform="translate(${x} ${y})"><circle class="ph-state-particle state-particle-${state}" r="${state===2?6:8}" style="animation-delay:${-i*.28}s"/></g>`).join('')}`,['Partículas próximas que vibran alrededor de posiciones fijas en un esquema sólido','Partículas próximas que cambian de posición relativa en un líquido','Partículas más separadas en un gas'][state],'0 0 350 165','ph-state-graphic')+`<p class="ph-state-note">${['Posiciones casi fijas','Movimiento relativo','Mayor separación'][state]}</p>`;
  }
  function definition() {
    const key='ph-definition-arrow';return svg(arrow(key)+`<path class="ph-electrode positive" d="M35 54H51V249H35Z"/><path class="ph-electrode negative" d="M429 54H445V249H429Z"/><text class="ph-plus-label" x="32" y="35">+</text><text class="ph-minus-label" x="429" y="35">−</text><path class="ph-slab" d="M123 76H357V236H123Z"/><text class="ph-medium" x="240" y="282" text-anchor="middle">Cargas ligadas dentro del material</text>${[95,151,207].map(y=>`<path class="ph-field-arrow faint" d="M65 ${y}H415" marker-end="url(#${key})"/>`).join('')}${[0,1,2,3,4,5].map(i=>dipole(168+i%3*70,112+Math.floor(i/3)*76,[-90,60,130,-50,80,-140][i],[-15,20,-25,30,-10,20][i],true,key)).join('')}<text class="ph-medium" x="240" y="33" text-anchor="middle">Campo externo E</text>`,'Un dieléctrico entre electrodos. Las cargas ligadas responden al campo, permaneciendo dentro del material.','0 0 480 310','ph-definition-graphic');
  }
  function compare(type) {
    const id=`ph-compare-${type}`;let html=arrow(id);
    for(let i=0;i<4;i++) {
      if(type==='polar')html+=dipole(65+i*75,80,[-70,80,-45,135][i],[-15,25,-20,30][i],true,id);
      else html+=`<g transform="translate(${65+i*75} 80)"><g class="ph-electron-cloud ph-comparison-cloud"><ellipse rx="24" ry="19"/></g><circle class="ph-positive" r="8"/><text class="ph-sign" y="4" text-anchor="middle">+</text></g>`;
    }
    html+=`<path class="ph-field-arrow" d="M40 24H325" marker-end="url(#${id})"/><text class="ph-small" x="185" y="17" text-anchor="middle">Mismo campo externo</text>`;
    return svg(html,type==='polar'?'Dipolos permanentes que se orientan parcialmente':'Dipolos inducidos por el campo','0 0 370 130','ph-comparison-graphic');
  }
  function direction() {
    const id='ph-response-arrow';return svg(arrow(id)+`<circle class="ph-response-contour" cx="100" cy="85" r="48"/><ellipse class="ph-response-contour other" cx="300" cy="85" rx="58" ry="29"/><g transform="translate(100 85)"><g class="ph-scan"><path class="ph-response-vector" d="M0 0H47" marker-end="url(#${id})"/></g></g><g transform="translate(300 85)"><g class="ph-scan anisotropic"><path class="ph-response-vector" d="M0 0H57" marker-end="url(#${id})"/></g></g><text class="ph-small" x="100" y="159" text-anchor="middle">Isótropo</text><text class="ph-small" x="300" y="159" text-anchor="middle">Anisótropo</text>`,'Contornos cualitativos de respuesta para igual intensidad de campo: circular en medio isótropo y elíptico en un ejemplo anisótropo.','0 0 400 180','ph-property-graphic');
  }
  function position() {
    return svg(`<rect class="ph-slab" x="35" y="20" width="330" height="50" rx="5"/><rect class="ph-slab" x="35" y="98" width="165" height="50" rx="5"/><rect class="ph-slab secondary" x="200" y="98" width="165" height="50" rx="5"/><text class="ph-small" x="200" y="53" text-anchor="middle">Homogéneo: misma propiedad</text><text class="ph-small" x="110" y="130" text-anchor="middle">Región A</text><text class="ph-small" x="280" y="130" text-anchor="middle">Región B</text><g class="ph-position-probe"><circle class="ph-probe" cx="75" cy="45" r="24"/><circle class="ph-probe" cx="75" cy="123" r="24"/></g>`,'Comparación espacial: un medio uniforme y otro con dos regiones diferentes. El punto de observación cambia de posición.','0 0 400 180','ph-property-graphic');
  }
  function glass() {
    const points=[[83,75],[123,53],[173,83],[225,54],[255,108],[201,130],[148,117],[101,142],[78,195],[136,206],[174,169],[230,197],[270,161]];
    return svg(`<path class="ph-glass-edge" d="M55 45 85 20H305V220L275 250H55Z"/><path class="ph-slab" d="M55 45H275V250H55Z"/><path class="ph-glass-edge" d="M275 45 305 20M275 45V250M55 45 85 20"/>${[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[0,7],[7,8],[8,9],[9,10],[10,6],[10,11],[11,12],[12,5]].map(([a,b])=>`<path class="ph-glass-link" d="M${points[a].join(' ')} ${points[b].join(' ')}"/>`).join('')}${points.map(([x,y],i)=>`<circle class="ph-glass-node" cx="${x}" cy="${y}" r="${i%3?5:7}"/>`).join('')}<text class="ph-medium" x="180" y="285" text-anchor="middle">Red amorfa: esquema</text>`,'Muestra de vidrio ilustrada con una red irregular, sin orden cristalino periódico.','0 0 360 305','ph-glass-graphic');
  }
  function mapLinks(){return `<svg class="ph-map-wires" viewBox="0 0 1120 340" aria-hidden="true">${[26,94,162,230,298].map((y,i)=>`<path d="M280 195C350 195 340 ${y} ${[415,455,472,455,415][i]} ${y}"/><circle cx="${[415,455,472,455,415][i]}" cy="${y}" r="3"/>`).join('')}</svg>`;}
  function summary(){return `<div class="ph-summary-ribbon" aria-hidden="true"><span>${svg(`<g transform="translate(40 30)"><circle class="ph-negative" cx="-16" r="10"/><circle class="ph-positive" cx="16" r="10"/><path class="ph-bond" d="M-6 0H6"/></g>`,'','0 0 80 60')}Dipolos</span><span>${svg(`<path class="ph-response-vector" d="M15 45 38 18 45 29 66 9"/><circle class="ph-positive" cx="66" cy="9" r="4"/>`,'','0 0 80 60')}Respuesta al campo</span><span>${svg(`<circle class="ph-response-contour" cx="40" cy="30" r="20"/><path class="ph-field-arrow" d="M40 30H60M40 30V10"/>`,'','0 0 80 60')}Propiedades del medio</span></div>`;}
  function init(){
    let timer;
    window.addEventListener('slidechange',event=>{
      clearTimeout(timer);document.querySelectorAll('.slide.ph-active').forEach(s=>s.classList.remove('ph-active'));
      const slide=document.querySelector(`.slide[data-slide="${event.detail.index+1}"]`);
      timer=setTimeout(()=>{if(slide&&!slide.hidden)slide.classList.add('ph-active');},1100);
    });
  }
  window.DielectricPhenomena={molecular,mechanism,particles,definition,compare,direction,position,glass,mapLinks,summary,init};
})();
