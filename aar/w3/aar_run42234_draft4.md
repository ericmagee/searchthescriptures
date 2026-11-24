# AAR, run ODV1-42234-501p8uuq (W3; Wall manual section 7.4 order). Draft 4. Draft 3 was confirmed by W1 (Wall 11605: F1, N1, N2 closed, PASS, nit N3 on the time of the engine write). Draft 4 takes in W4's offline body-size measure (Wall 11606) and N3; nothing else is changed.

Every RESULT is from SQL on the run's rows read 10:43 to 11:31 CST 2026-11-24, or from a seat's post, named. I read all eight rounds and the synthesis whole (notes: aar/w3/run42234_notes.md). THE RUN CRASHED BEFORE ANY JUDGMENT WAS STORED, so this AAR cannot report on the judges or the enforcers of this run. "EXECUTION ONLY" means the record is in the n8n execution, which no seat has read (W4 reads status only).

## RUN
Run token ODV1-42234-501p8uuq; debate_results 8dd067f4, created 10:39:01 CST 2026-11-24. By W4's status reads of the execution (not mine): execution 42234 started 09:55:44 CST and ended CRASHED at 11:27:47 CST, 92 minutes. debate_errors row bf3a00a8, written 11:28:23 CST: "Workflow did not finish, possible out-of-memory issue" (node name given: Judge Order Read). Engine at the run 6834c21b, child ecdc6218 (the engine is ff7ab4cf since 11:28:44 CST by the workflow's update time, W1's read, Wall 11605: the question-round fix). Topic: "Did Christ have a biological father?" Defender: anthropic/claude-opus-5.5 as the Oracle (its first run). Challenger: anthropic/claude-sonnet-5.5. Panel expected: sol, sol62, spark. Stored: the eight rounds, the synthesis, review_notes (13,011 characters). NOT stored: outcome, panel_split, panel_verdict, judged_by, standings, run_cost_usd (all null); debate_judgments 0 rows; debate_enforcer_log 0 rows; debate_removals 0 rows. By W4's read (not mine): child execution 42258 ran 11:17:53 to 11:27:44 CST and shows success.

## OBJECTIVE
Numbering follows the pre-run sheet (aar/w3/prerun_objectives_1124.md 0cc2e269). MET is YES, NO, IN PART, UNEXERCISED or NOT SHOWN.
1. ASK 587 (engine form fixes A to E). RESULT: no enforcer row, no removal row. MET: UNEXERCISED.
2. ASK 588 (the question round). RESULT: odv1_question_round_log id 1, status SKIPPED, why "QR Merge: a judge body holds no transcript anchor". Six questions passed their checks (sol62 two, spark two, sol two) and were not put to the debaters. W4 (thread note, 10:48 CST): a defect of the 588 build; the three QR nodes look for "DEBATE TRANSCRIPT\n\n=== [" and Panel Build's transcript begins "=== TOPIC ===", so EVERY fresh run skips the round; the t588 test built judge bodies with no TOPIC part. FIXED SINCE THE RUN: W4 wrote the anchor fix at 11:28:44 CST (engine 6834c21b to ff7ab4cf; three QR nodes; W1 grade 9fc9abd8; Wall 11598; read back MATCH Wall 11599); it is live and UNEXERCISED. MET: NO on this run. (The EXPECT line "SKIPPED with its reason" is satisfied in form; the objective is not.) The skip did not stop the run: the QR row is stamped 10:40:08 CST and W4 reports a child execution from 11:17:53 to 11:27:44 CST.
3. ASK 590 (one closing check). MET: UNEXERCISED (no E-CLOSECON row stored; whether an Anticheat node ran is EXECUTION ONLY).
4. ASK 593 (Haiku out). RESULT: the judge order line and the eight AGREEMENT lines of review_notes name sol, sol62, spark, chatgpt, qwen4max, gemini, argon, sonnet; no haiku. MET: YES for the seat lists, as the path that fired; no judgment or enforcer row exists to check, and this is not a clean run under TWO LIVE RUNS.
5. ASK 595 and its follow-on. RESULT: the QR row holds no DROPPED item (all six PASSED). MET: UNEXERCISED.
6. ASK 594. MET: UNEXERCISED (no substitution recorded; panel_substitution null).
7. ASK 586 J1. MET: UNEXERCISED.
8. ASK 586 J6. MET: UNEXERCISED.
9. ASK 586 J2. MET: NOT SHOWN (the judges' request is EXECUTION ONLY; no E-L2G row).
10. ASK 586 J3. MET: NOT SHOWN (THE GRANTS LISTS block is EXECUTION ONLY; no E-GRT row).
11. ASK 591 with fix 1 and fix 2. RESULT: review_notes ends "[JUDGE ORDER v2: panel list sol, sol62, spark; alternates list chatgpt, qwen4max, gemini, argon, sonnet | SEATED: panel sol62, spark, sol; reserve none; alternates chatgpt, qwen4max, gemini, argon, sonnet]", no "single judge". v2 is the operator's save of 09:43 CST. MET: YES for the read, the line and the version, as the path that fired; this is not a clean run under TWO LIVE RUNS. The SEATED order (sol62, spark, sol) is the order the engine used after the fault ledger's move, and it does not rank the seats (W4, read of Init Seats): the engine starts from the table's panel list and alternates, drops debaters, refusals and same-family seats, moves every seat the fault ledger moved to the end behind the other non-alternates, and takes the first three; sol was at the ledger's stage ALTERNATE and was moved behind the others, and it still sat because only three panel seats were left. One thing not shown: whether the seats equal the dashboard's line-up for this pair before the launch is NOT SHOWN (not compared).

By the operator's rule (WALL-11593, operational document v145, TWO LIVE RUNS): this run counts as a live run for NO change, because no change's path both fired and finished clean; ASK 591's read fired, and the run then crashed.

## REVIEWS
W3: this draft and aar/w3/run42234_notes.md. W4: thread notes 10:48, 11:11, 11:28, 11:32 and 11:33 CST (the QR cause; the execution state; the crash; the SEATED order and the risk of a data read; the regrade load) and Wall 11598 (the question-round fix written). W1: Wall 11599 (readback of the fix), Wall 11603 (grade of draft 2) and Wall 11605 (draft 3 confirmed). W4: Wall 11606 (the offline body-size measure; files aar/w4/m42234/, commit 0327c64e).

## DEFECTS
1. THE RUN CRASHED IN THE JUDGING, "possible out-of-memory issue". Cause NOT KNOWN. Measured by SQL: the eight rounds total 223,175 characters; run 42071 totalled 143,318 and the five runs before it 107,462 to 128,800. The Oracle's link round alone is 54,399 (42071: 22,306). MY INFERENCE, not shown: the size of the rounds, carried into every judge and enforcer call, exhausted the instance. ASK 516 crashed the same way and for that cause (engine manual part 11.1). W4'S MEASURE (Wall 11606; offline, the live engine's node code run on the stored rows, no n8n call): each panel judge's request body is 295,851 characters (run 42071: 211,130, +40%), all three 887,555 (633,392); each of the two defender-side close enforcer bodies is 303,638 (183,748, +65%); each of the two challenger-side bodies 173,982 (122,872, +42%); all four 955,244 (613,244). The system prompt per judge moved from 62,753 to 63,691, so the growth is the transcript. These are lower bounds: the Quote Report blocks, the fault-ledger blocks, panel history, the question-round bodies and the panel enforcer bodies are left out. W4: this does not prove that size caused the crash; it shows the judging load was about 40 to 65% above the last run that finished.
2. The engine made the Oracle's rounds longer: three v47 re-calls on the defender with 0 barred sentences (LAY-only resends) kept replacement rounds of 27,108 to 30,314 (CR2), 41,571 to 54,347 (CR3) and 30,841 to 35,743 (CR4), +20,884 characters in all.
3. The question round was skipped on this run and would have been on every fresh run (OBJECTIVE 2): a build defect that an offline test passed. Fixed at 11:28:44 CST (Wall 11598, 11599); not yet shown by a run.
4. No judgment, enforcer row or cost was kept from a 92-minute run: the engine writes them at the end only. Run 42071 wrote all 508 enforcer rows in one second, 26 minutes after its rounds.
5. The crash error row names the node "Judge Order Read", the first node; it does not say where the run died. EXECUTION ONLY.
6. The Oracle (Opus 5.5), from my read of the rounds:
   a. No row in any round states a knowing within the espousal; D1's knowing is an [L4] step from the names husband and wife and the pattern of Genesis 4:1 (the same weakness as run 42071 DEFECT 11, Sol 6.2). The synthesis lists it first among the defender's vulnerable connections.
   b. The close overstates a grant: "The challenger granted, at its P3.1, that the coming together is the taking of Matthew 1:24"; DR3 reads "Grant that the taking is the coming together. Then ..." (for argument). The synthesis found this itself.
   c. The close ends "GAPS: NONE", while "[AUDIT: CLOSE PRESS LIST ... PRESSED: 45; NO ANSWER LINE IN THE CLOSE:" lists 32 verses (run 42071: 5 of 23). The close answers the 23 witnesses of the challenger's link round only.
   d. D5 was narrowed twice (link round: the limb "that the statute is addressed to God" dropped; close: narrowed to Hebrews 2:14 and 2:17), and D4 changed from "origin and anointing" to "origin and holiness" without a declared narrowing.
   e. CR1 gave G4905 by its KJV renderings without "cohabit (conjugally)" (run 42071 DEFECT 20 again); the challenger used the omission in DR2. CR1 gave G1165 and CR2 G3856 for the same word of Matthew 1:19.
   f. The charge on Mary's Davidic line (CR2 premise 1, with Luke 1:5 and 1:36) was not carried into the link round or the close.
   g. Every PROVEN IN tag of the CR3 premise list reads "[this round]".
   h. CR1 CHECK: 6 LAY items (run 42071: 0).
7. The challenger: one barred sentence in each of DR1, DR2 and DR3 (sent back, replaced); no row for Mary's Davidic descent ("of Heli ... by marriage" rests on Ezra 2:61 by likeness; two judges' unasked questions were on that sentence).
8. "[AUDIT v23: SYNTHESIS CHECK (S-C) -- 5 item(s) listed as charged by neither side name verses a closing premise list carries ... REVIEW THIS ROW.]": all five items of the synthesis's uncontested list are flagged.

## WHAT WENT RIGHT
1. ASK 591: the order was read from the table, version 2, and recorded; no single judge.
2. All eight seats accepted the agreement; no haiku seat.
3. Against run 42071, the Oracle on Opus 5.5: tested every press layer by layer; answered Jeremiah 22:30 with Haggai 2:23 and Jeremiah 18:7-8 (42071 DEFECT 17); charged the challenger's maternal-line gap in round 2 (42071 DEFECT 11); wrote PROVEN IN tags (42071 DEFECT 21); 23 of 23 close answers carry [L2] and [L4].
4. The barred-move re-call worked on the challenger three times (1 barred sentence to 0 each time).
5. The challenger's grants are explicit and many ("I grant ..." on most of 40 presses), each then turned: a full test for THE GRANTS LISTS (J3) when the rounds are regraded.

## WHAT WENT WRONG
1. No judgment was reached. Rule broken: none; cause not known (DEFECT 1).
2. A feature the operator ordered live (the question round, ruling 512) has never run live (DEFECT 3); its fix is written and waits for its first run.
3. Nothing the judges or enforcers did before the crash survives (DEFECT 4).

## SUGGESTED IMPROVEMENTS (drafts for ASK numbers; none planned, none graded)
A. FIND THE CRASH. The last finished node and the request sizes are in the execution's data. W4: reading that data loads the whole execution into n8n's memory; a full data read crashed the instance on run 33055; this execution is the largest yet and the instance has just gone down; stopped status does not lower the risk; and the crash may have left no data to read. Only a status read is safe. So A is NOT a team step: it goes to the operator as its own card that says the read may take the instance down, or it is dropped. Without it the cause stays my inference.
B. JUDGE THE STORED ROUNDS (not offered as safe until C and D; see FOR THE OPERATOR 2). A dry regrade of row 8dd067f4 (the operator's own plan of 01:34 CST was a dry regrade first), so that the judges and the enforcers are seen on these rounds without paying for the debate again. It also exercises J1, J2, J3, J6, 587, 590, 594 and 595.
C (ASK 603). KEEP THE JUDGES' WORK AS IT IS DONE. Write each seat's judgment row and its enforcer rows when that seat finishes, not all at the run's end, so a crash loses one seat's work and not all of it.
D (ASK 604). A LAY-only resend must not make a round longer without limit: record the size before and after, and decide a rule (the operator's ruling of 20:52 CST 11-23 forbids a cap on the manual; no ruling covers round size).
E. DONE SINCE THE RUN: the question-round fix is graded, written and read back (Wall 11598, 11599). What remains is its proof: the next fresh run's question-round row is not SKIPPED.
F. For the Oracle's text (after the judges and enforcers, which the operator set first at 10:57 CST): one ANSWER line in the close for every pressed verse, and "GAPS: NONE" only when the press list is empty; a grant quoted in the grantor's words; a declared narrowing for any changed link wording.

## KNOWLEDGE BASE
1. The debate_results row is created when the rounds are saved; outcome and the judges' columns stay null until the run ends. A stored row is not an ended run (the coordinator's mistake of 10:43 CST, corrected the same minute).
2. A crashed execution writes one debate_errors row "Workflow did not finish, possible out-of-memory issue"; its node name is not the place of the crash.
3. Measure the rounds' total size on every run; 223,175 characters is the largest stored.

## FOR THE OPERATOR
1. Whether W4 reads the data of the dead execution 42234 (improvement A), knowing the read may take the n8n instance down and may find nothing; W4 will card it with that warning, or it is dropped.
2. Whether the stored rounds of 42234 are regraded dry (improvement B) before another paid run. MEASURED (W4, Wall 11606): a dry regrade builds the same judge and enforcer bodies, 40 to 65% larger than those of run 42071, the last run that finished; it carries the same judging load as the run that crashed. So a regrade of these rounds is NOT offered as safe as the engine stands, and neither is a new run whose rounds reach this size. What would make either safe is improvement C (each seat's rows written as the seat finishes) and improvement D (the size of a replacement round), which are ASK 603 and ASK 604, not yet planned.
No card is open from this AAR.
