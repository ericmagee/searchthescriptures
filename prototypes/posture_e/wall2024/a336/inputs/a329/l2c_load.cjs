// Load the L2C object exactly as L2 Count Plan defines it (node code up to the end of the L2C IIFE).
const fs=require('fs');
module.exports=function(wfPath){const wf=JSON.parse(fs.readFileSync(wfPath));const s=wf.nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;
 const i=s.indexOf('return {tags,tagWords,check');const e=s.indexOf('})();',i)+5;const pre=s.slice(0,e);
 return new Function('$','$input',pre+'\nreturn L2C;')(()=>({isExecuted:false,all:()=>[],first:()=>({json:{}})}),{all:()=>[]});};
