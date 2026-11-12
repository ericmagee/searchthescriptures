const fs=require('fs');const w=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s158.json'));
const T=w.nodes.find(x=>x.name=="Shared Library").parameters.jsCode;
const M=JSON.parse(T.slice(T.lastIndexOf("\n/*MAP*/")+8,T.lastIndexOf("\n/*END*/")));const Lb=JSON.parse(T.slice(T.indexOf("\n/*LIB*/")+8,T.lastIndexOf("\n/*MAP*/")));
const src=n=>M[n]?M[n].p.map(e=>typeof e==="number"?Lb[e]:typeof e[0]==="string"?e[0]:Lb.slice(e[0],e[1]+1).join("\n")).join("\n"):null;
fs.mkdirSync('src',{recursive:true});
const code={};for(const n of w.nodes){const c=src(n.name)||n.parameters.jsCode||JSON.stringify(n.parameters);code[n.name]=c;fs.writeFileSync('src/'+n.name.replace(/[^\w]+/g,'_')+'.js',c);}
// graph downstream of Cure Check
const C=w.connections,out={};for(const [s,o] of Object.entries(C))for(const arr of (o.main||[]))for(const t of (arr||[]))(out[s]=out[s]||[]).push(t.node);
const seen=new Set(),q=['Cure Check'];while(q.length){const x=q.shift();for(const y of out[x]||[])if(!seen.has(y)){seen.add(y);q.push(y);}}
fs.writeFileSync('code.json',JSON.stringify(code));
// main path from Regrade After Quotes? to Cure Check
console.log('direct after Cure Check:',out['Cure Check']);
const pats=[/\$\('Cure Check'\)/,/\$\('Extract Independent Verdict'\)/,/independent_verdict/,/\$\('Extract Diagnostic'\)/,/verdict_tag/,/sj_|SJ\b/];
const rows=[];for(const n of Object.keys(code)){const c=code[n];const h=pats.map(p=>p.test(c)?1:0);if(h.some(Boolean))rows.push([n,seen.has(n)?'down':'other',h.join('')]);}
console.log('node | downstream of Cure Check | refs [$CureCheck,$ExtractIV,independent_verdict,$ExtractDiag,verdict_tag,SJ]');rows.forEach(r=>console.log(r.join(' | ')));
