// ======== WALL-2024 Commitment 12 (K-KJV, TRIAL; W3 kjv_only_draft.md, approved for offline build 2026-11-05 20:29 CST; rulings WALL-2024 2172) ========
// A judge's own verse quote ("Book C:V" followed at once by a quoted span) is compared with that verse as this run read it (Cited Verses).
// Case, punctuation, the KJV's [italics] and its margin notes do not count. A verse the run did not read is listed NOT CHECKED, never an item.
function kkjvRows(){try{const g=(typeof $==='function')?$:null;return g?g('Cited Verses').all().map(i=>i.json).filter(r=>r&&r.book):[];}catch(e){return [];}}
function kkjvFold(s){return String(s==null?'':s).toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();}
// margin notes, both forms: [key: or, ...] and (key: Gr. ...) (2172 rule 1)
function kkjvNoMargin(s){return String(s||'').replace(/\[[^\]]*:[^\]]*\]/g,' ').replace(/\([^)]*:\s*(?:Gr\.|Heb\.|or,|that is)[^)]*\)/g,' ');}
function kkjvUnGloss(s,cited){const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';return String(s||'').replace(/\[([^\]]*)\]|\(([^)]*)\)/g,(all,a,b)=>{const inner=kkjvFold(a!==undefined?a:b);return inner&&cv.includes(' '+inner+' ')?' '+inner+' ':' ';});}
// text after a trailing ellipsis that is not in the verse is an engine cut and is dropped (2172 rule 2)
function kkjvSegs(q,cited){let p=String(kkjvNoMargin(q)).split(/\.\.\.|…/);const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';
 if(p.length>1){const last=kkjvFold(kkjvUnGloss(p[p.length-1],cited));if(last&&!cv.includes(' '+last+' '))p=p.slice(0,-1);}return p.map(x=>kkjvFold(kkjvUnGloss(x,cited))).filter(Boolean);}
// a quote is a verse quote only when at least half its words are in the verse; otherwise it quotes something else, such as a round (2172 rule 3)
function kkjvIsVerseQuote(q,cited){const vw=new Set(kkjvFold(kkjvNoMargin(cited)).split(' '));const qw=kkjvSegs(q,cited).join(' ').split(' ').filter(Boolean);return qw.length>0&&qw.filter(w=>vw.has(w)).length/qw.length>=0.5;}
function kkjvStands(q,cited){if(!cited)return false;const segs=kkjvSegs(q,cited);if(!segs.length)return false;
 const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';let at=0;for(const g of segs){const k=cv.indexOf(' '+g+' ',at);if(k<0)return false;at=k+g.length+1;}return true;}
function kkjvText(text){let T=String(text||'');const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const J=JSON.parse(s.slice(0,i+1));if(J&&typeof J.reasoning==='string')T=J.reasoning;}catch(e){}}return T.replace(/\n\n\[AUDIT v[\s\S]*$/,'');}
const KKJV_REF=/\b((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?\b/g;
const KKJV_Q=/^[\s,:;(\-–—]{0,6}(?:\[L1\]\s*)?["“]([^"“”]{6,400})["”]/;
const KKJV_VER=/\b(RSV|NRSV|NIV|ESV|NASB|NKJV|NLT|Septuagint|LXX)\b/;
function kkjvPairs(T){const out=[];const A=new RegExp(KKJV_REF.source,'g');let m;
 while((m=A.exec(T))){const q=KKJV_Q.exec(T.slice(A.lastIndex,A.lastIndex+500));if(q&&kkjvFold(q[1]).split(' ').filter(Boolean).length>=3)out.push({book:m[1],ch:+m[2],v1:+m[3],v2:+(m[4]||m[3]),q:q[1]});}
 return out;}
// {items, marks, report}: an item for each verse quote that does not stand in its verse; the report lists NOT CHECKED quotes, non-verse quotes and other-version names.
function kkjvLines2024(text,ROWS){const items=[],marks=[],report=[];const T=kkjvText(text);if(!T.trim())return {items,marks,report,not_checked:0};
 const idx={};(ROWS||[]).forEach(r=>{idx[r.book+'|'+r.chapter+'|'+r.verse]=r.text;});let nc=0;
 for(const p of kkjvPairs(T)){const ref=p.book+' '+p.ch+':'+p.v1+(p.v2!==p.v1?'-'+p.v2:'');const parts=[];for(let v=p.v1;v<=p.v2;v++){const t=idx[p.book+'|'+p.ch+'|'+v];if(t)parts.push(t);}
  if(parts.length!==p.v2-p.v1+1){nc++;report.push('NOT CHECKED (the verse was not read this run): '+ref+' "'+p.q.slice(0,120)+'"');continue;}
  const kjv=parts.join(' ');if(!kkjvIsVerseQuote(p.q,kjv)){report.push('NOT A VERSE QUOTE (fewer than half its words are in '+ref+'): "'+p.q.slice(0,120)+'"');continue;}
  if(kkjvStands(p.q,kjv))continue;if(items.some(x=>x.ref===ref&&x.q===p.q))continue;
  const kt=kkjvNoMargin(kjv).replace(/\s+/g,' ').trim();
  items.push({rule:'K-KJV',side:'JUDGE',link:'KJV QUOTE '+ref,ref,q:p.q,kjv:kt,line:'['+ref+'] your quote "'+p.q+'" is not in the words of the 1611 KJV. The KJV reads: "'+kt+'". Quote the KJV words, or withdraw the ruling that rests on your wording (Commitment 12).'});
  marks.push('[AUDIT v33: QUOTE NOT IN THE KJV (K-KJV; Commitment 12; TRIAL) -- '+ref+' -- quoted "'+p.q.slice(0,160)+'"]');}
 T.split('\n').forEach(l=>{if(KKJV_VER.test(l))report.push('OTHER VERSION NAMED (listed only): '+l.trim().slice(0,200));});
 return {items,marks,report,not_checked:nc};}
// cure verdict: CURED when the reply quotes six consecutive words of the KJV verse (all of it if shorter), or withdraws the ruling naming the reference.
function kkjvCure(x,reply){if(!x||x.rule!=='K-KJV')return null;const R=String(reply||'');const ref=String(x.ref||'');
 const w=kkjvFold(x.kjv).split(' ').filter(Boolean);const F=' '+kkjvFold(R)+' ';const n=Math.min(6,w.length);let six=false;
 for(let i=0;n&&i+n<=w.length&&!six;i++)if(F.includes(' '+w.slice(i,i+n).join(' ')+' '))six=true;
 const wd=!!ref&&R.split('\n').some(l=>/\bWITHDRAW(N)?\b/i.test(l)&&l.includes(ref));
 if(six)return {st:'CURED',why:'TRIAL rule (Commitment 12): the reply quotes the KJV words of '+ref,line:null};
 if(wd)return {st:'CURED',why:'TRIAL rule (Commitment 12): the reply withdraws the ruling on '+ref,line:null};
 return {st:'UNCURED',why:'TRIAL rule (recorded and answered; it removes no seat): the reply neither quotes the KJV words of '+ref+' nor withdraws the ruling',line:null};}
