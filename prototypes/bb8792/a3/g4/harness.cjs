// Runs the live Build Independent Verdict code (copy of 8a7f48d3) per judge seat on stored rounds, then applies the arm C GROUND edits. No model call.
const fs=require('fs');
const code=fs.readFileSync('BIV.js','utf8'), meta=JSON.parse(fs.readFileSync('meta.json','utf8'));
const rounds=JSON.parse(fs.readFileSync('../s5/rounds.json','utf8'));
const MC={deepseek:['deepseek-flash',65536],gemini:['google/gemini-3.8-flash',32000],glm:['z-ai/glm-5.3',32000],qwen:['qwen/qwen3.8-max-0902',32000],grok:['grok-4.7',32000],chatgpt:['openai/gpt-6.1-terra',32000],mimo:['mimo-v2.6-pro',32000]};
const R=[['UNDERDETERMINED -- one clause of why;','UNDERDETERMINED -- one clause of why -- GROUND: <reason>;'],['D<i>: WITHDRAWN;','D<i>: WITHDRAWN -- GROUND: <reason>;'],['Any other link: D<i>: STANDS.','Any other link: D<i>: STANDS -- GROUND: <reason>. Every COLLISION POINTS line, whatever its grade, each LINK BROKEN line included, ends with GROUND: and one short sentence naming the reason the grade rests on. A line without GROUND is incomplete.']];
const C=t=>{for(const [a,b] of R){if(t.split(a).length!==2)throw new Error('anchor '+a);t=t.replace(a,b);}return t;};
fs.mkdirSync('body',{recursive:true});
const run=(seat,r)=>{
  const FO={topic:meta.topic,cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3};
  const nodes={'Final Output':FO,'Init with Guards':{c_served:meta.c_served,d_served:meta.d_served,c_named:[],d_named:[]},'Quote Report':{unavailable:true},'Init Seats':{run_token:r.run_token,single_judge:seat},'Resolve Seats':{deepseek:{api_model:'deepseek-flash',max_tokens:65536}}};
  const fetch=Object.entries(MC).map(([s,[m,t]])=>({json:{seat:s,api_model:m,max_tokens:t}}));
  const $=n=>{if(n==='Fetch Models')return{all:()=>fetch,first:()=>fetch[0]};if(!(n in nodes))throw new Error('unmocked '+n);return{first:()=>({json:nodes[n]}),all:()=>[{json:nodes[n]}]};};
  const o=new Function('$','$input','$json',code)($,{first:()=>({json:FO})},FO)[0].json;
  const bf=Object.keys(o).find(k=>o[k]&&o[k].messages); return o[bf];
};
for(const r of rounds){const id=r.run_token.split('-')[1];
  const ds=run('deepseek',r);
  for(const seat of [...Object.keys(MC).filter(s=>s!=='deepseek'),'minimax3','minimax31']){
    let b;
    if(seat.startsWith('minimax')){b={model:seat==='minimax3'?'minimax/minimax-m3':'minimax/minimax-m3.1-flash',max_tokens:32000,reasoning:{effort:'max'},messages:JSON.parse(JSON.stringify(ds.messages))};}
    else b=run(seat,r);
    b.messages=b.messages.map(m=>m.role==='user'?{...m,content:C(m.content)}:m);
    const route=seat==='grok'?'grok':seat==='mimo'?'mimo':'or';
    fs.writeFileSync(`body/${id}__${seat}.json`,JSON.stringify({route,payload:b}));
    console.log(id,seat,route,JSON.stringify(Object.fromEntries(Object.entries(b).filter(([k])=>k!=='messages'))),b.messages.map(m=>m.role+':'+m.content.length).join(' '));
  }}
