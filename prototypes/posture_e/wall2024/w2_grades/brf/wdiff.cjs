const fs=require('fs');const A=JSON.parse(fs.readFileSync(process.argv[2])),B=JSON.parse(fs.readFileSync(process.argv[3]));
const nodes=j=>Object.fromEntries(j.nodes.map(n=>[n.name,n.parameters.jsCode||'']));const a=nodes(A),b=nodes(B);const seen=new Set();
for(const k in a){if(a[k]===b[k])continue;let i=0;while(a[k][i]===b[k][i])i++;let j=0;while(a[k][a[k].length-1-j]===b[k][b[k].length-1-j])j++;
 const o=a[k].slice(i-300,a[k].length-j+150),n=b[k].slice(i-300,b[k].length-j+150);const key=o+'|'+n;if(seen.has(key)){console.log(k,'same edit');continue;}seen.add(key);console.log('==',k,'\nOLD:',o,'\nNEW:',n);}
