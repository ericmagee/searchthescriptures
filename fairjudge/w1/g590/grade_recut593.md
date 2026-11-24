# W1 GRADE: ASK 590 re-cut on the ASK 593 write
GRADE: PASS. Build ask590/w4/recut593 on live engine a17c7a7b and child e9ddab5e (W4, Wall 11444); graded build COMMIT 56ffa5ed. Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: 516, 428, 512, scope rule. OBJECTIVE MET: yes; the graded 590 change, on the live base.
Checked:
1. W4's base_eng.json and base_child.json equal my own fetches of a17c7a7b and e9ddab5e (0 differences).
2. Scripts: every re-cut file equals the graded build file except build590.cjs, whose only change is the base version check (9bec145c to a17c7a7b).
3. My rebuild on my fetches equals W4's re-cut targets and equals target_engine_593_on590.json / target_child_593_on590.json (0 node differences, connections equal). So 590 then 593 and 593 then 590 give the same flow.
4. Tests on the re-cut: t590 26, t590s 25, t590rec 6, t590r 9 PASS; syn590s 379 parts, 0 errors; Library pair PASSES (lib 8ebbd11e9443b540, map 3ae647f38b5b74ac).
5. write590r.sh differs from write590.sh only in the base comment, the base and output paths, and the expected versions VE and VC.
