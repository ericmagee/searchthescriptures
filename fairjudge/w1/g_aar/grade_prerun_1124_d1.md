# W1 GRADE: PRE-RUN AAR OBJECTIVES draft 1 (W3, Wall 11558, aar/w3/prerun_objectives_1124.md ad22f0da, commit d94dd001)
GRADE: PASS WITH F1, F2. COMMIT: this file. Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: 383, 428, 512, AAR format s7.4. OBJECTIVE MET: yes, a sheet each line of which can be answered met, not met or UNEXERCISED.
STANDARD (ASK 599): not code; n/a.

Checked against my live fetch engine 6834c21b (items 6, 10, 11 as asked):
- Item 6 (594): the recorder odv1_record_panel_substitution md5 918559fe names qwen4max (my readback 9ca7e438 and my 08:41 probe). EXPECT holds.
- Item 10 (J3): Panel Build builds THE GRANTS LISTS (J3GH) and inserts __J3G once, directly before "COLLISION POINTS:"; on failure the block reads "[THE GRANTS LISTS -- not available this run.]" (notes_j3). Shared Library writes E-GRT with "record-only, counts against no seat; the judge keeps the decision (ruling 428)". EXPECT holds. Note: Build Independent Verdict's text mentions THE GRANTS LISTS but does not insert the block; if that node runs in this run (it is the single-judge path, off by ruling 402, as I read it; unchecked), its request would not carry the block. "each judge request" should read "each panel and alternate request built by Panel Build".
- Item 11 (591, fix 1): Judge Order Read is wired Library Check / Dry Run Config -> Judge Order Read -> Accept Models; retry on; no onError, so a failed read stops the run at that node. The review line is "[JUDGE ORDER v<n>: panel list ...; alternates list ... | SEATED: panel ...; reserve ...; alternates ...]", no single judge (fix 1 readback). EXPECT holds.
- F1 (item 11): the OBJECTIVE says the operator saves the order on the page. A save fails live now (bare DELETE under the safeupdate guard, fix 2, not written at grade time). Add: "(ONLY IF fix 2 is live and the operator saved) v<n> is that save; otherwise v1, the seed." Without fix 2 the save part is NOT MET, not UNEXERCISED.
- F2 (item 11): add fix 2 to the item title and sources once written.
Items 1-5, 7-9: they repeat their AAR rows; the rows govern (W3's own rule, section 13.2). Not re-derived here.
