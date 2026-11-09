// pkgCEC rev 4 (W1; W3 Wall 3770): the two Record nodes write only values debate_enforcer_log allows.
//   node pkgCEC/build_CEC4.cjs [fetchback]   -> pkgCEC/parent_s85_CEC4.json (live s85 + the two Record nodes from cec_nodes.cjs)
const fs=require('fs');const N=require('./cec_nodes.cjs');const FB=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s85.json';
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const before=new Map(d.nodes.map(n=>[n.name,JSON.stringify(n)]));
for(const [n,k] of [['Close Enforcer Record','RECORD'],['Judge Contradiction Record','JC_RECORD']]){const x=d.nodes.filter(z=>z.name===n);if(x.length!==1)die(n+': '+x.length+' nodes');
 const c=x[0].parameters.jsCode;if(!c.includes("seat_role:'enforcer'"))die(n+': live code is not the rev 3 code');if(!N[k].includes('pkgCEC rev 4'))die(k+' has no rev 4');x[0].parameters.jsCode=N[k];}
const ch=d.nodes.filter(n=>before.get(n.name)!==JSON.stringify(n)).map(n=>n.name);if(ch.length!==2)die('changed '+ch.join(', '));
fs.writeFileSync(__dirname+'/parent_s85_CEC4.json',JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));
console.log('parent_s85_CEC4.json: '+d.nodes.length+' nodes; changed: '+ch.join(', '));
