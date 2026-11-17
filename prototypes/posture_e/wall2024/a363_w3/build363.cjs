// ASK 363 (plan Wall 7616; reads W1 7618 E1-E3, W2 7619 L1-L5): verdict lines rest on the verses read together through the layers.
// Base: W2's ASK 362 target (target362.json, file sha256 b405f30f7d10; on s245 + ASK 360). Usage: node build363.cjs <base> <out>
const fs=require('fs'),crypto=require('crypto');const {unpack,rb}=require(process.env.LIBCJS||'../a336/inputs/tools/lib.cjs');
const bt=fs.readFileSync(process.argv[2]);if(crypto.createHash('sha256').update(bt).digest('hex').slice(0,12)!=='b405f30f7d10')throw new Error('base moved');
const w=JSON.parse(bt);
const OLD="My RESULT and KEYSTONE lines name, by label, the collision lines that decide them, and carry at least one [L1].";
const NEW="My RESULT and KEYSTONE lines name, by label, the collision lines that decide them; quote [L1] each verse those lines are graded on, read together with the [L3] rows their GROUNDs rely on; and give the deciding step as an [L4] that names the [L1] and the [L3] it joins. No verse decides alone: single verse doctrine is prohibited (Isaiah 28:10).";
const NODES=['Panel Build','Reserve Build','Accept Build','Accept Check','Accept Return Build','Accept Final','Accept DS Return Build','Enforcer Build'];
let copies=0;for(const nm of NODES){const n=w.nodes.find(x=>x.name===nm);const c=n.parameters.jsCode;const k=c.split(OLD).length-1;if(k!==1)throw new Error(nm+' anchor count '+k);n.parameters.jsCode=c.replace(OLD,()=>NEW);copies++;}
const u=unpack(w);const L=u.L.slice();
const libHits=L.map((l,i)=>l.split(OLD).length-1?i:-1).filter(i=>i>=0);if(libHits.join()!=='2966,3274')throw new Error('library anchors at '+libHits.join());
for(const i of libHits){if(L[i].split(OLD).length-1!==1)throw new Error('line '+i+' count');L[i]=L[i].replace(OLD,()=>NEW);copies++;}
if(copies!==10)throw new Error('copies '+copies);
const rep=(i,o,n)=>{const c=L[i].split(o).length-1;if(c!==1)throw new Error('line '+i+' anchor count '+c);L[i]=L[i].replace(o,()=>n);};
const FN=String.raw` function lyr2024(B){/* ASK 363 (K-LYR; plan Wall 7616; reads W1 7618, W2 7619): on each judge's final text, every RESULT and KEYSTONE line is read for the verses read together through the layers (Commitment 13; Isaiah 28:10; single verse doctrine is prohibited): (a) an [L1] with its reference; (b) an [L3] whose reference is not one of the line's [L1]; (c) an [L4] step, on a line that holds both (a) and (b); (d) every [L3] reference stands in the GROUND of a collision line the verdict line names. TRIAL, record only: an AUDIT v59 line; no send-back call; it counts nothing, removes no seat and moves no grade (Rulings 383, 428). */
if(!Array.isArray(B))return null;let ch=0;const REF='((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \\d{1,3}:\\d{1,3})';
const tags=(l,n)=>{const o=[];const re=new RegExp('[\\[(]L'+n+'[\\])]\\s*'+REF,'g');let m;while((m=re.exec(l)))o.push(m[1].replace(/\s+/g,' '));return [...new Set(o)];};const has=(l,n)=>new RegExp('[\\[(]L'+n+'[\\])]').test(l);
const RES=/^[\s>-]*RESULT\s*:\s*(?!CURED\b|UNCURED\b)/i,KEY=/^[\s>-]*KEYSTONE\s*:\s*(D\d+)\b/i,DERIVED=/derived by the engine|derived after the send-back|\brecomputed\b|BROKEN BY A CONFIRMED CLOSING CONTRADICTION/i,COL=/^[\s>-]*(?:\d+[.)]\s*)?(D\d+)\s+vs\.?\s+(C\d+)\b/i;
const o=B.map(s=>{let b;try{b=JSON.parse(s);}catch(e){return s;}const p=b.payload||{};const raw=String(p.verdict_raw||'');if(!p.judge_seat||raw.includes('[AUDIT v59:'))return s;
 const L=raw.replace(/\\n/g,'\n').replace(/\\+"/g,'"').replace(/[*_`+'`'+String.raw`]+/g,'').split('\n').map(x=>x.trim()).filter(x=>x&&!/^\[(?:AUDIT|EXTRACTOR)\b/.test(x));
 const G={};for(const l of L){const m=l.match(COL);const gi=l.search(/GROUND\s*:/i);if(!m||gi<0)continue;const k=(m[1]+' VS '+m[2]).toUpperCase();G[k]=(G[k]||'')+' '+l.slice(gi).replace(/\s+/g,' ');}
 const rec=[];for(const l of L){if(DERIVED.test(l))continue;const k=l.match(KEY);if(!k&&!RES.test(l))continue;if(k&&/^[\s>-]*KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)?\s*WITHDRAWN\b/i.test(l))continue;
  const a=tags(l,1),c3=tags(l,3).filter(r=>!a.includes(r)),f=[];
  if(!a.length)f.push('(a) no [L1] with its reference');if(!c3.length)f.push('(b) no [L3] with a reference other than its [L1]');
  if(!has(l,4))f.push('(c) no [L4] step');else if(!a.length||!c3.length)f.push('(c) its [L4] stands on a line without both an [L1] and an [L3]');
  const labs=[...new Set([...l.matchAll(/\b(D\d+)\s+vs\.?\s+(C\d+)\b/gi)].map(m=>(m[1]+' VS '+m[2]).toUpperCase()))];const gr=labs.map(x=>G[x]||'').join(' ');
  if(!labs.length)f.push('(d) names no collision line to read its [L3] against');else{const miss=c3.filter(r=>!gr.includes(r));if(miss.length)f.push('(d) [L3] '+miss.join(', ')+' stands in no GROUND of '+labs.join(', '));if(!/[\[(]L3[\])]/.test(gr))f.push('the GROUNDs of '+labs.join(', ')+' name no [L3]');}
  if(f.length)rec.push((k?'KEYSTONE '+k[1].toUpperCase():'RESULT')+': '+f.join('; '));}
 const U=[...new Set(rec)];if(!U.length)return s;p.verdict_raw=raw+U.map(x=>'\n[AUDIT v59: LAYERS READ TOGETHER (K-LYR, ASK 363, TRIAL) -- SEAT: '+p.judge_seat+'; LINE: '+x+'; record-only, not counted in drv_uncured; it removes no seat and moves no grade]').join('');ch++;return JSON.stringify(b);});
return ch?o:null;}`.replace(/\n/g,'');
rep(1922,"if(first.gate_skip){const __g=gcp2024(PASS.bodies,PASS.sb_items,PB0);","if(first.gate_skip){const __g0=gcp2024(PASS.bodies,PASS.sb_items,PB0);let __g=__g0;try{__g=lyr2024(__g0||PASS.bodies)||__g0;}catch(e){__g=__g0;} /* ASK 363: K-LYR, TRIAL record only */");
L[1922]=L[1922]+FN;
rep(1933,"if(__g)__g.forEach((x,i)=>bodies[i]=x);}","if(__g)__g.forEach((x,i)=>bodies[i]=x);}{let __y=null;try{__y=lyr2024(bodies);}catch(e){__y=null;}if(__y)__y.forEach((x,i)=>bodies[i]=x);} /* ASK 363: K-LYR, TRIAL record only */");
const M=JSON.parse(JSON.stringify(u.M));const fixed=[];for(const k in M){const len=rb(L,M[k]).length;if(len!==M[k].n){fixed.push(k);M[k].n=len;}}
const T=u.T;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
if(JSON.stringify(u.L)!==T.slice(iL+8,iM)||JSON.stringify(u.M)!==T.slice(iM+8,iE))throw new Error('LIB/MAP serialization differs; stop');
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=T.slice(0,iL+8)+JSON.stringify(L)+T.slice(iM,iM+8)+JSON.stringify(M)+T.slice(iE);
fs.writeFileSync(process.argv[3],JSON.stringify(w));console.log('copies',copies,'MAP n updated',fixed.length,fixed.join(', '));
