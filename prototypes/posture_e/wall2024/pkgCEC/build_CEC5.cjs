// pkgCEC rev 5 (W1; W3 Wall 3772 note): the four code nodes are wrapped so a throw never stops the debate; carries rev 4's log values.
//   node pkgCEC/build_CEC5.cjs [fetchback]   -> pkgCEC/parent_CEC5.json (live + the four code nodes from cec_nodes.cjs)
const fs=require('fs');const N=require('./cec_nodes.cjs');const FB=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s87.json';
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const before=new Map(d.nodes.map(n=>[n.name,JSON.stringify(n)]));
for(const [n,k] of [['Close Enforcer Build','BUILD'],['Close Enforcer Record','RECORD'],['Judge Contradiction Build','JC_BUILD'],['Judge Contradiction Record','JC_RECORD']]){const x=d.nodes.filter(z=>z.name===n);if(x.length!==1)die(n+': '+x.length+' nodes');
 const c=x[0].parameters.jsCode;const raw=N.RAW[k];
 if(!(c===raw||c===N[k]||/^\/\/ pkgCEC/.test(c)))die(n+': live code is not pkgCEC code');x[0].parameters.jsCode=N[k];}
const ch=d.nodes.filter(n=>before.get(n.name)!==JSON.stringify(n)).map(n=>n.name);
fs.writeFileSync(__dirname+'/parent_CEC5.json',JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));
console.log('parent_CEC5.json from '+FB.split('/').pop()+': '+d.nodes.length+' nodes; changed: '+ch.join(', '));
