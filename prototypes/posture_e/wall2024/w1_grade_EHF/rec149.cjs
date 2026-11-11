const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const P='/mnt/project-files/wall2024/';
const S=L(P+'fetchback_live_s120.json'),E=L(P+'parent_s120_EHF2.json');const RD=JSON.parse(fs.readFileSync(P+'ex34852_full.json','utf8')).data.resultData.runData;
const O3047='with the FORCED line for the pair given only when the gate asks for it',O3115='and give the FORCED line when the gate asks for it';
(async()=>{const N='Send Back Build';const a=(await run(S.code(N),N,RD)).map(i=>i.json||i),b=(await run(E.code(N),N,RD)).map(i=>i.json||i);
let T=0,F=0;for(let s=0;s<a.length;s++){const strs=o=>{const r=[];const w=(v,p)=>{if(typeof v==='string')r.push([p,v]);else if(v&&typeof v==='object')for(const k in v)w(v[k],p+'.'+k);};w(o,'');return r;};
 const A=strs(a[s]),B=strs(b[s]);A.forEach(([p,v],j)=>{const n1=v.split(O3047).length-1,n2=v.split(O3115).length-1;const exp=11*n1-30*n2,got=B[j][1].length-v.length;T+=got;F+=exp;if(got||exp)console.log(a[s].seat,p,'| 3047 x',n1,'3115 x',n2,'| formula',exp,'measured',got,'| live len',v.length,'EHF2 len',B[j][1].length);});}
console.log('formula total',F,'measured total',T);})();
(async()=>{await new Promise(r=>setTimeout(r,100));const N='Send Back Build';const a=(await run(S.code(N),N,RD)).map(i=>i.json||i),b=(await run(E.code(N),N,RD)).map(i=>i.json||i);
const s=a.findIndex(x=>x.seat==='chatgpt');const A=a[s].msg,B=b[s].msg;let i=0;while(A[i]===B[i])i++;let j=0;while(A[A.length-1-j]===B[B.length-1-j])j++;
console.log('first diff',i,'last diff from end',j);const segA=A.slice(i,A.length-j),segB=B.slice(i,B.length-j);
// walk aligned pieces
const lines=t=>t.split('\n');const la=lines(A),lb=lines(B);la.forEach((l,k)=>{if(l!==lb[k])console.log('LINE',k,'len',l.length,'->',lb[k].length,'| live tail:',JSON.stringify(l.slice(-120)),'\n   EHF2 tail:',JSON.stringify(lb[k].slice(-120)));});})();
