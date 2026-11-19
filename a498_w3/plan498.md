# ASK 498 plan rev 3 (W3, seat 33, 11-19; replaces rev 2 4036c192: W2 C-1 and N1 at 9950; rev 2 replaced rev 1 36c006a0: W2 F1, C-1, C-2, C-3, N1 at 9946; rev 1 replaced rev 0 89ea9eae: W1 C1 and N1 at 9945): the AAR snapshot shows when a written md5 lacks two non-builder grades

## 1. OBJECTIVE
The GRADING rule needs two non-builder seats to grade what is written. Today md5_match in ask_aar_snapshots is true when each written md5 has at least one PASS, so row 12 (ASK 489, step489.sql 0fd91b1c, graded only by W1 9695) reads true (AAR rev 12, What went wrong 13). Expected effect: for every snapshot row, a read shows whether each written md5 had PASS grades from two distinct seats that did not build it, and a row that falls short is reported in the AAR. Rows already inserted are not changed.

## 2. ROLES
Planner: W3. Builder: W4 (SQL files, on its own card). Graders: W1 and W2. Readback: two non-writers. The coordinator inserts the builder rows (seat 36 only).

## 3. SCOPE
In scope:
 a. One new table, public.ask_aar_builders: id, snapshot_id (bigint, not unique; no foreign key, see WRONG-IF 4), prior_row (bigint, null for a first row; names the earlier ask_aar_builders row it corrects), builder_seats text[] (not empty), sources jsonb (not empty), written_by, created_at. A wrong builder row is corrected by a new row with prior_row set, never by an edit; the function reads the newest row for each snapshot_id (W2 C-1). It has the same guards as ask_aar_snapshots: RLS on with no policy; REVOKE ALL from PUBLIC, anon, authenticated, berean_ro, service_role and lab_seat (table and sequence); SELECT for service_role and lab_seat; four triggers: before insert (seat 36 session, written_by = session), after insert (one audit_log row), no change (UPDATE and DELETE refused), no truncate.
 b. One read-only function, public.ask_aar_grades_check(), SECURITY INVOKER, STABLE, with TimeZone UTC, and no EXECUTE for PUBLIC, anon or authenticated. It also reports, as findings, ask_aar_builders or any of its four triggers missing or disabled (W1 N1), and any ask_aar_builders row whose snapshot_id has no ask_aar_snapshots row (an orphan; W2 N1). It returns one row per snapshot row and written md5: snapshot_id, md5, pass_seats, proof_seats, n, and ok. Counting rule (W2 C-2): pass_seats are the distinct seats, not in builder_seats, with a grades element of verdict_norm PASS whose md5_graded is that md5 and which has no equal_to (W2 C-1: a proof element is not also a direct grade, so no seat is counted twice). Through equal_to: where a grades element by a seat not in builder_seats shows that md5 equal to a target md5 (equal_to.md5), the distinct non-builder seats with a PASS element on the target are added to pass_seats, and the seats that showed the equality are listed in proof_seats. n is the size of pass_seats; ok is n >= 2, no FAIL or FAIL ON FORM element on that md5 or its target, and, where pass_seats came through equal_to, at least one proof seat. A one-seat proof is shown in proof_seats for the AAR to report. A snapshot row with no ask_aar_builders row returns ok null with the detail "no builder row".
 c. One op doc sentence, added to the ASK 497 paragraph: the graders also run ask_aar_grades_check() and report any ok false or null.
Not in scope: no change to ask_aar_snapshots, its columns, triggers or md5_match; ALTER TABLE ADD COLUMN would change md5(row::text) of rows 3 to 19 and break the ASK 497 coordinator line (WRONG-IF 1). No change to ask_aar_snapshots_check().
SEARCH (read 13:2x CST 11-19): ask_aar_snapshots rows 12 and 16 (grades, build_files, md5_written, owner_seat); owner_seat is the planner, not the builder (row 12 W2, row 19 W3); step493.sql 2769dff6 (guard pattern); step497.sql 6df72062 (check function pattern).
NOT SEARCHED: whether any grade element names a builder seat already (none seen in rows 12 and 16).

## 4. CRITERIA and DONE
 For rows 3 to 19 the builder rows are filled from the Wall build and write posts (W4 for engine and DB writes on its cards; W2 for 489, 491 and 492 SQL; W1 for 482 rev 5 SQL; each cited in sources).
 Expected results on today's rows: row 12 (489) ok false, n 1; row 16 (494 A1) ok false, n 0; row 4 (485) and row 8 (487): n counts W1 and W2 through equal_to elements, so ok true, and the AAR already says those proofs were late.
BEFORE THE BUILD (rolled-back test by W4, on the operator's approval prompt, not before):
 T1 a builder row with the seat-36 session: accepted, one audit row.
 T2 the same without the session, or with a seat-34 session: refused.
 T3 UPDATE, DELETE, TRUNCATE on ask_aar_builders: refused.
 T4 anon and authenticated: INSERT, SELECT and EXECUTE refused (42501).
 T5 the function on row 12 with builder_seats {W2}: n 1, ok false. On a test row with two non-builder PASS seats: ok true. With a FAIL element added: ok false. On row 4 (485) with builder_seats {W4}: proof_seats {W1}, and pass_seats from the targets' PASS seats. T5a a seat with only an equal_to element on that md5 is in proof_seats and not in pass_seats (W2 C-1). T5b a second builder row for row 12 with prior_row set: the function reads the newer row.
 T6 md5(row::text) of rows 3 to 19 is the same before and after the test (no change to ask_aar_snapshots).
 T7 ask_aar_snapshots_check() (ASK 497) returns no a, b, c or e finding after the build, so no build statement left an audit row naming the 493 objects (W1 C1).
 T8 one trigger of ask_aar_builders disabled: ask_aar_grades_check() reports it.
 R1 the revert leaves no table, triggers or function.
DONE: (i) the table, triggers and function read back live by two non-writers; (ii) the op doc sentence written and read back; (iii) the builder rows for 3 to 19 inserted by the coordinator, and the function's output posted in the next AAR, with row 12 shown ok false.

## 5. WRONG-IF
 1. Someone adds a column to ask_aar_snapshots instead. Every row's md5(row::text) would change, and the ASK 497 line would no longer match. This plan keeps the side table for that reason.
 2. The builder of a write is unclear. builder_seats holds every seat that made any written file: the seat that built it and, where another seat rebased it, the rebasing seat (W4 for 485 and 487), each cited by that seat's own post (W2 C-3). All of them are excluded from the count.
 3. The coordinator fills builder_seats wrongly. The graders check each builder row against its cited Wall posts in the same AAR check; the posing limits of ASK 493 and 497 apply here too.
 4. The build leaves a permanent ASK 497 (c) finding. priv_audit_trigger logs left(current_query(), 1800), so a REVOKE or GRANT sent in a query that names ask_aar_snapshots would leave an audit row that matches 497's (c) (W1 C1). So the build sends its REVOKE and GRANT statements in separate calls whose text names only ask_aar_builders, its sequence and ask_aar_grades_check(), and the table has no foreign key to ask_aar_snapshots. T7 shows (c) stays clean. If T7 shows that the CREATE FUNCTION call itself leaves a matching row, the function names the table through format('%I', 'ask_aar_' || 'snapshots') in dynamic SQL, and T7 is run again.

## 6. RUN EVIDENCE
NO PROBE. No debate run touches these tables. The evidence is DONE (iii).

## 7. INPUTS IN GIT
This plan: a498_w3/plan498.md (commit on its Wall post). Candidate note: a497_w3/candidate_md5_match_count.md dde48225 (commit f96cd264). ASK 493 build a493_w4/step493.sql 2769dff6 (commit 5ff09ab1). ASK 497 build a497 step497.sql 6df72062 (commit a46596f5).

## 8. STEPS
 1. W1 and W2 grade this plan. No card.
 2. W4 drafts step498.sql, test498_rollback.sql and revert498.sql. No card.
 3. W1 and W2 grade the build. No card.
 4. The rolled-back test runs on the operator's approval prompt; W1 and W2 grade the output.
 5. W4's build card; the operator's press writes it. Only after ASK 497 is written.
 6. W1 and W2 read it back live. No card.
 7. The coordinator inserts the builder rows for 3 to 19 (seat 36). No card.
 8. W3's op doc sentence on the next manual card.
