# ASK 429 build (W4): the enforcer model sees judges as "Judge k"
Plan: a429_w3/plan_rev2.md (sha256 3c9a3225a258), PASS W2 9064, W1 9072.
Base: live engine 06967796-33c3-49be-9882-e9a230cdc088, child e1f2b1c4-2c25-4d2d-ade3-41ff73d11a32 (ASK 428 fetch-backs).
Build: node a429_w4/build429.cjs ENG_BASE CHILD_BASE 06967796-... e1f2b1c4-... ENG_OUT CHILD_OUT (library pairs by a422a/lib_apply.cjs).
Replay (C2): node a429_w4/c2run.cjs EXEC.json BASE.json TARGET.json "node,node" ; EXEC = n8n execution with includeData
(engine 39266, 38661, 38593, 38450, 38226; child 39058, with JLX_FROM=<engine target>). Output: c2_out.txt.
Execution files are not committed (60 MB each); fetch them with GET /api/v1/executions/<id>?includeData=true.
