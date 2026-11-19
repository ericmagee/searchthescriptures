# ASK 493 plan rev 2 (W3, seat 33, 11-19; replaces rev 1 a81823fd: adds equal_to to grades, W1 F5 at 9796; rev 1 replaced rev 0 2a5a6bdd; takes W1 9788/9789 C1 and N1 to N3, W2 9790 C-1 and note 6; restates headings 3, 4, 5 and 8): the ASK AAR snapshot table, and the op doc rule for filling it

## 1. OBJECTIVE
The operator, 11:54 CST 11-19: "so now, the team must needs to agree on what they want recorded and how ... whatever they decide i will approve.  I will need the operation manual updated to explain who is responsible for updating the new ASK AAR table ... when to update it ... and how.  As a rule, the table will need to be updated before the report is given to me."
Expected effect:
 (a) A new table, ask_aar_snapshots, holds one row per ASK revision per AAR report. Rows are only inserted, never edited or deleted. No anon or authenticated path exists, and an audit_log row is written on every insert.
 (b) A new op doc paragraph, in §29, says the coordinator is responsible, the row is inserted before every AAR report to the operator, and the row is filled from SQL with source ids, never by hand.
The fields are the team's agreed list: WALL-9741, post 9776 (W3), confirmed by W4 9777, W1 9778 (adding field 3a) and W2 9780.

## 2. ROLES
Planner W3. Builder W4 (table DDL, test and revert SQL). Op doc writer W3. Graders W1 and W2 (neither is a builder or the op doc writer). The DDL write is authorized by a card pressed in W4's thread; the op doc write by a card pressed in W3's thread.

## 3. SCOPE (with SEARCH, read 11:5x CST 11-19)
In scope: one new table (public.ask_aar_snapshots) with its grants, RLS and two triggers; one new op doc paragraph.
Out of scope: every existing table, function, workflow and manual entry; seat duties (the operator, 11:20 CST: "nothing will change the workers").
SEARCH and hits:
 a. to_regclass('public.ask_aar_snapshots'): null, so the name is free.
 b. audit_log columns (information_schema): id, session_date, session_title, engine, built, established, key_fixes, saved_updated, decisions, pending, notes, created_at, performed_by. The insert trigger writes session_title, engine and notes, as the step files of ASKs 491, 492 and 494 do.
 c. Op doc v133 section list: no section mentions "AAR". §29 (Grading a package) holds THE ASK FORM, STACKED PACKAGES and SHARED TOOLS. The anchor "the engine manual is written only through engine_manual_apply.\n\n\n## 30. Run cadence" occurs once in v133 (counted live).
 d. The Wall manual v18 §7.4 says the coordinator sends the AAR to the operator after every set of reviews. This ASK adds the table step before that send; it does not change §7.4.
 NOT SEARCHED: n8n workflows. This ASK adds no workflow and changes none, and no workflow will read or write the new table. The Cure Call and SX4Z cannot be read by n8n MCP in any case.

## 4. CRITERIA and DONE
Table design (W4 builds from this):
 Columns, numbered as in post 9776:
  1 ask int not null (only numbered ASKs get rows; an unnumbered item such as E5 gets an ASK number before its row, W1 N2); 2 rev text not null; 3 title text not null; 3a objective text not null, objective_met text not null check in ('yes','in part','no','not yet') (W1 N1: 'not yet' when no source shows the objective either way), objective_met_reason text not null, objective_source text not null;
  4 aar_at timestamptz not null default now(); 5 written_by text not null (the coordinator's session id); 6 prior_row bigint references ask_aar_snapshots(id);
  7 operator_words jsonb (array of {text, at, source}); 8 card jsonb ({thread, press_time, answer, source});
  9 owner_seat text; 10 plan jsonb ({path, md5, commit, wall_id}); 11 build_files jsonb (array of {path, md5, commit}); 12 revert jsonb ({path, md5});
  13 grades jsonb (array of {seat, verdict, verdict_norm, md5_graded, wall_id}). verdict is the posted text (for example "PASS WITH C-1" or "PASS ON FORM"); verdict_norm is one of PASS, FAIL or FAIL ON FORM, required in every element, and the insert trigger refuses an element without it (W2 C-1). An element may also carry equal_to {md5, wall_id}: the md5_graded of this element was shown byte-equal to an earlier PASS-graded md5 by the post wall_id (W1 F5, the ASK 487 rebase: written file 93fe9adc, graded file 32bf6cba, shown equal at W2 9710 and W1 9715). The trigger counts such an element as PASS only when equal_to.md5 itself has a PASS element in the same row;
  14 md5_written text[], and md5_match boolean, set by the insert trigger (see below);
  15 audit_ids jsonb (array of int); 16 objects jsonb (array of {kind, name, before, after});
  17 tests jsonb (array of {file, md5, result, wall_id}); 18 readbacks jsonb (array of {seat, result, wall_id}); 19 run_evidence jsonb ({case, mark, run_token} or {owed: true});
  20 manuals jsonb ({engine_manual, op_doc}); 21 status text not null check in ('planned','graded','carded','written','read back','proven by run','reverted','dropped'); 22 sources jsonb not null (array of Wall ids and audit ids, at least one element).
  Plus id bigserial primary key.
 W4 note 2, decided: the table does NOT refuse a row whose written md5 is missing from the PASS-graded md5s. A snapshot must be able to record that mismatch (the ASK 482 rev 4 against rev 5 case, W1 9743), not hide it. Instead, the insert trigger sets md5_match = true only when every element of md5_written appears as md5_graded in a grades element whose verdict_norm is PASS, and in no element whose verdict_norm is FAIL or FAIL ON FORM. Otherwise it sets false, or null when md5_written is empty (W2 C-1: posted verdicts such as "PASS WITH C-1" and "PASS ON FORM" count as PASS through verdict_norm). The AAR reports any false.
 Access: RLS enabled with no policy. REVOKE ALL from PUBLIC, anon, authenticated. service_role and lab_seat get SELECT only. Every seat connects as postgres (W1 C1), so the role alone does not limit writers: the insert trigger refuses the row unless md_notes_caller_seat() = 36 (the coordinator's seat, read from truth.session_id) and written_by = current_setting('truth.session_id').
 Insert-only: a BEFORE UPDATE OR DELETE trigger raises for every role, postgres included, so no row is ever changed. TRUNCATE is revoked from every non-owner role.
 Audit: an AFTER INSERT trigger writes one audit_log row (session_title "ASK AAR snapshot: ASK <ask> rev <rev>", engine = written_by, notes = id, status and md5_match). It refuses the insert if truth.session_id is not set.
BEFORE THE BUILD (rolled-back test by W4, on the operator's approval prompt):
 T1 an insert as postgres with the session set: accepted, one audit row, md5_match computed.
 T2 the same insert without truth.session_id: refused.
 T3 UPDATE and DELETE as postgres: refused.
 T4 anon and authenticated: INSERT and SELECT refused (42501).
 T5 a row whose md5_written includes an md5 not graded PASS: accepted, with md5_match false.
 T5 includes one grade posted as "PASS WITH C-1" (verdict_norm PASS) on the written md5: md5_match true. T5b adds a FAIL ON FORM grade on the same md5: md5_match false.
 T6 sources empty: refused.
 T5c a written md5 graded only through an equal_to element whose equal_to.md5 has a PASS element: md5_match true; the same without that PASS element: false.
 T7 an insert with a seat 34 session set (not the coordinator): refused (W1 C1).
 T8 a grades element without verdict_norm: refused.
 R1 the revert leaves no table, no triggers and no function.
DONE:
 (i) the table, grants and triggers are read back live by two non-writers;
 (ii) op doc v135 (or the next version) carries the paragraph below, read back by two non-writers;
 (iii) the first real AAR after the write inserts its rows before the report is sent, and the report cites the row ids.
Op doc paragraph (W3 draft, written by its own card; the pair file is od_pairs_493.json in this folder):
 "ASK AAR SNAPSHOTS (ASK 493). Before the coordinator sends an AAR to the operator, the coordinator inserts one row into ask_aar_snapshots for each ASK revision the AAR covers. This is a rule: no AAR is sent before its rows are in. Each row is filled from SQL (the_wall, audit_log, pg_proc and the live version reads) and from the seats' posted md5s, and every field cites its source id in sources. A field with no source reads "not yet", never a guess. Rows are never edited: a later change to an ASK is a new row whose prior_row names the earlier one. The table accepts an insert only from the coordinator's seat (seat 36), refuses UPDATE and DELETE, has no anon or authenticated path, and writes an audit_log row on every insert. md5_match false means a written md5 was not among the PASS-graded md5s; the AAR reports it. The seats' duties do not change."
Revert: drop the two triggers, the trigger function(s) and the table, only while the table holds no row. After the first real row, the revert is "stop filling; keep the rows", on the operator's word (W2 note 6).

## 5. WRONG-IF
 1. The coordinator cannot fill a field from SQL. Some fields live only in thread chat (field 8, the operator's verbatim card answer). For those, the coordinator copies the chat message with its message id as the source, which is still not by hand from memory. If the team rules that a chat id is not a valid source, field 8 reads "not yet" until it is posted on the Wall.
 2. Insert-only blocks a needed correction. A wrong row is corrected by a new row with prior_row set and status unchanged, never by an edit.
 3. Another writer appears (a seat or a workflow). Every seat connects as postgres, so the grants alone do not stop a seat. The insert trigger refuses any session whose md_notes_caller_seat() is not 36, and any row whose written_by is not the session (T7).

## 6. RUN EVIDENCE
NO PROBE. No debate run touches this table. The evidence is DONE (iii): the first AAR's rows exist before its report, and the report cites them.

## 7. INPUTS IN GIT
This plan and od_pairs_493.json, at a493_w3/ on branch claude/untitled-9jle0o; the commit is named on the Wall. W4's step, test and revert SQL join a493_w4/ when built.

## 8. STEPS
 S1 W1 and W2 grade this plan. No card.
 S2 W4 builds step493.sql, test493_rollback.sql and revert493.sql. No card.
 S3 Rolled-back test. Waits on the operator's approval prompt.
 S4 W1 and W2 grade the build. No card.
 S5 Table write. Waits on W4's card, pressed in W4's thread.
 S6 Two non-writer readbacks of the table. No card.
 S7 Op doc paragraph (od_pairs_493.json, after two reads). Before its card, W3 recounts the anchor in the op doc version then current (v134 if the held manual card is written first; W1 N3). Waits on the manual card in W3's thread.
 S8 The coordinator fills the first rows at the next AAR (DONE iii). No card.
