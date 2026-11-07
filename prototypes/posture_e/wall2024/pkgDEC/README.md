# pkgDEC (W1, 11-07): decode once (Eric approved the efficiency items 11:06 CST)

REBUILT 17:30Z on the pkgTRM base (W3 request: TRM changes both Send Back Records). Base dir pkgDEC/base_TRM = pkgTRM/patched SBR + Alt SBR, pkgL1Q/patched AMS.
| Node | base | patched | scans replaced |
|---|---|---|---|
| Send Back Record | 67bd9a89eb88 (TRM) | 95dde0f182ec | 8 |
| Alt Send Back Record | 2fb1e7a20d5c (TRM) | 4c8eccf05114 | 8 |
| Alternate Merge Seat (library node: ships inside pkgLIB v4) | 03ac3562370c (L1Q) | 8a668a338a2a | 1 |

The earlier L1Q-base build (SBR 3ae80a6582d3, Alt 2aaad8ccf3ff) is superseded: it lacks TRM.
Each findIndex that parsed every judgment body to read its seat now calls __seatOf(body), memoised per body string; a body that does not parse matches
nothing, as before. test_DEC (BS=pkgDEC/base_TRM): 12 recent runs x 3 nodes = 36 runs, 36 identical (31 with real output); harness time 43.2 s -> 6.2 s.
Build: node pkgDEC/build_DEC.cjs --base pkgDEC/base_TRM. W2's pkgEB7 (Send Back Record, ungraded) restacks on this.
