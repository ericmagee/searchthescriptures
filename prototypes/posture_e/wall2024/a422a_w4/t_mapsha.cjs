// ASK 422(a) rev 3: map_sha from the plain-JS sha.js equals node crypto over the same definition, on each workflow file given as FILE:side.
const cr=require('crypto'),fs=require('fs'),path=require('path');const T=require(path.join(__dirname,'../tools/lib.cjs'));
const F=new Function(fs.readFileSync(path.join(__dirname,'sha.js'),'utf8')+';return {__MAPSHA422};')();let bad=0;
for(const a of process.argv.slice(2)){const [f,side]=a.split(':');let w=JSON.parse(fs.readFileSync(f));w=w.data||w;const c=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const M=T.unpack(w).M;let k=Object.keys(M);if(side==='engine')k=k.filter(x=>x!=='REFP');
 const x=F.__MAPSHA422(c,side),y=cr.createHash('sha256').update(JSON.stringify(k.sort().map(z=>[z,M[z]]))).digest('hex').slice(0,16);if(x!==y)bad++;console.log(path.basename(f),side,'plain-JS',x,'node crypto',y,x===y?'EQUAL':'DIFFER');}
console.log('differ',bad);process.exit(bad?1:0);
