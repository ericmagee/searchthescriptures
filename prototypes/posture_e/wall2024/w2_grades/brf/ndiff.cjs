const fs=require('fs');const A=JSON.parse(fs.readFileSync(process.argv[2])),B=JSON.parse(fs.readFileSync(process.argv[3]));
const nodes=j=>{const w=j.nodes?j:(j.data||j[0]||j);return Object.fromEntries((w.nodes||[]).map(n=>[n.name,n]));};
const a=nodes(A),b=nodes(B);const code=n=>n.parameters&&(n.parameters.jsCode||n.parameters.functionCode)||JSON.stringify(n.parameters);
console.log('nodes',Object.keys(a).length,Object.keys(b).length);let tot=0;
for(const k of new Set([...Object.keys(a),...Object.keys(b)])){if(!a[k]||!b[k]){console.log('ONLY',k,!!a[k],!!b[k]);continue;}
 const x=code(a[k]),y=code(b[k]);if(x!==y){const d=y.length-x.length;tot+=d;console.log('DIFF',k,d);}
 else if(JSON.stringify(a[k])!==JSON.stringify(b[k]))console.log('META',k);}
console.log('total',tot);console.log('conn equal',JSON.stringify((A.connections||A.data?.connections))===JSON.stringify((B.connections||B.data?.connections)));
