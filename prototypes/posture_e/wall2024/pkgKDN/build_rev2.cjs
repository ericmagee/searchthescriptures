// pkgKDN: the K-W withdrawal reader (kwLines421, ruling 421) gains the verb "do not rest", so a closing round's
// "I do not rest on <a footing>" is put to the judges like "I no longer rest on". Run 36677: defender CR4 "I do not rest on the
// route through the woman", after CR3 LINK 6 "So the Davidic flesh reaches him through Mary"; no judge was asked.
// Shared Library is pkgLIB stub form 3: edit the library lines, recompute MAP n for affected nodes, rewrite the header sha.
// rev 2 (W2, taking the package over from W3): a "do not rest ... on it/them/this/that" sentence names no footing by itself (105 of
// the 253 new items in the stored corpus were under 40 characters, e.g. "I do not rest on it."). For the new verb only, when the object
// after "on" is a bare pronoun, the item quote is led by the same sentence's start or, when the match opens its sentence, by the
// previous sentence, cut at a word boundary from its start so the whole quote stays within 300 characters; a fronted object ("Luke 1:36 ..., I do not rest on.") takes the same sentence start, so the judge sees what "it" is. The quote stays verbatim text of the round.
// usage: node build.cjs <live json> <target json>
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow '+W.id);
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');if(iL<0||iM<iL||iE<iM)throw new Error('not stub form 3');
const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
if(JSON.stringify(LIB)!==T.slice(iL+8,iM)||JSON.stringify(MAP)!==T.slice(iM+8,iE))throw new Error('round trip');
const rebuild=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rebuild(LIB,MAP[k]).length!==MAP[k].n)throw new Error('live rebuild length differs for '+k);
const A='no\\s+longer\\s+rest',B='no\\s+longer\\s+rest|do\\s+not\\s+rest';
if(LIB.some(l=>l.includes('do\\s+not\\s+rest')))throw new Error('already applied');
for(const k in MAP)for(const e of MAP[k].p)if(Array.isArray(e)&&typeof e[0]==='string'&&e[0].includes(A))throw new Error('anchor in a node own line: '+k);
const at=[];LIB.forEach((l,i)=>{const n=l.split(A).length-1;if(n)at.push([i,n]);});
const kw=LIB.findIndex(l=>l.startsWith('function kwLines421('));
// every occurrence must be in kwLines421: its first line and its RX loop line, 7 in all
if(kw<0||at.length!==2||at[0][0]!==kw||at[1][0]!==kw+3||at[0][1]+at[1][1]!==7||!LIB[kw+3].includes('t.matchAll(RX)'))throw new Error('anchor shape '+JSON.stringify(at)+' kw '+kw);
for(const [i] of at)LIB[i]=LIB[i].split(A).join(B);
const AN='let s=kwiCut2024(t,m.index);';const ai=LIB.findIndex(l=>l.includes(AN));if(ai!==kw+4||LIB.join('\n').split(AN).length!==2)throw new Error('antecedent anchor '+ai);
const ANT="if(/do\\s+not\\s+rest$/i.test(m[0])&&/^\\s+(?:[^\\s.!?]+\\s+){0,4}?on\\s+(?:it|them|this|that|these|those|either|both|one)\\b[^.!?\\n]{0,60}[.!?]?[\"\\u201d']?\\s*$|^\\s+on\\s*[.!?]?[\"\\u201d']?\\s*$/i.test(s.slice(m[0].length))){const tl=(x,n)=>x.length>n?x.slice(x.length-n).replace(/^\\S*\\s+/,''):x;const bd=x=>Math.max(t.lastIndexOf('\\n',x-1)+1,...[...t.slice(0,x).matchAll(/[.!?][\"\\u201d']?\\s+/g)].map(z=>z.index+z[0].length));const l0=bd(m.index);const own=t.slice(l0,m.index);if(/[A-Za-z0-9]/.test(own))s=(tl(own,Math.max(0,300-s.length))+s).trim();else{let q=l0;while(q>0&&/\\s/.test(t[q-1]))q--;const pv=q>0?t.slice(bd(q-1),q).trim():'';if(/[A-Za-z0-9]/.test(pv))s=(tl(pv,Math.max(0,300-s.length))+' '+s).trim();}}/* pkgKDN: name what \"it\" is */";
LIB[ai]=LIB[ai].replace(AN,()=>AN+ANT);
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rebuild(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k+' '+n0+'->'+n1);}}
const LJ=JSON.stringify(LIB);
const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;
const s=JSON.stringify(raw);fs.writeFileSync(fout,s);
console.log('edited LIB lines',at.map(x=>x[0]+' x'+x[1]).join(', '));
console.log('nodes whose rebuilt length changed ('+users.length+'): '+users.join('; '));
console.log('Shared Library jsCode',T.length,'->',T1.length,'('+(T1.length-T.length)+')','| library sha',T.match(/library sha (\w+)/)[1],'->',sha(LJ));
console.log('nodes',W.nodes.length,'| target sha256',sha(s));
