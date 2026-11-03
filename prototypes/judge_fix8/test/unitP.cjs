// judge_fix8 part P unit fixtures: the test instruments of the judge posture protocol (JUDGE_POSTURE_DRAFT_v4 Part 7) on the stored run 32306.
// P2 posture, P3 acceptance probe, P4 the negative control (P1, swap mode, was dropped by the operator and is not built); and every node a normal run passes through sends what it sent before.
// Run: node test/unitP.cjs
const fs=require('fs');const RN=require('./runner.cjs');const RL=require('./replay_lib.cjs');const R8=require('./replay8.cjs');
const D=__dirname+'/../';const src=(v,n)=>fs.readFileSync(D+v+'/'+n+'.js','utf8');
let bad=0,n=0;const ok=(c,what,extra)=>{n++;if(!c)bad++;console.log((c?'ok  ':'BAD ')+what+(extra!==undefined?' -- '+extra:''));};
const POSTURE=new Function(fs.readFileSync(D+'lib/posture.js','utf8')+';return POSTURE;')();
// 'base' in this file is the reference without part P: fix set 8 as it stood (ref_noP/, written by patch.py) or, for a node fix set 8 left
// unchanged, the live cfcbb37b code (base/)
const RV=(v,nm)=>v==='base'&&fs.existsSync(D+'ref_noP/'+nm+'.js')?'ref_noP':v;
const r06=R8.run('32306');const F06=R8.F_(r06);const TOK='ODV1-32306-ccyhzcuy';
const MC={gemini:['google/gemini-3.8-flash',64000],glm:['z-ai/glm-5.3',131072],chatgpt:['openai/gpt-6.1-terra',64000],mimo:['xiaomi/mimo-v2.6-pro',64000],sol:['openai/gpt-6.1-sol',64000]};
const seatJ=k=>({seat:k,fam:'openrouter',api_model:MC[k][0],max_tokens:MC[k][1]});
const IS=x=>Object.assign({run_token:TOK,variant:'ORACLE_DEBATE_V1',topic:'Did Christ have a biological father?',defender:{engine:'claude',profile:'plain'},challenger:{engine:'opus',profile:'oracle'},panel_order:['gemini','glm','chatgpt'],panel_expected:['chatgpt','gemini','glm'],panel_reserve:'mimo',alt_order:['sol'],single_judge:'deepseek',regrade:true,dry:true,rulebook:'current',test_fail_seat:null,test_fail_reserve:false,test_no_fallback:false,qualify_alternate:null},x||{});
const RS={run_token:TOK,judges:['gemini','glm','chatgpt'].map(seatJ),reserve:seatJ('mimo'),alternates:[{...seatJ('sol'),family:'openai'}],debaters:[{model:'anthropic/claude-sonnet-5.5',family:'anthropic'},{model:'anthropic/claude-opus-5.5',family:'anthropic'}],gt:'',tt:''};
const RGL={run_token:TOK,debate_id:r06.id,f:F06,synthesis:'(stored)',ig:{posline:'',d_served:[],c_served:[],d_named:[],c_named:[]}};
const ROW={...r06,variant:'ORACLE_DEBATE_V1'};
const pbMap=(x,extra)=>Object.assign({'Init Seats':IS(x),'Resolve Seats':RS,'Regrade Load':RGL,'Quote Report':{unavailable:true},'Regrade Row':ROW},extra||{});
const PB=(v,x,extra)=>RN.runNode(RV(v,'Panel Build'),'Panel Build',pbMap(x,extra))[0].json;
const SEATS=['gemini','glm','chatgpt'];
const firstOf=seat=>R8.firstRaw(r06.judgments.find(j=>j.seat===seat).verdict_raw,true);
const chat=t=>({choices:[{message:{content:t},finish_reason:'stop'}],model:'x'});
const ppMap=(x,P,replies,extra)=>Object.assign({'Init Seats':IS(x),'Panel Build':P,'Panel Check':{run_token:TOK,sub:null},'Regrade Load':RGL,'Regrade Row':ROW,
 'Panel Judge 1 openrouter':chat(replies[0]),'Panel Judge 2 openrouter':chat(replies[1]),'Panel Judge 3 openrouter':chat(replies[2])},extra||{});
const PPy=(v,x,P,replies,extra)=>RN.runNode(RV(v,'Panel Payloads'),'Panel Payloads',ppMap(x,P,replies,extra))[0].json;
const pay=(PP,i)=>JSON.parse(PP.bodies[i]).payload;
const PPq_body=()=>JSON.stringify({payload:{judge_seat:'sol',verdict_raw:firstOf('chatgpt')}});
const userOf=b=>b.messages[b.messages.length-1].content;const sysOf=b=>{const c=b.messages[0].content;return typeof c==='string'?c:c[0].text;};

console.log('== a normal run is unchanged (no flag): every body the changed nodes build is the live one, byte for byte');
const P0b=PB('base'),P0n=PB('new');
ok(JSON.stringify(P0b)===JSON.stringify(P0n),'Panel Build (32306 regrade, no flag): the output is byte-identical to the live node',JSON.stringify(P0n).length+' chars');
const RAW=SEATS.map(firstOf);
const PPb=PPy('base',{},P0b,RAW),PPn=PPy('new',{},P0n,RAW);
ok(JSON.stringify(PPb)===JSON.stringify(PPn),'Panel Payloads (the three stored first replies, no flag): byte-identical to the live node');
{const isB=RN.runNode('base','Init Seats',{},{body:{topic:'T',defender:{engine:'claude',profile:'plain'},challenger:{engine:'opus',profile:'oracle'}}})[0].json,isN=RN.runNode('new','Init Seats',{},{body:{topic:'T',defender:{engine:'claude',profile:'plain'},challenger:{engine:'opus',profile:'oracle'}}})[0].json;
 const strip=o=>JSON.stringify({...o,run_token:0,t0:0});ok(strip(isB)===strip(isN)&&!('posture' in isN)&&!('accept_probe' in isN),'Init Seats (a live launch): the same output; no flag key appears');}
{const sub={run_token:TOK,sub:{slot:1,failed_seat:'glm',substitute:'mimo'}};const m=v=>({'Init Seats':IS(),'Panel Build':v==='base'?P0b:P0n,'Resolve Seats':RS,'Panel Check':sub});
 ok(JSON.stringify(RN.runNode('base','Reserve Build',m('base')))===JSON.stringify(RN.runNode('new','Reserve Build',m('new'))),'Reserve Build (no flag): byte-identical to the live node');}
const cureMap=(v,P,PP)=>({'Panel Build':P,'Panel Payloads':PP});
for(const k of [1,2,3]){const a=RN.runNode(RV('base','Panel Cure Build '+k),'Panel Cure Build '+k,cureMap('base',P0b,PPb)),b=RN.runNode('new','Panel Cure Build '+k,cureMap('new',P0n,PPn));ok(JSON.stringify(a)===JSON.stringify(b),'Panel Cure Build '+k+' (no flag): the cure body is byte-identical',(a[0].json.cure.items||[]).length+' items');}

{const R0=RN.runNode('base','Replay Rows',{'Init Seats':IS(),'Alternate Merge':{bodies:PPn.bodies}})[0].json,R1=RN.runNode('new','Replay Rows',{'Init Seats':IS(),'Alternate Merge':{bodies:PPn.bodies}})[0].json;
 ok(JSON.stringify(JSON.parse(R0.body).p_rows.map(x=>({...x,exec_id:0})))===JSON.stringify(JSON.parse(R1.body).p_rows.map(x=>({...x,exec_id:0}))),'Replay Rows (a plain dry regrade): byte-identical rows');}
console.log('== P2, P3: the request flags (Init Seats)');
{const base={topic:'T',defender:{engine:'claude',profile:'plain'},challenger:{engine:'opus',profile:'oracle'}};const run=b=>{try{return RN.runNode('new','Init Seats',{},{body:{...base,...b}})[0].json;}catch(e){return e.message;}};
 const dry={regrade_run_token:TOK,regrade_dry:true};
 ok(/run only in a dry regrade/.test(run({posture:true}))&&/run only in a dry regrade/.test(run({regrade_run_token:TOK,accept_probe:true})),'posture or accept_probe outside a dry regrade: refused');
 ok(/separate tests/.test(run({...dry,accept_probe:true,posture:true})),'two flags at once: refused (one change per run)');
 ok(/current rulebook only/.test(run({...dry,accept_probe:true,rulebook:'draft'})),'a flag with the draft rulebook: refused');
 ok(/not combined/.test(run({...dry,posture:true,test_fail_seat:'gemini'})),'a flag with a test input: refused');
 ok(/must be true or false/.test(run({...dry,posture:'yes'})),'a flag that is not a boolean: refused');
 const a=run({...dry,swap:true}),b=run({...dry,posture:true}),c=run({...dry,accept_probe:true});
 ok(b.posture===true&&c.accept_probe===true&&!('accept_probe' in b)&&!('posture' in c),'each flag passes alone in a dry regrade and is carried on');
 ok(!('swap' in a)&&!/swap/i.test(src('new','Init Seats')),'there is no swap flag: a body carrying swap is read as a plain dry regrade (P1 dropped)');}

console.log('== P2 posture: the acceptance turn, the head of the conversation, the answer form');
{const md=fs.readFileSync(D+'../judge_posture/JUDGE_POSTURE_DRAFT_v4.md','utf8');const p2=md.slice(md.indexOf('You are an adjudicator of a debate record.'),md.indexOf('## Part 3.')).replace(/\n+$/,'');
 ok(POSTURE.PART2===p2,'the text the judge accepts is v4 Part 2 word for word',p2.length+' chars');
 ok(POSTURE.HEADS.length===6&&POSTURE.PROMPT.startsWith('POSTURE FOR ACCEPTANCE\n\n'+p2)&&POSTURE.PROMPT.endsWith(POSTURE.LINE),'the acceptance prompt: Part 2, then the reply form (six headings verbatim, own words, the acceptance line)');
 const ans=md.slice(md.indexOf('SILENCE: <'),md.indexOf('\n```',md.indexOf('SILENCE: <')));ok(POSTURE.ANSWER.includes(ans),'the answer form carries v4 Part 3\'s SILENCE and SAME TEST lines word for word');}
const AB=RN.runNode('add','Accept Build',{'Init Seats':IS({posture:true}),'Resolve Seats':RS}).map(x=>x.json.acc);
ok(AB.map(a=>a.seat+'/'+a.role).join(',')==='gemini/panel,glm/panel,chatgpt/panel,mimo/reserve,sol/alternate','Accept Build: one call per panel seat, the reserve and the alternate',AB.map(a=>a.seat).join(' '));
ok(AB.every(a=>a.body.messages.length===1&&a.body.messages[0].role==='user'&&a.body.messages[0].content===POSTURE.PROMPT),'each call carries Part 2 and the reply form only: no system rulebook, no debate');
ok(AB.every(a=>!JSON.stringify(a.body).match(/reasoning|effort|thinking/i)),'no reasoning, effort or thinking field in any acceptance body');
ok(AB[0].body.temperature===0&&AB[3].body.max_tokens===65536&&AB[1].body.max_tokens===131072,'the panel\'s own per-model body shape (google temperature 0, xiaomi 65,536, glm its row\'s 131,072)');
{let e=null;try{RN.runNode('add','Accept Build',{'Init Seats':IS(),'Resolve Seats':RS});}catch(x){e=x.message;}ok(/FAIL-CLOSED/.test(e||''),'Accept Build fails closed on a run without posture or accept_probe');}
const good=POSTURE.HEADS.map((h,i)=>'**'+h+'** '+['Only the rounds and what the system serves about them count.','I fill no gap in either side\'s chain.','A pressed witness is read by its own words; chain against chain is weighed by footing, and "no verse states it" is no ground there.','I hold both links of a collision line to the same test.','An unanswered pressed witness makes its premise UNEXHIBITED.','I rule VOID only by quoting the words that go beyond the quote.'][i]).join('\n')+'\n\n'+POSTURE.LINE;
const altered=good.replace('Commitment 3. Each test in its place.','Commitment 3. Each test in the right place.');
const refused='I cannot agree to adopt a posture on a religious question; I can summarize the debate instead.';
const hedged=good+'\n\nHowever, I reserve the right to note where the record is thin.';
const ACR=[chat(good),chat(altered),chat(refused),chat(hedged),{error:{message:'timeout'}}];
// runner gives $input the stub input; Accept Check reads $input.all(): run it with a custom input
const runAll=(node,map,items)=>{const s=src('add',node);const ex={id:'test',customData:{set:()=>{}}};const inp={first:()=>({json:items[0]}),all:()=>items.map(j=>({json:j}))};return new Function('$','$input','$execution',s)(RN.stub(map),inp,ex);};
const ACK=runAll('Accept Check',{'Init Seats':IS({posture:true}),'Accept Build':AB.map(a=>({acc:a}))},ACR)[0].json.acc;
ok(ACK.seats.map(s=>s.first.status).join(',')==='ACCEPT,FAULT,REFUSE,HEDGE,ERROR','Accept Check: accept, an altered heading (fault), a policy refusal, a hedge, a failed call',ACK.seats.map(s=>s.seat+':'+s.first.status).join(' '));
ok(JSON.stringify(ACK.ret)==='[1]'&&/heading 3 altered/.test(ACK.seats[1].first.faults.join(';')),'only the fault is returned (a refusal is recorded, not returned)',ACK.seats[1].first.faults.join('; '));
ok(ACK.seats[0].first.lines[3].startsWith('A pressed witness is read by its own words'),'the own-words lines are kept (commitment 3: "'+ACK.seats[0].first.lines[3].slice(0,50)+'...")');
const ARB=RN.runNode('add','Accept Return Build',{'Accept Check':{acc:ACK},'Accept Build':AB.map(a=>({acc:a}))}).map(x=>x.json.acc);
ok(ARB.length===1&&ARB[0].seat==='glm'&&ARB[0].body.messages.length===3&&ARB[0].body.messages[1].content===altered&&/^POSTURE RETURNED \(once\)[\s\S]*Fault: heading 3 altered/.test(ARB[0].body.messages[2].content),'Accept Return Build: GLM\'s own exchange, then the fault named, once');
const AF=RN.runNode('add','Accept Final',{'Init Seats':IS({posture:true}),'Accept Check':{acc:ACK},'Accept Return Build':ARB.map(a=>({acc:a})),'Accept Return Call openrouter':[chat(good)]})[0].json.acc;
ok(AF.seats.map(s=>s.status).join(',')==='ACCEPT,ACCEPT_ON_RETURN,REFUSE,HEDGE,ERROR'&&AF.seats.map(s=>s.placed).join(',')==='true,true,false,true,false','Accept Final: GLM accepts on its return; ChatGPT\'s refusal and Sol\'s failed call are recorded and not placed',AF.seats.map(s=>s.seat+':'+s.status).join(' '));
{const AF2=RN.runNode('add','Accept Final',{'Init Seats':IS({posture:true}),'Accept Check':{acc:ACK},'Accept Return Build':ARB.map(a=>({acc:a})),'Accept Return Call openrouter':[chat(altered)]})[0].json.acc;ok(AF2.seats[1].status==='FAULT_RECORDED'&&!AF2.seats[1].placed,'a second fault is recorded (FAULT_RECORDED) and the seat still sits without the head');}
const PP2=PB('new',{posture:true},{'Accept Final':{acc:AF}});
{const [g,l,c]=PP2.judges.map(j=>j.body.messages);const T0=userOf(P0n.judges[0].body);
 ok(g.length===4&&g[1].content===POSTURE.PROMPT&&g[2].role==='assistant'&&g[2].content===good&&g[3].content===T0,'Gemini (accepted): system, the acceptance turn and its reply, then the transcript unchanged');
 ok(l.length===6&&l[2].content===altered&&/^POSTURE RETURNED/.test(l[3].content)&&l[4].content===good&&l[5].content===T0,'GLM (accepted on return): the whole exchange, the return included, heads its conversation');
 ok(c.length===2&&c[1].content===T0,'ChatGPT (refused): the seat sits; no head is placed');
 const S2=sysOf(PP2.judges[0].body),S0=sysOf(P0n.judges[0].body);ok(S2===S0+'\n\n'+POSTURE.ANSWER,'the rulebook is the live one with the posture answer form (SILENCE, SAME TEST) added at its end, in posture mode only');
 ok(PP2.judges.map(j=>j.posture.status).join(',')==='ACCEPT,ACCEPT_ON_RETURN,REFUSE'&&PP2.judges[0].posture.lines[3]===good.split('\n')[2].replace(/^\*\*Commitment 3\. Each test in its place\.\*\* /,''),'each judge carries its status and accepted lines for the cure');
 let e=null;try{PB('new',{posture:true});}catch(x){e=x.message;}ok(/FAIL-CLOSED: posture regrade without the acceptance turn/.test(e||''),'Panel Build fails closed on a posture run without Accept Final');}
// the head does not disturb the checks; the posture checks are marks
const PPp=PPy('new',{posture:true},PP2,RAW);
SEATS.forEach((seat,i)=>{const it=s=>JSON.stringify((s.drv||[]).map(x=>[x.rule,x.side,x.link]));
 ok(it(PPp.summary[i])===it(PPn.summary[i])&&pay(PPp,i).drv_uncured===pay(PPn,i).drv_uncured,seat+': with the acceptance exchange at the head the checks find the same items as without it',(PPp.summary[i].drv||[]).length+' items');
 const pm=pay(PPp,i).verdict_raw.split('\n').filter(x=>/POSTURE CHECK/.test(x));ok(pm.length===2&&/no SILENCE line/.test(pm[0])&&/no SAME TEST line/.test(pm[1]),seat+': the stored reply (written without the form) is marked for the two absent lines, as TRIAL marks');});
ok(!PPn.bodies.some(b=>/POSTURE CHECK/.test(b)),'no posture mark on a run without the flag');
{const PCK=(()=>{const s=src('new','Panel Payloads');const a=s.indexOf('const REFP=(()=>');const b=s.indexOf('const bodies=[];const summary=[];');return new Function('$','$input',s.slice(0,b)+';return {postureCheck,drvPromptText};')(()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[]}),null);})();
 const PT=PCK.drvPromptText(PP2.judges[0].body);const pm=t=>PCK.postureCheck(t,PT).marks;
 ok(!/POSTURE FOR ACCEPTANCE/.test(PT)&&PT.includes('DEBATE TRANSCRIPT'),'the checkers\' prompt text skips the acceptance exchange');
 const base='D1 vs C1: STANDS. GROUND: [L1] Luke 1:34 read with [L2] ginosko.\nD3 vs C2: CHALLENGER LINK BROKEN. GROUND: no witness\'s own words state that Joseph begat the child.\n';
 ok(pm(base+'SILENCE: none\nSAME TEST: test footing on D1; on C1: footing exhibited both sides').some(x=>/D3 vs C2 rests on a witness's-own-words test/.test(x)),'SAME TEST: an own-words ground on D3 vs C2 with no entry is marked');
 ok(pm(base+'SILENCE: none\nSAME TEST: test own words on D3; on C2: not applied').some(x=>/applies a test to one link of a collision line and not to the other/.test(x)),'SAME TEST: a test written for D3 and "not applied" to C2 is marked');
 ok(pm(base+'SILENCE: none\nSAME TEST: test footing on D1; on C1: both footed\ntest own words on D3; on C2: neither states it').length===0,'SAME TEST: both collision lines covered, both links tested: no mark');
 ok(pm(base+'SILENCE: John 6:42, premise 3, rounds [CR2], [CR3], [CR4]\nSAME TEST: test footing on D1; on C1: x\ntest own words on D3; on C2: y').some(x=>/SILENCE counts John 6:42 unanswered, but no listed premise carries it under PRESSED WITH within the cap/.test(x)),'SILENCE: a verse no premise carries as a witness (John 6:42, ninth and later under premise 3, over the cap of ruling 393) is marked');
 ok(pm(base+'SILENCE: Acts 2:30, premise 1, rounds [CR3], [CR4]\nSAME TEST: test footing on D1; on C1: x\ntest own words on D3; on C2: y').length===0,'SILENCE: a pressed witness of the list (Acts 2:30 under premise 1\'s PRESSED WITH) is not marked');
 const PT2=PT.replace('premise 6 (LINK 5): 7 verse(s) carried under PRESSED WITH; 7 named; NOT NAMED: none','premise 6 (LINK 5): 7 verse(s) carried under PRESSED WITH; 6 named; NOT NAMED: Haggai 2:23');
 ok(PCK.postureCheck(base+'SILENCE: none\nSAME TEST: test footing on D1; on C1: x\ntest own words on D3; on C2: y',PT2).marks.some(x=>/the ledger marks Haggai 2:23 NOT NAMED/.test(x)),'SILENCE: a verse the ledger marks NOT NAMED and the SILENCE line omits is marked (a planted ledger line)');}
{const sub={run_token:TOK,sub:{slot:1,failed_seat:'glm',substitute:'mimo'}};const R=RN.runNode('new','Reserve Build',{'Init Seats':IS({posture:true}),'Panel Build':PP2,'Resolve Seats':RS,'Panel Check':sub,'Accept Final':{acc:AF}})[0].json;
 const m=R.body.messages;ok(m.length===4&&m[1].content===POSTURE.PROMPT&&m[2].content===hedged&&m[3].content===userOf(P0n.judges[0].body)&&R.posture.status==='HEDGE','Reserve Build (posture): the reserve\'s own acceptance (MiMo, a hedge) heads its call; the transcript is the slot\'s last user turn, not the slot\'s acceptance');}

{const am=(P,x,extra)=>Object.assign({'Panel Build':P,'Init Seats':IS(x),'Resolve Seats':RS},extra||{});
 const a=RN.runNode(RV('base','Alternate Build'),'Alternate Build',am(P0b),PPb),b=RN.runNode('new','Alternate Build',am(P0n),PPn);
 ok(JSON.stringify(a)===JSON.stringify(b)&&b.length>=1&&!!b[0].json.alt.body,'Alternate Build (no flag): the alternate\'s call is byte-identical',b.map(x=>x.json.alt.seat+(x.json.alt.skip?' skip':'')).join(', '));
 const c=RN.runNode('new','Alternate Build',am(PP2,{posture:true},{'Accept Final':{acc:AF}}),PPp).map(x=>x.json.alt).filter(x=>!x.skip);
 const m=c[0].body.messages;ok(c.length>=1&&c[0].seat==='sol'&&m.length===2&&m[1].content===userOf(P0n.judges[0].body)&&c[0].posture.status==='ERROR','Alternate Build (posture): Sol\'s acceptance call failed, so it sits with no head; its transcript is the removed seat\'s last user turn, not that seat\'s acceptance');
 const AF3=JSON.parse(JSON.stringify(AF));AF3.seats[4]={...AF3.seats[0],seat:'sol',role:'alternate'};
 const d=RN.runNode('new','Alternate Build',am(PP2,{posture:true},{'Accept Final':{acc:AF3}}),PPp).map(x=>x.json.alt).filter(x=>!x.skip);
 ok(d[0].body.messages.length===4&&d[0].body.messages[2].content===good&&d[0].posture.status==='ACCEPT','Alternate Build (posture): an alternate that accepted carries its own exchange at the head of its call');
 // the alternate's cure gets the quote-back from its own acceptance
 const ap=[{json:{alt:d[0],ok:true,body:PPq_body(),drv:[{rule:'K-S2',side:'BOTH',link:'D2 vs C1',line:'D2 vs C1: UNDERDETERMINED. GROUND: no witness\'s own words state it.'}]}}];
 const cb=RN.runNode('new','Alternate Cure Build',{'Alternate Payloads':ap.map(x=>x.json)})[0].json.cure;const ask=cb.body.messages[cb.body.messages.length-1].content;
 ok(ask.includes('You accepted: "'+ACK.seats[0].first.lines[3]+'". Your line: "D2 vs C1: UNDERDETERMINED.'),'Alternate Cure Build (posture): the alternate\'s own commitment 3 line is quoted back');
 const ap0=[{alt:{...d[0],posture:undefined},ok:true,body:PPq_body(),drv:ap[0].json.drv}];const x0=RN.runNode(RV('base','Alternate Cure Build'),'Alternate Cure Build',{'Alternate Payloads':ap0}),x1=RN.runNode('new','Alternate Cure Build',{'Alternate Payloads':ap0});
 ok(JSON.stringify(x0)===JSON.stringify(x1),'Alternate Cure Build (no posture): byte-identical to the node without part P');}
{const rr=RN.runNode('new','Replay Rows',{'Init Seats':IS({posture:true}),'Alternate Merge':{bodies:PPp.bodies},'Accept Final':{acc:AF}})[0].json;const rows=JSON.parse(rr.body).p_rows;
 const rec=t=>JSON.parse(t.split('=== REPLAY RECORD (judge_fix8 P; written by the system, not the judge) ===\n')[1].split('\n=== END REPLAY RECORD ===')[0]);
 ok(rows.length===3&&rows.map(x=>rec(x.verdict_raw).acceptance.status).join(',')==='ACCEPT,ACCEPT_ON_RETURN,REFUSE'&&rows.every(x=>rec(x.verdict_raw).mode==='posture'&&x.rulebook==='current'&&['HELD','PARTIAL','BROKEN'].includes(x.verdict_tag)),'Replay Rows (posture): each row carries its seat\'s acceptance record (status, faults, own words, replies) after the judge\'s text; rulebook and verdict_tag stay in the table\'s closed sets');
 ok(rows.every(x=>JSON.parse(rr.body).p_rows.length===3&&x.result_line===(x.verdict_raw.match(/RESULT:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||x.result_line===null),'the result line is read from the judge\'s text as before');}
console.log('== P3 acceptance probe: the acceptance turn alone, recorded; no debate judged');
{const AP=RN.runNode('add','Accept Final',{'Init Seats':IS({accept_probe:true}),'Accept Check':{acc:ACK},'Accept Return Build':ARB.map(a=>({acc:a})),'Accept Return Call openrouter':[chat(good)]})[0].json.acc;
 ok(AP.probe===true,'Accept Final marks the probe, so Accept Probe? ends the run at Replay Rows');
 const rr=RN.runNode('new','Replay Rows',{'Init Seats':IS({accept_probe:true}),'Accept Final':{acc:AP},'Regrade Load':RGL})[0].json;const rows=JSON.parse(rr.body).p_rows;
 const rec=t=>JSON.parse(t.split('=== REPLAY RECORD (judge_fix8 P; written by the system, not the judge) ===\n')[1].split('\n=== END REPLAY RECORD ===')[0]);
 ok(rows.length===3&&new Set(rows.map(x=>x.judge_seat)).size===3&&rows.every(x=>x.verdict_tag===null&&x.defense_standing===null&&x.rulebook==='current'&&x.debate_id===r06.id&&x.run_token===TOK),'three rows (the RPC takes exactly three distinct seats): the panel; no verdict, no standing; rulebook current (the table\'s CHECK constraints hold)');
 ok(rows.map(x=>rec(x.verdict_raw).acceptance.status).join(',')==='ACCEPT,ACCEPT_ON_RETURN,REFUSE'&&rec(rows[0].verdict_raw).reserve_and_alternates.map(x=>x.seat+':'+x.status).join(',')==='mimo:HEDGE,sol:ERROR','each row records its seat (status, faults, own words, replies); the reserve and the alternate ride in every row\'s record');
 ok(/^ACCEPTANCE PROBE \(judge_fix8 P3\)[^\n]*STATUS: ACCEPT_ON_RETURN/.test(rows[1].verdict_raw)&&rows[1].verdict_raw.includes('--- returned once ---'),'the row\'s text is the acceptance exchange, the return included');}

console.log('== P4 negative control: a planted "states in its own words" ground on a chain-against-chain collision; the quote-back fires in posture mode');
{const cg=firstOf('chatgpt');const line='D2 vs C1: UNDERDETERMINED. GROUND: the witnesses pressed against D2 are the challenger\'s own chain read together (Matthew 1:18 with Matthew 1:25 and Genesis 4:1), and no witness\'s own words state union before the taking.';
 const o=JSON.parse(cg.slice(cg.indexOf('{'),cg.lastIndexOf('}')+1));const re=/(^|\n)[^\n]*D2 vs C1[^\n]*/;o.reasoning=re.test(o.reasoning)?o.reasoning.replace(re,'$1'+line):o.reasoning+'\n'+line;const planted=JSON.stringify(o);
 const rep=[RAW[0],RAW[1],planted];const PPq=PPy('new',{posture:true},PP2,rep);const its=PPq.summary[2].drv.filter(x=>/D2 vs C1/i.test(String(x.link))&&['K-C','K-S2'].includes(x.rule));
 ok(its.length>=1,'the planted line is flagged ('+its.map(x=>x.rule).join(', ')+')',PPq.summary[2].drv.map(x=>x.rule+' '+x.link).join('; '));
 // ChatGPT refused at its acceptance turn in AF; for the control it accepts (as it would at the door)
 const PB4=JSON.parse(JSON.stringify(PP2));PB4.judges[2].posture={status:'ACCEPT',placed:true,lines:ACK.seats[0].first.lines};
 const C3=RN.runNode('new','Panel Cure Build 3',{'Panel Build':PB4,'Panel Payloads':PPq})[0].json.cure;const ask=C3.body.messages[C3.body.messages.length-1].content;
 const want='You accepted: "'+ACK.seats[0].first.lines[3]+'". Your line: "'+line;
 ok(ask.includes('THE POSTURE YOU ACCEPTED, QUOTED BACK')&&ask.includes(want),'the cure prompt quotes the judge\'s own commitment 3 line beside the flagged line',ask.slice(ask.indexOf('THE POSTURE YOU ACCEPTED'),ask.indexOf('THE POSTURE YOU ACCEPTED')+260).replace(/\n/g,' | '));
 PB4.judges[2].posture={status:'REFUSE',placed:false,lines:{}};const C3r=RN.runNode('new','Panel Cure Build 3',{'Panel Build':PB4,'Panel Payloads':PPq})[0].json.cure;
 ok(!C3r.body.messages[C3r.body.messages.length-1].content.includes('QUOTED BACK'),'counter-case: a seat that did not accept gets no quote-back (nothing of its own to quote)');
 const PPq0=PPy('new',{},P0n,rep);const a=RN.runNode(RV('base','Panel Cure Build 3'),'Panel Cure Build 3',{'Panel Build':P0b,'Panel Payloads':PPy('base',{},P0b,rep)})[0].json.cure,b=RN.runNode('new','Panel Cure Build 3',{'Panel Build':P0n,'Panel Payloads':PPq0})[0].json.cure;
 ok(JSON.stringify(a)===JSON.stringify(b)&&!b.body.messages[b.body.messages.length-1].content.includes('QUOTED BACK'),'counter-case: without the flag the same planted line gets the live cure prompt, byte for byte, with no quote-back');}

console.log('== the flow change: the added acceptance subflow, planned on the live cfcbb37b read (data/workflow_live.json)');
{const WF=JSON.parse(fs.readFileSync(D+'data/workflow_live.json','utf8'));const SP=JSON.parse(fs.readFileSync(D+'add/nodes_P.json','utf8'));
 const L=new Set();for(const [a,v] of Object.entries(WF.connections))for(const [t,outs] of Object.entries(v))(outs||[]).forEach((o,i)=>(o||[]).forEach(x=>L.add(JSON.stringify([a,t,i,x.node,x.type||'main',x.index||0]))));
 const L0=new Set(L);SP.remove_links.forEach(x=>L.delete(JSON.stringify(x)));SP.add_links.forEach(x=>L.add(JSON.stringify(x)));const E=[...L].map(x=>JSON.parse(x));
 const names=new Set(WF.nodes.map(x=>x.name).concat(SP.nodes.map(x=>x.name)));const out=(a,i)=>E.filter(x=>x[0]===a&&x[2]===i).map(x=>x[3]).sort();
 ok(SP.remove_links.every(x=>L0.has(JSON.stringify(x)))&&SP.add_links.every(x=>!L0.has(JSON.stringify(x))),'one live link is removed (Regrade After Quotes? to Panel Build), thirteen are added; '+SP.nodes.length+' nodes added');
 ok(out('Regrade After Quotes?',0).join()==='Accept Gate?'&&out('Accept Gate?',1).join()==='Panel Build'&&out('Accept Probe?',1).join()==='Panel Build'&&out('Accept Probe?',0).join()==='Replay Rows','a regrade without posture or accept_probe goes Accept Gate? (false) to Panel Build; posture reaches Panel Build after Accept Final; the probe ends at Replay Rows');
 ok(out('Accept Return?',0).join()==='Accept Return Build'&&out('Accept Return?',1).join()==='Accept Final'&&out('Accept Return Call openrouter',0).join()==='Accept Final','the return branch and the no-return branch both reach Accept Final (only one fires)');
 ok(out('Check Save',0).join()==='Panel Build','a live (non-regrade) run reaches Panel Build as before (Check Save), never through the subflow');
 const refs=[];for(const d of ['new','add'])for(const f of fs.readdirSync(D+d).filter(f=>f.endsWith('.js')))for(const m of fs.readFileSync(D+d+'/'+f,'utf8').matchAll(/\$\('([^']+)'\)/g))if(!names.has(m[1]))refs.push(f+': '+m[1]);
 ok(refs.length===0,'every node a changed or added node reads by name exists in the planned flow',refs.join('; ')||'none missing');
 const http=SP.nodes.filter(x=>x.type.endsWith('httpRequest'));const alt=WF.nodes.find(x=>x.name==='Alternate Call openrouter');
 ok(http.length===2&&http.every(h=>JSON.stringify(h.credentials)===JSON.stringify(alt.credentials)&&h.onError===alt.onError&&h.parameters.url===alt.parameters.url&&h.parameters.options.timeout===alt.parameters.options.timeout),'the two added calls use the OpenRouter credential, URL, timeout and error setting of Alternate Call openrouter');}
console.log('== the request bodies (test/requests_P/) and the prompt sizes the cost estimate reads');
{for(const [f,k] of [['a_accept_probe_32306.json','accept_probe'],['c_posture_regrade_32306.json','posture']]){const b=JSON.parse(fs.readFileSync(__dirname+'/requests_P/'+f,'utf8'));
  const o=RN.runNode('new','Init Seats',{},{body:b})[0].json;const txt=JSON.stringify(b);
  ok(o[k]===true&&o.dry===true&&o.regrade===true&&o.run_token===TOK&&o.panel_expected.join(',')===(ROW.panel_expected||['chatgpt','gemini','glm']).join(',')&&!/https?:|secret|key|token\"\s*:\s*\"[A-Za-z0-9]{20}/i.test(txt),f+': Init Seats takes it (dry regrade of 32306, the saved seats and panel, '+k+'); it holds no URL or secret');}
 const sz=P=>P.judges.map(j=>JSON.stringify(j.body.messages.map(m=>typeof m.content==='string'?m.content:m.content.map(x=>x.text).join(''))).length);
 console.log('     panel input characters per judge (gemini, glm, chatgpt): live '+sz(P0n).join(', ')+'; posture '+sz(PP2).join(', ')+'; acceptance prompt '+POSTURE.PROMPT.length+'; stored first replies '+RAW.map(t=>t.length).join(', '));}
ok(!['new','add'].some(d=>fs.readdirSync(D+d).filter(f=>f.endsWith('.js')).some(f=>/swap/i.test(fs.readFileSync(D+d+'/'+f,'utf8'))))&&!fs.existsSync(D+'lib/swap.js')&&!fs.existsSync(__dirname+'/requests_P/b_swap_regrade_32306.json'),'P1 dropped: no node in new/ or add/ carries swap code; lib/swap.js and the swapped request body are gone');
console.log('\n'+n+' fixtures, '+bad+' bad');process.exitCode=bad?1:0;
