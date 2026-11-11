const L=require('./lib.cjs');
const an=L.items('Alternate Needed?')[0];
for(const s of an.summary) console.log(s.seat,'recomputed',JSON.stringify(s.recomputed).slice(0,800));
const cec=L.items('Close Enforcer Record')[0];
console.log('CEC',JSON.stringify(cec.cec).slice(0,6000));
const ex=L.items('Close Enforcer Record')[0].cec_log; for(const r of ex) console.log('cec_log',JSON.stringify(r).slice(0,1800));
const j=L.items('Judge Contradiction Record')[0];
console.log('JCC',JSON.stringify(j.jcc).slice(0,4000));
for(const r of j.jcc_log) console.log('jcc_log',JSON.stringify(r).slice(0,1500));
