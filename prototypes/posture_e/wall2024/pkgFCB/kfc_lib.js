// pkgFCB (W3 feedback ruling B7; W3 rulings 00:05Z 11-07: TRIAL for one run, checked against the whole KJV verse): K-FC. A FORCED line carries
// CARRIED BY: "<the words of the pressed witness's own verse that state its MEANS>", and those words stand in that verse as the run read it
// (Cited Verses). The press's verse is the reference its MEANS line carries in the round the FORCED line names. Side-neutral: every FORCED line.
// A verse the run did not read, or a press whose reference is not found, is NOT CHECKED (no item) when CARRIED BY is written.
const KFC_REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?)\.? (\d{1,3}):(\d{1,3})(?:\s?[-–]\s?(\d{1,3}))?/g;
const KFC_CB=/(?:--|—|–)\s*CARRIED\s+BY\s*:\s*["“]([^"”]{3,}?)["”]/i;
function kfcVerse(means,rt){const refs=s=>[...String(s||'').matchAll(new RegExp(KFC_REF.source,'g'))];
 const head=refs(means).find(z=>z.index<=3);let r=head||null; /* a MEANS quotation that opens with its press's reference */
 if(!r&&typeof rt==='string'){const fm=kkjvFold(means).split(' ').slice(0,12).join(' ');
  const line=fm?__kfLB(rt).replace(/[*_`]+/g,'').split('\n').find(x=>kkjvFold(x).includes(fm)):null;
  if(line){const mi=line.search(/MEANS\s*:/i);const all=refs(line);r=(mi>=0?all.filter(z=>z.index<mi).pop():null)||all[0]||null;}}
 if(!r)return null;return {ref:r[0].replace(/\.\s/,' '),book:r[1],ch:+r[2],v1:+r[3],v2:+(r[4]||r[3])};}
function kfcText(v,rows){if(!v)return null;const parts=[];for(let n=v.v1;n<=v.v2;n++){const x=(rows||[]).find(q=>q&&q.book===v.book&&+q.chapter===v.ch&&+q.verse===n);if(!x)return null;parts.push(x.text);}return parts.join(' ');}
function kfcLines(text,R,rows0){const items=[],marks=[],report=[];const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');let rows=rows0||null;
 for(const raw of T.split('\n')){const l=raw.trim();if(!/^(?:[-•]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i.test(l))continue;const m=l.match(KF_LINE);if(!m)continue; /* K-F reports a FORCED line not in the form */
  const id=m[1].replace(/\s+vs\.?\s+/i,' vs ').toUpperCase().replace('VS','vs');const rk=m[2].toUpperCase();const v=kfcVerse(m[3],R&&R[rk]);const cb=l.match(KFC_CB);let why=null;
  if(!cb)why='the FORCED line has no CARRIED BY: "<the words of '+(v?v.ref:'the pressed verse')+' that state its MEANS>" (W3 B7)';
  else if(kkjvFold(cb[1]).split(' ').filter(Boolean).length<3)why='its CARRIED BY quotes fewer than three words';
  else{if(!rows)rows=kkjvRows();const kt=kfcText(v,rows);
   if(!v){report.push('NOT CHECKED (the press of '+id+' names no reference the code found): CARRIED BY "'+cb[1].slice(0,120)+'"');continue;}
   if(!kt){report.push('NOT CHECKED (the verse was not read this run): '+v.ref+' CARRIED BY "'+cb[1].slice(0,120)+'"');continue;}
   if(!kkjvStands(cb[1],kt))why='its CARRIED BY words "'+cb[1].slice(0,160)+'" are not in '+v.ref+', which reads: "'+kkjvNoMargin(kt).replace(/\s+/g,' ').trim().slice(0,400)+'"';}
  if(!why)continue;
  items.push({rule:'K-FC',side:'BOTH',link:id,ref:v?v.ref:null,means:m[3],why,line:'FORCED line for '+id+': '+why+'. Write the FORCED line again with CARRIED BY: "<the words of '+(v?v.ref:'the pressed verse')+' that state the MEANS sentence, quoted from the KJV>" between FAILS and GROUND, or RETRACTED the link, or RESTATED it not graded LINK BROKEN. Your line: '+l.slice(0,600)});
  marks.push('[AUDIT v48: DEBATE RULE VIOLATION (K-FC) -- '+id+': '+why+'. TRIAL rule: answer it in the cure; it removes no seat; not counted in audit_flags.]');}
 return {items,marks,report};}
