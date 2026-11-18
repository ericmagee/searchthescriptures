const fs=require('fs');const O=require('./refp_old.cjs'),N=require(process.argv[2]);const VL=JSON.parse(fs.readFileSync(__dirname+'/vlen.json'));
const rows=JSON.parse(fs.readFileSync(__dirname+'/rounds_all.json'));const S={};const ex={};
for(const row of rows)for(const [col,t] of Object.entries(row.r)){if(!t)continue;for(const [cap,sc] of [[12,true],[40,true],[30,true],[30,false]]){const K='cap '+cap+(sc?' scoped':' unscoped');const s=S[K]=S[K]||{lostReal:0,lostPhantom:0,gainedReal:0,gainedPhantom:0};
 const a=new Set(O.keys(t,{scoped:sc,cap}).map(k=>k.key)),b=new Set(N.keys(t,{scoped:sc,cap}).map(k=>k.key));
 for(const k of a)if(!b.has(k)){if(VL[k]!=null){s.lostReal++;(ex[K]=ex[K]||[]).length<8&&ex[K].push((row.rt||row.id)+' '+col+' '+k);}else s.lostPhantom++;}
 for(const k of b)if(!a.has(k)){if(VL[k]!=null)s.gainedReal++;else s.gainedPhantom++;}}}
console.log(JSON.stringify(S,null,0));console.log(JSON.stringify(ex,null,1));
