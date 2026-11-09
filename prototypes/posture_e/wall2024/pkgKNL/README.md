# pkgKNL: no K-F or K-CMT item on a FORCED line that grades nothing (W2, 11-09)

Source: W3 grade of run 34016 (Wall 3547, /mnt/project-files/w3/grade_34016.md, countermeasure 2).
Case: Haiku, seated as alternate for luna, wrote `FORCED: none graded.` The engine raised K-F FORCED (the line is not in the FORCED form) and K-CMT (a contested grade line with no commitment) on that line. Neither can be cured by a FORCED line, because nothing is graded.

Change, in every library file (30), three substitutions:
1. New function `knlNone2024(l)`: true when the line is `FORCED:` (with an optional `(Commitment N)`) followed by none, nil, n/a, no, nothing, zero or 0, and the rest names no `D<i> vs C<j>` pair and holds no quotation.
2. `kfLines`: a none line is skipped before the FORCED form check.
3. `kcmtGrade2024`: a none line is not a contested grade line.
A FORCED line that names a pair or quotes text is checked exactly as before.

Base: live s75, library strip_WLG (Shared Library ed1ec6fb07c0).
- Build: `node pkgKNL/build_KNL.cjs` -> pkgLIB/strip_KNL (30 files), plan_KNL.json.
- Pack: `LIB_N=30 node <abs>/pkgLIB/pack.cjs <abs>/pkgLIB/strip_KNL` from a scratch dir, moved to pkgLIB_KNL. Shared Library ed1ec6fb07c0 -> 5da9926cc6ec.
- E4 rebase: `FB=/mnt/project-files/wall2024/fetchback_live_s75.json node pkgLIB/e4_rebase.cjs pkgLIB_KNL`. Alternate Build a4058f4d0524 -> 5ee9191a9f05, Early Alternate Build 9d20eaf9deb4 -> 2c65cc7fe434; every stub rebuilds.

Tests:
- `node pkgKNL/probe_KNL.cjs`: 16 OK (probe_KNL.txt). Ten none forms raise nothing; five forms with a pair, a quotation or a real FORCED line raise the same items as before; Haiku's 34016 block goes from K-F 1 and K-CMT/K-CMTL 2 to 0.
- `node pkgKNL/test_KNL_lib.cjs`: replay of every saved run through the 30 library nodes, base vs patched (test_KNL_lib.txt).
