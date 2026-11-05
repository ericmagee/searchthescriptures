// s437 piece 4b on made-up inputs only (no stored run, no model call): the four new code nodes run as n8n Code nodes, with $() and $input mocked.
const fs=require('fs');const D=__dirname+'/../new/';
const run=(nm,nodes,input)=>{const $=n=>{if(!(n in nodes))throw new Error('node not executed: '+n);const v=nodes[n];const arr=Array.isArray(v)?v:[v];
  return {first:()=>({json:arr[0]}),all:()=>arr.map(j=>({json:j})),isExecuted:true};};
 const f=new Function('$','$input',fs.readFileSync(D+nm+'.js','utf8'));return f($,{first:()=>({json:input[0]}),all:()=>input.map(j=>({json:j}))}).map(x=>x.json);};
const S={run_token:'T-1'};const RS={deepseek:{api_model:'deepseek-flash',max_tokens:8000}};
const AC='ANSWER CHECK: Luke 1:35 -- [DR2] -- MEANS: "born of thee" -- ANSWER: "It does not say through whom" -- MEETS -- the answer meets it';
const altBody={payload:{judge_seat:'sol',verdict_raw:'VERDICT: HELD\n'+AC}};const panelBody={payload:{judge_seat:'grok',verdict_raw:'VERDICT: HELD\n'+AC}};
const rounds={CR1:'c1',CR2:'c2',CR3:'c3',CR4:'c4',DR1:'d1',DR2:'d2 born of thee',DR3:'d3',DR4:'d4'};
const base={'Init Seats':S,'Resolve Seats':RS,'Panel Cure Normalize 1':{cure:{rounds}},'Final Output':{synthesis:'The defender withdrew D2.'}};
let bad=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)bad++;};
// A. no alternate seated: skip, no call
const AM0={bodies:[JSON.stringify(panelBody)],alternates_seated:[],enforcer_log_body:{p_run_token:'T-1',p_rows:[{kind:'x'}]},enforcer_log:[{kind:'x'}]};
let b=run('Alt Enforcer Build',{...base,'Alternate Merge':AM0},[AM0]);ok(b.length===1&&b[0].je_skip===true,'A no alternate seated -> je_skip: '+b[0].why);
let r=run('Alt Enforcer Record',{...base,'Alternate Merge':AM0,'Alt Enforcer Build':b},b);ok(r[0].alt_enf&&r[0].alt_enf.skipped&&r[0].alt_enf_rows.length===0,'A record skipped, 0 rows');
let sb=run('Alt Send Back Build',{...base,'Alternate Merge':AM0},[r[0]]);ok(sb[0].sb_skip===true,'A send-back skipped: '+sb[0].sb_why);
let sr=run('Alt Send Back Record',{...base,'Alt Enforcer Record':r[0],'Alt Send Back Build':sb},sb);ok(sr[0].enforcer_log_body.p_rows.length===1&&sr[0].bodies.length===1,'A pass-through: log rows 1, Alternate Merge fields kept');
// B. alternate sol seated; panel grok not read
const AM1={bodies:[JSON.stringify(panelBody),JSON.stringify(altBody)],alternates_seated:[{removed_seat:'gemini',alternate_seat:'sol'}],enforcer_log_body:{p_run_token:'T-1',p_rows:[{kind:'x'}]},enforcer_log:[{kind:'x'}]};
b=run('Alt Enforcer Build',{...base,'Alternate Merge':AM1},[AM1]);const ids=b.flatMap(x=>x.ids||[]);
ok(!b[0].je_skip&&ids.length>0,'B items built: '+ids.map(i=>i.id+' '+i.rule+' '+i.seat).join(', '));
ok(ids.every(i=>i.seat==='sol'),'B only the alternate seat is read');ok(!ids.some(i=>i.rule==='E-SYN'),'B no synthesis item');
const rep=b.map(x=>({choices:[{message:{content:(x.ids||[]).map(i=>'ENFORCER: '+i.id+' -- DISAGREE -- RIGHT: MISSES -- an absence answer').join('\n')}}]}));
r=run('Alt Enforcer Record',{...base,'Alternate Merge':AM1,'Alt Enforcer Build':b},rep);const er=r[0].alt_enf_rows;
ok(er.length>0&&er.every(x=>x.seat_role==='alternate'),'B record rows '+er.length+', all seat_role alternate; first: '+er[0].cure_reason.slice(0,60));
const AB=[{alt:{seat:'sol',api_model:'openai/gpt-6.1-sol',body:{model:'openai/gpt-6.1-sol',session_id:'T-1:alternate:sol',messages:[{role:'system',content:'SYS'},{role:'user',content:'DEBATE TRANSCRIPT'}]}}}];
sb=run('Alt Send Back Build',{...base,'Alternate Merge':AM1,'Alternate Build':AB},[r[0]]);
ok(!sb[0].sb_skip&&sb[0].seat==='sol'&&sb[0].body.messages.length===4&&sb[0].body.session_id==='T-1:alternate:sol','B send-back built for sol, own conversation, '+sb[0].items.length+' item(s)');
const srep=[{choices:[{message:{content:sb[0].items.map(i=>'SENDBACK: '+i.sid+' || KEEP || "born of thee"').join('\n')}}]}];
sr=run('Alt Send Back Record',{...base,'Alt Enforcer Record':r[0],'Alt Send Back Build':sb},srep);
const L=sr[0].enforcer_log_body.p_rows;ok(L.length===1+er.length+sb[0].items.length&&sr[0].alt_sb_rows.every(x=>x.seat_role==='alternate'&&/SEND-BACK KEEP/.test(x.cure_reason)),'B log rows '+L.length+' = 1 old + '+er.length+' enforcer + '+sb[0].items.length+' send-back; KEEP recorded');
ok(sr[0].enforcer_log.length===L.length&&sr[0].alternates_seated.length===1,'B enforcer_log mirrors the body; Alternate Merge fields kept');
process.exit(bad);
