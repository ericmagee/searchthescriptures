// ASK 362 build (W2 plan Wall 7588; W1 7592 P1-P3): a gate or send-back CHANGE that turns a FORCED line of pair P into P's collision line,
// while P's collision line already stands, writes that line once: the label-P line(s) take the text and the FORCED line is struck (to '').
// Usage: node build362.cjs <base.json> <out.json> <lib.cjs>. Base: live s244, or ASK 360 stacked on it (anchor on line 1450 only).
const fs=require('fs');const {unpack,rb}=require(process.argv[4]);
const W=JSON.parse(fs.readFileSync(process.argv[2]));const U=unpack(W);const L=U.L.slice();
const rep=(i,a,b)=>{const n=L[i].split(a).length-1;if(n!==1)throw new Error('line '+i+': anchor found '+n+' times');L[i]=L[i].replace(a,()=>b);};
rep(1450,"  for(const o2 of [...new Set([o].concat(same))]){const p=map.get(o2);map.set(o2,{sid:x.sid,to,over:p&&p.sid!==x.sid?(p.over||[]).concat(p.sid):(p?p.over:[])});}}",
"  const __fk=(()=>{if(!lk||!same.length||same.includes(o))return false;const m=nrm(o).match(/^\\s*(?:[-\\u2022]|\\d+[.)])?\\s*FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:\\s*(D\\d+)\\s+VS\\.?\\s+(C\\d+)\\b/i);return !!m&&(m[1]+' VS '+m[2]).toUpperCase()===lk;})(); /* ASK 362: a FORCED line of pair P changed to P's collision line, with P's collision line standing, is struck, so the line is written once */  for(const o2 of [...new Set([o].concat(same))]){const p=map.get(o2);map.set(o2,{sid:x.sid,to:(__fk&&o2===o)?'':to,over:p&&p.sid!==x.sid?(p.over||[]).concat(p.sid):(p?p.over:[])});}}");
const M=JSON.parse(JSON.stringify(U.M));for(const k of Object.keys(M))M[k].n=rb(L,M[k]).length;
const T=U.hdr+'\n/*LIB*/'+JSON.stringify(L)+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const out=JSON.parse(JSON.stringify(W));out.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=T;fs.writeFileSync(process.argv[3],JSON.stringify(out));
const T0=U.hdr+'\n/*LIB*/'+JSON.stringify(U.L)+'\n/*MAP*/'+JSON.stringify(U.M)+U.tail;console.log('base rebuild byte-equal',T0===U.T);
