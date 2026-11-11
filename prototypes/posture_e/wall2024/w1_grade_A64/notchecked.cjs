// W1: grades left unchecked (MAX_CALLS cap), live s128 vs pkgA1N, all stored runs and the three enforcer build nodes.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');
const A=L(process.argv[2]),B=L(process.argv[3]);const P='/mnt/project-files/wall2024/';
(async()=>{for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;
for(const n of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){if(!rd[n])continue;const a=await run(A.code(n),n,rd),b=await run(B.code(n),n,rd);
const na=(a[0]&&a[0].not_checked)||[],nb=(b[0]&&b[0].not_checked)||[];console.log(e.slice(2,7),n,'calls',a.length,b.length,'not_checked',na.length,nb.length,nb.length>na.length?'LOST: '+nb.filter(x=>!na.includes(x)).join(','):'');}}})();
