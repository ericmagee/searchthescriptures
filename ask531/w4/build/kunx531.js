// ASK 531 criterion 6 report (W4): every K-UNX gate item and K-UNX mark on 41418, base (live) and target, as stored (crit1) and under 524 (crit2).
const fs=require('fs');
for(const f of ['crit1_41418.json','crit2_41418.json']){const o=JSON.parse(fs.readFileSync(f,'utf8'));
 for(const side of ['base','target']){const gb=o[side]['Gate Build']||[];const rows=[];
  for(const g of gb){const j=g.json||g;for(const x of (j.items||[]))if(/K-UNX/.test(String(x.key||'')+' '+String(x.why||'')+' '+String(x.kind||'')))rows.push(j.seat+': '+x.kind+' '+String(x.why||'').replace(/\s+/g,' ').slice(0,170));
   const m=String(JSON.stringify(j.body||'')).match(/\[AUDIT v4\d: DEBATE RULE VIOLATION \(K-UNX\)[^\]]{0,160}/g);if(m)for(const q of new Set(m))rows.push(j.seat+': MARK '+q.slice(0,190));}
  const pr=o[side]['Panel Payloads']||null;
  console.log(f.replace('_41418.json',''),side,'K-UNX gate items:',rows.length);for(const r of rows)console.log('   '+r);}}
