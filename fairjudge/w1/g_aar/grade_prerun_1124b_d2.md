GRADE: pre-run objectives, second sheet, draft 2: aar/w3/prerun_objectives_1124b.md a7d20478 (commit 1127c4e6). W1 (session_01H1X3ANxr57MZvsu7fHB9kh), seat 34.
PASS WITH N1, N2.
COMMIT: this file.
RULES READ: Wall manual s7.4 order for the skeleton; TWO LIVE RUNS (10:38 CST); W3's section 20 asks.
OBJECTIVE MET: yes. Each item names its ASK's objective and what the run must show, split by "always" and "ONLY IF".
STANDARD (ASK 599): not applicable; no code.

Diff from draft 1 (d33ff2d1): the title line, the pairing line, and section 11a. Nothing else changed.

Checked against live code: the engine as written, fetch-back 30ec23d1 (= my live fetch, Wall 11743).
- 15 (ASK 608): stop lines beginning "ENFORCER:" are present; enforcer_seat and enforcer_barred each appear in Resolve Seats. Matches.
- 16 (ASK 607): the Library push carries rfs:'pkgFRM' on "the CHANGE TO line has no line form the engine reads". The gate cure gives "pkgFRM refused the gate change; the judge's line before the change stands (recorded, no seat removed): ...". The E-GATE row's cure_reason is built as 'GATE '+ans+' TO: ...' + ' | ENGINE: ' + item why + ' | ' + cure why + ' (RECORD-ONLY)'. So the EXPECT holds. See N2.
- 12 and 17: the review_notes line is built as "JUDGE ORDER v"+version+": panel list ...; alternates list ... | SEATED: ...". Matches.
- 14 and 11a (ASK 601): seat sonnet is anthropic/claude-sonnet-5.5 (model_config). That is the claude challenger's model, as on 42283 (challenger_model anthropic/claude-sonnet-5.5). So sonnet must stand out of the SEATED. Defender opus (anthropic/claude-opus-5.5) is not in the judge order. 11a is right.
- 11a pairing: odv1_launches 101 reads challenger claude (plain), defender opus (oracle). Matches.

N1 (fact): the run did not start about 17:05 CST. Launch 101 was at 22:44:11Z and execution 42373 started at 22:44:11.9Z, so 16:44 CST. 17:05 is when the operator said a run was going. Correct the title line.
N2 (wording): debate_enforcer_log has no "result" column. The whole mark for item 16 is in cure_reason: it begins "GATE CHANGE TO:", carries "pkgFRM refused the gate change; the judge's line before the change stands", and ends "(RECORD-ONLY)". cure_status reads UNCURED. Say "cure_reason" where the sheet says "result".
