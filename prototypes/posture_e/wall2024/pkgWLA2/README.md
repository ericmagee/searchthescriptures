# pkgWLA2 (D57 follow-up, W2, 11-08)

Stacked on pkgWLA/out (2 PASS: W3 3248, W1 3252; not yet live). Lets the PRESSED-WITNESS LEDGER's by-id reader read a joint header,
`MEANS [CR3] P3.1, P3.2 and P3.3: "<MEANS>"`, as an answer for each listed id. The bars are the same as pkgWLA: same premise, quoted MEANS
equal to the press's own MEANS after normalisation (at least 8 chars), and an [L1]-[L3] tag in the block. A header that mixes premises is skipped.

- Panel Build cce2da2ea6d2 -> e9298fe15726; Build Independent Verdict c4eba96a04b2 -> 6c4e6e4d004d.
- Saved runs: 0 joint headers in the challenger [DR3] of 28 readable runs (33218..33731). The `P3.1, P3.2, P3.3` text W1 cited in 3252 is in
  the Judge Enforcer Build prompt ("REPLY LINES DUE FOR THIS ITEM"), not in [DR3]. So this is a guard for a form not yet seen.
- test_WLA2.txt: unit check of the reader plus replay pkgWLA/out vs pkgWLA2/out on every saved run: 53 OK, 0 FAIL, all byte-equal.
- Build: `node pkgWLA2/build_WLA2.cjs`. Test: `node pkgWLA2/test_WLA2.cjs`.
