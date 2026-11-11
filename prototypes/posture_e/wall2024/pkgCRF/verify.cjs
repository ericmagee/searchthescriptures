// pkgCRF verify: (1) every stub rebuilds; the six touched stubs differ from s133 only by the removed text; (2) node replay of every Code node
// with a stored run (ISO time stamps masked: the nodes stamp the replay time), s133 vs CRF, on every export: outputs equal except response_format missing from cure request bodies.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const L=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=L(process.env.BASE||'fetchback_live_s133.json'),B=L(process.env.CAND||'parent_s133_CRF.json');
const libOf=d=>{const lib=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const i=lib.lastIndexOf('\n/*MAP*/'),e=lib.lastIndexOf('\n/*END*/');return {L:JSON.parse(lib.slice(lib.indexOf('\n/*LIB*/')+8,i)),M:JSON.parse(lib.slice(i+8,e))};};
const rb=(d,n)=>{const {L,M}=libOf(d);const m=M[n];const s=m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(s.length!==m.n)throw new Error('length '+n);return s;};
const MA=libOf(A).M;let eq=0,ch=[];for(const n of Object.keys(MA)){const x=rb(A,n),y=rb(B,n);if(x===y)eq++;else{const z=x.split('b.response_format=xkRF();').join('');ch.push(n+(z===y?' (only the removed text)':(process.env.CAND&&z.replace(/function xkRF\(\)\{[^\n]*/,'')===y?' (removed text + blank xkRF line)':' OTHER DIFF')));}}
console.log('stubs',Object.keys(MA).length,'rebuild equal',eq,'| changed:',ch.join('; '));
const nonLib=A.nodes.filter(n=>n.name!=='Shared Library'&&JSON.stringify(n.parameters)!==JSON.stringify(B.nodes.find(m=>m.name===n.name).parameters));console.log('other nodes with different parameters:',nonLib.length);
// (2) replay
const conns=A.connections;const predOf=n=>{for(const [s,o] of Object.entries(conns))for(const br of o.main||[])for(const t of br||[])if(t.node===n)return s;};
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=(rd,d)=>{const lo=n=>{const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};return [n=>{const o=lo(n)||[];const nd=d.nodes.find(z=>z.name===n);return {params:nd?nd.parameters:{},isExecuted:!!rd[n],first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};},lo];};
const strip=o=>JSON.stringify(o,(k,v)=>k==='response_format'&&v&&v.json_schema&&v.json_schema.name==='cure_lines'?undefined:v);
(async()=>{const T={runs:0,equal:0,rf_only:0,other:0,err_same:0,err_diff:0};const rfn=new Set();
for(const e of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).map(f=>f.match(/\d+/)[0]).sort()){const X=JSON.parse(fs.readFileSync(W+'ex'+e+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;
 for(const n of Object.keys(MA)){if(!rd[n])continue;T.runs++;let x,y,ex,ey;const [$a,la]=mk(rd,A),[$b]=mk(rd,B);const inp=la(predOf(n))||[];
  try{x=await runSrc(A.nodes.find(z=>z.name===n).parameters.jsCode,$a,inp);}catch(er){ex=er.message;}try{y=await runSrc(B.nodes.find(z=>z.name===n).parameters.jsCode,$b,inp);}catch(er){ey=er.message;}
  if(ex||ey){if(ex===ey)T.err_same++;else{T.err_diff++;console.log('ERR DIFF',e,n,ex,'|',ey);}continue;}
  const TM=s=>s.replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d+Z/g,'<now>');const sx=TM(JSON.stringify(x)),sy=TM(JSON.stringify(y));if(sx===sy)T.equal++;else if(TM(strip(x))===sy){T.rf_only++;rfn.add(n);}else{T.other++;console.log('OTHER',e,n);}}}
console.log('replay',JSON.stringify(T),'| nodes whose output differs only by the cure_lines response_format:',[...rfn].join(', '));})();
