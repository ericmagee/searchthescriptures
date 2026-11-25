# AAR, run ODV1-42528-dqwbcshc, compared with the runs before it

## RUN
- ODV1-42528-dqwbcshc. Cost $11.19 ($7.54 of it judging). Outcome UNGRADED: no counted verdict. Engine 2df7f6fa, child aad0ad9c.
- Defender hydrogen (the Oracle). Challenger spark. Panel that sat: qwen4max, sol, sol62.
- Compared with the three runs before it, all on the same topic:
  - Run 42373: judged, UNDERDETERMINED, panel BROKEN 2-1. Stored cost $10.12; true cost about $11.45.
  - Run 42505: stopped in round 4 on the Anthropic usage limit. No verdict. Cost not stored.
  - Run 42517: all eight rounds, then the panel failed on judge hydrogen. No verdict. Cost $3.82.
- No run since 42528. Live now: engine 3b72583c, child aad0ad9c. State of every item as of 06:05 CST 11-25.
- The other parts of the report (objective, reviews, what went right, what went wrong, suggested improvements, knowledge base) stand as in the first report of this run, Wall 11953.

## IMPROVEMENTS SINCE THE LAST RUNS
Each is an earlier defect that run 42528 shows fixed.
1. Panel send-backs reach the judges (ASK 611 fix 2). Run 42373: 53 of 58 not sent, none answered. Run 42528: 54 sent, 54 answered.
2. The Oracle's close answers every pressed verse (ASK 628). Run 42373: 20 of 31 left unanswered. Run 42517: 17 of 17 answered. Run 42528: 15 of 15 answered.
3. The stored cost is the whole cost in dollars (ASK 627). Run 42373: nine question-round calls unpriced, $1.33 missing. Run 42528: 84 priced calls equal the stored $11.19; the question round is in it at $2.07.
4. A run finished. Runs 42505 and 42517 ended with no outcome. Run 42528 ran every stage and wrote no error row.
5. The question round runs by the OpenRouter route for both debaters (ASK 588). Run 42373 used the Anthropic route only.
6. Three changes have their second clean run and pass under the two-run rule: the judge order page (ASK 591), Haiku out (ASK 593), no judge on a debater's model (ASK 601).
7. First clean run for five more: the shared reply blocks (ASK 579), hydrogen as a debater (ASK 623), the word-meaning check (ASK 586 J2), the unsent enforcer disagreement (ASK 586 J6), the closing check (ASK 590).

## DEFECTS NOT RESOLVED
Still present in run 42528:
1. Rounds called a second time with nothing barred. Runs 42373 (five, $1.65), 42517 (one), 42528 (three, $0.73). ASK 633: cause found (the layers check fired; the record line is wrong); plan graded PASS, not built.
2. Negative input-token counts in the cost record. Run 42373: one entry. Run 42517: five. Run 42528: one. Dollars are right. ASK 632: written to the engine 11-25, after the run; unexercised.
3. The agreement step asks seats that cannot sit. Run 42373: sonnet. Run 42528: three Google seats beside a Google defender, $0.08. No ASK number.
4. No run-start check before the run. Runs 42373, 42505, 42517 and 42528. The fixed tool is now in the tools folder; no run has been started with it.
5. The challenger's count cut with no premise named. Run 42373: sol and sol62, 2 to 1. Run 42528: sol, 2 to 1. Record-only; it removes no seat. No ASK number. MY MISTAKE: the first AAR of run 42528 did not report this.
6. The synthesis lists items as charged by neither side that a closing premise list carries. Run 42373: four. Run 42528: five. No ASK number. MY MISTAKE: not reported in the first AAR of run 42528.
7. The defender quotes Matthew 1:20 without "Joseph, thou son of David" just before it. Run 42373: the defender's round 2. Run 42528: the defender's rounds 1 and 3. A record line only; no ASK number.
8. A disagreement counted as a concession (ASK 624 part 1). Present in all three judges of run 42528. RULED by the operator 04:41 CST 11-25: "conceded or call it forfeited". The counting stands; no change.
9. The reserve seat was "none" again, as in run 42517. Run 42528 was before the fix (ASK 629).

Fix written, not yet exercised by a run:
10. A judge's unreadable reply ends the run with no verdict (run 42517). ASK 629 (the first free seat becomes the reserve; the failure names its cause) and ASK 635 (hydrogen's output limit raised to 131,072): both live since 11-25.
11. A premise list thrown out for its numbering and called a forfeit (run 42373). ASK 626: live. The lists of run 42528 were read without it.
12. A judgment whose result contradicts its own lines (run 42373, chatgpt). ASK 624.5: live. No such judgment arose in run 42528.
13. The child reads the engine's library (ASK 578): the call ran in run 42528; the reply was cut, so nothing after it ran.
14. The enforcer's backup seat with an OpenAI debater (ASK 608): run 42517 billed its calls and stored no row. No completed run.
15. Still unexercised from run 42373: ASK 587 parts B, C1, D; ASK 595; ASK 594; ASK 607; ASK 586 J1 and J3; neon as a judge (ASK 623).

Fix not written:
16. A failed panel leaves no failure note on the row (run 42517). ASK 630: approved by the operator, built, engine part graded PASS, database part held for a test. Not written.
17. A failed panel loses the paid enforcer rows and good judgments (run 42517). ASK 631: same state as ASK 630.
18. A run that stops in the rounds stores no cost (run 42505). No ASK number.
19. The Anthropic usage limit (run 42505). Access returns 18:00 CST 11-30. Runs 42517 and 42528 used no Anthropic debater. The operator's question is open.

## NEW DEFECTS
Not in any of the three earlier AARs.
1. Five paid verdicts, none counted. Three panel judges and one alternate removed; the other alternate failed. $7.54 of judging for no verdict.
2. Three of sol's nine counted items were made by the engine. It refused sol's corrected lines at the gate because it looked for a line that was never in the text. ASK 634: cause confirmed; no plan yet.
3. The alternate sonnet failed twice on its output limit, $2.16. The same seat was offered twice. No ASK number.
4. Judges answer send-backs with pointers ("remains as corrected above") in place of lines. Nine of sol's changes; all refused. No ASK number.
5. One question-round answer was cut at 4,000 output tokens and passed its check. No ASK number.
6. A follow-up question quoted the question itself as the part not answered. No ASK number.
7. The panel of the operator's order (gemini, qwen4max, hydrogen) could not sit beside these debaters, and the row does not say why a seat was left out. No ASK number.
8. The rounds are lopsided: defender link round 77,969 characters and close 52,171; challenger close 3,394. 30 of 262 word tags not counted (run 42373: 4 of 301).

## JUDGES' REASONING
Judgments read: qwen4max, sol, sol62 (panel) and chatgpt (alternate). Read: each judge's deciding lines and every enforcer disagreement left uncured. NOT READ WHOLE: the full reasoning text of the four.
1. qwen4max, sol, sol62. Verdict BROKEN and "WHICH HOLDS: CHALLENGER" beside "RESULT: UNDERDETERMINED". Each says the challenger's own route from David through the woman is not shown. Checked against the judgment's own lines. ASK 624 part 3. NO RULE COVERS IT.
2. qwen4max, sol, sol62. A premise the defender answered is counted "unanswered", and the same link is also graded BROKEN. One failing charged twice; it makes the defense COLLAPSED. sol's own words: "These are exhibited but unsuccessful answers, not silence or stated surrenders". Checked against the answer-check lines: none reads "no answer". ASK 624 part 1, ruled 04:41 CST 11-25; the counting stands.
3. qwen4max. Grades D1 vs C3 against the defender while counting the challenger's premise 3 as not shown on the same point. Checked against the judgment's own lines. ASK 624 part 3. NO RULE COVERS IT.
4. qwen4max. RESULT line. The enforcer read it twice as DOES NOT FOLLOW: it rests on the claim that Galatians 4:4 "gives no house", and it names no rows for the challenger's unshown route. The judge kept it. Rule: the result check (E-RES). Counted; it removed the seat.
5. sol62. Answer check on Matthew 1:23. The enforcer read the defender's close as meeting the press; the judge kept FAILS, and the reason quotes only scripture, not the defender's answer. Checked against the defender's close. ASK 624 part 2. Rule: the answer check (E-ANS). Counted; it removed the seat.
6. sol. At the send-back sol wrote "CHALLENGER CONCEDED LINKS: 4 -- Counted premises are 2, 3, 4, and 5". The stored judgment counts 1. The change was refused because it did not count the assumed premise the enforcer named. The judge's last word on the challenger is not in the stored judgment. Rule: the assumption check (ASK 531). NO ASK NUMBER for the gap.
7. sol. Nine send-back answers point to a line ("remains as corrected above") in place of writing it. All refused. NO RULE COVERS IT. Three of them then became engine-made charges (ASK 634).
8. chatgpt (alternate). At the send-back it regraded D1 vs C3 and D5 vs C1 from UNDERDETERMINED to STANDS for the defender, and raised the challenger's conceded links to 4. All three changes were refused for their form. The stored judgment reads BROKEN with 2. Rule: the UNDERDETERMINED check and the assumption check (ASK 531). NO ASK NUMBER for the gap.
9. qwen4max, sol, sol62, chatgpt. The reference line on Matthew 1:18 quotes a second sentence that is not the challenger's own MEANS sentence (sol's is not in the form). Checked against the challenger's round 1. A trial rule (K-R); it removes no seat.
10. Quotations. 70 round quotations in the three panel judgments (26, 30, 14) were checked against the round each names. All 70 are in that round. No misquote found.
11. PANEL MEASURE against drift guard 8 (outside ruling 383; not a fault, not a build). All five verdicts written go against the guard's reading. qwen4max: "the begetting the defender places in the espousal is not the source the text names"; the guard reads "of the Holy Ghost" as the covenant-origin and anointing marker, not paternity. sol and sol62 use the finding before they "came together" with the abstinence to defeat the begetting; the guard reads "came together" as the taking under one roof and places the begetting before it.

## STATUS OF ALL OBSERVATIONS
One line for every defect, suggestion and question of the three earlier AARs.
Run 42373:
1. No panel send-back sent. FIXED (ASK 611 fix 2). One more clean run owed.
2. False "LINK ROUND FORFEITED". LIVE AND UNEXERCISED (ASK 626).
3. Challenger's count cut with no premise named. OPEN, seen again. NO ASK NUMBER.
4. chatgpt's result contradicts its own lines. LIVE AND UNEXERCISED (ASK 624.5).
5. The synthesis gives no verdict. OPEN, not seen in run 42528. NO ASK NUMBER. Its second part (items charged by neither side) seen again.
6. Five rounds called twice with nothing barred. OPEN, seen again (ASK 633, plan graded PASS, not built).
7. Cost record leaves out calls. FIXED for the dollars (ASK 627). Resend and Close Group Retry calls not shown yet.
8. Agreement step asks a seat that cannot sit. OPEN, seen again. NO ASK NUMBER.
9. My wrong column name in a record row. CLOSED (correcting row in).
10. Judge spark wrote a line against itself and was removed. CLOSED: the model's own; spark did not judge in run 42528.
11. Defender's close left 20 verses unanswered. FIXED (ASK 628). New verse in the close: not seen in run 42528. Matthew 1:20 quote: seen again.
12. No run-start check. OPEN, seen again on every run since. NO ASK NUMBER.
13. Suggestion: fix 2 for the send-back. FIXED (ASK 611 fix 2).
14. Suggestion: a standing pre-run check that no panel send-back reads "no panel request". OPEN. Met in run 42528 (none), but no pre-run sheet was made for the last three runs; they were not announced. NO ASK NUMBER.
15. Suggestion: the list reader accepts bold or heading numbers. LIVE AND UNEXERCISED (ASK 626).
16. Suggestion: a result for one side beside WHICH HOLDS for the other is sent back. LIVE AND UNEXERCISED (ASK 624.5).
17. Suggestion: judge run 42373 again with the send-back repaired. OPEN. Not ordered. NO ASK NUMBER.
18. The judges' reasoning review (ASK 624). Part 1: CLOSED, ruled by the operator, no change. Parts 2 to 4: OPEN; parts 2 and 3 counted again on run 42528; nothing is planned. Part 5: LIVE AND UNEXERCISED (ASK 624.5).
Run 42505:
19. Stopped on the Anthropic usage limit. OPEN, with the operator. NO ASK NUMBER.
20. A stopped run stores no cost. OPEN. NO ASK NUMBER.
21. No run-start check and no launch notice. OPEN, seen again. NO ASK NUMBER.
22. Question to the operator: raise the limit, or use debaters that are not Anthropic models. NOT ANSWERED. The two runs since used no Anthropic debater.
Run 42517:
23. One judge's failed reply ended the run. LIVE AND UNEXERCISED (ASK 629, ASK 635).
24. The saved row does not carry the failure. NOT WRITTEN (ASK 630: approved and built).
25. Close enforcer work paid and not recorded. NOT WRITTEN (ASK 631: approved and built).
26. Challenger called again in round 1 with nothing barred. OPEN, seen again (ASK 633).
27. No run-start check; judge order changed one minute before launch. OPEN, seen again. NO ASK NUMBER.
28. New verse in the defender's close. CLOSED: the model's own; marked not counted. Not seen in run 42528.
29. Negative input-token counts. Seen again in run 42528. LIVE AND UNEXERCISED since (ASK 632).
30. Suggestion: store the two good judgments when the third fails. NOT WRITTEN (in ASK 631).
31. Question to the operator: shall hydrogen stay on the panel. ANSWERED 04:41 CST 11-25: "let's increase hydrogen tokens" (ASK 635, live).

## FOR THE OPERATOR
1. Run 42528 cost $11.19 and gave no counted verdict. Seven improvements are shown. Nine defects were still present in run 42528; one of them (the negative token counts) has had its fix written since. Six other fixes are live and wait for a run to exercise them. Four have no fix written.
2. Ten items in the two defect parts have no ASK number. The coordinator numbers them.
3. Open with you: the Anthropic usage limit (item 19 of the status list).
