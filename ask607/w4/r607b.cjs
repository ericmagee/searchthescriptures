// ASK 607 item 4 (W4): form-reader probe of the old refused gate changes on the live Gate Record sbApply2024 (94b682a0).
// LIMIT: the judge texts at gate time are not stored, so each flagged line is placed in a minimal text (the line plus a RESULT line). This tests whether the live apply step reads and applies the change to that line; it does not reproduce the 11-06 to 11-11 run state.
const G=require('/mnt/project-files/ask586/w4/build/gatefn.cjs');process.chdir('/mnt/project-files/ask586/w4/build/');
const rows=require('/mnt/project-files/ask607/w4/rows607b.json');
const o=G('/mnt/project-files/ask608/w4/write/fetchback_eng_608.json','Gate Record',{});
const F={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',challenge_standing:'SELF-SUPPORTED',conceded_links:0,challenger_conceded_links:0};
for(const x of rows){const T='RESULT: DEFENDER WINS -- x\n'+x.fl;let r;try{r=o.sbApply2024(x.seat,T,F,[{ans:'CHANGE',sid:'S1',line:x.fl,to:x.to,rule:'E-COL',item:'x',seat:x.seat}],{});}catch(e){console.log(x.id,'THREW',e.message);continue;}
 const it=(r.items||[]).find(i=>i.sid==='S1');console.log(x.id,x.seat,'|',(r.applied||[]).includes('S1')?'APPLIED':(it?it.kind+': '+String(it.why).slice(0,160):'not applied, no item')+'',(r.applied||[]).includes('S1')&&String(r.text).includes(x.to.slice(0,40))?'(new line in text)':'');}
