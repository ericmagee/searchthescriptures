# pkgR1: the 12 three-copy nodes move into the Shared Library (W1, 11-10)

Approval: ASK 9 option 1, Eric 08:29 CST 11-10 ("i approve your all your recommendations"; thread msg cmsg_017ZQamDMHrS6fqMHnQDVo58AqgQQM8PDapwEekd3HWJCF).
What changes: 12 Code nodes become pkgLIB stubs (form 3) and their lines join the Shared Library. Nodes: Send Back Record, Alt Send Back Record,
R2 Alt Send Back Record, Send Back Build, Alt Send Back Build, R2 Alt Send Back Build, Judge Enforcer Build, Alt Judge Enforcer Build,
R2 Alt Judge Enforcer Build, Judge Enforcer Record, Alt Judge Enforcer Record, R2 Alt Judge Enforcer Record.
No source text changes: each stub rebuilds its live code byte for byte and runs it unchanged. Prompts, model calls and log rows: unchanged.

Base: live s106 (fetchback_live_s106.json = s105 + pkgCSS; pkgCSS touched only Close Enforcer Build and Close Enforcer Record, which R1 leaves as live).
Write file: pkgR1/parent_s106_R1.json (418 nodes; 13 differ from live s106: the Shared Library and the 12). Built by:
  node pkgR1/build_R1.cjs /mnt/project-files/wall2024/fetchback_live_s106.json pkgR1/parent_s106_R1.json
Sources: pkgLIB/strip_R1/patched (the 30 library sources of pkgLIB/strip_KRO2_KSL + the 12 live sources). Pack: pkgLIB_R1 (gate/pack.cjs, STUBV 3).

Size (MEASURED on the write file against live s106): Code node text 4,962,113 -> 3,838,493 = -1,123,620 characters (22.6%).
Shared Library 604,776 -> 913,804. Each of the 12 nodes goes from 47,927-173,307 to 1,666-1,883 characters.
Run time (MEASURED, pkgR1/time_R1_out.txt): a stub rebuild takes 2.61 ms on the live library and 3.10 ms on the R1 library (+0.49 ms per library node run).

Results against the labels (pkgR1/labels_R1.md, committed fc44e4cb before the build):
- L1 PASS: all 42 stubs rebuild their sources byte for byte from the new Shared Library; the 12 sources equal live.
- L2 PASS: the 30 existing stubs are byte-equal to live s106; Alternate Build and Early Alternate Build E4 heads equal live.
- L3 PASS: each new stub names every node its source names; none of the 12 reads $execution, $env or $prevNode.
- L4 PASS: each R1 node run as its live full source and as its stub through the runner model, on every saved run holding its data
  (35 to 44 runs per node): all outputs byte-equal (pkgR1/test_R1_out.txt). The same error on both sides: Alt Send Back Record 1 run,
  Judge Enforcer Build 8 runs (saved data incomplete in those runs).
- L4b PASS: the R2 Alt nodes have no saved run; run on the Alt nodes' saved data with names mapped R2 Alt -> Alt: all byte-equal.
- L5 PASS: 418 nodes, connections, names and ids unchanged.
- L6: -1,123,620 (label said about -1,124,962, the survey figure; the survey's control pack showed 1,342 characters of repack noise in the 30 stubs,
  and here the 30 stubs equal live).
- L7 PASS: +0.49 ms per stub rebuild. The timing line printed by test_R1.cjs is NOT a valid measure (the full-source run goes first and pays the
  saved-file reads from the shared folder); time_R1.cjs is the measure.
- L8 WITHDRAWN (my label error): gate/replay.cjs compares base and candidate SOURCES; R1 changes no source, so the gate would compare identical
  code. L4 is the test of the change (stub against full source on saved data).
Tests: node --max-old-space-size=12000 pkgR1/test_R1.cjs /mnt/project-files/wall2024/fetchback_live_s106.json ; node pkgR1/time_R1.cjs
Risk to note for the write: after R1 every one of the 42 stubs reads a 913,804-character Shared Library; a write that leaves the Shared Library
and a stub out of step fails that node with "rebuilt source is N bytes, expected M". Write all 13 nodes together.
