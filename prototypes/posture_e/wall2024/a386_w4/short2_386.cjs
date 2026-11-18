// ASK 386 rev 4 part 2 (W1 8507) and ASK 400 item 3b: short-form "Dn: GRADE" lines that rcLines does not read, over the 624 stored judgments.
const J=require('../a384/judgments_all.json');const D=require('./dbcols.json');const E=require('./ert_eval.cjs')(__dirname+'/t386_rev3.json');
const F=require('./stubload.cjs')(__dirname+'/t386_rev3.json','Alternate Merge Seat',['ri5Rd2024']);const S=require('./sqlold.cjs');
const W=t=>{const w=(t.split('\n').pop().match(/WORD: ([A-Z ]+|none);/)||[])[1];return w==='none'?null:w;};
const grades={};let only=0,mixed=0,none=0;const lose=[];
for(const j of J){const t=E.cureJText(j.v,true);const col=E.rcLines(t).col;const cov=new Set(col.map(z=>(String(z.link).toUpperCase().match(/^D\d+/)||[''])[0]));
 const u=[];for(const l0 of t.split('\n')){const l=l0.replace(/^[\s*\-•>#]+/,'').replace(/[*_]+/g,'');const r=F.ri5Rd2024(l);let lab=null,g=null;
  if(r&&r.form==='LINK STATE'&&/^D\d+$/i.test(String(r.f.link||''))){lab=String(r.f.link).toUpperCase();g=String(r.f.grade||'?');}
  const m=l.match(/^(D\d+)\s*:\s*D\d+\s+vs\.?\s+C\d+/i);if(m){lab=m[1].toUpperCase();g='(prefixed long form)';}
  if(lab&&!cov.has(lab)){u.push(lab);grades[g]=(grades[g]||0)+1;}}
 if(!u.length){none++;continue;}if(col.length)mixed++;else only++;
 const c=D.find(x=>x[0]===j.id);const Fd={verdict_tag:c[1],defense_standing:c[2],challenge_standing:c[3],conceded_links:c[4],challenger_conceded_links:c[5]};
 const tag=E.ert386(j.v,j.seat,Fd).split('\n').pop();if(/TIE yes/.test(tag)){const v=String(c[1]);const w0=v==='BROKEN'?'CHALLENGER WINS':v==='PARTIAL'?'UNDERDETERMINED':null;
  const r=E.rd386({verdict:c[1],dst:c[2],cst:c[3],cd:c[4],cc:c[5],col:[]});lose.push({id:j.id,seat:j.seat,fields:c.slice(1,6),long:col.length,short_unread:u.length,rev3:W(tag),if_unread:null,sql_today:S.sqlWord(j.v,j.seat,c[3])});}}
// the word if the seat is UNREAD (no tie): rd386 without the tie
for(const x of lose){const c=x.fields;const w=c[0];x.if_unread=w==='BROKEN'?'CHALLENGER WINS':w==='PARTIAL'?'UNDERDETERMINED':'(HELD: by the CHALLENGER LINK BROKEN test)';}
console.log({judgments:J.length,no_unread_short_form:none,short_form_only:only,mixed:mixed,grade_words_unread:grades});
console.log('rev 3 tags carrying TIE yes on a seat with unread short-form lines (these lose the tie under 8507 as worded):',lose.length);for(const x of lose.slice(0,40))console.log(' ',JSON.stringify(x));
require('fs').writeFileSync(__dirname+'/short2_386_out.json',JSON.stringify({grades,only,mixed,none,lose},null,1));
