-- ASK 499 A2 snapshot row, DRAFT rev 1 (W3, seat 33, 11-19; replaces rev 0 70b65a3d: W1 10127 C1, git paths a499_w4/ and commit 88712bac). For W1 and W2 to grade. NOT RUN.
-- Pattern: snapshot 32 (494 A2) and W2's 499 A1 template (aar_w2/aar_499a1_row_draft.sql ea44677a: __FILL values and a closing guard).
-- Run only from seat 36 (the coordinator), once, after: the A1 row is written, the A1 proving run passes (plan499_a1_run.md Q1 to Q6), the A2 rolled-back test passes and is graded, the A2 write on W4's card, and two non-writer readbacks.
-- Every __FILL_...__ value must be replaced from live SQL and the Wall, and the filled file graded again, before running. Numeric placeholders are written as quoted strings ("__FILL_..__") so the file parses; replace the quotes too, with the bare number. The guard raises and rolls back if any __FILL is left.
-- Manuals: fill from live SQL at run time (What went wrong 9). If the A2 manual entry is not yet written, write "not yet" or "vNNN pending (<pairs file md5>)", true at the moment the row runs.
-- A2 is a new revision of ASK 499 (rev 'A2'); prior_row is NULL. One builder row: W4 built step499.sql 73d82a72 (Wall 10089) and writes it on its card.
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3APzb2DidJoZ9Avizjn';
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(499, 'A2', 'Public key can no longer call ppj_put, ppj_status or ppj_get',
 $t$Today anyone holding the public (anon) key can call rpc/ppj_put, and with it store a reply in ppj_replies for any nonce and slot. The engine keeps the first reply per slot and reads it back as that panel judge's answer, so a reply stored before the judge's own would stand as the judge's verdict. The same key reads any nonce's replies (ppj_get, ppj_status). Close that, and keep every engine run's panel judges working. Expected effect: ppj_put, ppj_status and ppj_get refuse anon and authenticated with 42501, and the engine's calls to them run as service_role. (a499_w3/plan499.md)$t$,
 'in part',
 $t$A2 written on the operator's card at __FILL_CARD_PRESS_Z__ (audit __FILL_AUDIT_FIRST__ to __FILL_AUDIT_LAST__) and read back by __FILL_READBACK_SEAT_1__ (__FILL_READBACK_WALL_1__) and __FILL_READBACK_SEAT_2__ (__FILL_READBACK_WALL_2__): only postgres, service_role and lab_seat hold EXECUTE on the three; anon and authenticated cannot call any. The rolled-back test passed first (W4 __FILL_TEST_WALL__), and A1 was proven by run __FILL_RUN_TOKEN__. Not yet: the next engine run collects all 3 panel replies with no 42501.$t$,
 '__FILL_TEST_WALL__, __FILL_WRITE_WALL__, __FILL_READBACK_WALL_1__, __FILL_READBACK_WALL_2__',
 'session_01H1X3APzb2DidJoZ9Avizjn', NULL,
 '"not yet"'::jsonb,
 '{"answer":"__FILL_CARD_ANSWER__","thread":"W4","press_time":"__FILL_CARD_PRESS_Z__","source":"audit __FILL_AUDIT_LAST__"}'::jsonb,
 'W3',
 '{"md5":"20b80b63","path":"a499_w3/plan499.md","commit":"a2921f51","wall_id":10079}'::jsonb,
 '[{"md5":"73d82a72","path":"a499_w4/step499.sql","commit":"88712bac"}]'::jsonb,
 '{"md5":"ba5da3c1","path":"a499_w4/revert499.sql","commit":"88712bac"}'::jsonb,
 '[{"seat":"W2","verdict":"PASS with three notes (plan rev 0)","wall_id":10080,"md5_graded":"20b80b63","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (plan rev 0)","wall_id":10081,"md5_graded":"20b80b63","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (build rev 0)","wall_id":10093,"md5_graded":"73d82a72","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (build rev 0)","wall_id":10094,"md5_graded":"73d82a72","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (test file rev 0)","wall_id":10093,"md5_graded":"f169e22c","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (test file rev 0)","wall_id":10094,"md5_graded":"f169e22c","verdict_norm":"PASS"},
   {"seat":"__FILL_TESTOUT_SEAT_1__","verdict":"__FILL_TESTOUT_VERDICT_1__ (test output)","wall_id":"__FILL_TESTOUT_WALL_1__","md5_graded":"f169e22c","verdict_norm":"__FILL_TESTOUT_NORM_1__"},
   {"seat":"__FILL_TESTOUT_SEAT_2__","verdict":"__FILL_TESTOUT_VERDICT_2__ (test output)","wall_id":"__FILL_TESTOUT_WALL_2__","md5_graded":"f169e22c","verdict_norm":"__FILL_TESTOUT_NORM_2__"}]'::jsonb,
 ARRAY['73d82a72'],
 '["__FILL_AUDIT_IDS_AS_NUMBERS__"]'::jsonb,
 '[{"kind":"grants","name":"EXECUTE on ppj_put, ppj_status and ppj_get","before":"anon, authenticated, lab_seat, postgres, service_role on each; no PUBLIC (revert499.sql ba5da3c1 closing check)","after":"postgres, service_role, lab_seat only"}]'::jsonb,
 '[{"file":"a499_w4/test499_rollback.sql","md5":"f169e22c","result":"__FILL_TEST_RESULT__","output":"__FILL_TEST_OUTPUT_PATH_AND_MD5__","wall_id":"__FILL_TEST_WALL__"}]'::jsonb,
 '[{"seat":"__FILL_READBACK_SEAT_1__","result":"CONFIRMED","wall_id":"__FILL_READBACK_WALL_1__"},{"seat":"__FILL_READBACK_SEAT_2__","result":"CONFIRMED","wall_id":"__FILL_READBACK_WALL_2__"}]'::jsonb,
 '{"case":"not yet: the next engine run collects all 3 panel replies with no 42501"}'::jsonb,
 '{"engine_manual":"__FILL_ENGINE_MANUAL_AT_RUN_TIME__","op_doc":"__FILL_OP_DOC_AT_RUN_TIME__"}'::jsonb,
 'read back',
 '[10079, 10080, 10081, 10089, 10091, 10093, 10094, "__FILL_RUN_WALL__", "__FILL_TEST_WALL__", "__FILL_TESTOUT_WALL_1__", "__FILL_TESTOUT_WALL_2__", "__FILL_WRITE_WALL__", "__FILL_READBACK_WALL_1__", "__FILL_READBACK_WALL_2__", "audit __FILL_AUDIT_LAST__"]'::jsonb);

INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'],
 '[{"seat":"W4","what":"built step499.sql 73d82a72","wall_id":10089},{"seat":"W4","what":"wrote 499 A2 on its card","wall_id":"__FILL_WRITE_WALL__"}]'::jsonb,
 'session_01H1X3APzb2DidJoZ9Avizjn'
FROM public.ask_aar_snapshots s
WHERE s.ask = 499 AND s.rev = 'A2' AND s.prior_row IS NULL AND s.aar_at = now();

DO $g$ BEGIN
  IF EXISTS (SELECT 1 FROM public.ask_aar_snapshots s WHERE s.ask = 499 AND s.rev = 'A2' AND s.aar_at = now() AND to_jsonb(s)::text LIKE '%\_\_FILL%') THEN
    RAISE EXCEPTION 'ASK 499 A2 row: a __FILL value is left; nothing kept';
  END IF;
  IF EXISTS (SELECT 1 FROM public.ask_aar_builders b JOIN public.ask_aar_snapshots s ON s.id = b.snapshot_id WHERE s.ask = 499 AND s.rev = 'A2' AND s.aar_at = now() AND b.sources::text LIKE '%\_\_FILL%') THEN
    RAISE EXCEPTION 'ASK 499 A2 builder row: a __FILL value is left; nothing kept';
  END IF;
  IF (SELECT count(*) FROM public.ask_aar_builders b JOIN public.ask_aar_snapshots s ON s.id = b.snapshot_id WHERE s.ask = 499 AND s.rev = 'A2' AND s.aar_at = now()) <> 1 THEN
    RAISE EXCEPTION 'ASK 499 A2 row: builder row count is not 1; nothing kept';
  END IF;
END $g$;
COMMIT;
-- Separate call after COMMIT:
-- SELECT id, ask, rev, prior_row, objective_met, status, md5_match FROM public.ask_aar_snapshots WHERE ask = 499 AND rev = 'A2';
-- SELECT id, snapshot_id, builder_seats FROM public.ask_aar_builders ORDER BY id DESC LIMIT 2;
-- SELECT * FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';
-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id = (SELECT id FROM public.ask_aar_snapshots WHERE ask = 499 AND rev = 'A2');
