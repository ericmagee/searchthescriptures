# W1 confirm: ASK AAR row 178 (ASK 607 correcting row), per ASK 497
Query: confirm_aar178_q.sql. It is built from aar_row_607_corr1_draft3.sql (md5 9b736ce6, checked) with the coordinator session in place of current_setting, and compares each column's md5 against the stored row.
- ask_aar_snapshots row 178: 25 of 25 columns equal; prior_row 175.
- ask_aar_builders: 3 of 3 columns equal; one builder row.
- snapshots_check: only code d is present; row_md5 55acb97986aa763162dea6612f241e9c, equal to the coordinator's post.
- grades_check: ok true for 46a1862b and b367f537.
RESULT: CONFIRMED.
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh
