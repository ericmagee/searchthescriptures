const ord=require('fs').readFileSync(__dirname+'/ord.js','utf8');const f=new Function('d','FF',ord);
const d8=require('../a281/rounds8.json').concat(require('../a279/d37032.json'));let n=0;
for(const r of d8){const d={cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,cr4:r.defender_r4,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3,dr4:r.challenger_r4};const FF=[];f(d,FF);if(FF.length){n++;console.log(r.id.slice(0,8),FF[0].slice(0,900),'\n');}}
console.log('debates with a line',n,'of',d8.length);
