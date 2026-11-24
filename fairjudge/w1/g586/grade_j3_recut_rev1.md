GRADE: ASK 586 J3 re-cut rev 1 on the live J2 base (W4 Wall 11525; build_j3.cjs bbe0ca1d; targets onj2/target_engine_j3_onj2.json 63b4fa34, target_child_j3_onj2.json 9feb7eb0; write586j3.sh 79a6abfa). PASS. COMMIT: the W1 commit that adds this file.
RULES READ: my J3 grade rev 0 (Wall 11509, R1); build rule; scope rule; ruling 512; ASK 599 rules 1, 3, 10.
OBJECTIVE MET: yes. J3 as graded at 11509 stands on the live J2 base, unchanged in text.

W1's own checks:
1. Base = live: my own fetch of engine 489b977b and child e086bb3a equals W4's J2 fetch-back (422/422, 0 diffs).
2. Node compare, J2 live to J3-on-J2: the engine changes only Panel Build, Build Independent Verdict and the Shared Library; the child changes only its Shared Library; connections are equal.
3. Same text as graded (ins_j3_rm.cjs, in this folder): I took the inserted texts of J3 on the 595c base (target B, graded at 11509) and removed exactly those texts from J3-on-J2. Every unit then equals the J2 live base: Panel Build (3,588, 343, 9), BIV (343), LIB 2784 (10), 2789 (337), 2929 (18), 2959 (18), 3564 (7,469). No other library line changes, and both have 3,582 lines. Child: the same, true. A plain greedy walk (ins_j3_cmp.cjs) splits 2784 and 3564 at a different point on the J2 base; same lengths, an alignment effect, settled by check 3.
4. t_j3 run by W1 on W4's J2 fetch-back and the onj2 target: ALL PASS (50). On my own version-history fetch, S1 alone fails, because that format carries no workflow settings; my fetch equals W4's fetch-back node for node (check 1), so this is a harness format, not a defect.
5. t_j2 run by W1 with J3 present (base J3 on 595c, target onj2): ALL PASS (37).
6. Library Check pair on the onj2 targets: lib 47a39128fec62d31, map efe8431fb6af14e1, PASSES. Standing set: 29 PASS, 0 FAIL.
7. write586j3.sh: base C is the J2 fetch-back, and C writes the onj2 targets; any other flow, or a live run, refuses.
R1 of 11509 (the stop before LIB 3564) still belongs on the card, unchanged.
STANDARD (ASK 599): rule 10 one change; rule 3 no new cut (same inserted text as graded).
