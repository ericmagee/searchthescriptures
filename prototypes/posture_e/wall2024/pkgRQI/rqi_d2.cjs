const fs=require('fs');const {LV,PK,run,mask}=require('./replay_nodes.cjs');
(async()=>{const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35379_full.json','utf8')).data.resultData.runData;
const W=process.argv[3]==='pkg'?PK:LV;console.log(mask(await run(W,rd,'Cure Check',[])));})();
