# GRADE: six run-revision rows from run 42517, draft 1 (W3, Wall 11926, commit 9ad1d022)
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 22:3x CST 11-24. Written during the operator's new run, under the coordinator's hold: no DB call made after 22:27 CST; my one comparison query ran before the hold reached me.

Files: aar_row_627 bfbe5815, 628 95d60420, 579 fa8a1233, 588 239026ca, 623 6a180201, 608 9fcbf6ed (all _run42517_draft1.sql).

GRADE: 628, 579, 588, 623, 608 PASS. 627 FAIL (F1). RULES READ: ASK 497, op doc s29; AAR run 42517 draft 2 38096a59 (my PASS). OBJECTIVE MET: yes for five; 627 after F1. STANDARD (ASK 599): not applicable.

## Method
Per-column md5 of each draft (draftmd5.py) against its stored prior row (179, 180, 182, 186, 196, 197), by SQL at 22:27 CST. Changed columns, all six: prior_row, objective_met_reason, run_evidence, objective_source, sources; plus manuals on 627, 628, 579. Every other column, objective_met ('in part') and status ('read back') included, is equal to the prior row. Builders rows equal.
Each changed column's old and new text compared with a parser (scratch vals.py): objective_met_reason gains one closing RUN REVISION 42517 paragraph and loses nothing; objective_source and sources gain 11924, 11925; prior_row points at the stored row.

## Checked against my own SQL of this evening (grade_aar42517_d1.md)
Row facts in the shared opening sentence (fd0edbff, 22:11 save, models, panel failure, no judgment or enforcer row, cost 3.8227); 628 CLOSE PRESS LIST and ORACLE LAYERS lines and GAPS: NONE, 42505 23 ANSWER lines; 579 no pkgX579 text, C1B and C2B entries, pkgBAR DR1 and DR2; 588 QR log 4 RAN dry false, QR entries; 623 order log id 6 at 21:49, error text; 608 four glm-5.3 Close Enforcer entries. Manuals on 627, 628, 579 equal my readbacks: 13.0 v314 6ca00d1f 16,470 row 334 (Wall 11904); 11.1 v313 8b9efbb1 42,419 row 333 (Wall 11896); 11.2 v315 9c844df7 18,648 row 335 (Wall 11906). NOT CHECKED (hold): audit ids 41951, 41905, 41957 and the earlier W1 Wall numbers 11841, 11854, 11874.

## Findings
F1 (627, required). The row cites AAR draft 2 OBJECTIVE item 2, but both objective_met_reason and run_evidence (case, result) list the QR entries as in draft 1: "QR Answer" 3, "QR Answer C openrouter" 3, "QR Follow Ask" 3, "QR Follow C openrouter" 1. Draft 2 (on my N1) also names "QR Ask" 3 and "QR Retry Ask" 3, which are costed (my SQL: gemini-3.8-flash, qwen4-max, gemini-4-hydrogen each). Add them in both places.

## 627 draft 2 (aar_row_627_run42517_draft2.sql md5 de264ad6, commit 8b5d00bf): PASS
Column md5s against draft 1: only objective_met_reason and run_evidence differ. In both, "QR Ask" 3 and "QR Retry Ask" 3 are added (run_evidence result names their models gemini-3.8-flash, qwen4-max, gemini-4-hydrogen, which my SQL showed). Header lines only otherwise. F1 fixed. All six rows now PASS.
