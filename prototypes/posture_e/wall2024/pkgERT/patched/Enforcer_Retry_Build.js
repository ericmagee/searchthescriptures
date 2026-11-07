// pkgERT (W2, 11-07): the main DeepSeek enforcer call ("Enforcer Call deepseek") is sent once more when its reply is an error (33482: "aborted"
// after 61 s), has no choices, or has empty content. The HTTP node returns a failed request as an {error} item (onError continueRegularOutput),
// so its own retry setting never fires. Emits {esr_retry:false} when the reply is good or no call was meant.
const B=$('Enforcer Build').first().json;const r=$input.first().json;
const why=(()=>{if(!r)return 'no reply';if(r.error)return 'error: '+String(typeof r.error==='string'?r.error:(r.error.message||JSON.stringify(r.error))).slice(0,160);
 const c=Array.isArray(r.choices)&&r.choices[0];if(!c)return 'no choices ('+String(r.message||Object.keys(r).slice(0,6).join(',')).slice(0,120)+')';
 if(!String((c.message&&c.message.content)||'').trim())return 'empty content'+(c.finish_reason?' (finish_reason '+c.finish_reason+')':'');return null;})();
if(B.enf_skip||!B.body||!Array.isArray(B.body.messages)||!why)return [{json:{esr_retry:false}}];
return [{json:{esr_retry:true,esr_why:why,body:B.body,model:B.model,run_token:B.run_token}}];