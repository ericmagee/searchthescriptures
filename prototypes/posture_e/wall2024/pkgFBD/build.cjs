// ASK 296 pkgFBD: sbApply2024 (LIB 1448) refuses (NOT APPLIED) a change that sets MEETS or STANDS on DG-8 FORBIDDEN content. fbdHit2024/fbdRefuse2024 are appended to LIB 1530 (end of d38Refuse2024), same node set as 1448.
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base rebuild length differs for '+k);
const has=(m,i)=>m.p.some(e=>typeof e==='number'?e===i:(typeof e[0]!=='string'&&e[0]<=i&&i<=e[1]));
for(const k in MAP)if(has(MAP[k],1448)!==has(MAP[k],1530))throw new Error('node set differs '+k);
if(!LIB[1530].endsWith("}catch(e){return null;}}")||!LIB[1528].startsWith('function d38Refuse2024'))throw new Error('1530 anchor');
const out=[];const ed=(i,A,B,cnt)=>{const l=LIB[i];const k=l.split(A).length-1;if(k!==cnt)throw new Error('anchor at '+i+' found '+k);LIB[i]=l.split(A).join(B);out.push('LIB '+i+' '+l.length+'->'+LIB[i].length);};
const F=fs.readFileSync(__dirname+'/fbd.js','utf8').replace(/\n/g,'').trimEnd();if(T.includes('fbdHit2024'))throw new Error('already');
LIB[1530]+=F;out.push('LIB 1530 +'+F.length);
ed(1448,"{const __d38=","{const __fb=typeof fbdRefuse2024==='function'?fbdRefuse2024(to):null;if(__fb){items.push({sid:x.sid,kind:'NOT APPLIED',why:__fb,to,lines:[o],fbd:true});continue;}} /* pkgFBD, ASK 296 */{const __d38=",1);
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;fs.writeFileSync(fout,JSON.stringify(W));
console.log(out.join('\n'));console.log('Shared Library',T.length,'->',T1.length,'users',users.length,users.join(', '));
