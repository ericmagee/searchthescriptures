// W1 pkgCNV (ASK 158 option 1, Eric 20:13 CST 11-12): a K-G4 MEANING BREAK retraction is not cured by "a later round names the verse"
// when the judge's own ANSWER CHECK on a verse of the line reads MISSES or FAILS (unless the cure reply restates that check as MEETS).
// Shared Library lines 677 (helper beside __acRead, in every raise and cure node), 788 (tag at raising), 1072 and 1074 (cure), 3323 (cure prompt).
// rev 2: the MEETS read of the cure reply also takes a RESTATED ANSWER CHECK (W2 grade).
// usage: node pkgCNV/build.cjs <parent in> <parent out>
const fs=require('fs');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const E=[
 ["function __acRead(l){try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form==='ANSWER CHECK'&&r.f&&!r.f.restated?r.f:null;}catch(e){return null;}}",
  "function __acRead(l){try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form==='ANSWER CHECK'&&r.f&&!r.f.restated?r.f:null;}catch(e){return null;}} /* pkgCNV: verses of a line whose ANSWER CHECK in T has a grade matching re */ function g4Ac2024(T,line,re,rs){try{const rk=s=>[...String(s||'').matchAll(/\\b((?:[1-3]\\s?)?[A-Za-z]+)\\.?\\s+(\\d{1,3}):(\\d{1,3})/g)].map(m=>m[1].replace(/\\s/g,'').toLowerCase()+' '+m[2]+':'+m[3]);const ks=new Set(rk(line)),out=[];if(!ks.size)return out;for(const l of String(T||'').split('\\n')){const q=rs?(()=>{try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form==='ANSWER CHECK'&&r.f?r.f:null;}catch(e){return null;}})():__acRead(l);if(q&&q.verse&&re.test(String(q.grade||'')))for(const k of rk(q.verse))if(ks.has(k)&&out.indexOf(k)<0)out.push(k);}return out;}catch(e){return [];}}"],
 ["else{items.push({rule:'K-G4',side,link:id,line});",
  "else{items.push({rule:'K-G4',side,link:id,line,acm:g4Ac2024(text,line,/^(?:MISSES|FAILS)$/i)});"],
 ["   if(!__ok){const rk=new Set(cureRefs(__rt).map(r=>r.key));",
  "   const __acm=(x.acm||[]).filter(k=>!(reply&&reply.ok&&g4Ac2024(cureUnwrap(reply.text),k,/^MEETS$/i,1).length)); /* pkgCNV */ if(!__ok&&!__acm.length){const rk=new Set(cureRefs(__rt).map(r=>r.key));"],
 ["or a verse of the line that such a round names); cure it with a FORCED line or such a quoted reason',",
  "or a verse of the line that such a round names'+(__acm.length?'; your own ANSWER CHECK reads MISSES or FAILS on '+__acm.join(', ')+', so a later round naming the verse is no reason to retract (pkgCNV)':'')+'); cure it with a FORCED line or such a quoted reason',"],
 ["or name the verse of this line that its later round names. Otherwise a retraction leaves the item uncured",
  "or name the verse of this line that its later round names.'+(x&&x.acm&&x.acm.length?' Naming the verse does not cure it here: your own ANSWER CHECK on '+x.acm.join(', ')+' reads MISSES or FAILS.':'')+' Otherwise a retraction leaves the item uncured"],
];
const lines=[];for(const [A,B] of E){const hits=Lb.map((l,i)=>l.includes(A)?i:-1).filter(i=>i>=0);if(hits.length!==1||Lb[hits[0]].split(A).length!==2)throw new Error('anchor '+hits.length+': '+A.slice(0,60));Lb[hits[0]]=Lb[hits[0]].replace(A,()=>B);lines.push(hits[0]);}
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(fout,JSON.stringify(raw));console.log('lines',lines.join(','),'Shared Library jsCode +'+(N.parameters.jsCode.length-T.length),'sha',N.parameters.jsCode.match(/library sha ([0-9a-f]{16})/)[1]);
