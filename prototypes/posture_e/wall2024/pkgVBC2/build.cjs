// ASK 299 pkgVBC2: (a) the PRE-CHECK's "which props/supports/carries" strip (Panel Build, Build Independent Verdict) no longer runs through a quote mark, so a premise "..., which props the objection to link 3 -- "<quote>"" keeps its quote; (b) see vbc.js for the K-V override in the library.
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');const out=[];
const A=String.raw`.replace(/,?\s*which\s+(?:props|supports|carries)\b[^.;\n]*[.;]?/gi,' ')`,B=String.raw`.replace(/,?\s*which\s+(?:props|supports|carries)\b[^.;\n"“”]*[.;]?/gi,' ') /* pkgVBC2, ASK 299: the strip stops at a quote mark */`;
for(const nm of ['Panel Build','Build Independent Verdict']){const N=W.nodes.find(n=>n.name===nm);let c=N.parameters.jsCode;if(c.split(A).length!==2)throw new Error('anchor '+nm);const n0=c.length;c=c.replace(A,()=>B);N.parameters.jsCode=c;out.push(nm+' '+n0+'->'+c.length);}
if(process.argv[4]==='lib'){/* (b) */const Ls=W.nodes.filter(n=>n.name==='Shared Library');const T=Ls[0].parameters.jsCode;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
 const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base '+k);
 const ed=(i,a,b,cnt)=>{const l=LIB[i];const k=l.split(a).length-1;if(k!==cnt)throw new Error('anchor at '+i+' found '+k);LIB[i]=l.split(a).join(b);out.push('LIB '+i+' '+l.length+'->'+LIB[i].length);};
 require(__dirname+'/vbc.cjs')(LIB,ed,out);
 const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
 const LJ=JSON.stringify(LIB);const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
 const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;out.push('Shared Library '+T.length+'->'+T1.length+' users '+users.length+' '+users.join(', '));}
fs.writeFileSync(fout,JSON.stringify(W));console.log(out.join('\n'));
