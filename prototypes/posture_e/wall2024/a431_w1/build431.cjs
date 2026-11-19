// ASK 431 build (W1 builds W3's plan a431_w3/plan_rev1.md; JUDGE-FACING, not written until the operator rules): p431 on live L2 Count Plan.
// Usage: node a431_w1/build431.cjs LIVE_ENGINE.json BASE_VERSIONID OUT.json
const fs=require('fs'),cr=require('crypto');const P=require('./p431.cjs');const [B,V,O]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(B));w=w.workflow||(w.data&&w.data.nodes?w.data:w);
if(w.versionId!==V)throw new Error('base versionId '+w.versionId);const n=w.nodes.find(x=>x.name==='L2 Count Plan');const s=n.parameters.jsCode;const t=P(s);n.parameters.jsCode=t;
const sha=x=>cr.createHash('sha256').update(x).digest('hex').slice(0,12);fs.writeFileSync(O,JSON.stringify(w));const X=s.split('\n'),Y=t.split('\n');
console.log('BUILT',O,'| L2 Count Plan text sha256',sha(s),'->',sha(t),'| length',s.length,'->',t.length,'| lines',X.length,Y.length,'| changed lines',X.map((l,i)=>l!==Y[i]?i+1:0).filter(Boolean).join(','));
