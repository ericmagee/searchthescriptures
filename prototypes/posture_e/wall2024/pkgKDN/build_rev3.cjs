// pkgKDN rev 3 (W3, on rev 2 by W2): the new verb "do not rest" is read in the CLOSING rounds only (CR4, DR4), where the
// run 36677 withdrawal stood; in CR2, CR3, DR2 and DR3 it states a link's footing as built (W1 Wall 5987: 160 of 253 items,
// each a seat-removal exposure under LIVE K-W). Plus W1's four minor defects (Wall 5987):
//  (a) a bare "I do not rest on it." with no sentence before it in the round is followed by the next sentence;
//  (b) a "do not rest" inside the sentence an earlier item of the same round already quotes is not a second item;
//  (c) the lead-in sentence finder ignores a full stop inside a quotation ("this man ... in his days");
//  (d) the heading guard (pkgKWH) also takes a heading that ends "... what I do not rest on:" (and "no longer rest on:").
// Input is a rev 2 target: on s184 (library sha dc687a22466e249e) or on s185 (rev 2 build_rev2.cjs run on s185: 4299c083f59c820d). usage: node build_rev3.cjs <rev2 json> <target json>
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow '+W.id);
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');if(iL<0||iM<iL||iE<iM)throw new Error('not stub form 3');
const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
if(JSON.stringify(LIB)!==T.slice(iL+8,iM)||JSON.stringify(MAP)!==T.slice(iM+8,iE))throw new Error('round trip');
const PARENTS={'dc687a22466e249e':'pkgKDN rev 2 on s184','4299c083f59c820d':'pkgKDN rev 2 on s185'};const ps=sha(T.slice(iL+8,iM));if(!PARENTS[ps]||T.match(/library sha (\w+)/)[1]!==ps)throw new Error('parent is not pkgKDN rev 2: '+ps);console.log('parent',PARENTS[ps]);
const rebuild=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rebuild(LIB,MAP[k]).length!==MAP[k].n)throw new Error('parent rebuild length differs for '+k);
const kw=LIB.findIndex(l=>l.startsWith('function kwLines421('));if(kw<0)throw new Error('kwLines421');
const once=(i,a,b)=>{const n=LIB[i].split(a).length-1;if(n!==1)throw new Error('anchor x'+n+' on line '+i+': '+a.slice(0,60));LIB[i]=LIB[i].replace(a,()=>b);};
if(LIB.join('\n').includes('pkgKDN rev 3'))throw new Error('already applied');
// per-round end of the last quoted span, for (b)
for(const [i,a,b] of require(__dirname+"/edits_rev3.cjs")(kw))once(i,a,b);
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rebuild(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k+' '+n0+'->'+n1);}}
const LJ=JSON.stringify(LIB);
const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;
const s=JSON.stringify(raw);fs.writeFileSync(fout,s);
console.log('edited LIB lines',kw+2,kw+3,kw+4,kw+5);
console.log('nodes whose rebuilt length changed ('+users.length+'): '+users.join('; '));
console.log('Shared Library jsCode',T.length,'->',T1.length,'('+(T1.length-T.length)+')','| library sha',T.match(/library sha (\w+)/)[1],'->',sha(LJ));
console.log('nodes',W.nodes.length,'| target sha256',sha(s));
