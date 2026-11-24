# GRADE: ASK 588 fix, the question round's transcript anchor (W4, ask588/w4/fixqr/). PASS WITH N1, N2. COMMIT: see git log.

W1 (seat 34, session_01H1X3ANxr57MZvsu7fHB9kh). To W4, the coordinator.

RULES READ: build rule (fresh live base, touched nodes only, no model settings); scope rule; ASK 599 standard; the operator's two-live-runs rule (10:38 CST 11-24).
OBJECTIVE MET: on the offline proof, yes; live, not yet (no run has fired the round; the two-live-runs rule applies).
STANDARD (ASK 599): the change adds no cut, no list and no limit. N2 below is a pre-existing copy, not added.

## CAUSE, CONFIRMED
- Live question round log row 1 (run ODV1-42234-501p8uuq, 16:40:08Z): status SKIPPED, why "QR Merge: a judge body holds no transcript anchor". The fault reached a live run.
- Live engine 6834c21b, Panel Build: user text = JFL block + "DEBATE TRANSCRIPT\n\n" + T; T = parts joined as "=== name ===", and parts[0] is ['TOPIC', topic]. So T opens "=== TOPIC ===", and the old anchor "DEBATE TRANSCRIPT\n\n=== [" cannot match while a topic is present. With the new anchor "DEBATE TRANSCRIPT\n\n=== " a body matches whether or not the topic is empty.

## BASE AND DIFF (my own compare)
- Live engine is still 6834c21b (get_workflow_details 16:5x Z). base_eng.json equals my fetch of 6834c21b: 423 nodes, no node changed, connections same.
- Target 857566f6 against live: 423 nodes; changed QR Merge, QR Follow Build, QR Follow Final only; connections same. In each, the only change is "=== [" to "=== " in const QR_AT. build_fixqr.cjs b84c2e62 asserts one occurrence per node.
- "DEBATE TRANSCRIPT" stands in four nodes of the live engine only: Panel Build and the three changed nodes.

## TESTS, RUN BY ME
- t_fixqr.cjs fc9d70fe, QR_E=live: T2.8 FAIL (the skip reproduced), then error at T2.10 (no anchor). T0.8 FAIL.
- QR_E=target: T2.1 to T2.13 PASS; T0.8 FAIL as on live (it compares connections with the 588 base; live and target connections are identical, so not this fix).
- W4's run stopped after T2 (libfn reads target_engine_588.json from the cwd). I ran it in a scratch copy with the target as that file: T3 to T6 PASS (the parsers read the same eight rounds with the block inserted before "=== TOPIC"); 80 PASS, 2 FAIL (T0.8 above; T7.1 compares with the old 588 child, not the live child).
- Standing set on target + live child ecdc6218: 29 PASS, 0 FAIL. Pair: LIB 47a39128fec62d31, MAP efe8431fb6af14e1 on both; PASS.

## NOTES
N1: the anchor is found with indexOf (first match), and the gemini path takes the first part holding it. A JFL block or a prior-history part placed before the transcript that held "DEBATE TRANSCRIPT\n\n=== " would catch it first. No engine node writes that text besides Panel Build; the JFL text comes from the database and I did not search it. The same was true of the old anchor.
N2 (pre-existing): QR_AT is typed in three nodes. Under the standard it belongs in one home (the Shared Library). Not for this fix (scope).
