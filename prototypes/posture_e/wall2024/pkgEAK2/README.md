# pkgEAK2 (W2, 11-08; W3 3121): the seated alternate's DeepSeek K-W check runs even when the build would skip

DeepSeek enforcer fix. One node: Alt Judge Enforcer Build.

Cause: pkgEAK appended `eakItems2024()` at the end of Alt Judge Enforcer Build. Two early returns come before it:
`skip('no panel judgment text')` (the seated alternate's text is not in Panel Cure Check bodies) and the
`je_skip 'no judge decision line and no synthesis claim was read'`. In 33430 (13 rows) and 33497 (24 rows) the first one fired,
so the alternate's K-W and K-S3 cure answers never reached DeepSeek.

Change:
- `eakHas2024()`: true when Alternate Merge Seat's enforcer_log holds a cure row of the seated alternate on K-W or K-S3.
- Both early skips hold only when `eakHas2024()` is false.
- The final return carries the build's code_rows on the K-W call when it is the only call, and falls back to the skip item if nothing is built (never an empty output).

Base: pkgEHF/patched/Alt_Judge_Enforcer_Build.js (5bb9b1a348f2 = live s59 e80c75967029 + EHF, graded PASS by W3 3132). Patched 8758f27fb673.
Without EHF: `node pkgEAK2/build_EAK2.cjs <live s59 Alt Judge Enforcer Build file> <out>` (same anchors).

Test `node pkgEAK2/test_EAK2.cjs`: 8 OK, 0 FAIL (test_EAK2.txt).
- Replay over 25 saved runs: 23 byte-identical; 33430 and 33497 change from skip to one K-W call (13 and 24 ids, one per alternate row).
- Every run with alternate K-W/K-S3 rows now has a K-W call (16 of 16; was 14 of 16).
- Alt Judge Enforcer Record (live s59 2dfe1e7fd7dd) reads a reply to the new call: 13 and 24 K-W/K-S3 rows, 0 NO VERDICT.
