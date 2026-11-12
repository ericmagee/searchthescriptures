const fs=require('fs');
module.exports=f=>{const w=JSON.parse(fs.readFileSync(f));const nodes=w.nodes||w.activeVersion?.nodes||w.data?.nodes;const L=nodes.find(n=>n.name==='Shared Library');const c=L.parameters.jsCode;
const a=c.indexOf('\n/*LIB*/'),b=c.indexOf('\n/*MAP*/'),e=c.indexOf('\n/*END*/');return {w,nodes,Lb:JSON.parse(c.slice(a+8,b)),M:JSON.parse(c.slice(b+8,e)),c};};
