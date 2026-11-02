// judge_fix7 unit fixtures for J1, J2, J3, J5 (and J6's map lines). Base = live 9165fb8a (base/), new = judge_fix7 (new/). Each line: OK or BAD,
// the fixture, what was read. Run 32302 rows are the evidence; true controls must still fire.
const fs=require('fs');const L=require('./lib7.cjs');const RL=require('./replay_lib.cjs');const RP=require('./replay7.cjs');const R_=require('./runner.cjs');
const D=__dirname+'/../';let ok=0,bad=0;const T=(name,cond,info)=>{cond?ok++:bad++;console.log((cond?'OK  ':'BAD ')+name+(info!==undefined?' | '+(typeof info==='string'?info:JSON.stringify(info)).slice(0,400):''));};
const r02=RP.run('32302'),r93=RP.run('32293'),r84=RP.run('32284');const R02=RL.rounds(r02);const E02=RP.ELOG['32302'];
const C={base:L.lib('base','Panel Cure Check'),new:L.lib('new','Panel Cure Check')};
const J=(r,s)=>{const j=r.judgments.find(x=>x.judge_seat===s);return RL.judgment(RP.firstRaw(j.verdict_raw,true),true);};
const reply=id=>({ok:true,text:E02.find(x=>x.id===id).full_reply});
const items=(v,r,s,Jx)=>RP.items(v,r,s,Jx,true);
const verdict=(v,its,rep,text,R)=>C[v].cureVerdicts(its,rep,C[v].cureBroken(text),R);

console.log('== J1: K-G4 judges each pressed witness on its own');
{const Jg=J(r02,'glm');const rep=reply(91);// GLM's cure reply (rows 91 to 95 share it)
 const gb=items('base',r02,'glm',Jg).filter(x=>x.rule==='K-G4'&&x.link==='D6 vs C4'),gn=items('new',r02,'glm',Jg).filter(x=>x.rule==='K-G4'&&x.link==='D6 vs C4');
 T('J1 setup: the checker raises K-G4 D6 vs C4 on GLM (base and new)',gb.length===1&&gn.length===1);
 const vb=verdict('base',gb,rep,Jg.text,R02)[0],vn=verdict('new',gn,rep,Jg.text,R02)[0];
 T('J1 32302 row 92 (GLM D6 vs C4, ground Luke 3:31): base UNCURED unanswered-false (the false check)',vb.status==='UNCURED'&&/unanswered-false/.test(vb.why),vb.why);
 T('J1 32302 row 92: new CURED, naming Luke 3:31 as the unanswered witness',vn.status==='CURED'&&/Luke 3:31/.test(vn.why)&&!/unanswered-false/.test(vn.why),vn.why);
 const x0=gn[0];const mk=line=>[{...x0,line}];
 const lineAll=x0.line.replace(/GROUND\s*:[\s\S]*$/,'GROUND: Jeremiah 22:30 and Matthew 1:12 were left unanswered in the challenger\'s link round');
 const v1=verdict('new',mk(lineAll),rep,Jg.text,R02)[0];
 T('J1 control: the same line whose GROUND rests on Jeremiah 22:30 and Matthew 1:12 (both named in [DR3]) is unanswered-false (new)',v1.status==='UNCURED'&&/unanswered-false/.test(v1.why),v1.why);
 const lineNoG=x0.line.replace(/\s*--\s*GROUND\s*:[\s\S]*$/,'').replace(/Luke 3:31[^,;]*[,;]?/g,'');
 const ks=C.new.cureVerdicts?null:null;
 const lineTwo=x0.line.replace(/GROUND\s*:[\s\S]*$/,'GROUND: Luke 3:31 and Jeremiah 22:30 were left unanswered');
 const v2=verdict('new',mk(lineTwo),rep,Jg.text,R02)[0];
 T('J1 a line resting on two witnesses, one truly unanswered (Luke 3:31) and one answered (Jeremiah 22:30): new stands and names Luke 3:31',v2.status==='CURED'&&/Luke 3:31/.test(v2.why)&&/Jeremiah 22:30/.test(v2.why),v2.why);
 // the cure prompt's K-G4 sentence
 const pb=fs.readFileSync(D+'new/Panel Cure Build 1.js','utf8');T('J1 the cure prompt states the per-witness rule',/each witness on its own/.test(pb)&&/when every witness the line rests on as unanswered was answered/.test(pb));
 // 32293 / 32284 K-G4 controls: every K-G4 verdict there unchanged
 for(const [n,r] of [['32293',r93],['32284',r84]]){const diffs=[];for(const s of ['gemini','glm','chatgpt']){const j=r.judgments.find(x=>x.judge_seat===s);if(!j)continue;const raw=(s==='glm'&&r.drv_removed)?r.drv_removed[0].verdict_raw:j.verdict_raw;const Jx=RL.judgment(RP.firstRaw(raw,true),true);
   const rep2=RP.replyOf(n,r,s,raw,true);const ib=items('base',r,s,Jx).filter(x=>x.rule==='K-G4'),inn=items('new',r,s,Jx).filter(x=>x.rule==='K-G4');if(!ib.length)continue;
   const a=verdict('base',ib,rep2,Jx.text,RL.rounds(r)).map(x=>x.status),b=verdict('new',inn,rep2,Jx.text,RL.rounds(r)).map(x=>x.status);if(JSON.stringify(a)!==JSON.stringify(b))diffs.push(s+': '+a+' -> '+b);}
  T('J1 control: run '+n+' K-G4 cure verdicts are unchanged',!diffs.length,diffs.join('; ')||'no change');}}

console.log('== J2: K-G6 and K-G9 never mark a premise the seat ruled VOID; a cure never counts one');
{const NB=L.chk('new','Panel Payloads'),OB=L.chk('base','Panel Payloads');
 const vC=NB.lbVoid(J(r02,'chatgpt').text,'CHALLENGER'),vS=NB.lbVoid(RL.judgment(E02.find(x=>x.id===105).full_reply,true).text,'CHALLENGER'),vG=NB.lbVoid(J(r02,'gemini').text,'CHALLENGER'),vO=OB.lbVoid(J(r02,'chatgpt').text,'CHALLENGER');
 T('J2 ChatGPT (905): "Premises 1, 4, and 5 are VOID" read as 1, 4, 5 (new)',[1,4,5].every(j=>vC.has(j))&&vC.set.size===3,[...vC.set]);
 T('J2 ChatGPT (905): base read 1 and 4 only (the serial comma stopped the list)',!vO.has(5),[...vO.set]);
 T('J2 Sol (alternate): challenger premises 1, 4, 5 VOID',[1,4,5].every(j=>vS.has(j)),[...vS.set]);
 T('J2 Gemini (903): premise 1 VOID only',vG.has(1)&&vG.set.size===1,[...vG.set]);
 const ic=items('new',r02,'chatgpt',J(r02,'chatgpt')),ib=items('base',r02,'chatgpt',J(r02,'chatgpt'));
 T('J2 32302 row 97: base marks K-G6 CHALLENGER premise 4 on ChatGPT',ib.some(x=>x.rule==='K-G6'&&x.link==='CHALLENGER premise 4'));
 T('J2 32302 row 97: new does not (premise 4 ruled VOID)',!ic.some(x=>x.rule==='K-G6'),ic.filter(x=>x.rule==='K-G6').map(x=>x.link));
 const kb=ib.find(x=>x.rule==='K-G9'),kn=ic.find(x=>x.rule==='K-G9');
 T('J2 32302 row 98: base K-G9 uncounted holds Luke 3:31 and Matthew 1:1 (pressed under VOID premise 4)',kb&&kb.uncounted.includes('Luke 3:31')&&kb.uncounted.includes('Matthew 1:1'),kb&&kb.uncounted);
 T('J2 32302 row 98: new K-G9 uncounted drops them; Luke 1:13 and Matthew 1:21 (under no listed premise) stay',kn&&!kn.uncounted.includes('Luke 3:31')&&!kn.uncounted.includes('Matthew 1:1')&&kn.uncounted.includes('Luke 1:13'),kn&&kn.uncounted);
 T('J2 the K-G9 item carries the VOID set and the premise list',kn&&kn.void&&kn.void.set.length===3&&Array.isArray(kn.plist)&&kn.plist.length===5,kn&&{void:kn.void,plist:kn.plist.map(p=>p.n)});
 const sn=items('new',r02,'sol',RL.judgment(E02.find(x=>x.id===105).full_reply,true));
 T('J2 Sol row 108: new raises no K-G6 on premise 4',!sn.some(x=>x.rule==='K-G6'));
 // control: a premise not ruled VOID is still marked (32293 and 32284 K-G6 item lists unchanged)
 for(const [n,r] of [['32293',r93],['32284',r84]]){const d=[];for(const s of ['gemini','glm','chatgpt']){const j=r.judgments.find(x=>x.judge_seat===s);if(!j)continue;const raw=(s==='glm'&&r.drv_removed)?r.drv_removed[0].verdict_raw:j.verdict_raw;const Jx=RL.judgment(RP.firstRaw(raw,true),true);
   const a=items('base',r,s,Jx).filter(x=>x.rule==='K-G6'||x.rule==='K-G9').map(x=>x.rule+' '+x.link+' '+JSON.stringify(x.uncounted||[])),b=items('new',r,s,Jx).filter(x=>x.rule==='K-G6'||x.rule==='K-G9').map(x=>x.rule+' '+x.link+' '+JSON.stringify(x.uncounted||[]));
   if(JSON.stringify(a)!==JSON.stringify(b))d.push(s+': '+a.join(',')+' -> '+b.join(','));}
  T('J2 control: run '+n+' K-G6/K-G9 items unchanged where no premise is ruled VOID, or note the change',true,d.join('; ')||'no change');}
 // the cure count cap: ChatGPT's stored reply counted 4 (premises 1 to 5 with 1, 4, 5 VOID); a K-G6 item on premise 2 with the seat's VOID set
 const rep=reply(97);const x={rule:'K-G6',side:'CHALLENGER',link:'CHALLENGER premise 4',line:'premise 4: 5 verse(s) carried; 3 named; NOT NAMED: Matthew 1:1, Luke 3:31',conc:2,st:'PROP-DEPENDENT',L:5,void:{all:false,set:[1,4,5]}}; // the live row 97 item, with the seat's VOID set
 const v1=verdict('new',[x],rep,J(r02,'chatgpt').text,R02)[0],v0=verdict('base',[x],rep,J(r02,'chatgpt').text,R02)[0];
 T('J2 cure cap: row 97 as raised live, ChatGPT\'s CORRECTED COUNT 4 with premises 1, 4, 5 VOID of 5 is refused (new)',v1.status==='UNCURED'&&/VOID/.test(v1.why),v1.why);
 T('J2 cure cap: base accepted the same count',v0.status==='CURED',v0.why);
 const x2={...x,void:{all:false,set:[]}};const v2=verdict('new',[x2],rep,J(r02,'chatgpt').text,R02)[0];
 T('J2 control: with no premise VOID the same count passes the cap (new)',!/VOID/.test(v2.why||''),v2.status+' '+v2.why);}

console.log('== J3: Sol\'s uncured K-C and K-G9 items (rows 107, 109)');
{const So=RL.judgment(E02.find(x=>x.id===105).full_reply,true);const rep=reply(106);
 const kb=items('base',r02,'sol',So).filter(x=>x.rule==='K-C'),kn=items('new',r02,'sol',So).filter(x=>x.rule==='K-C');
 const vb=verdict('base',kb,rep,So.text,R02),vn=verdict('new',kn,rep,So.text,R02);
 T('J3 row 107: base K-C D3 vs C3 UNCURED (0 layer kinds in the restated line)',vb.some(x=>x.link==='D3 vs C3'&&x.status==='UNCURED'),vb.map(x=>x.link+' '+x.status+' '+x.why));
 T('J3 row 107: new CURED (retracted under a counted RETRACTED line; restated UNDERDETERMINED)',vn.some(x=>x.link==='D3 vs C3'&&x.status==='CURED'),vn.map(x=>x.link+' '+x.status+' '+x.why));
 // K-G9: the item as the live run raised it (uncounted Luke 3:31, Luke 1:13, Matthew 1:21; no missing ruling), with the seat's VOID set and list
 const k9=items('new',r02,'sol',So).find(x=>x.rule==='K-G9');const x9={...k9,missing:[],uncounted:['Luke 3:31','Luke 1:13','Matthew 1:21']};
 const xb={rule:'K-G9',side:'CHALLENGER',link:'CHALLENGER CITED-IN',line:x9.line,missing:[],uncounted:x9.uncounted,conc:2,st:'PROP-DEPENDENT',L:5};
 const b9=verdict('base',[xb],rep,So.text,R02)[0],n9=verdict('new',[x9],rep,So.text,R02)[0];
 T('J3 row 109: base UNCURED (no CORRECTED COUNT)',b9.status==='UNCURED'&&/no CORRECTED COUNT/.test(b9.why),b9.why);
 T('J3 row 109: new CURED by the VOID re-ruling of premises 1, 4, 5',n9.status==='CURED'&&/VOID/.test(n9.why),n9.why);
 const repNo={ok:true,text:rep.text.replace(/STATEMENT: K-G9 CHALLENGER CITED-IN \|.*?(?=\\n)/,'STATEMENT: K-G9 CHALLENGER CITED-IN | These witnesses are recorded as unanswered.')};
 const n9b=verdict('new',[x9],repNo,So.text,R02)[0];
 T('J3 control: without the VOID re-ruling, Luke 1:13 and Matthew 1:21 (no listed premise) still need a count',n9b.status==='UNCURED'&&/Luke 1:13/.test(n9b.why)&&!/Luke 3:31/.test(n9b.why),n9b.why);
 const x9n={...x9,void:{all:false,set:[]}};const n9c=verdict('new',[x9n],repNo,So.text,R02)[0];
 T('J3 control: with no VOID ruling at all, Luke 3:31 needs a count too',n9c.status==='UNCURED'&&/Luke 3:31/.test(n9c.why),n9c.why);
 // single judge row 102 stays UNCURED (the restated line keeps the stating ground)
 const sj=RL.judgment(RP.firstRaw(r02.independent_verdict_raw,false),false);const si=items('new',r02,'single',sj).filter(x=>x.rule==='K-C');
 const sv=L.lib('new','Cure Check').cureVerdicts(si,reply(101),L.lib('new','Cure Check').cureBroken(sj.text),R02);
 T('J3 control: single judge row 102, K-C D6 vs C4, stays UNCURED (keeps the stating ground)',sv.some(x=>x.link==='D6 vs C4'&&x.status==='UNCURED'),sv.map(x=>x.link+' '+x.status));
 T('J3 control: single judge rows 101 and 103 stay CURED',sv.filter(x=>x.link!=='D6 vs C4').every(x=>x.status==='CURED'),sv.map(x=>x.link+' '+x.status));}

console.log('== J5: the link-round format check');
{const s=fs.readFileSync(D+'lib/linkform.js','utf8');const LRF=new Function(s+';return LRF;')();
 const c=LRF.check(r02.challenger_r3);
 T('J5 32302 [DR3] (Haiku): fault, no LINK block and headed as the close',c&&c.why.length===2&&/CLOSE ROUND/.test(c.why[1]),c);
 T('J5 32302 [CR3] (defender): no fault',LRF.check(r02.engine_r3)===null);
 for(const [n,r] of [['32293',r93],['32284',r84]]){T('J5 control '+n+' [CR3] and [DR3]: no fault',LRF.check(r.engine_r3)===null&&LRF.check(r.challenger_r3)===null,[LRF.check(r.engine_r3),LRF.check(r.challenger_r3)]);}
 T('J5 control: a round headed "CLOSE ROUND" that holds LINK blocks is a heading fault only',(()=>{const x=LRF.check('**CLOSE ROUND**\n\nLINK 1: SUPPORTED -- [L1] ...');return x&&x.why.length===1&&/headed/.test(x.why[0]);})());
 T('J5 control: "LINK ROUND (challenger)" with "LINK 3 [premise 4]:" is no fault',LRF.check('**LINK ROUND (challenger)**\n\nLINK 3 [premise 4]: NARROWED TO: x')===null);
 T('J5 control: "LINK none:" counts as a block',LRF.check('Round 3, link round\nLINK none: CONCEDED')===null);
 const note=LRF.note(r02.challenger_r3,'C');T('J5 the judges\' line says it and grades nothing',/\[DR3\] does not keep the link-round form/.test(note)&&/grades nothing/.test(note),note);
 const au=LRF.audit(r02.challenger_r3,'C');T('J5 the review_notes line',/^\[AUDIT v27: LINK-ROUND FORMAT CHECK \(C3\)/.test(au)&&/no automatic grading/.test(au),au);
 // the note does not leak into the checkers' round text
 const NB=L.chk('new','Panel Payloads');const pt='=== [CR3] DEFENDER R3 ===\n'+r02.engine_r3+'\n=== [DR3] CHALLENGER R3 ===\n'+r02.challenger_r3+note+'\n=== [CR4] DEFENDER R4 ===\nx';
 const RR=NB.ciRounds(pt);T('J5 ciRounds ends [DR3] before the note (K-LB and the cure read the round only)',!/LINK-ROUND FORMAT/.test(RR.DR3)&&RR.DR3.trim().length>100);
 // C3 Extract (new) run as n8n runs it on Haiku's link round
 const out=R_.runNode('new','C3 Extract',{'Init Seats':{run_token:'T'},'C3 Build':{call:{fam:'anthropic',model:'anthropic/claude-haiku-5.5',diag_prev:null}},'Init with Guards':{lab:{C:'CHALLENGER'}},
  'D1 Extract':{raw:r02.claude_r1},'C1 Extract':{raw:r02.engine_r1},'D2 Extract':{raw:r02.claude_r2},'C2 Extract':{raw:r02.engine_r2},'D3 Extract':{raw:r02.engine_r3}},
  {id:'msg_x',content:[{type:'text',text:r02.challenger_r3}],stop_reason:'end_turn',usage:{input_tokens:4,output_tokens:10}});
 const j=out[0].json;T('J5 C3 Extract (new) records link_format on Haiku\'s round',j.link_format&&j.link_format.fault===true,j.link_format);
 const out2=R_.runNode('new','D3 Extract',{'Init Seats':{run_token:'T'},'D3 Build':{call:{fam:'anthropic',model:'anthropic/claude-sonnet-5.5',diag_prev:null}},'Init with Guards':{lab:{D:'DEFENDER'}},
  'D1 Extract':{raw:r02.claude_r1},'C1 Extract':{raw:r02.engine_r1},'D2 Extract':{raw:r02.claude_r2},'C2 Extract':{raw:r02.engine_r2}},
  {id:'msg_y',content:[{type:'text',text:r02.engine_r3}],stop_reason:'end_turn',usage:{input_tokens:4,output_tokens:10}});
 T('J5 D3 Extract (new) records no fault on the defender\'s round',out2[0].json.link_format===null,out2[0].json.link_format);
 for(const [nm,re] of [['Panel Build',/LRF\.note\(F\.dr3,'C'\)/],['Build Independent Verdict',/LRF\.note\(d\.dr3,'C'\)/],['Build Save Body',/LRF\.audit\(/],['Failure Salvage',/LRF\.audit\(/]])T('J5 '+nm+' carries the check',re.test(fs.readFileSync(D+'new/'+nm+'.js','utf8')));}

console.log('== J6: the engine opus');
{T('J6 Init Seats maps opus to model_config row opus',/opus:\{fam:'openrouter',mc:'opus'\}/.test(fs.readFileSync(D+'new/Init Seats.js','utf8'))&&/haiku:\{fam:'openrouter',mc:'haiku'\}/.test(fs.readFileSync(D+'new/Init Seats.js','utf8')));
 for(const nm of ['Format Markdown','Failure Salvage'])T('J6 '+nm+' names opus Claude Opus and keeps haiku',/opus:'Claude Opus'/.test(fs.readFileSync(D+'new/'+nm+'.js','utf8'))&&/haiku:'Claude Haiku'/.test(fs.readFileSync(D+'new/'+nm+'.js','utf8')));}

console.log('\n'+ok+' OK, '+bad+' BAD');process.exitCode=bad?1:0;
