// BB-6904 portion H wrong-if (7126): on a composed flow file, FIRES unless the alternates are the reserve judges the openrouter alternate
// call serves (7127): Init Seats gives alt_order = the openrouter seats free after the panel reserve, in ORDER, and no ALT_POOL;
// Resolve Seats builds alternates from alt_order, openrouter seats only, from model_config, family-guarded; Alternate Build sends each
// reserve's own body (glm effort medium; qwen effort max with JSON output). Behaviour: Resolve Seats' alternates expression is run on a
// model_config sample. Usage: node h_wrongif.cjs <composed.json>
const w=JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));const N={};w.nodes.forEach(n=>N[n.name]=(n.parameters&&n.parameters.jsCode)||'');const f=[];
const I=N['Init Seats'],R=N['Resolve Seats'],A=N['Alternate Build'];
if(/ALT_POOL/.test(I))f.push('Init Seats still holds ALT_POOL');
const ao=I.match(/const ALT_ORDER=([^;\n]+);/);if(!ao)f.push('Init Seats: no ALT_ORDER');
else{const JFAM_I={deepseek:'deepseek',gemini:'gemini',grok:'grok',chatgpt:'openai',mimo:'mimo',glm:'openrouter',qwen:'openrouter'};const o=Function('free','JFAM_I','return '+ao[1])(['deepseek','gemini','grok','chatgpt','glm','qwen'],JFAM_I);if(String(o)!=='glm,qwen')f.push('ALT_ORDER for free [deepseek,gemini,grok,chatgpt,glm,qwen] is ['+o+'], not [glm,qwen]');
 const o2=Function('free','JFAM_I','return '+ao[1])(['deepseek','gemini','grok','glm','qwen'],JFAM_I);if(String(o2)!=='qwen')f.push('ALT_ORDER takes the panel reserve: ['+o2+']');}
if(!/alt_order:ALT_ORDER/.test(I))f.push('Init Seats does not output alt_order');
const m=R.match(/const alternates=(\(S\.alt_order\|\|\[\]\)[^\n]*);\n/);
if(!m)f.push('Resolve Seats: alternates not built from alt_order');
else{const M={chatgpt:{api_model:'gpt-6.1-sol',max_tokens:32000,family:'openai'},glm:{api_model:'z-ai/glm-5.3',max_tokens:32000,family:'zhipu'},qwen:{api_model:'qwen/qwen3.8-max-0902',max_tokens:32000,family:'qwen'}};
 const JFAM={deepseek:'deepseek',gemini:'gemini',grok:'grok',chatgpt:'openai',mimo:'mimo',glm:'openrouter',qwen:'openrouter'};const famOf=k=>M[k].family;
 const run=(order,debFam)=>Function('S','M','JFAM','famOf','debFam','return '+m[1])({alt_order:order},M,JFAM,famOf,debFam);
 const a1=run(['chatgpt','glm','qwen'],['xiaomi','anthropic']).map(x=>x.seat).join(',');if(a1!=='glm,qwen')f.push('alternates for [chatgpt,glm,qwen] are ['+a1+'], not [glm,qwen]');
 const a2=run(['chatgpt','glm','qwen'],['zhipu','anthropic']).map(x=>x.seat).join(',');if(a2!=='qwen')f.push('a debating family is not dropped: ['+a2+']');
 const a3=run([],['xiaomi','anthropic']).length;if(a3!==0)f.push('an empty alt_order gives alternates');}
if(!/a\.seat==='glm'\?\{model:a\.api_model,max_tokens:a\.max_tokens,reasoning:\{effort:'medium'\}/.test(A))f.push('Alternate Build: glm body is not the reserve body (effort medium)');
if(!/a\.seat==='qwen'\?\{model:a\.api_model,max_tokens:a\.max_tokens,reasoning:\{effort:'max'\},messages:msgs,response_format:\{type:'json_object'\}\}/.test(A))f.push('Alternate Build: qwen body is not the reserve body');
console.log(f.length?'FIRED: '+f.join(' | '):'SILENT');
