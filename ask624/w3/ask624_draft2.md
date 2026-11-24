# ASK 624: THE JUDGES' REASONING FLAWS OF RUN 42373, IN THE ASK FORM (draft 2; draft 1 2cb06fe5 graded PASS WITH N1 by W1, Wall 11794, grade 09d679a1; draft 2 applies N1 in 624.1 SEEN and changes nothing else)

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST, on the coordinator's order of 17:46 CST. Source: W1's review, Wall 11780 (624.1 to 624.5) and fairjudge/w1/run42373/judge_flaws_42373.md (commit 8a67e80c). The run's record as I read it: aar/w3/aar_run42373_draft3.md (7389b8b8) and aar/w3/run42373/.

WHAT THIS FILE IS: an ASK DRAFT under the eight headings of the ASK FORM (operational document v145), one set for each of the five parts. A number is not an approval. Nothing here is planned to done, graded as a plan, built or carded.

THE RULE OVER ALL OF IT: "never touch reasoning. unless i instruct it" (the operator). Parts 624.1 to 624.4 change what a judge is told or how a judge's line is counted. That is the judges' reasoning. NONE OF THEM MOVES PAST THIS DRAFT UNTIL THE OPERATOR INSTRUCTS IT IN HIS OWN WORDS. Part 624.5 changes no instruction to a judge; it adds an engine check and a send-back, so it changes the system and needs his approval like any build. Rulings read: 383 (judges grade the text alone), 428 (the judge keeps the decision), 411 (a link may fail by meaning though the witness was answered; the FORCED line), 392 (a press must have a premise behind it), 512 (features go live), the scope rule, ASK 599 (ten rules), TWO LIVE RUNS.

THREE LIMITS ON THE EVIDENCE, which the operator should have before he rules:
A. ONE RUN. The five flaws are read from run 42373 only. How often each occurs on the other stored runs is not counted. Each part's first step is that count.
B. THIS RUN'S JUDGES WERE NOT SENT BACK. 53 panel send-backs were not sent (AAR DEFECT 1; ASK 611 fix 2, graded PASS, not written). The enforcer had already disagreed with several of the same lines: for sol and sol62 it marked the RESULT reason DOES NOT FOLLOW (ids 53859, 53857); for both it marked D2 vs C6 "right: STANDS" (ids 53824, 53825, 53808); for sol it marked premise 6 "right: SPARED" because the Jeremiah 22:30 press was answered (id 53856). The present rules may therefore already catch part of 624.1, 624.2 and 624.3 once the send-back is delivered. That is not shown until a run with fix 2.
C. THE DEFENDER'S LIST AGAINST THE CHALLENGER WAS NOT READ (AAR DEFECT 2, "LINK ROUND FORFEITED" false). The judges weighed the challenger with no ledger entries against it. Part of 624.3 (one-sided weighing) may come from that engine defect and not from the judges.
MY RECOMMENDATION, for the team's review before it goes to the operator: write fix 2; repair the premise-list reader; judge this same debate again or run once more; then count the five flaws again. Build 624.5 now if the operator approves it, because it does not depend on A, B or C.

---

## 624.1 A disagreement is counted as a concession
1. OBJECTIVE: a premise is counted UNEXHIBITED only when a layer is missing or a proven press has no answer at all. An answer the judge thinks is wrong is graded on its collision line (LINK BROKEN with its FORCED line, ruling 411) and is not also counted as a conceded link. Expected effect: one failing is charged once; a defense is not marked COLLAPSED by counts of answered presses.
   SEEN: sol62 counted five of six defender premises "unanswered in meaning" while writing "none is an express surrender" and "The blocks exhibit their layers", giving DEFENSE STANDING: COLLAPSED. sol62 also grades four collision lines DEFENDER LINK BROKEN with a FORCED line (D1 vs C2, D2 vs C6, D3 vs C4, D4 vs C3). The premises listed against the defender are numbered apart from the defender's links, and I do not map one numbering to the other here; the count is W1's to supply in the plan. sol counted two the same way; chatgpt one.
2. ROLES: planner W3; builder W4; grader W1; the card in W4's thread. NOT BEFORE THE OPERATOR'S INSTRUCTION ON REASONING.
3. SCOPE: not searched. For W4: where the judges' instruction defines UNEXHIBITED and "pressed witness left unanswered"; the K-UNX check (TRIAL; ASK 330, ruling 460), which in this run was raised for challenger premises on an ASSUMES ground and not for the defender premises counted "unanswered in meaning"; the E-PREM enforcer read; the standings computation (engine manual section 8). Whether the change is a line of the judges' text, a widening of K-UNX, or both, is for the plan.
4. CRITERIA and DONE: for the plan. At least: (a) on the stored judgments of 42373, the check names sol62's premises 1, 2, 3, 4 and 6, sol's 2 and 6 and chatgpt's 6; (b) it names none where the block lacks a layer or the press has no answer; (c) the count of stored runs it would have changed is stated.
5. WRONG-IF: the operator holds that an answer which fails in meaning IS a pressed witness left unanswered (then the present counting is his rule and only the double charge remains to settle); or the enforcer's E-PREM send-back already corrects it when delivered (limit B).
6. RUN EVIDENCE: for the plan (ASK 417 registry entry). Likely mark: no judgment holds a premise counted UNEXHIBITED whose ANSWER CHECK for the same witness reads MEETS or FAILS on meaning without a missing layer.
7. INPUTS IN GIT: aar/w3/run42373/ (commit 1239caa5); W1's review 8a67e80c.
8. STEPS: the operator's instruction; the count on stored runs (W1 or W3, SQL only); W4's search; plan; W1's grade; card; build; two live runs.

## 624.2 The break does not meet the answer the debater gave
1. OBJECTIVE: a LINK BROKEN or FORCED line quotes, in its MEETS, the debater's answer to the very witness the break rests on. Expected effect: a link is not broken past an answer the judge never weighed.
   SEEN: the defender answered Luke 1:34 by its tense (a present state, the conceiving still future). sol62's and sol's own ANSWER CHECK lines grade that answer MEETS "as to the stated time". Their break lines on D2 vs C6 and D6 vs C6 rest on Luke 1:34 "as the obstacle" and quote in MEETS only the Ruth 4:13 sentence. The enforcer marked D2 vs C6 "right: STANDS" for both judges; the send-back was not delivered (limit B).
2. ROLES: as 624.1. NOT BEFORE THE OPERATOR'S INSTRUCTION ON REASONING.
3. SCOPE: not searched. For W4: the FORCED line's form and its reader K-F; the E-COL enforcer read; the judges' instruction for MEETS.
4. CRITERIA and DONE: for the plan. At least: on 42373 the check names sol62 D2 vs C6 and D6 vs C6 and sol D2 vs C6 and D6 vs C6; it names no break whose MEETS quotes the answer to its own GROUND witness.
5. WRONG-IF: the E-COL send-back, once delivered, already brings the judge to the answer (limit B); or matching "the answer to that exact witness" cannot be done by code without reading meaning, in which case it is an enforcer question and not an engine check.
6. RUN EVIDENCE: for the plan.
7. INPUTS IN GIT: as 624.1.
8. STEPS: as 624.1.

## 624.3 The two sides are not weighed alike
1. OBJECTIVE: before a judge names WHICH HOLDS, it weighs both sides' exhibited routes on the shared point. Expected effect: a side whose own route the judge finds UNEXHIBITED is not named as holding without a stated reason that meets that finding.
   SEEN: all three judges find the challenger's route of David's seed through Mary (Luke 3:23, 31) UNEXHIBITED, name the CHALLENGER as holding, and grade D1 vs C1 UNDERDETERMINED. sol62 and sol do state the reason in their WHICH HOLDS line ("even though the proposed route through Nathan is not established"; "although the proposed maternal genealogy ... remain unexhibited"), and both write RESULT UNDERDETERMINED for that reason. So the record shows the judges saw the weakness and discounted the RESULT for it; what W1 charges is that the collision D1 vs C1 was not then decided for the defender's route.
2. ROLES: as 624.1. NOT BEFORE THE OPERATOR'S INSTRUCTION ON REASONING.
3. SCOPE: not searched. For W4: the WHOLE POSITIONS and WHICH HOLDS instruction (ASK 507, Commitment 17, TRIAL; E-WHL); the UNDERDETERMINED rule for a collision.
4. CRITERIA and DONE: for the plan.
5. WRONG-IF: the judges had no ledger against the challenger because of the reader defect (limit C), and with it they weigh both; or the operator holds that a failed route on one side does not by itself establish the other side's route, which is what UNDERDETERMINED says now.
6. RUN EVIDENCE: for the plan.
7. INPUTS IN GIT: as 624.1.
8. STEPS: first the premise-list reader's repair and a run; then the count; then the operator's instruction if the flaw remains.

## 624.4 The burden is put on one side (Jeremiah 22:30, Haggai 2:23, Jeremiah 18:8)
1. OBJECTIVE: NOT STATED BY ANYONE YET. W1 proposes no fix and puts the question to the operator. The observation: sol62 sets aside Haggai 2:23 (the signet) because Haggai 2:21 calls Zerubbabel governor, and sol62 and chatgpt require the defender to show the "turning" of Jeremiah 18:8, while the challenger is not required to show that the sentence still binds the line.
   AGAINST THE OBSERVATION, from the record: the challenger did answer Haggai 2:23 and Jeremiah 18:8 in its link round, and sol62 and sol grade those answers MEETS; the judges' break is stated as a judgment of meaning with a FORCED line, which ruling 411 allows and ruling 428 leaves to the judge.
2. ROLES: NONE until the operator rules whether this is a flaw of method or the judges' decision.
3. SCOPE: NONE; nothing is proposed.
4. CRITERIA and DONE: NONE; nothing is proposed.
5. WRONG-IF: this is a disagreement with the judges' reading of the verses and not a fault of method. Then nothing is built, by ruling 428.
6. RUN EVIDENCE: NO PROBE; nothing is proposed.
7. INPUTS IN GIT: as 624.1.
8. STEPS: one question to the operator, below.

## 624.5 A judgment's own lines disagree after a cure
1. OBJECTIVE: after a cure or a send-back changes a judge's line, the engine checks that the judge's WHICH HOLDS, RESULT, verdict and counts agree, and sends the judge the lines that do not, before the seat is counted. The judge decides which line changes (ruling 428). Expected effect: no seat is counted for one side while its own WHICH HOLDS names the other.
   SEEN: chatgpt was counted HELD, engine word DEFENDER WINS, while its judgment reads "WHICH HOLDS: CHALLENGER", counts premise 6 on the retracted Jeremiah 22:30 press, and keeps a ruling card "the chain it relies on is broken at D1". The engine found the WHICH HOLDS mismatch (E-WHL, id 54038) and did not send it, because E-WHL is a TRIAL rule (ASK 507). AUDIT v54 recorded "the pair D1/C2 carries two grades" (TRIAL, record-only). The enforcer's second reading of the retracted line reads DISAGREE, right: BROKEN, RECORD-ONLY (id 54055). Also in W1's 624.5: sol62 charges a CR3/CR4 CONTRADICTION that sol rules NOT HELD on the same words.
2. ROLES: planner W3; builder W4; grader W1; the card in W4's thread. It changes no instruction to a judge. It does change which TRIAL items are sent, which by ruling 512 is carded to the operator to go live.
3. SCOPE: not searched. For W4: E-WHL (ASK 507) and pkgGCA (ASK 323), both TRIAL; the K-G4 cure, where a retraction is accepted without the lines that rest on the same press; the late gate, where the item would be sent; the recompute (AUDIT v25) and E-APPLY. The smallest change may be to make these two trial items live at the gate. The sol62 against sol difference on the CONTRADICTION is two judges deciding differently and is NOT in this scope.
4. CRITERIA and DONE: for the plan. At least: (a) on the stored chatgpt judgment of 42373 the check raises WHICH HOLDS against RESULT, premise 6 against the retraction, and the D6 ruling card; (b) on the stored sol and sol62 judgments it raises nothing that the rules do not already allow (verdict BROKEN with RESULT UNDERDETERMINED is a defined outcome, engine manual section 8); (c) the alternate's path and the panel's path are both covered, with the request body rebuilt as fix 2 does.
5. WRONG-IF: a judge sent the mismatch does not answer in form and is removed for it, so that the check costs seats; or WHICH HOLDS is meant to stay a trial reading that never binds the RESULT.
6. RUN EVIDENCE: for the plan. Likely mark: an E-WHL or grade-consistency row with a send-back answered, and no stored judgment whose engine word names one side beside WHICH HOLDS for the other.
7. INPUTS IN GIT: as 624.1; Worker_A3's finding 2 (Wall 11777).
8. STEPS: the operator's approval to plan; W4's search; plan; W1's grade; card; build after fix 2 is written; two live runs.

---

## FOR THE OPERATOR, when the team has reviewed this draft (one question at a time; the first only)
1. Do you instruct the team to plan changes to the judges' reasoning for 624.1, 624.2 and 624.3, or to wait for one run with the send-back repaired and count the flaws again first?

## FOR W1 AND W4
1. W1: check that each SEEN line is your finding as you meant it, and that 624.3's and 624.4's "against" lines are fair.
2. W4: say for 624.5 whether E-WHL and pkgGCA can be sent at the gate as they stand.
