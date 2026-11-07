// pkgEB7 test. Run from wall2024/: node pkgEB7/test_EB7.cjs
// A. Builds (main, Alt), every saved run: base (pkgEAI/patched_on_pkgEID) vs patched. Every old id is unchanged; E-B7 items listed.
// B. Records: on the saved replies, every old row is unchanged and the E-B7 rows read NO VERDICT; with synthetic replies, SAME GROUND -> DISAGREE,
//    DISAGREE + DIFFERENT GROUND -> CONTRADICTED (not sent), AGREE -> AGREE.
// C. Send Back Build: saved runs byte-equal to base (pkgL1Q/patched); with the synthetic DISAGREE, the E-B7 item carries b7 and the rule note.
// D. Send Back Record: saved runs equal to base; B7.cure units; synthetic replies: an uncured E-B7 adds 1 to drv_uncured with AUDIT v51; a cured one does not.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const EB=process.env.EB||'pkgEAI/patched_on_pkgEID/',SB=process.env.SB||'pkgL1Q/patched/',P=__dirname+'/'+(process.env.PD||'patched')+'/';const rf=(d,n)=>fs.readFileSync(d+n.replace(/ /g,'_')+'.js','utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;log('FAIL '+m);}};
const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'?undefined:v);
const runs=fs.readdirSync(D).filter(f=>/^\d+_Judge_Enforcer_Build\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();
const SIDES=[['','Judge Enforcer Build','Enforcer Record','Judge Enforcer Record','Judge Enforcer Call deepseek','Send Back Build','Send Back Record','Send Back Call openrouter'],
 ['Alt ','Alt Judge Enforcer Build','Alt Seated','Alt Judge Enforcer Record','Alt Judge Enforcer Call deepseek','Alt Send Back Build','Alt Send Back Record','Alt Send Back Call openrouter']];
let nB7=0;let synthDone=false;
for(const RUN of runs)for(const [pre,jb,jbi,jr,jri,sbb,sbr,sbri] of SIDES){
 if(!fs.existsSync(D+RUN+'_'+jb.replace(/ /g,'_')+'.json'))continue;
 // ---- A
 let b0,b1;try{b0=harness(RUN)(rf(EB,jb),jbi);b1=harness(RUN)(rf(P,jb),jbi);}catch(e){T(false,RUN+' '+jb+' threw '+String(e.message).slice(0,120));continue;}
 const I0=b0.flatMap((x,ci)=>(x.json.ids||[]).map(y=>({...y,ci}))),I1=b1.flatMap((x,ci)=>(x.json.ids||[]).map(y=>({...y,ci})));const S=I1.filter(y=>y.rule==='E-B7');
 const old1=I1.filter(y=>y.rule!=='E-B7');const oldEq=old1.length===I0.length&&old1.every((y,k)=>st(y)===st(I0[k]));
 T(oldEq&&b1.length<=8&&(((b1[0]||{}).json||{}).not_checked||[]).length===(((b0[0]||{}).json||{}).not_checked||[]).length,RUN+' '+jb+': old ids '+I0.length+' unchanged, calls '+b0.length+' -> '+b1.length+', E-B7 items '+S.length);
 nB7+=S.length;for(const y of S)log('E-B7 '+RUN+' '+pre+y.seat+' '+y.item+' | count: '+y.b7.seg.slice(0,140)+' | MEANS: '+(y.b7.means[0]||'').slice(0,100));
 // ---- B: saved replies
 const haveR=fs.existsSync(D+RUN+'_'+jri.replace(/ /g,'_')+'.json');if(!haveR)continue;
 let r0,r1;try{r0=harness(RUN,{[jb]:b0})(rf(EB,jr),jri);r1=harness(RUN,{[jb]:b1})(rf(P,jr),jri);}catch(e){T(false,RUN+' '+jr+' threw '+String(e.message).slice(0,120));continue;}
 const rows=r=>(r[0].json.enf428_rows||[]);const R0=rows(r0),R1=rows(r1);const R1o=R1.filter(x=>x.rule!=='E-B7');
 const keyRow=x=>st({...x,prompt_sent:null});
 const sameOld=R1o.length===R0.length&&R1o.every((x,k)=>keyRow(x)===keyRow(R0[k])); /* the prompt of a call that gained an item differs; the rows do not */
 T(sameOld&&R1.filter(x=>x.rule==='E-B7').every(x=>/^ENFORCER NO VERDICT/.test(x.cure_reason)),RUN+' '+jr+': '+R0.length+' old rows unchanged, '+(R1.length-R1o.length)+' E-B7 rows NO VERDICT on the saved replies');
 // ---- C: saved runs, Send Back Build equal to base
 if(fs.existsSync(D+RUN+'_'+sbb.replace(/ /g,'_')+'.json')){let s0,s1,e0=null,e1=null;try{s0=harness(RUN)(rf(SB,sbb),jr);}catch(e){e0=String(e.message).slice(0,100);}try{s1=harness(RUN)(rf(P,sbb),jr);}catch(e){e1=String(e.message).slice(0,100);}
  T(e0===e1&&(e0||st(s0)===st(s1).replace(/,"b7":null/g,'')),RUN+' '+sbb+': saved run equal to base (the new b7:null field aside)'+(e0?' (both: '+e0+')':''));}
 if(fs.existsSync(D+RUN+'_'+sbri.replace(/ /g,'_')+'.json')&&fs.existsSync(D+RUN+'_'+sbb.replace(/ /g,'_')+'.json')){let s0,s1,e0=null,e1=null;try{s0=harness(RUN)(rf(SB,sbr),sbri);}catch(e){e0=String(e.message).slice(0,100);}try{s1=harness(RUN)(rf(P,sbr),sbri);}catch(e){e1=String(e.message).slice(0,100);}
  const norm=x=>st(x).replace(/,"b7_counted":\[\]/g,'');T(e0===e1&&(e0||norm(s0)===norm(s1)),RUN+' '+sbr+': saved run equal to base (b7_counted [] aside)'+(e0?' (both: '+e0+')':''));}
 // ---- B/C/D synthetic, once per side on the newest run with E-B7 items and saved send-back data
 if(S.length<2||!fs.existsSync(D+RUN+'_'+sbri.replace(/ /g,'_')+'.json'))continue;
 const calls=JSON.parse(fs.readFileSync(D+RUN+'_'+jri.replace(/ /g,'_')+'.json','utf8'));const raw=(Array.isArray(calls)?calls[0]:calls);
 const items0=harness(RUN)('return $input.all();',jri);const rep=items0.map(x=>JSON.parse(JSON.stringify(x)));
 const add=(ci,line)=>{while(rep.length<=ci)rep.push({json:{choices:[{message:{content:''},finish_reason:'stop'}]}});const m=rep[ci].json.choices[0].message;m.content=String(m.content||'')+'\n'+line;};
 const [s1,s2,s3]=S;add(s1.ci,'ENFORCER: '+s1.id+' -- DISAGREE -- RIGHT: SAME GROUND -- the premise "test" and the MEANS "test" are one fact.');
 add(s2.ci,'ENFORCER: '+s2.id+' -- DISAGREE -- RIGHT: DIFFERENT GROUND -- the press is about another fact.');if(s3)add(s3.ci,'ENFORCER: '+s3.id+' -- AGREE -- RIGHT: DIFFERENT GROUND -- another fact.');
 const rs=harness(RUN,{[jb]:b1,[jri]:rep})(rf(P,jr),jri);const RR=rs[0].json.enf428_rows;const f=id=>RR.find(x=>x.rule==='E-B7'&&x.item===I1.find(y=>y.id===id).item&&x.seat===I1.find(y=>y.id===id).seat);
 T(/^ENFORCER DISAGREE \(right: SAME GROUND\)/.test(f(s1.id).cure_reason),RUN+' '+pre+'synthetic SAME GROUND -> DISAGREE');T(/^ENFORCER CONTRADICTED/.test(f(s2.id).cure_reason),RUN+' '+pre+'synthetic DISAGREE + DIFFERENT GROUND -> CONTRADICTED, not sent');
 if(s3)T(/^ENFORCER AGREE/.test(f(s3.id).cure_reason),RUN+' '+pre+'synthetic AGREE');T(rs[0].json.enf428.tally['E-B7'].DISAGREE===1,RUN+' '+pre+'tally E-B7 DISAGREE 1');
 // C synthetic
 let sb;try{sb=harness(RUN,{[jb]:b1,[jr]:rs})(rf(P,sbb),jr);}catch(e){T(false,RUN+' '+sbb+' synthetic threw '+String(e.message).slice(0,140));continue;}
 const seatOut=sb.find(o=>(o.json.items||[]).some(i=>i.rule==='E-B7'));const it=seatOut&&seatOut.json.items.find(i=>i.rule==='E-B7');
 T(!!it&&it.b7&&+it.b7.n===+s1.b7.n&&/THE SELF-CONTRADICTION RULE \(E-B7, ENFORCED, pkgEB7/.test(seatOut.json.msg)&&sb.every(o=>(o.json.items||[]).filter(i=>i.rule==='E-B7').length<=1),RUN+' '+pre+'Send Back Build: one E-B7 item ('+(it&&it.sid)+', seat '+(seatOut&&seatOut.json.seat)+') with b7 and the note; the CONTRADICTED row is not sent');
 if(!it)continue;if(!synthDone)log('NOTE TEXT: '+seatOut.json.msg.split('\n').find(l=>/SELF-CONTRADICTION RULE/.test(l)).slice(0,900));
 // D synthetic: every item KEEP with a plain sentence; E-B7 then uncured -> counted
 const mkReply=(txt)=>sb.map(o=>({json:{choices:[{message:{content:(o.json.items||[]).map(i=>'SENDBACK: '+i.sid+' || KEEP || '+(i.rule==='E-B7'?txt:'"the words decide it"')).join('\n')},finish_reason:'stop'}]}}));
 const sbrRun=txt=>harness(RUN,{[sbb]:sb,[jr]:rs,[sbri]:mkReply(txt)})(rf(P,sbr),sbri);
 let d1;try{d1=sbrRun('I keep both.');}catch(e){T(false,RUN+' '+sbr+' synthetic threw '+String(e.message).slice(0,160));continue;}
 const j1=d1[0].json;const bd=(j1.bodies||[]).map(x=>JSON.parse(x).payload).find(p=>p.judge_seat===seatOut.json.seat);
 const base1=harness(RUN,{[sbb]:sb,[jr]:rs,[sbri]:mkReply('I keep both.')})(rf(SB,sbr),sbri)[0].json;const bb0=(base1.bodies||((harness(RUN)('return $(\'Panel Cure Check\').first().json;','Panel Cure Check')||{}).bodies)||[]).map(x=>JSON.parse(x).payload).find(p=>p.judge_seat===seatOut.json.seat);
 T(j1.sendback.b7_counted.length===1&&bd&&/AUDIT v51: SELF-CONTRADICTION UNCURED/.test(bd.verdict_raw)&&bb0&&bd.drv_uncured===(bb0.drv_uncured||0)+1,RUN+' '+pre+'Send Back Record: a KEEP without the quotes is UNCURED, counted once (drv_uncured '+(bb0&&bb0.drv_uncured)+' -> '+(bd&&bd.drv_uncured)+'), AUDIT v51');
 const q1=String(it.b7.entry).split(/\s+/).filter(Boolean).slice(1,9).join(' '),q2=String(it.b7.means[0]||'').split(/\s+/).filter(Boolean).slice(0,8).join(' ');
 const d2=sbrRun('The premise reads "'+q1+'", while the press reads "'+q2+'"; these are two grounds.')[0].json;const row=d2.sb_rows.find(r=>r.rule==='E-B7');
 if(!(d2.sendback.b7_counted.length===0&&/CURED/.test(row.cure_reason)))log('DBG q1='+q1+' | q2='+q2+' | '+String(row.cure_reason).slice(-400));T(d2.sendback.b7_counted.length===0&&/CURE \(SELF-CONTRADICTION ENFORCED, pkgEB7\): CURED/.test(row.cure_reason),RUN+' '+pre+'Send Back Record: a KEEP quoting the premise and the MEANS is CURED, not counted');
 synthDone=true;}
// D units
{const s=fs.readFileSync(P+'Send_Back_Record.js','utf8');const i=s.indexOf('const B7=(()=>{');const B7=new Function(s.slice(i,s.indexOf('return {LIVE,cure};})();',i)+'return {LIVE,cure};})();'.length)+'\nreturn B7;')();
 const it={b7:{side:'DEFENDER',n:5,refs:['luke 1:27'],verses:'Luke 1:27',round:'CR',entry:'5. ASSUMES: Mary is of the house of David -- ROWS GIVE: Luke 1:27 gives the house of David to Joseph',means:['the woman addressed is an espoused wife of David\'s house']}};
 T(B7.cure(it,{ans:'NO ANSWER'}).status==='UNCURED','U1 no answer');
 T(B7.cure(it,{ans:'CHANGE',to:'CONCEDED LINKS: 1 -- premise 2 UNEXHIBITED (Luke 2:4); premise 5 SPARED'}).status==='CURED','U2 CONCEDED LINKS without premise 5 UNEXHIBITED');
 T(B7.cure(it,{ans:'CHANGE',to:'CONCEDED LINKS: 2 -- premise 5 UNEXHIBITED (Luke 1:27)'}).status==='UNCURED','U3 still UNEXHIBITED');
 T(B7.cure(it,{ans:'CHANGE',to:'CHALLENGER CONCEDED LINKS: 0 -- none'}).status==='UNCURED','U4 the other side\'s line');
 T(B7.cure(it,{ans:'CHANGE',to:'ANSWER CHECK: Luke 1:27 -- [CR3] -- MEANS: "x" -- ANSWER: "y" -- MISSES -- it does not fit'}).status==='CURED','U5 ANSWER CHECK regraded MISSES');
 T(B7.cure(it,{ans:'CHANGE',to:'ANSWER CHECK: Luke 1:27 -- [DR3] -- MEANS: "x" -- ANSWER: "y" -- MISSES'}).status==='UNCURED','U6 the other side\'s answer');
 T(B7.cure(it,{ans:'CHANGE',to:'ANSWER CHECK: Luke 2:4 -- [CR3] -- MEANS: "x" -- ANSWER: "y" -- MISSES'}).status==='UNCURED','U7 another verse');
 T(B7.cure(it,{ans:'CHANGE',to:'ANSWER CHECK: Luke 1:27 -- [CR3] -- MEANS: "x" -- ANSWER: "y" -- MEETS'}).status==='UNCURED','U8 still MEETS');
 T(B7.cure(it,{ans:'KEEP',why:'The premise says "Mary is of the house of David" and the press says "the woman addressed is an espoused wife"; two grounds.'}).status==='CURED','U9 KEEP quoting both');
 T(B7.cure(it,{ans:'KEEP',why:'The premise says "Mary is of the house of David"; two grounds.'}).status==='UNCURED','U10 KEEP quoting the premise only');}
log('E-B7 items over all saved runs: '+nB7);log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_EB7.txt',out.join('\n')+'\n');
