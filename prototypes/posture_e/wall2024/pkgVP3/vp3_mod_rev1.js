/* pkgVP3 (W4; P3 of Wall 3708 as changed by 3711; operator ruling 15:11 CST 11-09, md_notes_rulings 459). TRIAL, RECORD-ONLY: removes no seat.
   Two readers: a DeepSeek DISAGREE on an E-ANS item (right: MISSES) or an E-HOLD item (right: BROKEN) counts only when the code check finds the same
   fault on the same witness: the answering side's answer to that verse, read from its round, holds no [Ln] layer of its own and is only a grant
   ("I grant ...") and/or a deferral to another link or round ("I answer it fully under LINK 4"). Where both agree, a reply that keeps the grade
   (KEEP, no answer, CHANGE TO still MEETS, or still UNDERDETERMINED/STANDS) is listed as "TRIAL pkgVP3: WOULD REMOVE <seat>"; nothing is counted. */
function vp3Answers2024(T,verse){const L=String(T||'').split('\n');const out=[];if(!verse)return out;
 const vr=verse.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const head=new RegExp('^\\s*(?:[-*•]|\\d+[.)])?\\s*(?:\\*\\*)?\\s*(?:ANSWER\\s*:?\\s*)?'+vr+'(?![0-9])','i');const ansHead=new RegExp('\\bANSWER\\s*:?\\s*["“]?'+vr+'(?![0-9])','i');const bolded=new RegExp('^\\s*(?:[-*\u2022]|\\d+[.)])\\s.*\\*\\*'+vr+'(?![0-9])[^*]{0,3}\\*\\*');
 const top=l=>/^(?:[-*•]|\d+[.)])\s/.test(l)||/^#|^\*\*[^*]+\*\*\s*$/.test(l.trim());const isLay=l=>/^\s*[-*•]\s*\[L[1-4]\]/.test(l);
 for(let k=0;k<L.length;k++){const l=L[k];const hd=head.test(l.replace(/\*\*/g,''))||ansHead.test(l);
  const bold=!hd&&bolded.test(l)&&!/^\s*(?:[-*•]|\d+[.)])\s*(?:\*\*)?\s*\[L[1-4]/.test(l); /* a bullet labelled by several verses in bold: the whole line is the answer */if(!hd&&!bold)continue;if(/--\s*MEANS\s*:/i.test(l))continue; /* a PRESSED WITH line is the side's own press, not an answer */
  let b=k;while(b+1<L.length){const n=L[b+1];if(!n.trim())break;if(isLay(n)||/^\s{2,}\S/.test(n)||!top(n)){b++;continue;}break;}
  let first=l.replace(/\*\*/g,'');const at=first.search(new RegExp(vr+'(?![0-9])','i'));let rest=at>=0?first.slice(at+verse.length):first;
  if(bold)rest=first.replace(/^\s*(?:[-*•]|\d+[.)])\s*/,'');
  else rest=rest.replace(/^\s*:?\s*,?\s*(?:["“][^"”]*["”]|'[^']*')\s*/,'').replace(/^\s*(?::|--|—|-|\.)\s*/,'').replace(/^ANSWER\s*:\s*/i,'');
  out.push({at:k,text:[rest,...L.slice(k+1,b+1)].join('\n').trim()});}
 return out;}
function vp3Bare2024(ans){const t=String(ans||'').trim();if(!t)return {bare:false,why:'empty answer'};
 if(/\[L[1-4]\]/.test(t))return {bare:false,why:'the answer carries its own layer '+(t.match(/\[L[1-4]\]/)||[''])[0]};
 const words=t.replace(/[^A-Za-z0-9]+/g,' ').trim().split(' ').filter(Boolean).length;if(words>60)return {bare:false,why:'the answer runs '+words+' words'};
 const S=t.replace(/["“][^"”]*["”]/g,q=>q.replace(/[.!?]/g,' ')).split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(s=>/[A-Za-z]/.test(s));if(!S.length)return {bare:false,why:'no sentence'};
 const GR=/^(?:I\s+(?:grant|concede|accept|allow)\b|granted\b|conceded\b)/i;const FITW=/\b(?:so|because|for|but|yet|therefore|thus|hence|since|which\s+(?:shows|fits|means)|this\s+(?:supports|fits|shows))\b/i;
 const DF=/\b(?:under|in|at|see)\s+(?:LINK|Link)\s*\d|\b(?:under|in|see)\s+\[?[CD]R[1-4]\]?|\banswer(?:ed)?\s+(?:it|this|that)?\s*(?:fully|in\s+full|below|above|later|there)\b|\bsee\s+(?:above|below)\b/i;
 const kinds=[];for(const s of S){const w=s.replace(/[^A-Za-z0-9]+/g,' ').trim().split(' ').length;
  if(GR.test(s)&&!FITW.test(s.replace(/^I\s+\w+\s+/i,'')))kinds.push('grant');else if(DF.test(s)&&w<=15)kinds.push('deferral');else return {bare:false,why:'a sentence is neither a grant nor a deferral: "'+s.slice(0,120)+'"'};}
 return {bare:true,why:'no layer of its own; only '+[...new Set(kinds)].join(' and ')+': "'+t.slice(0,200).replace(/\n/g,' ')+'"'};}
/* the code half on one witness: every answer the side gives to the verse in the round(s) read is bare */
function vp3Code2024(R,rounds,verse){if(!R)return {ok:false,why:'no rounds found'};const found=[];
 for(const rd of rounds){for(const a of vp3Answers2024(R[rd],verse))found.push({rd,...a,t:vp3Bare2024(a.text)});}
 if(!found.length)return {ok:false,why:'no answer to '+verse+' found in ['+rounds.join('], [')+']'};
 const nb=found.find(f=>!f.t.bare);if(nb)return {ok:false,why:'['+nb.rd+'] answer to '+verse+': '+nb.t.why};
 return {ok:true,why:found.map(f=>'['+f.rd+'] '+verse+': '+f.t.why).join('; ')};}
function vp3Trial2024(it,a,R){const rule=it&&it.rule;const rs=String(it&&it.reason||'');
 const ds=rule==='E-ANS'?rs.match(/\(right:\s*MISSES\)\s*:?\s*([\s\S]*?)(?:\s*\(judge wrote|$)/i):rule==='E-HOLD'?rs.match(/\(right:\s*BROKEN\)\s*:?\s*([\s\S]*?)(?:\s*\(judge wrote|$)/i):null;
 if(!ds)return null;const why=ds[1];let code;
 if(rule==='E-ANS'){const m=String(it.item||'').match(/ANSWER CHECK\s+(.+?)\s*\[((?:CR|DR)[1-4])\]/);if(!m)return {agree:false,note:'TRIAL pkgVP3: NOT CHECKED -- the item names no verse and round'};code=vp3Code2024(R,[m[2]],m[1].trim());code.verse=m[1].trim();}
 else{const ln=String(it.line||'').replace(/\\+"/g,'"');const pm=ln.match(/^\s*(?:FORCED\s*:\s*)?D\d+\s+vs\s+C\d+\s*\(([^)]*)\)/i);if(!pm)return {agree:false,note:'TRIAL pkgVP3: NOT CHECKED -- the line names no collision witnesses'};
  const ws=pm[1].split(/\s*;\s*/).map(x=>x.trim()).filter(Boolean);const named=ws.filter(v=>new RegExp(v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![0-9])','i').test(why));
  if(!named.length)return {agree:false,note:'TRIAL pkgVP3: NOT CHECKED -- the DeepSeek reason names none of the collision witnesses'};
  const sd=/\bdefender/i.test(why)&&!/\bchallenger/i.test(why)?'CR':/\bchallenger/i.test(why)&&!/\bdefender/i.test(why)?'DR':(why.match(/\b(CR|DR)[1-4]\b/)||[])[1]||null;
  if(!sd)return {agree:false,note:'TRIAL pkgVP3: NOT CHECKED -- the DeepSeek reason names no side'};
  const rn=[...new Set([...why.matchAll(new RegExp('\\b'+sd+'([1-4])\\b','g'))].map(x=>sd+x[1]))];const rounds=rn.length?rn:[1,2,3,4].map(n=>sd+n).filter(k=>R&&R[k]);
  code=null;for(const v of named){const c=vp3Code2024(R,rounds,v);if(c.ok){code={...c,verse:v};break;}code=code||{...c,verse:v};}code.side=sd;}
 if(!code.ok)return {agree:false,note:'TRIAL pkgVP3: code check does not agree, not an item -- '+code.why};
 const ans=a&&a.ans?a.ans:'NO ANSWER';const to=String(a&&a.to||'').replace(/\\+"/g,'"');let cured=false;
 if(ans==='CHANGE'){if(/^\s*(?:RETRACTED|WITHDRAWN)\b/i.test(to))cured=true;
  else if(rule==='E-ANS')cured=/--\s*(?:MISSES|FAILS)\b/i.test(to);
  else{const g=to.match(/\)\s*:\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|WITHDRAWN)\b/i);const want=code.side==='CR'?'DEFENDER LINK BROKEN':'CHALLENGER LINK BROKEN';cured=/^\s*FORCED\b/i.test(to)||!!(g&&(g[1].toUpperCase()===want||g[1].toUpperCase()==='WITHDRAWN'));}}
 return {agree:true,cured,note:'TRIAL pkgVP3: TWO READERS AGREE on '+code.verse+' ('+code.why.slice(0,300)+') -- '+(cured?'CURED by the reply ('+ans+')':'WOULD REMOVE '+'%SEAT%'+': the reply ('+ans+(ans==='CHANGE'?' TO a line that still grades '+(rule==='E-ANS'?'MEETS':'the link as held'):'')+') keeps the grade')+'; record-only, no seat removed'};}
