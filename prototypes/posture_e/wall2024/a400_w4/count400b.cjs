// ASK 400 (W1 8519 item 2; W3 8517 conditions a to d), offline. For the 73 stored judgments whose tag carries "LINK STATE LINES NOT READ (short form)".
const J=require('../a384/judgments_all.json');const D=require('../a386/dbcols.json');const E=require('./ev.cjs')(__dirname+'/../a386/t386.json');const {sqlWord}=require('../a386/sqlold.cjs');
const byId=new Map(D.map(x=>[x[0],{verdict_tag:x[1],defense_standing:x[2],challenge_standing:x[3],conceded_links:x[4],challenger_conceded_links:x[5]}]));
const W=t=>(t.split('\n').pop().match(/WORD: ([A-Z ]+|none);/)||[])[1];const N=t=>/LINK STATE LINES NOT READ \(short form\)/.test(t.split('\n').pop());
const rows=[];
for(const j of J){const F=byId.get(j.id)||{};const tag=E.ert386(j.v||'',j.seat,F);if(!N(tag))continue;
 const T=String(E.cureJText(j.v||'',true)).split('\n').map(l=>l.replace(/^[\s*\-•>#]+/,'').replace(/[*_]+/g,''));
 let k=0,Ld=null;const named=new Set();for(const x of T){let m=x.match(/^D(\d+)\b/);if(m){k=Math.max(k,+m[1]);named.add(+m[1]);}{const q=x.match(/^DEFENSE STANDING\s*:[^\n]*?\bL\s*=\s*(\d+)/i);if(q&&Ld===null)Ld=+q[1];}m=x.match(/^KEYSTONE\s*:\s*D(\d+)\b/i);if(m)k=Math.max(k,+m[1]);}
 const read=[],unreadD=[];for(const x of T){if(!/^D\d+\b/.test(x))continue;const q=E.ri5Rd2024(x);
  if(q&&(q.form==='LINK STATE'||q.form==='COLLISION')){const L=String(q.f.link||'').match(/^D(\d+)/i);read.push({n:L?+L[1]:null,grade:String(q.f.grade||'').toUpperCase(),form:q.form});}else unreadD.push(x.slice(0,90));}
 const kk=k;k=Math.max(k,Ld||0);const cov=new Set(read.map(r=>r.n));const miss=[];for(let i=1;i<=k;i++)if(!cov.has(i))miss.push('D'+i);
 const a=k>0&&miss.length===0;const b=read.some(r=>r.grade&&r.grade!=='WITHDRAWN');
 const c=!read.some(r=>/LINK BROKEN$|^BROKEN$/.test(r.grade))&&!unreadD.some(x=>/\b(DEFENDER|CHALLENGER) LINK BROKEN\b|:\s*BROKEN\b/.test(x));
 const d=!!F.defense_standing&&!!F.challenge_standing&&typeof F.conceded_links==='number'&&typeof F.challenger_conceded_links==='number'&&F.defense_standing===F.challenge_standing&&F.conceded_links===F.challenger_conceded_links;
 const w4=W(tag),ws=sqlWord(j.v||'',j.seat,F.challenge_standing);const meets=a&&b&&c&&d;const tie=x=>meets&&/WINS$/.test(String(x||''))?'UNDERDETERMINED':x;
 rows.push({id:j.id,seat:j.seat,debate:j.debate_id,verdict:F.verdict_tag,declared:k,k_lines:kk,L_def:Ld,read:read.length,missing:miss.join(' '),unread_D_lines:unreadD.length,a,b,c,d,meets,word_rev4:w4,word_400:tie(w4),word_sql:ws,word_sql_400:tie(ws)});}
const S={judgments:rows.length,a:rows.filter(r=>r.a).length,b:rows.filter(r=>r.b).length,c:rows.filter(r=>r.c).length,d:rows.filter(r=>r.d).length,meet_all:rows.filter(r=>r.meets).length,
 change_vs_rev4:rows.filter(r=>r.word_rev4!==r.word_400).length,change_vs_sql:rows.filter(r=>r.word_sql!==r.word_sql_400).length};
console.log(JSON.stringify(S));for(const r of rows.filter(r=>r.meets||r.debate==='eebfa022-fec6-4d6f-9c04-2437e3affcf2'))console.log(JSON.stringify(r));
require('fs').writeFileSync(__dirname+'/count400b_out.json',JSON.stringify({summary:S,rows},null,1));
