const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p));return j.data||j;};
function lib(w){const c=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const i=c.indexOf('/*LIB*/'),k=c.indexOf('/*MAP*/');return JSON.parse(c.slice(i+7,k).trim().replace(/;$/,''));}
// is b = a with only insertions? greedy LCS by chunks
function insOnly(a,b){let i=0,j=0;const ins=[];while(i<a.length){if(a[i]===b[j]){i++;j++;continue;}// find next match of a[i..i+40] in b from j
 const key=a.slice(i,i+60);const k=b.indexOf(key,j);if(k<0)return {ok:false,at:i,ctx:a.slice(i-60,i+60)};ins.push([j,b.slice(j,k)]);j=k;}if(j<b.length)ins.push([j,b.slice(j)]);return {ok:true,ins};}
const A=load(process.argv[2]),B=load(process.argv[3]);
for(const nm of ['Panel Build','Build Independent Verdict']){const r=insOnly(A.nodes.find(n=>n.name===nm).parameters.jsCode,B.nodes.find(n=>n.name===nm).parameters.jsCode);console.log(nm,r.ok?'INSERTIONS ONLY':'OTHER',r.ok?r.ins.map(x=>x[1].length).join(','):r.ctx);}
const la=lib(A),lb=lib(B);for(const k of [2784,2789,2929,2959,3564]){const r=insOnly(la[k],lb[k]);console.log('LIB',k,r.ok?'INSERTIONS ONLY':'OTHER',r.ok?r.ins.map(x=>x[1].length+':'+x[1].slice(0,140).replace(/\n/g,' ')).join(' || '):r.ctx);}
