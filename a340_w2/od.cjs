process.chdir(__dirname+'/t/a340_w4');
const fs=require('fs');process.argv[2]='../rdf/fetchback_s229_339.json';process.argv[3]='../../mine340.json';
const R=require(process.cwd()+'/t340.cjs');
const D=JSON.parse(fs.readFileSync('../a329/debates.json')).concat(JSON.parse(fs.readFileSync('../a336/r37510.json')));
const cnt={};
for(const r of D){const M=R.base(r);const a=R.ex(R.S.pre,R.mk(M))[0].json;const {out:b}=R.runPost(M);
 const ks=new Set([...Object.keys(a),...Object.keys(b)]);ks.delete('tags');ks.delete('e340');
 const d=[...ks].filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));
 if(d.length){console.log(r.run_token,d.join(','));for(const k of d){cnt[k]=(cnt[k]||0)+1;
   const A=JSON.stringify(a[k]),B=JSON.stringify(b[k]);let i=0;while(A[i]===B[i])i++;console.log('   ',k,'PRE:',A.slice(Math.max(0,i-80),i+120));console.log('   ',k,'POST:',B.slice(Math.max(0,i-80),i+120));}}}
console.log(JSON.stringify(cnt));
