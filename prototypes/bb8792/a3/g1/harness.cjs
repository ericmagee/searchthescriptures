// Runs the live flow's Build Independent Verdict code (copy of version 8a7f48d3) on stored rounds. No model call.
const fs=require('fs');
const code=fs.readFileSync('BIV.js','utf8');
const meta=JSON.parse(fs.readFileSync('meta.json','utf8'));
const rounds=JSON.parse(fs.readFileSync('../s5/rounds.json','utf8'));
fs.mkdirSync('body',{recursive:true});
for(const r of rounds){
  const id=r.run_token.split('-')[1];
  const FO={topic:meta.topic,cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3};
  const nodes={'Final Output':FO,'Init with Guards':{c_served:meta.c_served,d_served:meta.d_served,c_named:[],d_named:[]},
    'Quote Report':{unavailable:true},'Init Seats':{run_token:r.run_token,single_judge:'deepseek'},
    'Resolve Seats':{deepseek:{api_model:'deepseek-flash',max_tokens:65536}}};
  const fetch=[{json:{seat:'deepseek',api_model:'deepseek-flash',max_tokens:65536}}];
  const $=n=>{ if(n==='Fetch Models')return {all:()=>fetch,first:()=>fetch[0]};
    if(!(n in nodes))throw new Error('unmocked node '+n); return {first:()=>({json:nodes[n]}),all:()=>[{json:nodes[n]}],item:{json:nodes[n]}};};
  const out=new Function('$','$input','$json',code)($,{first:()=>({json:FO}),all:()=>[{json:FO}]},FO);
  const o=out[0].json; const bf=Object.keys(o).find(k=>o[k]&&o[k].messages);
  const msgs=o[bf].messages;
  fs.writeFileSync(`body/${id}.json`,JSON.stringify(msgs));
  console.log(id,bf,msgs.map(m=>m.role+':'+m.content.length).join(' '));
}
