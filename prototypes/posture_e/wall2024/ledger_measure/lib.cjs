const fs=require('fs');const s=fs.readFileSync(process.env.GR||(__dirname+'/gate_record_full.js'),'utf8');const i=s.lastIndexOf('\n',s.indexOf('const bodies=(Array.isArray(PASS.bodies)'));
const pre=s.slice(0,i);const f=new Function('$','$input','$json','$node','items',pre+'\nreturn {cureRefs,kg4Split,kg4Witnesses,cureRounds:typeof cureRounds==="function"?cureRounds:null};');
const stub=()=>({first:()=>({json:{}}),all:()=>[],item:{json:{}}});module.exports=f(stub,stub(),{},{},[]);
