// ASK 651 build (W4): PRS refCheck reads the quotation to the end of the line, not 160 characters, so a long quoted verse is found as quoted. node b651.cjs base_eng.json out_target.json
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const OLD="const after=t.slice(h.pos,h.pos+160);";
const NEW=String.raw`const after=t.slice(h.pos,(e=>e<0?t.length:e)(t.indexOf('\n',h.pos))); /* ASK 651: the quotation is read to the end of its line (was 160 characters, which missed long verses such as Luke 1:35) */`;
const once=(s,w)=>{if(s.split(OLD).length!==2)throw new Error('ASK 651 build: anchor not found exactly once in '+w);return s.replace(OLD,()=>NEW);};
for(const nm of ['D4 Build','Panel Build','Build Independent Verdict']){const n=E.nodes.find(k=>k.name===nm);n.parameters.jsCode=once(n.parameters.jsCode,nm);}
const n0=E.nodes.find(k=>k.name==='Shared Library');const T=n0.parameters.jsCode;
const P={head:T.slice(0,T.indexOf('\n/*LIB*/')),L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))};
const tail=T.slice(T.lastIndexOf('\n/*END*/')+8);
const idx=P.L.map((l,i)=>l.includes(OLD)?i:-1).filter(i=>i>=0);if(idx.length!==1)throw new Error('ASK 651 build: LIB anchor lines '+idx);
const L0=P.L.slice();P.L[idx[0]]=once(P.L[idx[0]],'LIB '+idx[0]);
const reb=p=>p.map(x=>typeof x==='number'?P.L[x]:typeof x[0]==='string'?x[0]:P.L.slice(x[0],x[1]+1).join('\n')).join('\n');
const touched=[];for(const [k,v] of Object.entries(P.M)){if(!v||!Array.isArray(v.p))continue;const n=reb(v.p).length;if(n!==v.n){touched.push(k);v.n=n;}}
n0.parameters.jsCode=P.head+'\n/*LIB*/'+JSON.stringify(P.L)+'\n/*MAP*/'+JSON.stringify(P.M)+'\n/*END*/'+tail;
fs.writeFileSync(OUT,JSON.stringify(E));console.log('ASK 651 built:',OUT,'| LIB line',idx[0],'| MAP re-measured:',touched.length,touched.join(', '));
