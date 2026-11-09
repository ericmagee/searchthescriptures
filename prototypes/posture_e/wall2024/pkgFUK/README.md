# pkgFUK (W1): the one follow-up also asks a K-S3 answer the reader cannot count

Assignment: coordinator 23:04Z 11-09, from W1 Wall 3790 (FUM gap 1). Base: live s90 (pkgVP4 rev 2, 418 nodes; its library equals s89 and pkgLIB_VP1_s84, 31 files checked), library strip_VP1_s84. Graders W2, W3.

## Gap
A K-S3 item answered with a RESPONSE the cure reader cannot count (TOUCHES NO LINK with a reason under five words, or an answer that is neither COUNTED, TOUCHES NO LINK nor NOT HELD) reads UNCURED, and fumAsk2024 asks only about silent items and NOT HELD items without the quote. K-S3 is LIVE, so the seat is removed with no follow-up. Proof on live code: w1_unproven/fum_k3_short_reason.txt and probe_FUK.txt checks 1-2.

## Change (library only; 6 Normalize nodes, fumAsk2024, identical in all six)
- New list ks3: K-S3 items not CURED, with a RESPONSE that is not NOT HELD, not already asked.
- The follow-up gains a section "K-S3 items whose RESPONSE cannot be counted (n)", asking each again as COUNTED (with the corrected count), TOUCHES NO LINK: <at least five words>, or NOT HELD quoting six words in a row of the flagged sentence.
- Asked entries are labelled "NO REASON <item>"; the items go to fumKeep2024 like every asked item, so only their own lines are read from the follow-up (rev 7 guard unchanged).
- Nothing else changes: no node added, no connection changed. The packed stubs change text only because Shared Library line offsets move (pack rebuilds every stub byte for byte).

## Proof
- probe_FUK.cjs (run 34108, Panel Cure Normalize 1, luna, K-S3 S3 DEFENDER CR4: #1): 21 OK 0 FAIL. Live asks nothing; FUK asks it alone; a full follow-up answer, or COUNTED, cures it; a short follow-up stays UNCURED with no second ask; a line for an unasked item is not kept; NOT HELD without the quote stays NO QUOTE only; COUNTED or a full reason asks nothing; stored replies byte-equal on the 4 Normalize nodes stored for 34108.
- replay_FUK.cjs: 176 stored cure replies (all runs, 6 Normalize nodes): 176 byte-equal. No saved reply has the short K-S3 reason, so no saved run changes.
- gate/replay.cjs (fetch-back s89 and s90, both): 767 node runs, 767 byte-equal or same error, 0 target changes, 17 near-miss checks passed, GATE PASS.
- No enforcer log row is added or changed (the follow-up shows in the existing rows' cure_reason as for every FUM ask).

## Build
node pkgFUK/build_FUK.cjs strip; FB=/mnt/project-files/wall2024/fetchback_live_s89.json node gate/pack.cjs pkgLIB/strip_FUK pkgLIB_FUK; node pkgFUK/build_FUK.cjs parent -> pkgFUK/parent_s90_FUK.json (418 nodes; vs s90 only the 11 library nodes differ, connections equal)
Stacking: pkgKNL rev 4 (W2) also changes the Shared Library. Whichever is written second is rebuilt on the first (the FUK edit is four anchored replacements in fumAsk2024).

## Engine manual part (for W3)
Cure follow-up (pkgFUM, pkgFUK): the one follow-up also lists each K-S3 item whose RESPONSE cannot be counted (a TOUCHES NO LINK reason under five words, or an answer that is neither COUNTED, TOUCHES NO LINK nor NOT HELD), labelled NO REASON, and asks for COUNTED, TOUCHES NO LINK with at least five words, or NOT HELD quoting the flagged sentence. It is asked once; an answer still not countable stays UNCURED.
