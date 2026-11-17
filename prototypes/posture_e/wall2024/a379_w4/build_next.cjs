// ASK 379: Next Alternate? = live Second Alternate? (s259) with four anchored edits. Writes next_alternate_new.js.
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]||'../rdf/fetchback_s259.json'));let c=W.nodes.find(n=>n.name==='Second Alternate?').parameters.jsCode;
const rep=(a,b)=>{const k=c.split(a).length-1;if(k!==1)throw new Error('anchor count '+k+': '+a.slice(0,70));c=c.replace(a,()=>b);};
const CAP=+(process.env.A379_CAP||6);
// 1. R1 is the state that arrives in the item: Alternate Merge 1's output on the first entry, Pass Accumulate's fold after each pass.
rep("const R1=$('Alternate Merge 1').first().json;","const R1=(({__a379,...r})=>r)($input.first().json);const __P=(($input.first().json.__a379||{}).passes||[]);const __CAP="+CAP+"; /* ASK 379: the pass state travels in the item; __CAP is the operator's number of further passes */");
// 3. retry once only: a model whose only try returned no verdict may be tried once more, never a third time
rep(" a2r.retry=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)&&/returned content null|returned no JSON object|JSON did not parse/.test(x.why)).map(x=>x.api_model))];",
    " a2r.retry=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)&&/returned content null|returned no JSON object|JSON did not parse/.test(x.why)&&T.filter(y=>y.api_model===x.api_model).length===1).map(x=>x.api_model))]; /* ASK 379 (W1 7959): one retry, never a third try */");
// 4. cap
rep(" a2r.free=free.map(a=>a.seat);a2r.run=a2r.seats.length>0&&free.length>0;",
    " a2r.free=free.map(a=>a.seat);a2r.run=a2r.seats.length>0&&free.length>0&&__P.length<__CAP;");
rep("  :!T.length?","  :(a2r.seats.length>0&&free.length>0&&__P.length>=__CAP)?'the cap of '+__CAP+' further alternate pass'+(__CAP===1?'':'es')+' is reached'\n  :!T.length?");
// 5. state out
rep("return [{json:{...G,a2r}}];","return [{json:{...G,a2r,__a379:{R:R1,passes:__P,pass:__P.length+2}}}]; /* ASK 379 */");
fs.writeFileSync('next_alternate_new.js',c);console.log('ok',c.length);
