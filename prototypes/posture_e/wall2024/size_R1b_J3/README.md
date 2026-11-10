# R1b re-measured on the joint of three (s115 + pkgBRF rev 4 + pkgCCM + pkgCMS), W1 17:5x CST 11-10; offline, nothing built for write
Base: pkgCMS/joint_s115_BRF4_CCM_CMS.json (sha256 fb4d025d2d3d39c9; two passes W3 4466, W4 4468; approved for write).
Method as size_R1b_s108/measure_R1b.sh: strip folder pkgLIB/strip_R1bM_J3 = pkgLIB/strip_R1R2_J3 (42) + 45 more nodes over 15,000 characters ($execution/$env/$prevNode nodes and Accept Build, Accept Check, Accept Final, Init Seats, Init with Guards left out); FB=<base> gate/pack.cjs pkgLIB/strip_R1bM_J3 pkgLIB_R1bM_J3; every stub rebuilds byte for byte (87 nodes, Shared Library 7ad6a6bd21f1).
MEASURED: Code text 3,243,982 -> 1,810,467 = -1,433,515. Shared Library 857,737 -> 1,248,822. Prompt 0.
Against live s115: 3,849,937 -> 1,810,467 = -2,039,470 for the joint of three plus R1b.
(s112 + pkgCMS figure was -1,427,392.) Not done: replay of saved runs for the 45 nodes; graders. R1b waits on pkgR1's two clean runs (ASK 9).
