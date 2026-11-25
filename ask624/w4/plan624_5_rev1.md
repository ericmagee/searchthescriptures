# ASK 624.5 PLAN rev 1 (W4): a judgment whose own deciding lines disagree after the cure is sent back before it is counted

Ruling: the operator pressed "Wait for a run; plan part 5 now" at 18:00 CST 11-24: "Reasoning is untouched. W4 plans the engine check for a judgment that contradicts itself." Sources: ask624/w3/ask624_draft2.md 67276353 (624.5), Wall 11777 (Worker_A3 finding 2, solution 2a and 2b), Wall 11798 (W4: E-WHL and pkgGCA cannot be sent as they stand).

## OBJECTIVE
After the cure, the send-back and the gate have changed a judge's lines, the engine checks that the judgment still agrees with itself, and sends the judge each disagreement before the seat is counted. The judge chooses which line changes (ruling 428). No instruction to a judge changes: the item text names the two lines that disagree, as every send-back item does. Expected effect: no seat is counted for one side while its own WHICH HOLDS names the other (42373: chatgpt counted HELD, DEFENDER WINS, beside "WHICH HOLDS: CHALLENGER").

## ROLES
Plan and build W4; grade W1; the write on W4's own card; manual entry and AAR row W3.

## SCOPE, with SEARCH (re-based 18:55 CST 11-24 on live engine 634afc23, child 85515391, after ASK 627 and 628; Late Gate Build, Alt Late Gate Build, Send Back Build, Alternate Merge are unchanged since 6b2cc236; Library lines WHL507 3559, sbApply2024 1403, sbLabel0 1374-1375 unchanged)
Searched:
- WHL507 (LIB 3559): faults(text, tag) already finds "WHICH HOLDS AGREEMENT": WHICH HOLDS CHALLENGER with a verdict other than BROKEN, or WHICH HOLDS DEFENDER with BROKEN. Today it is called only in Send Back Build (LIB 2913), on the bodies BEFORE the send-back and the gate, and its rows are record-only (t507).
- The chatgpt mismatch arose AFTER that point: the K-G4 send-back retracted D1 vs C2, the gate set D1 vs C2 and D2 vs C6 to STANDS, and the engine recomputed HELD. So the check must run on the text after the gate, with the engine's recomputed verdict. The last stage that can still send is the late gate (Late Gate Build; Alt Late Gate Build; child R2 Alt Late Gate Build). Its record step (Gate Record; Alt Gate Record; child R2 Alt Gate Record) decides a cure per item.
- Apply path (sbApply2024, LIB 1403): a CHANGE TO a RESULT line is applied today (resTo, pkgRI5B). A CHANGE TO a WHICH HOLDS line is not: sbLabel0 knows KEYSTONE, CONCEDED LINKS, STANDING and CLAUSE labels but not WHICH HOLDS, so it comes back NOT APPLIED and, since ASK 607, record-only.
- pkgGCA (ASK 323) stands only in Alternate Merge, as an audit text line on the alternate's verdict ("the pair D1/C2 carries two grades"); the panel path has no such check.
### Changes
1. Late gate check (the three late-gate builders, one shared Library text): on each counted judge's text after the gate, three item kinds are added to the late gate's items for that seat:
   (a) E-WHL AGREEMENT: WHL507.faults on the text with the engine's recomputed verdict word gives a WHICH HOLDS AGREEMENT fault. The item quotes the WHICH HOLDS line and the RESULT line.
   (b) E-RTL (retraction left standing, Worker_A3 2b): the gate applied "RETRACTED: Dn vs Cm" and a line still grades that pair BROKEN or cites it as broken (a ruling card or ruling line naming the pair, or a CONCEDED LINKS premise counted on that press). The item quotes the retraction and the line that still rests on it.
   (c) E-GCA: the same pair carries two different grades in the text (the pkgGCA reading, moved into the shared Library so both paths use it).
2. Apply: sbLabel0 learns the label WHICH HOLDS, so a CHANGE TO a whole WHICH HOLDS line replaces the one WHICH HOLDS line, as a KEYSTONE line is replaced today. RESULT and pair lines apply as today.
3. Cure (Gate Record, Alt Gate Record, child R2 Alt Gate Record): an item of these kinds is CURED when the check, run again on the text after the apply, no longer raises it; a KEEP with a reason, or no answer, leaves it UNCURED. The consequence of UNCURED is the operator's question below.
4. Send Back Build: its t507 E-WHL AGREEMENT rows stay record-only there (the gate may still change the text); the live check is the late one.
### NOT IN SCOPE
Any judge instruction or prompt text; 624.1 to 624.4; sol62 against sol on the CONTRADICTION (two judges deciding differently); the other E-WHL faults (missing POSITION lines, WHICH HOLDS form), which stay TRIAL.

## THE OPERATOR'S QUESTION (on the card, one question)
When a judge keeps a disagreement (KEEP or no answer), is the item counted as uncured (drv_uncured; it can remove the seat, an alternate is then tried), or recorded only (the seat counts, the record names the disagreement)? Recommendation: counted, because a seat whose own WHICH HOLDS names the other side is not a reading of the text (WRONG-IF 1 covers the cost).

## CRITERIA AND DONE
C1 Stored 42373 chatgpt judgment (final text and stored verdict): the check raises (a) WHICH HOLDS CHALLENGER against HELD; (b) the retracted D1 vs C2 against the ruling card "so D1 is broken", the ruling D6 "broken at D1" and premise 6 counted on the Jeremiah 22:30 press; (c) D1/C2 with two grades.
C2 Stored 42373 sol and sol62 judgments: nothing raised (BROKEN with WHICH HOLDS CHALLENGER and RESULT UNDERDETERMINED is a defined outcome, manual section 8). Also stored judgments of runs 42071 and 42283 that were counted: every item raised is listed, and each is shown to be a real disagreement or the check is narrowed.
C3 Apply: a CHANGE TO "WHICH HOLDS: DEFENDER ..." replaces the one WHICH HOLDS line; with two WHICH HOLDS lines it is NOT APPLIED (no guess). A CHANGE TO a RESULT line applies as today.
C4 Cure: the re-check decides; KEEP and no answer stay UNCURED; the chosen consequence acts as ruled.
C5 Both paths: panel late gate, alternate late gate, child R2 late gate, with the request bodies rebuilt as fix 2 does.
C6 Standing set 31/0 with S4; pair Library Check; ASK 599 (tags, no dead code); only the named Library texts change.

## WRONG-IF
1. A judge sent the disagreement does not answer in form and loses the seat for it, so the check costs seats without changing a verdict. Counted per run; if it happens in either of the two proving runs, the operator is told.
2. WHICH HOLDS is meant to stay a trial reading that never binds the RESULT (then 624.5 is not built).
3. A retraction detection (b) matches a line that does not rest on the retracted press (C2 lists every hit to prevent this).

## RUN EVIDENCE
A late gate row of kind E-WHL AGREEMENT, E-RTL or E-GCA, sent and answered; and no stored judgment whose engine word names one side beside its WHICH HOLDS for the other. Two live runs; the item is likely rare, so the first runs may be UNEXERCISED.

## STEPS
1. W1 grades this plan. 2. Card: the plan and the one question. 3. Build on a fresh fetch (after 627), with C1 to C6; W1 grades. 4. Write card. 5. Fetch-back, audit, Wall, W1 readback; W3 manual entry and AAR row.


## REV 1 (18:55 CST 11-24)
Re-based on live 634afc23 / 85515391 (ASK 627 and 628 written). None of the nodes in scope changed. Correction: rev 0 named the record node "Late Gate Record"; no such node exists. The late gate call feeds Gate Record (engine), Alt Gate Record (engine) and R2 Alt Gate Record (child). Rev 0 kept as plan624_5_rev0.md.
Reasoning fence (ASK 624 ruling, journal 2163): every item quotes the two lines that disagree and asks the judge to change one or KEEP with a reason; no item says which line or which side is right.
