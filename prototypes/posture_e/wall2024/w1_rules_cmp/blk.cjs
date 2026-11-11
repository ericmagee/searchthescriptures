const fs=require('fs');const [run,needle,len]=process.argv.slice(2);const W='/mnt/project-files/wall2024/';const rd=JSON.parse(fs.readFileSync(W+'ex'+run+'_full.json','utf8')).data.resultData.runData;
let best=null,bp=null;const walk=(o,p)=>{if(typeof o==='string'){const i=o.indexOf(needle);if(i>=0&&(!best||o.length<best.length)&&!/ENFORCER|ANSWER CHECK/.test(o.slice(Math.max(0,i-300),i))){best=o;bp=p;}}else if(o&&typeof o==='object')for(const k in o)walk(o[k],p+'.'+k);};
for(const n in rd)rd[n].forEach((r,i)=>walk(r.data,n+'#'+i));
if(!best){console.log('not found');process.exit();}const i=best.indexOf(needle);console.log(bp,best.length);console.log(best.slice(Math.max(0,i-200),i+(+len||2500)));
