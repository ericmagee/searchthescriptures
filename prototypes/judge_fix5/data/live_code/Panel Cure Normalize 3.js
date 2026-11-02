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
    if(formC){const ts=[...m[0].matchAll(/L([1-3])/g)].map(x=>x[1]);const ok=ts.filter(t=>(t==='1'&&DRV_QUOTE.test(rest))||(t==='2'&&(DRV_SRC.test(rest)||drvTranslit(rest,line.slice(Math.max(0,m.index-60),m.index))))||(t==='3'&&(DRV_REF.test(rest)||DRV_REF_END.test(line.slice(Math.max(0,m.index-40),m.index)))));if(ok.length){n++;ok.forEach(t=>met.add(t));}continue;}
    const anchor=DRV_REF.test(rest)||DRV_SRC.test(rest);
    if(anchor&&(!needQuote||DRV_QUOTE.test(rest)))n++;
  }
  return distinct?[...met].sort().map(t=>'L'+t):n;
}
// judge_fix3 A1 (run 32255, DeepSeek D5 vs C2: "[L2] sperma, seed", "[L2] genomenou (made, come to be)", "[L2] ek sou (out of you)" were refused,
// and the seat was not counted): an [L2] tag counts when it sits on a source-language word written in plain letters with its English meaning
// beside it, in parentheses or after a comma, colon, "=" or "meaning". The word stands directly after the tag, or directly before it with
// its meaning ("ek (out of) [L2]", run 32255 Qwen). An English word is never a transliteration (stop list); script, marks and Strong's numbers count as before.
const DRV_TL_STOP=/^(?:the|a|an|and|or|of|in|on|at|to|for|with|by|from|this|that|these|those|its|his|her|their|our|your|word|words|term|terms|verb|verbs|noun|nouns|root|roots|lexical|lexicon|ground|grounds|sense|meaning|greek|hebrew|aramaic|same|no|not|none|see|cf|which|where|who|is|are|was|were|be|been|as|it|he|she|they|we|i|but|if|so|also|only|both|each|every|any|all|text|verse|row|rows|layer|link|chain|here|there|than|then|when|while|after|before|under|over|into|upon|unto|thee|thou|thy|ye|hath|shall|unto)$/i;
const DRV_TL_AFTER=/^\s*[*_]*\s*(?:(?:Greek|Hebrew|Aramaic)\s+)?[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*(?:\(\s*[^()\n]{2,80}\)|,\s*["“]?[a-z]|:\s*["“]?[a-z]|=\s*["“]?[a-z]|\s+(?:meaning|means|i\.e\.)\b)/;
const DRV_TL_BEFORE=/(?:^|[\s(,;])[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*\(\s*[^()\n]{2,80}\)\s*$/;
const drvTranslit=(rest,before)=>{const ok=m=>{if(!m)return false;const w=m[1].split(/\s+/);while(w.length&&DRV_TL_STOP.test(w[0]))w.shift();return w.length>0&&!DRV_TL_STOP.test(w[w.length-1]);};return ok(String(rest||'').match(DRV_TL_AFTER))||ok(String(before||'').match(DRV_TL_BEFORE));};
const drvKinds=(line)=>drvExhibits(line,false,true,true);
const DRV_WORDS=/\b(?:unanswered|not answered|unnamed|not named|none named|neither named|unaddressed)\b/i;
// P2D v6a item 1b (BB-8136): K-S, a STANDS or UNDERDETERMINED line whose ground is that a single verse does not state a link or its
// contrary, naming no later round ([CR2], [CR3], [DR1], [DR2], [DR3]) that answered the witness. Sent to the cure to be regraded on the answered test.
const DRV_STATE=/\b(?:do|does|did)\s+not\s+state\b|\bnot\s+stated\b|\bnever\s+states?\b|\bneither\s+states?\b|\bnor\s+states?\b|\bno\s+(?:\S+\s+){0,4}?(?:verse|row|witness|quotation|passage|text)s?\b(?:\s+\S+){0,4}?\s+(?:states?|names?)\b|\bno\s+\[L[1-4]\](?:\s*\/\s*\[L[1-4]\])*\s+(?:states?|names?)\b|\b(?:met\s+by|without)\s+any\s+(?:verse|row|witness|quotation)\s+that\s+(?:states?|names?)\b/i;
const DRV_ANS=/[\[(](?:CR[2-4]|DR[1-3])\b/i; /* judge_fix3 B3: [CR4], the defender's close, answers; [DR4] answers nothing new */ // judge_fix2 R2: [DR1] answers a press made in [CR1]
// BB-8172 C2 (B): a round named without a bracket after in, at, by or from ("answered in CR3") counts as named, for the K-S2 mark only.
const DRV_BARE=/\b(?:in|at|by|from)\s+(?:CR[2-4]|DR[1-3])\b/i; /* judge_fix3 B3 */ // judge_fix2 R2 // a round named as answering ("answered in CR3"), never a label such as "Challenger-DR1/DR2" (642)
// BB-8172 C2 (A): K-U, a STANDS or UNDERDETERMINED line that itself says a witness went unnamed or unanswered (8193, the 7 MARK lines).
// Positive forms only; a form counts only when the clause before it (since the last ; . or --) holds no negator, so "no witness ...
// was left unanswered" and "neither reading was left unanswered" are not marked (8193, the 14 NO MARK lines).
const DRV_UNANS=[/\b(?:was|were|is|are)\s+(?:left\s+)?(?:not\s+named|unnamed|unanswered|not\s+answered)\b/gi,/,\s*not\s+named\b/gi,/\bleft\s+(?:\S+\s+){1,8}?unnamed\b/gi,/\bunanswered\s+(?:[1-3]\s+)?[A-Z][a-z]+\s+\d+:\d+/g,/\bthe\s+unanswered\s+[a-z]+/gi];
const DRV_UNEG=/\b(?:no|neither|nor|not|never|without|cannot)\b/i;
function drvUnans(line){for(const rx of DRV_UNANS){rx.lastIndex=0;let m;while((m=rx.exec(line))){const pre=line.slice(0,m.index);
  const cl=pre.split(/;|\.(?=\s)|--|—/).pop();if(!DRV_UNEG.test(cl))return m[0];}}return null;}
// BB-8327 D1 and D2 (WALL-1908 as amended; his word at BB-8342): the chain-stating net, K-C. Source: e8327/s_net.js.
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
 /\bstating\b[^;.]{0,40}?\bin\s+(?:its|their)\s+own\s+words\b/i,
 // judge_fix2 FIX 4 (run 32212, judgment 886): "Scripture nowhere states that ..." (RESULT) and "without a single biblical text stating that ..." (CHAIN MARK).
 /\bnowhere\s+(?:states?|names?|says)\b/i,
 // judge_fix2 E7 (run 32212: DeepSeek D6 "no exhibit anywhere says Joseph begat Jesus"; Gemini D6 "No passage in the text states").
 /\bno\s+(?:exhibit|passage|text)s?\s+(?:\S+\s+){0,4}?(?:says?|states?)\b/i,
 /\bwithout\s+(?:a\s+single|any|one)\s+(?:\S+\s+){0,2}?(?:text|verse|witness|row|passage)s?\s+(?:stating|naming|that\s+states?)\b/i];
// checker_fix FIX 1 (kc_fix, run 32157 B2; run 32212 B2): the unanswered-witness test is not the stating ground. Before NET_STATE runs,
// a clause is masked: (a) "<round or side> does not name / never names / not named <witness>" and "<round or side> left <witness> unstated",
// "<witness> went unstated in <round>" (NET_ANSWER); (b) words in double quotation marks, which are a round's or a verse's words, not the
// judge's ground (NET_QUOTE). A clause whose hit follows "CONCEDED (stated)" reports the side's own concession (NET_CONC), as NET_REPORT
// does for "conceded that". A stating ground elsewhere in the clause still counts.
const NET_ANSWER=/((?:defen[cs]e|defender|challenger|rounds?|block|reply|answer|link\s+round|\[?[CD]R\d\]?|\(?[CD]R\d\)?)[^;.]{0,60}?)((?:do|does|did)\s+not\s+(?:\S+\s+){0,4}?name[sd]?|never\s+names?|not\s+named)(?=[^;.]{0,50}?(?:\d+:\d+|witness|verses?|them|those|rows?))/gi;
// "<witness>, which <round or side> did not name / never names" (the witness before the verb; judgment 872 restated lines).
const NET_ANSWER_R=/(\b(?:which|whom)\s+(?:the\s+)?(?:later\s+)?(?:defen[cs]e|defender|challenger|rounds?|block|reply|link\s+round|\[?\(?[CD]R\d\]?\)?)(?:'s\s+(?:\S+\s+){0,2}?)?\s*)((?:do|does|did)\s+not\s+(?:\S+\s+){0,2}?name[sd]?|never\s+names?)\b/gi;
const NET_ANSWER_U=[/((?:defen[cs]e|defender|challenger|rounds?|block|reply|link\s+round|\[?[CD]R\d\]?|\(?[CD]R\d\)?)[^;.]{0,60}?\b(?:left|leaves|leave)\s+(?:\S+\s+){0,6}?)unstated\b/gi,
 /(\b(?:went|goes|go|was|were|remains?|remained|stays?|stayed)\s+)unstated(?=\s+(?:in|by|at)\s+(?:(?:the\s+)?(?:defen[cs]e|defender|challenger|link\s+round|rounds?)\b|\[?\(?[CD]R\d))/gi];
const NET_QUOTE=/["“][^"”\n]{2,}?["”]/g;
const NET_CONC=/\bCONCEDED\s*\(\s*stated\s*\)/i;
const NET_QUOTE1=/(?<=^|[\s(\[:])'[^'\n]{3,200}?'(?=[\s,.;:)\]]|$)/g; // judge_fix2 E7: a round's words in single quotes (32212 population: j816, j834, j813)
function netMask(cl){let t=String(cl).replace(NET_QUOTE,'"[quote]"').replace(NET_QUOTE1,"'[quote]'").replace(NET_ANSWER,'$1[answer-check]').replace(NET_ANSWER_R,'$1[answer-check]');for(const rx of NET_ANSWER_U)t=t.replace(rx,'$1[answer-check]');return t;}
// The K-C cure test of a RESTATED line: true when a clause of it, masked as netLines masks it, still gives the stating ground as the judge's own.
function netKeeps(text){for(const c0 of drvGround(String(text||''),null).split( /* judge_fix4 F4 *//;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/)){const cl=netMask(c0);
 const hit=NET_STATE.find(rx=>rx.test(cl));if(!hit)continue;const pre=cl.slice(0,cl.search(hit));if(NET_REPORT.test(pre)||NET_CONC.test(pre))continue;return true;}return false;}
// A clause that reports what a side itself stated or granted is that side's statement, not the judge's ground.
const NET_REPORT=/\b(?:stated|granted|says|said|conceded|argued|admitted)\s+that\b|\b(?:conceding|concedes|admitting|admits|granting|grants)\b/i; // judge_fix2 FIX 4: a side's concession reported with -ing or -s (32212 DeepSeek CHAIN MARK)
// 1909 (b): a clause that answers a side's own claim that a named verse says what it does not ("the challenger reads Matthew 1:16
// as saying that Joseph begat Jesus, but the verse does not state that") is the judge answering an overclaim, not the stating test.
const NET_CLAIM=/\b(?:challenger|defender)\s+(?:reads|read|claims|claimed|says|said|argues|argued|takes|took|holds|asserts|asserted|presses|pressed)\b[^;]{0,160}?\b(?:as\s+(?:saying|stating|meaning)|to\s+(?:say|state|mean))\b/i;
const NET_PLURAL=/\b(?:rows|verses|witnesses|speeches|they|these|those|them|none|neither|read\s+together|idiom)\b|\bno\s+(?:verse|witness|row)\b|\b(?:\d?\s?[A-Z][a-z]+\s+\d+:\d+)[^;.]{0,40}?\band\s+(?:\d?\s?[A-Z][a-z]+\s+)?\d+:\d+|\bscripture\b|\bnowhere\b|\bno\s+(?:exhibit|passage|text)s?\b|\ba\s+single\s+(?:\S+\s+)?(?:text|verse|witness|row|passage)\b/i; // judge_fix2 FIX 4: Scripture as a whole, "nowhere", "a single text" (the /i is new; every earlier alternative is lower case or a verse form)
const NET_HEAD=/^(RESULT|KEYSTONE|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*:/; // judge_fix2 FIX 4: the CHAIN MARK lines are read
const NET_SKIP=/^(?:CLAUSE|CITATION CHECK|COLLISION POINTS)\b/i;
// The side whose rows are set aside: read from the subject, the words just before the stating ground; else the C side.
function netSide(cl,at){const sub=cl.slice(Math.max(0,at-90),at);if(/\bneither\s+side|\bboth\s+(?:sides|chains)|\beither\s+way\b/i.test(cl))return 'BOTH';
 const d=sub.search(/\bdefender/i),c=sub.search(/\bchallenger/i);if(d<0&&c<0)return 'CHALLENGER';return d>c?'DEFENDER':'CHALLENGER';}
function netUnwrap(text){let t=String(text||'');const s=t.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const j=JSON.parse(s.slice(0,i+1));if(j&&typeof j.reasoning==='string')return j.reasoning;}catch(e){}}return t;}
function netLines(text,links,DL){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');const L=Array.isArray(links)?new Set(links.map(x=>String(x).toUpperCase())):null;
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
  if(!item||NET_SKIP.test(u)||/^(?:DEFENDER|CHALLENGER) CHAIN MARK\s*:\s*FOOTED\b/.test(u))continue; // judge_fix2 FIX 4: a FOOTED chain mark sets nothing aside
  const clauses=drvGround(line,DL).split( /* judge_fix4 F4: the judge's own ground clause, quotes and link wording removed *//;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/);
  for(const cl0 of clauses){const cl=netMask(cl0);if(!NET_STATE.some(rx=>rx.test(cl)))continue;
   const hit=NET_STATE.find(rx=>rx.test(cl));const at=cl.search(hit);if(NET_REPORT.test(cl.slice(0,at))||NET_CONC.test(cl.slice(0,at))||(NET_CLAIM.test(cl.slice(0,at))&&!NET_PLURAL.test(cl)))continue; // 1909 (b) spares an overclaim about one named verse only (A3, BB-8352)
   if(!vs&&!NET_PLURAL.test(cl))continue;
   out.push({item,side:item==='DEFENDER CHAIN MARK'?'DEFENDER':item==='CHALLENGER CHAIN MARK'?'CHALLENGER':netSide(cl,at),line});break;}} // judge_fix2 FIX 4: a chain mark names its side
 return out;}
// BB-8327 D1 (q3): the chain a K-C line set aside, quoted from the judge's prompt; both chains on a collision line.
// DEFENDER: the numbered lines under its first "DECLARED CHAIN" heading. CHALLENGER: the premises the ledger lists against it
// ("AGAINST THE CHALLENGER, answered in [DR3]:"), which are the challenger's links as [DR3] answers them. Neither found: said so.
// judge_fix2 R2: the PRESSED-WITNESS LEDGER heading of a side, in whatever answering rounds it names ("answered in [CR3]:" in the link-round
// prompts; "answered in [CR2], [CR3] or [CR4]:" and "answered in [DR1], [DR2] or [DR3]:" in the judge prompt). Position, or -1.
function drvLabAt(t,side,from){const re=new RegExp('AGAINST THE '+side+', answered in [^:\\n]{0,40}:','g');re.lastIndex=from||0;const m=re.exec(String(t));return m?m.index:-1;}
function drvChainOf(ptext,side){const t=String(ptext||'');const cut=s=>{s=s.replace(/[*_`#]+/g,'').replace(/\s+/g,' ').trim();return s.length>110?s.slice(0,107)+'...':s;};
 if(side==='DEFENDER'){const i=t.search(/DECLARED CHAIN\b/);if(i<0)return null;const L=[];
  for(const l of t.slice(i).split('\n').slice(1)){const m=l.match(/^\s*(\d+)[.)]\s+(\S.*)$/);if(m){L.push('LINK '+m[1]+' -- '+cut(m[2]));continue;}if(L.length&&l.trim())break;}
  return L.length?{where:'DECLARED CHAIN',links:L}:null;}
 const i=drvLabAt(t,'CHALLENGER',0);if(i<0)return null;const k=t.indexOf('A verse marked NOT NAMED',i);
 const L=t.slice(i,k<0?t.length:k).split('\n').map(l=>l.trim()).filter(l=>/^premise \d+/.test(l)).map(l=>{const m=l.match(/^premise (\d+)(?: \(LINK \d+\))?:\s*(.*)$/);return 'C'+m[1]+' -- '+cut(m[2].replace(/\s*NOT NAMED:.*$/,''));});
 return L.length?{where:'LEDGER [DR3]',links:L}:null;}
function drvChains(ptext,x){const sides=(/ vs C\d+$/.test(x.link)||x.side==='BOTH')?['DEFENDER','CHALLENGER']:[x.side||'CHALLENGER'];
 return sides.map(sd=>{const c=drvChainOf(ptext,sd);return sd+' CHAIN'+(c?' ('+c.where+'): '+c.links.join('; '):': not found in the prompt; weigh its links as the rounds give them');}).join(' || ');}
// judge_fix2: the count lines (CONCEDED LINKS, CHALLENGER CONCEDED LINKS), read by K-N and K-SC.
const CNT_HEAD=/^[ \t>#-]*(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:/i;
// judge_fix2 E1 (K-N; run 32212, judgment 885): a CONCEDED LINKS item tagged CONCEDED (stated) whose quoted words are a narrowing ("drop any
// claim that", "I do not claim", "no longer claim", "narrow", "only") and not a surrender (I concede, withdraw, surrender, CONCEDED). The rule:
// "A limb the link round narrows counts in its narrowed form." Text only: whether the block keeps the link is read from the quotation.
const KN_NARROW=/\b(?:drop(?:s|ped)?\s+(?:any|the|my|that)\s+(?:\S+\s+){0,2}?(?:claim|form|limb|reading)|no\s+longer\s+(?:claim|hold|assert|rest)|(?:do|does)\s+not\s+(?:claim|assert|need)|narrow\w*|limb\s+(?:is\s+)?dropped|\bonly\b|\balone\b)/i;
const KN_SURR=/\b(?:I\s+concede|concede[sd]?\s+(?:the\s+|this\s+)?link|withdraw\w*|surrender\w*|CONCEDED\b|I\s+yield|I\s+grant\s+the\s+link)/i;
function cntItems(text){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');
 for(const raw of T.split('\n')){const line=raw.trim();const h=line.match(CNT_HEAD);if(!h)continue;const label=h[1].toUpperCase();const body=line.slice(h[0].length);
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
const SC_CONC=/(?:\[?\bCR[1-4]\b\]?|\bdefen(?:der|se)(?:'s)?\b)[^;]{0,60}?\b(?<!not\s|never\s)conced(?:ed|es)\b(?!\s+nothing)/i;
function scLines(text,DL){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');const its=cntItems(T).filter(it=>it.label==='CONCEDED LINKS'&&it.one&&it.tag==='CONCEDED'&&!knNarrow(it));
 const byLink=it=>/\(\s*LINK\s+\d+\s*\)|^LINK\s+\d+/i.test(it.text);
 for(const raw of T.split('\n')){const line=raw.trim();const m=line.toUpperCase().match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(?:--|—|-|:)?\s*STANDS\b/);if(!m)continue;
  const lq=drvGround(line,DL);const om=lq.match(SC_CONC); /* judge_fix4 F4: the judge's own ground clause */const tail=om?lq.slice(om.index+om[0].length,om.index+om[0].length+120):'';const own=om&&!/\bchallenger|\bDR[1-3]\b|\bit\s+concede|\bnot\b|\bseparate\b/i.test(om[0])&&!/^[^;]{0,25}?\[?DR[1-3]\b/.test(tail)&&!/\b(?:keep(?:s|ing)?|kept|narrow\w*|only|alone)\b/i.test(tail); /* fix 2: a concession of a limb that keeps the link narrowed is a narrowing, and the narrowed link may stand */
  const it=null; /* (b) not wired: a count line's "LINK n" is the pressing list's label, which the population read showed is not always Dn (j734, j676) */
  if(own||it)out.push({item:'D'+m[1],side:'DEFENDER',line,premise:it?it.n:null,tag:it?it.tag:'CONCEDED',own:!!own});}
 return out;}
// judge_fix2 E4 (K-K; run 32212, judgment 887 "KEYSTONE: D6 -- BROKEN -- Christ had no biological father, and Joseph did not beget him."): a
// KEYSTONE line whose reason gives no ground: no verse, no round or link, no layer, and no ground word. It states a conclusion, not a grade's ground.
const KK_GROUND=/\d+:\d+|\[?\b[CD]R[1-4]\b\]?|\bround\b|\bLINK\s+\d|\[L[1-4]\]|\b(?:answered|unanswered|refuted|refutes|withdrawn|withdrew|withdraws|conceded|concedes|pressed|witness\w*|GROUND|because|since|exhibit\w*|footing|premise|chain|verse|row)\b/i;
function kkLines(text){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');
 for(const raw of T.split('\n')){const line=raw.trim();const m=line.match(/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b\s*(?:--|—|-|:)?\s*(.*)$/i);if(!m)continue;
  const rs=m[3].replace(/^[\s.\-–—:]+/,'').trim();if(rs.split(/\s+/).length>=3&&!KK_GROUND.test(rs))out.push({item:'KEYSTONE',side:'DEFENDER',line});} // a bare grade with no reason is left to the format checks
 return out;}
// judge_fix4 F2 (operator rulings 382 and 383, 2026-11-02: "only 'Debate Oracle' is bound by the guards and the judges grade the text
// (evidence present to them) alone"; "we can not impose our corpus on the judges"): K-DG8, the judge check on Matthew 1:18 and 1:25 read
// against the union, is removed with its cure item and its cure-rule text. Drift guard 8 binds the Oracle debater seat only, and the
// synthesis audits that seat alone (Build Synthesis, section 3).
// judge_fix3 A5: the holder's own concession of the link, named on the BROKEN line (not negated, not "conceded nothing").
function kg4Conceded(line,side){const L=String(line||'').replace(/[*_`]+/g,'');const who=side==='DEFENDER'?'(?:\\[?\\bCR[1-4]\\b\\]?|\\bdefen(?:der|se)(?:\'s)?\\b)':'(?:\\[?\\bDR[1-4]\\b\\]?|\\bchallenger(?:\'s)?\\b)';
 const re=new RegExp(who+'[^;]{0,80}?\\b(?<!not\\s|never\\s|nor\\s)(?:conced(?:ed|es)|withdr(?:ew|awn|aws)|surrender(?:ed|s)|CONCEDED|WITHDRAWN)\\b(?!\\s+(?:nothing|no\\b))','i');return re.test(L);}
// judge_fix4 F4 (run 32266, problems D and E; Worker_E item 3: GLM's KEYSTONE was refused because it quoted the defender's own link "his flesh
// came from Mary alone"; run 32212: the single-verse check matched the defender's quoted concession): the pattern checks K-C, K-S, K-S2, K-U and
// K-SC read only the judge's own ground clause. On a line with GROUND: that is the text after its last GROUND:; on a line without it, the line
// after its label. Quoted text (double quotes, a round's words in single quotes) and the declared link wording (a run of six or more words of a
// DECLARED CHAIN link, read from the judge's prompt) are removed first, so a quotation of either side is never read as the judge's reasoning.
// K-N reads the judge's CONCEDED (stated) tag outside the quotes and tests the quoted words as the side's words (unchanged). The answer-test
// mask (netMask) still runs on the clause; whether the line names an answering round is still read on the whole line.
const GROUND_HEAD=/^(?:[-•]|\d+[.)])?\s*(?:D\d+(?:\s+vs\.?\s+C\d+(?:\s*\/\s*C\d+)*)?(?:\s*\([^)]*\))?|KEYSTONE|RESULT|CLAUSE|REASONING|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*:?\s*/i;
function drvUnlink(t,dl){const W=x=>[...String(x).matchAll(/[A-Za-z0-9’']+/g)].map(m=>m[0].toLowerCase().replace(/’/g,"'"));const toks=[...String(t).matchAll(/[A-Za-z0-9’']+/g)];const tw=toks.map(m=>m[0].toLowerCase().replace(/’/g,"'"));const cut=[];
 for(const L of dl||[]){const lw=W(L);if(lw.length<6)continue;const pos=new Map();lw.forEach((w,i)=>{if(!pos.has(w))pos.set(w,[]);pos.get(w).push(i);});
  for(let i=0;i<tw.length;i++){const st=pos.get(tw[i]);if(!st)continue;let best=0;for(const j of st){let k=0;while(i+k<tw.length&&j+k<lw.length&&tw[i+k]===lw[j+k])k++;if(k>best)best=k;}
   if(best>=6){cut.push([toks[i].index,toks[i+best-1].index+toks[i+best-1][0].length]);i+=best-1;}}}
 if(!cut.length)return t;cut.sort((a,b)=>a[0]-b[0]);const mg=[];for(const c of cut){const l=mg[mg.length-1];if(l&&c[0]<=l[1])l[1]=Math.max(l[1],c[1]);else mg.push(c.slice());}
 let s=String(t);for(let k=mg.length-1;k>=0;k--)s=s.slice(0,mg[k][0])+'[link]'+s.slice(mg[k][1]);return s;}
function drvGround(line,dl){let t=String(line||'').replace(/[*_`]+/g,'');const gs=[...t.matchAll(/\bGROUND\s*:/gi)];
 if(gs.length){const g=gs[gs.length-1];t=t.slice(g.index+g[0].length);}else t=t.trim().replace(GROUND_HEAD,'');
 t=t.replace(NET_QUOTE,'"[quote]"').replace(NET_QUOTE1,"'[quote]'");return Array.isArray(dl)&&dl.length?drvUnlink(t,dl):t;}
// The declared links, from the judge's prompt: the numbered lines under its first DECLARED CHAIN heading, each up to its "Footing:".
function drvLinks(ptext){const t=String(ptext||'');const i=t.search(/DECLARED CHAIN\b/);if(i<0)return [];const L=[];
 for(const l of t.slice(i).split('\n').slice(1)){const m=l.match(/^\s*\**\s*(\d+)[.)]\s+(\S.*)$/);if(m){L.push(m[2].replace(/\s*Footing\s*:.*$/i,'').replace(/[*_`]+/g,''));continue;}if(L.length&&l.trim()&&!/^\s/.test(l))break;}
 return L;}
function drvCheck(text,dConc,cConc,dStand,cStand,askedCC,DL){ /* judge_fix4 F4: DL, the declared link wording */const items=[],marks=[];if(typeof text!=='string')return {items,marks};const cnt={DEFENDER:0,CHALLENGER:0};
 const LS=text.split('\n');for(let li=0;li<LS.length;li++){const line=LS[li];const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();
  {const ms=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(ms){const vs=/^VS\.?\s/.test(ms[2]);const gs=vs?((ms[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/)||[])[1]||null):(/^STANDS\b/.test(ms[2])?'STANDS':null);
   if((gs==='UNDERDETERMINED'||gs==='STANDS')&&DRV_STATE.test(drvGround(line,DL))&&!DRV_ANS.test(line)){ /* judge_fix4 F4 */const sid=vs?(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+ms[1]])[1].replace(/\s+VS\.?\s+/,' vs '):'D'+ms[1];
    items.push({rule:'K-S',side:null,link:sid,line});marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S) -- '+sid+' '+gs+' rests on a single verse not stating a link or its contrary and names no round that answered the witness. REVIEW THIS ROW.]');}
   // BB-8172 C2: marks only, never items, so nothing here reaches the cure, drv_uncured or a grade (8192, 8193).
   if(gs==='UNDERDETERMINED'||gs==='STANDS'){const sid=vs?(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+ms[1]])[1].replace(/\s+VS\.?\s+/,' vs '):'D'+ms[1];
    if(DRV_STATE.test(drvGround(line,DL))&&(DRV_ANS.test(line)||DRV_BARE.test(line)))marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S2) -- '+sid+' '+gs+' gives as a ground that a verse does not state a link or its contrary, beside '+(DRV_ANS.test(line)?'the round it names':'a round it names without a bracket, which K-S does not read as named')+'; that is never a ground. REVIEW THIS ROW.]');
    const un=drvUnans(drvGround(line,DL));if(un)marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-U) -- '+sid+' '+gs+' says a witness went unanswered ("'+un+'"); a witness left unanswered is a BROKEN ground. REVIEW THIS ROW.]');}}}
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
  // found in the named pressing round, or by RETRACTED (7176, 7184, 7186).
  // judge_fix3 A5 (run 32228 B2: DeepSeek and the single judge, D5 vs C6 "[CR3] LINK 4 [premise 6] concedes it cannot exhibit ..."): a BROKEN line
  // whose ground is that the side holding the link conceded (or withdrew) it in its own round, and that names no witness unanswered, is the
  // concession rule's case, not K-G4's. The holder of a DEFENDER LINK BROKEN link is the defender ([CR] rounds), of a CHALLENGER LINK BROKEN the challenger.
  else if(!DRV_WORDS.test(line)&&kg4Conceded(line,side)){marks.push('[AUDIT v24: K-G4 NOT RAISED -- '+id+' '+g[1]+' rests on the '+side.toLowerCase()+"'s own concession of the link, not on a witness left unanswered; the concession rule governs it.]");}
  else{items.push({rule:'K-G4',side,link:id,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G4) -- '+id+' '+g[1]+' counts a witness as unanswered; the rule counts it only with the quoted pressing sentence and its round. REVIEW THIS ROW.]');}}
 for(const [side,st,lab] of [['DEFENDER',dStand,'DEFENSE'],['CHALLENGER',cStand,'CHALLENGE']]){
  if(st==='SELF-SUPPORTED'&&cnt[side]>0){items.push({rule:'K-G3',side,link:null,line:null});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G3) -- '+lab+' STANDING SELF-SUPPORTED while '+cnt[side]+' '+side+' LINK BROKEN line'+(cnt[side]===1?'':'s')+' stand. REVIEW THIS ROW.]');}}
 if(askedCC&&!/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?CITATION CHECK\b/im.test(text.replace(/[*_`]+/g,'')))marks.push('[AUDIT v21: CITATION CHECK LINE ABSENT FROM A PROMPT THAT ASKS FOR IT (K-G2); recorded, not counted as a violation.]');
 // BB-8327 D1 (K-C): a line that sets aside a chained premise, or a side's rows read together, on the ground that no one verse states the link or its contrary (netLines).
 // judge_fix2 E1, E2 (K-N, K-SC): items with a cure, as K-C (judge_fix4 F2: K-DG8 removed). (E4, K-K, is defined but not wired: the prompt's KEYSTONE form asks the judge to name the link's conclusion.)
 for(const n of knLines(text)){items.push({rule:'K-N',side:n.side,link:n.item,line:n.line});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-N) -- '+n.item+' counts premise '+n.premise+' CONCEDED (stated) on words that narrow a limb; a limb the link round narrows counts in its narrowed form, and a narrowing is not a concession. REVIEW THIS ROW.]');}
 for(const n of scLines(text,DL)){items.push({rule:'K-SC',side:n.side,link:n.item,line:n.line,premise:n.premise});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-SC) -- '+n.item+' STANDS while '+(n.own?'its own line says the defender conceded':'CONCEDED LINKS counts premise '+n.premise+' (filed under that link) '+(n.tag==='CONCEDED'?'CONCEDED (stated)':'UNEXHIBITED'))+'; a link counted conceded does not stand. REVIEW THIS ROW.]');}
 for(const n of netLines(text,null,DL)){items.push({rule:'K-C',side:n.side,link:n.item,line:n.line});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-C) -- '+n.item+' sets aside '+(n.side==='BOTH'?'both chains':'the '+n.side.toLowerCase()+"'s chain")+' on the ground that no one verse in it states the link or its contrary in its own words; the chain is weighed as a whole. REVIEW THIS ROW.]');}
 return {items,marks};}

// BB-6904 (c), portion 4: the cure call. One extra call per violating seat: its own flagged items, the rule, and a FIXED ANSWER FORM
// (BB-6952). The check reads only lines in that form; prose in the reply is recorded in the report and never read for a cure, so there is
// no negation to parse: a link not on a RETRACTED line is not retracted, and a malformed line cures nothing. A RESTATED line is run through
// the same K-B counter (drvKinds, git 0b3cbac). A missing line, a failed or unparsed call leaves the item UNCURED (6945 AMEND 3). No grade,
// count or outcome is changed here (portion 5, the operator's choice).
const CURE_FAMS=['deepseek','openai','gemini','grok','mimo','openrouter']; // Cure Route output order; covers all six (6913 note 2)
const CURE_RULE="DEBATE RULE VIOLATION. After you answered, the system checked every COLLISION POINTS line you graded DEFENDER LINK BROKEN or CHALLENGER LINK BROKEN. "
 +"Each such line must exhibit, on the line itself or on the line directly under it, at least two lower layers of DIFFERENT kinds, each tagged: [L1] with the KJV words quoted; "
 +"[L2] with the Hebrew or Greek word in its own script, with its transliteration marks, with its Strong's number, or written in plain letters with its English meaning beside it (for example [L2] genomenou (made), or [L2] sperma, seed), the tag standing directly before that word (or directly after it and its meaning); [L3] with the cross-reference named. "
 +"Two quotations at one layer are one layer. The lines below do not. For each one, either cure it with one RESTATED line: that collision line again, "
 +"beginning with its link, with the same grade and the two layers exhibited on it; or answer in prose why it stands (recorded; prose cures nothing). "
 +"Do not change any other line, grade or count. A line that is not cured leaves the violation standing, and this judgment is then not counted.";
const CURE_RULE_G="COUNT AND STANDING (same rule). Your own numbers must agree with your own COLLISION POINTS lines. "
 +"K-G1 (a conceded count of 0 beside a link you graded BROKEN on a witness left unanswered): cure it either with CORRECTED COUNT for that side, "
 +"the number at least the number of that side's K-G1 links, together with, for each such link, a PRESSED line quoting the words of the earlier round "
 +"that pressed the witness (against the defender: [DR1] or [DR2]; against the challenger: [CR1], [CR2] or [CR3]); or with RETRACTED for that link. "
 +"K-G4 (any other link you graded BROKEN on a witness left unanswered): cure it with a PRESSED line quoting the words of the earlier round that "
 +"pressed the witness (rounds as for K-G1), or with RETRACTED for that link. "
 +"For a K-G1 link whose cited verse any later round of the side that holds the link names ([CR2], [CR3] or [CR4] against the defender, [DR1], [DR2] or [DR3] against the challenger, each after the pressing round), add a SHORT line "
 +"quoting the words of that round that answer it and saying from the text why they do not overturn the link; without it the link is not cured. "
 +"For a K-G4 link the system searches every later round of the side that holds the link ([CR2], [CR3] or [CR4] against the defender; [DR1], [DR2] or [DR3] against the challenger, each after the pressing round) for each pressed witness your line and your PRESSED quotation name; if any of those rounds names the witness, it was answered, the BROKEN grade is unanswered-false and only RETRACTED cures it. "
 +"K-G3 (a standing graded SELF-SUPPORTED while links of that side are graded BROKEN): cure it either with CORRECTED STANDING for that side, "
 +"PROP-DEPENDENT or COLLAPSED, or with one RETRACTED line for each BROKEN link of that side. "
 +"K-G6 (a premise listed against a side that the PRESSED-WITNESS LEDGER marks NOT NAMED, which your CONCEDED LINKS or CHALLENGER CONCEDED LINKS "
 +"does not count): the rule you were given reads \"A verse marked NOT NAMED is unanswered by the rule\" and \"A premise whose pressed witness goes "
 +"unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings\". Cure it either by counting it: CORRECTED COUNT for that side, "
 +"your count plus every K-G6 premise of that side you do not answer by statement, with CORRECTED STANDING for that side that the count makes true "
 +"(PROP-DEPENDENT, or COLLAPSED when twice the count exceeds the number of premises listed against that side); or by a STATEMENT for that premise "
 +"that quotes, word for word, the words of the transcript that show the verse is not a pressed witness of that premise. "
 +"K-G7 (a COLLISION POINTS line you graded DEFENDER LINK BROKEN on D<n> while your CONCEDED LINKS does not count premise n): a link is BROKEN "
 +"only for a witness left unanswered, and a premise whose witness goes unanswered is counted. Cure it either by counting it: CORRECTED COUNT "
 +"for DEFENDER, your count plus every such premise and every K-G6 premise of that side, with the CORRECTED STANDING that count makes true; "
 +"or by regrading it: a RETRACTED line for that link and exactly one CORRECTED RESULT. The same holds for a CHALLENGER LINK BROKEN line for "
 +"a witness left unanswered while your CHALLENGER CONCEDED LINKS is 0: CORRECTED COUNT for CHALLENGER, or RETRACTED and one CORRECTED RESULT. "
 +"K-G8 (your counted_premises array for a side lists a different number of premises than that side's count): CORRECTED COUNT for that side equal to the number of premises your array lists plus every K-G6 or K-G7 premise of that side, with the CORRECTED STANDING that count makes true. K-S (a link marked STANDS, or a collision graded UNDERDETERMINED, whose ground is that a verse does not state a link or its contrary, with no round named that answered the witness): A link marked STANDS, or a collision graded UNDERDETERMINED, against a witness the other side exhibited names in the same line the round that answered that witness. A witness left unanswered is a BROKEN ground. That a single verse does not state a link or its contrary is never a ground for STANDS or UNDERDETERMINED, for either side. Cure it with one RESTATED line for that link (D<n> vs C<m>, or D<n> for a STANDS line), regraded: it names the round that answered the witness ([CR2], [CR3] or [CR4] for a defender link, [DR1], [DR2] or [DR3] for a challenger link), or it grades the line LINK BROKEN, with exactly one CORRECTED RESULT. "
 +"K-C (a line that sets aside a chained premise, or a side's rows read together, on the ground that no one verse in them states the link or its contrary in its own words; the item quotes the line and the chain it set aside): that is never a ground, for the rows are weighed together, line upon line. "
 +"Cure it with one RESTATED line for the item that grades it on the chain as a whole: it drops that ground and names the footing of the chain it weighed, exhibiting at least two kinds of layer, each tagged as the layer rule reads: [L1] with the KJV words quoted; [L2] with the Hebrew or Greek word in its own script, with its transliteration marks, with its Strong's number, or in plain letters with its English meaning beside it (\"[L2] genomenou (made)\", \"[L2] sperma, seed\"), the tag directly before the word; [L3] with the cross-reference named. A tag that stands on no such word is not counted. Name rounds in brackets ([CR3], [DR2]); a round named without brackets is not read. A verse counts as footing, as a witness or as an answer only when its book, chapter and verse are stated and the words quoted are exactly the words of the KJV (operator ruling 3; a quotation may be part of a verse; paraphrased or misquoted words do not count); an answer in substance without the reference named does not count. "
 +"A restated line that keeps the ground is not a cure, and an uncured K-C line is not counted (K-C UNCURED). "
 +"K-N (a CONCEDED LINKS or CHALLENGER CONCEDED LINKS item tagged CONCEDED (stated) on words that narrow a limb, such as \"I drop any claim that\"): a link is CONCEDED (stated) only when the block surrenders the link itself; a block that drops a limb and keeps the link in a narrowed form is not a concession: grade the narrowed link. "
 +"Cure it with one RESTATED line for that count line that no longer counts the narrowing as a concession. "
 +"K-SC (a link you graded STANDS while your own line says the defender conceded it, or while your CONCEDED LINKS counts the premise filed under it CONCEDED (stated)): a link counted conceded does not stand. Cure it with one RESTATED line for that link (D<n> or D<n> vs C<m>) that does not grade it STANDS; "
 +"or with one RESTATED CONCEDED LINKS line that no longer counts that premise; or with a STATEMENT for the item that names the round ([CR3], [CR4] or [DR3]) and quotes its words that show the link stands.";
const CURE_FORM="ANSWER FORM. Write each cure as one line of its own, beginning with its keyword in capitals exactly as shown:\n"
 +"RESTATED: <the full collision line, beginning D<n> vs C<m>>\n"
 +"RESTATED: <for a K-C item on a REASONING, RESULT, KEYSTONE, STANDING, CONCEDED or CHAIN MARK line, or a K-N item on a CONCEDED line: that label, a colon, then the whole regraded sentence>\n"
 +"RETRACTED: D<n> vs C<m>\n"
 +"CORRECTED RESULT: <BROKEN-1 | BROKEN-2 | PARTIAL-1 | PARTIAL-2 | PARTIAL-3 | HELD-1>\n"
 +"CORRECTED COUNT: <DEFENDER or CHALLENGER> <number>\n"
 +"CORRECTED STANDING: <DEFENDER or CHALLENGER> <PROP-DEPENDENT or COLLAPSED>\n"
 +"PRESSED: D<n> vs C<m> | [<round>] | \"<the words of that round, quoted exactly>\"\n"
 +"SHORT: D<n> vs C<m> | [<answering round>] | \"<the words of that round, quoted exactly>\" | <why they do not overturn the link>\n"
 +"STATEMENT: <the flagged item, as labelled above> | <in your own words, why the line stands as you graded it, or what you corrected and why>\n"
 +"RETRACTED: D<n> vs C<m> retracts your BROKEN grade on that line; a retracted line is not a BROKEN line, so that one line cures every item flagged on it (layer, count, pressing). A BROKEN line you retract is regraded in the same reply: UNDERDETERMINED only with the round that answered each witness named; a witness left unanswered keeps the line BROKEN in the corrected form. A retraction counts only beside one CORRECTED RESULT line: your CLAUSE tag as it stands after your retractions, and that result is the one counted. A STATEMENT line never retracts anything. A judge that retracts a BROKEN line writes the reason in one sentence; a retraction of every BROKEN line that flips the verdict with no reason stated is not a cure, and that judge is not counted. A reason for a retraction names what in the rounds makes the retracted line wrong: the round, and the words or the verse it rests on. A sentence that names only the flag, the rule or the cure it performs is not a reason.\n"
 +"Write one STATEMENT line for every flagged item, cured or not; it is recorded beside the item. Instead of a cure line you may state why the line stands: "
 +"the statement is run through the same check as the cure. For a layer item it must exhibit two different kinds of layer; for a K-G1 or K-G4 "
 +"item it must name the round that pressed the witness and quote that round's words; for a K-G1 item, where a later round of the side that holds the link names the verse, it must also quote "
 +"that round's own answer; a K-G4 item whose pressed witness a later round of that side names is not cured by any statement. For a K-G6 item it must quote, word for word, the transcript's words that show the verse is not a pressed witness of that premise. Cured if it passes; else the violation stands. "
 +"RESPONSE: <the flagged item, as labelled above> | <in your own words: whether you accept the mark and why, or why the mark is wrong, naming the round and quoting its words>. Write one RESPONSE line for every flagged item, in addition to the cure line it needs; an item with no RESPONSE line is not cured, whatever else the reply holds. "
 +"Only these lines are read. A link not on a RETRACTED line is not retracted. A line not in this form cures nothing. Any other text is recorded only.";
const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-S'||x.rule==='K-C'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K')?x.rule+' '+x.link:'K-G3 '+x.side);
function cureAsk(items,broken){const kb=items.filter(x=>x.rule==='K-B'),kg=items.filter(x=>x.rule!=='K-B');let t='';
 if(kb.length)t+=CURE_RULE+'\n\nFLAGGED LINES:\n'+kb.map(x=>x.link+': '+String(x.line||'').trim()).join('\n');
 if(kg.length)t+=(t?'\n\n':'')+CURE_RULE_G+'\n\nFLAGGED ITEMS:\n'+kg.map(x=>cureLabel(x)+': '+((x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-S'||x.rule==='K-C'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K')?String(x.line||'').trim()+(x.rule==='K-C'&&x.chain?'\n  '+x.chain:''):x.side+' STANDING SELF-SUPPORTED while these '+x.side+' links are graded BROKEN: '+((broken||{})[x.side]||[]).join(', '))).join('\n');
 return t+'\n\n'+CURE_FORM;}
// The BROKEN links of each side on the judge's own lines, selected as drvCheck selects them (portion 3).
function cureBroken(text){const out={DEFENDER:[],CHALLENGER:[]};if(typeof text!=='string')return out;
 for(const line of text.split('\n')){const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
  const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');out[g[1].split(' ')[0]].push(id);}
 return out;}
// Append the judge's own answer and the cure request to the judge's own request body, per family envelope.
function cureBody(fam,body,answer,ask){const b=JSON.parse(JSON.stringify(body));
 if(fam==='gemini'){b.contents=(b.contents||[]).concat([{role:'model',parts:[{text:answer}]},{role:'user',parts:[{text:ask}]}]);return b;}
 b.messages=(b.messages||[]).concat([{role:'assistant',content:answer},{role:'user',content:ask}]);
 if(b.response_format)delete b.response_format; // a JSON-only reserve (qwen) must be free to answer in lines
 return b;}
// One reply envelope to text, never throwing: chat form, Gemini form, or a failure named.
function cureText(j){
 if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message&&typeof j.choices[0].message.content==='string')return {ok:true,text:j.choices[0].message.content,finish:j.choices[0].finish_reason||null};
 if(j&&Array.isArray(j.candidates)&&j.candidates[0]&&j.candidates[0].content&&Array.isArray(j.candidates[0].content.parts)){const t=j.candidates[0].content.parts.filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join('');if(t)return {ok:true,text:t,finish:j.candidates[0].finishReason||null};}
 const why=(j&&j.error)?('error: '+String(typeof j.error==='string'?j.error:(j.error.message||JSON.stringify(j.error))).slice(0,160)):('unrecognised reply, keys ['+Object.keys(j||{}).join(',')+']');
 return {ok:false,text:null,why};}
// The round texts the judge was shown, read from its own request body. Each transcript block opens with its label on a line of its own, in
// either live form: single judge "[CR1]" or "[CR3 -- LINK ROUND ...]"; panel "=== [CR1] DEFENDER R1 ===" (BB-6951 defect 2). A block runs to
// the next; [DR3] ends at the counting rule (single) or at the end of the text (panel).
function cureRounds(body){const parts=[];const add=c=>{if(typeof c==='string')parts.push(c);else if(Array.isArray(c))c.forEach(p=>{if(p&&typeof p.text==='string')parts.push(p.text);});};
 try{(body.messages||[]).forEach(m=>{if(m&&m.role!=='assistant')add(m.content);});(body.contents||[]).forEach(m=>{if(m&&m.role!=='model')add(m.parts);});}catch(e){}
 const t=parts.join('\n');const re=/^(?:===[ \t]+)?\[(CR1|DR1|CR2|DR2|CR3|DR3|CR4|DR4)(?:\]|[ \t]--[^\n]*\])(?:[^\n]*===)?[ \t]*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
 const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\nCOUNTING RULE',x.e);if(c>=0&&c<end)end=c;out[x.k]=t.slice(x.e,end);});
 return out;}
// The rounds that press a witness against each side (the judge prompt's UNANSWERED WITNESS rule).
const CURE_PRESS={DEFENDER:['DR1','DR2'],CHALLENGER:['CR1','CR2','CR3']};
const cureQ=s=>String(s).replace(/\\(["'\\nrt])/g,(m,c)=>c==='n'?'\n':c==='t'?'\t':c==='r'?'\r':c).replace(/[*_`]+/g,'').toLowerCase().replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[—–]/g,'-').replace(/["']/g,'').replace(/\((l[1-4]|[cd]r[1-4])\)/g,'[$1]').replace(/\s+/g,' ').trim(); // BB-7357: quote marks folded, (Ln) read as [Ln], brackets kept; BB-7397 rev 8 DoD 15: backslash escapes (\" \' \\ \n \t \r) read as the characters they stand for, first
// A quotation is found in a round when every piece of it (split at an ellipsis), stripped of edge punctuation, occurs in that round's text,
// and the pieces hold at least three words.
function cureFound(q,txt){const T=cureQ(txt);const ps=q.split(/\.{3}|…/).map(x=>cureQ(x).replace(/^[\s.,;:!?'"-]+|[\s.,;:!?'"-]+$/g,'')).filter(Boolean);
 return ps.length>0&&ps.join(' ').split(' ').length>=3&&ps.every(x=>T.includes(x));}
// DoD 12 (BB-7397 rev 7, choice (i) BB-7495): a PRESSED line may carry several quotations of the named round, joined as "..." and "..."; a
// quotation not found whole is split at a closing mark, a joiner (and, &, a comma or a semicolon) and an opening mark, and counts when every piece
// is found in that round. A quotation found whole is read as before.
function cureFoundAll(q,txt){if(cureFound(q,txt))return true;const ps=String(q).split(/["”]\s*(?:and|&|,|;)\s*["“]/).map(s=>s.trim()).filter(Boolean);
 return ps.length>1&&ps.every(p=>cureFound(p,txt));}
// The reply in the fixed form (BB-6952). A line is read only when, after trimming and stripping * or ` at its ends, it begins with one of the
// five keywords and a colon; it then must match its form exactly, or it is malformed. Every other line is prose.
const CURE_KEY=/^(RESTATED|RETRACTED|CORRECTED RESULT|CORRECTED COUNT|CORRECTED STANDING|PRESSED|SHORT|STATEMENT|RESPONSE)[ \t]*:[ \t]*(.*)$/; // judge_fix2 W1: RESPONSE
const cureId=(d,c)=>'D'+d+' vs C'+c;
// judge_fix2 FIX 3 (run 32212, judgment 885: "D5 vs C5 ..." refused as "no RESTATED line for D5"): the RESTATED lines for an item. The lines whose
// label is the item's own; failing those, for a bare Dn item the collision lines "Dn vs Cm", and for a bare Cn item the lines "Dm vs Cn".
function cureRest(o,x){const V=s=>String(s==null?'':s).toUpperCase().replace(/\s+/g,' ').trim();const L=V(x.link);const ex=o.restated.filter(r=>V(r.link)===L);if(ex.length)return ex;
 // judge_fix4 F3: with no RESTATED line, a RETRACTED line that carries its regrade is the restated line of that collision.
 {const wr=o.withdrawn.filter(w=>w.reason&&V(w.link)===L).map(w=>({link:w.link,grade:w.regrade||'UNDERDETERMINED',text:w.link+' '+w.reason,line:w.line,retraction:true}));if(wr.length)return wr.slice(0,1);}
 const m=L.match(/^([DC])(\d+)$/);if(!m)return ex;return o.restated.filter(r=>{const k=V(r.link).match(/^D(\d+) VS C(\d+)$/);return !!k&&(m[1]==='D'?k[1]===m[2]:k[2]===m[2]);});}
// A reply that is one JSON object (a panel judge keeps its answer form) is read through its reasoning, reason or answer string.
const cureUnwrap=t=>{try{const j=JSON.parse(String(t).trim().replace(/^```(?:json)?\s*|\s*```$/g,''));if(j&&typeof j==='object'){for(const k of ['reasoning','reason','answer'])if(typeof j[k]==='string')return j[k];}}catch(e){}return t;};
function cureLines(text){text=cureUnwrap(text);const o={restated:[],withdrawn:[],result:[],count:[],standing:[],pressed:[],short:[],statement:[],response:[],malformed:[],prose:[]};
 for(const raw of String(text||'').split('\n')){const l=raw.trim().replace(/^[*`]+|[*`]+$/g,'').trim();if(!l)continue;const k=l.match(CURE_KEY);if(!k){o.prose.push(l);continue;}
  const r=k[2].trim();let m;
  // judge_fix4 F3 (run 32266: GLM's "RETRACTED: D1 vs C6 (Matthew 1:18) -- regraded UNDERDETERMINED -- [DR1] answered ..." was refused as
  // malformed, ten times): a RETRACTED line counts when it opens with the item label (D<n> vs C<m>, a rule name before it allowed); whatever
  // follows is read as its regrade (the first grade word) and its reason. A regrade to a LINK BROKEN grade is no retraction (malformed).
  if(k[1]==='RETRACTED'&&(m=r.match(/^(?:K-[A-Z]+\d*\s+)?D(\d+)\s+vs\.?\s+C(\d+)\b(.*)$/i))&&!/\bLINK\s+BROKEN\b/i.test(m[3].replace(/\bnot\s+(?:a\s+)?(?:\S+\s+)?LINK\s+BROKEN\b/ig,''))){const rest=m[3].trim();const g=(rest.toUpperCase().match(/\b(UNDERDETERMINED|STANDS)\b/)||[])[1]||null;
   o.withdrawn.push({link:cureId(m[1],m[2]),line:l,regrade:g,reason:rest.replace(/^\([^)]*\)\s*/,'').replace(/^(?:--|—|-|:)\s*/,'').replace(/^(?:re)?grade[sd]?\s+(?:to\s+)?(?:UNDERDETERMINED|STANDS)\s*(?:--|—|-|:)?\s*/i,'').trim()||null});}
  else if(k[1]==='CORRECTED RESULT'&&(m=r.match(/^(BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|PARTIAL-3|HELD-1)$/)))o.result.push({tag:m[1],word:m[1].split('-')[0],line:l});
  else if(k[1]==='CORRECTED COUNT'&&(m=r.match(/^(DEFENDER|CHALLENGER)\s+(\d+)$/)))o.count.push({side:m[1],n:+m[2],line:l});
  else if(k[1]==='CORRECTED STANDING'&&(m=r.match(/^(DEFENDER|CHALLENGER)\s+(SELF-SUPPORTED|PROP-DEPENDENT|COLLAPSED)$/)))o.standing.push({side:m[1],st:m[2],line:l});
  else if(k[1]==='PRESSED'&&(m=r.match(/^D(\d+)\s+vs\.?\s+C(\d+)\s*\|\s*\[(DR1|DR2|CR1|CR2|CR3)\]\s*\|\s*["“](.+)["”]$/i)))o.pressed.push({link:cureId(m[1],m[2]),round:m[3].toUpperCase(),q:m[4],line:l});
  else if(k[1]==='STATEMENT'&&(m=r.match(/^(.+?)\s*\|\s*(\S.{9,})$/)))o.statement.push({label:m[1].trim(),text:m[2].trim(),line:l});
  else if(k[1]==='RESPONSE'&&(m=r.match(/^(.+?)\s*\|\s*(\S.{9,})$/)))o.response.push({label:m[1].trim(),text:m[2].trim(),line:l}); // judge_fix2 W1
  else if(k[1]==='SHORT'&&(m=r.match(/^D(\d+)\s+vs\.?\s+C(\d+)\s*\|\s*\[(CR2|CR3|CR4|DR1|DR2|DR3)\]\s*\|\s*["“](.+?)["”]\s*\|\s*(\S.{9,})$/i)))o.short.push({link:cureId(m[1],m[2]),round:m[3].toUpperCase(),q:m[4],why:m[5],line:l});
  else if(k[1]==='RESTATED'&&(m=r.match(/^(REASONING|KEYSTONE|RESULT|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*[:\-–—]+\s*/i)))o.restated.push({link:m[1].toUpperCase(),grade:null,text:r.slice(m[0].length),line:l}); // BB-8327 D1
  else if(k[1]==='RESTATED'&&(m=r.match(/^D(\d+)(?:\s+vs\.?\s+C(\d+))?\b/i))){const g=r.slice(m[0].length).toUpperCase().match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS)/);
   o.restated.push({link:m[2]?cureId(m[1],m[2]):'D'+m[1],grade:g?g[1]:null,text:r,line:l});}
  // judge_fix2 FIX 3: a collision line restated with the C label first ("C5 vs D5 ...") is that collision (D5 vs C5).
  else if(k[1]==='RESTATED'&&(m=r.match(/^C(\d+)\s+vs\.?\s+D(\d+)\b/i))){const g=r.slice(m[0].length).toUpperCase().match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS)/);
   o.restated.push({link:cureId(m[2],m[1]),grade:g?g[1]:null,text:r,line:l});}
  else o.malformed.push(l);}
 return o;}
// judge_fix4 F3 (run 32266: the table quoted GLM's first malformed line, "RETRACTED: D1 vs C6", under nearly every item): a malformed line is an
// item's own when, after its keyword and an optional rule name, it opens with that item's label (for K-G3, "<SIDE> STANDING").
function cureOwn(l,x){const b=String(l).replace(/^[A-Z ]+:\s*/,'').replace(/^K-[A-Z]+\d*\s+/i,'').toUpperCase().replace(/\s+VS\.?\s+/g,' VS ').replace(/\s+/g,' ');
 const lab=x.rule==='K-G3'?String(x.side||'')+' STANDING':String(x.link||'').toUpperCase().replace(/\s+VS\.?\s+/g,' VS ').replace(/\s+/g,' ');
 return !!lab&&b.startsWith(lab)&&!/[0-9A-Z]/.test(b.charAt(lab.length));}
// Judge each item against the fixed-form lines (6904 c; 6946; 6952).
// K-B: exactly one RESTATED line for the link; its grade (the first after the link, as drvCheck finds it) is that side's LINK BROKEN; the line
// passes the K-B counter (two kinds). K-G1: RETRACTED for the link; or one CORRECTED COUNT for that side at least the number of that side's
// K-G1 links, and a PRESSED line for the link whose round presses that side (defender [DR1], [DR2]; challenger [CR1]-[CR3], 6950) and whose
// quotation is found in that round's text. K-G3: one CORRECTED STANDING for that side other than SELF-SUPPORTED; or a RETRACTED line for every
// BROKEN link of that side (none readable: UNCURED, 6949). Two differing lines for one count or standing, or two restatements: UNCURED.
// BB-6904 rev 8 K-G5: verse references in a text, each with its position: a book (capitalised word, first three letters; 1-3 prefix kept;
// Mt Mk Lk Jn Ex Ro read as Matthew Mark Luke John Exodus Romans), chapter:verse, a range (at most 30 verses), comma lists ("1:16, 1:18",
// "1:16,18,20"); a bare chapter:verse with no book before it takes the last book named ("Matthew 1:19 ... 1:25").
const CURE_BK={mt:'mat',mk:'mar',lk:'luk',jn:'joh',ex:'exo',ro:'rom'};
// judge_fix4 F6 (run 32266: "(1:24)" in [CR2] was read as naming Matthew 1:24): with scoped, a bare chapter:verse takes the last book named only when
// no sentence ends between that book's reference and it (ruling 376: book, chapter and verse stated).
const CURE_SENT=/[.!?]["”'’)\]]*\s+(?=["“'‘(\[]*[A-Z])|\n/;
function cureRefs(t,scoped){const out=[];const s=String(t||'');let last=null,lastEnd=-1;const re=/(?:((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+)?(\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?((?:\s*,\s*(?:\d{1,3}:)?\d{1,3}(?:\s*[-–]\s*\d{1,3})?)*)/g;let m;
 while((m=re.exec(s))){let bk=last;if(m[1]){const b=m[1].toLowerCase().replace(/\s+/g,' ');const n=b.match(/^([1-3]) (.+)$/);const base0=n?n[2]:b;bk=(n?n[1]+' ':'')+(CURE_BK[base0]||base0.slice(0,3));last=bk;lastEnd=m.index+m[0].length;}else if(scoped&&(lastEnd<0||CURE_SENT.test(s.slice(lastEnd,m.index))))bk=null; /* judge_fix4 F6 */
  if(!bk)continue;const add=(c,v1,v2)=>{if(!v2||v2<v1||v2-v1>30)v2=v1;for(let v=v1;v<=v2;v++)out.push({key:bk+' '+c+':'+v,pos:m.index});};
  let ch=+m[2];add(ch,+m[3],m[4]?+m[4]:0);
  for(const p of (m[5]||'').split(',').map(x=>x.trim()).filter(Boolean)){const q=p.match(/^(?:(\d{1,3}):)?(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?$/);if(!q)continue;if(q[1])ch=+q[1];add(ch,+q[2],q[3]?+q[3]:0);}}
 return out;}
// The verses of a line's first parentheses that the link round names, each with the link round's answer to it: the text from 300 characters
// before each naming to 1,200 after, kept inside the LINK block that holds the naming (7194 defect 1: a whole block let an unrelated sentence cure).
// BB-7397 rev 9 DoD 19: w widens each window by w characters on each side, inside the LINK block; left and right hold the two margins alone,
// so a quotation found in the widened text and in neither margin alone overlaps the window. w 0 is the window as before.
function cureNamed(line,LR,w){w=w>0?w:0;const p=String(line||'').match(/\(([^)]*\d+:\d+[^)]*)\)/);if(!p)return [];const want=new Set(cureRefs(p[1]).map(r=>r.key));if(!want.size)return [];
 const heads=[];const hr=/^[ \t>*#_-]*LINK\s+\d+/gmi;let h;while((h=hr.exec(LR)))heads.push(h.index);
 const span=(pos)=>{let a=0,b=LR.length;for(const x of heads){if(x<=pos)a=x;else{b=x;break;}}const lo=Math.max(a,pos-300),hi=Math.min(b,pos+1200);return {t:LR.slice(Math.max(a,lo-w),Math.min(b,hi+w)),l:LR.slice(Math.max(a,lo-w),lo),r:LR.slice(hi,Math.min(b,hi+w))};};
 const by={};for(const r of cureRefs(LR))if(want.has(r.key))(by[r.key]=by[r.key]||[]).push(span(r.pos));
 return Object.keys(by).map(k=>({ref:k,blocks:by[k].map(x=>x.t),left:by[k].map(x=>x.l),right:by[k].map(x=>x.r)}));}
// BB-7397 rev 8 DoD 18 (rulings 105; the test of 7564 item 1): a RETRACTED line counts only beside a reason, a STATEMENT or prose line of the
// reply that names the same link, a round ([CR1]-[DR3]) and words in quotation marks (3+ words) or a verse. Placement is free; a line that
// names only the flag, the rule or the cure carries none of these and is no reason. Returns the links (upper case) that have a reason.
// Amendment 3 (7571, Worker_E's 7570): the flagged item's own words are the flag, not a reason. A STATEMENT is tested after its bar only, and
// from every carrier the text of a flagged item's line (flags: the items' lines; whitespace and emphasis folded) is removed before the test.
function cureReasoned(o,flags){const U=s=>String(s).toUpperCase();const out=new Set();
 const fold=s=>String(s||'').replace(/[*_`]+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim();
 const F=[...new Set((flags||[]).map(fold).filter(Boolean))].sort((a,b)=>b.length-a.length);
 const strip=s=>{let t=fold(s);for(const f of F)t=t.split(f).join(' ');return t.replace(/\s+/g,' ').trim();};
 const carriers=o.statement.map(s=>({name:fold(s.label)+' '+strip(s.text),body:strip(s.text)})).concat(o.prose.map(p=>{const t=strip(p);return {name:t,body:t};})).concat(o.withdrawn.filter(w=>w.reason).map(w=>({name:w.link+' '+strip(w.reason),body:strip(w.reason)}))); /* judge_fix4 F3: a RETRACTED line carries its own reason */
 for(const w of o.withdrawn){const m=String(w.link).match(/^D(\d+) vs C(\d+)$/);if(!m)continue;const re=new RegExp('\\bD'+m[1]+'\\s+vs\\.?\\s+C'+m[2]+'\\b','i');
  if(carriers.some(c=>re.test(c.name)&&/[\[(]?\b[CD]R[1-4]\b/i.test(c.body)&&(/["“][^"”]*\S\s+\S+\s+\S[^"”]*["”]/.test(c.body)||cureRefs(c.body).length>0)))out.add(U(w.link));}
 return out;}
// checker_fix FIX 2 (runs 32194 B2, 32212 B2): K-G4 searches, for each PRESSED witness the BROKEN line names, every later round of the side
// that holds the link (order CR1 DR1 CR2 DR2 CR3 DR3; CR = defender, DR = challenger). The pressed witnesses: the verses the line names that
// the quoted pressing words also name; failing that, the verses the line names outside its anchor parentheses that the pressing round names;
// failing that, the verses the line names outside its anchor. The line's anchor verse is never searched for its own sake (32212 ChatGPT).
// Returns each later naming found: {ref, round, pos}. Any naming makes the BROKEN grade unanswered-false.
function kg4Witnesses(line,q,pressText){const L=new Set(cureRefs(line).map(r=>r.key));const Q=[...new Set(cureRefs(q).map(r=>r.key))].filter(k=>L.has(k));if(Q.length)return Q;
 const an=new Set(cureRefs((String(line||'').match(/\(([^)]*\d+:\d+[^)]*)\)/)||[0,''])[1]).map(r=>r.key));const B0=[...L].filter(k=>!an.has(k));
 const P=new Set(cureRefs(pressText||'').map(r=>r.key));const BP=B0.filter(k=>P.has(k));return BP.length?BP:B0;}
function kg4Answered(side,line,presses,R){const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];const own=side==='DEFENDER'?['CR1','CR2','CR3','CR4']:['DR1','DR2','DR3'];const out=[];const seen=new Set();
 for(const p of presses){const later=own.filter(k=>ORD.indexOf(k)>ORD.indexOf(p.round));
  for(const w of kg4Witnesses(line,p.q,R[p.round]))for(const k of later){if(typeof R[k]!=='string'||seen.has(w+'|'+k))continue;const h=cureRefs(R[k],true).find(r=>r.key===w); /* judge_fix4 F6 */if(h){seen.add(w+'|'+k);out.push({ref:w,round:k,pos:h.pos});}}}
 return out;}
const kg4Txt=a=>a.map(z=>'['+z.round+'] '+z.ref+' at '+z.pos).join('; ');
function cureVerdicts(items,reply,broken,rounds){const U=s=>String(s).toUpperCase();const o=cureLines(reply&&reply.ok?reply.text:'');const R=rounds||{};
 const nK1={DEFENDER:items.filter(x=>x.rule==='K-G1'&&x.side==='DEFENDER').length,CHALLENGER:items.filter(x=>x.rule==='K-G1'&&x.side==='CHALLENGER').length};
 const rsn=cureReasoned(o,items.map(x=>x.line)); // DoD 18; amendment 3: the items' own lines are no reason
 const wd=new Set(o.result.length===1?o.withdrawn.filter(w=>rsn.has(U(w.link))).map(w=>U(w.link)):[]); // BB-7330: a retraction counts only beside exactly one CORRECTED RESULT line
 const rxNoWhy=new Set(o.result.length===1?o.withdrawn.filter(w=>!rsn.has(U(w.link))).map(w=>U(w.link)):[]); // DoD 18: retracted with no reason
 const rxNoRes=new Set(o.result.length!==1?o.withdrawn.map(w=>U(w.link)):[]);
 // ITEM 5: the judge's own STATEMENT for this item: by its link, or for a standing item by its side; the first one written is kept.
 // judge_fix2 W1 (operator, 2026-11-02): every flagged item needs a RESPONSE line in the judge's own words; the label names the item as the
 // FLAGGED ITEMS list labels it (cureLabel), or its link, or for K-G3 the side's STANDING.
 // judge_fix3 A6 (run 32255 enforcer rows 13 and 17: the K-G4 and K-S RESPONSE lines were stored for K-DG8 D1 vs C1 and K-C D6): a RESPONSE line
 // serves an item only when it names the item's own rule, or names no rule; the full label (rule and item) is preferred to the item alone.
 const respOf=(x)=>{const lb=U(cureLabel(x));const rk=U(x.rule||'');const ruleOk=L=>{const rs=L.match(/\bK-[A-Z]+[0-9]*\b/g)||[];return !rs.length||rs.includes(rk);};
  const r=o.response.find(s=>{const L=U(s.label);return L.includes(lb)&&ruleOk(L);})||o.response.find(s=>{const L=U(s.label);return ruleOk(L)&&(x.link?L.includes(U(x.link)):(L.includes(x.side)&&L.includes('STANDING')));});return r?r.text:null;};
 const stmtOf=(x)=>{const st=o.statement.find(s=>x.link?U(s.label).includes(U(x.link)):(U(s.label).includes(x.side)&&U(s.label).includes(U(x.rule))));return st?st.text:null;};
 // 6904 (c): a statement is run through the item's own check. Quotations in it (straight or curly marks, 3+ words) and round names ([DR1] etc.).
 const stmtQ=(t)=>[...String(t||'').matchAll(/["“]([^"”]{8,})["”]/g)].map(m=>m[1]);
 const stmtPress=(x)=>{const t=stmtOf(x);if(!t)return null;for(const rk of CURE_PRESS[x.side]){if(!new RegExp('\\['+rk+'\\]').test(t)||typeof R[rk]!=='string')continue;const q=stmtQ(t).find(q=>cureFound(q,R[rk]));if(q)return {round:rk,q,line:'STATEMENT: '+t};}return null;};
 return items.map(x=>{const res=(status,why,lines,kinds)=>{const keys=(x.rule==='K-B'||x.rule==='K-S'||x.rule==='K-C'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K')?[x.link]:(x.rule==='K-G1'||x.rule==='K-G4')?[x.link,x.side]:[x.side].concat((broken||{})[x.side]||[]);
   const bad=status==='UNCURED'?o.malformed.find(l=>cureOwn(l,x)):null; /* judge_fix4 F3: the item's own refused line, never the first one found */
   return {...x,judge_statement:stmtOf(x),response:respOf(x),status,why:(why||'')+(bad?(why?'; ':'')+'malformed line: '+bad.slice(0,160):'')||null,statement:(l=>l&&l.length?l.join(' / '):null)(status==='CURED'&&/^retracted/.test(why||'')&&o.result.length===1?(lines||[]).concat([o.result[0].line]):lines),kinds:kinds||[]};}; // BB-7330: a cure by retraction shows its CORRECTED RESULT line
  if(!reply||!reply.ok)return res('UNCURED','cure call failed: '+(reply?reply.why:'no reply'),null);
  if(!respOf(x))return res('UNCURED','no written response',null); // judge_fix2 W1: no RESPONSE line for the item leaves it UNCURED
  if(x.link&&rxNoRes.has(U(x.link)))return res('UNCURED','RETRACTED without exactly one CORRECTED RESULT line',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
  if(x.link&&rxNoWhy.has(U(x.link)))return res('UNCURED','RETRACTED with no reason naming the round and its words or verse (rulings 105)',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
  // BB-6904 rev 8 K-G5 (operational_doc 27 class 1): the verses of the line's parentheses that the answering link round names; for those a
  // SHORT line must quote that link round's own answer: words found near its naming of the verse (cureNamed: 300 characters before to 1,200
  // after, inside its LINK block). References are read by cureRefs (lists, ranges, short book names, inherited book).
  // BB-6904 rev 12 (7374, 7377): the answer is read from any later round of the side that holds the link, its round 2 or its link round,
  // that comes after the round named as pressing the witness (order CR1 DR1 CR2 DR2 CR3 DR3).
  const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];const ansK=pr=>(x.side==='DEFENDER'?['CR2','CR3','CR4']:['DR1','DR2','DR3']).filter( /* judge_fix2 R2 */k=>!pr||ORD.indexOf(k)>ORD.indexOf(pr));
  const namedIn=pr=>(x.rule==='K-G1'||x.rule==='K-G4')?ansK(pr).filter(k=>typeof R[k]==='string'&&R[k]).map(k=>({k,n:cureNamed(x.line,R[k])})).filter(z=>z.n.length):[];
  const nmTxt=pr=>namedIn(pr).map(z=>'['+z.k+'] '+z.n.map(n=>n.ref).join(', ')).join('; ');
  // A quotation is the answer only in that round's own words: it is not also found in a round of the other side before it (a verse's own
  // words, quoted by both sides, never count as the answer).
  const ownQ=(q,k)=>!(x.side==='DEFENDER'?['DR1','DR2','DR3','DR4']:['CR1','CR2','CR3','CR4']).some(o2=>ORD.indexOf(o2)<ORD.indexOf(k)&&typeof R[o2]==='string'&&cureFound(q,R[o2]));
  // BB-7397 rev 9 DoD 19: a quotation counts when it overlaps a window: found in the window widened by twice its length and 40 characters,
  // and in neither margin alone (a second occurrence inside a margin makes the test refuse, never accept).
  const inWin=(q,z)=>cureNamed(x.line,R[z.k],2*String(q).length+40).some(n=>n.blocks.some((b,i)=>cureFound(q,b)&&!cureFound(q,n.left[i])&&!cureFound(q,n.right[i])));
  const shortOk=pr=>{const nm=namedIn(pr);return !nm.length||o.short.some(s=>U(s.link)===U(x.link)&&nm.some(z=>z.k===s.round&&ownQ(s.q,z.k)&&inWin(s.q,z)))||stmtQ(stmtOf(x)).some(q=>nm.some(z=>ownQ(q,z.k)&&inWin(q,z)));};
  if(x.rule==='K-G4'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const ps=o.pressed.filter(p=>U(p.link)===U(x.link));const sl=o.short.filter(s=>U(s.link)===U(x.link)).map(s=>s.line);const lines=ps.map(p=>p.line).concat(sl);
   // checker_fix FIX 2: the pressing sentence is still quoted and found; then each pressed witness is searched in every later round of the
   // side that holds the link (kg4Answered), not the line's anchor verse; a later naming makes the grade unanswered-false (a SHORT line no longer cures it).
   if(!ps.length){const sp=stmtPress(x);if(!sp)return res('UNCURED','no PRESSED line, no RETRACTED line, and no statement that names a pressing round and quotes it, for '+x.link,lines);
    const an=kg4Answered(x.side,x.line,[sp],R);if(an.length)return res('UNCURED','unanswered-false: statement quotes '+sp.round+', but a later '+x.side.toLowerCase()+' round names the pressed witness: '+kg4Txt(an),lines.concat([sp.line]));
    return res('CURED','statement passes the check: quotation found in '+sp.round+'; the pressed witness is named in no later '+x.side.toLowerCase()+' round',lines.concat([sp.line]));}
   const ok=ps.filter(p=>CURE_PRESS[x.side].includes(p.round));if(!ok.length)return res('UNCURED','PRESSED round '+ps.map(p=>'['+p.round+']').join(', ')+' does not press the '+x.side.toLowerCase(),lines);
   const hits=ok.filter(p=>typeof R[p.round]==='string'&&cureFoundAll(p.q,R[p.round]));if(!hits.length)return res('UNCURED',ok.every(p=>typeof R[p.round]!=='string')?'the named round text could not be read':'no quotation found in the named round',lines);
   const an=kg4Answered(x.side,x.line,hits,R);if(an.length)return res('UNCURED','unanswered-false: quotation found in '+hits.map(p=>p.round).join(', ')+', but a later '+x.side.toLowerCase()+' round names the pressed witness: '+kg4Txt(an),lines);
   return res('CURED','pressed: quotation found in '+hits.map(p=>p.round).join(', ')+'; the pressed witness is named in no later '+x.side.toLowerCase()+' round',lines);}
  if(x.rule==='K-B'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));const rs=cureRest(o,x);
   if(!rs.length){const st=stmtOf(x);if(!st)return res('UNCURED','no RESTATED line and no statement for '+x.link,null);const sk=drvKinds(st);
    return res(sk.length>=2?'CURED':'UNCURED',sk.length>=2?'statement passes K-B':'statement exhibits '+sk.length+' layer kind'+(sk.length===1?'':'s')+'; the violation stands',['STATEMENT: '+st],sk);}if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   const k=drvKinds(rs[0].text);if(rs[0].grade!==x.side+' LINK BROKEN')return res('UNCURED','statement does not keep the grade '+x.side+' LINK BROKEN'+(rs[0].grade?' (it reads '+rs[0].grade+')':''),[rs[0].line],k);
   return res(k.length>=2?'CURED':'UNCURED',k.length>=2?null:'statement exhibits '+k.length+' layer kind'+(k.length===1?'':'s'),[rs[0].line],k);}
  if(x.rule==='K-G1'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];const ps=o.pressed.filter(p=>U(p.link)===U(x.link));const lines=cs.map(c=>c.line).concat(ps.map(p=>p.line));
   if(!ns.length)return res('UNCURED','no CORRECTED COUNT for '+x.side+' and no RETRACTED line for '+x.link,lines);
   if(ns.length>1)return res('UNCURED','two differing CORRECTED COUNT lines for '+x.side,lines);
   if(ns[0]<nK1[x.side])return res('UNCURED','corrected count '+ns[0]+' is below '+nK1[x.side],lines);
   if(!ps.length){const sp=stmtPress(x);if(!sp)return res('UNCURED','no PRESSED line and no statement that names a pressing round and quotes it, for '+x.link,lines);
    if(!shortOk(sp.round))return res('UNCURED','the later round '+nmTxt(sp.round)+'; neither a SHORT line nor the statement quotes its answer',lines.concat([sp.line]));
    return res('CURED','corrected: '+x.side+' COUNT '+ns[0]+'; statement passes the check: quotation found in '+sp.round,lines.concat([sp.line]));}
   const ok=ps.filter(p=>CURE_PRESS[x.side].includes(p.round));if(!ok.length)return res('UNCURED','PRESSED round '+ps.map(p=>'['+p.round+']').join(', ')+' does not press the '+x.side.toLowerCase()+' (it must be '+CURE_PRESS[x.side].map(k=>'['+k+']').join(', ')+')',lines);
   const hit=ok.find(p=>typeof R[p.round]==='string'&&cureFoundAll(p.q,R[p.round]));
   if(hit&&!shortOk(hit.round))return res('UNCURED','the later round '+nmTxt(hit.round)+'; no SHORT line quoting its answer',lines);
   if(hit)return res('CURED','corrected: '+x.side+' COUNT '+ns[0]+'; quotation found in '+hit.round,lines);
   return res('UNCURED',ok.every(p=>typeof R[p.round]!=='string')?'the named round text could not be read':'no quotation found in the named round',lines);}
  if(x.rule==='K-G3'){const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];
   if(sv.length>1)return res('UNCURED','two differing CORRECTED STANDING lines for '+x.side,ss.map(s=>s.line));
   if(sv.length===1&&sv[0]!=='SELF-SUPPORTED')return res('CURED','corrected: '+x.side+' STANDING '+sv[0],ss.map(s=>s.line));
   const need=((broken||{})[x.side]||[]).map(U);const wl=o.withdrawn.filter(w=>need.includes(U(w.link))).map(w=>w.line);
   if(!need.length)return res('UNCURED','the BROKEN links of '+x.side+' could not be read from the judgment',ss.map(s=>s.line).concat(wl));
   const miss=need.filter(l=>!wd.has(l));if(!wl.length&&!ss.length)return res('UNCURED','no CORRECTED STANDING for '+x.side+' and no RETRACTED line',null);
   if(miss.length)return res('UNCURED',(sv[0]==='SELF-SUPPORTED'?'standing kept SELF-SUPPORTED; ':'')+(miss.some(l=>rxNoRes.has(l))?'RETRACTED without exactly one CORRECTED RESULT line; ':'')+(miss.some(l=>rxNoWhy.has(l))?'RETRACTED with no reason naming the round and its words or verse (rulings 105); ':'')+'no counted RETRACTED line for '+miss.join(', '),ss.map(s=>s.line).concat(wl));
   return res('CURED','retracted: '+need.join(', '),wl);}
  // THE DEBATE FIXED (BB-7397, DoD 3, binding note BB-7409) K-G6: a premise the ledger marks NOT NAMED that the judge's count does not
  // count. Cured by a statement quoting the transcript, or by a CORRECTED COUNT at least the original count plus the side's K-G6 premises
  // not answered by statement, with the CORRECTED STANDING that count makes true (COLLAPSED when 2c > L, else PROP-DEPENDENT).
  // DoD 7 (BB-7420) K-G7: a DEFENDER LINK BROKEN line on a premise the judge's count leaves uncounted. K-G6 and K-G7 share one count: the
  // side's count plus the union of its K-G6 premises not cured by statement and its K-G7 premises not retracted. K-G7 is also cured by a
  // RETRACTED line for the link beside exactly one CORRECTED RESULT (the seat is then counted on that result, cureCorrected).
  const sq=y=>{const q=stmtQ(stmtOf(y));return Object.keys(R).find(k=>typeof R[k]==='string'&&q.some(z=>cureFound(z,R[k])))||null;};
  const kNeed=sd=>{const ps=new Set();for(const y of items){if(y.side!==sd)continue;
   if(y.rule==='K-G6'&&!sq(y))ps.add('P'+(String(y.link).match(/(\d+)\s*$/)||[0,y.link])[1]);if(y.rule==='K-G7'&&!wd.has(U(y.link)))ps.add(y.premise!=null?'P'+y.premise:'L'+U(y.link));}return ps.size;};
  const kCount=(x,none)=>{const needN=(x.conc||0)+kNeed(x.side);
   const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];const lines=cs.map(c=>c.line).concat(ss.map(s=>s.line));
   if(!ns.length)return res('UNCURED','no CORRECTED COUNT for '+x.side+' and '+none+' for '+x.link,lines);
   if(ns.length>1)return res('UNCURED','two differing CORRECTED COUNT lines for '+x.side,lines);
   if(ns[0]<needN)return res('UNCURED','corrected count '+ns[0]+' is below '+needN,lines);
   if(sv.length>1)return res('UNCURED','two differing CORRECTED STANDING lines for '+x.side,lines);
   const want=(x.L&&2*ns[0]>x.L)?'COLLAPSED':'PROP-DEPENDENT';const got=sv.length===1?sv[0]:(x.st||null);
   if(got!==want)return res('UNCURED','count '+ns[0]+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),lines);
   return res('CURED','counted: '+x.side+' COUNT '+ns[0]+', STANDING '+want,lines);};
  if(x.rule==='K-G6'){if(o.count.some(c=>c.side===x.side&&c.n>(x.conc||0)))return kCount(x,'no statement quoting the transcript');const rk=sq(x);if(rk)return res('CURED','statement quotes the transcript ('+rk+')',['STATEMENT: '+stmtOf(x)]);
   return kCount(x,'no statement quoting the transcript');}
  if(x.rule==='K-G7'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   return kCount(x,'no RETRACTED line with one CORRECTED RESULT');}
  // DoD 9 K-G8: the side's counted_premises array and its count differ; cured by the count the line and the side's K-G6/K-G7 premises make.
  if(x.rule==='K-G8')return kCount(x,'no other cure');
  // P2D v6a item 1b: K-S is cured by one RESTATED line for the link that names an answering round, or that grades it LINK BROKEN beside one CORRECTED RESULT.
  if(x.rule==='K-S'){const rs=cureRest(o,x);
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(/LINK BROKEN$/.test(rs[0].grade||'')){if(o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line]);return res('CURED','regraded LINK BROKEN',[rs[0].line,o.result[0].line]);}
   if(!DRV_ANS.test(rs[0].text))return res('UNCURED','the restated line names no round that answered the witness',[rs[0].line]);
   return res('CURED','regraded: answering round named',[rs[0].line]);}
  // BB-8327 D1: K-C is cured by one RESTATED line for the item that drops the stating ground and names the chain footing (two layer kinds); a regrade to LINK BROKEN needs one CORRECTED RESULT.
  if(x.rule==='K-C'){const rs=cureRest(o,x);
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(netKeeps(rs[0].text))return res('UNCURED','the restated line keeps the ground that a verse does not state the link',[rs[0].line]); // checker_fix FIX 1: masked as netLines masks
   const k=drvKinds(rs[0].text);if(k.length<2)return res('UNCURED','the restated line names no chain footing: it exhibits '+k.length+' layer kind'+(k.length===1?'':'s'),[rs[0].line],k);
   if(/LINK BROKEN$/.test(rs[0].grade||'')&&o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line],k);
   return res('CURED',null,[rs[0].line],k);}
  // judge_fix2 E1, E4: K-N and K-K are cured by one RESTATED line for the item that its own test no longer marks (judge_fix4 F2: K-DG8 removed).
  if(x.rule==='K-N'||x.rule==='K-K'){const rs=cureRest(o,x);const test=x.rule==='K-N'?knLines:kkLines;
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   const txt=/^D\d+/i.test(x.link)?rs[0].text:x.link+': '+rs[0].text;
   if(test(txt).length)return res('UNCURED','the restated line keeps what '+x.rule+' marks',[rs[0].line]);
   return res('CURED','restated',[rs[0].line]);}
  // judge_fix2 E2: K-SC is cured by a RESTATED line for the link that is not STANDS, by a RESTATED CONCEDED LINKS line that no longer counts the
  // premise, or by a STATEMENT that names a round and quotes words found in that round.
  if(x.rule==='K-SC'){const rs=cureRest(o,x);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(rs.length&&rs[0].grade&&rs[0].grade!=='STANDS'){if(/LINK BROKEN$/.test(rs[0].grade)&&o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line]);return res('CURED','regraded '+rs[0].grade,[rs[0].line]);}
   const rc=o.restated.filter(r=>r.link==='CONCEDED LINKS');if(x.premise!=null&&rc.length===1&&!cntItems('CONCEDED LINKS: '+rc[0].text).some(i=>i.link===x.premise&&(i.tag==='UNEXHIBITED'||(i.tag==='CONCEDED'&&!knNarrow(i)))))return res('CURED','the restated count no longer counts premise '+x.premise,[rc[0].line]);
   const st=stmtOf(x);if(st){const rk=['CR1','CR2','CR3','CR4','DR1','DR2','DR3'].find(k=>new RegExp('\['+k+'\]').test(st)&&typeof R[k]==='string'&&stmtQ(st).some(q=>cureFound(q,R[k])));if(rk)return res('CURED','statement names '+rk+' and quotes it',['STATEMENT: '+st]);}
   return res('UNCURED',rs.length?'the restated line still grades '+x.link+' STANDS, and no statement names a round and quotes it':'no regrade, no restated count and no statement naming a round and quoting it, for '+x.link,rs.length?[rs[0].line]:null);}
  return res('UNCURED','unknown rule',null);});}
// BB-7330 (option 2, the operator's "2" at 14:51 CDT): where a RETRACTED line cured an item, the seat is counted on its one CORRECTED RESULT.
function cureCorrected(reply,v){const o=cureLines(reply&&reply.ok?reply.text:'');if(o.result.length!==1)return null;
 if(!(v||[]).some(x=>x.status==='CURED'&&/^(?:retracted|regraded LINK BROKEN)/.test(x.why||'')))return null;const rsn=cureReasoned(o,(v||[]).map(x=>x.line));return {tag:o.result[0].tag,word:o.result[0].word,links:[...new Set(o.withdrawn.filter(w=>rsn.has(String(w.link).toUpperCase())).map(w=>w.link))]};}
// THE DEBATE FIXED (BB-7397, DoD 5, BB-7406): a cure's CORRECTED STANDING and CORRECTED COUNT for a side with a CURED count or standing item
// (K-G1, K-G3, K-G6, K-G7) are written to the row's columns; the original is kept in the judge's text by an AUDIT line.
function cureSet(reply,v){const o=cureLines(reply&&reply.ok?reply.text:'');const out={};
 // BB-7417 defect 3: a side is written only when every count or standing item of that side is CURED, and not when each is a K-G6
 // statement cure (no count was checked).
 for(const side of ['DEFENDER','CHALLENGER']){const ks=(v||[]).filter(x=>x.side===side&&(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'));
  if(!ks.length||ks.some(x=>x.status!=='CURED')||ks.every(x=>x.rule==='K-G6'&&/^statement/.test(String(x.why||''))))continue;
  const ns=[...new Set(o.count.filter(c=>c.side===side).map(c=>c.n))];const sv=[...new Set(o.standing.filter(s=>s.side===side).map(s=>s.st))];
  if(ns.length===1||sv.length===1)out[side]={n:ns.length===1?ns[0]:null,st:sv.length===1?sv[0]:null};}
 return Object.keys(out).length?out:null;}
function cureSetApply(p,cs,seat){const F={DEFENDER:['defense_standing','conceded_links'],CHALLENGER:['challenge_standing','challenger_conceded_links']};const lines=[];
 for(const side of Object.keys(cs||{})){const fs=F[side][0],fn=F[side][1],c=cs[side];const was=(p[fs]||'?')+', '+(p[fn]==null?'?':p[fn]);
  if(c.st)p[fs]=c.st;if(c.n!=null)p[fn]=c.n;
  lines.push('[AUDIT v21: CORRECTED STANDING -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+side+'; ORIGINAL: '+was+'; COUNTED: '+(p[fs]||'?')+', '+(p[fn]==null?'?':p[fn])+']');}
 return lines;}
// THE DEBATE FIXED rev 7, DoD 10 record half (ruled BB-7508 (i)): BB-7417 defect 3 stands, so a side whose count or standing items are not
// all CURED is not written; when the reply holds one CORRECTED COUNT for that side, one AUDIT line records the count and the items not cured.
function cureCountHeld(reply,v,cs,seat){const o=cureLines(reply&&reply.ok?reply.text:'');const lines=[];
 for(const side of ['DEFENDER','CHALLENGER']){if(cs&&cs[side])continue;const ns=[...new Set(o.count.filter(c=>c.side===side).map(c=>c.n))];if(ns.length!==1)continue;
  const nc=(v||[]).filter(x=>x.side===side&&(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8')&&x.status!=='CURED');if(!nc.length)continue;
  lines.push('[AUDIT v21: CORRECTED COUNT NOT WRITTEN -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+side+'; CORRECTED COUNT: '+ns[0]+'; NOT CURED: '+cureSafe(nc.map(x=>x.rule+' '+(x.rule==='K-G3'?x.side+' STANDING':x.link)).join(', '))+'; written only when every count or standing item of the side is CURED (BB-7417)]');}
 return lines;}
const cureCorrLine=(seat,orig,c)=>'[AUDIT v21: CORRECTED RESULT -- '+(seat?'SEAT: '+seat+'; ':'')+'ORIGINAL: '+orig+'; COUNTED: '+c.word+' ('+c.tag+'); RETRACTED: '+c.links.join(', ')+']';
const cureSafe=s=>String(s).replace(/\[/g,'(').replace(/\]/g,')').replace(/;(\s*(?:SEAT|ITEM|RULE|RESULT|KINDS|WHY|LINE|STATEMENT|JUDGE STATEMENT):)/g,',$1');
// judge_fix4 F1 (run 32266: DeepSeek retracted "D6 vs C4 (Matthew 1:25): CHALLENGER LINK BROKEN", the only ground of its CHALLENGE STANDING
// PROP-DEPENDENT and its RESULT DEFENDER WINS, and neither was recomputed; GLM likewise). After a cure that retracts or regrades a collision line,
// or corrects a count, the seat's counts, standings, verdict and RESULT are recomputed from the cured lines by the rulebook's own definitions
// (engine_manual v85 section 8): STANDINGS (SELF-SUPPORTED requires a count of 0; PROP-DEPENDENT at 1 or more, or while a link of that side is
// graded BROKEN (K-G3); COLLAPSED when 2c > L), VERDICT DEFINITIONS (first match: BROKEN-1 k >= 1; BROKEN-2 2w > n or the keystone WITHDRAWN;
// PARTIAL-1 w >= 1; PARTIAL-2 DEFENSE STANDING COLLAPSED; HELD-1), RESULT (BROKEN gives CHALLENGER WINS; HELD gives DEFENDER WINS only if the
// challenge is not SELF-SUPPORTED or a collision stands graded CHALLENGER LINK BROKEN; every other case UNDERDETERMINED). The values are written
// to the seat's fields and its stored text (the RESULT, STANDING, count, CLAUSE and retracted or regraded collision lines are replaced); the
// original values and lines stay in one AUDIT line. Applied before the panel outcome is derived; the single judge's record too.
function rcObjEnd(t,a){let d=0,q=false;for(let i=a;i<t.length;i++){const c=t[i];if(q){if(c==='\\')i++;else if(c==='"')q=false;continue;}if(c==='"')q=true;else if(c==='{')d++;else if(c==='}'&&--d===0)return i+1;}return -1;}
// The judgment's own text: a panel row's "reasoning" (the JSON object that opens the row), or the single judge's text before its AUDIT lines.
function cureJText(raw,panel){const s=String(raw||'');if(!panel){const i=s.indexOf('\n\n[AUDIT');return i<0?s:s.slice(0,i);}
 const a=s.indexOf('{');const b=a<0?-1:rcObjEnd(s,a);if(b>0){try{const o=JSON.parse(s.slice(a,b));if(o&&typeof o.reasoning==='string')return o.reasoning;if(o&&typeof o.reason==='string')return o.reason;}catch(e){}}return cureUnwrap(s);}
function rcLines(text){const out={col:[],clause:null,key:null,result:null,st:{},cn:{},wdn:0};
 for(const raw of String(text||'').split('\n')){const l=raw.replace(/[*_`]+/g,'').trim();const u=l.toUpperCase();if(!l)continue;
  const m=u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+)\s+VS\.?\s+(C\d+)\b/);if(m){const g=(u.slice(m[0].length).match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/)||[])[1]||null;out.col.push({link:m[1]+' vs '+m[2],grade:g,raw});continue;}
  if(/^(?:[-•]|\d+[.)])?\s*D\d+\s*:?\s*(?:--|—|-|:)?\s*WITHDRAWN\b/.test(u))out.wdn++;
  if(/^CLAUSE\s*:/.test(u)){if(!out.clause)out.clause={raw,u};continue;}if(/^KEYSTONE\s*:/.test(u)){if(!out.key)out.key={raw,u};continue;}if(/^RESULT\s*:/.test(u)){if(!out.result)out.result={raw,u};continue;}
  const s=u.match(/^(DEFENSE|CHALLENGE) STANDING\s*:/);if(s){if(!out.st[s[1]])out.st[s[1]]={raw,u};continue;}
  const c=u.match(/^(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:/);if(c&&!out.cn[c[1]])out.cn[c[1]]={raw,u};}
 return out;}
const rcOne=s=>String(s||'').replace(/\s+/g,' ').trim();
const rcCut=s=>{s=rcOne(s);return s.length>300?s.slice(0,297)+'...':s;};
// F: the seat's current fields {verdict_tag, defense_standing, conceded_links, challenge_standing, challenger_conceded_links}. Returns null when
// the cure retracted, regraded or recounted nothing; else the recomputed fields, RESULT word, CLAUSE tag, line replacements and the AUDIT line.
function cureRecompute(seat,text,F,items,v,reply){const o=cureLines(reply&&reply.ok?reply.text:'');const U=s=>String(s==null?'':s).toUpperCase();const P=rcLines(text);
 const rsn=cureReasoned(o,(items||[]).map(x=>x.line));const wd=o.result.length===1?o.withdrawn.filter(w=>rsn.has(U(w.link))):[];
 const trig=[];const rp=[];const col=P.col.map(c=>({...c}));const done=new Set();
 for(const w of wd){const c=col.find(z=>U(z.link)===U(w.link));if(!c||done.has(U(c.link)))continue;done.add(U(c.link));
  const rs=o.restated.find(r=>U(r.link)===U(w.link)&&r.grade&&!/LINK BROKEN$/.test(r.grade));const g=rs?rs.grade:(w.regrade||'UNDERDETERMINED');
  const nl=rs?rs.text:(w.link+((c.raw.match(/\([^)]*\d+:\d+[^)]*\)/)||[''])[0]?' '+(c.raw.match(/\([^)]*\d+:\d+[^)]*\)/)||[''])[0]:'')+': '+g+' -- retracted in the cure'+(w.reason?' -- '+w.reason:''));
  trig.push('RETRACTED '+w.link+' ('+(c.grade||'?')+' to '+g+')');c.grade=g;rp.push([c.raw,nl]);}
 for(const x of (v||[]).filter(y=>y.status==='CURED'&&/^D\d+ vs C\d+$/i.test(String(y.link||'')))){const c=col.find(z=>U(z.link)===U(x.link));if(!c||done.has(U(c.link)))continue;
  const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length!==1||!rs[0].grade||rs[0].grade==='STANDS'||rs[0].grade===c.grade)continue;done.add(U(c.link));
  trig.push('RESTATED '+x.link+' ('+(c.grade||'?')+' to '+rs[0].grade+')');c.grade=rs[0].grade;rp.push([c.raw,rs[0].text]);}
 const cs=cureSet(reply,v);const cnt={DEFENDER:F.conceded_links,CHALLENGER:F.challenger_conceded_links};const lab={DEFENDER:'CONCEDED LINKS',CHALLENGER:'CHALLENGER CONCEDED LINKS'};const cnew={};
 for(const sd of ['DEFENDER','CHALLENGER']){let n=null,from=null;
  const rc=o.restated.filter(r=>r.link===lab[sd]);const ok=(v||[]).some(x=>x.status==='CURED'&&(U(x.link)===lab[sd]||(x.rule==='K-SC'&&/restated count/.test(String(x.why||'')))));
  if(rc.length===1&&ok){const lead=rc[0].text.match(/^\s*(\d+)\b/);n=lead?+lead[1]:new Set(cntItems(lab[sd]+': '+rc[0].text).filter(i=>i.tag==='CONCEDED'||i.tag==='UNEXHIBITED').map(i=>i.n)).size;from=rc[0].text;}
  if(cs&&cs[sd]&&cs[sd].n!=null){n=cs[sd].n;from=null;trig.push('CORRECTED COUNT '+sd+' '+n);} /* a cured CORRECTED COUNT is a trigger even when already written to the fields */
  if(n!=null&&n!==cnt[sd]){trig.push('COUNT '+sd+' '+cnt[sd]+' to '+n);cnew[sd]={n,from};}}
 if(!trig.length)return null;
 const c={DEFENDER:cnew.DEFENDER?cnew.DEFENDER.n:cnt.DEFENDER,CHALLENGER:cnew.CHALLENGER?cnew.CHALLENGER.n:cnt.CHALLENGER};
 const Lof=k=>{const x=P.st[k];const m=x&&x.u.match(/\bL\s*=\s*(\d+)/);return m?+m[1]:null;};
 const brk={DEFENDER:col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length,CHALLENGER:col.filter(z=>z.grade==='CHALLENGER LINK BROKEN').length};
 const stand=(sd,k,orig)=>{const x=P.st[k];if(x&&/FORFEIT/.test(x.u))return orig;const L=Lof(k),n=c[sd];if(typeof n!=='number')return orig;
  if(L!=null&&2*n>L)return 'COLLAPSED';if(L==null&&orig==='COLLAPSED'&&n>0)return 'COLLAPSED';return (n>=1||brk[sd]>0)?'PROP-DEPENDENT':'SELF-SUPPORTED';};
 const dst=stand('DEFENDER','DEFENSE',F.defense_standing),cst=stand('CHALLENGER','CHALLENGE',F.challenge_standing);
 const cl=P.clause?P.clause.u:'';const nN=(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(cl.match(/\bW\s*=\s*(\d+)/)||[])[1];const n=nN!=null?+nN:null;const w=wN!=null?+wN:P.wdn;
 const kw=!!(P.key&&/^KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)\s*WITHDRAWN\b/.test(P.key.u));const k=brk.DEFENDER;
 const tag=k>=1?'BROKEN-1':((n!=null&&2*w>n)||kw)?'BROKEN-2':w>=1?'PARTIAL-1':dst==='COLLAPSED'?'PARTIAL-2':'HELD-1';const word=tag.split('-')[0];
 const res=word==='BROKEN'?'CHALLENGER WINS':word==='HELD'?((cst!=='SELF-SUPPORTED'||brk.CHALLENGER>0)?'DEFENDER WINS':'UNDERDETERMINED'):'UNDERDETERMINED';
 const res0=P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null;
 const why='recomputed after the cure from the cured lines ('+trig.join('; ')+')';
 if(P.result&&res!==res0)rp.push([P.result.raw,'RESULT: '+res+' -- '+why+': '+tag+', CHALLENGE STANDING '+cst+', '+(brk.CHALLENGER?brk.CHALLENGER+' collision line(s) stand graded CHALLENGER LINK BROKEN':'no collision line stands graded CHALLENGER LINK BROKEN')+'.']);
 for(const [sd,k2,st,st0] of [['DEFENDER','DEFENSE',dst,F.defense_standing],['CHALLENGER','CHALLENGE',cst,F.challenge_standing]]){const x=P.st[k2];
  if(x&&(st!==st0||c[sd]!==cnt[sd]))rp.push([x.raw,k2+' STANDING: '+st+' -- L='+(Lof(k2)!=null?Lof(k2):'?')+' c='+c[sd]+' -- '+why+'.']);
  const y=P.cn[lab[sd]];if(y&&cnew[sd])rp.push([y.raw,lab[sd]+': '+c[sd]+' -- '+why+(cnew[sd].from?' -- '+cnew[sd].from.replace(/^\s*\d+\s*(?:--|—|-|:)?\s*/,''):'')+'.']);}
 if(P.clause&&!new RegExp('^CLAUSE\\s*:\\s*'+tag+'\\b').test(P.clause.u))rp.push([P.clause.raw,P.clause.raw.replace(/^(\s*[*_]*CLAUSE[*_]*\s*:\s*[*_]*)(?:[A-Z]+-\d)?/i,'$1'+tag+' ').replace(/\bk\s*=\s*\d+/i,'k='+k)]);
 const fields={verdict_tag:word,defense_standing:dst,conceded_links:c.DEFENDER,challenge_standing:cst,challenger_conceded_links:c.CHALLENGER};
 const f=(t,d,dc,s2,cc,r)=>t+', DEFENSE '+d+' '+dc+', CHALLENGE '+s2+' '+cc+', RESULT '+(r||'none');
 const audit='[AUDIT v25: RECOMPUTED AFTER CURE -- '+(seat?'SEAT: '+seat+'; ':'')+'TRIGGER: '+cureSafe(trig.join(', '))+'; ORIGINAL: '+f(F.verdict_tag,F.defense_standing,F.conceded_links,F.challenge_standing,F.challenger_conceded_links,res0)
  +'; RECOMPUTED: '+f(word+' ('+tag+')',dst,c.DEFENDER,cst,c.CHALLENGER,res)+'; RULE: engine_manual v85 section 8, STANDINGS, RESULT and VERDICT DEFINITIONS'
  +(rp.length?'; ORIGINAL LINES: '+cureSafe(rp.map(r=>rcCut(r[0])).join(' / ')).replace(/\bRESULT\s*:/g,'RESULT --').replace(/\{/g,'(').replace(/\}/g,')'):'')+']';
 return {fields,result:res,result0:res0,tag,trig,rp,audit,retracted:wd.map(x=>x.link)};}
// The recomputed lines and fields written into the stored text: in a panel row, inside its JSON object (each line JSON-encoded in place, else the
// object re-serialized) with its typed fields; in the single judge's text, before its AUDIT lines. The AUDIT line is appended. When the verdict word
// changes, a CORRECTED RESULT line in the form derive_debate_outcome reads (judgment_result_word) is put first after the object.
function cureRewrite(raw,panel,R,seat,F0){let s=String(raw||'');const enc=x=>JSON.stringify(String(x)).slice(1,-1);
 if(panel){const a=s.indexOf('{');const b=a<0?-1:rcObjEnd(s,a);if(b>0){let j=s.slice(a,b);let miss=false;
   for(const [o0,n0] of R.rp){const e=enc(o0);if(j.includes(e))j=j.replace(e,()=>enc(n0));else miss=true;}
   if(miss){try{const ob=JSON.parse(j);let t=typeof ob.reasoning==='string'?ob.reasoning:'';for(const [o0,n0] of R.rp)t=t.replace(o0,()=>n0);ob.reasoning=t;j=JSON.stringify(ob,null,2);}catch(e){}}
   const F=R.fields;j=j.replace(/("verdict_tag"\s*:\s*")[A-Z]+(")/,'$1'+F.verdict_tag+'$2').replace(/("defense_standing"\s*:\s*")[A-Z-]+(")/,'$1'+F.defense_standing+'$2').replace(/("challenge_standing"\s*:\s*")[A-Z-]+(")/,'$1'+F.challenge_standing+'$2')
    .replace(/("conceded_links"\s*:\s*)\d+/,'$1'+F.conceded_links).replace(/("challenger_conceded_links"\s*:\s*)\d+/,'$1'+F.challenger_conceded_links);
   const cr=(F0&&F0.verdict_tag&&F0.verdict_tag!==F.verdict_tag)?'\n[AUDIT v21: CORRECTED RESULT -- '+(seat?'SEAT: '+seat+'; ':'')+'ORIGINAL: '+F0.verdict_tag+'; COUNTED: '+F.verdict_tag+' ('+R.tag+'); RETRACTED: '+R.retracted.join(', ')+']':'';
   s=s.slice(0,a)+j+cr+s.slice(b);}}
 else{const i=s.indexOf('\n\n[AUDIT');let t=i<0?s:s.slice(0,i);const rest=i<0?'':s.slice(i);for(const [o0,n0] of R.rp)t=t.replace(o0,()=>n0);s=t+rest;}
 return s+'\n'+R.audit;}
// Report line (step 6, 6904 e): fixed fields in fixed order, read back by Format Markdown. SEAT (panel only), ITEM, RULE, RESULT, then
// KINDS, WHY, LINE (the judge's original line, cut at 300 characters with "...") and STATEMENT when present; judge text has its brackets made round and any "; KEY:" broken.
// BB-7397 rev 9 DoD 24: STATEMENT and JUDGE STATEMENT above 600 characters are cut at the last space at or before 597, with "...".
function cureCut(s){s=String(s);if(s.length<=600)return s;const k=s.lastIndexOf(' ',597);return s.slice(0,k>0?k:597).replace(/\s+$/,'')+'...';}
// judge_fix2 W2: one row per flagged item for debate_enforcer_log, in full: the cure prompt sent (the last user message of the cure body), the
// full reply, the RESPONSE line, the result and its reason. The audit-line excerpt (cureReport) is kept as it was.
function enfPrompt(body){try{if(body&&Array.isArray(body.messages)){const u=body.messages.filter(m=>m&&m.role==='user');const c=u.length?u[u.length-1].content:null;return typeof c==='string'?c:JSON.stringify(c);}
 if(body&&Array.isArray(body.contents)){const u=body.contents.filter(m=>m&&m.role==='user');const c=u.length?u[u.length-1].parts:null;return Array.isArray(c)?c.map(p=>p&&p.text||'').join(''):null;}}catch(e){}return null;}
function enfRows(meta,v,reply,body){const T=new Date().toISOString();const ps=enfPrompt(body);const full=reply&&reply.ok?String(reply.text==null?'':reply.text):null;
 return (v||[]).map(x=>({run_token:meta.run_token||null,seat:meta.seat||null,seat_role:meta.role||null,judge_model:meta.model||null,kind:'cure',rule:x.rule,item:x.rule==='K-G3'?x.side+' STANDING':(x.link||null),
  flagged_line:x.line||null,prompt_sent:ps,full_reply:full,reply_error:reply&&!reply.ok?String(reply.why||'no reply'):(reply?null:'no reply'),response_line:x.response||null,cure_status:x.status,cure_reason:x.why||null,at:T}));}
function cureReport(seat,v){return v.map(x=>'[AUDIT v21: DEBATE RULE VIOLATION REPORT -- '+(seat?'SEAT: '+seat+'; ':'')+'ITEM: '+(x.rule==='K-G3'?x.side+' STANDING':x.link)+'; RULE: '+x.rule+'; RESULT: '+x.status+(x.rule==='K-C'&&x.status!=='CURED'?'; NOT COUNTED (K-C UNCURED)':'')
 +(x.kinds&&x.kinds.length?'; KINDS: '+x.kinds.join(', '):'')+(x.why?'; WHY: '+cureSafe(x.why):'')+(x.line?'; LINE: '+cureSafe((l=>l.length>300?l.slice(0,297)+'...':l)(String(x.line).replace(/\s+/g,' ').trim())):'')
 +(x.statement?'; STATEMENT: '+cureSafe(cureCut(x.statement)):'')+'; JUDGE STATEMENT: '+(x.judge_statement?cureSafe(cureCut(x.judge_statement)):'none written')+']');}
// The prose of the reply, recorded once and never read for a cure (BB-6952). Empty when the reply has no prose or the call failed.
function cureProse(seat,reply){const p=reply&&reply.ok?cureLines(reply.text).prose.join(' ').replace(/\s+/g,' ').trim():'';
 return p?['[AUDIT v21: DEBATE RULE VIOLATION REPLY -- '+(seat?seat+' ':'')+'prose recorded, not read for a cure: '+cureSafe(p.slice(0,600))+']']:[];}

// One item per cure request, in; one item out, each carrying its own request (by pairing) and the reply read without throwing.
return $input.all().map((it,i)=>{let src=null;try{src=$('Panel Cure Build 3').itemMatching(i).json.cure;}catch(e){src=null;}
 if(!src){try{src=$('Panel Cure Build 3').all()[i].json.cure;}catch(e){src=null;}}
 const reply=(it.json&&it.json.cure&&it.json.cure.skip)?{ok:false,text:null,why:it.json.cure.skip}:cureText(it.json);
 return {json:{cure:src||(it.json&&it.json.cure)||null,reply}};});
