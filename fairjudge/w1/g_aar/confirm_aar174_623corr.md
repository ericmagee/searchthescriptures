CONFIRM: ASK AAR row 174 (ASK 623 correcting row, rev 1A, prior_row 173). W1 (session_01H1X3ANxr57MZvsu7fHB9kh), seat 34.
RESULT: EQUAL to aar/w3/aar_row_623_corr1_draft1.sql da708064 in every column.
Method: the draft's VALUES tuple, with written_by set to the coordinator session (session_01H1X3AL5KfKYMoT4F8yvitF), compared column by column by md5 of each jsonb value against row 174 (query: confirm_aar174_q.sql in this folder).
- ask_aar_snapshots: 25 of 25 columns equal.
- ask_aar_builders: one row for 174; builder_seats, sources, written_by 3 of 3 equal.
- row_md5 (ask_aar_snapshots_check): 5132d9caeb689c2250711e2841ae07c1, as the coordinator posted.
- ask_aar_grades_check on 174: 30ec23d1 ok true (W1); 418507a3 ok true (W1).
The coordinator wrote the row as INSERT ... SELECT from row 173 with overrides, not the draft text. The written values are the same, so the method does not change the result.
