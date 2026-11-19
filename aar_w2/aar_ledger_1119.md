# AAR ledger 11-19 rev 1 (v221 recorded), ASKs 484 to 500 (W2, seat 32; drafted for W1's check and W3's AAR)
Read live from SQL at about 15:28 CST (21:28Z). Sources: ask_aar_snapshots (every row), ask_aar_grades_check(), engine_manual and operational_doc max version, pg_proc ACLs, debate_results, audit_log through 39256.
Live versions: engine manual v221 (21:18:02Z), op doc v137. No engine run since the 494 A2 write: debate_results newest is 19:44:35Z (run 40891); there are 0 rows after 20:51:24Z.
"Latest row" is the newest snapshot row for that ASK (its prior_row chain is shown). md5_match is as recorded by the insert trigger.

| ASK | What | Objective met (latest row) | Live state | Open item | Snapshot rows (latest first) | md5_match |
|---|---|---|---|---|---|---|
| 484 | sol62 verdict lost to a provider content filter | not yet | written and read back | a run that seats sol62 | 3 | true |
| 485 | reserve judge send-backs | not yet | written and read back | a run that seats a reserve | 4 | true (grades check: one-seat proof W1 on c6541680 and 32153f8d) |
| 486 | reserve draw (plan486_487.md) | not yet | written and read back | a run that draws a reserve | 7 | true |
| 487 | gemini_deb row (plan486_487.md) | not yet | written and read back | a run with gemini as debater | 8 | true |
| 488 | agreeing RESULT words decide the outcome | not yet | written (audit 38710) and read back | a run with agreeing RESULT words and split tags; op doc line | 11 | true |
| 489 | twin anon policies dropped | yes | written (audit 38718) and read back | op doc line only | 12 | true (grades check: ok false, n 1, 0fd91b1c) |
| 490 | transcript names each model | not yet | written (audit 38738) and read back | a transcript made after the write; op doc line | 13 | true |
| 491 | anon EXECUTE revoked on launch, expire, pick | in part | written (audit 38745) and read back; cron ran | a dashboard launch and an engine claim since the write; op doc line | 14 | true |
| 492 | debate_results direct anon INSERT closed | in part | written (audit 38761) and read back | a run that saves; op doc line | 15 | true |
| 493 | ASK AAR snapshots table | in part | live; manuals v218 and op doc v135 written | the first AAR report to the operator after these rows (row 28's reason) | 28 (prior 27, prior 19) | true |
| 494 A1 | engine save nodes on the "Supabase account" credential | in part, proven by run | live (engine d491f4a5); run 40891 proved service_role | none for A1 | 31 (prior 16) | false (build file 6eac56a9 has no grades; known finding) |
| 494 A2 | public key can no longer call the nine write functions | in part | live: anon EXECUTE on 0 of the nine (read now) | engine manual v221 written 21:18:02Z (c3c39ed3; guard 39257 card=NONE, W3 mistake 10098; readbacks W1 10099, W2 10101); open: op doc line; the next engine run saves with no 42501 | 32 | true |
| 495 | Oracle Hardening Test (Live Ask) unpublished | yes | inactive | op doc line only | 17 | true |
| 496 | Debate Findings Pipeline paused | yes | inactive, version 66f18454 | op doc line only | 26 (prior 18) | true |
| 497 | ASK AAR snapshot check | in part (this AAR's check makes it yes, per AAR rev 23) | live; manuals v219 and op doc v136 | none beyond this AAR | 29 | true |
| 498 | AAR grade count | in part | live; manuals v220 and op doc v137 | report the three grade count items in this AAR | 30 | true |
| 499 | ppj_put, ppj_status, ppj_get anon path | no row yet | NOT LIVE: anon holds EXECUTE on all 3 ppj functions (read now); plan 20b80b63 PASS (W2 10080, W1 10081); build rev 0 and run plan 5a689265 PASS (W1 10093, W2 10094) | the operator's approval and the A1 card; then the proving run, the test, A2; the A1 row draft ea44677a (Wall 10096) awaits grades | none | n/a |
| 500 | webhook authentication | no row yet | not planned; assigned by the coordinator 21:10:43Z; W4 facts at 10095 (Panel Judge Call webhook needs a header credential; the engine start webhook per W1 10092 N1 unchecked by me) | W3's plan | none | n/a |

Also in the table, outside 484 to 500: 481 (row 6, not yet), 482 (rows 9 and 10, in part), 483 (row 5, in part).
Grade count findings now (ask_aar_grades_check): 12 ok false n 1; 16 and 31 ok false n 0; the one-seat proof on 4. Every other row is ok true, n 2.
Test sequence ids that were never kept: 1 to 2, 20 to 25.
