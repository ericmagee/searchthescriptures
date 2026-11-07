# pkgGSU: gate "superseded" taken from the apply step's own record (W3 ruling, Wall 2996)

**Fault (33490 gemini):**

- gemini's G1 answered the COLLISION line for D1 vs C1 with a COLLISION line (UNDERDETERMINED).
- G2 answered the FORCED line for the same pair with a COLLISION line as well.
- The apply step (sbApply2024) wrote G2 over both lines. Its own audit says "G2 replaces G1 on the same line (the last change wins)".
- gateCure2024 re-derived "same line" from the flagged line text (grpOf). It did not group G1 with G2, so it counted G1 as "the gate change was not applied".
- The same happened to G3/G4 and G5/G6. That gave 3 false UNCURED items and drv_uncured 12 where 9 was right.

**Change (the 6 gate nodes; library, so it ships as a LIB repack):**

1. sbApply2024 returns its replace record, `replace:[{sid, over:[...]}]`. This is the same data its audit prints, which until now existed only inside the step (W1, Wall 2999).
2. gateCure2024 takes "superseded" only from that record. grpOf is kept as the fallback for when R1 has no record.
3. A superseded item is CURED only when the winner was applied and the winner's change is for the same pair or label. A refused winner never cures it. When the winner is for another pair or label, the item takes the winner's cure status.

**Build and package:**

- Build: `node pkgGSU/build_GSU.cjs [base layer] [out]`. It defaults to pkgLIB/strip_KFN, the last layer of v13 (live), and writes the 6 changed files to pkgLIB/strip_GSU.
- Packed library: `pkgLIB_v13_GSU/`, which is v13 + GSU.
  - Shared Library: 67626dac3fbe -> 258b5d29ee12.
  - All 22 stubs rebuild byte for byte. The 16 other nodes rebuild exactly to their v13 sources.
- If LIB v14 (pkgKCR) is written first, restack with `node pkgGSU/build_GSU.cjs pkgLIB/strip_KCR/patched pkgLIB/strip_GSU_on_KCR/patched` and repack. KCR changes the same 6 files, so a plain layer on top would drop KCR's change.

**Node shas** (full source, stripped; base -> patched):

| Node | Base | Patched |
|---|---|---|
| Alt Gate Build | c46d602e7addf6d8 | da1bb06c92c5d4d8 |
| Alt Gate Record | 333f222de90a8f9c | 5c0acfffd7f0aa3c |
| Alternate Merge | ab4d340a9e07c3ea | 2d2a4579a47c4eb5 |
| Alternate Merge Seat | ff097093df9017eb | fb1493b73e0be63d |
| Gate Build | 97d664e37181147d | 75d96a51c300fb13 |
| Gate Record | f6292146659c9db8 | cf1e8a66765f82c1 |

**Test** (`node --max-old-space-size=8000 pkgGSU/test_GSU.cjs`, output in test_GSU.txt): 18 OK, 0 FAIL.

- 33490: gemini G1, G3 and G5 go UNCURED -> CURED; no other row changes. drv_uncured goes gemini 12 -> 9; chatgpt stays 0 and sol stays 1.
- Replay: 94 node runs over 28 runs; 2 outputs changed.
  - 33490 Gate Record changes as above.
  - 33222 Alt Gate Record: grok G1 and G2 were already CURED by grpOf. The same cure now comes from the apply record, and only the why text gains "(apply record; pkgGSU)".
- No item goes CURED -> UNCURED.
- Pre-existing errors on 33197, 33276, 33289, 33311 and 33322 are identical in base and patched.
