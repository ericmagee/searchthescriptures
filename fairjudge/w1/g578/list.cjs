const fs=require('fs');const C=JSON.parse(fs.readFileSync(process.argv[2]));const K="$('Shared Library').params.jsCode";
for(const n of C.nodes){const s=n.parameters.jsCode||'';const k=s.split(K).length-1;if(k)console.log(k,n.name);}
const sl=C.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const i=sl.indexOf(K);if(i>=0)console.log('Shared Library itself contains it at',i, sl.slice(i-120,i+40).replace(/\s+/g,' '));
