const fs=require('fs');const T=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).nodes.find(n=>n.name==='Shared Library').parameters.jsCode.split('\n');const LIB=JSON.parse(T[5].slice(7)),MAP=JSON.parse(T[6].slice(7));
const rb=m=>m.p.map(e=>typeof e==='number'?LIB[e]:typeof e[0]==='string'?e[0]:LIB.slice(e[0],e[1]+1).join('\n')).join('\n');
// probe: put a throw-probe right before "function sbApply2024", wrap whole stub in a function where $/$input are Proxies, run; probe reports typeof
const mkP=()=>{const h={get:(t,k)=>k===Symbol.toPrimitive?()=>'':k==='isExecuted'?true:k==='all'?()=>[]:k==='first'?()=>P:k==='json'?P:k==='length'?0:P,apply:()=>P};const P=new Proxy(function(){},h);return P;};
for(const u of Object.keys(MAP)){const s=rb(MAP[u]);if(!s.includes('function sbApply2024'))continue;
 const i=s.indexOf('function sbApply2024');const src=s.slice(0,i)+"__probe(typeof fbdRefuse2024, typeof d38Refuse2024);"+s.slice(i);
 let res='not reached';try{new Function('$','$input','__probe',src)(mkP(),mkP(),(a,b)=>{res='fbd '+a+', d38 '+b;throw {probe:1};});}catch(e){if(!e||!e.probe)res+=' (threw '+String(e&&e.message).slice(0,60)+')';}
 // also depth heuristic: is sbApply2024 inside a nested function? count "function"/"=>" not reliable; report probe
 console.log(u.padEnd(24),res);}
