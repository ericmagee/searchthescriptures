# ASK 630 PLAN (W4), rev 1 (replaces rev 0; W1 N1, Wall 11963): a panel failure marks the row at once, with its cause

Source: W4 Wall 11932 (cause and fix). Operator 04:41 CST 11-25, project chat, message cmsg_017ZQamDMHrS6fqMHnQDVo589SHYu1ca6GGbyLrQ8xVXBq: "#630. yes". That was his answer to the question on data_class 'contested' and framework_verdict null.
Live base: engine dc258730 (after ASK 626); child aad0ad9c (not touched).

CORRECTION TO MY WALL 11932: it said nothing on the panel-failure path marks the row. That is true of the engine, but I missed the database watchdog. The pg_cron job odv1_grading_failed_watchdog runs every 30 minutes and calls odv1_mark_grading_failed(). That function sets quarantine_reason "GRADING FAILED: the rounds were saved but no verdict was stored within 3 hours of the row ... No verdict stands on this row." It acts on rows whose outcome and quarantine_reason are null and that are more than 3 hours old. Row fd0edbff (42517) got that text at 01:30 CST 11-25. W3's F-a read the row before then. So the gap is narrower than I wrote:
- For up to three and a half hours the row is unmarked.
- The mark then names no cause.
- review_notes never gets a failure line.

## 1. OBJECTIVE
When the panel stage fails on a live, non-regrade run, the row is marked in the same execution, with the cause, the same way Failure Salvage marks a failed round. The marks are quarantine_reason, a review_notes line, data_class 'contested' and framework_verdict null.
- Expected effect on 42517: quarantine_reason "PANEL INCOMPLETE: failed at node "Panel Check": FAIL-CLOSED: seat "hydrogen" returned no text: ... The rounds and synthesis are recorded; no panel verdict stands on this row." It is set at about 22:19 CST instead of "GRADING FAILED" at 01:30.
- The watchdog then skips the row, because quarantine_reason is no longer null.

## 2. ROLES
- Plans and builds: W4.
- Grades: W1 (one seat that is not the builder).
- Manual entry and AAR rows: W3.
- The write needs W4's card to the operator: a DB function and an engine node are infrastructure.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change:
- (a) New DB function odv1_mark_panel_incomplete(p_run_token text, p_node text, p_msg text, p_skip boolean) returns integer, SECURITY DEFINER, search_path public. When p_skip is true it returns 0. Otherwise it runs:
  UPDATE debate_results
  SET quarantine_reason = 'PANEL INCOMPLETE: failed at node "'||p_node||'": '||left(p_msg,300)||'. The rounds and synthesis are recorded; no panel verdict stands on this row.',
      review_notes = coalesce(review_notes,'')||E'\n\n['||<that text>||' REVIEW THIS ROW.]',
      data_class = 'contested',
      framework_verdict = NULL
  WHERE run_token = p_run_token AND outcome IS NULL AND quarantine_reason IS NULL;
  It returns ROW_COUNT.
  Grants follow the nine engine write functions (ASK 494 A2): EXECUTE for postgres, service_role and lab_seat; revoked from PUBLIC, anon and authenticated. A comment names ASK 630.
- (b) Engine: one new HTTP node, "Panel Failure Mark", between Dry Failed? (false output) and Panel Tokens.
  - It POSTs /rest/v1/rpc/odv1_mark_panel_incomplete with the Supabase credential that Salvage Save and Write Tokens use.
  - The body is p_run_token (Init Seats run_token, with the ODV1-TEST- form in test mode, as Failure Salvage builds it), p_node and p_msg (from Panel Failure Note), and p_skip = Init Seats regrade.
  - onError is continueRegularOutput, as on Write Tokens, so that a failed mark never stops the tokens, the transcript or the error raise.
  - Panel Tokens does not read $input (searched: no $input, $json or $prevNode in its code), so the node placed before it changes nothing it reads.
- Unchanged: Panel Failure Note, Panel Tokens, Format Markdown, Raise If Incomplete, Failure Salvage, the watchdog, every other node and connection.

Why skip a regrade: a non-dry regrade grades an existing row that may already hold a verdict. A failed regrade must not quarantine that row. Its failure stays in the execution and the Drive transcript, as now.

SEARCH:
- Panel Failure Note inputs (13 nodes, from Panel Payloads to Write Enforcer Log) and its output (Dry Failed?).
- Dry Failed?: true goes to Dry Failure Stop, false to Panel Tokens. Panel Tokens goes to Write Tokens?, then Write Tokens, then Get Row and Get Judgments, then Format Markdown and Save to Drive, then Raise If Incomplete.
- Failure Salvage and Salvage Save (record_debate_row).
- Readers of Panel Failure Note: Format Markdown and Raise If Incomplete (by $('Panel Failure Note')).
- Init Seats regrade, dry and run_token.
- Triggers on debate_results: write guard (truncation only), reject_w2, snapshot queue, date normalize. None blocks this UPDATE.
- odv1_mark_grading_failed and its cron job.
- The three runs since 11-24 evening: 42505 (round failure; Failure Salvage marked it), 42517 (panel failure; watchdog mark), 42528 (no failure).

NOT SEARCHED: dashboard pages that read quarantine_reason (they read text and are not changed). The child workflow (not on this path).

## 4. CRITERIA AND DONE
- C1. Offline replay of the 42517 failure: the stored Panel Failure Note output and Init Seats give the RPC body. The function, run inside a transaction that is rolled back on a copy of row fd0edbff's state (quarantine_reason null, outcome null), sets the four fields as above and returns 1. It is measured by SELECT inside the same rolled-back call.
- C2. The same with p_skip true returns 0 and changes nothing. A row with outcome set, or with quarantine_reason already set, returns 0 and is unchanged.
- C3. Engine: only one node is added and two connections change (Dry Failed? false goes to Panel Failure Mark, which goes to Panel Tokens). Every other node is byte-equal to dc258730. Standing set 31/0. S4 compile of the new node's expressions passes.
- C4. A dry failure does not reach the node: Dry Failed? true goes to Dry Failure Stop, read from the connections.
- C5. Grants: anon and authenticated get 42501 on the function (has_function_privilege false), and service_role gets true.
- DONE: W1 PASS; the operator presses the card; the function is written and the engine written; both fetched back; W1 readback; two live runs. The panel-failure path fires only on a failing run, so it stays live and UNEXERCISED until a panel fails.

## 5. WRONG-IF
- The plan aims at the wrong thing if the row is not yet saved when the panel can fail. Then the UPDATE matches nothing, returns 0 and leaves the gap.
- Check: Save to DB comes before Panel Build on every path, and row fd0edbff (42517) existed at 22:11:40 CST, before the panel failed at about 22:19. That is the known-bad case.
- Known-good case: 42528's row has outcome set, so the function would return 0 and leave it as it is.
- A second wrong-if: a non-dry regrade whose row has outcome null. With p_skip it is never marked, so a regrade failure stays unmarked in the row. That is by design, and it is named here.
- A third (W1 N1): a failure after the outcome is stored (in Write Judgment 1 to 3, Derive Outcome or a later node that feeds Panel Failure Note). The row has outcome set, so the function matches nothing and leaves no mark. The row keeps its verdict, and the failure is only in the execution and the transcript. This is by design: a stored verdict is not quarantined by a later store failure.

## 6. RUN EVIDENCE
- Case: the first live run whose panel stage fails.
- Mark: its row's quarantine_reason begins "PANEL INCOMPLETE: failed at node", review_notes ends with that line plus "REVIEW THIS ROW.]", and the watchdog never writes "GRADING FAILED" on it.
- NO PROBE can force a panel failure on a live run (test_fail_seat runs only in a dry regrade, which this path skips by Dry Failed?).

## 7. INPUTS IN GIT
ask630/w4/plan630.md. The build goes in ask630/w4/b1/: the function SQL, the revert SQL, the build script, the target engine, the tests and the 42517 fixtures (Panel Failure Note and Init Seats outputs, node-filtered).

## 8. STEPS (each names its card)
1. W1 grades this plan (no card).
2. Build and offline tests, with the function tested only inside rolled-back calls (no card). W1 grades the build.
3. Card to the operator: "Write ASK 630 (panel failure marks the row)?" (W4's card). It covers one function and one engine node.
4. The write: the function first (it is unused until the node exists), then the engine. Then fetch back, the audit row, the Wall post and W1's readback.
5. W3: the engine manual entry (the panel-failure path) and the AAR rows.
6. Live runs: two clean runs show no regression. The path's own proof is the first run whose panel fails.
