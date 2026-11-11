const fs=require('fs');
const j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));
console.log(j.id,j.status,j.startedAt,j.stoppedAt,j.workflowId);
const wd=j.workflowData;console.log(wd&&Object.keys(wd), wd&&wd.versionId, wd&&wd.nodes&&wd.nodes.length);
if(wd&&wd.nodes){const sl=wd.nodes.find(n=>n.name==='Shared Library');console.log(sl&&sl.parameters.jsCode.length);const jb=wd.nodes.find(n=>n.name==='Judge Enforcer Build');console.log(jb.parameters.jsCode.length);}
console.log(Object.keys(j.data||{}), JSON.stringify(j.data&&j.data.resultData&&Object.keys(j.data.resultData)));
