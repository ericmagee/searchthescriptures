# R1b re-measured on live s108 with pkgCMS (W1, 11-10; offline, nothing built for write)

R1b = move every remaining non-library Code node over 15,000 characters into the Shared Library (stub form 3), on top of pkgR1 (live) and pkgCMS (two passes, held).
Base: pkgCMS/parent_s108_CMS.json. Strip folder = pkgLIB/strip_R1R2 (42) + 45 more nodes; packed with gate/pack.cjs (FB = the base); every stub rebuilds byte for byte.
Left out (read $execution, which a stub does not pass on): Init with Guards, Accept Build, Accept Check, Accept Final.
(The s105 survey moved 65 more nodes; after the comment strip fewer nodes are over 15,000 characters.)

Measured:
- Code text s108+pkgCMS 3,223,081 -> 1,795,689 = -1,427,392 (-44.3%). Shared Library 845,004 -> 1,234,849.
- Against s106 (before pkgR1): 4,962,113 -> 1,795,689 = -3,166,424 (-63.8%) for R1 + R2 + R1b together.
- Stub rebuild time: 4.0 to 4.4 ms per node run (Panel Build, Panel Payloads, mean of 20); 1.8 ms on s105, 2.7 ms with R1.
- No prompt text, no model call, no ruling changes.
Not yet done: replay of saved runs for the 45 nodes, graders. Approved order (ASK 9): R1, then R2, R1b after R1 is proven.
Reproduce: steps in measure_R1b.sh.
