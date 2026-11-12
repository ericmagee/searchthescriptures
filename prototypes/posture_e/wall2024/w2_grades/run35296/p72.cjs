// pkgP72 checks A, C, E on stored node outputs of run 35296; also replay the Builds on s146 fetchback and compare to stored
const {rd,out,strs}=require('./lib.cjs');const fs=require('fs');
const rows=[];
for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){const runs=rd()[node];if(!runs)continue;for(let ri=0;ri<runs.length;ri++){const o=out(node,ri);for(const j of o){const txt=strs(j.body).join('\n');for(const x of (j.ids||[]))if(x.rule==='E-PREM'){const k=txt.indexOf('- '+x.id+' ('+x.seat+'): ');let blk='';if(k>=0){let seg=txt.slice(k+3);const e=seg.search(/\n- P\d+\.\d+ \(|\nITEM /);if(e>=0)seg=seg.slice(0,e);const m=seg.match(/MISSES OR FAILS \(ruling 372\): ([^]*)/);if(m)blk=m[1];}
 rows.push({node,ri,id:x.id,seat:x.seat,item:x.item,r372:x.r372||[],blk,line:x.flagged_line,inPrompt:k>=0});}}}}
const allBlk=[];for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){const runs=rd()[node];if(!runs)continue;for(let ri=0;ri<runs.length;ri++)for(const j of out(node,ri)){const t=strs(j.body).join('\n');allBlk.push(...(t.match(/\(ruling 372\): /g)||[]));}}
console.log('E-PREM ids',rows.length,'| in prompt',rows.filter(r=>r.inPrompt).length,'| with block',rows.filter(r=>r.blk).length,'| with r372',rows.filter(r=>r.r372.length).length,'| mismatches',rows.filter(r=>!!r.blk!==!!r.r372.length).length,'| block headers in all request text',allBlk.length);
for(const r of rows.filter(r=>r.blk||r.r372.length))console.log('\n#',r.node,'run',r.ri,r.id,r.seat,'|',r.item,'| r372',JSON.stringify(r.r372),'\n  JUDGE LINE:',r.line.slice(0,600),'\n  BLOCK:',r.blk.slice(0,900));
fs.writeFileSync('p72_rows.json',JSON.stringify(rows,null,1));
