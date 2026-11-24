// ASK 588 D7 tests (W4): the follow-up pass. Built from the t588 harness: offline, on the stored 42071 rounds; nothing is fetched or written. node t588.cjs
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const E=JSON.parse(fs.readFileSync('target_engine_588f.json','utf8'));const E8=JSON.parse(fs.readFileSync('target_engine_588.json','utf8'));const code8=n=>E8.nodes.find(x=>x.name===n).parameters.jsCode;const B0=JSON.parse(fs.readFileSync('base_eng.json','utf8'));const CH=JSON.parse(fs.readFileSync('target_child_588.json','utf8'));
const libfn=require('./libfn.cjs');
let pass=0,fail=0;const ok=(c,what,extra)=>{if(c){pass++;console.log('PASS '+what);}else{fail++;console.log('FAIL '+what+(extra?' :: '+extra:''));}};
const code=n=>E.nodes.find(x=>x.name===n).parameters.jsCode;
const R0=JSON.parse(fs.readFileSync('/mnt/project-files/ask586/w4/build/data/rounds_42071.json','utf8'));const RR=Array.isArray(R0)?R0[0]:R0;
const F={cr1:RR.CR1,gr1:RR.DR1,cr2:RR.CR2,gr2:RR.DR2,cr3:RR.CR3,dr3:RR.DR3,cr4:RR.CR4,dr4:RR.DR4,topic:'t'};
// a node runner with $ stubbed by name
const run=async(c,nodes,input)=>{const $=n=>{if(nodes.__throw&&nodes.__throw.includes(n))throw new Error('no node '+n);const it=nodes[n];const ex=it!==undefined;const arr=ex?(Array.isArray(it)?it:[it]):[];return {isExecuted:ex,first:()=>({json:arr[0]||{}}),all:()=>arr.map(json=>({json}))};};
 const $input={all:()=>(input||[]).map(json=>({json})),first:()=>({json:(input||[])[0]||{}})};return await new Function('$','$input','return (async()=>{'+c+'\n})();')($,$input);};
const J=x=>x.map(i=>i.json);
// synthetic judge bodies in Panel Build's layout: transcript after "DEBATE TRANSCRIPT"
const HD={CR1:'[CR1] DEFENDER R1 -- OPENING',DR1:'[DR1] CHALLENGER R1 -- OPENING',CR2:'[CR2] DEFENDER R2',DR2:'[DR2] CHALLENGER R2',CR3:'[CR3] DEFENDER R3 -- LINK ROUND',DR3:'[DR3] CHALLENGER R3 -- LINK ROUND',CR4:'[CR4] DEFENDER R4 -- CLOSE ROUND',DR4:'[DR4] CHALLENGER R4 -- CLOSE ROUND'};
const T=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'].map(k=>'=== '+HD[k]+' ===\n'+RR[k]).join('\n\n');
const body=seat=>({model:'x/'+seat,max_tokens:8000,messages:[{role:'system',content:'SYS PRESSED-WITNESS LEDGER -- none'},{role:'user',content:'POSTURE FOR ACCEPTANCE: read and accept'},{role:'assistant',content:'I accept.'},{role:'user',content:'DEBATE TRANSCRIPT\n\n'+T}]});
const PB={run_token:'ODV1-1-abcdefgh',judges:['gemini','spark','qwen4max'].map(s=>({seat:s,fam:'openrouter',api_model:'x/'+s,body:body(s)}))};
// quotes taken from the rounds
const refRe=/\b(?:Matthew|Luke|Isaiah|John|Acts|Romans|Galatians|Jeremiah)\s\d{1,3}:\d{1,3}/;
const pick=(t,len)=>{const m=t.match(new RegExp('[^.\\n]{0,40}'+refRe.source+'[^.\\n]{0,40}'));return m?m[0].trim():t.slice(200,200+len);};
const qD=pick(RR.CR3,90),qC=pick(RR.DR3,90);const vD=qD.match(refRe)[0],vC=qC.match(refRe)[0];

const word=q=>(q.match(/[A-Za-z]{6,}/)||[])[0];
const closeD=RR.CR4.slice(500,580).trim(),earlyD=RR.CR2.slice(800,880).trim();
const good={defender:{round:'CR3',quote:qD,form:'MEANING',term:word(qD)},challenger:{round:'DR3',quote:qC,form:'FIT',verse:vC}};
const or=t=>({choices:[{message:{content:t},finish_reason:'stop'}]});const an=t=>({content:[{type:'text',text:t}],stop_reason:'end_turn'});
(async()=>{
const RS={defender:{fam:'anthropic',model:'anthropic/claude-opus-5.5',direct_model:'claude-opus-5-5'},challenger:{fam:'openrouter',model:'anthropic/claude-sonnet-5.5'}};
// the first pass, as in t588 T2
const ask=J(await run(code('QR Ask Build'),{'Init Seats':{question_trial:true},'Panel Build':PB}));const mk=o=>or(JSON.stringify(o));
const chk=J(await run(code('QR Check'),{'QR Ask Build':ask,'Final Output':F},[mk(good),mk(good),mk(good)]));
const fin=J(await run(code('QR Final'),{'QR Check':chk,'Final Output':F,'Resolve Seats':RS},[or('OK'),or('OK'),or('OK')]));
const db=J(await run(code('QR Answer D Build'),{'QR Final':fin}));const dd=J(await run(code('QR Answer D Done'),{'QR Answer D Build':db},db.map((x,i)=>an('Defender answer '+i))));
const cb=J(await run(code('QR Answer C Build'),{'QR Final':fin}));const cd=J(await run(code('QR Answer C Done'),{'QR Answer C Build':cb},cb.map((x,i)=>or('Challenger answer '+i))));
const P1={'QR Final':fin,'QR Answer D Done':dd,'QR Answer C Done':cd,'Panel Build':PB,'Final Output':F,'Resolve Seats':RS};
ok(fin.length===6,'T9.0 first pass: six questions');
// T9.1 structure
const C=E.connections;const par=n=>{const r=[];for(const [s,v] of Object.entries(C))(v.main||[]).forEach(b=>b.forEach(x=>{if(x.node===n)r.push(s);}));return r.sort();};
ok(JSON.stringify(par('QR Merge'))==='["QR Follow C Done"]'&&JSON.stringify(par('QR Follow Build'))==='["QR Answer C Done"]','T9.1 the follow-up pass stands between QR Answer C Done and QR Merge');
ok(JSON.stringify(par('QR Follow D Done'))===JSON.stringify(['QR Follow D Route','QR Follow D anthropic','QR Follow D openrouter'].sort())&&JSON.stringify(par('QR Follow C Done'))===JSON.stringify(['QR Follow C Route','QR Follow C anthropic','QR Follow C openrouter'].sort()),'T9.2 each Done node is fed by the anthropic, the openrouter and the skip branch');
{const f=(RG,qt,qf)=>((RG!==null?qt===true:qt!==false)&&qf!==false);ok(code('Init Seats').includes("((RG!==null?b.question_trial===true:b.question_trial!==false)&&b.qr_follow!==false)?{qr_follow:true}:{}")&&f(null,undefined,undefined)&&!f(null,undefined,false)&&!f(null,false,undefined)&&!f('R',undefined,undefined)&&f('R',true,undefined),'T9.3 the switch: on with the round on a fresh run; off by qr_follow:false; off when the round is off');
 ok(code('Init Seats').includes("fail('qr_follow must be true or false.')"),'T9.4 qr_follow must be true or false');}
{const d=E8.nodes.filter(n=>{const m=E.nodes.find(x=>x.name===n.name);return JSON.stringify(m.parameters)!==JSON.stringify(n.parameters);}).map(n=>n.name).sort();ok(JSON.stringify(d)===JSON.stringify(['Init Seats','QR Merge']),'T9.5 only Init Seats and QR Merge change among the 588 nodes ('+d.join(', ')+')');}
// T9.6 follow-up off: QR Merge gives exactly the 588 output
{const a=J(await run(code('QR Merge'),{...P1,'Init Seats':{run_token:'t',question_trial:true}}))[0];const b=J(await run(code8('QR Merge'),{...P1,'Init Seats':{run_token:'t',question_trial:true}}))[0];ok(JSON.stringify(a)===JSON.stringify(b)&&a.qr_ok===true,'T9.6 with the follow-up pass off, QR Merge gives exactly the 588 output');}
const IS={run_token:'t',question_trial:true,qr_follow:true};
// T9.7 the ask
const fb=J(await run(code('QR Follow Build'),{...P1,'Init Seats':IS}));
const u=fb[0].body.messages;const ut=u[3].content;
ok(fb.length===3&&ut.indexOf('=== QUESTION ROUND ===')<ut.indexOf('DEBATE TRANSCRIPT')&&ut.includes('Q6 -- judge')&&u[u.length-2].content.includes('=== FOLLOW-UP - BEFORE YOU JUDGE ===')&&u[u.length-2].content.includes('You are judge gemini')&&u[u.length-1].role==='system','T9.7 each judge reads the six questions and answers, then the follow-up ask, under its own seat name');
ok(u[u.length-2].content.includes('A follow-up does not count as your one question'),'T9.8 the ask says a follow-up does not count as the judge\'s one question');
{const off=J(await run(code('QR Follow Build'),{...P1,'Init Seats':{question_trial:true}}));ok(off.length===1&&/off/.test(off[0].qr_skip)&&off[0].body&&off[0].body.max_tokens===16,'T9.9 switch off: a skip item with a 16-token body crosses QR Follow Ask');}
// T9.10 the checks (F4 a)
const qa1=J(await run(code('QR Merge'),{...P1,'Init Seats':{run_token:'t',question_trial:true}}))[0].qa;
const qD1=qa1.find(x=>x.side==='defender'),qC1=qa1.find(x=>x.side==='challenger');
const openD=qD1.quote.split(' ').slice(0,4).join(' ');const valid={defender:{q:'Q'+qD1.n,open:openD},challenger:'NONE'};
const ff=async reps=>J(await run(code('QR Follow Final'),{...P1,'Init Seats':IS,'QR Follow Build':fb},reps));
{const o=await ff([mk(valid),mk({defender:'NONE',challenger:'NONE'}),mk({defender:'NONE',challenger:'NONE'})]);const r=o[0].record;
 ok(o.length===1&&o[0].side==='defender'&&o[0].of===qD1.n&&o[0].question==='Your answer to Q'+qD1.n+' did not answer: "'+openD+'". Please explain that part.'&&o[0].route==='anthropic'&&o[0].body.model==='claude-opus-5-5','T9.10 a valid AGAIN item passes; the program writes: '+o[0].question);
 ok(r.filter(x=>x.status==='NONE').length===5&&r.filter(x=>x.status==='PASSED').length===1,'T9.11 NONE is recorded and asks nothing');
 ok(o[0].body.messages[0].content.includes('Your answer: Defender answer')&&o[0].body.messages[0].content.includes('=== THE FOLLOW-UP OF JUDGE gemini ==='),'T9.12 the debater reads its own question, its answer and the follow-up');}
const bad=async(f,side,re,what)=>{const o=await ff([mk({defender:'NONE',challenger:'NONE',[side]:f}),mk({defender:'NONE',challenger:'NONE'}),mk({defender:'NONE',challenger:'NONE'})]);const rec=o[0].record.find(x=>x.status==='DROPPED');ok(o[0].qr_skip&&rec&&re.test(rec.faults.join('; ')),'T9.13 known-bad '+what+' is dropped ('+(rec?rec.faults.join('; '):'none')+')');};
await bad({q:'Q99',open:openD},'defender',/Q99 does not exist/,'a Q<n> that does not exist');
await bad({q:'Q'+qD1.n,open:'words that are not in that question at all'},'defender',/not found word for word/,'a fragment that is not in Q<n>');
await bad({q:'Q'+qD1.n,open:openD},'challenger',/was put to the defender/,'a Q<n> put to the other debater');
await bad([{q:'Q'+qD1.n,open:openD},{q:'Q'+qD1.n,open:openD}],'defender',/at most one/,'two follow-ups to one debater');
await bad({q:'Q'+qD1.n,open:'abc'},'defender',/under 8 characters/,'open words under 8 characters');
// T9.14 the whole pass, through QR Merge
const fo=await ff([mk(valid),mk({defender:'NONE',challenger:{q:'Q'+qC1.n,open:qC1.question.slice(0,20)}}),mk({defender:'NONE',challenger:'NONE'})]);
ok(fo.length===2,'T9.14 two follow-ups pass (one to each debater)');
const fdb=J(await run(code('QR Follow D Build'),{'QR Follow Final':fo}));const fdd=J(await run(code('QR Follow D Done'),{'QR Follow D Build':fdb},fdb.map(()=>an('Defender follow-up answer'))));
const fcb=J(await run(code('QR Follow C Build'),{'QR Follow Final':fo}));const fcd=J(await run(code('QR Follow C Done'),{'QR Follow C Build':fcb},fcb.map(()=>or('Challenger follow-up answer'))));
ok(fdb.length===1&&fdb[0].route==='anthropic'&&fcb.length===1&&fcb[0].route==='openrouter','T9.15 the follow-ups go by each debater\'s own route');
const M={...P1,'Init Seats':IS,'QR Follow Final':fo,'QR Follow D Done':fdd,'QR Follow C Done':fcd};
const mg=J(await run(code('QR Merge'),M))[0];
ok(mg.qr_ok===true&&mg.qa.length===8&&mg.qa.slice(0,6).map(x=>x.n).join()==='1,2,3,4,5,6'&&mg.qa[6].n===7&&mg.qa[6].form==='FOLLOW-UP'&&mg.qa[6].of===qD1.n&&mg.qa[7].answer==='Challenger follow-up answer','T9.16 QR Merge: the six questions stay Q1 to Q6; the follow-ups are Q7 and Q8 (F4: the follow-up does not use the judge\'s one question)');
ok(mg.qa_text.includes('Q7 -- judge gemini to the defender, FOLLOW-UP to Q'+qD1.n)&&mg.qa_text.includes('A FOLLOW-UP asks again'),'T9.17 the block shows each follow-up with the question it follows');
{const b=mg.judges[0].body.messages[3].content;ok(b.indexOf('=== QUESTION ROUND ===')<b.indexOf('DEBATE TRANSCRIPT\n\n=== [CR1]')&&b.endsWith(T)&&b.split('=== QUESTION ROUND ===').length===2,'T9.18 one block, before the transcript; the transcript unchanged');
 const P=libfn('target_engine_588f.json','Alternate Merge Seat',['ciRounds','gatePromptText2024','cureRounds']);ok(JSON.stringify(P.ciRounds(P.gatePromptText2024(PB.judges[0].body)))===JSON.stringify(P.ciRounds(P.gatePromptText2024(mg.judges[0].body)))&&JSON.stringify(P.cureRounds(PB.judges[0].body))===JSON.stringify(P.cureRounds(mg.judges[0].body)),'T9.19 the round readers read the same eight rounds');}
{const jcb=code('Judge Contradiction Build');const line=jcb.match(/try\{if\(\$\('QR Merge'\)\.isExecuted\)[^\n]*?catch\(e\)\{\}/)[0];const cand=[];new Function('$','add',line)(n=>({isExecuted:n==='QR Merge',first:()=>({json:mg})}),(...a)=>cand.push(a));ok(cand.length===0,'T9.20 a follow-up is not a contradiction candidate');}
// T9.21 a fault in the follow-up pass keeps the first pass
{const sk=await ff([{error:{message:'x'}},mk({defender:'NONE',challenger:'NONE'}),mk({defender:'NONE',challenger:'NONE'})]);const m2=J(await run(code('QR Merge'),{...P1,'Init Seats':IS,'QR Follow Final':sk,'QR Follow D Done':[{side:'defender',answers:[],skip:'x'}],'QR Follow C Done':[{side:'challenger',answers:[],skip:'x'}]}))[0];
 const base=J(await run(code8('QR Merge'),{...P1,'Init Seats':{run_token:'t'}}))[0];
 ok(m2.qr_ok===true&&m2.qa.length===6&&m2.qa_text===base.qa_text&&m2.skips.some(s=>/follow-up/.test(s)),'T9.21 no follow-up passed: the first pass stands as in 588, and the skip is recorded');
 const m3=J(await run(code('QR Merge'),{...P1,'Init Seats':IS,__throw:['QR Follow Final']}))[0];ok(m3.qr_ok===true&&m3.qa.length===6&&m3.skips.some(s=>/follow-up/.test(s)),'T9.22 the follow-up pass did not run: the first pass stands, the fault recorded');}
// T9.23 a first-pass skip runs no follow-up, and the skip item crosses QR Follow Ask
{const f2=[{qr_skip:'QR Ask Build: x'}];const b2=J(await run(code('QR Follow Build'),{...P1,'QR Final':f2,'Init Seats':IS}));ok(b2.length===1&&/first pass skipped/.test(b2[0].qr_skip)&&b2[0].body&&b2[0].body.max_tokens===16,'T9.23 a first-pass skip: no follow-up, a 16-token body crosses QR Follow Ask');
 const fin2=J(await run(code('QR Follow Final'),{...P1,'QR Follow Build':b2,'Init Seats':IS},[or('OK')]));ok(fin2[0].qr_skip,'T9.24 QR Follow Final passes the skip on');
 ok(J(await run(code('QR Follow D Build'),{'QR Follow Final':fin2}))[0].route==='skip','T9.25 the D stage routes the skip to its Done node');}
// T9.26 the HTTP copies
for(const [n,s] of [['QR Follow Ask','QR Ask'],['QR Follow D openrouter','QR Answer'],['QR Follow C openrouter','QR Answer C openrouter'],['QR Follow D anthropic','QR Answer D anthropic'],['QR Follow C anthropic','QR Answer C anthropic']]){const a=E.nodes.find(x=>x.name===n),b=E.nodes.find(x=>x.name===s);ok(JSON.stringify(a.parameters)===JSON.stringify(b.parameters)&&JSON.stringify(a.credentials)===JSON.stringify(b.credentials)&&a.onError===b.onError,'T9.26 '+n+' is a copy of '+s);}
// T9.27 the record line of the row
{const bsb=code('Build Save Body');ok(bsb.includes("$('QR Merge')")&&mg.record.some(r=>r.pass==='follow'),'T9.27 the follow-up checks go into the record that Build Save Body stores');}
console.log('RESULT: '+(fail?'FAIL ('+fail+' fail, '+pass+' pass)':'ALL PASS ('+pass+' pass)'));
})().catch(e=>{console.log('ERROR',e&&e.stack);process.exit(1);});
