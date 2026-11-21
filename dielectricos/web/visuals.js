/* Original vector illustrations: materials and molecular examples, not measured data. */
(() => {
 'use strict';
 const svg=(body,label,view='0 0 340 170')=>`<svg class="dv-illustration" viewBox="${view}" role="img" aria-label="${label}">${body}</svg>`;
 function material(n){
  const defs=`<defs><linearGradient id="dv-mat-${n}" x2="1" y2="1"><stop stop-color="#c5edff" stop-opacity=".8"/><stop offset=".45" stop-color="#a98df3" stop-opacity=".25"/><stop offset="1" stop-color="#7cc8d7" stop-opacity=".6"/></linearGradient></defs>`;
  const body=[
   `<path d="M52 54 119 22 226 52 158 88Z" fill="url(#dv-mat-0)"/><path d="M52 54V127L158 155V88M158 155 226 119V52" fill="#9eddeb22" stroke="#b5dcef"/><path d="M78 61 132 38M91 96 135 109M175 92 209 75" stroke="#f2f5ff" stroke-width="3" opacity=".7"/><path d="M249 65H285V77H249ZM243 82H291V94H243ZM240 100H294V112H240ZM248 118H286V130H248Z" fill="#bbb1d4" stroke="#f0d6aa"/><path d="M265 35H273V65M265 130H273V151" stroke="#ddb879" stroke-width="6"/>`,
   `<path d="M93 63 115 49H250L271 63V147H93Z" fill="#15393e" stroke="#a6d8df"/><path d="M108 78H255V139H108Z" fill="#d5a65533"/>${Array.from({length:10},(_,i)=>`<path d="M${117+i*13} 83V133" stroke="#e3bd80" opacity=".5"/>`).join('')}<path d="M128 49V20M160 49V20M225 49V20" stroke="#9eaacb" stroke-width="11"/><path d="M121 26H135M153 26H167M218 26H232" stroke="#e9d8bb" stroke-width="3"/><path d="M53 56C39 78 30 90 30 103a23 23 0 0 0 46 0C76 90 67 78 53 56Z" fill="url(#dv-mat-1)" stroke="#e0c48b"/><path d="M40 98Q37 111 47 115" stroke="#fff1c8" fill="none"/>`,
   `<path d="M40 48H128M211 48H299" stroke="#d6bd8d" stroke-width="10" stroke-linecap="round"/><path d="M116 28 139 48 116 68M223 28 200 48 223 68" fill="#b8a8dc" stroke="#e3d5fc"/><path d="M145 48H194" stroke="#bfc8ff" stroke-dasharray="2 9"/><path d="M50 114C90 78 110 146 161 112S239 83 285 112M81 144C119 107 168 162 209 137S268 121 299 132" fill="none" stroke="#b9dce9" opacity=".6" stroke-width="2"/>${[67,133,201,267].map((x,i)=>`<circle cx="${x}" cy="${95+i%2*42}" r="4" fill="#ded8ff"/>`).join('')}`
  ][n];
  return svg(defs+body,['Placa de vidrio y aislador sólido','Transformador con aceite aislante: esquema de aplicación','Aire seco entre dos conductores separados'][n]);
 }
 function molecule(polar){
  const atom=(x,y,r,name,color)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="#ede5ff" stroke-opacity=".5"/><ellipse cx="${x-6}" cy="${y-8}" rx="${r*.4}" ry="${r*.2}" fill="#ffffff33"/><text x="${x}" y="${y+6}" text-anchor="middle" fill="#11172b" font-size="22" font-family="Arial">${name}</text>`;
  const body=polar?`<path d="M140 58 91 112M140 58 189 112" stroke="#dcc7fc" stroke-width="13"/>${atom(140,58,29,'O','#d9b9f3')}${atom(91,112,21,'H','#e5e8fb')}${atom(189,112,21,'H','#e5e8fb')}<text x="140" y="16" text-anchor="middle" fill="#9bc7f1">δ−</text><text x="65" y="145" fill="#f0cd91">δ+</text><text x="200" y="145" fill="#f0cd91">δ+</text>`:`<path d="M97 69H183M97 82H183" stroke="#c2b3ee" stroke-width="5"/>${atom(94,75,32,'O','#cbbbe9')}${atom(186,75,32,'O','#cbbbe9')}`;
  return `<figure class="dv-molecule">${svg(body,polar?'Molécula angular de agua H₂O, con cargas parciales':'Molécula simétrica de oxígeno O₂, sin dipolo permanente','0 0 280 165')}<figcaption>${polar?'H₂O · ejemplo polar':'O₂ · ejemplo no polar'}</figcaption></figure>`;
 }
 function traits(){return `<ul class="dv-traits"><li><span>01</span><strong>Baja conductividad</strong><small>Dificulta el paso de corriente.</small></li><li><span>02</span><strong>Cargas ligadas</strong><small>Permanecen en el material.</small></li><li><span>03</span><strong>Polarización</strong><small>Las cargas se desplazan u orientan.</small></li></ul>`;}
 window.DielectricVisuals={material,molecule,traits};
})();
