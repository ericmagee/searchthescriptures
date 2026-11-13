// pkgOWR rev 2 (W2, ASK 185 item b; plan Wall 5787): YOUR OWN RECORD also lists grants worded "That is granted", "X is conceded".
// OGR.harvest gains a second argument. With it (only the two OWR calls, D4 Build and C4 Build), a second pattern adds
// "is / are / was / were [readily|freely|fully|plainly|also|therefore|thus|so] granted|conceded". Such a sentence is skipped when its
// lead opens with nothing / none / no / neither / nor / what, holds where / if / unless / once / when / whether / until / after / since /
// because / though / although, is followed by "by the defender / challenger / other side / opponent", or already holds an "I grant ..."
// form (the first pattern lists it). When the lead opens with that / this / it / these / those / both / each / which,
// the sentence before it, from the last non-empty line before it, is carried (up to 200 chars, at a word) so the record says what is granted; such an entry is kept up to 420 chars.
// Without the second argument (C4 Build's opponent-grants list, C4 Extract, C4G Extract, C4B Extract) nothing changes.
// usage: node pkgOWR/build_rev2.cjs <parent in> <parent out>
const fs=require('fs'),crypto=require('crypto');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const one=(s,o,n,what)=>{const c=s.split(o).length-1;if(c!==1)throw new Error('anchor count '+c+': '+what);return s.replace(o,()=>n);};
const E=[
 [" function harvest(R){const out=[];const seen=new Set();",
  " const RX2=/\\b(?:is|are|was|were)\\s+(?:(?:readily|freely|fully|plainly|also|therefore|thus|so)\\s+)?(?:granted|conceded)\\b/g; /* pkgOWR rev 2 */\n function harvest(R,wide){const out=[];const seen=new Set();"],
 ["   for(const m of t.matchAll(RX)){",
  "   for(const m of (wide?[...t.matchAll(RX),...[...t.matchAll(RX2)].map(x=>(x.__w=true,x))].sort((p,q)=>p.index-q.index):t.matchAll(RX))){"],
 ["  s=s.slice(0,260).trim();",
  "  if(m.__w){const ld=__ld.trim();if(/^(?:nothing|none|no|neither|nor|what)\\b/i.test(ld)||/\\b(?:where|if|unless|once|when|whether|until|after|since|because|though|although)\\b/i.test(ld)||/^\\s+by\\s+(?:the\\s+)?(?:defender|challenger|other\\s+side|opponent)\\b/i.test(t.slice(m.index+m[0].length))||/\\bI\\s+(?:\\w+\\s+){0,2}(?:grant|concede|withdraw|drop|admit|retract)\\b/i.test(ld))continue;if(/^(?:that|this|it|these|those|both|each|which)\\b/i.test(ld)){const pv=(t.slice(0,m.index-__ld.length).split('\\n').filter(l=>l.trim()).pop()||'').trim();let ps=(pv.split(/(?<=[.!?][\"')\\]]?)\\s+/).pop()||'').replace(/^[\\s>*#-]*(?:\\[[A-Za-z]{1,3}\\d*\\][\\s:]*)*/,'');if(ps.length>200){ps=ps.slice(-200);ps=ps.slice(ps.indexOf(' ')+1);}if(ps&&!/^#/.test(pv))s=ps+' '+s;}} /* pkgOWR rev 2 */\n  s=s.slice(0,m.__w?420:260).trim();"]];
const C=[["D4 Build","return OWR(R,OGR.harvest({CR1:R[0][1],CR2:R[1][1],CR3:R[2][1]}));","return OWR(R,OGR.harvest({CR1:R[0][1],CR2:R[1][1],CR3:R[2][1]},true));"],
 ["C4 Build","return OWR(R,OGR.harvest({CR1:R[0][1],CR2:R[1][1],CR3:R[2][1]}));","return OWR(R,OGR.harvest({CR1:R[0][1],CR2:R[1][1],CR3:R[2][1]},true));"]];
let tot=0;for(const [nm,o,nw] of C){const n=W.nodes.find(x=>x.name===nm);const s0=n.parameters.jsCode;let s=s0;for(const [a,b] of E)s=one(s,a,b,nm+' '+a.slice(0,30));s=one(s,o,nw,nm+' OWR call');n.parameters.jsCode=s;tot+=s.length-s0.length;console.log(nm,'+'+(s.length-s0.length));}
const s=JSON.stringify(raw);fs.writeFileSync(fout,s);console.log('total +'+tot,'| sha256',crypto.createHash('sha256').update(s).digest('hex').slice(0,16));
