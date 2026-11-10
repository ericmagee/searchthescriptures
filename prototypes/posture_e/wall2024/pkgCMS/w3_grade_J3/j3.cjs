const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const S=JSON.stringify;
const B=g('/mnt/project-files/wall2024/parent_s115_BRF4.json'),J=g('/mnt/project-files/wall2024/joint_s115_BRF4_CCM_CMS.json');
const cut=c=>{const k=c.indexOf('const REFP=');const ke=c.indexOf('})();',k)+5;const i=c.indexOf('const C4P=');const e=c.indexOf('})();',i)+5;return [c.slice(k,ke),c.slice(i,e)];};
const mk=(W,name)=>{const [r,p]=cut(W.nodes.find(x=>x.name===name).parameters.jsCode);return new Function(r+'\n'+p+'\nreturn {REFP,C4P};')();};
const N=J.nodes.filter(n=>(n.parameters.jsCode||'').includes('const C4P=')).map(n=>n.name);
const d='../../pkgBRF/w3_grade/';const L=require(d+'labels3c.json').cases.concat(require(d+'labels.json').cases.map(c=>({id:c.id,E:c.earlier.join('\n'),c:c.c4})),require(d+'labels4b.json').cases,require(d+'labels4.json').cases);
const res=(R,E,c)=>{const F1={gr1:E,gr2:'',dr3:'',dr4:c},F2={cr1:E,gr1:'',cr2:'',gr2:'',cr3:'',dr3:'',cr4:c};const x=R.C4P.of(F1),y=R.C4P.ofD(F2);return S([[...x],x.u,[...y],y.u,R.C4P.note(F1),R.C4P.noteD(F2)]);};
const b=mk(B,'Build Synthesis');let n=0,bad=0;for(const nm of N){const z=mk(J,nm);for(const c of L){n++;if(res(z,c.E,c.c)!==res(b,c.E,c.c))bad++;}}
console.log('J3 cases',L.length,'x copies',N.length,'=',n,'| differing from the BRF4 file:',bad);
