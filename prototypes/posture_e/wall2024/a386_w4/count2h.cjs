// ASK 386 rev 2, item 2h: stored judgments whose tag word changes from rev 1 to rev 2 (DB columns as the fields).
const J=require('../a384/judgments_all.json');const D=require('./dbcols.json');const E1=require('./ert_eval.cjs')(__dirname+'/t386_rev1.json'),E2=require('./ert_eval.cjs')(__dirname+'/t386.json');
const byId=new Map(D.map(x=>[x[0],{verdict_tag:x[1],defense_standing:x[2],challenge_standing:x[3],conceded_links:x[4],challenger_conceded_links:x[5]}]));
const W=t=>(t.split('\n').pop().match(/WORD: ([A-Z ]+|none);/)||[])[1];let n=0,miss=0;const ch=[];const missing=[];
for(const j of J){const c=byId.get(j.id)||{};const F={verdict_tag:c.verdict_tag,defense_standing:c.defense_standing,challenge_standing:c.challenge_standing,conceded_links:c.conceded_links,challenger_conceded_links:c.challenger_conceded_links};
 n++;const a=W(E1.ert386(j.v||'',j.seat,F)),b=W(E2.ert386(j.v||'',j.seat,F));
 const hm=!F.defense_standing||!F.challenge_standing||typeof F.conceded_links!=='number'||typeof F.challenger_conceded_links!=='number';if(hm)missing.push(j.id);
 if(a!==b)ch.push({id:j.id,seat:j.seat,rev1:a,rev2:b,F});}
console.log('judgments',n,'with a missing standing or count',missing.length,'| tag word changes rev1 to rev2:',ch.length);for(const x of ch)console.log(' ',JSON.stringify(x));
require('fs').writeFileSync(__dirname+'/count2h_out.json',JSON.stringify({n,missing,ch},null,1));
