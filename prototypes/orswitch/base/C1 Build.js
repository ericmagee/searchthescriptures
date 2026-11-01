const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// C1: CHALLENGER ROUND 1, CHALLENGE. Body built by API family; model from model_config by seat.
const FAMS=['anthropic','openai','gemini','grok','mimo','openrouter','deepseek'];
const bodyFor=(fam,model,tok,sys,msgs)=>{
 if(fam==='anthropic')return {model,max_tokens:tok,system:[{type:'text',text:sys,cache_control:{type:'ephemeral',ttl:'1h'}}],messages:msgs};
 if(fam==='gemini')return {systemInstruction:{parts:[{text:sys}]},contents:msgs.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]})),generationConfig:{maxOutputTokens:tok}};
 const m=[{role:'system',content:sys},...msgs];
 if(fam==='openai')return {model,max_completion_tokens:tok,messages:m};
 // ORDER J (BB-6200): glm debates at reasoning effort medium, as qwen does; at max it returned no text (ODV1-26217 C1, ODV1-26238 C3).
 // BB-8403 S3: chatgpt via OpenRouter (openai/) at reasoning effort medium; at max it spent the whole 32,000 in reasoning and returned no text (ODV1-29876 C1). Token budget as its openai branch: max(mt*2,8000).
 // BB-8510 S2: gemini via OpenRouter (google/), effort medium; max_tokens and temperature as its former generationConfig (KB-0042, KB-0077).
 if(fam==='openrouter'&&/^google\//.test(model))return {model,max_tokens:tok,reasoning:{effort:'medium'},messages:m};
 if(fam==='openrouter'&&/^openai\//.test(model))return {model,max_tokens:Math.max(tok*2,8000),reasoning:{effort:'medium'},messages:m};
 if(fam==='openrouter')return {model,max_tokens:tok,reasoning:{effort:/^(?:qwen\/|z-ai\/glm-)/.test(model)?'medium':'max'},messages:m};
 return {model,max_tokens:tok,messages:m};};
const I=$('Init with Guards').first().json;const R=$('Resolve Seats').first().json;
const call=(seat,sys,msgs)=>{const idx=FAMS.indexOf(seat.fam);if(idx<0)throw new Error('ORACLE_DEBATE_V1: no call path for family '+seat.fam+RT);return {fam:seat.fam,fam_idx:idx,model:seat.model,body:bodyFor(seat.fam,seat.model,seat.tok,sys,msgs)};};
const sys=I.csys;const msgs=[{role:'user',content:'DEBATE TOPIC: '+I.topic+'\n\nThe defender opened:\n\n'+$('D1 Extract').first().json.raw+'\n\nChallenge this. Verse-level precision.'}];
return [{json:{run_token:TOK,round:'C1',call:call(R.challenger,sys,msgs)}}];
