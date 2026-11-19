# AAR draft rev 2 (replaces rev 1 cee1d03d; takes W2 F1 at 9805 and W1 changes 1 to 5 at 9808; objectives quoted verbatim from each plan's OBJECTIVE line) (W3, seat 33): today's live set, ASKs 484, 485, 483, 481, 486, 487 and 482 rev 4 (11-19)

Read from SQL at 12:0x CST: audit_log, the_wall, debate_results. No debate run has finished since the first of these writes (0 ORACLE_DEBATE_V1 rows after 10:44 CST), so no run-dependent objective is proven yet. NOT YET means no source shows the objective either way. IN PART means part of it is shown.

## Objectives, and whether each was met

| ASK | Objective | Met? | Why |
|---|---|---|---|
| 484 | "A panel judge's verdict is not lost to a provider content filter." (plan484.md) | NOT YET | Written (card 10:44 CST). Engine and child read back PASS (W1 9670). The Cure Call copy was checked by file only (W2 9673, W3 9675), because n8n MCP cannot read that workflow. No run has shown sol62 answering without Azure. |
| 485 | "When the reserve judge is seated, the enforcer's send-backs on the reserve's verdict are sent to it and applied, as they are for the drawn judges." (plan485.md) | NOT YET | Written (card 10:47 CST). Read back PASS by W1 (9674) and W3 (9675). No run has seated a reserve since. |
| 483 | "a holder of the public (anon) key can no longer change judge seating through the judge fault ledger, add model_config roster rows, or insert debate_judgments rows; every live writer keeps working." (plan483.md) | IN PART | Written (card 10:52 CST; audit 38515 to 38521). Read back by W2 (9680) and W3 (9682): the public key is refused. That every live writer keeps working is owed a run. |
| 481 | Not stated: the 481 plan has no OBJECTIVE line (W1 F1). What was written: the public key can no longer insert directly into debate_queue (audit 38527). | NOT YET | Written (card 10:57 CST; audit 38525 to 38527). Read back by W3 (9682) and W2 (9683). With no stated objective, there is nothing to measure it against. |
| 486 | No OBJECTIVE line (the plan predates THE ASK FORM). The plan's stated ask, the operator 10:44 CST: "haiku 5.5  needs to be last on the alternate list" (plan486_487.md) | NOT YET | Written (card 11:06 CST; audit 38562; engine c94948c0). Read back PASS by W3 (9702) and W1 (9705). No run has drawn a reserve since. |
| 487 | No OBJECTIVE line (the plan predates THE ASK FORM). The plan's stated ask, the operator's card choice: "point gemini (debater) at a non-flash model" (plan486_487.md) | NOT YET | Written (card 11:08 CST; audit 38577 and 38579; engine dd636c25). Read back by W2 (9710; the engine part was by file), W3 (9711) and W1 (9715). No run with gemini as debater since. |
| 482 rev 4 | "The Any vs Any drop-downs list exactly the engines the live engine accepts as debaters (minus the ones it refuses), each shown with its live model version from model_config, and a launch from any listed choice is accepted by both the launch function and the engine." (a482_w3/plan_rev2.md) | IN PART | Written (card 11:10 CST; audit 38591 to 38597; deployment dpl_42mbKJpf...). Read back by W2 (9721) and W3 (9722, DB side and deployed file). The operator loaded the page at 11:22 CST: ""Any vs Any" is looks good." No launch from the new choices has run, so "accepted by both the launch function and the engine" is not shown. The Queue tab still names engines, not models, until rev 5 is written (on its own card). |

## What went right
1. Every write had two grades, a card pressed in W4's thread, an audit row, and two non-writer readbacks, live except the 484 Cure Call and the 487 engine part in W2's read, which were by file.
2. Cards went to the operator one at a time.

## What went wrong, and the lesson
1. ASK 484, Cure Call: written without a live readback path, because n8n MCP cannot read workflow c7366RPLb8vdMQg6. Lesson: a plan that touches a workflow MCP cannot read says so in SCOPE (NOT SEARCHED), and the card says that its readback is by file only. This is now in THE ASK FORM.
2. ASK 482: rev 5 (Queue tab) was graded while the card for rev 4 was waiting, so the written md5 and the newest graded md5 differed (W1 9743). Nothing wrong was written, but it was seen only at W4's readback. Lesson: the md5_match field in ASK 493.
3. ASK 482, page load: the seats' network cannot reach the dashboard host, so the C3 page check was done by the operator. Lesson: a dashboard card names the operator's page check as a step.
4. ASK 486 plan rev 1 carried a code comment that I wrote; it was built, failed (W2 9692), and rebuilt (W3 9696). Lesson: no comments in Code nodes, checked before the plan is posted.
5. ASK 481 was written with no OBJECTIVE line, so its AAR cannot say whether it went right. THE ASK FORM now makes OBJECTIVE mandatory.
6. Plans 491, 492, 494 and 495 were first written and graded without THE ASK FORM headings (W1 9772). They were fixed and regraded before any card.
7. ASK 487: the file written (target2_engine_487.json, 93fe9adc) was a rebase, not the graded file (32bf6cba). Its equality in nodes and connections was claimed by the builder (W4 9701) before the card and checked by non-writers only after the write (W2 9710, W1 9715). Lesson: a rebased file is graded, or shown equal by a non-writer, before its card.
8. The plans for 484, 485, 483, 486 and 487 are in project files but not in git. Lesson: INPUTS IN GIT, now a heading of THE ASK FORM.
9. The operator's card answers for these writes exist only in W4's thread chat, so the rows cite them by card time from audit_log, not by a SQL record of the press. Lesson: the coordinator cites the chat message ids in the AAR snapshot's sources (ASK 493).

## Still open
1. 484 Cure Call: live readback (needs MCP access on that workflow, or the operator's view of it) and the first run that cures sol62.
2. Run evidence for 484, 485, 486 and 487: the next released run.
3. 482 rev 5: its card (order now: 482 rev 5, 490, then the manual card). 488 (audit 38710) and 489 (audit 38718) are written and read back (488: W2 9801, W1 9803; 489: W1 9806, W3 9809); they are outside this AAR's set.
4. Manual entries: engine manual v213 (484 to 487) and v214 (482), op doc v134 (485), each with two reads; v215 (488, 489) is drafted and needs two reads; the card is held.
