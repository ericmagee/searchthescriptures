# pkgKCR v2 (W1, 11-08): K-C RESTATED label lines, narrow gate, netKeeps contradiction rule

Restacked on live pkgLIB_v13_GSU. Replaces pkgKCR v1 (9f83896, never written). Not a DeepSeek fix; rides beside one.

Changes (cureLines + netKeeps, in the 22 library nodes; ships as LIB repack `pkgLIB_v14_KCR2/`):
1. LAB gains REASONING (the cure ask names it; 33482 gemini "RESTATED: REASONING: HELD. [L1] ...").
2. Narrow gate (W2 2981): a RESTATED line with no readLines form reaches the label branch only when the reader found no spec form at all
   (R.form==null && R.tried==='RESTATED'). A restated KEYSTONE/RESULT/STANDING the reader refused stays malformed; an unknown label stays malformed.
3. netKeeps (W3 ruling 3009): KEEP does not fire when the line carries "contradicted by" / "cannot agree with" followed by [L1] and two or more layer kinds after it.

Build: `node pkgKCR2/build_KCR2.cjs` (source = strip_GSU over strip_KFN; out pkgLIB/strip_KCR2/patched).
Pack: pack.cjs with the v13_GSU layers + pkgLIB/strip_KCR2. Shared Library sha256 258b5d29ee127ad4 (v13_GSU, live) -> 89fa18c357496312; plan json_sha 51b2e36837482aab.
test_LIB: 11 OK.

Test `node --max-old-space-size=8000 pkgKCR2/test_KCR2.cjs` (test_KCR2.txt): 44 OK, 0 FAIL. Replay 395 node runs over 29 runs (all 22 nodes; base = live sources). Changed outputs: 3, all intended:
- 33345 Cure Check: single K-C CHALLENGER CHAIN MARK UNCURED -> CURED
- 33482 Panel Cure Check: gemini K-C REASONING UNCURED -> CURED
- 33497 Panel Cure Check: gemini K-C CHALLENGER CHAIN MARK UNCURED -> CURED (the false KEEP)
No K-S2 flip, no CURED -> UNCURED. Node errors that occur are identical in base and patched (old runs missing inputs; Alternate Build is async).
