// Strip for "today's 42 stubs + the Accept trio" from a live fetch-back: each node's full source (stub rebuilt from its library entry, else jsCode).
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const [fb,out]=process.argv.slice(2);const X=L(fb);
const names=[...Object.keys(X.M),'Accept Build','Accept Check','Accept Final'];fs.mkdirSync(out+'/patched',{recursive:true});
for(const n of names){const s=X.code(n);if(X.M[n]&&s.length!==X.M[n].n)throw new Error('rebuild length '+n);fs.writeFileSync(out+'/patched/'+n.replace(/ /g,'_')+'.js',s);}
console.log('strip',names.length,'files');
