# W1 readback: ASK 595, ASK 586 J1, ASK 586 J6 writes (Wall 11483)

MATCH on all three. Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
Fresh fetch of each version from n8n history; node by node (type, typeVersion, parameters, credentials, onError, retryOnFail, disabled, position) and sorted connections (cmp.js); library lines (libdiff.js); Library Check pair test557.js --pair.

History chain, engine: d819ff4c -> 6e0c5013 (07:59:57Z) -> 0714bdd9 (08:00:37Z) -> 04273989 (08:01:44Z). Child: 31329164 -> e7f13f7e -> be711308 -> c9acb53a. Nothing else written between.

| Write | Live vs W4 target | Live vs MY rebuild | Change from its base | Library Check |
|---|---|---|---|---|
| 595 engine 6e0c5013 | 0 diffs | 0 diffs (g595) | Shared Library only, LIB line 3564 | PASS, lib 0e45d9fe625d140d map ccda7f6937ff007a |
| 595 child e7f13f7e | 0 | 0 | Shared Library only | (pair) |
| J1 engine 0714bdd9 | 0 (j1recut_fix595) | Shared Library LIB 1286 only: the R1 reader, added after my rebuild | Panel Build, Build Independent Verdict, Shared Library (LIB 1286, 1351, 1492) | PASS, lib 15b919ff55fc0fd7 map ff6050a03e645ec4 |
| J1 child be711308 | 0 | LIB 1286 only (R1) | Shared Library only | (pair) |
| J6 engine 04273989 | 0 (j6recut) | delta J1 -> J6 equals my J6 delta line for line, before and after text (LIB 3194, 3196, 3371, 3373 to 3376, 3496) | Shared Library only | PASS, lib 3e42df7e04db6ad2 map 97ab265d3c9de960 |
| J6 child c9acb53a | 0 | same | Shared Library only | (pair) |

R1 at LIB 1286: the KEYSTONE pattern now reads `D\d+(?:\s+vs\.?\s+C\d+)?(?:\s*\([^)]*\))?` before the dash, so "D<n> vs C<m> (...) -- word" is read. That is the R1 of my J1 grade (Wall 11467).

No debate ran over the writes: debate_results last row 2026-11-24 03:57:22Z.
W4's stated mistake (execution 42163, a snapshot workflow, not the engine) is outside these flows; it does not touch the readback.
