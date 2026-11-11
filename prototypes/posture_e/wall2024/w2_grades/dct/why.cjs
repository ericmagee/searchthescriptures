// W2: show where a replay output differs, live vs pkgDCT, for one export and node.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');const fn=n=>n.replace(/[^A-Za-z0-9]+/g,'_')+'.js';const D='w2_grades/dct/';
const [r,n]=process.argv.slice(2);const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+r));const rd=(X.data||X).resultData.runData;
(async()=>{const oa=JSON.stringify(await run(fs.readFileSync(D+'live/'+fn(n),'utf8'),n,rd)),ob=JSON.stringify(await run(fs.readFileSync(D+'trim/'+fn(n),'utf8'),n,rd));
let i=0;while(i<oa.length&&oa[i]===ob[i])i++;console.log(n,'lengths',oa.length,ob.length,'first diff at',i);console.log('LIVE:',oa.slice(Math.max(0,i-200),i+300));console.log('TRIM:',ob.slice(Math.max(0,i-200),i+300));})();
