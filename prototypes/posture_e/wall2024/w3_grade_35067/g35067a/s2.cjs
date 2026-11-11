const L=require('./lib.cjs');
for(const n of process.argv.slice(2)){const it=L.items(n);console.log('==',n,it.length);for(const x of it.slice(0,3)) console.log(JSON.stringify(L.shape(x,0,1)).slice(0,1500));}
