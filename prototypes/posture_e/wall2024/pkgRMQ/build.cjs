// W1 pkgRMQ (run 36156 finding A; operator chose "Refuse it, build and grade" on ASK 174, 21:22 CST 11-12): a K-G4 retraction is
// not cured by a quoted reason when the quotation is an answer that the judge's own ANSWER CHECK grades MISSES or FAILS on a verse
// of the line (side filtered, as pkgCNV). The judge's grade as raised governs: a MEETS restated in the cure does not clear it.
// Shared Library lines 677 (helpers), 788 (tag at raising), 1071 and 1074 (cure), 3323 (cure prompt). MAP n and sha recomputed.
// usage: node pkgRMQ/build.cjs <parent in> <parent out>
const fs=require('fs');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const one=(pred,what)=>{const ix=Lb.map((l,i)=>pred(l)?i:-1).filter(i=>i>=0);if(ix.length!==1)throw new Error(what+': '+ix.length);return ix[0];};
const sub=(i,A,B,what)=>{if(Lb[i].split(A).length!==2)throw new Error('anchor '+what+' x'+(Lb[i].split(A).length-1));Lb[i]=Lb[i].replace(A,()=>B);};
// 1. helpers: g4Aq2024 = the graded answers; rmqHit = quote match
const i1=one(l=>l.includes('function g4Ac2024(T,line,re,rs,side){'),'g4Ac line');
sub(i1,"function g4Ac2024(T,line,re,rs,side){","function g4Aq2024(T,line,side){try{const SP=side==='DEFENDER'?/^C/i:side==='CHALLENGER'?/^[DG]/i:null;const rk=s=>[...String(s||'').matchAll(/\\b((?:[1-3]\\s?)?[A-Za-z]+)\\.?\\s+(\\d{1,3}):(\\d{1,3})/g)].map(m=>m[1].replace(/\\s/g,'').toLowerCase()+' '+m[2]+':'+m[3]);const ks=new Set(rk(line)),out=[];if(!ks.size)return out;for(const l0 of String(T||'').split('\\n')){let q=null;try{const r=__RL.readLine(l0);q=r&&r.form==='ANSWER CHECK'&&r.f?r.f:null;}catch(e){q=null;}if(q&&q.verse&&q.answer&&/^(?:MISSES|FAILS)$/i.test(String(q.grade||''))&&(!SP||(q.rounds||[]).some(r=>SP.test(String(r).replace(/[^A-Za-z]/g,''))))&&rk(q.verse).some(k=>ks.has(k))&&out.indexOf(q.answer)<0)out.push(String(q.answer));}return out;}catch(e){return [];}} /* pkgRMQ: answers this judge graded MISSES or FAILS on a verse of the line */ function rmqHit(q,acq){const W=s=>String(s||'').toLowerCase().replace(/[^a-z0-9: ]+/g,' ').split(/\\s+/).filter(Boolean);const qw=W(q),qs=' '+qw.join(' ')+' ';for(const a of (acq||[])){const aw=W(a),as=' '+aw.join(' ')+' ';if(aw.length&&aw.length<6&&qs.includes(as))return a;for(let i=0;i+6<=aw.length;i++)if(qs.includes(' '+aw.slice(i,i+6).join(' ')+' '))return a;for(let i=0;i+6<=qw.length;i++)if(as.includes(' '+qw.slice(i,i+6).join(' ')+' '))return a;}return null;} /* pkgRMQ: a quotation sharing 6 words in a row with such an answer */ function g4Ac2024(T,line,re,rs,side){",'helpers');
// 2. tag at raising
const i2=one(l=>l.includes("items.push({rule:'K-G4',side,link:id,line,acm:g4Ac2024(text,line,/^(?:MISSES|FAILS)$/i,0,side)});"),'raise line');
sub(i2,"acm:g4Ac2024(text,line,/^(?:MISSES|FAILS)$/i,0,side)});","acm:g4Ac2024(text,line,/^(?:MISSES|FAILS)$/i,0,side),acq:g4Aq2024(text,line,side)}); /* pkgRMQ */",'raise');
// 3. cure: a quotation of such an answer is no reason
const i3=one(l=>l.startsWith("   for(const q of stmtQ(__rt)){if(String(q).trim().split(/\\s+/).length<6)continue;const k=__hk.find("),'quote loop');
sub(i3,"   for(const q of stmtQ(__rt)){if(String(q).trim().split(/\\s+/).length<6)continue;","   const __aq=[];for(const q of stmtQ(__rt)){if(String(q).trim().split(/\\s+/).length<6)continue;{const h=rmqHit(q,x.acq);if(h){if(__aq.indexOf(h)<0)__aq.push(h);continue;}} /* pkgRMQ */",'loop');
const i4=one(l=>l.includes("so a later round naming the verse is no reason to retract (pkgCNV)':'')+'); cure it with a FORCED line or such a quoted reason'"),'uncured');
sub(i4,"so a later round naming the verse is no reason to retract (pkgCNV)':'')+'","so a later round naming the verse is no reason to retract (pkgCNV)':'')+(__aq.length?'; your own ANSWER CHECK grades MISSES or FAILS the answer your quotation gives (\"'+String(__aq[0]).slice(0,160)+'\"), so quoting it is no reason to retract (pkgRMQ)':'')+'",'reason');
// 4. cure prompt, tagged items only
const i5=one(l=>l.includes("Naming the verse does not cure it here: your own ANSWER CHECK on '+x.acm.join(', ')+' reads MISSES or FAILS.':'')+'"),'label');
sub(i5,"reads MISSES or FAILS.':'')+'","reads MISSES or FAILS.':'')+(x&&x.acq&&x.acq.length?' Quoting an answer your own ANSWER CHECK grades MISSES or FAILS does not cure it either.':'')+'",'label');
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
const s=JSON.stringify(raw);fs.writeFileSync(fout,s);console.log('lines',i1,i2,i3,i4,i5,'Shared Library jsCode +'+(N.parameters.jsCode.length-T.length),'sha256',require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16));
