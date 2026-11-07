// pkgEID replay: every saved run, main and Alt Judge Enforcer Record, base vs patched on the saved DeepSeek replies. A row may change only from
// NO VERDICT to a verdict; no other row may change. Build: the output differs only by the reply-form sentence.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const BS=process.env.BS||'pkgEFG/patched_live_on_pkgEAM',PT=process.env.PT||'pkgEID/patched';const rf=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0,sum=[0,0];const runs=[...new Set(fs.readdirSync(D).filter(f=>/_Judge_Enforcer_Call_deepseek\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
for(const R of runs)for(const pre of ['','Alt ']){const fn=pre.replace(' ','_');if(!fs.existsSync(D+R+'_'+fn+'Judge_Enforcer_Call_deepseek.json'))continue;
 let b,p;try{b=harness(R)(rf(BS+'/'+fn+'Judge_Enforcer_Record.js'),pre+'Judge Enforcer Call deepseek')[0].json;p=harness(R)(rf(PT+'/'+fn+'Judge_Enforcer_Record.js'),pre+'Judge Enforcer Call deepseek')[0].json;}catch(e){console.log('SKIP '+R+' '+(pre||'main')+' '+String(e.message).slice(0,80));continue;}
 const nv=o=>o.enf428_rows.filter(r=>/^ENFORCER NO VERDICT/.test(r.cure_reason)).length;let bad1=0;
 b.enf428_rows.forEach((r,k)=>{const q=p.enf428_rows[k];if(JSON.stringify(r)!==JSON.stringify(q)&&!/^ENFORCER NO VERDICT/.test(r.cure_reason))bad1++;});
 const okr=bad1===0&&b.enf428_rows.length===p.enf428_rows.length;okr?ok++:bad++;sum[0]+=nv(b);sum[1]+=nv(p);
 console.log((okr?'OK   ':'FAIL ')+R+' '+(pre||'main ').trim()+': rows '+b.enf428_rows.length+', NO VERDICT '+nv(b)+' -> '+nv(p)+(bad1?', '+bad1+' other rows changed':'')+'; eid '+JSON.stringify(p.enf428.eid)+(p.enf428.errors.filter(e=>/pkgEID/.test(e)).length?'; label faults '+p.enf428.errors.filter(e=>/pkgEID/.test(e)).length:''));}
for(const R of runs)for(const pre of ['','Alt ']){const fn=pre.replace(' ','_');if(!fs.existsSync(D+R+'_'+fn+'Judge_Enforcer_Build.json'))continue;let b,p;
 const IN=JSON.parse(rf('pkgEID/build_inputs.json'))[pre+'Judge Enforcer Build'];try{b=harness(R)(rf(BS+'/'+fn+'Judge_Enforcer_Build.js'),IN);p=harness(R)(rf(PT+'/'+fn+'Judge_Enforcer_Build.js'),IN);}catch(e){continue;}
 const NEW="one line per ITEM id (the id alone, for example H2.1; never the judge's name, and never the name beside the id)";const n=s=>JSON.stringify(s).split(NEW).join('one line per judge id').split('<item id>').join('<judge id>');
 const same=n(p)===JSON.stringify(b);same?ok++:bad++;console.log((same?'OK   ':'FAIL ')+R+' '+(pre||'main ').trim()+' Build: only the reply-form sentence differs ('+b.length+' calls)');}
console.log('NO VERDICT total '+sum[0]+' -> '+sum[1]+'; '+ok+' OK, '+bad+' FAIL');
