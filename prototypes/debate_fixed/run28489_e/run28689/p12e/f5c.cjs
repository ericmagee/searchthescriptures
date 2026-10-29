// F5c second part: run each patched node over run 29199's saved rounds with stub inputs for the other nodes; count the insert in the built prompts.
const fs=require('fs');const row=JSON.parse(fs.readFileSync('../p9e/row_7b466555.json'));const INS=fs.readFileSync('insert.txt','utf8').trim();
const QC=JSON.parse(fs.readFileSync('../p11e/qc29199.json'));
const qr=new Function('$',fs.readFileSync('../p11e/new_Quote_Report_a3.js','utf8'))(n=>n==='Find Words'?{all:()=>[]}:{first:()=>({json:QC})})[0].json;
const fo={...row,topic:row.topic,cr1:row.claude_r1,gr1:row.engine_r1,cr2:row.claude_r2,gr2:row.engine_r2,cr3:row.engine_r3,dr3:row.challenger_r3};
const seat={api_model:'stub',max_tokens:8000};const J=['deepseek','gemini','grok'].map(x=>({seat:x,judge_seat:x,api_model:'stub',max_tokens:8000,family:x,fam:x}));const RS=new Proxy({judges:J},{get:(o,k)=>k in o?o[k]:seat});
const nodes={'Final Output':fo,'Quote Report':qr,'Init with Guards':{d_served:[],c_served:[],d_named:[],c_named:[]},'Init Seats':{run_token:'STUB',single_judge:'deepseek'},'Resolve Seats':RS,'Check Save':{debate_id:'stub'}};
const $=n=>{const j=nodes[n]||{};if(n==='Fetch Models')return {all:()=>[{json:{seat:'deepseek',api_model:'stub',max_tokens:8000}}],first:()=>({json:{}}),isExecuted:false};return {first:()=>({json:j}),all:()=>[{json:j}],item:{json:j},isExecuted:n in nodes&&n!=='Regrade Load'};};
for(const f of (process.argv[2]==='live'?['../p8/final/Build_Independent_Verdict.js','../p8/final/Panel_Build.js']:['new_Build_Independent_Verdict.js','new_Panel_Build.js'])){
 try{const out=new Function('$',fs.readFileSync(f,'utf8'))($);const s=JSON.stringify(out);const c=s.split(INS).length-1;
  console.log(f,'ran; insert occurrences in output JSON:',c,'| output chars',s.length);}
 catch(e){console.log(f,'did not run on stub inputs:',e.message.slice(0,160));}}
