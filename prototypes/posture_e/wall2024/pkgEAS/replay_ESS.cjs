// pkgESS replay: both Retry Build nodes, live s47 vs patched, on every saved run that has the enforcer call data. Lists each retried call and why.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
const runs=[...new Set(fs.readdirSync(D).filter(f=>/_Judge_Enforcer_Call_deepseek\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();let ok=0,bad=0;
for(const R of runs)for(const pre of ['','Alt ']){const fn=pre.replace(' ','_');if(!fs.existsSync(D+R+'_'+fn+'Judge_Enforcer_Call_deepseek.json'))continue;let b,p;
 try{b=harness(R)(rd('pkgESS/base_s47/'+fn+'Judge_Enforcer_Retry_Build.js'),pre+'Judge Enforcer Call deepseek');p=harness(R)(rd('pkgESS/patched/'+fn+'Judge_Enforcer_Retry_Build.js'),pre+'Judge Enforcer Call deepseek');}catch(e){console.log('SKIP '+R+' '+(pre||'main')+' '+String(e.message).slice(0,90));continue;}
 const sum=o=>o.filter(x=>x.json.esr_retry).map(x=>'call '+(x.json.esr_of+1)+' half '+x.json.esr_half+' ('+x.json.ids.length+' ids): '+x.json.esr_why);
 const bs=sum(b),ps=sum(p);const keep=bs.every(x=>ps.includes(x));keep?ok++:bad++;
 console.log((keep?'OK   ':'FAIL ')+R+' '+(pre||'main').trim()+': base '+bs.length+' halves, patched '+ps.length+(ps.length!==bs.length?'\n   '+ps.filter(x=>!bs.includes(x)).join('\n   '):''));}
console.log(ok+' OK, '+bad+' FAIL (OK = every base retry is kept)');
