# ASK 440 run: readiness addendum to readiness_v2.md (W1, 2026-11-19 ~14:20Z, coordinator order)

readiness_v2.md (a_ready_w2, rev 1 a5779188) was written for engine c1256eec. Items 1 to 15 still apply. This adds the state after the writes of 11-19.

## A. What the run needs to start
1. The operator's explicit run release (one press). A one-word reply is not a release.
2. Write chain settled. Live now: engine 5c0f00ab, child b10fcad2, library 56c66d536f088f5d (ASK 474, read back MATCH by W1 9427 and W2 9426).
   Still to decide before the release: ASK 473 (rebuild 2f02e0df, two passes; card needs the operator's own words) and ASK 475 (rev 1, two passes; rebuild on the chain head after 473).
   If either is written, the run's versions move and runstart.py takes the new ids. ASK 476 is advised HOLD and is not in the run.
3. tools/runstart.py GO, live, at start, quoted in the run-start post (ASK 446). Offline on W1's fetch of 5c0f00ab / b10fcad2 with body_39266 (sha 53763d9544a6) and no running executions: GO, all 15 checks ok (map_sha 436cfc54cf8cc781).
4. The body. The released body of 39266 is a419_w4/plants/body_39266.json: defender spark/oracle, challenger gemini/plain, topic "Did Christ have a biological father?". The operator confirms or names another body; the sha prefix goes on the release.
5. Engine manual v206 (468, 470, 472 entries) written and read back, so the manual matches the engine the run uses (preview MATCH W1 9433, W2 9432).

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
| 473 (if written) | engine, library | request bodies carry session_id, the MiMo and google/qwen forms as before |
| 475 (if written) | engine B rounds | B rounds record lay_check as before, no "pkgLAYB:" error |
Not run-tested: 462 (Wall check, DB), 463 (tools), 465 (op doc), 448 to 451 (Wall guard).

## C. Live but never run-validated (from before 11-19; readiness_v2 items and W3 9270 A)
1. Live after 39266 (11-18 evening): 422(c) KV_EXCL; 423 LINK <n> labels and AUDIT v27; 424 one link head; 422(a) child load check (UNEXERCISED unless a second alternate pass runs).
2. Live before 39266 but NO CASE in it: 374 step 2, 376, 394 s11, 399/402, 406.
3. Live 11-19 early: 443 Library Check, 444 A2 comments stripped, 454, 455 A to C ENFORCER labels, 456 stubs name every node.
Each is marked EXERCISED and clean, EXERCISED with an issue, or UNEXERCISED, with its evidence row, by two non-builder graders after the run.

## D. After the run
W4 reports the anchor; two non-builder seats grade every row in B and C; every seat posts one review reply; the coordinator sends the AAR. Then the transcript work.
