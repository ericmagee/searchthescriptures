// W1, run 35067: node status, code-error scan, and pkgDCT replay (s130 live code vs stored output; s126 untrimmed code vs s130 code) on the run's own data.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');
const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));const rd=ex.data.resultData.runData;
console.log('status',ex.status||ex.data.status,'finished',ex.finished,'nodes ran',Object.keys(rd).length,'lastNode',ex.data.resultData.lastNodeExecuted);
let errs=[];for(const [n,r] of Object.entries(rd))for(const x of r)if(x.error||x.executionStatus==='error')errs.push(n+': '+JSON.stringify(x.error).slice(0,200));console.log('node errors',errs.length,errs.join('\n'));
const s=JSON.stringify(rd);const pat=/(ReferenceError|is not defined|TypeError|is not a function|is not iterable|Cannot read propert)[^"\\]{0,120}/g;const hits={};for(const m of s.matchAll(pat))hits[m[0]]=(hits[m[0]]||0)+1;console.log('code-error text hits',JSON.stringify(hits,null,1));
const live=L('/tmp/claude-0/live_now.json'),old=L('/mnt/project-files/wall2024/prewrite_s127_DCT.json');
const strip=v=>JSON.stringify(v).replace(/\*\*Run time:\*\* \d+ min \d+ s \(started [^)]*\)/g,'<clock>').replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
const LATER=new Set(['Close Enforcer Build']);
(async()=>{const names=fs.readFileSync(__dirname+'/nodes95.txt','utf8').trim().split('\n');let R=[],NR=[],rep={same:0,diff:[],olddiff:[],err:[]};
for(const n of names){if(!rd[n]){NR.push(n);continue;}R.push(n);
 const stored=rd[n][rd[n].length-1].data&&rd[n][rd[n].length-1].data.main?rd[n][rd[n].length-1].data.main[0].map(x=>x.json):null;
 const a=await run(live.code(n),n,rd);if(a&&a.err){rep.err.push(n+' live: '+a.err);continue;}
 if(stored&&strip(a)!==strip(stored))rep.diff.push(n);else rep.same++;
 if(!LATER.has(n)){const b=await run(old.code(n),n,rd);if(b&&b.err)rep.err.push(n+' s126: '+b.err);else if(strip(a)!==strip(b))rep.olddiff.push(n);}}
console.log('95 list: REACHED',R.length,'NOT REACHED',NR.length,'\nNOT REACHED:',NR.join('; '));
console.log('live code reproduces stored output:',rep.same,'differ:',rep.diff.join('; '));console.log('s126 untrimmed vs s130 output differ:',rep.olddiff.join('; ')||'none');console.log('replay errors:',rep.err.join(' | ')||'none');})();
