// Alternates fill a conflict-emptied panel seat (operator 14:56 and 14:57 CST 11-17). Base: live s256 fetchback.
const fs=require('fs');
const W=JSON.parse(fs.readFileSync(process.argv[2]));
const n=W.nodes.find(x=>x.name==='Init Seats');
const O=".concat(pfree0.filter(s=>__ALT.indexOf(s)<0).length>=3?pfree0.filter(s=>__ALT.indexOf(s)>=0):[]); /* pkgALT: the alternates (operator's order) never fill the panel, as haiku before */";
const N=".concat(pfree0.filter(s=>__ALT.indexOf(s)>=0)); /* operator 14:56 and 14:57 CST 11-17 (\"the system is suppose to handle the conflict if interest\"; \"maybe we should switch it back\"): an alternate, in the operator's order, fills a panel seat that a debater's family empties; replaces the pkgALT no-fill rule (11-10) and haiku \"Alternate only\" (11-09) */";
const c=n.parameters.jsCode;const k=c.split(O).length-1;if(k!==1)throw new Error('anchor count '+k);
n.parameters.jsCode=c.replace(O,()=>N);
fs.writeFileSync(process.argv[3],JSON.stringify(W));
console.log('ok', c.length, n.parameters.jsCode.length);
