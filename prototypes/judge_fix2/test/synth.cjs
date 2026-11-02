// E6 replay: the synthesis checks of Build Save Body (new) on the stored synthesis and rounds of the four runs, run on the node's own code
// (the E6 block cut from the file and run with d = the row). Prints each review line.
const fs=require('fs');const RL=require('./replay_lib.cjs');const s=fs.readFileSync(__dirname+'/../new/Build Save Body.js','utf8');
const a=s.indexOf('// judge_fix2 E6');const b=s.indexOf("const RN=FF.length?FF.join(' '):null;",a);const blk=s.slice(a,b);
const run=d=>{const FF=[];new Function('d','FF',blk)(d,FF);return FF;};
const SY=JSON.parse(fs.readFileSync(__dirname+'/../data/synthesis.json','utf8'));
if(require.main===module)for(const x of SY){const n=x.run_token.slice(5,10);const r=RL.run(n);const d={synthesis:x.synthesis,cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};
 const out=run(d);console.log('\n=== run',n,'| synthesis checks:',out.length);out.forEach(l=>console.log('  '+l.slice(0,420)));}
module.exports={run};
