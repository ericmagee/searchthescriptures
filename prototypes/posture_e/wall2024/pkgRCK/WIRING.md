# pkgRCK (W1, Wall 2741): K-UNX re-read on a count that an applied change adds to

Enforcer fix, TRIAL, side-neutral. Base: live 5a710187 (fetchback_live_s22.json). Write after any later package that edits the same anchors (rebuild on its fetch-back; the build asserts each anchor once).

Gap (33249 sol): sol first counted challenger premise 1 only. The DeepSeek send-back pushed premise 5 (S28); the gate change G8 rewrote CHALLENGER CONCEDED LINKS to 2. No K-UNX check read the new count, because the gate's K re-read (gateNewK2024) runs drvCheck and kfLines only. On the same block, K-UNX fired for grok ("exhibits L1 and L3").

Edits (22 nodes):
1. kunxLines (22 nodes): it also takes the rounds object, not only the prompt string. A1 shows the same items either way.
2. sbApply2024 (6 nodes: Gate Build, Gate Record, Alt Gate Build, Alt Gate Record, Alternate Merge Seat, Alternate Merge): runs before the counts are derived.
   - It runs K-UNX on the text before any change and on the text with the changes.
   - Suppose a K-UNX / K-UNX-A / E-ASM item is new, and a change rewrites that side's count line. Then the change is not applied, and the count stays as first written. Item: NOT APPLIED, with trial:true.
3. gateItems2024: an item with trial:true is not LIVE.
4. gateCure2024: a NOT APPLIED item whose line group holds a refused pkgRCK change is CURED as "TRIAL (pkgRCK, record-only; no seat removed)".
   - At Gate Build, the judge sees the item: KEEP, or a CHANGE whose count names the missing layer.

Effect: TRIAL. The count addition is refused, which changes the stored count. No seat is removed.

Replay (replay_RCK.txt): 11 runs with gate inputs. 33040 to 33197 cannot run, because Send Back Record was not saved then; 3 runs are read. 2 runs differ:
- 33249 sol: challenger count 2 -> 1.
- 33222 grok (alternate): defender count 4 -> 0. G1 to G4 rewrote one line; the last, G4, adds premise 6, which K-UNX reads, so the line stays as first written.
- No verdict tag changed. No seat was removed.

Test: test_RCK.cjs, 12 OK. Rebuild: node pkgRCK/build_RCK.cjs [fetch-back path].
