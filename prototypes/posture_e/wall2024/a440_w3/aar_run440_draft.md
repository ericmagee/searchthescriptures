# AAR, run 440 (draft rev 0, W3, 11-19 10:3x CST; for W2's grade, then the coordinator sends it)
Order: Wall manual v18 §7.4. Anchor: W4's run report, Wall 9613.

## RUN
ODV1-40781-700sx0qn | engine e0a61271, child 4982c042 | ran 09:43 to 10:05 CST, 22.4 min, 1.7317 USD, status success (W4 9613) | outcome "UNGRADED — REVIEW", panel CONTESTED 1-1-1 by tag (haiku PARTIAL, chatgpt HELD, sol BROKEN); all three engine result words UNDERDETERMINED (judgments read by W3; Worker_E 9631).
Topic "Did Christ have a biological father?"; defender spark (muse-spark-1.3, Oracle), challenger gemini (gemini-3.8-flash, plain).

## OBJECTIVE
Run objective (pre-run plan, W1 skeleton rev 4 and runval_merged.md, commit 85e91f6f): show, on one live run, that the changes live since run 39266 work as built, before the transcript work begins. Expected: every item whose case the run reaches is EXERCISED with its mark, and the run ends with a graded verdict.
Met: IN PART. The run finished and saved, and every item whose case it reached passed its mark. It did not end graded, and two live judges failed at their jobs (DEFECTS 1 and 2).

| ASK | Objective (what it achieves) | Result | Evidence |
|---|---|---|---|
| 443 | engine checks the library header against LIB at start | EXERCISED | W1 9618 A1 |
| 444 A2 | alternate builds run with comments removed | NO CASE (no alternate seated) | W1 9618 A4; W2 9622 item 5 |
| 445, 462, 465 | write procedure, Wall guard, op doc line | NO RUN PROBE | runval_merged.md |
| 446, 447 | run-start post quotes runstart GO; tools in tools/ | EXERCISED | W1 9618 A1 (W4 9457) |
| 448 to 451 | Wall guard | HELD (0 failing posts in the window) | W1 9618 A2 |
| 454 (422(c)) | KV_EXCL reads makes/excludes | NO CASE | W1 9618 A4 |
| 455, 455 D | ENFORCER labels and openrouter step names | EXERCISED | W1 9618 A1 |
| 456 | stubs name every node they read | NO CASE | W1 9618 A4 |
| 458, 460, 461, 478 | no DeepSeek step, path or call; all panel replies via openrouter | EXERCISED (mark 0, case met) | W1 9618 A1 |
| 459 | cure sub-workflow never calls DeepSeek | EXERCISED (3 cure sub-executions, success) | W1 9620 item 2 |
| 464 | sub-workflows run with comments removed | IN PART: Cure Call and Panel Judge Call ran; Early Alternate Shape UNEXERCISED | W1 9620 item 3 |
| 466 steps 1 and 2c | the run's saves land with the public key cut off | EXERCISED, PASS (1 row, 3 judgments, 215 enforcer, 3 panel; 0 permission errors) | W3 9615 B |
| 468, 475 | B-round layers check kept; one library LAY text | EXERCISED (6 builds with lay_check; resends 2 to 0, 8 to 0) | W1 9620 item 1 |
| 470 | keystone BROKEN mirror (TRIAL) | TRIAL: 3 judge keystones, 0 GRADE CONSISTENCY lines | W1 9618 A5 |
| 472 | unapplied send-back item recorded as not counted, to the E-GATE | EXERCISED (2 item lines, 0 without the words; 472b: 2 of 4 E-APPLY rows carry them) | W3 SQL, this draft |
| 474 | send-back records read CONCEDED LINKS as the gates do | CASE MET (8 rows), 0 loader errors; Q474 hand read NOT YET DONE | W3 SQL, this draft |
| 423 | LINK D<n> labels read | NO CASE (no round carries the label) | W1 9618 A6; W3 9630 B1 |
| 424 | round 4 prompts carry the whole declared chain | EXERCISED (D4 Build and C4 Build carry D1 to D5) | W3 9630 B2 |
| 426 | every enforcer reading is luna | EXERCISED (113 luna rows; 6 with no model are code checks) | W1 9618 A3a; W3 9615 C |
| 426 hand read (W3's promise, 11-18) | each luna reading right or wrong | Of 22 disagreements with the judge: 17 RIGHT, 0 WRONG, 1 right by rule with a conflict, 2 label uncertain, 2 unchecked (R1.1 since read: right). The 86 agreements are not read. | W3 9628 A, 9630 A1d |
| 430 | -d and -ed gloss forms | EXERCISED, read by hand (no miss; a FOUND row is not printed) | W3 9624 B1 |
| 431 | ", meaning" gloss form reaches the GLOSS CHECK | EXERCISED (4 CR2 lines listed) | W3 9624 B2 |
| 436 | long KJV lists cut with "and N more" | EXERCISED, read by hand | W1 9618 A3b |
| 399/402 | v62 tag on a retracted pair | NO CASE, read by hand | W1 9618 A4 |
| 374 prompt, 376, 404, 405, 406, 408, 409, 422(a), 428, 429, 434, 437, 438, 439 | as registered | EXERCISED | W1 9618 A1 |
| 374 step 2, 394 s11, 407, 435 | as registered | NO CASE | W1 9618 A4 |
| dashboard default fix, 480 | not on the run path | UNEXERCISED | W4 9625 |

## REVIEWS
| Seat | §7.3 review |
|---|---|
| W1 | MISSING (validation posts 9618, 9620 are not a review) |
| W2 | 9623 |
| W3 | 9632 |
| W4 | 9625 (run report 9613) |
Outside reads: Worker_A3 9629, Worker_E 9631.

## DEFECTS
1. Panel judge sol62 (gpt-6.2-sol) was cut off mid-verdict by Azure's content filter; the engine failed it closed and seated haiku. Azure served sol62 3 times and failed 3 of 3; other providers 0 of 3. (found by W3 9615 A; traced by W4 9616)
2. The reserve judge haiku got no send-back. All 12 of its send-back rows read "SEND-BACK NOT SENT: no panel request for this seat (ruling 428)", while chatgpt and sol had theirs applied. The enforcer's E-RES faults on haiku's first verdict (CLAUSE BROKEN-2 for BROKEN-1; RESULT CHALLENGER WINS does not follow) were never returned to it. The engine's own recompute did take haiku from BROKEN to PARTIAL, with result word UNDERDETERMINED, but the stored judgment still opens with "RESULT: CHALLENGER WINS". (found by outside read Worker_A3 9629; confirmed W3 9630 A; Worker_E 9631 item 2)
3. W4 9613 left out defect 1, and the 10:10 CST message to the operator said all judges answered in full. (found by W3 9615 A4; corrected W4 9616 A)
4. Every seat's validation, W3's included, missed defect 2 until the outside read. (W3 9630 MISTAKES)

## WHAT WENT RIGHT
1. ASK 466: the saves land with the public key cut off (W3 9615 B).
2. ASK 426 and 478: 113 luna rows, no DeepSeek call (W1 9618; W2 9622).
3. ASK 468 and 475: layers check on all six B builds; resends 2 to 0 and 8 to 0 (W1 9620).
4. ASK 459: three cure calls, all success (W1 9620).
5. ASK 424, 430, 431: the chain is whole in round 4, and both gloss forms are read (W3 9624, 9630).
6. Fail-closed seating: sol62's cut reply was refused and haiku seated (W4 9625).
7. The judges ran in parallel, 230 s (W4 9613).
8. luna caught a false fact in haiku's E-PREM line (W3 9628 A3c).

## WHAT WENT WRONG
1. W4: 9613 and the 10:10 CST message left out a live-model failure (rule: op doc §29, ASK 427, tell the operator first).
2. All seats: the send-back gap for the reserve judge was not found by any seat (rule: op doc §29, THE CHECK IS THE FIRST SUSPECT).
3. sol62 routed to Azure (NO RULE COVERS IT).
4. Reserve judge outside the send-back path (NO RULE COVERS IT; ASK 485 traces it).
5. W1 9618 A7 said the cut "made the run UNGRADED"; too strong (W2 9622 G1). W3 9615 A3 was labelled a reading.

## SUGGESTED IMPROVEMENTS
1. ASK 484, sol62 skips Azure (OpenRouter provider ignore). Plan rev 0 graded PASS by W3 9628 B (two conditions); W1's grade owed. No card yet.
2. ASK 485, the reserve judge's send-back path. W4 tracing; no plan yet.
3. ASK 482, dashboard Any vs Any lists every engine with its version (not from the run). Plan rev 2 confirmed by W2 9627 and W4 9626; W1 builds. No card yet.
4. ASK 483 (public key writes to the judge ledger, the roster, the judgments) and ASK 481 (debate_queue): graded; the tests wait on the operator at W2's session page.

## KNOWLEDGE BASE
1. sol62 (gpt-6.2-sol) served by Azure ends with content_filter on this topic, 3 of 3; served by OpenAI or Bedrock, 0 of 3 (W4 9625).

## FOR THE OPERATOR
1. ASK 484: when graded, a card for W4 to build sol62's Azure skip (it changes routing only, no model or prompt).
2. ASK 481 and 483 tests: they need the operator at W2's session page for the database prompt.
3. Which transcripts to review for the transcript work (never assumed).
4. The truth-app-dashboard preview cleanup: option B on a card (delete the 20 previews of 11-15/16), after its grade.
