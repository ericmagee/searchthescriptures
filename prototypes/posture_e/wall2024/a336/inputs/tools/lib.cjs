// helpers: assemble a library node's source; extract a declarations-only module; evaluate with a $ stub.
const fs=require('fs'),acorn=require('acorn');
function unpack(wf){const T=wf.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');return {T,hdr:T.slice(0,iL),L:JSON.parse(T.slice(iL+8,iM)),M:JSON.parse(T.slice(iM+8,iE)),tail:T.slice(iE)};}
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
function declsOnly(src){const ast=acorn.parse(src,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});const out=[];const names=[];
 for(const s of ast.body){if(s.type==='FunctionDeclaration'){out.push(src.slice(s.start,s.end));names.push(s.id.name);}
  else if(s.type==='VariableDeclaration'){let t=src.slice(s.start,s.end);t='var'+t.slice(s.kind.length);out.push('try{'+t+'}catch(__e){}');for(const d of s.declarations)if(d.id.type==='Identifier')names.push(d.id.name);}}
 return {code:out.join('\n'),names};}
function load(src,$){const {code,names}=declsOnly(src);const f=new Function('$','$input','__L',code+'\nreturn {'+names.map(n=>n+':typeof '+n+'==="undefined"?undefined:'+n).join(',')+'};');return f($,{all:()=>[],first:()=>({json:{}})},new Proxy({},{get:()=>()=>({isExecuted:false,all:()=>[],first:()=>({json:{}})})}));}
module.exports={unpack,rb,declsOnly,load};
