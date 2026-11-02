// Unit fixtures, base vs new, typed from the SQL reads (debate_judgments 876-887; debate_results of runs 32157, 32194, 32205, 32212;
// drift_guards rule_num 8; kjv_verses). Every fixture runs on every changed node that carries the function under test.
const fs=require('fs');const D=__dirname+'/../';const RL=require('./replay_lib.cjs');const {fullLib,drvLib}=require('./lib.cjs');
let bad=0,n=0;const ok=(c,msg)=>{n++;if(!c)bad++;console.log((c?'OK  ':'BAD ')+msg);};
const NEW=fs.readdirSync(D+'new');const has=(f,s)=>fs.readFileSync(D+'new/'+f,'utf8').includes(s);
const drvNodes=NEW.filter(f=>has(f,'function drvCheck(')),cureNodes=NEW.filter(f=>has(f,'function cureVerdicts('));
const J=(run,seat)=>{const r=RL.run(run);return seat==='single'?RL.judgment(r.independent_verdict_raw,false):RL.judgment(r.judgments.find(j=>j.seat===seat).verdict_raw,true);};
const marksOf=(lib,t)=>lib.drvCheck(t,null,null,null,null,false).items.map(x=>x.rule+' '+(x.link||x.side));
const everyDrv=(t,pred)=>drvNodes.filter(f=>!pred(marksOf(drvLib(D+'new/'+f),t))).length;
// ---- R1 (ruling 372): fix 1 removed; FIX 2 kept, identical in every copy ----
const C2="only when the block surrenders the link itself; a block that drops a limb and keeps the link in a narrowed form is not a concession: grade the narrowed link";
const LEDGER_S="A premise whose pressed witness goes unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings.";
{const left=NEW.filter(f=>/K-X|kxLines|KX_|never makes a link UNEXHIBITED/.test(fs.readFileSync(D+'new/'+f,'utf8')));ok(left.length===0,'R1 no K-X or fix-1 text left in new/ ('+(left.join(', ')||'none')+')');}
for(const f of ['Panel Build.js','Build Independent Verdict.js']){const s=fs.readFileSync(D+'new/'+f,'utf8');ok(s.split(C2).length-1===2&&s.includes(LEDGER_S),'FIX 2 '+f+': narrowing clause x'+(s.split(C2).length-1)+' (want 2); R1 ledger sentence kept');}
{const s=fs.readFileSync(D+'new/Format Markdown.js','utf8');ok(s.includes(C2)&&!/never makes a link UNEXHIBITED/.test(s),'FIX 2 Format Markdown rule copy carries the narrowing clause; no fix-1 clause');}
ok(drvNodes.every(f=>/rule:'K-G6'/.test(fs.readFileSync(D+'new/'+f,'utf8'))===/rule:'K-G6'/.test(fs.readFileSync(D+'base/'+f,'utf8'))),'R1 K-G6 kept wherever it was');
// ---- R2 (ruling 373): [DR1] answers for the challenger, in every copy and checker ----
for(const f of ['Panel Build.js','Build Independent Verdict.js']){const s=fs.readFileSync(D+'new/'+f,'utf8');
 ok(s.includes("(for the defender: [CR2] or [CR3]; for the challenger: [DR1], [DR2] or [DR3])")&&!/(?<!\[DR1\], )\[DR2\] or \[DR3\]/.test(s),'R2 '+f+': rule and ledger copies name [DR1], [DR2] or [DR3]; no "[DR2] or [DR3]" left');}
ok(cureNodes.every(f=>!/(?<!\[DR1\], )\[DR2\] or \[DR3\]/.test(fs.readFileSync(D+'new/'+f,'utf8'))),'R2 cure prompts (K-G1 SHORT, K-S) name [DR1] on all '+cureNodes.length+' cure nodes');
{const PWL=v=>{const s=fs.readFileSync(D+v+'/Panel Build.js','utf8');return new Function(s.slice(s.indexOf('const PWL='),s.indexOf('\nconst LEDGER='))+';return PWL;')();};
 const r=RL.run('32194');const F={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};
 const b=PWL('base').judgeBlock(F),w=PWL('new').judgeBlock(F);const ch=t=>t.slice(t.indexOf('AGAINST THE CHALLENGER'));
 ok(/NOT NAMED: Isaiah 7:14/.test(ch(b))&&!/NOT NAMED: Isaiah 7:14/.test(ch(w)),'R2 ledger 32194: Isaiah 7:14 pressed in [CR1] and named in [DR1] (engine_r1) was NOT NAMED, now answered');}
{const t='D3 vs C1 (Isaiah 7:14): UNDERDETERMINED -- the witness was answered in [DR1], and no verse states the contrary.';
 const o=drvLib(D+'base/Panel Payloads.js').drvCheck(t).items.map(x=>x.rule),w=drvLib(D+'new/Panel Payloads.js').drvCheck(t).items.map(x=>x.rule);
 ok(o.includes('K-S')&&!w.includes('K-S')&&everyDrv(t,m=>!m.some(x=>x.startsWith('K-S ')))===0,'R2 K-S: a line naming [DR1] as the answering round is no longer K-S (base '+o.join(',')+'; new '+w.join(',')+')');}
{const kg1={rule:'K-G1',side:'CHALLENGER',link:'D3 vs C1',line:'D3 vs C1 (Isaiah 7:14): CHALLENGER LINK BROKEN -- [CR1] pressed Isaiah 7:14 and the challenger left it unanswered.'};
 const R=RL.rounds(RL.run('32194'));const L=fullLib(D+'new/Cure Check.js');const v=L.cureVerdicts([kg1],{ok:true,text:'RESPONSE: K-G1 D3 vs C1 | I accept the mark as stated.\nCORRECTED COUNT: CHALLENGER 1\nPRESSED: D3 vs C1 | [CR1] | "The prophetic record requires a conception without a human father"'},null,R)[0];
 ok(v.status==='UNCURED'&&/\[DR1\]/.test(v.why),'R2 K-G1: a later [DR1] naming of the pressed verse now asks for its answer (SHORT may cite [DR1]): '+v.why.slice(0,90));}
{const P=t=>'AGAINST THE DEFENDER, answered in [CR2] or [CR3]:\npremise 1 (LINK 1): 2 verse(s) carried; 1 named; NOT NAMED: Acts 1:8\n'+t+':\npremise 1: 1 verse(s) carried; 1 named; NOT NAMED: none\ncited in ...\nA verse marked NOT NAMED is unanswered by the rule.';
 const txt='CONCEDED LINKS: 0 -- none.\nCHALLENGER CONCEDED LINKS: 0 -- none.';const pt=P('AGAINST THE CHALLENGER, answered in [DR1], [DR2] or [DR3]');
 const o=drvLib(D+'base/Panel Payloads.js').drvLedger(txt,pt,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',null).items,w=drvLib(D+'new/Panel Payloads.js').drvLedger(txt,pt,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',null).items;
 ok(o.length===0&&w.length===1&&w[0].rule==='K-G6','R2 K-G6 reads the judge prompt\'s ledger heading ("answered in [CR2] or [CR3]:"): base finds no ledger ('+o.length+' items), new marks DEFENDER premise 1 ('+w.length+')');}
// ---- FIX 4 K-C ----
const g=J('32212','gemini'),c=J('32212','chatgpt'),d=J('32212','deepseek');
const ln=(j,re)=>j.text.split('\n').find(l=>re.test(l));
ok(everyDrv(ln(g,/^RESULT/),m=>m.includes('K-C RESULT'))===0,'K-C 886 RESULT "Scripture nowhere states" marked');
ok(everyDrv(ln(g,/^CHALLENGER CHAIN MARK/),m=>m.includes('K-C CHALLENGER CHAIN MARK'))===0,'K-C 886 CHALLENGER CHAIN MARK "without a single biblical text stating" marked');
ok(everyDrv(ln(d,/^DEFENDER CHAIN MARK/),m=>!m.some(x=>x.startsWith('K-C')))===0,'K-C 885 DEFENDER CHAIN MARK ("the defender conceding no verse names her line") not marked');
ok(everyDrv('CHALLENGER CHAIN MARK: FOOTED -- every link rests on exhibited rows, though its conclusion remains an inference no row states.',m=>!m.length)===0,'K-C a FOOTED chain mark is not marked (32194 GLM)');
ok(everyDrv(ln(d,/^D6:/),m=>m.includes('K-C D6'))===0,'K-C 885 D6 "no exhibit anywhere says" marked (E7)');
ok(everyDrv('D4: STANDS -- [CR3] left Luke 1:27 unstated, and the rows never state that Joseph begat Jesus.',m=>m.includes('K-C D4'))===0,'K-C checker_fix fixture still marked (NET_ANSWER mask kept)');
ok(everyDrv("CONCEDED LINKS: 1 -- premise 5 (LINK 5) CONCEDED (stated): the defender wrote 'That Heli is her father is a reading. No verse states it, and I do not claim one does'.",m=>!m.some(x=>x.startsWith('K-C')))===0,'K-C single-quoted round words not marked (j816)');
// ---- E1 K-N, E2 K-SC, E5 K-DG8 ----
ok(everyDrv(ln(d,/^CONCEDED LINKS/),m=>m.includes('K-N CONCEDED LINKS'))===0,'K-N 885 "I drop any claim that ..." counted CONCEDED (stated) marked');
ok(everyDrv('CONCEDED LINKS: 1 -- premise 2 CONCEDED (stated): "LINK 2: CONCEDED. I withdraw the claim."',m=>!m.some(x=>x.startsWith('K-N')))===0,'K-N a surrender ("I withdraw", "CONCEDED") not marked');
ok(everyDrv('D5: STANDS -- GROUND: [CR3] LINK 5 conceded the whole link and offered nothing further.',m=>m.includes('K-SC D5'))===0,'K-SC a STANDS line that says the defender round conceded the link is marked');
ok(everyDrv(ln(d,/^D5:/),m=>!m.includes('K-SC D5'))===0,'K-SC 885 D5 ("conceded that no verse names her line, keeping only the inference") not marked: a narrowing (fix 2)');
ok(everyDrv(ln(g,/^D3:/),m=>m.includes('K-DG8 D3'))===0,'K-DG8 886 D3 "Matthew 1:25 confirm Mary had no sexual knowledge" marked');
ok(everyDrv(ln(g,/^D5:/),m=>m.includes('K-DG8 D5'))===0,'K-DG8 886 D5 flesh "preserved through the mother" (STANDS) marked');
ok(everyDrv(ln(J('32194','gemini'),/^D3 vs C1/),m=>m.includes('K-DG8 D3 vs C1'))===0,'K-DG8 880 Gemini "directly exclude Joseph knowing Mary" marked');
ok(everyDrv(ln(d,/^DEFENDER CHAIN MARK/),m=>!m.some(x=>x.startsWith('K-DG8')))===0,'K-DG8 885 chain mark that describes "routing the flesh descent through Mary" not marked');
ok(everyDrv('D2 vs C1 (Matthew 1:18-25): UNDERDETERMINED -- the same verses are read two ways and neither reading is excluded by their own words.',m=>!m.length)===0,'K-DG8 hedged "neither reading is excluded" not marked (j843)');
// ---- cure side: FIX 3, W1 ----
const it=(rule,link,line,side)=>({rule,link,side:side||'DEFENDER',line});
const reply=t=>({ok:true,text:t});const R=RL.rounds(RL.run('32212'));
const D5L=ln(d,/^D5:/);const kc={rule:'K-C',side:'CHALLENGER',link:'D5',line:D5L};
const restD5='RESTATED: D5 vs C5 (Romans 1:3): UNDERDETERMINED -- the defender\'s chain is weighed as a chain: [L1] "made of the seed of David according to the flesh" (Romans 1:3) with [L2] genomenou ek spermatos Dabid and [L3] Acts 2:30; the challenger\'s registers are read beside it.';
const resp='RESPONSE: K-C D5 | I accept the mark: [CR3] LINK 5 narrowed the link and my ground should weigh the chain, so I regrade it.';
let bn=0,bw=0,br=0;for(const f of cureNodes){const L=fullLib(D+'new/'+f);const v1=L.cureVerdicts([kc],reply(restD5+'\n'+resp),null,R)[0],v2=L.cureVerdicts([kc],reply(restD5),null,R)[0],v3=L.cureVerdicts([kc],reply(restD5.replace('D5 vs C5','C5 vs D5')+'\n'+resp),null,R)[0];
 if(v1.status!=='CURED')bn++;if(!(v2.status==='UNCURED'&&v2.why==='no written response'))bw++;if(v3.status!=='CURED')br++;}
const vb=fullLib(D+'base/Cure Check.js').cureVerdicts([kc],reply(restD5),null,R)[0];
ok(vb.status==='UNCURED'&&/no RESTATED line for D5/.test(vb.why)&&bn===0,'FIX 3 base refuses "D5 vs C5" ('+vb.why+'); new cures it with a RESPONSE line on all '+cureNodes.length+' cure nodes (bad '+bn+')');
ok(br===0,'FIX 3 "C5 vs D5 ..." is read as the D5 vs C5 line and serves D5 (bad '+br+')');
ok(bw===0,'W1 the same reply without a RESPONSE line: UNCURED "no written response" on every cure node (bad '+bw+')');
{const L=fullLib(D+'new/Cure Check.js');ok(L.cureAsk([kc],{}).includes('RESPONSE: <the flagged item'),'W1 RESPONSE appears in the cure prompt');}
// ---- W2: the log rows carry the full text ----
{const L=fullLib(D+'new/Panel Cure Check.js');const long='RESPONSE: K-C D5 | '+'x'.repeat(1500)+'\n'+restD5;const v=L.cureVerdicts([kc],reply(long),null,R);
 const rows=L.enfRows({run_token:'T',seat:'deepseek',role:'panel',model:'m'},v,reply(long),{messages:[{role:'system',content:'s'},{role:'user',content:'transcript'},{role:'assistant',content:'a'},{role:'user',content:'THE CURE ASK'}]});
 ok(rows.length===1&&rows[0].full_reply===long&&rows[0].full_reply.length>600&&rows[0].prompt_sent==='THE CURE ASK'&&rows[0].response_line.length>1000&&rows[0].cure_status==='CURED','W2 enfRows keeps the full reply ('+rows[0].full_reply.length+' chars), the cure ask, the full RESPONSE and the result');}
// ---- W2 save path: Panel Cure Check and Alternate Merge main bodies with stubs ----
const stub=map=>nm=>{if(!(nm in map))return {isExecuted:false,first:()=>{throw new Error('no '+nm);},all:()=>[]};const v=map[nm];return {isExecuted:true,first:()=>({json:Array.isArray(v)?v[0]:v}),all:()=>(Array.isArray(v)?v:[v]).map(j=>({json:j}))};};
const body=(seat,model,unc)=>JSON.stringify({payload:{judge_seat:seat,judge_api_model:model,drv_uncured:unc,verdict_raw:'{"x":1}',verdict_tag:'HELD'}});
{const s=fs.readFileSync(D+'new/Panel Cure Check.js','utf8');const longReply='RESPONSE: K-C D5 | '+'y'.repeat(900)+'\n'+restD5;
 const PPv={bodies:[body('deepseek','ds',1),body('gemini','g',0),body('chatgpt','c',0)],summary:[{seat:'deepseek',api_model:'ds',drv:[kc]},{seat:'gemini',drv:[]},{seat:'chatgpt',drv:[]}],debate_id:'00000000-0000-0000-0000-000000000000'};
 const out=new Function('$','$input',s)(stub({'Panel Payloads':PPv,'Panel Cure Normalize 1':{cure:{idx:0,model:'ds',body:{messages:[{role:'user',content:'ASK'}]},rounds:R},reply:reply(longReply)},'Init Seats':{run_token:'ODV1-T'}}),null)[0].json;
 ok(out.enforcer_log.length===1&&out.enforcer_log[0].full_reply===longReply&&out.enforcer_log[0].seat==='deepseek','W2 Panel Cure Check output carries enforcer_log with the full reply ('+(out.enforcer_log[0]||{}).full_reply.length+' chars)');
 // Alternate Merge: FIX 5 and the save body.
 const m=fs.readFileSync(D+'new/Alternate Merge.js','utf8');const alt=(i,seat)=>({alt:{idx:i,seat:'qwen',removed_seat:seat,api_model:'qwen/q',qualify:false},ok:true,body:body('qwen','qwen/q',0),drv:[],summary:{seat:'qwen'}});
 const PC={...out,bodies:[body('deepseek','ds',1),body('gemini','g',1),body('chatgpt','c',1)],summary:[{seat:'deepseek'},{seat:'gemini'},{seat:'chatgpt'}]};
 const AP=[{alt:{idx:0,seat:'qwen',removed_seat:'deepseek',api_model:'qwen/q'},ok:false,why:'3 uncured item(s)'},alt(1,'gemini'),alt(2,'chatgpt')];
 const o=new Function('$','$input',m)(stub({'Panel Cure Check':PC,'Init Seats':{run_token:'ODV1-T'},'Alternate Payloads':AP,'Alternate Build':{skips:[]},'Panel Check':{sub:null,failed_raw:{seat:'glm',model:'z-ai/glm',kind:'no_usable_judgment',detail:'returned no JSON object',text:'{"verdict_tag":"HELD"'+' '.repeat(400)+'tail',at:'t'}}}),null)[0].json;
 ok(o.alternates_seated.length===1&&o.alternates_seated[0].removed_seat==='gemini'&&o.alternates_tried.some(t=>t.removed_seat==='chatgpt'&&/^G3: qwen\/q already sits as the other alternate \(seated for gemini\)/.test(t.why)),'FIX 5 Alternate Merge: qwen not seated for deepseek is seated for gemini; the chatgpt call is refused G3 at merge');
 const eb=o.enforcer_log_body;ok(eb&&eb.p_run_token==='ODV1-T'&&eb.p_rows.some(r=>r.kind==='failed_reply'&&r.full_reply.length>400)&&eb.p_rows.some(r=>r.kind==='alternate_reply')&&eb.p_rows.some(r=>r.kind==='cure'&&r.full_reply===longReply),'W2 Alternate Merge enforcer_log_body: cure rows in full, each alternate\'s first reply, and the failed seat\'s full first reply ('+eb.p_rows.length+' rows)');}
// ---- FIX 5 Alternate Build: one pool model offered to every removed seat ----
{const run=v=>{const s=fs.readFileSync(D+v+'/Alternate Build.js','utf8');const PPv={bodies:[body('deepseek','ds',2),body('gemini','g',1),body('chatgpt','c',4)],summary:[{},{},{}]};
  const P={judges:[0,1,2].map(i=>({body:{messages:[{role:'system',content:'S'},{role:'user',content:'U'+i}]}}))};
  return new Function('$','$input',s)(stub({'Panel Build':P,'Init Seats':{run_token:'T',dry:false},'Resolve Seats':{alternates:[{seat:'qwen',fam:'openrouter',api_model:'qwen/q',max_tokens:8000,family:'qwen'}],debaters:[{model:'claude',family:'anthropic'},{model:'mimo',family:'xiaomi'}]}}),{first:()=>({json:PPv})});};
 const b0=run('base'),b1=run('new');ok(b0.length===1&&b0[0].json.skips.length===2&&b1.length===3&&b1.every(x=>x.json.alt.api_model==='qwen/q'),'FIX 5 Alternate Build: base 1 call and 2 G3 skips (run 32212); new 3 calls, one per removed seat');}
// ---- FIX 6 citation ----
{const C=require('./cite_lib.cjs');const b=C.run('base',RL.run('32212')).report.items,w=C.run('new',RL.run('32212')).report.items;
 ok(b.some(i=>i.ref==='Isaiah 8:18'&&i.status==='CITED VERSE DOES NOT EXIST')&&w.some(i=>i.ref==='Isaiah 8:18'&&i.status==='MATCHES'),'FIX 6a 32212 Isaiah 8:18: base DOES NOT EXIST, new MATCHES');
 ok(b.some(i=>i.ref==='Genesis 1:24')&&!w.some(i=>i.ref==='Genesis 1:24'),'FIX 6b 32212 "(1:24)" no longer read as Genesis 1:24 (left unchecked)');
 const b5=C.run('base',RL.run('32205')).report.items,w5=C.run('new',RL.run('32205')).report.items;
 ok(b5.filter(i=>i.status==='CITED VERSE DOES NOT EXIST').length===16&&w5.filter(i=>i.status==='CITED VERSE DOES NOT EXIST').length===0&&!w5.some(i=>/^Ezra 18/.test(i.ref)),'FIX 6 32205: DOES NOT EXIST 16 -> 0; "Ezra 18:7-8" gone');}
// ---- FIX 7 (SQL draft, not applied) ----
{const s=fs.readFileSync(D+'sql/item7_panel_ungraded.sql','utf8');ok(/v_clean = 0/.test(s)&&/'UNGRADED'/.test(s)&&/WHEN 'UNGRADED'\s+THEN E'UNGRADED — REVIEW'/.test(s),'FIX 7 draft: aggregate_debate_panel writes UNGRADED when no seat is counted; d5_outcome_for maps UNGRADED to "UNGRADED — REVIEW"');}
// ---- E6 synthesis ----
{const S=require('./synth.cjs');const SY=JSON.parse(fs.readFileSync(D+'data/synthesis.json','utf8'));const r=RL.run('32157');const x=SY.find(y=>y.run_token.includes('32157'));
 const out=S.run({synthesis:x.synthesis,cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3});
 ok(out.some(l=>/S-A.*No union before the birth/.test(l))&&out.some(l=>/S-B/.test(l))&&out.some(l=>/S-D/.test(l)),'E6 32157: false "both agree" (S-A), "every link answered" (S-B) and "binds both seats" (S-D) marked');
 const r2=RL.run('32212'),x2=SY.find(y=>y.run_token.includes('32212'));const o2=S.run({synthesis:x2.synthesis,cr1:r2.claude_r1,gr1:r2.engine_r1,cr2:r2.claude_r2,gr2:r2.engine_r2,cr3:r2.engine_r3,dr3:r2.challenger_r3});
 ok(o2.some(l=>/S-C.*enomizeto/.test(l)),'E6 32212: "enomizeto carries no verdict of its own" listed as uncharged (S-C) marked');}
console.log('\nfixtures',n,'| bad',bad);process.exitCode=bad?1:0;
