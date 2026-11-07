// pkgRMR node test: base vs patched Alternate Merge Seat on every saved run input (harness). The only differences allowed: the three drv_removed
// fields and the "; REMOVED FOR: ..." tail of ALTERNATE TRIED lines. Run from wall2024/: node pkgRMR/test_RMR.cjs [patched dir] [base dir]
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const PT=process.argv[2]||'pkgRMR/patched',BS=process.argv[3]||'pkgRMR/base';const F='Alternate_Merge_Seat.js';
const IN=feeder('/mnt/project-files/wall2024/fetchback_live_s44.json','Alternate Merge Seat')[0];
const b0=fs.readFileSync(BS+'/'+F,'utf8'),p0=fs.readFileSync(PT+'/'+F,'utf8');let ok=0,bad=0,ran=0;const T=(n,c)=>{console.log((c?'OK   ':'FAIL ')+n);c?ok++:bad++;};
T('lib inserted once',p0.split('function rmrOf(').length===2);
const strip=o=>{const j=JSON.parse(JSON.stringify(o));(j.drv_removed||[]).forEach(r=>{delete r.removed_rules;delete r.removed_rules_total;delete r.removed_rules_match;r.verdict_raw=String(r.verdict_raw).replace(/; REMOVED FOR: [^\]]*\]/g,']');});
 j.bodies=(j.bodies||[]).map(b=>{const x=JSON.parse(b);x.payload.verdict_raw=String(x.payload.verdict_raw).replace(/; REMOVED FOR: [^\]]*\]/g,']');return JSON.stringify(x);});return j;};
for(const R of [...new Set(fs.readdirSync(D).filter(f=>/_Alternate_Merge_Seat\.json$/.test(f)).map(f=>f.split('_')[0]))].sort()){
 let b,p;try{b=harness(R)(b0,IN);p=harness(R)(p0,IN);}catch(e){console.log('SKIP '+R+' '+String(e.message).slice(0,90));continue;}ran++;
 const bj=b[0].json,pj=p[0].json;T(R+': nothing else changes',JSON.stringify(strip(pj))===JSON.stringify(strip(bj)));
 (pj.drv_removed||[]).forEach(r=>{T(R+' removed '+r.seat+': drv '+r.drv_uncured+' = read '+r.removed_rules_total+' ['+r.removed_rules.join('; ')+']',r.removed_rules_match===true);});
 const lines=[].concat(...(pj.drv_removed||[]).map(r=>r.verdict_raw.split('\n')),...pj.bodies.map(x=>JSON.parse(x).payload.verdict_raw.split('\n'))).filter(l=>/ALTERNATE TRIED/.test(l));
 lines.forEach(l=>console.log('     '+R+' '+l.replace(/^.*SEAT: ([^;]*);.*RESULT: ([A-Z ]+).*?(; REMOVED FOR: [^\]]*)?\]$/,'$1 $2$3').slice(0,260)));
 T(R+': every ALTERNATE TRIED line names REMOVED FOR',lines.every(l=>/; REMOVED FOR: /.test(l)));}
console.log('ran '+ran+'; '+ok+' OK, '+bad+' FAIL');
