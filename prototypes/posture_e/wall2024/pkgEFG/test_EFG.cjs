// pkgEFG tests: efgCheck on real 33371 rounds (pkgECQ/fixture_33371_rounds.json) and real FORCED lines; Build item and Record row behaviour in the harness.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');
let ok=0,bad=0;const t=(n,c,x)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n,x||'');}};
const LV=process.env.LV||'pkgEFG/patched_live',TR=process.env.TR||'pkgEFG/patched',RB=process.env.RB||'pkgECQ/patched_live_on_pkgEAH_patched';
const R=JSON.parse(fs.readFileSync('pkgECQ/fixture_33371_rounds.json','utf8'));
const {efgCheck}=new Function(fs.readFileSync('pkgEFG/efg_lib.js','utf8')+';return {efgCheck};')();
// the lib inside the built Build node is byte-identical to efg_lib.js
for(const f of ['Judge_Enforcer_Build.js','Alt_Judge_Enforcer_Build.js'])t(f+': efg_lib inserted once, required flag and rule sentence present',(()=>{const s=fs.readFileSync(LV+'/'+f,'utf8');return s.split(fs.readFileSync('pkgEFG/efg_lib.js','utf8')).length===2&&s.includes("req:/^FORCED/.test(g.line)")&&s.includes('(pkgEFG, either side alike)')&&s.includes('&&!it.req){not_checked');})());
const L371=JSON.parse(fs.readFileSync('pkgEFG/fixture_single_forced.json','utf8')).find(r=>r.run==='33371').l;
t('P1 33371 real FORCED D1 vs C1 (MEANS = [CR3] own sentence) passes',efgCheck(L371,R)===null,efgCheck(L371,R));
const G14808='FORCED: D1 vs C1 -- MEANS [CR3]: "Mary\'s own state names no man as the means" -- ANSWER [DR3]: "A present state of not knowing, followed by a future conception, describes a woman espoused but not yet known." -- FAILS: "x" -- CARRIED BY: "How shall this be, seeing I know not a man?" -- GROUND: [L1] Luke 1:34 "seeing I know not a man"';
console.log('INFO P2 33371 grok 14808 (MEANS "Mary\'s own state names no man as the means", 8 words):',String(efgCheck(G14808,R)));
const V1='FORCED: D1 vs C1 -- MEANS [CR3]: "How shall this be, seeing I know not a man?" -- ANSWER [DR3]: "A present state of not knowing, followed by a future conception, describes a woman espoused but not yet known." -- FAILS: "describes a woman espoused but not yet known" -- CARRIED BY: "How shall this be, seeing I know not a man?" -- GROUND: [L1] Luke 1:34 "Then said Mary unto the angel, How shall this be, seeing I know not a man?"';
t('F1 MEANS is the verse re-quoted (Luke 1:34, the review\'s shape): flagged',/no run of 6 words standing in \[CR3\]/.test(efgCheck(V1,R)||''),efgCheck(V1,R));
const V2='FORCED: D4 vs C2 -- MEANS [CR3]: "The text terminates the chain of active masculine begetting at Joseph" -- ANSWER [DR3]: "These are the two parents." -- FAILS: "x" -- CARRIED BY: "Jacob begat Joseph the husband of Mary" -- GROUND: [L1] Matthew 1:16 "And Jacob begat Joseph the husband of Mary, of whom was born Jesus"';
t('F2 MEANS is the judge\'s own sentence, not in [CR3] (33371 single judge D4 vs C2 ground): flagged',!!efgCheck(V2,R),efgCheck(V2,R));
const V3=V1.replace('MEANS [CR3]','MEANS [DR3]');t('F3 same verse MEANS against the challenger round: flagged (either side alike)',!!efgCheck(V3,R),efgCheck(V3,R));
const S1='FORCED: D1 vs C1 -- MEANS [CR3]: "The reply names no man." -- ANSWER [DR3]: "x y z" -- FAILS: "x" -- CARRIED BY: "seeing I know not a man" -- GROUND: [L1] Luke 1:34 "seeing I know not a man"';
t('P3 W3 control: short genuine MEANS "The reply names no man." (5 words, [CR3] prose) passes',efgCheck(S1,R)===null,efgCheck(S1,R));
const S2=S1.replace('The reply names no man.','Two children carry two names.');t('P4 W3 control: short genuine MEANS "Two children carry two names." passes',efgCheck(S2,R)===null,efgCheck(S2,R));
const S3=S1.replace('The reply names no man.','The reply names Joseph.');t('F4 short MEANS not standing as one run in [CR3] is flagged',!!efgCheck(S3,R),efgCheck(S3,R));
const S4=V1.replace('MEANS [CR3]: "How shall this be, seeing I know not a man?"','MEANS [CR3]: "seeing I know not a man"');t('F5 short MEANS that is a piece of the quoted verse (5 words) is flagged',!!efgCheck(S4,R),efgCheck(S4,R));
const V4='LINK BROKEN line -- not FORCED';t('N1 a non-FORCED line is not checked',efgCheck(V4,R)===null);
t('N2 no rounds: not checked',efgCheck(V1,null)===null);
t('N3 unparseable MEANS: not checked',efgCheck('FORCED: D1 vs C1 -- MEANS: no round named -- ANSWER [DR3]: "x"',R)===null);
// Record: rows with efg; DeepSeek AGREE -> LIVE pushed DISAGREE; DISAGREE -> note appended; TRIAL -> mark only
const run=(dir,node,line,reply,efg)=>{const over={'Enforcer Record':[{json:{}}],'Alt Seated':[{json:{}}],
  [node.replace('Record','Build')]:[{json:{ids:[{...(efg?{efg}:{}),id:'K1.1',rule:'E-COL',seat:'grok',grade:'FORCED',item:'COLLISION D1 vs C1',flagged_line:line,response_line:line.slice(0,700)}],run_token:'t',model:'deepseek',body:{messages:[{},{content:'p'}]}}}],
  'CALL':[{json:{choices:[{message:{content:'ENFORCER: K1.1 -- '+reply}}]}}]};
 return harness('none',over)(fs.readFileSync(dir+'/'+node.replace(/ /g,'_')+'.js','utf8'),'CALL')[0].json.enf428_rows[0].cure_reason;};
const note=efgCheck(V1,R);
for(const node of ['Judge Enforcer Record','Alt Judge Enforcer Record']){
 const b=run(RB,node,V1,'AGREE -- RIGHT: BROKEN -- the answer cannot agree.',note),l=run(LV,node,V1,'AGREE -- RIGHT: BROKEN -- the answer cannot agree.',note),p=run(TR,node,V1,'AGREE -- RIGHT: BROKEN -- the answer cannot agree.',note);
 t(node+': R1 DeepSeek AGREE + code fail: LIVE pushed as DISAGREE (right: UNDERDETERMINED); base AGREE',/^ENFORCER AGREE/.test(b)&&/^ENFORCER DISAGREE \(right: UNDERDETERMINED\): \(pkgEFG code check\)/.test(l),l.slice(0,200));
 t(node+': R2 TRIAL keeps AGREE and appends a mark without inner parentheses',p.startsWith(b)&&/\(TRIAL pkgEFG: [^()]*\)$/.test(p),p.slice(-200));
 const b2=run(RB,node,V1,'DISAGREE -- RIGHT: STANDS -- a rival reading.',note),l2=run(LV,node,V1,'DISAGREE -- RIGHT: STANDS -- a rival reading.',note);
 t(node+': R3 DeepSeek DISAGREE + code fail: sent as before with the code note added',/^ENFORCER DISAGREE \(right: STANDS\)/.test(l2)&&l2.includes('[pkgEFG code check:')&&l2.replace(/ \[pkgEFG code check:[\s\S]*?\] \(judge wrote /,' (judge wrote ')===b2,l2.slice(0,240));
 const b3=run(RB,node,L371,'AGREE -- RIGHT: BROKEN -- x.',null),l3=run(LV,node,L371,'AGREE -- RIGHT: BROKEN -- x.',null),p3=run(TR,node,L371,'AGREE -- RIGHT: BROKEN -- x.',null);
 t(node+': R4 no efg: row unchanged (LIVE and TRIAL)',b3===l3&&b3===p3);}
{const L=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s39.json','utf8'));const NS=(L.data||L).nodes;
 for(const sb of ['Send Back Build','Alt Send Back Build']){const c=NS.find(n=>n.name===sb).parameters.jsCode;const m=c.match(/const why=x=>[^\n]*?\.trim\(\);/);const why=new Function('return '+m[0].replace(/^const why=/,'').replace(/;$/,''))();
  const b=run(RB,'Judge Enforcer Record',V1,'AGREE -- RIGHT: BROKEN -- y.',note),p=run(TR,'Judge Enforcer Record',V1,'AGREE -- RIGHT: BROKEN -- y.',note);
  t(sb+': why() strips the TRIAL pkgEFG mark',why({cure_reason:b})===why({cure_reason:p}));
  t(sb+': the LIVE push matches the send-back filter',/^ENFORCER (?:DISAGREE|NO ANSWER)\b/.test(run(LV,'Judge Enforcer Record',V1,'AGREE -- RIGHT: BROKEN -- y.',note)));}}
console.log(ok+' OK, '+bad+' FAIL');
