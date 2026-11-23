// Pulls named top-level definitions out of a workflow's Shared Library, as assembled by its MAP entry, and compiles them.
// Each definition is cut from "function NAME(" or "const NAME=" to the shortest end that compiles alone.
const fs=require('fs');
module.exports=(f,names,entry='Panel Payloads')=>{const s=JSON.parse(fs.readFileSync(f,'utf8')).nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const a=s.indexOf('\n/*LIB*/')+8,b=s.lastIndexOf('\n/*MAP*/'),e=s.lastIndexOf('\n/*END*/');const L=JSON.parse(s.slice(a,b)),M=JSON.parse(s.slice(b+8,e));
 const src=M[entry].p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');
 const cut=nm=>{let i=src.indexOf('function '+nm+'(');if(i<0)i=src.indexOf('const '+nm+'=');if(i<0)throw new Error('not found '+nm);
  for(let j=i+10;j<=src.length;j++){const ch=src[j-1];if(ch!=='}'&&ch!==';')continue;try{new Function(src.slice(i,j));return src.slice(i,j);}catch(err){}}throw new Error('no end '+nm);};
 const body=names.map(cut);return {L,src,F:new Function(body.join('\n')+'\nreturn {'+names.join(',')+'};')()};};
