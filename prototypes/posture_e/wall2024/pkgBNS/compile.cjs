// compiles every MAP user node's rebuilt code (async wrapper, as n8n runs it) and checks MAP n
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const AF=Object.getPrototypeOf(async function(){}).constructor;let ok=0,bad=[];for(const k in M){const s=M[k].p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(s.length!==M[k].n)bad.push(k+' n');try{new AF('$','$input',s);ok++;}catch(e){bad.push(k+': '+e.message);}}
console.log('nodes compiled',ok,'of',Object.keys(M).length,bad.length?'BAD '+bad.join('; '):'');
