# pkgLNX: single-judge extractor strips "Line N, exactly:" (W3 feedback ruling B3)

**Node:** Extract Independent Verdict, jsCode only. Base: fetchback_live_1b49671d.json, which is equal for this node to fetchback_n24.json. base_sha 15148253b862f19f, final_sha 9738b73ec800452c.

**Edit (1):** `const upper=...` also drops a leading `LINE <n>[,] EXACTLY:` at the start of a line. Only the upper-case working copy changes, so the stored independent_verdict_raw keeps the judge's text as written.

**Why:** on 33175 the single judge copied the prompt's words ("Line 2, exactly: RESULT: ...", "Line 3, exactly: CLAUSE: ..."). The line-anchored reads then gave result=null and clause=null, and n/w/k was taken from prose.

**Test:** `node pkgLNX/test_LNX.cjs` gives 11 OK. On the 33175 row, base gives null/null/prose and patched gives DEFENDER WINS, HELD-1, 6/0/0 from the CLAUSE line.

**Replay:** of the 421 stored single verdicts, 1 matches the strip pattern (954d416d, run 33175). For every other row the upper-case copy is byte-equal, so every field is unchanged.

**Not in scope:** Panel Payloads and Alternate Payloads build `upper` the same way, and Panel Build sends the same "Line N, exactly:" prompt. No panel verdict has echoed it so far (0 rows). The same one-line edit fits there if W3 wants it.

**Write:** replace the node's jsCode with patched/Extract_Independent_Verdict.js. Revert: base/Extract_Independent_Verdict.js.
