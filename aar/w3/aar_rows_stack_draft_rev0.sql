-- ASK AAR rows for the write stack (517, 519, 520; 518 and 502 A1 to follow), DRAFT rev 0 (W3, 2026-11-23). Placeholders {{...}} are filled from each write and readback. Times in CST. NOT RUN.
-- verdict_norm values: PASS, FAIL or FAIL ON FORM only.
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3ANeXjt6pnw4fs6Wxr4';
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(517, 'A1', $t$The standing follows the count only; K-G3 retired; win tests read broken lines$t$,
 $t$A side's standing is decided by its own count only (engine_manual section 8 STANDINGS); the operator on 41117: "by rulebook definition, L=6, c=0 is SELF-SUPPORTED, never PROP-DEPENDENT." The win tests read the broken lines directly so no side wins with its own link broken (the operator, 22:26 CST 11-19: "We can't have broken links 🔗 and still win"). Expected outcome effect: none. (ask517/w3/plan517.md rev 5)$t$,
 'in part', $t$Written {{517_WRITE_CST}} 11-23 (card pressed {{517_PRESS_CST}}) on the operator's card "{{517_CARD}}" (W4 {{517_WRITE_WALL}}; audit {{517_AUDIT}}). Read back {{517_RB}}. Not yet shown by a run.$t$,
 '10381, 10414, 10415, 10418, 10422, 10435, 10441, 10473, 10475', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 $t$"\"Four Remaining Bugs ... Bug 1\"; \"yes\" 02:02 CST 11-23"$t$::jsonb, $t${"answer": "{{517_CARD}}", "thread": "W4", "press_time": "{{517_PRESS_CST}}", "source": "Wall {{517_WRITE_WALL}}; the write landed at {{517_WRITE_CST}} (audit {{517_AUDIT}})"}$t$::jsonb, 'W3',
 $t${"md5": "23a73d9e", "path": "ask517/w3/plan517.md", "commit": "d6904e24 (rev 4); rev 5 61510f35"}$t$::jsonb,
 $t$[{"md5": "11a272f4", "path": "ask517/w1/BUILD517.md", "commit": "360bb005"}, {"md5": "{{517_TARGET_ENGINE}}", "path": "ask517/w1/target_engine_517.json"}, {"md5": "{{517_TARGET_CHILD}}", "path": "ask517/w1/target_child_517.json"}, {"md5": "cbbe66de", "path": "ask517/w1/step517_s6.sql"}]$t$::jsonb,
 $t${"md5": "82fcafab", "path": "ask517/w1/revert517_s6.sql", "workflows": "{{517_REVERT_FILES}}"}$t$::jsonb,
 $t$[{"seat": "W4", "verdict": "PASS (plan rev 3)", "wall_id": 10414, "md5_graded": "3276053d", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS with C-c (plan rev 3)", "wall_id": 10415, "md5_graded": "3276053d", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (plan rev 4)", "wall_id": 10422, "md5_graded": "c4221d8e", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build, three limits)", "wall_id": 10441, "md5_graded": "{{517_TARGET_ENGINE}}", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build, child target)", "wall_id": 10441, "md5_graded": "{{517_TARGET_CHILD}}", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build, S6 step)", "wall_id": 10441, "md5_graded": "cbbe66de", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['{{517_TARGET_ENGINE}}','{{517_TARGET_CHILD}}','cbbe66de'], $t$"{{517_AUDIT_LIST}}"$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "0427ec91", "after": "{{517_ENGINE_AFTER}}"}, {"kind": "n8n workflow", "name": "child MqQHRl7mQQ0z8QdT", "before": "47df6892", "after": "{{517_CHILD_AFTER}}"}, {"kind": "function", "name": "public.derive_debate_outcome(uuid)", "before": "2a853df6", "after": "{{517_FN_AFTER}}"}]$t$::jsonb,
 $t$[{"file": "ask517/w1/test517_s6_rollback.sql", "md5": "a4b1df76", "wall_id": 10435}, {"file": "ask517/w1/test517_s6_knowngood.sql", "md5": "0d091211", "wall_id": 10435}, {"file": "ask517/w1/replay517c2.js", "wall_id": 10473}]$t$::jsonb,
 $t$[{"seat": "{{517_RB_SEAT}}", "result": "{{517_RB_RESULT}}", "wall_id": "{{517_RB_WALL}}"}]$t$::jsonb,
 $t${"case": "not yet: no graded run check on the Wall"}$t$::jsonb,
 $t${"engine_manual": "{{517_EM_VERSION}}", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10381, 10414, 10415, 10418, 10422, 10435, 10441, 10446, 10447, 10473, 10475, "{{517_WRITE_WALL}}", "{{517_RB_WALL}}"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W1','W4'], $t$[{"seat": "W1", "what": "built ASK 517", "wall_id": 10435}, {"seat": "W4", "what": "wrote ASK 517 on its card", "wall_id": "{{517_WRITE_WALL}}"}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 517 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(519, 'A1', $t$K-W and K-S3 ask only about footing$t$,
 $t$K-W and K-S3 are raised only on a sentence that can give up a side's own footing: a withdrawal-class sentence, or a grant-class sentence that names a link, premise or press. Expected effect: K-W and K-S3 cure items fall from 51 to about 13 on 41117, with no real reply dropped. (ask519/w3/plan519.md rev 2)$t$,
 'in part', $t$Written {{519_WRITE_CST}} 11-23 (card pressed {{519_PRESS_CST}}) on the operator's card "{{519_CARD}}" (W4 {{519_WRITE_WALL}}; audit {{519_AUDIT}}). Read back {{519_RB}}. Not yet shown by a run.$t$,
 '10381, 10416, 10420, 10425, 10426, 10474, 10476', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 $t$"\"Four Remaining Bugs ... Bug 3\"; \"yes\" 02:02 CST 11-23"$t$::jsonb, $t${"answer": "{{519_CARD}}", "thread": "W4", "press_time": "{{519_PRESS_CST}}", "source": "Wall {{519_WRITE_WALL}}; the write landed at {{519_WRITE_CST}} (audit {{519_AUDIT}})"}$t$::jsonb, 'W3',
 $t${"md5": "11628857", "path": "ask519/w3/plan519.md", "commit": "bb58e8b9"}$t$::jsonb,
 $t$[{"md5": "078884f1", "path": "ask519/w4/BUILD519.md", "commit": "fa5ac288"}, {"md5": "{{519_TARGET_ENGINE}}", "path": "{{519_TARGET_ENGINE_PATH}}"}, {"md5": "{{519_TARGET_CHILD}}", "path": "{{519_TARGET_CHILD_PATH}}"}]$t$::jsonb,
 $t${"path": "{{519_REVERT}}"}$t$::jsonb,
 $t$[{"seat": "W2", "verdict": "PASS with C-d (plan rev 1)", "wall_id": 10420, "md5_graded": "63abeb6b", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (plan rev 2)", "wall_id": 10426, "md5_graded": "11628857", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build)", "wall_id": 10476, "md5_graded": "{{519_TARGET_ENGINE}}", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build, child target)", "wall_id": 10476, "md5_graded": "{{519_TARGET_CHILD}}", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['{{519_TARGET_ENGINE}}','{{519_TARGET_CHILD}}'], $t$"{{519_AUDIT_LIST}}"$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "{{519_ENGINE_BEFORE}}", "after": "{{519_ENGINE_AFTER}}"}, {"kind": "n8n workflow", "name": "child MqQHRl7mQQ0z8QdT", "before": "{{519_CHILD_BEFORE}}", "after": "{{519_CHILD_AFTER}}"}]$t$::jsonb,
 $t$[{"file": "ask519/w4/BUILD519.md", "md5": "078884f1", "wall_id": 10474}]$t$::jsonb,
 $t$[{"seat": "{{519_RB_SEAT}}", "result": "{{519_RB_RESULT}}", "wall_id": "{{519_RB_WALL}}"}]$t$::jsonb,
 $t${"case": "not yet: no graded run check on the Wall"}$t$::jsonb,
 $t${"engine_manual": "{{519_EM_VERSION}}", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10381, 10416, 10420, 10425, 10426, 10474, 10476, "{{519_WRITE_WALL}}", "{{519_RB_WALL}}"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built ASK 519", "wall_id": 10474}, {"seat": "W4", "what": "wrote ASK 519 on its card", "wall_id": "{{519_WRITE_WALL}}"}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 519 AND s.rev = 'A1' AND s.aar_at = now();
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(520, 'A1', $t$K-UNX not raised on a press the judge grades MISSES$t$,
 $t$K-UNX is not raised on a counted premise when the judge's own ANSWER CHECK grades a press of that premise, from the pressing side's round 2 or 3, MISSES or FAILS (Commitment 5, ruling 372). Expected effect on 41117: Sol 6.1 premises 4 and 5 and Terra premises 1 and 5 are not raised. (ask520/w3/plan520.md rev 3)$t$,
 'in part', $t$Written {{520_WRITE_CST}} 11-23 (card pressed {{520_PRESS_CST}}) on the operator's card "{{520_CARD}}" (W4 {{520_WRITE_WALL}}; audit {{520_AUDIT}}). Read back {{520_RB}}. Not yet shown by a run.$t$,
 '10381, 10429, 10430, 10432, 10477, 10478, 10479, 10483', 'session_01H1X3ANeXjt6pnw4fs6Wxr4', NULL,
 $t$"\"Four Remaining Bugs ... Bug 4\"; \"yes\" 02:02 CST 11-23"$t$::jsonb, $t${"answer": "{{520_CARD}}", "thread": "W4", "press_time": "{{520_PRESS_CST}}", "source": "Wall {{520_WRITE_WALL}}; the write landed at {{520_WRITE_CST}} (audit {{520_AUDIT}})"}$t$::jsonb, 'W3',
 $t${"md5": "76f7bdd5", "path": "ask520/w3/plan520.md", "commit": "e427cb92"}$t$::jsonb,
 $t$[{"md5": "739ad6b7", "path": "ask520/w4/FINDING520.md", "commit": "410bcd9d"}, {"md5": "1ca93bdf", "path": "patch520b_on519.py"}, {"md5": "962f4571", "path": "{{520_TARGET_ENGINE_PATH}}"}, {"md5": "{{520_TARGET_CHILD}}", "path": "{{520_TARGET_CHILD_PATH}}"}]$t$::jsonb,
 $t${"path": "{{520_REVERT}}"}$t$::jsonb,
 $t$[{"seat": "W2", "verdict": "PASS with C-e (plan rev 1)", "wall_id": 10430, "md5_graded": "48eef61f", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (plan rev 2)", "wall_id": "{{520_REV2_PASS_WALL}}", "md5_graded": "107725bf", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (plan rev 3 with variant B build, stacked on 519)", "wall_id": 10483, "md5_graded": "962f4571", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (child target)", "wall_id": 10483, "md5_graded": "{{520_TARGET_CHILD}}", "verdict_norm": "PASS"}]$t$::jsonb,
 ARRAY['962f4571','{{520_TARGET_CHILD}}'], $t$"{{520_AUDIT_LIST}}"$t$::jsonb,
 $t$[{"kind": "n8n workflow", "name": "engine moMxiV4Irg1uRBZN", "before": "{{520_ENGINE_BEFORE}}", "after": "{{520_ENGINE_AFTER}}"}, {"kind": "n8n workflow", "name": "child MqQHRl7mQQ0z8QdT", "before": "{{520_CHILD_BEFORE}}", "after": "{{520_CHILD_AFTER}}"}]$t$::jsonb,
 $t$[{"file": "chainG520b_41117.txt", "wall_id": 10479}]$t$::jsonb,
 $t$[{"seat": "{{520_RB_SEAT}}", "result": "{{520_RB_RESULT}}", "wall_id": "{{520_RB_WALL}}"}]$t$::jsonb,
 $t${"case": "not yet: no graded run check on the Wall"}$t$::jsonb,
 $t${"engine_manual": "{{520_EM_VERSION}}", "op_doc": "not needed"}$t$::jsonb,
 'read back', $t$[10381, 10429, 10430, 10432, 10477, 10478, 10479, 10483, "{{520_WRITE_WALL}}", "{{520_RB_WALL}}"]$t$::jsonb);
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], $t$[{"seat": "W4", "what": "built ASK 520 (variant B)", "wall_id": 10477}, {"seat": "W4", "what": "wrote ASK 520 on its card", "wall_id": "{{520_WRITE_WALL}}"}]$t$::jsonb, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s WHERE s.ask = 520 AND s.rev = 'A1' AND s.aar_at = now();
COMMIT;
-- Separate calls after COMMIT:
-- SELECT id, ask, rev, objective_met, status, md5_match FROM public.ask_aar_snapshots WHERE aar_at > now() - interval '10 minutes' ORDER BY id;
-- SELECT * FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';
-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id > 76;
