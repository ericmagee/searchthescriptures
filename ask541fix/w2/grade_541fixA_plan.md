# W2 grade: 541 fix A plan rev 0 (W4, Wall 10881) + rev 0a (10889)
VERDICT: PASS WITH 3 CORRECTIONS (text only; no change to the build).
Checked:
1. measure541A.sql from W3 commit 87327c3b: md5 110d7d9f. Re-run (my run, 14:1x CST): since 541 (18:19Z): 52025, 52225 UNCURED->RECORD-ONLY; 51983 RECORD-ONLY->UNCURED. Exactly 3. Before 541: 369 UNCURED->RECORD-ONLY, of which 96 hold M4 " (RECORD-ONLY)" at the end of cure_reason (0 mid-text).
2. enforcer_status_stored live: md5(pg_get_functiondef) 53b69433 (the plan's figure); md5(prosrc) e2d530df.
3. Rows: 51983 sol E-ASSUME, tail "CURE (record-only until promoted): UNCURED ... (pkgACX, ASK 531)", holds "ENFORCED, pkgACX"; 51982 sol E-ASSUME CURED, holds it too, unchanged. 52025 sol E-GATE ends "(RECORD-ONLY)"; 52225 argon E-GATE ends "(RECORD-ONLY)". 52014 M1 RECORD-ONLY unchanged.
Corrections:
K1. "Before 541 it would change 371 (273 M1-M3 plus 98 M4)": measured 369 = 273 + 96. The 98 M4 rows of trace 10878 include 52025 and 52225, which are since 541.
K2. OBJECTIVE says "each stored enforcer row's status matches whether the engine counted it". E-APPLY rows read "not counted on this row; it goes to the E-GATE ... counted in drv_uncured" (32 rows, 1 since 541: 52069). The "counted in drv_uncured" guard keeps them UNCURED although the row itself is not counted. Name them out of scope (the gate row carries the count) or narrow the objective's wording.
K3. Readback C3 names which md5 it compares (functiondef 53b69433 now; prosrc e2d530df now).
