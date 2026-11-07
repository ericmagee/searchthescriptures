# pkgDEC (W1, 11-07): decode once (Eric approved the efficiency items 11:06 CST)

Base pkgL1Q/patched (W3 PASS; W2 12:12 confirmed the base). 3 nodes:
| Node | base | patched | scans replaced |
|---|---|---|---|
| Send Back Record | 72a639c32be3 | 3ae80a6582d3 | 8 |
| Alt Send Back Record | cfdab4e103f6 | 2aaad8ccf3ff | 8 |
| Alternate Merge Seat (library node: ships inside pkgLIB v3) | 03ac3562370c | 8a668a338a2a | 1 |

Each findIndex that parsed every judgment body to read its seat now calls __seatOf(body), memoised per body string; a body that does not parse matches
nothing, as before. test_DEC: 12 recent runs x 3 nodes = 36 runs, 36 identical (31 with real output); harness time 18.3 s -> 5.9 s.
W2's pkgEB7 (Send Back Record, ungraded) restacks on this.
