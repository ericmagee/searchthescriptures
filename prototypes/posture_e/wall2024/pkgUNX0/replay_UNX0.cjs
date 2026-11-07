// pkgUNX0 replay: base vs patched on saved inputs. Reports identical outputs, or the K-UNX items that differ.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const FB='/mnt/project-files/wall2024/fetchback_live_s32.json';
const DIR=process.argv[3]||'pkgUNX0/patched';const BDIR=DIR==='pkgUNX0/patched'?'pkgUNX0/base':DIR+'_base';
const RUNS=(process.argv[2]||'33197,33218,33222,33249,33261,33276,33289,33299').split(',');const NODES=['Panel Payloads','Alternate Payloads','Panel Cure Check','Alternate Merge Seat','Gate Record','Alt Gate Record'];
const ku=s=>[...new Set([...s.matchAll(/\(K-UNX\) -- ([A-Z]+ premise \d+)|NEW RULE K-UNX[^"]{0,120}?([A-Z]+ premise \d+)|RULE K-UNX \(K re-read\)[^\]]{0,200}?([A-Z]+ premise \d+)/g)].map(m=>m[0].slice(0,60)))];
let diff=0,ok=0;
for(const RUN of RUNS)for(const N of NODES){const f=N.replace(/ /g,'_')+'.js';const inN=feeder(FB,N)[0];
 let ob,op;try{ob=JSON.stringify(harness(RUN)(fs.readFileSync(BDIR+'/'+f,'utf8'),inN));}catch(e){console.log(RUN,N,'SKIP:',String(e.message).slice(0,80));continue;}
 op=JSON.stringify(harness(RUN)(fs.readFileSync(DIR+'/'+f,'utf8'),inN));
 if(ob===op){ok++;console.log(RUN,N.padEnd(20),'IDENTICAL');continue;}diff++;const a=ku(ob),b=ku(op);
 console.log(RUN,N.padEnd(20),'DIFFERS | K-UNX only in base:',a.filter(x=>!b.includes(x)).join(' / ')||'none','| only in patched:',b.filter(x=>!a.includes(x)).join(' / ')||'none');}
console.log(ok+' identical, '+diff+' differ');
