# ASK 630 + 631 BUILD (W4), one stack on the panel-failure path

Plans: ask630/w4/plan630.md rev 1 (W1 PASS with N1, Wall 11963) and ask631/w4/plan631.md rev 1 (W1 PASS with N1 to N3, Wall 11965). Operator 04:41 CST 11-25: "#630. yes #631. yes".
Base: live engine dc258730 (after ASK 626; b1/base_eng.json = the 626 fetch-back), child aad0ad9c (not touched). ASK 629, if written first, changes only Init Seats and Panel Check, which this stack does not touch, so the rebase is mechanical.

## ENGINE (b630.cjs, target tg/target_engine_630.json)
Four nodes are added, and one connection changes: Dry Failed? false, which went to Panel Tokens, now goes to Panel Failure Mark. The chain runs Panel Failure Mark, then Panel Failure Rows, then Failure Enforcer Log, then Failure Judgments, then Panel Tokens. Every node has onError continueRegularOutput, so a fault in the stack never stops the tokens, the transcript or the error raise.
- Panel Failure Mark (630): POST rpc/odv1_mark_panel_incomplete with {run_token (Init Seats), node and msg (Panel Failure Note), skip = Init Seats regrade}.
- Panel Failure Rows (631, code, every line tagged):
  - done(n) means the node ran and is not the node Panel Failure Note names as failed.
  - Enforcer rows: none if Write Enforcer Log succeeded; Alternate Merge's enforcer_log if it ran; otherwise cec_log, jcc_log and acx_log.
  - Judgments: slot k's reply if Write Judgment k did not succeed; the reserve's reply with slot null if Write Judgment 1 did not succeed. Only text that is non-empty and not all spaces is taken.
- Failure Enforcer Log (631): record_enforcer_log, with Write Enforcer Log's body expression copied and its source Alternate Merge replaced by Panel Failure Rows. An empty list writes 0 rows. This replaces the plan's "skipped when there are no rows": the RPC with an empty array inserts nothing, so no extra node is needed.
- Failure Judgments (631): rpc/odv1_record_incomplete_panel.

## DB (db/db630_631.sql; revert db/revert630_631.sql)
- odv1_mark_panel_incomplete: marks only a row with outcome and quarantine_reason both null. The skip flag returns 0.
- odv1_panel_incomplete_judgments: append-only by trigger (UPDATE and DELETE raise); RLS on; no access for anon or authenticated; SELECT for service_role and lab_seat.
- odv1_record_incomplete_panel: inserts only rows whose reply_text is a non-blank string.
- Grants as for the engine write functions.
NOT RUN: the rolled-back DB test (db/test_db630_631.sql). Its execute_sql call raised an approval prompt that timed out at 05:11 CST. It was not retried; the route is with the coordinator.

## TESTS
- t630.cjs on the 42517 fixtures (fx/r42517_fail.json, node-filtered from the stored 42517 data): 25 PASS, 0 FAIL (tg/out_t630.txt). Covered:
  - Structure: 427 nodes; every base node byte-equal; only the chain connections change; dry is unchanged.
  - 42517: 103 enforcer rows equal to cec_log; gemini (slot 1, 29,340 tokens) and qwen4max (slot 2, 40,697 tokens) stored whole; hydrogen absent.
  - Never twice: a failure at Derive Outcome gives 0 and 0.
  - W1 N2: a failure at Write Enforcer Log writes its 103 rows.
  - W1 N1: a failure at Write Judgment 2 stores slot 2 only.
  - Alternate Merge's set is used when that node ran; the reserve is stored with slot null; an all-space reply is not stored.
  - Mark body, including skip on a regrade.
  - The Failure Enforcer Log body equals the body Write Enforcer Log would send for the same rows.
  - ASK 599 tags.
- Standing set: 31 PASS, 0 FAIL, with S4 at 293 of 293 expressions compiling (tg/out_standing_630.txt).
- Library Check pair PASSES (tg/out_pair_630.txt).
