const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));if(j.data)j=j.data;return j;};
function lib(p){const c=load(p).nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const i=c.indexOf('/*LIB*/'),j=c.indexOf('/*MAP*/');
 const L=JSON.parse(c.slice(i+7,j).trim().replace(/;$/,''));return {L,map:c.slice(j),pre:c.slice(0,i)};}
function d(a,b){const A=lib(a),B=lib(b);const out=[];const n=Math.max(A.L.length,B.L.length);for(let k=0;k<n;k++)if(A.L[k]!==B.L[k])out.push(k);return {n:[A.L.length,B.L.length],lines:out,map:A.map===B.map,pre:A.pre===B.pre,A,B};}
const mode=process.argv[2];
if(mode==='show'){const r=d(process.argv[3],process.argv[4]);console.log(r.n,r.lines,'map same',r.map,'pre same',r.pre);for(const k of r.lines){console.log('--',k,'\nA:',(r.A.L[k]||'').slice(0,400),'\nB:',(r.B.L[k]||'').slice(0,400));}}
if(mode==='delta'){// compare delta of pair1 with delta of pair2
 const r1=d(process.argv[3],process.argv[4]),r2=d(process.argv[5],process.argv[6]);
 console.log('delta1 lines',r1.lines,'delta2 lines',r2.lines);
 const same=r1.lines.length===r2.lines.length&&r1.lines.every((k,i)=>k===r2.lines[i]&&r1.B.L[k]===r2.B.L[k]&&r1.A.L[k]===r2.A.L[k]);
 console.log('same before and after text on each line:',same);
 for(const k of r1.lines)console.log(k,'new eq',r1.B.L[k]===r2.B.L[k],'old eq',r1.A.L[k]===r2.A.L[k]);}
