const fs=require('fs');
const run=(file)=>{
 const w=JSON.parse(fs.readFileSync(file));const N={};w.nodes.forEach(n=>N[n.name]=n);
 const out={};
 for(const eng of ['glm','qwen4max','qwen4MAX ']){
  const body={defender:{engine:eng,profile:'plain'},challenger:{engine:'spark',profile:'oracle'},topic:'Did Christ have a biological father?'};
  const acc={seats:['chatgpt','sol','luna','hydrogen','gemini','grok','argon','haiku','spark'].map(s=>({seat:s,placed:true,status:'ACCEPT'}))};
  const $input={first:()=>({json:{acc,src:{body}}})};const $execution={id:'99999',customData:{set:()=>{}}};
  const $=()=>({all:()=>[]});
  let init;try{init=new Function('$input','$execution','$',N['Init Seats'].parameters.jsCode)($input,$execution,$)[0].json;}catch(e){out[eng]='INIT REFUSED: '+e.message.slice(0,140);continue;}
  const rows=[['glm','z-ai/glm-5.3',131072,'zhipu'],['spark','meta/muse-spark-1.3',64000,'meta'],['qwen4max','qwen/qwen4-max',131072,'qwen'],['deepseek','deepseek-flash',64000,'deepseek'],
   ['chatgpt','openai/gpt-6.1-terra',64000,'openai'],['sol','openai/gpt-6.1-sol',64000,'openai'],['luna','openai/gpt-6-luna',64000,'openai'],['hydrogen','google/gemini-4-hydrogen',65536,'google'],['gemini','google/gemini-3.8-flash',64000,'google'],['grok','x-ai/grok-4.7',64000,'xai'],['argon','google/gemini-4-argon',64000,'google'],['haiku','anthropic/claude-haiku-5.5',64000,'anthropic']].map(([seat,api_model,max_tokens,family])=>({json:{seat,api_model,max_tokens,family}}));
  const $2=n=>n==='Init Seats'?{first:()=>({json:init})}:n==='Fetch Models'?{all:()=>rows}:{all:()=>[]};
  let rs;try{rs=new Function('$','$execution',N['Resolve Seats'].parameters.jsCode)($2,$execution)[0].json;}catch(e){out[eng]='RESOLVE REFUSED: '+e.message.slice(0,160);continue;}
  out[eng]={defender:rs.defender.model+' tok '+rs.defender.tok+' fam '+rs.defender.fam,judges:rs.judges.map(j=>j.seat).join(','),alternates:rs.alternates.map(a=>a.seat).join(','),debaters:JSON.stringify(rs.debaters)};
 }
 return out;};
console.log('LIVE  ',JSON.stringify(run('live.json'),null,1));
console.log('TARGET',JSON.stringify(run(process.argv[2]||'target_348.json'),null,1));
