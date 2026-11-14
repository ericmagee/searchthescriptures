// ASK 288 pkgORD2 (W1's fix, commit 5042e0bc): the AUDIT v53 sentence split also breaks after a closing quote or bracket.
// Build Save Body only; one anchor, which must occur exactly once. Anchor-based, so it stacks with ASK 287.
const fs=require('fs');const [,,IN,OUT]=process.argv;const W=JSON.parse(fs.readFileSync(IN,'utf8'));const N=W.nodes.find(n=>n.name==='Build Save Body');let c=N.parameters.jsCode;
const A="para.split(/(?<=[.!?])\\s+|\\n/)",B="para.split(/(?<=[.!?][\"”'’)\\]]*)\\s+|\\n/)";
const i=c.indexOf('try{const __OR=(t)=>');const j=c.indexOf('/* pkgORD, ASK 278 */',i);if(i<0||j<0)throw new Error('ORD block');
const blk=c.slice(i,j);if(blk.split(A).length!==2)throw new Error('anchor count '+(blk.split(A).length-1));
c=c.slice(0,i)+blk.replace(A,B)+c.slice(j).replace('/* pkgORD, ASK 278 */','/* pkgORD, ASK 278; split pkgORD2, ASK 288 */');
const n0=N.parameters.jsCode.length;N.parameters.jsCode=c;fs.writeFileSync(OUT,JSON.stringify(W));console.log('Build Save Body',n0,'->',c.length);
