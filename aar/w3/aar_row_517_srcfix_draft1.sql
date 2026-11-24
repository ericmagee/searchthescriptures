-- aar/w3/aar_row_517_srcfix_draft1.sql
-- DRAFT 1 by W3 (session_01H1X3ANsGiMnhnbkfphocmo) for the coordinator (seat 36), on its order of 11:48 CST 2026-11-24. NOT RUN by W3 (the table refuses any seat but 36). For a W1 grade, then insert from seat 36.
-- ONE new ask_aar_snapshots row for ASK 517, prior_row 102, and its ask_aar_builders row. Rows 77 and 102 are not edited.
-- WHY: rows 77 and 102 give the sentence "by rulebook definition, L=6, c=0 is SELF-SUPPORTED, never PROP-DEPENDENT." as "the operator on 41117", and give "Four Remaining Bugs ... Bug 1" under operator_words. Both are text of a review inside a message the operator sent to W3's thread at 13:10 CST 2026-11-20 (cmsg_017ZQamDMHrS6fqMHnQDVo58A2UNZtWm1uZqF8U3eTczMi), which opens "Feedback (only use if useful):". He offered it as feedback, not as a ruling; who wrote the review is not in the record W3 read. W3's plan (Wall 10389) first quoted it as his; W3's mistake (Wall 11624).
-- WHAT THE RULE RESTS ON: ASK 517 written on the operator's card "Write 517", pressed 07:21:29 CST 2026-11-23 in W4's thread (Wall 10490; md_notes_rulings row 534, seat 35), and engine manual part 08.0 STANDINGS.
-- METHOD: every field is copied from row 102 by SELECT, so no fact is retyped. CHANGED against row 102: objective (the attribution of the sentence), operator_words (the attribution of the heading), objective_met_reason (one sentence added), objective_source and sources (Wall ids added), prior_row (102), written_by. Nothing else.
-- NOT RE-VERIFIED by W3 this turn: the operator's words of 22:26 CST 11-19 ("We can't have broken links ... and still win") and "yes" 02:02 CST 11-23; they are carried from row 102 as it holds them.
-- After the insert: SELECT * FROM ask_aar_snapshots_check(); SELECT * FROM ask_aar_grades_check();
-- The session line below must be the coordinator's own session; written_by is read from it.
BEGIN;
SET LOCAL truth.session_id = '<COORDINATOR SESSION, registered to seat 36>';
WITH s AS (
INSERT INTO ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources)
SELECT ask, rev, title,
  $t$A side's standing is decided by its own count only (engine_manual section 8 STANDINGS). The plan quoted in support a sentence from a review inside a message the operator sent at 13:10 CST 2026-11-20, which opens "Feedback (only use if useful):": "by rulebook definition, L=6, c=0 is SELF-SUPPORTED, never PROP-DEPENDENT." That sentence is the review's, offered by him as feedback; it is not his ruling. The win tests read the broken lines directly so no side wins with its own link broken (the operator, 22:26 CST 11-19: "We can't have broken links 🔗 and still win"). Expected outcome effect: none. (ask517/w3/plan517.md rev 5)$t$,
  objective_met,
  objective_met_reason || $t$ SOURCE CORRECTED in this row (Wall 11624, 11626): rows 77 and 102 named the sentence "by rulebook definition, L=6, c=0 is SELF-SUPPORTED, never PROP-DEPENDENT." as the operator's on 41117; it is from the review in his message of 13:10 CST 2026-11-20. The rule rests on his card "Write 517" (Wall 10490; md_notes_rulings row 534) and on engine manual part 08.0, not on that sentence. No fact of the build, the write or the run changes.$t$,
  objective_source || ', 10389, 10490, 11330, 11621, 11624, 11626',
  current_setting('truth.session_id'), 102,
  to_jsonb($t$"yes" 02:02 CST 11-23 (carried from row 102). The words "Four Remaining Bugs ... Bug 1", which rows 77 and 102 held here, are a heading of the review inside the operator's message of 13:10 CST 2026-11-20 (cmsg_017ZQamDMHrS6fqMHnQDVo58A2UNZtWm1uZqF8U3eTczMi, opening "Feedback (only use if useful):"); he offered the review as feedback and its words are not his ruling. His approval of ASK 517 is the card press "Write 517", 07:21:29 CST 2026-11-23, W4's thread (Wall 10490; md_notes_rulings row 534).$t$::text),
  card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status,
  sources || '[10389, 11330, 11621, 11624, 11626]'::jsonb
FROM ask_aar_snapshots WHERE id = 102
RETURNING id)
INSERT INTO ask_aar_builders (snapshot_id, builder_seats, sources, written_by)
SELECT s.id, b.builder_seats, b.sources, current_setting('truth.session_id') FROM s, ask_aar_builders b WHERE b.snapshot_id = 102;
SELECT * FROM ask_aar_snapshots_check() WHERE row_id = (SELECT max(id) FROM ask_aar_snapshots);
SELECT * FROM ask_aar_grades_check() WHERE snapshot_id = (SELECT max(id) FROM ask_aar_snapshots);
COMMIT;
