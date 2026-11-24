// W1: for each J3 unit, take the inserted texts of J3 on the 595c base (A2->B2) and check that removing exactly those texts from J3-on-J2 (B1) gives the live J2 base (A1).
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p));return j.data||j;};
function lib(w){const c=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const i=c.indexOf('/*LIB*/'),k=c.indexOf('/*MAP*/');return JSON.parse(c.slice(i+7,k).trim().replace(/;$/,''));}
function insOnly(a,b){let i=0,j=0;const ins=[];while(i<a.length){if(a[i]===b[j]){i++;j++;continue;}const key=a.slice(i,i+60);const k=b.indexOf(key,j);if(k<0)return null;ins.push(b.slice(j,k));j=k;}if(j<b.length)ins.push(b.slice(j));return ins;}
function removable(b,a,ins){ // try every placement of the inserts, in order, so that removal gives a
 const go=(s,from,idx)=>{if(idx===ins.length)return s===a;let p=s.indexOf(ins[idx],from);while(p>=0){const t=s.slice(0,p)+s.slice(p+ins[idx].length);if(a.startsWith(t.slice(0,p))&&go(t,p,idx+1))return true;p=s.indexOf(ins[idx],p+1);}return false;};return go(b,0,0);}
const [a1,b1,a2,b2]=process.argv.slice(2).map(load);
const units=[];for(const nm of ['Panel Build','Build Independent Verdict'])units.push([nm,w=>{const n=w.nodes.find(n=>n.name===nm);return n?n.parameters.jsCode:''}]);
for(const k of [2784,2789,2929,2959,3564])units.push(['LIB '+k,w=>lib(w)[k]]);
let all=true;for(const [nm,g] of units){const ins=insOnly(g(a2),g(b2));const ok=!!ins&&removable(g(b1),g(a1),ins);all=all&&ok;console.log(nm.padEnd(28),'J3 inserts',ins?ins.map(x=>x.length).join(','):'?','| removing them from J3-on-J2 gives the J2 base:',ok);}
// and nothing else differs in the library
const L1=lib(b1),L0=lib(a1);const other=[];for(let k=0;k<Math.max(L1.length,L0.length);k++)if(L1[k]!==L0[k]&&![2784,2789,2929,2959,3564].includes(k))other.push(k);
console.log('other library lines changed:',other.length?other.join(','):'none','| lines',L0.length,L1.length);console.log('ALL:',all&&!other.length);
