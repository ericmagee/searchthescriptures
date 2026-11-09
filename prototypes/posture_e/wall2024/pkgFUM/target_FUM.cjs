// pkgFUM write target: fetchback_live_s75 + pkgLIB_FUM stubs (E4 nodes from pkgLIB_FUM/e4_rebase) + the 18 FUM nodes and their wiring (plan_FUM.json).
// Run from wall2024/: node pkgFUM/target_FUM.cjs <out.json>. Prints every jsCode hash change and checks the wiring.
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const plan=JSON.parse(fs.readFileSync('pkgFUM/plan_FUM.json','utf8'));const W=JSON.parse(fs.readFileSync(plan.fetchback,'utf8'));if(W.versionId!==plan.fetchback_version)throw new Error('fetchback version');
const L='pkgLIB_FUM/';const E4=['Alternate Build','Early Alternate Build'];const rows=[];
for(const n of W.nodes){const f=n.name.replace(/ /g,'_')+'.js';const p=E4.includes(n.name)?L+'e4_rebase/'+f:L+'patched/'+f;if(!fs.existsSync(p))continue;const s=fs.readFileSync(p,'utf8');
 const b=h(n.parameters.jsCode);n.parameters.jsCode=s;rows.push(n.name+' '+b+' -> '+h(s));}
for(const a of plan.nodes_added){if(W.nodes.some(n=>n.name===a.name))throw new Error('exists '+a.name);W.nodes.push(JSON.parse(JSON.stringify(a)));}
for(const [k,v] of Object.entries(plan.connections))W.connections[k]=v;
const names=new Set(W.nodes.map(n=>n.name));for(const [k,v] of Object.entries(W.connections)){if(!names.has(k))throw new Error('dangling source '+k);for(const o of v.main||[])for(const x of o||[])if(!names.has(x.node))throw new Error('dangling '+k+' -> '+x.node);}
fs.writeFileSync(process.argv[2],JSON.stringify({nodes:W.nodes,connections:W.connections},null,1));
rows.forEach(r=>console.log(r));console.log('nodes',W.nodes.length,'added',plan.nodes_added.length,'changed code',rows.filter(r=>{const m=r.match(/ (\w{12}) -> (\w{12})$/);return m[1]!==m[2];}).length);
