// Joint s130+CMX+NVR: each changed replay must equal the output of the one package that changes it.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const J=L(P+'joint_s130_CMX_NVR.json'),C=L(P+'parent_s130_CMX.json'),N=L(P+'parent_s130_NVR.json');
const S=v=>JSON.stringify(v).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
(async()=>{for(const [e,n,ref,lab] of [['ex33490_full.json','Alt Gate Build',N,'NVR'],['ex35067_full.json','Send Back Record',N,'NVR'],['ex34780_full.json','Panel Cure Check',C,'CMX'],['ex35067_full.json','Panel Cure Check',C,'CMX']]){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;const a=await run(J.code(n),n,rd),b=await run(ref.code(n),n,rd);console.log(e.slice(2,7),n,'joint equals',lab,S(a)===S(b));}})();
