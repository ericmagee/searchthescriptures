# ASK 497 plan rev 0 (W3, seat 33, 11-19): detect a seat posing as the coordinator on ask_aar_snapshots (ASK 493 option C)

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
 (a) a row whose written_by is not a session registered to seat 36 in seat_addresses;
 (b) any of the four triggers (ask_aar_snapshots_bi, _ai, _nochange, _notruncate) missing, or tgenabled not 'O';
 (c) any audit_log row written by ddl_audit_logger or drop_audit_logger, or by priv_audit_trigger, that names ask_aar_snapshots after the build's audit row;
 (d) is not SQL. Every row id in the table must be cited in a coordinator AAR message in the project chat. The runner reads the project chat with its own read_project_chat tool (seats can read the project chat; only the coordinator can post there) and lists any row id not cited. A copy of the ids on the Wall would not help, because any seat can post on the Wall.
 The function is SECURITY INVOKER, read-only, and not callable by anon, authenticated or PUBLIC.
When: before the coordinator sends each AAR to the operator, after its rows are in, W1 and W2 each run the function and do check (d), and post the result on the AAR's Wall root. Any finding goes to the operator at once, plainly (ASK 427 rule).
BEFORE THE BUILD (rolled-back test by W4): T1 a clean table: no findings. T2 a row inserted with a seat-34 session as written_by (triggers disabled inside the rolled-back test only): finding (a). T3 one trigger disabled: finding (b). T4 a COMMENT on the table: finding (c). T5 anon calls the function: 42501.
DONE: (i) the function read back live by two non-writers; (ii) the op doc sentence written and read back; (iii) the first AAR after the write carries both runners' results.

## 5. WRONG-IF
 1. A poser also edits seat_addresses to register its own session to seat 36. Then (a) passes, but the change to seat_addresses is not in this check. Check (d) still catches it: the poser cannot post the AAR message in the project chat.
 2. seat_addresses keeps only the current session per seat. After a new coordinator session registers, earlier rows' written_by no longer match. The function must then also accept a written_by that appears as a seat-36 session in audit_log registration rows; W4 to confirm where registration history lives before the build.
 3. A poser drops the function itself. That drop is logged by drop_audit_logger, and the runners report a missing function as a finding.

## 6. RUN EVIDENCE
NO PROBE. No debate run touches this check. The evidence is DONE (iii).

## 7. INPUTS IN GIT
This plan: a497_w3/plan497.md. ASK 493 plan: a493_w3/plan493.md rev 8.

## 8. STEPS
 1. W1 and W2 grade this plan.
 2. W4 confirms WRONG-IF 2 (where seat-36 registration history lives) and drafts the function and rolled-back test.
 3. The rolled-back test runs on the operator's approval prompt; W1 and W2 grade the output.
 4. W4's build card; the operator's press writes it. Build only after ASK 493 is written.
 5. W1 and W2 read it back live.
 6. W3's op doc sentence goes on the next manual card: "Before the coordinator sends an AAR, W1 and W2 each run ask_aar_snapshots_check() and confirm every row id is cited in a coordinator AAR message in the project chat; any finding goes to the operator first."
