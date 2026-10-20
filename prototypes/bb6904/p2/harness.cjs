// Runs a Code-node body with stubbed $() inputs; reports the built prompt. Usage: node harness.cjs <file> <rulebook>
const fs=require('fs');const src=fs.readFileSync(process.argv[2],'utf8');const rb=process.argv[3]||'current';
const T='x'.repeat(3000);const F={cr1:T,gr1:T,cr2:T,gr2:T,cr3:T,dr3:T,topic:'t'};
const J={json:{run_token:'tok',rulebook:rb,topic:'t',single_judge:'deepseek',posline:'P.',d_served:[],c_served:[],d_named:[],c_named:[],debate_id:'d',
 judges:[{seat:'deepseek',fam:'deepseek',api_model:'m',max_tokens:1},{seat:'openai',fam:'openai',api_model:'m',max_tokens:1},{seat:'grok',fam:'grok',api_model:'m',max_tokens:1}],
 deepseek:{api_model:'m',max_tokens:1},...F}};
const $=n=>({first:()=>n==='Fetch Models'?{json:{seat:'deepseek',api_model:'m'}}:J,all:()=>n==='Fetch Models'?[{json:{seat:'deepseek',api_model:'m'}}]:[J],isExecuted:false});
const out=new Function('$','$input','$execution',src)($,{first:()=>J},{customData:{set(){}}});
const j=out[0].json;const p=j.verdictBody?j.verdictBody.messages[1].content:j.judges[0].body.messages[0].content;
console.log(process.argv[2],rb,'prompt chars',p.length,'DRV present',p.includes('DEBATE RULE VIOLATION (BB-6904'),'count',p.split('DEBATE RULE VIOLATION (BB-6904').length-1);
