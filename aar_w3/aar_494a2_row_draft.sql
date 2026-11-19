-- ASK 494 A2 snapshot row for the 11-19 pm AAR, DRAFT rev 1 (W3; replaces rev 0 0f17d00e: W2 10077 C2 and W1 10078, objects "before" text corrected per function; W1 10076 N1 and W2 10077 2.5, plan wall_id 9820; sources add 9820, 9824). For W1 and W2 to grade. NOT RUN.
-- C1 (W1 10076): run this BEFORE the engine manual v221 write. If v221 is written first, the manuals field must first be set to v221's md5, card time and guard audit (W3 revises; do not run as is).
-- Run only from seat 36 (the coordinator), once, after the grades. Read the closing SELECTs in a separate call after COMMIT.
-- A2 is a new revision of ASK 494 (rev 'A2'), not a correction of row 16 or 31, so prior_row is NULL.
-- One builder row for it: W2 built step494.sql fc32cec9 (Wall 9759); W4 wrote it on its card (Wall 10070).
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3APzb2DidJoZ9Avizjn';
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(494, 'A2', 'Public key can no longer call the engine write functions',
 $t$Today anyone holding the public (anon) key can call rpc/record_debate_row and the other engine write functions. With them they can write a forged debate row, judgment or outcome. Close that, and keep every engine run saving. Expected effect: the nine engine write functions refuse anon with 42501, and the engine's saves run as service_role. (a494_w2/plan494.md)$t$,
 'in part',
 $t$A2 written on the operator's card at 20:51:10Z (audit 39218 to 39227) and read back by W3 (10071) and W1 (10072): only postgres, service_role and lab_seat hold EXECUTE on the nine; anon and authenticated cannot call any. The rolled-back test passed first (W4 10059; PASS W1 10061, W3 10062), and A1 was proven by run 40891 (snapshot 31). Not yet: the next engine run saves its row and judgments with no 42501.$t$,
 '10059, 10061, 10062, 10070, 10071, 10072',
 'session_01H1X3APzb2DidJoZ9Avizjn', NULL,
 '"not yet"'::jsonb,
 '{"answer":"Write it","thread":"W4","press_time":"20:51:10Z","source":"audit 39227"}'::jsonb,
 'W2',
 '{"md5":"b57c4b09","path":"a494_w2/plan494.md","commit":"000477e9","wall_id":9820}'::jsonb,
 '[{"md5":"fc32cec9","path":"a494_w2/step494.sql","commit":"9f2f486a"}]'::jsonb,
 '{"md5":"dfcfdd2f","path":"a494_w2/revert494.sql"}'::jsonb,
 '[{"seat":"W1","verdict":"PASS with N1 and N2 (plan rev 0 and step)","wall_id":9765,"md5_graded":"fc32cec9","verdict_norm":"PASS"},
   {"seat":"W3","verdict":"PASS with four notes (plan rev 0 and step)","wall_id":9766,"md5_graded":"fc32cec9","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (plan rev 1; step unchanged)","wall_id":9768,"md5_graded":"fc32cec9","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (test output)","wall_id":10061,"md5_graded":"b6f77465","verdict_norm":"PASS"},
   {"seat":"W3","verdict":"PASS (test output)","wall_id":10062,"md5_graded":"b6f77465","verdict_norm":"PASS"}]'::jsonb,
 ARRAY['fc32cec9'],
 '[39218,39219,39220,39221,39222,39223,39224,39225,39226,39227]'::jsonb,
 '[{"kind":"grants","name":"EXECUTE on the nine engine write functions","before":"anon on all nine; authenticated on eight (not record_replay_judgments); PUBLIC on odv1_record_panel_alternates and odv1_mark_grading_failed; postgres, service_role, lab_seat (grantee list md5 4a7b7434)","after":"postgres, service_role, lab_seat only"}]'::jsonb,
 '[{"file":"a494_w2/test494_rollback.sql","md5":"b6f77465","result":"planned exception; C1 recorded true; T1 to T3 refused 42501; T4, T5 recorded true; T6 none; R1 true; nothing kept","output":"ask494/w4/test494_output_2046Z.txt 52d8e56f","wall_id":10059}]'::jsonb,
 '[{"seat":"W3","result":"CONFIRMED","wall_id":10071},{"seat":"W1","result":"CONFIRMED","wall_id":10072}]'::jsonb,
 '{"case":"not yet: the next engine run saves its row and judgments with no 42501"}'::jsonb,
 '{"engine_manual":"v221 pending (em_pairs_494a2_v220.json 9853812e)","op_doc":"not yet"}'::jsonb,
 'read back',
 '[9759, 9765, 9766, 9768, 9774, 9820, 9824, 10044, 10059, 10060, 10061, 10062, 10070, 10071, 10072, "audit 39227"]'::jsonb);

INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W2','W4'],
 '[{"seat":"W2","what":"built step494.sql fc32cec9","wall_id":9759},{"seat":"W4","what":"wrote 494 A2 on its card","wall_id":10070}]'::jsonb,
 'session_01H1X3APzb2DidJoZ9Avizjn'
FROM public.ask_aar_snapshots s
WHERE s.ask = 494 AND s.rev = 'A2' AND s.prior_row IS NULL AND s.aar_at = now();
COMMIT;
-- Separate call after COMMIT:
-- SELECT id, ask, rev, prior_row, objective_met, status, md5_match FROM public.ask_aar_snapshots WHERE ask = 494 AND rev = 'A2';
-- SELECT id, snapshot_id, builder_seats FROM public.ask_aar_builders WHERE id > 23 ORDER BY id;
-- SELECT * FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';
-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id > 31;
