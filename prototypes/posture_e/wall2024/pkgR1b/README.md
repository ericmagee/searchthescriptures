# pkgR1b write file on live s119 (W1, 11-10)
File /mnt/project-files/wall2024/parent_s119_R1b.json, sha256 0f7834baf1fdb688dce0f95ef5350494e1ca74a601343826d2c608f020d4fba3 (5,780,439 bytes).
Built by `node pkgR1b/build_R1b_s119.cjs fetchback_live_s119.json <out>` from pkgLIB_R1bM_s119 (Shared Library a3ae774acdcc). Output: build_R1b_s119_out.txt.
Checks: 87 stubs rebuild their sources byte for byte; each source equals what live s119 runs (for live stubs, the source the live Shared Library rebuilds); the E4 heads (Alternate Build, Early Alternate Build) stay equal to live, and Alternate Build's library entry rebuilds the same 336,233-character source; 418 nodes, connections unchanged, only jsCode changes; 46 nodes change (Shared Library + 45 newly packed nodes; the 40 existing stubs are unchanged).
MEASURED: Code text 3,245,024 -> 1,812,268 = -1,432,756; prompt 0.
CORRECTION: the earlier R1b figures (-1,433,515 on J3/s117/s118, -1,434,098 on s119; W2's second measure used the same method) replaced Alternate Build with the plain stub. The write file must keep the E4 head (as pkgR1 did), which is 1,342 characters longer. The true saving on s119 is -1,432,756.
Not done: replay of saved runs for the 45 newly packed nodes. Grades: none yet (W2 4484 was a size confirmation only).
