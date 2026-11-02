# patch.py (judge_fix3): builds new/<node>.js from base/<node>.js (the live code of ORACLE_DEBATE_V1 version e9f2a2dd, read by GET on
# 2026-11-02; base/ equals judge_fix2/new for the 24 nodes judge_fix2 changed). Offline; writes only new/. Anchored replacements: it
# refuses when an anchor is not found the expected number of times. The four close-round code nodes (D4 Build, D4 Extract, C4 Build,
# C4 Extract) are generated from the live D3/C3 nodes (base/D3 Build.js etc., kept in base/ as templates, unchanged).
#  A1 [L2] on a plain transliteration with its meaning           A2 qwen out of the reserve and the alternate pool (Init Seats)
#  A3 K-DG8: disclaimed mentions skipped; "contradicted by the stated timing"   A4 drvPromptText reads cached (array) system content
#  A5 K-G4 not raised on a holder's concession                   A6 RESPONSE matched by rule and item
#  A7 synthesis checks S-A, S-C, S-E                             A8 ruling 3: verses count only with reference stated and words quoted
#  B1-B3 close rounds D4 and C4: prompts, transcripts, rules, round sets; B2 C4 new-press check (marked NOT COUNTED); B4 save path.
import os,sys,re
H=os.path.dirname(os.path.abspath(__file__));B=H+'/base';N=H+'/new';os.makedirs(N,exist_ok=True)
def rep(s,old,new,nm,count=1):
    c=s.count(old)
    if c!=count: sys.exit(f'{nm}: anchor found {c} times, want {count}: {old[:100]!r}')
    return s.replace(old,new)
def rep_any(s,old,new,nm):  # every occurrence, at least one
    if old not in s: sys.exit(f'{nm}: anchor not found: {old[:100]!r}')
    return s.replace(old,new)
rd=lambda nm:open(f'{B}/{nm}.js').read()

# ======================= A1: [L2] on a transliterated source-language word =======================
A1_DEF=r'''// judge_fix3 A1 (run 32255, DeepSeek D5 vs C2: "[L2] sperma, seed", "[L2] genomenou (made, come to be)", "[L2] ek sou (out of you)" were refused,
// and the seat was not counted): an [L2] tag counts when it sits on a source-language word written in plain letters with its English meaning
// beside it, in parentheses or after a comma, colon, "=" or "meaning". The word stands directly after the tag, or directly before it with
// its meaning ("ek (out of) [L2]", run 32255 Qwen). An English word is never a transliteration (stop list); script, marks and Strong's numbers count as before.
const DRV_TL_STOP=/^(?:the|a|an|and|or|of|in|on|at|to|for|with|by|from|this|that|these|those|its|his|her|their|our|your|word|words|term|terms|verb|verbs|noun|nouns|root|roots|lexical|lexicon|ground|grounds|sense|meaning|greek|hebrew|aramaic|same|no|not|none|see|cf|which|where|who|is|are|was|were|be|been|as|it|he|she|they|we|i|but|if|so|also|only|both|each|every|any|all|text|verse|row|rows|layer|link|chain|here|there|than|then|when|while|after|before|under|over|into|upon|unto|thee|thou|thy|ye|hath|shall|unto)$/i;
const DRV_TL_AFTER=/^\s*[*_]*\s*(?:(?:Greek|Hebrew|Aramaic)\s+)?[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*(?:\(\s*[^()\n]{2,80}\)|,\s*["“]?[a-z]|:\s*["“]?[a-z]|=\s*["“]?[a-z]|\s+(?:meaning|means|i\.e\.)\b)/;
const DRV_TL_BEFORE=/(?:^|[\s(,;])[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*\(\s*[^()\n]{2,80}\)\s*$/;
const drvTranslit=(rest,before)=>{const ok=m=>{if(!m)return false;const w=m[1].split(/\s+/);while(w.length&&DRV_TL_STOP.test(w[0]))w.shift();return w.length>0&&!DRV_TL_STOP.test(w[w.length-1]);};return ok(String(rest||'').match(DRV_TL_AFTER))||ok(String(before||'').match(DRV_TL_BEFORE));};
'''
A1_OLD="(t==='2'&&DRV_SRC.test(rest))"
A1_NEW="(t==='2'&&(DRV_SRC.test(rest)||drvTranslit(rest,line.slice(Math.max(0,m.index-60),m.index))))"
L2_OLD="[L2] with the Hebrew or Greek word in its own script, with its transliteration marks, or with its Strong's number;"
L2_NEW=("[L2] with the Hebrew or Greek word in its own script, with its transliteration marks, with its Strong's number, or written in plain letters "
        "with its English meaning beside it (for example [L2] genomenou (made), or [L2] sperma, seed), the tag standing directly before that word "
        "(or directly after it and its meaning);")
KC_OLD="exhibiting at least two kinds of layer. "
KC_NEW=("exhibiting at least two kinds of layer, each tagged as the layer rule reads: [L1] with the KJV words quoted; [L2] with the Hebrew or Greek "
        "word in its own script, with its transliteration marks, with its Strong's number, or in plain letters with its English meaning beside it "
        "(\\\"[L2] genomenou (made)\\\", \\\"[L2] sperma, seed\\\"), the tag directly before the word; [L3] with the cross-reference named. A tag that stands on "
        "no such word is not counted. Name rounds in brackets ([CR3], [DR2]); a round named without brackets is not read. ")
FM_L2_OLD=r"[L2] the Hebrew or Greek word in its own script, with its transliteration marks, or with its Strong\'s number;"
FM_L2_NEW=r"[L2] the Hebrew or Greek word in its own script, with its transliteration marks, with its Strong\'s number, or in plain letters with its English meaning beside it;"

# ======================= A3: K-DG8 =======================
A3_DEF_OLD="const DG8_Q1="
A3_DEF_NEW=r'''// judge_fix3 A3 (run 32255, single judge, enforcer rows 13 and the RESULT line): (a) a clause that disclaims the reading ("this line does not
// rest on Matthew 1:25 or Matthew 1:18 as excluding any union") is not the reading; (b) a ground that the stated timing contradicts or excludes the
// knowing ("the challenger's claim that Joseph knew Mary within the espousal is contradicted by the stated timing") is the DG-8 reading with no verse named.
const DG8_DISCLAIM=/\b(?:(?:does|do|did|will)\s+not|never|no\s+longer|nor)\s+(?:\S+\s+){0,2}?(?:rest|rely|relies|depend|read|take|treat|use|turn|count)\w*\b|\b(?:without|not)\s+(?:resting|relying|reading|treating|taking)\b|\bdisclaim\w*\b/i;
const DG8_TIMING=/\b(?:contradict\w*|exclud\w*|rul(?:e|es|ed)\s+out|refut\w*|defeat\w*|bar(?:s|red)?|den(?:y|ies|ied))\b[^;.]{0,40}?\b(?:the\s+)?(?:stated\s+)?timing\b|\btiming\s+(?:rows?\s+|verses?\s+|witness(?:es)?\s+)?(?:\S+\s+){0,2}?(?:exclud\w*|contradict\w*|rules?\s+out|den(?:y|ies|ied)|bar(?:s|red)?)\b/i;
const DG8_KNOW=/\bkn(?:ew|ow|ows|owing|owledge)\b|\bunion\b|\bespous\w*|came\s+together|cohabit\w*/i;
const DG8_Q1='''
A3_H_OLD="const h=hx&&DG8_ANCHOR.test(line)?hx:(st?hm:null);"
A3_H_NEW="const ht=cl.match(DG8_TIMING);const h=hx&&DG8_ANCHOR.test(line)?hx:(ht&&DG8_KNOW.test(line)?ht:(st?hm:null)); /* judge_fix3 A3 (b) */"
A3_SKIP_OLD="DG8_HEDGE.test(cl.slice(0,h.index)))continue;"
A3_SKIP_NEW="DG8_HEDGE.test(cl.slice(0,h.index))||DG8_DISCLAIM.test(cl.slice(0,h.index)))continue; /* judge_fix3 A3 (a): a disclaimed reading */"

# ======================= A5: K-G4 not raised on a holder's concession =======================
A5_OLD="  else{items.push({rule:'K-G4',side,link:id,line});"
A5_NEW=r'''  // judge_fix3 A5 (run 32228 B2: DeepSeek and the single judge, D5 vs C6 "[CR3] LINK 4 [premise 6] concedes it cannot exhibit ..."): a BROKEN line
  // whose ground is that the side holding the link conceded (or withdrew) it in its own round, and that names no witness unanswered, is the
  // concession rule's case, not K-G4's. The holder of a DEFENDER LINK BROKEN link is the defender ([CR] rounds), of a CHALLENGER LINK BROKEN the challenger.
  else if(!DRV_WORDS.test(line)&&kg4Conceded(line,side)){marks.push('[AUDIT v24: K-G4 NOT RAISED -- '+id+' '+g[1]+' rests on the '+side.toLowerCase()+"'s own concession of the link, not on a witness left unanswered; the concession rule governs it.]");}
  else{items.push({rule:'K-G4',side,link:id,line});'''
A5_DEF=r'''// judge_fix3 A5: the holder's own concession of the link, named on the BROKEN line (not negated, not "conceded nothing").
function kg4Conceded(line,side){const L=String(line||'').replace(/[*_`]+/g,'');const who=side==='DEFENDER'?'(?:\\[?\\bCR[1-4]\\b\\]?|\\bdefen(?:der|se)(?:\'s)?\\b)':'(?:\\[?\\bDR[1-4]\\b\\]?|\\bchallenger(?:\'s)?\\b)';
 const re=new RegExp(who+'[^;]{0,80}?\\b(?<!not\\s|never\\s|nor\\s)(?:conced(?:ed|es)|withdr(?:ew|awn|aws)|surrender(?:ed|s)|CONCEDED|WITHDRAWN)\\b(?!\\s+(?:nothing|no\\b))','i');return re.test(L);}
'''

# ======================= A4: the judge prompt read from a cached body =======================
A4_OLD="(b.messages||[]).forEach(m=>out.push(typeof m.content==='string'?m.content:JSON.stringify(m.content)));"
A4_NEW=("// judge_fix3 A4 (run 32255: no K-G6 on Gemini or Qwen; their K-C cure prompts read \"CHALLENGER CHAIN: not found in the prompt\"): __orc marks the\n"
        " // system message of google/ and qwen/ models for caching as [{type:'text',text,cache_control}]; JSON.stringify of that array turned every line\n"
        " // break into the two characters \\\\n, so the ledger's premise lines and the chain were never found. The text parts are read as text.\n"
        " (b.messages||[]).forEach(m=>{const c=m&&m.content;if(typeof c==='string')out.push(c);else if(Array.isArray(c))c.forEach(p=>out.push(p&&typeof p.text==='string'?p.text:JSON.stringify(p)));else out.push(JSON.stringify(c));});")

# ======================= A6: RESPONSE matched by rule and item =======================
A6_OLD="const respOf=(x)=>{const lb=U(cureLabel(x));const r=o.response.find(s=>{const L=U(s.label);return L.includes(lb)||(x.link?L.includes(U(x.link)):(L.includes(x.side)&&L.includes('STANDING')));});return r?r.text:null;};"
A6_NEW=("// judge_fix3 A6 (run 32255 enforcer rows 13 and 17: the K-G4 and K-S RESPONSE lines were stored for K-DG8 D1 vs C1 and K-C D6): a RESPONSE line\n"
        " // serves an item only when it names the item's own rule, or names no rule; the full label (rule and item) is preferred to the item alone.\n"
        " const respOf=(x)=>{const lb=U(cureLabel(x));const rk=U(x.rule||'');const ruleOk=L=>{const rs=L.match(/\\bK-[A-Z]+[0-9]*\\b/g)||[];return !rs.length||rs.includes(rk);};\n"
        "  const r=o.response.find(s=>{const L=U(s.label);return L.includes(lb)&&ruleOk(L);})||o.response.find(s=>{const L=U(s.label);return ruleOk(L)&&(x.link?L.includes(U(x.link)):(L.includes(x.side)&&L.includes('STANDING')));});return r?r.text:null;};")

# ======================= B3: round sets in every checker (D4 = [CR4] answers for the defender; C4 = [DR4] answers nothing) =======================
B3_CODE=[ # (old, new) in every node that carries the anchor
 ("const DRV_ANS=/[\\[(](?:CR[23]|DR[1-3])\\b/i;","const DRV_ANS=/[\\[(](?:CR[2-4]|DR[1-3])\\b/i; /* judge_fix3 B3: [CR4], the defender's close, answers; [DR4] answers nothing new */"),
 ("const DRV_BARE=/\\b(?:in|at|by|from)\\s+(?:CR[23]|DR[1-3])\\b/i;","const DRV_BARE=/\\b(?:in|at|by|from)\\s+(?:CR[2-4]|DR[1-3])\\b/i; /* judge_fix3 B3 */"),
 ("const re=/^(?:===[ \\t]+)?\\[(CR1|DR1|CR2|DR2|CR3|DR3)","const re=/^(?:===[ \\t]+)?\\[(CR1|DR1|CR2|DR2|CR3|DR3|CR4|DR4)"),
 ("replace(/\\((l[1-4]|[cd]r[1-3])\\)/g","replace(/\\((l[1-4]|[cd]r[1-4])\\)/g"),
 ("const ORD=['CR1','DR1','CR2','DR2','CR3','DR3'];","const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];"),
 ("own=side==='DEFENDER'?['CR1','CR2','CR3']:['DR1','DR2','DR3']","own=side==='DEFENDER'?['CR1','CR2','CR3','CR4']:['DR1','DR2','DR3']"),
 ("(x.side==='DEFENDER'?['CR2','CR3']:['DR1','DR2','DR3'])","(x.side==='DEFENDER'?['CR2','CR3','CR4']:['DR1','DR2','DR3'])"),
 ("(x.side==='DEFENDER'?['DR1','DR2','DR3']:['CR1','CR2','CR3'])","(x.side==='DEFENDER'?['DR1','DR2','DR3','DR4']:['CR1','CR2','CR3','CR4'])"),
 ("['CR1','CR2','CR3','DR1','DR2','DR3'].find(","['CR1','CR2','CR3','CR4','DR1','DR2','DR3'].find("),
 ("\\[(CR2|CR3|DR1|DR2|DR3)\\]","\\[(CR2|CR3|CR4|DR1|DR2|DR3)\\]"),
 ("/[\\[(]?\\b[CD]R[1-3]\\b/i.test(c.body)","/[\\[(]?\\b[CD]R[1-4]\\b/i.test(c.body)"),
 ("const KK_GROUND=/\\d+:\\d+|\\[?\\b[CD]R[1-3]\\b\\]?","const KK_GROUND=/\\d+:\\d+|\\[?\\b[CD]R[1-4]\\b\\]?"),
 ("const SC_CONC=/(?:\\[?\\bCR[1-3]\\b\\]?","const SC_CONC=/(?:\\[?\\bCR[1-4]\\b\\]?"),
]
B3_TEXT=[ # the rule and ledger words, wherever they stand (cure prompts, judge prompts, ledger headings and comments)
 ("([CR2] or [CR3] against the defender","([CR2], [CR3] or [CR4] against the defender"),
 ("([CR2] or [CR3] for a defender link","([CR2], [CR3] or [CR4] for a defender link"),
 ("(for the defender: [CR2] or [CR3];","(for the defender: [CR2], [CR3] or [CR4];"),
 ("(for the defender [CR2] or [CR3],","(for the defender [CR2], [CR3] or [CR4],"),
 ("the defender\\'s [CR2] or [CR3],","the defender\\'s [CR2], [CR3] or [CR4],"),
 ("'a later round of the defender, [CR2] or [CR3]'","'a later round of the defender, [CR2], [CR3] or [CR4]'"),
 ("'AGAINST THE DEFENDER, answered in [CR2] or [CR3]'","'AGAINST THE DEFENDER, answered in [CR2], [CR3] or [CR4]'"),
 ("names the round ([CR3] or [DR3]) and quotes its words that show the link stands","names the round ([CR3], [CR4] or [DR3]) and quotes its words that show the link stands"),
]

# ======================= A8 (ruling 3): verses count only with the reference stated and the words quoted =======================
R3_JUDGE=(" VERSE CITATION (operator ruling 3): a verse counts as evidence, as footing, as a witness or as an answer only when its book, chapter and "
          "verse are stated and its words are quoted fully and correctly from the KJV. A verse woven into an argument without its book, chapter and "
          "verse named, or with its words paraphrased, shortened or misquoted, is not counted; an answer given in substance without the reference "
          "named does not answer a pressed witness. A quotation the CITATION CHECK marks NOT COUNTED is not counted.")
R3_ANCHOR="Re-citing the link\\'s own footing while passing over the witness pressed against it is not an answer. "
R3_DEB=(" VERSE CITATION (binding, operator ruling 3): cite every verse by book, chapter and verse (for example Matthew 1:25) and quote its words "
        "exactly as the KJV gives them. A verse alluded to, paraphrased, shortened or misquoted, or named without its book, chapter and verse, is "
        "not counted as evidence or as an answer, and the system checks every quotation against the KJV text.")
R3_CURE=("A verse counts as footing, as a witness or as an answer only when its book, chapter and verse are stated and its words are quoted fully "
         "and correctly (operator ruling 3); an answer in substance without the reference named does not count. ")
KJV_BAD_OLD="return head+ncs+NL+bad.map(i=>i.side+' '+i.round+': cited '+i.ref+': \"'+String(i.quote).slice(0,160)+'\" -- '+i.status).join(NL)+NL+'RULE:"
KJV_BAD_NEW=("return head+ncs+NL+bad.map(i=>i.side+' '+i.round+': cited '+i.ref+': \"'+String(i.quote).slice(0,160)+'\" -- '+i.status+(/^WORDS ARE AT /.test(i.status)?'':' -- NOT COUNTED'))"
             ".join(NL)+NL+'RULE (operator ruling 3: a verse counts only when its book, chapter and verse are stated and its words are quoted fully and correctly): a line marked NOT COUNTED is not footing, not a witness and not an answer for any link, whichever side gave it. RULE:")

# ======================= B: the close rounds in the judges' transcript and rules =======================
PB_PARTS_OLD="['[DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede)',SAN(F.dr3)]];"
PB_PARTS_NEW="['[DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede)',SAN(F.dr3)],['[CR4] DEFENDER R4 -- CLOSE ROUND (defender final defense; answers pressed witnesses)',SAN(F.cr4)],['[DR4] CHALLENGER R4 -- CLOSE ROUND (challenger final words; no new press)',F.dr4?SAN(F.dr4)+C4P.note(F):null]]; // judge_fix3 B1-B3: the close rounds"
BIV_TR_OLD="'=== [DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede) ==='+NL+(d.dr3?SAN(d.dr3):'(missing)')+NL+NL+preCheckBlock(d)"
BIV_TR_NEW=("'=== [DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede) ==='+NL+(d.dr3?SAN(d.dr3):'(missing)')"
            "+(d.cr4?NL+'=== [CR4] DEFENDER R4 -- CLOSE ROUND (defender final defense; answers pressed witnesses) ==='+NL+SAN(d.cr4):'')"
            "+(d.dr4?NL+'=== [DR4] CHALLENGER R4 -- CLOSE ROUND (challenger final words; no new press) ==='+NL+SAN(d.dr4)+C4P.note(d):'')+NL+NL+preCheckBlock(d)")
CR_OLD1="grade and COUNT only from the two LINK ROUND blocks above, [CR3] (defender) and [DR3] (challenger); an ANSWER to a pressed witness is read from any later round of the side that holds the link, its round 2 or its link round. "
CR_NEW1=("grade and COUNT only from the two LINK ROUND blocks above, [CR3] (defender) and [DR3] (challenger); an ANSWER to a pressed witness is read from any later round of the side that holds the link, its round 2, its link round or, for the defender, its CLOSE ROUND [CR4]. "
         "CLOSE ROUNDS (operator ruling): [CR4] is the defender\\'s final defense: it answers witnesses still pressed against the defender, and an answer there counts as an answer in a later defender round; it presses nothing against the challenger, and a verse it names against the challenger is not a pressed witness. "
         "[DR4] is the challenger\\'s final words on its own position: it answers nothing new and may not press: a verse it names that no earlier challenger round names is a new press and is NOT COUNTED (the system lists any under [DR4]); [DR4] never answers a witness pressed against the challenger. ")
CR_OLD2="In this format the challenger link round [DR3] is structurally LAST: no defender round follows it, so the defender being silent after [DR3] is procedural and is NEVER a challenger concession. "
CR_NEW2="In this format the challenger close round [DR4] is structurally LAST: no defender round follows it, so the defender being silent after [DR4] is procedural and is NEVER a challenger concession. "
OOR_OLD="ground granted in [CR1], [DR1], [CR2] or [DR2], not in [CR3] or [DR3]"
OOR_NEW="ground granted in [CR1], [DR1], [CR2], [DR2], [CR4] or [DR4], not in [CR3] or [DR3]"
SLC_OLD_P="SLC(IG.d_served,IG.d_named,[F.cr1,F.cr2,F.cr3])+'. CHALLENGER '+SLC(IG.c_served,IG.c_named,[F.gr1,F.gr2,F.dr3])"
SLC_NEW_P="SLC(IG.d_served,IG.d_named,[F.cr1,F.cr2,F.cr3,F.cr4])+'. CHALLENGER '+SLC(IG.c_served,IG.c_named,[F.gr1,F.gr2,F.dr3,F.dr4])"
SLC_OLD_B="[d.cr1,d.cr2,d.cr3])+'. CHALLENGER '+SLC($('Init with Guards').first().json.c_served,$('Init with Guards').first().json.c_named,[d.gr1,d.gr2,d.dr3])"
SLC_NEW_B="[d.cr1,d.cr2,d.cr3,d.cr4])+'. CHALLENGER '+SLC($('Init with Guards').first().json.c_served,$('Init with Guards').first().json.c_named,[d.gr1,d.gr2,d.dr3,d.dr4])"
# the ledger: the defender's answers include [CR4]; [DR4] answers nothing
LED_OLD="const ledger=F=>({defender:side(F.gr2,F.cr3,DEF_RE,F.cr2,F.gr1),"
LED_NEW="const ledger=F=>({defender:side(F.gr2,String(F.cr3||'')+(F.cr4?LF+String(F.cr4):''),DEF_RE,F.cr2,F.gr1), /* judge_fix3 B3: [CR4] answers for the defender */"
LCIT_OLD="dCited:citedNotNamed([['[DR1]',F.gr1],['[DR2]',F.gr2]],[['[CR2]',F.cr2],['[CR3]',F.cr3]]),"
LCIT_NEW="dCited:citedNotNamed([['[DR1]',F.gr1],['[DR2]',F.gr2]],[['[CR2]',F.cr2],['[CR3]',F.cr3]].concat(F.cr4?[['[CR4]',F.cr4]]:[])),"
LO_OLD="const citedNotNamed=(rounds,answers)=>{const O=['[CR1]','[DR1]','[CR2]','[DR2]','[CR3]','[DR3]'];"
LO_NEW="const citedNotNamed=(rounds,answers)=>{const O=['[CR1]','[DR1]','[CR2]','[DR2]','[CR3]','[DR3]','[CR4]','[DR4]'];"
LJB_P_OLD="const LEDGER=PWL.judgeBlock({cr1:F.cr1,gr1:F.gr1,cr2:F.cr2,gr2:F.gr2,cr3:F.cr3,dr3:F.dr3})"
LJB_P_NEW="const LEDGER=PWL.judgeBlock({cr1:F.cr1,gr1:F.gr1,cr2:F.cr2,gr2:F.gr2,cr3:F.cr3,dr3:F.dr3,cr4:F.cr4||null})"
LJB_B_OLD="const LEDGER=PWL.judgeBlock({cr1:d.cr1,gr1:d.gr1,cr2:d.cr2,gr2:d.gr2,cr3:d.cr3,dr3:d.dr3});"
LJB_B_NEW="const LEDGER=PWL.judgeBlock({cr1:d.cr1,gr1:d.gr1,cr2:d.cr2,gr2:d.gr2,cr3:d.cr3,dr3:d.dr3,cr4:d.cr4||null});"

# B2: the C4 new-press check (flow check; one copy in each node that shows or stores [DR4]). A verse reference in [DR4] (book named, or a bare
# chapter:verse after a book named earlier in the same sentence) none of whose verses any earlier challenger round names is a new press.
def c4p_block(src):
    s=src;b=s.index('const BOOKS=');e=s.index('\n',s.index("Object.assign(BK,{",b))
    books=s[b:e]  # const BOOKS=...; const key=...; const BK=...; Object.assign(BK,{...});  (D3 Build's own lists)
    return ("// judge_fix3 B2 (operator ruling: the challenger's close is \"not allowed to press in this round\"): any verse reference in [DR4] that no earlier\n"
            "// challenger round ([DR1]-[DR3]) names is a new press. It is MARKED for the judges as NOT COUNTED (not struck: the transcript the judges read and\n"
            "// the one published stay word for word the same) and recorded in the review notes. Only references written with a book, or a bare chapter:verse\n"
            "// after a book in the same sentence, are read; a range counts as cited before when any verse of it was.\n"
            "const C4P=(()=>{"+books.replace('\n',' ')+"\n"
            " const RE=/(?<![A-Za-z0-9:])(?:((?:[1-3]\\s)?[A-Z][A-Za-z]+(?:\\s(?:of\\s)?[A-Z][A-Za-z]+)?)\\.?\\s)?(\\d{1,3}):(\\d{1,3})((?:\\s?[–—-]\\s?\\d{1,3}(?![\\d:]))?)/g;\n"
            " const bk=x=>{if(!x)return null;let b=BK[key(x)];if(!b){const w=String(x).split(/\\s/).pop();b=BK[key(w)]||null;}return b;};\n"
            " const refs=t=>{const T=String(t||'');const out=[];let last=null,lastEnd=-1;for(const m of T.matchAll(RE)){let b=bk(m[1]);\n"
            "  if(!b&&last!==null&&!/[.!?;\\n]/.test(T.slice(lastEnd,m.index)))b=last;if(!b)continue;last=b;lastEnd=m.index+m[0].length;const c=+m[2],v=+m[3];const z=m[4]?+String(m[4]).replace(/[^0-9]/g,''):v;\n"
            "  const vs=[];for(let x=v;x<=Math.max(v,Math.min(z,v+30));x++)vs.push(b+' '+c+':'+x);out.push({label:b+' '+c+':'+v+(z>v?'-'+z:''),vs});}return out;};\n"
            " const fresh=(earlier,c4)=>{const S=new Set();earlier.forEach(t=>refs(t).forEach(r=>r.vs.forEach(x=>S.add(x))));const seen=new Set();return refs(c4).filter(r=>!r.vs.some(x=>S.has(x))).map(r=>r.label).filter(l=>!seen.has(l)&&seen.add(l));};\n"
            " const of=F=>F&&F.dr4?fresh([F.gr1,F.gr2,F.dr3],F.dr4):[];\n"
            " const note=F=>{const n=of(F);return n.length?'\\n\\n[CLOSE-ROUND PRESS CHECK -- computed by the system, not by a model: [DR4] names '+n.length+' verse reference(s) that no earlier challenger round names: '+n.join(', ')+'. The close round may not press: each is a NEW PRESS and is NOT COUNTED as evidence, as a witness or as an answer.]':'';};\n"
            " return {refs,fresh,of,note};})();\n")

# ======================= B1: the close-round nodes, from D3/C3 =======================
PWL_RET_OLD="return {ledger,judgeBlock,roundBlock,citedBlock,DEF_RE,CH_RE};})();"
PWL_RET_NEW="return {ledger,judgeBlock,roundBlock,citedBlock,DEF_RE,CH_RE,side,citedRounds,namedIn,isNamed};})(); // judge_fix3 B1: side, citedRounds, namedIn and isNamed are read by the close-round list"
def d4_build(d3):
    head=d3[:d3.index("const PV=PWL.roundBlock(")]
    head=rep(head,"// D3: DEFENDER ROUND 3, LINK ROUND. Body built by API family; model from model_config by seat.",
             "// D4: DEFENDER ROUND 4, CLOSE ROUND (judge_fix3 B1; operator ruling: \"we owe both sides a close-out round. Where the defender get to make his\n"
             "// final defense of this position ... and that includes pressed premise unanswered\"). Built, called and checked as D3 is: same seat, system\n"
             "// prompt, cache markers, OpenRouter session id (__orc) and body per family; no reasoning or effort field.",'D4 Build')
    head=rep(head,PWL_RET_OLD,PWL_RET_NEW,'D4 Build')
    tail=r'''// judge_fix3 B1: what is still unanswered against the defender, computed by the system from the rounds (the ledger code that lists the
// opposing side's cited verses): (a) each premise of the challenger's list that closes round 2 with the verses it carries that neither the
// defender's round 2 nor its link round names; (b) every verse the challenger cited, by the round that first cites it, that no later defender round names.
const RW={cr1:$('D1 Extract').first().json.raw,gr1:$('C1 Extract').first().json.raw,cr2:$('D2 Extract').first().json.raw,gr2:$('C2 Extract').first().json.raw,cr3:$('D3 Extract').first().json.raw,dr3:$('C3 Extract').first().json.raw};
const OPEN=(()=>{try{const LF=String.fromCharCode(10);const out=[];
 const s=PWL.side(RW.gr2,String(RW.cr2||'')+LF+String(RW.cr3||''),PWL.DEF_RE);
 const pl=s.list?s.premises.filter(p=>p.notNamed.length):[];
 out.push('(a) PRESSED PREMISES (the list that closes the challenger\'s round 2), verses no defender round after it names:');
 out.push(s.list?(pl.length?pl.map(p=>'premise '+p.n+(p.link?' (LINK '+p.link+')':'')+': NOT NAMED: '+p.notNamed.join(', ')).join(LF):'none: every verse those premises carry is named in your round 2 or your link round'):'no premise list was found at the end of the challenger\'s round 2');
 const rs=PWL.citedRounds([['challenger round 1',RW.gr1],['challenger round 2',RW.gr2],['challenger round 3, the link round',RW.dr3]]);const later=[[RW.cr2,RW.cr3],[RW.cr3],[]];
 out.push('(b) EVERY VERSE THE CHALLENGER CITED, by the round that first cites it, that no later defender round names:');
 rs.forEach((x,i)=>{const N=PWL.namedIn(later[i].map(t=>String(t||'')).join(LF));const not=x.items.filter(it=>!it.r.cvs.some(cv=>PWL.isNamed(N,it.r.book,cv))).map(it=>it.label);out.push(x.name+': '+(not.length?not.join(', '):'none'));});
 return 'STILL UNANSWERED AGAINST YOUR CHAIN -- computed by the system from the transcript, not by a model; a verse listed here is unanswered by the rule until a round of yours names it and answers it:'+LF+out.join(LF);}catch(e){return 'STILL UNANSWERED AGAINST YOUR CHAIN: the system could not compute the list this run; answer every witness the challenger pressed that your rounds have not named.';}})();
const sys=I.dsys;const msgs=[{role:'user',content:'SUBJECT: '+I.topic+'\n\nYou opened as the DEFENDER, holding '+$('Init Seats').first().json.dpos+' of the topic. The challenger\'s LINK ROUND reply follows; in it the challenger answered your premise list and may have pressed further witnesses against your chain:\n\n'+$('C3 Extract').first().json.raw+'\n\n'+OPEN+'\n\nCLOSE ROUND -- your final defense. This is the defender\'s last round; the challenger\'s close follows it and may not press anything new. Make your final defense of your declared chain D1..Dn, and answer every witness pressed against it that is still unanswered: each verse listed above, and above all those the challenger pressed in its link round. For each, write a line ANSWER: <book chapter:verse> -- D<n> -- then quote that verse exactly in the KJV and show from the text why it does not overturn that link. A witness answered in substance, without its book, chapter and verse named and its words quoted, is not counted as answered. You may keep a link (the footing already exhibited), narrow it (NARROWED TO: <the limb you keep>, with its footing) or concede it (CONCEDED); do not add links or re-seat the chain. This round defends: do not press new witnesses or premises against the challenger, who has no round to answer them; the judges do not count a press made here. Cite every verse by book, chapter and verse and quote it exactly in the KJV.'}];
return [{json:{run_token:TOK,round:'D4',open_list:OPEN,call:call(R.defender,sys,msgs)}}];
'''
    return head+tail
def c4_build(c3,c4p):
    head=c3[:c3.index("const PV=PWL.roundBlock(")]
    head=rep(head,"// C3: CHALLENGER ROUND 3, LINK ROUND. Body built by API family; model from model_config by seat.",
             "// C4: CHALLENGER ROUND 4, CLOSE ROUND (judge_fix3 B1; operator ruling: \"will allow the challenger final words on his position (not allowed\n"
             "// to press in this round)\"). Built, called and checked as C3 is: same seat, system prompt, cache markers, OpenRouter session id (__orc) and\n"
             "// body per family; no reasoning or effort field.",'C4 Build')
    head=rep(head,PWL_RET_OLD,PWL_RET_NEW,'C4 Build')
    tail=r'''const RW={gr1:$('C1 Extract').first().json.raw,gr2:$('C2 Extract').first().json.raw,dr3:$('C3 Extract').first().json.raw};
// judge_fix3 B1: the verses the challenger itself cited in rounds 1-3 (the ledger's citedRounds), the only verses this round may name.
const OWN=(()=>{try{const rs=PWL.citedRounds([['your round 1',RW.gr1],['your round 2',RW.gr2],['your round 3, the link round',RW.dr3]]);return 'THE VERSES YOU CITED IN YOUR EARLIER ROUNDS -- computed by the system from the transcript, not by a model; this round may name only these:\n'+rs.map(x=>x.name+': '+(x.items.length?x.items.map(i=>i.label).join(', '):'none')).join('\n');}catch(e){return '';}})();
const sys=I.csys;const msgs=[{role:'user',content:'SUBJECT: '+I.topic+'\n\nYou pressed the challenge. The defender\'s CLOSE ROUND, its final defense, follows:\n\n'+$('D4 Extract').first().json.raw+(OWN?'\n\n'+OWN:'')+'\n\nCLOSE ROUND -- your final words. This is the last round of the debate. Give your final words on your own position, '+$('Init Seats').first().json.cpos+' of the topic, from the case you have already made. NO NEW PRESS: in this round you may NOT press any new witness or premise against the defender -- no verse your earlier rounds did not cite, no new premise, no new charge. A verse reference you name here that none of your earlier rounds names is a new press: the system marks it NOT COUNTED for the judges and records it. You may restate, narrow (NARROWED TO: <the limb you keep>) or concede (CONCEDED) your own links; this round answers nothing new. Cite every verse by book, chapter and verse and quote it exactly in the KJV.'}];
return [{json:{run_token:TOK,round:'C4',call:call(R.challenger,sys,msgs)}}];
'''
    return head+tail
def extract4(x3,side,c4p=None):
    r=x3; S3='D3' if side=='D' else 'C3'; S4='D4' if side=='D' else 'C4'
    r=rep(r,f"const B=$('{S3} Build').first().json.call;",f"const B=$('{S4} Build').first().json.call;",S4+' Extract')
    r=rep_any(r,f"'VALIDATION: {S3} (",f"'VALIDATION: {S4} (",S4+' Extract')
    lab='I.lab.D' if side=='D' else 'I.lab.C'
    r=rep(r,f"const labelled={lab}+' -- ROUND 3, LINK ROUND\\n\\n'+raw;",f"const labelled={lab}+' -- ROUND 4, CLOSE ROUND\\n\\n'+raw;",S4+' Extract')
    if side=='D':
        r=rep(r,"return [{json:{run_token:TOK,round:'D3',raw,labelled,usage:e.u,fam:B.fam,model:B.model}}];","return [{json:{run_token:TOK,round:'D4',raw,labelled,usage:e.u,fam:B.fam,model:B.model}}];",'D4 Extract')
        r="// judge_fix3 B1: D4 Extract, the defender's close round; read, refusal and truncation checks as D3 Extract.\n"+r
    else:
        r=rep(r,"return [{json:{run_token:TOK,round:'C3',raw,labelled,usage:e.u,fam:B.fam,model:B.model}}];",
              "// judge_fix3 B2: the new-press flow check on the challenger's close (recorded on this item; the judges see the same list, recomputed from the rounds).\n"
              "let new_press=[];try{new_press=C4P.fresh([$('C1 Extract').first().json.raw,$('C2 Extract').first().json.raw,$('C3 Extract').first().json.raw],raw);}catch(x){new_press=[];}\n"
              "return [{json:{run_token:TOK,round:'C4',raw,labelled,usage:e.u,fam:B.fam,model:B.model,new_press}}];",'C4 Extract')
        r="// judge_fix3 B1: C4 Extract, the challenger's close round; read, refusal and truncation checks as C3 Extract.\n"+c4p+r
    return r

# ======================= A7: synthesis checks (Build Save Body) =======================
SA_OLD=r''' SL.forEach((l,i)=>{if(!/\bboth\s+(?:seats|sides|parties|debaters)\s+(?:agree|state|affirm|hold|accept|grant|concede)|\bboth\s+(?:agree|affirm)\b/i.test(l))return;
  const qs=[...[l,SL[i+1]||''].join(' ').matchAll(/["“]([^"”]{8,})["”]/g)].map(m=>m[1]);
  if(!(qs.some(q=>qin(q,DEF))&&qs.some(q=>qin(q,CHA))))SX.push('(S-A) -- a "both agree" item does not quote both sides\' own words: "'+cut(l)+'"');});'''
SA_NEW=r''' // judge_fix3 A7 (run 32255 G2: "Both use 3:38", "Both now agree" were not read): every "both" sentence (both agree, affirm, use, cite, accept,
 // hold, read, grant, now agree). It passes when it quotes words found in a defender round and in a challenger round, or, with no quotation, when
 // every verse it names is named in both sides' rounds (a bare chapter:verse is searched as written).
 const cvIn=(cv,T)=>new RegExp('(?<![0-9:])'+cv.replace(':','\\:')+'(?![0-9])').test(T);const RAWD=[d.cr1,d.cr2,d.cr3,d.cr4].join('\n'),RAWC=[d.gr1,d.gr2,d.dr3,d.dr4].join('\n');
 SL.forEach((l,i)=>{for(const s of l.split(/(?<=[.!?])\s+(?=[A-Z*_"“])/)){if(!/\bboth\s+(?:seats|sides|parties|debaters)\s+(?:now\s+)?(?:agree|state|affirm|hold|accept|grant|concede|use|cite|read)|\bboth\s+(?:now\s+)?(?:agree|affirm|use|cite|accept|hold|read|grant)\b/i.test(s))continue;
  const qs=[...[s,(/["“]/.test(s)?'':SL[i+1]||'')].join(' ').matchAll(/["“]([^"”]{8,})["”]/g)].map(m=>m[1]);const cvs=(x=>x.length?x:[...l.matchAll(/\b(\d{1,3}:\d{1,3})\b/g)].map(m=>m[1]))([...s.matchAll(/\b(\d{1,3}:\d{1,3})\b/g)].map(m=>m[1])); /* a sentence with no verse ("Both cite it.") takes the verses of its item */
  const ok=qs.length?(qs.some(q=>qin(q,DEF))&&qs.some(q=>qin(q,CHA))):(cvs.length>0&&cvs.every(cv=>cvIn(cv,RAWD)&&cvIn(cv,RAWC)));
  if(!ok)SX.push('(S-A) -- a "both" item '+(qs.length?'does not quote both sides\' own words':cvs.length?'names a verse one side never names ('+cvs.filter(cv=>!(cvIn(cv,RAWD)&&cvIn(cv,RAWC))).join(', ')+')':'quotes neither side')+': "'+cut(s)+'"');}});'''
SC_OLD=r'''{let on=false;const LT=QF(LD+'\n'+LC);for(const l of SL){if(/^\s*#/.test(l)){on=/neither side|no charge on either|uncharged|charges? neither/i.test(l);continue;}if(/neither side.s list charges|no charge on either side|charged by neither/i.test(l)){on=true;continue;}'''
SC_NEW=r'''// judge_fix3 A7 (run 32255 G3: section 1 "no charge on either side's list contests these" lists Matthew 1:16, Galatians 4:4, Matthew 1:25, Hebrews 7:14 and
 // the covenant-title rows, all carried by a premise): the heading forms widened ("no charge ... contests", "uncontested"), and an item also fires when a
 // verse it names (book and chapter:verse) is carried by either closing premise list.
 const listRefs=new Set([...(LD+'\n'+LC).matchAll(/\b((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+(\d{1,3}):(\d{1,3})/g)].map(m=>m[1].replace(/\s/g,'').slice(0,3).toLowerCase()+' '+m[2]+':'+m[3]));
 {let on=false;const scRef=[];const LT=QF(LD+'\n'+LC);for(const l of SL){if(/^\s*#/.test(l)){on=/neither side|no charge\b[^\n]{0,60}\bcontests?|no charge on either|uncharged|uncontested|charges? neither/i.test(l);continue;}if(/neither side.s list charges|no charge on either side|no charge\b[^\n]{0,60}\bcontests?|charged by neither/i.test(l)){on=true;continue;}'''
SC_HIT_OLD=r'''  if(hit)SX.push('(S-C) -- an item listed as charged by neither side stands in a side\'s premise list ("'+hit+'"): "'+cut(l)+'"');}}'''
SC_HIT_NEW=r'''  if(hit){SX.push('(S-C) -- an item listed as charged by neither side stands in a side\'s premise list ("'+hit+'"): "'+cut(l)+'"');continue;}
  {let lb=null;const vh=[];for(const m of l.matchAll(/\b((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+(\d{1,3}):(\d{1,3})|\((\d{1,3}):(\d{1,3})\)/g)){if(m[1])lb=m[1];const b=(m[1]||lb||'');const k=b.replace(/\s/g,'').slice(0,3).toLowerCase()+' '+(m[2]||m[4])+':'+(m[3]||m[5]);if(b&&listRefs.has(k))vh.push(b+' '+(m[2]||m[4])+':'+(m[3]||m[5]));}
   if(vh.length)scRef.push(String(l).replace(/^\s*(?:[-*•]|\d+[.)])\s+/,'').replace(/[*_]/g,'').slice(0,40).trim()+' ('+[...new Set(vh)].join(', ')+')');}}
  if(scRef.length)SX.push('(S-C) -- '+scRef.length+' item(s) listed as charged by neither side name verses a closing premise list carries: '+scRef.join('; ').slice(0,700));}
 // judge_fix3 A7 (run 32255 G2: "the defender ... withdrew the Septuagint citation", where the defender wrote "I withdraw nothing"): (S-E) a sentence that
 // says a named side withdrew, conceded, retracted or dropped something, while no round of that side holds the verb affirmed (not "withdraw nothing",
 // "not concede") within 200 characters of a content word of the claim. The verbs are read in lower case or capitalised, never in capitals (the
 // synthesis's tags CONCEDED-BY-ITS-OWN-SIDE are its grades, not a claim of words).
 {const STOPW=new Set('the a an and or of in on at to for with by from this that these those its his her their our your which who what is are was were be been as it he she they not no any all every each both only also than then when while after before into upon withdrew withdrawn withdraws conceded concedes retracted retracts dropped drops outright rather instead defended defender challenger seat side link links round rounds citation'.split(' '));
  const FAM={w:/\bwithdr(?:aw|ew|awn|aws|awing)\b/i,c:/\bconce(?:de|ded|des|ding|ssion)\b/i,r:/\bretract(?:s|ed|ing)?\b/i,d:/\bdrop(?:s|ped|ping)?\b/i};
  const NEGV=/\b(?:not|never|nothing|no)\b/i;const SIDEC={DEFENDER:[d.cr1,d.cr2,d.cr3,d.cr4].join('\n'),CHALLENGER:[d.gr1,d.gr2,d.dr3,d.dr4].join('\n')};
  const affirmed=(T,fr,words)=>{for(const m of String(T).matchAll(new RegExp(fr.source,'gi'))){const a=Math.max(0,m.index-200),b=m.index+m[0].length+200;const pre=T.slice(Math.max(0,m.index-25),m.index),post=T.slice(m.index+m[0].length,m.index+m[0].length+12);
    if(NEGV.test(pre.split(/[.;,]/).pop())||/^\s*(?:nothing|none)\b/i.test(post))continue; /* "withdraw nothing" is no withdrawal; "concede no verse names" is a concession */const win=T.slice(a,b).toLowerCase();if(!words.length||words.some(w=>win.includes(w)))return true;}return false;};
  for(const s of SY.split(/\n|(?<=[.!?])\s+(?=[A-Z*_"“])/)){const m=s.match(/(?<!\b(?:against|to|for|of|from|with|by|on|over|at)\s+(?:the\s+)?)\b(?:the\s+)?(defender|challenger)\b(?!['’]s)((?:(?!\b(?:judge|seat|panel|synthesis|defender|challenger)\b(?!['’]s))[^.;:]){0,60}?)\b([Ww]ithdr(?:ew|awn)|[Cc]onced(?:ed|es)|[Rr]etract(?:ed|s)|[Dd]ropped)\b|\b([Ww]ithdrawn|[Cc]onceded|[Rr]etracted|[Dd]ropped)\s+by\s+(?:the\s+)?(defender|challenger)\b/);if(!m)continue;
   if(/\b(?:no|not|never|nothing|neither|nor)\b/i.test((m[2]||'')+' '+s.slice(Math.max(0,m.index-40),m.index)))continue; // a negated claim ("No challenger link was conceded") is no claim of a withdrawal
   const side=(m[1]||m[5]).toUpperCase();const verb=(m[3]||m[4]).toLowerCase();const fr=FAM[verb[0]==='w'?'w':verb[0]==='c'?'c':verb[0]==='r'?'r':'d'];
   const objs=QF(s.slice(s.toLowerCase().indexOf(verb)+verb.length).replace(/["“][^"”]*["”]/g,' ')).split(' ').filter(w=>w.length>=5&&!STOPW.has(w)&&!/^\d/.test(w)).slice(0,6);
   if(!affirmed(SIDEC[side],fr,objs))SX.push('(S-E) -- the synthesis says the '+side.toLowerCase()+' '+verb+(objs.length?' ('+objs.slice(0,3).join(', ')+')':'')+', but no '+side.toLowerCase()+' round holds those words affirmed: "'+cut(s)+'"');}}'''
SB_OLD="const UN=unnamed(LD,[d.cr2,d.cr3].join('\\n')).concat(unnamed(LC,[d.gr2,d.dr3].join('\\n')));"
SB_NEW="const UN=unnamed(LD,[d.cr2,d.cr3,d.cr4].join('\\n')).concat(unnamed(LC,[d.gr2,d.dr3].join('\\n'))); /* judge_fix3 B3: [CR4] answers for the defender */"
SA_DEF_OLD="const DEF=QF([d.cr1,d.cr2,d.cr3].join('\\n')),CHA=QF([d.gr1,d.gr2,d.dr3].join('\\n'));"
SA_DEF_NEW="const DEF=QF([d.cr1,d.cr2,d.cr3,d.cr4].join('\\n')),CHA=QF([d.gr1,d.gr2,d.dr3,d.dr4].join('\\n')); /* judge_fix3 B3: the close rounds */"
BSB_R_OLD="const __R=['D1','C1','D2','C2','D3','C3'].map(r=>__U(r+' Extract'));"
BSB_R_NEW="const __R=['D1','C1','D2','C2','D3','C3','D4','C4'].map(r=>__U(r+' Extract')); /* judge_fix3 B4: the close rounds' usage */"
BSB_SAVE_OLD="engine_r3:d.cr3||null,challenger_r3:d.dr3||null,"
BSB_SAVE_NEW="engine_r3:d.cr3||null,challenger_r3:d.dr3||null,defender_r4:d.cr4||null,challenger_r4:d.dr4||null," # judge_fix3 B4 (columns: sql/b4_close_rounds.sql)
BSB_C4_OLD="const RN=FF.length?FF.join(' '):null;"
BSB_C4_NEW=("// judge_fix3 B2: the challenger's close-round new presses, marked NOT COUNTED for the judges, recorded here.\n"
            "{let np=[];try{np=C4P.of(d);}catch(e){np=[];}if(np.length)FF.push('[AUDIT v24: CLOSE-ROUND PRESS CHECK (C4) -- the challenger\\'s close round names '+np.length+' verse reference(s) no earlier challenger round names ('+np.join(', ')+'); each is a new press, marked NOT COUNTED for the judges. REVIEW THIS ROW.]');}\n"
            "const RN=FF.length?FF.join(' '):null;")

# ======================= the remaining B nodes =======================
SYN_OLD="const cr3=$('D3 Extract').first().json.labelled;const dr3=$('C3 Extract').first().json.labelled;"
SYN_NEW="const cr3=$('D3 Extract').first().json.labelled;const dr3=$('C3 Extract').first().json.labelled;const cr4=$('D4 Extract').first().json.labelled;const dr4=$('C4 Extract').first().json.labelled; /* judge_fix3 B3 */"
SYN_OUT_OLD="const __out={topic:I.topic,cr1,gr1,cr2,gr2,cr3,dr3,gl:I.gl,"
SYN_OUT_NEW="const __out={topic:I.topic,cr1,gr1,cr2,gr2,cr3,dr3,cr4,dr4,gl:I.gl,"
SYN_TR_OLD="'\\n\\n[CHALLENGER R3 -- LINK ROUND (challenger cite-or-concede)]\\n'+dr3+'\\n\\nSynthesize:"
SYN_TR_NEW="'\\n\\n[CHALLENGER R3 -- LINK ROUND (challenger cite-or-concede)]\\n'+dr3+'\\n\\n[DEFENDER R4 -- CLOSE ROUND (defender final defense)]\\n'+cr4+'\\n\\n[CHALLENGER R4 -- CLOSE ROUND (challenger final words; no new press)]\\n'+dr4+C4P.note({gr1,gr2,dr3,dr4})+'\\n\\nSynthesize:"
SYN_RULE_OLD="Include the results of BOTH LINK ROUNDS: for each link state CITED-WITH-FOOTING, CONCEDED-BY-ITS-OWN-SIDE, or NO-FOOTING-EXHIBITED, on each side. Do NOT use the word \"unanswered\" anywhere in this analysis: the challenger link round is structurally LAST in this format, so the defender gets no round after it -- that silence is procedural, not a concession, and counts against neither side. "
SYN_RULE_NEW=("Include the results of BOTH LINK ROUNDS and BOTH CLOSE ROUNDS: for each link state CITED-WITH-FOOTING, CONCEDED-BY-ITS-OWN-SIDE, NARROWED-BY-ITS-OWN-SIDE (a limb dropped and the link kept is a narrowing, not a concession) or NO-FOOTING-EXHIBITED, on each side; say what the defender\\'s close round answered, and quote a side\\'s own words for every concession or withdrawal you report. "
              "Do NOT use the word \"unanswered\" anywhere in this analysis: the challenger close round is structurally LAST in this format, so the defender gets no round after it -- that silence is procedural, not a concession, and counts against neither side. The challenger\\'s close round may not press: a verse it names that its earlier rounds never named is not counted. "
              "A verse counts only when its book, chapter and verse are stated and its words are quoted fully and correctly (operator ruling 3). ")
FO_OLD="cr3:prev.cr3||null,dr3:prev.dr3||null,"
FO_NEW="cr3:prev.cr3||null,dr3:prev.dr3||null,cr4:prev.cr4||null,dr4:prev.dr4||null," # judge_fix3 B3
RG_OLD="const f={topic:r.topic,cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};"
RG_NEW="const f={topic:r.topic,cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4||null,dr4:r.challenger_r4||null}; // judge_fix3 B4: a row saved before the close rounds has none; it is regraded on six rounds"
DG_OLD="+'\\n=== [DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede) ===\\n'+(d.dr3||'(missing)')+'\\n\\nDIAGNOSTIC:"
DG_NEW="+'\\n=== [DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede) ===\\n'+(d.dr3||'(missing)')+(d.cr4?'\\n=== [CR4] DEFENDER R4 -- CLOSE ROUND (defender final defense) ===\\n'+d.cr4:'')+(d.dr4?'\\n=== [DR4] CHALLENGER R4 -- CLOSE ROUND (challenger final words; no new press) ===\\n'+d.dr4:'')+'\\n\\nDIAGNOSTIC:"
CS_OLD="const rounds=[['DEFENDER','R1',F.cr1],['CHALLENGER','R1',F.gr1],['DEFENDER','R2',F.cr2],['CHALLENGER','R2',F.gr2],['DEFENDER','R3',F.cr3],['CHALLENGER','R3',F.dr3]];"
CS_NEW="const rounds=[['DEFENDER','R1',F.cr1],['CHALLENGER','R1',F.gr1],['DEFENDER','R2',F.cr2],['CHALLENGER','R2',F.gr2],['DEFENDER','R3',F.cr3],['CHALLENGER','R3',F.dr3]].concat(F.cr4?[['DEFENDER','R4',F.cr4]]:[],F.dr4?[['CHALLENGER','R4',F.dr4]]:[]); // judge_fix3 B3: the close rounds' quotations are checked too"
FS_OLD="engine_r3:P('D3 Extract',j=>j.labelled),challenger_r3:P('C3 Extract',j=>j.labelled)};"
FS_NEW="engine_r3:P('D3 Extract',j=>j.labelled),challenger_r3:P('C3 Extract',j=>j.labelled),defender_r4:P('D4 Extract',j=>j.labelled),challenger_r4:P('C4 Extract',j=>j.labelled)}; // judge_fix3 B4"
FS_MD_OLD="['Round 3 - Challenger ('+C+'): link round',body.challenger_r3]].forEach("
FS_MD_NEW="['Round 3 - Challenger ('+C+'): link round',body.challenger_r3],['Round 4 - Defender ('+D+'): close round',body.defender_r4],['Round 4 - Challenger ('+C+'): close round',body.challenger_r4]].forEach("
FM_MD_OLD="['Round 3 - Challenger (' + C + '): link round', r.challenger_r3]];"
FM_MD_NEW="['Round 3 - Challenger (' + C + '): link round', r.challenger_r3]].concat(r.defender_r4 ? [['Round 4 - Defender (' + D + '): close round', r.defender_r4]] : [], r.challenger_r4 ? [['Round 4 - Challenger (' + C + '): close round (no new press)', r.challenger_r4 + C4P.note({gr1: r.engine_r1, gr2: r.engine_r2, dr3: r.challenger_r3, dr4: r.challenger_r4})]] : []); // judge_fix3 B3"
FM_RULE_OLD=r'''- **CONCEDED (stated).** A link is graded CONCEDED (stated) \"when the block itself states the surrender, only when the block surrenders the link itself; a block that drops a limb and keeps the link in a narrowed form is not a concession: grade the narrowed link\".\n'''
FM_RULE_NEW=FM_RULE_OLD+r'''- **VERSE CITATION (operator ruling 3).** \"A verse counts as evidence, as footing, as a witness or as an answer only when its book, chapter and verse are stated and its words are quoted fully and correctly from the KJV\"; an answer in substance without the reference named does not count, and a quotation the citation check marks NOT COUNTED is not counted.\n- **CLOSE ROUNDS.** Round 4 gives each side a close: the defender's close answers witnesses still pressed against its chain and counts as a later defender round; the challenger's close is its final words, answers nothing new and may not press, and a verse it names that its earlier rounds never named is marked NOT COUNTED.\n'''
FM_FOUR_OLD="The judges' rulebook adds four rules, quoted here in its own words."
FM_FOUR_NEW="The judges' rulebook adds six rules, quoted here in its own words."
# A2 (Init Seats)
A2_OLD="const panel_reserve=free.length>3?free[3]:null;"
A2_NEW=("// judge_fix3 A2 (operator rule: \"any model that can't response in the required time will be removed\"; the call limit is 900 s): qwen's\n"
        "// alternate calls took 981.7 s (32228), 1,194.6 s and 985.2 s (32255). It is removed from the reserve and from the alternate pool. Where qwen\n"
        "// would have been the reserve, the run has no reserve (the added model, sol, serves as an alternate only).\n"
        "const JUDGE_TIME_REMOVED=['qwen'];\n"
        "const panel_reserve=(free.length>3&&JUDGE_TIME_REMOVED.indexOf(free[3])<0)?free[3]:null;")
A2C_OLD="const ORDER=['deepseek','gemini','glm','chatgpt','mimo','qwen','grok'];"
A2C_NEW=("// judge_fix3 A2 (operator, 2026-11-02: \"You are authorized to add any model needed during this fix\"): with qwen removed the alternate pool was\n"
         "// empty in every pairing; sol (GPT-6.1 Sol, openai/gpt-6.1-sol, chosen from the operator's ranking; model_config row in sql/a2_sol_alternate.sql)\n"
         "// is added LAST, so the panel, the single judge and the reserve never change; it serves only as an alternate (free.slice(4)). Its family\n"
         "// (openai) is dropped by Resolve Seats when ChatGPT debates (BB-6993).\n"
         "const ORDER=['deepseek','gemini','glm','chatgpt','mimo','qwen','grok','sol'];")
A2D_OLD="const JFAM_I={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',qwen:'openrouter'};"
A2D_NEW="const JFAM_I={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',qwen:'openrouter',sol:'openrouter'}; // judge_fix3 A2"
A2E_OLD="const JFAM={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',qwen:'openrouter'};"
A2E_NEW="const JFAM={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',qwen:'openrouter',sol:'openrouter'}; // judge_fix3 A2: the added alternate"
A2B_OLD="const ALT_ORDER=free.slice(4).filter(s=>JFAM_I[s]==='openrouter'&&s!=='grok'&&s!=='mimo');"
A2B_NEW="const ALT_ORDER=free.slice(4).filter(s=>JFAM_I[s]==='openrouter'&&s!=='grok'&&s!=='mimo'&&JUDGE_TIME_REMOVED.indexOf(s)<0); // judge_fix3 A2"
# A8 debater frames
DEB_D_OLD="Everything presented is open to challenge, and what the other side never challenges stands as held for the side that presented it.\";\nconst CH_BURDEN="
DEB_D_NEW="Everything presented is open to challenge, and what the other side never challenges stands as held for the side that presented it."+R3_DEB+" After the link rounds you have a CLOSE ROUND: your final defense, in which you answer every witness still pressed against your chain.\";\nconst CH_BURDEN="
DEB_C_OLD="Everything presented is open to challenge, and what the other side never challenges stands as held for the side that presented it.\";\nconst TEXTCORR="
DEB_C_NEW="Everything presented is open to challenge, and what the other side never challenges stands as held for the side that presented it."+R3_DEB+" After the link rounds you have a CLOSE ROUND: your final words on your own position, in which you may not press any new witness or premise.\";\nconst TEXTCORR="

done=[];C4P_TXT=c4p_block(rd('D3 Build'))
for f in sorted(os.listdir(B)):
    nm=f[:-3];s=open(f'{B}/{f}').read();t=s
    if nm in ('D3 Build','C3 Build','D3 Extract','C3 Extract'): continue  # templates for the close-round nodes; unchanged
    if A1_OLD in t:
        t=rep(t,'const drvKinds=',A1_DEF+'const drvKinds=',nm); t=rep(t,A1_OLD,A1_NEW,nm)
        t=rep(t,A3_DEF_OLD,A3_DEF_NEW,nm); t=rep(t,A3_H_OLD,A3_H_NEW,nm); t=rep(t,A3_SKIP_OLD,A3_SKIP_NEW,nm)
        t=rep(t,'function drvCheck(',A5_DEF+'function drvCheck(',nm); t=rep(t,A5_OLD,A5_NEW,nm)
    if L2_OLD in t: t=rep(t,L2_OLD,L2_NEW,nm)
    if KC_OLD in t: t=rep(t,KC_OLD,KC_NEW+R3_CURE,nm)
    if A4_OLD in t: t=rep(t,A4_OLD,A4_NEW,nm)
    if 'const respOf=' in t: t=rep(t,A6_OLD,A6_NEW,nm)
    for a,b in B3_CODE:
        if a in t: t=rep(t,a,b,nm,t.count(a))
    for a,b in B3_TEXT:
        if a in t: t=t.replace(a,b)
    t=re.sub(r"answered in \[CR2\] or \[CR3\]:",'answered in [CR2], [CR3] or [CR4]:',t)  # comments naming the ledger heading
    if nm in ('Panel Build','Build Independent Verdict'):
        t=rep(t,R3_ANCHOR,R3_ANCHOR+R3_JUDGE.strip()+' ',nm); t=rep(t,KJV_BAD_OLD,KJV_BAD_NEW,nm)
        t=rep(t,CR_OLD1,CR_NEW1,nm); t=rep(t,CR_OLD2,CR_NEW2,nm); t=rep(t,OOR_OLD,OOR_NEW,nm)
        t=rep(t,LED_OLD,LED_NEW,nm); t=rep(t,LCIT_OLD,LCIT_NEW,nm); t=rep(t,LO_OLD,LO_NEW,nm)
        t=C4P_TXT+t
    if nm=='Panel Build':
        t=rep(t,PB_PARTS_OLD,PB_PARTS_NEW,nm); t=rep(t,SLC_OLD_P,SLC_NEW_P,nm); t=rep(t,LJB_P_OLD,LJB_P_NEW,nm)
    if nm=='Build Independent Verdict':
        t=rep(t,BIV_TR_OLD,BIV_TR_NEW,nm); t=rep(t,SLC_OLD_B,SLC_NEW_B,nm); t=rep(t,LJB_B_OLD,LJB_B_NEW,nm)
    if nm=='Build Save Body':
        t=rep(t,SA_OLD,SA_NEW,nm); t=rep(t,SC_OLD,SC_NEW,nm); t=rep(t,SC_HIT_OLD,SC_HIT_NEW,nm); t=rep(t,SB_OLD,SB_NEW,nm); t=rep(t,SA_DEF_OLD,SA_DEF_NEW,nm)
        t=rep(t,BSB_R_OLD,BSB_R_NEW,nm); t=rep(t,BSB_SAVE_OLD,BSB_SAVE_NEW,nm); t=rep(t,BSB_C4_OLD,BSB_C4_NEW,nm); t=C4P_TXT+t
    if nm=='Build Synthesis':
        t=rep(t,SYN_OLD,SYN_NEW,nm); t=rep(t,SYN_OUT_OLD,SYN_OUT_NEW,nm); t=rep(t,SYN_TR_OLD,SYN_TR_NEW,nm); t=rep(t,SYN_RULE_OLD,SYN_RULE_NEW,nm); t=C4P_TXT+t
    if nm=='Final Output': t=rep(t,FO_OLD,FO_NEW,nm)
    if nm=='Regrade Load': t=rep(t,RG_OLD,RG_NEW,nm)
    if nm=='Build Diagnostic Prompt': t=rep(t,DG_OLD,DG_NEW,nm)
    if nm=='Citation Scan': t=rep(t,CS_OLD,CS_NEW,nm)
    if nm=='Failure Salvage': t=rep(t,FS_OLD,FS_NEW,nm); t=rep(t,FS_MD_OLD,FS_MD_NEW,nm)
    if nm=='Format Markdown':
        t=rep(t,FM_MD_OLD,FM_MD_NEW,nm); t=rep(t,FM_RULE_OLD,FM_RULE_NEW,nm); t=rep(t,FM_FOUR_OLD,FM_FOUR_NEW,nm); t=rep(t,FM_L2_OLD,FM_L2_NEW,nm); t=C4P_TXT+t
    if nm=='Init Seats': t=rep(t,A2_OLD,A2_NEW,nm); t=rep(t,A2B_OLD,A2B_NEW,nm); t=rep(t,A2C_OLD,A2C_NEW,nm); t=rep(t,A2D_OLD,A2D_NEW,nm)
    if nm=='Resolve Seats': t=rep(t,A2E_OLD,A2E_NEW,nm)
    if nm=='Init with Guards': t=rep(t,DEB_D_OLD,DEB_D_NEW,nm); t=rep(t,DEB_C_OLD,DEB_C_NEW,nm)
    if t!=s: open(f'{N}/{f}','w').write(t);done.append(nm)
    elif os.path.exists(f'{N}/{f}'): os.remove(f'{N}/{f}')
# the close-round code nodes (new)
open(f'{N}/D4 Build.js','w').write(d4_build(rd('D3 Build')))
open(f'{N}/C4 Build.js','w').write(c4_build(rd('C3 Build'),C4P_TXT))
open(f'{N}/D4 Extract.js','w').write(extract4(rd('D3 Extract'),'D'))
open(f'{N}/C4 Extract.js','w').write(extract4(rd('C3 Extract'),'C',C4P_TXT))
print(len(done),'nodes changed:',', '.join(done));print('4 nodes added: D4 Build, D4 Extract, C4 Build, C4 Extract')
