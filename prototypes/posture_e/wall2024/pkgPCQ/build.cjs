// pkgPCQ (W1): the PRE-CHECK verbatim-quote finder (preCheckSide, in Panel Build and Build Independent Verdict).
// The finder cut each list item at "ASSUMES:" before it searched for quotes, so an item whose opponent quote stands after
// the ASSUMES -- ROWS GIVE part was written "no verbatim quote found" (W1 Wall 5034; W2 Wall 5039 CONFIRMED).
// Now, after the cut point, a quote introduced by "words:", "Defender:" or "Challenger:" is also searched (W2's tighter shape:
// the ROWS GIVE verse quotes are not searched). The charge words are cut as before. Usage: node build.cjs <parent> <out>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);let tot=0;
const A=String.raw`return items.map((it,k)=>{it=String(it).split(`;
const A2=String.raw`return items.map((it,k)=>{const __tq=[];{const __a=String(it).split(/PRESSED WITH\s*:/i)[0];const __i=__a.search(/\bASSUMES\s*:/i);if(__i>=0)for(const __m of __a.slice(__i).matchAll(/\b(?:words|Defender|Challenger)\s*:\s*["“]([^"”\n]{8,})["”]/gi))__tq.push(__m[1].trim());} /* pkgPCQ */it=String(it).split(`;
const Bq=String.raw`for(let i=0;i+1<pos.length;i+=2)qs.push(it.slice(pos[i]+1,pos[i+1]).trim());`;
for(const name of ['Panel Build','Build Independent Verdict']){const n=W.nodes.find(x=>x.name===name);const c=n.parameters.jsCode;
 if(c.split(A).length!==2||c.split(Bq).length!==2)throw new Error(name+': anchor not unique');
 const c2=c.replace(A,()=>A2).replace(Bq,()=>Bq+'qs.push(...__tq);');n.parameters.jsCode=c2;tot+=c2.length-c.length;console.log(name,'+'+(c2.length-c.length));}
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3],'code delta',tot);
