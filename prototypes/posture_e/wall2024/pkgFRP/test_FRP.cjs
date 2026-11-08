// pkgKS3Q test: every patched node with a saved run, base (strip_A2R = live s63 library) vs patched. Expect: byte-equal everywhere except
// where a gate K re-read raised a K-S3 item whose quote was already in the pre-change text (33731 grok G2).
const fs=require('fs');const {harness,feeder,D}=require('../pkgGSL/harness.cjs');
const BASE=process.argv[2]||'pkgLIB/strip_A2R_KS3Q',PAT=process.argv[3]||'pkgLIB/strip_A2R_KS3Q_FRP',FB='/mnt/project-files/wall2024/fetchback_live_s63.json';
const plan=JSON.parse(fs.readFileSync('pkgFRP/plan_FRP.json','utf8'));
const wrap=s=>/\bawait\b/.test(s)?'return (async()=>{\n'+s+'\n})();':s;
const runs=[...new Set(fs.readdirSync(D).map(f=>f.split('_')[0]).filter(r=>/^\d{5}$/.test(r)))].sort();
let ok=0,diff=0,ran=0,skip=0,err=0;
(async()=>{for(const p of plan.patched){const name=p.file.replace(/\.js$/,'').replace(/_/g,' ').replace(/^(Second Alternate|Alternate Needed|Gate Needed)$/,'$1?');
 let fd=feeder(FB,name);if(fd.length>1)fd=fd.filter(x=>/Call openrouter$|Cure Normalize$/.test(x)).slice(-1);if(fd.length!==1){console.log('SKIP node',name,'feeders',fd);continue;}
 const b=wrap(fs.readFileSync(BASE+'/patched/'+p.file,'utf8')),t=wrap(fs.readFileSync(PAT+'/patched/'+p.file,'utf8'));
 for(const r of runs){if(!fs.existsSync(D+r+'_'+name.replace(/ /g,'_')+'.json')){skip++;continue;}
  let o0,o1;try{o0=JSON.stringify(await harness(r)(b,fd[0]));o1=JSON.stringify(await harness(r)(t,fd[0]));}catch(e){err++;console.log('ERR',r,name,String(e.message).slice(0,120));continue;}
  ran++;if(o0===o1){ok++;continue;}diff++;
  const g=o=>{const j=JSON.parse(o);const rows=[];(j||[]).forEach(i=>((i.json&&i.json.gate_rows)||[]).forEach(x=>rows.push(x.seat+' '+x.item+' '+x.cure_status)));return rows;};
  const a=g(o0),c=g(o1);let i=0;while(o0[i]===o1[i])i++;console.log('  at',i,'base:',JSON.stringify(o0.slice(i-150,i+150)));console.log('  pat :',JSON.stringify(o1.slice(i-150,i+150)));console.log('DIFF',r,name,'| base only:',JSON.stringify(a.filter(x=>!c.includes(x))),'| patched only:',JSON.stringify(c.filter(x=>!a.includes(x))));}}
 console.log(`node runs ${ran}: ${ok} equal, ${diff} differ, ${err} errors, ${skip} without a saved run`);})();
