CONFIRM ASK AAR row 173 (ASK 623), inserted by the coordinator from aar/w3/aar_row_623_draft1.sql dbfcbf38: the row EQUALS the draft. RULING on grades_check ok false: a DRAFT DEFECT, missed by my grade (Wall 11760). It needs a correcting row (prior_row 173). COMMIT: this file.

Row equals draft, column by column (md5 first 8; draft values hashed in the database's own jsonb text form):
objective 74b571fa; objective_met_reason 20166aa8; operator_words c734f16c (the text inside the jsonb string); card b4b8c274; plan 79c03ed9; build_files 954fc952; revert 14f860d6; grades 0e8b983c; audit_ids 66268488; objects 729909ef; tests 5e0cfe4f; readbacks 80679c88; run_evidence cb771768; manuals eaa4a277; sources 211692de; builder sources 57768176. objective_source, md5_written, objective_met 'in part', status 'read back', owner W4, rev '1', prior_row null: as drafted. written_by session_01H1X3AL5KfKYMoT4F8yvitF (seat 36).

Why the check fails: ask_aar_grades_check() wants, for each md5_written value, a non-builder PASS element in grades whose md5_graded is that value (or an equal_to proof). The row writes 30ec23d1 (engine fetch-back) and 418507a3 (write623.sql as run), but its grades name only 6727a6c3, 87989e36, e449c187, 6721facf, 3ac16429. My grade should have caught that. MISTAKE (W1).

What the record holds for each written md5:
1. 30ec23d1, the engine fetch-back. My readback (Wall 11743, 457b39ed) compared my own live fetch against the 607 target with the five 623 nodes: 0 nodes differ, and W4's fetch-back equals my live fetch node for node. That is a non-builder PASS on the written engine.
2. 418507a3, write623.sql as run. Checked now: git 3072efde holds 01b4aa75 (the text I graded, Wall 11737); 0111da12 holds 418507a3. The diff is only my N1: one comment line extended, "BEGIN;" added after it, "COMMIT;" added at the end. No block changed. PASS.

Correcting row (W3 drafts, operator card, seat 36 inserts), prior_row 173, the same values except grades gains two W1 elements:
 {"seat":"W1","verdict":"MATCH (readback of the written engine; W4's fetch-back equals W1's live fetch)","wall_id":11743,"md5_graded":"30ec23d1","verdict_norm":"PASS","source":"Wall 11743; fairjudge/w1/g623/readback_write607_623.md 4f38ed7d (commit 457b39ed)"}
 {"seat":"W1","verdict":"PASS (write623.sql as run equals the graded 01b4aa75 plus N1's BEGIN/COMMIT only)","wall_id":<this post's id>,"md5_graded":"418507a3","verdict_norm":"PASS","source":"fairjudge/w1/g_aar/confirm_aar173_623.md"}
and sources gains this post's Wall id. Then grades_check must read ok true on both values.
The ASK 607 draft 2 is not affected: its md5_written (46a1862b, b367f537) are the targets I passed.
