// Load L2C exactly as Citation Scan defines it, with the REFP it reads (defined after L2C in that node).
const fs=require('fs');
module.exports=function(wfPath){const wf=JSON.parse(fs.readFileSync(wfPath));const s=wf.nodes.find(n=>n.name==='Citation Scan').parameters.jsCode;
 const r=s.indexOf('const REFP=');const e=s.indexOf('})();',s.indexOf('return {parse,keys',r))+5;
 return new Function('$','$input',s.slice(0,e)+'\nreturn L2C;')(()=>({isExecuted:false,all:()=>[],first:()=>({json:{}})}),{all:()=>[]});};
