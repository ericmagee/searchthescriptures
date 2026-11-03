# patch.py (judge_fix8): builds new/<node>.js from base/<node>.js (the live code of ORACLE_DEBATE_V1 version cfcbb37b, read by GET on
# 2026-11-03 into data/workflow_live.json and data/live_code/; equal to judge_fix7/new for the 29 nodes fix set 7 changed) and lib/.
# Offline; writes only new/. Anchored replacements: it refuses when an anchor is not found the expected number of times.
#  The operator's ruling (md_notes_rulings 392): "a press must have a premise behind it; a verse pressed without one isn't a witness".
#  K1 every rule copy: a pressed witness is a verse under a listed premise's PRESSED WITH:; UNANSWERED WITNESS and ruling 372 apply to it only;
#     the ledger's "cited in" line is informational and not a list of witnesses (Panel Build, Build Independent Verdict, the cure prompts,
#     Format Markdown's reading guide, and the debaters' copy of the cited-in sentence in Init with Guards)
#  K2 K-G9 retired (no CITED-IN RULINGS section, no K-G9 item); K-G10 (TRIAL): a premise counted UNEXHIBITED on a verse no listed premise carries
#     under PRESSED WITH: is marked; cure: a corrected count, or a STATEMENT quoting the PRESSED WITH: line that carries the verse (lib/kg10.js,
#     lib/kg10_cure.js); K-G6 unchanged
#  K3 D4 Build: the close round's list of verses still unanswered keeps part (a) (the verses of the listed premises) and drops part (b)
#  K5 (coordinator): (1) a witness left unanswered is a BROKEN ground only under PRESSED WITH: (rulebook, cure prompts, audit marks; K-G11, TRIAL,
#     lib/kg11.js, lib/kg11_cure.js); (2) the ledger premise lines (and so K-G6) count only PRESSED WITH: verses, others shown as informational;
#     (3) C2 Build and D3 Build: a verse pressed without a listed premise's PRESSED WITH: line is not a witness
#  K7 (coordinator): D4 Build part (a) lists only verses under PRESSED WITH:
#  K6 (coordinator, run 32306): K-V (TRIAL, lib/kv.js, lib/kv_cure.js): a VOID ruling quotes the charge words beyond the quote and names the kind
#  R1-R13 (the reviews of run 32306 by Worker_E and Worker_G1; ruling 393): patch_r.py
import os,sys
H=os.path.dirname(os.path.abspath(__file__));B=H+'/base';N=H+'/new';L=H+'/lib';os.makedirs(N,exist_ok=True)
def rep(s,old,new,nm,count=1):
    c=s.count(old)
    if c!=count: sys.exit(f'{nm}: anchor found {c} times, want {count}: {old[:140]!r}')
    return s.replace(old,new)
def cut(s,a,b,new,nm):
    i=s.find(a)
    if i<0 or s.count(a)!=1: sys.exit(f'{nm}: cut start found {s.count(a)} times: {a[:100]!r}')
    j=s.find(b,i)
    if j<0: sys.exit(f'{nm}: cut end not found: {b[:100]!r}')
    return s[:i]+new+s[j:]
lib=lambda n:open(f'{L}/{n}').read().rstrip('\n')
OUT={}
def get(nm):
    if nm not in OUT: OUT[nm]=open(f'{B}/{nm}.js').read()
    return OUT[nm]
CHECK=['Panel Payloads','Alternate Payloads','Extract Independent Verdict']
CURE=['Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge','Cure Build','Cure Check','Cure Normalize',
      'Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Panel Cure Check','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']
KG10=lib('kg10.js');PWLIB=KG10[:KG10.index('const PW_SEG=')].rstrip('\n')

# ======================= K1: the judges' rulebook (Panel Build, Build Independent Verdict; single-quoted strings) =======================
UW_OLD="UNANSWERED WITNESS: a verse the other side quoted against a link or a listed premise in an earlier round (against the defender: [DR1] and [DR2]; against the challenger: [CR1], [CR2] and [CR3]) is ANSWERED when"
UW_NEW=("UNANSWERED WITNESS: a pressed witness is a verse the other side carries under PRESSED WITH: beside a premise of its listed premises (against the defender: "
        "a premise of the list that closes [DR2], the verse quoted in [DR1] or [DR2]; against the challenger: a premise of the CHALLENGER\\'S UNSUPPORTED-L4 PREMISES "
        "list that closes [CR3], the verse quoted in [CR1], [CR2] or [CR3]); it is ANSWERED when")
P372_OLD=("A premise whose pressed witness goes unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings. In a debate a non-response is never neutral. "
          "A verse on a side\\'s \\'cited in\\' line counts as an unanswered witness only when the judge quotes the sentence of the earlier round that pressed it against "
          "that link or a listed premise and names that round; a verse cited there but not pressed against the link does not count.")
P372_NEW=("A premise whose pressed witness goes unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings. In a debate a non-response is never neutral. "
          "A PRESS NEEDS A PREMISE (md_notes_rulings 392): a press must have a premise behind it; a verse pressed without one is not a witness. Only a verse carried "
          "under PRESSED WITH: beside a premise of the list against a side is a pressed witness, and the UNANSWERED WITNESS rule and ruling 372 apply to it and to no "
          "other verse. A verse cited elsewhere, on a \"cited in\" line of the PRESSED-WITNESS LEDGER or pressed in prose against a link but carried under no listed "
          "premise\\'s PRESSED WITH:, is not a witness: leaving it unanswered never counts, and no premise is counted UNEXHIBITED for it. The \"cited in\" lines are "
          "informational and are not a list of witnesses.")
UX_OLD="or when a witness pressed against that premise was left unanswered (md_notes_rulings 372: it counts toward CONCEDED LINKS and the standings)"
UX_NEW=("or when a witness pressed against that premise, a verse carried under PRESSED WITH: in the list against that side, was left unanswered "
        "(md_notes_rulings 372: it counts toward CONCEDED LINKS and the standings; md_notes_rulings 392: a verse carried under no listed premise\\'s PRESSED WITH: "
        "is not a witness and never makes a premise UNEXHIBITED)")
LG_OLD="; which of those verses were quoted against a link or a listed premise is the judge\\'s to decide."
LG_NEW=("; the line is informational and is not a list of witnesses (md_notes_rulings 392): a verse on it is a pressed witness only when a premise of the list "
        "against that side carries it under PRESSED WITH:, and leaving a verse of the line unanswered never counts.")
for nm in ['Panel Build','Build Independent Verdict']:
    s=get(nm)
    s=rep(s,UW_OLD,UW_NEW,nm);s=rep(s,P372_OLD,P372_NEW,nm);s=rep(s,UX_OLD,UX_NEW,nm,2);s=rep(s,LG_OLD,LG_NEW,nm)
    OUT[nm]=s
# K2: the CITED-IN RULINGS section is no longer asked for
s=get('Panel Build')
s=cut(s,"\"CITED-IN RULINGS (md_notes_rulings 372 and 373) -- required.","\n\"OUT-OF-ROUND CONCESSIONS --","",'Panel Build')
s=rep(s,"LEDGER,'',\n\"OUT-OF-ROUND CONCESSIONS --","LEDGER,'', /* judge_fix8 K2: the CITED-IN RULINGS section is retired (ruling 392) */\n\"OUT-OF-ROUND CONCESSIONS --",'Panel Build')
s=rep(s,"the citation check, CITED-IN RULINGS, OUT-OF-ROUND CONCESSIONS,","the citation check, OUT-OF-ROUND CONCESSIONS,",'Panel Build')
OUT['Panel Build']=s
s=get('Build Independent Verdict')
s=cut(s,"\"CITED-IN RULINGS (md_notes_rulings 372 and 373) -- required.","\"OUT-OF-ROUND CONCESSIONS --","",'Build Independent Verdict')
s=rep(s,"+LEDGER+NL+NL+\"OUT-OF-ROUND CONCESSIONS --","+LEDGER+NL+NL+/* judge_fix8 K2: the CITED-IN RULINGS section is retired (ruling 392) */\"OUT-OF-ROUND CONCESSIONS --",'Build Independent Verdict')
OUT['Build Independent Verdict']=s

# ======================= K1: the reading guide (Format Markdown; double-quoted string) =======================
s=get('Format Markdown')
s=rep(s,"or when a witness pressed against that premise was left unanswered\\\"; it counts as conceded.",
      "or when a witness pressed against that premise, a verse carried under PRESSED WITH: in the list against that side, was left unanswered\\\"; it counts as conceded.",'Format Markdown')
s=rep(s,"- **AN UNANSWERED PRESSED WITNESS (operator ruling 372).** \\\"A premise whose pressed witness goes unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings.\\\" A non-response is never neutral: a side could otherwise win by not responding.\\n",
      "- **AN UNANSWERED PRESSED WITNESS (operator rulings 372 and 392).** \\\"A premise whose pressed witness goes unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings.\\\" A non-response is never neutral: a side could otherwise win by not responding. "
      "But \\\"a press must have a premise behind it; a verse pressed without one isn't a witness\\\" (ruling 392): only a verse carried under PRESSED WITH: beside a numbered premise of the other side's list is a pressed witness. "
      "A verse cited elsewhere, on the ledger's \\\"cited in\\\" line or pressed in prose against a link, is not a witness, and leaving it unanswered never counts; the \\\"cited in\\\" line is for information only.\\n",'Format Markdown')
s=rep(s,"'K-G9': 'Cited-in line not ruled, or a pressed and unanswered verse not coun","'K-G10': 'Premise counted on a verse no listed premise carries under PRESSED WITH (K-G10)', 'K-G9': 'Cited-in line not ruled, or a pressed and unanswered verse not coun",'Format Markdown')
s=rep(s,"m = x.match(/\\((K-G6)\\) -- ((?:DEFENDER|CHALLENGER) premise \\d+)/); if (m) return 'K-G6|' + m[2].toUpperCase();",
      "m = x.match(/\\((K-G6|K-G10)\\) -- ((?:DEFENDER|CHALLENGER) premise \\d+)/); if (m) return m[1] + '|' + m[2].toUpperCase(); /* judge_fix8 K2: K-G10 */",'Format Markdown')
OUT['Format Markdown']=s
s=get('Build Save Body')
s=rep(s,"m=x.match(/\\((K-G6)\\) -- ((?:DEFENDER|CHALLENGER) premise \\d+)/);if(m)return 'K-G6|'+m[2].toUpperCase();",
      "m=x.match(/\\((K-G6|K-G10)\\) -- ((?:DEFENDER|CHALLENGER) premise \\d+)/);if(m)return m[1]+'|'+m[2].toUpperCase(); /* judge_fix8 K2: K-G10 */",'Build Save Body')
OUT['Build Save Body']=s

# ======================= K1: the debaters' copy of the cited-in sentence (Init with Guards; double-quoted strings) =======================
s=get('Init with Guards')
s=rep(s,"A verse on a side's 'cited in' line counts as an unanswered witness only when the judge quotes the sentence of the earlier round that pressed it against that link or a listed premise and names that round; a verse cited there but not pressed against the link does not count.",
      "A press must have a premise behind it; a verse pressed without one is not a witness (operator ruling 392): only a verse carried under PRESSED WITH: beside a numbered premise of a side's list is a pressed witness, and a verse on a side's 'cited in' line, or pressed in prose against a link but under no listed premise, is not a witness and is never counted unanswered.",'Init with Guards',2)
OUT['Init with Guards']=s

# ======================= K3: D4 Build, the close round's list =======================
s=get('D4 Build')
s=rep(s,"// defender's round 2 nor its link round names; (b) every verse the challenger cited, by the round that first cites it, that no later defender round names.",
      "// defender's round 2 nor its link round names. judge_fix8 K3 (ruling 392): part (b), every verse the challenger cited that no later defender\n"
      "// round names, is dropped: a verse cited under no listed premise is not a witness, so it is no longer listed as still pressed.",'D4 Build')
s=cut(s," const rs=PWL.citedRounds([['challenger round 1',RW.gr1]"," return 'STILL UNANSWERED AGAINST YOUR CHAIN --","",'D4 Build')
OUT['D4 Build']=s

# ======================= K2: the checkers (K-G9 retired, K-G10 added) =======================
for nm in CHECK:
    s=get(nm)
    s=rep(s,"'K-G9':'TRIAL',","'K-G9':'TRIAL','K-G10':'TRIAL',",nm)
    s=rep(s,"\n// judge_fix5 G13 (operator, on \"is a link-round block","\n"+KG10+"\n// judge_fix5 G13 (operator, on \"is a link-round block",nm)
    if nm=='Extract Independent Verdict':
        s=rep(s,"const CI=drvCited(raw0,PT,","const CI=drvPressWith(raw0,PT,",nm) # judge_fix8 K2
        s=rep(s,"// judge_fix5 G2 (K-G9), G13 (K-LB)","// judge_fix5 G2 (K-G9, retired by judge_fix8 K2: drvPressWith, K-G10), G13 (K-LB)",nm)
    else:
        s=rep(s,"const CI=drvCited(WT,PT,","const CI=drvPressWith(WT,PT,",nm)
        s=rep(s,"// judge_fix5 G2 (K-G9), G13 (K-LB)","// judge_fix5 G2 (K-G9, retired by judge_fix8 K2: drvPressWith, K-G10), G13 (K-LB)",nm)
    OUT[nm]=s

# ======================= K1, K2: the cure library and prompt (14 nodes; double-quoted strings) =======================
KG9_A=" K-G9 (the PRESSED-WITNESS LEDGER's \\\"cited in\\\" line lists"
KG9_B="Ruling 373: an answer counts in any later round of the side that holds the link. "
KG10_PROMPT=(" K-G10 (your CONCEDED LINKS or CHALLENGER CONCEDED LINKS counts a premise UNEXHIBITED on a verse that no premise of the list against that side "
 "carries under PRESSED WITH: -- the list that closes [DR2] against the defender, the CHALLENGER'S UNSUPPORTED-L4 PREMISES list that closes [CR3] against the "
 "challenger): md_notes_rulings 392 reads \\\"a press must have a premise behind it; a verse pressed without one isn't a witness\\\"; a verse on a \\\"cited in\\\" "
 "line of the ledger, or pressed in prose against a link, is not a witness, and leaving it unanswered never counts. Cure it either with CORRECTED COUNT for "
 "that side that no longer counts the premise on that verse (your count less every such premise you do not answer by statement), with the CORRECTED STANDING "
 "that count makes true (SELF-SUPPORTED at 0 unless a link of that side stands graded BROKEN; PROP-DEPENDENT; COLLAPSED when twice the count exceeds the "
 "number of premises listed against that side); or with a STATEMENT for the item that quotes, word for word and with its book, chapter and verse, the "
 "PRESSED WITH: line that carries the verse. ")
FORM_KG9="+\"PRESSED: <book chapter:verse> -- [<pressing round>] -- \\\"<the pressing sentence, quoted exactly>\\\" -- UNANSWERED   (a K-G9 ruling; or -- ANSWERED IN [<round>])\\nNOT PRESSED: <book chapter:verse> -- <the reason, in one clause>   (a K-G9 ruling)\\n\"\n "
for nm in CURE:
    s=get(nm)
    s=rep(s,"'K-G9':'TRIAL',","'K-G9':'TRIAL','K-G10':'TRIAL',",nm)
    s=cut(s,KG9_A,KG9_B,KG10_PROMPT,nm);s=rep(s,KG10_PROMPT+KG9_B,KG10_PROMPT,nm)
    s=rep(s,FORM_KG9,"",nm)
    s=rep(s,"+\"CORRECTED STANDING: <DEFENDER or CHALLENGER> <PROP-DEPENDENT or COLLAPSED>\\n\"","+\"CORRECTED STANDING: <DEFENDER or CHALLENGER> <SELF-SUPPORTED, PROP-DEPENDENT or COLLAPSED>\\n\"",nm)
    s=rep(s,"For a K-G6 item it must quote, word for word, the transcript's words that show the verse is not a pressed witness of that premise. ",
          "For a K-G6 item it must quote, word for word, the transcript's words that show the verse is not a pressed witness of that premise. For a K-G10 item it must quote the PRESSED WITH: line that carries the verse, with its book, chapter and verse. ",nm)
    s=rep(s,"x.rule==='K-G9'||x.rule==='K-LB'","x.rule==='K-G9'||x.rule==='K-G10'||x.rule==='K-LB'",nm,4)
    s=rep(s,"||(x.rule==='K-G9'&&/^every listed verse ruled/.test(String(x.why||''))))","||(x.rule==='K-G9'&&/^every listed verse ruled/.test(String(x.why||'')))||(x.rule==='K-G10'&&/^statement/.test(String(x.why||'')))) /* judge_fix8 K2 */",nm)
    s=rep(s,"\nfunction cureVerdicts(","\n"+PWLIB+"\nfunction cureVerdicts(",nm)
    s=rep(s,"  // judge_fix5 G13 K-LB: counted",lib('kg10_cure.js')+"\n  // judge_fix5 G13 K-LB: counted",nm)
    OUT[nm]=s

# ======================= K5 (coordinator, after the build): ruling 392 at the collisions, in the ledger K-G6 reads, and in the debaters' lists ===
WDEF=' (a verse a listed premise carries under PRESSED WITH:, md_notes_rulings 392)'
K5_TXT=[ # (anchor, replacement, nodes); the replacements hold no quotation mark, so they stand in single- or double-quoted strings alike
 ("A witness left unanswered is a BROKEN ground.",
  "A pressed witness"+WDEF+" left unanswered is a BROKEN ground; a verse under no PRESSED WITH: line, left unanswered, is no BROKEN ground.",['Panel Build','Build Independent Verdict']+CURE),
 ("against a witness the other side exhibited names in the same line the round that answered that witness.",
  "against a pressed witness the other side exhibited"+WDEF+" names in the same line the round that answered that witness.",['Panel Build','Build Independent Verdict']+CURE),
 ("left any of those witnesses UNANSWERED (COUNTING RULE)",
  "left UNANSWERED any of those witnesses that a listed premise carries under PRESSED WITH: (COUNTING RULE; md_notes_rulings 392: a verse under no PRESSED WITH: line, left unanswered, is no BROKEN ground)",['Panel Build','Build Independent Verdict']),
 ("BROKEN for a witness left unanswered. Both sides alike.",
  "BROKEN for a pressed witness"+WDEF+" left unanswered. Both sides alike.",['Panel Build','Build Independent Verdict']),
 ("BROKEN AT COLLISION: a defender link graded DEFENDER LINK BROKEN on the COLLISION POINTS lines; k = their number.",
  "BROKEN AT COLLISION: a defender link graded DEFENDER LINK BROKEN on the COLLISION POINTS lines; k = their number. A grade that rests on a witness left unanswered counts only when that witness is a verse a listed premise carries under PRESSED WITH: (md_notes_rulings 392).",['Panel Build','Build Independent Verdict']),
 ("COUNT AND STANDING (same rule). Your own numbers must agree with your own COLLISION POINTS lines. ",
  "COUNT AND STANDING (same rule). Your own numbers must agree with your own COLLISION POINTS lines. WITNESS (md_notes_rulings 392): in every item below a witness is a verse a listed premise carries under PRESSED WITH: (the list that closes [DR2] against the defender, the list that closes [CR3] against the challenger); a verse under no PRESSED WITH: line is not a witness, and left unanswered it is no BROKEN ground and is never counted. ",CURE),
 ("on a witness left unanswered): cure it","on a pressed witness"+WDEF+" left unanswered): cure it",CURE,2),
 ("a witness left unanswered keeps the line BROKEN in the corrected form","a pressed witness under PRESSED WITH: left unanswered keeps the line BROKEN in the corrected form; a verse under no PRESSED WITH: line does not (md_notes_rulings 392)",CURE),
 ("only for a witness left unanswered, and a premise whose witness goes unanswered is counted.","only for a pressed witness"+WDEF+" left unanswered, and a premise whose witness goes unanswered is counted.",CURE),
 ("a witness left unanswered while your CHALLENGER CONCEDED LINKS is 0","a pressed witness under PRESSED WITH: left unanswered while your CHALLENGER CONCEDED LINKS is 0",CURE),
 ("the PRESSED-WITNESS LEDGER marks NOT NAMED, which","the PRESSED-WITNESS LEDGER marks NOT NAMED (a verse the premise carries under PRESSED WITH:, md_notes_rulings 392), which",CURE),
 # the audit marks (checker nodes, and the checker copies in the cure nodes)
 ("); a witness left unanswered is a BROKEN ground. REVIEW THIS ROW.]","); a pressed witness (a verse a listed premise carries under PRESSED WITH, ruling 392) left unanswered is a BROKEN ground; a verse under no PRESSED WITH line is not. REVIEW THIS ROW.]",CHECK+CURE),
 ("rests on a witness left unanswered while ","rests on a witness left unanswered (a witness is a verse a listed premise carries under PRESSED WITH, ruling 392) while ",CHECK+CURE),
 ("counts a witness as unanswered; the rule counts it only with the quoted pressing sentence and its round.","counts a witness as unanswered; the rule counts it only with the quoted pressing sentence and its round, and only for a verse a listed premise carries under PRESSED WITH (ruling 392).",CHECK+CURE),
 ("CHALLENGER LINK BROKEN for a witness left unanswered while CHALLENGER CONCEDED LINKS is 0.","CHALLENGER LINK BROKEN for a pressed witness (under PRESSED WITH, ruling 392) left unanswered while CHALLENGER CONCEDED LINKS is 0.",CHECK),
]
for t in K5_TXT:
    a,b,nodes=t[0],t[1],t[2];c=t[3] if len(t)>3 else 1
    for nm in nodes: OUT[nm]=rep(get(nm),a,b,nm,c)
# K5 (2): the ledger's premise lines (Panel Build, Build Independent Verdict) count only the verses a premise carries under PRESSED WITH: as its
# witnesses (seen, named, NOT NAMED: what K-G6 reads); the premise's other verses are shown before NOT NAMED as informational, not witnesses.
LED_OLD=("const premises=items(list).map((x,k)=>{const lk=(x.match(/LINK\\s+(\\d+|none)\\b/i)||[])[1]||null;const seen=new Set();const notNamed=[];let named=0;\n"
 "   for(const r of refs(x)){")
LED_NEW=("const premises=items(list).map((x,k)=>{const lk=(x.match(/LINK\\s+(\\d+|none)\\b/i)||[])[1]||null;const seen=new Set();const notNamed=[];let named=0;\n"
 "   /* judge_fix8 K5 (2), ruling 392: the witnesses are the verses under PRESSED WITH: (to the item's end or a blank line); the others are informational */\n"
 "   const pwi=x.search(/PRESSED WITH\\s*:/i);let xw=pwi<0?'':x.slice(pwi);{const b=xw.search(/\\n\\s*\\n/);if(b>=0)xw=xw.slice(0,b);}if(/^PRESSED WITH\\s*:\\s*[*_]*\\s*none\\b/i.test(xw))xw='';\n"
 "   const info=[];for(const r of refs(pwi<0?x:x.slice(0,pwi))){const label=((r.book||r.ctx)?((r.book||r.ctx)+' '):'')+r.label;if(!info.includes(label))info.push(label);}\n"
 "   for(const r of refs(xw)){")
LED_RET_OLD="   return {n:k+1,link:lk,verses:seen.size,named,notNamed};});"
LED_RET_NEW="   return {n:k+1,link:lk,verses:seen.size,named,notNamed,info:info.filter(l=>!seen.has(l))};});"
SL_OLD="return [label+':'].concat(s.premises.map(p=>'premise '+p.n+(p.link?' (LINK '+p.link+')':'')+': '+(p.verses===0?'no verse carried; the judge reads this premise from the transcript':p.verses+' verse(s) carried; '+p.named+' named; NOT NAMED: '+(p.notNamed.length?p.notNamed.join(', '):'none'))));};"
SL_NEW=("return [label+':'].concat(s.premises.map(p=>{const inf=(p.info&&p.info.length)?'; other verses the premise names (informational, not witnesses): '+p.info.join(', '):''; /* judge_fix8 K5 (2) */\n"
 "   return 'premise '+p.n+(p.link?' (LINK '+p.link+')':'')+': '+(p.verses===0?'no verse carried under PRESSED WITH (no pressed witness)'+inf+'; the judge reads this premise from the transcript':p.verses+' verse(s) carried under PRESSED WITH; '+p.named+' named'+inf+'; NOT NAMED: '+(p.notNamed.length?p.notNamed.join(', '):'none'));}));};")
SCOPE_OLD="SCOPE: the verses carried by each numbered premise of the list that closes [DR2]"
SCOPE_NEW="SCOPE: the verses each numbered premise carries under PRESSED WITH: (its pressed witnesses, md_notes_rulings 392; any other verse a premise names is listed beside it as informational, not a witness) of the list that closes [DR2]"
for nm in ['Panel Build','Build Independent Verdict']:
    s=get(nm);s=rep(s,LED_OLD,LED_NEW,nm);s=rep(s,LED_RET_OLD,LED_RET_NEW,nm);s=rep(s,SL_OLD,SL_NEW,nm);s=rep(s,SCOPE_OLD,SCOPE_NEW,nm);OUT[nm]=s
# K5 (3): the debaters' premise lists (C2 Build, D3 Build)
for nm in ['C2 Build','D3 Build']:
    OUT[nm]=rep(get(nm),"a pressed verse left off the list is weaker: it reaches the judges only if the other side never names it.",
      "a verse pressed without the PRESSED WITH: line of a listed premise is not a witness and is not weighed as one (operator ruling 392: a press must have a premise behind it).",nm)
# K5 (1): K-G11, the collision check (lib/kg11.js) and its cure (lib/kg11_cure.js)
KG11=lib('kg11.js');PWF=[l for l in KG10.split('\n') if l.startswith('const PW_FOOT=') or l.startswith('const PW_UNANS=')]
KG11_PROMPT=(" K-G11 (a COLLISION POINTS line you graded LINK BROKEN that rests, as unanswered, only on verses that no premise of the list against that side "
 "carries under PRESSED WITH:, while every verse of the line that the list does carry is named in a later round of that side): under md_notes_rulings 392 "
 "such a verse is no BROKEN ground. Cure it with RETRACTED for that line and one CORRECTED RESULT, the reason naming the round and the verse; or with one "
 "RESTATED line for it that is not graded LINK BROKEN; or with one RESTATED LINK BROKEN line that names, as left unanswered, a verse the list carries under PRESSED WITH:. ")
for nm in CHECK:
    s=get(nm)
    s=rep(s,"'K-G10':'TRIAL',","'K-G10':'TRIAL','K-G11':'TRIAL',",nm)
    s=rep(s,"\nfunction drvPressWith(",'\n'+KG11+"\nfunction drvPressWith(",nm)
    OUT[nm]=s
for nm in CURE:
    s=get(nm)
    s=rep(s,"'K-G10':'TRIAL',","'K-G10':'TRIAL','K-G11':'TRIAL',",nm)
    s=rep(s,"\nfunction cureVerdicts(","\n"+'\n'.join(PWF)+"\n"+KG11+"\nfunction cureVerdicts(",nm)
    s=rep(s,"  // judge_fix8 K2 K-G10 (TRIAL; md_notes_rulings 392)",lib('kg11_cure.js')+"\n  // judge_fix8 K2 K-G10 (TRIAL; md_notes_rulings 392)",nm)
    s=rep(s,"x.rule==='K-G10'||x.rule==='K-LB'||x.rule==='K-S'","x.rule==='K-G10'||x.rule==='K-G11'||x.rule==='K-LB'||x.rule==='K-S'",nm,2)
    s=rep(s,KG10_PROMPT,KG10_PROMPT+KG11_PROMPT,nm)
    OUT[nm]=s
s=get('Format Markdown')
s=rep(s,"'K-G10': 'Premise counted on a verse no listed premise carries under PRESSED WITH (K-G10)',","'K-G10': 'Premise counted on a verse no listed premise carries under PRESSED WITH (K-G10)', 'K-G11': 'BROKEN on a verse no listed premise carries under PRESSED WITH (K-G11)',",'Format Markdown')
s=rep(s,"m = x.match(/\\((K-G\\d)\\) -- (D\\d+ vs C\\d+)/);","m = x.match(/\\((K-G\\d+)\\) -- (D\\d+ vs C\\d+)/); /* judge_fix8 K5: K-G11 */",'Format Markdown')
OUT['Format Markdown']=s
OUT['Build Save Body']=rep(get('Build Save Body'),"m=x.match(/\\((K-G\\d)\\) -- (D\\d+ vs C\\d+)/);","m=x.match(/\\((K-G\\d+)\\) -- (D\\d+ vs C\\d+)/); /* judge_fix8 K5: K-G11 */",'Build Save Body')

# ======================= K6 (coordinator, after run 32306): K-V, a VOID ruling quotes the charge words beyond the quote and names the kind =====
KV=lib('kv.js');PWSEG=[l for l in KG10.split('\n') if l.startswith('const PW_SEG=')]
VR_OLD="name it VOID in your itemization and exclude it from every count and standing."
VR_NEW=("name it VOID in your itemization and exclude it from every count and standing. A VOID ruling for a charge stronger than its quote quotes, in the "
        "same ruling, the charge words that go beyond the quote and names the kind: a negation, a universal, or a claim the words of the quote do not make "
        "(a premise with no verbatim quote is ruled VOID on that ground).")
for nm in ['Panel Build','Build Independent Verdict']: OUT[nm]=rep(get(nm),VR_OLD,VR_NEW,nm)
KV_PROMPT=(" K-V (a premise you ruled VOID as charged beyond its quote, where your ruling quotes no words of the charge that go beyond the quote, or "
 "names no kind): a charge is stronger than its quote only when it asserts what the quote does not, a negation, a universal (all, none, only, never), or a "
 "claim the words of the quote do not make. Cure it with a STATEMENT for the item that quotes, word for word, the charge words that go beyond the quote "
 "and names the kind; or by regrading the premise in one RESTATED line for that count (SUPPORTED or NARROWED; or counted UNEXHIBITED or CONCEDED, with "
 "CORRECTED COUNT and the CORRECTED STANDING that count makes true). ")
for nm in CHECK:
    s=get(nm);s=rep(s,"'K-G11':'TRIAL',","'K-G11':'TRIAL','K-V':'TRIAL',",nm);s=rep(s,"\nfunction drvPressWith(",'\n'+KV+"\nfunction drvPressWith(",nm);OUT[nm]=s
for nm in CURE:
    s=get(nm)
    s=rep(s,"'K-G11':'TRIAL',","'K-G11':'TRIAL','K-V':'TRIAL',",nm)
    s=rep(s,"\nfunction cureVerdicts(","\n"+'\n'.join(PWSEG)+"\n"+KV+"\nfunction cureVerdicts(",nm)
    s=rep(s,"  // judge_fix8 K2 K-G10 (TRIAL; md_notes_rulings 392)",lib('kv_cure.js')+"\n  // judge_fix8 K2 K-G10 (TRIAL; md_notes_rulings 392)",nm)
    s=rep(s,"x.rule==='K-G11'||x.rule==='K-LB'||x.rule==='K-S'","x.rule==='K-G11'||x.rule==='K-V'||x.rule==='K-LB'||x.rule==='K-S'",nm,2)
    # cureSet: a K-V item joins the side's count items only when a count cured it, so an open K-V (TRIAL) never holds back another count cure
    s=rep(s,"x.rule==='K-G10'||x.rule==='K-LB'));","x.rule==='K-G10'||(x.rule==='K-V'&&x.status==='CURED'&&/^counted/.test(String(x.why||'')))||x.rule==='K-LB'));",nm)
    s=rep(s,"||(x.rule==='K-G10'&&/^statement/.test(String(x.why||'')))) /* judge_fix8 K2 */","||(x.rule==='K-G10'&&/^statement/.test(String(x.why||'')))||(x.rule==='K-V'&&!/^counted/.test(String(x.why||'')))) /* judge_fix8 K2, K6 */",nm)
    s=rep(s,KG10_PROMPT+KG11_PROMPT,KG10_PROMPT+KG11_PROMPT+KV_PROMPT,nm)
    OUT[nm]=s
s=get('Format Markdown')
s=rep(s,"'K-G11': 'BROKEN on a verse no listed premise carries under PRESSED WITH (K-G11)',","'K-G11': 'BROKEN on a verse no listed premise carries under PRESSED WITH (K-G11)', 'K-V': 'VOID ruling without the charge words or the kind (K-V)',",'Format Markdown')
s=rep(s,"m = x.match(/\\((K-G6|K-G10)\\) --","m = x.match(/\\((K-G6|K-G10|K-V)\\) --",'Format Markdown')
OUT['Format Markdown']=s
OUT['Build Save Body']=rep(get('Build Save Body'),"m=x.match(/\\((K-G6|K-G10)\\) --","m=x.match(/\\((K-G6|K-G10|K-V)\\) --",'Build Save Body')

# ======================= K7 (coordinator): D4 Build part (a) reads only the verses under PRESSED WITH:, as the ledger does (ruling 392) ============
s=get('D4 Build')
s=rep(s,"   for(const r of refs(x)){const label=((r.book||r.ctx)?((r.book||r.ctx)+' '):'')+r.label;if(seen.has(label))continue;seen.add(label);\n    if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)))named++;",
 "   /* judge_fix8 K7, ruling 392: only the verses under PRESSED WITH: (to the item's end or a blank line) are still pressed */\n"
 "   const pwi=x.search(/PRESSED WITH\\s*:/i);let xw=pwi<0?'':x.slice(pwi);{const b=xw.search(/\\n\\s*\\n/);if(b>=0)xw=xw.slice(0,b);}if(/^PRESSED WITH\\s*:\\s*[*_]*\\s*none\\b/i.test(xw))xw='';\n"
 "   for(const r of refs(xw)){const label=((r.book||r.ctx)?((r.book||r.ctx)+' '):'')+r.label;if(seen.has(label))continue;seen.add(label);\n    if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)))named++;",'D4 Build')
s=rep(s,"out.push('(a) PRESSED PREMISES (the list that closes the challenger\\'s round 2), verses no defender round after it names:');",
 "out.push('(a) PRESSED PREMISES (the list that closes the challenger\\'s round 2), verses carried under PRESSED WITH that no defender round after it names:'); // judge_fix8 K7",'D4 Build')
s=rep(s,"'none: every verse those premises carry is named in your round 2 or your link round'","'none: every verse those premises carry under PRESSED WITH is named in your round 2 or your link round'",'D4 Build')
OUT['D4 Build']=s

# ======================= part R (the reviews of run 32306; ruling 393): patch_r.py =======================
exec(open(H+'/patch_r.py').read())

base=sorted(f[:-3] for f in os.listdir(B) if f.endswith('.js'))
miss=[n for n in base if n not in OUT]
if miss: sys.exit('base nodes not patched: '+', '.join(miss))
for nm,s in OUT.items():
    if nm not in base: sys.exit(nm+': not in base/')
    open(f'{N}/{nm}.js','w').write(s)
print(f'wrote {len(OUT)} nodes to new/')
