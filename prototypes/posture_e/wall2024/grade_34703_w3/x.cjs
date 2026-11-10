const fs=require('fs');const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34703_full.json','utf8'));const RD=(X.data||X).resultData.runData;
const out=(n,k)=>{const r=RD[n];if(!r)return null;const e=r[k==null?r.length-1:k];return e.data&&e.data.main&&e.data.main[0]||[];};
module.exports={RD,out,fs};
if(require.main===module){console.log(Object.keys(RD).map(n=>n+'('+RD[n].length+')').join(', '));}
