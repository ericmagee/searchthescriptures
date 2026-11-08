# LIB v28_RI3B_G33731: v27_G33731's three fixes stacked on v27_RI3B (W1, 11-08)

RI3B passed (W2 3240, W3 3242) and is written first, so this is the library W4 writes if G33731 passes too.
- Source strip: pkgLIB/strip_A2R_RI3B_G33731 (node pkgKS3Q/build_KS3Q.cjs pkgLIB/strip_A2R_RI3B ..., then FRP, then OOS; see pkgLIB_v27_G33731/README.md).
- Shared Library 20d3319b560b (v27_RI3B was f6c9f8e96979). 30/30 stubs unpack to their sources.
- test_combined_on_RI3B.txt: v27_RI3B vs this, 132 node runs, 125 equal, 7 differ: exactly the union of the three single-fix tests on v26
  (33731 Gate Record grok G2 UNCURED -> CURED; the FRP and OOS Gate Build / Alt Gate Build / Alternate Merge Seat diffs in 33371, 33461, 33627, 33731).
- The 10 changed library nodes do not include Alternate Build, so E4's Alternate Build (plan_RI3B_on_A2R.json) is untouched.
- Also write pkgOOS/out/ (Judge Enforcer Build, Alt, R2 Alt).
