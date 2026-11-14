const fs=require('fs');
module.exports=(file,node)=>{const W=JSON.parse(fs.readFileSync(file,'utf8'));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const LIB=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),MAP=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const m=MAP[node];const s=m.p.map(e=>typeof e==='number'?LIB[e]:typeof e[0]==='string'?e[0]:LIB.slice(e[0],e[1]+1).join('\n')).join('\n');return s;};
