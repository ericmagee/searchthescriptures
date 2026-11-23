-- ASK AAR snapshot rows, DRAFT rev 1 (W3, 2026-11-23; replaces rev 0 e715efab on W2 10367 C1 and C2), for the coordinator (seat 36) to run once after W2's grade. NOT RUN.
-- Rows: 494 A2 (proven by run 40995; prior_row 32), 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515 A1, 515 r7, 516. Each field cites Wall ids or audit ids.
-- Not covered: ASKs 517 to 520 (held). The per-field sources are in each row's sources array.
-- Run from seat 36 in one call, then read the closing SELECTs in separate calls.
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3ANeXjt6pnw4fs6Wxr4';
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(494, 'A2', $t$Public key can no longer call the engine write functions$t$,
 $t$Today anyone holding the public (anon) key can call rpc/record_debate_row and the other engine write functions. With them they can write a forged debate row, judgment or outcome. Close that, and keep every engine run saving. Expected effect: the nine engine write functions refuse anon with 42501, and the engine's saves run as service_role. (a494_w2/plan494.md)$t$,
 'yes', $t$A2 written 20:51:24Z 11-19 (audit 39218 to 39227; snapshot 32). Run 40995 (ODV1-40995-inaaza3z) saved its row 8033944e at 02:31:23Z 11-20 and called rpc/record_debate_row_tokens once as service_role with HTTP 200 at 02:51:32Z, the last of the nine not yet shown after the revoke (W2 10224 item 4a; W1 10225 item 3). Live grants on 11-23: anon, authenticated and PUBLIC false on all nine; service_role and lab_seat true (W4 10356, W2 10355). Op doc line written as v138 on the operator's card 07:42:38Z 11-23 (readback W2 10365).$t$,
 '10224, 10225, 10355, 10356, 10364, 10365', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', 32,
 '"not yet"'::jsonb, $t${"answer": "Write it", "thread": "W4", "press_time": "20:51:10Z", "source": "snapshot 32 card field; the write landed at 20:51:24Z (audit 39218 to 39227)"}$t$::jsonb, 'W2',
 $t${"md5": "b57c4b09", "path": "a494_w2/plan494.md", "commit": "000477e9", "wall_id": 9820}$t$::jsonb,
 $t$[{"md5": "fc32cec9", "path": "a494_w2/step494.sql", "commit": "9f2f486a"}]$t$::jsonb,
 $t${"md5": "dfcfdd2f", "path": "a494_w2/revert494.sql"}$t$::jsonb,
 $t$[{"seat": "W1", "verdict": "PASS with N1 and N2 (plan rev 0 and step)", "wall_id": 9765, "md5_graded": "fc32cec9", "verdict_norm": "PASS"}, {"seat": "W3", "verdict": "PASS with four notes (plan rev 0 and step)", "wall_id": 9766, "md5_graded": "fc32cec9", "verdict_norm": "PASS"}, {"seat": "W1", "verdict": "PASS (plan rev 1; step unchanged)", "wall_id": 9768, "md5_graded": "fc32cec9", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['fc32cec9'], $t$[39218, 39219, 39220, 39221, 39222, 39223, 39224, 39225, 39226, 39227]$t$::jsonb,
 $t$[{"kind": "grants", "name": "EXECUTE on the nine engine write functions", "before": "anon on all nine (snapshot 32)", "after": "postgres, service_role, lab_seat only (live read 11-23, W4 10356)"}]$t$::jsonb,
 $t$[{"file": "a494_w2/test494_rollback.sql", "md5": "b6f77465", "wall_id": 10059}]$t$::jsonb,
 $t$[{"seat": "W3", "result": "CONFIRMED", "wall_id": 10071}, {"seat": "W1", "result": "CONFIRMED", "wall_id": 10072}]$t$::jsonb,
 $t${"run_token": "ODV1-40995-inaaza3z", "debate_results_id": "8033944e", "row_saved_at": "02:31:23Z 11-20", "rpc": "record_debate_row_tokens", "role": "service_role", "http_status": 200, "at": "02:51:32Z", "checks": [10224, 10225]}$t$::jsonb,
 $t${"engine_manual": "v221 (c3c39ed3)", "op_doc": "v138 (eadb1c43), card 07:42:38Z 11-23 W3 thread; readback W2 10365"}$t$::jsonb,
 'proven by run', $t$[9759, 9765, 9766, 9768, 9820, 10070, 10071, 10072, 10223, 10224, 10225, 10226, 10227, 10228, 10355, 10356, 10364, 10365, "audit 39227"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W2','W4'], $t$[{"seat": "W2", "what": "built step494.sql fc32cec9", "wall_id": 9759}, {"seat": "W4", "what": "wrote 494 A2 on its card", "wall_id": 10070}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 494 AND s.rev = 'A2' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(504, 'A1', $t$The deciding step of every break is written as a layer$t$,
 $t$Every BROKEN, FORCED and press-only break names its deciding step as a layer (DECIDES ... FROM ... MEETS [round]); an unlayered deciding step is a fault the enforcer sends back (operator 21:44 CST 11-19, ruling R1 04:22:57Z 11-20). Done when, on this topic, the corpus has all HELD (the operator, 21:21 CST 11-19: debate flow is fixed only when the corpus chain is all HELD). (a504_w3/plan504.md rev 1)$t$,
 'not yet', $t$Written 04:23:35Z 11-20 (audit 39410, 39411), graded PASS by W3 (10230) and W2 (10329), fetchbacks equal targets (W2 10329). Run 41024 (launched 06:57Z 11-20) is reported by the builder with the layered DECIDES on each break and drv_uncured 0 (W4 10241); no grader checked it on the Wall. 41024 was not all HELD (terra HELD; sol, sol62 BROKEN), so the done condition is not met.$t$,
 '10230, 10231, 10241, 10329', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"not yet"'::jsonb, $t${"answer": "Write it", "thread": "W4", "press_time": "04:23:35Z", "source": "audit 39410 and 39411"}$t$::jsonb, 'W3',
 $t${"md5": "d7260c9b", "path": "a504_w3/plan504.md"}$t$::jsonb,
 $t$[{"md5": "89eb2db0", "path": "ask504/w4/patch504.js"}, {"md5": "40eb352b", "path": "target engine"}, {"md5": "7cf72c53", "path": "target child"}]$t$::jsonb,
 $t${"what": "write back the pre files on the operator's word", "files": [{"md5": "2250eeeb", "path": "ask504/w4/live_moMxiV4Irg1uRBZN.json"}, {"md5": "01bcb5dc", "path": "ask504/w4/live_MqQHRl7mQQ0z8QdT.json"}]}$t$::jsonb,
 $t$[{"seat": "W3", "verdict": "PASS with C1 (build rev 1)", "wall_id": 10230, "md5_graded": "40eb352b", "verdict_norm": "PASS"}, {"seat": "W3", "verdict": "PASS with C1 (build rev 1)", "wall_id": 10230, "md5_graded": "7cf72c53", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10329, "md5_graded": "40eb352b", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10329, "md5_graded": "7cf72c53", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['40eb352b','7cf72c53'], $t$[39410, 39411]$t$::jsonb,
 $t$[{"kind": "workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "ddbd7afc", "after": "6bb4647a"}, {"kind": "workflow", "name": "Alternate Pass MqQHRl7mQQ0z8QdT", "before": "d7e57ead", "after": "c2e4af89"}, {"kind": "library", "name": "Shared Library sha", "before": "89fa920efdbde6b9", "after": "ae0b9a1abad1c58d"}]$t$::jsonb,
 $t$"offline replays in the build post; no rolled-back live test"$t$::jsonb,
 $t$[{"seat": "W2", "result": "fetchbacks bfe33ea5 and 67ae2ce8 equal the targets, 0 differences", "wall_id": 10329}]$t$::jsonb,
 $t${"run_token": "ODV1-41024-2wbmceb5", "report": 10241, "reported_by": "W4 (builder)", "graded": false, "forms": "layered DECIDES meeting [CR3] on each break; drv_uncured 0", "all_held": false}$t$::jsonb,
 $t${"engine_manual": "v223 (a6135f75)", "op_doc": "not yet"}$t$::jsonb,
 'read back', $t$[10229, 10230, 10231, 10236, 10241, 10329, "audit 39410", "audit 39411"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 504", "wall_id": 10231}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 504 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(506, 'A1', $t$Each judge states the points at issue first, and every grade names its point$t$,
 $t$Judges write POINTS AT ISSUE first, one entry per D vs C line on both sides, and every collision line names -- POINT: P<n>; a BROKEN line with no point or a point not in the section is sent back (E-COL), and the enforcer sees the P entry per break (operator 22:36 and 22:39 CST 11-19). (a506_w3/plan506.md rev 3)$t$,
 'in part', $t$Written 05:08:01Z 11-20 (audit 39425, 39426), graded PASS by W3 (10237) and W2 (10337), read back by W3 (10239). Run 41024 is reported by the builder with POINTS AT ISSUE in all 3 judgments and POINT on every collision line (W4 10241); no grader checked it on the Wall.$t$,
 '10237, 10238, 10239, 10241, 10337', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"not yet"'::jsonb, $t${"answer": "Write it", "thread": "W4", "press_time": "05:08:01Z", "source": "audit 39425 and 39426"}$t$::jsonb, 'W3',
 $t${"md5": "d90ffb59", "path": "a506_w3/plan506.md"}$t$::jsonb,
 $t$[{"md5": "f392f27e", "path": "ask506/w4/patch506.js"}, {"md5": "e325bfdb", "path": "target engine"}, {"md5": "f796ae1c", "path": "target child"}]$t$::jsonb,
 $t${"what": "write back the pre files on the operator's word", "files": [{"md5": "bfe33ea5", "path": "ask506/w4/pre_moMxiV4Irg1uRBZN.json"}, {"md5": "67ae2ce8", "path": "ask506/w4/pre_MqQHRl7mQQ0z8QdT.json"}]}$t$::jsonb,
 $t$[{"seat": "W3", "verdict": "PASS with N1 (build rev 0)", "wall_id": 10237, "md5_graded": "e325bfdb", "verdict_norm": "PASS"}, {"seat": "W3", "verdict": "PASS with N1 (build rev 0)", "wall_id": 10237, "md5_graded": "f796ae1c", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10337, "md5_graded": "e325bfdb", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10337, "md5_graded": "f796ae1c", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['e325bfdb','f796ae1c'], $t$[39425, 39426]$t$::jsonb,
 $t$[{"kind": "workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "6bb4647a", "after": "783e9f44"}, {"kind": "workflow", "name": "Alternate Pass MqQHRl7mQQ0z8QdT", "before": "c2e4af89", "after": "d6908ec6"}, {"kind": "library", "name": "Shared Library sha", "before": "ae0b9a1abad1c58d", "after": "680dd2af97c187be"}]$t$::jsonb,
 $t$"offline replays in the build post; no rolled-back live test"$t$::jsonb,
 $t$[{"seat": "W3", "result": "CONFIRMED", "wall_id": 10239}]$t$::jsonb,
 $t${"run_token": "ODV1-41024-2wbmceb5", "report": 10241, "reported_by": "W4 (builder)", "graded": false, "forms": "POINTS AT ISSUE in all 3; POINT on every collision line"}$t$::jsonb,
 $t${"engine_manual": "v224 (f56bd34a)", "op_doc": "not yet"}$t$::jsonb,
 'read back', $t$[10237, 10238, 10239, 10240, 10241, 10337, "audit 39425", "audit 39426"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 506", "wall_id": 10238}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 506 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(507, 'A1', $t$Each judge names, at the verdict, the whole position that holds$t$,
 $t$At the verdict each judge weighs each side's complete position and says which holds: a WHOLE POSITIONS section (both POSITION lines, then WHICH HOLDS in the DECIDES form) before RESULT; a mismatch with the grades is recorded only (TRIAL E-WHL) (operator 01:45 CST 11-20). (a507_w3/plan507.md rev 3)$t$,
 'not yet', $t$Written 08:10:37Z 11-20 (audit 39439, 39440), graded PASS by W3 (10246) and W2 (10338), read back by W3 (10248). The Wall holds no graded run check of the WHOLE POSITIONS section; the pre-run objectives were posted at 10285.$t$,
 '10246, 10247, 10248, 10285, 10338', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"not yet"'::jsonb, $t${"answer": "Write it", "thread": "W4", "press_time": "08:10:37Z", "source": "audit 39439 and 39440"}$t$::jsonb, 'W3',
 $t${"md5": "9cfca971", "path": "a507_w3/plan507.md"}$t$::jsonb,
 $t$[{"md5": "787e0429", "path": "ask507/w4/patch507.js"}, {"md5": "08046dfa", "path": "target engine"}, {"md5": "23c14f70", "path": "target child"}]$t$::jsonb,
 $t${"what": "write back the pre files on the operator's word", "files": [{"md5": "2a711680", "path": "ask507/w4/pre_engine_507.json"}, {"md5": "e95badda", "path": "ask507/w4/pre_child_507.json"}]}$t$::jsonb,
 $t$[{"seat": "W3", "verdict": "PASS with two notes (build rev 0)", "wall_id": 10246, "md5_graded": "08046dfa", "verdict_norm": "PASS"}, {"seat": "W3", "verdict": "PASS with two notes (build rev 0)", "wall_id": 10246, "md5_graded": "23c14f70", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10338, "md5_graded": "08046dfa", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10338, "md5_graded": "23c14f70", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['08046dfa','23c14f70'], $t$[39439, 39440]$t$::jsonb,
 $t$[{"kind": "workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "783e9f44", "after": "c6e630a4"}, {"kind": "workflow", "name": "Alternate Pass MqQHRl7mQQ0z8QdT", "before": "d6908ec6", "after": "ecb82fb2"}, {"kind": "library", "name": "Shared Library sha", "before": "680dd2af97c187be", "after": "b940895bd43124b7"}]$t$::jsonb,
 $t$"offline replays in the build post; no rolled-back live test"$t$::jsonb,
 $t$[{"seat": "W3", "result": "CONFIRMED", "wall_id": 10248}]$t$::jsonb,
 $t${"case": "not yet: no graded run check on the Wall", "objectives_post": 10285}$t$::jsonb,
 $t${"engine_manual": "v225 (2a2c40b0)", "op_doc": "not yet"}$t$::jsonb,
 'read back', $t$[10242, 10243, 10244, 10246, 10247, 10248, 10251, 10285, 10338, "audit 39439", "audit 39440"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 507", "wall_id": 10247}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 507 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(510, 'A1', $t$The enforcer checks one-verse grades and deferrals$t$,
 $t$The enforcer checks every MEETS, STANDS and UNDERDETERMINED against Commitment 8 (one verse read alone does not give a contested fact) and Commitment 13 (no verse decides alone), and against a grade that leaves its point for another collision; either side alike. (ask510/w3/plan510.md rev 1)$t$,
 'not yet', $t$Written 16:03:34Z 11-20 (audit 39468, 39469), graded PASS by W3 (10267, corrected 10273) and W2 (10343), read back by W3 (10269). Run 41090 then broke on an E-COL line, outside E-ANS and E-HOLD (coordinator 10290; W3 10291), and ASK 515 removed the two 510 sentences (W4 10300). No graded run check of 510 is on the Wall.$t$,
 '10267, 10268, 10269, 10290, 10291, 10300, 10343', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"not yet"'::jsonb, $t${"answer": "Write it", "thread": "W4", "press_time": "16:03:34Z", "source": "audit 39468 and 39469"}$t$::jsonb, 'W3',
 $t${"md5": "2ecdf36b", "path": "ask510/w3/plan510.md"}$t$::jsonb,
 $t$[{"md5": "6d032ea5", "path": "ask510/w4/build/patch510.js"}, {"md5": "3f07df4b", "path": "target engine"}, {"md5": "45fc0b8e", "path": "target child"}]$t$::jsonb,
 $t${"what": "write back the pre files on the operator's word", "files": [{"md5": "c6d3c637", "path": "ask510/w4/build/pre_engine_510.json"}, {"md5": "54048b71", "path": "ask510/w4/build/pre_child_510.json"}]}$t$::jsonb,
 $t$[{"seat": "W3", "verdict": "PASS (build), corrected at 10273", "wall_id": 10267, "md5_graded": "3f07df4b", "verdict_norm": "PASS"}, {"seat": "W3", "verdict": "PASS (build), corrected at 10273", "wall_id": 10267, "md5_graded": "45fc0b8e", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10343, "md5_graded": "3f07df4b", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10343, "md5_graded": "45fc0b8e", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['3f07df4b','45fc0b8e'], $t$[39468, 39469]$t$::jsonb,
 $t$[{"kind": "workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "c6e630a4", "after": "a08e387a"}, {"kind": "workflow", "name": "Alternate Pass MqQHRl7mQQ0z8QdT", "before": "ecb82fb2", "after": "45a121d2"}, {"kind": "library", "name": "Shared Library sha", "before": "b940895bd43124b7", "after": "3929ad23c9371833"}]$t$::jsonb,
 $t$"offline replays in the build post; no rolled-back live test"$t$::jsonb,
 $t$[{"seat": "W3", "result": "CONFIRMED", "wall_id": 10269}]$t$::jsonb,
 $t${"case": "not yet: no graded run check on the Wall", "superseded": "the two 510 sentences were removed by ASK 515 (W4 10300)"}$t$::jsonb,
 $t${"engine_manual": "v227 (26747f66); its ASK 510 entry does not yet say the sentences were removed by ASK 515", "op_doc": "not yet"}$t$::jsonb,
 'read back', $t$[10264, 10265, 10266, 10267, 10268, 10269, 10273, 10274, 10275, 10290, 10291, 10300, 10343, "audit 39468", "audit 39469"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 510", "wall_id": 10268}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 510 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(513, 'A1', $t$K-RUL accepts a quote that stands across a K-SU sentence$t$,
 $t$K-RUL accepts a NAMED BY quote that runs across the verse break of a sentence K-SU told that judge to grade whole. No other quote is newly accepted. Both rules stay TRIAL, recorded only. (ask513/w3/plan513.md rev 1)$t$,
 'in part', $t$Written 16:31:44Z 11-20 (audit 39483, 39484), graded PASS by W3 (10279) and W2 (10348), read back by W3 (10281). Offline replay: the two 41043 quotes (47505, 47532) refused before and accepted after; a splice of 1:24 with "before they came together" refused both ways (W3 10279; W2 10348). No graded run check is on the Wall.$t$,
 '10279, 10280, 10281, 10348', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"not yet"'::jsonb, $t${"answer": "Write it", "thread": "W4", "press_time": "16:31:44Z", "source": "audit 39483 and 39484"}$t$::jsonb, 'W3',
 $t${"md5": "f0d97a02", "path": "ask513/w3/plan513.md"}$t$::jsonb,
 $t$[{"md5": "b9a2dd10", "path": "ask513/w4/build/patch513.js"}, {"md5": "e011693a", "path": "target engine"}, {"md5": "589567b0", "path": "target child"}]$t$::jsonb,
 $t${"what": "write back the pre files on the operator's word", "files": [{"md5": "4163ec5e", "path": "ask513/w4/build/pre_engine_513.json"}, {"md5": "25967a2b", "path": "ask513/w4/build/pre_child_513.json"}]}$t$::jsonb,
 $t$[{"seat": "W3", "verdict": "PASS (build; planner, at W4's request)", "wall_id": 10279, "md5_graded": "e011693a", "verdict_norm": "PASS"}, {"seat": "W3", "verdict": "PASS (build; planner, at W4's request)", "wall_id": 10279, "md5_graded": "589567b0", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10348, "md5_graded": "e011693a", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10348, "md5_graded": "589567b0", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['e011693a','589567b0'], $t$[39483, 39484]$t$::jsonb,
 $t$[{"kind": "workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "a08e387a", "after": "321144bd"}, {"kind": "workflow", "name": "Alternate Pass MqQHRl7mQQ0z8QdT", "before": "45a121d2", "after": "fee9f696"}, {"kind": "library", "name": "Shared Library sha", "before": "3929ad23c9371833", "after": "d45d546ddc3d99ce"}]$t$::jsonb,
 $t$"offline replays in the build post; no rolled-back live test"$t$::jsonb,
 $t$[{"seat": "W3", "result": "CONFIRMED", "wall_id": 10281}]$t$::jsonb,
 $t${"case": "not yet: no graded run check on the Wall"}$t$::jsonb,
 $t${"engine_manual": "v228 (d261f6bd)", "op_doc": "not yet"}$t$::jsonb,
 'read back', $t$[10277, 10278, 10279, 10280, 10281, 10282, 10283, 10284, 10348, "audit 39483", "audit 39484"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 513", "wall_id": 10280}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 513 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(515, 'A1', $t$One verse rule binds every enforcer rule, with the record on each link$t$,
 $t$RULE ONE VERSE is the first rule of RULES and binds every enforcer rule, either side alike; each enforcer call carries the record on its links; on E-HOLD a reworded UNDERDETERMINED is read as a KEEP (operator 11:32 to 11:37 CST 11-20: "none of our fixes are for single case instances"). (ask515/w3/plan515.md rev 6)$t$,
 'in part', $t$Written 18:06:20Z 11-20 (audit 39506, 39507), graded PASS by W3 (10299) and W2 (10361), read back by W3 (10301). Run 41117 ran on it: the enforcer agreed with every break of the defender's D4 link though the defender's rows on that point stood in the rounds, and the POINTS AT ISSUE entries reached no call (W3 10306; engine manual v230 entry). Rev 7 fixed the POINTS store (row for 515 r7). ASK 516 replaced item 4 and was reverted, so item 4 is live again (manual v231).$t$,
 '10299, 10300, 10301, 10306, 10361', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"not yet"'::jsonb, $t${"answer": "Write it", "thread": "W4", "press_time": "18:06:20Z", "source": "audit 39506 and 39507"}$t$::jsonb, 'W3',
 $t${"md5": "4d62400e", "path": "ask515/w3/plan515.md"}$t$::jsonb,
 $t$[{"md5": "f65e05dd", "path": "ask515/w4/build/patch515.js"}, {"md5": "20f4fe3d", "path": "target engine"}, {"md5": "b78f3e12", "path": "target child"}]$t$::jsonb,
 $t${"what": "write back the pre files on the operator's word", "files": [{"md5": "95d08fe9", "path": "ask515/w4/build/pre_engine_515.json"}, {"md5": "dbbd6306", "path": "ask515/w4/build/pre_child_515.json"}]}$t$::jsonb,
 $t$[{"seat": "W3", "verdict": "PASS (build)", "wall_id": 10299, "md5_graded": "20f4fe3d", "verdict_norm": "PASS"}, {"seat": "W3", "verdict": "PASS (build)", "wall_id": 10299, "md5_graded": "b78f3e12", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10361, "md5_graded": "20f4fe3d", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10361, "md5_graded": "b78f3e12", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['20f4fe3d','b78f3e12'], $t$[39506, 39507]$t$::jsonb,
 $t$[{"kind": "workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "321144bd", "after": "fb3ff9d7"}, {"kind": "workflow", "name": "Alternate Pass MqQHRl7mQQ0z8QdT", "before": "fee9f696", "after": "e1ae55a9"}, {"kind": "library", "name": "Shared Library sha", "before": "d45d546ddc3d99ce", "after": "fa6e8159e811863c"}]$t$::jsonb,
 $t$"offline replays in the build post; no rolled-back live test"$t$::jsonb,
 $t$[{"seat": "W3", "result": "CONFIRMED", "wall_id": 10301}]$t$::jsonb,
 $t${"run": "41117", "first_read": 10306, "read_by": "W3", "finding": "enforcer AGREE on every D4 break; defender's D4 rows not in the record; POINTS AT ISSUE in no call"}$t$::jsonb,
 $t${"engine_manual": "v229 (2debf507); item 4 marked replaced in v230, live again in v231 (47be13a3)", "op_doc": "not yet"}$t$::jsonb,
 'read back', $t$[10290, 10291, 10292, 10294, 10296, 10298, 10299, 10300, 10301, 10302, 10303, 10304, 10306, 10361, "audit 39506", "audit 39507"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 515", "wall_id": 10300}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 515 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(515, 'r7', $t$POINTS AT ISSUE store fixed (ASK 515 rev 7)$t$,
 $t$The POINTS AT ISSUE entries reach every enforcer call: the per-item store moves from Object.defineProperty, a no-op in the n8n sandbox, to a Map keyed by the item's first LINE id. (ask515/w4/r7/R7.md)$t$,
 'not yet', $t$Written 19:11:33Z 11-20 (audit 39517, 39518), graded PASS by W3 (10307) and W2 (10361 part A), read back by W3 (10309). Live again since the 516 revert (W4 10326; W2 10327). No run has exercised it (W2 10361).$t$,
 '10307, 10308, 10309, 10326, 10327, 10361', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"not yet"'::jsonb, $t${"answer": "Write it", "thread": "W4", "press_time": "19:11:33Z", "source": "audit 39517 and 39518"}$t$::jsonb, 'W3',
 $t${"md5": "7df43e1f", "path": "ask515/w4/r7/R7.md"}$t$::jsonb,
 $t$[{"md5": "1ed511d8", "path": "ask515/w4/r7/patch515r7.js"}, {"md5": "ce56c631", "path": "target engine"}, {"md5": "ed835664", "path": "target child"}]$t$::jsonb,
 $t${"what": "write back the pre files on the operator's word", "files": [{"md5": "809b2404", "path": "ask515/w4/r7/pre_engine_r7.json"}, {"md5": "3ba64499", "path": "ask515/w4/r7/pre_child_r7.json"}]}$t$::jsonb,
 $t$[{"seat": "W3", "verdict": "PASS (rev 7)", "wall_id": 10307, "md5_graded": "ce56c631", "verdict_norm": "PASS"}, {"seat": "W3", "verdict": "PASS (rev 7)", "wall_id": 10307, "md5_graded": "ed835664", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10361, "md5_graded": "ce56c631", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10361, "md5_graded": "ed835664", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['ce56c631','ed835664'], $t$[39517, 39518]$t$::jsonb,
 $t$[{"kind": "workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "fb3ff9d7", "after": "1b20b067"}, {"kind": "workflow", "name": "Alternate Pass MqQHRl7mQQ0z8QdT", "before": "e1ae55a9", "after": "c9db9777"}, {"kind": "library", "name": "Shared Library sha", "before": "fa6e8159e811863c", "after": "6f2ae36f19303a92"}]$t$::jsonb,
 $t$"offline replays in the build post; no rolled-back live test"$t$::jsonb,
 $t$[{"seat": "W3", "result": "CONFIRMED", "wall_id": 10309}, {"seat": "W2", "result": "revert to this content CONFIRMED", "wall_id": 10327}]$t$::jsonb,
 $t${"case": "not yet: no run on rev 7 since the 516 revert (W2 10361)"}$t$::jsonb,
 $t${"engine_manual": "v230 (4a5e85ce), v231 (47be13a3)", "op_doc": "not yet"}$t$::jsonb,
 'read back', $t$[10307, 10308, 10309, 10326, 10327, 10361, "audit 39517", "audit 39518"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 515", "wall_id": 10308}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 515 AND s.rev = 'r7' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(516, 'A1', $t$Every enforcer call is given the rounds in full$t$,
 $t$Every judge enforcer call carries THE ROUNDS IN FULL, all eight rounds tagged and as stored, the same bytes in every call and before anything that varies, so the enforcer can weigh rows on any point either side laid (approved by the operator's "Work on 516", 13:13 CST 11-20). (ask516/w3/plan516.md rev 3)$t$,
 'no', $t$Written 19:23:42Z 11-20 (audit 39526, 39527), graded PASS by W3 only (10314; second grade held), read back by W3 (10316). The first runs on it, 41128 and 41155, crashed out of memory; 41147, the retry of 41128, failed at Record Substitution on recovered placeholders (W4 10324, 10353). Reverted to 515 rev 7 on the operator's card 07:22:37Z 11-23 (audit 39555, 39556; W4 10326), read back by W2 (10327). A lower-memory plan (plan516b.md rev 6, a4dc21f6) has PASS from W4 (10360) and W2 (10362), not built.$t$,
 '10314, 10315, 10316, 10324, 10326, 10327, 10353, 10360, 10362, 10367', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"not yet"'::jsonb, $t${"answer": "Write it", "thread": "W4", "press_time": "19:23:42Z", "source": "audit 39526 and 39527"}$t$::jsonb, 'W3',
 $t${"md5": "1203417d", "path": "ask516/w3/plan516.md"}$t$::jsonb,
 $t$[{"md5": "2a3a8de7", "path": "ask516/w4/patch516.js"}, {"md5": "38644970", "path": "target engine"}, {"md5": "673f336d", "path": "target child"}, {"note": "targets as posted by W4 at 10313 (38644970, 673f336d); the files in ask516/w4 read 3c4d415e and 7567713f; W2 10367 N1: they equal the fetch-backs in node parameters and connections, so the gap is serialization only"}]$t$::jsonb,
 $t${"what": "write back the pre files on the operator's word", "files": [{"md5": "d5519cb2", "path": "ask516/w4/pre_engine_516.json"}, {"md5": "15424037", "path": "ask516/w4/pre_child_516.json"}]}$t$::jsonb,
 $t$[{"seat": "W3", "verdict": "PASS (build; second grade held)", "wall_id": 10314, "md5_graded": "38644970", "verdict_norm": "PASS"}, {"seat": "W3", "verdict": "PASS (build; second grade held)", "wall_id": 10314, "md5_graded": "673f336d", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['38644970','673f336d'], $t$[39526, 39527]$t$::jsonb,
 $t$[{"kind": "workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "1b20b067", "after": "38d1020c"}, {"kind": "workflow", "name": "Alternate Pass MqQHRl7mQQ0z8QdT", "before": "c9db9777", "after": "48ea0c0d"}, {"kind": "library", "name": "Shared Library sha", "before": "6f2ae36f19303a92", "after": "1bcba53c4b456acf"}]$t$::jsonb,
 $t$"offline replays in the build post; no rolled-back live test"$t$::jsonb,
 $t$[{"seat": "W3", "result": "CONFIRMED", "wall_id": 10316}, {"seat": "W2", "result": "revert CONFIRMED (engine 31702b15, child cd2d84d8)", "wall_id": 10327}]$t$::jsonb,
 $t${"runs": {"41128": "out of memory", "41155": "out of memory", "41147": "retry of 41128; failed at Record Substitution (W4 10353)"}, "report": 10324, "trace": 10332, "reverted": "07:22:37Z 11-23, audit 39555 and 39556"}$t$::jsonb,
 $t${"engine_manual": "v230 (4a5e85ce); revert entry v231 (47be13a3)", "op_doc": "not yet"}$t$::jsonb,
 'reverted', $t$[10310, 10311, 10312, 10313, 10314, 10315, 10316, 10318, 10322, 10324, 10326, 10327, 10332, 10353, 10354, 10358, 10360, 10362, "audit 39526", "audit 39527", "audit 39555", "audit 39556"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 516", "wall_id": 10315}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 516 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(505, 'A1', $t$Closing forfeit takes a win only from the side that made it; standing gate$t$,
 $t$C1: a closing contradiction only takes a win away from the side that made it, both sides (card "Both sides (B)"). C0: a side PROP-DEPENDENT or COLLAPSED on two or more counted judges cannot prevail (operator 22:29 CST 11-19, card "Yes, always"). Forward only, from v_505_from. (outcome_fix/w3/plan_outcome.md rev 3)$t$,
 'in part', $t$Written 04:44:20Z 11-20 (audit 39420; v_505_from 04:44:38Z): derive_debate_outcome 1f79a931 to 2a853df6. Graded PASS by W3 (10232, 10233, 10234; test run 2 executed both new branches) and W2 (10333; reverse check restores 1f79a931). No graded check of a debate created after v_505_from is on the Wall; 505 C2 and C3 (transcripts) wait on the transcript-location question.$t$,
 '10232, 10233, 10234, 10235, 10333', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"not yet"'::jsonb, $t${"answer": "Write it", "thread": "W4", "press_time": "04:44:20Z", "source": "audit 39420"}$t$::jsonb, 'W3',
 $t${"md5": "96435850", "path": "outcome_fix/w3/plan_outcome.md", "commit": "26b931e2"}$t$::jsonb,
 $t$[{"md5": "f18294a7", "path": "outcome_fix/w4/step505.sql"}]$t$::jsonb,
 $t${"md5": "ce16ca95", "path": "outcome_fix/w4/revert505.sql"}$t$::jsonb,
 $t$[{"seat": "W3", "verdict": "PASS (test run 2; step f18294a7)", "wall_id": 10234, "md5_graded": "f18294a7", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (second grade, 11-23)", "wall_id": 10333, "md5_graded": "f18294a7", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['f18294a7'], $t$[39420]$t$::jsonb,
 $t$[{"kind": "function", "name": "public.derive_debate_outcome(uuid)", "before": "1f79a931", "after": "2a853df6"}]$t$::jsonb,
 $t$[{"file": "outcome_fix/w4/test505.sql", "md5": "299e7f7d", "wall_id": 10233}, {"file": "outcome_fix/w4/test505b.sql", "md5": "5ea08f15", "wall_id": 10234}]$t$::jsonb,
 $t$[{"seat": "W2", "result": "live prosrc 2a853df6, 28,648 characters; revert gives 1f79a931", "wall_id": 10333}]$t$::jsonb,
 $t${"case": "not yet: no graded run check on the Wall"}$t$::jsonb,
 $t${"engine_manual": "v223 (a6135f75)", "op_doc": "not yet"}$t$::jsonb,
 'read back', $t$[10232, 10233, 10234, 10235, 10236, 10333, "audit 39420"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote step505.sql f18294a7", "wall_id": 10235}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 505 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(508, 'A1', $t$The DG-8 guard set also fires on the words of begetting$t$,
 $t$Add beget, begat, begetting, pregnant and impregnated to the DG-8 guard words, so a topic in those words is served Sight 1822 as GUARD SET (operator 08:24:13Z 11-20: "Guard words for begetting only"). (ask508/w3/plan508.md rev 2)$t$,
 'in part', $t$Written 08:33:40Z 11-20 (audit 39450): guard 8 trigger_terms e515ba0a to 3c900d8c. W2 (10340) confirms exactly the five words were added and that "Did the Holy Ghost beget the flesh of Christ?" serves S-1822 as GUARD SET (DG-8), whole. One non-builder grade only: W3 planned it and did not grade. Not shown by a run.$t$,
 '10255, 10340', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"Guard words for begetting only"'::jsonb, $t${"answer": "Write it", "thread": "W4", "press_time": "08:33:40Z", "source": "audit 39450"}$t$::jsonb, 'W3',
 $t${"md5": "a483e5c5", "path": "ask508/w3/plan508.md", "wall_id": 10252}$t$::jsonb,
 $t$[{"what": "one UPDATE of guard_served_sets guard 8 trigger_terms (plan508.md)"}]$t$::jsonb,
 $t${"what": "set guard 8 trigger_terms back to the nine words (plan508.md)"}$t$::jsonb,
 $t$[{"seat": "W2", "verdict": "PASS (first non-builder grade, 11-23)", "wall_id": 10340, "md5_graded": "3c900d8c", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['3c900d8c'], $t$[39450]$t$::jsonb,
 $t$[{"kind": "row", "name": "guard_served_sets guard 8 trigger_terms", "before": "e515ba0a", "after": "3c900d8c"}]$t$::jsonb,
 $t$"live after-checks (W4 10255; W2 10340)"$t$::jsonb,
 $t$[{"seat": "W2", "result": "live 3c900d8c; base e515ba0a recovered", "wall_id": 10340}]$t$::jsonb,
 $t${"case": "not yet: no graded run check on the Wall"}$t$::jsonb,
 $t${"engine_manual": "v226 (bb21ce44)", "op_doc": "not yet"}$t$::jsonb,
 'read back', $t$[10252, 10255, 10259, 10340, "audit 39450"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "wrote ASK 508", "wall_id": 10255}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 508 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(509, 'A1', $t$The sight-link path serves up to 50,000 characters$t$,
 $t$Raise the debate_sight_links character cap from 8,000 to 50,000 (default and clamp); the 6-sight limit is unchanged (operator 08:30:57Z 11-20: "50k"). (ask509/w3/plan509.md rev 2)$t$,
 'in part', $t$Written 08:34:49Z 11-20 (audit 39453): function 75a7aa5b to d43c0860. W2 (10340) confirms the three literal changes are the whole write and that S-1822 is served whole as SIGHT LINK. One non-builder grade only (W3 planned; W4 10257). Not shown by a run. W2 notes S-1822 is now 32,466 characters, not the 24,114 the manual entry gives (10340 item 7).$t$,
 '10256, 10257, 10340', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"50k"'::jsonb, $t${"answer": "Write it", "thread": "W4", "press_time": "08:34:49Z", "source": "audit 39453"}$t$::jsonb, 'W3',
 $t${"md5": "86bed057", "path": "ask509/w3/plan509.md", "wall_id": 10253}$t$::jsonb,
 $t$[{"md5": "b442ca20", "path": "ask509/w4/step509.sql"}]$t$::jsonb,
 $t${"md5": "49080ef7", "path": "ask509/w4/revert509.sql"}$t$::jsonb,
 $t$[{"seat": "W2", "verdict": "PASS (first non-builder grade, 11-23)", "wall_id": 10340, "md5_graded": "b442ca20", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['b442ca20'], $t$[39453]$t$::jsonb,
 $t$[{"kind": "function", "name": "public.debate_sight_links(text,integer,integer)", "before": "75a7aa5b", "after": "d43c0860"}]$t$::jsonb,
 $t$"live after-checks (W4 10256; W2 10340)"$t$::jsonb,
 $t$[{"seat": "W2", "result": "live d43c0860; base 75a7aa5b recovered", "wall_id": 10340}]$t$::jsonb,
 $t${"case": "not yet: no graded run check on the Wall"}$t$::jsonb,
 $t${"engine_manual": "v226 (bb21ce44); size figure owed a correction (W2 10340 item 7)", "op_doc": "not yet"}$t$::jsonb,
 'read back', $t$[10253, 10256, 10257, 10259, 10340, "audit 39453"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "wrote ASK 509", "wall_id": 10256}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 509 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(511, 'A1', $t$Sight 1822 revision 7: "is of the Holy Ghost" is not a possessive$t$,
 $t$Sight 1822 gains item (4) in its IN DEBATE head: "is of the Holy Ghost" (Matthew 1:20) is not a possessive; it says where the child is from, not whose child he is (Wall 10270).$t$,
 'yes', $t$Sight 1822 (kb_sights 2028) revision 7 written by W3 under the operator's put it in (16:09:01Z, W4 thread), on W4's MATCH (W4 thread reply 16:14Z): summary 132799e1 to 53a93cc0. W2 graded it PASS for record accuracy (10346). The embedding was not refreshed.$t$,
 '10270, 10271, 10346', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"put it in"'::jsonb, $t${"answer": "put it in", "thread": "W4", "press_time": "16:09:01Z", "source": "Wall 10271"}$t$::jsonb, 'W3',
 $t${"what": "draft in the Wall post", "wall_id": 10271}$t$::jsonb,
 $t$[{"what": "Sight 1822 revision 7", "md5": "53a93cc0"}]$t$::jsonb,
 $t${"what": "summary back to 132799e1 on the operator's word"}$t$::jsonb,
 $t$[{"seat": "W4", "verdict": "MATCH (W4 thread reply 16:14Z)", "wall_id": 10271, "md5_graded": "53a93cc0", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS for record accuracy (11-23)", "wall_id": 10346, "md5_graded": "53a93cc0", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['53a93cc0'], NULL,
 $t$[{"kind": "row", "name": "kb_sights 2028 summary (Sight 1822)", "before": "132799e1", "after": "53a93cc0"}]$t$::jsonb,
 NULL,
 $t$[{"seat": "W2", "result": "item file ad6bdb02 matches", "wall_id": 10346}]$t$::jsonb,
 $t${"case": "not applicable: a sight text revision"}$t$::jsonb,
 $t${"engine_manual": "none", "op_doc": "none"}$t$::jsonb,
 'read back', $t$[10270, 10271, 10346]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W3'], $t$[{"seat": "W3", "what": "wrote Sight 1822 revision 7", "wall_id": 10271}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 511 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(512, 'A1', $t$Sight 1822 revision 8: "Son of man", dozens of times, five verses$t$,
 $t$Sight 1822 gains a sub-item under point (1): Christ calls himself the Son of man dozens of times, with five of his own rows quoted whole (Wall 10271 item 2).$t$,
 'yes', $t$Sight 1822 (kb_sights 2028) revision 8 written by W3 under the operator's yes, we can say dozens of time and list like 5 verses (16:13:48Z, W4 thread), on W4's MATCH (W4 thread reply): summary 53a93cc0 to f9c42469. W2 graded it PASS for record accuracy (10346). The embedding was not refreshed.$t$,
 '10271, 10272, 10346', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"yes, we can say dozens of time and list like 5 verses"'::jsonb, $t${"answer": "yes, we can say dozens of time and list like 5 verses", "thread": "W4", "press_time": "16:13:48Z", "source": "Wall 10272"}$t$::jsonb, 'W3',
 $t${"what": "draft in the Wall post", "wall_id": 10272}$t$::jsonb,
 $t$[{"what": "Sight 1822 revision 8", "md5": "f9c42469"}]$t$::jsonb,
 $t${"what": "summary back to 53a93cc0 on the operator's word"}$t$::jsonb,
 $t$[{"seat": "W4", "verdict": "MATCH (W4 thread reply)", "wall_id": 10272, "md5_graded": "f9c42469", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS for record accuracy (11-23)", "wall_id": 10346, "md5_graded": "f9c42469", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['f9c42469'], NULL,
 $t$[{"kind": "row", "name": "kb_sights 2028 summary (Sight 1822)", "before": "53a93cc0", "after": "f9c42469"}]$t$::jsonb,
 NULL,
 $t$[{"seat": "W2", "result": "item file 6ecd02c0 matches the guard", "wall_id": 10346}]$t$::jsonb,
 $t${"case": "not applicable: a sight text revision"}$t$::jsonb,
 $t${"engine_manual": "none", "op_doc": "none"}$t$::jsonb,
 'read back', $t$[10271, 10272, 10346]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W3'], $t$[{"seat": "W3", "what": "wrote Sight 1822 revision 8", "wall_id": 10272}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 512 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(514, 'A1', $t$Sight 1822 revision 9: Matthew 1:20 words and John 3:5-6$t$,
 $t$Item (4) of Sight 1822 gains six lines: Matthew 1:20 is G1080 + G1537 + G4151; John 3:5, 3:6, Matthew 1:18 and John 1:13 quoted whole; "The rows decide, not the lexicon." (Wall 10287)$t$,
 'yes', $t$Sight 1822 (kb_sights 2028) revision 9 written by W3 under the operator's Put it in (16:44:34Z, W4 thread), on W4's MATCH (Wall 10286): summary f9c42469 to ed7a8a8b. W2 graded it PASS for record accuracy (10352). The embedding was not refreshed.$t$,
 '10286, 10287, 10288, 10352', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 '"Put it in"'::jsonb, $t${"answer": "Put it in", "thread": "W4", "press_time": "16:44:34Z", "source": "Wall 10287"}$t$::jsonb, 'W3',
 $t${"what": "draft in the Wall post", "wall_id": 10287}$t$::jsonb,
 $t$[{"what": "Sight 1822 revision 9", "md5": "ed7a8a8b"}]$t$::jsonb,
 $t${"what": "summary back to f9c42469 on the operator's word"}$t$::jsonb,
 $t$[{"seat": "W4", "verdict": "MATCH (Wall 10286)", "wall_id": 10286, "md5_graded": "ed7a8a8b", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS for record accuracy (11-23)", "wall_id": 10352, "md5_graded": "ed7a8a8b", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['ed7a8a8b'], NULL,
 $t$[{"kind": "row", "name": "kb_sights 2028 summary (Sight 1822)", "before": "f9c42469", "after": "ed7a8a8b"}]$t$::jsonb,
 NULL,
 $t$[{"seat": "W4", "result": "CONFIRMED", "wall_id": 10288}, {"seat": "W2", "result": "reversing the pairs gives f9c42469", "wall_id": 10352}]$t$::jsonb,
 $t${"case": "not applicable: a sight text revision"}$t$::jsonb,
 $t${"engine_manual": "none", "op_doc": "none"}$t$::jsonb,
 'read back', $t$[10286, 10287, 10288, 10352]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W3'], $t$[{"seat": "W3", "what": "wrote Sight 1822 revision 9", "wall_id": 10287}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 514 AND s.rev = 'A1' AND s.aar_at = now();
COMMIT;
-- Separate calls after COMMIT:
-- SELECT id, ask, rev, prior_row, objective_met, status, md5_match FROM public.ask_aar_snapshots WHERE aar_at > now() - interval '10 minutes' ORDER BY id;
-- SELECT id, snapshot_id, builder_seats FROM public.ask_aar_builders ORDER BY id DESC LIMIT 16;
-- SELECT * FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';
-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id > 35;
