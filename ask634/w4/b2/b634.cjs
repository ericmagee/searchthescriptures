// ASK 634 build (W4): in sbApply2024, a FORCED change whose flagged line is not in the judge text is applied at the one line that is the FORCED line for its pair. Engine Shared Library only. node b634.cjs base_eng.json out_target.json
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const n0=E.nodes.find(k=>k.name==='Shared Library');const T=n0.parameters.jsCode;
const P={head:T.slice(0,T.indexOf('\n/*LIB*/')),L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))};
const tail=T.slice(T.lastIndexOf('\n/*END*/')+8);
const I=1426;const A="if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text'+__rtH,to});continue;}";
if(P.L[I].split(A).length!==2||P.L.filter(l=>l.includes(A)).length!==1)throw new Error('ASK 634 build: the anchor is not found exactly once at LIB '+I);
const NEW=String.raw`if(!o){const __F634=/^\s*(?:[-•]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\b/i;const __p634=l=>{const m=ri5Pair2024(nrm(l),__F634,['FORCED']);return m?(m[1]+' VS '+m[2]).toUpperCase():null;};const __k634=__p634(to);if(__k634){const __c=lines.filter(l=>!(map.has(l)&&map.get(l).to==='')&&__p634(map.has(l)?map.get(l).to:l)===__k634);if(__c.length===1)o=__c[0];}} /* ASK 634: a FORCED change whose flagged line is not in the text is applied at the one FORCED line of its pair (the same-pair rule pkgFRP uses for RETRACTED) */`;
const L0=P.L.slice();P.L[I]=P.L[I].replace(A,()=>NEW+A);
const reb=p=>p.map(x=>typeof x==='number'?P.L[x]:typeof x[0]==='string'?x[0]:P.L.slice(x[0],x[1]+1).join('\n')).join('\n');
const touched=[];for(const [k,v] of Object.entries(P.M)){if(!v||!Array.isArray(v.p))continue;const n=reb(v.p).length;if(n!==v.n){touched.push(k);v.n=n;}}
n0.parameters.jsCode=P.head+'\n/*LIB*/'+JSON.stringify(P.L)+'\n/*MAP*/'+JSON.stringify(P.M)+'\n/*END*/'+tail;
fs.writeFileSync(OUT,JSON.stringify(E));console.log('ASK 634 built:',OUT,'| LIB lines changed:',P.L.filter((l,i)=>l!==L0[i]).length,'| MAP entries re-measured:',touched.length,touched.join(', '));
