# pkgCPD (W1): counted_premises re-derived after a changed count (W3 2772 item 5)

Fault: cureRewrite rewrites a panel row's count fields after a cure or send-back but only ADDS cured premises to counted_premises_* (ruling 421 B6);
sbApply2024 passes cpAdd:null. A count that goes down (or up by a send-back) leaves the array stale: 33249 sol, 33276 gemini [1] after 0, 33299 gemini [3] after 0.

Fix (record-only; no seat removed, no count changed, no item raised), inside cureRewrite's panel branch:
- before the field rewrite, read the row's own conceded_links / challenger_conceded_links (__cpdPre);
- after the ruling-421 add, cpdSync: for each side whose count this rewrite changed and whose array size differs from the new count,
  count 0 gives []; otherwise psGrades on the side's first CONCEDED LINKS line in the reasoning gives the COUNTED premises (VOID and spared left out).
  Written only when that set has exactly the count's size and the line's own number equals the count. Else the array is kept.
- marks after the CORRECTED RESULT mark: [AUDIT v50: COUNTED PREMISES DERIVED (pkgCPD) ...] or [AUDIT v50: COUNTED PREMISES NOT DERIVED (pkgCPD) ... REVIEW THIS ROW.]
- a count the rewrite did not change is never touched (an uncured K-G8 array stays as evidence).

Nodes: the 19 nodes holding cureRewrite (identical copies). psGrades copied byte for byte from Gate Build into the 13 that lack it.
Builds: patched/ on live s32 (44e800f1, fetchback_live_s32.json); patched_on_RXR/ on pkgRXR/patched (W2 107d0d9; RXR edits the same 19 nodes).
Downstream readers of the arrays after cureRewrite: the gate's K-RUL deciding list (TRIAL), the stored verdict_raw. K-G8 is not re-read after the cure.
Known limit: a recompute line that names no premise ("CHALLENGER CONCEDED LINKS: 1 -- recomputed after the cure ...") cannot give the set; NOT DERIVED (33249 grok).
Run from wall2024/: node pkgCPD/build_CPD.cjs; node pkgCPD/build_CPD.cjs --on pkgRXR/patched --out pkgCPD/patched_on_RXR; node pkgCPD/test_CPD.cjs <Node_File>; node pkgCPD/replay_CPD.cjs
