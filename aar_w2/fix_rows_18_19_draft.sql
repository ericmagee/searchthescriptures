-- Correction rows for snapshot rows 18 (ASK 496 rev 1) and 19 (ASK 493 rev 8), DRAFT rev 1 (W2). NOT RUN. rev 1: guard times per W1 10014 N1.
-- Why: rows 18 and 19 record the manuals as "v218 pending" and "v135 pending", but engine manual v218 (673f42fe)
-- and op doc v135 (2df94c29) were inserted at 19:07:34Z and 19:07:49Z (guard audit 38916, 38917) on the card "Write it" 19:06:43Z (W3 9912) and read back
-- by W1 9913 and W2 9916, before the rows' aar_at 19:16:19Z. W2's insert script rev 1 (3351cbb0) carried the stale text.
-- Rows are never edited: each correction is a new row whose prior_row names the old one; only manuals and sources change.
-- One builder row per new snapshot row (op doc v137, GRADE COUNT), copied from rows 16 and 17 of ask_aar_builders (snapshots 18, 19).
-- W2 built this file, so it needs two non-builder grades (W1 and W3 or W4). For the coordinator to run from seat 36, or to fold into W3's pm script.
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3APzb2DidJoZ9Avizjn';
WITH src AS (
  SELECT s.*, CASE s.id
    WHEN 18 THEN '{"engine_manual":"v218 673f42fe (inserted 19:07:34Z, guard 38916, card 19:06:43Z; readbacks W1 9913, W2 9916)","op_doc":"not yet"}'::jsonb
    WHEN 19 THEN '{"engine_manual":"v218 673f42fe (inserted 19:07:34Z, guard 38916, card 19:06:43Z; readbacks W1 9913, W2 9916)","op_doc":"v135 2df94c29 (inserted 19:07:49Z, guard 38917, card 19:06:43Z; readbacks W1 9913, W2 9916)"}'::jsonb
  END AS new_manuals
  FROM public.ask_aar_snapshots s WHERE s.id IN (18, 19)
), ins AS (
  INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources)
  SELECT ask, rev, title, objective, objective_met, objective_met_reason, objective_source, 'session_01H1X3APzb2DidJoZ9Avizjn', id, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, new_manuals, status,
         sources || '[9912, 9913, 9916, "audit 38916", "audit 38917"]'::jsonb
  FROM src ORDER BY id
  RETURNING id, prior_row
)
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT ins.id, NULL, b.builder_seats, b.sources, 'session_01H1X3APzb2DidJoZ9Avizjn'
FROM ins JOIN public.ask_aar_builders b ON b.snapshot_id = ins.prior_row AND b.prior_row IS NULL;
SELECT id, ask, rev, prior_row, manuals, md5_match FROM public.ask_aar_snapshots WHERE prior_row IN (18, 19) ORDER BY id;
SELECT snapshot_id, md5, n, ok, detail FROM public.ask_aar_grades_check() WHERE snapshot_id > 25 ORDER BY snapshot_id;
COMMIT;
