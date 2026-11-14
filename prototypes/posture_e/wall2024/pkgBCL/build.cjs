// pkgBCL rev 4 (count form names [L4] so K-UNX does not fire, W2 6165). rev 3 (rev 1 + the NARROWED clause; W3 6159 item 4.1, 6161). pkgBCL (Eric 13:34Z "develop solution", run 36916): E-PREM footing borrowed from the same side's contested links. Shared Library only; one sentence appended to LIB line "RULE E-PREM, THE COUNTED KIND (pkgEPS)" (no line added). MAP n of each user recomputed, header sha recomputed. usage: node build.cjs <live s192 json> <target json>
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
if(!T.includes('// library sha a76e74e44586d784,'))throw new Error('not the s192 library');
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('live rebuild length differs for '+k);
const A="write (UNEXHIBITED: <the verse> unanswered, ruling 372) (pkgP72).\\n'";
const ADD=" FOOTING BORROWED FROM CONTESTED LINKS (pkgBCL). A shown chain is footing only through its rows and what the other side has granted. When a step of premise N\\'s [L4] takes as given the conclusion of the same side\\'s own other links (it names them, as \"(Links 1 to 3)\"), and the other side has not granted that conclusion, that step is the disputed point itself and is not footing for premise N: your RIGHT is COUNTED; write (UNEXHIBITED: [L4] footing borrowed from contested Links <n>), quoting the step. This holds for a NARROWED premise too: narrowing the link does not make a borrowed step footing. This is not a missing-row charge (DG-61): it applies only to a step that rests on the side\\'s own contested links. When that conclusion is granted, or the [L4] reaches premise N from its rows without the borrowed step, your RIGHT is SPARED.";
const hit=LIB.map((l,i)=>[i,l]).filter(([i,l])=>l.includes(A));if(hit.length!==1||hit[0][1].split(A).length!==2)throw new Error('anchor x'+hit.length);
const i=hit[0][0],b0=LIB[i];LIB[i]=b0.replace(A,()=>A.slice(0,-3)+ADD+"\\n'");
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k+' '+n0+'->'+n1);}}
const LJ=JSON.stringify(LIB);
const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;
fs.writeFileSync(fout,JSON.stringify(raw));
console.log('edit: LIB '+i+' '+b0.length+'->'+LIB[i].length+' (+'+(LIB[i].length-b0.length)+')');
console.log('users ('+users.length+'): '+users.join('; '));
console.log('jsCode',T.length,'->',T1.length,'| lib sha',sha(JSON.stringify(JSON.parse(T.slice(iL+8,iM)))),'->',sha(LJ),'| jsCode sha',sha(T),'->',sha(T1));
