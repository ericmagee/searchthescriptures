let raw=$input.first().json?.choices?.[0]?.message?.content||'UNKNOWN';const raw0=raw;const prev=$('Build Independent Verdict').first().json;
// HARDENED v3 (2026-07-28, Eric-ruled): v2 = word-boundary matching + fail-closed UNKNOWN + DEFENSE/CHALLENGE STANDING parsing.
// v3 adds UNICODE-HYPHEN TOLERANCE. A judge that writes SELF-SUPPORTED with U+2011 (non-breaking hyphen) or any
// U+2010-U+2015 / U+2212 dash scored UNGRADED under v2 even though the line was present and correct. Proven live
// 2026-07-28 on the W1 ChatGPT self-test (DeepSeek judge, defense_standing=UNGRADED against a correct SELF-SUPPORTED line).
// v4 (2026-07-28, Eric-ruled, BB-0036/BB-0037): mask CHALLENGER CONCEDED LINKS before the defender CONCEDED LINKS parse
// (substring collision, fail-silent mis-attribution). Proven by 136-row zero-diff offline replay before deploy.
// v5 (2026-07-28, Eric-ruled): gated fail-loud markers — a graded STANDING with a missing CONCEDED LINKS integer now
// appends a REVIEW marker instead of passing silently. Gated on the standing so legitimately integer-free formats stay quiet.
// v6 (2026-07-30, Eric-ruled): MARKDOWN-EMPHASIS TOLERANCE. A judge that writes "**DEFENSE STANDING:** SELF-SUPPORTED"
// scored UNGRADED under v5 against a line that was present and correct -- the separator class admits whitespace, colons
// and every unicode dash but not asterisks. Proven live 2026-07-30 on Claude vs ChatGPT (exec 17929, DeepSeek judge):
// both standings UNGRADED and both integers null while the judge text held SELF-SUPPORTED/1 and PROP-DEPENDENT/2.
// Emphasis is stripped from the PARSING copy only; raw is saved verbatim. Same failure class as the v3 unicode-hyphen bug.
// v7 (2026-07-30, Eric-ruled): LINE-ANCHORED LABELS. The anchor words also occur in the judge's own prose
// ("the defender expressly conceded Links 1-4 and 6"), and v6 took the FIRST match anywhere, so prose beat the
// labelled line. Proven live 2026-07-30 on Grok Defends: stored conceded_links=1 while the label line read 5 --
// a COLLAPSED defense recorded as conceding one link. Also found retroactively on a 2026-07-26 row (stored 4,
// label 2), so it corrupts in BOTH directions. The v5 fail-loud gate stayed silent because a standing was graded
// AND an integer was found -- just the wrong integer. FIX: prefer a match anchored to line start (the label is
// always its own line; prose never is); fall back to the old unanchored match ONLY if no anchored label exists,
// and when that fallback fires, say so loudly. Measured over all 174 stored verdicts: 104 hold a line-anchored
// label, ZERO hold a prose-only match, so anchoring loses no row that parses today.
const D='[\\s\\u2010-\\u2015\\u2212-]';
const upper=raw.toUpperCase().replace(/[*_`]+/g,'');
// v8 A1 (BB-3442 step 5): mask a line-anchored CLAUSE line BEFORE the verdict scan. \bBROKEN\b matches
// inside BROKEN-1, so today the verdict word only wins by being on line 1. Masking removes the order dependency.
const upperV=upper.replace(/(^|\n)[ \t]*CLAUSE[^\n]*/g,'$1XCLAUSELINEX');const head=upperV.slice(0,200);const pos=(w)=>{const m=head.match(new RegExp('\\b'+w+'\\b'));return m?m.index:Infinity;};const pB=pos('BROKEN'),pP=pos('PARTIAL'),pH=pos('HELD');let verdict;if(raw==='UNKNOWN'){verdict='UNKNOWN';}else if(pB!==Infinity||pP!==Infinity||pH!==Infinity){verdict=(pB<=pP&&pB<=pH)?'BROKEN':(pP<=pH)?'PARTIAL':'HELD';}else{const vm=upperV.match(new RegExp('VERDICT[\\s:'+D.slice(3,-1)+']*\\b(HELD|PARTIAL|BROKEN)\\b'));verdict=vm?vm[1]:'UNKNOWN';}
if(verdict==='UNKNOWN'){raw+='\n\n[EXTRACTOR v3: NO PARSEABLE VERDICT - verdict_tag=UNKNOWN (fail-closed). REVIEW THIS ROW.]';}
if($input.first().json?.choices?.[0]?.finish_reason==='length'){raw+='\n\n[TRUNCATED: finish_reason=length -- raise max_tokens. REVIEW THIS ROW.]';}
const STAND='(SELF'+D+'SUPPORTED|PROP'+D+'DEPENDENT|COLLAPSED)';const SEP='[\\s:'+D.slice(3,-1)+']*?';
const norm=(s)=>s.replace(/[\s‐-―−]/,'-');
// v8 A2: standings are LINE-ANCHORED with a loud unanchored fallback -- v7's shape, which fixed this
// class for the integers and left the standings open. Measured: 6 of 256 stored verdicts carry a standing
// mid-line, 0 in label form, so the gap is real but has never fired live.
const anchStand=(label)=>{const l=upper.match(new RegExp('(^|\\n)[ \\t]*'+label+'\\s+STANDING'+SEP+STAND));if(l)return{v:norm(l[2]),fb:false};const a=upper.match(new RegExp(label+'\\s+STANDING'+SEP+STAND));return a?{v:norm(a[1]),fb:true}:{v:'UNGRADED',fb:false};};const dsR=anchStand('DEFENSE');let defense_standing=dsR.v;if(dsR.fb){raw+='\n\n[EXTRACTOR v14: DEFENSE STANDING TAKEN FROM PROSE, NO LINE-ANCHORED LABEL. REVIEW THIS ROW.]';}
const upperD=upper.replace(/CHALLENGER\s+CONCEDED\s+LINKS/g,'XCHALLENGERCONCEDEDLINKSX');const clLine=upperD.match(new RegExp('(^|\\n)[ \\t]*CONCEDED\\s+LINKS'+SEP+'([0-9]+)'));const clAny=upperD.match(new RegExp('CONCEDED\\s+LINKS'+SEP+'([0-9]+)'));let conceded_links=clLine?parseInt(clLine[2],10):(clAny?parseInt(clAny[1],10):null);const clFellBack=(!clLine&&!!clAny);
if(defense_standing==='UNGRADED'){raw+='\n\n[EXTRACTOR: NO DEFENSE STANDING LINE FOUND - defense_standing=UNGRADED. REVIEW THIS ROW.]';}
if(defense_standing!=='UNGRADED'&&conceded_links===null){raw+='\n\n[EXTRACTOR: DEFENSE STANDING PRESENT BUT NO CONCEDED LINKS INTEGER - conceded_links=null. REVIEW THIS ROW.]';}
const csR=anchStand('CHALLENGE');let challenge_standing=csR.v;if(csR.fb){raw+='\n\n[EXTRACTOR v14: CHALLENGE STANDING TAKEN FROM PROSE, NO LINE-ANCHORED LABEL. REVIEW THIS ROW.]';}
const cclLine=upper.match(new RegExp('(^|\\n)[ \\t]*CHALLENGER\\s+CONCEDED\\s+LINKS'+SEP+'([0-9]+)'));const cclAny=upper.match(new RegExp('CHALLENGER\\s+CONCEDED\\s+LINKS'+SEP+'([0-9]+)'));let challenger_conceded_links=cclLine?parseInt(cclLine[2],10):(cclAny?parseInt(cclAny[1],10):null);const cclFellBack=(!cclLine&&!!cclAny);
if(challenge_standing==='UNGRADED'){raw+='\n\n[EXTRACTOR: NO CHALLENGE STANDING LINE FOUND - challenge_standing=UNGRADED. REVIEW THIS ROW.]';}
if(challenge_standing!=='UNGRADED'&&challenger_conceded_links===null){raw+='\n\n[EXTRACTOR: CHALLENGE STANDING PRESENT BUT NO CHALLENGER CONCEDED LINKS INTEGER - challenger_conceded_links=null. REVIEW THIS ROW.]';}
if(clFellBack){raw+='\n\n[EXTRACTOR v7: CONCEDED LINKS INTEGER TAKEN FROM MID-SENTENCE PROSE, NO LINE-ANCHORED LABEL FOUND. REVIEW THIS ROW.]';}
// K3 (advisor ruling, binding): STANDING COUNT. The W1 standing line carries "L=<n> c=<n>" after the standing word. Where both parse and the
// standing the judge gave disagrees with the count (COLLAPSED iff 2c > L, a tie is NOT COLLAPSED), write a review line. A grade is never rewritten.
// Where the count-given defense standing would change the clause the judge's own counts give, the clause check below rejects through rej().
// If L or c does not parse (older text, or the placeholder echoed), nothing is written.
const K3=(()=>{const g=(label,given)=>{if(given==='UNGRADED')return null;const m=upper.match(new RegExp('(^|\\n)[ \\t]*'+label+'\\s+STANDING'+SEP+STAND+'([^\\n]*)'))||upper.match(new RegExp(label+'\\s+STANDING'+SEP+STAND+'([^\\n]*)'));if(!m)return null;
  const q=m[m.length-1].match(/^[\s:,;.(‐-―−-]*L\s*=\s*([0-9]+)[\s,;]*C\s*=\s*([0-9]+)(?![0-9])/);if(!q)return null;const L=parseInt(q[1],10),c=parseInt(q[2],10);const calc=(2*c>L)?'COLLAPSED':'not COLLAPSED';
  return ((given==='COLLAPSED')!==(2*c>L))?{given,L,c,calc}:null;};return {d:g('DEFENSE',defense_standing),c:g('CHALLENGE',challenge_standing)};})();
if(K3.d){raw+='\n\n[EXTRACTOR v18: STANDING COUNT -- DEFENSE STANDING '+K3.d.given+' but L='+K3.d.L+' c='+K3.d.c+' gives '+K3.d.calc+'. REVIEW THIS ROW.]';}
if(K3.c){raw+='\n\n[EXTRACTOR v18: STANDING COUNT -- CHALLENGE STANDING '+K3.c.given+' but L='+K3.c.L+' c='+K3.c.c+' gives '+K3.c.calc+'. REVIEW THIS ROW.]';}
if(cclFellBack){raw+='\n\n[EXTRACTOR v7: CHALLENGER CONCEDED LINKS INTEGER TAKEN FROM MID-SENTENCE PROSE, NO LINE-ANCHORED LABEL FOUND. REVIEW THIS ROW.]';}
// v8 A3: the new lines, all line-anchored.
const clauseLineM=upper.match(new RegExp('(^|\\n)([ \\t]*CLAUSE'+SEP+'(?:BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|HELD-1)[^\\n]*)'));
const clauseLine=clauseLineM?clauseLineM[2]:null;
const clauseM=clauseLine?clauseLine.match(new RegExp('CLAUSE'+SEP+'(BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|HELD-1)')):null;
const clause=clauseM?clauseM[1]:null;const fam=clause?clause.split('-')[0]:null;
// v14 (BB-3442 step 8a): n/w/k is read from the CLAUSE LINE ITSELF. Unanchored it was the v7
// prose-beats-label class on the newest field, and it corrupted BOTH ways: a legal BROKEN-1 whose
// Line 1 prose said k=0 drew two false ILLEGAL markers, and an illegal PARTIAL-1 with w=0 passed
// silently when prose supplied w=1. The triple feeds the recompute, so a wrong one defeats it.
const NWK=/N\s*=\s*([0-9]+)\s+W\s*=\s*([0-9]+)\s+K\s*=\s*([0-9]+)/;
let nwk=clauseLine?clauseLine.match(NWK):null;let nwkFellBack=false;
if(!nwk){const a=upper.match(NWK);if(a){nwk=a;nwkFellBack=true;}}
const n=nwk?parseInt(nwk[1],10):null,w=nwk?parseInt(nwk[2],10):null,k=nwk?parseInt(nwk[3],10):null;
if(nwkFellBack){raw+='\n\n[EXTRACTOR v14: n/w/k TAKEN FROM PROSE, NOT FROM THE CLAUSE LINE. REVIEW THIS ROW.]';}
const resultM=upper.match(new RegExp('(^|\\n)[ \\t]*RESULT'+SEP+'(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)'));
const verdict_result=resultM?resultM[2]:null;
// v10 N1b (BB-3499): COLLISION POINTS is the LAST output line, so a block-boundary match ran to end of text
// and counted closing prose. A grade now counts only on a line that is itself a collision entry.
const collisionsPresent=/(^|\n)[ \t]*COLLISION POINTS/.test(upper);
// v12 B1 (BB-3507): the entry filter now tolerates a LIST PREFIX and "VS." -- measured at my hand, 5 of 31
// stored DeepSeek verdicts carry list-prefixed lines and 3 already write VS. with a period, while 0 bullet a
// label. Without this the filter fails in BOTH directions: a bulleted illegal row passes silently and a
// bulleted legal one is falsely rejected.
const collLines=upper.split('\n').filter(L=>/^[ \t]*(?:[-•]|\d+[.)])?[ \t]*D\d+\s+VS\.?\s+C\d+\b/.test(L)||/^[ \t]*COLLISION POINTS[ \t]*:?[ \t]*(?:[-•]|\d+[.)])?[ \t]*D\d+\s+VS\.?\s+C\d+\b/.test(L));
// v18 AUDIT LAYER (BB-4490 step 1, rulings BB-4503 Q1 A): the per-link record is the judge's own COLLISION POINTS
// section, read entry by entry. One state per declared link D1..Dn: WITHDRAWN, BROKEN (DEFENDER LINK BROKEN), or STANDS
// (STANDS, UNDERDETERMINED or CHALLENGER LINK BROKEN). It reads the entry shapes the v12 line filter dropped --
// "D5: D5 vs C6 (...)" and "D3: vs C5 (...)" -- which made v17 count 0 broken and mark a false ILLEGAL on two stored rows.
const colSec=(()=>{const L=upper.split('\n');const i=L.findIndex(x=>/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?COLLISION POINTS\b/.test(x));if(i<0)return null;const out=[];const f=L[i].replace(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?COLLISION POINTS[ \t]*:?/,'');if(f.trim())out.push(f);for(let j=i+1;j<L.length;j++){const x=L[j];if(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?(CITATION CHECK|OUT-OF-ROUND CONCESSIONS|CHALLENGER CHAIN MARK|KEYSTONE|CLAUSE|RESULT|DEFENSE STANDING|CHALLENGE STANDING|CONCEDED LINKS|CHALLENGER CONCEDED LINKS|LINK AUDIT)\b/.test(x))break;if(/^[ \t]*\[(EXTRACTOR|REVIEW|TRUNCATED|AUDIT)/.test(x))break;out.push(x);}return out;})();
const colMap={};const colUnparsed=[];let chBroken=0;
if(colSec){for(const x0 of colSec){const x=x0.trim();if(!x)continue;const m=x.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m){colUnparsed.push(x.slice(0,60));continue;}const rest=m[2];let st=null;if(/^VS\.?\s/.test(rest)){const g=rest.match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);st=g?g[1]:null;}else{const g=rest.match(/^(WITHDRAWN|STANDS)\b/);st=g?g[1]:null;}if(!st){colUnparsed.push(x.slice(0,60));continue;}if(st==='CHALLENGER LINK BROKEN')chBroken++;(colMap[+m[1]]=colMap[+m[1]]||[]).push(st);}}
const colState=(i)=>{const a=colMap[i];if(!a)return null;const w=a.includes('WITHDRAWN'),b=a.includes('DEFENDER LINK BROKEN');return (w&&b)?'CONFLICT':w?'WITHDRAWN':b?'BROKEN':'STANDS';};
const colIds=Object.keys(colMap).map(Number).sort((a,b)=>a-b);
const dw=colIds.filter(i=>colState(i)==='WITHDRAWN').length;const dk=colIds.filter(i=>colState(i)==='BROKEN').length;
const defBroken=dk;
// v8 A4: fail loud, GATED on the new format, so pre-v8 rows stay silent by construction.
const newFormat=!!(clause||verdict_result||collisionsPresent||nwk);
if(newFormat){
 if(!clause){raw+='\n\n[EXTRACTOR v14: NEW FORMAT PRESENT BUT NO CLAUSE LINE - clause=null. REVIEW THIS ROW.]';}
 if(!verdict_result){raw+='\n\n[EXTRACTOR v14: NEW FORMAT PRESENT BUT NO RESULT LINE - result=null. REVIEW THIS ROW.]';}
 if(!nwk){raw+='\n\n[EXTRACTOR v14: NEW FORMAT PRESENT BUT NO n/w/k TRIPLE. REVIEW THIS ROW.]';}
 if(!collisionsPresent){raw+='\n\n[EXTRACTOR v14: NEW FORMAT PRESENT BUT NO COLLISION POINTS LINE. REVIEW THIS ROW.]';}
}
// v8 A5: illegal-output rejection, eight predicates. 6-8 were added on BB-3485 D2, which found that
// Line 1 HELD with CLAUSE PARTIAL-1 -- this order's own disease -- passed the first five untouched.
// The row is still stored; rejection MARKS it and never discards evidence.
let verdict_rejected=false;const rej=(m)=>{verdict_rejected=true;raw+='\n\n[EXTRACTOR v14 ILLEGAL: '+m+' REVIEW THIS ROW.]';};
if(defense_standing==='SELF-SUPPORTED'&&defBroken>0){rej('DEFENSE SELF-SUPPORTED WITH '+defBroken+' DEFENDER LINK BROKEN.');}
if(challenge_standing==='SELF-SUPPORTED'&&chBroken>0){rej('CHALLENGE SELF-SUPPORTED WITH '+chBroken+' CHALLENGER LINK BROKEN.');}
if(defense_standing==='SELF-SUPPORTED'&&challenge_standing==='SELF-SUPPORTED'&&(defBroken+chBroken)>0){rej('MUTUAL SELF-SUPPORTED OVER A COLLISION GRADED BROKEN.');}
// v9 N3 (BB-3493): RECOMPUTE the clause from the judge's own n/w/k and standing, first match wins, and
// compare. One predicate subsumes the two ad-hoc checks and catches PARTIAL-1 with k>=1 and BROKEN-2
// that fails 2w>n, both of which passed before.
// v15 (BB-4005/4009): KEYSTONE, CHAIN COUNT and SELF-REPORT. n is the DEFENDER'S declared-chain count (D4);
// the challenger's listed count is recorded beside it and NEVER compared to n (BB-3975).
// v16 E3 (BB-4012, A3): a judge echoing the template line verbatim -- KEYSTONE: D6 -- WITHDRAWN |
// BROKEN | STANDS -- read as WITHDRAWN and forced BROKEN-2 on the recompute. It must read as NO
// KEYSTONE LINE and fire loud instead.
// v17 F1 (BB-4016, A3): v16 did that with a POSITIVE terminator set -- line end, period, dash --
// which then rejected a CR, a semicolon, a comma and an open paren after a present and correct
// state, 4 of 4, and the CR case contradicted the CR tolerance settled at BB-3984. A3's negative
// form is taken, with two enumerators added: the echo also appears with slashes and with OR.
// 16 of 16 at my hand, the four F1 shapes and three echo forms among them.
const KSM=upper.match(new RegExp('(^|\\n)[ \\t]*KEYSTONE'+SEP+'D([0-9]+)'+SEP+'(WITHDRAWN|BROKEN|STANDS)(?![A-Z0-9])(?![ \\t]*(?:\\||/|OR[ \\t]))'));
const keystone_link=KSM?parseInt(KSM[2],10):null;
const keystone_state=KSM?KSM[3]:null;
if(!KSM){raw+='\n\n[EXTRACTOR v15: NEW FORMAT PRESENT BUT NO KEYSTONE LINE - keystone=null. REVIEW THIS ROW.]';}
else{
 if(n!==null&&keystone_link!==n){raw+='\n\n[EXTRACTOR v15: KEYSTONE NAMES D'+keystone_link+' BUT CLAUSE n='+n+'. REVIEW THIS ROW.]';}
 const ownM=upper.match(new RegExp('(^|\\n)[ \\t]*D'+keystone_link+SEP+'(WITHDRAWN|STANDS)'));
 const own=ownM?ownM[2]:null;
 if(own&&keystone_state!=='BROKEN'&&keystone_state!==own){raw+='\n\n[EXTRACTOR v15: KEYSTONE SAYS '+keystone_state+' BUT D'+keystone_link+' ITSELF SAYS '+own+'. REVIEW THIS ROW.]';}
 // v16 E3 (BB-4012, A3): BROKEN was exempt from every check, so a keystone graded BROKEN with k=0
 // and its own D<n> entry reading STANDS raised nothing at all. BROKEN must now be EARNED on the
 // COLLISION POINTS lines and must agree with k.
 if(keystone_state==='BROKEN'){
  const kb=(colState(keystone_link)==='BROKEN');
  if(!kb){raw+='\n\n[EXTRACTOR v16: KEYSTONE SAYS BROKEN BUT NO COLLISION LINE GRADES D'+keystone_link+' DEFENDER LINK BROKEN. REVIEW THIS ROW.]';}
  if(k===0){raw+='\n\n[EXTRACTOR v16: KEYSTONE SAYS BROKEN BUT THE CLAUSE LINE SAYS k=0. REVIEW THIS ROW.]';}
 }
}
// CHAIN COUNT, by the closed instrument (BB-3969/3980/3984): dashes mapped, LAST anchored heading line, sequence run.
// ORDER (BB-6755): a chain line may also be written with a dash after its number ("D1 -", "1 -"; dashes are folded first).
const chainCount=(t)=>{if(typeof t!=='string')return null;const L=t.replace(/[‐-―−]/g,'-').split('\n');let hi=-1;
 for(let i=0;i<L.length;i++){if(/^\s*#*\s*\**\s*DECLARED CHAIN\s*:?\s*\**\s*(?:-{1,3}[^\n]*)?:?\s*$/i.test(L[i]))hi=i;}
 if(hi<0)return null;let c=0;
 for(let i=hi+1;i<L.length;i++){const m=L[i].match(/^(?:#+\s*)?\**D?([0-9]+)(?:\.|\s+-{1,3}(?:\s|$))/i);if(!m)continue;if(parseInt(m[1],10)===c+1)c++;else break;}
 return c;};
const chain_count=chainCount(prev&&prev.cr1);
const chain_lines=(()=>{const t=prev&&prev.cr1;if(typeof t!=='string')return [];const L=t.replace(/[‐-―−]/g,'-').split('\n');let hi=-1;
 for(let i=0;i<L.length;i++){if(/^\s*#*\s*\**\s*DECLARED CHAIN\s*:?\s*\**\s*(?:-{1,3}[^\n]*)?:?\s*$/i.test(L[i]))hi=i;}
 if(hi<0)return [];const out=[];let c=0;
 for(let i=hi+1;i<L.length;i++){const m=L[i].match(/^(?:#+\s*)?\**D?([0-9]+)(?:\.|\s+-{1,3}(?:\s|$))/i);if(!m)continue;if(parseInt(m[1],10)===c+1){c++;out.push(L[i].slice(0,60));}else break;}
 return out;})();
// N CHECK (BB-3975): judge's n against CHAIN COUNT only. Fires on NULL either side or divergence.
if(n===null||chain_count===null||n!==chain_count){raw+='\n\n[EXTRACTOR v15: N CHECK - CLAUSE n='+n+' AGAINST DECLARED CHAIN COUNT '+chain_count+'. REVIEW THIS ROW.]';}
// SELF-REPORT CHECK (BB-3975): the challenger's PREMISE COUNT against its OWN list. Never compared to n.
// v16 E1 (BB-4012, A3): $ without the m flag is END OF STRING, so a trailing newline, a CRLF,
// a blank line or one line of prose after the count read premise_count=null and fired the marker
// on a CLEAN row -- 3 of 3 in A3's harness and 6 of 8 in mine. Anchor per line with a lookahead
// and take the LAST match, so an instruction echoed earlier in the text cannot win.
const PCRE=/(^|\n)[ \t]*PREMISE COUNT[ \t:]*([0-9]+)[ \t\r]*(?=\n|$)/g;
const pcSrc=(typeof prev.gr2==='string'?prev.gr2:'').toUpperCase().replace(/[*_`]+/g,'');
let pcM=null;{let m;PCRE.lastIndex=0;while((m=PCRE.exec(pcSrc))!==null){pcM=m;if(m.index===PCRE.lastIndex)PCRE.lastIndex++;}}
const premise_count=pcM?parseInt(pcM[2],10):null;
// The challenger's OWN list, counted by the same closed instrument, so PREMISE COUNT can be checked against it.
const seqCount=(t,head)=>{if(typeof t!=='string')return null;const L=t.replace(/[‐-―−]/g,'-').split('\n');let hi=-1;
 for(let i=0;i<L.length;i++){if(head.test(L[i]))hi=i;}
 if(hi<0)return null;let c=0;
 for(let i=hi+1;i<L.length;i++){const m=L[i].match(/^(?:#+\s*)?\**([0-9]+)\./);if(!m)continue;if(parseInt(m[1],10)===c+1)c++;else break;}
 return c;};
const premise_sequence=seqCount(prev&&prev.gr2,/^\s*#*\s*\**\s*UNSUPPORTED-L4 PREMISES\s*:?\s*\**\s*:?\s*$/i);
// v16 E5 (BB-4012, A3): BB-3969/3975 print the COUNTED LINES for BOTH counts on every grade. I
// printed the chain and not the premises, so the self-report finding could not be read back.
const seqLines=(t,head)=>{if(typeof t!=='string')return [];const L=t.replace(/[‐-―−]/g,'-').split('\n');let hi=-1;
 for(let i=0;i<L.length;i++){if(head.test(L[i]))hi=i;}
 if(hi<0)return [];const out=[];let c=0;
 for(let i=hi+1;i<L.length;i++){const m=L[i].match(/^(?:#+\s*)?\**([0-9]+)\./);if(!m)continue;if(parseInt(m[1],10)===c+1){c++;out.push(L[i].slice(0,60));}else break;}
 return out;};
const premise_lines=seqLines(prev&&prev.gr2,/^\s*#*\s*\**\s*UNSUPPORTED-L4 PREMISES\s*:?\s*\**\s*:?\s*$/i);
if(premise_count===null){raw+='\n\n[EXTRACTOR v15: NO PREMISE COUNT LINE - premise_count=null. REVIEW THIS ROW.]';}
// SELF-REPORT CHECK: challenger-internal only. A mismatch is a self-report finding, NEVER an n fault.
if(premise_count!==null&&premise_sequence!==null&&premise_count!==premise_sequence){raw+='\n\n[EXTRACTOR v15: SELF-REPORT - PREMISE COUNT '+premise_count+' AGAINST THE CHALLENGERS OWN LIST OF '+premise_sequence+'. REVIEW THIS ROW.]';}
raw+='\n\n[EXTRACTOR v15 COUNTED LINES, CHAIN ('+chain_count+'): '+chain_lines.join(' | ')+']';
raw+='\n\n[EXTRACTOR v16 COUNTED LINES, PREMISES ('+premise_sequence+'): '+premise_lines.join(' | ')+']';
if(clause&&n!==null&&w!==null&&k!==null){
 const expect=(k>=1)?'BROKEN-1':((2*w>n||keystone_state==='WITHDRAWN')?'BROKEN-2':((w>=1)?'PARTIAL-1':((defense_standing==='COLLAPSED')?'PARTIAL-2':'HELD-1')));
 if(clause!==expect){rej('CLAUSE '+clause+' AGAINST ITS OWN COUNTS n='+n+' w='+w+' k='+k+' ds='+defense_standing+', WHICH GIVE '+expect+'.');}
}
// A5.6 LINE 1 AGAINST CLAUSE -- the order's own disease.
if(clause&&verdict!=='UNKNOWN'&&verdict!==fam){rej('LINE 1 '+verdict+' AGAINST CLAUSE '+clause+'.');}
// A5.7 RESULT AGAINST THE VERDICT.
if(verdict_result){
 if(verdict==='BROKEN'&&verdict_result!=='CHALLENGER WINS'){rej('BROKEN WITH RESULT '+verdict_result+'.');}
 if(verdict==='PARTIAL'&&verdict_result!=='UNDERDETERMINED'){rej('PARTIAL WITH RESULT '+verdict_result+'.');}
 if(verdict==='HELD'&&verdict_result==='CHALLENGER WINS'){rej('HELD WITH RESULT CHALLENGER WINS.');}
 // v9 N2 (BB-3493): HELD gives DEFENDER WINS only where the challenger is not SELF-SUPPORTED or a collision
 // is graded CHALLENGER LINK BROKEN. Everything else is UNDERDETERMINED. This was unchecked.
 if(verdict==='HELD'&&verdict_result==='DEFENDER WINS'&&challenge_standing==='SELF-SUPPORTED'&&chBroken===0){rej('HELD WITH RESULT DEFENDER WINS WHILE THE CHALLENGER IS SELF-SUPPORTED AND NO CHALLENGER LINK IS BROKEN.');}
}
// A5.8 STATED k AGAINST THE COLLISION LINE'S OWN COUNT.
if(k!==null&&collisionsPresent&&k!==defBroken){rej('STATED k='+k+' AGAINST '+defBroken+' DEFENDER LINK BROKEN ON COLLISION POINTS.');}
// v13 A (BB-3506, which VACATED BB-3500 ruling 1): NO new key is emitted at all. The live CHECK
// debate_results_outcome_d5_vocabulary accepts only NULL, DEFENDER PREVAILS, CHALLENGER PREVAILS,
// DEFENDER PREVAILS, WEAKENED and UNGRADED - REVIEW, verified at my hand, so writing a RESULT verbatim
// would fail the insert and cost the whole debate row. RESULT, CLAUSE, n, w, k and every rejection all
// ride in independent_verdict_raw, which the flow stores whole and the step-8 derivation quotes.
// v18 AUDIT LAYER, continued (BB-4490 step 1). Coverage and cross-check of the COLLISION POINTS map against the CLAUSE line.
if(colSec){
 if(n!==null){for(let i=1;i<=n;i++){if(!colMap[i]){raw+='\n\n[AUDIT v18: COLLISION POINTS CARRIES NO ENTRY FOR D'+i+' OF n='+n+'. REVIEW THIS ROW.]';}}
  const extra=colIds.filter(i=>i>n);if(extra.length){raw+='\n\n[AUDIT v18: COLLISION POINTS NAMES D'+extra.join(', D')+' BEYOND n='+n+'. REVIEW THIS ROW.]';}}
 for(const i of colIds){if(colState(i)==='CONFLICT'){raw+='\n\n[AUDIT v18: D'+i+' IS BOTH WITHDRAWN AND DEFENDER LINK BROKEN ON COLLISION POINTS. REVIEW THIS ROW.]';}}
 for(const u of colUnparsed){raw+='\n\n[AUDIT v18: COLLISION POINTS ENTRY NOT READ: "'+u+'". REVIEW THIS ROW.]';}
 if(w!==null&&dw!==w){raw+='\n\n[AUDIT v18: CLAUSE w='+w+' BUT COLLISION POINTS WITHDRAWS '+dw+'. REVIEW THIS ROW.]';}
}
raw+='\n\n[AUDIT v18 COLLISION MAP: '+(colSec?colIds.map(i=>'D'+i+'='+colState(i)).join(' ')+' | w='+dw+' k='+dk:'NO COLLISION POINTS SECTION')+']';
// CONCEDED COUNTS DERIVED FROM THE ITEMIZATION (WO-17 form on W1's clause scheme). Each item of the CONCEDED LINKS /
// CHALLENGER CONCEDED LINKS line that carries a tag -- CONCEDED (stated|conditional) or UNEXHIBITED (...) -- counts the
// links it names ("LINKs 3, 4, and 6" counts three; "LINK none" counts one each time). An item tagged VOID counts for
// neither side. v19 (BB-4890, fix A1): the judge's stated integer is stored; an itemized count that differs is named
// in a flag. C<n>, D<n> and LINK <n> name the same link number and count once per item (ruling BB-4934 Q5). Where no tag parses and the
// judge stated a positive integer, the stated value is kept and the gap is flagged.
const itemIds=(it)=>{const ids=[];let m;const r1=/\b(?:D|C|LR)(\d+[A-Z]?)\b/g;while((m=r1.exec(it))!==null)ids.push('L'+m[1]);
 const r2=/\bLINKS?\s+((?:\d+[A-Z]?|NONE)(?:\s*(?:,\s*AND|,|AND|–|-|TO)\s*(?:\d+[A-Z]?))*)/g;
 while((m=r2.exec(it))!==null){const body=m[1];if(/^NONE/.test(body)){ids.push('NONE#'+ids.length);continue;}
  const parts=body.split(/\s*(?:,\s*AND|,|AND)\s*/);for(const p of parts){const rg=p.match(/^(\d+)\s*(?:–|-|TO)\s*(\d+)$/);if(rg){for(let q=+rg[1];q<=+rg[2];q++)ids.push('L'+q);}else if(p.trim())ids.push('L'+p.trim());}}
 const u=new Set(ids.filter(x=>!/^NONE#/.test(x)));return u.size+ids.filter(x=>/^NONE#/.test(x)).length;};
const TAGC=/\bCONCEDED\s*\(?\s*(?:STATED|CONDITIONAL)\b|\bUNEXHIBITED\s*\(/;
const deriveConc=(line)=>{if(line===null)return null;let nC=0,nV=0,tags=0;for(const it of line.split(/;|\.\s+(?=[A-Z\[])/)){const isV=/\bVOID\b/.test(it)&&!/\b(?:NONE|NO|NOT|NOTHING|NEITHER)\b(?:\s+[A-Z]+){0,2}\s+VOID\b/.test(it);const isT=TAGC.test(it);if(!isV&&!isT)continue;tags++;const c=Math.max(1,itemIds(it));if(isV)nV+=c;else nC+=c;}return {nC,nV,tags};};
const concLine=(src,lab)=>{const m=src.match(new RegExp('(^|\\n)[ \\t]*'+lab+SEP+'(?:[0-9]+)?([^\\n]*)'));return m?m[2]:null;};
const dDef=deriveConc(concLine(upperD,'CONCEDED\\s+LINKS'));const dCh=deriveConc(concLine(upper,'CHALLENGER\\s+CONCEDED\\s+LINKS'));
let defVoid=dDef?dDef.nV:0,chVoid=dCh?dCh.nV:0;
const applyConc=(d,stated,side)=>{if(!d)return stated;if(d.tags===0){if(stated!==null&&stated>0){raw+='\n\n[AUDIT v18: '+side+' CONCEDED '+stated+' STATED BUT NO TAGGED ITEM PARSED; STATED VALUE KEPT. REVIEW THIS ROW.]';return stated;}return (stated===null)?null:0;}if(stated!==null&&stated!==d.nC){raw+='\n\n[AUDIT v19: '+side+' CONCEDED ITEMIZATION COUNTS '+d.nC+' BUT JUDGE STATED '+stated+'. STATED VALUE STORED. REVIEW THIS ROW.]';return stated;}return d.nC;};
conceded_links=applyConc(dDef,conceded_links,'DEFENDER');challenger_conceded_links=applyConc(dCh,challenger_conceded_links,'CHALLENGER');
// v19 item 7 (BB-4890, ruling BB-4934 Q4): a SELF-SUPPORTED standing with conceded links above 0 contradicts the rubric
// (links conceded or unexhibited make a defense PROP-DEPENDENT). Flagged through rej: the judgment is kept, the row is contested.
if(defense_standing==='SELF-SUPPORTED'&&conceded_links>0){rej('DEFENSE SELF-SUPPORTED WITH '+conceded_links+' CONCEDED LINKS.');}
if(challenge_standing==='SELF-SUPPORTED'&&challenger_conceded_links>0){rej('CHALLENGE SELF-SUPPORTED WITH '+challenger_conceded_links+' CHALLENGER CONCEDED LINKS.');}
if(defVoid||chVoid){raw+='\n\n[AUDIT v18 VOID: defender '+defVoid+', challenger '+chVoid+' (excluded from both counts)]';}
// v20 K2 (fault F9(b), advisor ruling, binding): WITHDRAWN MISSED. A judge printed "D<k>: STANDS" (or KEYSTONE: D<k> -- STANDS)
// while the defender's link round [CR3] states LINK <k>: CONCEDED. The code never rewrites the grade: it writes a review line,
// and where the missed withdrawals would change the clause the judge's own counts give, it rejects through rej() as line 172 does.
// LINK <k> in [CR3] is the declared chain link D<k> (D3 Build: "the chain-link number written on that premise's line, not its
// position in the list"); k runs 1..n, n = the DECLARED CHAIN count. Pre-protocol rows answered by list position (LINK 1..m in
// order, no [premise p], a label multiset the challenger's UNSUPPORTED-L4 PREMISES list does not carry); those are mapped through
// that list's own LINK labels. A link [CR3] both concedes and supports is a SPLIT LINK (own line, no rejection); a link the judge
// names VOID in its CONCEDED LINKS itemization (D<n>, LINK <n>, or premise <p> through the list) gets no line.
const K2=(()=>{const DM=(s)=>String(s||'').replace(/[‐-―−]/g,'-');
 const gL=DM(prev&&prev.gr2).split('\n');let gh=-1;for(let i=0;i<gL.length;i++){if(/^\s*#*\s*\**\s*UNSUPPORTED-L4 PREMISES\s*:?\s*\**\s*:?\s*$/i.test(gL[i]))gh=i;}
 const labs=[];if(gh>=0){let c=0;for(let i=gh+1;i<gL.length;i++){const m=gL[i].match(/^(?:#+\s*)?\**([0-9]+)\./);if(!m)continue;if(parseInt(m[1],10)!==c+1)break;c++;const lm=gL[i].replace(/[*_`]+/g,'').match(/^(?:#+\s*)?[0-9]+\.\s*LINK\s*([0-9]+|NONE)\b/i);labs.push(lm?lm[1].toUpperCase():null);}}
 const ent=[];const seen=new Set();
 for(const x of DM(prev&&prev.cr3).replace(/[*_`]+/g,'').toUpperCase().split('\n')){if(/^[ \t#>]*CHALLENGER.{0,2}S UNSUPPORTED-L4 PREMISES[ \t:]*$/.test(x))break;
  const m=x.match(/^[ \t#>•-]*LINK[ \t]+([0-9]+|NONE)[ \t]*(?:\[[ \t]*PREMISE[ \t]*([0-9]+)[ \t]*\])?[ \t]*:?[ \t]*(SUPPORTED|CONCEDED)\b/);if(!m)continue;
  const key=m[1]+'#'+(m[2]||'');if(seen.has(key+'#'+m[3]))continue;seen.add(key+'#'+m[3]);ent.push({lab:m[1],p:m[2]?+m[2]:null,st:m[3],key});}
 const keys=[...new Set(ent.map(e=>e.key))];const kl=keys.map(x=>x.split('#')[0]);const ms=(a)=>a.slice().sort().join(',');
 const pmode=ent.length>0&&ent.every(e=>e.p===null)&&keys.length===labs.length&&kl.every((x,i)=>x===String(i+1))&&labs.every(x=>x!==null)&&ms(labs)!==ms(kl);
 if(pmode){for(const e of ent){e.lab=labs[+e.lab-1];}}
 const conc=new Set(ent.filter(e=>e.st==='CONCEDED'&&/^[0-9]+$/.test(e.lab)).map(e=>+e.lab));const sup=new Set(ent.filter(e=>e.st==='SUPPORTED'&&/^[0-9]+$/.test(e.lab)).map(e=>+e.lab));
 const vIds=new Set();const cl=concLine(upperD,'CONCEDED\\s+LINKS');
 if(cl!==null){for(const it of cl.split(/;|\.\s+(?=[A-Z\[])/)){const isV=/\bVOID\b/.test(it)&&!/\b(?:NONE|NO|NOT|NOTHING|NEITHER)\b(?:\s+[A-Z]+){0,2}\s+VOID\b/.test(it);if(!isV)continue;
  let m;const r1=/\b(?:D|C|LR)(\d+)\b/g;while((m=r1.exec(it))!==null)vIds.add(+m[1]);
  const r2=/\b(LINKS?|PREMISES?)\s+(\d+(?:\s*(?:,\s*AND|,|AND|–|-|TO)\s*\d+)*)/g;
  while((m=r2.exec(it))!==null){const ids=[];for(const p of m[2].split(/\s*(?:,\s*AND|,|AND)\s*/)){const rg=p.match(/^(\d+)\s*(?:–|-|TO)\s*(\d+)$/);if(rg){for(let q=+rg[1];q<=+rg[2];q++)ids.push(q);}else if(/^\d+$/.test(p.trim()))ids.push(+p.trim());}
   for(const q of ids){if(/^PREMISE/.test(m[1])){const lb=labs[q-1];if(lb&&/^[0-9]+$/.test(lb))vIds.add(+lb);}else vIds.add(q);}}}}
 const nD=(chain_count!==null)?chain_count:n;const stands=(i)=>{const s=colState(i);return s==='STANDS'||(s===null&&keystone_link===i&&keystone_state==='STANDS');};
 const miss=[],seq=[];if(nD!==null){for(let i=1;i<=nD;i++){if(!conc.has(i)||!stands(i)||vIds.has(i))continue;if(sup.has(i))seq.push([i,1]);else{miss.push(i);seq.push([i,0]);}}}
 return {miss,seq};})();
for(const [i,sp] of K2.seq){raw+=sp?'\n\n[EXTRACTOR v18: SPLIT LINK D'+i+' -- CR3 concedes and supports premises mapped to it. REVIEW THIS ROW.]':'\n\n[EXTRACTOR v18: WITHDRAWN MISSED D'+i+' -- CR3 states LINK '+i+': CONCEDED; the judge marks it STANDS. REVIEW THIS ROW.]';}
if(K2.miss.length&&clause&&n!==null&&w!==null&&k!==null){
 const E=(ww,ks)=>(k>=1)?'BROKEN-1':((2*ww>n||ks==='WITHDRAWN')?'BROKEN-2':((ww>=1)?'PARTIAL-1':((defense_standing==='COLLAPSED')?'PARTIAL-2':'HELD-1')));
 const ks2=(keystone_state==='STANDS'&&K2.miss.includes(keystone_link))?'WITHDRAWN':keystone_state;const e1=E(w,keystone_state),e2=E(w+K2.miss.length,ks2);
 if(e2!==e1&&clause!==e2){rej('CLAUSE '+clause+' AGAINST ITS OWN COUNTS WITH THE WITHDRAWALS CR3 STATES AND THE JUDGE MISSED (D'+K2.miss.join(', D')+'): n='+n+' w='+w+'+'+K2.miss.length+' k='+k+' keystone='+ks2+' ds='+defense_standing+', WHICH GIVE '+e2+'.');}
}
// K3 clause check (advisor ruling on BB-6002, option b): the count-given defense standing is tested on the K2-adjusted counts (w plus the
// withdrawals K2 found, and its keystone), so one row names one target clause. Placed after K2, which it reads.
if(K3.d&&clause&&n!==null&&w!==null&&k!==null){const wa=w+K2.miss.length,ksa=(keystone_state==='STANDS'&&K2.miss.includes(keystone_link))?'WITHDRAWN':keystone_state;
 const EK=(ds)=>(k>=1)?'BROKEN-1':((2*wa>n||ksa==='WITHDRAWN')?'BROKEN-2':((wa>=1)?'PARTIAL-1':((ds==='COLLAPSED')?'PARTIAL-2':'HELD-1')));const ecK=EK(K3.d.calc);
 if(ecK!==EK(defense_standing)&&clause!==ecK){rej('CLAUSE '+clause+' AGAINST ITS OWN COUNTS WITH THE DEFENSE STANDING ITS L AND c GIVE (L='+K3.d.L+' c='+K3.d.c+' ds='+K3.d.calc+') n='+n+' w='+wa+' k='+k+' keystone='+ksa+', WHICH GIVE '+ecK+'.');}
}
// WO-6 OUT-OF-ROUND CONCESSIONS and WO-7 CHALLENGER CHAIN MARK, ported from the reference (3QGx 2140f650) onto the judge text
// as received. A missing section is a flag only when the judge prompt that produced the text asked for it (audit_prompt
// W1-A1, rulings BB-4503 Q3); on older text it is recorded without a flag.
const asked=(prev&&(prev.audit_prompt==='W1-A1'||prev.audit_prompt==='ODV1-A1'||prev.audit_prompt==='ODV1-A2'));
const askedD=(prev&&prev.audit_prompt==='ODV1-A2');
const src0=raw0.replace(/[*_`]+/g,'');
const oorSec=src0.match(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?OUT-OF-ROUND CONCESSIONS[ \t]*:?[ \t]*\n?([\s\S]*?)(?=\n[ \t]*(?:#+[ \t]*|[-•][ \t]*)?(?:DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK|CITATION CHECK|COLLISION POINTS)\b|(?![\s\S]))/im);
let out_of_round_concessions=null,out_of_round_detail=null;
if(oorSec){const b=(oorSec[1]||'').trim();if(/^NONE\b/i.test(b)){out_of_round_concessions=0;}else{const ls=b.split('\n').map(s=>s.replace(/^[-•\s]+/,'').trim()).filter(s=>s.length>0);const form=ls.filter(s=>/^(DEFENDER|CHALLENGER)[ \t]*\|/i.test(s));const off=ls.filter(s=>!/^(DEFENDER|CHALLENGER)[ \t]*\|/i.test(s));out_of_round_concessions=form.length;out_of_round_detail=form.length?form.join('\n'):null;for(const s of off){raw+='\n\n[AUDIT v18: OUT-OF-ROUND LINE NOT IN THE ASKED FORM, NOT COUNTED: "'+s.slice(0,60)+'". REVIEW THIS ROW.]';}}}
if(out_of_round_concessions===null){raw+=asked?'\n\n[AUDIT v18: OUT-OF-ROUND CONCESSIONS SECTION ABSENT FROM A PROMPT THAT ASKS FOR IT. REVIEW THIS ROW.]':'\n\n[AUDIT v18: OUT-OF-ROUND CONCESSIONS not asked by the prompt that produced this text; null recorded, no flag.]';}
// ORDER (BB-6819): the top mark is FOOTED (was FORGED). Old raw text still reads: FORGED is stored as FOOTED.
const ccmM=src0.match(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?CHALLENGER CHAIN MARK[ \t]*:?[ \t]*(FOOTED|FORGED|STRAINED|SLACK)\b/im);
let challenger_chain_mark=ccmM?ccmM[1].toUpperCase():null;
if(challenger_chain_mark==='FORGED')challenger_chain_mark='FOOTED';
// ORDER (BB-6839, BB-6843): the defender's chain takes the same mark, read by the same rule; its absent line is flagged as the challenger's is,
// but only on text from a prompt that asks for it (audit_prompt ODV1-A2, the J6 prompt); older text records it without a flag.
const dcmM=src0.match(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?DEFENDER CHAIN MARK[ \t]*:?[ \t]*(FOOTED|FORGED|STRAINED|SLACK)\b/im);
let defender_chain_mark=dcmM?dcmM[1].toUpperCase():null;
if(defender_chain_mark==='FORGED')defender_chain_mark='FOOTED';
if(challenger_chain_mark===null){raw+=asked?'\n\n[AUDIT v18: CHALLENGER CHAIN MARK LINE ABSENT FROM A PROMPT THAT ASKS FOR IT. REVIEW THIS ROW.]':'\n\n[AUDIT v18: CHALLENGER CHAIN MARK not asked by the prompt that produced this text; null recorded, no flag.]';}
if(defender_chain_mark===null){raw+=askedD?'\n\n[AUDIT v20: DEFENDER CHAIN MARK LINE ABSENT FROM A PROMPT THAT ASKS FOR IT. REVIEW THIS ROW.]':'\n\n[AUDIT v20: DEFENDER CHAIN MARK not asked by the prompt that produced this text; null recorded, no flag.]';}
// BB-6904 (b), portion 3: DEBATE RULE VIOLATION, rule B on the judge's own BROKEN lines. A line graded DEFENDER LINK BROKEN or
// CHALLENGER LINK BROKEN must exhibit, on the line itself, two lower layers of different kinds (6903): [L1] with quoted words, [L2] with
// a source word (own script, transliteration marks, or a Strong's number; 6926; the Latin range narrowed to transliteration letters, 6936),
// [L3] with a named reference. A tag after "no", "without", "lacks" or "not" never counts. K-G1 (6892): a BROKEN line resting on a
// witness left unanswered while that side's stated conceded count is 0. K-G3 (6934): a side graded SELF-SUPPORTED while any of its
// links is graded BROKEN. K-G2: an absent CITATION CHECK line on text from a prompt that asks for it, recorded only. The counter is
// kb.cjs (git 29caa5c), names prefixed. Lines are chosen the extractor's way: a "D<n> vs" collision entry whose first grade is DEFENDER
// or CHALLENGER LINK BROKEN. No grade is changed; each violation is a review line (6890 AMEND 2).
const DRV_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/;
const DRV_REF_END=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}(?:\s?[-–]\s?\d{1,3})?[\s*_]*$/; // BB-7994 step 6b: a reference written just before its [L3] tag ("Job 15:14 [L3]") names the reference
const DRV_SRC=/[֐-׿Ā-ɏÂÊÎÔÛâêîôû̀-ͯͰ-ϿḀ-ỿἀ-῿ʾʿ]|\b[GH]\d{2,5}\b/; // BB-6926 option A: own script (Hebrew, Greek), transliteration marks, or a Strong's number; no italic alternative
const DRV_QUOTE=/(?:^|[\s(\[{])["“'‘][^"”\n]{4,}?["”'’](?=$|[\s.,;:!?)\]}])/; // a mark inside a word (Joseph's) never opens or closes a quote (BB-6898 D1)
const DRV_NEG=/\b(?:no|without|lacks?|lacking|not)\s+(?:\[L[1-4]\]\s*(?:or|and|\/)\s*)*$/i;
function drvExhibits(line,needQuote,formC,distinct){
  const re=/\[L([1-3])\](?:\s*\/\s*\[L[1-3]\])*/g;let m,n=0;const met=new Set(); // distinct: count layer kinds met, not tags (BB-6899)
  while((m=re.exec(line))!==null){
    const before=line.slice(Math.max(0,m.index-30),m.index);
    if(DRV_NEG.test(before))continue;
    let rest=line.slice(m.index+m[0].length);
    // BB-7994 step 6b: a quotation that opens the text runs to its closing mark before any cut ("Adam knew Eve his wife; and she conceived").
    {const q=rest.match(/^\s*["“]/);let from=0;if(q){const k=rest.slice(q[0].length).search(/["”]/);if(k>=0)from=q[0].length+k+1;}
     const cut=rest.slice(from).search(/;|(?<!\.)\.\s|\s--\s|\s—\s|\[L[1-4]\]/);if(cut>=0)rest=rest.slice(0,from+cut);}
    if(formC){const ts=[...m[0].matchAll(/L([1-3])/g)].map(x=>x[1]);const ok=ts.filter(t=>(t==='1'&&DRV_QUOTE.test(rest))||(t==='2'&&DRV_SRC.test(rest))||(t==='3'&&(DRV_REF.test(rest)||DRV_REF_END.test(line.slice(Math.max(0,m.index-40),m.index)))));if(ok.length){n++;ok.forEach(t=>met.add(t));}continue;}
    const anchor=DRV_REF.test(rest)||DRV_SRC.test(rest);
    if(anchor&&(!needQuote||DRV_QUOTE.test(rest)))n++;
  }
  return distinct?[...met].sort().map(t=>'L'+t):n;
}
const drvKinds=(line)=>drvExhibits(line,false,true,true);
const DRV_WORDS=/\b(?:unanswered|not answered|unnamed|not named|none named|neither named|unaddressed)\b/i;
// THE DEBATE FIXED (BB-7397, DoD 3, binding note BB-7409) K-G6: per premise, both sides. A premise line of the PRESSED-WITNESS LEDGER sent
// to this judge that marks a verse NOT NAMED, and that the judge's CONCEDED LINKS (defender) or CHALLENGER CONCEDED LINKS (challenger) line
// does not count as CONCEDED or UNEXHIBITED (by "premise n", or "LINK m"), is one item. No ledger or no count line in the text: no item.
function drvPromptText(body){try{const b=body||{};const out=[];if(b.systemInstruction&&b.systemInstruction.parts)b.systemInstruction.parts.forEach(p=>out.push(String(p.text||'')));
 (b.messages||[]).forEach(m=>out.push(typeof m.content==='string'?m.content:JSON.stringify(m.content)));(b.contents||[]).forEach(c=>(c.parts||[]).forEach(p=>out.push(String(p.text||''))));return out.join('\n');}catch(e){return '';}}
// THE DEBATE FIXED (BB-7397, DoD 9 as typed fields, BB-7455): the panel judge's own JSON fields counted_premises_defender and
// counted_premises_challenger, each an array of ledger premise numbers. Missing or null: ABSENT. Anything but an array of integers >= 1:
// INVALID, the raw value kept for the mark; so is a number above the count of that side's ledger premises (BB-7457 F-range). No text of the judge's prose is read for the set. Where a field is ABSENT or INVALID the checks
// by number fall back to the stated count (A): an item only at a count of 0. The single judge returns no fields, so it is always (A).
function drvLedgerN(ptext,side){if(typeof ptext!=='string')return null;const i=ptext.indexOf('AGAINST THE DEFENDER, answered in [CR3]:');const j=i<0?-1:ptext.indexOf('AGAINST THE CHALLENGER, answered in [DR3]:',i);
 const k=j<0?-1:ptext.indexOf('A verse marked NOT NAMED',j);if(i<0||j<0||k<0)return null;const n=(side==='DEFENDER'?ptext.slice(i,j):ptext.slice(j,k)).split('\n').filter(l=>/^\s*premise \d+/.test(l)).length;return n||null;}
function drvCPA(val,max){if(val===undefined||val===null)return {present:false,why:'absent'};
 if(!Array.isArray(val)||!val.every(x=>Number.isInteger(x)&&x>=1&&(!max||x<=max))){let r;try{r=JSON.stringify(val);}catch(e){r=String(val);}return {present:false,why:'invalid',raw:String(r).slice(0,200)};}
 return {present:true,set:new Set(val),line:JSON.stringify(val)};}
// The ledger's own map from a defender link to the premises graded against it ("A challenger premise written LINK i: is graded against Di"):
// LINK m -> the premise numbers written "(LINK m)". No LINK label in the ledger: null, and premise n stands for D<n>.
function drvLinkMap(ptext){if(typeof ptext!=='string')return null;const i=ptext.indexOf('AGAINST THE DEFENDER, answered in [CR3]:');const j=i<0?-1:ptext.indexOf('AGAINST THE CHALLENGER, answered in [DR3]:',i);
 if(i<0||j<0)return null;const M={};let any=false;for(const l of ptext.slice(i,j).split('\n')){const m=l.trim().match(/^premise (\d+) \(LINK (\d+)\)/);if(m){any=true;(M[+m[2]]=M[+m[2]]||[]).push(+m[1]);}}
 return any?M:null;}
const drvCountLine=(T,side)=>{const m=T.match(side==='DEFENDER'?/^[ \t>#-]*CONCEDED LINKS[ \t]*:.*$/im:/^[ \t>#-]*CHALLENGER CONCEDED LINKS[ \t]*:.*$/im);return m?m[0]:null;};
// DoD 7 (BB-7420) K-G7: a COLLISION POINTS line graded DEFENDER LINK BROKEN on D<n> whose premise n (or LINK n) the same judge's CONCEDED LINKS
// line does not count. No word test. Not raised where K-G1 already raised the link. The challenger count numbers premises from the defender's
// list, not by C<j> (BB-7430, option (c)): a CHALLENGER LINK BROKEN line is raised only when CHALLENGER CONCEDED LINKS is 0 and the line reads an
// unanswered witness (DRV_WORDS7). LIMIT: with the challenger count above 0, an uncounted challenger premise is not checked by number and is not
// raised. L and the standing are read from the judge's own STANDING lines.
const DRV_WORDS7=/\b(?:unanswered|not answered|unnamed|not named|never named|none named|neither named|unaddressed|unexhibited)\b/i;
function drvBroken(text,dConc,dStand,prior,cConc,cStand,ptext,CPV){const items=[],marks=[];if(typeof text!=='string')return {items,marks};const T=text.replace(/[*_`]+/g,'');
 const cl=drvCountLine(T,'DEFENDER');const lm=T.match(/^[ \t>#-]*DEFENSE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/im);const L=drvLedgerN(ptext,'DEFENDER')||(lm?+lm[1]:null);
 const cm=T.match(/^[ \t>#-]*CHALLENGE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/im);const LC=drvLedgerN(ptext,'CHALLENGER')||(cm?+cm[1]:null);
 // DoD 9 (BB-7455): each side's counted_premises field; ABSENT or INVALID is written to the row; a valid array whose size differs from its count is K-G8.
 const LK=drvLinkMap(ptext);const CP={DEFENDER:drvCPA(CPV&&CPV.DEFENDER,drvLedgerN(ptext,'DEFENDER')),CHALLENGER:drvCPA(CPV&&CPV.CHALLENGER,drvLedgerN(ptext,'CHALLENGER'))};
 for(const sd of ['DEFENDER','CHALLENGER']){const cp=CP[sd],sc=sd==='DEFENDER'?dConc:cConc;if(typeof sc!=='number')continue;
  if(!cp.present){marks.push('[AUDIT v21: COUNTED PREMISES '+sd+' FIELD '+(cp.why==='invalid'?'INVALID: '+String(cp.raw||'').replace(/\[/g,'(').replace(/\]/g,')'):'ABSENT')+' -- the checks by number fall back to the stated count (A).]');continue;}
  if(typeof sc==='number'&&cp.set.size!==sc){items.push({rule:'K-G8',side:sd,link:sd+' COUNTED PREMISES',line:cp.line,premise:null,conc:cp.set.size,st:sd==='DEFENDER'?dStand:cStand,L:sd==='DEFENDER'?L:LC});
   marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G8) -- counted_premises_'+sd.toLowerCase()+' lists '+cp.set.size+' premise(s) while the count is '+sc+'. REVIEW THIS ROW.]');}}
 const dBase=CP.DEFENDER.present?CP.DEFENDER.set.size:dConc;const cZero=cConc===0;
 for(const line of text.split('\n')){const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();
  const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
  const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');const n=+m[1];
  if((prior||[]).some(x=>x.rule==='K-G1'&&x.link===id))continue;
  if(g[1]==='CHALLENGER LINK BROKEN'){if(!cZero||!DRV_WORDS7.test(line))continue;
   items.push({rule:'K-G7',side:'CHALLENGER',link:id,line,premise:null,conc:cConc,st:cStand,L:LC});
   marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G7) -- '+id+' CHALLENGER LINK BROKEN for a witness left unanswered while CHALLENGER CONCEDED LINKS is 0. REVIEW THIS ROW.]');continue;}
  if(typeof dConc!=='number')continue;const ps=LK?(LK[n]||[]):[n];const viaA=!CP.DEFENDER.present||!ps.length;
  if(viaA){if(dConc!==0)continue;}else if(ps.some(q=>CP.DEFENDER.set.has(q)))continue;
  items.push({rule:'K-G7',side:'DEFENDER',link:id,line,premise:ps.length?ps[0]:null,conc:dBase,st:dStand,L});
  marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G7) -- '+id+' DEFENDER LINK BROKEN while '+(viaA?'CONCEDED LINKS is 0':'counted_premises_defender does not list premise '+ps.join(' or '))+'. REVIEW THIS ROW.]');}
 return {items,marks};}
function drvLedger(text,ptext,dConc,cConc,dStand,cStand,CPV){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};
 const i=ptext.indexOf('AGAINST THE DEFENDER, answered in [CR3]:');const j=i<0?-1:ptext.indexOf('AGAINST THE CHALLENGER, answered in [DR3]:',i);const k=j<0?-1:ptext.indexOf('A verse marked NOT NAMED',j);
 if(i<0||j<0||k<0)return {items,marks};
 const prem=s=>s.split('\n').map(l=>l.trim()).filter(l=>/^premise \d+/.test(l));const LG={DEFENDER:prem(ptext.slice(i,j)),CHALLENGER:prem(ptext.slice(j,k))};
 const T=text.replace(/[*_`]+/g,'');
 const countLine=side=>drvCountLine(T,side);

 for(const side of ['DEFENDER','CHALLENGER']){const cp=drvCPA(CPV&&CPV[side],drvLedgerN(ptext,side));const sc=side==='DEFENDER'?dConc:cConc;if(typeof sc!=='number')continue;
  if(!cp.present&&sc!==0)continue;
  for(const l of LG[side]){const m=l.match(/^premise (\d+)(?: \(LINK (\d+)\))?: .*NOT NAMED: (.+)$/);if(!m||/^none\s*$/i.test(m[3]))continue;
   if(cp.present&&cp.set.has(+m[1]))continue;
   const id=side+' premise '+m[1];
   items.push({rule:'K-G6',side,link:id,line:l,conc:cp.present?cp.set.size:sc,st:side==='DEFENDER'?dStand:cStand,L:LG[side].length});
   marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G6) -- '+id+(m[2]?' (LINK '+m[2]+')':'')+': the PRESSED-WITNESS LEDGER marks '+m[3].trim()+' NOT NAMED and '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' does not count it. REVIEW THIS ROW.]');}}
 return {items,marks};}
function drvCheck(text,dConc,cConc,dStand,cStand,askedCC){const items=[],marks=[];if(typeof text!=='string')return {items,marks};const cnt={DEFENDER:0,CHALLENGER:0};
 const LS=text.split('\n');for(let li=0;li<LS.length;li++){const line=LS[li];const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();
  const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
  const side=g[1].split(' ')[0];cnt[side]++;const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');
  // BB-7994 step 6b (BB-8044, 8056): the line under a BROKEN line carries its footing when it is not itself a collision, a label line or a concession line (SIDE | round |).
  const nx=String(LS[li+1]||''),nu=nx.toUpperCase().replace(/[*_`]+/g,'').trim();
  const k=(nu&&!/^(?:[-•]|\d+[.)])?\s*[DC]\d+\b/.test(nu)&&!/^[A-Z][A-Z \-]{2,}:/.test(nu)&&!/^(?:DEFENDER|CHALLENGER)\s*\|/.test(nu))?[...new Set([...drvKinds(line),...drvKinds(nx)])].sort():drvKinds(line);
  if(k.length<2){items.push({rule:'K-B',side,link:id,kinds:k,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION -- '+id+' '+g[1]+' exhibits '+k.length+' layer kind'+(k.length===1?'':'s')+(k.length?' ('+k.join(', ')+')':'')+' of the two rule B requires on the line or the line under it. REVIEW THIS ROW.]');}
  const conc=side==='DEFENDER'?dConc:cConc;
  if(conc===0&&DRV_WORDS.test(line)){items.push({rule:'K-G1',side,link:id,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G1) -- '+id+' '+g[1]+' rests on a witness left unanswered while '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' is 0. REVIEW THIS ROW.]');}
  // BB-6904 rev 8 K-G4: every other LINK BROKEN line answers the pressing-sentence rule too; cured by a PRESSED line whose quotation is
  // found in the named pressing round, or by WITHDRAWN (7176, 7184, 7186).
  else{items.push({rule:'K-G4',side,link:id,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G4) -- '+id+' '+g[1]+' counts a witness as unanswered; the rule counts it only with the quoted pressing sentence and its round. REVIEW THIS ROW.]');}}
 for(const [side,st,lab] of [['DEFENDER',dStand,'DEFENSE'],['CHALLENGER',cStand,'CHALLENGE']]){
  if(st==='SELF-SUPPORTED'&&cnt[side]>0){items.push({rule:'K-G3',side,link:null,line:null});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G3) -- '+lab+' STANDING SELF-SUPPORTED while '+cnt[side]+' '+side+' LINK BROKEN line'+(cnt[side]===1?'':'s')+' stand. REVIEW THIS ROW.]');}}
 if(askedCC&&!/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?CITATION CHECK\b/im.test(text.replace(/[*_`]+/g,'')))marks.push('[AUDIT v21: CITATION CHECK LINE ABSENT FROM A PROMPT THAT ASKS FOR IT (K-G2); recorded, not counted as a violation.]');
 return {items,marks};}
const DRV=drvCheck(raw0,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,askedD);for(const x of DRV.marks)raw+='\n\n'+x;
const DL=drvLedger(raw0,drvPromptText(prev&&prev.verdictBody),conceded_links,challenger_conceded_links,defense_standing,challenge_standing,null);for(const x of DL.items)DRV.items.push(x);for(const x of DL.marks)raw+='\n\n'+x;
const DB=drvBroken(raw0,conceded_links,defense_standing,DRV.items,challenger_conceded_links,challenge_standing,drvPromptText(prev&&prev.verdictBody),null);for(const x of DB.items)DRV.items.push(x);for(const x of DB.marks)raw+='\n\n'+x;
// FLAG COUNT AND DATA CLASS (rulings BB-4503 Q3). A flag is every marker this extractor appended that ends REVIEW THIS
// ROW, truncation included; a verifier recomputes it from the stored text by counting that phrase after the judge text.
// study iff flags <= 1, no ILLEGAL rejection, a parseable verdict and a judge output not cut at max_tokens; contested
// otherwise (truncation ruled a defect inside item 1, BB-4519).
const nflag=(raw.slice(raw0.length).match(/REVIEW THIS ROW/g)||[]).length;
const truncated=($input.first().json?.choices?.[0]?.finish_reason==='length');
const data_class=(nflag<=1&&!verdict_rejected&&verdict!=='UNKNOWN'&&!truncated)?'study':'contested';
raw+='\n\n[AUDIT FLAGS: '+nflag+']';

return [{json:{...prev,independent_verdict_raw:raw,verdict_tag:verdict,defense_standing,conceded_links,challenge_standing,challenger_conceded_links,keystone_link,keystone_state,chain_count,premise_count,premise_sequence,out_of_round_concessions,out_of_round_detail,challenger_chain_mark,defender_chain_mark,data_class,audit_flags:nflag,void_links:defVoid,challenger_void_links:chVoid,debate_rule_violations:DRV.items}}];