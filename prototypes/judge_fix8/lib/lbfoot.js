// judge_fix8 R5 (run 32306, Worker_E A5, Worker_G1 #2: K-LB read tags, not footing. Defender premise 3, [CR3] LINK 4, quoted "as was supposed"
// (Luke 3:23) with [L2] enomizeto (was reckoned) but wrote no [L1] tag, and was marked; premise 6, LINK 5, tags three verses [L1], and Gemini cured
// the mark by calling Matthew 1:12 "[L3]"). The link-round block is read for its footing, by the definition the judges' rulebook states in the
// same words (FOOTING LAYERS): a quoted KJV verse with its reference is [L1], tagged or not; a named Hebrew or Greek word with its meaning is [L2]
// (its own script or transliteration marks with a meaning beside it, or a word with its meaning under an [L2] tag or after the word Greek or
// Hebrew); a second verse from another place is [L3] only when the block reads it as a cross-reference to the first (read with, the same word
// at, compare, quotes, applies ...); a second verse merely quoted beside the first is one more [L1]. A tag alone makes no layer. The footing is
// the block before its answers to the pressed verses ("The pressed verses:"), unless full is asked.
const LB_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/g;
const LB_XREF=/\b(?:read\s+(?:with|beside|together\s+with|against|through|by)|cross-?references?|compare[sd]?|cf\.|the\s+same\s+(?:word|verb|form|phrase|term|title|formula|idiom|expression|sense|usage)|same\s+(?:word|verb|form|phrase|term)\s+(?:as|at|in)|where\s+the\s+same|echo(?:es|ed)?|quot(?:es|ed|ing)|cites?|cited|appl(?:ies|ied)|fulfil(?:s|led|ls|ment)?|answers\s+to|parallels?|likewise|is\s+used\s+(?:of|at|in))\b/i;
const LB_GLOSS=/(?:^|[\s(,;:"“'‘])[*_]*([^\s()"“”,;:]{2,24}(?:\s+[^\s()"“”,;:]{2,24}){0,2})[*_]*\s*\(\s*([a-z][^()\n]{1,80}?)\s*\)/g;
const LB_CMP=/\b(?:already|also|same|likewise|elsewhere|again|too|as\s+(?:at|in|of)|read\s+(?:with|beside)|compare[sd]?|cf\.|cross-?ref|beside|parallel|echo|quot|cit(?:es|ed)|appl(?:ies|ied)|fulfil|answers\s+to|matches|calls)\b/i;
const LB_TL=/(?:^|[\s(,;:"“'‘])([*_]*)([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})\1\s*\(\s*["“'‘]?([a-z][^()\n\d]{1,80}?)["”'’]?\s*\)/g;
function lbFoot(block,full){let t=String(block==null?'':block).replace(/\*\*/g,'').replace(/__/g,'');
 if(!full){const c=t.search(/^[ \t>*_#-]*(?:the\s+)?pressed(?:\s+(?:verses|witnesses))?\s*[.:]/im);if(c>0)t=t.slice(0,c);}
 const met=new Set();const src=/\[L2\]|\b(?:Greek|Hebrew|Aramaic)\b/i.test(t);
 for(const s of t.split(/\n+|(?<=[.!?]["”’']?)\s+(?=[A-Z\[(])/)){const refs=[...s.matchAll(LB_REF)].map(m=>m[0].replace(/\.\s/,' '));
  const hasQ=/["“][^"”\n]{4,}?["”]|(?:^|[\s(:])['‘][^'’\n]{4,}?['’](?=$|[\s.,;:)\]])/.test(s);
  if(refs.length&&hasQ)met.add('L1');
  for(const m of s.matchAll(LB_TL)){const w=m[2];const last=w.split(/\s+/).pop();if(DRV_TL_STOP.test(last)||DRV_TL_STOP.test(w.split(/\s+/)[0]))continue;
   if(DRV_SRC.test(w)||m[1]||src){met.add('L2');break;}}
  for(const m of s.matchAll(/([*_])([^*_\n]{2,40})\1\s*\(\s*["“'‘]?[a-z][^()\n\d]{1,80}?["”'’]?\s*\)/g)){if(m[2].split(/\s+/).some(w=>!DRV_TL_STOP.test(w)&&!/^[A-Z]/.test(w))){met.add('L2');break;}} // an italic source word with its meaning
  if(DRV_SRC.test(s.replace(LB_REF,' ').replace(/["“][^"”]*["”]/g,' '))&&/\(\s*["“'‘]?[a-z][^()\n]{1,80}\)/.test(s))met.add('L2');
  const places=new Set(refs.map(r=>r.replace(/:\d+$/,'')));if(places.size>=2&&LB_XREF.test(s))met.add('L3');}
 // an [L3] tag counts only when what it covers names a verse and reads it as a cross-reference (a comparison word); a tag alone makes no layer
 const stem=w=>w.toLowerCase().replace(/(?:es|s|ed|ing)$/,'');const CW=x=>new Set((String(x).replace(/["“][^"”]*["”]/g,' ').match(/[A-Za-z]{5,}/g)||[]).map(stem).filter(w=>!DRV_TL_STOP.test(w)&&!/^(?:verse|which|their|there|these|those|chain|footing|premise|link|round)$/.test(w)));
 for(const m of t.matchAll(/\[L3\]/g)){const tail=t.slice(m.index+4);let e=tail.search(/\[L[1-4]\]|\n\s*\n/);const sc=e<0?tail:tail.slice(0,e);const rs=[...sc.matchAll(LB_REF)].map(x=>x[0].replace(/:\d+$/,''));if(!rs.length)continue;
  const rest=t.slice(0,m.index)+' '+(e<0?'':tail.slice(e));const other=[...t.slice(0,m.index).matchAll(LB_REF)].map(x=>x[0].replace(/:\d+$/,''));if(!other.length||rs.every(p=>other.includes(p)))continue; /* a verse from another place */
  const RW=CW(rest);if(LB_CMP.test(sc)||[...CW(sc)].some(w=>RW.has(w)))met.add('L3');} /* read as a cross-reference: a comparison word, or a term it shares with the block */
 return [...met].sort();}
// the j-th LINK block of a link round (the cure reads the block's own words)
function lbBlockText(round,j){const s=String(round||'');const c=s.search(/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i);const t=c>=0?s.slice(0,c):s;const H=[...t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi)];const h=H[j-1];return h?t.slice(h.index,j<H.length?H[j].index:t.length):'';}
