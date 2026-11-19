// ASK 433 build (W1; plan a433_w1/plan_rev1.md, PASS W2 9141, W4 9142): add the KJV renderings of G4690 to the ASK 408 sentence in Init with Guards.
// The clause is the PROPOSED form; it is not written until the operator rules on the wording (Oracle-facing text).
// Usage: node a433_w1/build433.cjs LIVE_ENGINE.json BASE_VERSIONID OUT.json
const fs=require('fs'),cr=require('crypto');const [B,V,O]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(B));w=w.workflow||(w.data&&w.data.nodes?w.data:w);
if(w.versionId!==V)throw new Error('base versionId '+w.versionId);
const ANCHOR="by implication, offspring'";const CLAUSE="; the KJV renders it seed (40 times), seeds (3) and issue (1, Matthew 22:25), in 41 verses";
const n=w.nodes.find(x=>x.name==='Init with Guards');const s=n.parameters.jsCode;const k=s.split(ANCHOR).length-1;if(k!==1)throw new Error('anchor occurs '+k);
if(s.includes(CLAUSE))throw new Error('clause already present');const t=s.replace(ANCHOR,()=>ANCHOR+CLAUSE);n.parameters.jsCode=t;fs.writeFileSync(O,JSON.stringify(w));
const sha=x=>cr.createHash('sha256').update(x).digest('hex').slice(0,12);const X=s.split('\n'),Y=t.split('\n');
console.log('BUILT',O,'| Init with Guards text sha256',sha(s),'->',sha(t),'| length',s.length,'->',t.length,'| lines',X.length,Y.length,'| changed lines',X.map((l,i)=>l!==Y[i]?i+1:0).filter(Boolean).join(','),'| clause count',t.split(CLAUSE).length-1);
