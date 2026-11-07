# pkgRCK (W1, Wall 2741; scope W3 2742, 2747): K-UNX reads a count that an applied change writes

Committed output: patched/ (22 nodes, from build_RCK.cjs; out/ holds the same files plus the workflow JSON). The old K-RECHK package of the same name (5e37692) is moved to old_5e37692_KRECHK/.

Enforcer fix, TRIAL, side-neutral.
- Base (stack.cjs): live 5a710187 (fetchback_live_s22.json) + pkgUNXS/patched (22 nodes) + pkgUNXW/patched (19 nodes).
- Write order: UNXS, UNXW, RCK. Rebuild if UNXS or UNXW changes; the build asserts each anchor once.

Gap (33249 sol): the DeepSeek send-back pushed premise 5 (S28), and gate change G8 rewrote CHALLENGER CONCEDED LINKS from 1 to 2. No K-UNX test read the new count. The gate's K re-read (gateNewK2024, used by pkgGL) runs only drvCheck and kfLines.

Edits (22 nodes):
1. kunxLines (22 nodes): also takes the rounds object.
2. gateNewK2024 (6 nodes: Gate Build, Gate Record, Alt Gate Build, Alt Gate Record, Alternate Merge Seat, Alternate Merge): the K re-read also runs kunxLines, which covers K-UNX, K-UNX-A and E-ASM. The why names the premise.

Effect (W3 2747 item 4):
- No change is refused, and no count is written that the judge did not write.
- Send-back stage (Gate Build): a new item becomes a G item for the judge at the gate.
- After the gate (Gate Record): a new item is a fresh item, RECORD-ONLY while TRIAL. When K-UNX goes LIVE, the existing pkgGL rule applies, because the item's live flag comes from enfStatus.

Replay: 33218, 33222 and 33249 have identical fields on every node. 33040 to 33197 cannot be replayed, because no Send Back Record was saved for them.

Tests (test_RCK.cjs): 14 OK.
- A1: the two kunxLines forms give the same items.
- A2: the stack is carried.
- B1: the re-read raises an added premise.
- B2: negative control, an ASSUMES ground that quotes the block's [L1] raises nothing.
- B2b: its twin raises an item, so B2 is not vacuous.
- B3: no change, nothing raised.
- C: 33249 sol premise 5 is recorded and its count stays 2.
- D: 33222 grok DEFENDER premise 6 is recorded and its count stays 4.
- E: parity on 33218.

Not shown end to end: a send-back-stage G item. No saved run has a send-back that changed a count. B1 tests the same function that Gate Build calls.
