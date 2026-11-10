# W2 grade: pkgFCD (Wall 3845), seat W2_2026_11_04, 11-09 CST

VERDICT: PASS. One write-file warning for W4 (below).

## What the package does
When pkgFUK rev 3's follow-up fallback drops a CORRECTED COUNT (reply.fum.count_dropped set), enfRows appends " | COUNT NOT WRITTEN: <reason>" to the cure_reason of that reply's K-S3 rows read COUNTED (or every K-S3 row if none is). No row added, no verdict changed. Stacks on pkgFUK rev 3.

## Checks
1. WRITE-FILE WARNING: parent_s93_FCD.json differs from live s94 in the 4 QR nodes as well as the Shared Library; writing it would revert pkgQRC. Rebuilt on fetchback_live_s94 with pkgFUK/parent_on.cjs: parent_s94_FCD_w2.json changes only the Shared Library, byte-equal to the s93 file's Shared Library; 30 library sources byte-equal to strip_FCD. It also carries pkgFUK rev 3, so it replaces parent_s93_FUK3.json.
2. enfRows takes reply as a parameter in all 26 library files, so the new read of reply.fum cannot throw where reply is absent (guarded by reply&&reply.fum).
3. W1 probe rerun: 25 OK, 0 FAIL (probe_FCD_w2.txt).
4. My plants on 34108 luna (w2_plant_FCD.txt): 7 OK, 0 FAIL.
   - count_dropped "", null, 0: every row and body equal to FUK3.
   - fum present with no count_dropped key: all equal.
   - Reason text with quotes, a newline, a pipe and 600 characters: only the COUNTED luna K-S3 row changes, the text is carried unaltered, verdict bodies equal, all 81 rows pass the table CHECKs.
5. Rolled-back insert through record_enforcer_log of that row (w2_rollback_FCD.sql): accepted, {"rows": 1, "recorded": true}; 0 rows remain for run token W2-ROLLBACK-TEST-FCD. W1's 4 probe rows were already accepted (README).

## Not tested (as W1 states)
count_dropped produced by a real follow-up through Normalize and Check in one run; it is set by hand here.
