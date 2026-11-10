# pkgFCD (W1): the enforcer log says when a follow-up's corrected count was not kept

Assignment: coordinator 23:57Z 11-09, from W3's note on Wall 3817. Standing authorization, offline. Graders W2 and W3.
Base: strip_FUK3 (pkgFUK rev 3) on live s90. STACKS ON pkgFUK rev 3 (26 library files, same as FUK); if FUK changes, FCD is rebuilt on it. Packed in stub form 2; if pkgSTB is written first, repack with STUBV=3 (Shared Library only).

Gap: when pkgFUK rev 2 C1 keeps a follow-up K-S3 answer but drops its CORRECTED COUNT line (keeping it changed an unasked item), fum.count_dropped says so only in the Normalize node output. The K-S3 item reads CURED as COUNTED and the enforcer log does not say the count was not written.

Fix (enfRows, 26 library files): the cure_reason of each K-S3 row of that reply read CURED as COUNTED (or, if none is, of each K-S3 row, so the drop is never silent) ends " | COUNT NOT WRITTEN: <fum.count_dropped>". No row is added; no other field or verdict changes; nothing changes when count_dropped is not set.

Build: `node pkgFCD/build_FCD.cjs strip`, `FB=... node gate/pack.cjs pkgLIB/strip_FCD pkgLIB_FCD`, `node pkgFCD/build_FCD.cjs parent` -> parent_s90_FCD.json (32 nodes, connections unchanged).
Proof:
- probe_FCD.cjs 25 OK (34108 luna, Panel Cure Check whole node): with no count_dropped all 81 log rows and the bodies are equal to FUK3; with count_dropped set on the reply (as the C1 fallback sets it; the fallback itself was planted by W3, 3817) only the COUNTED K-S3 row's reason is extended, the other K-S3 rows carry no note, every other row and the verdict bodies are equal; with no COUNTED row all K-S3 rows carry it; all rows pass the table's CHECKs.
- replay_FCD.cjs 176 stored replies byte-equal (Normalize nodes, unchanged by FCD). Gate: gate_FCD_s90.txt.
- Rolled-back insert through record_enforcer_log of the 4 probe rows (3 K-S3, 1 K-S): accepted, rows 4.
Not tested: count_dropped produced by a real follow-up through Normalize and Check together in one run (set by hand here).
Manual part: "When the follow-up's corrected count is not kept, the K-S3 log row says COUNT NOT WRITTEN with the reason."
