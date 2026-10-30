const fs=require('fs');const src=fs.readFileSync(process.argv[2],'utf8');
const api=new Function(src+';return {preCheckSide,preCheckBlock};')();
const rows=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
let bad=0,tot=0;
for(const r of rows){for(const [k,side] of [['gr2','CHALLENGER LIST [DR2]'],['cr3','DEFENDER LIST [CR3]']]){tot++;
 const out=api.preCheckSide(r[k],[],side);const hasHead=/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i.test(r[k]||'');
 const pc=(String(r[k]||'').match(/PREMISE COUNT\s*:\s*\**\s*(\d+)/i)||[])[1];
 const n=out.filter(l=>/ item \d+:/.test(l)).length;
 const verdict=!hasHead?(out.length===1&&/no premise list found/.test(out[0])?'NOHEAD-OK':'NOHEAD-BAD'):(n===0?'ZERO-ITEMS':(pc!==undefined&&+pc!==n?'COUNT-MISMATCH':'OK'));
 if(!/OK/.test(verdict))bad++;
 console.log(r.t.slice(5,10),k,'head='+hasHead,'items='+n,'PREMISE COUNT='+(pc??'-'),verdict);}}
console.log('sides',tot,'flagged',bad);
