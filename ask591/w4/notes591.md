# ASK 591 build notes, rev 0 (W4, 2026-11-24)

Plan: ask591/w3/plan591.md rev 4 (W1 PASS). LIVE use (ruling 512); the tests below are proof before the write.

## Files
- b1/mig591.sql 4cb26b1b: tables odv1_judge_order and odv1_judge_order_log (seeded from live ORDER0/__ALT); odv1_judge_order_lists, _fault, _read (service_role, lab_seat), _save; dash_judge_order; dash_judge_lineup; dash_api actions judge_order, judge_order_save, judge_lineup.
- b1/build591.cjs 761b21b7: engine only. New node "Judge Order Read" (HTTP 4.3, rpc odv1_judge_order_read, the credential of Write Tokens, executeOnce, retry 3, no onError) between each start path (Library Check, Dry Run Config) and Accept Models. Accept Build ORDER, Init Seats ORDER0 and __ALT come from it; Init Seats output gains judge_order; Build Save Body adds one review_notes line "[JUDGE ORDER v<n>: panel list ...; alternates list ... | SEATED: panel ...; reserve ...; alternates ...; single judge ...]". Child untouched.
- Targets: b1/target_engine_591.json (on J2 live) and b1/onj3/target_engine_591_onj3.json (on J3-on-J2, if J3 is written first).
- write/write591.sh 3f8be5a8 (bases C and D; run gate; tests at write; PUT engine only; fetch back; child-untouched check). write/revert591.sql bbff66e6.
- dash/judge591.js 7a2bbdd7 (new tab "Judge order"), dash/patch.js e7454625 (loads it after odv1.js), dash/odv1.js 4f3935d8 (haiku out of the static fallback list ODV1_PICK, completing ASK 593 on the page). Base: the live production files (dash_live/, byte-equal to repo a482_w1).

## Tests
- t591.cjs 62af78eb, ALL PASS 8 on both bases (b1/out_t591.txt, onj3/out_t591_onj3.txt): T1 seeded order = live Init Seats output in 360 cases; T2.js 1800 expected line-ups; T4.1-T4.4 the read stands before every HTTP call, Accept Build and Init Seats on both start paths, and a missing or bad read stops both code nodes; T5 the review line; T6 only the four named nodes change, 422 -> 423 nodes.
- Standing set 29/29 and pair PASS on both bases (LIB unchanged).
- T2.sql (b1/t2_sql.sql 88966caf, built from mig591's own function text with the order given): 1800 of 1800 equal to the JS line-ups; md5 per order seeded 44da6194, alt_into_panel 9f14dd42, panel_to_alt 9ab0532e, reversed 745400e9, sonnet_first 3f260513. FAULT FOUND AND FIXED: bothc was NULL when a debater is outside FAM (mimo), which seated sonnet against claude/opus (32 cases); missing families now read as '' as Resolve Seats does.
- T3 (b1/t3_sql.sql 0b2ea1bb, temp tables only): NOT RUN. The database tool's approval prompt timed out (08:29 CST); waits on the operator.
- T7: mock-data render only (dash/mock_shots/), no page errors, no sideways scroll at 390 px; the real screenshots after the write.

## Deviation for W1
- S7 says at least FOUR active panel seats; the build uses THREE, because the seed (live order) has three panel seats. Four would refuse the live order.

## Order of the writes (three cards)
1. Migration (SQL, one call). 2. Engine (write591.sh) right after, on the migration's readback. 3. Dashboard deploy.
- Writing the engine on base C makes the J3 write script refuse; J3 is then re-cut on 591 (or J3 goes first and base D is used).
