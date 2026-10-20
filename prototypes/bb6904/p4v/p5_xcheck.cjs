// Worker_A3 cross-check: count K-B DEFENDER items with the portion 3 drvCheck itself (the extractor's selection), on the text the extractor sees.
// Usage: node p5_xcheck.cjs <p4/drv_block_0b3cbac.js> <rows.json from Worker_E p5/rows.sql>
const fs=require('fs');eval(fs.readFileSync(process.argv[2],'utf8').replace(/^const /gm,'var '));
const rows=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));let tot=0;
for(const r of rows){let t=r.raw;const k=t.indexOf('\n\n[AUDIT v');const body=k>=0?t.slice(0,k):t;let tx=body;try{const j=JSON.parse(body);tx=j.reasoning!=null?j.reasoning:(j.reason||body);}catch(e){}
 const res=drvCheck(String(tx),r.conc,null,r.ds,null,false);const kb=res.items.filter(x=>x.rule==='K-B');const d=kb.filter(x=>x.side==='DEFENDER');tot+=d.length;
 console.log(r.src,r.seat,'K-B items',kb.length,'defender',d.length,'links',[...new Set(d.map(x=>x.link))].join(','),'| other rules',res.items.filter(x=>x.rule!=='K-B').map(x=>x.rule+(x.side?' '+x.side:'')).join(','));}
console.log('defender K-B total',tot);
