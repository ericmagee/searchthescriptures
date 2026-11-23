const fs=require('fs');const out=JSON.parse(fs.readFileSync('keys.json'));
const sig=new Map();
for(const o of out){if(o.save<500)continue;const s=o.nodes.slice().sort().join(';');if(!sig.has(s))sig.set(s,{nodes:o.nodes.slice().sort(),keys:[],save:0,tot:0});const g=sig.get(s);g.keys.push(o.k.slice(0,28)+'('+o.vers+'v)');g.save+=o.save;g.tot+=o.tot}
const gs=[...sig.values()].sort((a,b)=>b.save-a.save);
for(const g of gs.slice(0,30)){console.log('\nSAVE',g.save,'TOT',g.tot,'NODES',g.nodes.length,':',g.nodes.map(x=>x.replace(/^E:/,'')).join(', ').slice(0,400));console.log('  KEYS',g.keys.join(' ').slice(0,500))}
