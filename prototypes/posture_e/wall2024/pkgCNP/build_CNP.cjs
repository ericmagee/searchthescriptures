// pkgCNP (W2, 2026-11-12): code-found closing pairs for a close that DENIES any narrowing ("I narrow nothing and concede nothing")
// after an earlier LINK n: NARROWED TO / CONCEDED / WITHDRAWN / DROPPED line. Run 35379: the defender's [CR4] said "I narrow nothing
// and concede nothing." after [CR3] "LINK 5: NARROWED TO: ..."; no candidate was named and the close enforcer never tested it.
// Builds on live s151. Changes only the Close Enforcer Build node (own code, not the Shared Library).
const fs=require('fs');const crypto=require('crypto');
const SRC='/mnt/project-files/wall2024/fetchback_live_s151.json',OUT='/mnt/project-files/wall2024/parent_s151_CNP.json';
const X=JSON.parse(fs.readFileSync(SRC,'utf8'));const node=X.nodes.find(n=>n.name==='Close Enforcer Build');const c=node.parameters.jsCode;
const FN=fs.readFileSync(__dirname+'/cnp_fn.js','utf8').trim();
const A="\nconst S=$('Init Seats').first().json;",B="cands.push(...cecReclaim(F,links,cands));";
if(c.split(A).length!==2||c.split(B).length!==2)throw new Error('anchors not unique in Close Enforcer Build');
const n=c.replace(A,()=>'\n'+FN+A).replace(B,()=>B+'cands.push(...cecDeny(F,links,cands)); /* pkgCNP */');
node.parameters.jsCode=n;fs.writeFileSync(OUT,JSON.stringify(X));
console.log('Close Enforcer Build jsCode',c.length,'->',n.length,'(+'+(n.length-c.length)+')');
console.log('out sha256',crypto.createHash('sha256').update(fs.readFileSync(OUT)).digest('hex').slice(0,16));
