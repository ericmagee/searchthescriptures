// ASK 290 (W2 6411, W1 6413): LIB 858 (0-based; "LIB 859" 1-based) cureRounds also cuts at '\n\n[COUNT LIST NOTE', as LIB 1891 does since s199.
// Shared Library only; MAP n raised for the users of the line. Anchor-based, so it stacks with ASK 289.
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=raw;if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base rebuild length differs for '+k);
if(!LIB[858].startsWith(' const out={};at.forEach((x,i)=>{'))throw new Error('858 not cureRounds');
const A="if(c>=0&&c<end)end=c;",B=A+"const c9=t.indexOf('\\n\\n[COUNT LIST NOTE',x.e);if(c9>=0&&c9<end)end=c9; /* pkgACT ASK 290 */";
if(LIB[858].split(A).length!==2)throw new Error('anchor');const n0=LIB[858].length;LIB[858]=LIB[858].replace(A,()=>B);
const users=[];for(const k in MAP){const a=MAP[k].n,b=rb(LIB,MAP[k]).length;if(a!==b){MAP[k].n=b;users.push(k+' +'+(b-a));}}
const LJ=JSON.stringify(LIB);const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;fs.writeFileSync(fout,JSON.stringify(raw));
console.log('LIB 858',n0,'->',LIB[858].length);console.log('Shared Library',T.length,'->',T1.length,'sha',sha(LJ));console.log('users',users.length,users.join(', '));
