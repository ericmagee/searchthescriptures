const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// PANEL FALLBACK (BB-5693 S3): builds the reserve judge's call from the failed slot's own call, so the reserve gets the same
// rulebook and transcript. The per-family body shapes are those of Panel Build's judge builder, copied, not changed.
const P=$('Panel Build').first().json;const RS=$('Resolve Seats').first().json;const SUB=$('Panel Check').first().json.sub;
if(!SUB||!RS.reserve)throw new Error('FAIL-CLOSED: Reserve Build reached without a substitution or a reserve seat.'+RT);
const src=P.judges[SUB.slot];if(!src||!src.body)throw new Error('FAIL-CLOSED: Reserve Build found no call for panel slot '+(SUB.slot+1)+'.'+RT);
const b0=src.body;let SYS,user;
if(b0.systemInstruction){SYS=b0.systemInstruction.parts[0].text;user=b0.contents[0].parts[0].text;}
else{SYS=b0.messages[0].content;user=b0.messages[1].content;}
if(typeof SYS!=='string'||typeof user!=='string'||!SYS||!user)throw new Error('FAIL-CLOSED: Reserve Build could not read the rulebook and transcript from slot '+(SUB.slot+1)+'.'+RT);
const JIDX0={deepseek:0,openai:1,gemini:2,grok:3,mimo:4,openrouter:5};
const j={...RS.reserve,max_tokens:Math.max(Number(RS.reserve.max_tokens)||0,8000)};let body;
if(j.fam==='gemini')body={systemInstruction:{parts:[{text:SYS}]},contents:[{role:'user',parts:[{text:user}]}],generationConfig:{maxOutputTokens:j.max_tokens+8192,temperature:0}};
else{const m=[{role:'system',content:SYS},{role:'user',content:user}];
 // deepseek judge cap (BB-5700 step 5): its reasoning spent the whole 32,000 before answering (ODV1-25720; ODV1-25744 also returned empty content, cause not read); 65,536 passed at judge size (exec 25745).
 if(j.fam==='deepseek')body={model:j.api_model,max_tokens:Math.max(j.max_tokens,65536),temperature:0,messages:m};
 else if(j.fam==='grok')body={model:j.api_model,max_tokens:j.max_tokens,temperature:0,messages:m};
 else if(j.fam==='openai')body={model:j.api_model,max_completion_tokens:Math.max(j.max_tokens*2,8000),messages:m};
 // openrouter reserves, per seat, exactly the bodies that passed at judge size (BB-5693 rev 6; WALL-0966 1360-1361): glm at reasoning effort
 // medium (effort max spent the whole cap in reasoning, at 32k and at 65,536); qwen at effort max with JSON output (without it, prose).
 // BB-8403 S3: chatgpt via OpenRouter (openai/) at reasoning effort medium; at max it spent the whole 32,000 in reasoning and returned no text (ODV1-29876 C1). Token budget as its openai branch: max(mt*2,8000).
 // BB-8510 S2: gemini via OpenRouter (google/), effort medium; max_tokens and temperature as its former generationConfig (KB-0042, KB-0077).
 else if(j.fam==='openrouter'&&/^google\//.test(j.api_model))body={model:j.api_model,max_tokens:j.max_tokens+8192,temperature:0,reasoning:{effort:'medium'},messages:m};
 else if(j.fam==='openrouter'&&/^openai\//.test(j.api_model))body={model:j.api_model,max_tokens:Math.max(j.max_tokens*2,8000),reasoning:{effort:'medium'},messages:m};
 else if(j.fam==='openrouter'&&j.seat==='glm')body={model:j.api_model,max_tokens:j.max_tokens,reasoning:{effort:'medium'},messages:m};
 // BB-8510 S3: qwen as reserve or alternate at effort medium, max_tokens max(mt*2,8000); at effort max, 32,000 it returned content null (29912).
 else if(j.fam==='openrouter'&&j.seat==='qwen')body={model:j.api_model,max_tokens:Math.max(j.max_tokens*2,8000),reasoning:{effort:'medium'},messages:m,response_format:{type:'json_object'}};
 else if(j.fam==='openrouter')body={model:j.api_model,max_tokens:j.max_tokens,reasoning:{effort:'max'},messages:m};
 // mimo judge (BB-5700 step 8a): thinking disabled. With thinking on, max_tokens 65,536 did not answer within the 900 s limit (exec 25738) and max_completion_tokens 32,000 took 645 s; disabled answered in 57 s (exec 25753).
 else if(j.fam==='mimo')body={model:j.api_model,max_tokens:Math.max(j.max_tokens,65536),messages:m,thinking:{type:'disabled'}};
 else body={model:j.api_model,max_tokens:j.max_tokens,messages:m};}
const jidx0=(j.fam in JIDX0)?JIDX0[j.fam]:-1;if(jidx0<0)throw new Error('FAIL-CLOSED: reserve seat "'+j.seat+'" family "'+j.fam+'" has no route.'+RT);
return [{json:{run_token:TOK,seat:j.seat,fam:j.fam,jidx0,api_model:j.api_model,body}}];
