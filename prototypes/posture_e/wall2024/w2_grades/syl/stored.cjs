// W2 grade pkgSYL S12: Build Save Body, s125 vs SYL, on every stored run that reaches it; diff of output JSON.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s125.json'),B=g('/mnt/project-files/wall2024/parent_s125_SYL.json');const nd=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
(async()=>{for(const f of fs.readdirSync('/mnt/project-files/wall2024').filter(f=>/^ex\d+_full\.json$/.test(f))){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f));const rd=(X.data||X).resultData.runData;
 if(!rd['Build Save Body']){console.log(f,'Build Save Body NOT REACHED');continue;}
 const a=await run(nd(A,'Build Save Body'),'Build Save Body',rd),b=await run(nd(B,'Build Save Body'),'Build Save Body',rd);
 if(a.err||b.err){console.log(f,'ERR',a.err,b.err);continue;}
 const ja=a[0].json||a[0],jb=b[0].json||b[0];const sa=JSON.stringify(ja),sb=JSON.stringify(jb);
 const keys=new Set([...Object.keys(ja.body||ja),...Object.keys(jb.body||jb)]);
 const st=JSON.stringify(rd['Build Save Body'][rd['Build Save Body'].length-1].data.main[0][0].json).replace(/\d{4}-\d\d-\d\dT[\d:.]+Z/g,'');
 console.log(f,'live==stored',sa.replace(/\d{4}-\d\d-\d\dT[\d:.]+Z/g,'')===st,'| SYL==live',sa===sb,'| len diff',sb.length-sa.length);
 if(sa!==sb){const sya=JSON.stringify(ja).match(/"synthesis":"((?:[^"\\]|\\.)*)"/)[1],syb=JSON.stringify(jb).match(/"synthesis":"((?:[^"\\]|\\.)*)"/)[1];
  console.log('  only synthesis differs:',sa.replace(sya,'')===sb.replace(syb,''));const La=JSON.parse('"'+sya+'"').split('\n'),Lb=JSON.parse('"'+syb+'"').split('\n');Lb.filter(l=>!La.includes(l)).forEach(l=>console.log('  + '+l));console.log('  removed lines:',La.filter(l=>!Lb.includes(l)).length);}}})();
