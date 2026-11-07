// pkgKFN replay: v12 vs v13 (pkgKFN) node output for the node runs test_recent reports as changed. Run from wall2024/.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const rd=f=>fs.readFileSync(f,'utf8');
const F='/mnt/project-files/wall2024/fetchback_live_s49.json';
const pairs=(process.argv[2]||'33461:Extract Independent Verdict,33461:Panel Payloads').split(',').map(x=>x.split(':'));
// second check: v12 with its K-F D5 vs C6 mark(s) removed equals v13 exactly
(async()=>{for(const [R,n] of pairs){const f=n.replace(/ /g,'_')+'.js';const IN=feeder(F,n)[0];
 const run=async c=>{try{return JSON.stringify(await harness(R)('return (async()=>{'+c+'\n})()',IN));}catch(e){return 'ERR '+e.message;}};
 const a=await run(rd(''+(process.env.A||'pkgLIB_v12/orig_stack/patched')+'/'+f)),b=await run(rd((process.env.B||'pkgKFN/patched')+'/'+f));
 const re=/(?:\\\\n|\\n)*\[AUDIT v28: DEBATE RULE VIOLATION \(K-F\) -- ZZZNOMATCH/g;const ms=a.match(re)||[];
 const A2=a.replace(re,''),B2=b.replace(re,'');let k=0;while(k<A2.length&&A2[k]===B2[k])k++;let ea=A2.length,eb=B2.length;while(ea>k&&eb>k&&A2[ea-1]===B2[eb-1]){ea--;eb--;}if(A2!==B2)console.log('  rest differs: v12 '+A2.slice(Math.max(0,k-300),ea+20)+'\n  v13 '+B2.slice(Math.max(0,k-300),eb+20));
 console.log('CHECK '+R+' '+n+': '+ms.length+' K-F D5 vs C6 marks in v12, '+((b.match(re)||[]).length)+' in v13; v12 minus them === v13: '+(a.replace(re,'')===b.replace(re,'')));}})();
