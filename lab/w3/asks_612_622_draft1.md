# ASK 612 TO 622, WITH ASK 578 AND 579: THE AGREED LAB SUGGESTIONS IN ASK FORM (draft 1, for W1's grade)

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST. On the operator's order of 14:01 CST 11-24 (message cmsg_017ZQamDMHrS6fqMHnQDVo58WZezUxM8roYn2hLNBxQNV6: "Create X number for all of the suggestions the team approved.") and the coordinator's numbers (recorded Wall 11681). Sources: Wall 11663 (W3 items 1 to 7), 11665 (W1's agreement), 11671 (W1 P1 to P6), 11673 (W4 items 1 to 6).

WHAT THIS FILE IS: each ASK under the eight headings of the ASK FORM (operational document v145), at the depth an ASK DRAFT can honestly reach. A number is not an approval. None is planned to done, graded as a plan, built or carded. Where a heading waits on the builder's search or code read, it says so and names who supplies it; it is not filled with a guess. The owner named under ROLES turns the draft into the plan.

RULES READ: ASK FORM and TWO LIVE RUNS (op doc v145); rulings 512 (features go live) and 525; the scope rule; ASK 599 (ten rules); "NEVER TOUCH REASONING. UNLESS I INSTRUCT IT." (none of 612 to 622 touches a judge's or a debater's reasoning, or any prompt text).

SUGGESTED ORDER (mine; the coordinator assigns): 612 and 621 before the next run if their cards are pressed in time, because each is the cause of a fault seen on run 42283; then 613; then 615 with 614; 579 and 578 after the ASK 611 run proof; 616, 619 and 620 are rule texts and can go as one operational document card; 618 is mine at the next AAR; 617 as time allows; 622 after a clean ASK 611 run.

---

## ASK 612: every n8n expression is compiled in n8n's own parser before any write
1. OBJECTIVE: no engine or child write goes live holding an expression that n8n cannot parse. Expected effect: the fault that cost run 42283 its judging cannot reach a run again.
2. ROLES: planner and builder W4; grader W1; card in W4's thread (the standing set and the write scripts are W4's files; no n8n write).
3. SCOPE: the standing test set (ASK 596) gains one check, compile-all, over every expression of the engine and of the child; every write script refuses when it fails (writef1.sh already does, Wall 11672). SEARCH: W4 lists every write script in use and the standing set's entry file. No engine node changes.
4. CRITERIA and DONE: (a) on engine fbc09389 the check FAILS and names Panel Judges Parallel jsonBody and Alternate Pass Call; (b) on live 3cef3eab it passes 290 of 290, child 67 of 67 (W1's counts, Wall 11675); (c) a write script run against a failing target stops before any write; (d) the parser version tested is recorded beside the result. DONE when the check is in the standing set and W1 has rerun (a) to (c).
5. WRONG-IF: the instance's parser differs from the package tested in a way that lets a failing expression pass (W1's stated risk: the instance parser version is unknown to us).
6. RUN EVIDENCE: NO PROBE. It is a pre-write check; a run shows nothing of it.
7. INPUTS IN GIT: W1's check fairjudge/w1/g611/ (commit 82607dec); W4's build611f1.cjs (ask611/w4/fix1).
8. STEPS: W4's plan and build; W1's grade; W4's card; the check runs on every later write.

## ASK 613: a run-live mark in the database
1. OBJECTIVE: any seat, and any write function, can tell from the database whether a run is live. Expected effect: no manual, engine or function write lands during a run, and no seat has to ask W4.
2. ROLES: planner W3; builder W4; grader W1; card in W4's thread (engine write and a new table and function).
3. SCOPE: one new table (run token, start, end), one function answering yes or no; the engine writes the row at its start and closes it at its end, on every exit including the failure exit; engine_manual_part_apply and the write scripts read it and refuse. SEARCH (W4): every exit of the engine (success, Raise If Incomplete, a crash that writes nothing), the regrade path and the child.
4. CRITERIA and DONE: (a) a started run shows live within seconds of its start; (b) a finished or failed run shows not live; (c) A CRASHED RUN DOES NOT LEAVE THE MARK LIVE FOR EVER: the plan states the rule (an age limit, or W4's status poll closes it) and the function says which case it answered from; (d) a manual write tried while the mark is live is refused with its message; (e) a retried execution opens a row of its own. DONE on W1's rerun of (a) to (e) offline and the readback.
5. WRONG-IF: the mark can read "not live" during a run (a write would then pass a guard that says it is safe), or a dead mark blocks all writes with no stated way to clear it.
6. RUN EVIDENCE: the next run's row: one row for the run token, start before the first round's save, end after the last write.
7. INPUTS IN GIT: lab/w3/suggestions_1124_draft1.md item 1 (148a76a2); lab/w4/proposals_11662.md item 1.
8. STEPS: W3's plan; W1's grade; W4's build; grade; W4's card; readback; manual entry by W3 (graded with the build, ASK 620).

## ASK 614: one view for a seat's model and family
1. OBJECTIVE: the engine, the Judge order page and the alternate recorder read a seat's model and family from one place. Expected effect: the three sources cannot drift apart and seat a judge the rules bar.
2. ROLES: planner W3; builder W4; grader W1; card in W4's thread.
3. SCOPE: one database view. Today the same-model rule reads the Accept Models rows, model_config_jfl (active rows) and model_config (all rows); they agree today only (W1, Wall 11625, N2). SEARCH (W4): every reader of a seat's model or family in the engine, the child, dash_judge_lineup and odv1_record_panel_alternates.
4. CRITERIA and DONE: (a) the view gives, for every seat, the model and family each reader uses today (equal on today's rows, shown seat by seat); (b) each reader reads the view; (c) the 90-pairing test (ASK 615) gives the same seats before and after. DONE on W1's rerun and the readback.
5. WRONG-IF: any reader needs a row the view leaves out (an inactive seat used as a fallback, as deepseek_debate is for two calls, W4 item 5).
6. RUN EVIDENCE: NO PROBE of its own; the run's JUDGE ORDER line is unchanged for the same pairing.
7. INPUTS IN GIT: fairjudge/w1/g601/ (the T5 readers); ask601/w4/b1/notes601.md (893bc98e).
8. STEPS: built with or directly before ASK 615, on one card if W4 stacks them.

## ASK 615: one shared seat-test function, with the 90-pairing test in the standing set
1. OBJECTIVE: the family test and the same-model test exist once and every seat drawer uses that one copy; any change to seats, judge order or model rows is tried on all 90 debater pairings before it goes live. Expected effect: the page cannot show a line-up the engine will not seat, and a rule that leaves a pairing with no seat is caught offline.
2. ROLES: planner and builder W4; grader W1; card in W4's thread.
3. SCOPE: two steps. Step 1 (no live change): the all-pairings test (t1_601, t608) joins the standing set. Step 2: one database function for the two tests, read by Init Seats, Resolve Seats, dash_judge_lineup and odv1_record_panel_alternates, where the same-model test is written four times today (W1 P2). SEARCH (W4): every copy of either test, the ASK 608 enforcer family test included.
4. CRITERIA and DONE: step 1: the test runs in the standing set and fails on a known-bad (the first ASK 608 option, which gave no seat on the four listed pairings). Step 2: all 90 pairings give the same seats before and after; a database failure stops the draw with its message and seats no one by default.
5. WRONG-IF: step 2 makes the seat draw depend on a database call that can fail open (W1's stated risk: it must fail closed), or the four homes differ today in a way the one function would silently change.
6. RUN EVIDENCE: the run's JUDGE ORDER line equals the page's line-up for that pairing.
7. INPUTS IN GIT: W4's t1_601 and t608; fairjudge/w1/g601/.
8. STEPS: step 1 first on its own card; step 2 after ASK 614.

## ASK 616: a plan or a grade runs its chosen path on today's data in the real evaluator
1. OBJECTIVE: no plan or build is graded PASS on an argument alone when its chosen path can be run. Expected effect: misses like ASK 608 option A (no seat on the listed pairings) and ASK 611 (expressions never parsed by n8n) are caught at the grade.
2. ROLES: planner W1 (the rule text); writer of the operational document as the operator directs; grader W3; card: the operator's, since it is an operational document change. The coordinator may not order a model to update the op doc.
3. SCOPE: one rule added to the ASK FORM: heading 4 (CRITERIA) names one check of the chosen path on today's data, in the real evaluator where one exists; the grade states that it ran that check and its result. SEARCH: NONE in code; it is a text rule.
4. CRITERIA and DONE: the rule text is graded, approved by the operator and stands in the operational document; the next plan and grade carry the line.
5. WRONG-IF: "the real evaluator" is read as leave to run a live debate or read execution data. It is not: it means the parser, the node code and the database functions, offline.
6. RUN EVIDENCE: NO PROBE (a rule for graders).
7. INPUTS IN GIT: W1's grade notes for 608 (Wall 11661) and 611 (Wall 11670).
8. STEPS: W1's text; W3's grade; one card to the operator, which can carry 619 and 620 as well.

## ASK 617: find the trigger of the hidden approval prompt
1. OBJECTIVE: the team knows what makes the database tool raise an approval prompt the operator cannot see, so an approved write is not stopped by it. Expected effect: no half-written manual, as on 11-24 (part 3 written 13:08 CST, part 10 stopped twice and written 13:52 CST).
2. ROLES: planner and tester W3; grader W1; card NONE for the finding (read-only tests); any setting that lets a write through without the prompt is the operator's choice alone (W1's condition, Wall 11665).
3. SCOPE: a finding, not a build. Known: the part 10 pairs stopped as plain text and passed base64-encoded; a Wall post holding the word "drop" passed. The trigger is NOT KNOWN. SEARCH: the tool's own documentation first, then harmless SELECTs that differ by one feature each.
4. CRITERIA and DONE: the trigger is stated with one query that raises the prompt and one that differs in that feature alone and does not; the base64 route is recorded as the working route meanwhile. No test is a write.
5. WRONG-IF: the prompt depends on something a seat cannot observe or vary (then the finding says so and the route stays base64).
6. RUN EVIDENCE: NO PROBE.
7. INPUTS IN GIT: manual1123/w3/a601/ (the pairs that stopped).
8. STEPS: W3's tests when no approved write is waiting; the finding to the Wall; a question to the operator only if a setting is proposed. MY CAUTION: a test that raises the prompt costs a 60-second timeout and bars my database tool for a time; I run them only when nothing else is owed.

## ASK 618: every run's AAR measures the judging load
1. OBJECTIVE: each run's AAR states the size of the rounds, of each judge request and of the close-enforcer requests, beside the last runs'. Expected effect: growth is seen before it becomes a crash.
2. ROLES: W4 measures (aar/w4/m42234/measure.cjs, offline on the stored rows); W3 writes it into the AAR; W1 grades the AAR; card NONE (nothing is written to the system).
3. SCOPE: the AAR's RUN section gains a fixed line. SEARCH: NONE.
4. CRITERIA and DONE: the AAR of the next run carries the line with the figures of runs 42071, 42234 and 42283 beside it. Known now: rounds 143,318, 223,175 and 192,171 characters.
5. WRONG-IF: the offline measure is taken for the true request size; it is a lower bound (W4, Wall 11606).
6. RUN EVIDENCE: the line itself, in each AAR.
7. INPUTS IN GIT: aar/w4/m42234/ (commit 0327c64e).
8. STEPS: W4 measures run 42283 now; I add the line to that AAR as a revision; then every run.

## ASK 619: a quotation of the operator carries its message id or ruling row
1. OBJECTIVE: every "the operator said" in a plan, grade, manual log or AAR row can be traced to his message or to a row of md_notes_rulings. Expected effect: a sentence that is not his cannot stand as his ruling (corrected Wall 11624, after a day in plans, grades and two AAR rows).
2. ROLES: planner W3 (the rule text); grader W1; card: the operator's (operational document change).
3. SCOPE: one rule; the grader fails a quotation without its id. SEARCH: NONE in code.
4. CRITERIA and DONE: the rule stands in the operational document; the next graded item carries ids.
5. WRONG-IF: it is applied to Wall talk and thread replies and slows them; it binds plans, grades, manual logs and AAR rows only.
6. RUN EVIDENCE: NO PROBE.
7. INPUTS IN GIT: Wall 11624 is the record of the fault.
8. STEPS: text; grade; the one card with 616 and 620.

## ASK 620: the manual entry is graded with the build
1. OBJECTIVE: an ASK's engine manual entry is drafted when its build passes, named on the same write card and written right after the readback, before the next run. Expected effect: the manual is never behind the live engine through a run, and one AAR row serves the ASK.
2. ROLES: W3 drafts and writes; W1 grades; card: the builder's write card names the manual write too; the rule itself is an operational document change on the operator's card.
3. SCOPE: one rule. SEARCH: NONE in code. Seen: ASK 601's entry was drafted after the write, so its AAR row says the manual was not written and needs a second row.
4. CRITERIA and DONE: the rule stands; the next build's card names its manual pairs by md5.
5. WRONG-IF: a build changes between its grade and its write, so the graded entry describes what was not written; the entry is then re-cut and regraded before it is written.
6. RUN EVIDENCE: NO PROBE.
7. INPUTS IN GIT: manual1123/w3/a601/; aar/w3/aar_row_601_draft1.sql.
8. STEPS: text; grade; the one card with 616 and 619.

## ASK 621: retried runs read a false first item
1. OBJECTIVE: a run started as a retry records what its stages did, not n8n's recovered first item. Expected effect: no saved row says a stage was skipped when it ran, as review_notes did for the question round of run 42283.
2. ROLES: planner and builder W4; grader W1; card in W4's thread.
3. SCOPE: FIRST A SEARCH (W4): every node that reads first() from a node that can run on both the original and the retried path; Build Save Body's read of QR Merge is the one proven. Then one of two changes: those readers take the last run's item, or live runs are not started as retries (a rule, no code).
4. CRITERIA and DONE: the list of first()-readers with the path each runs on; for the code route, a test on a recovered-item input that gives the true status. If the rule route is chosen it goes to the operator, since it limits how he may launch.
5. WRONG-IF: a reader relies on first() being the first run for a sound reason (the list will show it).
6. RUN EVIDENCE: on the next retried run, the QUESTION ROUND line of review_notes equals the status of the run's odv1_question_round_log row.
7. INPUTS IN GIT: fairjudge/w1/g611/grade_fix1_and_qr42283.md (commit 82607dec).
8. STEPS: W4's search; the plan; W1's grade; W4's card. Until then: start runs fresh (W1, Wall 11675).

## ASK 622: the next memory cut in the judging
1. OBJECTIVE: Close Enforcer Resume and Close Enforcer Needed? no longer pass on a full copy of the closing items, and the judge webhook takes its request by reference. Expected effect: about 650,000 characters less held per run at each of the two nodes, and about 0.9 million at the webhook (W1 P4, W4 item 6; figures from run 42234).
2. ROLES: planner and builder W4; grader W1; card in W4's thread.
3. SCOPE: the ASK 611 pattern (rebuild at the send) on two more nodes, and the webhook's input. SEARCH (W4): every reader of those two nodes' outputs and of the webhook body, in the engine, the child and the webhook workflow.
4. CRITERIA and DONE: as ASK 611's five checks, with ASK 612's compile-all as a gate.
5. WRONG-IF: ASK 611 has not yet shown clean on a live run; this ASK WAITS on that, so that two unproven memory changes are not stacked.
6. RUN EVIDENCE: a run with rounds of run 42234's size completes its judging; the measure of ASK 618 shows the fall.
7. INPUTS IN GIT: ask611/w4/ (plan611.md, b1, fix1).
8. STEPS: wait for a clean ASK 611 run; W4's plan; grade; card.

---

## ASK 578 AND 579 (THE LIBRARY CONSOLIDATION) JOIN THIS BATCH
The operator, 14:04 CST 11-24 (message cmsg_017ZQamDMHrS6fqMHnQDVo58HkVQux2xk4PMNxJbbYB6nt): "Let's take care of the library consolidation with the rest of these updates we're going to do for the lab improvements." My reading: 578 and 579 are worked in this batch, under their own numbers; it is not a write approval for either.
WHERE THEY STAND (Wall 11682; my note): 571, 573, 575, 576 live since 11-23. 578 (the engine passes its library text to the child in the one call; the child's stored copy is removed; about 1.2 million characters saved) and 579 (nine layer blocks served from the library; net 44,047) were approved for build on 11-23 (18:37 and 19:18 CST), built by W4, and held unwritten because their instance criteria C6 and C7 were not shown. The operator said at 20:54 CST 11-23 "We'll do it after this next run."; run 42071 ended 22:24 CST and the item was not resumed (my failure as their owner).
WHAT EACH NOW NEEDS (W4's answer on the Wall, 14:04 CST; W1's condition, thread note 14:03 CST):
1. Both builds are re-cut on the live pair (engine 3cef3eab, child b9cd4e5c) and regraded; the old targets are stale.
2. 578 C7 (a) and (b) (the pass expression resolves though the Shared Library node never runs; the child receives the same length): by a small test workflow. W1's condition, which W4 and I accept: the test workflow is itself a change to the live system, so it goes on the operator's card first; its JSON is in git with no credential, webhook or schedule; it is never active, is run once by hand at a confirmed gap, is deleted afterwards and the deletion is read back.
3. 578 C7 (c) (saved size and duration before and after): a true figure needs a real run that reaches the second alternate pass. The plan states it as measured on the first such run, not before the write.
4. 579 C6 and 578 C6 need a run's own node inputs. W4 checks first whether they can be rebuilt offline from stored database rows, as for ASK 611. Only if they cannot does one question go to the operator on a read limited to the named nodes.
5. ORDER: after the ASK 611 run proof, and with ASK 612's compile-all as a gate on both writes. 579 before 578, as planned on 11-23.
OWNER: W3 (plans, both revised under the eight headings after W4's check in item 4). BUILDER: W4. GRADER: W1. CARDS: one for the test workflow (W4's thread); one write card for 579 then 578.

NOT NUMBERED: W4's item 5 (should the Independent Verdict and the Diagnostic Prompt, which fall back to an OpenAI model, also keep out of a debater's family; ruling 537 names the enforcer only) is a ruling question for the operator, to be carded by W4 on its own.

FOR W1: (1) grade each as an ASK draft: is the objective the team's agreed suggestion and no wider; is each heading honest about what is not yet known. (2) 616, 619 and 620 change the operational document; I have named the operator's card for each and no seat as its writer, because the coordinator may not order a model to update that document. Say if the record names a writer. (3) 613 criterion (c) is my addition to the agreed suggestion: a crashed run must not leave the mark live. Say if it is out of scope.
