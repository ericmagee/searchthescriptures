// ASK 400 plants (W1 8541 DoD a; W2 8549 Q1 plant; W3 8552 "Dn" in BROKEN LINES; W4 8544 items 2a to 2f).
const E0=require('./ev.cjs')(__dirname+'/../rdf/fetchback_w386.json'),E1=require('./ev.cjs')(__dirname+'/t400.json');
const F=require('./stubload400.cjs')(__dirname+'/t400.json','Alternate Merge Seat',['cureRecompute','sbApply2024','rcLines']);const F0=require('./stubload400.cjs')(__dirname+'/../rdf/fetchback_w386.json','Alternate Merge Seat',['cureRecompute','sbApply2024','rcLines']);
const H=(f,r)=>JSON.stringify({verdict_tag:f[0],defense_standing:f[1],challenge_standing:f[2],conceded_links:f[3],challenger_conceded_links:f[4],reasoning:r});
const Fo=f=>({verdict_tag:f[0],defense_standing:f[1],challenge_standing:f[2],conceded_links:f[3],challenger_conceded_links:f[4]});
const tagOf=(E,raw,f)=>E.ert386(raw,'s1',Fo(f)).split('\n').pop();const W=t=>(t.match(/WORD: ([A-Z ]+|none);/)||[])[1];const BL=t=>(t.match(/BROKEN LINES ([^;]*?)(?:, LINK STATE|, TIE|; END)/)||[])[1];
const eq=['HELD','PROP-DEPENDENT','PROP-DEPENDENT',1,1],eqB=['BROKEN','PROP-DEPENDENT','PROP-DEPENDENT',1,1],ss=['HELD','PROP-DEPENDENT','SELF-SUPPORTED',1,1];
const CP='HELD\nCOLLISION POINTS:\n';
const P=[
 ['1 prefixed long form (667 shape), BROKEN equal fields',eqB,'BROKEN\nCOLLISION POINTS:\nD1: STANDS\nD3: D3 vs C2 (John 11:48): UNDERDETERMINED -- g\nD6: WITHDRAWN\nRESULT: CHALLENGER WINS'],
 ['2 prefix label mismatch "D3: D4 vs C2"',eqB,'BROKEN\nCOLLISION POINTS:\nD3: D4 vs C2 (John 11:48): UNDERDETERMINED -- g\nRESULT: CHALLENGER WINS'],
 ['3 grade-first form (1224 shape, Q1), BROKEN',eqB,'BROKEN\nCOLLISION POINTS:\nD2: DEFENDER LINK BROKEN vs C1 (Romans 1:3): not shown -- GROUND: g\nRESULT: CHALLENGER WINS'],
 ['4 LINK STATE only, all STANDS, HELD equal fields (2c: no tie)',eq,CP+'D1: STANDS\nD2: STANDS\nRESULT: DEFENDER WINS'],
 ['5 mixed: long form D2 UND governs over "D2: DEFENDER LINK BROKEN"',eq,CP+'D1 vs C1 (John 1:1): UNDERDETERMINED -- g\nD2 vs C3 (John 1:3): UNDERDETERMINED -- g\nD2: DEFENDER LINK BROKEN -- x'],
 ['6 LINK STATE DEFENDER LINK BROKEN on HELD, with a graded collision',eq,CP+'D1 vs C1 (John 1:1): UNDERDETERMINED -- g\nD2: DEFENDER LINK BROKEN -- x'],
 ['7 LINK STATE DEFENDER LINK BROKEN on BROKEN',eqB,'BROKEN\nCOLLISION POINTS:\nD1 vs C1 (John 1:1): UNDERDETERMINED -- g\nD2: DEFENDER LINK BROKEN -- x'],
 ['8 "D2: CHALLENGER LINK BROKEN" on HELD, challenge SELF-SUPPORTED (UNREAD)',ss,CP+'D1 vs C1 (John 1:1): UNDERDETERMINED -- g\nD2: CHALLENGER LINK BROKEN -- y'],
 ['9 bare "D2: BROKEN" (UNREAD)',eq,CP+'D1 vs C1 (John 1:1): UNDERDETERMINED -- g\nD2: BROKEN -- y'],
 ['10 WITHDRAWN only',eq,CP+'D1: WITHDRAWN\nD2: WITHDRAWN'],
 ['11 LINK STATE DEFENDER LINK BROKEN outside COLLISION POINTS (not read)',eq,'HELD\nD1 vs C1 (John 1:1): UNDERDETERMINED -- g\nD2: DEFENDER LINK BROKEN -- x'],
 ['12 retraction "D2 vs C1" the only key naming D2: link-state break left out',eq,CP+'D1 vs C4 (John 1:1): UNDERDETERMINED -- g\nD2: DEFENDER LINK BROKEN -- x',"\n[AUDIT v21: CORRECTED RESULT -- SEAT: s1; ORIGINAL: BROKEN; COUNTED: HELD (HELD-1); RETRACTED: D2 vs C1]"],
 ['13 two retracted keys name D2: the join is ambiguous, entry UNREAD',eq,CP+'D1 vs C4 (John 1:1): UNDERDETERMINED -- g\nD2: DEFENDER LINK BROKEN -- x',"\n[AUDIT v21: CORRECTED RESULT -- SEAT: s1; ORIGINAL: BROKEN; COUNTED: HELD (HELD-1); RETRACTED: D2 vs C1, D2 vs C2]"]];
let OUT14R0;const out=[];for(const [n,f,r,tail] of P){const raw=H(f,r)+(tail||'');const a=tagOf(E0,raw,f),b=tagOf(E1,raw,f);const rc=E1.rcLines(E1.cureJText(raw,true));
 out.push({plant:n,live386:{word:W(a),tie:/TIE yes/.test(a),broken:BL(a)},t400:{word:W(b),tie:/TIE yes/.test(b),broken:BL(b)},col:rc.col.map(z=>z.link+':'+(z.grade||'UNREAD '+z.unread)),ls:rc.ls.map(z=>z.link+':'+(z.grade||'UNREAD '+z.unread))});}
// v25 standing effect: HELD, defense SELF-SUPPORTED with 0 conceded, one link-state break -> brk DEFENDER 1 -> defense PROP-DEPENDENT on recompute
{const f=['HELD','SELF-SUPPORTED','PROP-DEPENDENT',0,1];const R0=OUT14R0=['HELD','CLAUSE: HELD-1 -- n=2 w=0 k=0','COLLISION POINTS:','D1 vs C1 (John 1:1): UNDERDETERMINED -- g','D2: DEFENDER LINK BROKEN -- x','DEFENSE STANDING: SELF-SUPPORTED -- L=2 c=0','CHALLENGE STANDING: PROP-DEPENDENT -- L=1 c=1','CONCEDED LINKS: 0','CHALLENGER CONCEDED LINKS: 1','RESULT: DEFENDER WINS'];
 const reply='CORRECTED RESULT: HELD-1 -- the retraction below\nRETRACTED: D1 vs C1 -- regraded to UNDERDETERMINED -- in CR2 the challenger wrote "x" (John 1:1)';
 const run=G=>{let r;try{r=G.cureRecompute('s1',R0.join('\n'),Fo(f),[{rule:'K-X',link:'D1 vs C1',line:R0[3]}],[],{ok:true,text:reply});}catch(e){r={error:String(e)}}return {result:r&&r.result,fields:r&&r.fields,trig:r&&r.trig,error:r&&r.error};};
 out.push({plant:'14 v25 recompute with a link-state break (brk DEFENDER 1)',live386:run(F0),t400:run(F)});}
// 14b control: the same recompute with the long form "D2 vs C3: DEFENDER LINK BROKEN" (what live 386 already reads)
{const f=['HELD','SELF-SUPPORTED','PROP-DEPENDENT',0,1];const R0=OUT14R0.map(x=>x==='D2: DEFENDER LINK BROKEN -- x'?'D2 vs C3 (John 1:2): DEFENDER LINK BROKEN -- x':x);
 const reply='CORRECTED RESULT: HELD-1 -- the retraction below\nRETRACTED: D1 vs C1 -- regraded to UNDERDETERMINED -- in CR2 the challenger wrote "x" (John 1:1)';
 const run=G=>{let r;try{r=G.cureRecompute('s1',R0.join('\n'),Fo(f),[{rule:'K-X',link:'D1 vs C1',line:R0[3]}],[],{ok:true,text:reply});}catch(e){r={error:String(e)}}return {result:r&&r.result,fields:r&&r.fields,error:r&&r.error};};
 out.push({plant:'14b control: same recompute, long-form D2 vs C3 DEFENDER LINK BROKEN',live386:run(F0),t400:run(F)});}
for(const o of out)console.log(JSON.stringify(o));require('fs').writeFileSync(__dirname+'/plants400_out.json',JSON.stringify(out,null,1));
