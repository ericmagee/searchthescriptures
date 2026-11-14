// ASK 295 pkgBNS, both steps: (1) the K-UNX-A and E-ASM CORRECTED COUNT cures (LIB 1225, 1220) return UNCURED when E-ASSUME found the premise's fact BOTH NOT STATED, so cureSet writes no corrected count; (2) sbApply2024 (LIB 1448) refuses a change that sets a defender collision on that link to STANDS. Stacks on ASK 294 (a294/target.json).
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base rebuild length differs for '+k);if(T.includes('pkgBNS'))throw new Error('already');
const out=[];const ed=(i,A,B,cnt)=>{const l=LIB[i];const k=l.split(A).length-1;if(k!==cnt)throw new Error('anchor at '+i+' found '+k);LIB[i]=l.split(A).join(B);out.push('LIB '+i+' '+l.length+'->'+LIB[i].length);};
const BN=(cs,lab)=>"{const __bn=(()=>{try{const a=$('Assume Check Record');if(!a||!a.isExecuted)return null;return (((a.first().json||{}).acx||{}).facts||[]).find(f=>f&&f.both_not_stated&&f.side===x.side&&+f.n===+x.premise)||null;}catch(e){return null;}})();if(__bn&&"+cs+".length&&"+cs+".every(c=>c.n<(x.conc||0)))return res('UNCURED','TRIAL rule ("+lab+"): E-ASSUME found the fact \"'+String(__bn.fact).slice(0,160)+'\" BOTH NOT STATED for '+x.side+' premise '+x.premise+'; a CORRECTED COUNT cannot take the premise out of the count while no quoted verse states that fact (pkgBNS, ASK 295)',"+cs+".map(c=>c.line));} ";
const A25="const cs=o.count.filter(c=>c.side===x.side);if(cs.length&&cs.every(c=>c.n<(x.conc||0)))return res('CURED','TRIAL rule (K-UNX-A): CORRECTED COUNT ";
ed(1225,A25,A25.replace("if(cs.length&&cs.every",BN('cs','K-UNX-A')+"if(cs.length&&cs.every"),1);
const A20="if(x.asm){const cs0=o.count.filter(c=>c.side===x.side);if(cs0.length&&cs0.every";
ed(1220,A20,A20.replace("if(cs0.length&&cs0.every",BN('cs0','E-ASM')+"if(cs0.length&&cs0.every"),1);
const B=fs.readFileSync(__dirname+'/bns.js','utf8').replace(/\n/g,'').trimEnd();if(!LIB[1530].includes('function fbdRefuse2024'))throw new Error('1530 needs pkgFBD');LIB[1530]+=B;out.push('LIB 1530 +'+B.length);
ed(1448,"/* pkgFBD, ASK 296 */","/* pkgFBD, ASK 296 */{const __bs=typeof bnsRefuse2024==='function'?bnsRefuse2024(to):null;if(__bs){items.push({sid:x.sid,kind:'NOT APPLIED',why:__bs,to,lines:[o],bns:true});continue;}} /* pkgBNS, ASK 295 */",1);
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;fs.writeFileSync(fout,JSON.stringify(W));
console.log(out.join('\n'));console.log('Shared Library',T.length,'->',T1.length,'users',users.length,users.join(', '));
