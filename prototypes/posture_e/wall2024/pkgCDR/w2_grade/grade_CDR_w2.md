# W2 grade of pkgCDR rev 1 (W1, commit 4c4ebc2a)

Verdict: FAIL on one false-listing class (a refused drop read as a drop). Everything else checked holds. Small fix below.

## Claims checked
- Rebuild on fetchback_live_s102.json byte-equal to parent_s102_CDR.json; three nodes change (Close Enforcer Build, Close Enforcer Record, Judge Contradiction Build).
- 34108 (W1's run_cases rerun, w1_run_cases_rerun.txt): P2 = [CR3] "I drop the wording "no biological father" as a bare statement." against [CR4] "Christ had no biological father." (the D6 drop and reclaim). P1 = the [CR4] sentence "... with no biological father needed to complete it.".
- 34299 post-panel: J2 = the "ordinary means" pair ([CR3] Genesis 4:1 grant against [CR4] "Genesis 4:1 therefore cannot supply the sequence ..."), by the CLOSE-ROUND REVERSAL CHECK; J1 = Luke 1:34 pair listed once, "also named by the ANTI-CHEAT CHECK". No other new candidate. W1's run 11 OK, 1 MISS (C9, W1's stated label error).
- Corpus rerun (corpus_rerun.txt): 39 debates, 2 listings, both on 34108.
- Rolled-back insert (rollback_w2.sql, W1's 5 rows with tag W2-ROLLBACK-TEST-CDR): 5 inserted, RAISE rolled back, 0 remain. 20:45 CST 11-09.

## My cases (cases.json W1-W13 committed before any run, commit 1384cc1c; W14-W16 added after the first run to size the W3 class; run.cjs -> run.txt)
16 cases, 12 as labeled.
- Listed and right: drop in [CR2] restated inside a longer close (W1); challenger "I retract the claim that ..." (W2); upper-case restatement (W11); "I abandon the reading that ..." (W12).
- Not listed and right: "I will not withdraw" (W4), "I do not drop" (W13), a reported request "The challenger asks me to drop ..." (W5), the other side saying it (W6), a close that grants it (W7), restated in round 3 not the close (W8), 2-word span (W9), close that quotes it and repeats the drop (W10).
- MISS, false listing (4): a refused drop is read as a drop.
  - W3 "I drop nothing: the wording "the register stops at Joseph" stands." then [CR4] "The register stops at Joseph." -> listed.
  - W14 "I withdraw none of the wording ...", W15 "I give up no part of the claim that ...", W16 "I retract nothing; ... stands as written." -> each listed.
  The side kept the wording, so restating it is no contradiction. The form is real: stored debates hold "I withdraw nothing further." (grep of inputs/*_Final_Output.json).
  Cause: `cdrDrop=/\bI\s+(?:now\s+|also\s+|therefore\s+)?(?:drop|withdraw|retract|give\s+up|abandon)\b/i` matches the verb with no check of what follows.
  Proposed fix: add a negative look-ahead after the verb: `(?!\s+(?:nothing|none|no\b|neither|not\b))`.
  Cost of the fault: a listing alone breaks nothing (DeepSeek answers it), but it puts a false contradiction candidate in front of the enforcer whose CONFIRMED breaks a link.

# Regrade: pkgCDR rev 2 (W1, commit 20ab4133): PASS, not for write until the operator answers
- Rebuild on fetchback_live_s103.json byte-equal to parent_s103_CDR.json; three nodes as in rev 1.
- cdrDrop now carries (?!\s+(?:nothing|none|no\b|neither|not\b)) after the verb.
- My cases on rev 2 (run_rev2.txt): 19 of 20. W3, W14, W15, W16 (refused drops) now not listed. W17-W20 added before the run (commit 8117a217):
  - W18 "I withdraw nothing further; I drop the wording ..." listed (second verb read). W19 "I withdraw now the wording ..." listed. W20 "... nothing else." listed.
  - MISS W17 "I drop not only the bare statement but the wording "..."" is not listed. Safe direction (a real drop missed, nothing falsely listed); the cost of the look-ahead I proposed. DeepSeek still reads the rounds.
- W1's cases rerun on rev 2 (w1_run_cases_rev2.txt): 14 OK, 1 MISS (C9, W1's stated label error). 34108 P1, P2 and 34299 J1, J2 as in rev 1.
- Corpus rerun (corpus_rev2.txt): 39 debates, 2 listings, both on 34108.
- Log rows unchanged from rev 1; my rev 1 rolled-back insert (5 rows, 0 remain) covers the shape.

## Correction to my rev 2 PASS (W3 FAIL 3981 stands)
My rev 2 PASS was wrong. My cases planted only the "verb then nothing/none" class and did not plant other sentences that name a drop verb without dropping the wording. Rev 2 against my extended cases (W21-W33, labeled before any rev 3 run, commit 69212f72; run_rev2_33.txt): 24 of 33; 8 false listings (W21-W27, W33) plus the W17 safe-direction miss.

# Grade: pkgCDR rev 3 (W1, commit 218d7a94): FAIL on tails after the wording (agrees with W3 3987)
- Rebuild on s103 byte-equal; three nodes as before.
- My 40 cases (W34-W40 labeled before the run, commit 2ba3b373; run_rev3.txt): 35 of 40.
  - All 8 rev 2 false listings (W21-W27, W33) gone; my own non-drops (W28-W30) not listed; true drops after a label (W31) and a list mark (W32) listed; true drops with a tail after the wording ("for now", ", as the challenger asked.", "because ...") listed.
  - MISS, false listing (4): W34 "I withdraw the wording "..." if the challenger shows a row against it; he has shown none." / W35 "I drop the wording "..."? No." / W36 "... unless the rows bear it, and they do." / W37 "..., provided the challenger proves the gap; he has not."
  - MISS W17 (safe direction), as in rev 2.
- W1's cases rerun: 22 OK, 1 MISS (C9, W1's label error). 34108 P2 = the D6 pair; 34299 J2 = "ordinary means".
- Corpus: 39 debates, 2 listings, both on 34108.
- Fix: a drop sentence that ends in "?" or holds if / unless / provided (that) after the drop verb is not a drop. "because" / "as" / time words stay a drop (W38-W40 must stay listed).
- Owed before any write (not a code fault, W3's point): DeepSeek has not answered a prompt with P and J candidates listed.

# Regrade: pkgCDR rev 4 (W1, commit 97a9a504): FAIL on three more conditional forms
- Rebuild on s103 byte-equal. W1's cases: 32 OK, 1 MISS (C9). 34108 P2 = D6 pair; 34299 J2 = "ordinary means". Corpus: 39 debates, 2 listings, both on 34108.
- My 48 cases (W41-W48 labeled before the run, commit 79cb4765; run_rev4.txt): 42 of 48.
  - Fixed since rev 3: W34 (if), W35 (? No.), W36 (unless), W37 (provided), and the new W43 ("Do I drop ...? No."), W44 ("...? Never.").
  - False listings (3), same conditional family: W41 "... in case the rows fail; they do not." / W42 "... on condition that the challenger shows the gap; he has not." / W45 "... should the rows fail, and they stand."
  - Safe misses (3): W17; W46 "I drop the wording "..."; if the challenger objects, so be it." and W47 "..., even if it costs LINK 6." (true drops not listed: the conditional test reaches past the drop clause and "even if"). Cost only, not a fault.
- Fix: add "in case", "on condition (that)", "should <subject>", "supposing", "assuming" to the conditional words; read them only in the clause that holds the drop (up to ";"), and do not count "even if".

# Grade: pkgCDR rev 5 (W1, commit 8e7c85fd): PASS for the listing code. Not for write until the operator answers ASK 1.
- Rebuild on s103 byte-equal. W1's cases: 78 OK, 1 MISS (C9, W1's label error). 34108 P2 = D6 pair; 34299 J2 = "ordinary means". Corpus: 39 debates, 2 listings, both on 34108.
- My 60 cases (W49-W60 new, labeled before the run, commit b31b74ca; run_rev5.txt): 58 of 60.
  - Rev 4's three false listings (in case, on condition that, should) gone; rev 4's safe misses W46 ("; if ... so be it") and W47 ("even if") now listed.
  - New condition forms not listed, as labeled: supposing, assuming, in the event that, so long as, only when, but only if, inverted "were ... to".
  - New true drops listed: "whether or not", "even though", "as though", condition in the next clause.
  - Safe misses (2): W17 ("drop not only ... but"), W56 ", if only to narrow LINK 6." (idiom read as a condition). Nothing falsely listed.
- Owed before any write (not a code fault): DeepSeek has not answered a prompt with P and J candidates listed.

## Correction to my rev 5 PASS (W3 FAIL 4003 stands)
I called a missed true drop "safe direction". It is not: this package exists to feed a drop and reclaim to the enforcer, so a missed true drop is the fault it was built to remove. My rev 5 grade also did not plant arguendo drops or true drops that hold condition words.

# Grade: pkgCDR rev 6 (W1, commit 9722fe97): FAIL, true drops missed on the connector and time words
- Rebuild on s103 byte-equal. Corpus: 39 debates, 2 listings, both on 34108.
- My 73 cases (W61-W73 new, labeled before the run, commit 074c2dd0; run_rev6.txt): 68 of 73.
  - Right: condition before the drop (W67), arguendo before the drop (W69) and between verb and wording (W68), "if need be" (W73) not listed; true drops with "now that", ", but only the wording", condition after ";", "provisionally, pending", dash then "if" listed; W56 ", if only" now listed.
  - TRUE DROPS NOT LISTED (5): W17 "drop not only ... but"; W62 ", and if the challenger objects, I answer in round 4." (", and" starts a new clause); W64 "... when I narrow LINK 6 in this round." (present act); W65 "... once and for all."; W72 ", the day it was challenged." (past).
- Fix proposed: (1) drop "and" from the optional connectors before a condition word (", and if" opens a new clause; keep "but" / "only" / "except"); (2) "once and for all" is not "once"; (3) "when" / "once" / "the day" count only when what follows is not the speaker's own act ("when I ...") and not past ("was", "were", "had").
- Still owed before any write: the DeepSeek replay (which direction costs more depends on how the enforcer answers a listed conditional drop).

## rev 7 (commit 8f8ed0b3), graded on the rev 7 standard: no true drop hidden

Rebuild on fetchback_live_s103.json is byte-equal to pkgCDR/parent_s103_CDR.json.
Cases W74-W87 and the want7 column were committed at c1640c92 before the run.
`STD7=1 ... node pkgCDR/w2_grade/run.cjs` -> run_rev7.txt: 75 of 87 as labeled.

FAIL. Twelve true drops are not listed (every one is restated verbatim in the closing round):

| case | round 3 sentence |
|---|---|
| W17 | I drop not only the bare statement but the wording "the register stops at Joseph". |
| W74 | Accordingly I withdraw the wording "...". |
| W75 | On Luke 3:23, I drop the wording "...". |
| W76 | Therefore, I drop the wording "...". |
| W77 | In this round I drop the wording "...". |
| W78 | So I retract the claim that the register stops at Joseph. |
| W81 | The wording "..." is withdrawn. (passive) |
| W82 | I no longer hold that the register stops at Joseph. |
| W83 | I set aside the wording "...". |
| W84 | I give the wording "..." up. |
| W85 | We drop the wording "...". |
| W86 | To narrow LINK 6, I drop the wording "...". |

Listed as wanted: hereby (W79), now (W80), conditionals and argument's-sake drops (ANY), the question form W87 (not listed).
No false listing outside the ANY cases. Corpus (39 debates, 2 listings) and W1's run_cases.txt (41 OK, 38 MISS
on the rev 6 labels) reproduce W1's committed outputs exactly.

Classes for rev 8: (1) any lead-in before the subject (adverb, "On <ref>,", "In this round", "To <verb> ...,"),
(2) "We" as subject, (3) passive "is withdrawn/dropped", (4) verbs outside the list: set aside, give ... up,
no longer hold, (5) "not only ... but" before the object (W17).

## rev 8 (commit fe6862c8), standard: no true drop hidden

Rebuild on fetchback_live_s103.json byte-equal to parent_s103_CDR.json. New cases W88-W114 committed before the run (d290d64c).
`STD7=1 ... run.cjs` -> run_rev8.txt: 90 of 114 as labeled. W1-W87 all pass except three false listings (below).

FAIL. 21 true drops of the side, each restated in the closing round, are not listed.

Opponent rules hide the side's own drop (8):
- W88 "Since the challenger asks for it, I drop the wording ..."
- W89 "As the challenger argued, I withdraw the wording ..."
- W90 "I accept the challenger's row and withdraw the wording ..." (nearest-subject rule: "challenger's" after "I")
- W91 "The challenger pressed row 4, so I withdraw the wording ..."
- W111 the same as W88 on the challenger side ("Since the defender asks for it, ...")
- W93 "The defender drops the wording ..." (the defender speaking of itself) and W112 (challenger side, the same)
- W92 ("Because he showed the gap, I abandon ...") is listed.
Strike rule (2): W94 "The wording ... is struck from my case.", W95 "Strike the wording ... from my case."
Negation after the verb (1): W96 "I drop not the bare statement only but the wording ...".
Verbs outside the list (5): waive (W97), rescind (W98), discard (W99), concede away (W100), back away from (W101).
Wording not taken (5): single quotes straight (W102) and curly (W103); "my claim the register ..." with no "that" (W104);
wording after a colon (W105 "the following wording: ...", W106 "I drop it: ...").
Closing filter (1): W114, the closing sentence "I grant nothing: the register stops at Joseph." is skipped because it holds
"grant" (cdrSelf filter on closing sentences, unchanged since rev 1).

Listed as wanted: W92, W107 (fronted that-clause). Controls not listed, as wanted: W108, W109, W110, W113 (opponent's drop,
demand or strike).
False listings (cost of the broad reading, not counted toward FAIL under this standard): W24 (drop of another limb, quoted
wording "stands"), W25 ("I withdraw my objection to the reading that ..."), W33 (drop one quote, "keep" the other).

## rev 9 (commit 976d36a3), standard: no true drop hidden

Cases W115-W151 committed before the run (b1d284dc). Harness pkgCDR/w2_grade/run9_w2.cjs: a case reaches the enforcer when a P candidate of the
case's side holds the dropped wording. Output run_rev9.txt: 115 OK, 36 MISS of 151. W2 and W12 are my harness's artifacts (their wording
differs from "the register stops at Joseph"; both sentences do reach as P8), so 117 of 151.

FAIL. 34 true drops do not reach the enforcer:
- 31 verbs outside the family (W115-W144, W148 challenger mirror): yield, cede, jettison, scrap, repudiate, disclaim, remove, delete, cut,
  leave behind, let fall, part with, stop claiming, cease to maintain, am done with, is gone from my case, concede ... to the challenger, shelve,
  omit, set to one side, do not stand by ... any more, release, lay down, back off, excise, retire, unsay, recede from, step back from,
  take ... off the table.
- 2 split forms: "I drop it." with the wording in the next sentence (W145); "I drop the following wording:" with the wording on a bullet line
  (W146). The verb sentence reaches but without the wording, so the enforcer cannot name what is given up. W147 (one sentence, colon) reaches.
- 1 cap (W150): after 30 other drop-family sentences of the side, the true drop is cut by CDR_MAX=30. A side can push a drop out of reach by
  padding its earlier rounds.

Speaker attribution: correct. A challenger drop is listed as CHALLENGER only (W151, W149); W148's miss is the verb, not attribution.
Prompt text: the added sentence renders exactly as written in build_CDR.cjs, CLOSING [<round 4>] "" with real quotation marks; candidates show
CLOSING [CR4] (not named). Note: "Name what it gives up" has no slot in the reply line format; the model can only put it in the closing
"one sentence" field, or break "nothing else" by adding a line.
A verb list cannot be complete. If the family stays a list, the cap should go and split forms should carry the next sentence.

## rev 10 (commit 709bf7b1), graded on attribution, prompt text, Record, prompt size, no text removed (coordinator 05:02Z)

PASS on all five checks.
- Rebuild on s103 byte-equal to parent_s103_CDR.json.
- No text removed: on 34108 the rev 10 prompt equals the live prompt except the block from "Reply with one line ..." to the end of the
  candidate list: live's 496 characters ("... ALREADY NAMED (answer each one by its id):\nnone") are replaced by the passage, the same reply format and
  the hint lines; every other character (155,042 of 155,538) is the same and in the same place. With 300 padding drop sentences added to [CR3]
  the same holds (166,333 of 166,829 unchanged); every round stays word for word.
- Prompt text: the passage renders exactly as written in build_CDR.cjs, with CLOSING [<round 4>] "" in real quotation marks, and hints read
  CLOSING [CR4] (not named). Note: the existing rule "It is NOT a contradiction when the closing sentence ... differs only in wording" stands
  next to "gave up in any other words"; the sentence before it says that asserting a dropped thing again IS a contradiction, so I read no
  conflict, but a model could.
- Attribution (run_rev10.txt, my 151): a challenger drop hints only as CHALLENGER (W148, W149, W151); defender drops only as DEFENDER.
  Hint coverage 146 of 151 (W2 and W12 are my harness's wording artifacts); not hinted: W131 (concede ... to the challenger, left out by
  design), W145 and W146 (split forms). All three are in the rounds the enforcer reads, word for word.
- Record (record10_w2.cjs, labels fixed before the run, record10_w2.txt): 5 OK. A NEW CONFIRMED line for the bullet-line drop breaks the link;
  a NEW line quoting the split "I drop it." is read; a forged closing quote is NOT CONFIRMED; a CONFIRMED line naming the wrong side breaks
  nothing for that side. W1's record_CDR.cjs reproduces 5 OK.
- Prompt size: size_CDR.cjs reproduces size_CDR.txt exactly (35 debates, +1,319 to +9,502 characters, median 4,712, mean 4,573, +3.2%). With no
  cap, a side can pad: 300 drop sentences in [CR3] made 34108's prompt 259,907 characters against 166,829 live for the same rounds (+56%). The
  padding itself is in the rounds, so the growth is about double the padding; noted as a cost, not a fault.

## rev 11 (commit acff76f2): PASS on the three changes

Rebuild on s103 byte-equal. New checks record11_w2.cjs (Y0-Y13, labels committed before the run, record11_w2.txt): 14 OK, 0 FAIL.
- LINK ? in Record: a numbered hint answered NOT A CONTRADICTION with LINK ? is read (Y1); CONFIRMED with LINK ? on a numbered hint, a ? hint
  or a NEW line is NOT CONFIRMED and breaks nothing (Y2, Y5, W1's R6); "LINK?" and "LINK  ?  " are read (Y3, Y4); D6 CONFIRMED with LINK 6
  still breaks D6 beside a LINK ? row (Y6); log rows keep the shape (Y7). The regex change is in Close Enforcer Record only. W1's record_CDR 7 OK.
- Cap: with 300 padding drop sentences in [CR3], 30 defender hints (Y8); the padding and a true drop past the cap stand word for word in the
  prompt (Y9); growth over live 10,911 characters (Y10, against +93,078 on rev 10); only the candidate block differs from live (Y11).
- Prompt: the three new sentences are present word for word (Y12), and the "differs only in wording" rule they refer to stands above (Y13).
- Hints on my 151 (run_rev11.txt): as rev 10, plus W150 now past the cap (in the rounds in full).
Risk for the operator (not a fault of this revision): a CONFIRMED answer needs a declared link, and 124 of 366 stored hints print LINK ?. A true
contradiction the enforcer cannot tie to a link is thrown away on form; nothing records it for review.
