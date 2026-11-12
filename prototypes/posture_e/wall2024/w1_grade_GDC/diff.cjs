const ld=require('./lib.cjs');const A=ld(process.argv[2]),B=ld(process.argv[3]);
console.log('lines',A.Lb.length,B.Lb.length);
for(let i=0;i<Math.max(A.Lb.length,B.Lb.length);i++) if(A.Lb[i]!==B.Lb[i]) {console.log('DIFF line',i,(A.Lb[i]||'').length,(B.Lb[i]||'').length);console.log('OLD:',A.Lb[i]);console.log('NEW:',B.Lb[i]);}
for(const k in B.M) if(JSON.stringify(A.M[k])!==JSON.stringify(B.M[k])) console.log('MAP',k,A.M[k]&&A.M[k].n,B.M[k].n);
