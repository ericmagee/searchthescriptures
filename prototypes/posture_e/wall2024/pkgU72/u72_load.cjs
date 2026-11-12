const fs=require('fs');
module.exports=f=>{const w=JSON.parse(fs.readFileSync(f,'utf8'));const W=w.nodes?w:(w.data||w.workflow||w);const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const Lb=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const src=M['Gate Record'].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
const i=src.indexOf('function kunxLines(');return {src,i};};
