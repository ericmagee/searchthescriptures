const fs=require('fs');const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34726_full.json','utf8'));const RD=(X.data||X).resultData.runData;
const out=(n,k)=>{const r=RD[n];if(!r)return null;const m=r[r.length-1].data&&r[r.length-1].data.main;return m?(m[k||0]||[]).map(x=>x.json):null;};module.exports={RD,out,fs};
