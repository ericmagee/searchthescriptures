// Joint s151 + pkgMSO + pkgRPS + pkgUOR + pkgCNP rev 2: nodes that differ from live, and the size of each, with the rebuilt library node lengths.
const fs=require('fs');const L=f=>JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8'));const A=L('fetchback_live_s151.json'),B=L('parent_s151_JOINT_MSO_RPS_UOR_CNP.json');
const js=n=>n.parameters.jsCode||'';let tot=0;console.log('nodes',A.nodes.length,B.nodes.length,'connections equal',JSON.stringify(A.connections)===JSON.stringify(B.connections));
for(const n of A.nodes){const m=B.nodes.find(x=>x.name===n.name);if(JSON.stringify(n)!==JSON.stringify(m)){const d=js(m).length-js(n).length;tot+=d;console.log('differs:',n.name,js(n).length,'->',js(m).length,'('+(d>=0?'+':'')+d+')');}}
console.log('total stored jsCode change',tot);
const map=W=>{const T=W.nodes.find(z=>z.name==='Shared Library').parameters.jsCode;const b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');return JSON.parse(T.slice(b+8,c));};const ma=map(A),mb=map(B);let rt=0;
for(const e in mb)if(!ma[e]||ma[e].n!==mb[e].n){rt+=mb[e].n-(ma[e]?ma[e].n:0);console.log('  rebuilt',e,ma[e]&&ma[e].n,'->',mb[e].n,'(+'+(mb[e].n-ma[e].n)+')');}
console.log('rebuilt node code at run time, sum of changes',rt);
