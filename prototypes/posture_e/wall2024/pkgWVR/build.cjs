// pkgWVR: usage node build.cjs <base.json> <out.json>
const fs=require('fs'),crypto=require('crypto');const [,,base,out]=process.argv;const w=JSON.parse(fs.readFileSync(base));
const n=w.nodes.find(x=>x.name==='Close Enforcer Build');let c=n.parameters.jsCode;const c0=c;
function rep(a,b){if(c.split(a).length!==2)throw 'anchor: '+a.slice(0,60);c=c.replace(a,()=>b);}
const fn=fs.readFileSync(__dirname+'/wvr_fn.js','utf8').trim();
rep("const S=$('Init Seats').first().json;",fn+"\nconst S=$('Init Seats').first().json;");
rep("cands.push(...cecDeny(F,links,cands)); /* pkgCNP */","cands.push(...cecDeny(F,links,cands)); /* pkgCNP */cands.push(...cecWvr(F,cands)); /* pkgWVR */");
n.parameters.jsCode=c;fs.writeFileSync(out,JSON.stringify(w));
console.log('code delta',c.length-c0.length,'sha',crypto.createHash('sha256').update(fs.readFileSync(out)).digest('hex').slice(0,16));
