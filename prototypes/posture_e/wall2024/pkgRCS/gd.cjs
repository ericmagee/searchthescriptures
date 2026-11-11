const fs=require('fs');let j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s139.json','utf8'));j=j.data||j;const W=j.workflow||j;const C=W.connections;
const into=t=>Object.entries(C).filter(([s,v])=>JSON.stringify(v).includes('"node":"'+t+'"')).map(([s])=>s);
for(const n of W.nodes.filter(n=>n.type.endsWith('googleDrive')))console.log(n.name,'| in',into(n.name),'| out',JSON.stringify(C[n.name]||{}).slice(0,200),'|',JSON.stringify(n.parameters).slice(0,400));
let cur='Write Tokens';for(let i=0;i<25;i++){const o=C[cur];if(!o)break;const nx=o.main.flat().map(x=>x.node);console.log(cur,'->',nx.join(', '));cur=nx[0];}
