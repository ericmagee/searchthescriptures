// ASK 436 build (W1; plan a436_w1/plan_rev1.md): L2 Count Plan = p436(p430(live)), stacked on ASK 430 (ASK 412). If ASK 430 is live first, pass --on430 to apply p436 alone.
// Usage: node a436_w1/build436.cjs LIVE_ENGINE.json BASE_VERSIONID OUT.json [--on430]
const fs=require('fs'),cr=require('crypto');const P430=require('../a430_w1/p430.cjs'),P436=require('./p436.cjs');const [B,V,O]=process.argv.slice(2);const on430=process.argv.includes('--on430');
let w=JSON.parse(fs.readFileSync(B));w=w.workflow||(w.data&&w.data.nodes?w.data:w);if(w.versionId!==V)throw new Error('base versionId '+w.versionId);
const n=w.nodes.find(x=>x.name==='L2 Count Plan');const s=n.parameters.jsCode;const t=P436(on430?s:P430(s));n.parameters.jsCode=t;
const sha=x=>cr.createHash('sha256').update(x).digest('hex').slice(0,12);fs.writeFileSync(O,JSON.stringify(w));const X=s.split('\n'),Y=t.split('\n');
console.log('BUILT',O,'| L2 Count Plan text sha256',sha(s),'->',sha(t),'| length',s.length,'->',t.length,'| lines',X.length,Y.length,'| changed lines',X.map((l,i)=>l!==Y[i]?i+1:0).filter(Boolean).join(','));
