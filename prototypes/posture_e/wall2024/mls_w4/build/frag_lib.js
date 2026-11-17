 /* pkgMLS (ASK 351, Wall 7430; reviews W1 7432, W3 7433, W2 7434): K-ML the MEANS-layer check and K-SU the SENTENCE check. TRIAL and list only: an item asks the judge and records the reply; it accepts no withdrawal, moves no count and removes no seat. */
const MLS_NEG=['not','no','nor','neither','none','nothing','nought','naught','never'];
const MLS_PH=['at all','in any wise','in any way','in no way','by no means','of any kind','at any time','nothing but','whatsoever','only','alone','solely','merely','exclusively','ever','always','all','every','any','entirely','wholly','completely','fully','absolutely','utterly','altogether','save','for ever','from then on','after that','forever','perpetually','permanently','continually','henceforth','thereafter','afterward','afterwards','never'].sort((a,b)=>b.split(' ').length-a.split(' ').length||b.length-a.length);
function mlsNoMargin(s){return String(s==null?'':s).replace(/\[[^\]]*:[^\]]*\]/g,' ');}
function mlsFold(s){return ' '+mlsNoMargin(s).toLowerCase().replace(/n['’]t\b/g,' not').replace(/\bcannot\b/g,'can not').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim()+' ';}
function mlsIdx(rows){const I={};(rows||[]).forEach(r=>{if(r&&r.book&&r.chapter!=null&&r.verse!=null)I[r.book+'|'+r.chapter+'|'+r.verse]=String(r.text||'');});return I;}
function mlsEnd(t){return mlsNoMargin(t).trim().slice(-1);}
function mlsUnit(I,b,c,v1,v2){for(let v=v1;v<=v2;v++)if(I[b+'|'+c+'|'+v]==null)return {ok:false,miss:b+' '+c+':'+v};let a=v1,z=v2;
 for(let k=0;k<3;k++){const p=I[b+'|'+c+'|'+(a-1)];if(p==null||!/[:;,]/.test(mlsEnd(p)))break;a--;}
 for(let k=0;k<3;k++){if(/[.?!]/.test(mlsEnd(I[b+'|'+c+'|'+z])))break;if(I[b+'|'+c+'|'+(z+1)]==null)break;z++;}
 const vs=[];for(let v=a;v<=z;v++)vs.push(mlsNoMargin(I[b+'|'+c+'|'+v]).replace(/\s+/g,' ').trim());return {ok:true,b,c,a,z,v1,v2,text:vs.join(' '),ref:b+' '+c+':'+a+(z!==a?'-'+z:'')};}
function mlsAdded(means,unit){let M=mlsFold(means);const U=mlsFold(unit);const out=[];
 for(const p of MLS_PH){const k=' '+p+' ';if(!M.includes(k))continue;if(!U.includes(k))out.push(p);M=M.split(k).join(' | ');}
 const ng=MLS_NEG.filter(w=>M.includes(' '+w+' '));if(ng.length&&!MLS_NEG.some(w=>U.includes(' '+w+' ')))out.push(ng[0]);return out;}
const MLS_REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?/;
function mlsRef(s){const m=String(s||'').match(MLS_REF);return m?{b:m[1],c:+m[2],v1:+m[3],v2:+(m[4]||m[3])}:null;}
function mlsGround(l){const g=(String(l).match(/\bGROUND\s*:([\s\S]*)$/i)||[])[1];if(g){const m=g.match(new RegExp('\\[L1\\]\\s*'+MLS_REF.source));if(m)return {b:m[1],c:+m[2],v1:+m[3],v2:+(m[4]||m[3])};}
 const h=String(l).match(/^\s*(?:[-•]|\d+[.)])?\s*D\d+\s+vs\.?\s+C\d+\s*\(([^)]*)\)/i);return h?mlsRef(h[1]):null;}
function mlsBlock(round,q){const f=mlsFold(q).trim();if(!f)return null;const key=' '+f.split(' ').slice(0,6).join(' ')+' ';const L=String(round||'').split('\n');
 for(let i=0;i<L.length;i++){if(!mlsFold(L[i]).includes(key))continue;const out=[L[i]];
  for(let j=i+1;j<L.length&&j<i+8;j++){const l=L[j];if(!l.trim()||/^\s*(?:\d+[.)]\s|MEANS\b|LINK\s+\d|(?:[1-3] )?[A-Z][a-z]+ \d{1,3}:\d{1,3}\s*["“])/.test(l))break;out.push(l);}
  return out.join('\n').slice(0,1500);}return null;}
function mlsCarried(p,block,I){const B=String(block||'');const k=' '+p+' ';const neg=MLS_NEG.includes(p);const has=t=>neg?MLS_NEG.some(w=>mlsFold(t).includes(' '+w+' ')):mlsFold(t).includes(k);const nc=[];
 for(const m of B.matchAll(/\[L2\]([^\[|]*)/g))if(has(m[1]))return {carried:true,by:'[L2]'+m[1].trim().slice(0,80)};
 for(const m of B.matchAll(new RegExp('\\[L3\\]\\s*:?\\s*'+MLS_REF.source,'g'))){const b=m[1],c=+m[2],a=+m[3],z=+(m[4]||m[3]);const ref=b+' '+c+':'+a+(z!==a?'-'+z:'');const vs=[];let miss=false;
  for(let v=a;v<=z;v++){const t=I[b+'|'+c+'|'+v];if(t==null){miss=true;break;}vs.push(t);}if(miss){nc.push(ref);continue;}if(has(vs.join(' ')))return {carried:true,by:'[L3] '+ref};}
 return {carried:false,nc};}
function mlsNames(text,U,I){const T=String(text||'');const others=[];for(let v=U.a;v<=U.z;v++)if(v<U.v1||v>U.v2)others.push(v);if(!others.length)return false;
 const A=new RegExp(MLS_REF.source,'g');let m;while((m=A.exec(T))){if(m[1]!==U.b||+m[2]!==U.c)continue;const a=+m[3],z=+(m[4]||m[3]);if(others.some(v=>v>=a&&v<=z))return true;}
 const F=mlsFold(T);for(const v of others){const w=mlsFold(I[U.b+'|'+U.c+'|'+v]).trim().split(' ');for(let i=0;i+6<=w.length;i++)if(F.includes(' '+w.slice(i,i+6).join(' ')+' '))return true;}return false;} /* six running words, the house quote length; four words matched "the son of god" (replay judgment 1194) */
function mlsLines2024(text,R,ROWS){const items=[],marks=[];const T=String(kkjvText(text)||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');if(!T.trim()||!R||!(ROWS&&ROWS.length))return {items,marks};const I=mlsIdx(ROWS);const seen=new Set();
 const nc=(id,why)=>{const k='NC|'+id+'|'+why;if(seen.has(k))return;seen.add(k);marks.push('[AUDIT v35: MEANS AND SENTENCE CHECK NOT CHECKED (K-ML, K-SU; TRIAL, list only) -- '+id+': '+why+']');};
 for(const raw of T.split('\n')){const l=raw.trim();const fm=(typeof KF_LINE!=='undefined')?l.match(KF_LINE):null;const bm=fm?null:l.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\s+vs\.?\s+C(\d+)\b/i);
  if(!fm&&!(bm&&/LINK\s+BROKEN/.test(l)))continue;const id=fm?fm[1].replace(/\s+vs\.?\s+/i,' vs ').toUpperCase().replace('VS','vs'):'D'+bm[1]+' vs C'+bm[2];
  const g=mlsGround(l);if(!g){nc(id,'no GROUND [L1] verse');continue;}const gref=g.b+' '+g.c+':'+g.v1+(g.v2!==g.v1?'-'+g.v2:'');const U=mlsUnit(I,g.b,g.c,g.v1,g.v2);if(!U.ok){nc(id,'the verse '+U.miss+' was not read this run');continue;}
  if(fm){const rk=fm[2].toUpperCase(),q=fm[3];const add=mlsAdded(q,U.text);if(add.length){const blk=typeof R[rk]==='string'?mlsBlock(R[rk],q):null;
    if(!blk)nc(id,'the MEANS quotation was not found in ['+rk+']');else{const left=[];const ncs=[];for(const p of add){const c=mlsCarried(p,blk,I);if(!c.carried){if(c.nc&&c.nc.length)ncs.push(p+' (the [L3] '+c.nc.join(', ')+' was not read this run)');else left.push(p);}}
     ncs.forEach(x=>nc(id,'"'+x));
     const k='ML|'+id+'|'+rk+'|'+mlsFold(q);if(left.length&&!seen.has(k)){seen.add(k);const qa=left.map(p=>'"'+p+'"').join(', ');
      items.push({rule:'K-ML',side:'JUDGE',link:'MEANS LAYER '+id,pair:id,ref:U.ref,add:left,mround:rk,q:q.slice(0,400),line:'['+gref+'] your FORCED line '+id+' takes the MEANS ['+rk+'] "'+q.slice(0,400)+'", which adds '+qa+'. The sentence, '+U.ref+', reads "'+U.text.slice(0,900)+'". No layer in that side\'s block of ['+rk+'] carries '+qa+'. A meaning without its layers is a bare claim and carries no weight. Grade the link on the verse\'s own words, or quote the layer that carries the words.'});
      marks.push('[AUDIT v35: MEANS ADDS WORDS NO LAYER CARRIES (K-ML; TRIAL, list only) -- '+id+' -- ['+rk+'] adds '+qa+' to '+U.ref+']');}}}}
  const ak=fm?fm[4].toUpperCase():((l.match(/\banswer\s*\[([CD]R\d)\]/i)||[])[1]||'').toUpperCase();
  if(ak&&(U.a<U.v1||U.z>U.v2)&&typeof R[ak]==='string'&&!mlsNames(l,U,I)&&mlsNames(R[ak],U,I)){const k='SU|'+id+'|'+U.ref;if(!seen.has(k)){seen.add(k);
   const how=U.a<U.v1?'begins in '+U.b+' '+U.c+':'+U.a+(U.v1-1>U.a?'-'+(U.v1-1):''):'runs on into '+U.b+' '+U.c+':'+(U.v2+1)+(U.z>U.v2+1?'-'+U.z:'');
   const ov=[];for(let v=U.a;v<=U.z;v++)if(v<U.v1||v>U.v2)ov.push(v);
   items.push({rule:'K-SU',side:'JUDGE',link:'SENTENCE '+id,pair:id,ref:U.ref,around:ak,oref:ov.map(v=>U.b+' '+U.c+':'+v).concat([U.ref]),otext:ov.map(v=>mlsNoMargin(I[U.b+'|'+U.c+'|'+v]).replace(/\s+/g,' ').trim()),line:'['+gref+'] completes a sentence that '+how+'. The sentence, '+U.ref+', reads "'+U.text.slice(0,900)+'". The answer ['+ak+'] reads them together. Grade the link '+id+' on the whole sentence.'});
   marks.push('[AUDIT v35: VERSE READ APART FROM ITS SENTENCE (K-SU; TRIAL, list only) -- '+id+' -- '+gref+' within '+U.ref+']');}}}
 return {items,marks};}
