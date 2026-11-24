# W1 GRADE: ASK 596 plan rev 0 (one standing test set)
GRADE: PASS with F1 to F3. COMMIT d3323fec (ask596/w3/plan596.md 7baaa074, W3, Wall root 11469). Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: the operator's "Plan 596, then 597, then 598" (01:43 CST), 587 A, 595, 599 draft 2, the scope rule, 512.
OBJECTIVE MET: yes, after F1 to F3.

## Section 2 facts, against the files
- F1 (2.1 is wrong): test files named t*.cjs / test*.cjs / test*.js stand in 32 ASK folders of 500 and up under /mnt/project-files, not 11: 526, 530, 532, 533, 536, 537, 539, 542, 547, 548, 549, 550, 552, 556, 557, 559, 561, 563, 564, 565, 566, 570, 571, 573, 575, 576, 581, 585, 586, 588, 590, 593 (my find, depth 4). ASK 587 has none of its own; t587o3.cjs stands under ask586 (three copies). The S4 backward fill starts from these.
- 2.2 TRUE: t593.cjs reads its files from __dirname by fixed name.
- 2.3 TRUE: t590s L1.1 (the node list) and L1.3 ("LIB lines changed: 2784, 2789, 2929, 2959, 3564") are build tests; L2.1 and L2.5 are behaviour tests.
- 2.4 TRUE: t590s reads L2[3564] (and L2[3563]) by number; it does use the /*REV590{*/ marker inside that line, which shows S2's marker method works for new code.
- 2.5 TRUE: 590's own tests were 26+25+6+9 = 66; none of 587's.

## Design
- F2 (S3 must find the sites itself). Tonight's defect was a NEW site (590's rev590Hits). A test with a fixed list of builders would not have covered it. S3 must discover every place that builds a send-back item or stores one by a code scan (every object literal that sets flagged_line, and every send-back text that shows a judge line), and fail on a site it cannot drive. Add proof 7: a copy of the 595 target with a new item builder that cuts flagged_line to 1,500 FAILS S3.
- F3 (S3's field scope, so proof 2 can hold). On the 595 target, response_line is still cut to 700 in many places and 23 record fields to 1,500, and quotations shown to judges to 400, 500 and 600. If S3 fails on "any stored or shown copy shorter than the line", it fails on the 595 target and proof 2 is impossible. State it: S3 = flagged_line, and the judge's own line shown in a send-back text (587 A's scope); the other cuts enter Layer A rule 3 as a baseline count that 597 lowers.
- S2 layers, S5 items 1, 2, 4: ACCEPTED.
- S5 item 3: ACCEPTED, with one addition: the change of a standing test is graded by W1 like any build, and the card names the test and the ruling row.
- Section 4 proofs 1 to 6: ACCEPTED. Proof 1 agrees with my read (Wall 11452: B to E stand on d819ff4c; A fails only at the E-REVCLOSE item).
- Section 8 (runner with S3 and 587 right after 595): ACCEPTED as the recommendation for the card.
