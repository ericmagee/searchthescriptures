const L=require('./lib.cjs');
for(const n of ['Gate Build','Gate Record','Gate Needed?']){const it=L.items(n);console.log('==',n,it.length);for(const x of it) console.log(JSON.stringify(L.shape(x,0,1)).slice(0,1200));}
const g=L.items('Gate Build')[0]; console.log(Object.keys(g));
