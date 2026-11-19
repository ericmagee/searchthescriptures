# ASK 498 plan rev 1 (W3, seat 33, 11-19; replaces rev 0 89ea9eae: W1 C1 and N1 at 9945): the AAR snapshot shows when a written md5 lacks two non-builder grades

## 1. OBJECTIVE
The GRADING rule needs two non-builder seats to grade what is written. Today md5_match in ask_aar_snapshots is true when each written md5 has at least one PASS, so row 12 (ASK 489, step489.sql 0fd91b1c, graded only by W1 9695) reads true (AAR rev 12, What went wrong 13). Expected effect: for every snapshot row, a read shows whether each written md5 had PASS grades from two distinct seats that did not build it, and a row that falls short is reported in the AAR. Rows already inserted are not changed.

## 2. ROLES
Planner: W3. Builder: W4 (SQL files, on its own card). Graders: W1 and W2. Readback: two non-writers. The coordinator inserts the builder rows (seat 36 only).

## 3. SCOPE
In scope:
 a. One new table, public.ask_aar_builders: snapshot_id (bigint, unique; no foreign key, see WRONG-IF 4), builder_seats text[] (not empty), sources jsonb (not empty), written_by, created_at. It has the same guards as ask_aar_snapshots: RLS on with no policy; REVOKE ALL from PUBLIC, anon, authenticated, berean_ro, service_role and lab_seat (table and sequence); SELECT for service_role and lab_seat; four triggers: before insert (seat 36 session, written_by = session), after insert (one audit_log row), no change (UPDATE and DELETE refused), no truncate.
 b. One read-only function, public.ask_aar_grades_check(), SECURITY INVOKER, STABLE, with TimeZone UTC, and no EXECUTE for PUBLIC, anon or authenticated. It also reports, as findings, ask_aar_builders or any of its four triggers missing or disabled (W1 N1). It returns one row per snapshot row and written md5: snapshot_id, md5, pass_seats (distinct seats with verdict_norm PASS on that md5, directly or through equal_to, excluding builder_seats), n, and ok (n >= 2 and no FAIL or FAIL ON FORM element on that md5). A snapshot row with no ask_aar_builders row returns ok null with the detail "no builder row".
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
 T5 the function on row 12 with builder_seats {W2}: n 1, ok false. On a test row with two non-builder PASS seats: ok true. With a FAIL element added: ok false.
 T6 md5(row::text) of rows 3 to 19 is the same before and after the test (no change to ask_aar_snapshots).
 T7 ask_aar_snapshots_check() (ASK 497) returns no a, b, c or e finding after the build, so no build statement left an audit row naming the 493 objects (W1 C1).
 T8 one trigger of ask_aar_builders disabled: ask_aar_grades_check() reports it.
 R1 the revert leaves no table, triggers or function.
DONE: (i) the table, triggers and function read back live by two non-writers; (ii) the op doc sentence written and read back; (iii) the builder rows for 3 to 19 inserted by the coordinator, and the function's output posted in the next AAR, with row 12 shown ok false.

## 5. WRONG-IF
 1. Someone adds a column to ask_aar_snapshots instead. Every row's md5(row::text) would change, and the ASK 497 line would no longer match. This plan keeps the side table for that reason.
 2. The builder of a write is unclear (two seats built parts). builder_seats takes every seat that built any part; both are excluded from the count.
 3. The coordinator fills builder_seats wrongly. The graders check each builder row against its cited Wall posts in the same AAR check; the posing limits of ASK 493 and 497 apply here too.
 4. The build leaves a permanent ASK 497 (c) finding. priv_audit_trigger logs left(current_query(), 1800), so a REVOKE or GRANT sent in a query that names ask_aar_snapshots would leave an audit row that matches 497's (c) (W1 C1). So the build sends its REVOKE and GRANT statements in separate calls that never name ask_aar_snapshots, and the table has no foreign key to it. T7 shows (c) stays clean.

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
