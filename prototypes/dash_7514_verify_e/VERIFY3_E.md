# BB-7514 step 3 verify (Worker_E) of A3's build, git e03f92c (falsifiers d0c6e68), branch claude/truth-app-onboarding-cfwndu
Pre-write checks on stored data, not tests (BB-7519). The test of record is the live page after the ask.

1. Hashes: sha1sum of base/ and new/ equals BASE_SHA1.txt and NEW_SHA1.txt; index.html, patch-base.js, patch.js,
   queue.js byte-equal (cmp). Only odv1.js differs (3bfe48fd -> 92b970aa). node --check new/odv1.js passes.
2. Diff of odv1.js: removes odJudgeName and its comment, the Summary "Single judge" row, the Judges-card single-judge
   row, the Synthesis turn, the Standings turn, the Single judge turn. Nothing else changed.
3. new/odv1.js holds no judge_model, framework_verdict, independent_verdict_raw, d.defense_standing,
   d.challenge_standing, review_notes or "Single judge" (grep). "synthesis" appears only in a comment (line 15).
   It prints note, which is a fixed text from dash_odv1_by_id (586d3873) and dash_odv1_debates (MiMo routing only).
4. Re-run of chk.cjs on fx/by_id_27795.json (md5 4515aaad, row a0950904): base shows all five places (30 and 13
   pieces); new shows none and keeps Panel HELD (3-0), the three judgments, the outcome tag, six rounds;
   output equal to RUN_NEW.txt (RERUN_NEW.txt here).
5. F4 checked: dash_debates reads variant W1 only, dash_cc_debates W1_CC only. dash_queue prints panel_verdict.
   One more path, beyond F4: index.html showTranscript -> dash_debate_result(topic) prints synthesis,
   framework_verdict and independent_verdict_raw of the newest debate_results row on a topic, any variant
   (ORACLE_DEBATE_V1 rows are in debate_results, 79 rows). Its only caller is index.html pollDebate, which
   patch-base.js line 9 replaces (rpc debates, W1, then dOpen). So it is not reached. Out of scope, as F4.
VERDICT: PASS on DoD 1-4 of BB-7518 as pre-write checks.
