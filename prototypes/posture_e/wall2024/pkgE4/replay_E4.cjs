// E4 replay (W2): build the alternate request from Panel Cure Check's output (early) and from the gate's output (today), with the same
// Alternate Build code (LIB v24_RMR rebuilt), and compare the request body per removed seat by sha256.
const fs=require('fs'),cr=require('crypto');const {harness,D}=require('../pkgGSL/harness.cjs');
const code='return (async()=>{\n'+fs.readFileSync(process.argv[2]||'pkgLIB/strip_RMR/patched/Alternate_Build.js','utf8')+'\n})();';
const sha=o=>cr.createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0,12);
const runs=fs.readdirSync(D).filter(f=>/^\d+_Panel_Cure_Check\.json$/.test(f)).map(f=>f.split('_')[0]).sort();
const tot={runs:0,gateSeats:0,early:0,match:0,mismatch:0,earlyNotRemoved:0,allMatch:0,runsWithRemoval:0};
(async()=>{for(const R of runs){if(!fs.existsSync(D+R+'_Alternate_Needed?.json')&&!fs.existsSync(D+R+'_Gate_Record.json'))continue;
 let e,g;try{e=await harness(R)(code,'Panel Cure Check');}catch(x){console.log(R,'early build error',x.message.slice(0,100));continue;}
 const gIn=fs.existsSync(D+R+'_Alternate_Needed?.json')?'Alternate Needed?':'Gate Record';
 try{g=await harness(R)(code,gIn);}catch(x){console.log(R,'gate build error',x.message.slice(0,100));continue;}
 const m=o=>{const r={};for(const it of (o||[])){const a=it.json.alt;if(a&&!a.skip)r[a.removed_seat]={seat:a.seat,sha:sha(a.body)};}return r;};
 const E=m(e),G=m(g);tot.runs++;const gs=Object.keys(G);if(gs.length)tot.runsWithRemoval++;let all=gs.length>0;
 for(const s of gs){tot.gateSeats++;if(E[s]){tot.early++;if(E[s].sha===G[s].sha&&E[s].seat===G[s].seat)tot.match++;else{tot.mismatch++;all=false;}}else all=false;}
 for(const s of Object.keys(E))if(!G[s])tot.earlyNotRemoved++;if(all)tot.allMatch++;
 console.log(R,'gate alternates:',gs.map(s=>s+'->'+G[s].seat).join(', ')||'-','| early:',Object.keys(E).map(s=>s+'->'+E[s].seat+(G[s]?(E[s].sha===G[s].sha?' MATCH':' DIFF'):' (not removed)')).join(', ')||'-',all?'| RUN USES EARLY':'');}
console.log(JSON.stringify(tot));})();
