// ASK 384 rev 4.3 condition 5: the unscoped library readers cRefs and cureRefs (cap 30) old against new over every stored judgment text and every stored round.
const fs=require('fs');const O=require('./refp_old.cjs'),N=require('./refp_r43.cjs');const VL=JSON.parse(fs.readFileSync(__dirname+'/vlen.json'));
const J=JSON.parse(fs.readFileSync(__dirname+'/judgments_all.json'));const R=JSON.parse(fs.readFileSync(__dirname+'/rounds_all.json'));
const st={judgments:{texts:0,changed:0,lostReal:0,lostPhantom:0,gainedReal:0,gainedPhantom:0},rounds:{texts:0,changed:0,lostReal:0,lostPhantom:0,gainedReal:0,gainedPhantom:0}};const ex=[];
const run=(K,id,t)=>{for(const sc of [false,true]){const a=new Set(O.keys(t,{scoped:sc,cap:30}).map(k=>k.key)),b=new Set(N.keys(t,{scoped:sc,cap:30}).map(k=>k.key));if(sc)continue;st[K].texts++;let ch=0;
 for(const k of a)if(!b.has(k)){ch=1;VL[k]!=null?st[K].lostReal++:st[K].lostPhantom++;if(VL[k]!=null&&ex.length<20)ex.push(K+' '+id+' lost real '+k);}for(const k of b)if(!a.has(k)){ch=1;VL[k]!=null?st[K].gainedReal++:st[K].gainedPhantom++;}st[K].changed+=ch;}};
for(const j of J)if(j.v)run('judgments',j.id,j.v);for(const r of R)for(const [c,t] of Object.entries(r.r))if(t)run('rounds',(r.rt||r.id)+' '+c,t);
console.log(JSON.stringify(st));ex.forEach(x=>console.log(x));
