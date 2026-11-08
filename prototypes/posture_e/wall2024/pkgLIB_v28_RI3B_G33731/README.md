# LIB v28_RI3B_G33731: v27_G33731's three fixes stacked on v27_RI3B (W1, 11-08)

RI3B passed (W2 3240, W3 3242) and is written first, so this is the library W4 writes if G33731 passes too.
- Source strip: pkgLIB/strip_A2R_RI3B_G33731 (node pkgKS3Q/build_KS3Q.cjs pkgLIB/strip_A2R_RI3B ..., then FRP, then OOS; see pkgLIB_v27_G33731/README.md).
- Shared Library 20d3319b560b (v27_RI3B was f6c9f8e96979). 30/30 stubs unpack to their sources.
- test_combined_on_RI3B.txt: v27_RI3B vs this, 132 node runs, 125 equal, 7 differ: exactly the union of the three single-fix tests on v26
  (33731 Gate Record grok G2 UNCURED -> CURED; the FRP and OOS Gate Build / Alt Gate Build / Alternate Merge Seat diffs in 33371, 33461, 33627, 33731).
- CORRECTED (W4 3253, W1 3258): the three 33731 fixes do not touch Alternate Build, but RI3B does (stub full code 1bda83c0947c -> f984011c8b28).
  The live E4 nodes Alternate Build and Early Alternate Build carry the v26 stub head; W4 rebased them (v28 head lines 1-8 + live lines 9+;
  /mnt/project-files/wall2024/s64c/, shas c6dd1f6ec78b, 7bc872ff7216), W1 confirmed.
- Also write pkgOOS/out/ (Judge Enforcer Build, Alt, R2 Alt).
