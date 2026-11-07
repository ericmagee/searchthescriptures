# pkgKSC: keystone consistency (W3 queue B6, builder feedback 4; design approved Wall 2665)

Code only, no wiring change. 26 nodes, all edits text-exact (any order with pkgPTA A, pkgL2R, pkgLNX; checked stacked on PTA A + L2R).

## Rule (Commitment 15, side-neutral)
A verdict may not grade `KEYSTONE: Dn -- STANDS` while its own (defender) CONCEDED LINKS line counts LINK n (or Premise n, or a bare
"n") UNEXHIBITED, CONCEDED or WITHDRAWN.

## Where it fires (stored verdicts since 10-28: 24 of 260; each checked by hand in the line)
Panel seats: 33160 chatgpt and sol, 33129 chatgpt and gemini, 33014 sol, 33021 gemini, 32998 grok, 32924 chatgpt and grok, 32905 grok, and older.
Single judge: 33175, 33160, 33055, 32936, 32293, 32212, 32194.

## Nodes
- Send Back Build, Alt (5 edits): one E-KSC item per seat, ENFORCED. The message states the rule and both cures.
- Send Back Record, Alt (7 edits): it cures by CHANGE TO a KEYSTONE line for Dn not graded STANDS, or by CHANGE TO a CONCEDED LINKS line no
  longer counting LINK n. A KEEP does not cure it. An uncured item counts once in drv_uncured, under AUDIT v48.
- Gate Build, Gate Record, Alt Gate Build, Alt Gate Record, Alternate Merge, Alternate Merge Seat (1 edit, sbApply2024): an E-KSC change goes
  over the judge's one line with the same label (KEYSTONE or CONCEDED LINKS). Without this, a CONCEDED LINKS change overwrote the KEYSTONE line.
- 15 PART2 nodes (1 edit): Commitment 15, after Commitment 14 and before the pkgBAR VOID sentence.
- Extract Independent Verdict (2 edits): the single judge gets an AUDIT v48 review line, record-only, because it has no send-back (W3 2665).

## Build and test (from wall2024/)
    node pkgKSC/build_KSC.cjs [in] [out]   # default: fetchback_live_1b49671d + pkgSLA (= live n24)
    node pkgKSC/test_KSC.cjs               # 41 OK
