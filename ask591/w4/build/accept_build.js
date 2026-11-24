const __L={"Debate Start":()=>$('Debate Start'),"Dry Run Config":()=>$('Dry Run Config')};
const POSTURE=(T=>{const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))['POSTURE Accept Build'];if(!M)throw new Error('ASK 575: the Shared Library holds no POSTURE Accept Build entry');const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(S.length!==M.n)throw new Error('ASK 575: rebuilt POSTURE Accept Build is '+S.length+', expected '+M.n);return new Function(S+'\nreturn POSTURE;')();})($('Shared Library').params.jsCode);
const __SRC=(()=>{for(const n of ['Debate Start','Dry Run Config']){try{if(__L[n]().isExecuted)return __L[n]().first().json;}catch(e){}}return {};})();
const __B=(__SRC&&__SRC.body&&typeof __SRC.body==='object')?__SRC.body:__SRC;const RT=' execution='+$execution.id;
const __orc=(b,model,key)=>{if(!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(/^xiaomi\/mimo-v2\.6-pro$/.test(String(model))){o.max_tokens=131072;}  return o;};
const ENG_SEAT={deepseek:'deepseek',gemini:'gemini',glm:'glm',alt_minimax31:'alt_minimax31',chatgpt:'chatgpt',mimo:'mimo',qwen:'qwen',grok:'grok',sol:'sol',sol62:'sol62',luna:'luna',argon:'argon',hydrogen:'hydrogen',spark:'spark',ernie:'ernie',ember:'ember',sonnet:'sonnet'};
const ORDER=['chatgpt','sol','sol62','gemini','spark','qwen4max','argon','sonnet'];          
const deb=[__B.defender,__B.challenger].map(x=>String((x&&x.engine)||'').trim().toLowerCase());
const M={};$input.all().forEach(i=>{const x=i.json;if(x&&x.seat)M[x.seat]=x;});
const seats=ORDER.filter(s=>deb.indexOf(s)<0&&s!=='qwen');
const out=[];let ds=null;
for(const s of seats){const x=M[s];if(!x||!x.api_model)throw new Error('FAIL-CLOSED: Accept Build: seat "'+s+'" has no ACTIVE model_config row.'+RT);
 const mt=Math.max(Number(x.max_tokens)||0,8000);const m=[{role:'user',content:POSTURE.PROMPT}];
 if(s==='deepseek'){ds={seat:s,role:'judge',api_model:x.api_model,fam:'deepseek',body:{model:x.api_model,max_tokens:Math.max(mt,8000),messages:m}};continue;}
 const body=/^x-ai\/|^google\//.test(x.api_model)?{model:x.api_model,max_tokens:mt,temperature:0,messages:m}:/^xiaomi\//.test(x.api_model)?{model:x.api_model,max_tokens:Math.max(mt,65536),messages:m}:{model:x.api_model,max_tokens:mt,messages:m};
 out.push({json:{acc:{seat:s,role:'judge',api_model:x.api_model,fam:'openrouter',body:__orc(body,x.api_model,$execution.id+':accept:'+s)},ds}});}
if(!out.length)throw new Error('FAIL-CLOSED: Accept Build: no openrouter judge seat to ask.'+RT);
out.forEach(o=>{o.json.ds=ds;});
return out;