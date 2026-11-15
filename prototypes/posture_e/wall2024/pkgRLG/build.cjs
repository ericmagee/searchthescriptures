// ASK 305 pkgRLG: the challenger's round-2 prompt (C2 Build, PRESS FORM) names which round label is whose. Measured cause (W4, ASK 298): 641 of 900 PROVEN IN marks in DR2 name the wrong round, mostly [CR1] for the challenger's own round 1.
const fs=require('fs');const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const N=W.nodes.find(n=>n.name==='C2 Build');let c=N.parameters.jsCode;const n0=c.length;if(c.includes('pkgRLG'))throw new Error('already');
const A="and leaving it unanswered costs the other side nothing.\";";if(c.split(A).length!==2)throw new Error('anchor');
c=c.replace(A,()=>"and leaving it unanswered costs the other side nothing. ROUND LABELS: [CR1], [CR2], [CR3] and [CR4] are the defender's rounds 1 to 4; [DR1], [DR2], [DR3] and [DR4] are the challenger's rounds 1 to 4. You are the challenger: your own round 1 is [DR1], and this round is [DR2].\"; /* pkgRLG, ASK 305 */");
N.parameters.jsCode=c;fs.writeFileSync(fout,JSON.stringify(W));console.log('C2 Build',n0,'->',c.length);
