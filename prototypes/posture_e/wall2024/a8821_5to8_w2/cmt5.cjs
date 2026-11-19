const acorn=require(process.argv[2]);const fs=require('fs');
for(const f of process.argv.slice(3)){const w=JSON.parse(fs.readFileSync(f,'utf8'));const wf=w.workflow||w.data||w;const nodes=wf.nodes||(wf.workflow&&wf.workflow.nodes);
let code=0,withC=0,tot=0,perr=0,list=[];
for(const n of nodes){const p=n.parameters||{};const src=p.jsCode||p.functionCode;if(typeof src!=='string')continue;code++;let c=[];
try{acorn.parse(src,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true,onComment:c});}catch(e){perr++;list.push(n.name+' PARSE '+e.message);continue}
if(c.length){withC++;tot+=c.length;list.push(n.name+': '+c.length+' e.g. '+JSON.stringify(c[0].value.slice(0,60)))}}
console.log(f.split('/').pop(),'nodes',nodes.length,'code nodes',code,'with comments',withC,'comments',tot,'parse errors',perr);list.slice(0,10).forEach(x=>console.log('  '+x));}
