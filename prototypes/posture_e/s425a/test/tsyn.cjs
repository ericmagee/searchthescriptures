// usage: node tsyn.cjs <block.js> <exec.json> [node name]
const fs=require('fs');const [,,bf,ef,nn]=process.argv;
const blk=fs.readFileSync(bf,'utf8');const e=JSON.parse(fs.readFileSync(ef,'utf8'));
const rd=e.data.resultData.runData;const d=rd[nn||'Build Save Body'][0].data.main[0][0].json;
const FF=[];let S={};try{S=rd['Init Seats'][0].data.main[0][0].json;}catch(x){}
const C4P={ofD:()=>[],ofC:()=>[]};
const f=new Function('d','FF','S','C4P','$',blk+'\nreturn FF;');
let out;try{out=f(d,FF,S,C4P,()=>({first:()=>({json:{}}),all:()=>[]}));}catch(x){console.log('ERR',x.message);process.exit(1);}
out.filter(x=>/SYNTHESIS CHECK/.test(x)).forEach(x=>console.log(x.slice(0,600)));
console.log('TOTAL',out.filter(x=>/SYNTHESIS CHECK/.test(x)).length);
