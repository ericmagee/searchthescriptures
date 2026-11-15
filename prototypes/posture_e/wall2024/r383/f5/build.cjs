// F5 pkgKWV on F2: K-W cure (LIB 1201) accepts STANDS WITHOUT IT because ... with a verse quoted in exact KJV words with its reference, as well as an [L1]-[L3] tag.
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));const N=W.nodes||W.data.nodes;
const Ls=N.filter(n=>n.name==='Shared Library');const T=Ls[0].parameters.jsCode;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base '+k);
if(T.includes('pkgKWV'))throw new Error('already');const out=[];
const ed=(i,a,b)=>{const l=LIB[i];if(l.split(a).length!==2)throw new Error('anchor at '+i+': '+a.slice(0,50));LIB[i]=l.replace(a,()=>b);};
const K=fs.readFileSync(__dirname+'/kwv.js','utf8').replace(/\n/g,'').trim();
ed(1201,"  if(x.rule==='K-W'){","  if(x.rule==='K-W'){"+K+" ");
ed(1201,"const kwSt=t=>/\\bSTANDS\\s+WITHOUT\\s+IT\\s+because\\b/i.test(t)&&/\\[L[1-3]\\]/.test(t);","const kwSt=t=>/\\bSTANDS\\s+WITHOUT\\s+IT\\s+because\\b/i.test(t)&&(/\\[L[1-3]\\]/.test(t)||kwVq2024(t)); /* pkgKWV */");
ed(1201,"says STANDS WITHOUT IT because <layer> with an [L1], [L2] or [L3], CONCEDED","says STANDS WITHOUT IT because <layer> with an [L1], [L2] or [L3] or a verse quoted in its KJV words with its reference, CONCEDED");
out.push('LIB 1201 -> '+LIB[1201].length);
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;fs.writeFileSync(fout,JSON.stringify(W));
console.log(out.join('\n'));console.log('Shared Library',T.length,'->',T1.length,'users',users.length,users.join(', '));
