# ASK 595 FOLLOW-ON BUILD rev 0: the three cuts made whole, plus the MLS block reader (operator's press, option A, 01:58 CST)

W4, 2026-11-24 CST. For W1's grade, then one card.
- Press: "Write 595, then the other three" (ASK 595 card). W1's rulings, Wall 11456 items 1 to 3: same class as 587 A, recommended whole. The LIB 2277 reader was added to this build on the coordinator's order.
- Base: live engine 04273989 (J6 write), child c9acb53a. W1 MATCH Wall 11485.
- Build buildcuts.cjs. Targets target_engine_cuts.json and target_child_cuts.json: LIB 04ac120b9bf3a19c, MAP e12df49c7db048c0. The Library Check pair passes.
- Tests tcuts.cjs: 20 PASS (out_tcuts.txt). Write script write/write595c.sh. It refuses while any engine or child execution is running.

## WHAT CHANGES
1. QR Final: a DROPPED reply is stored in odv1_question_round_log whole. Before, first_reply and second_reply were cut to 2,000. The database function cuts nothing (checked by SQL).
2. QR Follow Final: a DROPPED follow reply is stored whole. Before, it was cut to 2,000.
3. Panel Build and Build Independent Verdict: the ASK 590 [REVERSED CLOSE SENTENCES] blocks show the close quotation and the earlier quotation whole. Both forms change, the verse form and the link form; 4 cuts of 500 in each node. Build Independent Verdict does not run; it changes only so the twins stay equal.
4. Shared Library LIB 3564 (engine and child): the E-REVCLOSE send-back text quotes both sentences whole. Before, each was cut to 400.
5. Shared Library LIB 2277 (engine and child): mlsBlock returns the debater's MEANS block whole. Before, it was cut to 1,500. It feeds the pkgMLS check in Panel Payloads, Alternate Payloads, R2 Alternate Payloads and Extract Independent Verdict.
No other node or line changes. Connections are equal.

## TESTS (20 PASS)
- S1, S2: only those nodes and LIB 2277 and 3564 change, engine and child.
- S3, S4: no 2,000 cut is left in the QR nodes, and no cut is left on the ASK 590 quotations.
- Q1 to Q4: a 3,200-character DROPPED reply is stored whole by QR Final (first and second) and by QR Follow Final. Control: live cuts it to 2,000. A PASSED reply adds no field.
- P: both reversed-close blocks in each twin show a 900-character close quotation and a 700-character earlier quotation whole. Control: live cuts them to 500.
- R: the E-REVCLOSE send-back shows 661- and 529-character quotations whole, engine and child. Control: live cuts them to 400.
- M1 to M3: mlsBlock returns a 7-line block of more than 1,500 characters whole, engine and child. Control: live cuts it to 1,500.

## NOT IN THIS BUILD (scope rule), listed for ASK 597
- Panel Build and Build Independent Verdict, the older TRIAL reversed-close block: r.close_q and r.earlier_q are each cut to 400. It is the same class as item 3, but it was not in W1's list. W1 rules whether it joins this build.
- The 23 other .slice(0,1500) sites (Wall 11452). They belong to ASK 597.
