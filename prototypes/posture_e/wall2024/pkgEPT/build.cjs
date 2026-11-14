// pkgEPT (ASK 257): restore pre-pkgEPS sending. Shared Library LIB line "const EPS_STATUS='LIVE';" -> 'TRIAL'. A held E-PREM COUNTED push is
// then sent and the hold only records "(TRIAL pkgEPS: would not be sent: ...)". MAP n of each user is recomputed (+1 each), header sha
// recomputed. Nothing else changes. usage: node build.cjs <live s190 json> <target json>
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow '+W.id);
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');if(iL<0||iM<iL||iE<iM)throw new Error('not stub form 3');
const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('live rebuild length differs for '+k);
const A="const EPS_STATUS='LIVE';",B="const EPS_STATUS='TRIAL';";
const hit=LIB.map((l,i)=>[i,l]).filter(([i,l])=>l.includes(A));if(hit.length!==1||hit[0][1].split(A).length!==2)throw new Error('anchor');
const i0=hit[0][0],before=LIB[i0];LIB[i0]=before.replace(A,B);
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k+' '+n0+'->'+n1);}}
const LJ=JSON.stringify(LIB);
const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;
const s=JSON.stringify(raw);fs.writeFileSync(fout,s);
console.log('LIB line',i0,JSON.stringify(before),'->',JSON.stringify(LIB[i0]),'('+(LIB[i0].length-before.length)+')');
console.log('nodes whose rebuilt length changed ('+users.length+'): '+users.join('; '));
console.log('Shared Library jsCode',T.length,'->',T1.length,'('+(T1.length-T.length)+') | library sha',(T.match(/library sha (\w+)/)||[])[1],'->',sha(LJ),'| jsCode sha',sha(T),'->',sha(T1));
console.log('target sha256',sha(s));
