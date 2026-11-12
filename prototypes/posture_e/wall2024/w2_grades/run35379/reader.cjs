const {src}=require('./load.cjs');
let s=src('Panel Cure Check');
const at=s.indexOf('function cureOwn(');
s=s.slice(0,at)+'globalThis.__CL=cureLines;globalThis.__UW=cureUnwrap;globalThis.__RLx=__RL;\n'+s.slice(at);
const AF=Object.getPrototypeOf(async function(){}).constructor;
const mk=()=>({all:()=>[],first:()=>({json:{}}),item:{json:{}}});
const p=new AF('$','$input','$json','$node','$execution','$env','$items',s);
module.exports=p(()=>mk(),mk(),{},{},{id:'x'},{},()=>[]).catch(e=>'ERR '+e.message).then(r=>({r,CL:globalThis.__CL,UW:globalThis.__UW,RL:globalThis.__RLx}));
