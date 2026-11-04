const fs=require('fs');
function run(file,D,C){const code=fs.readFileSync(file,'utf8');
 const seats=['deepseek','gemini','chatgpt','qwen','grok','sol'].map(s=>({seat:s,placed:true,status:'ACCEPT'}));
 const j0={acc:{seats},src:{body:{topic:'t',defender:{engine:D,profile:'plain'},challenger:{engine:C,profile:'oracle'}}}};
 const $input={first:()=>({json:j0})};const $execution={id:1,customData:{set(){}}};
 try{const r=new Function('$input','$execution',code)($input,$execution)[0].json;
  return `panel=[${r.panel_order}] reserve=${r.panel_reserve} alt=[${r.alt_order}] single=${r.single_judge}`;}catch(e){return 'REFUSED: '+e.message.slice(0,110);}}
for(const [D,C] of [['claude','opus'],['chatgpt','opus'],['gemini','opus'],['grok','opus'],['claude','chatgpt'],['gemini','chatgpt'],['grok','gemini'],['deepseek','opus'],['claude','deepseek']]){
 console.log(D+' v '+C);console.log('  BASE '+run('s421a/base/Init Seats.js',D,C));console.log('  NEW  '+run('s421a/new/Init Seats.js',D,C));}
