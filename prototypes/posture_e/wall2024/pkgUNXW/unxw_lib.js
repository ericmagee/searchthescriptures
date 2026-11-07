// pkgUNXW (W3 2738): the K-UNX cure reads a layer as named missing only when the STATEMENT says it is missing: a lack word (no, not, lacks, without,
// missing, absent, never, nor, fails) within 40 characters before the tag on its clause, or after it on its clause "is missing / absent / lacking / not exhibited", "does not ..." or "fails" (its [L4] does not follow).
// "The block exhibits [L1] and [L2]" names no missing layer (33249 grok premise 5). The raise test (unxNamed) is unchanged.
function unxLack(s,kinds){const t=String(s||'').replace(/["“][^"”]*["”]/g,' ');const have=new Set((kinds||[]).map(k=>(String(k).match(/[1-4]/)||[''])[0]));const named=[];
 for(const m of t.matchAll(/\[?\bL([1-4])\b\]?/g)){const pre=t.slice(Math.max(0,m.index-40),m.index).split(/[.;]/).pop();const post=t.slice(m.index+m[0].length,m.index+m[0].length+60).split(/[.;]/)[0];
  if(/\b(?:no|not|lacks?|lacking|without|missing|absent|never|nor|neither|fails?)\b[^\[]*$/i.test(pre)||/^\s*(?:layer\s+)?(?:is|are)\s+(?:missing|absent|lacking|not\s+(?:exhibited|shown|given|present|there))\b/i.test(post)||/^[^\[]{0,30}?\b(?:does|do|did|is|are)\s+not\b|^[^\[]{0,30}?\bfails?\b/i.test(post))named.push(m[1]);}
 return {named,missing:named.filter(n=>n==='4'||!have.has(n))};}
