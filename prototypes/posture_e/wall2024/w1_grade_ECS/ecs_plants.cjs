const fs=require('fs');const {one}=require('./ecs_run.cjs');
(async()=>{const base=()=>JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35173_full.json','utf8')).data.resultData.runData;
let rd=base();delete rd['Close Enforcer Record'];delete rd['Judge Contradiction Record'];await one(rd,'Q4 no CER/JCR');
rd=base();const j=rd['Close Enforcer Record'][0].data.main.flat()[0].json;const conf=j.cec.confirmed;j.cec.flagged=(j.cec.flagged||[]).concat(conf);j.cec.confirmed=[];await one(rd,'Q5 flagged not confirmed');
rd=base();rd['Close Enforcer Record'][0].data.main.flat()[0].json.cec.confirmed=[{...conf[0],link:3}];await one(rd,'Q1 confirmed D3 not D5');
rd=base();rd['Close Enforcer Record'][0].data.main.flat()[0].json.cec.confirmed=[{...conf[0],side:'CHALLENGER',link:6}];await one(rd,'Q2 confirmed CHALLENGER 6');
})();
