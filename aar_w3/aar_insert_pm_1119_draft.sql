-- ASK AAR snapshot rows for the 11-19 pm AAR, DRAFT rev 1 (W3; replaces rev 0 8d7abf3d: builder rows added (W1 10014 F1), correction row for 19 added (W1 10014 item 3), manual times labelled as card times (N1)). For W1 and W2 to grade. NOT RUN.
-- The coordinator (seat 36) runs it once, after the grades, before the AAR is sent. No card.
-- Covers ASK 497 and ASK 498 (written and read back), a correction row for snapshot row 19 (ASK 493: its manuals were written at 19:07Z, before its aar_at 19:16:19Z, but it says "pending"), and one ask_aar_builders row per new snapshot row. Not yet included: the run 40891 row
-- (aar_494a1_run_template.sql e6c5c08e, prior_row 16, after W4 reports the run) and the 494 A2 row (after its write).
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3APzb2DidJoZ9Avizjn';

INSERT INTO ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources) VALUES
(497, '5', 'ASK AAR snapshot check',
 'Any row in ask_aar_snapshots not written by the coordinator, and any removal or disabling of the table''s guards, is found and reported to the operator before the AAR that would rely on it. (a497_w3/plan497.md rev 5)',
 'in part',
 'The check function is written (audit 39023 to 39025) and read back by W1 (9986) and W2 (9987); its rolled-back test passed (9979; W1 9980, W2 9981). The manuals are written (engine v219, op doc v136; readbacks 9992, 9993). It has not yet been run before an AAR; this AAR is the first.',
 '9985, 9986, 9987, 9992, 9993',
 'session_01H1X3APzb2DidJoZ9Avizjn', NULL,
 '[{"at":"12:34 CST","text":"Rows can only be added, and only by the coordinator (asked how it is enforced)","source":"plan497.md OBJECTIVE background; operator question relayed 18:34:28Z"}]'::jsonb,
 '{"answer":"Write it","thread":"W4","press_time":"19:43:01Z","source":"audit 39025"}'::jsonb,
 'W3',
 '{"md5":"1e04b59d","path":"a497_w3/plan497.md","commit":"520a4b39","wall_id":9920}'::jsonb,
 '[{"md5":"6df72062","path":"a497_w4/step497.sql","commit":"a46596f5"}]'::jsonb,
 '{"md5":"5cac5883","path":"a497_w4/revert497.sql"}'::jsonb,
 '[{"seat":"W2","verdict":"PASS (plan rev 5)","wall_id":9918,"md5_graded":"1e04b59d","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (plan rev 5)","wall_id":9925,"md5_graded":"1e04b59d","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (build rev 1)","wall_id":9921,"md5_graded":"6df72062","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (build rev 1)","wall_id":9925,"md5_graded":"6df72062","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (test output)","wall_id":9980,"md5_graded":"6df72062","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (test output)","wall_id":9981,"md5_graded":"6df72062","verdict_norm":"PASS"}]'::jsonb,
 ARRAY['6df72062'],
 '[39023,39024,39025]'::jsonb,
 '[{"kind":"function","name":"public.ask_aar_snapshots_check()","before":null,"after":"prosrc md5 08f53748"}]'::jsonb,
 '[{"file":"a497_w4/test497_rollback.sql","md5":"f518f541","result":"planned exception; all checks as planned; used snapshot ids 20 to 22","output":"ask497/w4/test497_output_1940Z.txt 222d2aed","wall_id":9979}]'::jsonb,
 '[{"seat":"W1","result":"CONFIRMED","wall_id":9986},{"seat":"W2","result":"CONFIRMED","wall_id":9987}]'::jsonb,
 '{"case":"the first AAR run through the check (this AAR)"}'::jsonb,
 '{"engine_manual":"v219 b61def0a (card 19:49:05Z, guard audit 39032 19:49:22Z; readbacks 9992, 9993)","op_doc":"v136 685e8a19 (card 19:49:05Z, guard audit 39033 19:49:40Z; readbacks 9992, 9993)"}'::jsonb,
 'read back',
 '[9918, 9920, 9921, 9925, 9979, 9980, 9981, 9985, 9986, 9987, 9991, 9992, 9993, "audit 39025"]'::jsonb),

(498, '3', 'AAR grade count (two non-builder grades)',
 'The GRADING rule needs two non-builder seats to grade what is written. ... Expected effect: for every snapshot row, a read shows whether each written md5 had PASS grades from two distinct seats that did not build it, and a row that falls short is reported in the AAR. Rows already inserted are not changed. (a498_w3/plan498.md rev 3)',
 'in part',
 'The table and function are written (audit 39084 to 39098) and read back by W2 (10001) and W1 (10002). The builder rows for snapshot rows 3 to 19 are in (ids 1 to 17, 14:05 CST), and ask_aar_grades_check() shows snapshot 12 (489, 0fd91b1c, n 1) and snapshot 16 (494 A1, 6eac56a9, n 0) ok false. Reporting them in this AAR completes it.',
 '10000, 10001, 10002, 10009',
 'session_01H1X3APzb2DidJoZ9Avizjn', NULL,
 NULL,
 '{"answer":"Write it","thread":"W4","press_time":"19:57:15Z","source":"audit 39098"}'::jsonb,
 'W3',
 '{"md5":"79b5d9c5","path":"a498_w3/plan498.md","commit":"e37bb656","wall_id":9951}'::jsonb,
 '[{"md5":"0d5ddbc8","path":"a498_w4/step498.sql","commit":"9f24ee38"}]'::jsonb,
 '{"md5":"60ee025d","path":"a498_w4/revert498.sql"}'::jsonb,
 '[{"seat":"W1","verdict":"PASS (plan rev 3)","wall_id":9952,"md5_graded":"79b5d9c5","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (plan rev 3)","wall_id":9953,"md5_graded":"79b5d9c5","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS WITH C-1 (build)","wall_id":9965,"md5_graded":"0d5ddbc8","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS with N1 to N3 (build)","wall_id":9967,"md5_graded":"0d5ddbc8","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS (test output)","wall_id":9996,"md5_graded":"0d5ddbc8","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (test output)","wall_id":9997,"md5_graded":"0d5ddbc8","verdict_norm":"PASS"}]'::jsonb,
 ARRAY['0d5ddbc8'],
 '[39084,39085,39086,39087,39088,39089,39090,39091,39092,39093,39094,39095,39096,39097,39098]'::jsonb,
 '[{"kind":"table","name":"public.ask_aar_builders with 4 triggers","before":null,"after":"0 rows at write; 17 rows (ids 1 to 17) at 14:05 CST"},
   {"kind":"function","name":"public.ask_aar_grades_check()","before":null,"after":"prosrc md5 2e26db98"},
   {"kind":"function","name":"ask_aar_builders trigger functions","before":null,"after":"before_insert 32b5ab87, after_insert 6208002b, no_change f3dc2d4a (prosrc)"}]'::jsonb,
 '[{"file":"a498_w4/test498_rollback.sql","md5":"5b48fb0f","result":"planned exception; all checks as planned; T5 row 12 n 1 ok false; T7 no 497 finding; used snapshot ids 23 to 25","output":"ask498/w4/test498_output_1951Z.txt 94be6dda","wall_id":9995}]'::jsonb,
 '[{"seat":"W2","result":"CONFIRMED","wall_id":10001},{"seat":"W1","result":"CONFIRMED","wall_id":10002}]'::jsonb,
 '{"case":"DONE (iii): builder rows in, and this AAR shows row 12 ok false"}'::jsonb,
 '{"engine_manual":"v220 31f2c3c0 (card 20:05:04Z, guard audit 39107 20:05:21Z; readbacks 10009, 10010)","op_doc":"v137 381bfe47 (card 20:05:04Z, guard audit 39108 20:05:34Z; readbacks 10009, 10010)"}'::jsonb,
 'read back',
 '[9951, 9952, 9953, 9963, 9965, 9966, 9967, 9968, 9969, 9995, 9996, 9997, 10000, 10001, 10002, 10008, 10009, 10010, "audit 39098"]'::jsonb),

(493, '8', 'ASK AAR snapshots table',
 'The operator, 11:54 CST 11-19: "so now, the team must needs to agree on what they want recorded and how ... whatever they decide i will approve.  I will need the operation manual updated to explain who is responsible for updating the new ASK AAR table ... when to update it ... and how.  As a rule, the table will need to be updated before the report is given to me." (a493_w3/plan493.md)',
 'yes',
 'CORRECTION of row 19, whose manuals field said "v218 pending" and "v135 pending" although both were written before its aar_at (19:16:19Z). The table is written (audit 38890) and read back by W2 (9903) and W1 (9904). The op doc paragraph (v135) and engine manual entry (v218) were written on the card "Write it" at 19:06:43Z in W3''s thread (guard audit 38916 19:07:34Z, 38917 19:07:49Z; W3 9912) and read back by W1 (9913) and W2 (9916). Rows 3 to 19 were inserted before the AAR they served (13:16 CST).',
 '9902, 9903, 9904, 9912, 9913, 9916, 10014',
 'session_01H1X3APzb2DidJoZ9Avizjn', 19,
 '[{"at":"11:54 CST","text":"so now, the team must needs to agree on what they want recorded and how ... whatever they decide i will approve.","source":"a493_w3/plan493.md"}]'::jsonb,
 '{"answer":"Write it","thread":"W4","press_time":"18:44:56Z","source":"audit 38890"}'::jsonb,
 'W3',
 '{"md5":"4af9b456","path":"a493_w3/plan493.md","commit":"a7956ff6","wall_id":9889}'::jsonb,
 '[{"md5":"2769dff6","path":"a493_w4/step493.sql","commit":"5ff09ab1"}]'::jsonb,
 '{"md5":"514a3efa","path":"a493_w4/revert493.sql"}'::jsonb,
 '[{"seat":"W2","verdict":"PASS","wall_id":9890,"md5_graded":"4af9b456","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS with C1 and C2 (build)","wall_id":9891,"md5_graded":"4af9b456","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS","wall_id":9896,"md5_graded":"2769dff6","verdict_norm":"PASS"},
   {"seat":"W1","verdict":"PASS","wall_id":9899,"md5_graded":"2769dff6","verdict_norm":"PASS"},
   {"seat":"W2","verdict":"PASS (test output)","wall_id":9900,"md5_graded":"2769dff6","verdict_norm":"PASS"}]'::jsonb,
 ARRAY['2769dff6'],
 '[38885,38886,38887,38888,38889,38890]'::jsonb,
 '[{"kind":"table","name":"public.ask_aar_snapshots with 4 triggers and 3 functions","before":null,"after":"after_insert b55dbe2c, before_insert 8d309b66, no_change 2f315710 (prosrc)"}]'::jsonb,
 '[{"file":"a493_w4/test493_rollback.sql","md5":"ce04b37c","result":"all as expected; T4 berean_ro by the closing check","wall_id":9897}]'::jsonb,
 '[{"seat":"W2","result":"CONFIRMED","wall_id":9903},{"seat":"W1","result":"CONFIRMED","wall_id":9904}]'::jsonb,
 '{"case":"DONE (iii): rows 3 to 19, before the AAR"}'::jsonb,
 '{"engine_manual":"v218 673f42fe (card 19:06:43Z, guard audit 38916 19:07:34Z; readbacks 9913, 9916)","op_doc":"v135 2df94c29 (card 19:06:43Z, guard audit 38917 19:07:49Z; readbacks 9913, 9916)"}'::jsonb,
 'read back',
 '[9889, 9890, 9891, 9893, 9896, 9897, 9899, 9900, 9902, 9903, 9904, 9906, 9912, 9913, 9916, 10014, "audit 38890", "audit 38916", "audit 38917"]'::jsonb);

-- One builder row per new snapshot row (GRADE COUNT). snapshot_id is taken from the rows this transaction just inserted (aar_at = now(), id > 25), by ask, rev and prior_row; no id is guessed.
INSERT INTO ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, ARRAY['W4'], b.src, 'session_01H1X3APzb2DidJoZ9Avizjn'
FROM ask_aar_snapshots s
JOIN (VALUES
 (497, '5', false, '[{"seat":"W4","what":"built step497.sql rev 0 and rev 1 (6df72062)","wall_id":9919},{"seat":"W4","what":"wrote 497 on its card","wall_id":9985}]'::jsonb),
 (498, '3', false, '[{"seat":"W4","what":"built step498.sql 0d5ddbc8","wall_id":9963},{"seat":"W4","what":"wrote 498 on its card","wall_id":10000}]'::jsonb),
 (493, '8', true,  '[{"seat":"W4","what":"built step493.sql 2769dff6","wall_id":9893},{"seat":"W4","what":"wrote 493 on its card","wall_id":9902}]'::jsonb)
) AS b(ask, rev, corr, src) ON s.ask = b.ask AND s.rev = b.rev AND (s.prior_row IS NOT NULL) = b.corr
WHERE s.id > 25 AND s.aar_at = now();

SELECT id, ask, rev, prior_row, md5_match FROM ask_aar_snapshots WHERE id > 25 ORDER BY id;
SELECT id, snapshot_id, builder_seats FROM ask_aar_builders WHERE id > 17 ORDER BY id;
SELECT * FROM ask_aar_snapshots_check() WHERE check_code <> 'd';
SELECT * FROM ask_aar_grades_check() WHERE snapshot_id > 25;
COMMIT;
