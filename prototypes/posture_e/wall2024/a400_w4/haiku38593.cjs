// ASK 400 item 2c: 38593 haiku against W3 8517 conditions a to d (from the chain replay dump of the target, Alternate Merge input).
const A=require('../a386/am3_38593.json');const E=require('./ev.cjs')(__dirname+'/../a386/t386.json');const {sqlWord}=require('../a386/sqlold.cjs');
const W=t=>(t.split('\n').pop().match(/WORD: ([A-Z ]+|none);/)||[])[1];
const seen=new Set();
for(const side of ['target']){for(const [node,arr] of Object.entries(A[side]||{})){for(const it of arr||[]){for(const b of (it.bodies||[])){let p;try{p=JSON.parse(b).payload}catch(e){continue}
 if(!p||p.judge_seat!=='haiku'||!p.verdict_raw)continue;const v=p.verdict_raw;const key=node+'|'+v.length;if(seen.has(key))continue;seen.add(key);
 let F={};try{F=JSON.parse(v.split('\n[AUDIT')[0])}catch(e){const m=k=>{const x=v.match(new RegExp('"'+k+'"\\s*:\\s*("?)([^",}]*)\\1'));return x?(x[1]?x[2]:+x[2]):undefined};F={verdict_tag:m('verdict_tag'),defense_standing:m('defense_standing'),challenge_standing:m('challenge_standing'),conceded_links:m('conceded_links'),challenger_conceded_links:m('challenger_conceded_links')}}
 const tag=E.ert386(v,'haiku',F).split('\n').pop();
 const T=String(E.cureJText(v,true)).split('\n').map(l=>l.replace(/^[\s*\-•>#]+/,'').replace(/[*_]+/g,''));let k=0;const read=[];
 for(const x of T){let m=x.match(/^D(\d+)\b/);if(m)k=Math.max(k,+m[1]);m=x.match(/^KEYSTONE\s*:\s*D(\d+)\b/i);if(m)k=Math.max(k,+m[1]);if(/^D\d+\b/.test(x)){const q=E.ri5Rd2024(x);if(q&&(q.form==='LINK STATE'||q.form==='COLLISION'))read.push({link:q.f.link,grade:q.f.grade,form:q.form});}}
 const cov=new Set(read.map(r=>+(String(r.link).match(/^D(\d+)/)||[])[1]));const miss=[];for(let i=1;i<=k;i++)if(!cov.has(i))miss.push('D'+i);
 console.log(JSON.stringify({node,fields:F,declared:k,read,missing:miss,col_read:E.rcLines(E.cureJText(v,true)).col.length,word_rev4:W(tag),word_sql:sqlWord(v,'haiku',F.challenge_standing),tag:tag.slice(0,400)}));}}}}
