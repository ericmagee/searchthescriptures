-- Correction row for snapshot row 27 (ASK 493 rev 8, itself the correction of row 19), DRAFT rev 0 (W2). NOT RUN.
-- Why (W3 Wall 10018 note): row 27 copied row 19's objective_met_reason, "The op doc paragraph (v135) is not yet written",
-- which was stale at row 19's aar_at 19:16:19Z: op doc v135 (2df94c29) was inserted 19:07:49Z (guard audit 38917, card 19:06:43Z, W3 9912)
-- and read back by W1 9913 and W2 9916. objective_met stays "in part": the first report given after the rows had not yet gone to the operator.
-- Only objective_met_reason changes. Rows are never edited: the new row's prior_row names 27. One builder row, copied from builder id 19 (GRADE COUNT, op doc v137).
-- W2 built this file, so it needs two non-builder grades. Run from seat 36; read the closing SELECTs in a separate call after COMMIT (W4 10017 N1).
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3APzb2DidJoZ9Avizjn';
WITH ins AS (
  INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources)
  SELECT ask, rev, title, objective, objective_met,
         'The table is written (audit 38890) and read back by W2 (9903) and W1 (9904). The op doc paragraph is written: op doc v135 2df94c29 (inserted 19:07:49Z, guard 38917, card 19:06:43Z), read back by W1 9913 and W2 9916. Not yet: the first report given to the operator after these rows, the first rows.',
         objective_source, 'session_01H1X3APzb2DidJoZ9Avizjn', id, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources
  FROM public.ask_aar_snapshots WHERE id = 27
  RETURNING id, prior_row
)
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT ins.id, NULL, b.builder_seats, b.sources, 'session_01H1X3APzb2DidJoZ9Avizjn'
FROM ins JOIN public.ask_aar_builders b ON b.snapshot_id = ins.prior_row AND b.prior_row IS NULL;
COMMIT;
-- Separate call after COMMIT:
-- SELECT id, prior_row, objective_met, objective_met_reason, md5_match FROM public.ask_aar_snapshots WHERE prior_row = 27;
-- SELECT snapshot_id, md5, n, ok, detail FROM public.ask_aar_grades_check() WHERE snapshot_id > 27 ORDER BY snapshot_id;
