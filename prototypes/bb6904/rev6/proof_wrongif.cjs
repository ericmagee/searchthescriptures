// Revision 6 wrong-if (BB-7126): the proof run's rows (one exec_id, dry regrade of 27088) must be exactly 3, every model non-NULL,
// no MiniMax model anywhere, and every seat either a panel seat (deepseek, gemini, grok), the panel reserve on these debates (chatgpt,
// seated when a panel judge's call fails; BB-7141) or a reserve alternate (glm, qwen), carrying that seat's model_config api_model. Usage: node proof_wrongif.cjs <rows.json: [{exec_id, judge_seat, judge_api_model}]>
const OK={deepseek:'deepseek-flash',gemini:'gemini-3.1-pro-preview',grok:'grok-4.7',chatgpt:'gpt-6.1-sol',glm:'z-ai/glm-5.3',qwen:'qwen/qwen3.8-max-0902'};
const rows=JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));const f=[];const ex=new Set(rows.map(r=>r.exec_id));
if(!rows.length)f.push('no rows');if(ex.size>1)f.push('more than one exec_id');if(rows.length&&rows.length!==3)f.push(rows.length+' rows, not 3');
rows.forEach(r=>{if(!r.judge_api_model)f.push('seat '+r.judge_seat+': NULL model');else if(/minimax/i.test(r.judge_api_model))f.push('seat '+r.judge_seat+': MiniMax model '+r.judge_api_model);
 else if(OK[r.judge_seat]!==r.judge_api_model)f.push('seat '+r.judge_seat+' with model '+r.judge_api_model+' is not a panel seat or reserve alternate with its own model');});
const alts=rows.filter(r=>r.judge_seat==='glm'||r.judge_seat==='qwen').map(r=>r.judge_seat);
console.log(f.length?'FIRED: '+f.join(' | '):'SILENT ('+(alts.length?'alternates seated: '+alts.join(', '):'no alternate seated')+')');
