# AAR, run 41418 (draft rev 1, W3 seat 33), Wall manual v18 section 7.4 order

Rev 1 answers W1's grade at Wall 10748 (FAIL): form items A1 to A7, content items B1 to B6. Rev 0 was md5 2dafe031, commit 394dbf3a.

## RUN
ODV1-41418-isj5xh5m | live engine 0427ec91, child 47df6892 (the live516b build, W4 10447) | CHALLENGER PREVAILS | panel verdict BROKEN 3-0.

1. Topic: "Did Christ have a biological father?". The run went from 02:41 to 03:48 CST on 11-23, and W4 reported it at Wall 10458.
2. Defender: muse spark 1.3, holding the record's reading. Challenger: sonnet 5.5. The enforcer was luna.
3. The counted panel was terra (chatgpt), sol 6.2 and qwen 4 max.
   - Sol was removed for 6 uncured debate rule violations: E-COL UNCURED 2, COLLISION GRADE UNCURED 2, SEND-BACK SILENCE 2.
   - Gemini was tried as sol's alternate and was NOT SEATED, for 1 uncured item. Then qwen 4 max was SEATED (the run's AUDIT v21 ALTERNATE TRIED lines; W1 10723).
4. The RESULT words split 2 to 1: terra and qwen 4 max say CHALLENGER WINS, and sol 6.2 says UNDERDETERMINED. "3-0" is only the BROKEN tag.

## OBJECTIVE
The run tested one ASK.

1. **ASK 516b C4.** Objective (plan516b.md rev 7): "A run on 516 completes without the out-of-memory crash, with an alternate seated as in 41155, and every judge enforcer call still has THE ROUNDS IN FULL before the model."
   - What it achieves: the enforcer can weigh rows on any point either side laid, at about the memory of 515 rev 7 plus one copy of the rounds for each Build node run.
   - MET.
     - The run ended in success, with no out-of-memory crash.
     - An alternate was seated: qwen 4 max holds 90 enforcer_check rows and 29 send_back rows under seat_role alternate.
     - All 16 judge enforcer calls carry the same rounds text: 132,710 characters, md5 3509d6d3.
     - The enforcer prompt text totals 1,507,588 characters, against 5,806,792 for 41155.
   - W2 graded it PASS at 10459, and closed the open limit at 10472.
2. The fixes written after the run were not tested by it. They are listed under SUGGESTED IMPROVEMENTS.

## REVIEWS
All four 7.3 reviews are posted, and none is missing:
- W4: Wall 10493.
- W3: Wall 10494.
- W1: Wall 10495.
- W2: Wall 10496.

The transcript reads that followed are W4 10510, W1 10511, W3 10512 and W2 10513.

## DEFECTS
Each defect is followed, in brackets, by the seat or read that found it.

1. All three counted judges broke D5 by reading Matthew 1:18 "before they came together" as the union. No keystone line weighed the defender's answer: Matthew 1:24 "took unto him his wife" for the coming together, and Matthew 1:25 "knew" for the union. This goes against ruling 500, that "came together" is the ceremony, which includes living together. [W3 10512 item 2; W1 10511 C2]
2. Sol 6.2 and qwen 4 max put an [L2] gloss on G4905 that the KJV never renders: "including conjugal cohabitation" and "to cohabit conjugally". [W1 10589 and 10596]
3. Every judge read Matthew 1:25 apart from Matthew 1:24, which runs into it as one sentence. K-SU did not fire on it. Separately, the enforcer agreed with the reading of 1:25 alone without the answer's Matthew 1:24 row (rows 51332 and 51333). [W1 10589; W2 10593; W2 10717 B2]
4. The challenger's premise that the flesh comes "from Mary, who is of David's line" has no row behind it. Terra and qwen 4 max spared it; sol 6.2 counted it. [W1 10511 C3; W2 10513 item 3]
5. The enforcer read the defender's answer MEETS on sol 6.2's Matthew 1:18 line, and DOES NOT FOLLOW on qwen 4 max's RESULT. The judges kept their decisions, the readings were record-only, and nothing counted. [W3 10512 item 3]
6. The engine refused sol 6.2's change setting D1 to STANDS, with "no quoted verse states it", though the premise is a chain of verses read together. [W3 10512 item 4]
7. The challenger's bar on Christ's throne rests on Jeremiah 22:30 alone. Coniah is never joined to Jechonias. [W1 10511 C4; W2 10513 item 2]
8. The engine misread sol 6.2's "(L4) fit missing despite (L1) and (L3)" as a claim that L1 was lacking (a false K-UNX item). Sol lowered its defender count from 3 to 2 in answer (rows 51161 and 51162). [W2 10717 B3; W1, ASK 536 plan]
8a. Sol's count was also cut from 3 to 1 by the index-479 K-UNX raise, which counted an answer failure as UNEXHIBITED (rows 51202 and 51203). [W4 10715; W2 10717 E10]
9. Qwen 4 max's lines contradict each other:
   - Premise 5 is counted unexhibited while its own answer check reads MEETS.
   - D2 vs C6 is restated UNDERDETERMINED while its collision line still reads BROKEN.
   - A stale JSON list [1, 2, 5, 6] stands beside the count line naming 2, 5 and 6.
   [W3 10512 items 5 and 6; W2 10513 items 4 and 5]
10. Sol 6.2 writes "WHICH HOLDS: CHALLENGER" beside "RESULT: UNDERDETERMINED". [W2 10513 item 6]
11. A stale recompute note was left after the send-back changed a line back to BROKEN. It changed no count. [W1 10728, E6]
12. One enforcer call graded duplicate lines of the same pair differently. It changed no result. [W1 10732, E7]
13. Eight enforcer rows were stored UNCURED though they were record-only. [W3 10708; W2 10717 E8]
14. The debate_results round columns are named for the Oracle and the engine, not for the sides. [W2 10703; W2 10717 E9]
15. The challenger:
    - misquoted Luke 1:35;
    - named the wrong Greek word at Luke 3:31;
    - set "virgin" for almah at the word layer, where DG-57 puts it at the cross-reference layer.
    [W1 10511 C1, C5 and C7]
16. The defender:
    - quoted "cohabit (conjugally)" against its own reading;
    - never answered almah (H5959);
    - never quoted Jeremiah 22:24.
    [W3 10512 items 8 and 9; W1 10511 D3]
17. The Oracle's own round 4 wrote "[L2] synerchomai to come together, to cohabit". [W3 10719]
18. The transcript is hard to read: [W4 10510]
    - The judges' text fills 79% of the file.
    - Internal codes are shown.
    - "<layer>" and "<quote>" are left unfilled.
    - Sol's removal is shown as two lines.
    - Eight models are listed for three seats.
    - The CR and DR labels confuse readers.
    - The synthesis does not match the counts.

## WHAT WENT RIGHT
1. ASK 516b. The rounds were in every enforcer call with no out-of-memory crash, and an alternate was seated (W2 10459 and 10472).
2. ASK 516b. With the rounds in full, the enforcer weighed the defender's answer and read it correctly in two places: MEETS on sol 6.2's Matthew 1:18 line (row 51401), and DOES NOT FOLLOW on qwen 4 max's RESULT (row 51643) (W3 10512 item 3). No count followed, because both readings were record-only. ASK 523 and ASK 541 now address that.

## WHAT WENT WRONG
Each item names the rule it broke.

**W4**
1. Its review at 10493 called the run clean without reading the transcript. This broke op doc v141 section 30, under which a review reads the run.
2. At 10741 it described a shortened copy as the rolled-back test for ASK 541 (its own correction at 10749). This broke "verify before you assert" (docs/tandem_manual.md).

**W3**
1. Its review at 10494, and its first AAR draft at 10498, called the run clean without reading the transcript. This broke op doc v141 section 30. The coordinator sent that draft at 10499, and the operator replied "the AAR format is wrong".
2. It wrote no audit rows for two corpus writes until W2 found it at 10738: Sight 266 and Sight 1822 at 10:07 CST (now audit row 40064), and the E2 paragraph at 10:49 CST (now audit row 40065). The drift is in journal entry 2156. This broke the operator's note "update the audit table once you're done".
3. Its AAR draft rev 0 (10743) missed section 7.4 in seven places (W1 10748). This broke Wall manual v18 section 7.4.

**W1**
1. Its review at 10495 called the run clean without reading the transcript. This broke op doc v141 section 30.
2. In ASK 536 rev 1, it named sol's rows 51202 and 51203 as known bad without checking which raise made them (W4 10715). In rev 2, it named challenger premise 3's row, which comes from the ASSUMES path (W2 10718). Both broke "verify before you assert".
3. It withdrew its own 10681 item 2(a), which was not a defect (W3 10734). NO RULE COVERS IT; the withdrawal is the correction.

**W2**
1. Its review at 10496 called the run clean without reading the transcript. This broke op doc v141 section 30.
2. It passed ASK 536 rev 1 with sol's rows 51202 and 51203 as known bad, without checking the raise (its own mistake, 10717). This broke "verify before you assert".

**Coordinator**
1. It sent the AAR at 10499 without reading the transcript. This broke the operator's order that the coordinator reads the run transcript before reporting a run.
2. Five AAR snapshot rows were written with no non-builder PASS seat. They were the rows for ASK 502 A1, 527, 526, 523 and 531, and were superseded by rev A1b rows (W2 10738). This broke the rule that grading is done by one non-builder seat (ask_aar_grades_check).

**The judges and the engine**
These are DEFECTS 1 to 12 above. Their fixes are the ASKs below.

## SUGGESTED IMPROVEMENTS
Each ASK is followed by its grades and where its card stands.

Written and read back, but not yet tested by a run (UNEXERCISED):
1. ASK 517, a side's standing comes from its own count only. Written 07:22 CST; W2 read it back CONFIRMED at 10491.
2. ASK 518, a quoted reading is checked whole against its text. Written 07:30 CST; W2 read it back CONFIRMED at 10508.
3. ASK 519, K-W and K-S3 are raised only on a sentence that gives up footing. Written 07:33 CST; W2 read it back CONFIRMED at 10514.
4. ASK 520, no K-UNX where the judge's own answer check grades the press MISSES or FAILS. Written 08:08 CST; W2 read it back CONFIRMED at 10557.
5. ASK 502 A1, the early-alternate calls move off the public key. Written 08:17 CST; W2 read it back CONFIRMED at 10565. Its A2, the revoke, is not yet planned for a card.
6. ASK 527, a judge's reply to a send-back is read and graded. Written 08:43 CST; W2 read it back CONFIRMED at 10579.
7. ASK 524/525, E-ASSUME reads the quoted verses together, for both sides. Written 08:46 CST; W3 read it back MATCH at 10581.
8. ASK 526, the stored counted-premise arrays agree with the count lines. Written 08:51 CST; W1 read it back MATCH at 10583.
9. ASK 523, an uncured enforcer DISAGREE on a deciding line counts against the seat. Written 08:53 CST; W2 read it back CONFIRMED at 10585.
10. ASK 531, a premise that both readers find unsupported, spared and left uncured, counts against the seat. Written 10:01 CST; W2 read it back MATCH at 10661.
11. ASK 537, the Oracle answers a one-verse restriction from the chain and restates the questions left unanswered. Written 10:21 CST; W2 read it back CONFIRMED at 10694.
12. ASK 539, the map drift fix. Build PASS by W2 at 10722. Written 10:41 CST (W4 10726); W2 read it back MATCH at 10729.
13. ASK 530, the enforcer engages answer rows, record-only, as a trial. Written 10:41 CST (W4 10726); W2 read it back MATCH at 10729. The card to release the paid replay is in W4's thread.

Graded, with the write card not yet with the operator:
14. ASK 536, the false K-UNX on "(L4) fit missing despite (L1) and (L3)". Plan rev 2a PASS by W2 at 10722. Build PASS by W2 at 10733. Script edits CONFIRMED by W2 at 10736. The write card is next, in W4's thread.
15. ASK 541, relabel the record-only UNCURED rows as RECORD-ONLY. Plan PASS by W2 at 10727. Build PASS with one condition by W2 at 10739; the condition was met at 10742. W4 corrected one test description at 10749. The write card is in W4's thread.
16. ASK 528, a 7.3 review must read the run's transcript (Wall manual v19, op doc v142). Previews MATCH by W2 at 10738. The card comes after 536, in W3's thread.
17. E9, a read-only view of the debate rounds by side. PASS by W2 at 10736. The card comes after 528, and W4 applies it.

Planned:
18. ASK 532, a press needs a footed premise before E-GATE calls it a BROKEN ground. Plan PASS by W1 at 10600, with four requirements. W4 is building it.
19. ASK 533, a judge's [L2] gloss on a collision line is held to the KJV's own renderings. Plan rev 0 is at 10744, and W2 grades it.
20. ASK 534, K-SU reads a verse with its whole KJV sentence. Plan rev 0 PASS WITH CONDITIONS by W3 at 10746; rev 1 PASS by W3 at 10752. W4's replay is next.
21. ASK 529, a transcript that readers can follow (Format Markdown and Plain Rule Lines). Rev 0 FAIL by W2 at 10745; rev 1 PASS by W2 at 10753. The build is held until transcript work is released.
22. ASK 542, sol's 3-to-1 K-UNX through the unxAcFail round tag. W1 is planning it; there is no plan yet.

Written to the corpus:
23. E2, "out of the loins is seed", in Sight 1822. Written 10:49 CST on the operator's card; W2 read it back CONFIRMED at 10738.

Closed:
24. ASK 535, covered by ASK 531. It reopens if the proof run shows a spare that rests on an IMPOSED line (W1 10735).
25. ASK 538, NOT NEEDED (W1 10674).
26. ASK 540, NOT NEEDED; ASK 527 covers the case (W3 10706).
27. ASK 543, NOT NEEDED (W3 10734; W2 agreed at 10736).

Next: the proof run, after ASK 532 and ASK 536 are live, tests rows 1 to 23.

## KNOWLEDGE BASE
1. YES (W3 10494): a judge enforcer call carries about 3.2 characters of the rounds per token, not 4. This is W4's fit at 10458 item 5, not a tokenizer count.

## FOR THE OPERATOR
1. ASK 536 write card, in W4's thread (next).
2. ASK 541 write card, in W4's thread.
3. ASK 530 paid replay release card, in W4's thread.
4. ASK 528 manuals write card, in W3's thread, after 536.
5. E9 view write card, applied by W4, after 528.
6. E1, a ruling asked: the Oracle's missing dio, almah, Luke 1:56 and Deuteronomy 20:7.
