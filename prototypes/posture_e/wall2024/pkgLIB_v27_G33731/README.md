# LIB v27_G33731: three 33731 fixes on live LIB v26_A2R (W1, 11-08)

Ruling: Wall 3239 (33731 grok G2 removal = engine fault). Shared Library 3cf2f7469e38 (v26_A2R was d30de903b762). 30/30 stubs unpack to their sources.

## Fixes (each is an anchor patch; built in this order)
1. pkgKS3Q (library, 10 nodes): the gate's K re-read (gateNewK2024) keyed K-S3 by position, so a change that adds or moves a concession row
   made an already-answered quote look NEW (33731 grok: "I grant the counting by the house." was K-S3 #5, CURED; it came back as #6, LIVE,
   and removed grok). Now a K-S3 item whose sentence the pre-change text already held is not new. It can only drop items the old key raised.
2. pkgFRP (library, 10 nodes): "RETRACTED: Dn vs Cm" was refused "the flagged line is not in the judge text" when the item quoted a FORCED
   line the text no longer holds word for word (33731 grok S11). The FORCED line is now found by its pair; if an earlier item of the same
   reply already retracted that pair, this item is recorded as covered by it. The ruling 411 / pkgRFL checks still run.
3. pkgOOS (library 10 nodes + Judge Enforcer Build, Alt, R2 Alt): an E-OOR item now takes CHANGE TO: STRUCK -- <why> (also "(struck: ...)",
   REMOVED, DELETED), which strikes the flagged row; a row ending COUNTED is not struck (count would go stale). The link-round E-OOR reason
   names the form. Judge Enforcer Build 1b91af370950 -> ef5238330d13, Alt 11880d7711c1 -> 956ccd0b2d2d, R2 Alt b83d7d8cf7f0 -> 040c7ca1ad61
   (pkgOOS/out/).

## Tests (base vs patched, every library node with a saved run; harness, inputs/)
- pkgKS3Q/test_KS3Q.txt: 132 node runs, 131 equal, 1 differs: 33731 Gate Record, grok G2 UNCURED -> CURED and the NEW RULE K-S3 row gone.
  27 errors = old runs with no Send Back Record (same on base).
- pkgFRP/test_FRP.txt: 126 equal, 6 differ (33371, 33461, 33627 x2, 33731 x2): each is a RETRACTED answer refused for a text mismatch that
  is now applied or covered; 33627 S8 is still refused by pkgRFL (its link is still graded BROKEN), as it should be.
- pkgOOS/test_OOS.txt: 130 equal, 2 differ, both 33731: S13 "(struck: ...)" is applied, so the gate gets no G1/G2 for it.
- pkgOOS/test_OOS_jeb.txt: Judge Enforcer Build on 37 saved runs: 28 equal, 1 differs (33731, the hint only; equal once it is removed), 8 errors (same on base).
- Combined on 33731: grok keeps the seat (no uncured gate item, no new K-S3).

## Write (W4)
- Shared Library -> 3cf2f7469e38 and the 30 stubs from patched/ (only the 10 that carry sbApply2024/gateNewK2024 change their code;
  the stubs' own lines may move with the library line numbers).
- Judge Enforcer Build, Alt Judge Enforcer Build, R2 Alt Judge Enforcer Build from pkgOOS/out/.
- If RI3B (v27_RI3B) goes first: the same three builders apply on it unchanged (checked: pkgLIB/strip_A2R_RI3B_G33731); repack that strip.

## Rebuild
node pkgKS3Q/build_KS3Q.cjs && node pkgFRP/build_FRP.cjs && node pkgOOS/build_OOS.cjs && LIB_N=30 node pkgLIB/pack.cjs pkgLIB/strip_A2R_KS3Q_FRP_OOS
