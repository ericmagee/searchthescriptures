// W2 addition to the pkgECB grade: P1.3 plant and the Alt / R2 Alt copies.
const fs=require('fs');const run=require('../../pkgKSR/run_node.cjs');const {rebuild}=require('../../pkgLIB/unpack.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const W={s110:L('/mnt/project-files/wall2024/fetchback_live_s110.json'),ECB:L('pkgKSR/parent_s110_ECB.json')};
const src=(set,n)=>{const w=W[set];const c=w.nodes.find(x=>x.name===n).parameters.jsCode;return /^\/\/ pkgLIB stub/.test(c)?rebuild(c,w.nodes.find(x=>x.name==='Shared Library').parameters.jsCode):c;};
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const RD=(X.data||X).resultData.runData;
const nt=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');const items=o=>(Array.isArray(o)?o:[]).flatMap(j=>(j.items||[]));
const SB='Send Back Build';
(async()=>{
 // P1.3: a judge's own line (luna S1, E-ANS) that states the phrase in its own words
 const T1='this answer addresses the title, not the stated motives.';const s=JSON.stringify(RD);const n1=s.split(T1).length-1;
 const R=JSON.parse(s.split(T1).join(T1+' Link 6 is BROKEN BY A CONFIRMED CLOSING CONTRADICTION, so the motives matter here.'));
 const a=await run(src('s110',SB),SB,R),b=await run(src('ECB',SB),SB,R);
 const f=o=>items(o).filter(i=>/Matthew 1:19 \[CR3\]/.test(i.item)&&/motives matter here/.test(i.line));
 const ns=JSON.stringify(b.map(j=>j.sb_not_sent||[]));
 console.log('P1.3 occurrences replaced',n1,'| s110 sends the planted item:',f(a).length,'| ECB sends it:',f(b).length,'| ECB not_sent names it:',/motives matter here/.test(ns),'| items s110',items(a).length,'ECB',items(b).length);
 // Alt copies: source diff of each copy against s110, inserted text compared with the main copy's
 const ins=n=>{const x=src('s110',n),y=src('ECB',n);let i=0;while(i<x.length&&x[i]===y[i])i++;let j=0;while(j<x.length-i&&x[x.length-1-j]===y[y.length-1-j])j++;return y.slice(i,y.length-j);};
 const m=ins(SB);for(const n of ['Alt Send Back Build','R2 Alt Send Back Build'])console.log('SRC',n,'inserted',ins(n).length,'equal to main copy insert:',ins(n)===m);
 // Alt Send Back Build with items: feed it the main Judge Enforcer Record output in place of Alt Judge Enforcer Record
 const R2=JSON.parse(JSON.stringify(RD));const jer=R2['Judge Enforcer Record'][0].data.main;R2['Alt Judge Enforcer Record'][0].data.main=jer;
 for(const n of ['Alt Send Back Build']){const a2=await run(src('s110',n),n,R2),b2=await run(src('ECB',n),n,R2);
  console.log('ALT',n,'s110',a2.err||items(a2).length+' items, on break lines '+items(a2).filter(i=>/BROKEN BY A CONFIRMED/.test(i.line)).length,'| ECB',b2.err||items(b2).length+' items, on break lines '+items(b2).filter(i=>/BROKEN BY A CONFIRMED/.test(i.line)).length);}
})();
;(async()=>{const T1='this answer addresses the title, not the stated motives.';const s=JSON.stringify(RD);
 const R=JSON.parse(s.split(T1).join(T1+' Link 6 is BROKEN BY A CONFIRMED CLOSING CONTRADICTION, so the motives matter here.'));
 const b=await run(src('ECB',SB),SB,R);b.forEach(j=>console.log('NOTSENT',j.seat,JSON.stringify(j.sb_not_sent||[]).slice(0,900)));})();
