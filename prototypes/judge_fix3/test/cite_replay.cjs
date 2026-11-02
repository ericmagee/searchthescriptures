// The citation chain (Citation Scan -> Quote Compare -> Quote Report, KJV reads emulated from data/kjv_*.json) on the stored rounds of 32212:
// with six rounds, the new Citation Scan (close rounds added when present) must give the same report as the live one.
const C=require('./cite_lib.cjs');const RL=require('./replay_lib.cjs');
for(const n of ['32212']){const r=RL.run(n);const a=C.run('base',r),b=C.run('new',r);
 console.log(n,'| base checked',a.report.checked,'matches',a.report.matches,'mismatches',a.report.mismatches,'| new checked',b.report.checked,'matches',b.report.matches,'mismatches',b.report.mismatches,'| identical:',JSON.stringify(a.report)===JSON.stringify(b.report));}
