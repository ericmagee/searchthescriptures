const fs=require('fs');const C=JSON.parse(fs.readFileSync(process.argv[2]));const B=JSON.parse(fs.readFileSync(process.argv[3]));
const K="$('Shared Library').params.jsCode";const f=W=>W.nodes.filter(n=>(n.parameters.jsCode||'').includes(K)).map(n=>n.name);
const a=f(C),b=f(B);console.log('stack-579 child readers:',a.length,'live child readers:',b.length,'new:',a.filter(x=>!b.includes(x)));
for(const nm of a.filter(x=>!b.includes(x))){const s=C.nodes.find(x=>x.name===nm).parameters.jsCode;const i=s.indexOf(K);console.log(nm,'::',s.slice(Math.max(0,i-300),i+40).replace(/\s+/g,' '));}
