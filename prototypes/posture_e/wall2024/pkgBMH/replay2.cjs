const fs=require('fs');const rows=require('/mnt/project-files/w4/bmh/cols.json');const out={};
for(const f of fs.readdirSync('.').filter(f=>f.startsWith('imp_live_'))){const nm=f.slice(9,-3);let L,C;try{L=require('./'+f);C=require('./imp_cand_'+nm+'.js');}catch(e){console.log(nm,'LOAD FAIL',e.message.slice(0,80));continue;}
 let lost=0;const nw=new Set();for(const r of rows)for(const k of ['CR2','DR2']){const a=L.harvest({[k]:r.v}),b=C.harvest({[k]:r.v});const as=new Set(a.map(x=>x.sentence)),bs=new Set(b.map(x=>x.sentence));for(const x of a)if(!bs.has(x.sentence))lost++;for(const x of b)if(!as.has(x.sentence))nw.add(r.id.slice(0,8)+'|'+x.sentence.slice(0,40));}
 console.log(nm,'lost',lost,'new',nw.size,[...nw].map(s=>s.slice(0,8)).sort().join(','));}
