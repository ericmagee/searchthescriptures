# patch.py (judge_fix2): builds new/<node>.js from base/<node>.js (the live code of ORACLE_DEBATE_V1 version 52b05334, read by GET).
# Offline; writes only new/. Anchored replacements: it refuses when an anchor is not found the expected number of times.
# FIX 1a and 2: judge instruction text (Panel Build, Build Independent Verdict; Format Markdown's rule copy).
# FIX 1b: K-X mark and cure (every node that carries drvCheck; the cure in every node that carries cureVerdicts; flagKey in Format Markdown
#         and Build Save Body; the REVIEW count exclusion in Extract Independent Verdict).
# FIX 3: RESTATED "Dn vs Cm" accepted for Dn, and "Cn vs Dm" read as a collision line (every node that carries cureLines).
# FIX 4: K-C reads the RESULT line with "nowhere states" and the CHAIN MARK lines (every node that carries netLines).
# FIX 5: alternate pool (Alternate Build: no build-time G3 on the other alternate; Alternate Merge: one seat per model, at merge).
# FIX 6: citation check (Citation Scan: compact read, unread items, bare reference book from the same clause; Quote Compare: unread is NOT CHECKED).
import os,sys
B='base';N='new';os.makedirs(N,exist_ok=True)
def rep(s,old,new,nm,count=1):
    c=s.count(old)
    if c!=count: sys.exit(f'{nm}: anchor found {c} times, want {count}: {old[:90]!r}')
    return s.replace(old,new)

# ---------- FIX 1a and 2: the instruction clause (Panel Build, Build Independent Verdict; single-quoted JS strings) ----------
OLD_CL="CONCEDED (stated) when the block itself states the surrender; UNEXHIBITED (no footing offered) when the block asserted the link and offered no layer footing at all. A link whose"
NEW_CL=("CONCEDED (stated) when the block itself states the surrender, only when the block surrenders the link itself; a block that drops a limb and keeps the link in a narrowed form is not a concession: grade the narrowed link; "
        "UNEXHIBITED (no footing offered) when the block asserted the link and offered no layer footing at all. A pressed witness left unanswered never makes a link UNEXHIBITED; it is graded on that link\\'s collision line as LINK BROKEN with its pressing sentence quoted. A link whose")
# Format Markdown's rule copy (double-quoted JS string).
OLD_FM=r'''What else decides a link.** The judges' rulebook adds three rules, quoted here in its own words.\n\n- **UNEXHIBITED.** A link is graded UNEXHIBITED \"when the block asserted the link and offered no layer footing at all\"; it counts as conceded.\n'''
NEW_FM=(r'''What else decides a link.** The judges' rulebook adds four rules, quoted here in its own words.\n\n- **UNEXHIBITED.** A link is graded UNEXHIBITED \"when the block asserted the link and offered no layer footing at all\"; it counts as conceded. It adds: \"A pressed witness left unanswered never makes a link UNEXHIBITED; it is graded on that link's collision line as LINK BROKEN with its pressing sentence quoted.\"\n'''
        r'''- **CONCEDED (stated).** A link is graded CONCEDED (stated) \"when the block itself states the surrender, only when the block surrenders the link itself; a block that drops a limb and keeps the link in a narrowed form is not a concession: grade the narrowed link\".\n''')

# ---------- FIX 4: K-C net ----------
OLD_NS1=r''' /\bstating\b[^;.]{0,40}?\bin\s+(?:its|their)\s+own\s+words\b/i];'''
NEW_NS1=r''' /\bstating\b[^;.]{0,40}?\bin\s+(?:its|their)\s+own\s+words\b/i,
 // judge_fix2 FIX 4 (run 32212, judgment 886): "Scripture nowhere states that ..." (RESULT) and "without a single biblical text stating that ..." (CHAIN MARK).
 /\bnowhere\s+(?:states?|names?|says)\b/i,
 // judge_fix2 E7 (run 32212: DeepSeek D6 "no exhibit anywhere says Joseph begat Jesus"; Gemini D6 "No passage in the text states").
 /\bno\s+(?:exhibit|passage|text)s?\s+(?:\S+\s+){0,4}?(?:says?|states?)\b/i,
 /\bwithout\s+(?:a\s+single|any|one)\s+(?:\S+\s+){0,2}?(?:text|verse|witness|row|passage)s?\s+(?:stating|naming|that\s+states?)\b/i];'''
OLD_NP=r'''|\b(?:\d?\s?[A-Z][a-z]+\s+\d+:\d+)[^;.]{0,40}?\band\s+(?:\d?\s?[A-Z][a-z]+\s+)?\d+:\d+/;'''
NEW_NP=r'''|\b(?:\d?\s?[A-Z][a-z]+\s+\d+:\d+)[^;.]{0,40}?\band\s+(?:\d?\s?[A-Z][a-z]+\s+)?\d+:\d+|\bscripture\b|\bnowhere\b|\bno\s+(?:exhibit|passage|text)s?\b|\ba\s+single\s+(?:\S+\s+)?(?:text|verse|witness|row|passage)\b/i; // judge_fix2 FIX 4: Scripture as a whole, "nowhere", "a single text" (the /i is new; every earlier alternative is lower case or a verse form)'''
OLD_NR="const NET_REPORT=/\\b(?:stated|granted|says|said|conceded|argued|admitted)\\s+that\\b/i;"
NEW_NR="const NET_REPORT=/\\b(?:stated|granted|says|said|conceded|argued|admitted)\\s+that\\b|\\b(?:conceding|concedes|admitting|admits|granting|grants)\\b/i; // judge_fix2 FIX 4: a side's concession reported with -ing or -s (32212 DeepSeek CHAIN MARK)"
OLD_NM="function netMask(cl){let t=String(cl).replace(NET_QUOTE,'\"[quote]\"')"
NEW_NM="const NET_QUOTE1=/(?<=^|[\\s(\\[:])'[^'\\n]{3,200}?'(?=[\\s,.;:)\\]]|$)/g; // judge_fix2 E7: a round's words in single quotes (32212 population: j816, j834, j813)\nfunction netMask(cl){let t=String(cl).replace(NET_QUOTE,'\"[quote]\"').replace(NET_QUOTE1,\"'[quote]'\")"
OLD_CLS="const clauses=line.replace(NET_QUOTE,'\"[quote]\"').split("
NEW_CLS="const clauses=line.replace(NET_QUOTE,'\"[quote]\"').replace(NET_QUOTE1,\"'[quote]'\").split("
OLD_NH="const NET_HEAD=/^(RESULT|KEYSTONE|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\\s*:/;"
NEW_NH="const NET_HEAD=/^(RESULT|KEYSTONE|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\\s*:/; // judge_fix2 FIX 4: the CHAIN MARK lines are read"
OLD_SK="const NET_SKIP=/^(?:CLAUSE|CITATION CHECK|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK|COLLISION POINTS)\\b/i;"
NEW_SK="const NET_SKIP=/^(?:CLAUSE|CITATION CHECK|COLLISION POINTS)\\b/i;"
OLD_PUSH="   out.push({item,side:netSide(cl,at),line});break;}}"
OLD_IT="  if(!item||NET_SKIP.test(u))continue;"
NEW_IT="  if(!item||NET_SKIP.test(u)||/^(?:DEFENDER|CHALLENGER) CHAIN MARK\\s*:\\s*FOOTED\\b/.test(u))continue; // judge_fix2 FIX 4: a FOOTED chain mark sets nothing aside"
NEW_PUSH="   out.push({item,side:item==='DEFENDER CHAIN MARK'?'DEFENDER':item==='CHALLENGER CHAIN MARK'?'CHALLENGER':netSide(cl,at),line});break;}} // judge_fix2 FIX 4: a chain mark names its side"

# ---------- FIX 1b: K-X (before drvCheck; pushed after the K-C items) ----------
KX_DEFS=r'''// judge_fix2 FIX 1b (run 32212, judgments 886 and 887): K-X. A CONCEDED LINKS or CHALLENGER CONCEDED LINKS item tagged UNEXHIBITED whose stated
// reason is a pressed witness left unanswered. UNEXHIBITED is only "when the block asserted the link and offered no layer footing at all"; a
// pressed witness left unanswered is graded on that link's collision line as LINK BROKEN with its pressing sentence quoted. The line (quoted
// words masked) is cut into items at each "premise <n>"; an item is marked when it carries UNEXHIBITED (not "not UNEXHIBITED"), a witness
// reason (unanswered, unaddressed, unnamed, not named, never names, pressed ... and left), and no footing reason of its own (no layer, no
// footing, cites only, exhibits no or only, offers no), the tag's own words "(no footing offered)" set aside. One item per count line.
const KX_HEAD=/^[ \t>#-]*(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:/i;
const KX_WIT=/\b(?:unanswered|not\s+answered|unaddressed|unnamed|not\s+named|never\s+name[sd]?|(?:do|does|did)\s+not\s+name|pressed\b[^;.]{0,120}?\b(?:left|went|goes|remain(?:s|ed)?)\s+(?:\S+\s+){0,3}?(?:unanswered|unaddressed|unnamed|unexhibited))/i;
const KX_FOOT=/\b(?:no\s+(?:layer|prior\s+layer|footing|\[?L[1-4]\]?)|without\s+(?:any\s+)?(?:layer|footing)|cites?\s+only|exhibits?\s+(?:no|only)|offers?\s+no|offered\s+no|one\s+layer|single\s+layer)\b/i;
function kxLines(text){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');
 for(const raw of T.split('\n')){const line=raw.trim();const h=line.match(KX_HEAD);if(!h)continue;const label=h[1].toUpperCase();
  const parts=line.slice(h[0].length).replace(NET_QUOTE,'"[quote]"').split(/(?=\b[Pp]remises?\s+\d)/);
  for(const p0 of parts){const p=p0.replace(/\(\s*no\s+footing\s+offered\s*\)/gi,' ');
   if(!/\bUNEXHIBITED\b/.test(p)||/\b(?:not|never|nor)\s+UNEXHIBITED\b/i.test(p)||!KX_WIT.test(p)||KX_FOOT.test(p))continue;
   out.push({item:label,side:label==='CONCEDED LINKS'?'DEFENDER':'CHALLENGER',line,part:p0.trim()});break;}}
 return out;}
// judge_fix2 E1 (K-N; run 32212, judgment 885): a CONCEDED LINKS item tagged CONCEDED (stated) whose quoted words are a narrowing ("drop any
// claim that", "I do not claim", "no longer claim", "narrow", "only") and not a surrender (I concede, withdraw, surrender, CONCEDED). The rule:
// "A limb the link round narrows counts in its narrowed form." Text only: whether the block keeps the link is read from the quotation.
const KN_NARROW=/\b(?:drop(?:s|ped)?\s+(?:any|the|my|that)\s+(?:\S+\s+){0,2}?(?:claim|form|limb|reading)|no\s+longer\s+(?:claim|hold|assert|rest)|(?:do|does)\s+not\s+(?:claim|assert|need)|narrow\w*|limb\s+(?:is\s+)?dropped|\bonly\b|\balone\b)/i;
const KN_SURR=/\b(?:I\s+concede|concede[sd]?\s+(?:the\s+|this\s+)?link|withdraw\w*|surrender\w*|CONCEDED\b|I\s+yield|I\s+grant\s+the\s+link)/i;
function cntItems(text){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');
 for(const raw of T.split('\n')){const line=raw.trim();const h=line.match(KX_HEAD);if(!h)continue;const label=h[1].toUpperCase();const body=line.slice(h[0].length);
  const qs=[];const masked=body.replace(NET_QUOTE,q=>{qs.push(q);return '"[quote'+(qs.length-1)+']"';});
  for(const p0 of masked.split(/(?=\b[Pp]remises?\s+\d|\bLINK\s+\d+\s*(?:\(|:))/)){const pm=p0.match(/^[Pp]remises?\s+(\d+)(?:\s*\(\s*LINK\s+(\d+)\s*\))?/)||(m2=>m2?[m2[0],m2[2]||m2[1],m2[1]]:null)(p0.match(/^LINK\s+(\d+)\s*(?:\(\s*premise\s+(\d+)\s*\))?/i));if(!pm)continue;
   const quotes=[...p0.matchAll(/"\[quote(\d+)\]"/g)].map(m=>qs[+m[1]]);const one=/^(?:[Pp]remise|LINK)\s/.test(p0);
   const tag=/\bCONCEDED\s*\(\s*stated\s*\)/i.test(p0)?'CONCEDED':(/\bUNEXHIBITED\b/.test(p0)&&!/\b(?:not|never|nor)\s+UNEXHIBITED\b/i.test(p0))?'UNEXHIBITED':(/\bVOID\b/.test(p0)?'VOID':(/\bSUPPORTED\b/.test(p0)?'SUPPORTED':null));
   out.push({label,side:label==='CONCEDED LINKS'?'DEFENDER':'CHALLENGER',n:+pm[1],link:pm[2]?+pm[2]:+pm[1],one,tag,quotes,text:p0.trim(),line});}}
 return out;}
const knNarrow=it=>it.tag==='CONCEDED'&&it.quotes.length>0&&it.quotes.every(q=>KN_NARROW.test(q)&&!KN_SURR.test(q));
function knLines(text){const out=[];const seen=new Set();for(const it of cntItems(text)){if(!it.one||!knNarrow(it)||seen.has(it.label))continue;seen.add(it.label);out.push({item:it.label,side:it.side,line:it.line,premise:it.n});}return out;}
// judge_fix2 E2 (K-SC; run 32212, judgment 885): a defender link graded STANDS ("Dn: STANDS") (a) whose own line says the defender's
// round conceded ("[CR3] LINK 5 conceded that ..."), or (b) while the same judge's CONCEDED LINKS counts, as CONCEDED (stated) (never
// UNEXHIBITED, which the rulebook counts toward c and never toward w), a premise the judge itself files under LINK n ("premise 4 (LINK n)" or "LINK n:"). A narrowing (K-N) is not counted here. A
// premise number is never read as a link number (they differ in runs 32157 and 32205). (b) holds only when the STANDS line says nothing of a
// concession; (a) never when the conceding words belong to the challenger ([DR], "it concedes") or are negated.
const SC_CONC=/(?:\[?\bCR[1-3]\b\]?|\bdefen(?:der|se)(?:'s)?\b)[^;]{0,60}?\b(?<!not\s|never\s)conced(?:ed|es)\b(?!\s+nothing)/i;
function scLines(text){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');const its=cntItems(T).filter(it=>it.label==='CONCEDED LINKS'&&it.one&&it.tag==='CONCEDED'&&!knNarrow(it));
 const byLink=it=>/\(\s*LINK\s+\d+\s*\)|^LINK\s+\d+/i.test(it.text);
 for(const raw of T.split('\n')){const line=raw.trim();const m=line.toUpperCase().match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(?:--|—|-|:)?\s*STANDS\b/);if(!m)continue;
  const lq=line.replace(NET_QUOTE,'"[quote]"');const om=lq.match(SC_CONC);const tail=om?lq.slice(om.index+om[0].length,om.index+om[0].length+120):'';const own=om&&!/\bchallenger|\bDR[1-3]\b|\bit\s+concede|\bnot\b|\bseparate\b/i.test(om[0])&&!/^[^;]{0,25}?\[?DR[1-3]\b/.test(tail)&&!/\b(?:keep(?:s|ing)?|kept|narrow\w*|only|alone)\b/i.test(tail); /* fix 2: a concession of a limb that keeps the link narrowed is a narrowing, and the narrowed link may stand */
  const it=null; /* (b) not wired: a count line's "LINK n" is the pressing list's label, which the population read showed is not always Dn (j734, j676) */
  if(own||it)out.push({item:'D'+m[1],side:'DEFENDER',line,premise:it?it.n:null,tag:it?it.tag:'CONCEDED',own:!!own});}
 return out;}
// judge_fix2 E4 (K-K; run 32212, judgment 887 "KEYSTONE: D6 -- BROKEN -- Christ had no biological father, and Joseph did not beget him."): a
// KEYSTONE line whose reason gives no ground: no verse, no round or link, no layer, and no ground word. It states a conclusion, not a grade's ground.
const KK_GROUND=/\d+:\d+|\[?\b[CD]R[1-3]\b\]?|\bround\b|\bLINK\s+\d|\[L[1-4]\]|\b(?:answered|unanswered|refuted|refutes|withdrawn|withdrew|withdraws|conceded|concedes|pressed|witness\w*|GROUND|because|since|exhibit\w*|footing|premise|chain|verse|row)\b/i;
function kkLines(text){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');
 for(const raw of T.split('\n')){const line=raw.trim();const m=line.match(/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b\s*(?:--|—|-|:)?\s*(.*)$/i);if(!m)continue;
  const rs=m[3].replace(/^[\s.\-–—:]+/,'').trim();if(rs.split(/\s+/).length>=3&&!KK_GROUND.test(rs))out.push({item:'KEYSTONE',side:'DEFENDER',line});} // a bare grade with no reason is left to the format checks
 return out;}
// judge_fix2 E5 (K-DG8; drift guard 8, read live 2026-11-02: "\"knew her not till she had brought forth her firstborn son\" (Matt 1:25) bounds the
// abstinence to the pregnancy"; forbidden "routing the flesh through Mary alone"; runs 32194 Gemini, 32205 single judge, 32212 Gemini): a graded
// line (Dn, Dn vs Cm, KEYSTONE, RESULT) whose ground, in a clause of its own (not a report of a side's reading), with Matthew 1:18 or 1:25, "came together" or "till" on the line, reads Matthew 1:18
// "came together" or 1:25 "till" as excluding the union, or (as the ground of a STANDS grade) routes the flesh through Mary. Quoted words (double,
// or single quotes standing alone), a report of a side's reading, and a hedged clause (neither, whether, rather than, not ... before the hit) are skipped. Every judge, the single judge too.
const DG8_ANCHOR=/\bMatt(?:hew|\.)?\s*1:(?:18|25)\b|\b1:(?:18|25)\b|came\s+together|knew\s+her\s+not|\btill\b|cohabit/i;
const DG8_EXCL=/\b(?:(?:directly\s+)?exclud\w*\s+(?:\S+\s+){0,2}?(?:Joseph|a\s+man|the\s+man|any\s+man|man's|knowing|knowledge|union|begetter|the\s+knowledge)|rules?\s+out|ruled\s+out|negat\w+\s+(?:the\s+)?(?:knowing|union)|den(?:y|ies|ied)\s+(?:the\s+|any\s+)?(?:union|knowing|knowledge)|no\s+(?:sexual\s+)?(?:union|knowledge|relations|intercourse|knowing)\b|had\s+no\s+(?:sexual\s+)?(?:knowledge|relations|union)|had\s+not\s+cohabited|precedes?\s+cohabitation|before\s+any\s+(?:union|knowing|coming\s+together)|without\s+(?:a\s+man|union|sexual)|knew\s+no\s+man|contradict\w*\s+(?:marital\s+)?union|knowing[^;.]{0,60}?\bis\s+negative)/i;
const DG8_MARY=/\bflesh\b[^;.]{0,80}?\b(?:through|from|via)\s+(?:the\s+)?(?:mother|Mary)\b(?![^;.]{0,30}\band\s+Joseph)/i;
const DG8_HEDGE=/\b(?:neither|nor|whether|rather\s+than|fail\w*\s+to|not|never|cannot|open)\b[^;.]{0,40}$/i;
const DG8_Q1=/(?<=^|[\s(\[:])'[^'\n]{3,200}?'(?=[\s,.;:)\]]|$)/g;
const DG8_REPORT=/\b(?:defender|challenger|defense|side|block|round|\[?[CD]R\d\]?)\s+(?:reads?|argues?|argued|claims?|claimed|says|said|holds?|held|takes?|took|asserts?|asserted|contends?|wrote|writes|rests?|pressed|presses)\b|\bto\s+argue\b|\bexhibit\w*\b[^;.]{0,80}\bto\s+(?:argue|show)\b/i;
function dg8Lines(text){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');
 for(const raw of T.split('\n')){const line=raw.trim();const u=line.toUpperCase();let item=null;
  const mc=u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+)(?:\s+VS\.?\s+(C\d+))?\b/);const mh=u.match(/^(KEYSTONE|RESULT)\s*:/); /* a CHAIN MARK describes a chain; it is not read here */
  if(mc)item=mc[1]+(mc[2]?' vs '+mc[2]:'');else if(mh)item=mh[1];if(!item)continue;
  for(const cl0 of line.split(/;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/)){const cl=cl0.replace(NET_QUOTE,'"[quote]"').replace(DG8_Q1,"'[quote]'");
   const hx=cl.match(DG8_EXCL);const hm=cl.match(DG8_MARY);const st=/^(?:[-•]|\d+[.)])?\s*D\d+\s*:?\s*(?:--|—|-|:)?\s*STANDS\b/i.test(line)||/^KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)\s*STANDS\b/i.test(line);const h=hx&&DG8_ANCHOR.test(line)?hx:(st?hm:null); /* flesh through Mary: only as the ground of a STANDS grade */if(!h)continue;if(DG8_REPORT.test(cl.slice(0,h.index))||DG8_HEDGE.test(cl.slice(0,h.index)))continue;
   out.push({item,side:/^D\d+$/.test(item)||item==='KEYSTONE'||item==='DEFENDER CHAIN MARK'?'DEFENDER':'CHALLENGER',line,hit:h[0]});break;}}
 return out;}
'''
OLD_KCPUSH=''' for(const n of netLines(text)){items.push({rule:'K-C',side:n.side,link:n.item,line:n.line});'''
NEW_KCPUSH=''' // judge_fix2 FIX 1b (K-X): an UNEXHIBITED count item whose reason is an unanswered pressed witness.
 for(const n of kxLines(text)){items.push({rule:'K-X',side:n.side,link:n.item,line:n.line});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-X) -- '+n.item+' tags a link UNEXHIBITED because a pressed witness went unanswered; UNEXHIBITED is only a link whose block offered no layer footing at all, and an unanswered witness is graded on its collision line as LINK BROKEN with its pressing sentence quoted. REVIEW THIS ROW.]');}
 // judge_fix2 E1, E2, E5 (K-N, K-SC, K-DG8): items with a cure, as K-C. (E4, K-K, is defined but not wired: the prompt's KEYSTONE form asks the judge to name the link's conclusion.)
 for(const n of knLines(text)){items.push({rule:'K-N',side:n.side,link:n.item,line:n.line});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-N) -- '+n.item+' counts premise '+n.premise+' CONCEDED (stated) on words that narrow a limb; a limb the link round narrows counts in its narrowed form, and a narrowing is not a concession. REVIEW THIS ROW.]');}
 for(const n of scLines(text)){items.push({rule:'K-SC',side:n.side,link:n.item,line:n.line,premise:n.premise});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-SC) -- '+n.item+' STANDS while '+(n.own?'its own line says the defender conceded':'CONCEDED LINKS counts premise '+n.premise+' (filed under that link) '+(n.tag==='CONCEDED'?'CONCEDED (stated)':'UNEXHIBITED'))+'; a link counted conceded does not stand. REVIEW THIS ROW.]');}
 for(const n of dg8Lines(text)){items.push({rule:'K-DG8',side:n.side,link:n.item,line:n.line});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-DG8) -- '+n.item+' rests on Matthew 1:18 or 1:25 read as excluding the union, or on the flesh routed through Mary ("'+String(n.hit).replace(/[\[\]]/g,'')+'"); DG-8 holds that 1:25 bounds the abstinence to the pregnancy. REVIEW THIS ROW.]');}
 for(const n of netLines(text)){items.push({rule:'K-C',side:n.side,link:n.item,line:n.line});'''

# ---------- cure side (K-X, FIX 3, FIX 4 labels) ----------
OLD_RG='''+"A restated line that keeps the ground is not a cure, and an uncured K-C line is not counted (K-C UNCURED).";'''
NEW_RG='''+"A restated line that keeps the ground is not a cure, and an uncured K-C line is not counted (K-C UNCURED). "
 +"K-X (a CONCEDED LINKS or CHALLENGER CONCEDED LINKS item tagged UNEXHIBITED because a pressed witness went unanswered): UNEXHIBITED is only a link whose block asserted it and offered no layer footing at all. "
 +"A pressed witness left unanswered never makes a link UNEXHIBITED; it is graded on that link's collision line as LINK BROKEN with its pressing sentence quoted. "
 +"Cure it with one RESTATED line for that count line (its label, a colon, then the whole line) without that item; a restated line that still tags a link UNEXHIBITED for an unanswered witness is not a cure. "
 +"K-N (a CONCEDED LINKS or CHALLENGER CONCEDED LINKS item tagged CONCEDED (stated) on words that narrow a limb, such as \\"I drop any claim that\\"): a link is CONCEDED (stated) only when the block surrenders the link itself; a block that drops a limb and keeps the link in a narrowed form is not a concession: grade the narrowed link. "
 +"Cure it with one RESTATED line for that count line that no longer counts the narrowing as a concession. "
 +"K-SC (a link you graded STANDS while your own line says the defender conceded it, or while your CONCEDED LINKS counts the premise filed under it CONCEDED (stated)): a link counted conceded does not stand. Cure it with one RESTATED line for that link (D<n> or D<n> vs C<m>) that does not grade it STANDS; "
 +"or with one RESTATED CONCEDED LINKS line that no longer counts that premise; or with a STATEMENT for the item that names the round ([CR3] or [DR3]) and quotes its words that show the link stands. "
 +"K-DG8 (a line whose ground reads Matthew 1:18 \\"came together\\" or Matthew 1:25 \\"knew her not till\\" as excluding the union, or routes the flesh through Mary): the record holds that \\"knew her not till she had brought forth her firstborn son\\" bounds the abstinence to the pregnancy, and neither verse states that no union took place. "
 +"Cure it with one RESTATED line for that item whose ground does not rest on that reading.";'''
OLD_FORM='''+"RESTATED: <for a K-C item on a REASONING, KEYSTONE, STANDING or CONCEDED line: that label, a colon, then the whole regraded sentence>\\n"'''
NEW_FORM='''+"RESTATED: <for a K-C item on a REASONING, RESULT, KEYSTONE, STANDING, CONCEDED or CHAIN MARK line, or a K-X item on a CONCEDED line: that label, a colon, then the whole regraded sentence>\\n"'''
OLD_LBL="const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-S'||x.rule==='K-C')?x.rule+' '+x.link:'K-G3 '+x.side);"
NEW_LBL="const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-S'||x.rule==='K-C'||x.rule==='K-X'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K'||x.rule==='K-DG8')?x.rule+' '+x.link:'K-G3 '+x.side);"
OLD_ASK="kg.map(x=>cureLabel(x)+': '+((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-S'||x.rule==='K-C')?"
NEW_ASK="kg.map(x=>cureLabel(x)+': '+((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-S'||x.rule==='K-C'||x.rule==='K-X'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K'||x.rule==='K-DG8')?"
OLD_KEYS="const keys=(x.rule==='K-B'||x.rule==='K-S'||x.rule==='K-C')?[x.link]"
NEW_KEYS="const keys=(x.rule==='K-B'||x.rule==='K-S'||x.rule==='K-C'||x.rule==='K-X'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K'||x.rule==='K-DG8')?[x.link]"
OLD_RL="  else if(k[1]==='RESTATED'&&(m=r.match(/^(REASONING|KEYSTONE|RESULT|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\\s*[:\\-–—]+\\s*/i)))"
NEW_RL="  else if(k[1]==='RESTATED'&&(m=r.match(/^(REASONING|KEYSTONE|RESULT|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\\s*[:\\-–—]+\\s*/i)))"
OLD_RD="   o.restated.push({link:m[2]?cureId(m[1],m[2]):'D'+m[1],grade:g?g[1]:null,text:r,line:l});}"
NEW_RD=OLD_RD+'''
  // judge_fix2 FIX 3: a collision line restated with the C label first ("C5 vs D5 ...") is that collision (D5 vs C5).
  else if(k[1]==='RESTATED'&&(m=r.match(/^C(\\d+)\\s+vs\\.?\\s+D(\\d+)\\b/i))){const g=r.slice(m[0].length).toUpperCase().match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS)/);
   o.restated.push({link:cureId(m[2],m[1]),grade:g?g[1]:null,text:r,line:l});}'''
OLD_CID="const cureId=(d,c)=>'D'+d+' vs C'+c;"
NEW_CID=OLD_CID+'''
// judge_fix2 FIX 3 (run 32212, judgment 885: "D5 vs C5 ..." refused as "no RESTATED line for D5"): the RESTATED lines for an item. The lines whose
// label is the item's own; failing those, for a bare Dn item the collision lines "Dn vs Cm", and for a bare Cn item the lines "Dm vs Cn".
function cureRest(o,x){const V=s=>String(s==null?'':s).toUpperCase().replace(/\\s+/g,' ').trim();const L=V(x.link);const ex=o.restated.filter(r=>V(r.link)===L);if(ex.length)return ex;
 const m=L.match(/^([DC])(\\d+)$/);if(!m)return ex;return o.restated.filter(r=>{const k=V(r.link).match(/^D(\\d+) VS C(\\d+)$/);return !!k&&(m[1]==='D'?k[1]===m[2]:k[2]===m[2]);});}'''
OLD_RF="o.restated.filter(r=>U(r.link)===U(x.link))"
NEW_RF="cureRest(o,x)"
OLD_UNK="  return res('UNCURED','unknown rule',null);});}"
NEW_UNK='''  // judge_fix2 FIX 1b: K-X is cured by one RESTATED line for the count line that no longer tags a link UNEXHIBITED for an unanswered witness.
  if(x.rule==='K-X'){const rs=cureRest(o,x);
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(kxLines(x.link+': '+rs[0].text).length)return res('UNCURED','the restated line still tags a link UNEXHIBITED for a pressed witness left unanswered',[rs[0].line]);
   return res('CURED','restated without the unanswered-witness UNEXHIBITED tag',[rs[0].line]);}
  // judge_fix2 E1, E4, E5: K-N, K-K and K-DG8 are cured by one RESTATED line for the item that its own test no longer marks.
  if(x.rule==='K-N'||x.rule==='K-K'||x.rule==='K-DG8'){const rs=cureRest(o,x);const test=x.rule==='K-N'?knLines:x.rule==='K-K'?kkLines:dg8Lines;
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   const txt=/^D\d+/i.test(x.link)?rs[0].text:x.link+': '+rs[0].text;
   if(test(txt).length)return res('UNCURED','the restated line keeps what '+x.rule+' marks',[rs[0].line]);
   if(x.rule==='K-DG8'&&/LINK BROKEN$/.test(rs[0].grade||'')&&o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line]);
   return res('CURED','restated',[rs[0].line]);}
  // judge_fix2 E2: K-SC is cured by a RESTATED line for the link that is not STANDS, by a RESTATED CONCEDED LINKS line that no longer counts the
  // premise, or by a STATEMENT that names a round and quotes words found in that round.
  if(x.rule==='K-SC'){const rs=cureRest(o,x);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(rs.length&&rs[0].grade&&rs[0].grade!=='STANDS'){if(/LINK BROKEN$/.test(rs[0].grade)&&o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line]);return res('CURED','regraded '+rs[0].grade,[rs[0].line]);}
   const rc=o.restated.filter(r=>r.link==='CONCEDED LINKS');if(x.premise!=null&&rc.length===1&&!cntItems('CONCEDED LINKS: '+rc[0].text).some(i=>i.link===x.premise&&(i.tag==='UNEXHIBITED'||(i.tag==='CONCEDED'&&!knNarrow(i)))))return res('CURED','the restated count no longer counts premise '+x.premise,[rc[0].line]);
   const st=stmtOf(x);if(st){const rk=['CR1','CR2','CR3','DR1','DR2','DR3'].find(k=>new RegExp('\\['+k+'\\]').test(st)&&typeof R[k]==='string'&&stmtQ(st).some(q=>cureFound(q,R[k])));if(rk)return res('CURED','statement names '+rk+' and quotes it',['STATEMENT: '+st]);}
   return res('UNCURED',rs.length?'the restated line still grades '+x.link+' STANDS, and no statement names a round and quotes it':'no regrade, no restated count and no statement naming a round and quoting it, for '+x.link,rs.length?[rs[0].line]:null);}
'''+OLD_UNK

# ---------- W1: a written RESPONSE line for every flagged item ----------
OLD_KEY="const CURE_KEY=/^(RESTATED|RETRACTED|CORRECTED RESULT|CORRECTED COUNT|CORRECTED STANDING|PRESSED|SHORT|STATEMENT)[ \\t]*:[ \\t]*(.*)$/;"
NEW_KEY="const CURE_KEY=/^(RESTATED|RETRACTED|CORRECTED RESULT|CORRECTED COUNT|CORRECTED STANDING|PRESSED|SHORT|STATEMENT|RESPONSE)[ \\t]*:[ \\t]*(.*)$/; // judge_fix2 W1: RESPONSE"
OLD_OI="const o={restated:[],withdrawn:[],result:[],count:[],standing:[],pressed:[],short:[],statement:[],malformed:[],prose:[]};"
NEW_OI="const o={restated:[],withdrawn:[],result:[],count:[],standing:[],pressed:[],short:[],statement:[],response:[],malformed:[],prose:[]};"
OLD_ST="  else if(k[1]==='STATEMENT'&&(m=r.match(/^(.+?)\\s*\\|\\s*(\\S.{9,})$/)))o.statement.push({label:m[1].trim(),text:m[2].trim(),line:l});"
NEW_ST=OLD_ST+"\n  else if(k[1]==='RESPONSE'&&(m=r.match(/^(.+?)\\s*\\|\\s*(\\S.{9,})$/)))o.response.push({label:m[1].trim(),text:m[2].trim(),line:l}); // judge_fix2 W1"
OLD_SO=" const stmtOf=(x)=>{"
NEW_SO=''' // judge_fix2 W1 (operator, 2026-11-02): every flagged item needs a RESPONSE line in the judge's own words; the label names the item as the
 // FLAGGED ITEMS list labels it (cureLabel), or its link, or for K-G3 the side's STANDING.
 const respOf=(x)=>{const lb=U(cureLabel(x));const r=o.response.find(s=>{const L=U(s.label);return L.includes(lb)||(x.link?L.includes(U(x.link)):(L.includes(x.side)&&L.includes('STANDING')));});return r?r.text:null;};
 const stmtOf=(x)=>{'''
OLD_RES="return {...x,judge_statement:stmtOf(x),status,"
NEW_RES="return {...x,judge_statement:stmtOf(x),response:respOf(x),status,"
OLD_FAIL="  if(!reply||!reply.ok)return res('UNCURED','cure call failed: '+(reply?reply.why:'no reply'),null);\n"
NEW_FAIL=OLD_FAIL+"  if(!respOf(x))return res('UNCURED','no written response',null); // judge_fix2 W1: no RESPONSE line for the item leaves it UNCURED\n"
OLD_ONLY='+"Only these lines are read.'
NEW_ONLY='+"RESPONSE: <the flagged item, as labelled above> | <in your own words: whether you accept the mark and why, or why the mark is wrong, naming the round and quoting its words>. Write one RESPONSE line for every flagged item, in addition to the cure line it needs; an item with no RESPONSE line is not cured, whatever else the reply holds. "\n +"Only these lines are read.'
# ---------- W2: the enforcer log rows (every cure node carries the builder; the panel, single-judge and alternate checks fill them) ----------
OLD_CR="function cureReport(seat,v){"
NEW_CR='''// judge_fix2 W2: one row per flagged item for debate_enforcer_log, in full: the cure prompt sent (the last user message of the cure body), the
// full reply, the RESPONSE line, the result and its reason. The audit-line excerpt (cureReport) is kept as it was.
function enfPrompt(body){try{if(body&&Array.isArray(body.messages)){const u=body.messages.filter(m=>m&&m.role==='user');const c=u.length?u[u.length-1].content:null;return typeof c==='string'?c:JSON.stringify(c);}
 if(body&&Array.isArray(body.contents)){const u=body.contents.filter(m=>m&&m.role==='user');const c=u.length?u[u.length-1].parts:null;return Array.isArray(c)?c.map(p=>p&&p.text||'').join(''):null;}}catch(e){}return null;}
function enfRows(meta,v,reply,body){const T=new Date().toISOString();const ps=enfPrompt(body);const full=reply&&reply.ok?String(reply.text==null?'':reply.text):null;
 return (v||[]).map(x=>({run_token:meta.run_token||null,seat:meta.seat||null,seat_role:meta.role||null,judge_model:meta.model||null,kind:'cure',rule:x.rule,item:x.rule==='K-G3'?x.side+' STANDING':(x.link||null),
  flagged_line:x.line||null,prompt_sent:ps,full_reply:full,reply_error:reply&&!reply.ok?String(reply.why||'no reply'):(reply?null:'no reply'),response_line:x.response||null,cure_status:x.status,cure_reason:x.why||null,at:T}));}
function cureReport(seat,v){'''
OLD_PCC="return [{json:{...PP,bodies,summary,alt_needed}}];"
NEW_PCC='''// judge_fix2 W2: the enforcer log rows of every panel or reserve seat with flagged items.
const enforcer_log=[];summary.forEach((s,i)=>{const all=s.drv||[];if(!all.length)return;const r=rs.find(x=>x.cure&&x.cure.idx===i)||null;
 const v=cureVerdicts(all,r?r.reply:{ok:false,why:'no cure call was made for this seat'},r&&r.cure?r.cure.broken:null,r&&r.cure?r.cure.rounds:null);
 enfRows({run_token:altS.run_token,seat:s.seat,role:s.substitute?'reserve':'panel',model:(r&&r.cure&&r.cure.model)||s.api_model||null},v,r?r.reply:null,r&&r.cure?r.cure.body:null).forEach(x=>enforcer_log.push(x));});
return [{json:{...PP,bodies,summary,alt_needed,enforcer_log}}];'''
OLD_CCK="return [{json:{...base,...(cc?{verdict_tag:cc.word}:{}),"
NEW_CCK="const enforcer_log=enfRows({run_token:$('Init Seats').first().json.run_token,seat:'single',role:'single',model:(r&&r.cure&&r.cure.model)||base.judge_model||null},v,r?r.reply:null,r&&r.cure?r.cure.body:null); // judge_fix2 W2\nreturn [{json:{...base,enforcer_log,...(cc?{verdict_tag:cc.word}:{}),"
OLD_AMR="const panel_effective=summary.map(x=>x.seat).sort();"
NEW_AMR='''// judge_fix2 W2: the run's enforcer log, sent whole to record_enforcer_log by the node Write Enforcer Log: the single judge's (Cure Check), the
// panel's and reserve's (Panel Cure Check), each alternate's cure rows, each alternate's first reply in full, and the full first reply of a
// panel seat that failed closed (Panel Check failed_raw).
const enforcer_log=[].concat(PP.enforcer_log||[]);try{if($('Cure Check').isExecuted)($('Cure Check').first().json.enforcer_log||[]).forEach(x=>enforcer_log.push(x));}catch(e){}
AP.forEach((r,k)=>{const a=r.alt;const T=new Date().toISOString();let first=null;try{first=r.ok?JSON.parse(r.body).payload.verdict_raw:(r.raw_text||null);}catch(e){first=r.raw_text||null;}
 enforcer_log.push({run_token:S.run_token,seat:a.seat,seat_role:'alternate',judge_model:a.api_model,kind:'alternate_reply',rule:null,item:'replaces '+a.removed_seat,flagged_line:null,prompt_sent:null,full_reply:first,reply_error:r.ok?null:String(r.why||''),response_line:null,cure_status:null,cure_reason:null,at:T});
 if(r.ok&&(r.drv||[]).length){const c=CN.find(x=>x.cure&&x.cure.who==='alternate'&&x.cure.k===k)||null;const v=cureVerdicts(r.drv,c?c.reply:{ok:false,why:'no cure call was made for this alternate'},c&&c.cure?c.cure.broken:null,c&&c.cure?c.cure.rounds:null);
  enfRows({run_token:S.run_token,seat:a.seat,role:'alternate',model:a.api_model},v,c?c.reply:null,c&&c.cure?c.cure.body:null).forEach(x=>enforcer_log.push(x));}});
try{const fr=$('Panel Check').first().json.failed_raw;if(fr)enforcer_log.push({run_token:S.run_token,seat:fr.seat,seat_role:'panel',judge_model:fr.model||null,kind:'failed_reply',rule:null,item:fr.kind||null,flagged_line:fr.detail||null,prompt_sent:null,full_reply:fr.text,reply_error:fr.detail||null,response_line:null,cure_status:null,cure_reason:null,at:fr.at});}catch(e){}
const panel_effective=summary.map(x=>x.seat).sort();'''
OLD_AMRET="return [{json:{...PP,bodies,summary,panel_effective,"
NEW_AMRET="return [{json:{...PP,enforcer_log,enforcer_log_body:{p_debate_id:PP.debate_id||null,p_run_token:S.run_token,p_rows:enforcer_log},bodies,summary,panel_effective,"
# Panel Check: keep the full first reply of a failed slot beside sub (not inside it: sub is written to panel_substitution as it was).
OLD_PCK=" if(!c.ok)fails.push({slot:i,seat:jd.seat,kind:c.kind,detail:c.detail,msg:c.msg});});"
NEW_PCK=" if(!c.ok){let txt=null;try{txt=envelope(jd.seat,raw).text;}catch(e){try{txt=JSON.stringify(raw);}catch(e2){txt=null;}}fails.push({slot:i,seat:jd.seat,model:jd.api_model||null,kind:c.kind,detail:c.detail,msg:c.msg,text:txt});}}); // judge_fix2 W2: the full first reply"
OLD_PCR=" return [{json:{run_token:TOK,sub:{slot:f.slot,failed_seat:f.seat,substitute:RES.seat,failure_kind:f.kind,detail:f.detail,at:new Date().toISOString()}}}];}"
NEW_PCR=" const at=new Date().toISOString();return [{json:{run_token:TOK,sub:{slot:f.slot,failed_seat:f.seat,substitute:RES.seat,failure_kind:f.kind,detail:f.detail,at},failed_raw:{seat:f.seat,model:f.model,kind:f.kind,detail:f.detail,text:f.text,at}}}];}"

# ---------- flagKey (Format Markdown, Build Save Body) and the REVIEW count (Extract Independent Verdict) ----------
OLD_FK="\\((K-S|K-C)\\) -- (D\\d+(?: vs C\\d+)?|REASONING|KEYSTONE|RESULT|(?:DEFENSE|CHALLENGE) STANDING|(?:CHALLENGER )?CONCEDED LINKS)(?=[ ;:.,\\]]|$)/"
NEW_FK="\\((K-S|K-C|K-X|K-N|K-SC|K-K|K-DG8)\\) -- (D\\d+(?: vs C\\d+)?|REASONING|KEYSTONE|RESULT|(?:DEFENSE|CHALLENGE) STANDING|(?:DEFENDER|CHALLENGER) CHAIN MARK|(?:CHALLENGER )?CONCEDED LINKS)(?=[ ;:.,\\]]|$)/"
OLD_NF="DEBATE RULE VIOLATION \\((?:K-U|K-S2|K-C)\\)"
NEW_NF="DEBATE RULE VIOLATION \\((?:K-U|K-S2|K-C|K-X|K-N|K-SC|K-K|K-DG8)\\)"

# ---------- FIX 5: alternate pool ----------
OLD_AB="  if(!QA&&used.indexOf(a.api_model)>=0)return 'G3: '+a.api_model+' already sits as the other alternate';return null;};"
NEW_AB='''  // judge_fix2 FIX 5 (runs 32157, 32212): the alternates are called together, so whether one is seated is known only at Alternate Merge. A pool
  // model is offered to every removed seat; Alternate Merge seats it once (G3 there), and one tried and not seated is free for the other seats.
  return null;};'''
OLD_AM=" const old=JSON.parse(bodies[a.idx]).payload;"
NEW_AM=''' // judge_fix2 FIX 5: G3 at merge. A model already seated for an earlier seat (panel order) is not seated twice; one tried and NOT SEATED blocks nothing.
 {const dup=a.qualify?null:seated.find(s=>s.alternate_api_model===a.api_model);
  if(dup){tried.push({removed_seat:a.removed_seat,alternate:a.seat,api_model:a.api_model,result:'NOT SEATED',why:'G3: '+a.api_model+' already sits as the other alternate (seated for '+dup.removed_seat+')',verdict_raw:b.payload.verdict_raw});return;}}
'''+OLD_AM

# ---------- FIX 6: citation check ----------
OLD_LB="const lastBook=(t,pos)=>{let b=null;for(const x of String(t).slice(0,pos).matchAll(BREF)){"
NEW_LB='''// judge_fix2 FIX 6b (run 32205 "(18:7-8)" read as Ezra; run 32212 "(1:24)" read as Genesis): a bare reference takes its book only from a book
// named earlier in the same sentence and clause (a sentence end, a semicolon or a line break closes it; quoted words are masked when finding
// it). With none, it is left out, unchecked, rather than given the book of another sentence.
const QMASK=new Map();
const clauseAt=(t,pos)=>{t=String(t);let mk=QMASK.get(t);if(mk===undefined){mk=t.replace(/[“"][^”"\\n]{0,400}[”"]/g,s=>' '.repeat(s.length));QMASK.set(t,mk);}
 let s=0;const rx=/[.!?]["”’')\\]*_]*\\s+(?=[A-Z\\[*_"“(#>-])|;|\\n/g;let x;while((x=rx.exec(mk))!==null&&x.index<pos)s=x.index+x[0].length;return s;};
const lastBook=(t,pos)=>{let b=null;for(const x of String(t).slice(clauseAt(t,pos),pos).matchAll(BREF)){'''
OLD_GR='''const groups=[...new Set([...items.map(i=>i.book+'|'+i.chapter+'|'+i.v1+'|'+i.v2),...items.filter(i=>i.alt).map(i=>i.alt.book+'|'+i.alt.chapter+'|'+i.alt.verse+'|'+(i.alt.v2||i.alt.verse))])].slice(0,90); // primaries first, then alt verses
const BASE='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/kjv_verses?select=book,chapter,verse,text';
const url=groups.length?BASE+'&limit=1000&or='+encodeURIComponent('('+groups.map(g=>{const [b,c,a,z]=g.split('|');return 'and(book.eq."'+b+'",chapter.eq.'+c+',verse.gte.'+a+',verse.lte.'+z+')';}).join(',')+')'):BASE+'&id=eq.-1';
return [{json:{items:items.slice(0,300),scanned:items.length,url_cited:url}}];'''
NEW_GR='''// judge_fix2 FIX 6a (run 32205: 15 real link-round verses; run 32212: Isaiah 8:18; all "CITED VERSE DOES NOT EXIST"): the read held only the first
// 90 verse groups, and the link-round quotations, scanned last, fell past the cut; a verse not read was then reported as not existing. Now one
// condition per book and chapter lists its verses (verse.in.(...)), about half the old length for the same verses; conditions are added in
// order (primaries first, then alt verses) while the URL stays within 7,000 characters, and an item whose chapter was not read is marked
// unread, which Quote Compare reports NOT CHECKED, never DOES NOT EXIST.
const VG={};const vadd=(b,c,a,z)=>{if(!b||!(c>0)||!(a>0))return;const k=b+'|'+c;(VG[k]=VG[k]||new Set());for(let v=a;v<=Math.min(z||a,a+175);v++)VG[k].add(v);};
const items3=items.slice(0,300);items3.forEach(i=>vadd(i.book,i.chapter,i.v1,i.v2));items3.forEach(i=>{if(i.alt)vadd(i.alt.book,i.alt.chapter,i.alt.verse,i.alt.v2||i.alt.verse);});
const BASE='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/kjv_verses?select=book,chapter,verse,text';
const conds=[];const readK=new Set();let ulen=BASE.length+'&limit=1000&or='.length+6;
for(const [k,s] of Object.entries(VG)){const [b,c]=k.split('|');const cnd='and(book.eq."'+b+'",chapter.eq.'+c+',verse.in.('+[...s].sort((x,y)=>x-y).join(',')+'))';const add=encodeURIComponent(cnd+',').length;if(ulen+add>7000)continue;ulen+=add;conds.push(cnd);readK.add(k);}
const url=conds.length?BASE+'&limit=1000&or='+encodeURIComponent('('+conds.join(',')+')'):BASE+'&id=eq.-1';
return [{json:{items:items3.map(i=>readK.has(i.book+'|'+i.chapter)?i:{...i,unread:true}),scanned:items.length,url_cited:url,chapters_cited:Object.keys(VG).length,chapters_read:conds.length}}];'''
OLD_QC="const items=S.items.map(i=>{\n"
NEW_QC="const items=S.items.map(i=>{\n if(i.unread)return {...i,status:'NOT CHECKED'}; // judge_fix2 FIX 6a: the verse was not read (URL budget), so it is not checked; never DOES NOT EXIST\n"

# ---------- E6: synthesis checks (Build Save Body; review lines, no model call) ----------
OLD_RN="const RN=FF.length?FF.join(' '):null;"
NEW_RN=r"""// judge_fix2 E6 (runs 32157 E1-E3, 32205 G, 32212 H): checks on the synthesis text, recorded as review lines in review_notes (no model call
// and no cure exists on this path). (a) a "both agree" or "both seats state" item that does not quote words found in a defender round and words
// found in a challenger round; (b) "every link (or pressed witness) answered" while a premise of either closing list carries a verse the
// answering side's later rounds never name (a light copy of the PRESSED-WITNESS LEDGER test: book and chapter:verse); (c) an item listed as
// charged by neither side whose own words (five in a row, quotations set aside) stand in either side's closing premise list; (d) a statement that the guards bind both seats.
{const SY=String(d.synthesis||'');const SL=SY.split('\n');const QF=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`]/g,'').replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
 const DEF=QF([d.cr1,d.cr2,d.cr3].join('\n')),CHA=QF([d.gr1,d.gr2,d.dr3].join('\n'));const qin=(q,T)=>{const x=QF(q);return x.split(' ').length>=3&&T.includes(x);};
 const cut=s=>String(s).replace(/\s+/g,' ').trim().slice(0,200).replace(/[\[\]]/g,'');const SX=[];
 SL.forEach((l,i)=>{if(!/\bboth\s+(?:seats|sides|parties|debaters)\s+(?:agree|state|affirm|hold|accept|grant|concede)|\bboth\s+(?:agree|affirm)\b/i.test(l))return;
  const qs=[...[l,SL[i+1]||''].join(' ').matchAll(/["“]([^"”]{8,})["”]/g)].map(m=>m[1]);
  if(!(qs.some(q=>qin(q,DEF))&&qs.some(q=>qin(q,CHA))))SX.push('(S-A) -- a "both agree" item does not quote both sides\' own words: "'+cut(l)+'"');});
 const lastAfter=(t,re)=>{t=String(t||'');let i=-1;for(const m of t.matchAll(re))i=m.index;return i<0?'':t.slice(i);};
 const LD=lastAfter(d.gr2,/UNSUPPORTED-L4 PREMISES/gi),LC=lastAfter(d.cr3,/CHALLENGER.{0,2}S UNSUPPORTED-L4 PREMISES/gi);
 const unnamed=(list,ans)=>{const A=String(ans||'');const out=[];for(const m of String(list).matchAll(/\b((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+(\d{1,3}):(\d{1,3})/g)){const b3=m[1].replace(/\s/g,'').slice(0,3).toLowerCase();const cv=m[2]+':'+m[3];
  let ok=false;for(const k of A.matchAll(new RegExp('(?<![0-9:])'+cv.replace(':','\\:')+'(?![0-9])','g'))){const pre=A.slice(Math.max(0,k.index-40),k.index).replace(/\s/g,'').toLowerCase();if(pre.includes(b3)){ok=true;break;}}if(!ok)out.push(m[1]+' '+cv);}return out;};
 const UN=unnamed(LD,[d.cr2,d.cr3].join('\n')).concat(unnamed(LC,[d.gr2,d.dr3].join('\n')));
 SL.forEach(l=>{if(/\b(?:every|each)\s+(?:link|premise|pressed\s+(?:row|witness|verse)|witness)\s+(?:\S+\s+){0,3}?(?:was|were|is|are|been)\s+answered\b|\ball\s+(?:the\s+)?(?:links|premises|pressed\s+(?:rows|witnesses|verses)|witnesses)\s+(?:\S+\s+){0,2}?(?:were|are|been)\s+answered\b/i.test(l)&&UN.length)
  SX.push('(S-B) -- "every link answered" while the closing lists carry verses no later round of the answering side names ('+UN.slice(0,8).join(', ')+(UN.length>8?', ...':'')+'): "'+cut(l)+'"');});
 {let on=false;const LT=QF(LD+'\n'+LC);for(const l of SL){if(/^\s*#/.test(l)){on=/neither side|no charge on either|uncharged|charges? neither/i.test(l);continue;}if(/neither side.s list charges|no charge on either side|charged by neither/i.test(l)){on=true;continue;}
  if(!on||!/^\s*(?:[-*•]|\d+[.)])\s+/.test(l))continue;const w=QF(l.replace(/["“][^"”\n]*["”]/g,' | ')).split(' ').filter(Boolean); /* the item's own words: a quoted verse or round stands in both places by nature */let hit=null;for(let k=0;k+5<=w.length;k++){const g=w.slice(k,k+5).join(' ');if(!/\d+:\d+|\|/.test(g)&&LT.includes(g)){hit=g;break;}}
  if(hit)SX.push('(S-C) -- an item listed as charged by neither side stands in a side\'s premise list ("'+hit+'"): "'+cut(l)+'"');}}
 SL.forEach(l=>{if(/\bguards?\b[^.\n]{0,80}\bbinds?\b[^.\n]{0,40}\bboth\s+(?:seats|sides)\b|\bbinds?\s+both\s+seats\b|\bboth\s+seats\b[^.\n]{0,40}\bbound\s+by\b[^.\n]{0,30}\bguards?\b/i.test(l))SX.push('(S-D) -- the synthesis says the guards bind both seats; the guards bind the record seat only: "'+cut(l)+'"');});
 SX.forEach(x=>FF.push('[AUDIT v23: SYNTHESIS CHECK '+x+'. REVIEW THIS ROW.]'));}
const RN=FF.length?FF.join(' '):null;"""

done=[]
for f in sorted(os.listdir(B)):
    s=open(f'{B}/{f}').read();nm=f[:-3];t=s
    if nm in ('Panel Build','Build Independent Verdict'):
        t=rep(t,OLD_CL,NEW_CL,nm,2)
    if nm=='Format Markdown':
        t=rep(t,OLD_FM,NEW_FM,nm)
    if nm in ('Format Markdown','Build Save Body'):
        t=rep(t,OLD_FK,NEW_FK,nm)
    if nm=='Build Save Body': t=rep(t,OLD_RN,NEW_RN,nm)
    if nm=='Extract Independent Verdict':
        t=rep(t,OLD_NF,NEW_NF,nm)
    if 'function netLines' in s:
        t=rep(t,OLD_NS1,NEW_NS1,nm); t=rep(t,OLD_NP,NEW_NP,nm); t=rep(t,OLD_NH,NEW_NH,nm); t=rep(t,OLD_SK,NEW_SK,nm); t=rep(t,OLD_PUSH,NEW_PUSH,nm); t=rep(t,OLD_IT,NEW_IT,nm); t=rep(t,OLD_NR,NEW_NR,nm); t=rep(t,OLD_NM,NEW_NM,nm); t=rep(t,OLD_CLS,NEW_CLS,nm)
    if 'function drvCheck' in s:
        t=rep(t,'function drvCheck(',KX_DEFS+'function drvCheck(',nm); t=rep(t,OLD_KCPUSH,NEW_KCPUSH,nm)
    if 'function cureVerdicts' in s:
        t=rep(t,OLD_RG,NEW_RG,nm); t=rep(t,OLD_FORM,NEW_FORM,nm); t=rep(t,OLD_LBL,NEW_LBL,nm); t=rep(t,OLD_ASK,NEW_ASK,nm); t=rep(t,OLD_KEYS,NEW_KEYS,nm)
        t=rep(t,OLD_RL,NEW_RL,nm); t=rep(t,OLD_RD,NEW_RD,nm); t=rep(t,OLD_CID,NEW_CID,nm); t=rep(t,OLD_RF,NEW_RF,nm,3); t=rep(t,OLD_UNK,NEW_UNK,nm)
        t=rep(t,OLD_KEY,NEW_KEY,nm); t=rep(t,OLD_OI,NEW_OI,nm); t=rep(t,OLD_ST,NEW_ST,nm); t=rep(t,OLD_SO,NEW_SO,nm); t=rep(t,OLD_RES,NEW_RES,nm); t=rep(t,OLD_FAIL,NEW_FAIL,nm); t=rep(t,OLD_ONLY,NEW_ONLY,nm); t=rep(t,OLD_CR,NEW_CR,nm)
    if nm=='Alternate Build': t=rep(t,OLD_AB,NEW_AB,nm)
    if nm=='Alternate Merge': t=rep(t,OLD_AM,NEW_AM,nm); t=rep(t,OLD_AMR,NEW_AMR,nm); t=rep(t,OLD_AMRET,NEW_AMRET,nm)
    if nm=='Panel Cure Check': t=rep(t,OLD_PCC,NEW_PCC,nm)
    if nm=='Cure Check': t=rep(t,OLD_CCK,NEW_CCK,nm)
    if nm=='Panel Check': t=rep(t,OLD_PCK,NEW_PCK,nm); t=rep(t,OLD_PCR,NEW_PCR,nm)
    if nm=='Citation Scan': t=rep(t,OLD_LB,NEW_LB,nm); t=rep(t,OLD_GR,NEW_GR,nm)
    if nm=='Quote Compare': t=rep(t,OLD_QC,NEW_QC,nm)
    if t!=s: open(f'{N}/{f}','w').write(t);done.append(nm)
    elif os.path.exists(f'{N}/{f}'): os.remove(f'{N}/{f}')
print(len(done),'nodes written:',', '.join(done))
