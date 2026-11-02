// A7 replay: the synthesis checks of Build Save Body (base and new), run on the node's own code (the E6 block cut from the file, run with d =
// the row), on the stored synthesis and rounds of runs 32157, 32194, 32205, 32212 (judge_fix2's read) and 32228, 32255 (this read).
const fs=require('fs');const RL=require('./replay_lib.cjs');const D=__dirname+'/../';
const blk=v=>{const s=fs.readFileSync(D+v+'/Build Save Body.js','utf8');const a=s.indexOf('// judge_fix2 E6');return s.slice(a,s.indexOf("const RN=FF.length?FF.join(' '):null;",a));};
const go=(v,d)=>{const FF=[];new Function('d','FF',blk(v))(d,FF);return FF;};
const SY=JSON.parse(fs.readFileSync(D+'data/synthesis_32157-32212.json','utf8')).map(x=>({n:x.run_token.slice(5,10),s:x.synthesis}));
for(const n of ['32228','32255'])SY.push({n,s:RL.run(n).synthesis});
for(const x of SY){const r=RL.run(x.n);const d={synthesis:x.s,cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};
 const b=go('base',d),w=go('new',d);const c=(a,k)=>a.filter(l=>l.includes('('+k+')')).length;
 console.log('\n=== run '+x.n+' | base S-A '+c(b,'S-A')+' S-B '+c(b,'S-B')+' S-C '+c(b,'S-C')+' S-D '+c(b,'S-D')+' | new S-A '+c(w,'S-A')+' S-B '+c(w,'S-B')+' S-C '+c(w,'S-C')+' S-D '+c(w,'S-D')+' S-E '+c(w,'S-E'));
 w.filter(l=>!b.includes(l)).forEach(l=>console.log('  + '+l.slice(18,300)));b.filter(l=>!w.includes(l)).forEach(l=>console.log('  - '+l.slice(18,300)));}
