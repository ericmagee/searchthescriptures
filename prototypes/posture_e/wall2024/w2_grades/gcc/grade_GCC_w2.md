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

## Case (b) on GCCN (labels fc6c5ec4): the gate cure does not re-run the send-back rule
- B1 (measured): luna's counted pkgUND item S10 ("UNDERDETERMINED without a counted [L1]"); the gate answer G1 changes D2 vs C1 to UNDERDETERMINED
  with no [L1] and no statement of what the record leaves open. Gate Record: G1 CURED ("the gate change was applied"); GCCN takes the count off
  (luna 3 -> 2). The pkgUND rule's own stated faults would refuse that line. So case (b) is forgiven for this form.
- B2 control: the stored G1 line ([L1] Matthew 1:19 and "leave open what Joseph believed"): count off, correctly.
- B3: a change to DEFENDER LINK BROKEN without the answering side's words: the gate's own re-read raises K-B and K-G4, G1 UNCURED, count stays.
  So the gate catches break-line faults itself; the gap is the UNDERDETERMINED form, which the gate's re-read does not check against pkgUND.
- Stored: one gate-cured item has its source counted (1062 G6, source S8, rule E-COL "keeps the break and quotes no 6 words"). The gate's new line
  is "D4 vs C6 (Luke 2:48): UNDERDETERMINED ... GROUND: [L1] Luke 2:48-49 "..." where the record leaves open whether ...": it no longer keeps the
  break, and it carries an [L1] and a leaves-open statement (read by me from the logged text, not run through the rule). 0 of 1 would still fail.

## GCCN rev 2 (W1, Wall 4277, commit 4b3e6b25): PASS
SIZE (measured): +728 code, Shared Library only, 418 nodes, connections equal, no prompt text.
Gate Record plants (w2_gcc_GCCN2_out.txt): 8 OK, 0 FAIL (34626 equal to s110; applied off; KEEP stays; not applied stays; other S, other seat, record-only stay).
Unit, exact patch code (w2_gcc_unit_GCCN2_out.txt): C8 two cured items from one S: 3 -> 2 (fixed); C9 pkgRCT stays; C10 KEEP withdrawn stays;
C12 already written stays; C13 W4's TRIAL "not counted" line alone: stays; C14 TRIAL line plus counted line for the same S: 3 -> 2; C15 three items
from one S: 3 -> 2; C16 one line counting S10 and S11, S10 cured twice and S11 once: 4 -> 2. All OK.
Forgiven by design (recorded, not a fail): C11 cure by a later gate change that was applied (count off); case (b) B1: a new UNDERDETERMINED line the
pkgUND rule would refuse is cured by the gate and its count comes off (3 -> 2), as in rev 1. Stored cases of (b): 0 of 1.

## GCCN rev 3 (W1, Wall 4291, commit f4c0d79d): PASS
- Change read: one regex, v4\d -> v(?:4\d|51), in the GCCN filter of Gate Record, Alt Gate Record, R2 Alt Gate Record (Shared Library only); comment renumbered. Nothing else differs from rev 2 (diff of strip_GCCN2 vs strip_GCCN3).
- Size (measured): all Code text +735 against s110 (rev 2 +728; +7). Only the Shared Library node changes. Prompt +0.
- Counted tags the engine writes with "counted in drv_uncured" (scan of all strip_GCCN3 sources): send-back v40 silence, v41 E-COL (pkgECF), v42 collision grade (pkgUND), v43 absence (pkgABS), v44 press absence (pkgPAB), v45 MEANS (pkgMNP), v46 imposed requirement (pkgIMP), v48 keystone consistency (pkgKSC), v51 self-contradiction (pkgEB7); gate v38 E-GATE (the gate's own count, not a send-back count); Merge Seat v21/v38 regexes (readers, not lines).
- w2_gcc_tags.cjs on G1n3: each of v40-v46, v48, v51 comes off (3 -> 2); v38, v21, v50, v52, v5, v510, v4 stay; v51 TRIAL "not counted" stays. 17 OK, 0 FAIL. v40 silence items raise no gate item, so that tag is never reached (as in rev 2).
- Chain on 34626: as stored equals s110; C2-C7 as rev 2; C8v51 (v51 line on S10, gate change applied) 3 -> 2 (rev 2: stays 3, the gap W3 and W4 found). 8 OK.
- Unit C8-C16 as rev 2; 1062 12 -> 11; case (b) B1-B5 as rev 2 (B1/B4 forgiven by design; pkgGUB closes it).
