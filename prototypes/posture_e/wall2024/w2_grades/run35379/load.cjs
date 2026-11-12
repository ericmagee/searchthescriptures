const fs=require('fs');
const w=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s149.json','utf8'));
const libJs=w.nodes.find(n=>n.name=='Shared Library').parameters.jsCode;
function src(name){const stub=w.nodes.find(n=>n.name==name).parameters.jsCode;let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');if(i<0)return null;return new Function('$',stub.slice(0,i)+'\nreturn __S;')(n=>({params:{jsCode:libJs}}));}
module.exports={w,src};
