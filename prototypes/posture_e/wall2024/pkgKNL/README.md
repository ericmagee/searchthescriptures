# pkgKNL: no K-F or K-CMT item on a FORCED line that grades nothing (W2, 11-09)

Source: W3 grade of run 34016 (Wall 3547, /mnt/project-files/w3/grade_34016.md, countermeasure 2).
Case: Haiku, seated as alternate for luna, wrote `FORCED: none graded.` The engine raised K-F FORCED (the line is not in the FORCED form) and K-CMT (a contested grade line with no commitment) on that line. Neither can be cured by a FORCED line, because nothing is graded.

Change, in every library file (30), three substitutions:
1. New function `knlNone2024(l)` (rev 3, an allow-list per W3's grade, Wall 3576): true only when the line is `FORCED:` (with an optional `(Commitment N)`) followed by none, nil, n/a, no, nothing, zero or 0, alone or with a short tail (graded, forced, link(s) (is/are) (graded) forced), a full stop, or `(Commitment N)`. Any other text after the none word is checked exactly as before.
2. `kfLines`: a none line is skipped before the FORCED form check.
3. `kcmtGrade2024`: a none line is not a contested grade line.
Rev 1 and rev 2 used a refuse list, and each grade found a new phrasing that leaked (W1 3561, W3 3576, W4 3566); rev 3 allows only the listed forms.

Base: live s76, library strip_CJR_KRC (s75 + pkgCJR + pkgKRC, Shared Library 3f7270edaa30); non-library nodes are not touched.
- Build: `node pkgKNL/build_KNL.cjs` -> pkgLIB/strip_KNL (30 files), plan_KNL.json.
- Pack: `LIB_N=30 node <abs>/pkgLIB/pack.cjs <abs>/pkgLIB/strip_KNL` from a scratch dir, moved to pkgLIB_KNL. Shared Library 3f7270edaa30 -> a448a51f81bb (rev 3).
- E4 rebase: `FB=/mnt/project-files/wall2024/fetchback_live_s76.json node pkgLIB/e4_rebase.cjs pkgLIB_KNL`. Alternate Build 41b3cf29df15 -> 310bbca80bea, Early Alternate Build a5ef4e930887 -> 362010125c1e; every stub rebuilds.

Tests:
- `node pkgKNL/probe_KNL.cjs`: 30 OK (probe_KNL.txt), including W1's five lines, W3's three (3576) and three more allowed forms; Haiku's 34016 block goes from K-F 1 and K-CMT/K-CMTL 2 to 0.
- `node pkgKNL/probe_KNL_w4.cjs pkgLIB/strip_KNL` (W4's probe, Wall 3584): 33 OK (11 must-skip, 22 must-check).
- `node pkgKNL/test_KNL_lib.cjs`: replay of every saved run, strip_CJR_KRC vs strip_KNL (test_KNL_lib.txt): 686 node runs over 46 runs, 686 byte-equal, 0 items changed, 0 cure flips.
