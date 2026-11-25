# W1 GRADE: ASK 630 + 631 stack build b2 (ask630/w4/b2, commit 041d62a0, target e290335e)

GRADE: ENGINE PASS WITH N1; DB HELD (test not run). Overall: HELD, not PASS, until the DB test runs or the operator rules that a reading is enough.
RULES READ: build rule (fresh live base, touched nodes only), s29 stacked packages, plans 630 r1 and 631 r1 with my notes, ASK 599, the precedent of 626 F1 (a planned test not run is not a pass).
OBJECTIVE MET: engine side yes (offline); DB side by reading only.
STANDARD (ASK 599): Panel Failure Rows: every line tagged ASK 631 (t630 checks it); no dead code; try/catch only in the ran() lookup. PASS.

ENGINE (checked this turn)
- Base = live 066525aa (fetched by W1 this turn). Target 427 nodes; 4 added (Panel Failure Mark, Panel Failure Rows, Failure Enforcer Log, Failure Judgments); no existing node changed; none removed.
- Connections changed only at Dry Failed? (false: Panel Tokens -> Panel Failure Mark) and the new chain ending at Panel Tokens. Dry branch unchanged.
- The four new nodes are byte-equal to b1. Each has onError continueRegularOutput.
- t630 (my run, fx/r42517_fail.json): ALL PASS (25). Standing on the target with live child aad0ad9c: 31 PASS, 0 FAIL; S4 293/293.
- Panel Failure Rows read in full: done() = ran and not the failed node; enforcer rows skip on a successful Write Enforcer Log; per-slot judgments on each slot whose own Write Judgment did not succeed; reserve slot null. My 631 N1 to N3 are applied.
- N1: plan 630 said the mark uses the ODV1-TEST- token in test mode, as Failure Salvage does. The build uses Init Seats run_token as is, which is right: Build Save Body saves the row with S.run_token, so that is the token on a row whose panel failed. Correct the plan text, not the build.

DB (db630_631.sql 3e93b4ec, same as b1; read, not run)
- Mark: skips on p_skip; marks only outcome null and quarantine_reason null; text as planned. Record: inserts non-blank string replies only. Grants as record_debate_row. Append-only trigger. No defect found by reading.
- N2: the table grants SELECT to lab_seat but has RLS on and no policy, so lab_seat reads no rows unless it bypasses RLS (NOT CHECKED). State which is meant.
- N3: the revert keeps the table, the guard function and the trigger always; its comment says "kept if it holds rows". Make the comment match, or drop them when empty.
- NOT RUN: test_db630_631.sql (b408aa9c). W4's call and mine (11:14Z) both raised an approval prompt that timed out. Not retried.

W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh
