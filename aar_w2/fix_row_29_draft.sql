-- Correction row for snapshot row 29 (ASK 497 rev 5), DRAFT rev 0 (W2). NOT RUN.
-- Why (W2 10040 C2): row 29 was written at 20:20:38Z, before the ASK 497 check ran for this AAR. It holds objective_met "in part"
-- and "It has not yet been run before an AAR; this AAR is the first." The check then ran clean: the coordinator's rows-written line
-- for rows 26 to 30 was posted in the project chat at 14:22 CST, and W2 (10035, 10036) and W1 (10037) matched it both ways against
-- 22 d rows with no a, b, c or e finding. AAR rev 15 sets 497 to YES; the table must say the same before the report is given.
-- Changes: objective_met, objective_met_reason, objective_source, run_evidence. Every other field copies row 29. prior_row 29.
-- One builder row, copied from the builder row of snapshot 29 (GRADE COUNT, op doc v137).
-- W2 built this file: it needs two non-builder grades. Run from seat 36; read the closing SELECTs in a separate call after COMMIT.
-- After it runs, the coordinator posts a new "ASK AAR rows written" line for the new row, and W1 and W2 match it both ways.
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3APzb2DidJoZ9Avizjn';
WITH ins AS (
  INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources)
  SELECT ask, rev, title, objective, 'yes',
         'The check function is written (audit 39023 to 39025) and read back by W1 (9986) and W2 (9987); its rolled-back test passed (9979; W1 9980, W2 9981). The manuals are written (engine v219, op doc v136; readbacks 9992, 9993). It ran before this AAR, its first: the coordinator posted the rows-written line for rows 26 to 30 in the project chat at 14:22 CST, and W2 (10035, 10036) and W1 (10037) matched it both ways against 22 rows of check d, with no a, b, c or e finding.',
         objective_source || ', 10035, 10036, 10037', 'session_01H1X3APzb2DidJoZ9Avizjn', id, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks,
         '{"case":"DONE: the first AAR run through the check, clean (project-chat line 14:22 CST; W2 10035, 10036; W1 10037)"}'::jsonb,
         manuals, status, sources || '[10035, 10036, 10037]'::jsonb
  FROM public.ask_aar_snapshots WHERE id = 29
  RETURNING id, prior_row
)
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT ins.id, NULL, b.builder_seats, b.sources, 'session_01H1X3APzb2DidJoZ9Avizjn'
FROM ins JOIN public.ask_aar_builders b ON b.snapshot_id = ins.prior_row AND b.prior_row IS NULL;
COMMIT;
-- Separate call after COMMIT:
-- SELECT id, prior_row, objective_met, objective_met_reason, objective_source, run_evidence, md5_match FROM public.ask_aar_snapshots WHERE prior_row = 29;
-- SELECT snapshot_id, md5, n, ok, detail FROM public.ask_aar_grades_check() WHERE snapshot_id > 30 ORDER BY snapshot_id;
-- SELECT * FROM public.ask_aar_snapshots_check() WHERE row_id > 30 OR check_code <> 'd';
