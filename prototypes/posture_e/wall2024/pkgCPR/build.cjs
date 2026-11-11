// pkgCPR (W1): the close prompt states the contradiction rule to both debaters (operator 12:35 CST 11-11, on W3's recommendation of 12:33 CST).
// Two fixed sentences, the same for both sides, added to the close-round instruction of D4 Build (defender) and C4 Build (challenger).
// Text true to the operator's contradiction rule ("you can't withdraw after you made the contradiction ... you chain is broken by default")
// and to the ruling of ASK 20 (a part left out of a narrowed restatement counts as dropped). Usage: node build.cjs <parent> <out>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);
const ADD=' Narrowing or conceding carries no conduct penalty: it is weighed on the merits, and a part left out of a narrowed restatement counts as dropped. A close sentence that denies what your earlier rounds granted, or restores a link or a part you narrowed, conceded or dropped, contradicts your own record: your chain is broken by default, the system sends no request to correct it, and a later withdrawal does not undo it.';
const ED=[['D4 Build','narrow it (NARROWED TO: <the limb you keep>, with its footing) or concede it (CONCEDED); do not add links or re-seat the chain.'],
          ['C4 Build','do not renumber (the system flags a close round that does); this round answers nothing new.']];
for(const [n,anchor] of ED){const N=W.nodes.find(x=>x.name===n);let c=N.parameters.jsCode;if(c.split(anchor).length!==2)throw new Error('anchor not unique in '+n);
 if(c.includes('carries no conduct penalty'))throw new Error('already present in '+n);c=c.replace(anchor,()=>anchor+ADD);N.parameters.jsCode=c;}
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3],'| added per node',ADD.length);
