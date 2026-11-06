// loads the K-V reader functions (PW_ROUND .. kvRulingOk) from a library node file
const fs=require('fs');module.exports=f=>{const s=fs.readFileSync(f,'utf8');const a=s.indexOf('const PW_ROUND='),b=s.indexOf('\n',s.indexOf('const pwHead=',a));const c=s.indexOf('const KV_KIND='),d=s.indexOf('function drvVoid(');
 return new Function(s.slice(a,b)+'\n'+s.slice(c,d)+'\nreturn {kvCharges,kvUni,kvRulingOk,kvQuotes,kvNorm,KV_KIND};')();};
