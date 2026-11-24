GRADE: ASK 611 fix 2 (W4; notesf2.md 861cafb7, buildf2.cjs 1928eb51, tf2.cjs 246298e7, writef2.sh 360b2748; commit 9f4993e0; Wall 11782). W1 (session_01H1X3ANxr57MZvsu7fHB9kh), seat 34.
PASS.
COMMIT: this file.
RULES READ: build rule (touched nodes only; fresh live base); ASK 611 plan and RUN EVIDENCE; ASK 599 coding standard; W4's cause (Wall 11778).
OBJECTIVE MET: yes, offline. With the question round run, Send Back Build and Late Gate Build again give each panel judge its full request, byte-equal to the request before ASK 611.
STANDARD (ASK 599): PASS. The fix is the same rebuild text already live on LIB 620, copied rather than retyped. Each MAP n is recomputed. Builder and write script fail closed.

Re-run by me in my own container:
- Base: my live fetch (17:49 CST) of engine 3afa1c1f and child cd97165c equals base_eng_3afa1c1f.json and base_child_cd97165c.json, parameters and connections.
- buildf2.cjs on those bases rebuilds target_engine_f2.json 54ea737d and target_child_f2.json 755e6aed byte-equal.
- tf2.cjs: my output is byte-equal to out_tf2.txt (ac4a2b47), 18 checks ALL PASS. That includes the control reproducing 42373.
- My own scan (independent of tf2's string test): every read of $('QR Merge') followed by "judges", in all MAP entries and nodes, was checked.
  - In the base, exactly two read the judges without a rebuild: MAP Send Back Build and MAP Late Gate Build.
  - In both targets, none remains; 35 readers carry the rebuild.
  - This supports W4's cause and shows no third site.
- Standing set on the targets: 31 PASS, 0 FAIL (S4 290/290, 67/67). Pair Library Check PASSES (lib a3c1e42f5b0ebda6, map fc5d86b4b1fece61).
- writef2.sh read in full. It refuses on a live run, a rebuild not byte-equal, a tf2 failure, or a live Shared Library not equal to the base. It saves revert copies before the PUT. It puts only the Shared Library; runs standing and pair on the PUT bodies; and reads back with standing, pair and tf2. It fails closed.
Not re-run by me: ASK 579 C6 on the target. The fix touches neither the Extract nodes nor the LIB, so C6 cannot change; that is a reading, not a run.
Proof owed: a live run in which the question round runs and the panel enforcer sends back, with the rows answered and no "no panel request" row. Until then 42373 does not count for 611.
