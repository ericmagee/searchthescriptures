// judge_fix5 test helper: loads lib/*.js blocks (REFP, C4P) for unit tests on the library itself.
const fs=require('fs');const D=__dirname+'/../';
const src=n=>fs.readFileSync(D+'lib/'+n,'utf8');
const load=()=>new Function(src('refp.js')+'\n'+src('close.js')+'\nreturn {REFP,C4P};')();
const F_=r=>({cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4||null,dr4:r.challenger_r4||null});
const run=n=>JSON.parse(fs.readFileSync(D+'data/run'+n+'.json','utf8'));
module.exports={load,F_,run,D};
