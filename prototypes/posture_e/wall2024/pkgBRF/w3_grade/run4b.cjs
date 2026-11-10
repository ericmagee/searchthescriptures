// W3 check of pkgBRF rev 4: size and my labels4 on the book line; both checks; 12 copies.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s115.json'),B=g('/mnt/project-files/wall2024/parent_s115_BRF4.json');const S=JSON.stringify;
const by={};A.nodes.forEach(n=>by[n.name]=n);let tot=0,names=[],other=0;B.nodes.forEach(n=>{if(S(by[n.name])!==S(n)){const ca=by[n.name].parameters.jsCode||'',cb=n.parameters.jsCode||'';tot+=cb.length-ca.length;names.push(cb.length-ca.length);if(S({...n,parameters:{...n.parameters,jsCode:0}})!==S({...by[n.name],parameters:{...by[n.name].parameters,jsCode:0}}))other++;}});
const {nodes:_a,...ra}=A,{nodes:_b,...rb}=B;
console.log('DIFF nodes',names.length,'each',[...new Set(names)].join(','),'total',tot,'non-code differences',other,'nodes',A.nodes.length,B.nodes.length,'rest equal',S(ra)===S(rb));
const cut=c=>{const k=c.indexOf('const REFP=');const ke=c.indexOf('})();',k)+5;const i=c.indexOf('const C4P=');const e=c.indexOf('})();',i)+5;return [c.slice(k,ke),c.slice(i,e)];};
const mk=(W,name)=>{const [r,p]=cut(W.nodes.find(x=>x.name===name).parameters.jsCode);return new Function(r+'\n'+p+'\nreturn {REFP,C4P};')();};
const N=B.nodes.filter(n=>(n.parameters.jsCode||'').includes('const C4P=')).map(n=>n.name);
const a=mk(A,'Build Synthesis'),b=mk(B,'Build Synthesis');
const F1=(E,c)=>({gr1:E,gr2:'',dr3:'',dr4:c}),F2=(E,c)=>({cr1:E,gr1:'',cr2:'',gr2:'',cr3:'',dr3:'',cr4:c});
const res=(R,E,c)=>{const x=R.C4P.of(F1(E,c)),y=R.C4P.ofD(F2(E,c));return {dr:{n:[...x],u:x.u||[]},cr:{n:[...y],u:y.u||[]},note:R.C4P.note(F1(E,c)),noteD:R.C4P.noteD(F2(E,c))};};
let dis=0;
for(const c of require('./labels4b.json').cases){const l=res(a,c.E,c.c),r=res(b,c.E,c.c);
 let ok=true;const why=[];
 for(const k of ['dr','cr']){const o=r[k];if(c.new&&S(o.n)!==S(c.new)){ok=false;why.push(k+' new');}if(c.new_has&&!c.new_has.every(z=>o.n.includes(z))){ok=false;why.push(k+' new_has');}if(c.line_count!=null&&o.u.length!==c.line_count){ok=false;why.push(k+' line');}
  // no silent drop: every live label's chapter:verse appears in new or on the line
  for(const lab of l[k].n){const cv=lab.replace(/.* /,'');if(!o.n.some(z=>z.endsWith(cv))&&!o.u.some(z=>z.startsWith(cv+' '))){ok=false;why.push(k+' DROP '+lab);}}}
 console.log(c.id,ok?'AS LABELLED':'NOT AS LABELLED '+why.join(','),'| live',S(l.dr.n),'| rev4 new',S(r.dr.n),'line',S(r.dr.u),S(r.dr)===S(r.cr)?'':'| CR4 differs '+S(r.cr),'| note len',r.note.length,r.noteD.length);
 for(const n of N){const z=res(mk(B,n),c.E,c.c);if(S(z)!==S(r))dis++;}}
console.log('copies',N.length,'disagreeing',dis);
