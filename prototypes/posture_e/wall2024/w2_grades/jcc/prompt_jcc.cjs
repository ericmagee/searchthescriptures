const fs=require('fs');const W='/mnt/project-files/wall2024/';const id=process.argv[2],n=process.argv[3];
const d=JSON.parse(fs.readFileSync(W+'ex'+id+'_full.json','utf8'));const rd=(d.data&&d.data.resultData&&d.data.resultData.runData)||(d.resultData&&d.resultData.runData);
const j=rd[n][0].data.main[0][0].json;fs.writeFileSync('build_'+id+'_'+n.replace(/ /g,'_')+'.json',JSON.stringify(j,null,1));
const b=j.body||j.payload||j.request||j;console.log(Object.keys(j));const s=typeof b==='string'?b:JSON.stringify(b);console.log(s.length);
