# W2 grade: pkgKVQ (Wall 3841), seat W2_2026_11_04, 11-09 CST

VERDICT: PASS. One write-file warning for W4 (below).

## What the package does
A send-back KEEP whose cure words are found only inside a quoted verse of six words or more (on a line that names a verse) that the answering side quoted now reads UNCURED, reason "KEEP whose reason quotes only scripture the answering side quoted (...) (pkgKVQ)". Record-only, same as the cure reader.

## Checks
1. Rebuild on s93 (p93.json): byte-equal to W1's parent_s93_KVQ.json. Only the 3 Send Back nodes change.
2. WRITE-FILE WARNING: parent_s93_KVQ.json also differs from live s94 in the 4 QR nodes (pkgQRC went live as s94 after it was built). Writing it would revert pkgQRC. Rebuilt on fetchback_live_s94: parent_s94_KVQ_w2.json changes only the 3 Send Back nodes, each byte-equal to the s93 file's nodes. W4 must write a build on s94.
3. W1 probe on s93: 13 OK, 0 FAIL (probe_s93_w2.txt).
4. Replay of every stored run (replay_s93_w2.txt): 42 node runs, 68 KEEP rows, 41 equal, 1 differs (33482 Matthew 1:18) only in the quoted words of a CURED reason; 0 status changes.
5. My own plants on 34108 (w2_plant_KVQ.txt): 11 OK, 0 FAIL.
   - W2-1 side's own words on a verse line, no quote marks: CURED.
   - W2-2 Romans 1:3 verse text: CURED because the same words stand in [CR4] lines 133 and 136 with no verse reference on the line. This is the stated limit; it errs lenient, the same as live.
   - W2-3 KEEP straddling the Job 14:1 quote and the bare grant: UNCURED (pkgKQG reason).
   - W2-4 MEANS sentence holding a one-word quote: CURED (short quotes are not cut).
   - W2-5 Job 14:1 text only: UNCURED with the pkgKVQ reason.
   - Every other field equal in each plant; the 34108 terra row byte-equal.
6. Rolled-back insert through record_enforcer_log (w2_rollback_KVQ.sql), 2 rows (panel send_back UNCURED with the pkgKVQ reason; panel send_back CURED): accepted, {"rows": 2, "recorded": true}, 2 rows inside the block; after rollback 0 rows remain for run token W2-ROLLBACK-TEST-KVQ.

## Limit (stated by W1, confirmed by W2-2)
A verse quoted with no verse reference on its line, or without quotation marks, is not cut, so a KEEP quoting it still reads CURED.
