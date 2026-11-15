// F6 rev 2 (pkgVNV): plural premise lists ("Premises 4 and 5 are VOID") read one entry per number with the pkgPWR reader pwNums2024 (W1 6612, W3 6614). Built on target_F3.
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));const N=W.nodes||W.data.nodes;
const Ls=N.filter(n=>n.name==='Shared Library');const T=Ls[0].parameters.jsCode;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base '+k);
const has=(m,i)=>m.p.some(e=>typeof e==='number'?e===i:(typeof e[0]!=='string'&&e[0]<=i&&i<=e[1]));
const iP=LIB.findIndex(l=>l.includes('function pwNums2024('));if(iP<0||iP>1754)throw new Error('pwNums '+iP);
for(const k in MAP)if(has(MAP[k],1754)&&!has(MAP[k],iP))throw new Error('pwNums not in node '+k);
const O="for(const seg of l.split(/(?=\\bPremises?\\s+\\d)/i)){const m=seg.match(/^Premise\\s+(\\d+)\\b([^]*?)(?=[.;](?:\\s|$)|$)/i);if(!m)continue;const b=m[2];if(/\\b(?:is|are|was)?\\s*not\\s+VOID\\b|\\bno\\s+longer\\s+VOID\\b/i.test(b))put(sd,+m[1],false,l);else if(/\\bVOID\\b/.test(b)&&!/\\b(?:if|whether|unless|would)\\b[^.]*\\bVOID\\b/i.test(b))put(sd,+m[1],true,l);}";
if(LIB[1754].split(O).length!==2)throw new Error('anchor');
const NW="for(const seg of l.split(/(?=\\bPremises?\\s+\\d)/i)){const m=seg.match(/^Premises?\\s+(\\d+(?:\\s*(?:-|\\u2013|\\u2014|to|through)\\s*\\d+)?(?:(?:\\s*,\\s*(?:and\\s+)?|\\s+and\\s+|\\s*&\\s*)\\d+(?:\\s*(?:-|\\u2013|\\u2014|to|through)\\s*\\d+)?)*)\\b([^]*?)(?=[.;](?:\\s|$)|$)/i);if(!m)continue;const b=m[2];const ns=pwNums2024(m[1]); /* rev 2: plural lists via the pkgPWR reader */ if(/\\b(?:is|are|was)?\\s*not\\s+VOID\\b|\\bno\\s+longer\\s+VOID\\b/i.test(b))ns.forEach(n=>put(sd,n,false,l));else if(/\\bVOID\\b/.test(b)&&!/\\b(?:if|whether|unless|would)\\b[^.]*\\bVOID\\b/i.test(b))ns.forEach(n=>put(sd,n,true,l));}";
LIB[1754]=LIB[1754].replace(O,()=>NW);
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;fs.writeFileSync(fout,JSON.stringify(W));
console.log('pwNums at LIB',iP,'; Shared Library',T.length,'->',T1.length,'users',users.length,users.join(', '));console.log('target',sha(fs.readFileSync(fout)));
