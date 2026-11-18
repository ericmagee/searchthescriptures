// ASK 396 stored check (W1 8542 DoD c as amended at 8551): every run with a stored UNCURED E-PREM or E-ANS send-back row in debate_enforcer_log, from the run's own recorded statuses. Runs the built header block (a396/hdr396.js) on each run's rows.
const fs=require('fs');const D=JSON.parse(fs.readFileSync(__dirname+'/stored396_in.json'));
const H=fs.readFileSync(__dirname+'/hdr396.js','utf8');
const NAME={claude:'Claude',chatgpt:'ChatGPT',gemini:'Gemini',grok:'Grok',mimo:'MiMo',haiku:'Claude Haiku',opus:'Claude Opus',glm:'GLM',qwen:'Qwen',deepseek:'DeepSeek'};const nm=e=>NAME[e]||e||'?';const ALTN0={alt_minimax31:'MiniMax M3.1 Flash',alt_minimax3:'MiniMax M3'};
const f=new Function('$','r','nm','ALTN0','let t="";'+H+';return t;');
const out=[];let seats=0,bad=0;
for(const R of D.runs){const EL=R.rows.map(x=>({kind:'send_back',seat:x.seat,seat_role:x.role,rule:x.rule,item:x.item,cure_status:'UNCURED'}));
 const $=n=>n==='Alternate Merge'?{isExecuted:true,first:()=>({json:{enforcer_log:EL}})}:{isExecuted:false};
 const line=f($,{drv_removed:(R.removed||[]).map(s=>({seat:s}))},nm,ALTN0).trim();
 const want=[...new Set(R.rows.map(x=>x.seat))];const got=want.filter(s=>line.includes((ALTN0[s]||nm(s))+((R.removed||[]).includes(s)?' (removed)':'')+': '));seats+=want.length;if(got.length!==want.length)bad++;
 out.push({run:R.run,seats:want.length,listed:got.length,line});}
console.log(JSON.stringify({runs:D.runs.length,seat_runs:seats,runs_mismatch:bad}));for(const o of out)console.log(o.run,'|',o.line.replace(/^\*\*[^*]+\*\* /,''));
fs.writeFileSync(__dirname+'/stored396_out.json',JSON.stringify(out,null,1));
