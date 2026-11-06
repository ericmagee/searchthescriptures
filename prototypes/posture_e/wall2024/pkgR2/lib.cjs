// load the K-RUL library of a node file: function declarations hoist; the node's main code is stopped at its first $() call
const fs=require('fs');
module.exports=function(path){const s=fs.readFileSync(path,'utf8');let X=null;
 const hoist=s.split('\n').filter(l=>/^const (__KRUL_HEADS|KRUL_BAD|KRUL_\w+|PRS_CTX)\b/.test(l));const body=s.split('\n').filter(l=>!/^const (__KRUL_HEADS|KRUL_BAD|KRUL_\w+|PRS_CTX)\b/.test(l)).join('\n');
 const src=hoist.join('\n')+'\nX.f=()=>({krulLines2024,ciRounds,drvPromptText,krulAcc,krulCards,krulMatch,krulCheckCard,krulText,krulQs:typeof krulQs!=="undefined"?krulQs:null,krulCure:typeof krulCure!=="undefined"?krulCure:null});\n'+body;
 const STOP=new Error('STOP');const $=()=>{throw STOP;};const $input={all:()=>{throw STOP;},first:()=>{throw STOP;}};
 try{new Function('X','$','$input',src)(X={},$,$input);}catch(e){if(e!==STOP)throw e;}
 return X.f();};
