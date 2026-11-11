const fs=require('fs');const W='/mnt/project-files/wall2024/';const out=JSON.parse(fs.readFileSync('jprompts.json'));
for(const run of ['33149','33371','33490','33497']){const rd=JSON.parse(fs.readFileSync(W+'ex'+run+'_full.json','utf8')).data.resultData.runData;let best=null,where=null;
 const walk=(o,p)=>{if(typeof o==='string'){if(/COLLISION POINTS/.test(o)&&/PRESSED/.test(o)&&(!best||o.length>best.length)){best=o;where=p;}}else if(o&&typeof o==='object')for(const k in o)walk(o[k],p+'.'+k);};
 for(const n in rd){if(!/Panel Build|Verdict|Judge/.test(n)||/Enforcer|Record/.test(n))continue;rd[n].slice(0,1).forEach(r=>walk(r.data,n));}
 out[run]=best;console.log(run,where,best&&best.length,best?[/AGAINST THE KJV/.test(best),/NOT NAMED:/.test(best),/NEW IN CLOSE/.test(best),/UNPROVEN, not a witness/.test(best)].join(','):'');}
fs.writeFileSync('jprompts.json',JSON.stringify(out));
