const fs=require('fs');
const j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));
const rd=(j.data&&j.data.resultData||j.resultData).runData;
for(const [k,v] of Object.entries(rd)){const s=JSON.stringify(v);for(const p of process.argv.slice(2)){const n=s.split(p).length-1;if(n)console.log(k,'|',p,'|',n);}}
