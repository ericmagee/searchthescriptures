// ASK 293 pkgCQL: Close Enforcer Build gets a fourth candidate maker, cecQph (cql.js): a round 2/3 line that stops resting on a quoted phrase, paired with a closing sentence that rests on the same phrase.
const fs=require('fs');const [,,IN,OUT]=process.argv;const W=JSON.parse(fs.readFileSync(IN,'utf8'));const N=W.nodes.find(n=>n.name==='Close Enforcer Build');let c=N.parameters.jsCode;const n0=c.length;
const Q=fs.readFileSync(__dirname+'/cql.js','utf8').trim();if(c.includes('pkgCQL'))throw new Error('already');
const A="\nconst S=$('Init Seats').first().json;",B="cands.push(...cecWvr(F,cands)); /* pkgWVR */";
if(c.split(A).length!==2||c.split(B).length!==2)throw new Error('anchors');
c=c.replace(A,()=>'\n'+Q+A).replace(B,()=>B+'cands.push(...cecQph(F,links,cands)); /* pkgCQL, ASK 293 */');
N.parameters.jsCode=c;fs.writeFileSync(OUT,JSON.stringify(W));console.log('Close Enforcer Build',n0,'->',c.length);
