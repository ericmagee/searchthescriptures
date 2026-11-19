# ASK 494 A2 proving-run plan, rev 1 (W4, seat 35, 11-19 ~12:25 CST), for grading by W2 and W3
rev 1 replaces rev 0 (1a35ddea): takes W3 9845 F1 to F3, N1, N2 and W2 9846 (No card on S3 and S6; N3). Content otherwise unchanged.

## 1. OBJECTIVE
Prove that ASK 494 A1 (engine d491f4a5: the 11 write nodes moved to the "Supabase account" credential) saves a full run as service_role. Then remove EXECUTE on the 9 engine write functions from PUBLIC, anon and authenticated (A2, step494.sql fc32cec9).
Expected effect: after A2, the public key can no longer write a debate row, judgment or outcome through any RPC, and every engine run still saves.

## 2. ROLES
Planner and writer W4. Graders W2 and W3. The run needs the operator's explicit release (a run is never released by an ambiguous word). The A2 write needs W4's card, pressed in W4's thread. Readback by two non-writers.

## 3. SCOPE
SEARCH (read 11-19 ~12:20 CST): the A1 fetchback (engine d491f4a5: the 11 write nodes on "Supabase account", the 44 read nodes on "Supabase Anon Key", no node-level headers); debate_results.call_costs of the last four ORACLE_DEBATE_V1 runs (all this pair); the md5s of step494.sql, revert494.sql and test494_rollback.sql; plan494 SEARCH items 1 to 7; the ASK 491 step (step491.sql 7074eb34). NOT SEARCHED: the Cure Call and SX4Z node text (unreadable by n8n MCP); P3 and P6 cover them.
The run: one live run of the current engine, d491f4a5. No change to the engine for the run.
LAUNCH PATH (W3 N1): W4 POSTs the run body straight to the n8n webhook https://truthapp.app.n8n.cloud/webhook/oracle-debate-v1, after the runstart.py GO check, exactly as run 440 was started (15:43:27Z). The body is run 440's body, body_spark_oracle_def_gemini.json (sha256 53763d9544a6, md5 53b744a9), copied to this folder. ASK 491 revoked anon and authenticated EXECUTE on dash_launch_debate, debate_queue_expire_stale and pick_next_debate_job only. This path calls none of them: it is a webhook POST to n8n, not a database call, and the engine does not call those three (plan491 SEARCH). dash_launch_odv1 (the dashboard's launch) was not touched by 491 either.
The pair: the same as run 440 (ODV1-40781): spark as The Oracle defends, gemini (plain) challenges, topic "Did Christ have a biological father?".
What else the run proves, and when (W3 N2):
- 486 (haiku last): always, from Init Seats (reserve and alternates order).
- 487 (gemini debater on gemini-4-hydrogen): always, from the challenger's model in the row.
- 490 (transcript names): always, from the Drive transcript and its file name.
- 492 (direct insert closed): always, since the row saves through the RPC.
- 484 (sol62 not on Azure): only if sol62 is seated (it is in the expected panel chatgpt, sol, sol62) and is called.
- 485 (reserve gets send-backs): only if the reserve is seated and a send-back occurs.
- 488 (agreeing RESULT words): only if the counted words agree while the tags split.
COST: the last four runs of this pair cost 1.73, 2.25, 4.03 and 3.55 USD (debate_results.call_costs). ASK 487 doubled the gemini debater's token price (0.75/3.75 to 1.50/7.50 USD per million), so expect about 2 to 5 USD for the run. The rolled-back test and A2 cost nothing.
The A2 step: step494.sql (fc32cec9), unchanged. Revert: revert494.sql (dfcfdd2f).

## 4. CRITERIA and DONE
P1. The run ends and its debate_results row exists, with run_token, outcome and the three panel judgments (record_debate_judgment), the tokens row (record_debate_row_tokens) and derive_debate_outcome applied.
P2. Supabase API (edge) logs for the run window, read by request path, JWT role and user agent only (no key value), show role service_role on every call the run makes to: rpc/record_debate_row, rpc/record_debate_row_tokens, rpc/record_debate_judgment, rpc/derive_debate_outcome, and on rpc/record_enforcer_log, rpc/odv1_record_panel_substitution and rpc/odv1_record_panel_alternates if the run calls them.
P3. In the same window, no call to any of the 9 functions comes with JWT role anon from user agent n8n.
P4. The n8n execution shows no 401, 403 or 42501 on any of the 11 write nodes.
P5. Reads still work: the read nodes on "Supabase Anon Key" return data (the run reaches its end).
P6 (W2 N3). Before the A2 card: the edge logs over the whole retained window show no anon call to any of the 9 functions other than the engine's own calls before A1 (16:05:44Z and earlier). This covers the Cure Call and SX4Z if they ran in the window at all.
If P1 to P5 hold: A1 is proven. If any write node shows anon or fails: no A2; revert A1 by writing back fetchback_a490_engine.json (533f77a1), on the operator's word.
Then, before the A2 card: test494_rollback.sql (b6f77465) passes in full (C1, T1 to T6, R1), on the operator's approval prompt.
DONE: step494.sql's closing checks pass, the audit row is written, two non-writers read it back, and the next run after A2 saves with no 42501.

## 5. WRONG-IF
1. The "Supabase account" credential does not carry service_role. P2 shows another role. Then no A2, and A1 is reverted or re-pointed.
2. A write path not in the 11 nodes (the Cure Call c7366RPLb8vdMQg6, or the SX4Z workflow, which n8n MCP cannot read) calls one of the 9 as anon. P3 and P6 show it as anon from n8n. Then A2 waits until that path moves too.
3. The run fails before any save for an unrelated reason (a model or provider error). Then the run proves nothing about A1, and another run is needed.

## 6. RUN EVIDENCE
The proving run itself, read by P1 to P5: the debate_results row and judgments by run_token; the Supabase API edge logs by path, JWT role and user agent only; the n8n execution's node statuses. P6 over the retained window before the A2 card. After A2, the next run's save with no 42501. No new ASK 417 registry case: this is a log read by path and role only.

## 7. INPUTS IN GIT
This plan, the run body (body_spark_oracle_def_gemini.json) and the A1 build (target_engine_494a1.json 6eac56a9, build494a1.py beaa8a46) at a494_w4/ on branch claude/untitled-9jle0o; the commit is named on the Wall. plan494.md (b57c4b09), step494.sql (fc32cec9), revert494.sql (dfcfdd2f) and test494_rollback.sql (b6f77465) are at a494_w2/ (commit 9f2f486a and later). Copies in /mnt/project-files/ask494/ and /mnt/project-files/ask494/w4/.

## 8. STEPS
S1 W2 and W3 grade this plan. No card.
S2 The operator releases the run (explicit words). W4 runs runstart.py, then POSTs the body to the webhook. Waits on the operator's release.
S3 W4 reads P1 to P5 and posts them on the Wall; two non-writers check them. No card.
S4 W4 reads P6. Then the rolled-back test, on the operator's approval prompt (W4 tells the operator first).
S5 The A2 card in W4's thread; on the press, step494.sql via apply_migration with SET LOCAL session and card. Waits on W4's card.
S6 Two non-writer readbacks. The next run after A2 proves no 42501. No card.
