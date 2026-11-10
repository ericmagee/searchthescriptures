# W2 labels for pkgGCC (W1, Wall 4268, commit 0cf63f10). Written before any run of the candidate.
Candidate /mnt/project-files/wall2024/parent_s110_GCC.json. Base live s110. Rule under test: a send-back count comes off only when the gate truly cures the same line.
- C0 size measured by me; only the Shared Library changes; the three Gate Record sources differ from s110 only by the two edits.
- C1 34626: Gate Record output and written rows equal to s110 (chain replay).
- Plants on Gate Record, execution 34626, luna (a counted send-back line for S10 added to luna's verdict with drv_uncured +1; S10 is the source of luna's gate item G1 NOT APPLIED (E-APPLY S10)):
  - C2 G1 answered by CHANGE and applied (stored answer): count comes off (drv -1 against s110).
  - C3 G1 answered KEEP ("the change stays unapplied", the line is not changed): count STAYS (equal to s110).
  - C4 G1 CHANGE not applied (a change naming another pair): count stays.
  - C5 the counted line names S12 (not a gate-cured source): count stays.
  - C6 the counted line is another seat's: count stays.
  - C7 the counted line is record-only: count stays.
- C8 unit, the patch code itself: two cured gate items with the same source and one counted line: drv drops by 1, not 2.
- C9 unit: a gate item cured by the pkgRCT path ("the count stays at your cure value"): count stays.
- C10 unit: a CONTRADICTION (E-APPLY Sn) answered KEEP and cured as "change withdrawn": count stays (the line is as it was).
- C11 stored judgments: count of gate-cured E-APPLY items by answer (CHANGE applied, KEEP, withdrawn, pkgRCT, other) in 519 + 342 rows, and whether
  any KEEP-cured, withdrawn or pkgRCT-cured item has its source counted (would be a wrongful removal in stored data). 1062: 12 -> 11 checked by its gate line.

## Case (b) labels (before any run): the gate cure does not re-run the send-back rule on the new line
Plant: luna's counted line for S10 is a pkgUND item (E-HOLD on UNDERDETERMINED D2 vs C1: no counted [L1]). Gate G1 (E-APPLY S10) answered by CHANGE TO:
- B1 "D2 vs C1 (Matthew 1:19): UNDERDETERMINED -- the motives are disputed. -- GROUND: [L3] Luke 1:13 ..." : no [L1] and no statement of what the
  record leaves open, so the pkgUND rule's own stated faults would refuse it. Record: G1 status, drv on s110 and GCCN. If G1 CURED and GCCN takes the
  count off, case (b) is shown as forgiven.
- B2 control: the stored G1 line ([L1] Matthew 1:19, "leave open what Joseph believed"): the count coming off is correct.
- B3 "D2 vs C1 (Matthew 1:19): DEFENDER LINK BROKEN -- ..." without the answering side's words: record.
Stored: for each gate-cured E-APPLY item whose source was counted, whether the new line still meets the counted rule (by reading its text).
