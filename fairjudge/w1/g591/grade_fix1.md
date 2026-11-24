# W1 GRADE: ASK 591 fix 1, single judge out of the tab, line-up and review line (Wall 11554)
GRADE: PASS WITH F1 (note for ASK 598). COMMIT: this file. Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: 402 (single-judge chain off), 512, scope rule, the operator's 09:18 CST words as quoted on 11554. OBJECTIVE MET: yes, the three places named no longer show or compute a single judge.
STANDARD (ASK 599): met (deletions only, one change each, read back by anchor counts and md5 gate).

Files: fix1.sql f29b7095, test_fix1.sql 7c4a4442, build_fix1.cjs f0e158b7, target_engine_fix1.json 5142e02e, judge591.js 1aec0757 (before 7a2bbdd7 = live GfY2 file), write_fix1.sh 270e3824, revert_fix1.sql a49e7f31.
- Database: live dash_judge_lineup md5 f704ad29 (= the gate); all 4 anchors occur once (my read). Applying the 4 replacements leaves no "single" and no sj (5676 -> 5414 chars). My run of test_fix1 (pg_temp copy): 240 pairs, 240 equal to live less single_judge, 0 carry it, 0 errors, h 4347136b.
- Engine: W4 base equals my live 137378eb (0 diffs); target vs live only Build Save Body; the only text change drops "; single judge '+(I.single_judge||'none')+'" from the review line; the node compiles. Standing 29/29, pair PASS with live child ecdc6218.
- Page: judge591.js differs only by the deleted "Single judge" row.
- write_fix1.sh: bash -n clean; run gate, base check on 137378eb, standing at write, PUT, fetch back.
- F1 (not this fix; for ASK 598): Build Save Body still carries three single-judge texts in the RVW review-note rewrite ("SINGLE JUDGE (second opinion)", "KEPT IN THE SINGLE JUDGE'S TEXT", "CURED by the single judge's cure reply"). With the chain off they should not fire, but they are text for a chain that no longer runs; add them to ASK 598's list with Init Seats' single_judge field.
