// node pkgWVS/build.cjs <base json> <out json> [verbs]   pkgWVL rev 2 + pkgWVS on Close Enforcer Build (ASK 140-2, ASK 144-2)
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const n=W.nodes.find(x=>x.name==='Close Enforcer Build');const a=n.parameters.jsCode;
const b=require('../pkgWVL/edit_full.cjs')(a,process.argv[4]==='verbs');const c=require('./edit.cjs')(b);n.parameters.jsCode=c;fs.writeFileSync(process.argv[3],JSON.stringify(W));
console.log('Close Enforcer Build',a.length,'-> pkgWVL',b.length,'(+'+(b.length-a.length)+') -> +pkgWVS',c.length,'(+'+(c.length-b.length)+'), total +'+(c.length-a.length));
