// W1: compare the inserted texts of J3 on two bases (A1->B1 and A2->B2), node by node and library line by line.
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p));return j.data||j;};
function lib(w){const c=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const i=c.indexOf('/*LIB*/'),k=c.indexOf('/*MAP*/');return JSON.parse(c.slice(i+7,k).trim().replace(/;$/,''));}
function insOnly(a,b){let i=0,j=0;const ins=[];while(i<a.length){if(a[i]===b[j]){i++;j++;continue;}const key=a.slice(i,i+60);const k=b.indexOf(key,j);if(k<0)return {ok:false,ctx:a.slice(i-60,i+60)};ins.push(b.slice(j,k));j=k;}if(j<b.length)ins.push(b.slice(j));return {ok:true,ins};}
const [a1,b1,a2,b2]=process.argv.slice(2).map(load);
const units=[];for(const nm of ['Panel Build','Build Independent Verdict'])units.push([nm,w=>w.nodes.find(n=>n.name===nm).parameters.jsCode]);
for(const k of [2784,2789,2929,2959,3564])units.push(['LIB '+k,w=>lib(w)[k]]);
let all=true;for(const [nm,g] of units){const r1=insOnly(g(a1),g(b1)),r2=insOnly(g(a2),g(b2));const same=r1.ok&&r2.ok&&JSON.stringify(r1.ins)===JSON.stringify(r2.ins);all=all&&same;
 console.log(nm.padEnd(28),'onJ2',r1.ok?'ins '+r1.ins.map(x=>x.length).join(','):'OTHER','| on595c',r2.ok?'ins '+r2.ins.map(x=>x.length).join(','):'OTHER','| same inserted text:',same);}
console.log('ALL SAME:',all);
