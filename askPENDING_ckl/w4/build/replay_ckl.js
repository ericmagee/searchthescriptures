const fs=require('fs');const t=JSON.parse(fs.readFileSync('target_engine_ckl.json','utf8'));const code=t.nodes.find(x=>x.name==='Close Enforcer Record').parameters.jsCode;
new Function('$','$input',code); // compiles the whole patched node
const pre=code.slice(code.indexOf('try{')+4,code.indexOf('const BA='));const blk=fs.readFileSync('ckl_block.js','utf8');
const R=JSON.parse(fs.readFileSync('rounds.json','utf8'));const rows_in=JSON.parse(fs.readFileSync('rows_in.json','utf8'));
const MAP={cr1:'claude_r1',cr2:'claude_r2',cr3:'engine_r3',cr4:'defender_r4',gr1:'engine_r1',gr2:'engine_r2',dr3:'challenger_r3',dr4:'challenger_r4'};
const out=[];for(const tok of [...new Set(rows_in.map(r=>r.t))]){const D=R[tok];const F={};for(const k in MAP)F[k]=D[MAP[k]];const rows=rows_in.filter(r=>r.t===tok).map(r=>({...r}));
 new Function('rows','F',pre+'\n'+blk)(rows,F);for(const r of rows)out.push(r.id+' '+tok.slice(5,10)+' LINK '+r.link+' '+r.status+(r.note?' | '+r.note:''));}
fs.writeFileSync('out_replay_ckl.txt',out.join('\n')+'\n');console.log(out.join('\n'));
