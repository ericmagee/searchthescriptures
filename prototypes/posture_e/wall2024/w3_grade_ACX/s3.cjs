const fs=require('fs');const D='/mnt/project-files/wall2024/';
const C=JSON.parse(fs.readFileSync(D+'parent_s120_ACX.json'));
for(const n of ['Panel Build','Build Independent Verdict']){const s=C.nodes.find(x=>x.name===n).parameters.jsCode;console.log(n,s.length,s.includes('\nreturn await new Function('),s.slice(0,200))}
