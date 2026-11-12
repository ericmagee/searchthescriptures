// pkgRPS (W1; run 35379 luna G1, W3 Wall 5171, W4 Wall 5173): a CHANGE TO in row form that drops the second " | " after the round
// tag ("DEFENDER | [CR4] “...” COUNTED") was not placed: SB_ROW needs both separators. Change (sbApply2024, library line 1415): when SB_ROW
// does not match, a line "SIDE | [Rn] “quote...”" (round in brackets, an opening quote right after it) is read with the separator
// restored; the judge row is matched by side, round and quoted sentence as before; when a row is found, the restored line is applied.
// Prompt 0. Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(z=>z.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
const i=Lb.findIndex(l=>l.includes("else{const m=to.match(SB_ROW);const rq=s=>"));if(!Lb[i-1].includes("if(!o){const __a=__sbRL(to);"))throw new Error('line 1414');if(i!==1415)throw new Error('line at '+i);
const o1="if(!o){const __a=__sbRL(to);";
const n1="if(!o){let __fx=null;if(!SB_ROW.test(to)){const __k=to.match(/^(DEFENDER|CHALLENGER)\\s*(?:\\|\\s*)?\\[?\\s*([CD]R\\d)\\s*\\]?\\s*:?\\s*([\"\\u201c][\\s\\S]+)$/i);if(__k)__fx=__k[1].toUpperCase()+' | ['+__k[2].toUpperCase()+'] | '+__k[3].trim();} /* pkgRPS: a row line that drops a separator or the brackets, or is written as the item label (SIDE Rn: quote), is read in row form */const __a=__sbRL(__fx||to);";
const o2="else{const m=to.match(SB_ROW);";
const n2="else{const m=(__fx||to).match(SB_ROW);";
const o3="return r&&r[1].toUpperCase()===m[1].toUpperCase()&&r[2].toUpperCase()===m[2].toUpperCase()&&rq(r[3])===q;})||null;}}}";
const n3="return r&&r[1].toUpperCase()===m[1].toUpperCase()&&r[2].toUpperCase()===m[2].toUpperCase()&&rq(r[3])===q;})||null;}}if(o&&__fx)to=__fx;}";
for(const [o,n,li] of [[o1,n1,i-1],[o2,n2,i],[o3,n3,i]]){if(Lb[li].split(o).length!==2)throw new Error("anchor "+o.slice(0,30));Lb[li]=Lb[li].replace(o,()=>n);}
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
