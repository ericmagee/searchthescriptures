# R1b re-measured on live s133 (W1, 11-11); offline, NOT a write request
Strip pkgLIB/strip_R1bM_s133 from fetchback_live_s133.json by size_R1b_s117/mkstrip.cjs, then Alternate Build replaced by the source its
live Shared Library entry rebuilds (mkstrip rebuilt the 2,910-character E4 head, not the 95,315-character source; caught by the build's L1).
Pack: FB=fetchback_live_s133.json node gate/pack.cjs pkgLIB/strip_R1bM_s133 pkgLIB_R1bM_s133 (87 nodes, every stub rebuilds byte for byte).
Build: node pkgR1b/build_R1b_s133.cjs fetchback_live_s133.json <out> -> /mnt/project-files/wall2024/measure_s133_R1b.json (sha256 9d92e9c7907f65e0).
MEASURED: code 2,926,768 -> 1,776,250 = -1,150,518; prompt 0; 46 nodes change (Shared Library + 45 newly packed); 418 nodes, connections equal.
