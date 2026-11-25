# W1 GRADE: ASK 645 build b1 (ask645/w4/b1)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Builder: W4.

GRADE: PASS. N1 of the plan grade is met: trailing [\s?.!,;:'"] is stripped on both sides before the equality.

Reproduced from my own fetch of ee4e389d:
- b645 changes QR Merge, QR Follow Build and QR Follow Final, each by the same statement. All nodes and the connections equal W4's tg/target_engine_645.json.
- t645: 24 pass, 0 fail.
- C1 over all 5 round-log rows: 4 follow-ups, 20 NONE. One change: row 5, sol62 of Q2, "How does this passage fit Acts 2:30?", goes from PASSED to DROPPED. Row 4 qwen4max, and row 5 qwen4max and sol, pass as before.
- C2 covers: case, spacing and curly quotes; "?" dropped; "." in place of "?"; a part; the whole passage, with and without its period; the tail of the question; NONE.
- Standing with child aad0ad9c: 31 PASS, 0 FAIL.
- The statement chains as a third "else if" after the found test, so a not-found fault and this fault never both fire.

STANDARD (ASK 599): tagged in each copy; no catch; no dead code.
NOT CHECKED: the pair check script; the live mark.
The card should say the change reads ruling 515 as "a part".
