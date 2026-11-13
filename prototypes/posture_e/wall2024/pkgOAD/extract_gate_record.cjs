const fs=require('fs');const [,,WF,EX]=process.argv;
const w=JSON.parse(fs.readFileSync(WF));const T=w.nodes.find(x=>x.name=="Shared Library").parameters.jsCode;
const M=JSON.parse(T.slice(T.lastIndexOf("\n/*MAP*/")+8,T.lastIndexOf("\n/*END*/")));const Lb=JSON.parse(T.slice(T.indexOf("\n/*LIB*/")+8,T.lastIndexOf("\n/*MAP*/")));
const full=M['Gate Record'].p.map(e=>typeof e==="number"?Lb[e]:typeof e[0]==="string"?e[0]:Lb.slice(e[0],e[1]+1).join("\n")).join("\n");
fs.writeFileSync(__dirname+'/src/Gate_Record.js',full);
