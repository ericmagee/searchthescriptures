// ASK 588 tests (W4): offline, on the stored 42071 rounds; nothing is fetched or written. node t588.cjs
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const E=JSON.parse(fs.readFileSync(process.env.QR_E,'utf8'));const B0=JSON.parse(fs.readFileSync('../build/base_eng.json','utf8'));const CH=JSON.parse(fs.readFileSync('../build/target_child_588.json','utf8'));
const libfn=require('../build/libfn.cjs');
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
const T='=== TOPIC ===\nt\n\n'+['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'].map(k=>'=== '+HD[k]+' ===\n'+RR[k]).join('\n\n');
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
// T0 structure
ok(!/question_trial runs only in a dry regrade/.test(code('Init Seats')),'T0.1 Init Seats: the dry-only gate is gone');
ok(code('Init Seats').includes("(RG!==null?b.question_trial===true:b.question_trial!==false)"),'T0.2 Init Seats: on by default on a fresh run, opt-in on a regrade');
{const f=(RG,qt)=>(RG!==null?qt===true:qt!==false);ok(f(null,undefined)&&!f(null,false)&&f(null,true)&&!f('R',undefined)&&f('R',true)&&!f('R',false),'T0.3 the default rule: fresh undefined on, fresh false off, regrade undefined off, regrade true on');}
ok(!/S\.dry!==true/.test(code('QR Ask Build')),'T0.4 QR Ask Build: no dry gate');
ok(!/\(TRIAL\)/.test(code('QR Ask Build')+code('QR Merge')+code('QR Check')),'T0.5 no "(TRIAL)" label in the question round text');
const C=E.connections;const par=n=>{const r=[];for(const [s,v] of Object.entries(C))(v.main||[]).forEach(b=>b.forEach(x=>{if(x.node===n)r.push(s);}));return r.sort();};
ok(JSON.stringify(par('QR Answer D Done'))===JSON.stringify(['QR Answer','QR Answer D Route','QR Answer D anthropic'].sort()),'T0.6 QR Answer D Done is fed by the anthropic, the openrouter and the skip branch');
ok(JSON.stringify(par('QR Answer C Done'))===JSON.stringify(['QR Answer C Route','QR Answer C anthropic','QR Answer C openrouter'].sort()),'T0.7 QR Answer C Done likewise');
ok(JSON.stringify(par('QR Merge'))==='["QR Answer C Done"]'&&JSON.stringify(C['QR Merge'].main)===JSON.stringify(B0.connections['QR Merge'].main),'T0.8 QR Merge has one parent and its output is unchanged (to Panel Judges Prep)');
ok(JSON.stringify(C['QR Trial?'].main)===JSON.stringify(B0.connections['QR Trial?'].main),'T0.9 QR Trial? unchanged: false goes straight to Panel Judges Prep');
for(const n of ['QR Answer D anthropic','QR Answer C anthropic']){const x=E.nodes.find(y=>y.name===n);ok(x.parameters.url==='https://api.anthropic.com/v1/messages'&&x.onError==='continueRegularOutput'&&x.credentials&&x.credentials.anthropicApi&&x.parameters.jsonBody==='={{ $json.body }}','T0.10 '+n+': the direct Anthropic route, the debater credential, errors continue');}
{const x=E.nodes.find(y=>y.name==='QR Answer C openrouter'),y=E.nodes.find(z=>z.name==='QR Answer');ok(x.parameters.url===y.parameters.url&&x.parameters.jsonBody===y.parameters.jsonBody&&x.onError==='continueRegularOutput','T0.11 QR Answer C openrouter is a copy of QR Answer');}
const sw=E.nodes.find(y=>y.name==='QR Answer D Route').parameters.output;const swf=r=>new Function('$json','return '+sw.slice(4,-3))({route:r});ok(swf('anthropic')===0&&swf('openrouter')===1&&swf('skip')===2&&swf(undefined)===2,'T0.12 the route switch: anthropic 0, openrouter 1, anything else 2');
// T1 fixed forms
const ask=J(await run(code('QR Ask Build'),{'Init Seats':{run_token:'t',question_trial:true},'Panel Build':PB}));
ok(ask.length===3&&ask.every(a=>a.body&&a.body.messages.slice(-2)[0].content.includes('MEANING')&&a.body.messages.slice(-2)[0].content.includes('FIT')&&a.body.messages.slice(-2)[0].content.includes('AGREE')),'T1.1 QR Ask Build asks each judge in the fixed forms');
ok(ask[0].body.messages.slice(-2)[0].content.includes('What does \\"<term>\\" in this passage mean?')===false&&ask[0].body.messages.slice(-2)[0].content.includes('What does "<term>" in this passage mean?'),'T1.2 the MEANING wording is ruling 414 item 2, with plain quotation marks');
const chkNode=code('QR Check');
const mk=(o)=>or(JSON.stringify(o));
const bads={term_not_in_quote:{...good.defender,term:'zzzzqq'},verse_not_in_quote:{round:'DR3',quote:qC,form:'FIT',verse:'Genesis 1:1'},quote_not_found:{...good.defender,quote:'these words are not in the round at all'},agree_not_closing:{round:'CR3',quote:qD,form:'AGREE',earlier_round:'CR2',earlier_quote:earlyD},earlier_on_meaning:{...good.defender,earlier_round:'CR2',earlier_quote:earlyD},free_form:{...good.defender,form:'FREE',question:'Why do you defend this?'}};
for(const [k,q] of Object.entries(bads)){const side=k==='verse_not_in_quote'?'challenger':'defender';const rep={...good,[side]:q};const out=J(await run(chkNode,{'QR Ask Build':ask,'Final Output':F,'Init Seats':{run_token:'t'}},[mk(rep),mk(good),mk(good)]));ok(out[0].retry===true&&out[0].faults[side].length>0&&out[1].retry===false,'T1.3 known-bad '+k+' is returned once ('+(out[0].faults[side][0]||'')+')');}
{const agree={...good,defender:{round:'CR4',quote:closeD,form:'AGREE',earlier_round:'CR2',earlier_quote:earlyD}};const out=J(await run(chkNode,{'QR Ask Build':ask,'Final Output':F,'Init Seats':{run_token:'t'}},[mk(agree),mk(good),mk(good)]));ok(out.every(o=>o.retry===false),'T1.4 known-goods pass: MEANING, FIT and AGREE');}
{const out=J(await run(chkNode,{'QR Ask Build':ask,'Final Output':F,'Init Seats':{run_token:'t'}},[mk({...good,challenger:{round:'DR3',quote:qC,form:'FIT',verse:vD.startsWith(vC.split(' ')[0])?'Hebrews 13:8':'Hebrews 13:8'}}),mk(good),mk(good)]));ok(out[0].retry===true,'T1.5 known-bad: a verse the debater never cited and the quote does not name is returned');}
// T2 the whole round: judge 1 returned once and cured; defender on the direct Anthropic route, challenger on OpenRouter
const badFirst={...good,defender:bads.term_not_in_quote};
const chk=J(await run(chkNode,{'QR Ask Build':ask,'Final Output':F,'Init Seats':{run_token:'t'}},[mk(badFirst),mk(good),mk(good)]));
ok(chk[0].retry&&!chk[1].retry&&chk[1].body.max_tokens===16,'T2.1 QR Check: judge 1 returned, judges 2 and 3 not');
const RS={defender:{fam:'anthropic',model:'anthropic/claude-opus-5.5',direct_model:'claude-opus-5-5'},challenger:{fam:'openrouter',model:'anthropic/claude-sonnet-5.5'}};
const fin=J(await run(code('QR Final'),{'QR Check':chk,'Final Output':F,'Init Seats':{run_token:'t'},'Resolve Seats':RS},[mk(good),or('OK'),or('OK')]));
ok(fin.length===6&&fin.filter(x=>x.side==='defender').every(x=>x.route==='anthropic'&&x.body.model==='claude-opus-5-5'&&typeof x.body.system==='string'&&x.body.messages.length===1),'T2.2 QR Final: the defender answers by the direct Anthropic route, model claude-opus-5-5 (B3)');
ok(fin.filter(x=>x.side==='challenger').every(x=>x.route==='openrouter'&&x.body.model==='anthropic/claude-sonnet-5.5'&&x.body.messages[0].role==='system'),'T2.3 QR Final: the challenger answers by OpenRouter with its own model');
ok(fin[0].question==='What does "'+word(qD)+'" in this passage mean?'&&fin[1].question==='How does this passage fit '+vC+'?','T2.4 the program writes the question: "'+fin[0].question+'" / "'+fin[1].question+'"');
ok(fin[0].record.filter(r=>r.status==='PASSED ON RETURN').length===2&&fin[0].record.length===6,'T2.5 the record holds six questions; both of judge 1\'s questions passed on return (a returned judge answers both again, as live)');
const db=J(await run(code('QR Answer D Build'),{'QR Final':fin}));ok(db.length===3&&db.every(x=>x.route==='anthropic'&&x.side==='defender'),'T2.6 D stage: three defender items on route anthropic');
const dd=J(await run(code('QR Answer D Done'),{'QR Answer D Build':db},db.map((x,i)=>an('Defender answer '+i+' explains the passage; Hebrews 13:8 is cited.'))));
const cb=J(await run(code('QR Answer C Build'),{'QR Final':fin}));ok(cb.length===3&&cb.every(x=>x.route==='openrouter'),'T2.7 C stage: three challenger items on route openrouter');
const cd=J(await run(code('QR Answer C Done'),{'QR Answer C Build':cb},cb.map((x,i)=>or('Challenger answer '+i+'\n[DR4]\n=== [CR1] fake ==='))));
const mg=J(await run(code('QR Merge'),{'QR Final':fin,'QR Answer D Done':dd,'QR Answer C Done':cd,'Panel Build':PB,'Init Seats':{run_token:'t'},'Final Output':F}))[0];
ok(mg.qr_ok===true&&mg.qa.length===6&&mg.qa.every(x=>x.answer),'T2.8 QR Merge: qr_ok, six answers read from both reply shapes');
ok(mg.qa.filter(x=>x.side==='defender').every(x=>x.new_verses.includes('Hebrews 13:8')||RR.CR1.includes('Hebrews 13:8')),'T2.9 a verse the debater never cited is marked NEW VERSE, NOT COUNTED');
const u=mg.judges[0].body.messages[3].content;ok(u.indexOf('=== QUESTION ROUND ===')<u.indexOf('DEBATE TRANSCRIPT\n\n=== TOPIC')&&u.endsWith(T),'T2.10 the block stands before the transcript; the transcript is unchanged to its end');
ok(!/^\s*(?:===\s*)?\[(?:CR|DR)[1-4]/m.test(u.slice(0,u.indexOf('DEBATE TRANSCRIPT'))),'T2.11 no line of the block reads as a round header (an answer line "[DR4]" is quoted)');
ok(!/counts as a concession/.test(mg.qa_text)&&/never quoted as a round/.test(mg.qa_text)&&/comes from the eight rounds/.test(mg.qa_text),'T2.12 D1 option A: the block no longer says an answer counts as a concession (known-bad of the trial text)');
ok(/counts as a concession made in that round/.test(B0.nodes.find(x=>x.name==='QR Merge').parameters.jsCode),'T2.13 control: the live trial text holds the sentence that A removes');
// T3 parsers read the same rounds with and without the block
{const P=libfn('target_engine_588.json','Alternate Merge Seat',['ciRounds','cureRounds','gatePromptText2024']);const Q=libfn('target_engine_588.json','Panel Payloads',['drvPromptText','drvLedgerN']);
 const b0=PB.judges[0].body,b1=mg.judges[0].body;const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const r0=P.ciRounds(P.gatePromptText2024(b0)),r1=P.ciRounds(P.gatePromptText2024(b1));ok(Object.keys(r0).length===8&&eq(r0,r1),'T3.1 ciRounds: the same eight rounds');
 ok(eq(P.cureRounds(b0),P.cureRounds(b1))&&Object.keys(P.cureRounds(b0)).length===8,'T3.2 cureRounds: the same eight rounds');
 ok(eq(Q.drvLedgerN(Q.drvPromptText(b0),'DEFENDER'),Q.drvLedgerN(Q.drvPromptText(b1),'DEFENDER'))&&eq(Q.drvLedgerN(Q.drvPromptText(b0),'CHALLENGER'),Q.drvLedgerN(Q.drvPromptText(b1),'CHALLENGER')),'T3.3 drvLedgerN: the same');
 const bad=JSON.parse(JSON.stringify(b0));bad.messages[3].content+='\n\n'+mg.qa_text;ok(!eq(P.cureRounds(b0),P.cureRounds(bad)),'T3.4 control: the block placed after the transcript would change the last round, so the place matters');}
// T4 every judge path reads the merged bodies when the round ran whole
const PBJ="$('Panel Build').first().json";const {src,cut}=require('./libpatch.js');
for(const n of ['Send Back Build','Gate Build','Late Gate Build','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Alternate Build','Panel Payloads','Alternate Merge Seat','Alt Gate Build','Alt Late Gate Build']){const s=src(E,n);ok(!s.includes(PBJ.replace(/^/,''))||s.split("$('QR Merge')").length-1>=s.split(PBJ).length-1,'T4.1 '+n+': every Panel Build read goes through the QR Merge swap');}
for(const n of ['Reserve Build','Panel Check']){const s=code(n);ok(s.includes("$('QR Merge')")&&s.split(PBJ).length===2,'T4.2 '+n+': the read goes through the swap');}
{const keyOf=s=>{const m=s.match(/\["([^"]+)"\];if\(!__M\)/);return m?m[1]:null;};const stubs=E.nodes.filter(x=>{const s=x.parameters&&x.parameters.jsCode;if(typeof s!=='string'||!s.startsWith('if(false){'))return false;const k=keyOf(s);return k&&cut(E).M[k]&&src(E,k).includes("$('QR Merge')");});ok(stubs.some(x=>x.name==='Early Alternate Build'),'T4.3a Early Alternate Build (it loads the Alternate Build source) is among them');ok(stubs.length>0&&stubs.every(x=>x.parameters.jsCode.startsWith('if(false){$("QR Merge");')),'T4.3 every engine library node that reads QR Merge declares it ('+stubs.length+')');}
const H=src(E,'Panel Cure Build 1').match(/\(\(__p\)=>\{try\{const __q=\$\('QR Merge'\)[\s\S]*?\}\)\(\$\('Panel Build'\)\.first\(\)\.json\)/)[0];
const evalH=async nodes=>(await run('return '+H+';',nodes));
{const o=await evalH({'Panel Build':PB,'QR Merge':mg});ok(o.judges.every(j=>JSON.stringify(j.body).includes('=== QUESTION ROUND ===')),'T4.4 the swap gives the merged bodies (marker in all three)');
 const s=await evalH({'Panel Build':PB,'QR Merge':{qr_ok:false,judges:null}});ok(s===PB,'T4.5 qr_ok false: the plain Panel Build');
 const c=await evalH({'Panel Build':PB,__throw:['QR Merge']});ok(c===PB,'T4.6 the child, which has no QR Merge node: the plain shim (already swapped by the pass)');
 const nr=await evalH({'Panel Build':PB});ok(nr===PB,'T4.7 the round off: the plain Panel Build');}
{const v=E.nodes.find(x=>x.name==='Alternate Pass Call').parameters.workflowInputs.value.pass;const m=v.match(/\$\("Panel Build"\)\.all\(\)\.map\(i => \(([\s\S]*?i\.json)\)\)/);const f=nodes=>new Function('$','i','return ('+m[1]+');')(n=>({isExecuted:!!nodes[n],first:()=>({json:nodes[n]})}),{json:PB});
 ok(JSON.stringify(f({'QR Merge':mg}).judges[0].body).includes('=== QUESTION ROUND ===')&&f({'QR Merge':mg}).qa588===mg.qa_text,'T4.8 the alternate pass hands the child the merged Panel Build (R2 Alternate Build, R2 send-back, gate)');
 ok(f({})===PB||JSON.stringify(f({}))===JSON.stringify(PB),'T4.9 the alternate pass with no round: the plain Panel Build');}
{const s=code('Panel Judges Prep');const m=s.match(/let body=\(\(\)=>\{[\s\S]*?\}\)\(\);/)[0];const f=async(nodes,qt)=>run('const qt='+qt+';const PB=$(\'Panel Build\').first().json;const k=1;'+m+'return body;',nodes);
 ok(JSON.stringify(await f({'Panel Build':PB,'QR Merge':mg},true)).includes('QUESTION ROUND')&&!JSON.stringify(await f({'Panel Build':PB,'QR Merge':{qr_ok:false}},true)).includes('QUESTION ROUND')&&!JSON.stringify(await f({'Panel Build':PB},false)).includes('QUESTION ROUND'),'T4.10 Panel Judges Prep: merged only on qr_ok');}
// T5 skip, never stop (B4)
{const off=J(await run(code('QR Ask Build'),{'Init Seats':{question_trial:false},'Panel Build':PB}));ok(off.length===1&&/off/.test(off[0].qr_skip),'T5.1 round off: QR Ask Build passes a skip');
 const two=J(await run(code('QR Ask Build'),{'Init Seats':{question_trial:true},'Panel Build':{judges:PB.judges.slice(0,2)}}));ok(two.length===1&&/expected 3/.test(two[0].qr_skip),'T5.2 a fault in QR Ask Build is a skip, not a stop');
 const c2=J(await run(chkNode,{'QR Ask Build':two,'Final Output':F},[{error:{message:'x'}}]));ok(c2[0].qr_skip===two[0].qr_skip,'T5.3 QR Check passes the skip on');
 const f2=J(await run(code('QR Final'),{'QR Check':c2},[{error:{}}]));ok(f2[0].qr_skip,'T5.4 QR Final passes the skip on');
 const d2=J(await run(code('QR Answer D Build'),{'QR Final':f2}));ok(d2[0].route==='skip','T5.5 D stage routes the skip to its Done node');
 const dd2=J(await run(code('QR Answer D Done'),{'QR Answer D Build':d2},d2));const cb2=J(await run(code('QR Answer C Build'),{'QR Final':f2}));const cd2=J(await run(code('QR Answer C Done'),{'QR Answer C Build':cb2},cb2));
 const m2=J(await run(code('QR Merge'),{'QR Final':f2,'QR Answer D Done':dd2,'QR Answer C Done':cd2,'Panel Build':PB,'Init Seats':{},'Final Output':F}))[0];ok(m2.qr_ok===false&&m2.qr_skip,'T5.6 QR Merge: qr_ok false, the run goes on with the plain bodies ('+m2.qr_skip+')');
 const allbad=J(await run(code('QR Final'),{'QR Check':J(await run(chkNode,{'QR Ask Build':ask,'Final Output':F},[or('no json'),or('no json'),or('no json')])),'Final Output':F,'Resolve Seats':RS},[or('still no'),or('still no'),or('still no')]));ok(allbad.length===1&&/no question passed/.test(allbad[0].qr_skip)&&allbad[0].record.length===6,'T5.7 every question dropped: skip, with the six-question record kept');
 const RSx={defender:{fam:'openai',model:'openai/gpt-x'},challenger:RS.challenger};const f3=J(await run(code('QR Final'),{'QR Check':chk,'Final Output':F,'Resolve Seats':RSx},[mk(good),or('OK'),or('OK')]));const d3=J(await run(code('QR Answer D Build'),{'QR Final':f3}));ok(d3.length===1&&d3[0].route==='skip'&&/family openai/.test(d3[0].why),'T5.8 a debater family with no route: that side skipped and recorded');
 const dd3=J(await run(code('QR Answer D Done'),{'QR Answer D Build':d3},d3));const m3=J(await run(code('QR Merge'),{'QR Final':f3,'QR Answer D Done':dd3,'QR Answer C Done':cd,'Panel Build':PB,'Init Seats':{},'Final Output':F}))[0];ok(m3.qr_ok===true&&m3.skips.length===1&&m3.qa.filter(x=>x.answer).length===3,'T5.9 ... and the other side\'s three answers still go to the judges');
 const noAnch={judges:PB.judges.map(j=>({...j,body:{...j.body,messages:[{role:'user',content:'no transcript here'}]}}))};const m4=J(await run(code('QR Merge'),{'QR Final':fin,'QR Answer D Done':dd,'QR Answer C Done':cd,'Panel Build':noAnch,'Init Seats':{},'Final Output':F}))[0];ok(m4.qr_ok===false&&/anchor/.test(m4.qr_skip),'T5.10 a body with no transcript anchor: skip, never a block in the wrong place');
 const errAns=J(await run(code('QR Answer D Done'),{'QR Answer D Build':db},db.map(()=>({error:{message:'overloaded'}}))));const m5=J(await run(code('QR Merge'),{'QR Final':fin,'QR Answer D Done':errAns,'QR Answer C Done':cd,'Panel Build':PB,'Init Seats':{},'Final Output':F}))[0];ok(m5.qr_ok===true&&m5.qa.filter(x=>x.side==='defender').every(x=>x.answer===null&&/overloaded/.test(x.error)),'T5.11 a failed answer call is recorded "(no answer)" and the round goes on');}
// T6 the row line and its readers
{const bsb=code('Build Save Body');const m=bsb.match(/review_notes:RN\+(\(\(\)=>\{[\s\S]*?\}\)\(\)) \/\* ASK 588 \*\//)[1];const line=await run('return '+m+';',{'QR Merge':mg});const skipLine=await run('return '+m+';',{'QR Merge':{qr_ok:false,qr_skip:'x',record:[]}});const none=await run('return '+m+';',{});
 ok(/^\n\n\[QUESTION ROUND v1: \{"status":"RAN"/.test(line)&&line.split('\n').length===3&&/^\n\n\[QUESTION ROUND v1: \{"status":"SKIPPED"/.test(skipLine)&&none==='','T6.1 the row line: RAN or SKIPPED on one line; nothing when the round is off');
 const RN='[AUDIT v27: CLOSE-ROUND GRADING CHECK (D4) -- STORED, computed once from every round; a TRIAL check: the defender\'s close round holds 0 sentence(s) that grade or press the challenger\'s links; each is marked DISREGARDED for the judges.] [REMOVED SEAT: gemini (send-back)] [AUDIT v23: SYNTHESIS CHECK (S-C) -- an item. REVIEW THIS ROW.]';
 const fm=E.nodes.find(x=>x.name==='Format Markdown').parameters.jsCode;const acorn=require('/opt/node-tools/node_modules/acorn');const ast=acorn.parse('(async function(){'+fm+'\n})',{ecmaVersion:'latest'});const P0='(async function(){'.length;let c4='';for(const b of ast.body[0].expression.body.body){if(b.type==='VariableDeclaration'&&b.declarations.some(d=>d.id.name==='C4P'))c4=fm.slice(b.start-P0,b.end-P0);}
 const C4P=new Function(c4+';return C4P;')();const rd=n=>JSON.stringify([C4P.stored(n,'D'),C4P.stored(n,'C'),[...n.matchAll(/\[AUDIT v\d+: SYNTHESIS CHECK \((S-[A-K])\) -- ([\s\S]*?)\. REVIEW THIS ROW\.\]/g)].map(x=>x[1]+x[2]),[...n.matchAll(/\[(REMOVED SEAT: [^\]]*)\]/g)].map(x=>x[1])]);
 ok(rd(RN)===rd(RN+line)&&rd(RN)===rd(RN+skipLine),'T6.2 the review_notes readers (C4P.stored, the SYNTHESIS CHECK and REMOVED SEAT readers of Format Markdown) give the same output with and without the line');}

// T8 review points (advisor): the flag-block prefix, the contradiction reader, skip bodies
{const A={__JFL_RE:eval(require('./libpatch.js').src(JSON.parse(require('fs').readFileSync(process.env.QR_E)),'Alternate Build').match(/const __JFL_RE=(\/[^\n]*\/g);/)[1])};const JFLB='[[JUDGE FAULT LEDGER]]\nseat x: 2 faults\n[[END JUDGE FAULT LEDGER]]\n\n';const JFLX=(u,blk)=>blk+String(u).replace(A.__JFL_RE,'');
 const merged=JFLB+mg.judges[0].body.messages[3].content;const out=JFLX(merged,'[[JUDGE FAULT LEDGER]]\nreserve: 0\n[[END JUDGE FAULT LEDGER]]\n\n');ok(out.includes('=== QUESTION ROUND ===')&&out.indexOf('=== QUESTION ROUND ===')<out.indexOf('DEBATE TRANSCRIPT')&&!out.includes('seat x: 2 faults')&&out.includes('reserve: 0'),'T8.1 __JFLX (Alternate Build, Reserve Build) swaps the seat\'s fault ledger and keeps the block before the transcript');
 const out2=JFLX(mg.judges[0].body.messages[3].content,'');ok(out2.includes('=== QUESTION ROUND ==='),'T8.2 ... and with no fault ledger');}
{const agree={...good,defender:{round:'CR4',quote:closeD,form:'AGREE',earlier_round:'CR2',earlier_quote:earlyD}};const ck=J(await run(chkNode,{'QR Ask Build':ask,'Final Output':F},[mk(agree),mk(good),mk(good)]));const fi=J(await run(code('QR Final'),{'QR Check':ck,'Final Output':F,'Resolve Seats':RS},[or('OK'),or('OK'),or('OK')]));const ddA=J(await run(code('QR Answer D Done'),{'QR Answer D Build':J(await run(code('QR Answer D Build'),{'QR Final':fi}))},[an('a'),an('b'),an('c')]));const mA=J(await run(code('QR Merge'),{'QR Final':fi,'QR Answer D Done':ddA,'QR Answer C Done':cd,'Panel Build':PB,'Init Seats':{},'Final Output':F}))[0];
 const jcb=code('Judge Contradiction Build');const line=jcb.match(/try\{if\(\$\('QR Merge'\)\.isExecuted\)[^\n]*?catch\(e\)\{\}/)[0];
 const cand=[];const add2=(...a)=>cand.push(a);new Function('$','add',line)(n=>({isExecuted:n==='QR Merge',first:()=>({json:mA})}),add2);
 ok(cand.length===1&&cand[0][1]==='defender'&&cand[0][2]==='CR2'&&cand[0][4]==='CR4'&&cand[0][6]==='question','T8.3 Judge Contradiction Build reads the AGREE question as one contradiction candidate (judge, side, CR2 earlier, CR4 closing), as in the trials');}
{const s1=J(await run(code('QR Ask Build'),{'Init Seats':{question_trial:true},'Panel Build':{judges:PB.judges.slice(0,2)}}));ok(s1[0].body&&s1[0].body.max_tokens===16&&s1[0].body.model==='x/gemini','T8.4 a skip item crosses QR Ask with a 16-token request on the judge\'s own model, not with no body');
 const s2=J(await run(chkNode,{'QR Ask Build':s1,'Final Output':F,'Panel Build':{judges:PB.judges.slice(0,2)}},[or('OK')]));ok(s2[0].body&&s2[0].body.max_tokens===16,'T8.5 ... and QR Retry Ask likewise');}
// T7 the child and the library
ok(JSON.stringify(cut(E).L)===JSON.stringify(cut(CH).L),'T7.1 the engine and the child hold the same LIB');
ok(CH.nodes.length===JSON.parse(fs.readFileSync('base_child.json','utf8')).nodes.length,'T7.2 the child gains no node');
console.log('RESULT: '+(fail?fail+' FAIL':'ALL PASS')+' ('+pass+' pass)');
})().catch(e=>{console.log('ERROR',e.stack);process.exit(1);});
