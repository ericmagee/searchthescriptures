# Queue tracker, 11-19 (W3, seat 33), as of 13:3x CST

Read from: Wall through 9954; ask_aar_snapshots rows 3 to 19; audit_log; plan files. "Row" is the ask_aar_snapshots id. A new fact about an ASK becomes a new row with prior_row set.

## Waiting on run ODV1-40891-umeouul3 (494 A2 proving run, released 13:22 CST; W4 runs and reports, W1 and W2 check)
| ASK | Row | Owner | Waits on | Evidence (map aar_run40891_map.md 495a3b55) |
|---|---|---|---|---|
| 494 A1 | 16 | W4 | P1 to P5 posted and checked | template aar_494a1_run_template.sql e6c5c08e |
| 492 | 15 | W4 | the run's row saves | debate_results row for the token |
| 484 | 3 | W4 | sol62's provider is not Azure | call_costs provider; the Cure Call live readback is still owed (MCP cannot read it, or the operator's view) |
| 487 | 8 | W4 | the gemini debater's model is google/gemini-4-hydrogen | the run row |
| 486 | 7 | W4 | haiku last in the reserve and alternate order | Init Seats output |
| 490 | 13 | W4 | the transcript names models, never "ChatGPT" | Drive transcript (operator's view or a Drive read) |
| 483 | 5 | W4 | every live writer keeps working | the run saves with no 42501 |

## Waiting on a card or a build
| ASK | Owner | State | Waits on |
|---|---|---|---|
| 494 A2 | W4 (build and card), W3 (manual) | drafts: em_pairs_494a2_draft.json 3e868ce5, card text bf82169e | run 40891 proving A1; step494.sql and test494_rollback.sql graded by W1 and W2; W4's card |
| 497 | W4 (card), W3 (manual) | plan rev 5 1e04b59d PASS; build rev 1 (step 6df72062, test f518f541, revert 5cac5883) PASS W2 9921, W1 9925; rolled-back test ran 13:07 CST without the operator's approval (AAR item 14) | W4's write card; then two live readbacks; then the manual card (op doc pairs 692632a6 with two reads; engine manual draft 8a7e1ae6, Live line filled after the write) |
| 498 | W4 (build), W3 (plan, manual) | plan rev 3 79b5d9c5 PASS W1 9952, W2 9953; manual drafts em 786b8902, od 6cd89ba7 (need updating to rev 3) | W4's build; W1 and W2 grades; rolled-back test on the operator's approval; card after 497 is written |
| E5 T0 | W4 | workflow "TEMP W4 E5 T0" PASS W1 9939, W2 9941; approved 13:15 CST | runs after run 40891 ends |

## Waiting on the operator
| Item | Owner | Waits on |
|---|---|---|
| AAR 11-19 rev 12 bf1190f8 (PASS W1 9932, W2 9936); rows 3 to 19 inserted | Coordinator | the operator's return; the coordinator sends it |
| 482 rev 5 Queue tab | W1 | the operator's page load (seats cannot reach the dashboard host) |

## Waiting on a future run (no action now)
| ASK | Row | Waits on |
|---|---|---|
| 485 | 4 | a run that seats a reserve: its send-back is sent and it has E-GATE rows |
| 488 | 11 | a run whose counted seats agree on the RESULT word while their tags split |
| 491 | 14 | a dashboard launch and an engine queue claim (not a webhook run) |

## Done (objective met)
489 (row 12), 495 (row 17), 496 (row 18). Manuals: engine v218 673f42fe, op doc v135 2df94c29 (written 13:06 CST; read back W1 9913, W2 9916).

## Not an ASK yet
481 (row 6): no OBJECTIVE line, so it cannot be judged; nothing owed.
