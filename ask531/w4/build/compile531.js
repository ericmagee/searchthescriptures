// ASK 531 (W4): rebuild every library node's source from the MAP, check its length and compile it; compile Assume Check Record.
const fs=require('fs');
for(const f of process.argv.slice(2)){const d=JSON.parse(fs.readFileSync(f,'utf8'));const t=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const L=JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/'))),M=JSON.parse(t.slice(t.lastIndexOf('\n/*MAP*/')+8,t.lastIndexOf('\n/*END*/')));
 let bad=0,n=0;for(const k in M){const S=M[k].p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');n++;
  if(S.length!==M[k].n){bad++;console.log('LEN',k);}try{new Function('$','$input','return (async()=>{\n'+S+'\n})();');}catch(e){bad++;console.log('COMPILE',k,e.message);}}
 for(const nd of d.nodes)if(/Assume Check Record/.test(nd.name)&&nd.parameters.jsCode){try{new Function('$','$input','return (async()=>{\n'+nd.parameters.jsCode+'\n})();');}catch(e){bad++;console.log('COMPILE node',nd.name,e.message);}}
 console.log(f.split('/').pop(),'MAP entries',n,'problems',bad);}
