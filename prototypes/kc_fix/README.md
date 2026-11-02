# K-C false mark on "does not name" (run 32157 item B2)
- Base: ORACLE_DEBATE_V1 version 0a1e1b2d (live), 17 checker nodes that carry netLines.
- Change: NET_ANSWER masks "<round or side> does not name / never names / not named <witness>" before NET_STATE runs; a stating ground elsewhere in the clause still counts.
- Population test (SQL, all debate_judgments + independent_verdict_raw, same regexes in Postgres form): 582 old hits, 529 new, 53 removed, 0 added; all 53 removed clauses read: every one is the unanswered-witness test.
- unit.cjs: 5 fixtures (876, 878, 827 shape, two true K-C) correct; unit_all.cjs: all 17 nodes correct; all compile; write_nodes.py --dry: base matched 17.
- Not written. Undo when written: restore n8n version 0a1e1b2d.
