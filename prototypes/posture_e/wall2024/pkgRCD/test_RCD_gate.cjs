// pkgRCD test 2 of 3: Gate Build / Alt Gate Build gate item keys, strip_RI5B vs strip_RCD, on the runs the combined replay lists as differing.
const fs=require('fs');const {harness,feeder}=require(process.cwd()+'/pkgGSL/harness.cjs');
const F='/mnt/project-files/wall2024/fetchback_live_s61.json';const [A,B]=['pkgLIB/strip_RI5B','pkgLIB/strip_RCD'];
const todo={'Gate Build':'33218 33222 33261 33411 33497 33575 33592 33644 33682 33731 33750','Alt Gate Build':'33442 33482'};
const run=async(src,R,IN)=>{try{return await Promise.resolve(harness(R)('return (async()=>{'+src+'\n})()',IN));}catch(e){return [];}};
const keys=out=>{const s=new Set();const visit=(o,seat)=>{if(Array.isArray(o)){o.forEach(x=>visit(x,seat));return;}if(!o||typeof o!=='object')return;const st=o.seat||seat;if(o.key&&o.kind)s.add(st+' '+o.key);for(const k of Object.keys(o))visit(o[k],st);};visit(out,'?');return s;};
let tot={rm:0,add:0};
(async()=>{for(const [nm,rs] of Object.entries(todo)){const f=nm.replace(/ /g,'_')+'.js';const IN=feeder(F,nm)[0];const a0=fs.readFileSync(A+'/patched/'+f,'utf8'),b0=fs.readFileSync(B+'/patched/'+f,'utf8');
 for(const R of rs.split(' ')){const ka=keys(await run(a0,R,IN)),kb=keys(await run(b0,R,IN));const rm=[...ka].filter(k=>!kb.has(k)),add=[...kb].filter(k=>!ka.has(k));tot.rm+=rm.length;tot.add+=add.length;
  console.log(nm,R,'removed:',rm.join(', ')||'-','| added:',add.join(', ')||'-');}}console.log('TOTAL removed',tot.rm,'added',tot.add);})();
