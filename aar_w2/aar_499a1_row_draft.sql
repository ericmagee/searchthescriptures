-- ASK 499 A1 snapshot row, DRAFT rev 0 (W2, seat 32, 11-19). For W1 and W3 to grade. NOT RUN.
-- Pattern: snapshot 16 (494 A1), with one change: the grades are on the build files actually written (W1 10093, W2 10094), so md5_match can be true (row 16's gap, AAR grade count findings).
-- Run only from seat 36 (the coordinator), once, after: the A1 card write by W4, the fetchback match, and two non-writer readbacks.
-- Every __FILL_...__ value must be replaced from live SQL and the Wall before running. The guard at the end raises and rolls back if any is left.
-- A1 is a new revision of ASK 499 (rev 'A1'); prior_row is NULL. One builder row: W4 built the A1 targets and writes them on its card.
-- objective_met is 'not yet' as on row 16: A1 alone makes no function refuse anon. The proving run (plan499_a1_run.md 5a689265 Q1 to Q6) gets its own prior_row row, as row 31 did for 16.
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3APzb2DidJoZ9Avizjn';
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(499, 'A1', 'Panel judge reply nodes moved to the "Supabase account" credential',
 $t$Today anyone holding the public (anon) key can call rpc/ppj_put, and with it store a reply in ppj_replies for any nonce and slot. The engine keeps the first reply per slot and reads it back as that panel judge's answer, so a reply stored before the judge's own would stand as the judge's verdict. The same key reads any nonce's replies (ppj_get, ppj_status). Close that, and keep every engine run's panel judges working. Expected effect: ppj_put, ppj_status and ppj_get refuse anon and authenticated with 42501, and the engine's calls to them run as service_role. (a499_w3/plan499.md)$t$,
 'not yet',
 $t$A1 only is written (audit __FILL_AUDIT_ID__; engine d491f4a5 to __FILL_ENGINE_AFTER__, Panel Judge Call 15a91429 to __FILL_PJC_AFTER__; fetchback equal to the targets) and read back by __FILL_READBACK_SEAT_1__ (__FILL_READBACK_WALL_1__) and __FILL_READBACK_SEAT_2__ (__FILL_READBACK_WALL_2__). The proving run and A2 (the revokes) are not done, so no function refuses anon yet.$t$,
 '__FILL_WRITE_WALL__, __FILL_READBACK_WALL_1__, __FILL_READBACK_WALL_2__',
 'session_01H1X3APzb2DidJoZ9Avizjn', NULL,
 '"not yet"'::jsonb,
 '{"answer":"__FILL_CARD_ANSWER__","thread":"W4","press_time":"__FILL_CARD_PRESS_Z__","source":"audit __FILL_AUDIT_ID__"}'::jsonb,
 'W3',
 '{"md5":"20b80b63","path":"a499_w3/plan499.md","commit":"a2921f51","wall_id":10079}'::jsonb,
 '[{"md5":"8ca5c722","path":"ask499/w4/target_engine_499a1.json","commit":"__FILL_COMMIT__"},
   {"md5":"5b79316b","path":"ask499/w4/target_pjc_499a1.json","commit":"__FILL_COMMIT__"},
   {"md5":"62127852","path":"ask499/w4/build499a1.py","commit":"__FILL_COMMIT__"}]'::jsonb,
 '{"what":"write back the live files on the operator''s word (plan499_a1_run.md section 4)","files":[{"md5":"8197ec2e","path":"ask499/w4/live_engine_499.json"},{"md5":"26ab0bac","path":"ask499/w4/live_pjc_499.json"}]}'::jsonb,
 '[{"seat":"W2","verdict":"PASS with three notes (plan rev 0)","wall_id":10080,"md5_graded":"20b80b63","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (plan rev 0)","wall_id":10081,"md5_graded":"20b80b63","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (build rev 0)","wall_id":10093,"md5_graded":"8ca5c722","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (build rev 0)","wall_id":10094,"md5_graded":"8ca5c722","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (build rev 0)","wall_id":10093,"md5_graded":"5b79316b","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (build rev 0)","wall_id":10094,"md5_graded":"5b79316b","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (A1 run checks and A2 test plan)","wall_id":10093,"md5_graded":"5a689265","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (A1 run checks and A2 test plan)","wall_id":10094,"md5_graded":"5a689265","verdict_norm":"PASS"}]'::jsonb,
 ARRAY['8ca5c722','5b79316b'],
 '[__FILL_AUDIT_ID__]'::jsonb,
 '[{"kind":"workflow","name":"engine moMxiV4Irg1uRBZN (Panel Judges Poll and Panel Judges Fetch, credential only)","before":"d491f4a5","after":"__FILL_ENGINE_AFTER__"},
   {"kind":"workflow","name":"WALL-2024 Panel Judge Call Y1VIsNB6KBrs1znP (Store Reply, credential only)","before":"15a91429","after":"__FILL_PJC_AFTER__"}]'::jsonb,
 '"not yet"'::jsonb,
 '[{"seat":"__FILL_READBACK_SEAT_1__","result":"CONFIRMED","wall_id":__FILL_READBACK_WALL_1__},{"seat":"__FILL_READBACK_SEAT_2__","result":"CONFIRMED","wall_id":__FILL_READBACK_WALL_2__}]'::jsonb,
 '{"owed":true,"case":"plan499_a1_run.md 5a689265 Q1 to Q6: role service_role on rpc/ppj_put, ppj_status and ppj_get, all 3 panel replies collected"}'::jsonb,
 '{"engine_manual":"not yet","op_doc":"not yet"}'::jsonb,
 'read back',
 '[10079, 10080, 10081, 10089, 10091, 10093, 10094, __FILL_WRITE_WALL__, __FILL_READBACK_WALL_1__, __FILL_READBACK_WALL_2__, "audit __FILL_AUDIT_ID__"]'::jsonb);

INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'],
 '[{"seat":"W4","what":"built target_engine_499a1.json 8ca5c722 and target_pjc_499a1.json 5b79316b","wall_id":10089},{"seat":"W4","what":"wrote 499 A1 on its card","wall_id":__FILL_WRITE_WALL__}]'::jsonb,
 'session_01H1X3APzb2DidJoZ9Avizjn'
FROM public.ask_aar_snapshots s
WHERE s.ask = 499 AND s.rev = 'A1' AND s.prior_row IS NULL AND s.aar_at = now();

DO $g$ BEGIN
  IF EXISTS (SELECT 1 FROM public.ask_aar_snapshots s WHERE s.ask = 499 AND s.rev = 'A1' AND s.aar_at = now() AND to_jsonb(s)::text LIKE '%\_\_FILL%') THEN
    RAISE EXCEPTION 'ASK 499 A1 row: a __FILL value is left; nothing kept';
  END IF;
  IF (SELECT count(*) FROM public.ask_aar_builders b JOIN public.ask_aar_snapshots s ON s.id = b.snapshot_id WHERE s.ask = 499 AND s.rev = 'A1' AND s.aar_at = now()) <> 1 THEN
    RAISE EXCEPTION 'ASK 499 A1 row: builder row count is not 1; nothing kept';
  END IF;
END $g$;
COMMIT;
-- Separate call after COMMIT:
-- SELECT id, ask, rev, prior_row, objective_met, status, md5_match FROM public.ask_aar_snapshots WHERE ask = 499 AND rev = 'A1';
-- SELECT id, snapshot_id, builder_seats FROM public.ask_aar_builders WHERE id > 24 ORDER BY id;
-- SELECT * FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';
-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id > 32;
