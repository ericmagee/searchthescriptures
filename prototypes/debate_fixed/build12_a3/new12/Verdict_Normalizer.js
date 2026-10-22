const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
const j=$input.first().json;
if(j&&Array.isArray(j.choices))return [{json:j}];
if(j&&Array.isArray(j.candidates)&&j.candidates[0]&&j.candidates[0].content&&Array.isArray(j.candidates[0].content.parts)){
const c=j.candidates[0];
const text=c.content.parts.filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join('');
const um=j.usageMetadata||{};
const ct=(Number(um.candidatesTokenCount)||0)+(Number(um.thoughtsTokenCount)||0);
const usage={prompt_tokens:Number(um.promptTokenCount)||0,completion_tokens:ct,total_tokens:Number(um.totalTokenCount)||0};
if(um.thoughtsTokenCount!==undefined)usage.completion_tokens_details={reasoning_tokens:Number(um.thoughtsTokenCount)||0};
if(um.cachedContentTokenCount!==undefined)usage.prompt_tokens_details={cached_tokens:Number(um.cachedContentTokenCount)||0};
return [{json:{choices:[{message:{role:'assistant',content:text},finish_reason:(c.finishReason==='MAX_TOKENS'?'length':(c.finishReason||null))}],usage}}];
}
throw new Error('ORACLE_DEBATE_V1 verdict normalizer refused: unrecognized response envelope. Top-level keys: ['+Object.keys(j||{}).join(',')+'].'+RT);
