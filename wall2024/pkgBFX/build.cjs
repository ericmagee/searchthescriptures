// pkgBFX (ASK 265 + the K-UNX-A exit; team thread Wall 6210, W1 6211 C and 6217, W2 6213 B3): the pkgBCL borrowed-footing count ("footing borrowed from contested Link(s)") is not a missing-layer or ASSUMES charge (DG-61), so (1) unxaCheck, the K-UNX-A gate path, does not fire on a premise whose count carries it, and (2) rctCheck, the pkgRCT recount guard, accepts it as the reason. Shared Library only: the unxaCheck head (LIB 452 and 3465) and rctCheck (LIB 1390). MAP n of each user recomputed, header sha recomputed. usage: node build.cjs <live s195 json> <target json>
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
if(!T.includes('// library sha 7582587ef17b5a26,'))throw new Error('not the s195 library');
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('live rebuild length differs for '+k);
const BFX="/footing\\s+borrowed\\s+from\\s+contested\\s+Links?\\b/i";
const A1="if(all.some(z=>UNXA_HARD.test(unxaHead(z.seg))))return null;";
const B1=A1+"if(all.some(z=>"+BFX+".test(z.seg)))return null; /* pkgBFX: a borrowed-footing count is not an ASSUMES charge */";
const A2="const txt=unxSegs(String(to)).filter(s=>s.ns.includes(j)).map(s=>s.seg).concat([String(x&&x.why||'')]);";
const B2=A2+"if(txt.some(t=>"+BFX+".test(t)))continue; /* pkgBFX: the borrowed-footing count names its own ground */";
const out=[];
for(const [i,A,B] of [[452,A1,B1],[3465,A1,B1],[1390,A2,B2]]){const l=LIB[i];if(l.split(A).length!==2)throw new Error('anchor at '+i);LIB[i]=l.replace(A,()=>B);out.push('LIB '+i+' '+l.length+'->'+LIB[i].length);}
if(LIB.join('\n').split(A1).length!==3)throw new Error('unxaCheck head count');
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k+' '+n0+'->'+n1);}}
const LJ=JSON.stringify(LIB);
const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;
fs.writeFileSync(fout,JSON.stringify(raw));
console.log('edits: '+out.join('; '));console.log('users ('+users.length+'): '+users.join('; '));
console.log('jsCode',T.length,'->',T1.length,'| lib sha',sha(JSON.stringify(JSON.parse(T.slice(iL+8,iM)))),'->',sha(LJ));
