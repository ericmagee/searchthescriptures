// ASK 438 (plan a438_w2/plan_rev0.md, PASS W3 9114, W1 9117): raise the Part B gloss caps in L2 Gloss Plan.
// Usage: node build438.cjs ENGINE_BASE.json BASE_VERSIONID OUT.json
const fs=require('fs');const [B,V,O]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(B));w=w.data&&w.data.nodes?w.data:w;
if(w.versionId!==V)throw new Error('base versionId '+w.versionId);
const n=w.nodes.find(x=>x.name==='L2 Gloss Plan');let c=n.parameters.jsCode;
const once=(o,v)=>{const k=c.split(o).length-1;if(k!==1)throw new Error('"'+o.slice(0,50)+'" occurs '+k);c=c.replace(o,()=>v);};
if(/\b(GLOSS_CAP|NUM_CAP)\b/.test(c))throw new Error('name taken');once("const __G340=(()=>{try{","const GLOSS_CAP=250,NUM_CAP=100;const __G340=(()=>{try{");
once("const G=gl.slice(0,60);","const G=gl.slice(0,GLOSS_CAP);");
once(".slice(0,30);if(G.length<60&&",".slice(0,NUM_CAP);if(G.length<GLOSS_CAP&&");
once("for(const n of [...new Set(__G340.gloss.flatMap(g=>g.nums))].slice(0,30))","for(const n of [...new Set(__G340.gloss.flatMap(g=>g.nums))].slice(0,NUM_CAP))");
n.parameters.jsCode=c;fs.writeFileSync(O,JSON.stringify(w));console.log('BUILT',O);
