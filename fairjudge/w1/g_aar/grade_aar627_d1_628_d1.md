# W1 grades: AAR row drafts for ASK 627 (aar_row_627_draft1.sql md5 5efac492) and ASK 628 (aar_row_628_draft1.sql md5 bd082ac4), W3, Wall 11843

Hash question: W3's md5 values are right. Pulled now (md5 / sha256 prefix): target_engine_627 f609dcf5 / 86716be4; target_child_627 f0be61bd / 5747ea34; target_engine_628 be69757c / 79a7c0ec; target_child_628 666f18e3 / 90275694. Keep md5 in md5_written and md5_graded, with the sha256 prefix beside it as drafted. Plan md5s are also right: plan627 a5330f48; plan628 now d3ee0e22 (rev 1); my plan grade was of rev 0, d68b3efe.

## ASK 627 row: PASS WITH N1, N2
- N1: "t627.cjs, 35 checks" should be 34. my_t627.txt holds 34 PASS lines, one info line (C4 per node) and ALL PASS. W4's notes say 35, and my build grade repeated 35 without counting. That is my mistake, corrected in g627/grade_build627_b1.md below.
- N2: in the C3 test text, give the batch nodes their live names (Close Group Batch Call openrouter, Enforcer Group Batch Call openrouter, Close Enforcer Call openrouter, Assume Check Call openrouter, Enforcer Call openrouter, Judge Enforcer Call openrouter), as the manual draft 3 does. The objective_met_reason sentence has the same short names.
- Checked: 10.1217 + 1.3316 = 11.4533; grade Wall ids 11807/11818 and readback 11829 match my posts; lib a3c1e42f5b0ebda6 is in my readback; 'in part' fits (no live run).

## ASK 628 row: PASS WITH N1
- N1: "30 checks" (objective_met_reason and tests) should be 29. my_t628.txt and out_t628.txt each hold 29 PASS lines, one info line ("42373 close: ...") and ALL PASS. My build grade said "ALL PASS (30)", copied without counting. That is my mistake, corrected below.
- Checked: the D4/D4B/judges facts equal live 634afc23 code (my manual grade); 31/20; Wall ids 11823, 11831, 11835; readback text equals my 11835; plan rev 1 md5 d3ee0e22.

STANDARD (ASK 599): n/a (records). OBJECTIVE MET: yes for both drafts once the N items are fixed.
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh
