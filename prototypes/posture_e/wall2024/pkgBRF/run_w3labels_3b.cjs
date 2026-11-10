// W3 grade of pkgBRF rev 3: run C4P.fresh from each of the 12 nodes, live s114 against the candidate, on labels.json; check the 12 copies agree; unchanged-node check.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s115.json'),B=g('/mnt/project-files/wall2024/parent_s115_BRF3b.json');
const mk=(W,name)=>{const c=W.nodes.find(x=>x.name===name).parameters.jsCode;const k=c.indexOf('const REFP=');const ke=c.indexOf('})();',k)+5;const i=c.indexOf('const C4P=');const e=c.indexOf('})();',i)+5;return new Function(c.slice(k,ke)+'\n'+c.slice(i,e)+'\nreturn {REFP,C4P};')();};
const N=B.nodes.filter(n=>(n.parameters.jsCode||'').includes('const C4P=')).map(n=>n.name);console.log('nodes with C4P:',N.length);
const L=require('./w3_grade/labels.json').cases;const S=JSON.stringify;
const a=mk(A,'Build Synthesis'),b=mk(B,'Build Synthesis');
for(const c of L){const x=a.C4P.fresh(c.earlier,c.c4),y=b.C4P.fresh(c.earlier,c.c4);const ok=c.expect?S(y)===S(c.expect):c.expect_count!=null?y.length===c.expect_count:null;console.log(c.id,'live',S(x),'| cand',S(y),'|',ok===null?'RECORD':ok?'AS LABELLED':'NOT AS LABELLED');}
let dis=0;for(const n of N){const z=mk(B,n);for(const c of L)if(S(z.C4P.fresh(c.earlier,c.c4))!==S(b.C4P.fresh(c.earlier,c.c4)))dis++;}console.log('copies disagreeing with Build Synthesis (12 nodes x cases):',dis);
// REFP text unchanged in every node
let rp=0;for(const n of B.nodes){const ca=(A.nodes.find(x=>x.name===n.name).parameters.jsCode||''),cb=n.parameters.jsCode||'';const f=c=>{const k=c.indexOf('const REFP=');return k<0?'':c.slice(k,c.indexOf('})();',k));};if(f(ca)!==f(cb))rp++;}console.log('nodes whose REFP text differs:',rp);
if(process.argv[2]==='bare'){for(const t of ['Numbers 1:2 and 1:18 give','Numbers 1:2, 1:18 give','see also Numbers (1:18).','Luke 1:27 and 1:34'])console.log(t,'=>',S(a.REFP.parse(t,{scoped:true}).map(r=>[r.book,r.ctx,r.label])));}
