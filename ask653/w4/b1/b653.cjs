// ASK 653 build (W4): the [L2] parser marks lexicon etymology words as roots ("compare X", "akin to X", "a variation/derivative of X", and words joined by and/or to a root). Shared Library only, LIB lines 146 and 153. node b653.cjs in.json out.json
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const n0=E.nodes.find(k=>k.name==='Shared Library');const T=n0.parameters.jsCode;
const P={head:T.slice(0,T.indexOf('\n/*LIB*/')),L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))};
const tail=T.slice(T.lastIndexOf('\n/*END*/')+8);
const one=(s,a,b,w)=>{if(s.split(a).length!==2)throw new Error('ASK 653 build: anchor not found exactly once: '+w);return s.replace(a,()=>b);};
const B146=fs.readFileSync(__dirname+'/line146_before.txt','utf8');
const A146=B146.replace(String.raw`|\brelated\s+to)`,String.raw`|\brelated\s+to|\bcompare|\bakin\s+to)`).replace(String.raw`(?:\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*`,String.raw`(?:\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*(?:\s+(?:variation|derivative|prolonged\s+form|form)\s+of)?`)+' /* ASK 653: compare, akin to, a variation/derivative/form of mark a root */';if(A146.split('compare').length!==3||!A146.includes('prolonged'))throw new Error('ASK 653 build: 146 edit did not apply');
const B153="if(!pass)return false;";
const A153=B153+String.raw`const __a=pre.match(/([^\s(*_"“”]+)[*_"”’]*\s+(?:and|or)(?:\s+(?:a|an|the))?(?:\s+(?:variation|derivative|prolonged\s+form|form)\s+of)?[\s*_"“”‘’'(]*$/i);if(__a){const j=i-pre.length+pre.lastIndexOf(__a[1]);if(wds.some((w,k)=>R.has(k)&&pos[k].includes(j)))return true;} /* ASK 653: an etymology word joined to a root by and/or is a root too */`;
if(P.L[146]!==B146)throw new Error('ASK 653 build: LIB 146 is not the expected base');
if(!P.L[153].startsWith('  const rootAt=(i,pass)=>'))throw new Error('ASK 653 build: LIB 153 is not rootAt');
const n=P.L.length;P.L[146]=A146;P.L[153]=one(P.L[153],B153,A153,'LIB 153');if(P.L.length!==n)throw new Error('line count');
const reb=p=>p.map(x=>typeof x==='number'?P.L[x]:typeof x[0]==='string'?x[0]:P.L.slice(x[0],x[1]+1).join('\n')).join('\n');
const touched=[];for(const [k,v] of Object.entries(P.M)){if(!v||!Array.isArray(v.p))continue;const m=reb(v.p).length;if(m!==v.n){touched.push(k);v.n=m;}}
n0.parameters.jsCode=P.head+'\n/*LIB*/'+JSON.stringify(P.L)+'\n/*MAP*/'+JSON.stringify(P.M)+'\n/*END*/'+tail;
fs.writeFileSync(OUT,JSON.stringify(E));console.log('ASK 653 built:',OUT,'| MAP re-measured:',touched.length,touched.join(', '));
