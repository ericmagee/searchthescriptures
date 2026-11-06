// pkgEC2 (W3 Wall 2446): the LIVE cure reading for E-ANS and E-PREM send-backs. Record-only until W3 promotes the rules.
function enf428Cure(it,a,R,named){ /* named: the premise numbers of every E-PREM item the seat was sent on the same flagged line (pkgPS); default the item's own */
 const N=s=>String(s==null?'':s).toLowerCase().replace(/\\+"/g,'"').replace(/[‘’“”"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿ ]+/g,' ').replace(/\s+/g,' ').trim();
 const side=k=>/^CR/i.test(k)?'C':/^DR/i.test(k)?'D':null;const has=(k,q)=>{const t=R&&typeof R[k]==='string'?' '+N(R[k])+' ':'';return !!t&&t.includes(' '+N(q)+' ');};
 const six=(why,ks)=>{const w=N(why).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++){const r=w.slice(i,i+6).join(' ');if(ks.some(k=>has(k,r)))return r;}return null;};
 const res=(c,why)=>({status:c?'CURED':'UNCURED',why});if(!a||a.ans==='NO ANSWER')return res(false,'no answer to the send-back');
 const AC=/ANSWER CHECK:\s*(.+?)\s*--\s*\[((?:CR|DR)[1-4](?:\s*[;,]\s*(?:CR|DR)[1-4])*)\]\s*--\s*MEANS:\s*["'“‘]([\s\S]*?)["'”’]\s*--\s*ANSWER:\s*["'“‘]([\s\S]*)["'”’]\s*--\s*(MEETS|MISSES|FAILS)\b/i;
 const pieces=s=>String(s).split(/["'”’]\s*;\s*["'“‘]|\.{3}|…/).map(x=>x.trim()).filter(x=>N(x).split(' ').length>=3);
 if(it.rule==='E-ANS'){const f=String(it.line||'').replace(/\\+"/g,'"').match(AC);if(!f)return res(false,'the flagged line is not read as an ANSWER CHECK line');const fs=side(f[2]);const SR=Object.keys(R||{}).filter(k=>side(k)===fs);
  if(a.ans==='KEEP'){const q=six(a.why,SR);return res(!!q,q?'KEEP whose reason quotes the answering side\'s round: "'+q+'"':'KEEP whose reason quotes no 6 words in a row of the answering side\'s rounds');}
  const t=String(a.to||'').replace(/\\+"/g,'"').match(AC);if(!t)return res(false,'the CHANGE TO is not an ANSWER CHECK line');if(N(t[1])!==N(f[1]))return res(false,'the CHANGE TO names another verse ('+t[1]+')');
  if(/^(MISSES|FAILS)$/i.test(t[5]))return res(true,'CHANGE TO grades MISSES');const ks=t[2].split(/\s*[;,]\s*/).map(k=>k.toUpperCase());
  if(ks.some(k=>side(k)!==fs))return res(false,'the CHANGE TO moves the answer to the other side\'s round');const ps=pieces(t[4]);if(!ps.length)return res(false,'the CHANGE TO quotes no answer of 3 or more words');
  const miss=ps.filter(p=>!ks.some(k=>has(k,p)));if(miss.length)return res(false,'the CHANGE TO answer is not found word for word in ['+ks.join('; ')+']: "'+miss[0].slice(0,120)+'"');
  const fa=N(f[4]),ta=N(t[4]);if(ta===fa||fa.includes(ta))return res(false,'the CHANGE TO MEETS quotes the flagged answer again (or a shorter cut of it)');
  return res(true,'CHANGE TO MEETS with a fuller answer found in ['+ks.join('; ')+']');}
 if(it.rule==='E-PREM'){const m=String(it.item||'').match(/against the (defender|challenger)\s+(\d+)/i);if(!m)return res(false,'the item names no premise');const n=+m[2];const fs=/^d/i.test(m[1])?'C':'D'; /* the defender's premise is answered in the defender's rounds (CR) */
  const right=(String(it.reason||'').match(/\(right:\s*([A-Z ]+?)\)/)||[])[1]||null;const SR=Object.keys(R||{}).filter(k=>side(k)===fs);const ALL=Object.keys(R||{}).filter(k=>side(k));
  if(a.ans==='KEEP'){const q=six(a.why,SR);return res(!!q,q?'KEEP whose reason quotes the side\'s round: "'+q+'"':'KEEP whose reason quotes no 6 words in a row of the side\'s rounds');}
  const to=String(a.to||'');let g=null;const P=typeof psGrades==='function'?psGrades(to):null;if(P&&(n in P.g))g=P.g[n];
  if(!g){const z=to.match(new RegExp('\\bpremises?\\s+(?:\\d+\\s*(?:,|and|&)\\s*)*'+n+'\\b[^.;]{0,80}?\\b(VOID|UNEXHIBITED|CONCEDED|COUNTED|SPARED|SUPPORTED|NARROWED|STANDS)\\b','i'));if(z){const k=z[1].toUpperCase();g=k==='VOID'?'VOID':/UNEXHIBITED|CONCEDED|COUNTED/.test(k)?'COUNTED':'SPARED';}}
  if(!g)return res(false,'the CHANGE TO gives premise '+n+' no grade the engine reads');
  {const Q=typeof psGrades==='function'?psGrades(it.line):null;if(P&&Q){const nm=named&&named.size?named:new Set([n]);const known=k=>(k in Q.g)?Q.g[k]:(!Object.keys(Q.g).length&&Q.n===0?'SPARED':null);const out=Object.keys(P.g).map(Number).filter(k=>known(k)!=null&&known(k)!==P.g[k]&&!nm.has(k));
   if(out.length||P.side!==Q.side||(P.n!=null&&Q.n!=null&&Math.abs(P.n-Q.n)>nm.size))return res(false,'the CHANGE TO regrades '+(out.length?'premise'+(out.length>1?'s ':' ')+out.join(', '):'the count or side')+' beyond its items (pkgPS refuses it)');}}const want=right&&/VOID/.test(right)?'VOID':right&&/COUNTED|UNEXHIBITED|CONCEDED/.test(right)?'COUNTED':right?'SPARED':null;
  if(want&&g!==want)return res(false,'the CHANGE TO grades premise '+n+' '+g+', not the enforcer\'s '+want);
  const qs=[...to.matchAll(/["“]([^"”]{8,240})["”]/g)].map(x=>x[1]).filter(q=>N(q).split(' ').length>=3);const miss=qs.filter(q=>!ALL.some(k=>has(k,q)));
  if(miss.length)return res(false,'a quote in the CHANGE TO is not found in any round: "'+miss[0].slice(0,120)+'"');return res(true,'CHANGE TO grades premise '+n+' '+g+(qs.length?', its quotes found in the rounds':''));}
 return res(false,'not an E-ANS or E-PREM item');}
