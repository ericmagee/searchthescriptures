// pkgKBG rev 4: true when a grant sentence carries a further clause of its own (build_KBG4.cjs puts this text into the node as __oc).
module.exports=y=>{const z=String(y).replace(/\([^()]*\)/g,' ').replace(/"[^"]*"|“[^”]*”/g,' q ');const P=z.split(/,\s*and\s+|;\s+|\s+and\s+(?=I\b)/);const col=/:\s/.test(P[0]);
 return P.slice(1).some(c=>{c=c.trim().replace(/^(?:on\s+that\s+ground|there|here|then|thus)\s+/i,'');const n=c.split(/\s+/).filter(Boolean).length;
  if(/^that\b/i.test(c)||/^I\s+(?:also\s+|further\s+|likewise\s+)?(?:grant|concede|accept|allow|affirm)\b/i.test(c))return false;
  if(/^(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+[\s\d:,;–-]*\.?$/.test(c))return false;
  if(n<=8&&!/\d|\bq\b/.test(c)&&!/\b(?:not|no|never|nothing|only|because|since|for)\b/i.test(c)&&/^(?:\S+\s+){1,3}?(?:still\s+|also\s+)?(?:keeps?|holds?|maintains?|stands?|supports?|follows?|remains?|retains?)\b/i.test(c))return false;
  if(n<=6&&!/\bq\b/.test(c)&&!/\b(?:not|no|never|nothing|only|because|since)\b/i.test(c)&&/\s(?:it|this|that|them|these|those|the\s+same)\.?$/i.test(c))return false;
  if(col)return /^(?:I|my)\s+\S+\s+\S+/i.test(c);
  if(/^(?:no|neither)\b/i.test(c))return n>=5;
  return /^(?:I|my|the|this|these|those|it|he|she|they|we|nothing|both|each|all|[A-Z]\w*(?:['’]s)?)\s+\S+\s+\S+/.test(c);});};
