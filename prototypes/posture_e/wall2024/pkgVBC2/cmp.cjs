const fs=require('fs'),zlib=require('zlib');
const ld=p=>{const c=JSON.parse(fs.readFileSync(p,'utf8')).nodes.find(n=>n.name==='Panel Build').parameters.jsCode;const a=c.indexOf('function preCheckSide'),b=c.indexOf('function preCheckBlock');return new Function(c.slice(a,b)+'\nreturn preCheckSide;')();};
const F=[ld(process.argv[2]),ld(process.argv[3]),ld(process.argv[4])];
const R=JSON.parse(fs.readFileSync(__dirname+'/../a287/runs.json','utf8'));let rows=Object.values(R).map(x=>x.r).concat(JSON.parse(zlib.gunzipSync(fs.readFileSync(__dirname+'/../a293/data/rounds8.json.gz'))));
const seen=new Set();const L=[[],[],[]];
for(const r of rows){if(seen.has(r.id))continue;seen.add(r.id);F.forEach((f,i)=>{const A=f(r.engine_r3,[r.engine_r1,r.engine_r2],'DEFENDER LIST [CR3]'),B=f(r.engine_r2,[r.claude_r1,r.claude_r2],'CHALLENGER LIST [DR2]');A.concat(B).forEach(l=>L[i].push([String(r.id).slice(0,8),l]));});}
const nv=l=>/no verbatim quote found/.test(l),ca=l=>/the charge adds/.test(l);
console.log('counts nv',L.map(x=>x.filter(y=>nv(y[1])).length),'charge adds',L.map(x=>x.filter(y=>ca(y[1])).length));
let lost=0,diff12=0;for(let k=0;k<L[0].length;k++){const [b,r1,r2]=[L[0][k][1],L[1][k][1],L[2][k][1]];
 if(!nv(r1)&&nv(r2)){lost++;console.log('\nLOST',L[0][k][0],'\n rev1:',r1.slice(0,300),'\n rev2:',r2.slice(0,300));}
 if(r2!==b&&!(nv(b)&&!nv(r2)))console.log('\nCHANGED-OTHER',L[0][k][0],'\n base:',b.slice(0,300),'\n rev2:',r2.slice(0,300));}
console.log('lost',lost);
