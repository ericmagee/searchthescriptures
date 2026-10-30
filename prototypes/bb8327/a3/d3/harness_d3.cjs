const fs=require('fs');
function fns(dir){
  const b=fs.readFileSync(dir+'/Build_Save_Body.js','utf8');
  const fk=b.match(/const __FK=x=>\{[\s\S]*?return null;\};/)[0];
  const f=fs.readFileSync(dir+'/Format_Markdown.js','utf8');
  const fl=f.match(/const flagKey = x => \{[\s\S]*?return null; \};/)[0];
  return {FK:new Function(fk+';return __FK;')(), FL:new Function(fl+';return flagKey;')()};
}
// stored 29609 single-judge marks and report heads (substrings checked by SQL strpos)
const marks=[
 '[AUDIT v22: DEBATE RULE VIOLATION (K-S) -- D2 vs C2 UNDERDETERMINED rests on a single verse not stating a link or its contrary and names no round that answered the witness. REVIEW THIS ROW.]',
 '[AUDIT v21: DEBATE RULE VIOLATION (K-G4) -- D3 vs C1 CHALLENGER LINK BROKEN counts a witness as unanswered; the rule counts it only with the quoted pressing sentence and its round. REVIEW THIS ROW.]',
 '[AUDIT v22: DEBATE RULE VIOLATION (K-S) -- D6 vs C4 UNDERDETERMINED rests on a single verse not stating a link or its contrary and names no round that answered the witness. REVIEW THIS ROW.]'];
const reports='ITEM: D2 vs C2; RULE: K-S; RESULT: CURED; ITEM: D3 vs C1; RULE: K-G4; RESULT: CURED; ITEM: D6 vs C4; RULE: K-S; RESULT: CURED;';
// built specimens: K-S2, K-U (never cleared); K-C on a collision, a STANDS link, the reasoning, a standing line; one K-C uncured
const built=[
 ['[AUDIT v22: DEBATE RULE VIOLATION (K-S2) -- D1 STANDS gives as a ground that a verse does not state a link or its contrary, beside the round it names; that is never a ground. REVIEW THIS ROW.]',null],
 ['[AUDIT v22: DEBATE RULE VIOLATION (K-U) -- D6 vs C2 UNDERDETERMINED says a witness went unanswered ("was not named"); a witness left unanswered is a BROKEN ground. REVIEW THIS ROW.]',null],
 ['[AUDIT v23: DEBATE RULE VIOLATION (K-C) -- D4 vs C2 UNDERDETERMINED sets aside a chain. REVIEW THIS ROW.]','K-C|D4 VS C2'],
 ['[AUDIT v23: DEBATE RULE VIOLATION (K-C) -- D5 STANDS sets aside a chain. REVIEW THIS ROW.]','K-C|D5'],
 ['[AUDIT v23: DEBATE RULE VIOLATION (K-C) -- REASONING sets aside a chain. REVIEW THIS ROW.]','K-C|REASONING'],
 ['[AUDIT v23: DEBATE RULE VIOLATION (K-C) -- DEFENSE STANDING sets aside a chain. REVIEW THIS ROW.]','K-C|DEFENSE STANDING'],
 ['[AUDIT v23: DEBATE RULE VIOLATION (K-C) -- KEYSTONE sets aside a chain. REVIEW THIS ROW.]','K-C|KEYSTONE'],
 ['[AUDIT v23: DEBATE RULE VIOLATION (K-C) -- D10 vs C12 UNDERDETERMINED sets aside a chain. REVIEW THIS ROW.]','K-C|D10 VS C12']];
const builtReports='ITEM: D4 vs C2; RULE: K-C; RESULT: CURED; ITEM: REASONING; RULE: K-C; RESULT: CURED; ITEM: D5; RULE: K-C; RESULT: UNCURED;';
function cur(s){const c=new Set();(s.match(/ITEM: ([^;\]]+); RULE: ([^;\]]+); RESULT: ([A-Z]+)/g)||[]).forEach(x=>{const m=x.match(/ITEM: ([^;\]]+); RULE: ([^;\]]+); RESULT: ([A-Z]+)/);if(m[3]==='CURED')c.add(m[2].trim()+'|'+m[1].trim().toUpperCase());});return c;}
let fail=0,n=0;const ok=(c,msg)=>{n++;if(!c){fail++;console.log('FAIL',msg);}};
for(const dir of ['base','new']){
  const {FK,FL}=fns(dir); const C=cur(reports), CB=cur(builtReports);
  const cleared=marks.map(x=>{const k=FK(x);return !!(k&&C.has(k));});
  const clearedFL=marks.map(x=>{const k=FL(x);return !!(k&&C.has(k));});
  console.log(dir,'29609 marks cleared (BSB):',cleared.join(','),' (FM):',clearedFL.join(','));
  if(dir==='base'){ok(!cleared[0]&&cleared[1]&&!cleared[2],'base: K-S not cleared, K-G4 cleared');}
  else{
    ok(cleared.every(Boolean)&&clearedFL.every(Boolean),'new: all three cleared in both nodes');
    for(const [x,exp] of built){ok(FK(x)===exp&&FL(x)===exp,'key '+x.slice(0,70)+' got '+FK(x)+'/'+FL(x));}
    ok(CB.has(FK(built[2][0])),'K-C collision CURED clears');ok(CB.has(FK(built[4][0])),'K-C reasoning CURED clears');
    ok(!CB.has(FK(built[3][0])),'K-C D5 UNCURED stays');ok(!CB.has(FK(built[5][0])),'K-C standing with no report stays');
  }
}
console.log(`asserts ${n}, fail ${fail}`);process.exit(fail?1:0);
