// ASK 379: node by node, every chain Code node that ran in the n8n child gives what the s260 engine code gives on the same inputs.
// $(outside node) = the stored engine run; $(chain node) = the child's own output; $input = the child's input to that node; Shared Library = s260's.
const fs=require('fs');const [BASE,CHX,EX,PARENT_EXEC]=process.argv.slice(2);const W=JSON.parse(fs.readFileSync(BASE));const N=Object.fromEntries(W.nodes.map(n=>[n.name,n]));
const C=JSON.parse(fs.readFileSync(CHX)).data.resultData.runData;const S=JSON.parse(fs.readFileSync(EX)).data.resultData.runData;const chain=new Set(JSON.parse(fs.readFileSync('chain.json')));
const out=(rd,n,r)=>{const x=rd[n];if(!x)return null;const run=x[r==null?x.length-1:r];return ((run.data||{}).main||[[]])[0]||[];};
const mk$=nm=>{if(nm==='Shared Library')return {isExecuted:false,params:N['Shared Library'].parameters,first:()=>{throw new Error('SL')},all:()=>{throw new Error('SL')}};
 const it=chain.has(nm)?out(C,nm):out(S,nm);if(!it)return {isExecuted:false,params:(N[nm]||{}).parameters||{},first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)}};
 const rd=chain.has(nm)?C:S;const itemMatching=i=>{const R=rd[nm];for(let r=R.length-1;r>=0;r--){const o=(((R[r].data||{}).main||[])[0]||[]);if(o[i])return o[i];}throw new Error('no match');}; /* paired item: the latest run whose first output holds item i */
 return {isExecuted:true,params:(N[nm]||{}).parameters||{},first:()=>it[0],last:()=>it[it.length-1],all:()=>it,item:it[0],itemMatching};};
const js=JSON.stringify;let eq=0,ne=0,err=0;const AF=Object.getPrototypeOf(async function(){}).constructor;(async()=>{
for(const n of chain){const node=N[n];if(!C[n]||node.type!=='n8n-nodes-base.code')continue;const run=C[n][C[n].length-1];const src=(run.source||[])[0];
 const inp=src?(((C[src.previousNode][src.previousNodeRun||0].data||{}).main||[])[src.previousNodeOutput||0]||[]):[];
 let r;try{r=await new AF('$','$input','$execution','$json','require',node.parameters.jsCode)(mk$,{all:()=>inp,first:()=>inp[0],last:()=>inp[inp.length-1]},{id:PARENT_EXEC,customData:{set(){},get(){}}},(inp[0]||{}).json,require);}catch(e){err++;console.log('ERROR',n,e.message.slice(0,200));continue;}
 const strip=x=>JSON.parse(JSON.stringify(x,(k,v)=>k==='at'?undefined:v));
 const a=js(strip((r||[]).map(i=>i.json))),b=js(strip(out(C,n).map(i=>i.json)));if(a===b){eq++;console.log('EQUAL',n,b.length);}else{ne++;console.log('DIFFERS',n,a.length,b.length);}}
console.log('equal',eq,'differ',ne,'errors',err);})();
