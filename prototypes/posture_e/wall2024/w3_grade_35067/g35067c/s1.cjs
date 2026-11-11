const fs=require('fs');
const j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));
console.log(Object.keys(j));
const rd=(j.data&&j.data.resultData||j.resultData).runData;
const out=[];
for(const [k,v] of Object.entries(rd)){const s=v.map(r=>JSON.stringify(r.data||'').length);out.push(k+' runs='+v.length+' sizes='+s.join(',')+' err='+v.map(r=>r.error?1:0).join(''));}
console.log(out.join('\n'));
