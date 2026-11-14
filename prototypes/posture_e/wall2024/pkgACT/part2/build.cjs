// pkgACT part 2 (ASK 274) on live s199 (pkgACT part 1) (team list Wall 6283; coordinator ASK numbers 13:13 CST 11-14).
// 273: LIB 1891 round parser also cuts "\n\n[COUNT LIST NOTE" (ASK 269 note stays out of enforcer round text).
// 275: LIB 3159 E-SYN side = the side word nearest before the give-ground word ("listed the defender's grants" is the defender's); a possessive side word ("the challenger's links") counts only when the give-ground word follows it directly.
// 276: the close-round fresh() check (10 nodes, one identical line) does not count Isaiah 28:10 / 28:13 in a sentence with no MEANS and no [L1]-[L4] tag (method citation, DG-61; W3 6279).
// usage: node build.cjs <base json (pkgNRW rev 3 target or s198 readback)> <target json>
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
if(!T.includes('// library sha d537e25d805e1cf6,'))throw new Error('not the s199 library');
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base rebuild length differs for '+k);
const out=[];const ed=(i,A,B,cnt)=>{const l=LIB[i];const k=l.split(A).length-1;if(k!==cnt)throw new Error('anchor at '+i+' found '+k);LIB[i]=l.split(A).join(B);out.push('LIB '+i+' '+l.length+'->'+LIB[i].length);};
// 274: LIB 1562 cureRewrite: after K-RECHK, a K-CNT record line when a counted premise's RULING card (UNEXHIBITED) names in NAMED BY only verses whose BROKEN collision line or MISSES/FAILS answer check this change moved to a non-failing grade, and no failing line on that verse remains. Record-only; the count is not re-derived.
{const K=fs.readFileSync(__dirname+'/kcnt.js','utf8').trim();const A4="rk='\\n[AUDIT v39: K-RECHK -- the re-check failed: '+cureSafe(String(e&&e.message||e)).slice(0,160)+' ; END]';}";
 ed(1562,A4,A4+K.replace(/\n\s*/g,'')+"try{rk+=__kcnt(R.rp,s,seat);}catch(e){} /* pkgACT ASK 274 */",1);}
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);
const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;
fs.writeFileSync(fout,JSON.stringify(raw));
console.log(out.join('\n'));console.log('Shared Library',T.length,'->',T1.length,'sha ->',sha(LJ),'users',users.length,users.join(', '));
