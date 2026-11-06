// load named functions of a node file (as pkgR2/lib.cjs, with a names list): the node's main code stops at its first $() call
const fs=require('fs');
module.exports=function(path,names){const s=fs.readFileSync(path,'utf8');let X=null;
 const H=/^const (__KRUL_HEADS|KRUL_BAD|KRUL_\w+|PRS_CTX|PW_ORD|kvNorm)\b/;
 const hoist=s.split('\n').filter(l=>H.test(l));const body=s.split('\n').filter(l=>!H.test(l)).join('\n');
 const src=hoist.join('\n')+'\nX.f=()=>({'+names.map(n=>n+':typeof '+n+'!=="undefined"?'+n+':null').join(',')+'});\n'+body;
 const STOP=new Error('STOP');const $=()=>{throw STOP;};const $input={all:()=>{throw STOP;},first:()=>{throw STOP;}};
 try{new Function('X','$','$input',src)(X={},$,$input);}catch(e){if(e!==STOP)throw e;}
 return X.f();};
