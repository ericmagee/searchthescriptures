# ASK 533 plan (W1, seat 34), rev 1a, 2026-11-23. A PLAN ONLY; nothing is written.
Rev 1 replaces rev 0 (69d82656) on W2's FAIL at Wall 10755: (1) W2 rules the item exempt from the silence count, so it is added to line 518 enfSilent; (2) ren does not reach l2Data(), because Quote Report builds l2_data as {ow, lex, read} only, so the read path is named and checked; (3) line 934 cureOwn strips a label only of the form K-<letters><digits>, so "K-L2G " (rev 0's label) is not stripped; the label is now K-GLS, which that pattern strips. MY MISTAKES: I did not trace how ren reaches the Library, and I did not read cureOwn.
Rev 1a (W3 build grade C1 at Wall 10778; ruled at Wall 10779): (1) Library index 1311 joins the scope. __mlsT also counts a K-GLS item whose link equals the retracted link, and K-GLS joins the silent set in its second clause. A RETRACTED that answers only K-GLS items is recorded, not applied, as pkgMLS does for K-ML, K-SU and K-RUD. A RETRACTED on a link that any other rule also names is applied as today. The K-GLS cure reads a recorded retraction as CURED. Test cases: (a) only a K-GLS item names the link, so the retraction is recorded and the counts are unchanged; (b) K-GLS and K-L2 items name the same link, so the retraction is applied as today. (2) WRONG-IF 1 reads "content word" for "part".
Source: proposal W1 Wall 10589 item 1 and addendum 10596 item 2(a); review W2 10593 item 2 (record-only, name the branch that keeps the item out of the K-L2 void) and W3 10590; W3 10719 (the Oracle's own CR4 wrote "[L2] synerchomai to come together, to cohabit"). Coordinator order: "Proceed with 533, then 542." Rulings: 383 (only the Oracle is bound by guards; nothing here enters a judge prompt), 428 (record-only until it passes a known case), 497 (no single verse doctrine), the 1611 KJV is its own authority, the 11-19 18:28 CST scope rule.

## 1. OBJECTIVE
A judge's [L2] gloss on a COLLISION POINTS line is held to the KJV's own renderings of that Strong's number. When a gloss part holds no KJV rendering of its number (for example "to cohabit conjugally" for G4905), the engine sends the judge one TRIAL item that quotes the part and lists the number's KJV renderings, and asks the judge to restate the line on those renderings or retract it. The item voids nothing and sets no count.

Expected effect, stated before the build: in run 41418, sol 6.2 (judgment 1263) and qwen 4 max (judgment 1265) each get a K-GLS item on their D5 vs C2 line, for G4905 "including conjugal cohabitation" and "to cohabit conjugally". KJV renders G4905: accompanied, assembled, came, come, companied, resort, resorted, together, went, with (kjv_word_map, 32 rows). "Cohabit" and "conjugal" are not among them. The judge keeps its decision (ruling 428); the engine only puts the KJV renderings in front of it.

## 2. ROLES
Planner W1. Builder W4. Grader W2 (one non-builder grader). Write card: W4's thread.

## 3. SCOPE
SEARCH (W1, 11-23, live engine daf5da98, fetch ask536/w4/build/live536_engine.json md5 3a001d95, through ask516/w4/b/lib.py; child live536_child.json; and SQL):
- Library 484 to 489 (kl2Lines, K-L2): reads only "D<n> vs C<n>" lines that hold [L2], and tests only that the [L2] word stands in a verse the line cites. The gloss is never read.
- Library 237 (l2Data): reads Quote Report's l2_data, which Quote Report builds as {ow: P.ow, lex: P.lex, read: P.read} from L2 Count Plan. It holds no KJV rendering, and a new field on L2 Count Plan does not pass through it (W2 10755 item 2).
- Library 184 (L2C.check): reads $('L2 Count Plan').first().json.e340 directly, guarded by isExecuted. This is the read path kl2gLines uses for ren (W2 10755 item 2(c), the second option; Quote Report is not changed). kl2gLines runs where kl2Lines runs: the MAP packages that hold line 2178 are Panel Payloads, Extract Independent Verdict, Alternate Payloads and R2 Alternate Payloads; the cure branch beside 1209 runs in the ten packages that hold 1209 (Cure Check, Cure Normalize, Panel Cure Check, Panel Cure Normalize 1 to 3, Alternate Cure Normalize, Alternate Merge Seat, R2 Alternate Cure Normalize, R2 Alternate Merge Seat). In the child, L2 Count Plan is a node of its own that returns the engine's L2 Count Plan items whole (Alternate Pass In ... .h["L2 Count Plan"].items), so the same read resolves there.
- Line 518 (enfSilent): K-ML, K-SU and K-RUD are listed there, so their silence does not count (pkgMLS, ASK 351).
- Line 934 (cureOwn): strips a label with /^K-[A-Z]+\d*\s+/i. "K-L2 " matches; "K-L2G " would not (after "L2" a space is required). "K-GLS " matches.
- L2 Count Plan, ASK 340 PART B (e340): for every gloss in the DEBATERS' rounds, it reads kjv_word_map for the number ("ren" pages, with ASK 382 paging), builds REN[num] = {W words, PH phrases, CT counts}, and gives each gloss part FOUND, LEXICON WORDING or NOT IN THE KJV RENDERINGS (forms() for inflection; FW stop list; parts split at commas). It is record-only (AUDIT v57). REN is not exported.
- 41418 AUDIT v57 (review_notes): "49 gloss parts checked ... 1 not found (G1982) ... 23 LEXICON WORDING". The per-part list is not stored. That CR4's "to cohabit" (G4905) is among the 23 LEXICON WORDING is an inference from the code (no G4905 rendering holds "cohabit"; the anchor_gloss does), not a stored row.
- Child: its L2 Count Plan and Quote Report nodes pass through the engine's output (Alternate Pass In ... .h["L2 Count Plan"]). So a field added to L2 Count Plan's output reaches the child's Library unchanged.
- Every reader of the rule label 'K-L2' in the Library: 488 and 489 (raise, AUDIT v28 "a NOT COUNTED [L2] voids that ground"), 490 (cure text), 515 (ENF_STATUS 'K-L2':'TRIAL'), 850 (cureLabel), 1053 (cure keys), 1209 to 1213 (cure), 2178 (caller), 3315 (flagged item line). Each is an exact-equality test (x.rule==='K-L2'); none is a prefix test. Outside the Library, 'K-L2' stands only in the judge prompt sentence in Panel Build and Build Independent Verdict ("... or it voids that ground (K-L2, a TRIAL check)"), in Build Save Body and Format Markdown.
- Line 520 (enfTrialWhy): a TRIAL item with no written response counts in drv_uncured like a LIVE item (silence count), unless line 518 lists its rule.
- SQL (ask533/w1/measure533.sql, output out_measure533.txt), every judgment in debate_judgments:
  - Collision lines with an [L2] "(G/Hnnnn, gloss)": 139 glosses; 70 have a part with no KJV rendering, in 39 judgments of 35 runs.
  - Recent (judgment id 1200 and up): 38 such glosses, in 14 of the 17 runs that hold one. About 2.7 per run.
  - By number: G1080 27 ("to procreate", "to beget"), G4905 14 ("cohabit conjugally"), G3543 10 ("to deem"), G1982 4, G4690 3 ("offspring"), G3933 2 ("a maiden"), and 11 others once each.
  - Coverage proxy: 67 of 70 failing glosses carry a number the debaters cite in the same run. Since REN is read only for the debaters' gloss numbers, this is an upper bound on what the export can check. W4's replay gives the exact count.
NOT SEARCHED: KEYSTONE, RESULT and ANSWER CHECK lines (10589 named them; see NOT IN SCOPE (a)); the judge prompts' wording beyond the K-L2 sentence.

IN SCOPE:
- (i) L2 Count Plan (engine only): e340's output gains one field, ren: {num: {w: [words], ph: [phrases]}} for each number whose renderings were read whole, and {num: {why}} where the read failed or was capped. Nothing else in e340 changes; the AUDIT v57 text is unchanged.
- (ii) Library, both copies: a new function kl2gLines(text) beside kl2Lines, which reads ren from $('L2 Count Plan').first().json.e340.ren (isExecuted guarded, as line 184 reads e340); one call beside 2178; a cure branch beside 1209; and the label 'K-GLS' added to 515 (TRIAL), 518 (enfSilent, beside K-ML, K-SU and K-RUD), 850, 1053 and 3315, and one cure sentence in 490. Line 934 is not changed: the label is chosen so that its pattern strips it.
NOT IN SCOPE (scope rule):
- (a) KEYSTONE, RESULT and ANSWER CHECK lines (8 of 23 ANSWER CHECK glosses fail; no known bad case there). A separate item if the proof run shows one.
- (b) The debaters' [L2] SHEET, which serves "the lexicon gloss quoted whole" (anchor_gloss, Library 225 to 230). Serving only KJV renderings there is upstream of this failure and goes to the Wall as its own item, not here.
- (c) ASK 340 PART B stays record-only on the debaters' rounds.
- (d) The K-L2 rule, its NOT COUNTED test and its void consequence. K-GLS never enters kl2Lines' NOT COUNTED branch.
- (e) The judge prompts. No sentence is added to any judge prompt; the item carries its own text.

## 4. CRITERIA and DONE
CHANGE:
1. TEST (kl2gLines), the same test ASK 340 PART B applies to the debaters, on the judge's collision lines only:
   - Lines: exactly the lines kl2Lines reads (485).
   - Gloss: each "[L2] ... (G/Hnnnn, gloss)" in the line. Parts: the gloss split at "," and ";".
   - A part is skipped when it equals the number's transliteration or the word itself (as e340 does).
   - A part passes when it, or any of its content words (e340's FW list), in any form from e340's forms(), is in ren[num].w or ren[num].ph.
   - A gloss whose number has no ren entry, or whose ren entry carries why, raises nothing. It is counted as NOT READ in the AUDIT line.
2. ITEM: one K-GLS item per link (as K-L2 dedupes by link), listing every failing part on that line. rule 'K-GLS', side 'BOTH', link "D<n> vs C<n>", line = the line, why = "the [L2] gloss '<part>' for <num> is not a KJV rendering of <num> (LEXICON WORDING when the anchor_gloss holds it); the 1611 KJV renders <num>: <words, most used first, up to 24>". Item text to the judge: "Grade this line on the KJV renderings of <num> read with the verses the line cites: RESTATE the line with its [L2] in those renderings, or RETRACT it. This item voids nothing and sets no count."
3. MARK: one AUDIT line per judge (the next free AUDIT version at build; v65 is the highest in daf5da98): glosses read, parts checked, items raised, NOT READ count. Record-only.
4. CURE (beside 1209): CURED when the link is retracted, or when the restated line's [L2] glosses all pass the test, or the restated line holds no [L2]. Otherwise UNCURED with the failing part named.
5. TRIAL: 'K-GLS':'TRIAL' in ENF_STATUS, and K-GLS is exempt from the silence count (W2's ruling, 10755 item 1): it is added to line 518 enfSilent, as K-ML, K-SU and K-RUD are. So no K-GLS item, cured or not, answered or silent, ever counts in drv_uncured.
6. KEPT OUT OF THE K-L2 VOID (W2 10593 item 2): K-GLS is its own label. Every K-L2 reader listed in section 3 tests x.rule==='K-L2' exactly, so none matches 'K-GLS'. The AUDIT v28 "voids that ground" mark is written only inside kl2Lines' NOT COUNTED branch, which K-GLS never calls.

TESTS (W1 SQL; W4 replays with the code):
- Read path: in a test execution (or a pinned replay) of the engine and of the child, kl2gLines finds ren for G4905 at the call site, through $('L2 Count Plan'). If ren is absent, the function raises nothing and the AUDIT line says NOT READ.
- Cure, synthetic (cureOwn, 934): a cure reply line "K-GLS D5 vs C2: RESTATED: D5 vs C2 ... [L2] synerchomai (G4905, to come together) ..." is stripped to the link and read as the item's own line. The branch returns CURED. The same line with "(G4905, to cohabit conjugally)" returns UNCURED, naming the part. A RETRACTED D5 vs C2 returns CURED.
- Known bad, 41418:
  - 1263 D5 vs C2, G4905 "to come together, including conjugal cohabitation": K-GLS raised on part "including conjugal cohabitation".
  - 1265 D5 vs C2, G4905 "to come together, to cohabit conjugally": K-GLS raised on part "to cohabit conjugally".
- Known good, 41418, no item: 1263 G4905 "to come together"; 1265 H2233 "seed"; 1265 H6635 "host, war"; 1265 G1537 "out of".
- Also raised in 41418 and correct by the rule: 1265 G1080 "to procreate, of the father, by extension of the mother" (KJV: begat, begotten, born, bare ...); 1265 G3543 "to deem or regard" (KJV: suppose, supposed, supposing, think, thought, wont).
- A choice for W2: "to beget" for G1080 raises an item, because the KJV's rows hold "begat" and "begotten", not "beget", and forms() derives no irregular form. The item lists "begat, begotten", so the restatement is one word. I keep the test as ASK 340 has it and add no irregular-verb table.

DONE:
7. W4's replay on the live engine and child (daf5da98 and its child, or later), OLD against NEW, with ren rebuilt from kjv_word_map for each run's debater gloss numbers as e340 reads them:
   - (a) Every stored judgment: each K-GLS item raised, by run, judgment, link, number and part. Each must be a part with no KJV rendering of its number. KNOWN BAD by name: 1263 and 1265 D5 vs C2. KNOWN GOOD by name: the four above.
   - (b) The NOT READ count over all judgments (glosses whose number has no ren).
   - (c) No other item, cure status or count changes on any stored judgment: K-L2 items, AUDIT v28 marks and drv_uncured are equal OLD and NEW, with no exception (K-GLS is in enfSilent).
   - (e) ren is non-empty at the Library on 41418's data, in the engine and in the child, in each of the four packages that run kl2gLines (the read-path test above), shown by output, not by reading code.
   - (d) The e340 AUDIT v57 text is byte-equal OLD and NEW on 41418 (the export adds a field only).
8. Both Library copies hold the same text. Library Check passes on both, and the ASK 539 map check is run and reported.
9. RULING 428: K-GLS adds a question to the judge and no count. It cannot void a ground, and its silence does not count. The card states this.

## 5. WRONG-IF
1. An item is raised on a content word that is a KJV rendering of its number, in any form forms() gives.
2. Either known bad line raises no K-GLS item.
3. Any K-L2 reader, or the AUDIT v28 void mark, fires on a K-GLS item.
7. A RETRACTED that answers only K-GLS items moves any count, or a RETRACTED on a link also named by another rule is not applied.
4. A count, cure status or drv_uncured value changes on any stored judgment, other than by a K-GLS row of its own.
5. The two Library copies differ after the build, or ren is absent at the call site in the engine or the child.
6. cureOwn does not strip "K-GLS ", or the synthetic cure cases give any other status.

## 6. RUN EVIDENCE
NO PROBE (ASK 417): a judge's gloss cannot be forced. UNEXERCISED until a released run in which a judge writes an [L2] gloss outside the KJV renderings on a collision line. At about 2.7 such glosses per recent run, the next released run is likely to exercise it. The proof is a K-GLS row naming the part and the renderings, and its cure row.

## 7. INPUTS IN GIT
This plan, ask533/w1/measure533.sql and ask533/w1/out_measure533.txt, in git and at /mnt/project-files/ask533/w1/. The build's replay and outputs go under ask533/w4/.

## 8. STEPS
1. W2 grades this plan. No card.
2. W4 builds L2 Count Plan (engine) and both Library copies, and runs criteria 7 and 8. No card.
3. W2 grades the build. No card.
4. The operator's write card in W4's thread names the change: a judge's [L2] gloss on a collision line that is not a KJV rendering of its number gets one TRIAL item with the KJV's renderings; it voids nothing and sets no count. The card states that in 41418 sol 6.2 and qwen 4 max broke D5 on G4905 glossed "conjugal cohabitation" and "cohabit conjugally", which the KJV never renders, and that the item would have put the KJV's renderings before them.
5. W4 writes. W2 reads back. No run is released for this ASK alone.
