# ASK 497 plan rev 3 (W3, seat 33, 11-19; replaces rev 2 c3d3df25: md5 pinned to UTC and ISO, T8, sentence moved back to (d), W2 C-1 and N1 at 9900; rev 2 replaced rev 1 afa45992: W2 F1, F2, C-1 to C-3 at 9896; rev 1 replaced rev 0 dc7277d9: W1 F1, C1, N1, N2 at 9894): detect a seat posing as the coordinator on ask_aar_snapshots (ASK 493 option C)

## 1. OBJECTIVE
Any row in ask_aar_snapshots not written by the coordinator, and any removal or disabling of the table's guards, is found and reported to the operator before the AAR that would rely on it.

## 2. ROLES
Planner and writer of the op doc entry: W3. Builder: W4 (on its own card). Graders: W1 and W2. Runner of the check: the two non-coordinator graders of each AAR (W1 and W2 by default), not the coordinator.

## 3. SCOPE
In scope: one read-only SQL function, ask_aar_snapshots_check(), returning one row per finding; one op doc sentence saying who runs it and when.
Not in scope: any change to ask_aar_snapshots, its triggers or grants (ASK 493); any secret or new role (rejected at WALL-9741 9881 to 9887: postgres owns the table and has CREATEROLE, so no in-database secret is out of a seat's reach).
SEARCH (read 12:4x CST 11-19): plan493.md rev 8 4af9b456; step493.sql da21ef49 (trigger names bi, ai, nochange, notruncate); pg_event_trigger (ddl_audit_trigger on ddl_audit_logger, drop_audit_trigger on drop_audit_logger, W1 9888); seat_addresses (md_notes_caller_seat reads it by session_id); audit_log.
NOT SEARCHED: how seat_addresses history is kept (if a seat-36 session row is overwritten, check (a) reads only the current row; see WRONG-IF 2).

## 4. CRITERIA and DONE
The function returns findings for:
 (a) a row whose written_by is not a session registered to seat 36 in seat_addresses (one row per seat and session; seat 36 has 9 sessions, W1);
 (b) any of the four triggers (ask_aar_snapshots_bi, _ai, _nochange, _notruncate) missing, or tgenabled not 'O';
 (c) any audit_log row with engine 'ddl_event_trigger', 'drop_event_trigger' or 'event-trigger priv_change_audit' that names ask_aar_snapshots after the build's audit row;
 (d) is not SQL. Every row in the table must be cited in a coordinator message in the project chat. For each AAR, the coordinator first posts one line in the project chat, "ASK AAR rows written: <id> <md5(row::text)>, ...", after the rows are in and before the AAR. Earlier rows are cited by earlier such lines. The runners check both ways: every row in the table is on a line with the same md5, and every listed id still exists with that md5. So a changed or deleted row is caught too (W2 C-1). The function also returns each row's id and md5(row::text), so the runners compare without computing by hand. The md5 comes only from the function, which sets TimeZone 'UTC' and DateStyle 'ISO, MDY' for its own call (SET in the function definition), because md5(row::text) changes with the session TimeZone (W2 C-1, 9900). The coordinator's line copies the function's md5s. The runner reads the project chat with its own read_project_chat tool (seats can read the project chat; only the coordinator can post there) and lists any row id not cited. A copy of the ids on the Wall would not help, because any seat can post on the Wall.
 (e) the three audit event triggers (ddl_audit_trigger, drop_audit_trigger, priv_audit_trigger) exist and are enabled ('O') (W2 C-2). Whether postgres can disable them here is untested; the check covers both cases.
 The function is SECURITY INVOKER, read-only, and not callable by anon, authenticated or PUBLIC.
When: after the coordinator's "ASK AAR rows written" line and before the AAR is sent, W1 and W2 each run the function and do check (d), and post the result on the AAR's Wall root. Any finding goes to the operator at once, plainly (ASK 427 rule).
BEFORE THE BUILD (rolled-back test by W4): T1 a clean table: no findings. T2 a row inserted with a seat-34 session as written_by (triggers disabled inside the rolled-back test only): finding (a). T3 one trigger disabled: finding (b). T4 a COMMENT on the table: finding (c). T5 anon calls the function: 42501.
DONE: (i) the function read back live by two non-writers; (ii) the op doc sentence written and read back; (iii) the first AAR after the write carries both runners' results.

## 5. WRONG-IF
 1. A poser also edits seat_addresses to register its own session to seat 36. Then (a) passes, but the change to seat_addresses is not in this check. Check (d) still catches it: the poser cannot post the AAR message in the project chat.
 2. A seat-36 session row is deleted from seat_addresses. Earlier rows written by it would then show as finding (a). The runners report it, and the operator decides; seat_addresses keeps one row per seat and session today (W1).
 3. A poser drops the function itself. That drop is logged by drop_audit_logger, and the runners report a missing function as a finding.
 4. A seat turns the logging off first. Checks (a), (b), (c) and (e) catch mistakes and careless posing. Only (d) holds against a seat that disables the triggers and the logging before it acts, because no seat can post in the project chat (W2 C-3).

## 6. RUN EVIDENCE
NO PROBE. No debate run touches this check. The evidence is DONE (iii).

## 7. INPUTS IN GIT
This plan: a497_w3/plan497.md (rev 2 commit 4fcaa5d9; rev 3 commit on its Wall post). ASK 493 plan: a493_w3/plan493.md rev 8 4af9b456 (commit a7956ff6). ASK 493 build: a493_w4/step493.sql 2769dff6, test493_rollback.sql ce04b37c, revert493.sql 514a3efa (commit 5ff09ab1).

## 8. STEPS
 1. W1 and W2 grade this plan. No card.
 2. W4 drafts the function and the rolled-back test (T6: a row edited with triggers disabled returns a new md5, so (d) differs from the line; T7: an event trigger disabled is caught by (e); T8: the function's md5 for one row is the same when called under session TimeZone UTC and America/Chicago). No card.
 3. The rolled-back test runs on the operator's approval prompt; W1 and W2 grade the output.
 4. W4's build card; the operator's press writes it. Build only after ASK 493 is written.
 5. W1 and W2 read it back live. No card.
 6. W3's op doc sentence goes on the next manual card: "Before an AAR, the coordinator posts "ASK AAR rows written: <id> <md5(row::text)>, ..." in the project chat. W1 and W2 then each run ask_aar_snapshots_check() and confirm, both ways, that every row is on such a coordinator line with the same md5; any finding goes to the operator first. Then the coordinator sends the AAR."
