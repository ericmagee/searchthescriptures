# ASK 417 plan rev 1 (W3): the exercise query

Assignment (W3 Wall 8826): plan W3, build W2, grade W1 and W4. A tool in git; no engine node, no model setting,
no database object is created or changed. Read-only SQL.

## What it does
Given one run token, it prints one row per live package: ASK, evidence read, CASE (did the run give the package
something to act on), FIRED (count), and a grade word:
- EXERCISED: the case occurred and the package's mark is present (count > 0).
- NO CASE: the run gave the package nothing to act on; silence is correct.
- MISSED: the case occurred and the mark is absent. This is the row a grader must read by hand.
- NOT IN DB: the evidence lives outside the database (for example the Drive export); a seat reads it by hand.

## Parts
1. registry.json (git, a417_w2/): one entry per package: ask, title, live_since (engine version id),
   case_sql and mark_sql. Each is a SQL boolean or count expression over a fixed set of sources for the run:
   r = debate_results row (by run_token), j = debate_judgments rows (by debate_id), e = debate_enforcer_log rows
   (by run_token), x = debate_errors rows (by run_token). No other source.
2. exercise.sql (or a node script that emits one SQL statement from the registry): reads the registry, evaluates each
   entry for the token, and returns the table. The statement is SELECT only.
3. A package leaves the registry only when the operator retires it; a new package gets its entry when it goes live,
   taken from its plan's DONE WHEN (ASK 411). The planner of each package writes its entry; the builder of 417 adds it.

## Starter registry (from the run 39266 grade, W3 8835, W4 8840)
| ASK | case | mark |
|---|---|---|
| 374 prompt | e: an E-ASSUME row whose item starts "CHALLENGER PREMISE" | r.engine_r3 holds "ASSUMES:" (count) |
| 374 step 2 | e: E-ASSUME CHALLENGER row with cure_reason starting "BOTH NOT STATED" AND a judgment line "D<k> vs C<m>" graded DEFENDER LINK BROKEN with m = that premise | the refusal text in j or e (count) |
| 376 | e: K-V rows whose reply or cure text holds "exclu" | K-V rows CURED by the KV_EXCL kind (count) |
| 394 s11 | j: a line "D<k> vs C<m> (...): STANDS" | that line counted as graded (AUDIT text) |
| 399 / 402 | j: a retracted link (ret386 list non-empty) | "[AUDIT v62" in j (count) |
| 404 | j: a v61 tag with VERDICT BROKEN and CHALLENGE STANDING not SELF-SUPPORTED | WORD UNDERDETERMINED in that tag |
| 405 | always | "[AUDIT v63" in r.review_notes (count of mark-after lines) |
| 406 | "[AUDIT v57" in r.review_notes | "(ASK 406 forms:" on that line |
| 407 | r.drv_removed not null | "ALTERNATE TRIED, SEATED" in r.drv_removed |
| 408 | always (Oracle seat) | "sperma" in the defender's rounds (count) |
| 409 | always | no "pkgREFP" in x or any stored field; run status success |
| 396 | always | NOT IN DB (Drive export line "OPEN ENFORCER DISAGREEMENTS") |
The case and mark wording above is the plan's; W2 writes the SQL and may sharpen a probe, saying so on the Wall.
ASK 400, 401 and 403 have no probe yet: their planners name one, or they are listed as NO PROBE.

## DONE WHEN (ASK 411 evidence)
1. On run 39266 the tool reproduces the graded table: EXERCISED 374 prompt, 404, 405, 407, 408, 409; NO CASE
   374 step 2, 376, 394 s11, 399/402; NO CASE or MISSED for 406 as its probe decides (no v57 line in the run);
   NOT IN DB 396. Any difference is either a fault in the tool or in the grade, and is named on the Wall.
2. On run 39015 (before most of these packages were live) every package live after that run reads NO CASE or
   is skipped by live_since, never EXERCISED.
3. The statement runs read-only (no INSERT, UPDATE, DELETE or DDL in the text).

## Limits
A probe reads stored text; a package whose mark is only in the n8n execution or the export cannot be graded by it.
A probe that matches loosely can call a package EXERCISED that did not fire; each entry's grader checks the probe
against one stored run where the package is known to have fired and one where it did not.
