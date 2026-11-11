const ex=JSON.parse(require('fs').readFileSync('/mnt/project-files/wall2024/ex35173_full.json','utf8'));
const rd=(ex.data&&ex.data.resultData&&ex.data.resultData.runData)||ex.resultData?.runData||ex.runData;
const pats=[/D5 vs C6[^\\]{0,80}/g,/CLOSE-CONTRADICTION[^\\]{0,120}/g];
for(const [n,runs] of Object.entries(rd)){
  const s=JSON.stringify(runs);
  const out=new Map();
  for(const p of pats){ for(const m of s.matchAll(p)){ out.set(m[0],(out.get(m[0])||0)+1);} }
  if(out.size && /Alt|grok|Recompute|Close|Panel Tally|Tally|Gate/i.test(n)) { console.log('==',n); for(const [k,v] of out) if(v<50) console.log(' ',v,k.slice(0,160)); }
}
