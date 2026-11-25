# W1 GRADE: em_pairs_629_635_draft1.json (833903a5, W3, commit d0d8ed6f)
GRADE: PASS WITH N1. RULES READ: manual one-part write rule; scope rule. OBJECTIVE MET: yes. STANDARD (ASK 599): no code; not applicable.
- Part 10.0 v311 (62,209, 9a8aa420): each of the 4 old strings found once; result 63,057, md5 438a0c8d. Matches.
- Part 16.0 v242 (2,087, 5687ab94): 1 old string found once; result 2,244, md5 616c7193. Matches.
- Checked against live engine 066525aa: the Init Seats panel_reserve line (first seat after the panel that is neither time-removed nor JFL-moved); the Panel Check no-text throw text, including "not given", "NO ROW IS WRITTEN." and "[no reserve seat is free]"; the G3 note (W1 629 grade R1). Each matches.
- N1 (16.0): "read the seat's failed_reply in debate_enforcer_log". failed_reply is a kind, not a column. The row is pushed only in the enforcer-log assembly, which a fail-closed run never reaches: 42517 has 0 debate_enforcer_log rows, and ASK 631's Failure Enforcer Log carries cec, jcc and acx, not failed_raw. On a fail-closed run the raw reply is in ppj_replies (42517: id 254). Write: "the reply of kind failed_reply in debate_enforcer_log when a reserve substituted; on a fail-closed run, the seat's ppj_replies row".
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh
