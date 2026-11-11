const fs=require('fs');let j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s139.json','utf8'));j=j.data||j;const W=j.workflow||j;
for(const n of ['Format Markdown','Plain Rule Lines','Raise If Incomplete']){const c=W.nodes.find(x=>x.name===n).parameters.jsCode||'';console.log('=====',n,c.length);console.log(c.slice(0,600));console.log('...');console.log(c.slice(-1500));}
