/* pkgVP1 (W3; WALL-3703 part 2a; md_notes_rulings 459): a judge's own lines must agree. An ANSWER CHECK graded MISSES or FAILS "leaves the witness unanswered"
   (the judges' form, md_notes_rulings 372), and a proven press left unanswered is a BROKEN ground (engine_manual section 8; ruling 392). So a judge that grades the
   answer to a proven press MISSES, while every collision line of the link that press is listed against stays open (UNDERDETERMINED, none graded LINK BROKEN for that
   side), holds two lines that cannot both stand. The verse is tied to its link through the premise list, not through the collision line's own verses: the list that
   closes [DR2] presses the defender, and an entry labelled "LINK k:" presses Dk (an entry with no label ties to no link, as pkgKSC reads it, W3 2671); the
   CHALLENGER'S UNSUPPORTED-L4 PREMISES list that closes [CR3] presses the challenger, entry j against Cj (as pkgD38 reads it). Only a verse the ledger counts as a
   proven press is used (pwList keys). ENFORCED (GATE_STATUS 'ANSWER OPEN'): raised at the gate after the send-back, cured by a change after which it is no longer raised. */
function gateAnsOpen2024(T,R){const out=[];if(!R||typeof R!=='object'||typeof pwList!=='function')return out;const P=rcLines(T);const U=s=>String(s==null?'':s).toUpperCase();const C={};
 const PL=sd=>{if(sd in C)return C[sd];let v=null;try{const a=pwList(R,sd);if(a){const t=String(R[PW_ROUND[sd]]||'');let i=-1;for(const m of t.matchAll(pwHead(sd)))i=m.index;
   const its=i<0?[]:t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
   if(its.length===a.length)v=a.map((p,k)=>{const h=String(its[k]).match(/^\s*\**\s*(?:\d+[.)]\s*)?\**\s*LINK\s+(\d+)\s*:/i);return {keys:p.keys,link:h?+h[1]:(sd==='CHALLENGER'?p.n:null)};});}}catch(e){v=null;}return C[sd]=v;};
 const seen=new Set();
 for(const raw of String(T||'').split('\n')){const l=raw.replace(/[*_`]+/g,'').trim();const a=__acRead(raw);const one=!!(a&&Array.isArray(a.rounds)&&a.rounds.length===1&&a.verse);
  const m=one?[null,String(a.verse),String(a.rounds[0])]:l.match(/^(?:[-\u2022]|\d+[.)])?\s*ANSWER CHECK\s*:\s*(.+?)\s*(?:--|\u2014)\s*\[\s*([CD]R[1-4])\s*\]/i);if(!m)continue;
  const gs=[...l.matchAll(/(?:--|\u2014)\s*(MEETS|MISSES|FAILS)\b/gi)];const g=one?U(a.grade):(gs.length?U(gs[gs.length-1][1]):'');if(g!=='MISSES'&&g!=='FAILS')continue;
  if(one?/^NONE\b/i.test(String(a.means||'').trim()):/(?:--|\u2014)\s*MEANS\s*:\s*NONE\b/i.test(l))continue;
  const ref=m[1].replace(/\s+/g,' ').trim();if(!/^(?:[1-3]\s)?[A-Za-z][A-Za-z ]*\s\d+:\d+$/.test(ref))continue;const rd=U(m[2]);
  const side=rd.charAt(0)==='C'?'DEFENDER':'CHALLENGER'; /* [CRn] is a defender round: the press it answers stands against the defender */
  const L=PL(side);if(!L)continue;let K;try{K=ciKeys(ref);}catch(e){continue;}
  const links=[...new Set(L.filter(p=>p.link!=null&&[...K].some(k=>p.keys.has(k))).map(p=>p.link))];
  for(const n of links){const id=(side==='DEFENDER'?'D':'C')+n;const key='ANSWER OPEN|'+U(ref)+'|'+rd+'|'+id;if(seen.has(key))continue;
   const mine=P.col.filter(z=>{const q=U(z.link).match(/^D(\d+)\s+VS\.?\s+C(\d+)$/);return !!q&&+(side==='DEFENDER'?q[1]:q[2])===n;});
   if(!mine.length||mine.some(z=>z.grade===side+' LINK BROKEN'))continue;const open=mine.filter(z=>z.grade==='UNDERDETERMINED');if(!open.length)continue;seen.add(key);
   out.push({key,why:'your ANSWER CHECK on '+ref+' ['+rd+'] grades the answer '+g+', and an answer that MISSES or FAILS leaves the witness unanswered (md_notes_rulings 372). The list that closes ['+PW_ROUND[side]+'] carries '+ref+' as a proven press against '+(side==='DEFENDER'?'LINK '+n+' ('+id+')':'the challenger\'s premise '+n+' ('+id+')')+', and a proven press left unanswered is a BROKEN ground (ruling 392); yet no '+id+' collision line is graded '+side+' LINK BROKEN: '+open.map(z=>z.link).join(', ')+' '+(open.length>1?'are':'is')+' graded UNDERDETERMINED. Change one of these lines so they agree.',lines:[raw.trim()].concat(open.map(z=>z.raw))});}}
 return out;}
/* pkgVP1: the BROKEN way out of an E-GATE M item. The answer was given and graded MISSES or FAILS, so the judge "may still find that answer MISSES and grade the link
   BROKEN with a FORCED line that quotes it" (the judges' ledger note; ruling 411). The FORCED line is written as the reason of the GATE line, as for a K-G4 item, and
   is added after the collision line only when the CHANGE TO is a collision line of this item's link graded LINK BROKEN for the pressed side, the FORCED line is for
   that pair and that side, and it passes the K-F test (each quotation found in the round it names). It cures nothing by itself: the item is cured as every
   CONTRADICTION item is, by an applied change after which it is no longer raised and no new LIVE item is raised. */
function gateForcedM2024(x,a,ctx){if(!x||x.src!=='E-GATE M'||!a||a.ans!=='CHANGE'||!a.to)return null;const id=String(x.key||'').split('|')[3]||'';const sd=id.charAt(0)==='D'?'DEFENDER':id.charAt(0)==='C'?'CHALLENGER':null;if(!sd)return null;
 const to=String(a.to).replace(/\\+"/g,'"').replace(/[*_`]+/g,'').trim();const lab=sbLabel(to);const q=String(lab||'').match(/^D(\d+) VS C(\d+)$/);if(!q||(sd==='DEFENDER'?'D'+q[1]:'C'+q[2])!==id)return null;
 const c=(rcLines(to).col||[])[0];if(!c||c.grade!==sd+' LINK BROKEN')return null;
 const segs=[a.why].concat(String(a.line||'').split('||')).map(s=>String(s||'').replace(/\\+"/g,'"').replace(/[*_`]+/g,'').trim()).filter(s=>ri4IsF2024(s,/^FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i));
 for(const s of [...new Set(segs)]){const m=s.match(KF_LINE);if(!m||m[1].replace(/\s+vs\.?\s+/i,' VS ').toUpperCase()!==lab)continue;if((/^CR/i.test(m[2])?'CHALLENGER':'DEFENDER')!==sd)continue;
  let K;try{K=kfLines(s,(ctx&&ctx.R)||{}).items.filter(z=>z.rule==='K-F');}catch(e){continue;}if(!K.length)return {line:s,col:gateLineFor2024(x,to)};}
 return null;}
