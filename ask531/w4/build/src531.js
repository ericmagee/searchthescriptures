// print a Library node's rebuilt source (W4 helper). Usage: node src531.js <target.json> <node name>
const fs=require('fs');const d=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const t=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const L=JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/'))),M=JSON.parse(t.slice(t.lastIndexOf('\n/*MAP*/')+8,t.lastIndexOf('\n/*END*/')));
const k=process.argv[3];const S=M[k].p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');process.stdout.write(S);
