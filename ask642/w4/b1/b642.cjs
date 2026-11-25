// ASK 642 build (W4): Second Alternate? does not put a model back on the round-2 list when its round-1 reason names finish_reason length or max_tokens. node b642.cjs base.json out.json
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const n=E.nodes.find(x=>x.name==='Second Alternate?');const s=n.parameters.jsCode;
const A="&&/returned content null|returned no JSON object|JSON did not parse/.test(x.why)&&T.filter(y=>y.api_model===x.api_model).length===1).map(x=>x.api_model))];";
if(s.split(A).length!==2)throw new Error('the retry filter is not found exactly once');
const B="&&/returned content null|returned no JSON object|JSON did not parse/.test(x.why)&&!/\\(finish_reason (?:length|max_tokens)\\)/.test(x.why)&&T.filter(y=>y.api_model===x.api_model).length===1).map(x=>x.api_model))]; /* ASK 642: a model that spent its whole output limit (finish_reason length or max_tokens) is not offered again at the same limit */";
n.parameters.jsCode=s.replace(A,()=>B);fs.writeFileSync(OUT,JSON.stringify(E));console.log('Second Alternate?',s.length,'->',n.parameters.jsCode.length);
