// pkgRQI (W1; run 35379, W3 w3/grade_35379.md "F1 follow-up", second seat W1): the K-W REASSERTED test (kwRe, library line 1201)
// let the quote run to the first closing quote, and needed that quote not to be followed by a letter. A quote holding quoted words
// ("So the seed of David is "made" of a woman, as Matthew 1:16 "of whom" traces.") ends at the first inner quote, which is followed
// by a letter, so a faithful REASSERTED answer failed (sol, DEFENDER CR3 LINK 5 #10).
// Change: the quote body may hold inner quotes; it runs (shortest first) to a closing quote that is not followed by a letter, on the
// same line, with at least six characters. Prompt 0. Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(z=>z.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
const i=Lb.findIndex(l=>l.includes('const kwRe='));if(i!==1201)throw new Error('kwRe at '+i);
const old="[\"\\u201c'\\u2018][^\"\\u201d]{6,}[\"\\u201d'\\u2019](?![A-Za-z])/i.test(t);";
const neu="[\"\\u201c'\\u2018](?:[^\"\\u201d]{6,}|[^\\n]{6,}?)[\"\\u201d'\\u2019](?![A-Za-z])/i.test(t); /* pkgRQI: or, on one line, the quote may hold quoted words up to a closing quote not followed by a letter */";
if(Lb[i].split(old).length!==2)throw new Error('anchor');Lb[i]=Lb[i].replace(old,()=>neu);
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
