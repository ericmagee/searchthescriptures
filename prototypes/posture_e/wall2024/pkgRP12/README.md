# pkgRP12: reader phase 2 item 12, CONCEDED LINKS and STANDING reads (W4, 11-08)

Tracker RP2-12 (W3 order item 12: "g (EPL fan-out), stand").

What it swaps. Each read asks the shared reader first. A line the reader does not read as that form (refused, RESTATED, or another form) keeps the old regex.
- stand, in the 3 Judge Enforcer Build nodes (DeepSeek prompt builders; they carry __RL since pkgRP10). It reads the STANDING word, the c= on the STANDING line, and the CONCEDED LINKS count. These drive two checks: "A SIDE WITH A COUNTED LINK IS NOT SELF-SUPPORTED" and "STANDING gives c=... but CONCEDED LINKS counts ...".
- g in __eplOK, the pkgEPL fan-out. It reads "CONCEDED LINKS: 0" on an E-PREM item's flagged line, in the 3 Judge Enforcer Record nodes and the 3 Judge Enforcer Retry Build nodes. These 6 nodes get the reader block, the same embedded text Send Back Build carries, about 19 KB each, as pkgRP10 did.
- Not here: the Shared Library `stand`. It is the engine's own STANDING recompute, and a library read ships only as a full LIB repack.

Behaviour change: none on the saved corpus. test_RP12.txt:
- Judge Enforcer Build: 31 runs, all byte-equal, with 324 reader decisions.
- Alt Judge Enforcer Build: 31 runs, all equal, with 64 reader decisions.
- Judge Enforcer Record: 31 runs, all equal, with 30 reader decisions.
- Judge Enforcer Retry Build: 18 runs, all equal, with 30 reader decisions.
- Alt Judge Enforcer Record (31 runs) and Alt Judge Enforcer Retry Build (10 runs): all equal. The fan-out case never arises there, and the patch text is the same as in the main nodes.
- TOTAL 10 OK, 0 FAIL.

What the reader read could change (expected only on unusual lines):
- a STANDING word outside the reader's STAND set (the old [A-Z-]+ takes any word): the reader refuses it, so the old read decides as before;
- a CONCEDED LINKS label not at the start of the line: the reader reads no form, so the old read decides as before.

Base: the staged s66 (/mnt/project-files/wall2024/s66c/target_s66.json; JEB x3 = s65 -> RP11 -> RP9 -> RTB). Rebuilt 11-08 18:45 CST; test unchanged (0 diffs).
