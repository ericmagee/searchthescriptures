# pkgRSA: a RESULT change that agrees with the derived result is applied (W3 grade_33197, gemini G2)

**Cause.** The cause is not the pkgSLA label list. sbApply2024 takes any CHANGE TO that starts "RESULT:" off the label path: `if(/^RESULT\s*:/i.test(to)){resTo=...;continue;}`. It then only compares that RESULT with the result derived from the corrected lines, and raises RESULT DIFFERS when the two differ. It never puts the change's sid in `applied` and never writes the line. So Gate Record's last branch (`cured=!now.has(key)&&(applied.has(gid)||st)`) read gemini's correct G2 as "the gate change was not applied". It counted in drv_uncured, and the seat was removed. 33197 is the first stored RESULT DIFFERS.

**Fix (3 edits in sbApply2024, identical in the 6 nodes).** When the judge's RESULT equals the derived result:
- the change is applied, so its sid goes into `applied`;
- the judge's own RESULT line replaces the old RESULT line.
When they differ, nothing changes: RESULT DIFFERS is raised and the change stays unapplied.

**Nodes.** Gate Build, Gate Record, Alt Gate Build, Alt Gate Record, Alternate Merge Seat and Alternate Merge. Bases are pkgFCB/patched, so this is written after pkgFCB. pkgKSC (W1) also edits these 6 nodes; the anchors are text-exact.

**Test.** `node pkgRSA/test_RSA.cjs` gives 10 OK.
- On the 33197 gemini shape, base leaves G2 unapplied, and pkgRSA applies it and writes "RESULT: UNDERDETERMINED -- ...".
- A RESULT change that still differs is unchanged from base (RESULT DIFFERS).
- A reason-only rewrite is applied.
- With no RESULT change, the output is byte-equal.

**Replay.** The 321 stored S and G items of 7 runs hold 3 RESULT changes, all send-back S items (33107 sol S9, 33129 sol S8, 33160 gemini S8). Each agreed with the derived result and is now counted applied, with the judge's line written. The result is unchanged in all three, and no other output changed.

**Revert.** Restore pkgRSA/base/.
