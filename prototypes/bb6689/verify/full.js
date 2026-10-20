const fs=require('fs');const src=fs.readFileSync('sweep.js','utf8');
eval(src.split('if(process.argv[3]')[0]);
let same=0,diff=0,err=0;
for(const r of runs)for(const n of NODES){const a=out(code[n+'old'],r),b=out(code[n+'new'],r);
 if(a.startsWith('ERR')||b.startsWith('ERR')){err++;console.log('ERR',r.tok,n,a.slice(0,100),b.slice(0,100));continue;}
 if(a===b){same++;continue;}diff++;
 const A=a.split('\\n'),B=b.split('\\n');const sa=new Set(A),sb=new Set(B);
 for(const l of A)if(!sb.has(l))console.log('-',r.tok,n,l.slice(0,230));
 for(const l of B)if(!sa.has(l))console.log('+',r.tok,n,l.slice(0,230));}
console.log('pairs same',same,'differ',diff,'err',err);
