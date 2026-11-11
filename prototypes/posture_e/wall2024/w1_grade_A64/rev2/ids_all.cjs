// W1 re-grade pkgA1N rev 2: item ids sent per run and node, live vs rev 2; any stray "olt" key in a call body.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../../pkgKSR/run_node.cjs');
const A=L(process.argv[2]),B=L(process.argv[3]);const P='/mnt/project-files/wall2024/';
const ids=o=>[...JSON.stringify(o.map(x=>x.body)).matchAll(/ITEM ([A-Z]+\d+) \(/g)].map(m=>m[1]).sort().join(',');
(async()=>{for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;
for(const n of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){if(!rd[n])continue;const a=await run(A.code(n),n,rd),b=await run(B.code(n),n,rd);
const s=JSON.stringify(b);console.log(e.slice(2,7),n,'ids equal',ids(a)===ids(b),'items',ids(a).split(',').length,'olt key',/"olt"/.test(s),'other-lines items',(s.match(/THE SIDE'S OTHER LINES/g)||[]).length,'payload +'+(s.length-JSON.stringify(a).length));}}})();
