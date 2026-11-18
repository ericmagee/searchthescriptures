// ASK 384 rev 4 replay on the target text refp_r4 against live: classes R1, R2 4a, R2 4b, R3, SIDE; real verses lost and gained per caller cap; whole-debate sheets.
const fs=require('fs');const O=require('./refp_old.cjs'),N=require('./refp_r42.cjs');const VL=JSON.parse(fs.readFileSync(__dirname+'/vlen.json'));const rows=JSON.parse(fs.readFileSync(__dirname+'/rounds_all.json'));
const COLS=['claude_r1','engine_r1','claude_r2','engine_r2','engine_r3','challenger_r3','defender_r4','challenger_r4'];const CE={};fs.readFileSync(__dirname+'/ce66.txt','utf8').trim().split(';').forEach((s,i)=>{CE[O.BOOKS[i]]=s.split(',').map(Number);});
const C={R1drop:0,R1add:0,R2a_named:0,R2a_named_clip:0,R2b_refused:0,R2b_clipped:0,SIDE:0};const R3={};const keys={};const ex={R2b:[],R2a:[],cut40:[]};let sh={maxN:0,maxC:0,newV:[],newC:[],oldOverV:0,oldOverC:0};
for(const row of rows){const texts=COLS.map(c=>row.r[c]).filter(Boolean);const tag=row.rt||row.id;
 for(const t of texts){const po=O.parse(t,{scoped:true}),pn=N.parse(t,{scoped:true});const MO=new Map(po.map(x=>[x.pos,x])),MN=new Map(pn.map(x=>[x.pos,x]));
  for(const [p,x] of MO){const y=MN.get(p);if(!y)C.R1drop++;else if(y.c!==x.c||y.v1!==x.v1||y.v2!==x.v2||y.book!==x.book||y.ctx!==x.ctx)C.SIDE++;}for(const p of MN.keys())if(!MO.has(p))C.R1add++;
  for(const y of pn){const b=y.book||y.ctx;if(!b)continue;const mx=(CE[b]||[])[y.c-1];const bad=!mx||y.v1<1||y.v1>mx;const cx=t.slice(Math.max(0,y.at-25),y.end+20).replace(/\s+/g,' ');
   if(y.named){if(bad){C.R2a_named++;ex.R2a.length<10&&ex.R2a.push(tag+' | '+b+' '+y.label+' | '+cx);}else if(y.v2>mx)C.R2a_named_clip++;}
   else{if(bad){C.R2b_refused++;ex.R2b.length<12&&ex.R2b.push(tag+' | '+b+' '+y.label+' | '+cx);continue;}if(y.v2>mx)C.R2b_clipped++;}
   const len=(y.named?y.v2:Math.min(y.v2,mx))-y.v1+1;for(const cap of [12,30,40]){const k='cap '+cap;R3[k]=R3[k]||{cut:0,keysGained:0};if(len-1>cap){R3[k].cut++;R3[k].keysGained+=cap;if(cap===40)ex.cut40.push(tag+' | '+b+' '+y.label);}}}
  for(const [cap,sc] of [[12,true],[40,true],[30,true],[30,false]]){const K='cap '+cap+(sc?' scoped':' unscoped');const s=keys[K]=keys[K]||{lostReal:0,lostPhantom:0,gainedReal:0,gainedPhantom:0};
   const a=new Set(O.keys(t,{scoped:sc,cap}).map(k=>k.key)),b=new Set(N.keys(t,{scoped:sc,cap}).map(k=>k.key));for(const k of a)if(!b.has(k))(VL[k]!=null?s.lostReal++:s.lostPhantom++);for(const k of b)if(!a.has(k))(VL[k]!=null?s.gainedReal++:s.gainedPhantom++);}}
 const u=R=>{const S=new Set();for(const t of texts)for(const k of R.keys(String(t),{scoped:true,cap:12}))S.add(k.key);let n=0,c=0;for(const k of S){if(VL[k]==null)continue;n++;c+=VL[k];}return [n,c];};const [on,oc]=u(O),[nn,nc]=u(N);
 sh.maxN=Math.max(sh.maxN,nn);sh.maxC=Math.max(sh.maxC,nc);if(on>150)sh.oldOverV++;if(oc>24000)sh.oldOverC++;if(nn>150&&on<=150)sh.newV.push(tag+' '+on+'->'+nn);if(nc>24000&&oc<=24000)sh.newC.push(tag+' '+oc+'->'+nc);}
const out={classes:C,R3,keys,sheet:sh,ex};fs.writeFileSync(__dirname+'/final_r42_out.json',JSON.stringify(out,null,1));console.log(JSON.stringify({classes:C,R3,keys,sheet:{...sh}},null,0));console.log(JSON.stringify(ex,null,1));
