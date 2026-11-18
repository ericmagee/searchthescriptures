// ASK 384 rev 4.3 condition 4: every scoped refused item (inferred book, verse out of range), with its context and an auto-hint:
// WB = the same chapter:verse exists in a book named within the 600 characters before it (the reader's wrong book); else UNCLEAR, read by hand.
const fs=require('fs');const N=require('./refp_r43.cjs');const VL=JSON.parse(fs.readFileSync(__dirname+'/vlen.json'));const rows=JSON.parse(fs.readFileSync(__dirname+'/rounds_all.json'));
const out=[];const seen=new Set();
for(const row of rows)for(const [col,t] of Object.entries(row.r)){if(!t)continue;const rf=[];N.keys(t,{scoped:true,cap:12,refused:rf});if(!rf.length)continue;
 for(const y of N.parse(t,{scoped:true})){if(y.book||!y.ctx)continue;const mx=null;const k=y.ctx+' '+y.c+':'+y.v1;if(VL[k]!=null)continue; // in range: not refused
  const pre=t.slice(Math.max(0,y.at-600),y.at);const cands=[...new Set([...pre.matchAll(/((?:[1-3] )?[A-Z][a-z]+)\.? \d{1,3}:/g)].map(m=>N.book(m[1])).filter(Boolean))].filter(b=>b!==y.ctx&&VL[b+' '+y.c+':'+y.v1]!=null);
  const all=N.BOOKS.filter(b=>VL[b+' '+y.c+':'+y.v1]!=null);
  out.push({tag:(row.rt||row.id)+' '+col,key:y.ctx+' '+y.label,hint:cands.length?'WB ('+cands.join('/')+')':'UNCLEAR',anyBook:all.length,ctx:t.slice(Math.max(0,y.at-110),y.end+40).replace(/\s+/g,' ')});}}
fs.writeFileSync(__dirname+'/class186.json',JSON.stringify(out,null,1));const c={};out.forEach(o=>{const h=o.hint.split(' ')[0];c[h]=(c[h]||0)+1;});console.log(out.length,c);
out.filter(o=>o.hint==='UNCLEAR').forEach(o=>console.log(o.key,'| any',o.anyBook,'|',o.ctx));
