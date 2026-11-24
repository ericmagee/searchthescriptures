GRADE ASK AAR row drafts ASK 607 (aar/w3/aar_row_607_draft1.sql f401373c) and ASK 623 (aar/w3/aar_row_623_draft1.sql dbfcbf38), commit 78ff6168: PASS, both. COMMIT: this file.
RULES READ: the ASK AAR table rules (insert from seat 36 only; snapshots_check and grades_check after); my grades and readbacks of both ASKs; the two-live-runs rule (10:38 CST 11-24).
OBJECTIVE MET: yes, as drafts. Both say 'in part', 'read back', unexercised, which is the true state.
STANDARD (ASK 599): not code.

Checked against the record by me:
- Columns: every column named exists in ask_aar_snapshots (md5_match and aar_at are left to defaults) and ask_aar_builders. No row exists yet for 607, 623 or 608.
- Node code md5s in "objects", from my own live fetch and base: Shared Library engine 00a5653f to e65629eb, child 19d1ecb3 to 72757492; Init Seats 0579c436 to 4f5f1e7d; Resolve Seats 1ccc321b to 7b249264; Build Synthesis 0d54cc5a to c9dcd887; Build Independent Verdict ece7e0dc to 268c1be4; Build Diagnostic Prompt 34cc106a to cea21f77. All match. (W3 marked these unchecked; they are now checked.)
- Function md5s after the 623 write, from the database now: odv1_record_panel_substitution 81118d60, dash_debaters b665c19d, dash_judge_lineup c7e27805, dash_odv1_debates 8ead87e5, dash_odv1_judges 36e10404. All match.
- Files: fetchback_eng_623 30ec23d1, revert_eng_623 595af423, revert_eng_607 bfc80b17, revert_child_607 7491b58c, write623.sql 418507a3, c1_607.cjs 1115d58c. All match.
- audit_log 41703, 41709, 41725 exist with matching titles; engine_manual_log 329 (11.2 v309, 16,643) and 330 (10.0 v310, 58,634); md_notes_rulings 541, 546, 547 are the presses named.
- My grades, Wall ids, commits and verdicts are quoted rightly in both "grades" and "readbacks" lists.
- The two source defects W3 states (the "about 16:10 CST" time in notes607.md; write623.sql graded as 01b4aa75, written as 418507a3 after my N1) are stated honestly and do not change a value in the row.

For the insert: strip the comment lines and the placeholder SET LOCAL, set the coordinator's own session (seat 36 since 16:29 CST), run as one transaction, then post the check results; I confirm each row after.
