// Unit test of pkgSDS: live s149 cureLines vs parent cureLines on the stored cure replies of run 35379 (all six seats) and on plants.
const fs=require('fs');const rd=require('./rd.cjs');
const RAW=process.argv[2];let t=fs.readFileSync(RAW,'utf8');try{t=JSON.parse(t).result}catch(e){}
const rows=JSON.parse(t.slice(t.indexOf('[{'),t.lastIndexOf('}]')+2));
(async()=>{const LIVE=await rd('/mnt/project-files/wall2024/fetchback_live_s149.json'),PAR=await rd('/mnt/project-files/wall2024/parent_s149_SDS.json');
 const sum=o=>`st ${o.statement.length} / resp ${o.response.length} / malformed ${o.malformed.length} / prose ${o.prose.length}`;
 const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 for(const r of rows){const a=LIVE(r.full_reply),b=PAR(r.full_reply);console.log(r.seat.padEnd(8),'live',sum(a),'| parent',sum(b),'| identical',same(a,b));}
 const sol=rows.find(r=>r.seat==='sol').full_reply;const b=PAR(sol);
 console.log('sol labels read:',[...new Set(b.response.map(s=>s.label))].length,'e.g.',JSON.stringify(b.response[0]).slice(0,200));
 console.log('sol K-KJV:',JSON.stringify(b.statement.find(s=>/K-KJV/.test(s.label))).slice(0,140));
 const P=[
  ['em dash','RESPONSE: K-W DEFENDER CR3 LINK 3 #7 — NOT HELD: "x" -- y'],
  ['en dash','STATEMENT: K-S3 S3 DEFENDER CR4: #1 – TOUCHES NO LINK: z'],
  ['bold','**RESPONSE: K-W DEFENDER CR3 LINK 3 #7 -- NOT HELD: q**'],
  ['pipe kept','RESPONSE: K-W DEFENDER CR3 LINK 3 #7 | NOT HELD: a -- b'],
  ['no K label','STATEMENT: The judge -- said this'],
  ['no spaced dash','RESPONSE: K-G1 cure: no K-G1 item flagged; no BROKEN line'],
  ['unspaced dash','RESPONSE: K-W DEFENDER CR3 LINK 3 #7--NOT HELD: q'],
  ['other form','RESULT: UNDERDETERMINED -- reason'],
 ];
 for(const [n,l] of P){const a=LIVE(l),c=PAR(l);console.log(('plant '+n).padEnd(22),'live',sum(a),'| parent',sum(c),c.response[0]||c.statement[0]?JSON.stringify((c.response[0]||c.statement[0])).slice(0,120):'');}
})();
