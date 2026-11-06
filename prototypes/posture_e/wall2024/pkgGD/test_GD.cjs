// pkgGD test (W3 2315). Run from wall2024/ after the pkgGD build: node pkgGD/test_GD.cjs
const fs=require('fs');const crypto=require('crypto');const {fnText}=require('./fn.cjs');
const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const plan=JSON.parse(rd('pkgGD/plan_GD.json'));
T('19 nodes: base and final shas match the plan',plan.nodes.length===19&&plan.nodes.every(n=>sha(rd(n.base))===n.base_sha&&sha(rd('pkgGD/patched/'+n.file))===n.final_sha));
T('every node parses as an n8n Code node body',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgGD/patched/'+n.file));return true;}catch(e){console.log('   '+n.file+': '+e.message);return false;}}));
// (a) one drvCheck text
const PAYS=['Panel_Payloads','Alternate_Payloads','Extract_Independent_Verdict'].map(n=>rd('pkgKIND/final/'+n+'.js'));
const PD=fnText(PAYS[0],'drvCheck'),PK=fnText(PAYS[0],'__kfHas');
T('the 3 Payloads nodes carry one drvCheck text and one __kfHas text',PAYS.every(s=>fnText(s,'drvCheck')===PD&&fnText(s,'__kfHas')===PK));
const LD=plan.nodes.map(n=>fnText(rd('pkgGD/patched/'+n.file),'drvCheck')),LK=plan.nodes.map(n=>fnText(rd('pkgGD/patched/'+n.file),'__kfHas'));
T('library drvCheck is identical to the Payloads drvCheck in all 19 nodes (diff empty; sha '+sha(PD)+')',LD.every(x=>x===PD),LD.map((x,i)=>x===PD?null:plan.nodes[i].file).filter(Boolean).join(', '));
T('__kfHas is identical to the Payloads __kfHas in all 19 nodes',LK.every(x=>x===PK));
T('before: the library drvCheck differed from Payloads in all 19 nodes (old sha '+[...new Set(plan.nodes.map(n=>n.old_drvCheck_sha))].join(',')+')',plan.nodes.every(n=>n.old_drvCheck_sha!==sha(PD)));
T('each of the 19 nodes defines drvCheck, __kfHas, prsUnprovenOnly and KF_LINE once',plan.nodes.every(n=>{const s=rd('pkgGD/patched/'+n.file);return ['function drvCheck(','function __kfHas(','function prsUnprovenOnly(','const KF_LINE='].every(k=>s.split(k).length===2);}));
T('drvCheck is called only in the 6 gate-library nodes (the 13 cure nodes define it and do not call it)',plan.nodes.every(n=>{const c=rd('pkgGD/patched/'+n.file).split('drvCheck(').length-2;return n.base.startsWith('pkgGF')?c===1:c===0;}));
// library loaders
const mk=(file,PB)=>{const AM=rd(file);const lib=AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"));if(lib.length===AM.length)throw new Error('no lib cut in '+file);
 return new Function('$','$input',lib+'\nreturn {gateCure2024,gateItems2024,gateRead2024,gateForced2024:typeof gateForced2024==="function"?gateForced2024:null,sbApply2024,drvCheck,ciRounds,gatePromptText2024,drvLinks,cureRewrite,PRS_CTX};')(n=>{if(n==='Panel Build'&&PB)return {first:()=>({json:PB})};throw new Error('offline');},null);};
const LIVE=PB=>mk('pkgG4W/patched/Alternate_Merge.js',PB),OLD=PB=>mk('pkgGF/patched/Alternate_Merge.js',PB),NEW=PB=>mk('pkgGD/patched/Alternate_Merge.js',PB);
// (a) unit: a BROKEN line with a FORCED line beside it, at the gate re-read
{const O=OLD(null),N=NEW(null);
 const txt='COLLISIONS:\n- D4 vs C5 (Isaiah 7:16): DEFENDER LINK BROKEN (Commitment 5) -- GROUND: the presses "the sign is bounded by a child\'s age in Isaiah\'s day" [DR2] were left unanswered.\nFORCED: D4 vs C5 -- MEANS [DR2]: "the sign is bounded by a child\'s age in Isaiah\'s day" -- ANSWER [CR3]: "I went unto the prophetess; and she conceived, and bare a son" -- FAILS: "she conceived, and bare a son"\n';
 const run=M=>{M.PRS_CTX.R=null;const D=M.drvCheck(txt,0,0,'SELF-SUPPORTED','SELF-SUPPORTED',false,[]);return {g:(D.items||[]).filter(x=>/^K-G[14]$/.test(x.rule)).length,m:(D.marks||[]).some(x=>/ruling 411/.test(x))};};
 const a=run(O),b=run(N);T('ruling 411 at the gate: old library raises K-G1/K-G4 on a BROKEN line with its FORCED line ('+a.g+'); new raises none and marks v29 ('+b.g+', '+b.m+')',a.g>0&&b.g===0&&b.m);}
// (b) unit: the 32998 chatgpt G5 FORCED reply is written after its collision line (W1's pkgGF fixture)
{const N=NEW(null),O=OLD(null);
 const DR2='Isaiah 7:16 "For before the child shall know to refuse the evil, and choose the good" -- MEANS: the sign is bounded by a child\'s age in Isaiah\'s day. -- [L3] Isaiah 8:4 "before the child shall have knowledge to cry, My father" | PROVEN IN [Challenger R1]';
 const CR3='  - Isaiah 7:16, "For before the child shall know to refuse the evil, and choose the good". Isaiah 8:3, "I went unto the prophetess; and she conceived, and bare a son". Isaiah 8:8, "O Immanuel".';
 const R={CR1:'',CR2:'',CR3,CR4:'',DR1:'',DR2,DR3:'',DR4:''};const ctx={R,DL:[],ask:false};
 const COL='- D4 vs C5 (Isaiah 7:16): DEFENDER LINK BROKEN (Commitment 5) -- GROUND: the link cannot take the meaning.';
 const raw=JSON.stringify({verdict_tag:'BROKEN',defense_standing:'PROP-DEPENDENT',conceded_links:0,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0,reasoning:'BROKEN.\nCOLLISIONS:\n'+COL+'\n- D5 vs C6 (Luke 1:35): STANDS -- GROUND: answered.\nRESULT: CHALLENGER WINS'},null,2);
 const F={verdict_tag:'BROKEN',defense_standing:'PROP-DEPENDENT',conceded_links:0,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0};
 const x5={gid:'G1',kind:'RULE K-G4',src:'K re-read',key:'RULE|K-G4|DEFENDER|D4 VS C5',why:'w',lines:[COL],live:true};
 const FOK='FORCED: D4 vs C5 -- MEANS [DR2]: "the sign is bounded by a child\'s age in Isaiah\'s day" -- ANSWER [CR3]: "I went unto the prophetess; and she conceived, and bare a son" -- FAILS: "she conceived, and bare a son"';
 for(const [lab,reply] of [['KEEP + FORCED','GATE: G1 || KEEP || '+FOK],['CHANGE TO <FORCED line>','GATE: G1 || CHANGE TO: '+FOK+' || the link fails by meaning']]){
  const C=N.gateCure2024('chatgpt',raw,F,[],[x5],reply,ctx);const r=C.res[0];const fa=C.add.filter(z=>z.forced_add);
  T(lab+': the item is CURED and one FORCED change G1F is added',r.cured&&fa.length===1&&fa[0].sid==='G1F'&&C.add.length===1,JSON.stringify(C.add).slice(0,300));
  const A=N.sbApply2024('chatgpt',raw,F,C.add,R);const L=A.text.split('\n');const i=L.indexOf(COL);
  T(lab+': E-APPLY keeps the collision line and writes the FORCED line on the next line',i>=0&&L[i+1]==='- '+FOK.replace(/[*_`]+/g,''),i>=0?L[i+1]:'collision line missing');
  T(lab+': the verdict is unchanged (BROKEN, D4 vs C5 still DEFENDER LINK BROKEN) and G1F is listed as applied',A.fields.verdict_tag==='BROKEN'&&A.applied.includes('G1F')&&!A.items.length,JSON.stringify(A.fields)+' '+A.applied);
  const W=N.cureRewrite(raw,true,A,'chatgpt',F);const j=JSON.parse(W.slice(0,W.indexOf('\n[AUDIT')));
  T(lab+': the stored judgment (cureRewrite) carries the FORCED line after the collision line',j.reasoning.includes(COL+'\n- '+FOK));
  const D=(M=>{M.PRS_CTX.R=null;return M.drvCheck(A.text,0,0,'PROP-DEPENDENT','SELF-SUPPORTED',false,[]);})(N);
  T(lab+': drvCheck on the corrected text raises no K-G4 on D4 vs C5',!(D.items||[]).some(x=>x.rule==='K-G4'&&/D4 VS C5/i.test(String(x.link))));}
 {const C=O.gateCure2024('chatgpt',raw,F,[],[x5],'GATE: G1 || CHANGE TO: '+FOK+' || r',ctx);const A=O.sbApply2024('chatgpt',raw,F,C.add,R);
  T('base (pkgGF): CHANGE TO <FORCED line> replaced the collision line (the grade was lost)',!A.text.includes(COL));}
 {const C=N.gateCure2024('chatgpt',raw,F,[],[x5],'GATE: G1 || KEEP || '+FOK.replace('I went unto the prophetess; and she conceived','the prophetess bare a son after she conceived'),ctx);
  T('a FORCED line that fails K-F adds nothing and stays UNCURED',!C.res[0].cured&&!C.add.length);}
 {const C=N.gateCure2024('chatgpt',raw,F,[],[x5],'GATE: G1 || KEEP || '+FOK.replace('D4 vs C5','D5 vs C6'),ctx);
  T('a FORCED line for another link adds nothing',!C.add.length);}
 {const A=N.sbApply2024('chatgpt',raw,F,[{seat:'chatgpt',sid:'G9F',ans:'CHANGE',line:'- D7 vs C1: DEFENDER LINK BROKEN',to:FOK.replace('D4 vs C5','D7 vs C1'),forced_add:true}],R);
  T('a FORCED change whose collision line is not in the text is NOT APPLIED (recorded)',A&&A.items.length===1&&A.items[0].kind==='NOT APPLIED'&&!A.text.includes('D7 vs C1 --'));}
 {const C=N.gateCure2024('chatgpt',raw,F,[],[x5],'GATE: G1 || KEEP || '+FOK,ctx);const A=N.sbApply2024('chatgpt',raw,F,C.add.concat(C.add),R);
  T('the same FORCED line twice is written once',A.text.split(FOK).length===2);}
 {const S=[{seat:'chatgpt',sid:'S1',ans:'CHANGE',line:COL,to:'D4 vs C5 (Isaiah 7:16): DEFENDER LINK BROKEN (Commitment 5) -- GROUND: rewritten ground.'}];
  const C=N.gateCure2024('chatgpt',raw,F,S,[x5],'GATE: G1 || KEEP || '+FOK,ctx);const A=N.sbApply2024('chatgpt',raw,F,S.concat(C.add),R);const L=A.text.split('\n');const i=L.findIndex(l=>l.includes('rewritten ground'));
  T('after a send-back rewrite of the collision line, the FORCED line follows the rewritten line; both S1 and G1F are applied',i>=0&&L[i+1]==='- '+FOK&&A.applied.includes('S1')&&A.applied.includes('G1F'),i>=0?L[i+1]:'none');}
 {const sb=[{seat:'chatgpt',sid:'S1',ans:'CHANGE',line:COL,to:'D4 vs C5 (Isaiah 7:16): STANDS -- GROUND: answered.'}];
  const a=O.sbApply2024('chatgpt',raw,F,sb,R),b=N.sbApply2024('chatgpt',raw,F,sb,R);T('a send-back change with no forced_add flag applies as before',a.text===b.text&&JSON.stringify(a.fields)===JSON.stringify(b.fields));}}
// (c) replay of every gate item: 32949/32973 and 32980 (gate items computed; no gate ran live), 32985 (no gate ran), 32998 (live gate, replies stored)
const out=[];const say=s=>{out.push(s);};
const diffItems=(a,b)=>{const ka=new Map(a.map(x=>[x.key,x])),kb=new Map(b.map(x=>[x.key,x]));const drop=a.filter(x=>!kb.has(x.key)),add=b.filter(x=>!ka.has(x.key));return {drop,add};};
let changed=0,total=0,outside=0;
{const {runs}=require('../pkgGATE/run_probe.cjs');const PBF={'32949':JSON.parse(rd('pkgGD/fixture_pb_32949.json')),'32973':JSON.parse(rd('pkgGD/fixture_pb_32973.json'))};
 for(const r of runs){const O=OLD(r.PB),N=NEW(r.PB);for(const b of r.bodies){const its=r.SB.filter(x=>x.seat===b.seat&&x.run===b.run);
  const PBx=r.PB||PBF[b.run]||null;let j=PBx&&PBx.judges.find(q=>q.seat===b.seat);const alt=!j&&!!PBx;if(alt)j=PBx.judges[0]; /* an alternate seat reads the same debate rounds; a panel judge's prompt carries them */const PT=j?N.gatePromptText2024(j.body):'';const ctx={R:PT?N.ciRounds(PT):null,DL:PT?N.drvLinks(PT):[],ask:PT.includes('CITATION CHECK')};
  const a=O.gateItems2024(b.seat,b.verdict_raw,b.fields,its,ctx),c=N.gateItems2024(b.seat,b.verdict_raw,b.fields,its,ctx);total+=a.items.length;
  const d=diffItems(a.items,c.items);say(b.run+' '+b.seat+': gate items old '+a.items.length+', new '+c.items.length+(ctx.R?'; rounds read'+(alt?' from a panel judge\'s prompt (alternate seat)':''):'; ROUNDS NOT READ'));
  for(const x of d.drop){changed++;const ex=/ruling 398/.test(JSON.stringify(c))?'398':'?';say('   DROPS '+x.kind+' ['+x.src+'] '+x.key+' -- line: '+String((x.lines||[])[0]||'').slice(0,300));}
  for(const x of d.add){changed++;outside++;say('   NEW   '+x.kind+' ['+x.src+'] '+x.key+' -- '+String(x.why).slice(0,300));}}}}
say('32985: no gate ran (n8n execution 32985 has no Gate Build or Gate Record data; debate_enforcer_log has no E-GATE row for ODV1-32985-1fvddvps).');
{const FX=JSON.parse(rd('pkgGD/fixture_32998.json'));const kd=r=>r.gid+'|'+r.kind+'|'+r.src;
 for(const [role,X] of [['panel',FX],['alternate',FX.alt]]){const L=LIVE(X.PB),O=OLD(X.PB),N=NEW(X.PB);
  for(const b of X.bodies){const its=X.sb_items.filter(x=>x.seat===b.seat);if(!its.length){say('32998 '+b.seat+' ('+role+'): no send-back answer, no gate');continue;}
   const j=X.PB.judges.find(q=>q.seat===b.seat);const PT=j?N.gatePromptText2024(j.body):'';const ctx={R:PT?N.ciRounds(PT):null,DL:PT?N.drvLinks(PT):[],ask:PT.includes('CITATION CHECK')};
   const l=L.gateItems2024(b.seat,b.verdict_raw,b.fields,its,ctx),a=O.gateItems2024(b.seat,b.verdict_raw,b.fields,its,ctx),c=N.gateItems2024(b.seat,b.verdict_raw,b.fields,its,ctx);total+=a.items.length;
   const live=(X.gate_report.find(z=>z.seat===b.seat)||{items:[]}).items;
   T('32998 '+b.seat+': the live library (pkgG4W, be10d6ae) reproduces the live gate items ('+(live.map(z=>z.gid+' '+z.kind).join(', ')||'none')+')',JSON.stringify(l.items.map(kd))===JSON.stringify(live.map(kd)));
   const d=diffItems(a.items,c.items);say('32998 '+b.seat+' ('+role+'): gate items on the stack head (pkgGF) '+a.items.length+' ['+a.items.map(z=>z.kind+' '+z.src).join('; ')+'], on pkgGD '+c.items.length);
   for(const x of d.drop){changed++;say('   DROPS '+x.kind+' ['+x.src+'] '+x.key+' -- line: '+String((x.lines||[])[0]||'').slice(0,400));}
   for(const x of d.add){changed++;outside++;say('   NEW   '+x.kind+' ['+x.src+'] '+x.key+' -- '+String(x.why).slice(0,300));}
   const rep=X.gate_replies[b.seat];if(rep&&l.items.length){const G=l.items;const cl=L.gateCure2024(b.seat,b.verdict_raw,b.fields,its,G,rep,ctx),ca=O.gateCure2024(b.seat,b.verdict_raw,b.fields,its,G,rep,ctx),cb=N.gateCure2024(b.seat,b.verdict_raw,b.fields,its,G,rep,ctx);
    const lv=X.gate_live.filter(z=>z.seat===b.seat);const st=r=>r.cured?'CURED':'UNCURED';
    T('32998 '+b.seat+': the live library reproduces the live gate decisions',cl.res.length===lv.length&&cl.res.every((r,i)=>st(r)===lv[i].cure_status));
    say('   the stored gate reply, decided on the live items:');
    ca.res.forEach((r,i)=>{const s=cb.res[i];const t=r.gid+' '+r.kind+' ('+r.src+'): live '+lv[i].cure_status+', pkgGF '+st(r)+', pkgGD '+st(s);
     if(r.cured!==s.cured){changed++;outside++;say('   CHANGES '+t+' -- pkgGD reason: '+s.why);}else say('   same    '+t+(st(r)!==lv[i].cure_status?' (live to pkgGF: '+r.why+')':''));});
    say('   uncured counted: live '+cl.uncured+', pkgGF '+ca.uncured+', pkgGD '+cb.uncured+'; FORCED lines added by pkgGD: '+cb.add.filter(z=>z.forced_add).length);}}}}
T('replay: no new gate item appears under the new library',outside===0);
console.log('\n--- replay (old = pkgGF library, new = pkgGD library) ---\n'+out.join('\n')+'\n--- '+total+' gate items replayed (old library), '+changed+' change ---');
console.log('\n'+ok+' OK, '+bad+' FAIL');
