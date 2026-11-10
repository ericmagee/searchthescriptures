// pkgRLF rev 2 (W2): Close Enforcer Record also reads a bare round number ("[3]", "3") as the line's own side's round N. Code only.
// Usage (from wall2024/): node pkgRLF/rev2/build_RLF2.cjs <fetchback (live s108)> <out write file>
const fs=require('fs');const [,,FB,OUT]=process.argv;const d=JSON.parse(fs.readFileSync(FB,'utf8'));let w=d.data||d;w=w.workflow||w;
const n=w.nodes.find(x=>x.name==='Close Enforcer Record');let c=n.parameters.jsCode;const c0=c;
const rep=(a,b)=>{if(c.split(a).length!==2)throw new Error('anchor not found once: '+a.slice(0,80));c=c.replace(a,()=>b);};
rep(String.raw`EARLIER\s*\[?\s*([CD]R\s?\d|ROUND\s*\d)\s*\]?`,String.raw`EARLIER\s*\[?\s*([CD]R\s?\d|ROUND\s*\d|\d)\s*\]?`);
rep(String.raw`CLOSING\s*\[?\s*([CD]R\s?\d|ROUND\s*\d)\s*\]?`,String.raw`CLOSING\s*\[?\s*([CD]R\s?\d|ROUND\s*\d|\d)\s*\]?`);
rep(String.raw`return s.startsWith('ROUND')?P+s.slice(5):s;}; /* pkgRLF: "round N" is`,String.raw`return /^\d$/.test(s=s.replace(/^ROUND/,''))?P+s:s;}; /* pkgRLF: "round N" or "N" is`);
n.parameters.jsCode=c;fs.writeFileSync(OUT,JSON.stringify(d));
console.log('Close Enforcer Record',c0.length,'->',c.length,'(+'+(c.length-c0.length)+')');
