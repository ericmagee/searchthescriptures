const fs=require('fs');let j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s139.json','utf8'));j=j.data||j;const W=j.workflow||j;
const N=n=>W.nodes.find(x=>x.name===n);const wt=N('Write Tokens');console.log(JSON.stringify(wt.parameters).slice(0,1500));
const C=W.connections;const into=t=>Object.entries(C).filter(([s,v])=>JSON.stringify(v).includes('"node":"'+t+'"')).map(([s])=>s);
console.log('into Write Tokens',into('Write Tokens'));console.log('out',JSON.stringify(C['Write Tokens']));
for(const s of into('Write Tokens')){console.log('---',s,N(s).type);console.log((N(s).parameters.jsCode||'').slice(0,3000))}
console.log('into Save to DB',into('Save to DB'),'out',JSON.stringify(C['Save to DB']));
