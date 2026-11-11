const {r,out}=require('./x.cjs');
const am=out('Alternate Merge')[0], gr=out('Gate Record')[0];
console.log('SUMMARY',JSON.stringify(am.summary).slice(0,2500));
console.log('PANEL_EFF',JSON.stringify(am.panel_effective).slice(0,800));
console.log('sb_apply',JSON.stringify(am.sb_apply).slice(0,1200));
console.log('GATE',JSON.stringify(gr.gate).slice(0,1500));
console.log('SENDBACK keys',JSON.stringify(Object.fromEntries(Object.entries(gr.sendback).map(([k,v])=>[k,typeof v==='object'?JSON.stringify(v).slice(0,200):v]))).slice(0,3000));
console.log('enf421',JSON.stringify(gr.enf421).slice(0,600));console.log('enf428',JSON.stringify(gr.enf428).slice(0,1200));
const c=out('Close Enforcer Record')[0];console.log('CEC',JSON.stringify(c.cec).slice(0,3500));console.log('CECLOG',JSON.stringify(c.cec_log).slice(0,2500));
