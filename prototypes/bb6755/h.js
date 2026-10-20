const fs=require('fs');
const R=['D1','C1','D2','C2','D3','C3'];
const run=(src,r,fam,env)=>{const nodes={'Init Seats':{run_token:'T'},[r+' Build']:{call:{fam,model:'M'}},'Init with Guards':{lab:{D:'DEFENDER (x)',C:'CHALLENGER (y)'}}};
 const $=n=>({first:()=>({json:nodes[n]||{}})});const $input={first:()=>({json:env})};
 try{return 'OK '+JSON.stringify(new Function('$','$input',src)($,$input));}catch(e){return 'ERR '+e.message;}};
const OAI=['openai','grok','mimo','openrouter','deepseek'];const T='Some round text.';
const oai=(fr,content,extra={})=>({choices:[Object.assign({finish_reason:fr,index:0,message:{role:'assistant',content}},extra)],usage:{prompt_tokens:5,completion_tokens:7}});
const ant=(sr,text)=>({content:text?[{type:'text',text}]:[],stop_reason:sr,usage:{input_tokens:5,output_tokens:7}});
const gem=(fr,text,pf)=>Object.assign({candidates:pf?[]:[{content:{parts:text?[{text}]:[]},finishReason:fr}],usageMetadata:{promptTokenCount:5,candidatesTokenCount:7}},pf?{promptFeedback:{blockReason:pf}}:{});
const refusals=[],ordinary=[];
for(const f of OAI)for(const t of [T,null]){refusals.push([f,'content_filter',oai('content_filter',t)]);refusals.push([f,'message.refusal',oai('stop',t,{message:{role:'assistant',content:t,refusal:'I cannot help with that.'}})]);
 ordinary.push([f,'stop',oai('stop',t)]);ordinary.push([f,'length',oai('length',t)]);ordinary.push([f,'refusal null',oai('stop',t,{message:{role:'assistant',content:t,refusal:null}})]);}
for(const t of [T,null])refusals.push(['openrouter','native SAFETY',oai('stop',t,{native_finish_reason:'SAFETY'})]);
for(const t of [T,null]){refusals.push(['anthropic','refusal',ant('refusal',t)]);ordinary.push(['anthropic','end_turn',ant('end_turn',t)]);ordinary.push(['anthropic','max_tokens',ant('max_tokens',t)]);}
for(const t of [T,null]){for(const g of ['SAFETY','RECITATION','BLOCKLIST','PROHIBITED_CONTENT','SPII','IMAGE_SAFETY','IMAGE_PROHIBITED_CONTENT'])refusals.push(['gemini',g,gem(g,t)]);
 for(const g of ['STOP','MAX_TOKENS','OTHER','LANGUAGE'])ordinary.push(['gemini',g,gem(g,t)]);}
for(const b of ['SAFETY','OTHER','BLOCKLIST','PROHIBITED_CONTENT','IMAGE_SAFETY','MODEL_ARMOR'])refusals.push(['gemini','blockReason '+b,gem(null,null,b)]);
let r1=0,r1bad=[],o=0,obad=[];
for(const r of R){const base=fs.readFileSync('base/'+r+'_Extract.js','utf8'),nw=fs.readFileSync(r+'_Extract.new.js','utf8');
 for(const [f,k,env] of refusals){const x=run(nw,r,f,env);if(x.startsWith('ERR')&&x.includes(r+' (')&&x.includes('refused by the provider')&&x.includes(f+' M'))r1++;else r1bad.push([r,f,k,x.slice(0,160)]);}
 for(const [f,k,env] of ordinary){const a=run(base,r,f,env),b=run(nw,r,f,env);if(a===b)o++;else obad.push([r,f,k,a.slice(0,100),b.slice(0,100)]);}}
console.log('DoD1 refusal cases',R.length*refusals.length,'thrown as refusal',r1,'bad',r1bad.length);r1bad.slice(0,5).forEach(x=>console.log(x));
console.log('DoD3 ordinary cases',R.length*ordinary.length,'byte-equal',o,'differ',obad.length);obad.slice(0,5).forEach(x=>console.log(x));
// DoD2: 27177 reply rebuilt from stored [CR3] in the D3 Call mimo shape
const cr3='The request was rejected because it was considered high risk';
const env27177={choices:[{finish_reason:'content_filter',index:0,message:{content:cr3,role:'assistant',tool_calls:null}}],model:'mimo-v2.6-pro',object:'chat.completion',usage:{completion_tokens:17677,prompt_tokens:49804,total_tokens:67481,completion_tokens_details:{reasoning_tokens:13711},prompt_tokens_details:{cached_tokens:0}}};
console.log('DoD2 base:',run(fs.readFileSync('base/D3_Extract.js','utf8'),'D3','mimo',env27177).slice(0,120));
console.log('DoD2 new :',run(fs.readFileSync('D3_Extract.new.js','utf8'),'D3','mimo',env27177));
