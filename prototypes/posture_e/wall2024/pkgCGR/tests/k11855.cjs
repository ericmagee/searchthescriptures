const fs=require('fs');const ex=f=>{const o=JSON.parse(fs.readFileSync(f,'utf8')).result;const a=o.indexOf('\n[{'),b=o.lastIndexOf('}]\n');return JSON.parse(o.slice(a+1,b+2));};
const R=JSON.parse(ex(process.argv[2])[0].rounds);const SRC=Object.values(R).filter(v=>typeof v==='string').join('\n');
const m=require('module');const src=fs.readFileSync('krep.cjs','utf8');const libsrc=src.slice(src.indexOf('const lib=f=>'),src.indexOf('const O=lib'));const lib=eval('('+libsrc.replace(/^const lib=/,'').replace(/;\s*$/,'')+')');
const O=lib('live_un.json'),N=lib('new_un.json');const q='; [DR3] LINK 5 answer to P5.1: ';
console.log('row 11855 quote: old',O.krulFound(q,SRC),'new',N.krulFound(q,SRC),'| normalized new:',JSON.stringify(N.krulNorm(q)));
