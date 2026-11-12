// pkgBRS (W2; Worker_A3 Wall 5200 item 3a, confirmed W2 Wall 5204 and W1 00:26 CST 2026-11-12):
// C4P.refs marks a reference "bare" (no book of its own) only when r.head&&r.pos>r.at. A sentence-initial bare reference ("1:18 places ...")
// takes its book from the scope of an earlier sentence and never meets pos>at, so it was charged as a new verse of that book (35379 D4, "1 Corinthians 1:18").
// Fix: bare:!r.book. A bare reference whose chapter:verse was named earlier goes to the named-earlier list (o.u) instead of the new-verse list.
// Every node holding the C4P copy is changed (12 nodes, one exact anchor each).
// Usage: node build_BRS.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const X='bare:r.head&&!r.book&&r.pos>r.at',Y='bare:!r.book/*pkgBRS*/';let tot=0;
for(const n of W.nodes){const c=n.parameters&&n.parameters.jsCode;if(typeof c!=='string'||!c.includes(X))continue;if(c.split(X).length!==2)throw new Error(n.name+' anchor not once');
 n.parameters.jsCode=c.replace(X,()=>Y);tot++;console.log('  ',n.name,c.length,'->',n.parameters.jsCode.length);}
if(tot!==12)throw new Error('expected 12 nodes, got '+tot);
const out=JSON.stringify(W);fs.writeFileSync(process.argv[3],out);console.log('nodes',tot,'each '+(Y.length-X.length)+' chars; total '+(tot*(Y.length-X.length))+' | written',process.argv[3],'sha256',crypto.createHash('sha256').update(out).digest('hex').slice(0,16));
