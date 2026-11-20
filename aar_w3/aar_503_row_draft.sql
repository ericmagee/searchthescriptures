-- ASK 503 snapshot row, SKELETON rev 2 (W3, seat 33, 11-20; rev 1 0ce19105 PASS as a form W1 10211, W2 10213 C1 applied: W2 engine-target verdict has no N1; rev 0 87831126 PASS as a form W1 10209, N1 applied: W1 DB-step verdict notes N1). For W1 and W2 to grade once it is filled. NOT RUN.
-- Pattern: aar_w3/aar_499a2_row_draft.sql (__FILL values and a closing guard) and W2's aar_w2/aar_run40958_rows_draft.sql.
-- ASK 503 is the correction of ASK 487 (snapshot 8, ask 487 rev 1, "read back", objective "not yet"). 503 is its own ASK, so prior_row is NULL; snapshot 8 is cited in sources and is not changed.
-- Run only from seat 36 (the coordinator), once, after: the 503 write on W4's card, two non-writer readbacks, the operator's released rerun, and the run checks (a503_w3/run503_checks.md 9b0cd38a, R1 to R7) posted by W4 and graded by two non-builder seats.
-- Every __FILL_...__ value must be replaced from live SQL and the Wall, and the filled file graded again, before running. Numeric placeholders are written as quoted strings ("__FILL_..__") so the file parses; replace the quotes too, with the bare number. The guard raises and rolls back if any __FILL is left.
-- If the rerun fails a check (R1 to R5), objective_met is "no" and the reason says which check failed; the status stays "read back".
-- Manuals: fill from live SQL at run time. If the 503 engine manual entry (v223, em_pairs_503_v222_draft.json) is not yet written, write "vNNN pending (<pairs file md5>)", true at the moment the row runs.
-- One builder row: W4 built target_engine_503.json, step503_db.sql and revert503_db.sql (build rev 2, Wall 10192) and writes them on its card.
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3APzb2DidJoZ9Avizjn';
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(503, '2', 'Gemini debater back to gemini-3.8-flash; gemini-4-hydrogen off the judge lists (corrects ASK 487)',
 $t$The operator, 18:20 CST 11-19: "let's remove hydrogen as a judge (it's not a good fit for the panel). reinstate gemini flash. and rerun." ASK 487 moved the gemini debater to google/gemini-4-hydrogen, against his 21:51 CST 11-18 ruling to keep Gemini 3.8 Flash. Undo that and take hydrogen off the panel, touching no other model (his 18:26 CST words). Expected effect: the gemini debater runs google/gemini-3.8-flash, the Any vs Any list names Gemini 3.8 Flash, gemini_deb is inactive, no seat list (ORDER0, __ALT, Accept Build ORDER) holds hydrogen, and the rerun of the same debate completes with no hydrogen call. (a487_w3/plan487_correction.md)$t$,
 '__FILL_OBJECTIVE_MET__',
 $t$Written on the operator's card at __FILL_CARD_PRESS_Z__ (engine __FILL_ENGINE_VERSION_BEFORE__ to __FILL_ENGINE_VERSION_AFTER__; audit __FILL_AUDIT_FIRST__ to __FILL_AUDIT_LAST__) and read back by __FILL_READBACK_SEAT_1__ (__FILL_READBACK_WALL_1__) and __FILL_READBACK_SEAT_2__ (__FILL_READBACK_WALL_2__). Rerun __FILL_RUN_TOKEN__ (released __FILL_RELEASE_Z__; W4 __FILL_RESULT_WALL__; graded __FILL_RUNCHECK_SEAT_1__ __FILL_RUNCHECK_WALL_1__, __FILL_RUNCHECK_SEAT_2__ __FILL_RUNCHECK_WALL_2__): __FILL_RUN_SUMMARY__ (R1 debater model, R2 no hydrogen in judged_by, panel_expected, panel_substitution, debate_removals, early_alternate or call_costs, R3 finished, R4, R5; R6 and R7 numbers: __FILL_R6_R7__).$t$,
 '__FILL_WRITE_WALL__, __FILL_READBACK_WALL_1__, __FILL_READBACK_WALL_2__, __FILL_RESULT_WALL__, __FILL_RUNCHECK_WALL_1__, __FILL_RUNCHECK_WALL_2__',
 'session_01H1X3APzb2DidJoZ9Avizjn', NULL,
 '["21:51 CST 11-18 (W4 9126): we keep gemini 3.8 flash.. it''s good. my mistake on that.. we keep spark too. it''s currently debating well", "18:17 CST 11-19: no.. no.. i said later gemini flash was good... remove the other flash models. Why was that missed", "18:20 CST 11-19: okay. a mistake. let''s remove hydrogen as a judge (it''s not a good fit for the panel). reinstate gemini flash. and rerun.", "18:26 CST 11-19: why are you touching other models. they should already be removed when you removed gemini flash"]'::jsonb,
 '{"answer":"__FILL_CARD_ANSWER__","thread":"W4","press_time":"__FILL_CARD_PRESS_Z__","source":"audit __FILL_AUDIT_LAST__"}'::jsonb,
 'W3',
 '{"md5":"1cd84663","path":"a487_w3/plan487_correction.md","commit":"28d70bab","wall_id":10193}'::jsonb,
 '[{"md5":"54f23f47","path":"ask503/w4/target_engine_503.json","commit":"__FILL_BUILD_COMMIT_OR_PROJECT_FILES__"},{"md5":"4772c688","path":"ask503/w4/step503_db.sql","commit":"__FILL_BUILD_COMMIT_OR_PROJECT_FILES__"}]'::jsonb,
 '{"what":"write back the engine from live_engine_503_pre.json and run revert503_db.sql, on the operator''s word","files":[{"md5":"afd83622","path":"ask503/w4/live_engine_503_pre.json"},{"md5":"370de54f","path":"ask503/w4/revert503_db.sql"}]}'::jsonb,
 '[{"seat":"W1","verdict":"PASS (plan rev 2)","wall_id":10195,"md5_graded":"1cd84663","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (plan rev 2)","wall_id":10196,"md5_graded":"1cd84663","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (build rev 2, engine target)","wall_id":10195,"md5_graded":"54f23f47","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (build rev 2, engine target)","wall_id":10196,"md5_graded":"54f23f47","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (build rev 2, DB step, N1)","wall_id":10195,"md5_graded":"4772c688","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (build rev 2, DB step, N1)","wall_id":10196,"md5_graded":"4772c688","verdict_norm":"PASS"}]'::jsonb,
 ARRAY['54f23f47','4772c688'],
 '["__FILL_AUDIT_IDS_AS_NUMBERS__"]'::jsonb,
 '[{"kind":"engine node","name":"Init Seats line 13, ENG gemini mc (C1)","before":"gemini_deb","after":"gemini"},
   {"kind":"engine node","name":"Init Seats lines 25 (ORDER0) and 35 (__ALT), Accept Build line 26 (ORDER) (C6)","before":"hold hydrogen","after":"no hydrogen; others in the same order"},
   {"kind":"engine","name":"workflow moMxiV4Irg1uRBZN","before":"01691ed8","after":"__FILL_ENGINE_VERSION_AFTER__"},
   {"kind":"function","name":"public.dash_debaters row 3 (C2)","before":"b6084d5a","after":"c6621b30"},
   {"kind":"row","name":"model_config gemini_deb (C3)","before":"active true","after":"active false (kept)"}]'::jsonb,
 '[{"file":"ask503/w4/q2_503_rev2_output.txt","md5":"2fa59f23","result":"offline Init Seats test: spark vs gemini panel sol62, chatgpt, sol, reserve qwen4max, debater google/gemini-3.8-flash; chatgpt vs grok panel haiku, gemini, spark","wall_id":10192}]'::jsonb,
 '[{"seat":"__FILL_READBACK_SEAT_1__","result":"CONFIRMED","wall_id":"__FILL_READBACK_WALL_1__"},{"seat":"__FILL_READBACK_SEAT_2__","result":"CONFIRMED","wall_id":"__FILL_READBACK_WALL_2__"}]'::jsonb,
 '{"run_token":"__FILL_RUN_TOKEN__","release":"__FILL_RELEASE_Z__","result_post":"__FILL_RESULT_WALL__","checks":["__FILL_RUNCHECK_WALL_1__","__FILL_RUNCHECK_WALL_2__"],"checks_file":"a503_w3/run503_checks.md 9b0cd38a","debate_results_id":"__FILL_DEBATE_RESULTS_ID__","debater_model":"__FILL_R1_MODEL__","hydrogen_calls":"__FILL_R2_COUNT__","call_costs_entries":"__FILL_CALL_COSTS_N__","run_cost_usd":"__FILL_RUN_COST__","debate_errors":"__FILL_DEBATE_ERRORS_N__","enforcer_rows":"__FILL_ENFORCER_ROWS__","n8n_batch_by_W4":{"status":"__FILL_EXEC_STATUS__","last_node":"__FILL_LAST_NODE__","minutes":"__FILL_MINUTES__","json_size_mb":"__FILL_JSON_MB__","rundata_mb":"__FILL_RUNDATA_MB__"}}'::jsonb,
 '{"engine_manual":"__FILL_ENGINE_MANUAL_AT_RUN_TIME__","op_doc":"__FILL_OP_DOC_AT_RUN_TIME__"}'::jsonb,
 '__FILL_STATUS__',
 '[9126, 10189, 10190, 10192, 10193, 10195, 10196, "snapshot 8", "__FILL_WRITE_WALL__", "__FILL_READBACK_WALL_1__", "__FILL_READBACK_WALL_2__", "__FILL_RESULT_WALL__", "__FILL_RUNCHECK_WALL_1__", "__FILL_RUNCHECK_WALL_2__", "audit __FILL_AUDIT_LAST__"]'::jsonb);

INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'],
 '[{"seat":"W4","what":"built target_engine_503.json 54f23f47, step503_db.sql 4772c688 and revert503_db.sql 370de54f (build rev 2)","wall_id":10192},{"seat":"W4","what":"wrote 503 on its card","wall_id":"__FILL_WRITE_WALL__"}]'::jsonb,
 'session_01H1X3APzb2DidJoZ9Avizjn'
FROM public.ask_aar_snapshots s
WHERE s.ask = 503 AND s.rev = '2' AND s.prior_row IS NULL AND s.aar_at = now();

DO $g$ BEGIN
  IF EXISTS (SELECT 1 FROM public.ask_aar_snapshots s WHERE s.ask = 503 AND s.aar_at = now() AND to_jsonb(s)::text LIKE '%\_\_FILL%') THEN
    RAISE EXCEPTION 'ASK 503 row: a __FILL value is left; nothing kept';
  END IF;
  IF EXISTS (SELECT 1 FROM public.ask_aar_builders b JOIN public.ask_aar_snapshots s ON s.id = b.snapshot_id WHERE s.ask = 503 AND s.aar_at = now() AND b.sources::text LIKE '%\_\_FILL%') THEN
    RAISE EXCEPTION 'ASK 503 builder row: a __FILL value is left; nothing kept';
  END IF;
  IF (SELECT count(*) FROM public.ask_aar_builders b JOIN public.ask_aar_snapshots s ON s.id = b.snapshot_id WHERE s.ask = 503 AND s.aar_at = now()) <> 1 THEN
    RAISE EXCEPTION 'ASK 503 row: builder row count is not 1; nothing kept';
  END IF;
  IF EXISTS (SELECT 1 FROM public.ask_aar_snapshots s WHERE s.ask = 503 AND s.aar_at = now() AND NOT s.md5_match) THEN
    RAISE EXCEPTION 'ASK 503 row: md5_match is false; nothing kept';
  END IF;
END $g$;
COMMIT;
-- Separate calls after COMMIT:
-- SELECT id, ask, rev, prior_row, objective_met, status, md5_match, md5(s::text) FROM public.ask_aar_snapshots s WHERE ask = 503;
-- SELECT id, snapshot_id, builder_seats FROM public.ask_aar_builders ORDER BY id DESC LIMIT 1;
-- SELECT * FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';
-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id = (SELECT id FROM public.ask_aar_snapshots WHERE ask = 503);
