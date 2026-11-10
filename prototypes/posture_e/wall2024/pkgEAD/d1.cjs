const fs=require('fs');const H=require('./harness_clone.cjs');
(async()=>{const run=process.argv[2];const a=await H.run(fs.readFileSync('pkgLIB/strip_S112L/patched/Send_Back_Build.js','utf8'),run,'Judge Enforcer Record');const b=await H.run(fs.readFileSync('pkgLIB/strip_EAD_on_S112L/patched/Send_Back_Build.js','utf8'),run,'Judge Enforcer Record');
const A=JSON.stringify(a.map(x=>x.json)),B=JSON.stringify(b.map(x=>x.json));console.log(A===B?'BYTE EQUAL':'DIFF');let i=0;while(i<A.length&&A[i]===B[i])i++;console.log(A.slice(i-200,i+200));console.log('---');console.log(B.slice(i-200,i+200));})();
