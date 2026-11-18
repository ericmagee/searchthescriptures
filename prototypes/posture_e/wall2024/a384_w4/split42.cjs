// ASK 384 rev 4.2: the R2 split on stored rounds, for scoped (cap 12, 40) and unscoped (library cap 30) callers.
const fs=require('fs');const N=require('./refp_r42.cjs');const rows=JSON.parse(fs.readFileSync(__dirname+'/rounds_all.json'));const CE={};fs.readFileSync(__dirname+'/ce66.txt','utf8').trim().split(';').forEach((s,i)=>{CE[N.BOOKS[i]]=s.split(',').map(Number);});
const S={};const L={sameSentence:[],possessive:[],b4:[]};
for(const row of rows)for(const t of Object.values(row.r)){if(!t)continue;const tag=row.rt||row.id;for(const sc of [true,false]){const K=sc?'scoped':'unscoped';const s=S[K]=S[K]||{named_head:0,named_sameSentence:0,named_possessive:0,refused_4b:0};
 for(const y of N.parse(t,{scoped:sc})){const b=y.book||y.ctx;if(!b)continue;const mx=(CE[b]||[])[y.c-1];if(mx&&y.v1>=1&&y.v1<=mx)continue;const cx=t.slice(Math.max(0,y.at-60),y.end+15).replace(/\s+/g,' ');
  if(y.book){s.named_head++;continue;}if(!y.named){s.refused_4b++;if(!sc)L.b4.length<8&&L.b4.push(tag+' | '+b+' '+y.label+' | '+cx);continue;}
  const before=t.slice(0,y.at);const poss=new RegExp("(?<![A-Za-z0-9])"+"[A-Za-z0-9 ]*['’]s\\b").test(before.slice(-80));
  if(poss&&/['’]s\b/.test(before.slice(-120))){s.named_possessive++;if(sc)L.possessive.push(tag+' | '+b+' '+y.label+' | '+cx);}else{s.named_sameSentence++;if(sc)L.sameSentence.push(tag+' | '+b+' '+y.label+' | '+cx);}}}}
fs.writeFileSync(__dirname+'/split42_out.json',JSON.stringify({S,L},null,1));console.log(JSON.stringify(S));console.log('possessive (scoped)',L.possessive.length);L.possessive.slice(0,8).forEach(x=>console.log('  ',x));console.log('same sentence (scoped)',L.sameSentence.length);L.sameSentence.slice(0,25).forEach(x=>console.log('  ',x));console.log('4b unscoped examples');L.b4.forEach(x=>console.log('  ',x));
