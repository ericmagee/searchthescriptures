// W2: Accept Build is nondeterministic in replay; seed Math.random identically for live and pkgDCT and compare on all ten exports.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');const D='w2_grades/dct/';
const seed=()=>{let s=12345;Math.random=()=>{s=(s*1103515245+12345)%2147483648;return s/2147483648;};};const R0=Math.random;
(async()=>{for(const r of fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+r));const rd=(X.data||X).resultData.runData;
 for(const n of ['Accept Build']){if(!rd[n])continue;const S=o=>JSON.stringify(o).replace(/"stack":"[^"]*"/g,'');seed();const a=S(await run(fs.readFileSync(D+'live/Accept_Build.js','utf8'),n,rd));seed();const a2=S(await run(fs.readFileSync(D+'live/Accept_Build.js','utf8'),n,rd));seed();const b=S(await run(fs.readFileSync(D+'trim/Accept_Build.js','utf8'),n,rd));Math.random=R0;
  console.log(r,n,'live==live',a===a2,'| live==trim',a===b,'| err',a.startsWith('{"err"'));}}})();
