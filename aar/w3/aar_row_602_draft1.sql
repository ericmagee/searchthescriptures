-- aar/w3/aar_row_602_draft1.sql
-- DRAFT 1 by W3 (session_01H1X3ANsGiMnhnbkfphocmo) for the coordinator (seat 36). NOT RUN by W3. For a W1 grade, then insert from seat 36.
-- One ask_aar_snapshots row for ASK 602 and its ask_aar_builders row.
-- READ BY W3 FOR THIS ROW: Wall 11572 (first 2,500 characters), 11576 and 11578 in full by SQL; the last ten messages of W4's thread (W4's request to W1, the card, the press, W4's report); ask591/w4/fix3/judge591.js and judge591_before.js with md5sum, sha1sum and diff by W3.
-- NOT READ BY W3: the operator's own words that began ASK 602 (W4's message to W1 says "the operator saw them look active"; I did not find his message); audit row 41496 (id from Wall 11576); the page as served; W1's grade file.
-- No plan file exists: W4 put the change to W1 in a thread message (09:47 CST), not on the Wall.
BEGIN;
SET LOCAL truth.session_id = '<COORDINATOR SESSION, registered to seat 36>';
WITH s AS (
INSERT INTO ask_aar_snapshots (ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, prior_row, operator_words, card, owner_seat, plan, build_files, revert, grades, md5_written, audit_ids, objects, tests, readbacks, run_evidence, manuals, status, sources)
VALUES (602, '0', $t$ASK 602: on the Judge order tab, Save and Undo show grey when there is nothing to save, and the line-up is labelled preview only$t$,
  $t$On the Judge order tab the operator can see at a glance whether there is anything to save, and that the line-up for a debate is a preview that saves nothing. Before, the Save order and Undo changes buttons looked active when nothing had changed, and the line-up heading did not say it was only a preview. (W4 to W1, 09:47 CST 2026-11-24: "the operator saw them look active"; the card text in W4's thread.)$t$,
  'yes',
  $t$Deployed by W4 on the operator's press "Deploy it" at 09:52 CST 2026-11-24 (Wall 11576; audit 41496). Dashboard only; no engine, child or database change. One file, judge591.js, two changes (diff by W3 of fix3/judge591_before.js 1aec0757 against fix3/judge591.js 6b871855): (1) one added line that puts a style rule on the page, "#jolists .btn:disabled" (grey background and text, opacity 1, cursor not-allowed), so the two buttons, which the page already disabled when nothing was changed, now look disabled; (2) the heading "The line-up for a debate" becomes "The line-up for a debate (preview only; nothing here is saved)". Production deployment dpl_HpfP5aLJ24XMAKupFK7we5L6fnUn; the alias truth-app-dashboard.vercel.app moved to it from dpl_AJ7NzE2AUALvibHUT83ez7WgPomX. W1 graded the file PASS before the card (Wall 11572) and read the deployment back as MATCH (Wall 11578: the alias on HpfP, judge591.js sha1 312a8119 equal to the graded file, the other 7 files unchanged). YES, because the objective is a display change and the served file equals the graded file by W1's read. Not seen by W3 or stated on the Wall: a screenshot of the page after the deploy, and the operator's own word that the tab now reads as he wants. Process fact: the change was put to W1 by thread message and has no Wall post before the grade.$t$,
  '11572, 11576, 11578',
  current_setting('truth.session_id'), NULL,
  to_jsonb($t$His press "Deploy it" at 09:52 CST 2026-11-24 on the card "Deploy the Judge order tab fix (ASK 602)?" in W4's thread (read by W3 in that thread). His words that began the ASK are not in the record W3 read.$t$::text),
  $j${"answer": "Deploy it", "source": "W4's thread, card cmsg_017ZQamDMHrS6fqMHnQDVo583w5gFeCRLuikM8NpMuVLkw (read by W3); Wall 11576; audit 41496", "thread": "W4", "press_time": "09:52 CST 2026-11-24", "question": "Deploy the Judge order tab fix (ASK 602)?"}$j$::jsonb,
  'W4',
  $j${"md5": null, "path": null, "note": "no plan file: W4 stated the two changes to W1 in a thread message at 09:47 CST 2026-11-24", "source": "W4's thread, read by W3"}$j$::jsonb,
  $j$[{"md5": "6b871855", "path": "ask591/w4/fix3/judge591.js", "note": "the page file as deployed (sha1 312a8119)", "source": "md5sum and sha1sum by W3; Wall 11572, 11576"}, {"md5": "1aec0757", "path": "ask591/w4/fix3/judge591_before.js", "note": "the base: the live file of the fix 1 deployment", "source": "md5sum by W3"}]$j$::jsonb,
  $j${"copy": "move the alias truth-app-dashboard.vercel.app back to dpl_AJ7NzE2AUALvibHUT83ez7WgPomX", "path": null, "source": "Wall 11576"}$j$::jsonb,
  $j$[{"seat": "W1", "verdict": "PASS (only the disabled-button style and the heading change; Save and Undo are disabled when nothing is dirty; syntax clean)", "wall_id": 11572, "md5_graded": "6b871855", "verdict_norm": "PASS", "source": "Wall 11572 names judge591.js 6b871855 on live 1aec0757"}]$j$::jsonb,
  ARRAY['6b871855'], '[41496]'::jsonb,
  $j$[{"kind": "dashboard deployment", "name": "truth-app-dashboard (production alias truth-app-dashboard.vercel.app)", "before": "dpl_AJ7NzE2AUALvibHUT83ez7WgPomX; judge591.js md5 1aec0757", "after": "dpl_HpfP5aLJ24XMAKupFK7we5L6fnUn; judge591.js md5 6b871855, sha1 312a8119; the other 7 files unchanged"}]$j$::jsonb,
  $j$[{"name": "syntax check of judge591.js", "result": "clean (W4, and W1's grade)", "source": "W4's message to W1; Wall 11572"}]$j$::jsonb,
  $j$[{"seat": "W1", "wall_id": 11578, "result": "MATCH (alias on dpl_HpfP; judge591.js sha1 312a8119 equals the graded file md5 6b871855; the other 7 files unchanged)"}]$j$::jsonb,
  $j${"case": "NOT A RUN FEATURE: a page display change; no engine run exercises it. Its mark is the page itself: with nothing changed, Save order and Undo changes show grey with a not-allowed cursor; the line-up heading reads \"The line-up for a debate (preview only; nothing here is saved)\".", "source": "Wall 11576; the diff by W3"}$j$::jsonb,
  $j${"op_doc": "none", "engine_manual": "none needed: the manual (part 10.0 version 302, THE JUDGE ORDER IS A TABLE, the page line) names what the tab does and does not describe its buttons or its headings"}$j$::jsonb,
  'read back', $j$[11572, 11576, 11578]$j$::jsonb)
RETURNING id)
INSERT INTO ask_aar_builders (snapshot_id, builder_seats, sources, written_by)
SELECT s.id, ARRAY['W4'], $j$[{"seat": "W4", "what": "built and deployed ASK 602 on its card", "wall_id": 11576}]$j$::jsonb, current_setting('truth.session_id') FROM s;
SELECT * FROM ask_aar_snapshots_check() WHERE row_id = (SELECT max(id) FROM ask_aar_snapshots);
SELECT * FROM ask_aar_grades_check() WHERE snapshot_id = (SELECT max(id) FROM ask_aar_snapshots);
COMMIT;
