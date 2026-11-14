// pkgPSN (ASK 263; W1 6181, team thread 6189): psGrades, after its first strip, also strips each enclosing parenthesis that holds no grade word (a group that holds one keeps its words), to a fixed point, so the engine's own recount prefix "(RETRACTED D6 vs C6 (...); ...)" no longer leaks its numbers into the grades. Shared Library only: the first strip in each of the two psGrades definitions (LIB index 1377 and 2645). MAP n of each user recomputed, header sha recomputed. usage: node build.cjs <live s194 json> <target json>
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
if(!T.includes('// library sha 149c230b4910052d,'))throw new Error('not the s193/s194 library');
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('live rebuild length differs for '+k);
const A=" t=t.replace(/\\([^()]*\\)/g,' ')";
const B=" t=t.replace(/\\([^()]*\\)/g,' ');for(let __q;(__q=t.replace(/\\([^()]*\\)/g,x=>/\\b(?:VOID|UNEXHIBITED|CONCEDED|counted|spared|SUPPORTED|NARROWED|STANDS)\\b/i.test(x)?x.replace(/[()]/g,' '):' '))!==t;)t=__q;t=t";
const out=[];
for(const i of [1377,2645]){const l=LIB[i];if(!l.startsWith(A)||l.split(A).length!==2)throw new Error('anchor at '+i);if(!LIB[i-1].includes('function psGrades('))throw new Error('not psGrades at '+i);LIB[i]=B+l.slice(A.length);out.push('LIB '+i+' '+l.length+'->'+LIB[i].length);}
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k+' '+n0+'->'+n1);}}
const LJ=JSON.stringify(LIB);
const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;
fs.writeFileSync(fout,JSON.stringify(raw));
console.log('edits: '+out.join('; '));console.log('users ('+users.length+'): '+users.join('; '));
console.log('jsCode',T.length,'->',T1.length,'| lib sha',sha(JSON.stringify(JSON.parse(T.slice(iL+8,iM)))),'->',sha(LJ));
