// ORDER E (BB-6037): the run's token columns become Build Save Body's four sums plus every panel and reserve call made; Write Tokens sets them once, as totals.
const S=$('Init Seats').first().json;let pre=null;try{pre=$('Build Save Body').first().json.saveBody;}catch(x){pre=null;}
const NODES=["Panel Judge 1 deepseek", "Panel Judge 2 openai", "Panel Judge 2 gemini", "Panel Judge 2 grok", "Panel Judge 2 mimo", "Panel Judge 2 openrouter", "Panel Judge 3 openai", "Panel Judge 3 gemini", "Panel Judge 3 grok", "Panel Judge 3 mimo", "Panel Judge 3 openrouter", "Panel Judge 1 openai", "Panel Judge 1 gemini", "Panel Judge 1 grok", "Panel Judge 1 mimo", "Panel Judge 1 openrouter", "Panel Reserve deepseek", "Panel Reserve openai", "Panel Reserve gemini", "Panel Reserve grok", "Panel Reserve mimo", "Panel Reserve openrouter"];
const add={i:0,o:0,w:0,r:0};const seen=[];
for(const n of NODES){let j=null;try{if(!$(n).isExecuted)continue;j=$(n).first(0).json;}catch(x){continue;}if(!j)continue;
if(j.usageMetadata){const m=j.usageMetadata;add.i+=Number(m.promptTokenCount)||0;add.o+=(Number(m.candidatesTokenCount)||0)+(Number(m.thoughtsTokenCount)||0);add.r+=Number(m.cachedContentTokenCount)||0;seen.push(n);}
else if(j.usage){const u=j.usage;add.i+=Number(u.prompt_tokens)||0;add.o+=Number(u.completion_tokens)||0;add.r+=Number((u.prompt_tokens_details&&u.prompt_tokens_details.cached_tokens)||u.prompt_cache_hit_tokens)||0;seen.push(n);}}
// Step 6 (6904 f): the panel cure calls of the three serial slots (BB-6987) and the step 7 alternate calls (absent before step 7 is
// published; a missing node is skipped) join the sums, every item of each node.
for(const n of [1,2,3].flatMap(k=>['deepseek','openai','gemini','grok','mimo','openrouter'].map(f=>'Panel Cure Call '+k+' '+f)).concat(['Alternate Call openrouter','Alternate Cure Call openrouter'])){let a=[];try{if(!$(n).isExecuted)continue;a=$(n).all().map(x=>x.json);}catch(x){continue;}
 for(const j of a){if(!j)continue;if(j.usageMetadata){const m=j.usageMetadata;add.i+=Number(m.promptTokenCount)||0;add.o+=(Number(m.candidatesTokenCount)||0)+(Number(m.thoughtsTokenCount)||0);add.r+=Number(m.cachedContentTokenCount)||0;seen.push(n);}
  else if(j.usage){const u=j.usage;add.i+=Number(u.prompt_tokens)||0;add.o+=Number(u.completion_tokens)||0;add.r+=Number((u.prompt_tokens_details&&u.prompt_tokens_details.cached_tokens)||u.prompt_cache_hit_tokens)||0;seen.push(n);}}}
const go=!!(pre&&S.regrade!==true&&S.dry!==true);
return [{json:{go,run_token:S.run_token,p_input:go?(Number(pre.input_tokens)||0)+add.i:0,p_output:go?(Number(pre.output_tokens)||0)+add.o:0,p_cache_write:go?(Number(pre.cache_write_tokens)||0)+add.w:0,p_cache_read:go?(Number(pre.cache_read_tokens)||0)+add.r:0,panel_calls:seen}}];
