const fs=require('fs');
module.exports=async function(file){const w=JSON.parse(fs.readFileSync(file,'utf8'));const libJs=w.nodes.find(n=>n.name=='Shared Library').parameters.jsCode;
 const stub=w.nodes.find(n=>n.name=='Panel Cure Check').parameters.jsCode;let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');
 let s=new Function('$',stub.slice(0,i)+'\nreturn __S;')(n=>({params:{jsCode:libJs}}));const at=s.indexOf('function cureOwn(');
 s=s.slice(0,at)+'globalThis.__CL=cureLines;\n'+s.slice(at);const AF=Object.getPrototypeOf(async function(){}).constructor;
 const mk=()=>({all:()=>[],first:()=>({json:{}}),item:{json:{}}});await new AF('$','$input','$json','$node','$execution','$env','$items',s)(()=>mk(),mk(),{},{},{id:'x'},{},()=>[]).catch(()=>0);
 const CL=globalThis.__CL;delete globalThis.__CL;return CL;};
