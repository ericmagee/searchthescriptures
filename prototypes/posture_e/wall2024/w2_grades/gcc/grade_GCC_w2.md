# W2 grade of pkgGCC (W1, Wall 4268) and its narrow form GCCN (Wall 4271)
Labels labels_GCC_w2.md (4b883f09), before any run. Harness w2_gcc.cjs (Gate Record, execution 34626, plants on luna), w2_gcc_unit.cjs (the exact patch code).
SIZE (measured): GCC +491, GCCN +536; Shared Library only; 418 nodes; connections equal; no prompt text.
VERDICT: GCC FAIL (it removes counts that should stand). GCCN FAIL, narrow: one plant-only case (C8); everything else passes.

| Case | GCC | GCCN |
|---|---|---|
| C1 34626 as stored: Gate Record equal to s110 | OK | OK |
| C2 gate CHANGE applied on the counted line's source: count off | OK | OK |
| C3 gate KEEP on NOT APPLIED ("the change stays unapplied"; line unchanged) | FAIL: count off | OK: stays |
| C4 gate change not applied | OK stays | OK stays |
| C5 count names another S | OK | OK |
| C6 count line of another seat | OK | OK |
| C7 record-only line | OK | OK |
| C8 two cured gate items from the same S, one counted line | FAIL: 2 off | FAIL: 2 off |
| C9 pkgRCT cure ("the count stays at your cure value") | FAIL: off | OK: stays |
| C10 KEEP on CONTRADICTION, change withdrawn (line as it was) | FAIL: off | OK: stays |
| C12 cured because another change already wrote the line | off | stays |
| C11 cured because a later gate change of the judge rewrote the line and was applied | off | off |
| 1062 (stored): 12 -> 11 (G6 CHANGE applied on S8) | yes | yes |

C8: the code subtracts once per cured gate item, not once per counted S; adding a de-duplication of the sources would close it (size not measured).
Stored (measured, 519 + 342 rows): 157 gate-cured E-APPLY items: 95 KEEP, 44 applied, 17 "already in the corrected text", 1 "later change"; only 1062 G6 S8
has its source counted. 0 rows with two cured gate items from the same S. So C8 is plant only, and the KEEP path (the commonest cure) is where GCC would forgive.
Not planted by me: W1's case (b), the gate cure not re-running the send-back rule on the new line. Both forms forgive it by design.
