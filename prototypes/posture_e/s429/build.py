#!/usr/bin/env python3
"""s429 (ruling 429, "everything you agree with in one run"): builds new/<node>.js from base/<node>.js; every anchor must occur exactly as counted."""
import json,os,sys
R=os.path.dirname(os.path.abspath(__file__))
W=json.load(open(f'{R}/../s428a/fetchback_s428a.json'));LN={n['name']:n for n in W['nodes']}
OUT={}
def get(nm):
    if nm not in OUT:
        OUT[nm]=LN[nm]['parameters']['jsCode'];open(f'{R}/base/{nm}.js','w').write(OUT[nm])
    return OUT[nm]
def rep(nm,a,b,n=1):
    c=get(nm);k=c.count(a)
    if k!=n: raise SystemExit(f'{nm}: anchor count {k} != {n}: {a[:70]}')
    OUT[nm]=c.replace(a,b)
# F2 (C4): the void pre-check reads only the charge: the "which props ..." clause and "The objection it props is ..." sentence are set aside, and a
# negation in the charge is not "added" when the quote itself carries a negation (run 32677: "adds NO" from the props sentence; "adds EXCLUDE" where
# the quote reads "So no human male begot the child").
A1="it=String(it).split(/PRESSED WITH\\s*:/i)[0].split(/\\bASSUMES\\s*:/i)[0];"
B1="it=String(it).split(/PRESSED WITH\\s*:/i)[0].split(/\\bASSUMES\\s*:/i)[0].replace(/,?\\s*which\\s+(?:props|supports|carries)\\b[^.;\\n]*[.;]?/gi,' ').replace(/(^|[.!?]\\s+)The\\s+objection\\s+(?:it|this)\\s+props\\s+is\\b[^.\\n]*\\.?/gi,'$1'); /* s429 F2 (run 32677): the props clause describes, it does not charge */"
A2="const U=[...new Set((charge.toLowerCase().match(/[a-z]+/g)||[]).filter(w=>(NEG.test(w)||UNI.test(w)||/^(?:reversed|any|nothing|nowhere|excludes?|excluded)$/.test(w))&&!qw.has(w)))];"
B2="const qNeg=[...qw].some(w=>NEG.test(w)||UNI.test(w)||/^(?:nothing|nowhere)$/.test(w)); /* s429 F2: a negation the quote itself carries is not added by a negating charge */\n  const U=[...new Set((charge.toLowerCase().match(/[a-z]+/g)||[]).filter(w=>(NEG.test(w)||UNI.test(w)||/^(?:reversed|any|nothing|nowhere|excludes?|excluded)$/.test(w))&&!qw.has(w)&&!(qNeg&&(NEG.test(w)||/^(?:nothing|nowhere|excludes?|excluded)$/.test(w)))))];"
for nm in ['Panel Build','Build Independent Verdict']:
    rep(nm,A1,B1);rep(nm,A2,B2)
# F3 (C8; REVIEW_32677, A3 8): the close-round numbering check fired on "I do not add links or renumber"; a RENUM match standing under a negation
# just before it ("not", "no", "never", "nor", "without") is a statement that the numbering is kept, and the next match is read instead.
A3="const rm=t.match(RENUM);"
B3="const rm=[...t.matchAll(new RegExp(RENUM.source,RENUM.flags.replace('g','')+'g'))].find(m=>!/\\b(?:not|no|never|nor|without)\\b[^.\\n]{0,40}$/i.test(t.slice(Math.max(0,m.index-60),m.index)))||null; /* s429 F3: \"I do not add links or renumber\" keeps the numbering */"
for nm in ['Build Synthesis','Build Independent Verdict','Build Save Body','Panel Build','Format Markdown','D4 Build','D4 Extract','C4 Build','C4 Extract']:
    rep(nm,A3,B3)
# F9 (C10, G1 3) and the prompt half of C9 (A3 6, C 8; S-G and S-H fired in 32677): the Oracle's strategy carries DG-18's own sentence on Luke 1:35,
# whole quotations of Psalm 2:7 and Matthew 1:20, the 1611 margin with every row, and a person named as the verse names them.
A9=" ANSWER A PRESS WITH THE FIT (ruling 421): answer a press with the fit your rows show, never with an absence; the absence form is barred to both sides.\";"
B9=(" ANSWER A PRESS WITH THE FIT (ruling 421): answer a press with the fit your rows show, never with an absence; the absence form is barred to both sides. Write \\\"It fits the link\\\" only after the words that show the fit."
 " ANSWER LUKE 1:35 AT THE WORD (DG-18): when your opponent reads the \\\"therefore\\\" (dio kai) of Luke 1:35 as a begetting by the Holy Ghost, answer at that word: \\\"The dio kai ('therefore') in v.35 connects back to v.32, not forward to biological divine paternity\\\"; the title and \\\"the throne of his father David\\\" are given in Luke 1:32, before Mary asks \\\"How shall this be\\\" in Luke 1:34."
 " QUOTE THE ROWS WHOLE (DG-18, DG-8, KB-0025): never quote Psalm 2:7 (\\\"this day have I begotten thee\\\") without its three New Testament occasions, Acts 13:33, Hebrews 5:5 and Hebrews 1:5; quote Matthew 1:20's \\\"that which is conceived in her is of the Holy Ghost\\\" only with \\\"Joseph, thou son of David\\\" in the same quotation; carry the 1611 margin of every row you quote that has one (Hebrews 2:16 travels with its margin \\\"Gr. taketh not hold of angels, but of the seed of Abraham he taketh hold\\\"); and name a person as the verse names them (Isaiah 8:3 names \\\"the prophetess\\\").\";")
rep('Init with Guards',A9,B9)
# F6 (C2; A3 3, C 1; ruling 428 step 3 on the judge side): a K-W answer names the fact the withdrawn sentence carried; STANDS WITHOUT IT only when the
# quoted layer carries that same fact while the side still claims it; otherwise CONCEDED. The code's form check is unchanged (it still reads
# "STANDS WITHOUT IT because" with an [L1]-[L3] tag, or CONCEDED).
CURE14=['Cure Build','Cure Normalize','Cure Check','Panel Cure Build 1','Panel Cure Normalize 1','Panel Cure Build 2','Panel Cure Normalize 2','Panel Cure Build 3','Panel Cure Normalize 3','Panel Cure Check','Alternate Build','Alternate Cure Build','Alternate Cure Normalize','Alternate Merge']
A6="answer in the RESPONSE line with STANDS WITHOUT IT because <the layer, [L1], [L2] or [L3], quoted, on which the link stands without what was withdrawn>, or with CONCEDED."
B6="first name the fact the withdrawn sentence carried for the link (a descent, a source, a time, a person); if the side still claims that fact anywhere in the link, answer STANDS WITHOUT IT because <that fact> is carried by <the layer, [L1], [L2] or [L3], quoted, that carries that same fact in its own words>; if no layer the side gives carries it, or the side no longer claims it and the link needed it, answer CONCEDED (ruling 428; run 32677: Galatians 4:4 'made of a woman' does not carry 'the seed of David according to the flesh')."
for nm in CURE14: rep(nm,A6,B6)
# F7 (C3; A3 4): an absence answer with no fit of its own MISSES (ruling 421: the absence form is barred to both sides).
A7="MEETS: the answer\\'s layers carry a meaning the link can agree with."
B7="MEETS: the answer\\'s layers carry a meaning the link can agree with. An answer whose operative words are an absence (the verse, or the other side, names no, states no, does not name, gives no, or is silent on a thing) and that shows no fit of its own MISSES: the absence form is barred to both sides (ruling 421)."
for nm in ['Panel Build','Build Independent Verdict']: rep(nm,A7,B7)
# F8 (C6; C 4): a K-C cure that strikes the only ground of the RESULT's winner re-decides it.
A8="that is never a ground, for the rows are weighed together, line upon line. \""
B8="that is never a ground, for the rows are weighed together, line upon line. If the ground you drop was the only ground your RESULT gave for its winner, your cure also writes a CORRECTED RESULT that names a new ground from the exhibited chains, or reads UNDERDETERMINED (run 32677: a restated RESULT kept its winner with no ground). \""
for nm in CURE14: rep(nm,A8,B8)
# F4 (C7; G1 5, A3 7.3, C 2): an [L2] tag on a PRESSED WITH line ("<verse> ... -- MEANS: ... -- [L2] ...") is read against that line's own verses
# (the pressed verse and the [L3] it names), not every verse of its premise item (run 32677: "[L2] bethulah" on Matthew 1:23 and Isaiah 7:11
# counted because Genesis 24:16 stood in another press line of the same item).
A4="const blk=blockAt(t,i);const own=refsIn(seg);const vs=[...new Set(own.concat(refsIn(blk)))];"
B4="const blk=blockAt(t,i);const own=refsIn(seg);const __ls=t.lastIndexOf('\\n',i)+1,__le=(x=>x<0?t.length:x)(t.indexOf('\\n',i));const __line=t.slice(__ls,__le);const __press=/--\\s*MEANS\\s*:/.test(t.slice(__ls,i)); /* s429 F4: a press line's [L2] is read against that line's verses */const vs=[...new Set(own.concat(__press?refsIn(__line):refsIn(blk)))];"
for nm in ['Alternate Build', 'Alternate Cure Build', 'Alternate Cure Normalize', 'Alternate Merge', 'Alternate Payloads', 'C1 Extract', 'C2 Build', 'C2 Extract', 'C2 Lexicon Plan', 'C3 Build', 'C3 Extract', 'C3 Lexicon Plan', 'C4 Build', 'C4 Lexicon Plan', 'Citation Scan', 'Cure Build', 'Cure Check', 'Cure Normalize', 'D2 Build', 'D2 Extract', 'D2 Lexicon Plan', 'D3 Build', 'D3 Extract', 'D3 Lexicon Plan', 'D4 Build', 'D4 Extract', 'D4 Lexicon Plan', 'Extract Independent Verdict', 'L2 Count Plan', 'L2 Lexicon Plan', 'Panel Cure Build 1', 'Panel Cure Build 2', 'Panel Cure Build 3', 'Panel Cure Check', 'Panel Cure Normalize 1', 'Panel Cure Normalize 2', 'Panel Cure Normalize 3', 'Panel Payloads', 'Quote Report']: rep(nm,A4,B4)
# F1 (C5; G1 4, C 3): the panel tag stays HELD (the tag vocabulary is HELD, PARTIAL, BROKEN by the replay table's CHECK and the outcome function);
# the document already prints the outcome line when the panel verdict and the outcome differ; each judge whose RESULT the tie rule recomputed gets
# a line above its reasoning saying the paragraph predates the recompute.
A1F="'## Panel judge ' + e.n + e.tag + ': ' + nm(j.judge_seat) + ' (' + (j.judge_api_model || '') + '): ' + (j.verdict_tag || '?') + VSIDE + '\\n\\n' + panelText(j.verdict_raw, j)"
B1F="'## Panel judge ' + e.n + e.tag + ': ' + nm(j.judge_seat) + ' (' + (j.judge_api_model || '') + '): ' + (j.verdict_tag || '?') + VSIDE + '\\n\\n' + (/TIE \\(KB-0030\\)/.test(String(j.verdict_raw || '')) ? '*The tie rule recomputed this judge\\'s RESULT to UNDERDETERMINED after its cure (KB-0030: a tie is not a HELD). Its reasoning paragraph was written before that and is superseded where it argues for one side.*\\n\\n' : '') + panelText(j.verdict_raw, j)"
rep('Format Markdown',A1F,B1F)
# F12 (C1): the anti-cheat marks reach the judges (quotes verified in the side's own rounds); the Mary reversal of 32677 passed (32713, 32715).
rep('Anticheat Record',"const SHOW=false;","const SHOW=true; /* s429 F12 (ruling 429): marks shown; the 32677 Mary reversal passed (acx_only 32713, 32715); the 32643 Deuteronomy 22:24 case stays open */")
# F11 (ruling 428 steps 4-5): E-COL and E-SYN in the Judge Enforcer; the recorder reads their RIGHT words.
F11=open(f'{R}/f11_items.js').read()
rep('Judge Enforcer Build',"if(!items.length)return skip('no ANSWER CHECK line and no VOID ruling was read');",F11+"if(!items.length)return skip('no ANSWER CHECK line, VOID ruling, collision line or synthesis claim was read');")
rep('Judge Enforcer Build',"+'Reply with exactly one line per judge id, and nothing else, in this form:\\nENFORCER: <judge id> -- AGREE | DISAGREE | NO ANSWER -- RIGHT: MEETS | MISSES | VOID | NOT VOID -- <one sentence that quotes the words that decide it>';",
 "+'RULE E-COL (a collision line: FORCED, or LINK BROKEN). A link is broken only when the answer\\'s own quoted words cannot agree with the meaning pressed, as the line quotes them; it is not broken because no verse states it, or because of an absence. AGREE when the quoted words show the answer cannot agree with the meaning; DISAGREE when they do carry a meaning the link can agree with, or the line rests on an absence or on a demand for a stating verse.\\n'\n +'RULE E-SYN (a sentence of the synthesis saying a side withdrew, conceded, granted, dropped or narrowed something). AGREE when that side\\'s own sentences given you give up that same thing at the same scope; DISAGREE when they do not, or give up less (for example, \\\"no row I cite\\\" is not \\\"no biblical text\\\").\\n'\n +'Reply with exactly one line per judge id, and nothing else, in this form:\\nENFORCER: <judge id> -- AGREE | DISAGREE | NO ANSWER -- RIGHT: MEETS | MISSES | VOID | NOT VOID | BROKEN | STANDS | TRUE | OVERSTATED -- <one sentence that quotes the words that decide it>';")
rep('Judge Enforcer Record',"([BV]\\d+\\.\\d+)","([BVKY]\\d+\\.\\d+)")
rep('Judge Enforcer Record',"(?:RIGHT\\s*:\\s*(MEETS|MISSES|NOT VOID|VOID)","(?:RIGHT\\s*:\\s*(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|TRUE|OVERSTATED)")
rep('Judge Enforcer Record',"const tally={'E-ANS':{AGREE:0,DISAGREE:0,'NO ANSWER':0,'NO VERDICT':0},'E-VOID':{AGREE:0,DISAGREE:0,'NO ANSWER':0,'NO VERDICT':0}};",
 "const tally={};for(const k of ['E-ANS','E-VOID','E-COL','E-SYN'])tally[k]={AGREE:0,DISAGREE:0,'NO ANSWER':0,'NO VERDICT':0};")
rep('Judge Enforcer Record',"rows.push({run_token:b.run_token,seat:x.seat,seat_role:'panel',","rows.push({run_token:b.run_token,seat:x.seat,seat_role:x.rule==='E-SYN'?'synthesis':'panel',")
# F13 (run 32717; my repair): the alternate and reserve builders read the removed seat's system message as a string, but google/ and qwen/ seats
# carry it as [{type:'text',text,cache_control}] (__orc), so Gemini could never be replaced: "the removed seat's rulebook and transcript could not be
# read". The text parts are joined back into the one string they were cut from.
A13="else{SYS=b0.messages[0].content;user=b0.messages[b0.messages.length-1].content;}"
B13="else{const __tx=c=>Array.isArray(c)?c.map(p=>p&&typeof p.text==='string'?p.text:'').join(''):c;SYS=__tx(b0.messages[0].content);user=__tx(b0.messages[b0.messages.length-1].content);} /* s429 F13 (run 32717): a cached system message is a list of text parts */"
for nm in ['Alternate Build','Reserve Build']: rep(nm,A13,B13)
# F14 (run 32717): the enforcer read the E-VOID rule's "a clause describing what the premise props" as covering the premise's own head ("The inference
# that loins run only through fathers") and ruled both ChatGPT VOIDs NOT VOID; the head is the charge.
rep('Judge Enforcer Build',"Read only the words the charge says the quote states; a clause describing what the premise props, or the objection it serves, is not part of the charge.",
 "The charge is the premise\\'s own words before its quote (for example \"The inference that ...\"), read against the words of that quote. Set aside only a clause saying what the premise props (\"which props ...\") or a sentence naming the objection it serves (\"The objection it props is ...\"); those are not part of the charge.")
if __name__=='__main__':
    for nm,c in OUT.items():open(f'{R}/new/{nm}.js','w').write(c)
    print('built',sorted(OUT))
