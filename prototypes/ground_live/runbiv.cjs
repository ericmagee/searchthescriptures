// Runs base and new Build Independent Verdict for every single-judge seat on the three stored debates; reports body fields and message diffs.
const fs=require('fs');
const meta=JSON.parse(fs.readFileSync('meta.json','utf8')), rounds=JSON.parse(fs.readFileSync('../bb8792/a3/s5/rounds.json','utf8'));
const MC={deepseek:['deepseek-flash',65536],gemini:['google/gemini-3.8-flash',32000],glm:['z-ai/glm-5.3',32000],qwen:['qwen/qwen3.8-max-0902',32000],grok:['x-ai/grok-4.7',32000],chatgpt:['openai/gpt-6.1-terra',32000],mimo:['xiaomi/mimo-v2.6-pro',32000]};
const mk=(nodes,fetch)=>n=>{if(n==='Fetch Models')return{all:()=>fetch,first:()=>fetch[0]};if(!(n in nodes))throw new Error('unmocked '+n);return{first:()=>({json:nodes[n]}),all:()=>[{json:nodes[n]}]};};
const run=(code,seat,r)=>{const FO={topic:meta.topic,cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3};
 const nodes={'Final Output':FO,'Init with Guards':{c_served:meta.c_served,d_served:meta.d_served,c_named:[],d_named:[]},'Quote Report':{unavailable:true},'Init Seats':{run_token:r.run_token,single_judge:seat},'Resolve Seats':{deepseek:{api_model:'deepseek-flash',max_tokens:65536}}};
 const fetch=Object.entries(MC).map(([s,[m,t]])=>({json:{seat:s,api_model:m,max_tokens:t}}));
 const o=new Function('$','$input','$json',code)(mk(nodes,fetch),{first:()=>({json:FO})},FO)[0].json; return o.verdictBody;};
const B=fs.readFileSync('base_Build_Independent_Verdict.js','utf8'), N=fs.readFileSync('new/Build Independent Verdict.js','utf8');
let bad=0;
for(const r of rounds){const id=r.run_token.split('-')[1];
 for(const seat of Object.keys(MC)){const b=run(B,seat,r), n=run(N,seat,r);
  const strip=x=>JSON.stringify(Object.fromEntries(Object.entries(x).filter(([k])=>k!=='messages'&&k!=='contents'&&k!=='systemInstruction')));
  const um=x=>(x.messages||[]).find(m=>m.role==='user')?.content||x.contents?.[0]?.parts?.[0]?.text||'';
  const sm=x=>(x.messages||[]).find(m=>m.role==='system')?.content||x.systemInstruction?.parts?.[0]?.text||'';
  const g=(um(n).match(/GROUND: <reason>/g)||[]).length, inc=/A line without GROUND is incomplete/.test(um(n));
  const sysSame=sm(b)===sm(n);
  // user message: new must equal base with the three edits applied
  const exp=um(b).replace('UNDERDETERMINED -- one clause of why;','UNDERDETERMINED -- one clause of why -- GROUND: <reason>;').replace('D<i>: WITHDRAWN;','D<i>: WITHDRAWN -- GROUND: <reason>;').replace('Any other link: D<i>: STANDS.','Any other link: D<i>: STANDS -- GROUND: <reason>. Every COLLISION POINTS line, whatever its grade, each LINK BROKEN line included, ends with GROUND: and one short sentence naming the reason the grade rests on. A line without GROUND is incomplete.');
  const ok=exp===um(n)&&sysSame&&g===3&&inc;
  const bodyChanged=strip(b)!==strip(n);
  if(!ok)bad++;
  console.log(id,seat.padEnd(8),ok?'OK ':'BAD',bodyChanged?('BODY '+strip(b)+' -> '+strip(n)):'body same '+strip(n));
 }}
console.log('bad',bad);
