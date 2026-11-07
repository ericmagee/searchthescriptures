// pkgEIS replay: every saved run, main and Alt Judge Enforcer Record, live s46 vs patched on the saved DeepSeek replies. A row may change only from NO VERDICT.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rf=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0,sum=[0,0];const runs=[...new Set(fs.readdirSync(D).filter(f=>/_Judge_Enforcer_Call_deepseek\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
for(const R of runs)for(const pre of ['','Alt ']){const fn=pre.replace(' ','_');if(!fs.existsSync(D+R+'_'+fn+'Judge_Enforcer_Call_deepseek.json'))continue;let b,p;
 try{b=harness(R)(rf('pkgEIS/base_s46/'+fn+'Judge_Enforcer_Record.js'),pre+'Judge Enforcer Call deepseek')[0].json;p=harness(R)(rf('pkgEIS/patched/'+fn+'Judge_Enforcer_Record.js'),pre+'Judge Enforcer Call deepseek')[0].json;}catch(e){console.log('SKIP '+R+' '+(pre||'main')+' '+String(e.message).slice(0,80));continue;}
 const nv=o=>o.enf428_rows.filter(r=>/^ENFORCER NO VERDICT/.test(r.cure_reason)).length;let bad1=0;
 b.enf428_rows.forEach((r,k)=>{const q=p.enf428_rows[k];if(JSON.stringify(r)!==JSON.stringify(q)&&!/^ENFORCER NO VERDICT/.test(r.cure_reason))bad1++;});
 const okr=bad1===0&&b.enf428_rows.length===p.enf428_rows.length;okr?ok++:bad++;sum[0]+=nv(b);sum[1]+=nv(p);
 console.log((okr?'OK   ':'FAIL ')+R+' '+(pre||'main ').trim()+': rows '+b.enf428_rows.length+', NO VERDICT '+nv(b)+' -> '+nv(p)+(bad1?', '+bad1+' other rows changed':'')+(p.enf428.eid.seat_first?'; seat_first '+p.enf428.eid.seat_first:''));}
console.log('NO VERDICT total '+sum[0]+' -> '+sum[1]+'; '+ok+' OK, '+bad+' FAIL');
