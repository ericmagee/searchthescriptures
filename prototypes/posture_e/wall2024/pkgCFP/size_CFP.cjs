// pkgCFP size (W1): code growth and per-run prompt growth of the post-panel enforcer call, live s105 against pkgCFP, on every stored run.
process.chdir(__dirname+'/..');const fs=require('fs');const {harness,D}=require(process.cwd()+'/pkgGSL/harness.cjs');
const code=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;d=d.workflow||d;return d.nodes.find(x=>x.name==='Judge Contradiction Build').parameters.jsCode;};
const L=code('/mnt/project-files/wall2024/fetchback_live_s105.json'),C=code('pkgCFP/parent_s105_CFP.json');console.log('code: Judge Contradiction Build '+L.length+' -> '+C.length+' (+'+(C.length-L.length)+')');
const runs=[...new Set(fs.readdirSync(D).filter(f=>/_Panel_Payloads\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();let tot=0,newCalls=0,ch=0;
for(const r of runs){let a,b;try{a=harness(r,{})(L,'Panel Payloads')[0].json;b=harness(r,{})(C,'Panel Payloads')[0].json;}catch(e){continue;}
 const la=a.cec_skip?0:a.body.messages[1].content.length,lb=b.cec_skip?0:b.body.messages[1].content.length;if(la!==lb){ch++;tot+=lb-la;if(!la&&lb)newCalls++;console.log(r+': prompt '+la+' -> '+lb+' ('+(lb-la>=0?'+':'')+(lb-la)+')'+(!la&&lb?' NEW CALL':''));}}
console.log(runs.length+' runs; prompt changed in '+ch+'; total '+(tot>=0?'+':'')+tot+' characters; new DeepSeek calls '+newCalls);
