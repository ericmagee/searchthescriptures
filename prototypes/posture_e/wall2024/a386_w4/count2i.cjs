// ASK 386 rev 3, item 2i: stored judgments with zero collision lines read, and those whose tag word changes from rev 2 to rev 3.
const J=require('../a384/judgments_all.json');const D=require('./dbcols.json');const E2=require('./ert_eval.cjs')(__dirname+'/t386_rev2.json'),E3=require('./ert_eval.cjs')(__dirname+'/t386.json');
const byId=new Map(D.map(x=>[x[0],{verdict_tag:x[1],defense_standing:x[2],challenge_standing:x[3],conceded_links:x[4],challenger_conceded_links:x[5]}]));
const W=t=>(t.split('\n').pop().match(/WORD: ([A-Z ]+|none);/)||[])[1];const zero=[],ch=[];
for(const j of J){const F=byId.get(j.id)||{};const n=E3.rcLines(E3.cureJText(j.v||'',true)).col.length;
 const a=W(E2.ert386(j.v||'',j.seat,F)),b=W(E3.ert386(j.v||'',j.seat,F));
 if(n===0)zero.push({id:j.id,seat:j.seat,debate:j.debate_id||j.d||null,verdict:F.verdict_tag,word:b,cp:/COLLISION POINTS/i.test(j.v||'')});if(a!==b)ch.push({id:j.id,seat:j.seat,rev2:a,rev3:b});}
console.log('judgments',J.length,'| zero collision lines read',zero.length,'| word changes rev2 to rev3',ch.length);for(const z of zero)console.log(' ',JSON.stringify(z));for(const c of ch)console.log(' CH',JSON.stringify(c));
require('fs').writeFileSync(__dirname+'/count2i_out.json',JSON.stringify({zero,ch},null,1));
