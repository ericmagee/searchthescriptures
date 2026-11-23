# AAR, RUN 41736 (FINAL rev 6, W3)

Anchor: W4 run report, Wall 10868. Order: the_wall_manual v19 section 7.4. This draft authorizes nothing.

## RUN
Proof run ODV1-41736-qtw0w6t1, 13:04 to 13:48 CST 11-23. Debate engine version 5a2b6a75, child workflow 160a67e3, Library 92e0439c65b287f9. The Oracle (spark) defended against Claude Sonnet 5.5, plain, as challenger, on "Did Christ have a biological father?". Outcome "UNGRADED — REVIEW"; panel verdict CONTESTED; one of three judges counted.

## OBJECTIVE
Each ASK written today, its objective as posted before the run (its ask_aar_snapshots row), and whether this run met it. An ASK whose path the run did not fire is UNEXERCISED, not met.
1. ASK 516 A2. Objective: every judge enforcer call carries the rounds in full, with no out-of-memory crash. Met: the run ended in success.
2. ASK 517. Objective: a side's standing follows its own count only, and no side wins with its own link broken. In part: every challenger standing read SELF-SUPPORTED at a count of 0. The broken-link test was reached only through the false closing contradiction (DEFECTS 1).
3. ASK 518. Objective: a quoted reading is checked whole against the text it names. Not traced by any review.
4. ASK 519. Objective: K-W and K-S3 are asked only about footing. Not traced.
5. ASK 520. Objective: K-UNX is not raised on a press the judge grades MISSES. Not traced on its own; see ASK 542.
6. ASK 521. Objective: the AAR grade check counts one non-builder PASS. Not a run item; met at its readback.
7. ASK 502 A1. Objective: the engine's early-alternate calls move off the public key. Not traced.
8. ASK 523. Objective: an uncured DISAGREE on a deciding line counts against the judge. Not traced.
9. ASK 524 and 525. Objective: the assumption enforcer tests both sides' charges. Not traced.
10. ASK 526. Objective: stored counted-premise arrays agree with the final count lines. Not traced. sol62's count line names no premises (DEFECTS 6).
11. ASK 527. Objective: send-back replies in the Sn RESPONSE form are read and graded. UNEXERCISED: none of the 10 send-backs used that form (W2 10872 item 8).
12. ASK 530. Objective: the enforcer records whether a deciding step weighs the answer it quotes. Met, record-only: 26 E-ONE TRIAL rows (W1 10871; W2 10872 item 9).
13. ASK 531. Objective: a judge who spares an unsupported premise is sent back and counted. It fired: sol's S21 was counted (W2 10872 item 7). W2 traced (10892) a false NOT APPLIED on that item (DEFECTS 5). Without the S21 count, sol's drv_uncured would be 3, and the seat would still be removed.
14. ASK 532. Objective: a press needs a footed premise before the gate calls it a broken ground. Met on the stored rows: 43 E-PRESS rows, 13 NOT FOOTED, and the judges graded MISSES there (W2 10872 item 3; W1 accepts at 10876).
15. ASK 533. Objective: a judge's [L2] gloss is held to the KJV renderings of its Strong's number (TRIAL). In part: it was cured on the alternates only (gemini, qwen4max, argon), and was UNEXERCISED on the panel.
16. ASK 534. Objective: K-SU reads a quoted verse with the rest of its KJV sentence. Met: it was cured on all seats, for example sol62's "Matthew 1:25 within Matthew 1:24-25" (W1, W2, W4).
17. ASK 536. Objective: K-UNX reads "missing despite" counts correctly. UNEXERCISED: no count line used "despite" (W1; W2 10872 item 1).
18. ASK 537. Objective: the Oracle names a one-verse restriction, and restates unanswered questions in its close. In part: a GAPS line is present in the defender's round 4 (W1 10871). The restriction complaint was not traced.
19. ASK 539. Objective: no false "library drift" stop when an alternate is offered. Met on the stored rows: the alternates ran with 0 drift stops (W2 10872 item 10; W1 accepts at 10876). The child's library check node was not read.
20. ASK 541. Objective: rows the engine treats as record-only are stored RECORD-ONLY, and counted rows stay UNCURED. FAILED on 3 rows, with no count moved (W2 10872 item 2; W4 10874 and W1 10876 agree; W4 10881 adds row 52225):
    - row 51983 (sol's E-ASSUME S21) is counted but stored RECORD-ONLY;
    - row 52025 (sol's E-GATE G2) is not counted but stored UNCURED;
    - row 52225 (argon) is not counted but stored UNCURED (W4 10881).
21. ASK 542. Objective: the ASK 520 exemption reads the ANSWER CHECK under any round 2 to 4 tag. Met on the stored rows: Luke 1:35 was graded MISSES under [CR4] for sol and sol62, and no general-raise K-UNX followed (W2 10872 item 5; W1 accepts at 10876).
22. ASK 528. Objective: each 7.3 review states what it read. Met: all four reviews carry the READ line.
23. The rounds-by-side view (no ASK number; written 12:51): not a run item.

## REVIEWS
- W3: Wall 10869.
- W4: Wall 10870, corrected at 10874.
- W1: Wall 10871, corrected at 10876.
- W2: review at Wall 10873; grade of the run's changes at 10872 (commit 2d737928); traces at 10892.
- ASK AAR snapshot check (op doc s29, ASK 497 and 498): row 114 (ASK 541, 3 rows; replaces row 112) was re-checked by W2 at 10887. row_md5 equals the project-chat line; no check_code a, b, c or e; grades_check is ok true.

## DEFECTS
1. The ENFORCER (luna, as close enforcer) confirmed a false closing contradiction. Found by W4, W3, W1 and W2; W4 told the operator under ASK 427 at 13:58 CST.
   - The rows are 51653 and 51655.
   - In round 3 the challenger dropped the limb "the clause names no human father" under LINK 3: NARROWED TO. The same round's LINK 1 (SUPPORTED) already ends "no human father stands in the begetter's place".
   - The round 4 sentence restates LINK 1, so under luna's own instruction it "does not assert it again" (W4 10874).
   - The cure set D2 vs C1 and D3 vs C1 to CHALLENGER LINK BROKEN for all three judges. Before it, each judge's RESULT read CHALLENGER WINS (AUDIT v25). After it, each read UNDERDETERMINED, and the outcome became UNGRADED.
2. ASK 541 storage (found by W2; traced by W4 at 10878 and 10881). Three rows are stored with the wrong status, listed under OBJECTIVE item 20. No count moved, because the engine does not read the table back. The judge fault ledger, however, reads the stored status. Neither row has a ledger row now. Two causes:
   - The engine labels E-ASSUME cures "CURE (record-only until promoted)", which is 541's marker M2, although ASK 531 made E-ASSUME counted. This affects row 51983 only.
   - Uncounted gate rows end in " (RECORD-ONLY)", which is not one of 541's markers. This affects rows 52025 and 52225, and 98 older E-GATE rows in 36 runs.
3. pkgBFX, the K-UNX range (found by W1). The K-UNX item says the list against the defender holds premises 1 to 5, but the defender's round 2 lists 6 (PREMISE COUNT: 6). The rows are 51726 (sol62, count to 2), 51739 (chatgpt), 52025 (sol) and 52062 (qwen4max). Cause, as W1 measured it in plan 10875: the range check finds blocks by the heading "LINK <number>", so the block "LINK none [premise 6]" is skipped, 5 blocks are found, and premise 6 is called out of range. In run 41090, two "LINK none" blocks made the check say 1 to 4.
4. sol's removal sum (found and traced by W2, 10872 and 10892). This is a label defect. The pkgRMR reader (rmrOf) counts sol's AUDIT v37 line "not counted on this row: ... an item left uncured there is counted in drv_uncured" as an UNREAD COUNTED LINE. So REMOVED FOR shows 5 against the true drv_uncured of 4. The removal text is wrong, and no count moved.
5. False NOT APPLIED (found by W2, 10892). In sol's S21 change, premises 4 and 5 are spared both before and after the change. pkgPS still ruled that "the change regrades premises 4, 5" (E-APPLY row 52069). G2's later rewrite cured it (row 52024), and the count stands at [1,2,3,6]. Whether v65 should still count S21 as ASSUMPTION UNCURED is not traced. The outcome did not change.
6. sol62's count grounds (found by W3). sol62's CONCEDED LINKS line names no counted premise (AUDIT v50). This repeats 41418 item 10.
7. "Came together" read as union (found by W3). All three judges break D5 by reading Matthew 1:18 "came together" as conjugal. This is a panel measure outside ruling 383; ruling 500 holds that the words mean the ceremony. It repeats 41418.
8. Panel seating (W4). sol62 was removed with 1 uncured item and sol with 4. The alternates gemini, argon and qwen4max were each not seated, with 1 uncured item each (K-G7, E-GATE and K-W). One judge was counted.

## WHAT WENT RIGHT
- ASK 534: K-SU was cured on all seats (W1 10871, W2 10872, W4 10870).
- ASK 532: the NOT FOOTED presses matched the judges' MISSES grades (W2 10872).
- ASK 530: 26 E-ONE record-only rows (W1, W2).
- ASK 542: no general-raise K-UNX was raised on a [CR4] MISSES (W2 10872).
- ASK 539: the alternates ran with no drift stop (W2 10872).
- ASK 528: every review carries a READ line.
- drv_uncured equals the AUDIT lines on all three seats (W2 10873).

## WHAT WENT WRONG
1. DEFECTS 1, the false closing contradiction. NO RULE COVERS IT. It is a live ENFORCER failure under operational_doc 27 (second failure class) and section 29 (ASK 427): W3 10869, W4 10870 and 10874, W1 10871, W2 10873.
2. DEFECTS 2, ASK 541 storage. It breaks ASK 541's objective (W2 10873).
3. DEFECTS 3, the pkgBFX range. NO RULE COVERS IT (W1 10871).
4. DEFECTS 4, the removal sum. NO RULE COVERS IT (W2 10873, 10892).
5. DEFECTS 5, the false NOT APPLIED. NO RULE COVERS IT (W2 10892).
6. DEFECTS 6, sol62's count grounds. It breaks the engine_manual section 8 count rule (W3 10869).
7. Seat mistakes in the reviews:
   - W3 10869, W4 10870 and W1 10871 listed "541 RECORD-ONLY rows" under WHAT WENT RIGHT by counting the labels only. W4 withdrew it at 10874 and W1 at 10876; W3 reports it here.
   - W1 10871 named 542, 532 and 539 as not shown; W1 accepted W2's stored-row reads at 10876.
   - W4 10870's claim that luna's LINK 3 rows ruled the same drop NOT A CONTRADICTION was withdrawn at 10874.

## SUGGESTED IMPROVEMENTS
1. ASK (number to be assigned), pkgCKL: the close ENFORCER no longer charges a closing sentence that restates what the same round kept under its own link because a different link was narrowed or dropped. The confirm becomes NOT CONFIRMED (kept link), recorded and not applied. Expected effect in 41736: D2 vs C1 and D3 vs C1 are not cured to BROKEN, and each RESULT stays as its judge wrote it (CHALLENGER WINS). A true same-link confirm (41024 row 47150) still applies. Planner and builder W4; grader W1; W4 writes on a card. Plan rev 0 at Wall 10877 (askPENDING_ckl/w4/plan_ckl.md, 4,380 characters, md5 c4338944; inputs committed a3926654). Scope: one engine node (Close Enforcer Record), code only. No prompt, model, setting, Library or child change. Its 0.75 word-share threshold is set by the package, and is a guess outside the measured cases. Grades: W1 FAILED rev 0 on form at 10883: SEARCH did not name the 3 workflow ids the engine calls, and INPUTS IN GIT had no commit. The content holds. Rev 1 is posted at 10886, not yet graded. Card: not with the operator.
2. ASK (number to be assigned): the pkgBFX K-UNX range check stops calling a listed premise answered under a "LINK none [premise N]" block out of range. Planner and builder W1; grader W2; W4 writes on a card. Plan rev 0 at Wall 10875 (askbfx/w1/plan_bfx.md, 3,631 characters, md5 9d732d93, commit 1b51b5df). Scope: Shared Library line 467 in the engine and the child, plus one new helper. The size of the code change in characters is not stated in the plan. Grades: W2 PASSED it with 2 conditions at 10890 (askbfx/w2/w2_grade_plan_bfx.md, md5 cd131aae):
   - A: the helper line goes into all 15 MAP stub nodes that carry line 467, and C3 shows that each stub defines bfx544Block;
   - B: build on a fresh live readback taken at build time.
   Card: not with the operator.
3. ASK (number to be assigned), 541 fix option A (database only). Each stored enforcer row's status matches whether the engine counted it:
   - enforcer_status_stored gains marker M4 (" (RECORD-ONLY)");
   - M2 does not apply to "ENFORCED, pkgACX";
   - the 3 rows written since the 541 write are relabelled under a guard (52025 and 52225 to RECORD-ONLY, 51983 to UNCURED);
   - the 371 older rows are left alone, under 541's policy.
   Planner and builder W4; grader W2; W4 writes on a card. Plan rev 0 is at Wall 10881 (1,925 characters, the post; measure541A.sql committed 87327c3b). No engine change. Grades: none yet. Card: not with the operator.

## KNOWLEDGE BASE
NONE: all four reviews answered NO.

## FOR THE OPERATOR
1. ASK numbers for SUGGESTED IMPROVEMENTS items 1 (pkgCKL, the close enforcer), 2 (pkgBFX, the K-UNX range) and 3 (the 541 fix A). All three plans are posted. pkgBFX has passed with conditions; pkgCKL rev 1 and the 541 fix are in grading. Their build and write cards come after.
2. Engine manual v235 card (entries for ASKs 518 to 542): held until this AAR is sent.
