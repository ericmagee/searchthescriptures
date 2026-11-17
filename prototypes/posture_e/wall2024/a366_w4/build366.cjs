// ASK 366 ("quoted above", W1 7722, W2 7724 conditions 2a to 2d, W1 7726; coordinator ASK 366): LAY module rev 2.6 -> rev 2.7 in the twelve round-B Build and Extract nodes, byte-equal.
// Usage: node build366.cjs <base.json = live s251 fetch> <out.json>
const fs=require('fs');const w=JSON.parse(fs.readFileSync(process.argv[2]));
const OLD=fs.readFileSync(__dirname+'/../a364/lay_module_r26.js','utf8').trim(),NEW=fs.readFileSync(__dirname+'/../a364/lay_module.js','utf8').trim();
const W=w.nodes?w:(w.data||w.workflow);let c=0;const names=[];
for(const n of W.nodes){const j=n.parameters&&n.parameters.jsCode;if(!j||!j.includes(OLD))continue;const k=j.split(OLD).length-1;if(k!==1)throw new Error(n.name+' count '+k);n.parameters.jsCode=j.replace(OLD,()=>NEW);c++;names.push(n.name);}
if(c!==12)throw new Error('expected 12 nodes, got '+c);
fs.writeFileSync(process.argv[3],JSON.stringify(w));console.log('patched',c,names.join(', '));
