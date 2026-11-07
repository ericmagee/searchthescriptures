// pkgCPD replay: base (live s32) vs patched, on the saved node inputs. Parity = outputs identical once v50 marks are cut and counted_premises arrays masked.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const FB='/mnt/project-files/wall2024/fetchback_live_s32.json';
const RUNS=(process.argv[2]||'33197,33218,33222,33249,33261,33276,33289,33299').split(',');const NODES=['Panel Cure Check','Alternate Merge Seat','Gate Record','Alt Gate Record','Alternate Merge'];
const AR=/counted_premises_(defender|challenger)(?:\\)*"\s*:\s*\[([^\]]*)\]/g;const MK=/(?:\\+n)?\[AUDIT v50: .*?; END\]/g;
const arrs=s=>[...s.matchAll(AR)].map(m=>m[1][0].toUpperCase()+'['+m[2].replace(/\s/g,'')+']');const mask=s=>s.replace(MK,'').replace(AR,'CP[]');
let bad=0;
for(const RUN of RUNS)for(const N of NODES){const f=N.replace(/ /g,'_')+'.js';const inN=feeder(FB,N)[0];const H=harness(RUN);
 let ob,op;try{ob=JSON.stringify(H(fs.readFileSync('pkgCPD/base/'+f,'utf8'),inN));}catch(e){console.log(RUN,N,'SKIP base:',String(e.message).slice(0,90));continue;}
 try{op=JSON.stringify(harness(RUN)(fs.readFileSync('pkgCPD/patched/'+f,'utf8'),inN));}catch(e){console.log(RUN,N,'FAIL patched:',e.message);bad++;continue;}
 const A=arrs(ob),B=arrs(op);const ch=[];for(let i=0;i<Math.max(A.length,B.length);i++)if(A[i]!==B[i])ch.push('#'+i+' '+A[i]+' -> '+B[i]);
 const marks=[...new Set([...op.matchAll(MK)].map(m=>m[0].replace(/^(\\+n)+/,'').replace(/\\+"/g,'"')))];const par=mask(ob)===mask(op);if(!par)bad++;
 console.log(RUN,N.padEnd(22),'parity',par?'OK':'FAIL','| array changes',ch.length?[...new Set(ch.map(c=>c.replace(/^#\d+ /,'')))].join('; ')+' (x'+ch.length+')':'none');
 for(const m of marks)console.log('    ',m.slice(0,330));}
console.log(bad?bad+' FAIL':'ALL PARITY OK');
