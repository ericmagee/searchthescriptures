// pkgEAK2 test (W2, 11-08). Run from wall2024/: node pkgEAK2/test_EAK2.cjs   Base = pkgEHF/patched Alt Judge Enforcer Build (5bb9b1a348f2).
const fs=require('fs');const crypto=require('crypto');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const B0=fs.readFileSync('pkgEHF/patched/Alt_Judge_Enforcer_Build.js','utf8'),P1=fs.readFileSync('pkgEAK2/patched/Alt_Judge_Enforcer_Build.js','utf8');
T(h(B0)==='5bb9b1a348f2','base is pkgEHF/patched (5bb9b1a348f2: live s59 e80c75967029 + EHF)');
const runs=fs.readdirSync(D).filter(f=>f.endsWith('_Alt_Judge_Enforcer_Build.json')).map(f=>f.split('_')[0]).sort();const st=x=>JSON.stringify(x);
let n=0,same=0,fixed=[],bothSkip=0,want=0,got=0;
for(const RUN of runs){let a,b;try{a=harness(RUN)(B0,'Alt Seated');b=harness(RUN)(P1,'Alt Seated');}catch(e){log('   '+RUN+' skipped: '+String(e.message).slice(0,80));continue;}n++;
 let L=[];try{L=harness(RUN)("return [{json:{L:$('Alternate Merge Seat').first().json.enforcer_log}}];",'Alt Seated')[0].json.L||[];}catch(e){L=[];}
 const w=L.filter(r=>r&&r.kind==='cure'&&r.seat_role==='alternate'&&(r.rule==='K-W'||r.rule==='K-S3')).length;const ek=b.filter(x=>x.json&&x.json.eak);if(w)want++;if(ek.length)got++;
 if(st(a)===st(b)){same++;log('   '+RUN+': unchanged'+(a[0]&&a[0].json.je_skip?' (skip: '+a[0].json.why+')':' ('+a.length+' items'+(a.some(x=>x.json.eak)?', K-W call '+a.find(x=>x.json.eak).json.ids.length+' ids':'')+')')+'; alt K-W/K-S3 rows '+w);continue;}
 const sk=a.length===1&&a[0].json.je_skip;fixed.push(RUN);
 log('   '+RUN+': CHANGED base '+(sk?'skip ('+a[0].json.why+')':a.length+' items')+' -> '+b.length+' items, K-W call '+(ek.length?ek[0].json.ids.length+' ids, code_rows '+(ek[0].json.code_rows||[]).length+' (base skip code_rows '+((a[0].json.code_rows||[]).length)+')':'none')+'; alt K-W/K-S3 rows '+w);
 T(sk&&ek.length===1&&b.length===1&&ek[0].json.ids.length===w&&st(ek[0].json.code_rows)===st(a[0].json.code_rows||[]),RUN+': the base skipped; now one K-W call with one id per alternate row ('+w+') and the skip\'s code_rows kept');}
log('replay over '+n+' runs: '+same+' unchanged, changed '+fixed.join(', '));
T(n>=20,'replay ran ('+n+')');T(fixed.includes('33430')&&fixed.includes('33497'),'bar (W3 3121): 33430 and 33497 now get a K-W item');T(want===got,'every run with alternate K-W/K-S3 cure rows has a K-W call ('+got+' of '+want+')');
// Needed? and Record accept the new output: the K-W item passes Needed? (je_skip false) and Record reads a W reply on it
for(const RUN of ['33430','33497']){const b=harness(RUN)(P1,'Alt Seated');const k=b[0].json;const rep=[{json:{choices:[{finish_reason:'stop',message:{content:k.ids.map(x=>'ENFORCER: '+x.id+' -- AGREE -- NEEDS: NO -- "test"').join('\n')}}]}}];
 let rec=null,e=null;try{const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s58.json','utf8'));const R=fs.existsSync('pkgEAK/patched/Alt_Judge_Enforcer_Record.js')?fs.readFileSync('pkgEAK/patched/Alt_Judge_Enforcer_Record.js','utf8'):W.nodes.find(z=>z.name==='Alt Judge Enforcer Record').parameters.jsCode;
  rec=harness(RUN,{'Alt Judge Enforcer Build':b,'Alt Judge Enforcer Needed?':b,'Alt Judge Enforcer Call deepseek':rep,'Alt Judge Enforcer Retry Call deepseek':null,'Alt Judge Enforcer Retry Build':null,'Alt Judge Enforcer Retry Needed?':null})(R,'Alt Judge Enforcer Call deepseek')[0].json;}catch(x){e=String(x.message).slice(0,200);}
 const rows=rec?(rec.enf428_rows||[]).filter(r=>r.rule==='K-W'||r.rule==='K-S3'):[];log('   '+RUN+' Record: '+(e?'error '+e:rows.length+' K-W/K-S3 rows, NO VERDICT '+rows.filter(r=>/NO VERDICT/.test(st(r))).length));
 T(!e&&rows.length===k.ids.length&&!rows.some(r=>/NO VERDICT/.test(st(r))),RUN+': Record writes one K-W/K-S3 row per id ('+k.ids.length+') with no NO VERDICT');}
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgEAK2/test_EAK2.txt',out.join('\n')+'\n');
