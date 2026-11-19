const fs=require('fs'),acorn=require('acorn');
const [lf,tf]=process.argv.slice(2);
const L=JSON.parse(fs.readFileSync(lf)),T=JSON.parse(fs.readFileSync(tf));
const tn=Object.fromEntries(T.nodes.map(n=>[n.name,n]));
const ast=s=>JSON.stringify(acorn.parse('(async function(){\n'+s+'\n})',{ecmaVersion:'latest'}),(k,v)=>(k==='start'||k==='end'||k==='loc'||k==='range')?undefined:v);
let n=0,bad=[];
for(const a of L.nodes){const b=tn[a.name];const ca=a.parameters.jsCode,cb=b&&b.parameters.jsCode;if(!ca||ca===cb)continue;n++;if(ast(ca)!==ast(cb))bad.push(a.name);}
console.log(n,'ast-equal fails',bad.length,bad.slice(0,5));
