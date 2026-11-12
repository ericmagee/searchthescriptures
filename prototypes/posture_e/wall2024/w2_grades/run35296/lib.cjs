const fs=require('fs');let RD=null;
const rd=()=>RD||(RD=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35296_full.json','utf8')).data.resultData.runData);
const out=(n,run=-1)=>{const r=rd()[n];if(!r)return null;const x=r[run<0?r.length+run:run];return x&&x.data&&x.data.main?x.data.main.flat().filter(Boolean).map(i=>i.json):[];};
const strs=v=>{const s=[];const w=x=>{if(typeof x==='string')s.push(x);else if(x&&typeof x==='object')for(const k in x)w(x[k]);};w(v);return s;};
module.exports={rd,out,strs};
