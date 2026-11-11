const fs=require('fs');let j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s139.json','utf8'));j=j.data||j;const W=j.workflow||j;
const N=n=>W.nodes.find(x=>x.name===n);const C=W.connections;const into=t=>Object.entries(C).filter(([s,v])=>JSON.stringify(v).includes('"node":"'+t+'"')).map(([s])=>s);
const pt=N('Panel Tokens');console.log(pt.type);console.log(pt.parameters.jsCode);
console.log('into Panel Tokens',into('Panel Tokens'),'out',JSON.stringify(C['Panel Tokens']));
console.log('Write Tokens? params',JSON.stringify(N('Write Tokens?').parameters).slice(0,600));
// chain from Build Save Body forward
let cur='Build Save Body';for(let i=0;i<14;i++){const o=C[cur];if(!o)break;const nx=o.main.flat().map(x=>x.node);console.log(cur,'->',nx.join(', '));cur=nx[0];}
