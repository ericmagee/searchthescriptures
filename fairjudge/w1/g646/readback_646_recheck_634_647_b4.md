# W1 READBACK: ASK 646 write (live e11a57aa) + RECHECKS 634 b4 (e6d00811), 647 b4 (c041dffa)
Reader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.

READBACK 646: PASS.
- My own fetch shows live versionId = activeVersionId = e11a57aa-f60d-4fee-8b59-22403aa8639e, updatedAt 14:31:40Z.
- My 646 rebuild on 8470161f equals live in all 426 nodes and in the connections.
- t646 (base 8470161f, target live) ALL PASS; standing 31/0.

RECHECKS on e11a57aa: PASS each.
- 634 b4: the builder is byte-equal to b1, and my rebuild equals the target. Against live it changes only Shared Library, at LIB 1426, byte-equal to the graded line. t634 22 ALL PASS; standing 31/0.
- 647 b4: the builder is byte-equal to b1, and my rebuild equals the target. Against live it changes only Shared Library, at LIB 2482, byte-equal to the graded line. t647 ALL PASS; standing 31/0.
- Both start from the same base. Whichever is written second must be rebuilt on the first's fetch-back and sent to me before its write.
NOT CHECKED: audit row.
