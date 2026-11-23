-- ASK AAR rows for the write stack, DRAFT rev 0 (W1, 2026-11-23): 517, 519, 520 (W3's rows, filled), 518, 502 A1, 527, 524, 525, 526, 523, 531.
-- All 11 are live (status 'read back'), objective_met 'in part', run_evidence UNEXERCISED. NOT RUN. Only the coordinator (seat 36) inserts, after W2's grade.
-- Replace {{COORDINATOR_SESSION}} with the inserting coordinator's session before running.
BEGIN;
SET LOCAL truth.session_id = '{{COORDINATOR_SESSION}}';
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(517, 'A1', $t$The standing follows the count only; K-G3 retired; win tests read broken lines$t$,
 $t$A side's standing is decided by its own count only (engine_manual section 8 STANDINGS); the operator on 41117: "by rulebook definition, L=6, c=0 is SELF-SUPPORTED, never PROP-DEPENDENT." The win tests read the broken lines directly so no side wins with its own link broken (the operator, 22:26 CST 11-19: "We can't have broken links 🔗 and still win"). Expected outcome effect: none. (ask517/w3/plan517.md rev 5)$t$,
 'in part', $t$Written 07:22 11-23 (card pressed 07:21:29) on the operator's card "Write 517" (W4 10490; audit 39771, 39772). Read back by W2 at Wall 10491 (CONFIRMED). Not yet shown by a run.$t$,
 '10381, 10414, 10415, 10418, 10422, 10435, 10441, 10447, 10449, 10473, 10475, 10485', '{{COORDINATOR_SESSION}}', NULL,
 $t$"\"Four Remaining Bugs ... Bug 1\"; \"yes\" 02:02 CST 11-23"$t$::jsonb, $t${"answer": "Write 517", "thread": "W4", "press_time": "07:21:29", "source": "Wall 10490; the write landed at 07:22 (audit 39771, 39772)"}$t$::jsonb, 'W3',
 $t${"md5": "23a73d9e", "path": "ask517/w3/plan517.md", "commit": "d6904e24 (rev 4); rev 5 61510f35"}$t$::jsonb,
 $t$[{"md5": "11a272f4", "path": "ask517/w1/BUILD517.md", "commit": "360bb005"}, {"md5": "8f2e7146", "path": "ask517/w1/target_engine_517.json", "note": "header fixed (W1 10447; W2 10449)"}, {"md5": "fc27892d", "path": "ask517/w1/target_child_517.json", "note": "header fixed (W1 10447; W2 10449)"}, {"md5": "22486ae3", "path": "ask520/w4/stack/steps/put_517_engine.json", "wall_id": 10485}, {"md5": "c4030e97", "path": "ask520/w4/stack/steps/put_517_child.json", "wall_id": 10485}, {"md5": "cbbe66de", "path": "ask517/w1/step517_s6.sql"}]$t$::jsonb,
 $t${"md5": "82fcafab", "path": "ask517/w1/revert517_s6.sql", "workflows": "revert517.sh a06b3e09, guarded on c5dcd97a and 8bfbc810"}$t$::jsonb,
 $t$[{"seat": "W4", "verdict": "PASS (plan rev 3)", "wall_id": 10414, "md5_graded": "3276053d", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS with C-c (plan rev 3)", "wall_id": 10415, "md5_graded": "3276053d", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (plan rev 4)", "wall_id": 10422, "md5_graded": "c4221d8e", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build, three limits; engine target before the header fix)", "wall_id": 10441, "md5_graded": "056a7588", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build; child target before the header fix)", "wall_id": 10441, "md5_graded": "00a8754d", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (517 header fix CONFIRMED, engine target)", "wall_id": 10449, "md5_graded": "8f2e7146", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (517 header fix CONFIRMED, child target)", "wall_id": 10449, "md5_graded": "fc27892d", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build, S6 step)", "wall_id": 10441, "md5_graded": "cbbe66de", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['8f2e7146','fc27892d','cbbe66de'], $t$"39771, 39772"$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "0427ec91", "after": "c5dcd97a (fetch-back 6c45af6a)"}, {"kind": "n8n workflow", "name": "child MqQHRl7mQQ0z8QdT", "before": "47df6892", "after": "8bfbc810 (fetch-back 78f2cd04)"}, {"kind": "function", "name": "public.derive_debate_outcome(uuid)", "before": "2a853df6", "after": "a59400d8"}]$t$::jsonb,
 $t$[{"file": "ask517/w1/test517_s6_rollback.sql", "md5": "a4b1df76", "wall_id": 10435}, {"file": "ask517/w1/test517_s6_knowngood.sql", "md5": "0d091211", "wall_id": 10435}, {"file": "ask517/w1/replay517c2.js", "wall_id": 10473}]$t$::jsonb,
 $t$[{"seat": "W2", "result": "CONFIRMED", "wall_id": 10491}]$t$::jsonb,
 $t${"case": "UNEXERCISED: live, no released run has exercised it yet", "mark": "no probe named"}$t$::jsonb,
 $t${"engine_manual": "engine_manual v234 (26d1152e; read back W1 10586, W2 10587)", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10381, 10414, 10415, 10418, 10422, 10435, 10441, 10446, 10447, 10449, 10473, 10475, 10485, 10490, 10491]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W1','W4'], $t$[{"seat": "W1", "what": "built ASK 517", "wall_id": 10435}, {"seat": "W4", "what": "wrote ASK 517 on its card", "wall_id": 10490}]$t$::jsonb, '{{COORDINATOR_SESSION}}' FROM public.ask_aar_snapshots s WHERE s.ask = 517 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(519, 'A1', $t$K-W and K-S3 ask only about footing$t$,
 $t$K-W and K-S3 are raised only on a sentence that can give up a side's own footing: a withdrawal-class sentence, or a grant-class sentence that names a link, premise or press. Expected effect: K-W and K-S3 cure items fall from 51 to about 13 on 41117, with no real reply dropped. (ask519/w3/plan519.md rev 2)$t$,
 'in part', $t$Written 07:33 11-23 (card pressed 07:33:04) on the operator's card "Write 519" (W4 10509; audit 39793). Read back by W2 at Wall 10514 (CONFIRMED). Not yet shown by a run.$t$,
 '10381, 10416, 10420, 10425, 10426, 10474, 10476, 10485', '{{COORDINATOR_SESSION}}', NULL,
 $t$"\"Four Remaining Bugs ... Bug 3\"; \"yes\" 02:02 CST 11-23"$t$::jsonb, $t${"answer": "Write 519", "thread": "W4", "press_time": "07:33:04", "source": "Wall 10509; the write landed at 07:33 (audit 39793)"}$t$::jsonb, 'W3',
 $t${"md5": "11628857", "path": "ask519/w3/plan519.md", "commit": "bb58e8b9"}$t$::jsonb,
 $t$[{"md5": "078884f1", "path": "ask519/w4/BUILD519.md", "commit": "fa5ac288"}, {"md5": "f62c817e", "path": "ask519/w4/target_engine_519.json"}, {"md5": "6eb563eb", "path": "ask519/w4/target_child_519.json"}, {"md5": "c3bc1f80", "path": "ask520/w4/stack/steps/put_519_engine.json", "wall_id": 10485}, {"md5": "6a8bb14f", "path": "ask520/w4/stack/steps/put_519_child.json", "wall_id": 10485}]$t$::jsonb,
 $t${"path": "ask520/w4/stack/steps/revert_519_engine.json (4969bb50) and revert_519_child.json (c4030e97), guarded on c35d330e and b66da7aa"}$t$::jsonb,
 $t$[{"seat": "W2", "verdict": "PASS with C-d (plan rev 1)", "wall_id": 10420, "md5_graded": "63abeb6b", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (plan rev 2)", "wall_id": 10426, "md5_graded": "11628857", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build)", "wall_id": 10476, "md5_graded": "f62c817e", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build, child target)", "wall_id": 10476, "md5_graded": "6eb563eb", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['f62c817e','6eb563eb'], $t$39793$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "c243b2c9", "after": "c35d330e (fetch-back 290db075)"}, {"kind": "n8n workflow", "name": "child MqQHRl7mQQ0z8QdT", "before": "8bfbc810", "after": "b66da7aa (fetch-back 47e23e82)"}]$t$::jsonb,
 $t$[{"file": "ask519/w4/BUILD519.md", "md5": "078884f1", "wall_id": 10474}]$t$::jsonb,
 $t$[{"seat": "W2", "result": "CONFIRMED", "wall_id": 10514}]$t$::jsonb,
 $t${"case": "UNEXERCISED: live, no released run has exercised it yet", "mark": "K-W/K-S3 drop counts in a released run"}$t$::jsonb,
 $t${"engine_manual": "not yet written", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10381, 10416, 10420, 10425, 10426, 10474, 10476, 10485, 10509, 10514]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built ASK 519", "wall_id": 10474}, {"seat": "W4", "what": "wrote ASK 519 on its card", "wall_id": 10509}]$t$::jsonb, '{{COORDINATOR_SESSION}}' FROM public.ask_aar_snapshots s WHERE s.ask = 519 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(520, 'A1', $t$K-UNX not raised on a press the judge grades MISSES$t$,
 $t$K-UNX is not raised on a counted premise when the judge's own ANSWER CHECK grades a press of that premise, from the pressing side's round 2 or 3, MISSES or FAILS (Commitment 5, ruling 372). Expected effect on 41117: Sol 6.1 premises 4 and 5 and Terra premises 1 and 5 are not raised. (ask520/w3/plan520.md rev 3)$t$,
 'in part', $t$Written 08:08 11-23 (card pressed 08:07:20) on the operator's card "Write 520" (W4 10556; audit 39833). Read back by W2 at Wall 10557 (CONFIRMED). Not yet shown by a run.$t$,
 '10381, 10429, 10430, 10432, 10433, 10477, 10478, 10479, 10483, 10485', '{{COORDINATOR_SESSION}}', NULL,
 $t$"\"Four Remaining Bugs ... Bug 4\"; \"yes\" 02:02 CST 11-23"$t$::jsonb, $t${"answer": "Write 520", "thread": "W4", "press_time": "08:07:20", "source": "Wall 10556; the write landed at 08:08 (audit 39833)"}$t$::jsonb, 'W3',
 $t${"md5": "76f7bdd5", "path": "ask520/w3/plan520.md", "commit": "e427cb92"}$t$::jsonb,
 $t$[{"md5": "739ad6b7", "path": "ask520/w4/FINDING520.md", "commit": "410bcd9d"}, {"md5": "1ca93bdf", "path": "ask520/w4/patch520b_on519.py"}, {"md5": "962f4571", "path": "ask520/w4/target_engine_520b_on519.json"}, {"md5": "f7659f9a", "path": "ask520/w4/stack/steps/put_520_engine.json", "wall_id": 10485}, {"md5": "eec6c3fb", "path": "ask520/w4/stack/steps/put_520_child.json", "wall_id": 10485}, {"md5": "b208524d", "path": "ask520/w4/target_child_520b_on519.json"}]$t$::jsonb,
 $t${"path": "ask520/w4/stack/steps/revert_520_engine.json and revert_520_child.json"}$t$::jsonb,
 $t$[{"seat": "W2", "verdict": "PASS with C-e (plan rev 1)", "wall_id": 10430, "md5_graded": "48eef61f", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (plan rev 2)", "wall_id": 10433, "md5_graded": "107725bf", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (plan rev 3 with variant B build, stacked on 519)", "wall_id": 10483, "md5_graded": "962f4571", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (child target)", "wall_id": 10483, "md5_graded": "b208524d", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['962f4571','b208524d'], $t$39833$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "c35d330e", "after": "ea8e8b80 (fetch-back ad302e3c)"}, {"kind": "n8n workflow", "name": "child MqQHRl7mQQ0z8QdT", "before": "b66da7aa", "after": "dfa5fecc (fetch-back 9ac64e59)"}]$t$::jsonb,
 $t$[{"file": "ask520/w4/chainG520b_41117.txt", "wall_id": 10479}]$t$::jsonb,
 $t$[{"seat": "W2", "result": "CONFIRMED", "wall_id": 10557}]$t$::jsonb,
 $t${"case": "UNEXERCISED: live, no released run has exercised it yet", "mark": "K-UNX skip on a MISSES press in a released run"}$t$::jsonb,
 $t${"engine_manual": "not yet written", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10381, 10429, 10430, 10432, 10433, 10477, 10478, 10479, 10483, 10485, 10556, 10557]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built ASK 520 (variant B)", "wall_id": 10477}, {"seat": "W4", "what": "wrote ASK 520 on its card", "wall_id": 10556}]$t$::jsonb, '{{COORDINATOR_SESSION}}' FROM public.ask_aar_snapshots s WHERE s.ask = 520 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(518, 'A1', $t$Close enforcer and judge contradiction check the whole quotation against its named text$t$,
 $t$S1 only (plan rev 6): a quoted reading is checked, whole, against the text it names. Source: the operator's "Four Remaining Bugs ... Bug 2", released by "yes" 02:02 CST 11-23. (ask518/w3/plan518.md rev 6)$t$,
 'in part', $t$Written 07:30 11-23 (card pressed 07:30:12) on the operator's card "Write 518" (W4 10506; audit 39789). Read back by W2 at Wall 10508 (CONFIRMED). Not yet shown by a run.$t$,
 '10381, 10443, 10448, 10451, 10492, 10497, 10506, 10508', '{{COORDINATOR_SESSION}}', NULL,
 $t$"\"Four Remaining Bugs ... Bug 2\"; \"yes\" 02:02 CST 11-23"$t$::jsonb, $t${"answer": "Write 518", "thread": "W4", "press_time": "07:30:12", "source": "Wall 10506; the write landed at 07:30 (audit 39789)"}$t$::jsonb, 'W3',
 $t${"md5": "f3ee867a", "path": "ask518/w3/plan518.md", "note": "rev 6"}$t$::jsonb,
 $t$[{"md5": "4969bb50", "path": "ask518/w4/write/put_518_engine_live.json", "wall_id": 10497}, {"md5": "1372e909", "path": "write518.sh"}]$t$::jsonb,
 $t${"md5": "22486ae3", "path": "ask520/w4/stack/steps/revert_518_engine.json", "guard": "c243b2c9"}$t$::jsonb,
 $t$[{"seat": "W2", "verdict": "PASS (build rev 6 on the live 517 engine)", "wall_id": 10497, "md5_graded": "4969bb50", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['4969bb50'], $t$39789$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "c5dcd97a", "after": "c243b2c9 (fetch-back 667db4c1)"}, {"kind": "n8n workflow", "name": "child MqQHRl7mQQ0z8QdT", "note": "not touched"}]$t$::jsonb,
 $t$[{"file": "ask518/w4/write/put_518_engine_live.json", "wall_id": 10497}]$t$::jsonb,
 $t$[{"seat": "W2", "result": "CONFIRMED", "wall_id": 10508}]$t$::jsonb,
 $t${"case": "UNEXERCISED: live, no released run has exercised it yet", "mark": "no probe named"}$t$::jsonb,
 $t${"engine_manual": "not yet written", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10381, 10451, 10492, 10497, 10506, 10508]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 518 rev 6 on its card", "wall_id": 10506}]$t$::jsonb, '{{COORDINATOR_SESSION}}' FROM public.ask_aar_snapshots s WHERE s.ask = 518 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(502, 'A1', $t$Engine calls to record and get early alternate move off the public key$t$,
 $t$Move the engine's calls to record_early_alternate and get_early_alternate off the public (anon) key (option O1), prove it with a run, then revoke the public key's EXECUTE. A1 is the move only; the revoke is A2. (ask502/w3/plan502.md rev 0)$t$,
 'in part', $t$Written 08:17 11-23 (card pressed 08:16:35) on the operator's card "Write 502 A1" (W4 10564; audit 39842). Read back by W2 at Wall 10565 (CONFIRMED). Not yet shown by a run.$t$,
 '10201, 10204, 10363, 10480, 10481, 10564, 10565', '{{COORDINATOR_SESSION}}', NULL,
 $t$"plan502 option O1, chosen by both graders (W2 10201, W1 10204)"$t$::jsonb, $t${"answer": "Write 502 A1", "thread": "W4", "press_time": "08:16:35", "source": "Wall 10564; the write landed at 08:17 (audit 39842)"}$t$::jsonb, 'W3',
 $t${"md5": "f958b8a4", "path": "ask502/w3/plan502.md", "note": "rev 0, option O1"}$t$::jsonb,
 $t$[{"md5": "83971fab", "path": "ask502/w4/BUILD502.md", "wall_id": 10480}, {"md5": "adae9459", "path": "ask502/w4/target_SX4Z_502.json"}]$t$::jsonb,
 $t${"md5": "04eda854", "path": "write/revert502.sh", "guard": "497ffa2c and ef373841", "copies": "revert_SX4ZWtgHNs96uBOo.json 778606ba, revert_moMxiV4Irg1uRBZN.json f7659f9a"}$t$::jsonb,
 $t$[{"seat": "W1", "verdict": "PASS with two notes (build)", "wall_id": 10481, "md5_graded": "83971fab", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['adae9459'], $t$39842$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "SX4ZWtgHNs96uBOo", "before": "f47f5955", "after": "497ffa2c (fetch-back 9ead58fe)"}, {"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "ea8e8b80", "after": "ef373841 (fetch-back a4c1fc87)"}]$t$::jsonb,
 $t$[{"file": "ask502/w4/BUILD502.md", "md5": "83971fab", "wall_id": 10480}]$t$::jsonb,
 $t$[{"seat": "W2", "result": "CONFIRMED", "wall_id": 10565}]$t$::jsonb,
 $t${"case": "UNEXERCISED: live, no released run has exercised it yet", "mark": "a released run in which an early alternate fires and its row is saved and read as service_role"}$t$::jsonb,
 $t${"engine_manual": "not yet written", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10201, 10204, 10363, 10480, 10481, 10564, 10565]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 502 A1 on its card", "wall_id": 10564}]$t$::jsonb, '{{COORDINATOR_SESSION}}' FROM public.ask_aar_snapshots s WHERE s.ask = 502 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(527, 'A1', $t$Send-back replies in the Sn RESPONSE form are read and graded$t$,
 $t$A judge's written reply to a send-back is read, and graded as today. An item counts under its rule as today when its answer was read and did not cure, or when no answer to it could be read. (ask527/w3/plan527.md rev 3)$t$,
 'in part', $t$Written 08:43 11-23 (card pressed 08:42:09) on the operator's card "Write 527" (W4 10578; audit 39857). Read back by W2 at Wall 10579 (CONFIRMED). Not yet shown by a run.$t$,
 '10524, 10526, 10528, 10530, 10541, 10546, 10549, 10550, 10551, 10552, 10578, 10579', '{{COORDINATOR_SESSION}}', NULL,
 $t$"run 41418 (sol 6.1 removed with drv_uncured 6)"$t$::jsonb, $t${"answer": "Write 527", "thread": "W4", "press_time": "08:42:09", "source": "Wall 10578; the write landed at 08:43 (audit 39857)"}$t$::jsonb, 'W3',
 $t${"md5": "7d32ccc2", "path": "ask527/w3/plan527.md", "commit": "30330174", "note": "rev 3"}$t$::jsonb,
 $t$[{"md5": "a3f5a5bb", "path": "ask527/w4/BUILD527.md", "wall_id": 10551}, {"md5": "859de6c6", "path": "target_engine_527.json"}, {"md5": "01e41009", "path": "target_child_527.json"}]$t$::jsonb,
 $t${"path": "write/revert527.sh", "copies": "revert_engine.json 3737aead, revert_child.json eec6c3fb"}$t$::jsonb,
 $t$[{"seat": "W2", "verdict": "FAIL (plan rev 0)", "wall_id": 10526, "md5_graded": "b56aaa6c", "verdict_norm": "FAIL"}, {"seat": "W2", "verdict": "FAIL ON FORM (plan rev 1)", "wall_id": 10528, "md5_graded": "65f39f86", "verdict_norm": "FAIL ON FORM"}, {"seat": "W2", "verdict": "PASS withdrawn as FAIL ON FORM at 10546 (plan rev 2)", "wall_id": 10530, "md5_graded": "21adbb1c", "verdict_norm": "FAIL ON FORM"}, {"seat": "W2", "verdict": "FAIL ON FORM (build rev 0)", "wall_id": 10546, "md5_graded": "447d58a2", "verdict_norm": "FAIL ON FORM"}, {"seat": "W2", "verdict": "PASS (plan rev 3)", "wall_id": 10550, "md5_graded": "7d32ccc2", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build rev 1)", "wall_id": 10552, "md5_graded": "a3f5a5bb", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['859de6c6','01e41009'], $t$39857$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "ef373841", "after": "97731058 (fetch-back 610b4305)"}, {"kind": "n8n workflow", "name": "child MqQHRl7mQQ0z8QdT", "before": "dfa5fecc", "after": "27629667 (fetch-back 57572b7a)"}]$t$::jsonb,
 $t$[{"file": "replay527.js", "md5": "152fcc66", "wall_id": 10552}]$t$::jsonb,
 $t$[{"seat": "W2", "result": "CONFIRMED", "wall_id": 10579}]$t$::jsonb,
 $t${"case": "UNEXERCISED: live, no released run has exercised it yet", "mark": "NO PROBE (plan rev 3 section 6)"}$t$::jsonb,
 $t${"engine_manual": "not yet written", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10524, 10526, 10528, 10530, 10546, 10550, 10552, 10578, 10579]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 527 on its card", "wall_id": 10578}]$t$::jsonb, '{{COORDINATOR_SESSION}}' FROM public.ask_aar_snapshots s WHERE s.ask = 527 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(524, 'A1', $t$E-ASSUME runs on both sides' charges; D3 Build carries the round 2 sentence$t$,
 $t$The assumption enforcer (E-ASSUME) tests whether the verses a side quoted, read together, state a fact that one of its premises takes as given, on the defender's charges against the challenger as well as the challenger's. D3 Build carries C2's round 2 carry sentence; this reverses the ASK 374 choice. (ask524/w1/plan524.md rev 1, which covers 524 and 525)$t$,
 'in part', $t$Written 08:46 11-23 (card pressed 08:46:17) on the operator's card "Write 524/525" (W4 10580; audit 39860). Read back by W3 at Wall 10581 (MATCH). Not yet shown by a run.$t$,
 '10534, 10538, 10539, 10544, 10547, 10580, 10581', '{{COORDINATOR_SESSION}}', NULL,
 $t$"failed run 41418 (also 41117, 41102, 41043)"$t$::jsonb, $t${"answer": "Write 524/525", "thread": "W4", "press_time": "08:46:17", "source": "Wall 10580; the write landed at 08:46 (audit 39860)"}$t$::jsonb, 'W1',
 $t${"md5": "bdab364c", "path": "ask524/w1/plan524.md", "note": "rev 1, covers 524 and 525"}$t$::jsonb,
 $t$[{"md5": "f858956b", "path": "ask524/w4/build/target_engine_524_on520.json"}, {"md5": "4baa2f89", "path": "patch524.py"}, {"md5": "86541f14", "path": "write524.sh"}]$t$::jsonb,
 $t${"md5": "591f1376", "path": "ask524/w4/build/revert524.sh", "copy": "revert_engine.json 83952c80"}$t$::jsonb,
 $t$[{"seat": "W3", "verdict": "PASS (plan rev 1)", "wall_id": 10539, "md5_graded": "bdab364c", "verdict_norm": "PASS"}, {"seat": "W3", "verdict": "PASS (build)", "wall_id": 10547, "md5_graded": "f858956b", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['f858956b'], $t$39860$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "97731058", "after": "0e05fc55 (fetch-back 3788819f)"}]$t$::jsonb,
 $t$[{"file": "synth524_41418.txt", "wall_id": 10539}]$t$::jsonb,
 $t$[{"seat": "W3", "result": "MATCH", "wall_id": 10581}]$t$::jsonb,
 $t${"case": "UNEXERCISED: live, no released run has exercised it yet", "mark": "\"EVERY VERSE THE\" in an E-ASSUME prompt (plan524.md section 6)"}$t$::jsonb,
 $t${"engine_manual": "not yet written (waits on the operator's card in W3's thread)", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10539, 10547, 10580, 10581]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 524/525 on one card", "wall_id": 10580}]$t$::jsonb, '{{COORDINATOR_SESSION}}' FROM public.ask_aar_snapshots s WHERE s.ask = 524 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(525, 'A1', $t$ASK 525, written with 524 on one card$t$,
 $t$The assumption enforcer (E-ASSUME) tests whether the verses a side quoted, read together, state a fact that one of its premises takes as given, on the defender's charges against the challenger as well as the challenger's. D3 Build carries C2's round 2 carry sentence; this reverses the ASK 374 choice. (ask524/w1/plan524.md rev 1, which covers 524 and 525)$t$,
 'in part', $t$Written 08:46 11-23 (card pressed 08:46:17) on the operator's card "Write 524/525" (W4 10580; audit 39860). Read back by W3 at Wall 10581 (MATCH). Not yet shown by a run.$t$,
 '10534, 10538, 10539, 10544, 10547, 10580, 10581', '{{COORDINATOR_SESSION}}', NULL,
 $t$"failed run 41418 (also 41117, 41102, 41043)"$t$::jsonb, $t${"answer": "Write 524/525", "thread": "W4", "press_time": "08:46:17", "source": "Wall 10580; the write landed at 08:46 (audit 39860)"}$t$::jsonb, 'W1',
 $t${"md5": "bdab364c", "path": "ask524/w1/plan524.md", "note": "rev 1, covers 524 and 525"}$t$::jsonb,
 $t$[{"md5": "f858956b", "path": "ask524/w4/build/target_engine_524_on520.json"}, {"md5": "4baa2f89", "path": "patch524.py"}, {"md5": "86541f14", "path": "write524.sh"}]$t$::jsonb,
 $t${"md5": "591f1376", "path": "ask524/w4/build/revert524.sh", "copy": "revert_engine.json 83952c80"}$t$::jsonb,
 $t$[{"seat": "W3", "verdict": "PASS (plan rev 1)", "wall_id": 10539, "md5_graded": "bdab364c", "verdict_norm": "PASS"}, {"seat": "W3", "verdict": "PASS (build)", "wall_id": 10547, "md5_graded": "f858956b", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['f858956b'], $t$39860$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "97731058", "after": "0e05fc55 (fetch-back 3788819f)"}]$t$::jsonb,
 $t$[{"file": "synth524_41418.txt", "wall_id": 10539}]$t$::jsonb,
 $t$[{"seat": "W3", "result": "MATCH", "wall_id": 10581}]$t$::jsonb,
 $t${"case": "UNEXERCISED: live, no released run has exercised it yet", "mark": "\"EVERY VERSE THE\" in an E-ASSUME prompt (plan524.md section 6)"}$t$::jsonb,
 $t${"engine_manual": "not yet written (waits on the operator's card in W3's thread)", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10539, 10547, 10580, 10581]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 524/525 on one card", "wall_id": 10580}]$t$::jsonb, '{{COORDINATOR_SESSION}}' FROM public.ask_aar_snapshots s WHERE s.ask = 525 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(526, 'A1', $t$Stored counted-premise arrays agree with the final count lines$t$,
 $t$A judge's stored counted-premise arrays agree with its final count lines, whenever those lines name the counted premises. Expected: in 41418 qwen 4 max's counted_premises_defender reads [2,5,6]. (ask526/w3/plan526.md rev 2)$t$,
 'in part', $t$Written 08:51 11-23 (card pressed 08:50:36) on the operator's card "Write 526" (W4 10582; audit 39863). Read back by W1 at Wall 10583 (MATCH). Not yet shown by a run.$t$,
 '10543, 10555, 10558, 10560, 10562, 10582, 10583', '{{COORDINATOR_SESSION}}', NULL,
 $t$"run 41418 (qwen 4 max array [1,2,5,6] against a count of 3)"$t$::jsonb, $t${"answer": "Write 526", "thread": "W4", "press_time": "08:50:36", "source": "Wall 10582; the write landed at 08:51 (audit 39863)"}$t$::jsonb, 'W3',
 $t${"md5": "9e2f3819", "path": "ask526/w3/plan526.md", "commit": "7dafc2ed", "note": "rev 2"}$t$::jsonb,
 $t$[{"md5": "ed5c103c", "path": "ask526/w4/BUILD526.md", "wall_id": 10560}, {"md5": "3afab90f", "path": "target_engine_526_on520.json"}, {"md5": "0356771b", "path": "patch526.py"}, {"md5": "b291898a", "path": "write526.sh"}]$t$::jsonb,
 $t${"path": "write/revert526.sh", "copy": "revert_engine.json 30e8263a"}$t$::jsonb,
 $t$[{"seat": "W1", "verdict": "PASS with two build requirements (plan rev 2)", "wall_id": 10558, "md5_graded": "9e2f3819", "verdict_norm": "PASS"}, {"seat": "W1", "verdict": "PASS (build)", "wall_id": 10562, "md5_graded": "ed5c103c", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['3afab90f'], $t$39863$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "0e05fc55", "after": "a2206d5d (fetch-back aad7b96a)"}]$t$::jsonb,
 $t$[{"file": "ask526/w4/BUILD526.md", "md5": "ed5c103c", "wall_id": 10562}]$t$::jsonb,
 $t$[{"seat": "W1", "result": "MATCH", "wall_id": 10583}]$t$::jsonb,
 $t${"case": "UNEXERCISED: live, no released run has exercised it yet", "mark": "\"COUNT: FINAL PASS to n\" (W4 10560); NO PROBE"}$t$::jsonb,
 $t${"engine_manual": "not yet written", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10558, 10562, 10582, 10583]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 526 on its card", "wall_id": 10582}]$t$::jsonb, '{{COORDINATOR_SESSION}}' FROM public.ask_aar_snapshots s WHERE s.ask = 526 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(523, 'A1', $t$An uncured DISAGREE on a deciding line counts against the judge$t$,
 $t$The operator chose "Yes, count it" on ASK 523: an enforcer DISAGREE on a judge's deciding line counts against that judge's seat when the judge does not cure it. (ask523/w3/plan523.md rev 1)$t$,
 'in part', $t$Written 08:53 11-23 (card pressed 08:52:34) on the operator's card "Write 523" (W4 10584; audit 39867). Read back by W2 at Wall 10585 (CONFIRMED). Not yet shown by a run.$t$,
 '10559, 10561, 10563, 10566, 10572, 10573, 10574, 10575, 10584, 10585', '{{COORDINATOR_SESSION}}', NULL,
 $t$"the operator's choice on 523, relayed 08:08 CST 11-23"$t$::jsonb, $t${"answer": "Write 523", "thread": "W4", "press_time": "08:52:34", "source": "Wall 10584; the write landed at 08:53 (audit 39867)"}$t$::jsonb, 'W3',
 $t${"md5": "418fbb56", "path": "ask523/w3/plan523.md", "note": "rev 1; dlu_match.js 6372cbd9"}$t$::jsonb,
 $t$[{"md5": "643e2ef6", "path": "ask523/w4/BUILD523.md", "wall_id": 10574}, {"md5": "110630d3", "path": "stack/engine_527_526_523.json"}, {"md5": "9b1c10bb", "path": "stack/child_527_523.json"}, {"md5": "acfdae89", "path": "patch523.py"}, {"md5": "9ba25478", "path": "body523.py"}, {"md5": "e9635196", "path": "write523.sh"}]$t$::jsonb,
 $t${"path": "write/revert523.sh", "copies": "revert_engine.json f916f109, revert_child.json c5c05639"}$t$::jsonb,
 $t$[{"seat": "W2", "verdict": "FAIL (plan rev 0)", "wall_id": 10561, "md5_graded": "7d2f1e63", "verdict_norm": "FAIL"}, {"seat": "W2", "verdict": "PASS (plan rev 1)", "wall_id": 10566, "md5_graded": "418fbb56", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "FAIL (build rev 0)", "wall_id": 10573, "md5_graded": "892b516b", "verdict_norm": "FAIL"}, {"seat": "W2", "verdict": "PASS (build rev 1)", "wall_id": 10575, "md5_graded": "643e2ef6", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['110630d3','9b1c10bb'], $t$39867$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "a2206d5d", "after": "48513907 (fetch-back af95e833)"}, {"kind": "n8n workflow", "name": "child MqQHRl7mQQ0z8QdT", "before": "27629667", "after": "ac517c41 (fetch-back e7f2c047)"}]$t$::jsonb,
 $t$[{"file": "synth523_out.txt", "md5": "0da5b726", "wall_id": 10575}]$t$::jsonb,
 $t$[{"seat": "W2", "result": "CONFIRMED", "wall_id": 10585}]$t$::jsonb,
 $t${"case": "UNEXERCISED: live, no released run has exercised it yet", "mark": "\"DECIDING LINE UNCURED (pkgDLU, ASK 523)\"; NO PROBE"}$t$::jsonb,
 $t${"engine_manual": "not yet written", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10561, 10566, 10573, 10575, 10584, 10585]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 523 on its card", "wall_id": 10584}]$t$::jsonb, '{{COORDINATOR_SESSION}}' FROM public.ask_aar_snapshots s WHERE s.ask = 523 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(531, 'A1', $t$A judge who spares an unsupported premise is sent back and counted$t$,
 $t$The operator chose "Yes, count it (ASK 531)" at 08:51 CST 11-23: "If both readers find a premise's fact unsupported by any verse and the judge spares it, it is sent back. Left uncured, it counts against that judge's seat, like Mary's line in 41418." (ask531/w3/plan531.md rev 1b)$t$,
 'in part', $t$Written 10:01 11-23 (card pressed 09:59:06) on the operator's card "Write 531" (W4 10660; audit 39943). Read back by W2 at Wall 10661 (MATCH). Not yet shown by a run.$t$,
 '10588, 10591, 10592, 10594, 10628, 10629, 10631, 10632, 10637, 10639, 10660, 10661', '{{COORDINATOR_SESSION}}', NULL,
 $t$"card \"Count a judge who lets an unsupported premise stand?\", 08:51 CST 11-23"$t$::jsonb, $t${"answer": "Write 531", "thread": "W4", "press_time": "09:59:06", "source": "Wall 10660; the write landed at 10:01 (audit 39943)"}$t$::jsonb, 'W3',
 $t${"md5": "0d641e7b", "path": "ask531/w3/plan531.md", "note": "rev 1b"}$t$::jsonb,
 $t$[{"md5": "ec623065", "path": "ask531/w4/BUILD531.md", "wall_id": 10637}, {"md5": "fa7711aa", "path": "ask531/w4/build/target_engine_531.json"}, {"md5": "577679a6", "path": "ask531/w4/build/target_child_531.json"}, {"md5": "d73ad624", "path": "patch531.py"}]$t$::jsonb,
 $t${"md5": "7e1e1c94", "path": "ask531/w4/write/revert531.sh", "copies": "revert_engine.json eb6e7e8a, revert_child.json 8447f33b", "note": "never run (W4 10660 item 5)"}$t$::jsonb,
 $t$[{"seat": "W2", "verdict": "FAIL (plan rev 0)", "wall_id": 10591, "md5_graded": "947ad221", "verdict_norm": "FAIL"}, {"seat": "W2", "verdict": "PASS with one WRONG-IF fix (plan rev 1)", "wall_id": 10594, "md5_graded": "5e8e5650", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS with one text fix (plan rev 1b)", "wall_id": 10629, "md5_graded": "fe10fbed", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "FAIL (build rev 0)", "wall_id": 10632, "md5_graded": "aecbb85a", "verdict_norm": "FAIL"}, {"seat": "W2", "verdict": "PASS (build rev 1)", "wall_id": 10639, "md5_graded": "ec623065", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['fa7711aa','577679a6'], $t$39943$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "48513907", "after": "9240349c (fetch-back 184761d0)"}, {"kind": "n8n workflow", "name": "child MqQHRl7mQQ0z8QdT", "before": "ac517c41", "after": "334f0518 (fetch-back e2ceb1bf)"}]$t$::jsonb,
 $t$[{"file": "ask531/w4/build/synth531d.js", "md5": "feaa86a2", "wall_id": 10639}, {"file": "out_synth531d.txt", "md5": "d67de361"}]$t$::jsonb,
 $t$[{"seat": "W2", "result": "MATCH", "wall_id": 10661}]$t$::jsonb,
 $t${"case": "UNEXERCISED: live, no released run has exercised it yet", "mark": "a released run carrying the 524 marker in which a judge spares a fact both readers mark NOT STATED"}$t$::jsonb,
 $t${"engine_manual": "not yet written", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10591, 10594, 10629, 10632, 10639, 10660, 10661]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built and wrote ASK 531 on its card", "wall_id": 10660}]$t$::jsonb, '{{COORDINATOR_SESSION}}' FROM public.ask_aar_snapshots s WHERE s.ask = 531 AND s.rev = 'A1' AND s.aar_at = now();
COMMIT;
-- After COMMIT, separately:
-- SELECT id, ask, rev, objective_met, status, md5_match FROM public.ask_aar_snapshots WHERE aar_at > now() - interval '10 minutes' ORDER BY id;
-- SELECT * FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';
-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id > 76;
