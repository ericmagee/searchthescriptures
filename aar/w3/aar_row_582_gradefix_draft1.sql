-- aar/w3/aar_row_582_gradefix_draft1.sql
-- DRAFT 1 by W3 (session_01H1X3ANsGiMnhnbkfphocmo) for the coordinator (seat 36), on its order of 23:03 CST 2026-11-23. NOT RUN by W3. For a W1 grade, then insert from seat 36.
-- CORRECTION ROW for ASK 582: the same facts as row 156, with prior_row 156. Row 156 fails ask_aar_grades_check() on f5f94007 and 27411c9d (batch 1 pair files of parts 09.0 and 11.0): "no non-builder PASS seat", because no grades element named those two md5s.
-- Changed fields against row 156: prior_row (156); grades (two elements added, nothing removed); sources (11271 was already there; no id added). Every other field is copied from row 156 by the SELECT below.
-- THE TWO ELEMENTS, and what the record holds for each (read by W3 by SQL from the_wall, 23:04 CST):
--   1. Wall 11271 (W3) names the batch 1 files: b1_pairs_09.0.json f5f940072b4709a2ede7ccb91290460e (2 pairs); b1_pairs_11.0.json 27411c9dd1d7440d0c40054ed19a0d38 (9 pairs); commit f250a9f6.
--   2. Wall 11272 (W1): "GRADE: ASK 582 second pass batch 1 (W3 commit f250a9f6; Wall 11271) PASS"; item 3 "I read all 21 pairs"; item 2 gives W1's own previews 09.0 to 69e266ce 38,813 and 11.0 to cd97ea91 38,048.
--   3. Wall 11276 (W1), the draft 2 grade that supersedes 11272: "09.0 and 11.0 are as graded." Draft 2 changed only b1_pairs_11.1.json (Wall 11274: "The other 20 pairs are unchanged").
--   4. Wall 11284 (W1 readback): "the pairs files as graded: 09.0 v242 to v248: MATCH ... 2 pairs; 11.0 v245 to v249: MATCH ... 9 pairs".
--   STATED LIMIT: Wall 11272 and 11276 do not print the two md5s; they name the commit and Wall 11271, which prints them. W1 is asked to confirm, as grader, that the files it graded at 11272 are f5f94007 and 27411c9d.
-- Expected after the insert: ask_aar_grades_check() ok true on all six md5_written of the new row.
BEGIN;
SET LOCAL truth.session_id = '<COORDINATOR SESSION, registered to seat 36>';
WITH s AS (
INSERT INTO ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources)
SELECT ask, rev, title, objective, objective_met, objective_met_reason, objective_source, current_setting('truth.session_id'), 156, operator_words, card, owner_seat, plan, build_files, revert,
  grades || $j$[{"seat": "W1", "verdict": "PASS (batch 1, part 09.0 pair file, 2 pairs; unchanged in draft 2: Wall 11276 \"09.0 and 11.0 are as graded\")", "wall_id": 11272, "md5_graded": "f5f94007", "verdict_norm": "PASS", "source": "Wall 11272 head and item 3 (all 21 pairs read; names commit f250a9f6 and Wall 11271); the md5 is printed at Wall 11271; Wall 11276; readback Wall 11284"}, {"seat": "W1", "verdict": "PASS (batch 1, part 11.0 pair file, 9 pairs; unchanged in draft 2: Wall 11276 \"09.0 and 11.0 are as graded\")", "wall_id": 11272, "md5_graded": "27411c9d", "verdict_norm": "PASS", "source": "Wall 11272 head and item 3 (all 21 pairs read; names commit f250a9f6 and Wall 11271); the md5 is printed at Wall 11271; Wall 11276; readback Wall 11284"}]$j$::jsonb,
  md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources
FROM ask_aar_snapshots WHERE id = 156 AND ask = 582 AND md5(grades::text) = '1dd95d1c8a92cb8616fda638bca2f846'
RETURNING id)
INSERT INTO ask_aar_builders (snapshot_id, builder_seats, sources, written_by)
SELECT s.id, ARRAY['W3'], $j$[{"seat": "W3", "what": "drafted and wrote the four manual writes of ASK 582 (version 241; batches 1 to 3)", "wall_id": 11321}]$j$::jsonb, current_setting('truth.session_id') FROM s;
SELECT * FROM ask_aar_snapshots_check() WHERE row_id = (SELECT max(id) FROM ask_aar_snapshots);
SELECT * FROM ask_aar_grades_check() WHERE snapshot_id = (SELECT max(id) FROM ask_aar_snapshots);
COMMIT;
