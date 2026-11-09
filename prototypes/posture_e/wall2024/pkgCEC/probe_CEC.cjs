// pkgCEC probe (W1). Runs the new nodes and the changed nodes on saved run 34108 (ODV1-34108-3to8dgrt), with written enforcer replies.
// The enforcer call itself is not made here (no DeepSeek key offline): its reply is written by hand in the form the prompt asks for.
//   node pkgCEC/probe_CEC.cjs   (from wall2024/)
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const W=__dirname+'/..';
const PAR=JSON.parse(fs.readFileSync(__dirname+'/parent_s83_CEC.json','utf8'));const SJR=JSON.parse(fs.readFileSync(W+'/pkgSJR/parent_s82_SJR.json','utf8'));
const code=(d,n)=>d.nodes.find(x=>x.name===n).parameters.jsCode;const strip=(s,f)=>fs.readFileSync(W+'/pkgLIB/strip_'+s+'/patched/'+f,'utf8');
const RUN='34108';const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));
const run=async(c,over,inp)=>{const r=harness(RUN,over||{})('return (async()=>{\n'+c+'\n})();',inp||'Quote Report');return await r;};
let ok=0,bad=0;const T=(n,c,i)=>{if(c){ok++;console.log('OK   '+n+(i?': '+i:''));}else{bad++;console.log('FAIL '+n+(i?': '+i:''));}};
const F=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0][0].json;
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];
const D6E='I drop the wording "no biological father" as a bare statement.',D6C='Christ had no biological father.';
const G41E='I grant that this is the ordinary means.',G41C='Genesis 4:1 therefore cannot supply the sequence for Matthew, because Matthew 1:23 sets the virgin as the one with child.';
const L1=`CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 6 -- CONFIRMED -- EARLIER [CR3] "${D6E}" -- CLOSING [CR4] "${D6C}" -- The close asserts as its own the wording the defender dropped in [CR3].`;
const L2=`CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 1 -- NOT A CONTRADICTION -- EARLIER [CR3] "${G41E}" -- CLOSING [CR4] "${G41C}" -- [CR3] already limits the grant: for this birth Matthew 1:18 states a different order, and the close gives a further reason inside that room.`;
(async()=>{
// ---------- 1. Close Enforcer Build ----------
const B=(await run(code(PAR,'Close Enforcer Build'),{}))[0].json;const U=B.body.messages[1].content;
T('1a builds one DeepSeek body (model from Resolve Seats, temperature 0, no reasoning field)',!B.cec_skip&&B.body.temperature===0&&!('reasoning' in B.body)&&!('thinking' in B.body),B.model+', '+U.length+' characters');
T('1b every round is given in full, under its judge label',[['CR1','cr1'],['CR2','cr2'],['CR3','cr3'],['DR1','gr1'],['DR2','gr2'],['DR3','dr3']].every(([l,k])=>U.includes('=== ['+l+'] ===\n'+F[k].trim()))&&U.includes(F.cr4.trim())&&U.includes(F.dr4.trim()));
T('1c declared links read: defender D1-D6 from the [CR1] DECLARED CHAIN, challenger C1-C6 from the [DR3] LINK blocks',JSON.stringify(B.links)==='{"DEFENDER":[1,2,3,4,5,6],"CHALLENGER":[1,2,3,4,5,6]}',JSON.stringify(B.links));
T('1d the prompt is the A2 prompt with the re-assertion sentence; no candidate in 34108',U.startsWith('You are the closing enforcer.')&&U.includes('asserts again, as the side\'s own, what the same side withdrew, dropped or gave up')&&U.includes('CANDIDATES ALREADY NAMED (answer each one by its id):\nnone'));
const ORA=F.dr4+'\n\nOPPONENT\'S CONTRADICTIONS:\nX1 LINK 6 | EARLIER [CR3] "'+D6E+'" | CLOSING [CR4] "'+D6C+'" | the close says again what [CR3] dropped\nX2 LINK 1 | EARLIER [CR3] "'+G41E+'" | CLOSING [CR4] "Genesis 4:1 therefore cannot supply the sequence for Matthew" | the grant and the denial\n';
const FO=cl(JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0]);FO[0].json.dr4=ORA;
const BO=(await run(code(PAR,'Close Enforcer Build'),{'Final Output':FO}))[0].json;
T('1e item B: the Oracle\'s OPPONENT\'S CONTRADICTIONS lines in [DR4] become candidates X1, X2 (defender)',BO.cands.length===2&&BO.cands[0].id==='X1'&&BO.cands[0].side==='DEFENDER'&&BO.cands[0].n===6&&BO.body.messages[1].content.includes('X1 -- DEFENDER -- LINK 6 -- EARLIER [CR3]'),JSON.stringify(BO.cands.map(c=>c.id+' '+c.side+' '+c.kind+' '+c.n)));
const BS=(await run(code(PAR,'Close Enforcer Build'),{'Resolve Seats':[J({})]}))[0].json;T('1f no DeepSeek model row: skipped, says why',BS.cec_skip===true&&/DeepSeek/.test(BS.why));
// ---------- 2. Close Enforcer Record ----------
const rec=async(txt,b)=>(await run(code(PAR,'Close Enforcer Record'),{'Close Enforcer Build':[J(b||B)],'Close Enforcer Call deepseek':reply(txt)},'Close Enforcer Call deepseek'))[0].json;
const R1=await rec(L1+'\n'+L2);
T('2a 34108: the dropped "no biological father" wording said again in [CR4] is CONFIRMED on D6 (both quotes found, rounds right, link declared)',R1.cec.confirmed.length===1&&R1.cec.confirmed[0].side==='DEFENDER'&&R1.cec.confirmed[0].link===6,JSON.stringify(R1.cec.rows.map(r=>r.id+' '+r.side+' '+r.link+' '+r.status)));
T('2b 34108: terra\'s Genesis 4:1 flag answered NOT A CONTRADICTION breaks nothing and is logged',R1.cec.rows[1].status==='NOT A CONTRADICTION'&&R1.cec_log.length===2&&R1.cec_log.every(r=>r.rule==='E-CLOSECON'&&r.kind==='enforcer_check'),R1.cec_log.map(r=>r.item+': '+r.cure_status).join(' | '));
const bad1=async(line,re,lab)=>{const r=await rec(line);T(lab,r.cec.confirmed.length===0&&r.cec.rows.length===1&&r.cec.rows[0].status==='NOT CONFIRMED (form)'&&re.test(r.cec.rows[0].note||''),r.cec.rows[0]&&r.cec.rows[0].note);};
await bad1(L1.replace('as a bare statement','as a plain statement'),/earlier quotation is not found word for word in CR3/,'2c a CONFIRMED line whose earlier quote is not word for word: NOT CONFIRMED (form)');
await bad1(L1.replace(D6C,'Christ had no father at all.'),/closing quotation is not found word for word in CR4/,'2d a closing quote not in [CR4]: NOT CONFIRMED (form)');
await bad1(L1.replace('EARLIER [CR3]','EARLIER [CR4]'),/earlier round CR4 is not one of the defender's rounds 1 to 3/,'2e the earlier quote placed in the closing round: NOT CONFIRMED (form)');
await bad1(L1.replace('CLOSING [CR4]','CLOSING [CR3]'),/closing round CR3 is not the defender's round 4/,'2f the closing quote placed in round 3: NOT CONFIRMED (form)');
await bad1(L1.replace('LINK 6','LINK 9'),/LINK 9 is not one of the defender's declared links/,'2g an undeclared link: NOT CONFIRMED (form)');
await bad1(L1.replace('-- DEFENDER --','-- CHALLENGER --'),/earlier round CR3 is not one of the challenger's rounds/,'2h the defender\'s words charged to the challenger: NOT CONFIRMED (form)');
await bad1(L1.replace(D6E,'Christ had no biological father.'),/earlier quotation is not found word for word in CR3/,'2i an earlier quote that stands in [CR1] but is named [CR3] is checked in [CR3] only: NOT CONFIRMED (form)');
const R3=await rec('CLOSE-CONTRADICTION: NONE');T('2j CLOSE-CONTRADICTION: NONE: nothing confirmed, one NONE FOUND log row',R3.cec.confirmed.length===0&&R3.cec.none&&R3.cec_log.length===1&&R3.cec_log[0].cure_status==='NONE FOUND');
const R4=await rec('I find the following contradictions: none of note.');T('2k a reply with no line in the form: nothing confirmed, error recorded, NOT CHECKED row',R4.cec.confirmed.length===0&&R4.cec.errors.length===1&&R4.cec_log[0].cure_status==='NOT CHECKED');
const R5=(await run(code(PAR,'Close Enforcer Record'),{'Close Enforcer Build':[J(B)],'Close Enforcer Call deepseek':[J({error:{message:'timeout'}})]},'Close Enforcer Call deepseek'))[0].json;
T('2l a failed call: nothing confirmed, the error is recorded, the run goes on',R5.cec.confirmed.length===0&&/timeout/.test(R5.cec.errors[0]||''));
const R6=await rec(L1+'\n'+L1.replace('NEW','NEW2'));T('2m the same link confirmed twice: one break',R6.cec.confirmed.length===1&&/already broken/.test(R6.cec.rows[1].note||''));
const R7=await rec('**'+L1+'**');T('2n bold marks around the line are read',R7.cec.confirmed.length===1);
const R8=await rec(L1.replace('NEW','X1'),BO);T('2o candidate X1 answered and confirmed; X2 unanswered: NO ANSWER row',R8.cec.confirmed.length===1&&R8.cec.confirmed[0].id==='X1'&&JSON.stringify(R8.cec.no_answer)==='["X2"]'&&R8.cec_log.some(r=>r.item==='X2'&&r.cure_status==='NO ANSWER'));
const R9=(await run(code(PAR,'Close Enforcer Record'),{'Close Enforcer Build':[J(BS)]},'Close Enforcer Build'))[0].json;T('2p skipped build: Record says NOT CHECKED with the reason',R9.cec.skipped&&R9.cec_log[0].cure_status==='NOT CHECKED');
const CER=[J(R1)];
// ---------- 3. shown to the judges (Panel Build, Build Independent Verdict) ----------
for(const nm of ['Panel Build','Build Independent Verdict']){
 const a=JSON.stringify(await run(code(SJR,nm),{})),b=JSON.stringify(await run(code(PAR,nm),{}));T('3a '+nm+': with no Close Enforcer Record the output equals the base node byte for byte',a===b);
 const c=JSON.stringify(await run(code(PAR,nm),{'Close Enforcer Record':CER}));const k=c.indexOf('[CONFIRMED CLOSING CONTRADICTIONS');
 T('3b '+nm+': the judges read CONFIRMED CLOSING CONTRADICTIONS after the defender\'s [CR4], with both quotes and LINK 6 BROKEN',k>0&&c.includes('DEFENDER LINK 6 (D6)')&&c.includes('This link is BROKEN by the contradiction rule')&&c.slice(k-4000,k).includes('no biological father')&&c.indexOf('[DR4] CHALLENGER R4')>k,'block at '+k);
 T('3c '+nm+': the challenger gets no block (no challenger contradiction confirmed)',(c.match(/\[CONFIRMED CLOSING CONTRADICTIONS/g)||[]).length===(nm==='Panel Build'?3:1)||(c.match(/\[CONFIRMED CLOSING CONTRADICTIONS/g)||[]).length>=1,(c.match(/\[CONFIRMED CLOSING CONTRADICTIONS/g)||[]).length+' block(s), one per judge body');}
// ---------- 4. the default break in the recompute (library) ----------
const PCC=async(lib,over)=>(await run(strip(lib,'Panel_Cure_Check.js'),over||{},'Panel Cure Needed?'))[0].json;
const P0=await PCC('SJR'),P1=await PCC('CEC');T('4a Panel Cure Check, no Close Enforcer Record: strip_CEC equals strip_SJR byte for byte',JSON.stringify(P0)===JSON.stringify(P1));
const P2=await PCC('CEC',{'Close Enforcer Record':CER});
for(const [i,s] of P2.summary.entries()){const b=JSON.parse(P2.bodies[i]).payload;const raw=b.verdict_raw.replace(/\\n/g,'\n');
 const d6=raw.split('\n').filter(l=>/^\W*D6 vs C\d/.test(l));
 T('4b seat '+s.seat+': every D6 collision line reads DEFENDER LINK BROKEN with the AUDIT line; verdict BROKEN, RESULT CHALLENGER WINS',d6.length>=2&&d6.every(l=>/: DEFENDER LINK BROKEN -- \[AUDIT: LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- DEFENDER -- EARLIER \[CR3\]/.test(l))&&b.verdict_tag==='BROKEN'&&/RESULT: CHALLENGER WINS/.test(raw)&&s.recomputed&&s.recomputed.trigger.filter(t=>/^CLOSE-CONTRADICTION D6 vs/.test(t)).length===d6.length,
  'verdict '+b.verdict_tag+', defense '+b.defense_standing+'; trigger: '+s.recomputed.trigger.filter(t=>/CLOSE/.test(t)).join('; '));
 const o=JSON.parse(P0.bodies[i]).payload;const keep=raw.split('\n').filter(l=>/^\W*D[1-5] vs C\d/.test(l)).join('\n'),keep0=o.verdict_raw.replace(/\\n/g,'\n').split('\n').filter(l=>/^\W*D[1-5] vs C\d/.test(l)).join('\n');
 T('4c seat '+s.seat+': the other links\' collision lines are unchanged',keep===keep0);}
T('4d no judge item is raised and no seat is removed by the break (summary cure rows, alt_needed and enforcer_log equal)',JSON.stringify(P2.summary.map(s=>s.cure))===JSON.stringify(P0.summary.map(s=>s.cure))&&P2.alt_needed===P0.alt_needed&&JSON.stringify(P2.enforcer_log)===JSON.stringify(P0.enforcer_log));
// challenger break; both sides on one line; a link no line names
const ch=x=>[J({cec:{confirmed:x}})];const cx=(side,link)=>({id:'NEW',side,link,earlier_round:side==='DEFENDER'?'CR3':'DR3',earlier_q:'earlier words',closing_round:side==='DEFENDER'?'CR4':'DR4',closing_q:'closing words',why:'test'});
const P3=await PCC('CEC',{'Close Enforcer Record':ch([cx('CHALLENGER',1)])});{const b=JSON.parse(P3.bodies[0]).payload;const raw=b.verdict_raw.replace(/\\n/g,'\n');const c1=raw.split('\n').filter(l=>/^\W*D\d+ vs C1\b/.test(l));
 T('4e a challenger break (C1): every Dn vs C1 line reads CHALLENGER LINK BROKEN; the defender\'s chain is not broken by it',c1.length>=3&&c1.every(l=>/: CHALLENGER LINK BROKEN -- \[AUDIT: LINK 1 BROKEN/.test(l))&&b.verdict_tag!=='BROKEN'&&b.challenge_standing==='PROP-DEPENDENT','luna: verdict '+b.verdict_tag+', challenge '+b.challenge_standing+', '+c1.length+' lines');}
const P4=await PCC('CEC',{'Close Enforcer Record':ch([cx('DEFENDER',6),cx('CHALLENGER',6)])});{const s=P4.summary[0];const raw=JSON.parse(P4.bodies[0]).payload.verdict_raw.replace(/\\n/g,'\n');
 T('4f both sides on one line (D6 vs C6): the defender\'s break holds, the challenger\'s is named in the trigger',/D6 vs C6[^\n]*: DEFENDER LINK BROKEN/.test(raw)&&s.recomputed.trigger.some(t=>/CLOSE-CONTRADICTION D6 vs C6 \(CHALLENGER break not set/.test(t)),s.recomputed.trigger.filter(t=>/C6/.test(t)).join('; '));}
const P5=await PCC('CEC',{'Close Enforcer Record':ch([cx('CHALLENGER',9)])});{const s=P5.summary[0];T('4g a broken link no collision line names still counts as one broken line, and says so',s.recomputed&&s.recomputed.trigger.some(t=>/CLOSE-CONTRADICTION C9 \(no collision line names it/.test(t))&&JSON.parse(P5.bodies[0]).payload.challenge_standing==='PROP-DEPENDENT',s.recomputed&&s.recomputed.trigger.filter(t=>/C9/.test(t)).join('; '));}
// the cured line reads back as a collision line with the broken grade (so later readers, the send-back and K-RECHK see it)
{const raw=JSON.parse(P2.bodies[0]).payload.verdict_raw;const t=JSON.stringify(raw);T('4h the written line carries no unbalanced quote (JSON body still parses)',(()=>{try{JSON.parse(P2.bodies[0]);return true;}catch(e){return false;}})());}
// ---------- 5. the send-back recompute (sbApply2024, Alternate Merge Seat): a send-back cannot undo the break ----------
const AMS=async(lib,over)=>(await run(strip(lib,'Alternate_Merge_Seat.js'),over||{},'Alternate Merge 1'))[0].json;
const A0=await AMS('SJR'),A1=await AMS('CEC');T('5a Alternate Merge Seat, no Close Enforcer Record: strip_CEC equals strip_SJR',JSON.stringify(A0)===JSON.stringify(A1));
const A2=await AMS('CEC',{'Close Enforcer Record':CER});const A2b=await AMS('CEC',{'Close Enforcer Record':CER,'Panel Cure Check':[J(P2)]});
for(const [lab,A] of [['5b on the saved (uncured) seat texts',A2],['5c on the cured seat texts from 4b',A2b]]){const r=A.bodies.map(b=>JSON.parse(b).payload);
 T(lab+': after the send-back every seat still reads D6 BROKEN and verdict BROKEN',r.every(p=>p.verdict_tag==='BROKEN'&&p.verdict_raw.replace(/\\n/g,'\n').split('\n').filter(l=>/^\W*D6 vs C\d/.test(l)).every(l=>/DEFENDER LINK BROKEN/.test(l))),r.map(p=>p.verdict_tag).join(', '));}
// ---------- 6. the single judge (Cure Check) ----------
const CC=async(lib,over)=>(await run(strip(lib,'Cure_Check.js'),over||{},'Cure Needed?'))[0].json;
const C0=await CC('SJR'),C1=await CC('CEC');T('6a Cure Check, no Close Enforcer Record: strip_CEC equals strip_SJR',JSON.stringify(C0)===JSON.stringify(C1));
const C2=await CC('CEC',{'Close Enforcer Record':CER});const ivr=String(C2.independent_verdict_raw||'');
T('6b the single judge takes the same break when its text has D6 collision lines',/D6 vs C\d/.test(String(C0.independent_verdict_raw||''))?(C2.verdict_tag==='BROKEN'&&/D6 vs C\d[^\n]*DEFENDER LINK BROKEN/.test(ivr)):true,/D6 vs C\d/.test(String(C0.independent_verdict_raw||''))?'verdict '+C2.verdict_tag:'34108 single judge (terra) was unreadable: no collision lines, checked in 6c');
const EV=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Extract_Independent_Verdict.json','utf8'))[0].data.main[0];const EV2=cl(EV);
const panelRaw=JSON.parse(JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Panel_Payloads.json','utf8'))[0].data.main[0][0].json.bodies[0]).payload;
EV2[0].json.independent_verdict_raw=cureLike(panelRaw.verdict_raw);Object.assign(EV2[0].json,{verdict_tag:panelRaw.verdict_tag,defense_standing:panelRaw.defense_standing,conceded_links:panelRaw.conceded_links,challenge_standing:panelRaw.challenge_standing,challenger_conceded_links:panelRaw.challenger_conceded_links,debate_rule_violations:[]});
function cureLike(r){try{const o=JSON.parse(String(r).slice(String(r).indexOf('{'),String(r).lastIndexOf('}')+1));return String(o.reasoning||r);}catch(e){return String(r).replace(/\\n/g,'\n');}}
const C3=await CC('CEC',{'Close Enforcer Record':CER,'Extract Independent Verdict':EV2});const C3b=await CC('SJR',{'Extract Independent Verdict':EV2});
T('6c a single judge with no rule item (luna\'s text put in its place): D6 lines BROKEN, verdict BROKEN, AUDIT v25 recompute line; without the record: unchanged',C3.verdict_tag==='BROKEN'&&/D6 vs C\d[^\n]*: DEFENDER LINK BROKEN -- \[AUDIT: LINK 6/.test(C3.independent_verdict_raw)&&/RECOMPUTED AFTER CURE/.test(C3.independent_verdict_raw)&&C3b.verdict_tag===panelRaw.verdict_tag,'with: '+C3.verdict_tag+'; without: '+C3b.verdict_tag);
// ---------- 7. the log ----------
const AM=(await run(code(PAR,'Alternate Merge'),{'Close Enforcer Record':CER},'Alternate Merge Seat'))[0].json;const AM0=(await run(code(SJR,'Alternate Merge'),{},'Alternate Merge Seat'))[0].json;
console.log('   7a lengths',AM.enforcer_log.length,AM0.enforcer_log.length,AM.enforcer_log[0]&&AM.enforcer_log[0].rule);T('7a Alternate Merge adds the E-CLOSECON rows to the run\'s enforcer_log, ahead of the rest, which is unchanged',AM.enforcer_log.length===AM0.enforcer_log.length+2&&AM.enforcer_log[0].rule==='E-CLOSECON'&&JSON.stringify(AM.enforcer_log.slice(2))===JSON.stringify(AM0.enforcer_log));
// ---------- 8. rev 2 (ASK 2): judge-found contradictions confirmed after the panel ----------
const PPo=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Panel_Payloads.json','utf8'))[0].data.main[0][0].json;
const JB0=(await run(code(PAR,'Judge Contradiction Build'),{}))[0].json;
T('8a 34108 with no pre-panel record: terra\'s CONTRADICTION line ([CR3] grant against [CR4] Genesis 4:1) becomes candidate J1, named by chatgpt (terra)',!JB0.cec_skip&&JB0.cands.length>=1&&JB0.cands.some(c=>c.side==='DEFENDER'&&c.earlier_round==='CR3'&&/ordinary means/.test(c.earlier_q)&&/chatgpt/.test(c.by)),JSON.stringify(JB0.cands&&JB0.cands.map(c=>c.id+' '+c.side+' '+c.earlier_round+'>'+c.closing_round+' by '+c.by)));
T('8b the post-panel prompt answers candidates only, with the same rules',JB0.body&&JB0.body.messages[1].content.includes('Answer every candidate listed below; each was named by a judge')&&!JB0.body.messages[1].content.includes('List every sentence of the closing round')&&JB0.body.messages[1].content.includes('IS a contradiction'));
const JB1=(await run(code(PAR,'Judge Contradiction Build'),{'Close Enforcer Record':CER}))[0].json;
T('8c a pair the pre-panel enforcer already answered is not sent again (34108: no call)',JB1.cec_skip===true&&JB1.no_log===true&&/already answered/.test(JB1.why),JB1.why);
const jrec=async(txt,b)=>(await run(code(PAR,'Judge Contradiction Record'),{'Judge Contradiction Build':[J(b)],'Judge Contradiction Call deepseek':reply(txt)},'Judge Contradiction Call deepseek'))[0].json;
const JL=`CLOSE-CONTRADICTION: J1 -- DEFENDER -- LINK 1 -- CONFIRMED -- EARLIER [CR3] "${G41E}" -- CLOSING [CR4] "${G41C}" -- (written for the test only: the probe checks the path, not the reading).`;
const JR1=await jrec(JL,JB0);const{jcc,jcc_log,...rest}=JR1;
T('8d Judge Contradiction Record: J1 CONFIRMED on D1; Panel Payloads\' item passes on unchanged (Panel Cure Needed? and Panel Cure Build read it)',jcc.confirmed.length===1&&jcc.confirmed[0].link===1&&JSON.stringify(rest)===JSON.stringify(PPo)&&jcc_log.length===1&&jcc_log[0].seat==='judge contradiction enforcer',jcc_log.map(r=>r.item+': '+r.cure_status).join(' | '));
const JR2=await jrec(JL+'\n'+L1,JB0);T('8e a NEW line in the post-panel call is recorded NOT A CANDIDATE and breaks nothing',JR2.jcc.confirmed.length===1&&JR2.jcc.rows[1].status==='NOT A CANDIDATE');
const JR3=(await run(code(PAR,'Judge Contradiction Record'),{'Judge Contradiction Build':[J(JB1)]},'Judge Contradiction Build'))[0].json;
T('8f skipped (nothing new): Panel Payloads passes on, no log row',JR3.jcc.skipped&&JR3.jcc_log.length===0&&JSON.stringify((({jcc,jcc_log,...r})=>r)(JR3))===JSON.stringify(PPo));
const P6=await PCC('CEC',{'Judge Contradiction Record':[J(JR1)]});{const b=JSON.parse(P6.bodies[0]).payload;const raw=b.verdict_raw.replace(/\\n/g,'\n');const d1=raw.split('\n').filter(l=>/^\W*D1 vs C\d/.test(l));
 T('8g the recompute takes a post-panel break: every D1 line DEFENDER LINK BROKEN, verdict BROKEN',d1.length>=1&&d1.every(l=>/DEFENDER LINK BROKEN -- \[AUDIT: LINK 1 BROKEN/.test(l))&&b.verdict_tag==='BROKEN','luna: '+d1.length+' line(s), '+b.verdict_tag);}
const P7=await PCC('CEC',{'Close Enforcer Record':CER,'Judge Contradiction Record':[J(JR1)]});{const s0=P7.summary[0];T('8h both records: D6 and D1 both break; one break per link',s0.recomputed.trigger.filter(t=>/^CLOSE-CONTRADICTION D6 vs/.test(t)).length===2&&s0.recomputed.trigger.some(t=>/^CLOSE-CONTRADICTION D1 vs/.test(t)));}
const AM2=(await run(code(PAR,'Alternate Merge'),{'Close Enforcer Record':CER,'Judge Contradiction Record':[J(JR1)]},'Alternate Merge Seat'))[0].json;
T('8i Alternate Merge logs both records\' rows (2 pre-panel + 1 post-panel)',AM2.enforcer_log.length===AM0.enforcer_log.length+3&&AM2.enforcer_log.slice(0,3).every(r=>r.rule==='E-CLOSECON'));
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})().catch(e=>{console.log('PROBE ERROR',e.stack);process.exit(2);});
