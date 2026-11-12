const fs=require('fs');
const rows=require('/mnt/project-files/w3/grade_WVR/corpus2.json');
const node=f=>JSON.parse(fs.readFileSync(f)).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const V={live:node('/mnt/project-files/wall2024/fetchback_live_s158.json'),r2:node('/mnt/project-files/wall2024/parent_s158_WVR2.json'),r3:node('/mnt/project-files/wall2024/parent_s158_WVR3.json')};
const run=(code,F)=>new Function('$',code)(nm=>({first:()=>({json:nm==='Init Seats'?{run_token:F.t}:nm==='Resolve Seats'?{deepseek:{api_model:'ds'}}:F}),isExecuted:false}));
let same=0,calls=0,add=0;
for(const R of rows){const F={...R,t:R.run};const o={};for(const k in V)o[k]=run(V[k],F);
 for(let i=0;i<o.r3.length;i++){const g=k=>o[k][i]&&o[k][i].json;const j3=g('r3');if(!j3.body)continue;calls++;
  const len=k=>{const j=g(k);return j&&j.body?j.body.messages[0].content.length+j.body.messages[1].content.length:0};
  const d=len('r3')-len('live');add+=d;if(JSON.stringify(g('r3').body)===JSON.stringify(g('live').body)){same++;continue;}
  const w=k=>(g(k).cands||[]).filter(c=>/pkgWVR/.test(c.by)).map(c=>c.id+' L'+c.n+' '+c.earlier_round+' "'+c.earlier_q.slice(0,60)+'" -> "'+c.closing_q.slice(0,60)+'"');
  console.log(R.run,j3.side,'chars',len('r3'),'+'+d,'(r2 +'+(len('r2')-len('live'))+')');console.log('  r3:',w('r3').join('\n      '));const w2=w('r2');if(JSON.stringify(w2.map(x=>x.slice(x.indexOf('"'))))!==JSON.stringify(w('r3').map(x=>x.slice(x.indexOf('"')))))console.log('  r2:',w2.join('\n      '));}}
console.log({runs:rows.length,calls,same,add});
