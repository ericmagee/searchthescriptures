# W2 grade: pkgBFX plan rev 0 (W1, Wall 10875, askbfx/w1/plan_bfx.md md5 9d732d93)
VERDICT: PASS WITH 2 CONDITIONS.
Checked:
1. Plan md5 9d732d93 from origin/claude/untitled-9jle0o.
2. fetchback_engine_533.json md5 27230ba8 = versionId 5a2b6a75 (18:50:35Z); child bebabd7a = 160a67e3. Library sha 92e0439c65b287f9 both, LIB arrays equal (3566 entries).
3. "has premises 1 to": Shared Library only, engine and child; LIB index 466 (plan's line 467, 1-based). lbBlockText at 1-based 467, 479, 768 (def), 1233, 1390, 2935: matches. bfx544: 0 hits.
4. lbBlockText heading regex is LINK\s+(\d+) and picks the j-th heading by position; "LINK none" is skipped. Confirmed.
5. Headings (SQL on engine_r3): 41090: LINK 5 [p1], LINK 5 [p2], LINK 4, LINK 2, LINK none [p5], LINK none [p6]; 41736: LINK 5, LINK 4 [p2], LINK 4 [p3], LINK 3 [p4], LINK 2 [p5], LINK none [p6]. engine_r2 PREMISE COUNT: 6 on both.
6. Population SQL re-run: judgments 1251, 1252 (41090, "1 to 4", premise 5), 1266, 1267 (41736, "1 to 5", premise 6); r3_none true on all 4. Enforcer K-UNX range rows: 47895, 47896, 47903, 47915, 47916, 51726, 51739, 52062 = 8, all on runs 41090/41736.
7. The change can only remove RANGE items (more headings found); C2 plant guards the real out-of-list case.
Conditions:
C-A. MAP: line 466 is in the p list of 15 stub nodes (Alt Gate Build, Alt Gate Record, Alternate Merge Seat, Alternate Payloads, Extract Independent Verdict, Gate Build, Gate Record, Panel Payloads, R2 Alt Gate Build, R2 Alt Gate Record, R2 Alternate Merge Seat, R2 Alternate Payloads, Late Gate Build, Alt Late Gate Build, R2 Alt Late Gate Build). The new helper line must be added to all 15 p lists, and any later indices shifted if it is inserted mid-library. "MAP n recomputed" does not say this. C3 must show each of the 15 rebuilt stubs defines bfx544Block (a missing helper is a runtime ReferenceError, not a compile error).
C-B. Build base: the fetchback is from 12:50 CST. Step 2 builds on a fresh live readback taken at build time, and names it, since 541 fix A (Wall 10881) and the close enforcer plan (10877) may write the same library first.
Note: the helper name uses 544 while the ASK number is pending; rename if the coordinator assigns another number.
