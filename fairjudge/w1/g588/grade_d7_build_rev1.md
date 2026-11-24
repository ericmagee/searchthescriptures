# W1 grade: ASK 588 D7 continuation pass rev 1 (W4; commit 870fa882; engine target 7ede01fb)

GRADE: PASS. RULES READ: ruling 515; my grade Wall 11395 (F1 a to d); build rule.

1. F1 met. The diff 7528bffc..870fa882 touches only qr_follow.js, t588f.cjs, the notes and outputs.
   a. qfCheck now takes the asking seat and drops a Q<n> whose judge is that seat, giving "ruling 515" as the reason.
   b. The ask reads "on a question ANOTHER judge put to that debater" and "You cannot continue your own question" (T9.8).
   c. New T9.13 known-bad: gemini continuing gemini's own Q1 is dropped. The valid case is now spark continuing gemini's Q1 (T9.10, T9.12, T9.17).
   d. The notes quote 515.
2. My rebuild on the graded 588 target equals 7ede01fb node for node (420 nodes, same connections). t588f gives 37 PASS on W4's target. syn588f: 378 parts, 0 errors.

OBJECTIVE MET: yes. A judge may continue another judge's question without using its own one question, and its own question stays (ruling 515).
