# W1 GRADE: ASK 647 build b1 (ask647/w4/b1, commit 379df300)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Builder: W4.

GRADE: PASS.

Reproduced from my own fetch of ee4e389d:
- b647 changes LIB 2482 only and re-measures 2 MAP entries (Alternate Merge 1, R2 Alternate Merge). All nodes and the connections equal W4's tg/target_engine_647.json.
- t647: 19 pass, 0 fail.
  - C1, 42528-shaped (chatgpt for qwen4max, drv_uncured 3): one ALT-FINAL row. Its full_reply is the changed text and its cure_reason is the unseat why. Every other output is equal to the old.
  - C2: a seated alternate gives no row, with byte-equal output; two unseated alternates give one row each.
- Standing with child aad0ad9c: 31 PASS, 0 FAIL.
- The row's fields are the E-APPLY field set. kind, seat_role and cure_status pass the table checks I read at plan grade.

STANDARD (ASK 599): tagged; one statement; no new catch.
NOT CHECKED:
- a replay on the real 42528 alternate input (W4 used a synthetic input);
- the dashboard;
- the pair check script.
Rebase: 647 joins 634, 638 A and 641 on Shared Library. Each one written after another is rebuilt and regraded before its write.
