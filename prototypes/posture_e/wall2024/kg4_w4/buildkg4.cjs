// ASK 352 build rev 1: K-G4 to ruling 421 by the manual K-G4 row's test (W3 7450 B, W2 7451): a retraction cures a K-G4 item only when its GROUND names a pressed witness left unanswered. Base: fresh s237 fetch live.json (94549982).
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const w=JSON.parse(fs.readFileSync(process.argv[2]||'live.json'));const BASEV=process.argv[3]||'94549982-71c7-4f69-a890-a7e52dd584a9';if(w.versionId!==BASEV)throw new Error('base moved: '+w.versionId);
const u=unpack(w);const L=u.L.slice();
const rep=(i,o,n)=>{const c=L[i].split(o).length-1;if(c!==1)throw new Error('line '+i+' anchor count '+c);L[i]=L[i].replace(o,()=>n);};
const set=(i,startsWith,endsWith,n)=>{if(!L[i].startsWith(startsWith)||!L[i].endsWith(endsWith))throw new Error('line '+i+' whole-line anchor');L[i]=n;};
// 809: the judge prompt's K-G4 meaning-break sentence
rep(809,"it is cured by one FORCED line, or by RETRACTED beside a quoted reason the system verifies (6 or more words of the holding side's own answer, word for word from its round, or the verse of the line its later round names; ruling of 2026-11-06).","it is cured only by one FORCED line; a retraction does not cure it (ruling 421).");
// 1068-1074: the quoted-reason retraction cure is replaced by UNCURED
set(1068,"   if(__mb421&&wd.has(U(x.link))){","   if(__mb421&&wd.has(U(x.link))){","   if(__mb421&&wd.has(U(x.link)))return res('UNCURED','retracted, but the GROUND names no pressed witness left unanswered, so the BROKEN grade rests on meaning: only a FORCED line cures it; a retraction does not (ruling 421; manual K-G4 row; ASK 352)',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));");
set(1069,"   const __wl=o.withdrawn","join('\\n');","   /* ASK 352: the quoted-reason retraction cure of 2026-11-06 is withdrawn for K-G4 by ruling 421 and the manual K-G4 row (Eric 01:21 CST 2026-11-17) */");
for(const [i,s,e] of [[1070,"   const __hk=","let __ok=null;"],[1071,"   const __aq=[];","break;}}"],[1072,"   const __acm=","__ok='['+z.k+'] names '+z.n.filter(n=>rk.has(n.ref)).map(n=>n.ref).join(', ');}"],[1073,"   if(__ok)return res(","__wl.map(w=>w.line));"],[1074,"   return res('UNCURED','retracted, but the BROKEN grade rests on meaning","such a quoted reason',__wl.map(w=>w.line));}"]])set(i,s,e,'');
// 3315: the gate label
set(3315," :' [MEANING BREAK:","(LIVE rule).]';}"," :' [MEANING BREAK: your GROUND names no pressed witness left unanswered, so this break rests on meaning. One FORCED line cures it: FORCED: D<n> vs C<m> -- MEANS [<round>]: \"<...>\" -- ANSWER [<round>]: \"<...>\" -- FAILS: \"<...>\". A retraction does not cure it (ruling 421): a retracted meaning break stays uncured, and an uncured K-G4 item counts against your seat (LIVE rule).]';}");
const M=JSON.parse(JSON.stringify(u.M));const fixed=[];for(const k in M){const len=rb(L,M[k]).length;if(len!==M[k].n){fixed.push(k+' '+M[k].n+'->'+len);M[k].n=len;}}
const T=u.T;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
if(JSON.stringify(u.L)!==T.slice(iL+8,iM)||JSON.stringify(u.M)!==T.slice(iM+8,iE))throw new Error('LIB/MAP serialization differs; stop');
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=T.slice(0,iL+8)+JSON.stringify(L)+T.slice(iM,iM+8)+JSON.stringify(M)+T.slice(iE);
fs.writeFileSync(process.argv[4]||'target_kg4.json',JSON.stringify(w));console.log('MAP n updated',fixed.length);
