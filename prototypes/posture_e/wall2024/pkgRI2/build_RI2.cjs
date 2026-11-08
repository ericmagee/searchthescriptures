// pkgRI2 (W2, 11-08; reader phase 2 item 2, W3 order /mnt/project-files/w3/reader_p2_order.md, assigned W3 3168/3171).
// Extract Independent Verdict's own reads of the verdict lines go through the shared reader (__RL.readLine) first:
//  - KEYSTONE (top-level KSM, and KSC.keystone), CONCEDED LINKS and CHALLENGER CONCEDED LINKS counts, each COLLISION POINTS entry (colMap, and so colState),
//    DEFENDER and CHALLENGER CHAIN MARK.
// A line the reader refuses (or a restated line, or a grade outside the old vocabulary) keeps the old regex read, unchanged.
// OUT-OF-ROUND is left as it is: its old test is the prefix "<SIDE> |", the reader's form is stricter, so reader-first with the old fallback changes nothing.
// Library layer on pkgLIB/strip_GDA19 (LIB v19_GDA, staged s61). Run from wall2024/: node pkgRI2/build_RI2.cjs -> pkgLIB/strip_RI2/patched (22 files)
const fs=require('fs'),c=require('crypto');const sha=s=>c.createHash('sha256').update(s).digest('hex').slice(0,12);
const IN='pkgLIB/strip_GDA19/patched/',OUT='pkgLIB/strip_RI2/patched/';fs.mkdirSync(OUT,{recursive:true});
const once=(s,a,b,nm)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(nm+': anchor found '+k+' times: '+a.slice(0,70));return s.replace(a,()=>b);};
const E=[
 ["const raw0=raw;const prev=$('Build Independent Verdict').first().json;",
  "const raw0=raw;const prev=$('Build Independent Verdict').first().json;\n"+String.raw`/* pkgRI2 (reader item 2): the verdict's own lines are read by the shared reader first; each old regex below runs only where the reader reads no line of that form. */
const __ivR=(()=>{const o=[];try{for(const l0 of String(raw0).split('\n')){const l=l0.replace(/^[ \t]*LINE[ \t]+\d+[ \t]*,?[ \t]*EXACTLY[ \t]*:[ \t]*/i,'');const r=__RL.readLine(l);if(r&&r.form&&!(r.f&&r.f.restated))o.push({form:r.form,f:r.f||{},line:l0});}}catch(e){}return o;})();
const __ivF=(form,pred)=>__ivR.find(x=>x.form===form&&(!pred||pred(x.f)))||null;`],
 ["let conceded_links=clLine?parseInt(clLine[2],10):(clAny?parseInt(clAny[1],10):null);const clFellBack=(!clLine&&!!clAny);",
  "const __cD=__ivF('CONCEDED',f=>f.side==='DEFENDER'&&Number.isInteger(f.n));let conceded_links=__cD?__cD.f.n:(clLine?parseInt(clLine[2],10):(clAny?parseInt(clAny[1],10):null));const clFellBack=(!__cD&&!clLine&&!!clAny); /* pkgRI2 */"],
 ["let challenger_conceded_links=cclLine?parseInt(cclLine[2],10):(cclAny?parseInt(cclAny[1],10):null);const cclFellBack=(!cclLine&&!!cclAny);",
  "const __cC=__ivF('CONCEDED',f=>f.side==='CHALLENGER'&&Number.isInteger(f.n));let challenger_conceded_links=__cC?__cC.f.n:(cclLine?parseInt(cclLine[2],10):(cclAny?parseInt(cclAny[1],10):null));const cclFellBack=(!__cC&&!cclLine&&!!cclAny); /* pkgRI2 */"],
 ["const KSM=upper.match(","const KSM0=upper.match("],
 ["const keystone_link=KSM?parseInt(KSM[2],10):null;",
  String.raw`const __kR=__ivF('KEYSTONE',f=>/^D\d+$/.test(String(f.link))&&/^(STANDS|BROKEN|WITHDRAWN)$/.test(String(f.grade)));const KSM=__kR?[__kR.line,'',String(__kR.f.link).slice(1),__kR.f.grade]:KSM0; /* pkgRI2 */`+"\nconst keystone_link=KSM?parseInt(KSM[2],10):null;"],
 ["if(colSec){for(const x0 of colSec){const x=x0.trim();if(!x)continue;",
  "if(colSec){for(const x0 of colSec){const x=x0.trim();if(!x)continue;"+String.raw`{let __r=null;try{__r=__RL.readLine(x);}catch(e){__r=null;}const __g=(__r&&__r.f&&!__r.f.restated&&(__r.form==='COLLISION'||__r.form==='LINK STATE'))?String(__r.f.grade||''):'';const __id=__g?+((String(__r.form==='COLLISION'?__r.f.pair:__r.f.link).match(/^D(\d+)\b/)||[])[1]):NaN; /* pkgRI2: the shared reader first; the old read below takes a line it refuses */
  if(__id>0&&/^(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|WITHDRAWN)$/.test(__g)){if(/WITHDRAWN AFTER AN UNANSWERED WITNESS/.test(x))colWB.add(__id);if(__g==='CHALLENGER LINK BROKEN')chBroken++;(colMap[__id]=colMap[__id]||[]).push(__g);continue;}}`],
 ["let challenger_chain_mark=ccmM?ccmM[1].toUpperCase():null;",
  "const __mC=__ivF('CHAIN MARK',f=>f.side==='CHALLENGER'&&/^(FOOTED|FORGED|STRAINED|SLACK)$/.test(f.mark));let challenger_chain_mark=__mC?__mC.f.mark:(ccmM?ccmM[1].toUpperCase():null); /* pkgRI2 */"],
 ["let defender_chain_mark=dcmM?dcmM[1].toUpperCase():null;",
  "const __mD=__ivF('CHAIN MARK',f=>f.side==='DEFENDER'&&/^(FOOTED|FORGED|STRAINED|SLACK)$/.test(f.mark));let defender_chain_mark=__mD?__mD.f.mark:(dcmM?dcmM[1].toUpperCase():null); /* pkgRI2 */"],
 [String.raw`const keystone=t=>{let k=null;for(const raw of String(t||'').split('\n')){const m=clean(raw).match(KS);if(m)k={n:+m[1],state:m[2].toUpperCase(),line:raw.trim()};}return k;};`,
  String.raw`const keystone=t=>{let k=null;for(const raw of String(t||'').split('\n')){let r=null;try{r=__RL.readLine(raw);}catch(e){r=null;}if(r&&r.form==='KEYSTONE'&&r.f&&!r.f.restated&&/^D\d+$/.test(String(r.f.link))){k={n:+String(r.f.link).slice(1),state:String(r.f.grade).toUpperCase(),line:raw.trim()};continue;} /* pkgRI2 */const m=clean(raw).match(KS);if(m)k={n:+m[1],state:m[2].toUpperCase(),line:raw.trim()};}return k;};`]];
const plan={base:'pkgLIB/strip_GDA19',nodes:{}};
for(const f of fs.readdirSync(IN).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(IN+f,'utf8');const b=s;
 if(f==='Extract_Independent_Verdict.js'){E.forEach(([a,r],i)=>{s=once(s,a,r,f+' edit '+(i+1));});try{new Function('$','$input','$json','$execution','$workflow',s);}catch(e){throw new Error(f+' syntax: '+e.message);}}
 fs.writeFileSync(OUT+f,s);plan.nodes[f]={before:sha(b),after:sha(s),changed:b!==s};}
fs.writeFileSync('pkgRI2/plan_RI2.json',JSON.stringify(plan,null,1));console.log(Object.entries(plan.nodes).filter(([k,v])=>v.changed).map(([k,v])=>k+' '+v.before+' -> '+v.after).join('\n'));
