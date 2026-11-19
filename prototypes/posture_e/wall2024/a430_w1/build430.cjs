// ASK 430 build (W1; plan a430_w1/plan_rev2.md, PASS W2 9125, W4 9134): apply p430.cjs (rev 2) to L2 Count Plan of a live engine fetch.
// Usage: node a430_w1/build430.cjs LIVE_ENGINE.json BASE_VERSIONID OUT.json
const fs=require('fs'),cr=require('crypto');const p430=require('./p430.cjs');const [B,V,O]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(B));w=w.workflow||(w.data&&w.data.nodes?w.data:w);
if(w.versionId!==V)throw new Error('base versionId '+w.versionId);const n=w.nodes.find(x=>x.name==='L2 Count Plan');const s=n.parameters.jsCode;const t=p430(s);n.parameters.jsCode=t;
const sha=x=>cr.createHash('sha256').update(x).digest('hex').slice(0,12);fs.writeFileSync(O,JSON.stringify(w));
const X=s.split('\n'),Y=t.split('\n');const d=X.map((l,i)=>l!==Y[i]?i+1:0).filter(Boolean);
console.log('BUILT',O,'| L2 Count Plan text sha256',sha(s),'->',sha(t),'| length',s.length,'->',t.length,'| lines',X.length,Y.length,'| changed lines',d.join(','));
