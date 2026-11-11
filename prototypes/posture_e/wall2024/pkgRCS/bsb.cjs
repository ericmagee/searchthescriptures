const fs=require('fs');let j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s139.json','utf8'));j=j.data||j;const W=j.workflow||j;
const c=W.nodes.find(x=>x.name==='Build Save Body').parameters.jsCode;console.log('len',c.length);
let i=-1;const hits=[];const re=/input_tokens|cache_read_tokens|usage/g;let m;while((m=re.exec(c))){hits.push(m.index)}
console.log(hits.length);
const seen=new Set();for(const h of hits){const k=Math.floor(h/1500);if(seen.has(k))continue;seen.add(k);console.log('=== @',h);console.log(c.slice(Math.max(0,h-700),h+800));}
