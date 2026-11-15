// ASK 313 pkgBKC on the s208 fetchback: kunxLines (LIB 461-471) raises no K-UNX ASSUMES item when bkcKeep2024 says the BNS fact matches the judge's ASSUMES clause.
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));const N=W.nodes;
const Ls=N.filter(n=>n.name==='Shared Library');const T=Ls[0].parameters.jsCode;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base '+k);
if(T.includes('pkgBKC'))throw new Error('already');const has=(m,i)=>m.p.some(e=>typeof e==='number'?e===i:(typeof e[0]!=='string'&&e[0]<=i&&i<=e[1]));
for(const k in MAP)if(has(MAP[k],466)!==has(MAP[k],461))throw new Error('node set '+k);
if(!LIB[461].startsWith('function kunxLines('))throw new Error('461');
const O="const ua=bk?unxaCheck(all,bk,lbFoot(bk,true),PR.filter(p=>p.n===j),text,rk):null;";if(LIB[466].split(O).length!==2)throw new Error('anchor');
LIB[466]=LIB[466].replace(O,()=>"const ua=bkcKeep2024(side,j,all,bk?unxaCheck(all,bk,lbFoot(bk,true),PR.filter(p=>p.n===j),text,rk):null); /* pkgBKC */");
LIB[461]=fs.readFileSync(__dirname+'/bkc.js','utf8').replace(/\n/g,'').trim()+' '+LIB[461];
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;fs.writeFileSync(fout,JSON.stringify(W));
console.log('Shared Library',T.length,'->',T1.length,crypto.createHash('sha256').update(T1).digest('hex').slice(0,12),'users',users.length,users.join(', '));console.log('target',sha(fs.readFileSync(fout)));
