const fs=require('fs');const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34726_full.json','utf8'));const RD=(X.data||X).resultData.runData;
const out=n=>(RD[n]||[]).map(r=>((r.data||{}).main||[]).map(b=>(b||[]).map(i=>i.json)));
module.exports={RD,out,first:n=>{const o=out(n);return o[0]&&o[0][0]&&o[0][0][0];}};
