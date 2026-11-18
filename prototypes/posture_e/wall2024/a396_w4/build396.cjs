// ASK 396 build: one header line in Format Markdown (inline node). Usage: node a396/build396.cjs IN OUT
const fs=require('fs');const acorn=require('../tools/node_modules/acorn');const cr=require('crypto');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const n=d.nodes.find(n=>n.name==='Format Markdown');let s=n.parameters.jsCode;
const A="t += '## Result\\n\\n| | |\\n|---|---|\\n';";const c=s.split(A).length-1;if(c!==1)throw new Error('anchor found '+c);
const H=fs.readFileSync(__dirname+'/hdr396.js','utf8');s=s.replace(A,()=>H+A);
acorn.parse('(async()=>{\n'+s+'\n})',{ecmaVersion:'latest',allowReturnOutsideFunction:true});
n.parameters.jsCode=s;fs.writeFileSync(OUT,JSON.stringify(d));
console.log('Format Markdown',c,'anchor; length',s.length,'; node sha',cr.createHash('sha256').update(s).digest('hex').slice(0,12));
