-- AAR grade fix, rev 1 (W2 PASS 10692 with one edit taken: the 577679a6 element cites 10692) (W1, 2026-11-23). NOT RUN. For W2's grade; the coordinator (seat 36) inserts.
-- Snapshots 81, 82, 85, 86 and 87 fail ask_aar_grades_check() with 'no non-builder PASS seat': their PASS elements carry the BUILD.md md5, not the written target md5.
-- The table is insert-only (trigger ask_aar_snapshots_nochange), so each fix is a new row, rev 'A1b', prior_row = the old id, a copy of the old row with the target-md5 PASS elements appended to grades.
BEGIN;
SET LOCAL truth.session_id = 'session_01H1X3ANeXjt6pnw4fs6Wxr4';
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources)
SELECT ask, 'A1b', title, objective, objective_met, objective_met_reason || ' Grades corrected from snapshot 81: PASS elements added on the written target md5s.', objective_source, 'session_01H1X3ANeXjt6pnw4fs6Wxr4', id, operator_words, card, owner_seat, plan, build_files, revert,
 grades || $t$[{"seat": "W1", "verdict": "PASS (build; its grade checks target_SX4Z_502.json by md5)", "wall_id": 10481, "md5_graded": "adae9459", "verdict_norm": "PASS"}]$t$::jsonb, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources
FROM public.ask_aar_snapshots WHERE id = 81;
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, b.builder_seats, b.sources, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s JOIN public.ask_aar_builders b ON b.snapshot_id = 81 WHERE s.prior_row = 81 AND s.rev = 'A1b';
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources)
SELECT ask, 'A1b', title, objective, objective_met, objective_met_reason || ' Grades corrected from snapshot 82: PASS elements added on the written target md5s.', objective_source, 'session_01H1X3ANeXjt6pnw4fs6Wxr4', id, operator_words, card, owner_seat, plan, build_files, revert,
 grades || $t$[{"seat": "W2", "verdict": "PASS (build rev 1; engine target named in the grade)", "wall_id": 10552, "md5_graded": "859de6c6", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build rev 1; child target named in the grade)", "wall_id": 10552, "md5_graded": "01e41009", "verdict_norm": "PASS"}]$t$::jsonb, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources
FROM public.ask_aar_snapshots WHERE id = 82;
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, b.builder_seats, b.sources, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s JOIN public.ask_aar_builders b ON b.snapshot_id = 82 WHERE s.prior_row = 82 AND s.rev = 'A1b';
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources)
SELECT ask, 'A1b', title, objective, objective_met, objective_met_reason || ' Grades corrected from snapshot 85: PASS elements added on the written target md5s.', objective_source, 'session_01H1X3ANeXjt6pnw4fs6Wxr4', id, operator_words, card, owner_seat, plan, build_files, revert,
 grades || $t$[{"seat": "W1", "verdict": "PASS (build; engine target named in the grade)", "wall_id": 10562, "md5_graded": "3afab90f", "verdict_norm": "PASS"}]$t$::jsonb, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources
FROM public.ask_aar_snapshots WHERE id = 85;
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, b.builder_seats, b.sources, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s JOIN public.ask_aar_builders b ON b.snapshot_id = 85 WHERE s.prior_row = 85 AND s.rev = 'A1b';
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources)
SELECT ask, 'A1b', title, objective, objective_met, objective_met_reason || ' Grades corrected from snapshot 86: PASS elements added on the written target md5s.', objective_source, 'session_01H1X3ANeXjt6pnw4fs6Wxr4', id, operator_words, card, owner_seat, plan, build_files, revert,
 grades || $t$[{"seat": "W2", "verdict": "PASS (build rev 1; stacked engine target named in the grade)", "wall_id": 10575, "md5_graded": "110630d3", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build rev 1; stacked child target named in the grade)", "wall_id": 10575, "md5_graded": "9b1c10bb", "verdict_norm": "PASS"}]$t$::jsonb, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources
FROM public.ask_aar_snapshots WHERE id = 86;
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, b.builder_seats, b.sources, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s JOIN public.ask_aar_builders b ON b.snapshot_id = 86 WHERE s.prior_row = 86 AND s.rev = 'A1b';
INSERT INTO public.ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources)
SELECT ask, 'A1b', title, objective, objective_met, objective_met_reason || ' Grades corrected from snapshot 87: PASS elements added on the written target md5s.', objective_source, 'session_01H1X3ANeXjt6pnw4fs6Wxr4', id, operator_words, card, owner_seat, plan, build_files, revert,
 grades || $t$[{"seat": "W2", "verdict": "PASS (build rev 1; engine target named in the grade)", "wall_id": 10639, "md5_graded": "fa7711aa", "verdict_norm": "PASS"}, {"seat": "W2", "verdict": "PASS (build rev 1; child target 577679a6; 10639 PASS, confirmed for this md5 by W2 at 10692)", "wall_id": 10692, "md5_graded": "577679a6", "verdict_norm": "PASS"}]$t$::jsonb, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources
FROM public.ask_aar_snapshots WHERE id = 87;
INSERT INTO public.ask_aar_builders (snapshot_id, prior_row, builder_seats, sources, written_by)
SELECT s.id, NULL, b.builder_seats, b.sources, 'session_01H1X3ANeXjt6pnw4fs6Wxr4' FROM public.ask_aar_snapshots s JOIN public.ask_aar_builders b ON b.snapshot_id = 87 WHERE s.prior_row = 87 AND s.rev = 'A1b';
COMMIT;
-- After COMMIT, separately:
-- SELECT * FROM public.ask_aar_grades_check() WHERE snapshot_id > 87;
-- Note: the check reads every snapshot, so 81, 82, 85, 86 and 87 keep their failing lines; their A1b rows are the corrected record.
