// Worker_A3 step 6 (f): fixed prompt size of the live judge prompts, with stub round texts of known length. Usage: node tmpl.cjs <p2 dir with live .js>
const fs=require('fs');const P2=process.argv[2];
const F={cr1:'a'.repeat(1000),gr1:'b'.repeat(1000),cr2:'c'.repeat(1000),gr2:'d'.repeat(1000),cr3:'e'.repeat(1000),dr3:'f'.repeat(1000),topic:'t'};const STUB=6001;
const J={json:{run_token:'tok',rulebook:'current',topic:'t',single_judge:'deepseek',posline:'P.',d_served:[],c_served:[],d_named:[],c_named:[],debate_id:'d',
 judges:[{seat:'deepseek',fam:'deepseek',api_model:'m',max_tokens:1},{seat:'gemini',fam:'gemini',api_model:'m',max_tokens:1},{seat:'grok',fam:'grok',api_model:'m',max_tokens:1}],deepseek:{api_model:'m',max_tokens:1},...F}};
const $=n=>({first:()=>n==='Fetch Models'?{json:{seat:'deepseek',api_model:'m'}}:J,all:()=>n==='Fetch Models'?[{json:{seat:'deepseek',api_model:'m'}}]:[J],isExecuted:false});
for(const f of ['Panel_Build.live.js','Build_Independent_Verdict.live.js']){const out=new Function('$','$input','$execution',fs.readFileSync(P2+'/'+f,'utf8'))($,{first:()=>J},{customData:{set(){}}});
 const j=out[0].json;const bodies=j.verdictBody?[j.verdictBody]:j.judges.map(x=>x.body);
 for(const b of bodies){const txt=(b.messages||[]).map(m=>typeof m.content==='string'?m.content:'').join('\n')+(b.contents||[]).map(c=>(c.parts||[]).map(p=>p.text||'').join('')).join('\n')+(b.system_instruction?JSON.stringify(b.system_instruction):'');console.log(f,'fixed prompt chars',txt.length-STUB);}}
