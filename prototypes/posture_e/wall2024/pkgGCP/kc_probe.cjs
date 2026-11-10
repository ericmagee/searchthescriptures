// W1 (W2 Wall 4343): would pkgGCP take a K-C count off if its "NOT COUNTED" skip did not cover K-C? Live s112 Gate Record / Alt Gate Record vs that variant, on stored runs.
const fs=require('fs');const H=require('../pkgEAD/harness_clone.cjs');
const OLD="!/^ NOT COUNTED|WHY: no written response/.test(m[4])",NEW="!((m[2]!=='K-C'&&/^ NOT COUNTED/.test(m[4]))||/WHY: no written response/.test(m[4]))";
const runs=(process.argv[2]||'33497').split(',');
(async()=>{for(const run of runs)for(const [node,inps] of [['Gate Record',['Gate Call openrouter','Gate Needed?']],['Alt Gate Record',['Alt Gate Call openrouter','Alt Gate Needed?']]]){
 const f='pkgLIB/strip_S112L/patched/'+node.replace(/ /g,'_')+'.js';const a0=fs.readFileSync(f,'utf8');if(a0.split(OLD).length!==2){console.log(node,'anchor count',a0.split(OLD).length-1);continue;}const b0=a0.replace(OLD,NEW);
 for(const inp of inps){if(!fs.existsSync(H.IN+'/'+run+'_'+inp.replace(/ /g,'_')+'.json'))continue;let A,B;try{A=(await H.run(a0,run,inp))[0].json;B=(await H.run(b0,run,inp))[0].json;}catch(e){console.log(run,node,inp,'not replayable:',String(e.message).slice(0,80));continue;}
  const dv=j=>(j.bodies||[]).map(s=>{const p=JSON.parse(s).payload;return p.judge_seat+':'+p.drv_uncured}).join(' ');const mk=j=>(j.bodies||[]).flatMap(s=>(JSON.parse(s).payload.verdict_raw.match(/\[AUDIT v52:[^\]]*\]/g)||[]));
  console.log(run,node,'(input '+inp+')\n  live s112: '+dv(A)+' | v52 '+mk(A).length+'\n  no K-C skip: '+dv(B)+' | v52 '+mk(B).length+(mk(B).length?'\n    '+mk(B).join('\n    '):''));break;}}})();
