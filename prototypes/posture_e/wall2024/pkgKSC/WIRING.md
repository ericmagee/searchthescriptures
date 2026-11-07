# pkgKSC: keystone consistency (W3 queue B6, builder feedback 4; design approved Wall 2665; revised per W3 2671)

TRIAL for one run: `KSC.LIVE=false`. Items are sent back and answered; an uncured one is recorded in AUDIT v48, NOT counted in drv_uncured, and removes no seat. After a run with zero false E-KSC items, a separate one-line package sets `KSC.LIVE=true`.

Code only, no wiring change. 26 nodes, all edits text-exact (any order with pkgPTA A, pkgL2R, pkgLNX; checked stacked on PTA A + L2R).

## Rule (Commitment 15, side-neutral)
A verdict may not grade `KEYSTONE: Dn -- STANDS` while its own (defender) CONCEDED LINKS line counts link n UNEXHIBITED, CONCEDED or
WITHDRAWN. "LINK n" is Dn. "Premise p" (or a bare "p") is the p-th entry of the [DR2] UNSUPPORTED-L4 PREMISES list, and counts the link its
own "LINK n:" label names (pkgUNL's reading; 33149: premise 6 = LINK 4). A premise with no labeled entry maps to no link and raises nothing.

## Where it fires (stored verdicts since 10-28: 23 hits of 29 candidates, 260 read; every mapping in scan_KSC_out.txt)
Panel seats: 33160 chatgpt, sol; 33149 chatgpt, sol (Premise 2 = LINK 6); 33129 chatgpt, gemini; 33021 gemini; 33014 sol; 32924 chatgpt
(Premise 6 = LINK 5, keystone D5); 32905 grok; 32302 glm; 32194 glm; 30268 glm; 29609 grok.
Single judge: 33175, 33160, 33149, 33055, 32936, 32293, 32212, 32194, 29434.
Dropped by the mapping: 29519 deepseek and 32998 grok (premise 6 has no labeled entry), 29955 gemini (P6 = LINK 5, keystone D6),
32228 chatgpt and 32725 chatgpt (P6 = LINK 4), 32924 grok (P5 = LINK 4, keystone D5).

## Nodes
- Send Back Build, Alt (5 edits): one E-KSC item per seat (TRIAL). The premise map is read from UND.rounds(PB.judges).DR2. The message states the rule and both cures.
- Send Back Record, Alt (7 edits): it cures by CHANGE TO a KEYSTONE line for Dn not graded STANDS, or by CHANGE TO a CONCEDED LINKS line no
  longer counting LINK n. A KEEP does not cure it. Under TRIAL an uncured item is recorded in AUDIT v48 only; with LIVE it counts once in drv_uncured.
- Gate Build, Gate Record, Alt Gate Build, Alt Gate Record, Alternate Merge, Alternate Merge Seat (1 edit, sbApply2024): an E-KSC change goes
  over the judge's one line with the same label (KEYSTONE or CONCEDED LINKS). Without this, a CONCEDED LINKS change overwrote the KEYSTONE line.
- 15 PART2 nodes (1 edit): Commitment 15, after Commitment 14 and before the pkgBAR VOID sentence.
- Extract Independent Verdict (2 edits): the single judge gets an AUDIT v48 review line, record-only, because it has no send-back (W3 2665). Its premise map comes from prev.gr2 (DR2).

## Build and test (from wall2024/)
    node pkgKSC/build_KSC.cjs [in] [out]   # default: fetchback_live_1b49671d + pkgSLA (= live n24)
    node pkgKSC/test_KSC.cjs               # 47 OK
    node pkgKSC/scan_KSC.cjs               # the 260-verdict scan with each mapping (scan_KSC_out.txt)
