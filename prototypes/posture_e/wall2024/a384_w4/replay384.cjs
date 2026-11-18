// ASK 384 replay: old (live) REFP against new REFP over every stored round in debate_results (878 rows, 8 round columns).
// Per round text: parse items matched by number position; each change is classed R1 (bare list number), R2 (chapter end / verse below 1), R3 (cap), or SIDE.
const fs=require('fs');const O=require('./refp_old.cjs'),N=require('./refp_new.cjs');
const rows=JSON.parse(fs.readFileSync(__dirname+'/rounds_all.json'));const VL=JSON.parse(fs.readFileSync(__dirname+'/vlen.json'));
const CE={};fs.readFileSync(__dirname+'/ce66.txt','utf8').trim().split(';').forEach((s,i)=>{CE[O.BOOKS[i]]=s.split(',').map(Number);});
const C={rounds:0,odv1Rounds:0,itemsOld:0,itemsNew:0};const cls={};const ex={};const add=(k,e)=>{cls[k]=(cls[k]||0)+1;(ex[k]=ex[k]||[]).length<12&&ex[k].push(e);};
const CAPS=[[12,true],[40,true],[30,true],[30,false]];const keyDiff={};
const r1cost=[];const andWord=[];const ps0=[];const sheet=[];
for(const row of rows){for(const [col,t] of Object.entries(row.r)){if(!t)continue;C.rounds++;const odv=/^ODV1-/.test(row.rt||'');if(odv)C.odv1Rounds++;const T=String(t);const tag=(row.rt||row.id)+' '+col;
 for(const sc of [true]){const po=O.parse(T,{scoped:sc}),pn=N.parse(T,{scoped:sc});C.itemsOld+=po.length;C.itemsNew+=pn.length;
  const m=a=>{const M=new Map();a.forEach(x=>M.set(x.pos,x));return M;};const MO=m(po),MN=m(pn);
  for(const [p,x] of MO){const b=x.book||x.ctx;const y=MN.get(p);const ctx=T.slice(Math.max(0,x.at-30),Math.min(T.length,x.end+40)).replace(/\s+/g,' ');
   if(!y){add('R1 drop (bare number after a comma, followed by a word)',tag+' | '+ctx);const nx=T.slice(p).match(/^\d+\s*([A-Za-z]+)/);r1cost.push({tag,b,label:x.label,next:nx?nx[1]:'',ctx});continue;}
   if(y.c!==x.c||y.v1!==x.v1||y.v2!==x.v2||(y.book||y.ctx)!==b)add('SIDE item changed',tag+' | '+ctx);}
  for(const [p,y] of MN)if(!MO.has(p)){const ctx=T.slice(Math.max(0,y.at-30),Math.min(T.length,y.end+40)).replace(/\s+/g,' ');add('R1 add (bare number after "and" or "&")',tag+' | '+ctx);}
  for(const y of pn){const b=y.book||y.ctx;if(!b)continue;const mx=(CE[b]||[])[y.c-1];const ctx=T.slice(Math.max(0,y.at-30),Math.min(T.length,y.end+30)).replace(/\s+/g,' ');
   if(y.v1<1){add('R2 refuse: verse below 1',tag+' | '+b+' '+y.label+' | '+ctx);if(b==='Psalms')ps0.push(tag+' | '+b+' '+y.label);}
   else if(!mx)add('R2 refuse: no such chapter',tag+' | '+b+' '+y.label+' | '+ctx);
   else if(y.v1>mx)add('R2 refuse: verse past chapter end',tag+' | '+b+' '+y.label+' (ends '+mx+') | '+ctx);
   else if(y.v2>mx)add('R2 clip: range past chapter end',tag+' | '+b+' '+y.label+' (ends '+mx+') | '+ctx);
   const z=Math.min(y.v2,mx||y.v2);if(mx&&y.v1>=1&&y.v1<=mx){for(const [cap] of [[12],[40],[30]]){if(z-y.v1+1>cap)add('R3 cut at '+cap+' (old: first verse only)',tag+' | '+b+' '+y.label+' | '+ctx);}}
  }
  const aw=[...T.matchAll(/\d{1,3}:\d{1,3}\s+and\s+(\d{1,3})\s+([a-z]+)/g)];aw.forEach(x=>andWord.push(tag+' | '+T.slice(Math.max(0,x.index-25),x.index+x[0].length+15).replace(/\s+/g,' ')));
 }
 for(const [cap,sc] of CAPS){const a=new Set(O.keys(T,{scoped:sc,cap}).map(k=>k.key)),b=new Set(N.keys(T,{scoped:sc,cap}).map(k=>k.key));const K='cap '+cap+(sc?' scoped':' unscoped');const d=keyDiff[K]=keyDiff[K]||{roundsChanged:0,keysLost:0,keysGained:0,oldKeys:0,newKeys:0};
  d.oldKeys+=a.size;d.newKeys+=b.size;let ch=false;for(const k of a)if(!b.has(k)){d.keysLost++;ch=true;}for(const k of b)if(!a.has(k)){d.keysGained++;ch=true;}if(ch)d.roundsChanged++;
  if(cap===12&&sc){const ln=s=>[...s].reduce((q,k)=>q+(VL[k]||0),0);sheet.push({tag,oldN:a.size,newN:b.size,oldC:ln(a),newC:ln(b)});}}
}}
const out={counts:C,classes:cls,keyDiff,r1cost:{n:r1cost.length,byNext:Object.entries(r1cost.reduce((q,x)=>(q[x.next.toLowerCase()]=(q[x.next.toLowerCase()]||0)+1,q),{})).sort((a,b)=>b[1]-a[1]).slice(0,40)},andWordN:andWord.length,psalm0:ps0,
 sheet:{maxNewN:Math.max(...sheet.map(s=>s.newN)),maxNewC:Math.max(...sheet.map(s=>s.newC)),overV:sheet.filter(s=>s.newN>150&&s.oldN<=150).map(s=>s.tag+' '+s.oldN+'->'+s.newN),overC:sheet.filter(s=>s.newC>24000&&s.oldC<=24000).map(s=>s.tag+' '+s.oldC+'->'+s.newC),alreadyOverV:sheet.filter(s=>s.oldN>150).length,alreadyOverC:sheet.filter(s=>s.oldC>24000).length}};
fs.writeFileSync(__dirname+'/replay384_out.json',JSON.stringify({out,ex,r1cost,andWord},null,1));
console.log(JSON.stringify(out,null,1));
