// ASK 323 (gate part): 6718 (a) ASSUMES route on the plain K-UNX gate line, W3 wording, listed neutrally; (a2) at the unxLack call of the gate item build only (W2 6736 STRIP); W1 4a sentence on every K-UNX gate line. Built on target_319_bonly.json (s209 + ASK 319), since both edit the Shared Library.
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));const N=W.nodes;
const Ls=N.filter(n=>n.name==='Shared Library');const T=Ls[0].parameters.jsCode;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base '+k);
if(!T.includes('pkgPWF rev 2'))throw new Error('base is not ASK 319');if(T.includes('pkgKGA'))throw new Error('already');
const rep=(i,O,NW,cnt)=>{const n=LIB[i].split(O).length-1;if(n!==(cnt||1))throw new Error('anchor '+i+' count '+n+': '+O.slice(0,70));LIB[i]=LIB[i].split(O).join(NW);};
const S4A=" Write that grade as the pair\\'s own line under COLLISION POINTS, in place of the pair\\'s earlier line, never inside the CONCEDED LINKS line.";
// (a) + 4a on the two plain-path gate lines.
const OP="Name the missing layer in a STATEMENT for this item (\"[L1]\", \"[L2]\", \"[L3]\" or \"[L4]\", one the block does not exhibit), or write a CORRECTED COUNT for '+lab+' without this premise and grade its fit at the collision (a FORCED line, ruling 411).";
const NP="Name the missing layer in a STATEMENT for this item (\"[L1]\", \"[L2]\", \"[L3]\" or \"[L4]\", one the block does not exhibit); or, if the step takes for granted a fact no row in the rounds gives, write ASSUMES: <that fact> and quote the block\\'s [L1]; or write a CORRECTED COUNT for '+lab+' without this premise and grade its fit at the collision (a FORCED line, ruling 411)."+S4A;
rep(476,OP,NP);rep(480,OP,NP);
// 4a on the two assumed-fact path gate lines.
rep(470,"grade its fit at the collision (a FORCED line, ruling 411). A KEEP does not cure it.","grade its fit at the collision (a FORCED line, ruling 411)."+S4A+" A KEEP does not cure it.");
rep(471,"grade its fit at the collision (a FORCED line, ruling 411). A KEEP does not cure it.","grade its fit at the collision (a FORCED line, ruling 411)."+S4A+" A KEEP does not cure it.");
// (a2) at the gate item build's unxLack call only (W1 6734 scope; W2 6736 clause extent).
rep(473,"const nl=all.map(z=>unxLack(z.seg,kk));","/* pkgKGA (ASK 323, a2): [Ln] tokens inside an ASSUMES clause are not read as a named missing layer here; the clause runs from ASSUMES to \" -- \", ROWS GIVE or the end (as pkgBKC reads it). Other unxLack callers are unchanged. */ const __kga=s=>String(s).replace(/\\bASSUMES\\b[^]*?(?=\\s+(?:--|—|–)\\s+|\\bROWS\\s+GIVE\\b|$)/g,m=>m.replace(/\\[L[1-4]\\]/g,''));const nl=all.map(z=>unxLack(__kga(z.seg),kk));");
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;fs.writeFileSync(fout,JSON.stringify(W));
console.log('Shared Library',T.length,'->',T1.length,crypto.createHash('sha256').update(T1).digest('hex').slice(0,12),'users',users.length,users.join(', '));
