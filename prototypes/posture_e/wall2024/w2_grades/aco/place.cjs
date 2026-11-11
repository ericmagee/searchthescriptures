// where the planted notes land in the single judge's request (plant A of plants.cjs, 33490)
const fs=require('fs');const W='/mnt/project-files/wall2024/';const {run}=require('./replay.cjs');
const X=JSON.parse(fs.readFileSync(W+'ex33490_full.json','utf8'));const rd=(X.data||X).resultData.runData;const AR0=rd['Anticheat Record'].slice(-1)[0].data.main[0];
const a=JSON.parse(JSON.stringify(AR0));const j=a[0].json;const D=Object.assign({},j.acx.rows.find(r=>r.side==='D'),{answer:'REVERSED',shown:true}),C=Object.assign({},j.acx.rows.find(r=>r.side==='C'),{answer:'REVERSED',shown:true});j.acx.reversed={D:[D],C:[C]};
(async()=>{const b=await run('Build Independent Verdict',rd,{'Anticheat Record':a},null);const m=b[0].json.verdictBody.messages[3];const t=typeof m.content==='string'?m.content:JSON.stringify(m.content);
 const heads=[...t.matchAll(/\n(={2,}[^\n]*|#+ [^\n]*|[A-Z][A-Z ()'’:,0-9-]{10,90})\n/g)].map(x=>[x.index,x[1].slice(0,80)]);
 let i=-1;while((i=t.indexOf('[ANTI-CHEAT CHECK',i+1))>=0){const prev=heads.filter(h=>h[0]<i).slice(-2),next=heads.find(h=>h[0]>i);console.log('NOTE at',i,'about',t.slice(i+150,i+215).replace(/\n/g,' '),'\n   after headers',JSON.stringify(prev.map(h=>h[1])),'\n   next header',JSON.stringify(next&&next[1]),'\n   text before:',JSON.stringify(t.slice(i-140,i)));}})();
