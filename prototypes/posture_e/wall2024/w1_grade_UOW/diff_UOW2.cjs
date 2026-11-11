const fs=require('fs');const W='/mnt/project-files/wall2024/';
const par=JSON.parse(fs.readFileSync(W+'parent_s140_UOW2.json','utf8'));const ex=JSON.parse(fs.readFileSync(W+'ex35173_full.json','utf8'));
const nB=par.nodes, nA=ex.workflowData.nodes;
const key=n=>JSON.stringify([n.parameters.jsCode,n.parameters.jsonBody,n.parameters.url]);
const mA=new Map(nA.map(n=>[n.name,key(n)]));console.log('code/body/url differ:',nB.filter(n=>mA.get(n.name)!==key(n)).map(n=>n.name),nA.length,nB.length);
const deep=o=>Array.isArray(o)?o.map(deep):(o&&typeof o==='object')?Object.fromEntries(Object.keys(o).sort().map(k=>[k,deep(o[k])])):o;
console.log('connections equal',JSON.stringify(deep(ex.workflowData.connections))===JSON.stringify(deep(par.connections)));
const A=nA.find(n=>n.name==='Shared Library').parameters.jsCode,B=nB.find(n=>n.name==='Shared Library').parameters.jsCode;
let i=0;while(A[i]===B[i])i++;let a=A.length-1,b=B.length-1;while(A[a]===B[b]){a--;b--;}console.log('delta',B.length-A.length,'live:',A.slice(i,a+1),'cand:',B.slice(i,b+1));
