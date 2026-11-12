// node build.cjs <live json> <out json> [verbs]   pkgWVL full (ASK 140-2) on Close Enforcer Build
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const n=W.nodes.find(x=>x.name==='Close Enforcer Build');const a=n.parameters.jsCode;
n.parameters.jsCode=require('./edit_full.cjs')(a,process.argv[4]==='verbs');fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('Close Enforcer Build code',a.length,'->',n.parameters.jsCode.length,'+'+(n.parameters.jsCode.length-a.length));
