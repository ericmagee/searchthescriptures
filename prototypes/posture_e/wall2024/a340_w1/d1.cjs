const R=require('./t340.cjs');const fs=require('fs');const D=JSON.parse(fs.readFileSync('../a329/debates.json')).concat(JSON.parse(fs.readFileSync('../a336/r37510.json')));
const cnt={};let shown=0;
for(const r of D){const M=R.base(r);const a=R.ex(R.S.pre,R.mk(M))[0].json;const {out:b}=R.runPost(M);
 for(const k of new Set([...Object.keys(a),...Object.keys(b)])){if(k==='tags'||k==='e340')continue;if(JSON.stringify(a[k])!==JSON.stringify(b[k])){cnt[k]=(cnt[k]||0)+1;if(shown<3){shown++;const x=JSON.stringify(a[k]),y=JSON.stringify(b[k]);let i=0;while(x[i]===y[i])i++;console.log(r.run_token,k,'\n PRE ',x.slice(Math.max(0,i-150),i+200),'\n POST',y.slice(Math.max(0,i-150),i+200));}}}}
console.log(cnt);
