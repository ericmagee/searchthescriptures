// BB-6950 re-verify (Worker_A3): build the live Panel Build and Build Independent Verdict prompts with stub round texts and run cureRounds on each. Paths are this seat's scratchpad; point P2/P4 at your own copies of p2 (live .js) and p4.
const fs=require('fs');
const L=new Function(fs.readFileSync('/tmp/claude-0/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/scratchpad/p4v3/prototypes/bb6904/p4/drv_block_0b3cbac.js','utf8')+'\n'+fs.readFileSync('/tmp/claude-0/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/scratchpad/p4v3/prototypes/bb6904/p4/cure_lib.js','utf8')+'\nreturn {cureRounds};')();
const F={cr1:'CR1 TEXT alpha '+'a'.repeat(600),gr1:'DR1 TEXT delta '+'b'.repeat(600),cr2:'CR2 TEXT eta '+'c'.repeat(600),gr2:'DR2 TEXT iota '+'d'.repeat(600),cr3:'CR3 TEXT mu '+'e'.repeat(600),dr3:'DR3 TEXT xi '+'f'.repeat(600),topic:'t'};
const J={json:{run_token:'tok',rulebook:'current',topic:'t',single_judge:'deepseek',posline:'P.',d_served:[],c_served:[],d_named:[],c_named:[],debate_id:'d',
 judges:[{seat:'deepseek',fam:'deepseek',api_model:'m',max_tokens:1},{seat:'openai',fam:'openai',api_model:'m',max_tokens:1},{seat:'grok',fam:'grok',api_model:'m',max_tokens:1}],deepseek:{api_model:'m',max_tokens:1},...F}};
const $=n=>({first:()=>n==='Fetch Models'?{json:{seat:'deepseek',api_model:'m'}}:J,all:()=>n==='Fetch Models'?[{json:{seat:'deepseek',api_model:'m'}}]:[J],isExecuted:false});
for(const f of ['Panel_Build.live.js','Build_Independent_Verdict.live.js']){const out=new Function('$','$input','$execution',fs.readFileSync('/tmp/claude-0/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/scratchpad/p2v3/prototypes/bb6904/p2/'+f,'utf8'))($,{first:()=>J},{customData:{set(){}}});
 const j=out[0].json;const body=j.verdictBody?j.verdictBody:j.judges[0].body;const r=L.cureRounds(body);
 console.log(f,'rounds read:',Object.keys(r).join(',')||'NONE',JSON.stringify(Object.fromEntries(Object.entries(r).map(([k,v])=>[k,v.trim().slice(0,30)]))));
 const t=(body.messages||[]).map(m=>typeof m.content==='string'?m.content:'').join('\n');for(const lab of ['[CR1','[DR2'])console.log('   line with',lab,':',JSON.stringify(t.split('\n').find(l=>l.includes(lab+']')||l.startsWith(lab))));}
{const P2=process.argv[2];const out=new Function('$','$input','$execution',fs.readFileSync(P2+'/Panel_Build.live.js','utf8'))($,{first:()=>J},{customData:{set(){}}});
 const t=out[0].json.judges[0].body.messages.map(m=>typeof m.content==='string'?m.content:'').join('\n');
 for(const k of ['CR1 TEXT','DR2 TEXT','DR3 TEXT']){const i=t.indexOf(k);console.log(k,'preceded by:',JSON.stringify(t.slice(Math.max(0,i-80),i)));}}
