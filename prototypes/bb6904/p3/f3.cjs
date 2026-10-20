// F3: constructed collision lines through drvCheck. Each case states what must happen; the run prints PASS or FAIL per case.
const fs=require('fs');const blk=fs.readFileSync(__dirname+'/drv_block.js','utf8');const drvCheck=new Function(blk+'\nreturn drvCheck;')();
const L=(s)=>'COLLISION POINTS:\n'+s+'\nCITATION CHECK: none.';
const cases=[
 ['known-good: [L1] quoted + [L3] named reference', L('D4 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "before they came together" and [L3] Matthew 1:25 contradict the link.'),1,0,'PROP-DEPENDENT',0],
 ['known-bad: one kind only ([L3])', L('D5 vs C3 (Luke 1:31): DEFENDER LINK BROKEN -- [L3] Genesis 4:1 contradicts the link.'),1,1,'PROP-DEPENDENT',0],
 ['italic English as the only [L2], with [L1]', L('D4 vs C2 (Matthew 1:20): DEFENDER LINK BROKEN -- [L1] "conceived in her" with [L2] *virgin* contradicts the link.'),1,1,'PROP-DEPENDENT',0],
 ['Greek script [L2] with [L1]', L('D4 vs C2 (Matthew 1:20): DEFENDER LINK BROKEN -- [L1] "conceived in her" with [L2] γεννηθὲν contradicts the link.'),1,0,'PROP-DEPENDENT',0],
 ['negated tags only', L('D6 vs C2 (Matthew 1:25): DEFENDER LINK BROKEN -- the link has no [L2] or [L3] footing.'),1,1,'PROP-DEPENDENT',0],
 ['challenger side, one kind', L('D6 vs C6 (Hebrews 7:10): CHALLENGER LINK BROKEN -- [L1] "was yet in the loins of his father" states it.'),1,1,'PROP-DEPENDENT',0],
 ['STANDS line mentioning BROKEN is not selected', L('D6: STANDS -- no collision rises to DEFENDER LINK BROKEN.'),0,0,'PROP-DEPENDENT',0],
 ['UNDERDETERMINED line is not selected', L('D3 vs C5 (Luke 3:23): UNDERDETERMINED -- open.'),0,0,'PROP-DEPENDENT',0],
];
let fail=0;
for(const [name,text,,expKB,ds] of cases){const r=drvCheck(text,1,1,ds,'PROP-DEPENDENT',true);const kb=r.items.filter(i=>i.rule==='K-B').length;
 const ok=kb===expKB&&r.marks.every(m=>!/K-G2/.test(m));if(!ok)fail++;
 console.log(ok?'PASS':'FAIL',name,'| K-B items',kb,'expected',expKB);}
// K-G1: conceded 0 and an unanswered witness fires; conceded 1 does not; a line without the words does not.
const g1=L('D5 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "before they came together" and [L3] Matthew 1:25; the witness stands unanswered.');
const a=drvCheck(g1,0,1,'PROP-DEPENDENT','PROP-DEPENDENT',true).items.filter(i=>i.rule==='K-G1').length,b=drvCheck(g1,1,1,'PROP-DEPENDENT','PROP-DEPENDENT',true).items.filter(i=>i.rule==='K-G1').length;
const c=drvCheck(L('D5 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- [CR3] does not answer the timing.'),0,1,'PROP-DEPENDENT','PROP-DEPENDENT',true).items.filter(i=>i.rule==='K-G1').length;
for(const [n,v,e] of [['K-G1 conceded 0 + "unanswered" fires',a,1],['K-G1 conceded 1 does not fire',b,0],['K-G1 "does not answer" is not in the word list (stated limit)',c,0]]){const ok=v===e;if(!ok)fail++;console.log(ok?'PASS':'FAIL',n,'|',v,'expected',e);}
// K-G3: SELF-SUPPORTED with a BROKEN line of that side fires once; PROP-DEPENDENT does not; SELF-SUPPORTED with no BROKEN line does not.
const t3=L('D4 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- x.\nD5 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- y.');
const k3=(ds,t)=>drvCheck(t,1,1,ds,'SELF-SUPPORTED',true).items.filter(i=>i.rule==='K-G3');
for(const [n,v,e] of [['K-G3 SELF-SUPPORTED with 2 BROKEN fires once',k3('SELF-SUPPORTED',t3).length,1],['K-G3 PROP-DEPENDENT does not fire',k3('PROP-DEPENDENT',t3).length,0],['K-G3 no BROKEN line does not fire',k3('SELF-SUPPORTED',L('D1: STANDS')).length,0]]){const ok=v===e;if(!ok)fail++;console.log(ok?'PASS':'FAIL',n,'|',v,'expected',e);}
// K-G2: line absent fires a record line only when asked; never a REVIEW flag.
const noCC='COLLISION POINTS:\nD1: STANDS';const g2a=drvCheck(noCC,0,0,'PROP-DEPENDENT','PROP-DEPENDENT',true).marks,g2b=drvCheck(noCC,0,0,'PROP-DEPENDENT','PROP-DEPENDENT',false).marks;
for(const [n,v,e] of [['K-G2 absent and asked: one record line',g2a.length,1],['K-G2 record line carries no REVIEW THIS ROW',g2a.filter(m=>/REVIEW THIS ROW/.test(m)).length,0],['K-G2 absent, not asked: nothing',g2b.length,0]]){const ok=v===e;if(!ok)fail++;console.log(ok?'PASS':'FAIL',n,'|',v,'expected',e);}
console.log('failures',fail);
