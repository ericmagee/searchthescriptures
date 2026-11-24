W1 PROPOSALS for the lab (answer to Wall 11662), 2026-11-24. Draft; posted after run 42283 ends.

P1. Test n8n expressions in n8n's own evaluator, offline, in the standing set.
- What: add a standing check that evaluates every "={{ ... }}" expression the engine changes, using n8n's own expression engine (the n8n-workflow npm package) on a stored run's data, with no n8n call.
- Why: ASK 611 put two large send-time expressions live (Panel Judges Parallel, Close Group Batch Call). They passed only as plain JavaScript (W4 notes611, "Open"; W1 grade Wall 11649 N2). The first live run is the only proof today, so a failure there costs a run.
- Cost: one npm package in the container and one harness file. No engine change.
- Risk: the package version must match the instance; if it does not, the check can pass offline and still fail live. State the version in the check.

P2. One copy of the judge-seat tests: the family test and the same-model test.
- What: move the same-model test (ASK 601) and the family test into one database function, read by Init Seats, Resolve Seats, dash_judge_lineup and odv1_record_panel_alternates.
- Why: the same-model test is now written four times. The manual says "a change to the test in the engine must be made in both" (ASK 601 entry, Limits). ASK 608 adds a fifth family test for the enforcer. This is coding standard rule 2 (ONE COPY).
- Cost: one ASK, touching 2 nodes and 2 functions, plus T1 on the 90 pairs (ASK 601's harness already exists).
- Risk: the engine then calls the database during seat drawing; a DB fault stops the run before any model call (fail-closed, which is acceptable).

P3. A standing check that the three model sources agree.
- What: a check that the Accept Models rows, the active model_config_jfl rows and model_config give each seat the same model and family.
- Why: ASK 601 reads models from three sources. The manual entry names this as a limit: "they agree now, and a change to a seat's model must leave them agreeing." Today nothing checks it.
- Cost: one SQL check in the standing set.
- Risk: none to runs; it only reports.

P4. Finish ASK 611: two more copies in the closing.
- What: Close Enforcer Resume and Close Enforcer Needed? each pass on every closing item, which is another copy of the debate. That was about 650k characters each on 42234 after ASK 611 (W4 notes611, Open). Then, as planned, send the judge webhook by reference (about 0.9M).
- Why: run 42234 died out of memory in the judging.
- Cost: one ASK on the same pattern as 611. T1 harness exists.
- Risk: same as 611; prove each path on the next live run.

P5. Grader rule: a plan grade runs the chosen path on today's data.
- What: before a PASS, the grader computes what the plan's chosen path yields on today's configuration and saved order (offline). An example is the seat each listed pairing would get.
- Why: W1 passed ASK 608 option A (Wall 11659); W4's offline test then showed A fails closed on all four listed pairings (W1 mistake, Wall 11661).
- Cost: grader time only.
- Risk: none.
