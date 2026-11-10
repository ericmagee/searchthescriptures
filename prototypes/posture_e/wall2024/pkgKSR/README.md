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

## Rev 2 (W1, 11-10 evening, Central time). Built on s110 (ed644923). Tested at the written rows by chain replay of execution 34626.

Sizes (measured, all Code text; no prompt text added):
- pkgKSR alone: +1,384
- pkgECB alone (rev 2b): +1,500
- both (ALL): +2,884

What changed from rev 1:
- K4 sbApply forces the KEYSTONE line after the closing-break loop; K5 keyChecks rule 2 skips a confirmed link; K6 the D38 KEY card skips a confirmed link.
- E1 to E3: pkgECB withholds (a) a collision line carrying the closing-break mark for a confirmed side and link, (b) the FORCED line of a pair so withheld, and (c, rev 2b) the engine's own line "KEYSTONE: Dn -- BROKEN -- LINK n BROKEN BY A CONFIRMED CLOSING CONTRADICTION" for a confirmed DEFENDER link. Item (c) was added after the first rev 2 chain run (see Mistakes).

Results (chain replay, Panel Cure Check to Replay Rows; files chain_test_<SET>_out.txt, chain_diff_<SET>_out.txt):
- ALL: luna, terra (chatgpt), sol KEYSTONE "D6 -- BROKEN"; RESULT CHALLENGER WINS; every field of the written rows but verdict_raw equal to the base (drv_uncured included); no D38 KEY item; no SEND-BACK SILENCE; no ALTERNATE TRIED row. K4, K5, K6, E5 PASS.
- ECB alone: luna BROKEN; terra and sol KEYSTONE "D6 -- STANDS" (F2 untouched, as expected); drv_uncured equal to the base. E5 PASS.
- KSR alone: all three BROKEN, but terra and sol each get an E-KEY send-back on the engine's own KEYSTONE line; the stored replies cannot answer it, so the replay counts silence and drv_uncured rises. In a live run that item would send the engine's break line to the judge (F1 again). pkgKSR must not be written without pkgECB.
- test_KSR.cjs ALL: 8 OK, 0 FAIL (K3 Alternate Merge Seat now OK: derived STANDS base 2, candidate 0).
- plants_ECB.cjs (E4): 14 OK, 0 FAIL.
- check_ECB.cjs (rev 1 label E2): FAIL by design; the two extra items left out are luna's FORCED D6 vs C5 and D6 vs C6 lines, which rev 2 withholds under E4 (b).
- Record-only: the engine's KEYSTONE line draws a K-RECHK K-CMT row ("NEW: a contested grade line that names no Commitment N"); not counted.

Mistakes:
- chain.cjs renumbered send-back replies line by line, but terra's and sol's replies are JSON with the SENDBACK lines inside an escaped string. They were not renumbered, so my first ECB and ALL replay showed KEYSTONE "none" and a drv_uncured rise that were the tool's fault. Fixed (split on real and escaped line breaks; JSON still parses).
- ECB rev 2 as first built missed (c): under ALL the engine's KEYSTONE line was still sent back as an E-KEY item. The E4 label committed before the run did not list (c); it was added after.
Limit: stored replies only; a new item has no answer.
