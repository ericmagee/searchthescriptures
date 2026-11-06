// pkgPAB (W3 ruling, Wall 2596/2599; Commitment 3 with Commitment 5): a press counts as proven only on the part of its MEANS that stands on the
// quoted words. A judge's break or concession that charges a press as unanswered, where that press's MEANS carries an absence clause (the pkgABS
// AB pattern, e.g. "Jeremiah 22:30 states no such condition"), is sent back. Cure: a reply that quotes the MEANS' positive part (6 words in a
// row, or all of it when shorter), or CHANGE TO: RETRACTED, or a CHANGE TO line that no longer charges that press as unanswered. A MEANS with no
// positive part is cured only by the retraction or the regrade. Side-neutral: a press from either side's rounds. Uses ABS.absence (pkgABS/pkgABW).
const PAB=(()=>{
 const REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})/g;
 const UN=/\b(?:unanswered|not answered|no answer|never answered|not named|never names?|did not name|does not name the verse)\b|\(\s*Commitment\s+5\s*\)|\bCommitment\s+5\b/i;
 const N=s=>String(s==null?'':s).replace(/\\+"/g,'"').replace(/[*_`]+/g,'');
 const nw=s=>N(s).toLowerCase().replace(/[‘’“”"'`]/g,'').replace(/[^a-z0-9Ͱ-Ͽἀ-῿]+/g,' ').trim().split(' ').filter(Boolean);
 const refs=t=>[...new Set([...String(t||'').matchAll(REF)].map(m=>m[1]+' '+m[2]+':'+m[3]))];
 // press rows in the rounds: <ref> "<quote>" -- MEANS: <meaning> [-- ...]
 function presses(R){const out=[];for(const [k,t0] of Object.entries(R||{})){if(!/^(?:CR|DR)\d$/.test(k))continue;const t=N(t0);
  for(const l of t.split('\n')){const m=l.match(/^\s*[-\d.)\s]*((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \d{1,3}:\d{1,3})(?:[-–]\d{1,3})?\s+["“][^\n]*?["”][^\n]*?--\s*MEANS:\s*(.+?)(?:\s+--\s+|$)/);if(!m)continue;
   out.push({round:k,ref:m[1],means:m[2].trim()});}}return out;}
 function parts(means){const cl=String(means||'').split(/,\s*(?:and|but)\s+|\s+(?:and|but)\s+(?=(?:does|do|did|is|are|was|were)\s+not\b|never\b|(?:states?|names?|says?|gives?)\s+no\b)|;\s*|\.\s+/).map(x=>x.trim()).filter(Boolean);const ab=cl.filter(c=>ABS.absence(c)),po=cl.filter(c=>!ABS.absence(c));return {absence:ab,positive:po.join('; ')};}
 // the judge's charges on an unanswered press: CONCEDED LINKS clauses and collision BROKEN lines
 function charges(text){const out=[];for(const l0 of N(text).split('\n')){const l=l0.trim();if(/^\[AUDIT/.test(l))continue;
   if(/^(?:DEFENDER\s+|CHALLENGER\s+)?CONCEDED LINKS\s*:/i.test(l)){for(const c of l.split(/;\s*|\.\s+(?=Premises?\s+\d)/)){if(!/\b(?:UNEXHIBITED|CONCEDED)\b/.test(c)||!UN.test(c))continue;const pm=c.match(/\bPremise\s+(\d+)/i);out.push({kind:'CONCESSION',label:(pm?'premise '+pm[1]:'concession')+(/^CHALLENGER/i.test(l)?' (challenger)':' (defender)'),line:l,clause:c.trim(),refs:refs(c)});}}
   else if(/\bLINK BROKEN\b/.test(l)&&UN.test(l)&&/\bD\d+\s+vs\.?\s+C\d+/.test(l)){const pm=l.match(/\b(D\d+)\s+vs\.?\s+(C\d+)/);out.push({kind:'BREAK',label:pm[1]+' vs '+pm[2],line:l,clause:l,refs:refs(l.split(/--\s*GROUND\s*:/)[0])});}}
  return out;}
 // raise: a charge whose named press (by reference) carries an absence clause in its MEANS
 function check(text,R){const P=presses(R);const out=[];for(const c of charges(text))for(const ref of c.refs){const ps=P.filter(p=>p.ref===ref);
   const hit=ps.map(p=>({...p,...parts(p.means)})).find(p=>p.absence.length);if(!hit)continue;
   out.push({kind:c.kind,label:c.label,ref,round:hit.round,means:hit.means,absence:hit.absence,positive:hit.positive,line:c.line,clause:c.clause,
    why:c.kind.toLowerCase()+' '+c.label+' charges the press '+ref+' ['+hit.round+'] as unanswered, but its MEANS rests on an absence ("'+hit.absence.join('; ')+'")'+(hit.positive?'; the positive part is "'+hit.positive+'"':'; it has no positive part')});break;}
  return out;}
 function cure(it,a){const R=(c,w)=>({status:c?'CURED':'UNCURED',why:w});if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');const p=it.pab||{};
  const to=N(a.to);if(a.ans==='CHANGE'&&/^\s*RETRACTED\b/i.test(to))return R(true,'CHANGE TO RETRACTED (pkgPAB)');
  if(a.ans==='CHANGE'&&to&&!(refs(to).includes(p.ref)&&UN.test(to)))return R(true,'CHANGE TO a line that no longer charges '+p.ref+' as unanswered (pkgPAB)');
  const pw=nw(p.positive);if(!pw.length)return R(false,'the press has no positive part; only RETRACTED or a regrade cures (pkgPAB)');
  const runs=pw.length<=6?[pw.join(' ')]:pw.slice(0,pw.length-5).map((_,i)=>pw.slice(i,i+6).join(' '));const T=' '+nw(to+' '+(a.why||'')).join(' ')+' ';
  const q=runs.find(r=>T.includes(' '+r+' '));return q?R(true,'the reply quotes the positive part of the MEANS: "'+q+'" (pkgPAB)'):R(false,(a.ans==='KEEP'?'KEEP':'CHANGE TO')+' quotes no part of the positive MEANS "'+p.positive+'" (pkgPAB)');}
 return {presses,parts,charges,check,cure,refs};})();
