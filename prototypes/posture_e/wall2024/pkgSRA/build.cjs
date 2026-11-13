// W1 pkgSRA (ASK 166, operator chose "Count it" 21:08 CST 11-12): an answer the same side gave in the SAME round under another
// verse or link counts for E-ANS. The DeepSeek answer check is served the closest paragraphs of that round (by the words of the
// press's stated meaning that the answer itself does not use, weighted by rarity in the round) and the rule text says they count.
// Shared Library lines 3036 (helper appended at line start), 3037 (served text) and 3204 (rule text). MAP n and sha recomputed.
// The added text rides inside the item's olt field, so pkgA1N rev 2 drops it before any item would go unchecked.
// usage: node pkgSRA/build.cjs <parent in> <parent out>
const fs=require('fs');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const one=(pred,what)=>{const ix=Lb.map((l,i)=>pred(l)?i:-1).filter(i=>i>=0);if(ix.length!==1)throw new Error(what+': '+ix.length);return ix[0];};
const sub=(i,A,B,what)=>{if(Lb[i].split(A).length!==2)throw new Error('anchor '+what);Lb[i]=Lb[i].replace(A,()=>B);};
const HELPER=fs.readFileSync(__dirname+'/helper.js','utf8').trim();
// 1. helper, at the start of the olkOrder line
const i1=one(l=>l.startsWith('function olkOrder(sec,ans){'),'olkOrder line');Lb[i1]=HELPER+' '+Lb[i1];
// 2. served text
const i2=one(l=>l.includes("const __olt=(__ol?'\\nTHE SIDE\\'S OTHER LINES ON THIS VERSE"),'__olt line');
sub(i2,"const __olt=(__ol?","const __srt=(()=>{try{const k0=__rk[0];if(!R||typeof R[k0]!=='string')return '';const s=sraSame(R[k0],g.verse,g.means,typeof __ga==='string'?__ga:g.answer,__ol);return s?'\\nTHE SIDE\\'S LINES ELSEWHERE IN THE SAME ROUND ['+k0+'] (under other verses or links; picked by the system by the words of the stated meaning, so judge yourself whether they answer it): \"'+cut(s,900)+'\"':'';}catch(e){return '';}})(); /* pkgSRA */ const __olt=(__ol?",'olt');
sub(i2,"+__olt+'\\nTHE JUDGES\\' GRADES:","+__olt+__srt+'\\nTHE JUDGES\\' GRADES:",'text');
sub(i2,",olt:__olt});",",olt:__olt+__srt,srt:__srt});",'olt field');
// 2b. pkgA1N rev 2 drop: same-round text goes first, before any other-lines text, so it never displaces it
const i4=one(l=>l.startsWith('const __pk=I=>{'),'__pk line');
sub(i4,"let r=__pk(items);for(const x of items.filter(x=>x.olt)","let r=__pk(items);for(const x of items.filter(x=>x.srt).sort((a,b)=>b.srt.length-a.srt.length)){if(r.nc.every(y=>s0.has(y)))break;x.text=x.text.replace(x.srt,'');x.olt=x.olt.slice(0,x.olt.length-x.srt.length);x.srt='';r=__pk(items);} /* pkgSRA */ for(const x of items.filter(x=>x.olt)",'drop order');
// 3. rule text
const i3=one(l=>l.startsWith("const RULES='RULE E-ANS"),'RULES');
sub(i3,"as THE SIDE\\'S OTHER LINES ON THIS VERSE shows; an answer given there counts as the answer;","as THE SIDE\\'S OTHER LINES ON THIS VERSE shows; an answer given there counts as the answer; so does an answer that side gave in the same round under another verse or link, as THE SIDE\\'S LINES ELSEWHERE IN THE SAME ROUND shows, when in its own words it meets the stated meaning;",'rule');
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
const s=JSON.stringify(raw);fs.writeFileSync(fout,s);console.log('lines',i1,i2,i3,i4,'Shared Library jsCode +'+(N.parameters.jsCode.length-T.length),'sha256',require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16));
