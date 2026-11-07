// pkgKFF (W1 Wall 2768; W3 ruling Wall 2769: TRIAL, records and answers only, side-neutral): K-FF. A FORCED line's FAILS quotation names what in
// the answer fails (ruling 411: a failure of fit). A FAILS quotation that is only the words of a KJV verse the answer quotes says what the verse
// says, not what in the answer fails. Raised only when (a) every word of the FAILS quotation, normalized as krulNorm does, stands inside one KJV
// verse as the run read it (Cited Verses, kjv_verses); (b) the ANSWER round quotes that verse as a verse quotation (its reference plus quote
// marks, either order) and the FAILS words stand inside that quotation; (c) the FAILS quotation is 4 words or more. A verse the run did not read is
// NOT CHECKED (no item).
const KFF_Q='["“]([^"“”]{6,600})["”]';
function kffPairs(T){const out=[];const t=String(T||'');const R=new RegExp(KKJV_REF.source,'g');let m;
 while((m=R.exec(t))){const ref={book:m[1],ch:+m[2],v1:+m[3],v2:+(m[4]||m[3])};
  const after=new RegExp('^[\\s,:;(\\-–—]{0,6}(?:\\[L\\d\\]\\s*)?'+KFF_Q).exec(t.slice(R.lastIndex,R.lastIndex+700));if(after)out.push({...ref,q:after[1]});
  const before=new RegExp(KFF_Q+'[\\s,.;:]{0,3}[(\\[]?\\s*$').exec(t.slice(Math.max(0,m.index-700),m.index));if(before)out.push({...ref,q:before[1]});}
 return out;}
function kffVerse(p,rows){const parts=[];for(let n=p.v1;n<=p.v2;n++){const x=(rows||[]).find(q=>q&&q.book===p.book&&+q.chapter===p.ch&&+q.verse===n);if(!x)return null;parts.push(x.text);}return parts.join(' ');}
function kffLines(text,R,rows0){const items=[],marks=[],report=[];const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');let rows=rows0||null;
 for(const raw of T.split('\n')){const l=raw.trim();if(!/^(?:[-•]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i.test(l))continue;const m=l.match(KF_LINE);if(!m)continue; /* K-F reports a FORCED line not in the form */
  const id=m[1].replace(/\s+vs\.?\s+/i,' vs ').toUpperCase().replace('VS','vs');const rk=m[4].toUpperCase();const f=krulNorm(m[6]);
  if(f.split(' ').filter(Boolean).length<4)continue; /* (c) */
  const rt=R&&typeof R[rk]==='string'?__kfLB(R[rk]).replace(/[*_`]+/g,''):null;if(!rt)continue;
  const hit=kffPairs(rt).filter(p=>(' '+krulNorm(p.q)+' ').includes(' '+f+' ')); /* (b) */
  if(!hit.length)continue;if(!rows)rows=kkjvRows();let why=null,ref=null;
  for(const p of hit){const r=p.book+' '+p.ch+':'+p.v1+(p.v2!==p.v1?'-'+p.v2:'');const kt=kffVerse(p,rows);
   if(!kt){report.push('NOT CHECKED (the verse was not read this run): '+id+' FAILS "'+m[6].slice(0,120)+'" quoted in ['+rk+'] as '+r);continue;}
   if((' '+krulNorm(kkjvNoMargin(kt))+' ').includes(' '+f+' ')){ref=r;why='its FAILS quotation "'+m[6].slice(0,200)+'" is only the words of '+r+', a verse the answer quotes in ['+rk+']; it shows what the verse says, not what in the answer fails (ruling 411)';break;}} /* (a) */
  if(!why)continue;
  items.push({rule:'K-FF',side:'BOTH',link:id,ref,fails:m[6],why,line:'FORCED line for '+id+': '+why+'. Write the FORCED line again with FAILS: "<the answer\'s own words in ['+rk+'] that fail to show the fit, outside its verse quotations>", or RETRACTED the link with one CORRECTED RESULT, or RESTATED it not graded LINK BROKEN. Your line: '+l.slice(0,600)});
  marks.push('[AUDIT v49: DEBATE RULE VIOLATION (K-FF) -- '+id+': '+why+'. TRIAL rule: answer it in the cure; it removes no seat; not counted in audit_flags.]');}
 return {items,marks,report};}
