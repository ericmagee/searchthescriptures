# pkgRP10: reader phase 2, item 10 (W4; W3 order /mnt/project-files/w3/reader_p2_order.md, Tier 2)

The E-COL reads of FORCED and collision lines in the three DeepSeek Judge Enforcer Build nodes ask the shared reader first.
- `__ecfColl` (which lines become E-COL items): a reader FORCED line, or a reader COLLISION line whose GRADE holds LINK BROKEN. Before, a label regex plus "LINK BROKEN" anywhere on the line.
- `__ecpK` (the pair key that ties a LINK BROKEN item to the same judge's FORCED line, pkgECP): the reader's pair.
- `__ecpOf` and the item's grade/req label: the reader's form (FORCED or not).
- A line the reader refuses, or a RESTATED wrapper, keeps the old read (as pkgSBX/pkgACM did), so no line is lost.
- The reader is the same embedded text Send Back Build carries (pkgSBX/pkgACM), copied by the build from live; reader block sha in plan_RP10.json.

Nodes (base live s63 df871acd; shas in plan_RP10.json): Judge Enforcer Build 1b91af370950 -> dbd238022bee; Alt Judge Enforcer Build 11880d7711c1 -> 5509af1d4d84; R2 Alt Judge Enforcer Build b83d7d8cf7f0 -> 4acb22d227a0.
Not in this item: failsNote and efgCheck (item 9, W1).

Test (`node --max-old-space-size=8000 pkgRP10/test_RP10.cjs`, test_RP10.txt): live vs patched on every saved run.
- Judge Enforcer Build: 58 runs, 58 byte-equal (8 older runs skipped: the live node itself throws on their saved inputs).
- Alt Judge Enforcer Build: 29 runs, 29 byte-equal.
- R2 Alt Judge Enforcer Build has no saved run (round 2 has never fired); its edit is the same 8 anchored replacements.
- Behaviour changes on the corpus: none. Lines that would change if they occurred: a COLLISION line whose grade is not LINK BROKEN but whose reason mentions it (old: an E-COL item; new: none).

Rebuild: node pkgRP10/build_RP10.cjs [fetchback]. Revert: restore the 3 nodes from the prewrite copy.

## Rebuilt on s64 (W4, 11:20 CST 11-08, for W3 3254 STACK HOLD)
Base is now fetchback_live_s64 (pkgOOS JEB nodes: ef5238330d13, 956ccd0b2d2d, 040c7ca1ad61). See plan_RP10.json for new shas. test_RP10: JEB 60 runs, Alt 30 runs, all byte-equal, TOTAL 2 OK, 0 FAIL.
