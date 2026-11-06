// pkgUND (W3 Wall ruling after 2566; Eric 2026-11-06 "the results seem to have gotten worse"): two ENFORCED send-back items, both side-neutral.
// (1) E-UNG, missing collision grades: a defender link that a premise of the list closing [DR2] presses takes a graded "D<i> vs C<j>" line
//     (DEFENDER LINK BROKEN | CHALLENGER LINK BROKEN | UNDERDETERMINED, or WITHDRAWN). A "D<i>: STANDS" line alone does not grade a pressed link.
// (2) E-HOLD on an UNDERDETERMINED line the enforcer says is BROKEN: sent back ENFORCED. Cured by CHANGE TO RETRACTED, a regrade (a BROKEN
//     regrade with its counted layers, pkgECL), or CHANGE TO the UNDERDETERMINED line with a counted [L1] (the verse words both readings rest on)
//     and what the record leaves open. A KEEP does not cure it. The enforcer never overrules the judge: the judge may keep UNDERDETERMINED by
//     giving its grounds.
// Uses ECL (pkgECL, same library) for the [L1] count: a verse the run did not read is UNVERIFIABLE and counts as given (raises nothing).
const UND=(()=>{
 const rounds=ptext=>{const t=String(ptext||'');const re=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
  const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\n[CLOSE-ROUND',x.e);if(c>=0&&c<end)end=c;const c7=t.indexOf('\n\n[LINK-ROUND FORMAT CHECK',x.e);if(c7>=0&&c7<end)end=c7;out[x.k]=t.slice(x.e,end);});return out;};
 // the premises of the list that closes [DR2] (the list against the defender), numbered as the K-V and K-G readers number them
 function pressed(ptext){const t=rounds(ptext).DR2||'';let i=-1;for(const m of t.matchAll(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi))i=m.index;if(i<0)return [];
  const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
  return its.map((x,k)=>({n:k+1,none:/^\s*\**\s*LINK\s+none/i.test(x),head:x.replace(/\s+/g,' ').trim().slice(0,160)})).filter(x=>!x.none);}
 const GR=/^[\s>*_-]*D(\d+)\s+vs\.?\s+C(\d+)\b[^\n]{0,200}?:\s*\**\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|WITHDRAWN AFTER)/gmi;
 const WD=/^[\s>*_-]*D(\d+)\s*:\s*\**\s*WITHDRAWN\b/gmi;
 function graded(text){const g=new Map();const T=String(text||'');for(const m of T.matchAll(GR))g.set(+m[1],(g.get(+m[1])||[]).concat(m[3].toUpperCase()));for(const m of T.matchAll(WD))g.set(+m[1],['WITHDRAWN']);return g;}
 const ownLine=(text,n)=>{const l=String(text||'').split('\n').find(x=>new RegExp('^[\\s>*_-]*D'+n+'\\s*:').test(x));return l?l.trim():'';};
 // the pressed defender links this judge left without a graded collision line
 function missing(ptext,text){const P=pressed(ptext);if(!P.length)return [];const g=graded(text);return P.filter(p=>!g.has(p.n)).map(p=>({n:p.n,premise:p.head,line:ownLine(text,p.n)}));}
 const OPEN=/\b(?:leaves?\s+(?:\w+\s+){0,3}open|left\s+open|open\s+(?:question|point|whether)|(?:does|do|did)\s+not\s+(?:decide|settle|determine|say|state|show|fix)|neither\s+(?:reading|side|one)|both\s+readings|either\s+reading|consistent\s+with\s+both|agrees?\s+with\s+both|fits?\s+both|undecided|silent\s+(?:on|about|as\s+to)|not\s+stated)\b/i;
 // an UNDERDETERMINED line that gives its grounds: a counted [L1] and what the record leaves open
 function undOk(line,ctx){const L=String(line||'').replace(/\\+"/g,'"');const f=[];
  const c=ECL.check('FORCED: X -- GROUND: '+L,ctx);if(c.l1==='NONE')f.push('no [L1]: no verse is quoted with its reference under an [L1] tag');else if(c.l1==='NOT COUNTED')f.push('no counted [L1] (the quoted words do not stand in the verse named)');
  if(!OPEN.test(L))f.push('the line does not state what the record leaves open (for example: "the record leaves open whether ...", "both readings agree with ...")');
  return {ok:!f.length,l1:c.l1,faults:f,why:f.length?f.join(' | '):'[L1] '+c.l1+'; states what the record leaves open'};}
 const isUndBroken=x=>x&&x.rule==='E-HOLD'&&/UNDERDETERMINED/.test(String(x.flagged_line||x.line||''))&&/\(right:\s*BROKEN\)/i.test(String(x.cure_reason||x.reason||''));
 const CURE_UNG=n=>'MISSING COLLISION GRADE (E-UNG, ENFORCED, pkgUND): the challenger presses D'+n+' in the list that closes [DR2], and your COLLISION POINTS has no graded D'+n+' vs C<j> line. A "D'+n+': STANDS" line does not grade a pressed link. CHANGE TO the graded line: D'+n+' vs C<j> (<verse>): DEFENDER LINK BROKEN | CHALLENGER LINK BROKEN | UNDERDETERMINED -- <one clause of why> -- GROUND: <a BROKEN grade in its layers (Commitment 13); an UNDERDETERMINED grade with [L1] <reference> "<the KJV words both readings rest on>" and what the record leaves open>. Any grade may be chosen; the grade is yours. A KEEP does not cure this item.';
 const CURE_UND='UNDERDETERMINED GIVES ITS GROUNDS (E-HOLD on UNDERDETERMINED, ENFORCED, pkgUND): the enforcer reads this line as BROKEN; the decision stays yours. Either regrade it (CHANGE TO the BROKEN line in its counted layers, Commitment 13, or a STANDS line that quotes the answer\'s positive fit, [CR<n>] "<the answer\'s words>", with [L1] <reference> "<KJV words>"), or CHANGE TO: RETRACTED, or keep UNDERDETERMINED by CHANGE TO the same line with, after GROUND:, [L1] <reference> "<the KJV words both readings rest on>" and what the record leaves open (for example: "the record leaves open whether ..."). A KEEP does not cure this item.';
 const FIT=/\[(?:CR|DR)[1-4]\][^"“\n]{0,60}["“][^"”]{6,}["”]|\bANSWER\b[^"“\n]{0,40}["“][^"”]{6,}["”]/;
 const GRADED1=n=>new RegExp('\\bD'+n+'\\s+vs\\.?\\s+C\\d+\\b[^\\n]{0,200}?:\\s*\\**\\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|WITHDRAWN AFTER)','i');
 // the cure of one item from the judge's send-back answer a = {ans:'KEEP'|'CHANGE'|'NO ANSWER', to}
 function cure(it,a,ctx){const res=(c,why)=>({status:c?'CURED':'UNCURED',why});a=a||{ans:'NO ANSWER'};const to=String(a.to||'').replace(/\\+"/g,'"').trim();
  if(a.ans!=='CHANGE')return res(false,(a.ans==='KEEP'?'a KEEP does not cure this item':'no answer')+' (pkgUND)');
  if(/^\s*RETRACTED\b/i.test(to))return res(it.rule!=='E-UNG','CHANGE TO RETRACTED'+(it.rule==='E-UNG'?' does not grade a pressed link':''));
  if(it.rule==='E-UNG'){const n=+(String(it.item||'').match(/\bD(\d+)\b/)||[])[1];const m=to.match(GRADED1(n));if(!m)return res(false,'the CHANGE TO has no graded D'+n+' vs C<j> line');
   const gr=m[1].toUpperCase();if(/BROKEN/.test(gr)){const c=ECL.check(to,ctx);return res(!c.faults.length,'graded '+gr+(c.faults.length?'; the layer check fails: '+c.why:'; '+c.why));}
   if(gr==='UNDERDETERMINED'){const u=undOk(to,ctx);return res(u.ok,'graded UNDERDETERMINED; '+u.why);}return res(true,'graded '+gr);}
  // E-HOLD on an UNDERDETERMINED line
  if(/\bUNDERDETERMINED\b/.test(to)){const u=undOk(to,ctx);return res(u.ok,'kept UNDERDETERMINED; '+u.why);}
  if(/\bLINK BROKEN\b/.test(to)||/^\s*FORCED\b/i.test(to)){const c=ECL.check(to,ctx);return res(!c.faults.length,'regraded BROKEN; '+c.why);}
  if(/\b(?:STANDS|MEETS)\b/.test(to)){const c=ECL.check('FORCED: X -- GROUND: '+to,ctx);const fit=FIT.test(to); /* W3: a STANDS or MEETS regrade quotes the answer's positive fit with a counted [L1] */
   const f=[];if(c.l1==='NONE')f.push('no [L1]');else if(c.l1==='NOT COUNTED')f.push('no counted [L1]');if(!fit)f.push('no quote of the answer\'s fit (the answer\'s own words with its round, e.g. [CR3] "<words>")');
   return res(!f.length,'regraded '+(/\bMEETS\b/.test(to)?'MEETS':'STANDS')+(f.length?'; '+f.join(' | '):'; [L1] '+c.l1+', quotes the answer\'s fit'));}
  return res(false,'the CHANGE TO neither regrades the line, retracts it, nor keeps UNDERDETERMINED with its grounds');}
 return {rounds,pressed,graded,missing,undOk,isUndBroken,cure,CURE_UNG,CURE_UND};})();
