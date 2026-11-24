# W1 grade: aar/w3/aar_rows_135_142_corrections_draft2.sql (md5 039a5bd3, commit 64256874)
VERDICT: FAIL (D1 only).
D1: the file inserts no ask_aar_builders rows for the eight new snapshot ids. ask_aar_grades_check() looks the builder up by snapshot_id = the new id; with none it returns "no builder row" for every md5_written of the new rows (function source read 2026-11-23 20:1x CST). Prior correction rows carry their own builder row (snapshot 132, prior 123: builder row 113). Fix: in the same transaction, one ask_aar_builders insert per new row, snapshot_id = the new id, builder_seats and sources copied from builder rows 116 to 123.
Verified, no fault:
1. All 48 file md5s (PUT, put_full, fetchback, revert, targets) recomputed by md5sum on the mount: equal.
2. put_engine/put_child of all eight are four-key cuts (name, nodes, connections, settings) equal to put_full.
3. put_full equals the graded target by node parameters and connections for 573, 575, 576, 562 (W1 Wall 11191 B1); 581 equal by file md5.
4. Trigger logic read: expected md5_match TRUE for 573/575/576/581/562, FALSE for 559/549/561. Correct.
5. Grade citations against Wall heads: 10966, 11060, 11101, 11089, 11130 (70486d9a = md5sum of write559_560.sh), 11132, 11142, 11145, 11146, 11164.
6. 42 jsonb literals parse.
Answers: (a) W3 equal_to elements acceptable (non-builder, mechanical, independently confirmed by 11191 B1). (b) No equal_to for 549 or 561: only the change equals, not the file; FALSE is the honest value. W4 11192/11193 settles the 561 seven lines as base.
Nits: N1 the 562 W1 11146 element (planner statement, verdict_norm PASS) contradicts the header "grades hold grade posts only"; move to sources. N2 add 11191, 11192, 11193 to sources of rows for 549 and 561.
