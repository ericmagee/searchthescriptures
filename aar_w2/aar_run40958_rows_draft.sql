-- Run 40958 AAR rows, DRAFT rev 0 (W2, seat 32, 11-19/20). For W1 and W3 to grade. NOT RUN.
-- Two snapshot rows and two builder rows, run once from seat 36 (the coordinator):
--   R1: ASK 499 A1 proven by run 40958, prior_row 33 (as row 31 did for 16). Built by INSERT ... SELECT from row 33, so the graded fields (build_files, grades, md5_written, audit_ids, card, objects, readbacks, revert, plan) are copied byte for byte; only the run fields change.
--   R2: ASK 500 A1 (written 22:37:18Z, read back, proven by the launch of run 40958), prior_row NULL; no earlier 500 row exists.
-- Facts: W4 10168 (launch), 10170 (result); W1 10171 and W2 10173 (grades of Q1 to Q5); W1 10166 and W2 10167 (500 A1 readbacks); audit 39330, 39331; v222 (W3 10162; W1 10163, W2 10164).
-- The crash: execution 40958 crashed out of memory at Panel Tokens at 23:54:57Z; the tokens and cost row was never written (ASK 501). record_debate_row_tokens is still unproven after 494 A2.
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3APzb2DidJoZ9Avizjn';

-- R1: ASK 499 A1, proven by run 40958.
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources)
SELECT s.ask, s.rev, s.title, s.objective, 'in part',
 $t$A1 written (audit 39312 and 39313) and read back (snapshot 33). Proving run ODV1-40958-vufevpqd (released 22:48:19Z in W4's thread; W4 10168, 10170; graded W1 10171, W2 10173): Q1 the row saved (debate_results b36e87ec, CHALLENGER PREVAILS, 3 judgments); Q2 every call to rpc/ppj_put (3), ppj_status (19) and ppj_get (1) ran as service_role with HTTP 200, user agent n8n; Q3 no anon call to the three; Q5 ppj_replies holds 3 rows (slots 1 to 3) for nonce ppj-40958-*. Q4 (the Panel Judge Call executions) was not checked by a grader, because the n8n MCP cannot reach that workflow; Q2 and Q5 stand in, and Q2 also closes the Panel Judge Call readback (W1 10142). The engine execution then crashed out of memory at Panel Tokens (23:54:57Z), after the panel and the saves; the tokens and cost row was not written (ASK 501). A2 (the revokes) is not done, so no function refuses anon yet.$t$,
 '10168, 10170, 10171, 10173',
 'session_01H1X3APzb2DidJoZ9Avizjn', s.id,
 s.operator_words, s.card, s.owner_seat, s.plan, s.build_files, s.revert, s.grades, s.md5_written, s.audit_ids, s.objects, s.tests, s.readbacks,
 '{"run_token":"ODV1-40958-vufevpqd","release":"22:48:19Z in W4''s thread","result_post":10170,"checks":[10171,10173],"debate_results_id":"b36e87ec","row_saved":true,"role_key":"request.sb.jwt.apikey.payload.role and request.sb.jwt.authorization.payload.role","service_role_seen":true,"ppj_calls":{"ppj_put":3,"ppj_status":19,"ppj_get":1},"anon_ppj_calls":0,"ppj_replies":3,"q4":"not checked (n8n MCP cannot reach Panel Judge Call)","crashed":"out of memory at Panel Tokens, 23:54:57Z","tokens_row":false,"run_cost_usd":null}'::jsonb,
 '{"engine_manual":"v222 (f783df20)","op_doc":"not yet"}'::jsonb,
 'proven by run',
 s.sources || '[10162, 10163, 10164, 10168, 10170, 10171, 10173]'::jsonb
FROM public.ask_aar_snapshots s WHERE s.id = 33;

INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT n.id, NULL, b.builder_seats, b.sources, 'session_01H1X3APzb2DidJoZ9Avizjn'
FROM public.ask_aar_snapshots n, public.ask_aar_builders b
WHERE n.ask = 499 AND n.rev = 'A1' AND n.prior_row = 33 AND n.aar_at = now() AND b.snapshot_id = 33;

-- R2: ASK 500 A1.
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(500, 'A1', 'Dashboard launches send the start-webhook header (x-odv1-key from Vault)',
 $t$Today the engine's start webhook (Debate Start, POST /webhook/oracle-debate-v1) has no authentication. Anyone who has the URL can start a full engine run (1.73 to 5.15 USD for this pair; run 40891 was 5.149) with any topic, engines and profiles. A direct POST also skips the topic fence, which lives in dash_launch_odv1. The URL is not a secret (W4 10095 B8). Close that, and keep every real launch working. Expected effect: a POST to the start webhook without the right header is refused by n8n before the flow runs, and every real launch goes through dash_launch_odv1 (topic fence and odv1_launches log), which sends the header. (a500_w3/plan500.md)$t$,
 'in part',
 $t$A0 done by the operator outside any transcript: Vault secret odv1_start_webhook (created 22:33:10Z, length 32 or more) and n8n credential "ODV1 start webhook" (hnDqGbFZE6nUMP4g), checked by name only (W4 10161, W1 10163). A1 written on the card at 22:37:18Z (audit 39330 and 39331): dash_launch_odv1 prosrc 3b74a293 to 6078032f, which equals the graded test's S1; read back by W1 (10166) and W2 (10167). Proven by run 40958: launched through dash_launch_odv1 at 22:48:48Z with the header (launch row 84, pg_net request 10078, HTTP 200 accepted; W4 10168). A2 (Debate Start requires the header) is not done, so the webhook is still open to anyone with the URL.$t$,
 '10161, 10163, 10165, 10166, 10167, 10168',
 'session_01H1X3APzb2DidJoZ9Avizjn', NULL,
 '"not yet"'::jsonb,
 '{"answer":"Write it","thread":"W4","press_time":"22:37:18Z","source":"audit 39331"}'::jsonb,
 'W3',
 '{"md5":"5b31db8c","path":"a500_w3/plan500.md","commit":"ab6c306c","wall_id":10132}'::jsonb,
 '[{"md5":"2bda0803","path":"a500_w4/step500a1.sql","commit":"de46f664"}]'::jsonb,
 '{"what":"revert500a1.sql on the operator''s word (revert A2 first if it is live)","files":[{"md5":"c138f486","path":"a500_w4/revert500a1.sql","commit":"de46f664"}]}'::jsonb,
 '[{"seat":"W1","verdict":"PASS (plan rev 2)","wall_id":10133,"md5_graded":"5b31db8c","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (plan rev 2)","wall_id":10134,"md5_graded":"5b31db8c","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (build rev 1, C4 met)","wall_id":10130,"md5_graded":"2bda0803","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (build rev 1, C1 to C4 met)","wall_id":10131,"md5_graded":"2bda0803","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (rolled-back test output)","wall_id":10147,"md5_graded":"3c0490bc","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (rolled-back test output)","wall_id":10148,"md5_graded":"3c0490bc","verdict_norm":"PASS"}]'::jsonb,
 ARRAY['2bda0803'],
 '[39330, 39331]'::jsonb,
 '[{"kind":"function","name":"public.dash_launch_odv1 (three insertions: v_key, Vault read with raise, headers on net.http_post)","before":"3b74a293","after":"6078032f"}]'::jsonb,
 '{"file":{"md5":"f02b043b","path":"a500_w4/test500a1_rollback.sql","commit":"de46f664"},"output":{"md5":"3c0490bc","path":"ask500/w4/test500a1_output_2152Z.txt"},"result":"PASS, all rolled back (B0, S1 6078032f, T1, T2a to T2g, T3 before A0, R1)","wall_id":10146}'::jsonb,
 '[{"seat":"W1","result":"CONFIRMED","wall_id":10166},{"seat":"W2","result":"CONFIRMED","wall_id":10167}]'::jsonb,
 '{"run_token":"ODV1-40958-vufevpqd","launch":"dash_launch_odv1 at 22:48:48Z, odv1_launches row 84","pg_net_request":10078,"http_status":200,"result_post":10168,"checks":[10171,10173],"crashed":"out of memory at Panel Tokens, 23:54:57Z (not tied to 500 A1)"}'::jsonb,
 '{"engine_manual":"not yet","op_doc":"not yet"}'::jsonb,
 'proven by run',
 '[10095, 10129, 10130, 10131, 10132, 10133, 10134, 10146, 10147, 10148, 10161, 10163, 10165, 10166, 10167, 10168, 10171, 10173, "audit 39330", "audit 39331"]'::jsonb);

INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'],
 '[{"seat":"W4","what":"built step500a1.sql 2bda0803 (build rev 1)","wall_id":10129},{"seat":"W4","what":"wrote 500 A1 on its card","wall_id":10165}]'::jsonb,
 'session_01H1X3APzb2DidJoZ9Avizjn'
FROM public.ask_aar_snapshots s
WHERE s.ask = 500 AND s.rev = 'A1' AND s.prior_row IS NULL AND s.aar_at = now();

DO $g$ BEGIN
  IF (SELECT count(*) FROM public.ask_aar_snapshots s WHERE s.aar_at = now() AND ((s.ask = 499 AND s.prior_row = 33) OR (s.ask = 500 AND s.prior_row IS NULL))) <> 2 THEN
    RAISE EXCEPTION 'run 40958 rows: snapshot count is not 2; nothing kept';
  END IF;
  IF (SELECT count(*) FROM public.ask_aar_builders b JOIN public.ask_aar_snapshots s ON s.id = b.snapshot_id WHERE s.aar_at = now()) <> 2 THEN
    RAISE EXCEPTION 'run 40958 rows: builder row count is not 2; nothing kept';
  END IF;
  IF EXISTS (SELECT 1 FROM public.ask_aar_snapshots s WHERE s.aar_at = now() AND NOT s.md5_match) THEN
    RAISE EXCEPTION 'run 40958 rows: md5_match is false; nothing kept';
  END IF;
END $g$;
COMMIT;
-- Separate calls after COMMIT:
-- SELECT id, ask, rev, prior_row, objective_met, status, md5_match, md5(s::text) FROM public.ask_aar_snapshots s WHERE id > 33 ORDER BY id;
-- SELECT id, snapshot_id, builder_seats FROM public.ask_aar_builders WHERE id > 25 ORDER BY id;
-- SELECT * FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';
-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id > 33;
