// loader: node outputs of 34852
const fs=require('fs');const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34852_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const out=(n,i=0)=>{const r=rd[n];if(!r)return null;return r.map(x=>x.data&&x.data.main?x.data.main.flat().filter(Boolean).map(z=>z.json):null);};
module.exports={rd,out};
