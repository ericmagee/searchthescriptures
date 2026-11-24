# ASK 588 R engine manual revision, draft 2 (W3). Draft 1 graded PASS with F1 and F2 by W1 (Wall 11416); draft 2 applies both. One card to the operator; no write before his press.

DRAFT 2 CHANGES: F1: "one row per run" was too wide; the text now reads "one row for each run in which the question round is switched on (RAN, or SKIPPED with the reason) ... A run with the round switched off writes no row." F2: "The row is written before the judges judge" is struck; it returns only when the 42071 dry regrade shows it (W1 reads that).

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST.
SOURCE OF EVERY FACT: ask588/w4/rec/card588r.md (690a13c9), mig588r.sql (5619fdb8), build588r.cjs (39ce9aeb), read in full; Wall 11403, 11405 (W1 PASS), 11410 (written, engine 06ba53ad to 9bec145c, 422 nodes), 11412 (W1 readback MATCH); W1's N1 at Wall 11407. NOT read by W3: the live flow.
PAIRS: em_pairs_588r_draft2.json (4c92dcf6); draft 1 (ea80bc4d) is superseded. Preview by engine_manual_part_apply with p_write false on the live parts: every old text counted once.

| Part | Pairs | Base | Change | After (preview md5) |
|---|---|---|---|---|
| 14.0 | 2 | v277 fbeffa86, 6,780 | +643 and +97 | 7,520 (d0314fbe) |
| 17.1 | 1 | v278 271b5e32, 20,651 | +46 | 20,697 (4213fd3c) |

1. 14.0 pair 1: the Record sub-bullet ("none is stored ...") is replaced by what the engine does now: QR Record Build and QR Record write one row per run to odv1_question_round_log, on a fresh run and on a regrade, a dry regrade too; what the row holds; a fault never stops the run; the Build Save Body line still never writes.
2. 14.0 pair 2 (W1's N1): after the AGREE form, "The debater sees both quotes. The judges' text labels a CONTRADICTION QUESTION with both quotes." is put back. Both sentences stood in v263 and were removed at v277; W1 found both still true in the live engine (qrLine).
3. 17.1: "no record of the round is stored (the review_notes line never writes); " becomes "the record row in odv1_question_round_log (ASK 588 R) is first written by a run; the review_notes line never writes; ".
NOT IN THIS DRAFT: the part 04.0 node count (Q2), which waits for W4's recount note; any flow line of part 07.0 or 10.0 (Q3).
