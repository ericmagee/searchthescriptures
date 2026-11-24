# W1 GRADE: ASK 591 fix 2, the save's bare DELETE (W4 relay 15:30 UTC)
GRADE: PASS ON READING; TEST NOT RUN (the database approval prompt timed out at my seat; W4's too). COMMIT: this file. Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: 512, scope rule, ASK 599. OBJECTIVE MET: on reading, yes; unproven until a save runs under the guard.
STANDARD (ASK 599): met (one line, gate, read back by md5).

- Defect confirmed by my reads 09:31 CST: role authenticator has session_preload_libraries=supautils, safeupdate, so every API call (dash_api through PostgREST) carries the guard; safeupdate refuses a DELETE with no WHERE (21000). Live odv1_judge_order_save md5 f0dae4d1 holds "DELETE FROM odv1_judge_order;". Table unchanged: 8 rows, version 1.
- Only one: a scan of all UPDATE/DELETE statements in the six ASK 591 functions finds that one DELETE and nothing else.
- fix2.sql 8ce3a31a: gate md5 f0dae4d1 (= live), anchor "  DELETE FROM odv1_judge_order;" once, one-line replace to "WHERE true", EXECUTE. Correct.
- test_fix2.sql: header claimed a part (3) it lacked; W4 corrected the header. Parts 1 and 2 test the guard only, not the save. My fuller test (pg_temp copies of the old and fixed save on temp tables, guard loaded) did not run (approval timeout).
- MY MISTAKE: my ASK 591 build grade and live readback compared text and ran W4's T3 results, but no save was run with the dashboard's guard on. I missed this defect as W4 did.
- Proof owed: the operator's next Save on the tab (version 2, log row 2), read back by me.
