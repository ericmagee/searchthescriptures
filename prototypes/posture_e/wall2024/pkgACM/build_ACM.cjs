// pkgACM (W2): Anticheat Record reads an answer line that ends with a period after its last quote mark. Code only; one node.
// Usage (from wall2024/): node pkgACM/build_ACM.cjs <fetch-back> <out write file>
const fs=require('fs');const [,,FB,OUT]=process.argv;const d=JSON.parse(fs.readFileSync(FB,'utf8'));let w=d.data||d;w=w.workflow||w;
const n=w.nodes.find(x=>x.name==='Anticheat Record');let c=n.parameters.jsCode;const c0=c;
const A=String.raw`(?:--\s*EARLIER:\s*["“](.*)["”])?\s*$/);`,B=String.raw`(?:--\s*EARLIER:\s*["“](.*)["”])?\.?\s*$/);`;
if(c.split(A).length!==2)throw new Error('anchor not found once');c=c.replace(A,()=>B);new Function('$','$input','return (async()=>{\n'+c+'\n})();');
n.parameters.jsCode=c;fs.writeFileSync(OUT,JSON.stringify(d));console.log('Anticheat Record',c0.length,'->',c.length,'(+'+(c.length-c0.length)+')');
