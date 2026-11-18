// ASK 384 final counts for the Wall: per rule set (W1 R1 = refp_new, narrow = refp_new4) against live (refp_old).
const fs=require('fs');const O=require('./refp_old.cjs');const VL=JSON.parse(fs.readFileSync(__dirname+'/vlen.json'));const rows=JSON.parse(fs.readFileSync(__dirname+'/rounds_all.json'));
const COLS=['claude_r1','engine_r1','claude_r2','engine_r2','engine_r3','challenger_r3','defender_r4','challenger_r4'];
const CE={};fs.readFileSync(__dirname+'/ce66.txt','utf8').trim().split(';').forEach((s,i)=>{CE[O.BOOKS[i]]=s.split(',').map(Number);});
function run(NM){const N=require(NM);const r={items:{dropped:0,added:0},keys:{},r3:{},r2:{refuse:0,clip:0},sheet:{maxN:0,maxC:0,overV:[],overC:[],oldMaxN:0,oldMaxC:0},keptProseWords:{}};
 for(const row of rows){const texts=COLS.map(c=>row.r[c]).filter(Boolean);
  for(const t of texts){const po=O.parse(t,{scoped:true}),pn=N.parse(t,{scoped:true});const so=new Set(po.map(x=>x.pos)),sn=new Set(pn.map(x=>x.pos));po.forEach(x=>{if(!sn.has(x.pos))r.items.dropped++;});pn.forEach(x=>{if(!so.has(x.pos))r.items.added++;});
   for(const y of pn){const b=y.book||y.ctx;if(!b)continue;const mx=(CE[b]||[])[y.c-1];if(!mx||y.v1<1||y.v1>mx){r.r2.refuse++;continue;}if(y.v2>mx)r.r2.clip++;const len=Math.min(y.v2,mx)-y.v1+1;
    for(const cap of [12,30,40]){const k='cap '+cap;r.r3[k]=r.r3[k]||{lastVerseLost:0,gains:0};if(len===cap+1)r.r3[k].lastVerseLost++;else if(len>cap+1)r.r3[k].gains++;}
    if(!y.head){const nx=(t.slice(y.pos).match(/^\d+\s+([a-z]+)\b/)||[])[1];if(nx){r.keptProseWords[nx]=(r.keptProseWords[nx]||0)+1;}}}
   const a=new Set(O.keys(t,{scoped:true,cap:12}).map(k=>k.key)),b=new Set(N.keys(t,{scoped:true,cap:12}).map(k=>k.key));const K=r.keys;K.lostReal=(K.lostReal||0);K.lostPhantom=K.lostPhantom||0;K.gained=K.gained||0;
   for(const k of a)if(!b.has(k)){if(VL[k]!=null)K.lostReal++;else K.lostPhantom++;}for(const k of b)if(!a.has(k))K.gained++;}
  // whole-debate sheet: union of every round, as the last sheet of a debate reads (upper bound)
  const sh=(R)=>{const seen=new Set();for(const t of texts)for(const k of R.keys(String(t),{scoped:true,cap:12}))seen.add(k.key);let n=0,c=0;for(const k of seen){if(VL[k]==null)continue;n++;c+=VL[k];}return [n,c];};
  const [on,oc]=sh(O),[nn,nc]=sh(N);r.sheet.maxN=Math.max(r.sheet.maxN,nn);r.sheet.maxC=Math.max(r.sheet.maxC,nc);r.sheet.oldMaxN=Math.max(r.sheet.oldMaxN,on);r.sheet.oldMaxC=Math.max(r.sheet.oldMaxC,oc);
  if(nn>150)r.sheet.overV.push((row.rt||row.id)+' '+on+'->'+nn);if(nc>24000)r.sheet.overC.push((row.rt||row.id)+' '+oc+'->'+nc);}
 r.keptProseWords=Object.entries(r.keptProseWords).sort((a,b)=>b[1]-a[1]);return r;}
const out={W1_R1:run('./refp_new.cjs'),narrow:run('./refp_new4.cjs')};fs.writeFileSync(__dirname+'/final384_out.json',JSON.stringify(out,null,1));
for(const k in out){const o=out[k];console.log(k,JSON.stringify({items:o.items,keys:o.keys,r2:o.r2,r3:o.r3,sheet:{...o.sheet,overV:o.sheet.overV.length,overC:o.sheet.overC.length}}));}
console.log('narrow overV',out.narrow.sheet.overV.slice(0,20).join('; '));console.log('narrow overC',out.narrow.sheet.overC.slice(0,20).join('; '));
console.log('narrow kept words',out.narrow.keptProseWords.length,JSON.stringify(out.narrow.keptProseWords));
