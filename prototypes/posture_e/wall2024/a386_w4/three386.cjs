// ASK 386 rev 2, item 2f (W3 8473 item 3, W1): one retracted CHALLENGER LINK BROKEN seat through v25 (cureRecompute), v37 (sbApply2024) and the tag writer (ert386).
// Case A: as the engine writes it (v25 regrades the line in place; the verdict stays HELD, so no v21 tag is written, line 1557).
// Case B: the v21 tag names D2 vs C1 as RETRACTED but the judge's line still reads CHALLENGER LINK BROKEN (the case where the list matters).
const fs=require('fs');const out=[];
for(const TGT of [__dirname+'/t386_rev1.json',__dirname+'/t386.json']){
const F=require('./stubload.cjs')(TGT,'Alternate Merge Seat',['cureRecompute','sbApply2024']);const E=require('./ert_eval.cjs')(TGT);
const Fd={verdict_tag:'HELD',defense_standing:'PROP-DEPENDENT',challenge_standing:'SELF-SUPPORTED',conceded_links:1,challenger_conceded_links:0};
const R0=['HELD','CLAUSE: HELD-1 -- n=2 w=0 k=0','D1 vs C1 (John 1:1): STANDS -- g','D2 vs C1 (John 1:3): CHALLENGER LINK BROKEN -- g','DEFENSE STANDING: PROP-DEPENDENT','CHALLENGE STANDING: SELF-SUPPORTED','CONCEDED LINKS: 1','CHALLENGER CONCEDED LINKS: 0','RESULT: DEFENDER WINS -- D2 vs C1'];
const reply='CORRECTED RESULT: HELD-1 -- the retraction below\nRETRACTED: D2 vs C1 -- regraded to UNDERDETERMINED -- in CR2 the challenger wrote "the verse speaks of the Word only" (John 1:3)';
const items=[{rule:'K-X',link:'D2 vs C1',line:R0[3]}];
const r25=F.cureRecompute('s4',R0.join('\n'),Fd,items,[],{ok:true,text:reply});
const head=t=>JSON.stringify({...Fd,reasoning:t});
let tA=R0.join('\n');for(const [a,b] of r25.rp)tA=tA.split(a).join(b);
const A=head(tA)+'\n'+r25.audit;
const B=head(R0.join('\n'))+'\n[AUDIT v21: CORRECTED RESULT -- SEAT: s4; ORIGINAL: BROKEN; COUNTED: HELD (HELD-1); RETRACTED: D2 vs C1]';
const its=[{sid:'E-1',ans:'CHANGE',line:'D1 vs C1 (John 1:1): STANDS -- g',to:'D1 vs C1 (John 1:1): STANDS -- g, restated'}];
const W=t=>(t.split('\n').pop().match(/WORD: ([A-Z ]+|none);/)||[])[1];
for(const [nm,raw] of [['A',A],['B',B]]){const r37=F.sbApply2024('s4',raw,Fd,its,null);
 const tail=raw.slice(raw.indexOf('\n[AUDIT'));const after37=r37?JSON.stringify({...r37.fields,reasoning:r37.text})+tail:raw;
 out.push({target:TGT.split('/').pop(),case:nm,v25:nm==='A'?r25.result:'(case B starts from the v21 text)',v37:r37?r37.result:null,v37_fields:r37?r37.fields:null,
  tag_on_v25_output:W(E.ert386(raw,'s4',Fd)),tag_on_v37_output:r37?W(E.ert386(after37,'s4',r37.fields)):null});}}
fs.writeFileSync(__dirname+'/three386_out.json',JSON.stringify(out,null,1));for(const o of out)console.log(JSON.stringify(o));
