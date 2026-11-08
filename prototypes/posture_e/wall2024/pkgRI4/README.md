# pkgRI4: reader phase 2 item 4, FORCED reads (W1, 11-08)
W3 order /mnt/project-files/w3/reader_p2_order.md item 4 (tracker RP2-4). Each read asks the shared reader first (FORCED form, a pair, not RESTATED);
where the reader reads no such line, the old regex decides as before (pkgSBR/pkgSBX rule). KF_LINE's field parse was already on the reader (pkgKFN).
- kfLines, kffLines, kfcLines (30 library nodes, x3 each): the "is this a FORCED line" test.
- cureVerdicts (26 nodes, x3): the FORCED-line filter on the cure reply (K-F, K-FF, K-FC cures).
- gateForced2024 (10 nodes): the FORCED-line filter on the gate reply, id (pair from the reader) and sideOf (MEANS round from the reader).
Base: pkgLIB/strip_A2R_RI3B_G33731 (= LIB v28, graded W2 3249, W3 3250). Out: pkgLIB/strip_RI4, packed as pkgLIB_v29_RI4 (Shared Library a689e0dbe16e; 30/30 stubs unpack).
Test (test_strip_RI4.txt): 30 node checks; replay 566 node runs over 40 runs, 0 changed outputs, 0 cure flips, 0 uncured changes, 0 NOT APPLIED changes. TOTAL 32 OK, 0 FAIL.
Rebuild: node pkgRI4/build_RI4.cjs && LIB_N=30 node pkgLIB/pack.cjs pkgLIB/strip_RI4
Write: after v28, Shared Library -> a689e0dbe16e plus the 30 stubs from pkgLIB_v29_RI4/patched (no other node changes).
