// Loads REFP and SHEET from a Build node (the code before its main body).
const fs=require('fs');const D=__dirname+'/../';
module.exports=(v,node)=>{const s=fs.readFileSync(D+v+'/'+(node||'D2 Build')+'.js','utf8');const i=s.indexOf('const TOK=');return new Function(s.slice(0,i)+';return {REFP,SHEET};')();};
