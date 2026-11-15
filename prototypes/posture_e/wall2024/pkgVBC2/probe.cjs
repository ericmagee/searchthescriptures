// probe: Panel Build's preCheckSide on stored debates (DEFENDER LIST [CR3] against DR1+DR2; CHALLENGER LIST [DR2] against CR1+CR2)
const fs=require('fs'),zlib=require('zlib');const c=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).nodes.find(n=>n.name==='Panel Build').parameters.jsCode;
const a=c.indexOf('function preCheckSide'),b=c.indexOf('function preCheckBlock');const f=new Function(c.slice(a,b)+'\nreturn preCheckSide;')();
const R=JSON.parse(fs.readFileSync(__dirname+'/../a287/runs.json','utf8'));let rows=Object.values(R).map(x=>x.r).concat(JSON.parse(zlib.gunzipSync(fs.readFileSync(__dirname+'/../a293/data/rounds8.json.gz'))));
const seen=new Set();let tot=0,nv=0;for(const r of rows){if(seen.has(r.id))continue;seen.add(r.id);const A=f(r.engine_r3,[r.engine_r1,r.engine_r2],'DEFENDER LIST [CR3]'),B=f(r.engine_r2,[r.claude_r1,r.claude_r2],'CHALLENGER LIST [DR2]');
 for(const l of A.concat(B)){if(/no premise list/.test(l))continue;tot++;if(/no verbatim quote found/.test(l))nv++;}if(String(r.id).startsWith('eaef1fa9'))A.forEach(l=>console.log('37113',l.slice(0,160)));}
console.log('items',tot,'no verbatim quote found',nv);
