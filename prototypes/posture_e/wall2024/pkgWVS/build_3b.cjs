// rev 3b (heading is not a named use). node pkgWVS/build_3b.cjs <base json> <out json> [verbs]   pkgWVL rev 2 + pkgWVS rev 3 (Close Enforcer Build; with pkgCEW in the base, also its last clause in both builders)
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const n=W.nodes.find(x=>x.name==='Close Enforcer Build');const a=n.parameters.jsCode;
const b=require('../pkgWVL/edit_full.cjs')(a,process.argv[4]==='verbs');const c=require('./cew_clause.cjs')(require('./edit_rev3b.cjs')(b));n.parameters.jsCode=c;
const j=W.nodes.find(x=>x.name==='Judge Contradiction Build');const ja=j.parameters.jsCode;j.parameters.jsCode=require('./cew_clause.cjs')(ja);
fs.writeFileSync(process.argv[3],JSON.stringify(W));
console.log('Close Enforcer Build',a.length,'-> pkgWVL',b.length,'(+'+(b.length-a.length)+') -> rev 3',c.length,'(+'+(c.length-b.length)+'), total +'+(c.length-a.length)+' | Judge Contradiction Build '+(j.parameters.jsCode.length-ja.length));
