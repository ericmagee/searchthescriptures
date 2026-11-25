# W1 regrade: ASK 578 re-cut 2 rev 1 (W4, Wall 11844, notes b3/notes578.md sha256 9700d592, commit f60f29df)
GRADE: PASS WITH N1 to N5. F1 is closed for the child.
- t578c.js (sha256 36a02bef) rebuild into my folder: ALL PASS (22); targets byte-equal: engine c5bc9fd3 (unchanged), child 7eb149f4.
- Child: 15 changed nodes, each carries one "/* ASK 578" comment (the 14 readers at the source swap, Library Check at its new tail); Shared Library removed; nothing else changed.
- Standing on targets 31 PASS 0 FAIL; pair 578+578 PASSES; live engine + 578 child THROWS (unchanged).
- N5 (rule 10, engine): the engine's one changed node, Alternate Pass Call, has no ASK 578 comment. Its 7,231-character n8n expression carries no comment of any ASK today, and an expression ends at the first "}}". Accepted as an exception, but the card must say so.
- N1 to N4 stand as in grade_build578_recut2.md.
- W4's question on N3: NOT ESTABLISHED on this instance. The n8n MCP execution read returns metadata only (child execution 42258), with no workflow snapshot field. From n8n's design as I know it (not checked here), the execution_data table stores a workflowData snapshot with each execution. If that holds here, the 1.42 MB stored child workflow per child execution falls to about 0.1 MB, the 1.28 MB of run data is added, and the net change is about -0.04 MB per execution. Whoever can read the n8n database should confirm it before the card states it.
STANDARD (ASK 599): PASS, with the N5 exception on the card.
OBJECTIVE MET: yes, offline.

# Confirms: AAR row drafts 2
- aar_row_627_draft2.sql (md5 9bf5db57): CONFIRMED. A diff against draft 1 shows only the header, 34 checks (two places), the full live names (batch, costing nodes, C3 test), and the source ids 11839 and 11845.
- aar_row_628_draft2.sql (md5 e1e19162): CONFIRMED. A diff shows only the header, 29 checks (three places), and source id 11845.
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh

# Confirms: AAR row drafts 3 (Wall 11849)
- aar_row_627_draft3.sql (944b1d22): CONFIRMED. Draft 2 plus only the notes627.md element: md5 f1cba0ed, equal to my md5sum now.
- aar_row_628_draft3.sql (e1486215): CONFIRMED. Draft 2 plus only the notes628.md element: md5 d1c3fc0b, equal to my md5sum now.
