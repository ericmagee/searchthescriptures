// ASK 523 rev 1: the deciding-line verse match (reference rule for W4's build).
// expand(text) -> Set of "Book C:V" for every reference in text, with same-chapter lists (C:a,b) and ranges (C:a-b, C:a–b) expanded.
// onDeciding(ref, ks, rs) -> true when ref (one verse) is in the expanded set of the KEYSTONE or RESULT line.
const BOOK='(?:[1-3]\\s?)?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?';
function expand(t){const out=new Set();const s=String(t||'').replace(/\\+"/g,'"');
 const re=new RegExp('('+BOOK+')\\.?\\s(\\d{1,3}):(\\d{1,3})((?:\\s*(?:,|[-–])\\s*\\d{1,3}(?!\\s*:))*)','g');let m;
 while((m=re.exec(s))){const bk=m[1].replace(/\s+/g,' '),ch=m[2];let last=+m[3];out.add(bk+' '+ch+':'+last);
  const tail=m[4]||'';const pr=/\s*(,|[-–])\s*(\d{1,3})/g;let q;while((q=pr.exec(tail))){const n=+q[2];
   if(q[1]===','){out.add(bk+' '+ch+':'+n);last=n;}else{for(let v=last+1;v<=n&&v-last<=200;v++)out.add(bk+' '+ch+':'+v);last=n;}}}
 return out;}
function norm(r){const m=String(r||'').trim().match(new RegExp('^('+BOOK+')\\.?\\s(\\d{1,3}):(\\d{1,3})$'));return m?m[1].replace(/\s+/g,' ')+' '+m[2]+':'+m[3]:null;}
function onDeciding(ref,ks,rs){const r=norm(ref);if(!r)return false;return expand(ks).has(r)||expand(rs).has(r);}
module.exports={expand,onDeciding};
if(require.main===module){const T=[
 ['list hit','Matthew 1:25','KEYSTONE: D5 -- BROKEN -- the timing in Matthew 1:18,25 does not fit','',true],
 ['range hit (en dash)','Luke 1:35','KEYSTONE: D4 -- BROKEN -- Luke 1:34–35 answers the question','',true],
 ['range hit (hyphen)','Luke 1:35','','RESULT: UNDERDETERMINED -- Luke 1:33-36 gives the source',true],
 ['near-miss 1:1 vs 1:18','Matthew 1:1','KEYSTONE: D5 -- BROKEN -- [L1] Matthew 1:18 "before they came together"','',false],
 ['near-miss list 1:18,25 vs 1:2','Matthew 1:2','KEYSTONE: the timing in Matthew 1:18,25','',false],
 ['other chapter not in list','Matthew 2:25','KEYSTONE: Matthew 1:18,25','',false],
 ['other book','John 1:18','KEYSTONE: Matthew 1:18','',false],
 ['numbered book','1 Corinthians 15:45','RESULT: CHALLENGER WINS -- 1 Corinthians 15:45-47','',true],
 ['row 51401','Matthew 1:18','KEYSTONE: D5 -- BROKEN (Commitment 3) -- D5 vs C2: [L1] Matthew 1:18 “before they came together”; [L4] the timing in Matthew 1:18,25','',true]];
 let bad=0;for(const [n,r,k,s,w] of T){const g=onDeciding(r,k,s);if(g!==w)bad++;console.log((g===w?'OK  ':'FAIL')+' '+n+': '+r+' -> '+g);}
 console.log(bad?bad+' FAILED':'ALL '+T.length+' OK');process.exit(bad?1:0);}
