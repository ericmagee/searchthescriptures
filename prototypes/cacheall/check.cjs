// Runs base and new Build Independent Verdict (7 seats x 3 debates), Panel Build (7 seats) and D1-D3 Build (4 defender families):
// new body = base body + session_id (OpenRouter only) + a cache marker on the system message for google/ and qwen/; texts unchanged.
const fs=require('fs');let bad=0;const say=(ok,m)=>{if(!ok){bad++;console.log('BAD '+m);}};
const txt=c=>typeof c==='string'?c:(Array.isArray(c)?c.map(x=>x.text).join(''):JSON.stringify(c));
const norm=b=>{const o=JSON.parse(JSON.stringify(b));delete o.session_id;if(o.messages)o.messages=o.messages.map(m=>({role:m.role,content:txt(m.content)}));return JSON.stringify(o);};
const expect=(b,n,model,fam,tag)=>{const isOR=fam==='openrouter';say(norm(b)===norm(n),tag+' body changed beyond cache fields');
 say(isOR?typeof n.session_id==='string'&&n.session_id.length>0:!('session_id' in n),tag+' session_id');
 if(isOR&&/^(google|qwen)\//.test(model)){const s=n.messages.find(m=>m.role==='system');say(Array.isArray(s.content)&&s.content[0].cache_control,tag+' system marker');}};
// single judge
const meta=JSON.parse(fs.readFileSync('meta.json','utf8')),rounds=JSON.parse(fs.readFileSync('../bb8792/a3/s5/rounds.json','utf8'));
const MC={deepseek:['deepseek-flash',65536],gemini:['google/gemini-3.8-flash',32000],glm:['z-ai/glm-5.3',32000],qwen:['qwen/qwen3.8-max-0902',32000],grok:['x-ai/grok-4.7',32000],chatgpt:['openai/gpt-6.1-terra',32000],mimo:['xiaomi/mimo-v2.6-pro',32000]};
const mk=(nodes,fetch)=>n=>{if(n==='Fetch Models')return{all:()=>fetch,first:()=>fetch[0]};if(!(n in nodes))throw new Error('unmocked '+n);return{first:()=>({json:nodes[n]}),all:()=>[{json:nodes[n]}]};};
const biv=(code,seat,r)=>{const FO={topic:meta.topic,cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3};
 const nodes={'Final Output':FO,'Init with Guards':{c_served:meta.c_served,d_served:meta.d_served,c_named:[],d_named:[]},'Quote Report':{unavailable:true},'Init Seats':{run_token:r.run_token,single_judge:seat},'Resolve Seats':{deepseek:{api_model:'deepseek-flash',max_tokens:65536}}};
 const fetch=Object.entries(MC).map(([s,[m,t]])=>({json:{seat:s,api_model:m,max_tokens:t}}));return new Function('$','$input','$json',code)(mk(nodes,fetch),{first:()=>({json:FO})},FO)[0].json;};
const B0=fs.readFileSync('base/Build Independent Verdict.js','utf8'),B1=fs.readFileSync('new/Build Independent Verdict.js','utf8');let nb=0;
for(const r of rounds)for(const seat of Object.keys(MC)){const b=biv(B0,seat,r).verdictBody,n=biv(B1,seat,r).verdictBody;const fam=seat==='deepseek'?'deepseek':'openrouter';expect(b,n,MC[seat][0],fam,'BIV '+seat);nb++;}
console.log('single judge cases',nb);
// panel
const P0=fs.readFileSync('base/Panel Build.js','utf8'),P1=fs.readFileSync('new/Panel Build.js','utf8');const r=rounds[0];
const pan=(code,seats)=>{const F={topic:meta.topic,cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3};
 const nodes={'Final Output':F,'Init with Guards':{c_served:meta.c_served,d_served:meta.d_served,c_named:[],d_named:[],topic:meta.topic},'Init Seats':{run_token:r.run_token,topic:meta.topic,rulebook:'current'},'Resolve Seats':{judges:seats.map(([seat,fam,m])=>({seat,fam,api_model:m,max_tokens:32000}))},'Quote Report':{unavailable:true},'Check Save':{debate_id:'test'}};
 const $=n=>{if(n==='Regrade Load')return{isExecuted:false};if(!(n in nodes))throw new Error('unmocked '+n);return{first:()=>({json:nodes[n]}),all:()=>[{json:nodes[n]}]};};
 return new Function('$','$input','$json',code)($,{first:()=>({json:F})},F)[0].json.judges;};
let np=0;for(const S of [[['deepseek','deepseek','deepseek-flash'],['gemini','openrouter','google/gemini-3.8-flash'],['glm','openrouter','z-ai/glm-5.3']],[['qwen','openrouter','qwen/qwen3.8-max-0902'],['grok','openrouter','x-ai/grok-4.7'],['chatgpt','openrouter','openai/gpt-6.1-terra']],[['mimo','openrouter','xiaomi/mimo-v2.6-pro'],['gemini','openrouter','google/gemini-3.8-flash'],['glm','openrouter','z-ai/glm-5.3']]]){
 const a=pan(P0,S),b=pan(P1,S);a.forEach((j,i)=>{expect(j.body,b[i].body,j.api_model,j.fam,'Panel '+j.seat);np++;});}
console.log('panel cases',np);
// debaters
const run=(file,ctx)=>{const code=fs.readFileSync(file,'utf8');const $=n=>{if(!(n in ctx))return {first:()=>({json:new Proxy({},{get:(t,k)=>typeof k==='string'?('['+n+'.'+k+']'):undefined})}),all:()=>[]};return {first:()=>({json:ctx[n]}),all:()=>[{json:ctx[n]}],isExecuted:true};};
 return new Function('$','$input','$json','$items',code)($,{first:()=>({json:{}})},{},()=>[])[0].json;};
const IG={topic:meta.topic,dsys:'DEFENDER FRAME '.repeat(400),csys:'CHALLENGER FRAME '.repeat(400),c_served:meta.c_served,d_served:meta.d_served,c_named:[],d_named:[]};
let nd=0;for(const [fam,model] of [['openrouter','anthropic/claude-sonnet-5.5'],['openrouter','google/gemini-3.8-flash'],['openrouter','qwen/qwen3.8-max-0902'],['deepseek','deepseek-flash']]){
 for(const v of ['D1','D2','D3']){const res={};for(const k of ['base','new']){const ctx={'Init with Guards':IG,'Init Seats':{run_token:'ODV1-TEST',dpos:'x',cpos:'y'},'Resolve Seats':{defender:{fam,model,tok:32000},challenger:{fam:'openrouter',model:'xiaomi/mimo-v2.6-pro',tok:32000}},'D1 Extract':{raw:'D1'},'C1 Extract':{raw:'C1'},'C2 Extract':{raw:'C2\n1. LINK 1: p'}};
  ctx['D1 Build']=run(`${k}/D1 Build.js`,ctx);res[k]=run(`${k}/${v} Build.js`,ctx).call.body;}
  if(/anthropic/.test(model)){const n=res.new;say(n.session_id==='ODV1-TEST:defender',v+' claude session_id');say(JSON.stringify(n).split('cache_control').length-1===JSON.stringify(res.base).split('cache_control').length-1,v+' claude markers unchanged');const o=JSON.parse(JSON.stringify(n));delete o.session_id;say(JSON.stringify(o)===JSON.stringify(res.base),v+' claude body otherwise identical');}
  else expect(res.base,res.new,model,fam,v+' '+model);nd++;}}
console.log('debater cases',nd,'bad',bad);
