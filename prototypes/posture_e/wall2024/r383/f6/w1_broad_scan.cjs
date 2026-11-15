const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));
const l=L[1754];const f=new Function(l.slice(l.indexOf('function gateVnv2024'))+';return gateVnv2024;')();
const J=JSON.parse(fs.readFileSync('jall.json'));const jt=t=>{t=String(t);const i=t.indexOf('\n[AUDIT');return i>0?t.slice(0,i):t;};
// broad miss scan: any judgment text with both "premise N ... VOID" and "premise N ... not VOID" anywhere (any line, any label)
let gate=0,broad=0;const miss=[];
for(const j of J){const t=jt(j.verdict_raw).replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const g=f(jt(j.verdict_raw)).length>0;if(g)gate++;
 const V={},NV={};for(const ln of t.split('\n'))for(const seg of ln.split(/(?=\bPremises?\s+\d)/i)){const m=seg.match(/^Premise\s+(\d+)\b([^]*?)(?=[.;](?:\s|$)|$)/i);if(!m)continue;const head=ln.slice(0,40);if(/not\s+VOID|no longer VOID/i.test(m[2]))(NV[m[1]]=NV[m[1]]||[]).push(ln.slice(0,220));else if(/\bVOID\b/.test(m[2]))(V[m[1]]=V[m[1]]||[]).push(ln.slice(0,220));}
 const both=Object.keys(V).filter(k=>NV[k]);if(both.length){broad++;if(!g)miss.push([j.id,j.judge_seat,both,both.map(k=>[V[k][0],NV[k][0]])]);}}
console.log('gate',gate,'broad',broad,'broad-not-gate',miss.length);for(const m of miss)console.log(JSON.stringify(m,null,1));
