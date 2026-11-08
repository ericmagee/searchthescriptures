// pkgOOS: Judge Enforcer Build, live s63 vs patched, on every saved run. Expect: only the link-round E-OOR reason text differs.
const fs=require('fs');const {harness,feeder,live,D}=require('../pkgGSL/harness.cjs');const FB='/mnt/project-files/wall2024/fetchback_live_s63.json';
const b=live(FB,'Judge Enforcer Build'),t=fs.readFileSync('pkgOOS/out/Judge_Enforcer_Build.js','utf8');const w=s=>/\bawait\b/.test(s)?'return (async()=>{\n'+s+'\n})();':s;
const fd=feeder(FB,'Judge Enforcer Build');const runs=[...new Set(fs.readdirSync(D).filter(f=>f.endsWith('_Judge_Enforcer_Build.json')&&/^\d{5}_Judge/.test(f)).map(f=>f.slice(0,5)))].sort();
(async()=>{let eq=0,df=0,er=0;for(const r of runs){let o0,o1;try{o0=JSON.stringify(await harness(r)(w(b),fd[0]));o1=JSON.stringify(await harness(r)(w(t),fd[0]));}catch(e){er++;continue;}
 if(o0===o1){eq++;continue;}df++;const n=o1.split('If the ground was granted in').length-1;const strip=o1.replace(/\. If the ground was granted in \[(?:CR3|DR3)\], strike the row: CHANGE TO: STRUCK -- <one clause why>/g,'');
 console.log('DIFF',r,'hint x'+n,'equal once the hint is removed:',strip===o0);}
 console.log('feeder',fd,'runs',runs.length,'equal',eq,'differ',df,'errors',er);})();
