# ASK 440 run: readiness addendum to readiness_v2.md (W1, 2026-11-19, rev 4 15:40Z: 466 step 1 and step 2, 477, 479 and 480 live; v209 to v211; runstart must be re-run after the last write)

readiness_v2.md (a_ready_w2, rev 1 a5779188) was written for engine c1256eec. Items 1 to 15 still apply. This adds the state after the writes of 11-19.

## A. What the run needs to start
1. The operator's explicit run release (one press). A one-word reply is not a release.
2. Write chain settled. Live now: engine e0a61271, child 4982c042, library 8bd8d2a7dc9d2ed0 (ASK 475, card 14:15:56Z 11-19, from 5c0f00ab / b10fcad2; read back MATCH by W1 and W2 9442).
   ASK 473 is HELD by the operator (card "Hold", 14:14:09Z 11-19): not in the run.
   ASK 476 is HELD by the operator (card "Hold (team advice)", 14:29:51Z 11-19): not in the run.
   Written since rev 3 (all 11-19; none changes a node of the engine, the child or the library):
   a. ASK 466 step 1 (log_override_arming and the audit_log grants; live 15:00:22Z; readback W1 9515). The run path calls 15 SECURITY DEFINER RPCs that anon can still execute, and every direct table use on it is a GET, so step 1 removes nothing a run uses (W4 9542 item 2).
   b. ASK 466 step 2 (card "ASK 466 step 2 Write it" 15:23:58Z), written in order: 2a 15:24:42 to 15:24:47Z (the audit nodes of Daily Drive Sync, Orphan Tables Snapshot and SQL Snapshot use the native Supabase credential; audit 38344 to 38346); 2b 15:25:02Z (tools/audit_row.py takes SUPABASE_SERVICE_KEY from env only, commit 30f6d867); 2c 15:25:14Z (anon and authenticated lose EXECUTE on log_audit_event, complete_session_close, complete_security_check; audit 38349). Read back MATCH by W1 9562. The engine e0a61271 calls 13 RPCs and none of the three (W1 9562); the cure and panel sub-workflows rest on W4 9542.
   c. ASK 477 (card fields carry card, session and from; guards 0b132fde and 625ab111). Not on the run path.
   d. ASK 479 (model_config deepseek and deepseek_debate inactive, 15:16Z). Resolve Seats' deepseek field now always takes the luna row: shown on this run (item 11, 455 (a)).
   e. ASK 480 (12 direct-DeepSeek workflows unpublished, 15:22Z). None is on the run path; engine moMxiV4Irg1uRBZN, ODV1 Alternate Pass and ODV1 Cure Call read active (W2 9556 item 3).
3. tools/runstart.py GO, live, at start, quoted in the run-start post (ASK 446). Re-run after any further write. Last live GO: after 466 step 1 (W4 9542, a440_w4/runstart_live_after466s1.txt, commit f457d4d1). It must be run again now that 466 step 2 is written (15:25:14Z), since 479, 480 and 466 step 2 were written after it (runstart does not read model_config, W4 9542 item 3, so 479 is not expected to change it). Offline on the live e0a61271 / 4982c042 with body_39266 (sha 53763d9544a6): GO (W1; W2 9444, map_sha 1b07df73d8db134d, was 436cfc54 on 5c0f00ab). Live, after 475 (W4 9457 A, a440_w4/runstart_live_after475.txt): GO, exit 0, nothing running in the engine. It must still be run again live at start.
4. The body. The released body of 39266 is a419_w4/plants/body_39266.json: defender spark/oracle, challenger gemini/plain, topic "Did Christ have a biological father?". The operator confirms or names another body; the sha prefix goes on the release.
5. Engine manual: v208 (ASK 475) MET (id 212, ce61eb07). Since then v209 (ASK 477, id 215, 1f68f096, MATCH W1 9526), v210 (ASK 479, id 216, cc9803a6, MATCH W1 9557, W2 9553), v211 (ASK 480, id 217, 862728db, card 15:25:19Z, MATCH W2 9561, W1 9562). Op doc v131 (ASK 477, 1e33a8cc); v132 (ASK 480, preview b4bcd355) waits on its card and does not bear on the run. The manual matches the live engine: MET.

## B. Changes written 11-19 that this run is the first to test (mark per change)
| ASK | Live in | What the run shows |
|---|---|---|
| 455 D | engine | the 22 renamed enforcer steps run; Assume Check Record, Judge Enforcer Record, Close Enforcer Record hold their rows (readiness item 13) |
| 458 | engine, child | no missing-node error; no Provider Removed Stop |
| 459 | ODV1 Cure Call c7366 | no deepseek call in the cure sub-workflow; any deepseek route fails closed |
| 460, 461 | Panel Judge Call Y1VI | only the openrouter path is called; no FAIL-CLOSED reply unless a seat routes elsewhere |
| 464 | c7366, Y1VI, SX4Z | the three sub-workflows run with comments stripped; no syntax error |
| 468 | engine B rounds | a B-round bar record holds layers.first on a pass |
| 470 | engine Alternate Merge | an [AUDIT v54 ...] item "is graded BROKEN on the pair", or none (TRIAL) |
| 472 | library | an E-APPLY not-applied record in the new words; drv_uncured count unchanged |
| 474 | library | if a send-back runs: sb_rows read CONCEDED LINKS as the gate nodes do |
| 475 | engine B rounds, library LAY entry | B rounds record lay_check as before, no "pkgLAYB:" error |
| 479 | model_config | Resolve Seats deepseek.api_model = openai/gpt-6-luna (check_exec.py "455 (a) VERDICT", commit e556fa56); no deepseek in call_costs (runval item 25) |
| 466 step 1 | DB | the run's audit and debate_results writes succeed (no permission error in the run's execution or audit_log) |
Not run-tested: 462 (Wall check, DB), 463 (tools), 465 (op doc), 448 to 451 (Wall guard), 477 (card fields), 480 (unpublished workflows; off the run path), 466 step 2 (n8n audit nodes on their own schedules; first proof is the next Daily Drive Sync, about 07:00Z 11-20).

## C. Live but never run-validated (from before 11-19; readiness_v2 items and W3 9270 A)
1. Live after 39266 (11-18 evening): 422(c) KV_EXCL; 423 LINK <n> labels and AUDIT v27; 424 one link head; 422(a) child load check (UNEXERCISED unless a second alternate pass runs).
2. Live before 39266 but NO CASE in it: 374 step 2, 376, 394 s11, 399/402, 406.
3. Live 11-19 early: 443 Library Check, 444 A2 comments stripped, 454, 455 A to C ENFORCER labels, 456 stubs name every node.
Each is marked EXERCISED and clean, EXERCISED with an issue, or UNEXERCISED, with its evidence row, by two non-builder graders after the run.

## D. After the run
W4 reports the anchor; two non-builder seats grade every row in B and C; every seat posts one review reply; the coordinator sends the AAR. Then the transcript work.
