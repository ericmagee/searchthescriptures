# pkgRFL: a RETRACTED change removes its FORCED line (W1 Wall 2677; W3 approved and queued Wall 2679)

**Cause (33197).** E-COL sent back chatgpt's FORCED D1 vs C1 and D4 vs C5 and gemini's FORCED D2 vs C1 (enforcer: STANDS). Each judge agreed and
answered `CHANGE TO: RETRACTED: Dn vs Cm`. E-APPLY refused all three ("the CHANGE TO line has no line form the engine reads"), and the gate
KEEP left them as they were. The FORCED lines stayed in the record, together with the challenger counts that rest on them (the 3 Oracle concedes).

**Fix (2 edits in sbApply2024, identical in the 6 nodes).**
- A CHANGE TO `RETRACTED: Dn vs Cm` whose flagged line is a FORCED line for the same pair removes that FORCED line. The pair's collision line stays.
- A FORCED line stays when its pair's collision line on the corrected text is still graded LINK BROKEN (ruling 411: a broken link rests on its
  FORCED line). It is then NOT APPLIED, with that reason, and goes to the gate as before.
- A RETRACTED change for another pair, or on a line that is not a FORCED line, is read as before.

**What it does not do.** It changes no count. A judge's CONCEDED LINKS or CHALLENGER CONCEDED LINKS line is the judge's own, and it stays as
written. The 33197 Oracle concedes (chatgpt 2, gemini 1) are unchanged by this package (replay below).

**Nodes.** Gate Build, Gate Record, Alt Gate Build, Alt Gate Record, Alternate Merge Seat and Alternate Merge. Bases are pkgRSA/patched
(67b74ac), so write this after pkgRSA. pkgKSC also edits these 6 nodes (anchor `if(!o){const __lk=sbLabel(to);if(__lk){`). That anchor is
still found once in every patched file, so the two apply in either order.

**Test.** `node pkgRFL/build_RFL.cjs && node pkgRFL/test_RFL.cjs` gives 11 OK.

**Replay** (pkgRFL/replay_RFL.txt). Runs 33040 to 33197 hold 394 stored S and G items. 33175 has no saved input. 5 of the items are RETRACTED changes.
- 33197 chatgpt S31 and S33, gemini S2: base NOT APPLIED, pkgRFL APPLIED (the FORCED line removed). The derived verdict, counts and result
  are unchanged. The NOT APPLIED items drop from 2 to 0 (chatgpt) and from 1 to 0 (gemini), so the gate gets no item for them.
- 33160 gemini S4: APPLIED. Verdict, counts and result unchanged.
- 33149 gemini S10: NOT APPLIED, because D3 vs C2 is still graded CHALLENGER LINK BROKEN. Unchanged.

**Revert.** Restore pkgRFL/base/.
