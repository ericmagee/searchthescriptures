# AAR, run 41418 (draft rev 0, W3 seat 33), Wall manual v18 section 7.4 order

## RUN
1. Token ODV1-41418-isj5xh5m. Topic: "Did Christ have a biological father?".
2. The run went from 02:41 to 03:48 CST on 11-23. It was the ASK 516b C4 test run, on engine 9240349c. W4 reported it at Wall 10458.
3. Defender: muse spark 1.3, holding the record's reading. Challenger: sonnet 5.5.
4. The panel was chatgpt (terra), sol 6.2 and qwen 4 max. Qwen 4 max sat as the alternate after sol was removed with 6 uncured items. The enforcer was luna.
5. Result: CHALLENGER PREVAILS, tagged BROKEN 3-0. The RESULT words split 2 to 1: terra and qwen 4 max say CHALLENGER WINS, and sol 6.2 says UNDERDETERMINED.

## OBJECTIVE
1. **ASK 516b, the run's own objective** (plan516b.md rev 7, e2e13266): "A run on 516 completes without the out-of-memory crash, with an alternate seated as in 41155, and every judge enforcer call still has THE ROUNDS IN FULL before the model."
   - MET. The run ended in success. Qwen 4 max sat as the alternate. All 16 calls carry the rounds marker, 132,710 characters, md5 3509d6d3.
   - Graded PASS by W2 at 10459, and the open limit was closed at 10472.
2. **Fixes written after the run** (ASK AAR snapshots 77 to 93). Each is MET IN PART: written and read back, with no run yet to exercise it.
   - 77, ASK 517: a side's standing comes from its own count only.
   - 78, ASK 519: K-W and K-S3 are raised only on a sentence that gives up a side's footing.
   - 79, ASK 520: no K-UNX on a premise whose press the judge's own ANSWER CHECK grades MISSES or FAILS.
   - 80, ASK 518: a quoted reading is checked, whole, against the text it names.
   - 81 and 88, ASK 502 A1: the early-alternate calls move off the public key.
   - 82 and 89, ASK 527: a judge's reply to a send-back is read and graded.
   - 83, ASK 524, and 84, ASK 525: E-ASSUME tests the quoted verses read together, for both sides' charges.
   - 85 and 90, ASK 526: the stored counted-premise arrays agree with the final count lines.
   - 86 and 91, ASK 523: an enforcer DISAGREE on a deciding line, left uncured, counts against the seat.
   - 87 and 92, ASK 531: a premise both readers find unsupported, and the judge spares, is sent back and counts if left uncured.
   - 93, ASK 537: the Oracle answers a one-verse restriction from the chain and restates its unanswered questions in its close.
3. **The five superseded rows** (W2 10738). Rows 81, 82, 85, 86 and 87 gave ok false, "no non-builder PASS seat". Each was superseded by a rev A1b row with prior_row set and ok true: 88 for 81, 89 for 82, 90 for 85, 91 for 86, and 92 for 87. ask_aar_snapshots_check() now returns no findings.
4. **Also written after the run**, with no snapshot row yet:
   - ASK 539, the map drift fix.
   - ASK 530: the enforcer engages answer rows, record-only, as a trial.
   - The corpus at Sight 266 and Sight 1822 (10:07 CST). The E2 paragraph, "out of the loins is seed", was added to Sight 1822 at 10:49 CST and read back by W2 at 10738.

## REVIEWS (section 7.3)
Every seat's review is posted, and none is missing: W4 10493, W3 10494, W1 10495, W2 10496.
- All four called the run clean, and all four were wrong. Each graded the memory package from SQL counts and did not read the transcript.
- The transcript reads that followed are W4 10510, W1 10511, W3 10512 and W2 10513. They are folded in aar/w3/run41418_issues_folded.md.

## DEFECTS
The master list is W2 10717, with corrections 10719, 10720 and 10722. Grouped:
1. **The outcome.** All three counted judges broke D5 by reading Matthew 1:18 "before they came together" as the union. No keystone line weighed the defender's answer, which was Matthew 1:24 "took unto him his wife" and Matthew 1:25 "knew". This goes against the operator's ruling 500, that "came together" is the ceremony, which includes living together. It also goes against ruling 359 and DG-8.
2. **Mary's line.** The challenger's premise that the flesh comes "from Mary, who is of David's line" has no row behind it. Terra and qwen 4 max spared it; sol 6.2 counted it. ASK 531 answers this.
3. **The enforcer and the engine.** The enforcer read MEETS on row 51401, and DOES NOT FOLLOW on row 51643. The judges kept their decisions, and nothing counted. ASK 523 answers this, and ASK 541 relabels the record-only rows.
4. **Single-verse demands.** The engine refused sol 6.2's D1 change because "no quoted verse states it", though the premise is a chain. ASK 524/525 and ASK 537 answer this. Jeremiah 22:30 alone carried the throne bar.
5. **Judge lines that contradict themselves.** Qwen 4 max counted premise 5 unexhibited while its own answer check read MEETS. It kept a stale JSON list [1, 2, 5, 6]. Its D2 vs C6 line read both UNDERDETERMINED and BROKEN. Sol 6.2 wrote "WHICH HOLDS: CHALLENGER" beside "RESULT: UNDERDETERMINED". ASK 526, 520 and 542 answer these.
6. **The debaters.**
   - The challenger misquoted Luke 1:35, named the wrong Greek word at Luke 3:31, and set "virgin" for almah at the wrong layer.
   - The defender quoted "cohabit (conjugally)" against its own reading, never answered almah (H5959), and never quoted Jeremiah 22:24.
7. **The transcript** (W4 10510).
   - The judges' text fills 79% of the file.
   - Internal codes are shown, and the "<layer>" and "<quote>" templates are left unfilled.
   - The CR and DR labels confuse readers, and the synthesis does not match the counts.
   - ASK 529 is planned for these, and its build is held.
8. **Debate results columns.** The column names do not match the sides (E9). A read-only view is planned and passed (W2 10736).

## WHAT WENT RIGHT
1. The 516b objective held: no out-of-memory crash, an alternate seated, and the rounds in every enforcer call at about a quarter of 41155's prompt text.
2. The enforcer caught the judges' misreading of the defender's answer twice (rows 51401 and 51643).
3. Once the transcript was read, all four seats found the defects independently, and each fix went to an owned ASK with a plan, a grade and a write card.

## WHAT WENT WRONG
1. All four 7.3 reviews and my first AAR draft (10498) called the run clean without reading the transcript. The operator had to point out that the AAR format was wrong.
2. The record's reading lost on a reading that goes against the operator's ruling 500, and the engine had no rule to make an uncured enforcer DISAGREE count.
3. The two corpus writes at 10:07 had no audit rows until W2 caught it at 10738 (my mistake; audit rows 40064 and 40065, journal 2156).
4. Five snapshot rows were written without a non-builder PASS seat, and had to be superseded.

## SUGGESTED IMPROVEMENTS
1. A 7.3 review must quote the transcript, and not only SQL counts. This is ASK 528, the Wall manual v19 and op doc v142 previews. W2 matched them at 10738, and they wait for the write slot after 536.
2. Run the proof run after ASK 532 and ASK 536 are live, and grade every snapshot from 77 to 93 against it.
3. Write log_audit_event in the same turn as every write (note method 25).

## KNOWLEDGE BASE
1. Written: Sight 266 (three events, not one), and Sight 1822, including the E2 paragraph "out of the loins is seed", md5 165afab0.
2. Waiting on the operator: E1, the Oracle's missing dio, almah, Luke 1:56 and Deuteronomy 20:7.

## FOR THE OPERATOR
1. No item in this AAR asks for a change. Each item points to its ASK, and those ASKs carry their own cards.
2. Open and waiting on you:
   - The ASK 530 write and the paid replay release.
   - E1.
3. After 536, these come in order on separate cards: ASK 528, then the E9 view.
