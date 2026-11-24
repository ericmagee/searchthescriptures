# ASK 591 build notes, rev 0 (W4, 2026-11-24)

Plan: ask591/w3/plan591.md rev 4 (W1 PASS). LIVE use (ruling 512); the tests below are proof before the write.

## Files
- b1/mig591.sql adbadc73 (rev 1: W1 F2 fix, the recorder-list check ignores comments): tables odv1_judge_order and odv1_judge_order_log (seeded from live ORDER0/__ALT); odv1_judge_order_lists, _fault, _read (service_role, lab_seat), _save; dash_judge_order; dash_judge_lineup; dash_api actions judge_order, judge_order_save, judge_lineup.
- b1/build591.cjs 761b21b7: engine only. New node "Judge Order Read" (HTTP 4.3, rpc odv1_judge_order_read, the credential of Write Tokens, executeOnce, retry 3, no onError) between each start path (Library Check, Dry Run Config) and Accept Models. Accept Build ORDER, Init Seats ORDER0 and __ALT come from it; Init Seats output gains judge_order; Build Save Body adds one review_notes line "[JUDGE ORDER v<n>: panel list ...; alternates list ... | SEATED: panel ...; reserve ...; alternates ...; single judge ...]". Child untouched.
- Targets: b1/target_engine_591.json (on J2 live) and b1/onj3/target_engine_591_onj3.json (on J3-on-J2, if J3 is written first).
- write/write591.sh 3f8be5a8 (bases C and D; run gate; tests at write; PUT engine only; fetch back; child-untouched check). write/revert591.sql bbff66e6.
- dash/judge591.js 7a2bbdd7 (new tab "Judge order"), dash/patch.js e7454625 (loads it after odv1.js), dash/odv1.js 4f3935d8 (haiku out of the static fallback list ODV1_PICK, completing ASK 593 on the page). Base: the live production files (dash_live/, byte-equal to repo a482_w1).

## Tests
- t591.cjs 62af78eb, ALL PASS 8 on both bases (b1/out_t591.txt, onj3/out_t591_onj3.txt): T1 seeded order = live Init Seats output in 360 cases; T2.js 1800 expected line-ups; T4.1-T4.4 the read stands before every HTTP call, Accept Build and Init Seats on both start paths, and a missing or bad read stops both code nodes; T5 the review line; T6 only the four named nodes change, 422 -> 423 nodes.
- Standing set 29/29 and pair PASS on both bases (LIB unchanged).
- T2.sql (b1/t2_sql.sql 88966caf, built from mig591's own function text with the order given): 1800 of 1800 equal to the JS line-ups; md5 per order seeded 44da6194, alt_into_panel 9f14dd42, panel_to_alt 9ab0532e, reversed 745400e9, sonnet_first 3f260513. FAULT FOUND AND FIXED: bothc was NULL when a debater is outside FAM (mimo), which seated sonnet against claude/opus (32 cases); missing families now read as '' as Resolve Seats does.
- T3 (temp tables only; b1/out_t3_sql.txt): run 08:41 CST on the operator's "send again": 16 of 16 meaningful cases PASS; case 9 was a bad case (luna is on the list), stated in the file.
- T7: mock-data render only (dash/mock_shots/), no page errors, no sideways scroll at 390 px; the real screenshots after the write.

## Deviation for W1
- S7 says at least FOUR active panel seats; the build uses THREE, because the seed (live order) has three panel seats. Four would refuse the live order.

## W1 grade (Wall 11540, PASS WITH F1, F2)
- F1, stated: the save REFUSES any seat that is not on the reserve recorder's list, where plan L3 said to warn on seeded pairs. With ASK 594 live, the recorder names all eight seats, so the seed passes; a new seat needs the recorder's list first.
- F2, fixed: the list check matched quoted names anywhere in the recorder's text, comments too. It now strips -- and /* */ comments first (T3 cases 16, 17).

## Order of the writes (three cards)
1. Migration (SQL, one call). 2. Engine (write591.sh) right after, on the migration's readback. 3. Dashboard deploy.
- Writing the engine on base C makes the J3 write script refuse; J3 is then re-cut on 591 (or J3 goes first and base D is used).

## Written live (2026-11-24, card "Write all three", 14:51 UTC)
- Database: mig591.sql adbadc73 applied; odv1_judge_order seeded (version 1); dash_api 9888582a -> a866c092.
- Engine: 489b977b -> 347f3e21 (423 nodes); child e086bb3a untouched; LIB b243080d9bd0b10c. At write: t591 8 PASS, standing 29/29, pair PASS; fetch-back equals target (write/fetchback_eng591.json).
- Dashboard: production dpl_F4JdWAFWSHCAodqrBa4MtnkpwDA9 -> dpl_GfY2EAHyqufMAeza4eBTW6z6jGhm (judge591.js added, patch.js, odv1.js).
- T7 real screenshots: dash/t7_order_and_lineup_chatgpt_claude.png, dash/t7_lineup_sol62_gemini.png.
- Audit 41446; Wall 11543. Revert: write/revert591.sql, write/revert_eng591.json, dashboard back to F4Jd.
- Open: W1 readback; first live run shows the [JUDGE ORDER v1] review line. J3 write script (base C) now refuses: re-cut on 347f3e21.
