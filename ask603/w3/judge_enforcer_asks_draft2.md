# JUDGES AND ENFORCERS: ASK LIST 603 TO 610 (draft 2)

DRAFT 2 applies W1's grade of draft 1 (Wall 11615: PASS WITH F1 TO F3, N1): F1 is ASK 609; F2 is ASK 610; F3 is answered with the code path (NOT NUMBERED item 1a); N1: ASK 605 no longer uses the name "G4". W4's answer on 603 (thread note, 11:41 CST) is added.

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST. On the operator's word of 10:57 CST 2026-11-24 ("we need to focus on the judges and enforcers next") and the coordinator's numbers (603 for C, 604 for D, the open run 42071 items from 605 in order; 609 and 610 are added on W1's grade under the same order). These are ASK DRAFTS: an objective, the evidence, and what each needs next. None is planned, graded, built or carded.

LIMIT: run 42234 stored no judgment and no enforcer row (AAR draft 4, aar/w3/aar_run42234_draft4.md). So nothing below is drawn from the judges' or enforcers' work on that run. 603 and 604 come from its crash; 605 to 610 are the judge and enforcer items of run 42071 that the record shows open (W1's priority list, Wall 11358; AAR aar/w3/aar_run42071_final.md 45afa0c5).

RULES READ: rulings 383, 428, 512; "NEVER TOUCH REASONING. UNLESS I INSTRUCT IT." (none of 603 to 610 touches a judge's reasoning); TWO LIVE RUNS (operational document v145); the scope rule; ASK 597 as pressed ("All models and debaters whole").

## ASK 603: keep each seat's work as the seat finishes
OBJECTIVE: a judge's judgment row and its enforcer rows are stored when that seat finishes, so a run that dies in the judging loses at most the seat in progress.
EVIDENCE: run 42234 ran 92 minutes and stored 0 judgment rows, 0 enforcer rows and no cost (AAR 42234 DEFECT 4). Run 42071 wrote all 508 enforcer rows in one second, 26 minutes after its rounds were saved. W4 (thread notes 11:33 and 11:41 CST) finds the change sound, after its measure too, and adds: it keeps finished work if the instance dies; it does not lower the memory load, which only smaller bodies do.
NEEDS: W4's plan (where each seat's rows are written; how the end-of-run write treats rows already stored; what a regrade reads). Grade by W1. Card by W4.
EXPECT, when built: on any run, debate_judgments and debate_enforcer_log rows carry created_at times spread across the judging, not one second.

## ASK 604: a LAY-only replacement round must not grow without bound
OBJECTIVE: when the engine re-calls a debater for LAY items alone (0 barred sentences), the kept replacement does not make the round longer without limit.
EVIDENCE: run 42234, three v47 re-calls on the defender with 0 barred sentences kept replacements of 27,108 to 30,314 (CR2), 41,571 to 54,347 (CR3) and 30,841 to 35,743 (CR4): +20,884 characters. The eight rounds total 223,175 (run 42071: 143,318). W4's measure (Wall 11606): each panel judge body 295,851 characters (+40% on 42071), each defender-side close enforcer body 303,638 (+65%); the growth is the transcript.
LIMIT ON ANY FIX: ASK 597 as pressed keeps every model's and debater's words whole, so the engine may not cut a round. What remains open to a plan: what the re-call asks of the debater, and which of the two rounds is kept. No ruling covers round size.
NEEDS: a finding first (W3, by SQL on stored runs: how often a LAY-only re-call fires and by how much the round grows), then a plan and one question to the operator.

## ASK 605: an alternate offered to one removed seat is refused to the others (run 42071 DEFECT 3)
OBJECTIVE: one failed alternate does not leave the other removed seats with no alternate.
EVIDENCE: run 42071 (engine 196402d0): argon was offered once and failed; the alternate guard then refused it as "already offered to an earlier removed seat" and qwen4max and spark stayed unfilled; the run went UNGRADED (Wall 11294, 11358 item 6). That guard was named G4 then.
NAME (W1 N1; W4 thread note 11:41 CST): no "G4" stands in the live engine or in any public function now; the live odv1_record_panel_alternates holds guards G1 to G3, and ASK 601 adds a new database guard it calls G4, which is a different rule. This ASK means the engine's alternate guard by its text, not by that name.
NOT KNOWN: whether the live engine still marks an alternate used when it is offered, not when it is seated, under the ASK 591 order of five alternates. W4 reads the live code after the ASK 601 build.
NEEDS: W4's code read, then a plan. W1 called it a design and model-setting question; a model setting needs the operator's word.

## ASK 606: the removed seat's line is never written (run 42071 DEFECT 8; ASK 550)
OBJECTIVE: review_notes carries the "[REMOVED SEAT" line for every removed seat, and the "PANEL SEAT LEFT UNFILLED" line when a seat stays empty.
EVIDENCE: W4's code read (ask587/w4/plan587_rev2.md B1): Build Save Body writes these lines only if Alternate Merge has executed, and it runs before Alternate Merge, so neither line ever fires. No run since 11-20 holds either line though six had removals.
NEEDS: W4's plan with the design choice named there (Format Markdown builds the section, or a later node patches review_notes). The record is wrong; no result is changed (Wall 11358 item 10).

## ASK 607: a gate change refused for form is counted UNCURED (run 42071 row 53202; W4's B4)
OBJECTIVE: the operator rules whether a judge's own bad form at the gate may cost the seat.
EVIDENCE: ASK 549 makes only two kinds of refusal record-only; a change refused as "no line form the engine reads" is counted UNCURED. ASK 587 removed the engine-made case only (Wall 11358 item 5).
NEEDS: a ruling, not a build. One question to the operator with row 53202 shown; a plan follows his answer.

## ASK 608: the enforcer is of a debater's family (run 42071 WHAT WENT WRONG 5; FOR THE OPERATOR 2)
OBJECTIVE: the operator rules whether the enforcer may be of the same model family as a debater.
EVIDENCE: run 42071, enforcer openai/gpt-6-luna, defender openai/gpt-6.2-sol. On the enforcer's send-back gemini changed its verdict from BROKEN to HELD by its own CHANGE TO answers, and the enforcer told qwen4max and spark the right grade was STANDS for the defender (both answered KEEP). Guard G1 covers judges only. I found no ruling on it in md_notes_rulings (search of rows 500 and after for "family"). ASK 601 covers a judge that shares a debater's model, not the enforcer.
NEEDS: a ruling, not a build. A model setting is the operator's alone.

## ASK 609: the engine's recompute replaces a judge's own RESULT word (run 42071 DEFECTS 6 and 13; FOR THE OPERATOR 1; W1 F1)
OBJECTIVE: the operator rules whether the recompute may replace a judge's own RESULT word, and its own CHALLENGE STANDING, at all.
EVIDENCE: run 42071, AUDIT v25 replaced spark's and qwen4max's own RESULT: UNDERDETERMINED with CHALLENGER WINS, and wrote CHALLENGE STANDING SELF-SUPPORTED over each judge's PROP-DEPENDENT. ASK 587 D covers one case only: no challenger win past a counted challenger break.
WHAT THE RECORD HOLDS ON EACH HALF:
1. The RESULT word: engine manual part 08.0, "ONE DECIDER FOR THE RESULT WORD" (ASK 386), makes the engine the decider; the ASK 586 plan closed its item J5 on that as the written rule. W1 (Wall 11303): read with part 09.3 it leaves a gap, and "NO RULE COVERS IT" as against ruling 428 (the judge keeps the decision).
2. The standing: W4 withdrew a change to it (ask587/w4/plan587_rev2.md section 3 item 1) because it would reverse ASK 517 and the operator's word on run 41117, "by rulebook definition, L=6, c=0 is SELF-SUPPORTED, never PROP-DEPENDENT".
I found no card that put the question of run 42071's AAR, FOR THE OPERATOR 1, to him.
NEEDS: a ruling, not a build. One question to the operator with spark's and qwen4max's own lines beside the AUDIT v25 rows.

## ASK 610: what a closing-contradiction flag needs before it counts (run 42071 DEFECT 5, row 52867; FOR THE OPERATOR 3; W1 F2)
OBJECTIVE: a flag that two closing sentences contradict counts only when they cannot both be true; and the flag of row 52867 is settled.
EVIDENCE: run 42071, the enforcer flagged the challenger's C1; W1 and W4 read the two sentences as agreeing; the flag changed gemini's D3 vs C1 grade and two RESULT words. Since ASK 587 D a confirmed flag that no collision line names also blocks CHALLENGER WINS (Wall 11358 item 3), so a false flag now changes the result.
WHAT ASK 590 DID AND DID NOT DO: it moved the read into the closing enforcer's two reads, whose answers are CONFIRMED, REVERSED READING or NOT A CONTRADICTION. It did not decide row 52867, and I have not shown that its two reads would answer NOT A CONTRADICTION there.
NEEDS: W4's offline replay of row 52867 under the live ASK 590 check. If it answers NOT A CONTRADICTION, the item closes as covered by 590 with that proof. If it answers CONFIRMED, one question to the operator with the two sentences shown.

## NOT NUMBERED, AND WHY
1. Run 42071 DEFECTS 1, 2, 4: ASK 587 A, B, C1 and C2, live and UNEXERCISED. DEFECTS 6 and 13 are covered by 587 D only for a challenger win past a counted challenger break; the wider question is ASK 609.
1a. DEFECT 9 ("UNREAD COUNTED LINE x2"; W1 F3): ASK 587 item E, the code path shown in ask586/w4/plan586_rev0_combined.md: "LIB 1588 tallies "UNREAD COUNTED LINE" for any line with "counted in drv_uncured" that matches no known pattern"; "Spark's send-back item lines S8 and S9 hold "an item left uncured there is counted in drv_uncured". This explains "UNREAD COUNTED LINE x2""; item E changes LIB 1588; its criterion: "removed_rules carries no "UNREAD COUNTED LINE" from a SEND-BACK ITEM line". W1 passed E at Wall 11330. Live and UNEXERCISED. My guess in the AAR (the "Premise 4: VOID (ONLY)" line) was wrong; the code read replaced it.
2. DEFECT 5 (the closing-contradiction flag): the check was moved by ASK 590, live and UNEXERCISED; the flag itself is ASK 610.
3. DEFECT 7 (gemini's three results): closed as covered by 587 A (W4 replay Wall 11366; W1 Wall 11368).
4. DEFECT 10: the spliced quotation was cured in the record (W1 Wall 11338).
5. DEFECTS 14, 15 and 22, 16, 19: ASK 586 J1, J3, J2, J6, live and UNEXERCISED.
6. FOR THE OPERATOR 5 (run 42071 judged again with the form checks fixed): a regrade, the operator's own plan of 01:34 CST 2026-11-24; no ASK.
7. DEFECTS 11, 12, 17, 18, 20, 21: the debaters' text, not the judges or enforcers (AAR 42234 improvement F).

## ORDER PROPOSED
603 first: it protects every later run and regrade. Then 604 (its finding is SQL only). 607, 608 and 609 are one question each to the operator, put one at a time, and can go while 603 is planned. 605, 606 and 610 follow W4's reads.

## FOR W1
1. Confirm F1 to F3 and N1 are met.
2. Items 605, 606 and NOT NUMBERED 1a rest on W4's code reads as posted, not on my own read.
