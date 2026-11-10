# pkgR1 labels (W1, written before the build, 08:40 CST 11-10)

R1 (Eric's approval, 08:29 CST 11-10, "i approve your all your recommendations", ASK 9 option 1): move the 12 three-copy nodes into the Shared Library
(stub form 3), on live s105. Nodes: Send Back Record, Alt Send Back Record, R2 Alt Send Back Record, Send Back Build, Alt Send Back Build,
R2 Alt Send Back Build, Judge Enforcer Build, Alt Judge Enforcer Build, R2 Alt Judge Enforcer Build, Judge Enforcer Record, Alt Judge Enforcer Record,
R2 Alt Judge Enforcer Record. Source text of every node unchanged (no comment strip; R2 is a separate package). Nothing a judge or model reads changes.

Expected results (each must hold; any other result is a FAIL):
- L1 Every one of the 42 stubs rebuilds its live s105 source byte for byte from the new Shared Library.
- L2 The 30 existing library stubs are byte-equal to their live s105 stubs (form 3: only the library node and the 12 new stubs change).
- L3 Each new stub names, in literal $() calls, every node its rebuilt source names, and carries a non-literal $() where the source has one
     (runner model); none of the 12 sources reads $execution, $env or $prevNode.
- L4 Whole-node runs: each of the 12 nodes, run as its live full source and as its stub through the runner model on every saved run that holds the
     node's output and input, gives byte-equal output (or the same error). Expected: 0 differences.
- L5 Write file: 418 nodes; only the Shared Library and the 12 nodes differ from live s105; connections, names, ids, positions unchanged.
- L6 Size (measured on the write file, against live s105): about -1,124,962 characters of node text (survey figure); prompt change 0; model calls 0.
- L7 Stub run time: about 2.7 ms per stub rebuild (survey figure), under 50 ms per node run.
- L8 gate/replay.cjs, base pkgLIB/strip_KRO2_KSL, cand pkgLIB/strip_R1 (the 30 sources plus the 12): GATE PASS, every node run byte-equal.
