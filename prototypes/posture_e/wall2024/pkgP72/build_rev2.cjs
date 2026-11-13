// pkgP72 rev 2 (W2, ASK 185 item c; plan Wall 5787): an E-PREM push that counts a premise by ruling 372 (the judge's own ANSWER CHECK
// graded MISSES or FAILS a witness pressed against it) is HELD when, in the same enforcer pass, the E-ANS item on every such answer
// check of that judge is ruled DISAGREE with right MEETS. The push would otherwise send the judge back on the old grade (run 36212,
// chatgpt, Matthew 1:25, premise 2: two opposite send-backs, the E-PREM row UNCURED).
// Library lines: the __e372 line (adds __eM372) and the epsHold line (the hold). Used by Judge Enforcer Record, Alt and R2 Alt.
// usage: node pkgP72/build_rev2.cjs <parent in> <parent out>
const fs=require('fs'),crypto=require('crypto');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
const before={};for(const e in M)before[e]=reb(e);
const sub1=(A,B,what)=>{const n=Lb.reduce((t,l)=>t+l.split(A).length-1,0);if(n!==1)throw new Error('anchor '+what+' '+n);const i=Lb.findIndex(l=>l.includes(A));Lb[i]=Lb[i].replace(A,()=>B);return i;};
// verse key as p372 builds it: book chapter:verse of the first verse
const VK="const __vk372=s=>{const m=String(s||'').match(/^((?:[1-3]\\s)?[A-Za-z]+(?:\\s+of\\s+[A-Za-z]+)?)\\s+(\\d+):(\\d+)/);return m?m[1]+' '+m[2]+':'+m[3]:null;};";
const MK="const __eM372=new Set();B.forEach(b=>(b.ids||[]).forEach(x=>{const v=x&&V[String(x.id).toUpperCase()];if(!x||x.rule!=='E-ANS'||!v||v.v!=='DISAGREE'||v.right!=='MEETS')return;const m=String(x.item||'').match(/^ANSWER CHECK\\s+(.+?)\\s+\\[(CR|DR)\\d/);const k=m&&__vk372(m[1]);if(k)__eM372.add(x.seat+'|'+m[2]+'|'+k);})); /* pkgP72 rev 2: answer checks this pass rules MEETS */";
const i1=sub1("x.r372;})); /* pkgP72 */","x.r372;})); /* pkgP72 */"+VK+MK,'e372 line');
const HA="if(/^\\s*\\(\\s*UNEXHIBITED\\b[^)]*\\bruling\\s*372\\b/i.test(v.why)&&(__e372[x.item+'|'+x.seat]||[])";
const HB="{const __sd=/against the defender/.test(x.item)?'CR':/against the challenger/.test(x.item)?'DR':'';const __rz=(__e372[x.item+'|'+x.seat]||[]).filter(z=>String(v.why).split(z).slice(1).some(t=>!/^\\d/.test(t)));if(__sd&&/^\\s*\\(\\s*UNEXHIBITED\\b[^)]*\\bruling\\s*372\\b/i.test(v.why)&&__rz.length&&__rz.every(z=>__eM372.has(x.seat+'|'+__sd+'|'+z)))return 'the push counts the premise on this judge\\'s ANSWER CHECK on '+__rz.join(', ')+', which the E-ANS item of this same pass rules MEETS; the count follows that corrected grade (pkgP72 rev 2, ASK 185)';}"+HA;
const i2=sub1(HA,HB,'epsHold 372 line');
const ch=[];for(const e in M){const s=reb(e);if(s!==before[e])ch.push(e+' '+(s.length-before[e].length));M[e].n=s.length;}
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));
const s=JSON.stringify(raw);fs.writeFileSync(fout,s);
console.log('lines',i1,i2,'nodes changed:',ch.join('; '),'| Shared Library jsCode +'+(N.parameters.jsCode.length-T.length),'| sha256',crypto.createHash('sha256').update(s).digest('hex').slice(0,16));
