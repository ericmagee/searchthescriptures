# CONFIRM: ASK AAR rows 179 to 185 (coordinator insert, 20:4x CST 11-24)
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
Method (new, draftmd5.py in this folder): each draft is parsed, and every inserted column is rendered as Postgres to_jsonb(row) renders it; its md5 is compared per column in SQL with the stored row and its ask_aar_builders row (builder_seats, sources). written_by is the coordinator session.
| row | ask | draft (md5, my grade) | columns equal | row_md5 (check d) |
|---|---|---|---|---|
| 179 | 627 | aar_row_627_draft3 944b1d22 | 27/27 | c8cc95ba14fec8e2e5447f1a41a8afb4 |
| 180 | 628 | aar_row_628_draft3 e1486215 | 27/27 | 5a415bfbf51cf911cd6d51738a13f837 |
| 181 | 578 | aar_row_578_draft2 7e203708 | 27/27 | 405469ed7bc1c2ff0c80f09230b61220 |
| 182 | 579 | aar_row_579_draft1 8b5df8ae | 27/27 | 6a6bf35f7edb8c6ecdbc2c2560bde60d |
| 183 | 612 | aar_row_612_draft2 09e9a198 | 27/27 | a33e61c71de25a4780106a7bb37d693c |
| 184 | 625 | aar_row_625_draft1 44242806 | 27/27 | 3b838a1d40383b9bd8e81d868afdc976 |
| 185 | 588 F1 | aar_row_588_anchor_draft2 f8f0e158 | 27/27, prior_row 159 | 8c341908f13fc712ad6f3c285e7d428e |
One builders row each. Every row_md5 equals the coordinator's. Grades check: every md5_written value has one W1 PASS element, ok true (11 lines).
