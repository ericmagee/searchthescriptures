# AAR SKELETON for the run launched 19:44 CST 2026-11-23 (W3 draft; Wall manual v19 section 7.4 order). NOT FOR THE OPERATOR; the coordinator sends the AAR. Run results are blank.

Source of the OBJECTIVE section: aar/w3/NEXT_RUN_OBJECTIVES_draft3.md (md5 3d7f2118), which is draft 2a (95636f3f, W1 check PASS Wall 11166) with status moved for the run: 581 and 562 live, 579 and 578 not live. Each entry gives the objective and expectation word for word from the sheet, then RECORD (where the run would show it; my reading of the expectation, not a test), then RESULT and MET, left blank. DRAFT 2 folds the RECORD-line checks of W4 (Wall 11184, 11185) and W1 (Wall 11186, F1 to F6); the RECORD lines for debate_enforcer_log, debate_errors and the views were NOT checked by W4 (Wall 11185); W1 checked the lines its HOLD list names. An objective is never a command from the operator.

## RUN
Run token: ____. Live version: engine 8c633631, child f900375e, library 0e1cce8f1b596ea4, map 6c6047999c902537 (W4 run-start check Wall 11176). Outcome: ____. Panel verdict: ____.

## OBJECTIVE

### Group 1. Written tonight (2026-11-23, 18:21 to 19:29 CST): 571 with 570, 550, 547, 548, 552, 556, 559, 560 step 1, 549, 561 with 569, 573, 575, 576, 581, 562
11. ASK 571 with 565 and 568. OBJECTIVE of 571 (plan Wall 11070): "After this ASK the Shared Library holds the text once and each node loads it. The texts the nodes run do not change, except the six Builds, which gain ASK 565 and ASK 568 as approved." OBJECTIVE of 568 (plan Wall 11026): "Every Strong's number on the verses in dispute is served on the [L2] SHEET with its gloss." OBJECTIVE of 565 (posted 19:24 CST 2026-11-23, after the write, before the run; Wall 11158; the plan carried none; plan Wall 11012): "every Strong's number a debater cited in an earlier round, standing in a verse of the sheet, is served on the [L2] SHEET ahead of the cap, for both sides alike." EXPECT: no "pkgL2C:" row in debate_errors; the D2 to C4 Builds' [L2] SHEET cap line names 130000; cited numbers stand first on the sheet; Luke 1:35 G2316 and G1352 are on the D2 sheet with their glosses.
   RECORD: debate_errors rows of the run, selected by execution_id, by time window, or by "run_token=" in error_message (the table has no run_token column; W1 Wall 11186 F5) (no pkgL2C: row). EXECUTION ONLY, PENDING: the [L2] SHEET exists only in the D2 to C4 Build outputs (the prompts sent); no table stores it; reading it needs W4's execution read, refused at 18:48 CST 2026-11-23 and waiting on the operator's word; not assumed (W4 Wall 11184 item 2c; W1 Wall 11186 F2); the cap line 130000 and the cited-numbers-first order can be seen only there.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

12. ASK 570. OBJECTIVE (posted 19:23 CST 2026-11-23, after the write, before the run; Wall 11157; the plan carried none) (plan Wall 11052, graded Wall 11054): "the enforcer does not push a premise count on a grade that its own pass has just corrected." EXPECT: an enforcer premise push that rests on an answer check the same pass rules MEETS is stored "ENFORCER HELD (pkgEPS, not sent; ...)" and is not sent to the judge; the other two kinds are marked TRIAL and sent as before.
   RECORD: debate_enforcer_log rows of the run (a row reading ENFORCER HELD (pkgEPS, not sent; ...); TRIAL marks on the other two kinds). UNEXERCISED if no premise push rests on an answer check ruled MEETS in the same pass.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

13. ASK 550. OBJECTIVE (posted 19:23 CST 2026-11-23, after the write, before the run; Wall 11157; the plan carried none) (plan file BUILD_PLANS_draft2.md P4, Wall 10964): "the run row and the run report carry the verdict word of every removed seat." EXPECT: for each removed seat one "[REMOVED SEAT: <seat>; VERDICT WORD: <word>; REMOVED BY: <rules and UNCURED items>]" line in review_notes and under "## Removed seats" in the report; a NOT SEATED alternate gets its line (tested only on a made-up entry so far). UNEXERCISED unless a seat is removed.
   RECORD: debate_results.review_notes of the run row ([REMOVED SEAT: ...] lines) and the run report section "## Removed seats". UNEXERCISED if no seat is removed.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

14. ASK 547. OBJECTIVE (posted 19:23 CST 2026-11-23, after the write, before the run; Wall 11157; the plan carried none) (same file, P1): "the tail of a judge's cure statement is never read as a collision line." EXPECT: no E-COL or E-ONE item whose line is the tail of an audit mark ("; JUDGE STATEMENT: ...").
   RECORD: debate_enforcer_log rows of the run (rules E-COL and E-ONE; no item whose line is the tail of an audit mark).
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

15. ASK 548. OBJECTIVE (posted 19:23 CST 2026-11-23, after the write, before the run; Wall 11157; the plan carried none) (same file, P2): "the E-COL cure test reads the judge's CHANGE TO text when the answer is a CHANGE." EXPECT: an E-COL CHANGE whose CHANGE TO names the answering side is not refused "the line names no answering side".
   RECORD: debate_enforcer_log rows of the run (rule E-COL cure rows; no refusal "the line names no answering side" on a CHANGE whose CHANGE TO names the side). UNEXERCISED if no judge answers an E-COL item with CHANGE.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

16. ASK 552. OBJECTIVE (posted 19:23 CST 2026-11-23, after the write, before the run; Wall 11157; the plan carried none) (same file, P10): "the engine settles the keystone word from the judge's own lines and asks the enforcer only on a mismatch." EXPECT: a keystone word (STANDS or BROKEN) that follows from the judge's own lines shows the code row "NOT ASKED (code, ASK 552): ..." and no E-KEY call; a mismatch still builds the E-KEY item; a WITHDRAWN keystone keeps the earlier path.
   RECORD: debate_enforcer_log rows of the run (rule E-KEY; the code row NOT ASKED (code, ASK 552): ..., or an E-KEY item on a mismatch).
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

17. ASK 556. OBJECTIVE (posted 19:23 CST 2026-11-23, after the write, before the run; Wall 11157; the plan carried none) (plan Wall 11043, draft 2 graded Wall 11049): "the run row records which of the challenger's pressed references have no ANSWER line in the stored close." EXPECT: review_notes holds once "[AUDIT: CLOSE PRESS LIST (record-only) -- PRESSED: <n>; NO ANSWER LINE IN THE CLOSE: <references, or none>]"; the Oracle's aim is "none".
   RECORD: debate_results.review_notes of the run row: the line [AUDIT: CLOSE PRESS LIST (record-only) -- PRESSED: n; NO ANSWER LINE IN THE CLOSE: ...], once.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

18. ASK 559 (carded with 560 step 1). OBJECTIVE (posted 19:24 CST 2026-11-23, after the write, before the run; Wall 11158; the plan carried none) (plan Wall 10993, draft 1c Wall 11020): "an absence-only block under a LINK or PREMISE head is no longer excused by LAY unless BAR harvests it, and BAR harvests the absence phrasings that LAY knows." EXPECT: an absence-only block under a LINK or PREMISE head is no longer excused by LAY; BAR catches the absence phrasings LAY knows (offline on planted blocks, not on run 41822: "LINK 2" and "PREMISE 3" go 0 to 1, the control stays 0, BAR hits go 1 to 4); a block under an answer head that states the point is excused by LAY and harvested by BAR.
   RECORD: debate_results.review_notes of the run row: one line "[AUDIT v47: BARRED MOVE RE-CALL (pkgBAR) -- SEAT; ROUND; SENT BACK: n sentence(s); KEPT: first|second round (<why>); VOID: n]" for each RESENT B round (the why carries the barred-sentence and layer-point counts; "SENT BACK: 0" marks a LAY-only resend; a round not resent leaves no line), with the stored round text, which is the kept round. EXECUTION ONLY, PENDING: the LAY items, the BAR hits and the note sent back are in the B Extract outputs (json.bar.layers, bar.first) and are stored in no table; reading them needs W4's execution read, which was refused at 18:48 CST 2026-11-23 and waits on the operator's word; it is not assumed. Without that read this entry can be graded only as "resent or not", plus the stored round text (W4 Wall 11184; W1 Wall 11186 F1) (a STRUCTURE item on an absence-only LINK or PREMISE block; BAR hits on the new phrasings). For Change 2 the review_notes BARRED MOVE VOID lines carry each voided sentence (W1 Wall 11186, HOLD list). UNEXERCISED if no round writes such a block or phrasing.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

19. ASK 560 step 1 (record-only). OBJECTIVE (posted 19:24 CST 2026-11-23, after the write, before the run; Wall 11158; the plan carried none) (same plan): "each run records, in one review_notes line, how the opening round (CR1) fares under LAY and BAR. Nothing is sent back and nothing is counted." EXPECT: the new node D1 Check runs after D1 Extract; review_notes holds "[AUDIT: CR1 CHECK (record-only) -- ...]"; nothing is sent back. A solid Oracle opening shows 0 LAY items and 0 BAR hits (on 41822's CR1 the plan measured LAY 4, a lower bound taken with no Verse Sheet rows, and BAR 0, taken before 559 widened BAR; BAR is not re-measured).
   RECORD: debate_results.review_notes of the run row: the line [AUDIT: CR1 CHECK (record-only) -- LAY ITEMS: n; BARRED SENTENCES: m; HEADS: ...], once.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

20. ASK 549. OBJECTIVE (posted 19:23 CST 2026-11-23, after the write, before the run; Wall 11157; the plan carried none) (plan file BUILD_PLANS_draft2.md P3, Wall 10964): "a gate change that the engine refuses does not remove the judge's seat." EXPECT: a gate CHANGE refused by pkgPS or pkgSGA is stored RECORD-ONLY with "<package> refused the gate change; the judge's line before the change stands (recorded, no seat removed): ..." and adds 0 to drv_uncured; a silent gate item still counts.
   RECORD: debate_enforcer_log rows of the run (gate rows; a row RECORD-ONLY whose reason names pkgSGA or pkgPS "refused the gate change"); drv_uncured of that seat, which is a column of debate_judgments and debate_removals, not of the enforcer log (W1 Wall 11186 F6). UNEXERCISED if no gate CHANGE is refused.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

21. ASK 561 with 569. OBJECTIVE of 561 (posted 19:24 CST 2026-11-23, after the write, before the run; Wall 11158; the plan carried none; plan Wall 11020, its scope line): "DR1 gets the LAY check the later challenger rounds get (C2B to C4B), and nothing else." OBJECTIVE of 569 (same label; plan Wall 11041; ruled by the operator "Proof by reference allowed", rulings row 507): "a summary line may prove by reference, '[L1] <ref>, quoted above', for a verse quoted with its layer elsewhere in the round, and the LAY note says so once." EXPECT: C1B Build runs LAY on DR1 and resends an unfooted opening once, its note carrying the 569 sentence once; a summary line in the tag-first form "[L1] <ref>, quoted above" draws no item for a verse quoted with its layer elsewhere in the round; the tag-after form "<ref> [L1], quoted above" credits one verse only, so such a line can still draw an item; a reference to a verse never quoted is still sent back.
   RECORD: debate_results.review_notes of the run row: a v47 line with ROUND [DR1] shows that C1B resent, and its why carries "N layer point(s)"; the stored DR1 text is the kept round and, if resent, carries the bare-line list appended (LAY_BARE) when there were bare lines. EXECUTION ONLY, PENDING: the 569 sentence stands in the note sent back, which is not stored; seeing it needs W4's execution read of C1B Build, refused at 18:48 CST 2026-11-23 and waiting on the operator's word; not assumed (W4 Wall 11184 item 2b).
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

22. ASK 573. OBJECTIVE (plan Wall 11067): "one stored copy of the parser serves every node, so a fix to it is one edit. Engine code shrinks by 79,500 characters and child code by 15,872, with no change in behaviour." EXPECT: NO RUN MARK beyond no "ASK 573:" loader error in debate_errors; Build Save Body, Format Markdown and the enforcer builds run as before.
   RECORD: debate_errors rows of the run, selected by execution_id, by time window, or by "run_token=" in error_message (the table has no run_token column; W1 Wall 11186 F5) (no text "ASK 573:"); the run row and the report exist.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

23. ASK 575. OBJECTIVE (plan Wall 11068): "the five Accept nodes each carry the judge prompt block POSTURE in full (99,588 characters, 4 texts). Each node loads its own text from the library, rebuilt byte for byte; engine code -91,411, no change in behaviour." EXPECT: NO RUN MARK beyond no loader error in the five Accept nodes.
   RECORD: debate_errors rows of the run, selected by execution_id, by time window, or by "run_token=" in error_message (the table has no run_token column; W1 Wall 11186 F5) (no text "ASK 575:").
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

24. ASK 576. OBJECTIVE (plan file fairjudge/w1/a576/ASK576_plan.md section 1, Wall 11087): "Each node loads its own text from the library, rebuilt byte for byte. No behaviour change." EXPECT: NO RUN MARK beyond no loader error in the eleven nodes.
   RECORD: debate_errors rows of the run, selected by execution_id, by time window, or by "run_token=" in error_message (the table has no run_token column; W1 Wall 11186 F5) (no text "ASK 576:").
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

26. ASK 581. OBJECTIVE (plan Wall 11141, draft 2): "After 581, LAY reads those forms. Every other item stays as it is." EXPECT: no item changes on forms the stored rounds hold today (0 of 761 in the replay); it matters under the heads ASK 562 opens.
   RECORD: debate_results.review_notes of the run row: one line "[AUDIT v47: BARRED MOVE RE-CALL (pkgBAR) -- SEAT; ROUND; SENT BACK: n sentence(s); KEPT: first|second round (<why>); VOID: n]" for each RESENT B round (the why carries the barred-sentence and layer-point counts; "SENT BACK: 0" marks a LAY-only resend; a round not resent leaves no line), with the stored round text, which is the kept round. EXECUTION ONLY, PENDING: the LAY items, the BAR hits and the note sent back are in the B Extract outputs (json.bar.layers, bar.first) and are stored in no table; reading them needs W4's execution read, which was refused at 18:48 CST 2026-11-23 and waits on the operator's word; it is not assumed. Without that read this entry can be graded only as "resent or not", plus the stored round text (W4 Wall 11184; W1 Wall 11186 F1) (no LAY item on a footed block written in one of the five tag forms). UNEXERCISED if no round uses those forms.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

27. ASK 562 draft 3. OBJECTIVE (plan Wall 11143, C1 met Wall 11146): "After 562, those heads open blocks, and the layers check applies to them as it applies to a PRESS block." EXPECT: an unfooted block under an "against" head draws a STRUCTURE item in the one send-back; for an Oracle defender such a block also needs its [L2] and [L4] lines; a title-only "against" head over PRESS heads draws none.
   RECORD: debate_results.review_notes of the run row: one line "[AUDIT v47: BARRED MOVE RE-CALL (pkgBAR) -- SEAT; ROUND; SENT BACK: n sentence(s); KEPT: first|second round (<why>); VOID: n]" for each RESENT B round (the why carries the barred-sentence and layer-point counts; "SENT BACK: 0" marks a LAY-only resend; a round not resent leaves no line), with the stored round text, which is the kept round. EXECUTION ONLY, PENDING: the LAY items, the BAR hits and the note sent back are in the B Extract outputs (json.bar.layers, bar.first) and are stored in no table; reading them needs W4's execution read, which was refused at 18:48 CST 2026-11-23 and waits on the operator's word; it is not assumed. Without that read this entry can be graded only as "resent or not", plus the stored round text (W4 Wall 11184; W1 Wall 11186 F1) (a STRUCTURE item on an unfooted block under an "against" head; none on a title-only head). UNEXERCISED if no round writes an "against" head.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

### Group 2. Live before tonight's writes and not yet exercised by a run: 544, 545, 546, 557 A/B/D, 558, 564, 566, 567, 563, 554 and 555
1. ASK 544 (pkgCKL). OBJECTIVE (Wall 10877): "a closing sentence that restates what the debater's own earlier round kept under that link is no longer charged as a CLOSE-CONTRADICTION because a different link was narrowed or dropped." EXPECT: a CONFIRMED close contradiction that meets the three conditions is recorded NOT CONFIRMED (kept link) and breaks no link; one whose drop and close sit in the same link still applies. UNEXERCISED in run 41822.
   RECORD: debate_enforcer_log rows of the run (rule value E-CLOSECON; a row reading NOT CONFIRMED (kept link); W1 Wall 11186 F3). UNEXERCISED if no close contradiction is confirmed.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

2. ASK 545 (pkgBFX). OBJECTIVE (Wall 10875): "the range check stops telling a judge that a counted premise is outside the list when the premise is in the list and answered under a \"LINK none [premise N]\" block." EXPECT: no K-UNX RANGE item for a listed premise answered under LINK none; a real out-of-list count still gets one. Not shown in 41822.
   RECORD: debate_enforcer_log rows of the run (rule K-UNX; no RANGE item on a listed premise answered under LINK none). UNEXERCISED if no judge writes a LINK none block.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

3. ASK 546 (541 fix A, database). OBJECTIVE (Wall 10881): "each stored enforcer row's status matches whether the engine counted it." EXPECT: a gate row ending " (RECORD-ONLY)" is stored RECORD-ONLY; an E-ASSUME row counted under ASK 531 is stored UNCURED. Exercised in 41822 (manual v236); listed for the repeat.
   RECORD: debate_enforcer_log rows of the run (column cure_status, whose values are CURED, UNCURED, RECORD-ONLY or null, against the row text; W1 Wall 11186 F4: a row ending (RECORD-ONLY) stored RECORD-ONLY; a counted E-ASSUME row stored UNCURED).
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

4. ASK 557 Changes A, B, D. OBJECTIVE (posted 19:23 CST 2026-11-23, after the write, before the run; Wall 11157; the plan carried none) (plan Wall 10975, draft 5b graded Wall 10986): "the Oracle breaks every point, its own and its opponent's, down into the four layers, and an Oracle block that lacks [L2] or [L4] is sent back." EXPECT: the Oracle's rounds carry [L1], [L2], [L3], [L4] lines for each link, premise block, press and answer; an Oracle block with no [L2] or no [L4] is sent back as a STRUCTURE item at D2B, D3B, D4B Build; the close carries the four layers under each ANSWER line.
   RECORD: the stored round texts of the run row in debate_results (the Oracle's rounds carry [L1] to [L4] lines); debate_results.review_notes of the run row: one line "[AUDIT v47: BARRED MOVE RE-CALL (pkgBAR) -- SEAT; ROUND; SENT BACK: n sentence(s); KEPT: first|second round (<why>); VOID: n]" for each RESENT B round (the why carries the barred-sentence and layer-point counts; "SENT BACK: 0" marks a LAY-only resend; a round not resent leaves no line), with the stored round text, which is the kept round. EXECUTION ONLY, PENDING: the LAY items, the BAR hits and the note sent back are in the B Extract outputs (json.bar.layers, bar.first) and are stored in no table; reading them needs W4's execution read, which was refused at 18:48 CST 2026-11-23 and waits on the operator's word; it is not assumed. Without that read this entry can be graded only as "resent or not", plus the stored round text (W4 Wall 11184; W1 Wall 11186 F1) for any STRUCTURE item on an Oracle block without [L2] or [L4].
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

5. ASK 558. OBJECTIVE (posted 19:23 CST 2026-11-23, after the write, before the run; Wall 11157; the plan carried none) (same plan): "a function word whose Strong's number a round has cited is served on the [L2] SHEET, so the Oracle can foot its [L2] line on it." EXPECT: a function word whose Strong's number an earlier round cited (for example G1352) is kept on the [L2] SHEET.
   RECORD: EXECUTION ONLY, PENDING: the [L2] SHEET exists only in the D2 to C4 Build outputs (the prompts sent); no table stores it; reading it needs W4's execution read, refused at 18:48 CST 2026-11-23 and waiting on the operator's word; not assumed (W4 Wall 11184 item 2c; W1 Wall 11186 F2); UNEXERCISED if no round cites a function word's Strong's number.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

6. ASK 564. OBJECTIVE (posted 19:23 CST 2026-11-23, after the write, before the run; Wall 11157; the plan carried none) (plan Wall 11007, draft 2b graded Wall 11021): "the Oracle charges every weakness its layer examination finds, each as its own numbered premise." EXPECT: each opponent point with a failed layer is charged as its own numbered premise in the Oracle's UNSUPPORTED-L4 PREMISES list (limit 6), carried into the link round, and restated in the close only in the GAPS LEFT OPEN form.
   RECORD: the stored round texts of the run row in debate_results (the Oracle's UNSUPPORTED-L4 PREMISES list, its link round, and the GAPS LEFT OPEN form in its close).
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

7. ASK 566. OBJECTIVE (W4, Wall 11161, labeled there "Posted 19:26 CST 2026-11-23, after the write, before the run"; the post's own stamp reads 19:24 CST; the plan carried none; plan Wall 11018, graded Wall 11022 and 11025): "a fully footed line, with two verses quoted with their references and the layer tags, is never sent back only because its [L1] or [L3] tag stands after the reference, after the quote, or on the ANSWER line, rather than before the quote." EXPECT: no LAYERS CHECK item on a footed verse written in the three forms canon566 reads (an ANSWER line with [L1] and the quotation; "<reference> [L1 or L3]: quotation"; a quotation followed by its reference and tag). The true items still fire: a reference with no quote, words that are not the verse, one verse only, and the Oracle gate's missing [L2] or [L4]. Mark (W4): the stored LAY items of D2B to D4B and C2B to C4B Build, read against the round text; every item names a block that truly lacks what it says.
   RECORD: debate_results.review_notes of the run row: one line "[AUDIT v47: BARRED MOVE RE-CALL (pkgBAR) -- SEAT; ROUND; SENT BACK: n sentence(s); KEPT: first|second round (<why>); VOID: n]" for each RESENT B round (the why carries the barred-sentence and layer-point counts; "SENT BACK: 0" marks a LAY-only resend; a round not resent leaves no line), with the stored round text, which is the kept round. EXECUTION ONLY, PENDING: the LAY items, the BAR hits and the note sent back are in the B Extract outputs (json.bar.layers, bar.first) and are stored in no table; reading them needs W4's execution read, which was refused at 18:48 CST 2026-11-23 and waits on the operator's word; it is not assumed. Without that read this entry can be graded only as "resent or not", plus the stored round text (W4 Wall 11184; W1 Wall 11186 F1); each LAY item read against the round text.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

8. ASK 567. OBJECTIVE (posted 19:23 CST 2026-11-23, after the write, before the run; Wall 11157; the plan carried none) (plan Wall 11013, graded Wall 11017): "the layers check reads the Oracle's close, so a closing answer is held to the same layers as a press." EXPECT: in the Oracle's close each "ANSWER:" line opens a block that gets the Oracle tests; an ANSWER block without [L2] or [L4] is sent back; the close instruction asks for the pressed verse's reference and words on the [L1] line.
   RECORD: the stored round texts of the run row in debate_results (the Oracle's close, ANSWER blocks); debate_results.review_notes of the run row: one line "[AUDIT v47: BARRED MOVE RE-CALL (pkgBAR) -- SEAT; ROUND; SENT BACK: n sentence(s); KEPT: first|second round (<why>); VOID: n]" for each RESENT B round (the why carries the barred-sentence and layer-point counts; "SENT BACK: 0" marks a LAY-only resend; a round not resent leaves no line), with the stored round text, which is the kept round. EXECUTION ONLY, PENDING: the LAY items, the BAR hits and the note sent back are in the B Extract outputs (json.bar.layers, bar.first) and are stored in no table; reading them needs W4's execution read, which was refused at 18:48 CST 2026-11-23 and waits on the operator's word; it is not assumed. Without that read this entry can be graded only as "resent or not", plus the stored round text (W4 Wall 11184; W1 Wall 11186 F1), for a send-back of an ANSWER block without [L2] or [L4]. Only when the Oracle defends.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

9. ASK 563. OBJECTIVE (posted 19:23 CST 2026-11-23, after the write, before the run; Wall 11157; the plan carried none) (plan Wall 11000, draft 1a graded Wall 11014): "the run row records whether the Oracle's closing answers carry the layers, so 557 and 567 can be measured from the record." EXPECT: with an Oracle defender and a stored close, review_notes holds once "[AUDIT: ORACLE LAYERS (record-only) -- CLOSE ANSWERS: <n>; WITH [L2]: <a>; WITH [L4]: <b>]"; the aim of 557 and 567 is met when a and b equal n (41822's stored close gives 24, 0, 0).
   RECORD: debate_results.review_notes of the run row: the line [AUDIT: ORACLE LAYERS (record-only) -- CLOSE ANSWERS: n; WITH [L2]: a; WITH [L4]: b], once. Only with an Oracle defender and a stored close.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

10. ASK 554 and 555 (database views). OBJECTIVE (posted 19:23 CST 2026-11-23, after the write, before the run; Wall 11157; the plan carried none) (plan file BUILD_PLANS_draft2.md, Wall 10964, graded Wall 10966): "the enforcer's rulings can be read by collision and its pushes by side, from the record, without a hand count." EXPECT: after the run, enforcer_rulings_by_collision and enforcer_pushes_by_side return the run's rows; the run report reads them. No engine effect.
   RECORD: the views enforcer_rulings_by_collision and enforcer_pushes_by_side, selected for the run.
   RESULT: ____
   MET: ____ (YES / NO / UNEXERCISED, with the record cited)

### Not live for this run (no entry counts): ASK 579 (built, waits on C6) and ASK 578 (built, held until C6 and C7 can be shown, Wall 11175).

## REVIEWS
W1: Wall ____. W3: Wall ____. W4: Wall ____ (and W4's run report post: Wall ____). W2: at rest.

## DEFECTS
____ (each defect in plain words, with the seat or outside read that found it)

## WHAT WENT RIGHT
____ (each fix the run showed working, by ASK number, with the evidence a seat cited, or NONE)

## WHAT WENT WRONG
____ (each seat's items, with the rule each broke, or NO RULE COVERS IT)

## SUGGESTED IMPROVEMENTS
____ (each proposed change by ASK number or package name, with its grades so far and whether its card is with the operator)
Carried in, already open before the run: ASK 579 (plan PASS Wall 11104, build part 1 PASS Wall 11135, C6 unshown); ASK 578 (plan PASS Wall 11148, build C1 to C5 PASS Wall 11174, C6 and C7 unshown, held Wall 11175).

## KNOWLEDGE BASE
____ (each YES entry, in one line)

## FOR THE OPERATOR
____ (each open card or ruling asked, one per line)
Carried in: the word on W4's refused execution read of 18:48 CST (ASK 579 C6 and ASK 578 C6 wait on it).

## PROCESS GAPS RECORDED BEFORE THE RUN (engine manual v239; for the coordinator's failure list)
1. ASK 559 with 560 step 1 was written with no Wall post grading the build by itself (W1 rebuilt the stack and matched it, Wall 11130 item 2; readback Wall 11156).
2. ASK 561 was written with no card approving its plan for build; the only press after the 17:59 CST ruling on 569 was the write card at 18:56 CST.
