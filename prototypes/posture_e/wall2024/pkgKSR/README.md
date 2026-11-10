# pkgKSR and pkgECB (W1, offline on live s110; nothing written). 12:30 CST 11-10.
Source: dry regrade 34626 (W3 grade_34626.md Findings 1 and 2; W1 Wall 4211). Two packages, each can be taken alone. Build: SET=KSR|ECB|ALL node pkgKSR/build_KSR.cjs <fetch-back> <out>.
Both change only library sources (repacked; only the Shared Library node changes). No prompt text, no model call, no node, no log field.

## pkgKSR: the KEYSTONE line follows a confirmed closing-contradiction break (Finding 2, terra and sol)
- cureRecompute (26 library sources) writes "KEYSTONE: Dn -- BROKEN -- LINK n BROKEN BY A CONFIRMED CLOSING CONTRADICTION" when the defender's keystone link Dn is broken by a confirmed closing contradiction and the judge's line reads STANDS; the trigger names "KEYSTONE Dn (STANDS to BROKEN)".
- SIZE (measured): +418 code. Prompt: none. Write file pkgKSR/parent_s110_KSR.json.
- Tests (pkgKSR/test_KSR.cjs, output test_KSR_out.txt; labels labels_KSR.md): K0 harness OK; K1 OK (chatgpt and sol now read BROKEN; luna's own BROKEN line untouched); K2 OK (line diff: only the KEYSTONE line, its trigger, the recompute audit, the SUPERSEDED LINE audit and one record-only K-RECHK row per judge).
- K3 FAIL for pkgKSR alone, as designed after the label: luna's derived STANDS (send-back keystone derivation) is NOT fixed by pkgKSR. I first built a guard in the derivation (+67); it made sbApply's keystone check raise new CONTRADICTION items on luna's changes, so I removed it. luna's case is closed by pkgECB instead (below).

## pkgECB: the engine's own closing-break lines are not sent back (Finding 1, and luna's KEYSTONE)
- Send Back Build, Alt and R2 Alt (3 library sources): an item, or an E-COL companion item, whose line carries "BROKEN BY A CONFIRMED CLOSING CONTRADICTION" is not sent; it is listed in not_sent with the reason "the engine's closing-contradiction break; a send-back does not undo it (pkgECB)".
- SIZE (measured): +462 code. Prompt: none (the send-back prompts lose those items). Write file pkgKSR/parent_s110_ECB.json.
- Tests: E0 harness OK; E1 OK (8 item texts on break lines in the base, 0 in the candidate; each in not_sent); E2 OK (30 items to 24; the 6 left out are all on break lines; every other item equal, S numbers aside).
- luna: with no item on the D6 break lines, luna is not asked to change them, so the send-back derivation has no change to derive "D6 -- STANDS" from. Shown by E1/E2 only; a full replay of luna's send-back is not possible offline (her stored replies answer items pkgECB does not send).

## Both: SET=ALL, +880 code measured (pkgKSR/parent_s110_ALL.json).
