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

# Rev 2 (W1; coordinator 23:27Z 11-09): W3's reader gaps A, B, C (Wall 3809) folded in. Graders W3, W4.
Base strip_FUK (rev 1) on live s90. Build: node pkgFUK/build_FUK2.cjs strip; FB=/mnt/project-files/wall2024/fetchback_live_s90.json node gate/pack.cjs pkgLIB/strip_FUK2 pkgLIB_FUK2; node pkgFUK/build_FUK2.cjs parent -> parent_s90_FUK2.json (418 nodes; 32 nodes differ from s90: Shared Library, 30 library stubs, Early Alternate Build; connections equal).
- A (cureVerdicts K-S3, every library copy): a COUNTED with not / never / no / nor / ...n't within the 3 words before it is not COUNTED. "NOT COUNTED, ..." now reads UNCURED and is asked once as NO REASON (rev 1 section).
- B (fumAsk2024): an item whose only line is a RESPONSE line with nothing after the bar ("no written response; malformed line", not silent) is asked once, in its own section, labelled NO ANSWER.
- C1 (fumKeep2024, fumJoin2024): a follow-up CORRECTED COUNT line for the side of an asked K-S3 item is kept, and replaces the first reply's count line of that side. If keeping it changes an unasked item (rev 7 guard), the follow-up is kept without the count line, and fum.count_dropped says why; the asked lines still stand.
- C2 (cureSet, every library copy): a K-S3 item CURED as COUNTED now joins the side's count items, so the side's single CORRECTED COUNT is written (CORRECTED STANDING audit line). Before, a K-S3 count correction was never written. This is enforced: it sets the seat's conceded_links as any written corrected count does.
Proof: probe_FUK2.txt 23 OK 0 FAIL (34108, luna); rev 1 probe on rev 2 code 21 OK (probe_FUK_on_rev2.txt); 176 stored cure replies byte-equal (replay_FUK2.txt; the stored replies hold 691 K-S3 RESPONSE lines, all TOUCHES NO LINK or NOT HELD, none COUNTED); gate 767 node runs byte-equal, GATE PASS (gate_FUK2_s90.txt). No log row added or changed in form.
Manual part (rev 2 adds): K-S3 cure reading: COUNTED counts only when not negated ("NOT COUNTED" is not a count). The one follow-up also asks, labelled NO ANSWER, an item whose RESPONSE line has nothing after the bar. A K-S3 item answered COUNTED with one CORRECTED COUNT line for its side writes that count; in the follow-up, that line is read with the asked line and replaces the first reply's count of the side, unless it changes an item that was not asked, in which case only the count line is dropped.
