const fs=require('fs');const {live,rounds}=require('/mnt/project-files/w4/vp1b/h2.cjs');
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34852_full.json','utf8'));const RD=X.data.resultData.runData;
const body=RD['Panel Judges Prep'][0].data.main[0][0].json.body;const R0=rounds(live,body);
for(const k in R0){const s=String(R0[k]);if(!/LINK 4:/.test(s))continue;s.split('\n').forEach((l,i)=>{if(/LINK \d:|Matthew 1:20|Matthew 1:25|Luke 1:32/.test(l))console.log(k,i,l.slice(0,330));});}
