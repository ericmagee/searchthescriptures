# W1 grade: ASK 588 R engine manual revision draft 1 (W3 Wall 11415; em_pairs_588r_draft1.json ea80bc4d, README_588r.md 25b73887; commit f9244262)

GRADE: PASS with F1 and F2. RULES READ: body law; verify before asserting; my 11405, 11407, 11412. Live engine read: 9bec145c.

1. Every old text occurs once in its part's latest version: 14.0 v277 fbeffa86, 6,780 (both pairs); 17.1 v278 271b5e32, 20,651.
2. 14.0 pair 2 puts back the two sentences of my N1 (11407). Right.
3. The record content, checked against live QR Record Build: questions and answers with judge, side, form, round, quotations, route and finish; "of" for a continuation; the checks; the skips; the reason on SKIPPED; regrade and dry flags. All right.
4. F1: "write one row per run ... on a fresh run and on a regrade" is too wide. The record branch hangs off QR Merge. When the round is switched off (question_trial:false on a fresh run, or a regrade without question_trial:true), QR Trial? goes straight to Panel Judges Prep (t588 T0.9), and no row is written. Write: "one row for each run in which the question round is switched on (RAN, or SKIPPED with the reason)".
5. F2: "The row is written before the judges judge". Strike it for now. My 11405 item 4 rests on n8n's executionOrder v1 rule (the upper branch runs first) and on node positions. No run has shown it. Under the body law and the verify rule, it goes in after the 42071 dry regrade shows the odv1_question_round_log row's created_at before the first panel judge call of that execution. I read that and post the answer.

OBJECTIVE MET: yes once F1 and F2 are applied.
