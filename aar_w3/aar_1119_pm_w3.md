# AAR draft rev 1 (replaces rev 0 24777d5e: the stray message time read from W1's thread, and the operator's 497 test release added) (W3, seat 33): work since AAR rev 12 (11-19, from 13:17 CST)

Covers: the ASK 494 A2 proving run (run 40891), the ASK 497 rolled-back test and write, ASK 498, the ASK 494 A2 write, E5 T0, and the slips. Read from SQL at 13:38 CST: the Wall through 9972; audit_log max id 38994; ask_aar_snapshots holds 17 rows (ids 3 to 19), sequence last value 19; engine manual v218, op doc v135; neither ask_aar_snapshots_check() nor ask_aar_grades_check() exists yet. Results that have not landed are marked [PLACEHOLDER].

NOT YET means no source shows the objective either way. IN PART means part of it is shown.

## Objectives, and whether each was met

| Item | Objective | Met? | Why |
|---|---|---|---|
| 494 A1 (proving run 40891) | "Today anyone holding the public (anon) key can call rpc/record_debate_row and the other engine write functions. With them they can write a forged debate row, judgment or outcome. Close that, and keep every engine run saving." (plan494.md; A1 is the credential half) | [PLACEHOLDER: P1 to P6 results] | Released on the operator's card "Release the run" at 13:22 CST (W4 thread). Started 13:24 CST, run token ODV1-40891-umeouul3, spark/oracle against gemini/plain (W4 9944). P1 to P6 readings and two non-writer checks: [PLACEHOLDER]. Run row: template aar_494a1_run_template.sql e6c5c08e, map aar_run40891_map.md 495a3b55 (both PASS, W1 9956 and W2 9955); new row with prior_row 16: [PLACEHOLDER id and md5]. |
| 494 A2 (anon EXECUTE revoked) | Same objective (plan494.md); A2 is the revoke half. | [PLACEHOLDER] | Waits for the run 40891 result. Card text draft card_text_494a2_draft.md 1a9e41f4 and engine manual draft em_pairs_494a2_draft.json 4e62e1ef, both read by W1 (9958) and W2 (9959). Card, audit, readbacks: [PLACEHOLDER]. |
| 497 | "Any row in ask_aar_snapshots not written by the coordinator, and any removal or disabling of the table's guards, is found and reported to the operator before the AAR that would rely on it." (plan497.md rev 5) | [PLACEHOLDER] | Build rev 1 (step497.sql 6df72062, test497_rollback.sql f518f541, revert497.sql 5cac5883) PASS by W2 (9921) and W1 (9925). The operator released the rolled-back test at 13:36 CST, and W4 is running it (the coordinator's message to W1, 19:36:55Z). Result and readbacks: [PLACEHOLDER]. Write card, audit, readbacks: [PLACEHOLDER]. Manual entries: op doc pairs od_pairs_497.json 692632a6 (W2 9943, W1 9945), engine draft em_pairs_497_draft.json 8a7e1ae6 (Live line open): [PLACEHOLDER written versions]. |
| 498 | "... Expected effect: for every snapshot row, a read shows whether each written md5 had PASS grades from two distinct seats that did not build it, and a row that falls short is reported in the AAR. Rows already inserted are not changed." (plan498.md rev 3 79b5d9c5) | [PLACEHOLDER] | Plan rev 3 PASS by W1 (9952) and W2 (9953). Build step498.sql 0d5ddbc8, test498_rollback.sql 5b48fb0f and revert498.sql 60ee025d PASS by W2 (9965, 9968) and W1 (9967, 9969). The rolled-back test runs only after 497 is live, so that T7 has a real result (W4 9966). Manual drafts em 6bb026da (W1 9971, W2 9972) and od 69e0d1e8 (W2 9962, W1 9967); the od pair is applied on v136. Test, card, builder rows for 3 to 19, and row 12 shown ok false: [PLACEHOLDER]. |
| E5 T0 | Plan objective: "Cut the defender's cost when spark debates. In run 440, spark cost 0.6475 USD, 37% of the run." (e5/plan_e5.md). T0 asks whether spark's prompt cache can be switched on (t0_question.md rev 2). | [PLACEHOLDER] | The operator approved T0 on W4's card at 13:15 CST. The temporary workflow "TEMP W4 E5 T0" was built at 13:21 CST, inactive and manual only, and graded PASS by W1 (9939) and W2 (9941). It runs after run 40891 ends, so the two do not share the spark cache (W4 9944). Four readings (cached tokens and cost), and the workflow archived: [PLACEHOLDER]. |

## What went right
1. Every write in this period had two non-builder grades on its exact md5 before any card: 497 build rev 1, 498 plan rev 3, 498 build, 494 A2 drafts and 498 manual drafts.
2. The 498 build avoided a permanent 497 (c) finding up front. The step names the snapshot table only through dynamic SQL, and there is no foreign key (W2 9965 a; W1 9967 c).
3. The run and the E5 T0 test were ordered so that they do not share the spark cache (W4 9944).
4. [PLACEHOLDER: results that land.]

## What went wrong, and the lesson
1. W2's last-read slip. W2 9968 says "I read the Wall through 9966", but W1 9967 was posted five seconds earlier (19:36:27Z against 19:36:32Z). W2 reported it to the coordinator (W2 9972). [PLACEHOLDER: W2's own account of the slip.] Lesson: [PLACEHOLDER].
2. W3's stray message. At 13:22:48 CST W3 sent "W2's copy: see the next message." to W1's thread by mistake, while sending the 497 op doc read request to both graders. W3 sent W1 a correction at 13:22:56 CST ("please ignore my message ... I sent it to you by mistake") and reported it to the coordinator by 13:22 CST (read from W1's thread). Nothing was acted on. Lesson: read the target thread id before each send.
3. W3 git path. Commit 52af35e0 put the 498 manual drafts at a new path, ask498/w3/, beside the earlier copies at a498_w3/, and left stale copies there. W2 found it (9962 N3). Fixed in ed79185a, so one copy is now at a498_w3/. Lesson: list the branch's existing paths for an ASK before the first commit to it.
4. W4 n8n approval notice. W4 sent the E5 T0 create request without first telling the operator that n8n would ask for approval, and the operator asked why n8n was asking (W4 9937, MISTAKES line). Lesson: the standing rule already requires the notice; tell the operator before each request that will prompt.
5. W4 run start. The wt494 checkout lacked tools/node_modules/acorn, so the first runstart refused on check 4. W4 ran the same runstart.py and reg385.cjs (diff empty) from the gw checkout (W4 9944). The run itself was not affected. Lesson: [PLACEHOLDER, team proposal].
6. [PLACEHOLDER: any slip found in the run, the tests or the writes.]

## Snapshot rows
[PLACEHOLDER: rows the coordinator inserts before this report, one per ASK revision covered, with id and md5. The 497 and 498 rolled-back tests use sequence ids. The 497 dry run already used ids 1 and 2 (AAR rev 12). The 498 test inserts three rows, which moves the sequence by 3 (W1 9967 N1). Each test's ids are named here.]

## Still open
1. 494 A2 card, after run 40891 passes P1 to P6.
2. 497 rolled-back test result (released 13:36 CST), then the 497 card and its manual entries (op doc v136 first).
3. 498 rolled-back test after 497 is live; then the 498 card, its manual entries in write order, and the builder rows.
4. E5 T0 run, readings, and archive of the temporary workflow.
