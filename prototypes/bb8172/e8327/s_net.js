// BB-8327 D1 and D2: the chain-stating net (WALL-1908, as amended at 1913, 1915, 1916; his word at BB-8342).
// netLines(text, links) reads one judge's own text and returns the lines that set aside a chained premise, or the
// pressing side's own rows read together, on the ground that no one verse in them states the link or its contrary in
// its own words. A line that tests one pressed witness by its own words (the silent-verb sentence) is not netted.
// Excluded: a quoted debater row (SIDE | [ROUND] | ...) and the out-of-round concessions block as a whole.
// The role test: on a collision line "Dn vs Cm" the rows weighed are the C-side's declared link, so one verse is
// enough (1916); on a STANDS line with no C label, and on a reasoning, keystone, standing or count sentence, the
// subject must be plural or the rows read together. links, when given, is the list of declared C labels; a "vs Cm"
// line counts as a declared link only when Cm is in it.
// Each result: {item, side, line}. item is one of the K-C key forms of BB-8339: "Dn vs Cm", "Dn", "REASONING",
// "KEYSTONE", "RESULT", "DEFENSE STANDING", "CHALLENGE STANDING", "CONCEDED LINKS", "CHALLENGER CONCEDED LINKS".
const NET_STATE=[
 /\b(?:do|does|did)\s+not\s+(?:\S+\s+){0,4}?(?:state|name|deny|assert)s?\b/i,
 /\bin\s+(?:its|their)\s+own\s+words\s+(?:state|name|assert|deny)s?\s+no\b/i,
 /\bnot\s+stated\b/i,
 /\bunstated\b/i,
 /\b(?:never|neither|nor)\s+(?:names?|states?)\b/i,
 /\bnone\s+of\s+(?:those|them|these|the)\b[^;.]*?\b(?:states?|names?)\b/i,
 /\bno\s+(?:verse|witness|row|passage)s?\s+(?:\S+\s+){0,3}?(?:states?|names?)\b/i,
 /\bnames?\s+no\b/i,
 /\bnames?\b[^;.]{0,60}?\b(?:rather\s+than|not)\b[^;.]{0,30}?\bbegett/i,
 /\bstating\b[^;.]{0,40}?\bin\s+(?:its|their)\s+own\s+words\b/i];
// A clause that reports what a side itself stated or granted is that side's statement, not the judge's ground.
const NET_REPORT=/\b(?:stated|granted|says|said|conceded|argued|admitted)\s+that\b/i;
const NET_PLURAL=/\b(?:rows|verses|witnesses|speeches|they|these|those|them|none|neither|read\s+together|idiom)\b|\bno\s+(?:verse|witness|row)\b|\b(?:\d?\s?[A-Z][a-z]+\s+\d+:\d+)[^;.]{0,40}?\band\s+(?:\d?\s?[A-Z][a-z]+\s+)?\d+:\d+/;
const NET_HEAD=/^(RESULT|KEYSTONE|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:/;
const NET_SKIP=/^(?:CLAUSE|CITATION CHECK|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK|COLLISION POINTS)\b/i;
// The side whose rows are set aside: read from the subject, the words just before the stating ground; else the C side.
function netSide(cl,at){const sub=cl.slice(Math.max(0,at-90),at);if(/\bneither\s+side|\bboth\s+(?:sides|chains)|\beither\s+way\b/i.test(cl))return 'BOTH';
 const d=sub.search(/\bdefender/i),c=sub.search(/\bchallenger/i);if(d<0&&c<0)return 'CHALLENGER';return d>c?'DEFENDER':'CHALLENGER';}
function netUnwrap(text){let t=String(text||'');const s=t.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const j=JSON.parse(s.slice(0,i+1));if(j&&typeof j.reasoning==='string')return j.reasoning;}catch(e){}}return t;}
function netLines(text,links){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');const L=Array.isArray(links)?new Set(links.map(x=>String(x).toUpperCase())):null;
 let inOOR=false,first=true;
 for(const raw of T.split('\n')){const line=raw.trim();if(!line)continue;const u=line.toUpperCase();
  if(/^OUT-OF-ROUND CONCESSIONS\b/.test(u)){inOOR=true;continue;}
  if(inOOR){if(/^(?:DEFENDER|CHALLENGER)\s*\|/.test(u)||/^NONE\b/.test(u))continue;inOOR=false;}
  if(/^(?:DEFENDER|CHALLENGER)\s*\|/.test(u)||line[0]==='['){first=false;continue;}
  let item=null,vs=false;
  const mc=u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+)(?:\s+VS\.?\s+(C\d+))?\b/);
  const mh=u.match(NET_HEAD);
  if(mc){item=mc[1]+(mc[2]?' vs '+mc[2]:'');vs=!!mc[2]&&(!L||L.has(mc[2]));}
  else if(mh)item=mh[1];
  else if(first)item='REASONING';
  first=false;
  if(!item||NET_SKIP.test(u))continue;
  const clauses=line.split(/;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/);
  for(const cl of clauses){if(!NET_STATE.some(rx=>rx.test(cl)))continue;
   const hit=NET_STATE.find(rx=>rx.test(cl));const at=cl.search(hit);if(NET_REPORT.test(cl.slice(0,at)))continue;
   if(!vs&&!NET_PLURAL.test(cl))continue;
   out.push({item,side:netSide(cl,at),line});break;}}
 return out;}
if(typeof module!=='undefined')module.exports={netLines,NET_STATE};
