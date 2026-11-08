// pkgFRC test. Run from wall2024/: node pkgFRC/test_FRC.cjs
// 1. Each of the 36 patched jsonBody expressions runs in n8n's expression engine (@n8n/tournament, pkgLOG/node_modules), base vs patched, on a body for
//    every model the engine seats: only qwen/qwen3.8-flash and z-ai/glm-5.3-flash gain reasoning {max_tokens: 24000}; every other body is byte-identical;
//    a flash body that already carries a reasoning field keeps its own.
// 2. Panel Judges Prep on the saved 33530 inputs: slot 3 (qwen_flash) body gains the budget; slots 1 and 2 (gemini, terra) are byte-identical.
const fs=require('fs');const {Tournament}=require(__dirname+'/../pkgLOG/node_modules/@n8n/tournament');const TOUR=new Tournament(()=>{});const {harness}=require('../pkgGSL/harness.cjs');
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s53.json','utf8'));const plan=JSON.parse(fs.readFileSync('pkgFRC/plan_FRC.json','utf8'));
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const models=['qwen/qwen3.8-flash','z-ai/glm-5.3-flash','google/gemini-3.8-flash','openai/gpt-6.1-terra','openai/gpt-6.1-sol','x-ai/grok-4.7','xiaomi/mimo-v2.6-pro','qwen/qwen3.8-max-0902','z-ai/glm-5.3','anthropic/claude-opus-4.8','deepseek-flash'];
const FLASH=new Set(['qwen/qwen3.8-flash','z-ai/glm-5.3-flash']);
const run=(expr,body)=>{const J={body,requestBody:body,verdictBody:body,call:{body},cure:{body},alt:{body},acc:{body}};return TOUR.execute(String(expr).replace(/^=/,''),{$:n=>({isExecuted:false,first:()=>({json:J}),all:()=>[]}),$json:J,JSON,Object,Array,String,Map});};
let nodes=0;
for(const [name,p] of Object.entries(plan.nodes)){if(p.field!=='jsonBody')continue;nodes++;const base=W.nodes.find(z=>z.name===name).parameters.jsonBody;const pat=JSON.parse(fs.readFileSync('pkgFRC/patched/'+name.replace(/[ ?]/g,'_')+'.json','utf8')).jsonBody;
 let good=true,why=[];for(const md of models){const body={model:md,max_tokens:64000,messages:[{role:'system',content:'s'},{role:'user',content:'u'.repeat(50)}]};let a,b;
  try{a=run(base,body);b=run(pat,body);}catch(e){good=false;why.push(md+' threw '+e.message);continue;}
  const want=FLASH.has(md)?JSON.stringify({...a,reasoning:{max_tokens:24000}}):JSON.stringify(a);if(JSON.stringify(b)!==want){good=false;why.push(md);}}
 {const body={model:'qwen/qwen3.8-flash',max_tokens:64000,reasoning:{effort:'low'},messages:[{role:'user',content:'u'}]};const b=run(pat,body);if(!b.reasoning||b.reasoning.effort!=='low'||b.reasoning.max_tokens!==undefined){good=false;why.push('own reasoning not kept');}}
 if(!good)T(false,name+': '+why.join(', '));else ok++;}
out.push('OK '+ok+' of '+nodes+' jsonBody nodes: runs in the n8n engine; budget only on the 2 flash models ('+models.length+' models each); own reasoning field kept');
{const R='33530';const base=W.nodes.find(z=>z.name==='Panel Judges Prep').parameters.jsCode;const pat=JSON.parse(fs.readFileSync('pkgFRC/patched/Panel_Judges_Prep.json','utf8')).jsCode;
 const inp=Object.keys(plan.nodes).length;let a,b,e=null;try{a=harness(R)(base,'Panel Build');b=harness(R)(pat,'Panel Build');}catch(x){e=x.message;}
 if(e)T(false,'Panel Judges Prep threw: '+e);else{const bo=x=>x.map(i=>i.json&&(i.json.body||i.json.payload||i.json));const A=bo(a),B=bo(b);
  const s=JSON.stringify(A),t=JSON.stringify(B);const flashIdx=A.map((x,i)=>/qwen3\.8-flash|glm-5\.3-flash/.test(JSON.stringify(x).slice(0,4000))?i:-1).filter(i=>i>=0);
  const same=A.map((x,i)=>JSON.stringify(x)===JSON.stringify(B[i]));const gained=B.map(x=>/"reasoning":\{"max_tokens":24000\}/.test(JSON.stringify(x)));
  T(A.length===3&&flashIdx.length===1&&gained.filter(Boolean).length===1&&gained[flashIdx[0]]&&same.filter(Boolean).length===2,R+' Panel Judges Prep: '+A.length+' slots; flash slot '+(flashIdx.map(i=>i+1).join(','))+' gains the budget; other slots byte-identical ('+same.map((x,i)=>'slot '+(i+1)+(x?' same':' changed')).join(', ')+')');}}
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgFRC/test_FRC.txt',out.join('\n')+'\n');
