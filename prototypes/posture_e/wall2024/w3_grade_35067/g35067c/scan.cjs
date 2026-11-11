const fs=require('fs');
const j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));
const rd=(j.data&&j.data.resultData||j.resultData).runData;
const pats=process.argv.slice(2);
for(const [k,v] of Object.entries(rd)){const s=JSON.stringify(v);for(const p of pats){const i=s.indexOf(p);if(i>=0)console.log(k,'|',p,'|',s.split(p).length-1,'|',s.slice(Math.max(0,i-80),i+160).replace(/\n/g,' '));}}
