const fs=require('fs');const [a,b]=process.argv.slice(2).map(f=>JSON.parse(fs.readFileSync(f,'utf8')));
const by=w=>Object.fromEntries(w.nodes.map(n=>[n.name,n]));const A=by(a),B=by(b);const d=[];
for(const n of new Set([...Object.keys(A),...Object.keys(B)])){if(!A[n]||!B[n])d.push('missing '+n);else if(JSON.stringify(A[n].parameters)!==JSON.stringify(B[n].parameters))d.push('params '+n);}
const cs=w=>JSON.stringify(Object.keys(w.connections).sort().map(k=>[k,w.connections[k]]));
console.log(process.argv[3].split('/').pop(),'nodes',a.nodes.length,b.nodes.length,'diffs',d,'conn equal',cs(a)===cs(b));
