// judge_fix7 J5 (run 32302: the challenger's link round had no "LINK n:" block and was headed "CLOSE ROUND (challenger)"; K-LB could not read
// it and no check said so): the LINK-ROUND FORMAT CHECK, one text in D3 Extract, C3 Extract, Build Save Body, Panel Build, Build Independent
// Verdict and Failure Salvage. A link round is a format fault when it holds no "LINK n:" block (n a number or "none", a bracketed note allowed
// before the colon), or when its first heading names another round (the close, the opening, round 1, 2 or 4, the final words or defense) and
// not the link round or round 3. The fault is recorded in review_notes and shown to the judges as one line after the round; it grades nothing.
const LRF=(()=>{const LINK=/^[ \t>*#_-]*LINK\s+(?:\d+|none)\b[^\n:]{0,80}:/mi;
 const head=t=>{for(const l of String(t||'').split('\n')){const s=l.replace(/[*_#>`]+/g,'').trim();if(!s||/^(?:DEFENDER|CHALLENGER)\b[^\n]*--\s*ROUND\s*\d+,/i.test(s))continue;return s.slice(0,120);}return '';}; // the system's round label, as the record stores it, is skipped
 const OTHER=/\b(?:CLOS(?:E|ING)\s+(?:ROUND|STATEMENT|WORDS)|OPENING|FINAL\s+(?:ROUND|WORDS|DEFEN[CS]E)|ROUND\s*(?:1|2|4|ONE|TWO|FOUR)\b)/i;
 const check=t=>{const T=String(t||'');if(!T.trim())return null;const h=head(T);const why=[];
  if(!LINK.test(T))why.push('it holds no "LINK n:" block');
  if(OTHER.test(h)&&!/\bLINK\s+ROUND\b|\bROUND\s*(?:3|THREE)\b/i.test(h))why.push('it is headed "'+h.replace(/["\[\]]/g,'')+'", as another round');
  return why.length?{fault:true,why,head:h}:null;};
 const note=(t,sd)=>{const c=check(t);return c?'\n\n[LINK-ROUND FORMAT CHECK -- computed by the system, not by a model: ['+(sd==='D'?'CR3':'DR3')+'] does not keep the link-round form: '+c.why.join('; ')+'. A format fault only: it grades nothing; grade the round on its text.]':'';};
 const audit=(t,sd)=>{const c=check(t);return c?'[AUDIT v27: LINK-ROUND FORMAT CHECK ('+(sd==='D'?'D3':'C3')+') -- the '+(sd==='D'?'defender':'challenger')+'\'s link round does not keep the link-round form: '+c.why.join('; ').replace(/[\[\]]/g,'')+'. A format fault, recorded; no automatic grading. REVIEW THIS ROW.]':'';};
 return {check,note,audit};})();
