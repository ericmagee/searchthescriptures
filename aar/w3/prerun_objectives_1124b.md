# PRE-RUN AAR OBJECTIVES, second sheet, for run 42373, which the operator started about 17:05 CST 2026-11-24 (draft 2)

W3 (session_01H1X3ANsGiMnhnbkfphocmo), on the coordinator's order of 17:05 CST. Written while the run is live, from files and from what I had read before it started. I read nothing of the run and made no database read for this sheet.

- LIVE at the start (W1 readback, Wall 11743): engine 20db58ee, child 74353c40, LIB 2f5aa1e63d51edb1. Judge order as the table holds it: panel sol, sol62, spark; alternates chatgpt, qwen4max, gemini, argon, sonnet, hydrogen, neon (log ids 1, 2, 5).
- The last stored run before it: 42283 (13:48 CST), which did not finish its judging and counted as a live run for no change.
- THE FIRST SHEET STILL STANDS: aar/w3/prerun_objectives_1124.md (0cc2e269), items 1 to 11 (ASK 587, 588, 590, 593, 595, 594, 586 J1, J6, J2, J3, 591). The run's AAR answers those eleven and the six below.
- THE PAIRING, as the coordinator relayed it from W1 at 17:07 CST (not read by me): run 42373, launch 101; challenger claude (plain), defender opus (the Oracle); both Anthropic. It is the pairing of run 42283. Section 11a marks each item for this pairing. Draft 1 (d33ff2d1) did not know the pairing; draft 2 adds this line and section 11a and changes nothing else.

## 11a. WHAT THIS PAIRING CAN SHOW (claude against opus, both Anthropic)
- 12, ASK 611 with fix 1: CAN FIRE, all checks. The alternate pass shows only if a judge is removed.
- 13, the anchor fix: CAN FIRE for the log row. The OpenRouter answer route CANNOT fire (both debaters are Anthropic seats).
- 14, ASK 601: CAN FIRE. The challenger runs the model of the seat sonnet, so sonnet should stand in the alternates list and not among the SEATED, as on 42283; this time with a judgment.
- 15, ASK 608: the no-change path only. No debater is an OpenAI seat, so the enforcer stays luna. The backup seat glm is UNEXERCISED by this run whatever it shows.
- 16, ASK 607: only if a gate CHANGE TO is refused for form. Otherwise UNEXERCISED.
- 17, ASK 623: neither new seat debates. The always-line can show (order version 5, alternates list ending hydrogen, neon). Either seat judges only if the alternates ahead of it are used up (chatgpt, qwen4max, gemini, argon; sonnet is out by ASK 601). Otherwise UNEXERCISED as debaters and as judges.
- First sheet: items 2 (the question round, Anthropic route only), 4, 7 to 11 can fire once the run is judged; item 6 (ASK 594) only if a panel seat fails with qwen4max as the failed seat or the reserve.
- Each OBJECTIVE is the ASK's own, from its plan or its AAR row. It is never a command from the operator. MET is answered YES, NO, IN PART, UNEXERCISED or NOT SHOWN.
- TWO LIVE RUNS (the operator, 10:38 CST 2026-11-24): "if a change goes through 2 live runs with no issues, it's considered a pass." This run can be the FIRST of the two for each change below, and only if it finishes with a judgment and that change's path fired without a fault.

## 12. ASK 611 with fix 1: the judging's load (plan611.md; no AAR row yet)
OBJECTIVE: lower what one run holds in memory during the judging by removing four steps' extra copies of requests that carry the debate; what each judge, enforcer and debater is sent stays the same, byte for byte.
EXPECT (always; the plan's RUN EVIDENCE):
- the run finishes and writes an outcome (42234 did not; 42283 did not);
- the question-round log row for the run is not SKIPPED;
- all three judges' verdicts are recorded;
- the closing enforcer has rows for both sides, from both copies;
- review_notes holds no "pkgPDS: no reply in the batch call" and no "no body" error.
FIX 1 (13:58 CST): Panel Judges Parallel and Alternate Pass Call each build and send their request. On 42283 the judging did not start because those two expressions ended at an inner "}}". EXPECT: three judge calls delivered; (ONLY IF an alternate pass runs) the child executes and returns.
OPEN AFTER THIS RUN: the manual entry and the AAR row for ASK 611 are mine, owed after a clean run.

## 13. The question round's anchor fix (ASK 588, 11:28 CST)
OBJECTIVE: the question block is placed before the transcript in every judge request.
EXPECT (always): odv1_question_round_log has one row for the run_token, status RAN. Whether each judge request carried the block is EXECUTION ONLY (W4 reads it). On 42283 the row read RAN and no judge call was delivered. (ONLY IF a debater is not an Anthropic seat) the OpenRouter answer route runs; on 42283 it did not.

## 14. ASK 601: no judge runs a debater's model (row 172)
OBJECTIVE: a judge whose model is the same as either debater's model never sits: not on the panel, not as the reserve, and not as an alternate, also when both debaters are Anthropic.
EXPECT:
- (always) no seated judge, reserve or alternate in the JUDGE ORDER line of review_notes runs the model of either debater;
- (ONLY IF a debater's model is also a seat of the judge order) that seat stands in the lists and not among the SEATED; the dropped seat's reason is not written to the run's record (shown offline only);
- the run is judged. Shown in part by 42283 (sonnet left out), which had no judgment.

## 15. ASK 608: the enforcer is never of a debater's family (row 176)
OBJECTIVE: the enforcer may not be of the same model family as a debater.
EXPECT:
- (ONLY IF a debater is an OpenAI seat) the execution's custom data enforcer_seat reads glm (EXECUTION ONLY, W4), the enforcer's rows in debate_enforcer_log are recorded and answered, and the alternates in the JUDGE ORDER line leave out the enforcer seat;
- (ONLY IF no debater is an OpenAI seat) the enforcer is luna and the run reads as before: UNEXERCISED for the backup seat;
- (ONLY IF glm debates against chatgpt or sol62) the run stops before any round with a line beginning "ENFORCER:".
MEASURE, first time: how glm answers the enforcer's reads against luna (rows answered, items raised, send-backs). This is not measured anywhere yet.

## 16. ASK 607: a gate change in no line form is recorded, not counted (row 175)
OBJECTIVE: when a judge answers a NOT APPLIED item at the gate with a CHANGE TO that the engine cannot read as any line form, the refusal is stored with its reason, the judge's line before the change stands, and nothing counts toward removing the seat.
EXPECT:
- (ONLY IF a judge's gate CHANGE TO is refused as "the CHANGE TO line has no line form the engine reads") an E-GATE row whose cure_reason begins "GATE CHANGE TO" and whose result reads "pkgFRM refused the gate change ... (RECORD-ONLY)"; no seat removed for it; removed_rules names no E-GATE NOT APPLIED for that item;
- (always) a silent gate item and a KEEP read as before; a placement refusal ("the flagged line is not in the judge text") is still counted.
LIKELY UNEXERCISED: the last stored form refusal at the gate before the write was on 11-10.

## 17. ASK 623: Gemini 4 Hydrogen and Gemini 4 Neon debate and judge (rows 173, 174)
OBJECTIVE: the operator can choose Gemini 4 Neon or Gemini 4 Hydrogen as either debater and place each as a panel judge or an alternate; both stand under every rule that binds the present seats.
EXPECT:
- (always) the JUDGE ORDER line reads version 5 and its alternates list ends hydrogen, neon; no present pairing changes its judges, reserve or enforcer by this ASK;
- (ONLY IF hydrogen or neon debates) Init Seats accepts the seat; each of its rounds is complete (finish stop, not length; no reasoning setting is sent); no seated judge, reserve or alternate is a Google seat; against chatgpt or sol62 the judges are spark, qwen4max, sonnet with glm enforcing and no reserve or alternate; Neon against Hydrogen is judged by sol62, spark, sol with luna enforcing;
- (ONLY IF a judge is removed and the alternates ahead are used up, and no Google seat debates) hydrogen or neon may be offered the seat; the recorder accepts it.
MEASURE (ONLY IF either debates): output tokens against the limit per round. In the check calls about three quarters of each model's output was reasoning.

## 18. WHAT THIS RUN CANNOT SHOW
- ASK 578 and 579 are not written. ASK 597 and 598 are not built. ASK 596, 599, 600 and 612 are not run features.

## 19. AAR SKELETON for this run (Wall manual section 7.4 order; to be filled after the run ends)
File: aar/w3/aar_run<N>_draft1.md. Nothing is read before the run has ended and W4 says nothing is running.
- RUN: run_token; pairing and Oracle seat; engine, child and LIB as above; start and end (CST); outcome; costs; the judging load line (ASK 618, from W4's measure).
- OBJECTIVE: items 1 to 11 of the first sheet and 12 to 17 of this one, each with RESULT, evidence and MET.
- REVIEWS: the judges' texts read in full by me; the coordinator reads the transcript itself.
- DEFECTS: numbered; each with the row or line that shows it, and whether it is the engine's, a model's or the record's.
- WHAT WENT RIGHT. WHAT WENT WRONG.
- SUGGESTED IMPROVEMENTS (none planned, none graded unless stated).
- KNOWLEDGE BASE.
- FOR THE OPERATOR: which changes this run counts for under TWO LIVE RUNS, by name; what is owed next.
READS I WILL MAKE (SQL only, after the run): debate_results (the run's row), debate_enforcer_log, debate_removals, odv1_question_round_log, the judgments, call costs. EXECUTION ONLY items (enforcer_seat, whether a request carried a block, node executions) are W4's to read on the operator's standing limits.

## 20. FOR W1
1. Items 12, 13 and 15 to 17 take their EXPECT lines from the plans, W4's notes and the AAR rows named; where I shortened, the row or plan governs. Check them against the live code.
2. Item 17's judge line-ups are from notes623.md (t623), not re-run by me.
