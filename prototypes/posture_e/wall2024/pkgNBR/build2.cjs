// pkgNBR rev 2 (W1): flag pattern = NBR pattern (one level of inner brackets) OR the old pattern, one alternation, NBR first.
// The old branch keeps every flag live code catches (W2 Wall 4857: a quotation cut off after an open "[" with no "]").
// Usage: node build2.cjs <parent in> <out>. Built on live s133.
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);
const OLDP='\\[(?:EXTRACTOR|AUDIT) v\\d+[^\\]\\n]*REVIEW THIS ROW[^\\]\\n]*\\]';
const NEWP='\\[(?:EXTRACTOR|AUDIT) v\\d+(?:[^\\]\\[\\n]|\\[[^\\]\\[\\n]*\\])*REVIEW THIS ROW(?:[^\\]\\[\\n]|\\[[^\\]\\[\\n]*\\])*\\]';
const OLD='/'+OLDP+'/g',NEW='/'+NEWP+'|'+OLDP+'/g';
for(const nm of ['Format Markdown','Build Save Body']){const N=W.nodes.find(n=>n.name===nm);const c=N.parameters.jsCode;
 if(c.split(OLD).length!==2)throw new Error(nm+': pattern count '+(c.split(OLD).length-1));N.parameters.jsCode=c.replace(OLD,()=>NEW);}
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
