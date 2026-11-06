// ======== WALL-2024 K-AG (TRIAL; W3 2279 ask 3, ruling 2283; built by W2) ========
// An ANSWER CHECK line is graded MEETS or MISSES. FAILS is read as MISSES, and UNPROVEN marks a press that is not a witness. K-AG raises an
// item for a grade the reader cannot map (any other word, or no grade), and for an ANSWER: NONE row graded MEETS (no answer cannot meet a
// press). ANSWER: NONE graded MISSES, FAILS or UNPROVEN is consistent and raises nothing. A TRIAL form item: a K-AG item left without a written
// response counts under the silence rule; a written answer that fails the form is recorded only.
const KAG_OK=['MEETS','MISSES','FAILS','UNPROVEN'];
function kagNorm(s){return String(s==null?'':s).toUpperCase().replace(/[^A-Z0-9:;]+/g,' ').replace(/\s+/g,' ').trim();}
// One ANSWER CHECK line read loosely: its verse, its round list, whether its ANSWER is NONE, and the grade word after the ANSWER. A quoted
// ANSWER closes at the first closing mark followed by "--"; an apostrophe inside a word is never followed by "--", so it is not read as the close.
function kagRow(l){const s=String(l||'').replace(/[*_`]+/g,'').replace(/^\s*(?:[-•>]|\d+[.)])?\s*/,'').trim();if(!/^ANSWER CHECK\s*:/i.test(s))return null;
 const a=s.search(/--\s*ANSWER\s*:/i);if(a<0)return null;
 const verse=((s.match(/^ANSWER CHECK\s*:\s*(.+?)\s*--/i)||[])[1]||'').trim();const rk=((s.match(/--\s*\[([^\]]*)\]\s*--/)||[])[1]||'').trim();
 const rest=s.slice(a).replace(/^--\s*ANSWER\s*:\s*/i,'');let none=false,after=null;
 if(/^NONE\b/i.test(rest)){none=true;const k=rest.indexOf('--');after=k<0?'':rest.slice(k);}
 else if(/^["'“‘]/.test(rest)){const m=rest.slice(1).match(/["'”’]\s*(?=--)/);after=m?rest.slice(1+m.index+m[0].length):'';}
 else{const k=rest.indexOf('--');after=k<0?'':rest.slice(k);}
 const g=(String(after||'').match(/^--\s*\(?([A-Za-z][A-Za-z-]*)/)||[])[1]||'';
 return {verse,rk,none,grade:g.toUpperCase(),line:s};}
function kagLines2024(text){const items=[],marks=[],report={rows:0,grades:{},none:{}};const T=String(kkjvText(text)||'').replace(/\\n/g,'\n');if(!T.trim())return {items,marks,report};
 for(const l of T.split('\n')){const r=kagRow(l);if(!r)continue;report.rows++;const gk=r.grade||'(none)';report.grades[gk]=(report.grades[gk]||0)+1;if(r.none)report.none[gk]=(report.none[gk]||0)+1;
  const bad=!KAG_OK.includes(r.grade);const noneMeets=r.none&&r.grade==='MEETS';if(!bad&&!noneMeets)continue;
  const link='ANSWER CHECK '+r.verse+(r.rk?' ('+r.rk.replace(/\s*[;,]\s*/g,'; ')+')':'');if(items.some(x=>x.link===link&&x.grade===r.grade&&x.none===r.none))continue;
  const what=noneMeets?'grades MEETS where the ANSWER is NONE; no answer cannot meet a press':(r.grade?'grades the answer "'+r.grade+'", which is not a grade the rules name':'gives no grade after the ANSWER');
  items.push({rule:'K-AG',side:'JUDGE',link,verse:r.verse,rk:r.rk,grade:r.grade,none:r.none,
   line:'['+link+'] your ANSWER CHECK line '+what+'. Write the line again with '+(r.none?'MISSES':'MEETS or MISSES')+' as its grade (UNPROVEN if the press has no MEANS sentence), or write NOT HELD with your reason. Your line: '+r.line.slice(0,600)});
  marks.push('[AUDIT v41: ANSWER CHECK GRADE (K-AG; TRIAL) -- '+link+' -- '+(noneMeets?'ANSWER NONE graded MEETS':'grade '+(r.grade||'missing')+' is not MEETS or MISSES')+']');}
 return {items,marks,report};}
// The cure: a line of the reply (or the item's RESPONSE) that writes the ANSWER CHECK on the same verse again with a grade the rules name
// (MISSES, FAILS or UNPROVEN where the ANSWER is NONE), or NOT HELD on the item's RESPONSE line.
function kagCure(x,reply,resp){if(!x||x.rule!=='K-AG')return null;
 if(/\bNOT HELD\b/i.test(String(resp||'')))return {st:'CURED',why:'TRIAL rule (K-AG): NOT HELD written on the item\'s RESPONSE line',line:null};
 const V=kagNorm(x.verse);
 for(const l of String(reply||'').split('\n').concat([String(resp||'')])){const r=kagRow(l);if(!r||kagNorm(r.verse)!==V)continue;if(x.rk&&r.rk&&kagNorm(r.rk)!==kagNorm(x.rk))continue;
  if(['MISSES','FAILS','UNPROVEN'].includes(r.grade)||(r.grade==='MEETS'&&!r.none))return {st:'CURED',why:'TRIAL rule (K-AG): the line is written again graded '+r.grade,line:r.line.slice(0,1500)};}
 return {st:'UNCURED',why:'TRIAL rule (recorded and answered; it removes no seat): the reply writes no ANSWER CHECK line on '+x.verse+' graded '+(x.none?'MISSES':'MEETS or MISSES')+', and no NOT HELD',line:null};}
