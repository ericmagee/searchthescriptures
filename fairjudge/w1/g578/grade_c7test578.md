GRADE ASK 578 C7 test workflows (ask578/w4/c7/, git f19ac973; c7_child.json 7392aa01, c7_parent.json a7df6562, gen578c7.cjs ac970606; Wall 11746): PASS WITH N1. COMMIT: this file.
RULES READ: my conditions, Wall 11683; ASK 578 plan rev 3 C7 and my grade (c7dbf1f6); op doc v145 §7 (execution reads); standing rule, no system change without the operator's approval (the card comes first).
OBJECTIVE MET: yes. The test isolates the two questions (a) and (b) and nothing else.
STANDARD (ASK 599): test code, one-time; no dead code; not applicable beyond that.

Checked by me:
- gen578c7.cjs re-run on my own live fetch of engine 20db58ee: c7_child.json 7392aa01 and c7_parent.json a7df6562, byte-equal to W4's. The Shared Library copy is the live one (1,203,331 characters).
- Conditions of Wall 11683, each met in the JSON: full JSON in git; no credentials on any node; no webhook, schedule or cron node (parent: manualTrigger, code, executeWorkflow, code; child: executeWorkflowTrigger, code); no "active" key, so created inactive; run once by hand; deleted after with the deletion read back (stated in Wall 11746, to be shown in the result post).
- Alternate Pass In in the test child equals the real child's node (executeWorkflowTrigger 1.1, same parameters). Alternate Pass Call in the test parent equals the real node in type, version 1.2, source, mode once, waitForSubWorkflow, schema and mapping; only the workflow id and the pass expression differ, and the expression is the one field the plan adds.
- The Shared Library copy is not connected, so it never runs; Compare reports isExecuted, so (a) is shown on a node that did not run.

N1: the test passes 1.2 MB; the real call will carry about 9.1 MB (7.9 MB today plus the library). So C7 shows (a) and (b) but not the payload limit. The operator's card for this test, and the 578 write card, must say that the limit stays NOT ESTABLISHED after C7.
Note: the run is in manual mode, the engine runs in trigger mode. The expression is resolved the same way in both; if (a) fails, that difference is the first thing to check.
