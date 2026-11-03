// judge_fix8 P2, P3 (JUDGE_POSTURE_DRAFT_v4 Part 1; a dry regrade with posture or accept_probe only): the acceptance turn, one call per seat
// (the three panel seats, the reserve and the alternates), each sent v4 Part 2 and the reply form only: no rulebook, no debate. One item per
// seat; Accept Call openrouter sends each. Every judge seat of the live order is an openrouter seat (Resolve Seats JFAM); any other fails closed.
//@@POSTURE@@
const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(/^(?:google|qwen)\//.test(String(model)))o.messages=b.messages.map(m=>m.role==='system'&&typeof m.content==='string'?{role:'system',content:[{type:'text',text:m.content,cache_control:{type:'ephemeral'}}]}:m);return o;};
const S=$('Init Seats').first().json;const RS=$('Resolve Seats').first().json;const TOK=S.run_token;const RT=' run_token='+TOK;
if(S.dry!==true||(S.posture!==true&&S.accept_probe!==true))throw new Error('FAIL-CLOSED: Accept Build reached on a run that is not a posture or acceptance-probe dry regrade.'+RT);
const seats=[];const seen=new Set();const add=(j,role)=>{if(!j||!j.seat||seen.has(j.seat))return;seen.add(j.seat);seats.push({...j,role});};
(RS.judges||[]).forEach(j=>add(j,'panel'));add(RS.reserve,'reserve');(RS.alternates||[]).forEach(a=>add(a,'alternate'));
if((RS.judges||[]).length!==3)throw new Error('FAIL-CLOSED: Accept Build found '+(RS.judges||[]).length+' panel seats, expected 3.'+RT);
return seats.map(j=>{if(j.fam!=='openrouter')throw new Error('FAIL-CLOSED: Accept Build: seat "'+j.seat+'" family "'+j.fam+'" has no acceptance call (openrouter only).'+RT);
 const mt=Math.max(Number(j.max_tokens)||0,8000);const m=[{role:'user',content:POSTURE.PROMPT}];
 // the panel's own body shape per model (Panel Build): temperature 0 for x-ai/ and google/; xiaomi/ at max(mt,65536); no reasoning field
 const body=/^x-ai\/|^google\//.test(j.api_model)?{model:j.api_model,max_tokens:mt,temperature:0,messages:m}:/^xiaomi\//.test(j.api_model)?{model:j.api_model,max_tokens:Math.max(mt,65536),messages:m}:{model:j.api_model,max_tokens:mt,messages:m};
 return {json:{acc:{seat:j.seat,role:j.role,api_model:j.api_model,body:__orc(body,'openrouter',j.api_model,TOK+':accept:'+j.seat)}}};});
