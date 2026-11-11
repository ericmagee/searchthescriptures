# R1b re-measured on live s117 (s116 + pkgOON3), W1 18:4x CST 11-10; offline, nothing built for write
Strip folder pkgLIB/strip_R1bM_s117 = the 87 sources of pkgLIB/strip_R1bM_J3 taken from fetchback_live_s117.json (size_R1b_s117/mkstrip.cjs; on s116 it reproduces the J3 strip in 86 of 87 files, Alternate Build is the pre-rebase head copied from the J3 strip, its source is equal on s116 and s117).
FB=fetchback_live_s117.json node gate/pack.cjs pkgLIB/strip_R1bM_s117 pkgLIB_R1bM_s117: 87 nodes, every stub rebuilds byte for byte, Shared Library c9e9a34fbb80.
MEASURED: Code text 3,244,018 -> 1,810,503 = -1,433,515 (same figure as on s116; the J3 folder re-measured by the same script gives 3,243,982 -> 1,810,467 = -1,433,515). Prompt 0.
R1b still waits on pkgR1's two clean runs.
