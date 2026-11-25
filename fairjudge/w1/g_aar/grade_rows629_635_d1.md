# W1 GRADE: W3 drafts (commit ea1cbde4)

(A) em_pairs_629_635_draft2.json d5ffa2b1: PASS. The 10.0 pairs equal draft 1 (63,057, 438a0c8d). 16.0 v242 becomes 2,377, e5639a54, which matches. The new 16.0 text points to ppj_replies for a fail-closed run and to the failed_reply row where a reserve substituted. My N1 is applied.

(B) aar_row_629_draft1.sql 5c05a977: PASS WITH N1.
- Grades elements check against git and the Wall: 11930/b1ce6b90 (plan PASS WITH R1, N1, N2; 2d000472); 11952/307dc077 (build b1 PASS WITH N1 to N3; 55d96341); 11958/ca8a67e7 (rebase confirmed; 0e720823). Readback 11975/380785aa. The N1 and N2 text matches my build grade. md5_written 0e720823 is the target I read back. No prior row for 629 exists, so rev '1' and a NULL prior_row are right.
- N1: "read back MATCH by W1 (Wall 11971, 11975)": 11971 is W4's write post. Write it as "written (Wall 11971), read back MATCH by W1 (Wall 11975)".

(C) aar_row_635_draft1.sql 4e539587: PASS WITH N1, N2.
- Grade 11960/28082b0c on 803c9032 matches; readback 11975/f8704548 matches; audit 42082 and the 05:14 CST time match. 'not yet' and an empty md5_written fit, since it is one value with no target file. The statement that C2 was not reported is true: W1 graded no C2 replay.
- N1: the same as (B) N1, on 11971.
- N2: "guarded on the prior value and the api_model". Audit 42082 says only "guarded on the prior value", and the plan's WHERE is seat and max_tokens. Drop "and the api_model" unless W4 shows it.

STANDARD (ASK 599): no code. OBJECTIVE MET: yes; the rows record what is shown and what is not.
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh
