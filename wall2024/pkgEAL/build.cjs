// ASK 289: LIB 2977/2979 (Judge Enforcer Build + 2 Alts): E-ANS groups also read "[CRn, <label tail>]" and a MEANS not wholly quoted.
// The original AC is tried first (byte-equal for every line it took before); __ac2 falls back to the library line reader __RL.readLine (LIB 240), the reader Send Back Record already uses (__acm4).
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=raw;
if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base rebuild length differs for '+k);
const out=[];const ed=(i,A,B,cnt)=>{const l=LIB[i];const k=l.split(A).length-1;if(k!==cnt)throw new Error('anchor at '+i+' found '+k);LIB[i]=l.split(A).join(B);out.push('LIB '+i+' '+l.length+'->'+LIB[i].length);};
const AC2=String.raw`const __ac2=l=>{let r=null;try{r=__RL.readLine(String(l));}catch(e){return null;}const f=r&&r.form==='ANSWER CHECK'&&r.f;if(!f||f.restated||!Array.isArray(f.rounds)||!f.rounds.length||f.means==null||f.answer==null||!/^(MEETS|MISSES|FAILS)$/.test(String(f.grade||'')))return null;return [l,String(f.verse||''),f.rounds.join('; '),String(f.means)+(f.meansNote?' '+f.meansNote:''),String(f.answer),String(f.grade),f.tail==null?undefined:String(f.tail)];}; /* pkgEAL, ASK 289: library line reader as fallback */`;
if(!LIB[2977].startsWith('const AC=/^ANSWER CHECK:'))throw new Error('2977 not AC');
LIB[2977]=LIB[2977]+AC2;out.push('LIB 2977 +'+AC2.length);
ed(2979,"const m=l.match(AC);if(!m)continue;","const m=l.match(AC)||__ac2(l);if(!m)continue;",1);
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);
const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;
fs.writeFileSync(fout,JSON.stringify(raw));
console.log(out.join('\n'));console.log('Shared Library',T.length,'->',T1.length,'sha ->',sha(LJ),'users',users.length,users.join(', '));
