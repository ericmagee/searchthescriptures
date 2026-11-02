// cacheall: OpenRouter session id for cache stickiness; Gemini and Qwen system message marked for caching.
const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(/^(?:google|qwen)\//.test(String(model)))o.messages=b.messages.map(m=>m.role==='system'&&typeof m.content==='string'?{role:'system',content:[{type:'text',text:m.content,cache_control:{type:'ephemeral'}}]}:m);return o;};
const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// C1: CHALLENGER ROUND 1, CHALLENGE. Body built by API family; model from model_config by seat.
const FAMS=['anthropic','openai','gemini','grok','mimo','openrouter','deepseek'];
// cachefix: Claude cache markers. System split at the DEFENSE DISCIPLINE block (D3 sends the instructions without it); last message marked.
const __cc={type:'ephemeral',ttl:'1h'};const __sysB=s=>{const i=s.indexOf('\n\n=== DEFENSE DISCIPLINE');return i>0?[{type:'text',text:s.slice(0,i),cache_control:__cc},{type:'text',text:s.slice(i),cache_control:__cc}]:[{type:'text',text:s,cache_control:__cc}];};
const __mk=m=>m.map((x,k)=>k===m.length-1&&typeof x.content==='string'?{role:x.role,content:[{type:'text',text:x.content,cache_control:__cc}]}:x);
const bodyFor=(fam,model,tok,sys,msgs)=>{
 if(fam==='anthropic')return {model,max_tokens:tok,system:__sysB(sys),messages:__mk(msgs)};
 if(fam==='gemini')return {systemInstruction:{parts:[{text:sys}]},contents:msgs.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]})),generationConfig:{maxOutputTokens:tok}};
 const m=[{role:'system',content:sys},...msgs];
 if(fam==='openai')return {model,max_completion_tokens:tok,messages:m};
 // ORDER J (BB-6200): glm debates at reasoning effort medium, as qwen does; at max it returned no text (ODV1-26217 C1, ODV1-26238 C3).
 // BB-8403 S3: chatgpt via OpenRouter (openai/) at reasoning effort medium; at max it spent the whole 32,000 in reasoning and returned no text (ODV1-29876 C1). Token budget as its openai branch: max(mt*2,8000).
 // BB-8510 S2: gemini via OpenRouter (google/), effort medium; max_tokens and temperature as its former generationConfig (KB-0042, KB-0077).
 if(fam==='openrouter'&&/^anthropic\//.test(model))return {model,max_tokens:tok,messages:[{role:'system',content:__sysB(sys)},...__mk(msgs)]};  if(fam==='openrouter'&&/^(?:x-ai|xiaomi)\//.test(model))return {model,max_tokens:tok,messages:m};  if(fam==='openrouter'&&/^google\//.test(model))return {model,max_tokens:tok,messages:m};
 if(fam==='openrouter'&&/^openai\//.test(model))return {model,max_tokens:tok,messages:m};
 if(fam==='openrouter')return {model,max_tokens:tok,messages:m};
 return {model,max_tokens:tok,messages:m};};
const I=$('Init with Guards').first().json;const R=$('Resolve Seats').first().json;
const call=(seat,sys,msgs)=>{const idx=FAMS.indexOf(seat.fam);if(idx<0)throw new Error('ORACLE_DEBATE_V1: no call path for family '+seat.fam+RT);return {fam:seat.fam,fam_idx:idx,model:seat.model,body:__orc(bodyFor(seat.fam,seat.model,seat.tok,sys,msgs),seat.fam,seat.model,TOK+':'+(seat===R.defender?'defender':'challenger'))};};
const sys=I.csys;const msgs=[{role:'user',content:'DEBATE TOPIC: '+I.topic+'\n\nThe defender opened:\n\n'+$('D1 Extract').first().json.raw+'\n\nChallenge this. Verse-level precision.'}];
return [{json:{run_token:TOK,round:'C1',call:call(R.challenger,sys,msgs)}}];
