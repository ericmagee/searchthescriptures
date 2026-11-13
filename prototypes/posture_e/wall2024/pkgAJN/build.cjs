// pkgAJN build. node build.cjs <parent workflow json> <out json>
// Changes ONLY the Shared Library node: two joins in module ABS (E-ANS answer + judge reason) from ' ' to ' || ',
// then recomputes the MAP length (n) of every node whose rebuilt source changes. Refuses unless each edit matches exactly once.
const fs=require('fs');const crypto=require('crypto');const {parseLib,src}=require('./rebuild.cjs');
const [,,IN,OUT]=process.argv;const W=JSON.parse(fs.readFileSync(IN,'utf8'));const nodes=W.nodes||W.workflow.nodes;
const lib=nodes.find(n=>n.name==='Shared Library');const code=lib.parameters.jsCode;
const head=code.slice(0,code.indexOf('\n/*LIB*/')+8),mid='\n/*MAP*/',tail=code.slice(code.lastIndexOf('\n/*END*/'));
const {L,M}=parseLib(code);
const EDITS=[
 ["return m?(m[1]+' '+(m[3]||'')):L;","return m?(m[1]+' || '+(m[3]||'')):L;"],
 ["(to.match(AQ)?(to.match(AQ)[1]+' '+(to.match(AQ)[3]||'')):to)","(to.match(AQ)?(to.match(AQ)[1]+' || '+(to.match(AQ)[3]||'')):to)"]];
const L2=L.slice();
for(const [a,b] of EDITS){const hits=[];L2.forEach((x,i)=>{let k=-1,c=0;while((k=x.indexOf(a,k+1))>=0)c++;if(c)hits.push([i,c]);});
 if(hits.length!==1||hits[0][1]!==1)throw new Error('edit must match exactly once: '+a+' -> '+JSON.stringify(hits));L2[hits[0][0]]=L2[hits[0][0]].replace(a,b);console.log('edited LIB line',hits[0][0]);}
const M2={};let changed=[];for(const n of Object.keys(M)){const before=src(L,M,n),after=src(L2,M,n);if(before.length!==M[n].n)throw new Error('parent map length mismatch '+n);M2[n]={...M[n],n:after.length};if(after!==before)changed.push(n+' '+M[n].n+' -> '+after.length);}
const code2=head+JSON.stringify(L2)+mid+JSON.stringify(M2)+tail;
for(const n of Object.keys(M2))if(src(L2,M2,n).length!==M2[n].n)throw new Error('rebuilt length mismatch '+n);
lib.parameters.jsCode=code2;fs.writeFileSync(OUT,JSON.stringify(W));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
console.log('nodes whose rebuilt source changes:',changed.length);changed.forEach(c=>console.log('  '+c));
console.log('Shared Library jsCode',code.length,'->',code2.length,'('+(code2.length-code.length>=0?'+':'')+(code2.length-code.length)+')');
console.log('parent sha',sha(fs.readFileSync(IN,'utf8')),'out sha',sha(fs.readFileSync(OUT,'utf8')));
