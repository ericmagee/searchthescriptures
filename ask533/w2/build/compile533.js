const fs=require('fs');for(const f of process.argv.slice(2)){const W=JSON.parse(fs.readFileSync(f,'utf8'));const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/')+8,b=T.lastIndexOf('\n/*MAP*/'),c=b+8,e=T.lastIndexOf('\n/*END*/');const L=JSON.parse(T.slice(a,b)),M=JSON.parse(T.slice(c,e));
const src=p=>p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');let ok=0,bad=[],nbad=[];
for(const k of Object.keys(M)){const s=src(M[k].p);if(s.length!==M[k].n)nbad.push(k);try{new Function('$','$input','$json','items',"return (async()=>{"+s+"\n})()");ok++;}catch(err){bad.push(k+': '+err.message);}}
let l2='';const P=W.nodes.find(n=>n.name==='L2 Count Plan');try{new Function('$','$input',"return (async()=>{"+P.parameters.jsCode+"\n})()");l2='compiles';}catch(err){l2='ERR '+err.message;}
console.log(f.split('/').pop()+': MAP entries '+Object.keys(M).length+', compile '+ok+', errors '+bad.length+(bad.length?' '+bad.join(' | '):'')+', n mismatches '+nbad.length+' | L2 Count Plan '+l2);}
