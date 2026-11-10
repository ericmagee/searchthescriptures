// W2: library functions (netLines, netKeeps, ks2Lines, drvCheck) from a workflow file, via the rebuilt Gate Record source cut before its node body.
const fs=require('fs');
module.exports=function(wf){let d=JSON.parse(fs.readFileSync(wf,'utf8'));d=d.data||d;d=d.workflow||d;const by={};d.nodes.forEach(n=>by[n.name]=n);const c=by['Shared Library'].parameters.jsCode;let s=by['Gate Record'].parameters.jsCode;let i=s.indexOf('\nreturn await new Function(');if(i<0)i=s.indexOf('\nconst __e4h');s=new Function('$',s.slice(0,i)+'\nreturn __S;')(()=>({params:{jsCode:c}}));if(process.env.KC_FROM)s=s.split(process.env.KC_FROM).join(process.env.KC_TO);const cut=s.indexOf("const PASS=$('Send Back Record')");if(cut<0)throw new Error('cut');
 const $=()=>({isExecuted:false,first:()=>{throw new Error('x')},all:()=>{throw new Error('x')}});
 return new Function('$','$input','$json','$execution',s.slice(0,cut)+'\n;return {cureLines,__RL};')($,{all:()=>[],first:()=>({json:{}})},{},{id:'x'});};
