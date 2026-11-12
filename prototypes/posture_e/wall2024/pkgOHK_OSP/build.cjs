// pkgOHK (a) and pkgOSP (b), W1, ASK 135. Both edit sbApply2024 in the Shared Library; no new library line.
// pkgOSP: the send-back prefix strip (pkgOAD) also takes bold, no colon, a dash, unhyphenated, singular, a bullet before it, and the prefix twice.
// pkgOHK: when the flagged line is the OUT-OF-ROUND CONCESSIONS heading itself and the change is a DEFENDER/CHALLENGER row, the heading
//   is not replaced: the row is matched to an existing row as usual; if none matches, the row is added under the heading.
// Usage: node build.cjs <parent json> <out json> <A|B|AB>   (A = pkgOHK, B = pkgOSP)
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const which=process.argv[4]||'AB';const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const T0=T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c);if(T0!==T)throw new Error('serialisation differs from the parent');
const at=s=>{const h=Lb.map((l,i)=>l.includes(s)?i:-1).filter(i=>i>=0);if(h.length!==1)throw new Error('anchor hits '+h.length+': '+s.slice(0,60));return h[0];};
const rep=(i,o,n)=>{if(Lb[i].split(o).length!==2)throw new Error('line '+i+' anchor not unique');Lb[i]=Lb[i].replace(o,()=>n);};
if(which.includes('B')){const i=at('/* pkgOAD */');
 rep(i,String.raw`to=to.replace(/^OUT-OF-ROUND CONCESSIONS\s*:\s*(?=(?:DEFENDER|CHALLENGER)\b)/i,''); /* pkgOAD */`,
  String.raw`to=to.replace(/^(?:[-•]\s+)?(?:[*_]*\s*OUT[- ]?OF[- ]?ROUND\s+CONCESSIONS?\s*[*_]*\s*(?::|--|-|–|—)?\s*[*_]*\s*)+(?=(?:DEFENDER|CHALLENGER)\b)/i,''); /* pkgOAD, pkgOSP */`);}
if(which.includes('A')){const i=at('/* pkgOAD')+1; /* the change path line right after the prefix strip */
 if(Lb[i]!=='  let o=find(x.line);if(!o){const n=nrm(x.line);for(const [o2,c2] of map){if(n&&nrm(c2.to)===n){o=o2;break;}}}')throw new Error('line '+i+' is not the change path');
 Lb[i]=Lb[i]+String.raw`let __hd=null;if(o&&/^\s*(?:#+\s*)?OUT[- ]?OF[- ]?ROUND\s+CONCESSIONS?\s*:?\s*$/i.test(nrm(o))&&/^(?:DEFENDER|CHALLENGER)\b/i.test(to)){__hd=o;o=null;} /* pkgOHK */`;
 const j=at(String.raw`  if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text'+__rtH,to});continue;}`);
 rep(j,String.raw`  if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text'+__rtH,to});continue;}`,
  String.raw`  if(!o&&__hd){const __r=__sbRL(to);if(__r&&__r.form==='OUT-OF-ROUND'){const p=map.get(__hd);const c0=p?p.to:__hd;map.set(__hd,{sid:p?p.sid:x.sid,to:c0+'\n'+to,over:p?p.over:[],forced:((p&&p.forced)||[]).concat(p?[x.sid]:[])});continue;}items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is the OUT-OF-ROUND CONCESSIONS heading and the change is not an out-of-round row (pkgOHK)',to,lines:[__hd]});continue;} /* pkgOHK rev 2: only an out-of-round row is added under the heading */`+
  String.raw`if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text'+__rtH,to});continue;}`);}
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log(which,'jsCode delta',N.parameters.jsCode.length-T.length);
