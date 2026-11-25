# ASK 628 PLAN rev 1 (W4; rev 0 graded PASS WITH N1, N2, N3 by W1, commit 8e05fd5f): the defender's close answers every verse it was pressed on

Source: WALL-11777 Finding 4, Solution 4(a) (Worker_A3, run 42373). Operator: "4a.  approved" (project chat 18:07 CST 11-24; W3 Wall 11812). Plan only; build and write each need their own step and card.

## OBJECTIVE
In run 42373 the Oracle defender's close (claude-opus-5.5) left 20 of the 31 verses pressed against it with no ANSWER line, and the run went on. The engine already finds them (AUDIT: CLOSE PRESS LIST, record-only, Build Save Body). This ASK makes the engine act on that list before the judges grade.

## FINDINGS FROM SEARCH (live engine 6b2cc236; debate_results e7f6922f read 00:13Z 11-25, no run going)
F1. Where the list comes from: Build Save Body reads every verse under a "PRESSED WITH:" heading in the challenger's rounds gr1, gr2, dr3, dr4, and every "ANSWER: <verse>" line in the defender's close (cr4). In 42373 all 31 came from gr1 and gr2; dr3 and dr4 had no PRESSED WITH heading. It counts [L1] and [L3] lines alike, so of the 20 some are supporting verses (e.g. 1 Corinthians 7:5 and John 1:13 are [L3] lines in gr1).
F2. "GAPS: NONE" is a different list. The D4 prompt's GAPS LEFT OPEN (ASK 537, Oracle only) asks the defender for ITS OWN presses that the challenger never answered. A close that answers none of the challenger's presses can truthfully print GAPS: NONE. So the check must act on the pressed list itself, not on the GAPS line. Solution 4(a) as written on Wall 11777 joins the two; this plan keeps them apart and says so on the card.
F3. The engine already has one re-call of the close: D4B Build re-sends the close once ("the only request of its kind") when it finds barred sentences or layer points. Today it does not look at the pressed list.
F4. The pressed list is computed in one place only (Build Save Body), after the panel.

## CHANGES (Oracle defender only, as ASK 537; every other profile byte-equal. W1 N1: this narrowing is stated on the card)
1. One reader (ASK 599, no copy): the pressed-list reader moves from Build Save Body into a Shared Library entry PRESS LIST; Build Save Body calls it, and its audit line stays byte-equal.
2. D4 Build (the close prompt): a system line "THE VERSES PRESSED AGAINST YOU, computed by the system from the challenger's rounds 1 to 3: <list>. Write one ANSWER line for each." The list uses the challenger's rounds before the close only (gr1, gr2, dr3), since the defender cannot answer the challenger's close.
3. After the close, by the operator's choice on the card:
   (W1 N2) The re-call and the judges' line use the same list as change 2 (gr1, gr2, dr3), never dr4; the audit line keeps its reading.
   A. RE-CALL: D4B Build gains a third trigger, verses on the list with no ANSWER line; the one existing re-call names them (with any barred sentences or layer points in the same request). No second re-call.
   B. SHOW THE JUDGES: the judges' packet gains a system line listing the pressed verses with no ANSWER line in the close. No re-call. (W1 N3) The list includes [L3] supporting verses (F1), so the judges see those too; the card says so. (Ruling 383, judges grade text alone: the list is computed from the text, as the ledger is.)
   C. BOTH: re-call once (A); any verse still unanswered after it is shown to the judges (B).
   Recommended: C. The re-call gives the defender the one chance to answer; the judges then see what is still open, so no verse is graded as answered by silence.
4. The audit line stays, record-only, as today.

## NOT IN SCOPE
The GAPS LEFT OPEN line and its wording (F2); Strong's numbers (4b, on hold); the K-G4 FORCED line (2c, on hold); the Oracle list form (1d, denied); the challenger's close; any judge reasoning text beyond the one system line of B; any model setting.

## CRITERIA
C1 Offline on the stored 42373 rounds: PRESS LIST gives the same 31 and the same 20 as the stored audit; Build Save Body's audit line byte-equal.
C2 D4 Build for an Oracle defender carries the list; for every other profile the request is byte-equal to live.
C2b (W1 N2) A fixture with a PRESSED WITH heading in dr4 only: the list for the prompt, the re-call and the judges' line is unchanged by it.
C3 (A or C) D4B fires on the 42373 close with the 20 named; with every verse answered it does not fire on this trigger; barred-sentence and layer behaviour unchanged (existing tests).
C4 (B or C) the judges' packet carries the line only when a verse is unanswered; otherwise byte-equal.
C5 Standing set 31/0 with S4 compile-all; pair Library Check; ASK 599 (tags, no dead code).

## WRONG-IF
- The close grows past its output limit when asked for 31 answers with four layers each: the build measures the 42373 close (28,325 characters, 22 ANSWER lines) against the D4 max tokens and reports the margin.
- [L3] supporting verses count as pressed (F1). If the operator wants [L1] only, that is a ruling; the plan keeps the audit's reading, which is the list he approved acting on.
- Cost (A or C): one more defender call when it fires; in 42373 about one Opus close call.

## RUN EVIDENCE
The first live run with an Oracle defender: the D4 request carries the list; under A or C a D4B re-call names the unanswered verses (or none needed); the audit line shows the count after the close. Two live runs.

## STEPS
1. W1 grades this plan. 2. Card to the operator: A, B or C. 3. Build on a fresh fetch; W1 grades. 4. Write card. 5. Fetch-back, audit, Wall, W1 readback; W3 manual entry and AAR row.
