// pkgCRF rev 2 verify on s135. (1) every stub rebuilds; each changed stub equals the base rebuild with the same text edits applied.
// (2) chained replay on every export: the six cure builders run on the candidate, and their candidate outputs feed every later library node
// (Normalize, FUM, Check ...); the base side is chained the same way from the base builders. Each candidate output must equal the base output from stored inputs with the cure_lines response_format removed.
// (3) the follow-up asks (FUM bodies) still end with the ANSWER FORMAT note on both sides.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const L=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=L(process.env.BASE||'fetchback_live_s135.json'),B=L(process.env.CAND||'parent_s135_CRF.json');
const libOf=d=>{const lib=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const i=lib.lastIndexOf('\n/*MAP*/'),e=lib.lastIndexOf('\n/*END*/');return {L:JSON.parse(lib.slice(lib.indexOf('\n/*LIB*/')+8,i)),M:JSON.parse(lib.slice(i+8,e))};};
const rb=(d,n)=>{const {L,M}=libOf(d);const m=M[n];const s=m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(s.length!==m.n)throw new Error('length '+n);return s;};
const ED=[["b.response_format=xkRF();",""],["((src.body.response_format&&src.body.response_format.type==='json_schema')?xkJsonNote():'')","(String((src.body.messages.slice(-1)[0]||{}).content||'').endsWith(xkJsonNote())?xkJsonNote():'')"]];
const MA=libOf(A).M;let eq=0,ch=[];for(const n of Object.keys(MA)){const x=rb(A,n),y=rb(B,n);if(x===y){eq++;continue;}let z=x;for(const [o,nw] of ED)z=z.split(o).join(nw);const zb=z.replace(/function xkRF\(\)\{[^\n]*/,'');ch.push(n+(z===y?' (the two edits only)':zb===y?' (the two edits + blank xkRF line)':' OTHER DIFF'));}
console.log('stubs',Object.keys(MA).length,'rebuild equal',eq,'| changed',ch.length+':',ch.join('; '));
console.log('other nodes with different parameters:',A.nodes.filter(n=>n.name!=='Shared Library'&&JSON.stringify(n.parameters)!==JSON.stringify(B.nodes.find(m=>m.name===n.name).parameters)).length,'| connections equal',JSON.stringify(A.connections)===JSON.stringify(B.connections));
const predOf=n=>{for(const [s,o] of Object.entries(A.connections))for(const br of o.main||[])for(const t of br||[])if(t.node===n)return s;};
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=(rd,d,over)=>{const lo=n=>{if(over&&n in over)return over[n];const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};return [n=>{const o=lo(n)||[];const nd=d.nodes.find(z=>z.name===n);return {params:nd?nd.parameters:{},isExecuted:!!lo(n),first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};},lo];};
const run=async(d,n,rd,over)=>{const [$,lo]=mk(rd,d,over);return await runSrc(d.nodes.find(z=>z.name===n).parameters.jsCode,$,lo(predOf(n))||[]);};
const TM=s=>s.replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d+Z/g,'<now>');
const strip=o=>JSON.stringify(o,(k,v)=>k==='response_format'&&v&&v.json_schema&&v.json_schema.name==='cure_lines'?undefined:v);
const BUILDERS=['Cure Build','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Alternate Cure Build','R2 Alternate Cure Build'];
const NOTE='ANSWER FORMAT: return one JSON object with one key, cure_lines';
(async()=>{const T={runs:0,equal:0,rf_only:0,other:0,err:0};const per={};const fum={base:0,cand:0,both_note:0,base_note:0,cand_note:0};const ORDER=['Shared Library'];
for(const e of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).map(f=>f.match(/\d+/)[0]).sort()){const X=JSON.parse(fs.readFileSync(W+'ex'+e+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;
 const over={},overA={};for(const n of BUILDERS)if(rd[n]){over[n]=await run(B,n,rd,null);overA[n]=await run(A,n,rd,null);}
 for(const n of Object.keys(MA)){if(!rd[n])continue;T.runs++;let x,y;try{x=BUILDERS.includes(n)?overA[n]:await run(A,n,rd,overA);y=BUILDERS.includes(n)?over[n]:await run(B,n,rd,over);}catch(er){T.err++;console.log('ERR',e,n,er.message);continue;}
  const sx=TM(JSON.stringify(x)),sy=TM(JSON.stringify(y));let k;if(sx===sy)k='equal';else if(TM(strip(x))===sy)k='rf_only';else{k='other';console.log('OTHER',e,n);}T[k]++;per[n+' '+k]=(per[n+' '+k]=0)+1;
  // follow-up asks: any nested body whose last user message is a follow-up (has messages >= 8 or a FUM marker)
  const fb=o=>{const r=[];JSON.stringify(o,(kk,v)=>{if(v&&typeof v==='object'&&Array.isArray(v.messages)&&kk!=='verdictBody'&&/^(fum|ask2|followup|follow_up|body2|second)$/i.test(kk))r.push(v);return v;});return r;};
  const fa=fb(x),fy=fb(y);fum.base+=fa.length;fum.cand+=fy.length;fa.forEach((b,i)=>{const nb=String(b.messages.slice(-1)[0].content).includes(NOTE),nc=fy[i]&&String(fy[i].messages.slice(-1)[0].content).includes(NOTE);if(nb)fum.base_note++;if(nc)fum.cand_note++;if(nb&&nc)fum.both_note++;});}}
console.log('chained replay',JSON.stringify(T));console.log('by node:',Object.keys(per).filter(k=>!/ equal$/.test(k)).join(', '));console.log('follow-up bodies found',JSON.stringify(fum));})();
