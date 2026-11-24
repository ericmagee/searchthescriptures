# ASK 585 plan rev 0 (W4, 11-23 22:00 CST): Record Substitution gets the real debate on a retry of a crashed run (the 41147 fault)

1. OBJECTIVE. When n8n retries a crashed execution, Record Substitution sends the real debate_id and substitution, not an empty body. Expected effect: the run 41147 failure ("Could not find the function public.odv1_record_panel_substitution without parameters", debate_errors row a21bad71) cannot recur from a recovered placeholder. A normal run is unchanged.

2. ROLES. Planner and builder W4. Grader W1. Card: W4's thread (one engine node write).

3. SCOPE and SEARCH (fresh fetches 21:55 CST: engine moMxiV4Irg1uRBZN 9c9891d4, child MqQHRl7mQQ0z8QdT f900375e; Wall 11273).
 a. The fault: on a retry of a crashed execution (mode retry), every node of the crashed run carries a recovered placeholder item {isArtificialRecoveredEventItem: true}. Alternate Merge takes Pass Accumulate whenever $('Pass Accumulate').isExecuted, and the placeholder counts as executed, so it takes the placeholder (no debate_id, no substitution) instead of the rerun Alternate Merge 1. Record Substitution then sends JSON.stringify({p_debate_id: undefined, p_substitution: undefined}) = "{}" (W4 Wall 10353, from execution 41147).
 b. Node Alternate Merge (Code, 16,364 chars, md5 581935a1): the only line that picks its input is `if($('Pass Accumulate').isExecuted)r=$('Pass Accumulate').first().json;` followed by `if(!r)r=$('Alternate Merge 1').first().json;`.
 c. Node Record Substitution (HTTP Request, POST rpc/odv1_record_panel_substitution; onError continueErrorOutput to Panel Failure Note; no retry): body reads $('Alternate Merge').first().json.debate_id and .substitution. No change: once Alternate Merge carries the real item, its body is right; a guard inside it would only change the error text.
 d. Other readers of Pass Accumulate: Format Markdown and Panel Tokens read $('Pass Accumulate').first().json.__a379.passes; the placeholder has no __a379, so k = 0 and they read nothing from it. They do not feed Record Substitution. Not touched (scope rule).
 e. No engine node tests isArtificialRecoveredEventItem. The only $execution.mode use is Failure Salvage (test token naming). The child names neither odv1_record_panel_substitution nor Record Substitution, and has no Pass Accumulate node.
 f. Limit stated: if Alternate Merge 1 is also only a placeholder (a crash after it, with no rerun), debate_id is still missing and Record Substitution fails to Panel Failure Note as today. In 41147 Alternate Merge 1 did rerun (run 1, with debate_id).

4. CHANGES (exact text), node Alternate Merge only.
 E1 replace `if($('Pass Accumulate').isExecuted)r=$('Pass Accumulate').first().json;`
    with `if($('Pass Accumulate').isExecuted){const __pa=$('Pass Accumulate').first().json;if(__pa&&!__pa.isArtificialRecoveredEventItem)r=__pa;}`
    (occurs once; result md5 4a623df6, 16,454 chars). Nothing else changes.

5. CRITERIA and DONE.
 C1 Offline run of the live and the patched Alternate Merge code (build/t585.cjs) on three cases: (i) normal, Pass Accumulate real: both give the Pass Accumulate debate_id; (ii) Pass Accumulate not run: both give Alternate Merge 1's; (iii) 41147 retry, Pass Accumulate = recovered placeholder: live gives debate_id undefined (the fault), patched gives Alternate Merge 1's debate_id and substitution. Result in hand: build/out_t585.txt, all as stated.
 C2 Fetch-back per-node diff: only Alternate Merge changed, only the E1 text; Alternate Merge md5 4a623df6.
 C3 Child unchanged (f900375e); no model setting touched.
 DONE: C1 to C3 met and W1's readback.

6. WRONG-IF. The plan aims at the wrong thing if the live Alternate Merge does NOT lose debate_id when Pass Accumulate is a recovered placeholder (then 41147 had another cause). Check: build/t585.cjs case (iii) on the live code. Known-bad (the miss it exists to catch): live code, placeholder case: debate_id undefined, so the fault is reproduced. Known-good: live code, normal case: debate_id present. Both run 21:58 CST, out_t585.txt.

7. RUN EVIDENCE. NO PROBE: only an n8n retry of a crashed execution takes this path, and runs are not retried on purpose. Normal runs exercise case (i) and must stay unchanged (Record Substitution rows written as today). UNEXERCISED on the retry path until a crashed run is retried.

8. INPUTS IN GIT. Branch claude/untitled-9jle0o, folder a585_w4/: this plan; build/alternate_merge_9c9891d4.js (live, 581935a1), build/alternate_merge_585.js (E1, 4a623df6), build/t585.cjs, build/out_t585.txt. Commit named on the Wall post.

9. STEPS. (1) W1 grades this plan. (2) The operator's card in W4's thread, with E1 and its effect. (3) On the press: fresh fetch, confirm the live version and Alternate Merge md5 581935a1, apply E1, rerun C1 on the built node, PUT, fetch back, C2, C3, audit row, Wall, W1 readback. Revert: the saved prior engine version.
