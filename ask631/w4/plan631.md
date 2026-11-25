# ASK 631 PLAN (W4), rev 0: when the panel fails, the checks already made and the judgments already returned are stored

Source: W4 Wall 11933, with the corrections in 11934. Operator 04:41 CST 11-25, project chat, message cmsg_017ZQamDMHrS6fqMHnQDVo589SHYu1ca6GGbyLrQ8xVXBq: "yes #631". That was his answer to whether a failed panel's usable judgments are stored, marked as not a verdict.
Live base: engine dc258730; child aad0ad9c (not touched). It is stacked with ASK 630, on the same failure path: one card and one write per workflow (op doc s29, STACKED PACKAGES), with one revert file per package.

## 1. OBJECTIVE
A panel failure no longer loses what the run has already paid for.
- (1) The enforcer rows the run made are written to debate_enforcer_log, as they are on a run that completes.
- (2) Each panel judge reply that holds judgment text is stored in a new table that nothing counts, marked "PANEL INCOMPLETE; NOT A VERDICT; NOT COUNTED".
Expected effect on 42517 (replayed):
- 103 Close Enforcer rows are written. The live engine held them in Close Enforcer Record (cec_log) and wrote none. My Wall 11933 said 4; Wall 11934 corrected that, and the 42517 node output shows 103.
- Two judgment texts are stored, gemini (slot 1) and qwen4max (slot 2).
- hydrogen (slot 3, no text) is not stored as a judgment. Its failure is in the ASK 630 mark and the ASK 629 line.

## 2. ROLES
- Plans and builds: W4.
- Grades: W1.
- Manual and AAR rows: W3.
- The write is on W4's card: the 630 and 631 stack, one card for the engine and the DB.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change:
- (a) A new table, odv1_panel_incomplete_judgments:
  - Columns: id bigserial, debate_id uuid, run_token text, slot int, judge_seat text, judge_api_model text, finish_reason text, completion_tokens int, reply_text text, failed_node text, note text default 'PANEL INCOMPLETE; NOT A VERDICT; NOT COUNTED', created_at timestamptz default now().
  - A guard trigger refuses UPDATE and DELETE. RLS is on with no anon or authenticated policy.
  - Writes go only through (b).
- (b) A new function, odv1_record_incomplete_panel(p_debate_id uuid, p_run_token text, p_failed_node text, p_rows jsonb), returns jsonb {rows n}, SECURITY DEFINER.
  - Grants are as for the nine engine write functions.
  - It inserts one row per element whose reply_text is a non-empty string.
- (c) Engine: three nodes on the failure path, after ASK 630's Panel Failure Mark and before Panel Tokens. Each HTTP node has onError continueRegularOutput, so a failed store never stops the tokens, the transcript or the error raise.
  - "Panel Failure Rows" (code). It builds the two payloads.
    - Enforcer rows: if Write Enforcer Log has already run, none, so nothing is written twice. Else, if Alternate Merge ran, its enforcer_log, the same set the normal path writes. Else, the round-stage logs: Close Enforcer Record cec_log, Judge Contradiction Record jcc_log and Assume Check Record acx_log, taken by the same three lookups as Alternate Merge's __cecL.
    - Judgments: if Write Judgment 1 has run, none, because those judgments are already stored. Else, for slots 1 to 3, the Panel Judge k openrouter reply where choices[0].message.content is a non-empty string. Each carries its seat and api_model from Resolve Seats judges[k-1], with finish_reason and completion_tokens.
    - The reserve's reply (Panel Reserve openrouter) is taken the same way if that node ran.
    - debate_id comes from Check Save; run_token from Init Seats.
  - "Failure Enforcer Log": HTTP, the record_enforcer_log RPC. Its body expression is Write Enforcer Log's PRD de-duplication, copied once, with the rows from Panel Failure Rows. It is skipped when there are no rows.
  - "Failure Judgments": HTTP, the odv1_record_incomplete_panel RPC. It is skipped when there are no rows.
- Not changed: Write Enforcer Log, Write Judgment 1 to 3, debate_judgments and its readers, every outcome or count. The new table has no reader in any count, and that is its purpose.

Why a new table and not debate_judgments: debate_judgments is read by aggregate_debate_panel, derive_debate_outcome, dash_odv1_debates, dash_odv1_judges, judge_seat_parse_history and record_integrity_scan. It has no column to mark a row "not counted". A marked row there would need every one of those readers changed, or it would be counted. A separate table keeps the rows stored and out of every count with no reader touched.

SEARCH:
- The panel chain into Write Enforcer Log and its body.
- Alternate Merge's enforcer_log assembly (__cecL).
- record_enforcer_log.
- The functions that name debate_judgments (the list above).
- Panel Failure Note's 13 inputs.
- The 42517 node outputs: Close Enforcer Record 103 rows; Judge Contradiction Record and Assume Check Record did not run; Panel Judge 1 to 3 openrouter envelopes; Check Save holds debate_id.

NOT SEARCHED: the dashboard pages (they read the functions above, which are not changed); the child (not on this path).

## 4. CRITERIA AND DONE
- C1. 42517 replay of Panel Failure Rows from the stored node outputs gives 103 enforcer rows equal to cec_log, and 2 judgment rows (gemini slot 1, qwen4max slot 2), each with its reply text whole, finish "stop" and completion_tokens as stored. hydrogen is absent.
- C2. With Write Enforcer Log marked as run, the enforcer rows are 0. With Write Judgment 1 marked as run, the judgment rows are 0. With Alternate Merge run, the rows equal its enforcer_log.
- C3. The function, in a rolled-back call: inserts n rows for n texts and skips an empty text. UPDATE and DELETE on the table raise. anon and authenticated have no EXECUTE and no table access.
- C4. Engine: only the three nodes are added (plus ASK 630's node), and only the failure-path connections change. Every other node is byte-equal to dc258730. Standing set 31/0. S4 compile passes. A run with no panel failure never reaches the nodes (by connections).
- C5. ASK 599: every new line is tagged ASK 631, there is no dead code, and no catch beyond the lookups that copy Alternate Merge's form.
- DONE: W1 PASS; the operator presses the stack card; DB and engine written; fetched back; W1 readback; the first live panel failure shows the rows.

## 5. WRONG-IF
- The plan aims at the wrong thing if the enforcer rows held at a failure are already written somewhere else. Then (1) would write them twice.
- Known-bad case: 42517 has 0 debate_enforcer_log rows for its run_token, with 103 rows held in cec_log.
- Known-good case: 42528 completed and Write Enforcer Log ran. Its 659 rows are in. On replay, the skip rule (Write Enforcer Log ran) gives 0 new rows.
- A second wrong-if: a reader somewhere counts every table of judgments. The search found none for the new table, because it is new.

## 6. RUN EVIDENCE
- Case: the first live run whose panel stage fails.
- Mark: debate_enforcer_log holds the run's held rows, and odv1_panel_incomplete_judgments holds one row per judge reply with text, each with note "PANEL INCOMPLETE; NOT A VERDICT; NOT COUNTED".
- NO PROBE can force a live panel failure.

## 7. INPUTS IN GIT
ask631/w4/plan631.md. The build goes in ask630/w4/b1/ (one stack): the DB SQL and revert SQL for both, the build script, the target engine, the tests and the 42517 fixtures, node-filtered: Close Enforcer Record, Panel Judge 1 to 3 openrouter, Check Save, Resolve Seats, Init Seats, Panel Failure Note.

## 8. STEPS (each names its card)
1. W1 grades this plan and the ASK 630 plan (no card).
2. Build the 630 and 631 stack and run the offline tests. The DB parts are tested only in rolled-back calls (no card). W1 grades the build.
3. Card to the operator: "Write ASKs 630 and 631 (a failed panel marks the row and keeps its checks and judgments)?" (W4's card).
4. The write: the DB parts first (unused until the engine calls them), then the engine. Then fetch back, the audit row, the Wall post and W1's readback.
5. W3: the manual entry for the panel-failure path and the AAR rows.
6. Live: the path fires only on a panel failure, so it is live and UNEXERCISED until one occurs. Two clean runs show no regression.
