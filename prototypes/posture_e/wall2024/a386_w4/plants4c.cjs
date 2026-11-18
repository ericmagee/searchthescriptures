// ASK 386 rev 4 part 3 (W1 8519 item 1): plants on rd386, the three-call plant with equal fields, and the stored count against rev 4 part 2.
const fs=require('fs');const T={r4b:__dirname+'/t386_rev4b.json',r4c:__dirname+'/t386.json'};const E={};for(const k in T)E[k]=require('./ert_eval.cjs')(T[k]);
const eq={dst:'PROP-DEPENDENT',cst:'PROP-DEPENDENT',cd:1,cc:1};const out={rd386:[],three:[],stored:null};
for(const [n,i] of [['one line, retracted, regraded UNDERDETERMINED in place, equal fields (W1 8519 plant)',{verdict:'HELD',...eq,col:[{link:'D1 vs C1',grade:'UNDERDETERMINED'}],retracted:['D1 vs C1']}],
 ['one line, retracted, still CHALLENGER LINK BROKEN (case B), equal fields',{verdict:'HELD',...eq,col:[{link:'D1 vs C1',grade:'CHALLENGER LINK BROKEN'}],retracted:['D1 vs C1']}],
 ['HELD challenge SELF-SUPPORTED, its only CHALLENGER LINK BROKEN line retracted and still LINK BROKEN',{verdict:'HELD',dst:'PROP-DEPENDENT',cst:'SELF-SUPPORTED',cd:1,cc:0,col:[{link:'D1 vs C1',grade:'CHALLENGER LINK BROKEN'}],retracted:['D1 vs C1']}],
 ['no line retracted, equal fields',{verdict:'BROKEN',...eq,col:[{link:'D1 vs C1',grade:'STANDS'}]}]])
 out.rd386.push({plant:n,rev4b:E.r4b.rd386(i).word,rev4c:E.r4c.rd386(i).word});
// three calls, equal fields: v25 retracts D1 vs C1 and regrades it UNDERDETERMINED in place
for(const k in T){const F=require('./stubload.cjs')(T[k],'Alternate Merge Seat',['cureRecompute','sbApply2024']);
 const Fd={verdict_tag:'HELD',defense_standing:'PROP-DEPENDENT',challenge_standing:'PROP-DEPENDENT',conceded_links:1,challenger_conceded_links:1};
 const R0=['HELD','CLAUSE: HELD-1 -- n=1 w=0 k=0','D1 vs C1 (John 1:3): CHALLENGER LINK BROKEN -- g','DEFENSE STANDING: PROP-DEPENDENT','CHALLENGE STANDING: PROP-DEPENDENT','CONCEDED LINKS: 1','CHALLENGER CONCEDED LINKS: 1','RESULT: DEFENDER WINS -- D1 vs C1'];
 const reply='CORRECTED RESULT: HELD-1 -- the retraction below\nRETRACTED: D1 vs C1 -- regraded to UNDERDETERMINED -- in CR2 the challenger wrote "the verse speaks of the Word only" (John 1:3)';
 const r25=F.cureRecompute('s4',R0.join('\n'),Fd,[{rule:'K-X',link:'D1 vs C1',line:R0[2]}],[],{ok:true,text:reply});let t=R0.join('\n');for(const [a,b] of r25.rp)t=t.split(a).join(b);
 const raw=JSON.stringify({...r25.fields,reasoning:t})+'\n'+r25.audit;const tag=E[k].ert386(raw,'s4',r25.fields).split('\n').pop();
 const r37=F.sbApply2024('s4',raw,r25.fields,[{sid:'E-1',ans:'CHANGE',line:'CLAUSE: HELD-1 -- n=1 w=0 k=0',to:'CLAUSE: HELD-1 -- n=1 w=0 k=0, restated'}],null);
 out.three.push({target:k,v25:r25.result,v25_trig:r25.trig,tag_on_v25_output:(tag.match(/WORD: ([A-Z ]+|none);/)||[])[1],tag_tie:/TIE yes/.test(tag),v37:r37?r37.result:null});}
// stored
const J=require('../a384/judgments_all.json');const D=require('./dbcols.json');const W=t=>t.split('\n').pop();const ch=[];
for(const j of J){const c=D.find(x=>x[0]===j.id);const Fd={verdict_tag:c[1],defense_standing:c[2],challenge_standing:c[3],conceded_links:c[4],challenger_conceded_links:c[5]};const a=W(E.r4b.ert386(j.v,j.seat,Fd)),b=W(E.r4c.ert386(j.v,j.seat,Fd));
 if(a!==b)ch.push({id:j.id,seat:j.seat,rev4b:(a.match(/WORD: ([A-Z ]+|none);/)||[])[1]+(/TIE yes/.test(a)?' (tie)':''),rev4c:(b.match(/WORD: ([A-Z ]+|none);/)||[])[1]+(/TIE yes/.test(b)?' (tie)':'')});}
out.stored=ch;fs.writeFileSync(__dirname+'/plants4c_out.json',JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,1));
