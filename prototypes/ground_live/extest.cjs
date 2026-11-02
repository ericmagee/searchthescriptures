// Runs live Extract Independent Verdict (87e4c655) on stored arm-C replies, with GROUND and with GROUND stripped; prints field diffs.
const fs=require('fs');
const biv=fs.readFileSync('base_Build_Independent_Verdict.js','utf8'), ex=fs.readFileSync('base_Extract_Independent_Verdict.js','utf8');
const meta=JSON.parse(fs.readFileSync('meta.json','utf8')), rounds=JSON.parse(fs.readFileSync('../bb8792/a3/s5/rounds.json','utf8'));
const MC={deepseek:['deepseek-flash',65536],gemini:['google/gemini-3.8-flash',32000],glm:['z-ai/glm-5.3',32000],qwen:['qwen/qwen3.8-max-0902',32000],grok:['x-ai/grok-4.7',32000],chatgpt:['openai/gpt-6.1-terra',32000],mimo:['xiaomi/mimo-v2.6-pro',32000]};
const mk=(nodes,fetch)=>n=>{if(n==='Fetch Models')return{all:()=>fetch,first:()=>fetch[0]};if(!(n in nodes))throw new Error('unmocked '+n);return{first:()=>({json:nodes[n]}),all:()=>[{json:nodes[n]}]};};
const bivOut=r=>{const FO={topic:meta.topic,cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3};
 const nodes={'Final Output':FO,'Init with Guards':{c_served:meta.c_served,d_served:meta.d_served,c_named:[],d_named:[]},'Quote Report':{unavailable:true},'Init Seats':{run_token:r.run_token,single_judge:'deepseek'},'Resolve Seats':{deepseek:{api_model:'deepseek-flash',max_tokens:65536}}};
 const fetch=Object.entries(MC).map(([s,[m,t]])=>({json:{seat:s,api_model:m,max_tokens:t}}));
 return new Function('$','$input','$json',biv)(mk(nodes,fetch),{first:()=>({json:FO})},FO)[0].json;};
const strip=t=>t.replace(/\s*-+\s*GROUND:[^\n]*/g,'');
let n=0,diff=0;
for(const r of rounds){const id=r.run_token.split('-')[1]; const o=bivOut(r);
 for(const k of ['r1','r2','r3']){const f=`../bb8792/a3/g1/deepseek/out/${id}__C__${k}.txt`; if(!fs.existsSync(f))continue;
  const reply=fs.readFileSync(f,'utf8'); if(!/GROUND:/.test(reply))continue;
  const run=c=>new Function('$','$input','$json',ex)(mk({'Build Independent Verdict':o},[]),{first:()=>({json:{choices:[{message:{content:c},finish_reason:'stop'}]}})},{})[0].json;
  const a=run(reply), b=run(strip(reply)); n++;
  const keys=[...new Set([...Object.keys(a),...Object.keys(b)])].filter(x=>!/raw|text|verdict_md|full|content/i.test(x));
  const d=keys.filter(x=>JSON.stringify(a[x])!==JSON.stringify(b[x]));
  if(d.length){diff++;console.log(id,k,'DIFF',d.map(x=>x+': '+JSON.stringify(b[x]).slice(0,160)+' => '+JSON.stringify(a[x]).slice(0,160)).join('\n   '));}
  else console.log(id,k,'same', keys.length,'fields');
 }}
console.log('replies',n,'with diffs',diff);
