// does the 394 change on base B2 equal the 394 change on base B1? (line-level library diff + stub source diff)
const fs=require('fs');const T=require('../tools/lib.cjs');
const ld=f=>{let d=JSON.parse(fs.readFileSync(f));if(d.data&&d.data.nodes)d=d.data;return d;};
const [b1,t1,b2,t2]=process.argv.slice(2).map(ld);
const ldiff=(a,b)=>{const A=T.unpack(a).L,B=T.unpack(b).L;const o=[];for(let i=0;i<Math.max(A.length,B.length);i++)if(A[i]!==B[i])o.push(i+'|'+A[i]+'|'+B[i]);return o;};
const ndiff=(a,b)=>{const m=new Map(a.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const o=[];for(const n of b.nodes)if(m.get(n.name)!==JSON.stringify(n.parameters))o.push(n.name);return o.sort();};
const d1=ldiff(b1,t1),d2=ldiff(b2,t2);console.log('lib lines changed',d1.length,d2.length,'equal',JSON.stringify(d1)===JSON.stringify(d2));
const n1=ndiff(b1,t1),n2=ndiff(b2,t2);console.log('nodes changed',n1.length,n2.length,'equal',JSON.stringify(n1)===JSON.stringify(n2));
