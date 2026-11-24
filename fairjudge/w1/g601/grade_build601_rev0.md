# GRADE: ASK 601 build rev 0 (W4, ask601/w4/b1/, commit 14d11f87; notes601.md 893bc98e). PASS WITH N1 TO N4. COMMIT: see git log.

W1 (seat 34, session_01H1X3ANxr57MZvsu7fHB9kh). To W4, the coordinator.

RULES READ: plan 601 7aab840d (PASS, Wall 11612, 11616); build rule (fresh live base, touched nodes only, no model settings); scope rule; ASK 599 standard; TWO LIVE RUNS.
OBJECTIVE MET: offline, yes; live, after the write and two clean runs with a claude debater against another Anthropic debater.
STANDARD (ASK 599): the model match is written in four homes as the plan states and explains; T5 shows the page copy equals the engine on the 90 engine pairs. No cut, no new limit, no list typed in.

## ENGINE (my own runs)
- Rebuilt with build601.cjs on MY fetch of live ff7ab4cf: the result equals target_engine_601.json (9cb87181) node for node (423/423, 0 diffs). Init Seats 7949df51 -> 0579c436; Resolve Seats 767dc7b0 -> ffb7b688.
- Target against live ff7ab4cf: only Init Seats and Resolve Seats changed; connections same.
- T1 rerun against my live: output equals out_t1_601.txt: 90 pairs, 88 equal, 2 differ (claude vs opus, opus vs claude): sonnet dropped "runs the same model as a debater (anthropic/claude-sonnet-5.5)"; panel sol62, spark, sol unchanged.
- T1b rerun: equals out_t1b_601.txt; with sonnet first on the panel list the target fails closed with the reason.
- Standing set on target + live child ecdc6218: 29 PASS, 0 FAIL. Pair: LIB 47a39128fec62d31, MAP efe8431fb6af14e1; PASS.

## DB (read-only checks; W4's T2, T3, T5 not rerun by me)
- Live functiondef md5s: odv1_record_panel_alternates 39d84307, dash_judge_lineup caea9e6c: equal to fix601_db.sql's gates.
- Each anchor I counted stands exactly once in the live text (alternates: the declare line and "IF v_am IS NOT DISTINCT FROM v_rmm THEN"; page: "FOREACH s IN ARRAY ord0 LOOP" and "ELSE pfree0 := pfree0 || s; END IF;").
- The page's new branch sits after the family branch, as Init Seats' condition sits after the family check. G-SAME sits after G1 and before G2; T3 shows 42071 spark->sonnet still raises G1, as before.
- The function writes only debate_results (UPDATE) and reads debate_judgments; t_db_601.sql redirects both to temp tables, so the test wrote nothing public. I did not run it (DDL in pg_temp has hit the approval timeout before).

## NOTES
N1: revert601_db.sql is not rehearsed (W4 states it). It is gated on anchors and the restored md5. The card should say so in plain words.
N2: the three homes read the models from different sources: the engine from the Accept Models rows; the page from model_config_jfl WHERE active; the alternates function from model_config with no active filter. They agree on today's rows (T5); a row active in one and not the other could split them.
N3: alt_dropped does not list a panel-list seat dropped by Init Seats (W4 states it; already true for family drops). Today sonnet is on the alternates list only.
N4: T1 runs 90 pairs (the ten engines the engine accepts); the plan said 240. T2 runs 240 on the page. State the 90 in the plan or the card.
