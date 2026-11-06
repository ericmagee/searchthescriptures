# pkgJFL wiring (for W4). The cross-run judge fault ledger (W3 spec Wall 2632 part 3; Eric approved 17:21 CST 2026-11-06).
Base: live 98daac9e + n19 + n20 + pkgIMP + pkgBAR 3086eb8. pkgJFL goes after pkgBAR. It adds no second disqualification line: pkgBAR has it in PART2.

Write order
1. SQL: `jfl.sql` (one transaction; table, functions, trigger on debate_enforcer_log, views, grants), then `jfl_backfill.sql` (ledger from run
   33040, then 16 strikes from W3's grade files). Both need `SET LOCAL truth.session_id=...` in the same call (ddl_audit_logger).
   The trigger takes a short lock on debate_enforcer_log: write at a gap, never during a run.
2. n8n, 6 nodes: the url of Accept Models and Fetch Models (http_JFL.json), and the jsCode of Panel Build, Reserve Build, Alternate Build and
   Init Seats from pkgJFL/patched/ (plan_JFL.json gives each base_sha; Init Seats' base is the live node, the other three are pkgBAR finals).
Revert: the 6 nodes' old parameters (n8n first), then `jfl_revert.sql`.
Fix after run 33195 (Accept Models: "permission denied for table judge_fault_ledger"): apply `jfl_fix_anon.sql` to the live database
(jfl_block SECURITY DEFINER; jfl.sql now has it too), then check with `test_JFL_anon.sql` before the n8n part is written again.

What it does
- Every counted UNCURED judge item (kind cure or send_back; seat role panel, reserve or alternate; not RECORD-ONLY, TRIAL, "removes no seat" or
  "not counted") becomes a ledger row by trigger. A row that later turns CURED or record-only leaves the ledger unless it was struck.
- Counts are runs, not items, per judge model and fault kind (the item code). 3 runs: EXAMPLES. 6 runs (3 more after the examples start): ALTERNATE.
- EXAMPLES and on: Panel Build puts the model's block (up to 3 of its own past items of that kind, one from each of its latest 3 runs) first in
  its user turn. Reserve and Alternate Build strip the removed slot's block from the copied turn and put in their own seat's block.
- ALTERNATE: Init Seats moves the seat to the end of the panel order: no panel place, not the reserve, still in the alternate pool (openrouter
  seats only, as before; gemini, moved, would sit out). The panel never shrinks: if fewer than 3 unmoved seats remain, a moved seat fills it.
- Engine faults found by W3 grading: `SELECT jfl_strike(run, seat, kind, item_like, reason, grade_file);` (reason and grade file required).
- Debater faults (pkgBAR VOID, review_notes AUDIT v47) are not in the ledger: it reads debate_enforcer_log judge rows only.

Run report (what to read)
- `SELECT judge_model, fault_kind, runs, n_runs, state FROM jfl_report ORDER BY n_runs DESC;` (counts), and Init Seats json.jfl_moved (moves).
- `SELECT seat, api_model, jfl_move, jfl_block IS NOT NULL has_block FROM model_config_jfl WHERE active;` (who carries a block next run).

Known limit: the block holds the judge's own past lines, which quote debaters. A check that looks a judge's quote up in the whole prompt text
(gatePromptText2024, cureRounds) also sees the block. Round readers are unaffected (test C), since no block line starts a round header.
