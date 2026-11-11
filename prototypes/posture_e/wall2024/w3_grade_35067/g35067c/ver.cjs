const fs=require('fs');
function lib(f){let d=JSON.parse(fs.readFileSync(f));d=d.data||d;d=d.workflow||d;return d;}
const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json')).workflowData;
const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
function rep(name,w){const sl=w.nodes.find(n=>n.name==='Shared Library');const t=sl.parameters.jsCode;console.log(name,'SL',t.length,h(t),'A1N marker',t.includes("SIDE'S OTHER LINES"),t.includes('THE SIDE\\\'S OTHER'),'pointed',t.includes('the block the answer points to'),'RCL as declared',(t.match(/as declared/g)||[]).length);
 for(const nn of ['Judge Enforcer Build','Close Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){const n=w.nodes.find(x=>x.name===nn);console.log('   ',nn,n?n.parameters.jsCode.length+' '+h(n.parameters.jsCode):'-');}}
rep('export',ex);
for(const v of ['127','128','129','130']) rep('s'+v,lib('/mnt/project-files/wall2024/fetchback_live_s'+v+'.json'));
