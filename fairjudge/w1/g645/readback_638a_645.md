# W1 READBACK: ASK 638 A and ASK 645 writes (live engine 8470161f) + RECHECKS 646 b4, 634 b3, 647 b3
Reader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.

READBACK 638 A + 645: PASS.
- My own fetch shows live versionId = activeVersionId = 8470161f-f72a-4719-835d-1ae4e245ed56, updatedAt 14:27:04Z.
- I built the expected engine myself: b638 on my 393bca2e copy, then b645 on that result. All 426 nodes and the connections equal live.
- Tests on live:
  - t645 (base = 638 A result) 24/0.
  - t638 (base 393bca2e) 27/1. The one FAIL is C4, "only the Shared Library changes". It is expected: 645's three QR nodes are in the same live engine. Every 638 A test passes.
  - Standing 31/0.

RECHECK 646 b4 (target e27e24e5) on 8470161f: PASS.
- The builder is byte-equal to b1. My rebuild equals the target, connections included.
- Only Init Seats and Build Save Body change, each byte-equal to my graded b1 node.
- t646 (ask629 fixtures) ALL PASS; standing 31/0.

RECHECK 634 b3 (56ea8c28) and 647 b3 (55e560fc) on 8470161f: PASS each.
- Both builders are byte-equal to b1. Each rebuild equals its target; only Shared Library changes.
- 634 changes LIB 1426 and 647 changes LIB 2482. Each line is byte-equal to the graded text.
- t634 22 ALL PASS; t647 ALL PASS; standing 31/0 for each.
- Both change Shared Library from the same base. Whichever is written second must be rebuilt on the first's fetch-back. 646 does not touch Shared Library.
NOT CHECKED: audit rows; W4's three-way scripts.
