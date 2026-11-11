// pkgNBR (W1): flag pattern allows one level of inner brackets ("LINK 5 [premise 5] #8"), in Format Markdown and Build Save Body.
// Usage: node build.cjs <parent in> <out>. Works on s132 + pkgRVF or on s132 alone.
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);
const OLD='/\\[(?:EXTRACTOR|AUDIT) v\\d+[^\\]\\n]*REVIEW THIS ROW[^\\]\\n]*\\]/g';
const NEW='/\\[(?:EXTRACTOR|AUDIT) v\\d+(?:[^\\]\\[\\n]|\\[[^\\]\\[\\n]*\\])*REVIEW THIS ROW(?:[^\\]\\[\\n]|\\[[^\\]\\[\\n]*\\])*\\]/g';
for(const nm of ['Format Markdown','Build Save Body']){const N=W.nodes.find(n=>n.name===nm);const c=N.parameters.jsCode;
 if(c.split(OLD).length!==2)throw new Error(nm+': pattern count '+(c.split(OLD).length-1));N.parameters.jsCode=c.replace(OLD,()=>NEW);}
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
