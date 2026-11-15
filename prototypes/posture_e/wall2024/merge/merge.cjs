// Merge: library stack (a306) + node-only builds (293, 297, 298, 305), each built on fresh s206. For each node, take the build whose node differs from s206; fail if two builds change the same node.
const fs=require('fs');const B=JSON.parse(fs.readFileSync('w293/fresh_s206.json','utf8'));const base=B.nodes||B.data.nodes;
const src={a306:'a306/target.json',a293:'a293/target.json',a297:'a297/target.json',a298:'a298/target.json',a305:'a305/target.json'};
const by=n=>Object.fromEntries((n.nodes||n.data.nodes).map(x=>[x.name,x]));const B0=by(B);const changed={};
for(const [k,f] of Object.entries(src)){const T=by(JSON.parse(fs.readFileSync(f,'utf8')));for(const nm in T){if(!B0[nm]){console.log('NEW NODE',k,nm);continue;}if(JSON.stringify(T[nm].parameters)!==JSON.stringify(B0[nm].parameters))(changed[nm]=changed[nm]||[]).push([k,T[nm]]);}for(const nm in B0)if(!T[nm])console.log('MISSING',k,nm);}
const out=JSON.parse(JSON.stringify(B));const ON=out.nodes||out.data.nodes;let bad=0;
for(const nm in changed){const L=changed[nm];if(L.length>1){console.log('CONFLICT',nm,L.map(x=>x[0]));bad++;continue;}const i=ON.findIndex(x=>x.name===nm);ON[i]=L[0][1];
 const a=JSON.stringify(B0[nm].parameters).length,b=JSON.stringify(L[0][1].parameters).length;console.log(L[0][0].padEnd(5),nm.padEnd(30),(B0[nm].parameters.jsCode||'').length,'->',(L[0][1].parameters.jsCode||'').length);}
fs.writeFileSync('merge/target_all.json',JSON.stringify(out));console.log('nodes changed',Object.keys(changed).length,'conflicts',bad);
