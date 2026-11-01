// Runs base and patched Build Independent Verdict for every judge seat on one stored run; prints route index and body settings.
const fs=require('fs');
const meta=JSON.parse(fs.readFileSync('../bb8792/a3/g1/meta.json','utf8'));
const r=JSON.parse(fs.readFileSync('../bb8792/a3/s5/rounds.json','utf8'))[0];
const MC={base:{deepseek:['deepseek-flash',65536],gemini:['google/gemini-3.8-flash',32000],glm:['z-ai/glm-5.3',32000],qwen:['qwen/qwen3.8-max-0902',32000],grok:['grok-4.7',32000],chatgpt:['openai/gpt-6.1-terra',32000],mimo:['mimo-v2.6-pro',32000]}};
MC.new={...MC.base,grok:['x-ai/grok-4.7',32000],mimo:['xiaomi/mimo-v2.6-pro',32000]};
const FO={topic:meta.topic,cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3};
const out={};
for(const ver of ['base','new']){const code=fs.readFileSync(`${ver}/Build Independent Verdict.js`,'utf8');
 for(const seat of Object.keys(MC.base)){
  const nodes={'Final Output':FO,'Init with Guards':{c_served:meta.c_served,d_served:meta.d_served,c_named:[],d_named:[]},'Quote Report':{unavailable:true},'Init Seats':{run_token:r.run_token,single_judge:seat},'Resolve Seats':{deepseek:{api_model:'deepseek-flash',max_tokens:65536}}};
  const fetch=Object.entries(MC[ver]).map(([s,[m,t]])=>({json:{seat:s,api_model:m,max_tokens:t}}));
  const $=n=>{if(n==='Fetch Models')return{all:()=>fetch,first:()=>fetch[0]};return{first:()=>({json:nodes[n]}),all:()=>[{json:nodes[n]}]};};
  const o=new Function('$','$input','$json',code)($,{first:()=>({json:FO})},FO)[0].json; const b=o.verdictBody;
  out[ver+seat]=JSON.stringify(b.messages);
  console.log(ver.padEnd(5),seat.padEnd(9),'jidx',o.jidx,JSON.stringify(Object.fromEntries(Object.entries(b).filter(([k])=>k!=='messages'))));
 }}
for(const s of Object.keys(MC.base)) console.log(s.padEnd(9),'messages identical base/new:',out['base'+s]===out['new'+s]);
