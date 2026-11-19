# ASK 439 plan rev 0 (W2): the AUDIT v57 line names the caps ASK 438 set

## 1. OBJECTIVE
The AUDIT v57 line written by Build Save Body states the caps that are live. Today it reads "left out by the 60-gloss and 30-number caps"; since ASK 438 (live 9a7841f0) L2 Gloss Plan holds GLOSS_CAP=250,NUM_CAP=100. Found by W3 (Wall 9153 item 3), numbered by the coordinator (W3 9154).

## 2. ROLES
Planner and builder: W2 (owner per the coordinator, W3 9154). Graders: W1 and W3. Write: W4, on the operator's card in W4's thread. Manual entry: W3.

## 3. SCOPE with SEARCH
Change: engine node Build Save Body only (live 9a7841f0), one pair:
- old: `left out by the 60-gloss and 30-number caps)`
- new: `left out by the 250-gloss and 100-number caps)`
Not changed: L2 Gloss Plan, L2 Count Plan, the child, the Shared Library, the f406 counts (E.f406.read and E.f406.dropped are computed against the live caps already; only the words are stale).
Rejected: carrying the caps as data (L2 Gloss Plan meta to L2 Count Plan e340.f406 to Build Save Body). It touches 3 nodes to fix one fixed phrase; a later cap change would again need the manual and this line read together, which the ASK 438 entry's Limits now records.
SEARCH (my fetch of live 9a7841f0):
- The phrase occurs once in Build Save Body and in no other node.
- The AUDIT v57 line goes into the FF list, joined into saveBody.review_notes (Build Save Body, `const RN=FF.length?FF.join(' '):null`).
- review_notes is read by: Format Markdown (the run report), Failure Salvage (salvage record), and Panel Build and Build Independent Verdict only through `C4P.stored(Regrade Row ... review_notes, sd)`, which matches the "[AUDIT v27: CLOSE-ROUND GRADING CHECK" text alone. No judge or debater prompt carries the AUDIT v57 line. So the change is record-only, not model-facing; no operator ruling is needed before the build (ASK 425).

## 4. CRITERIA and DONE
C1. Diff: Build Save Body only, the one pair (count 1); 425 nodes, connections equal; Shared Library untouched; reasoning guard clean; reg385 PASS.
C2. Build Save Body run old against new on 3 stored runs with an f406 block: review_notes differs only in the phrase; every other output field identical.
C3. Static: the string "60-gloss" occurs in no live node after the change.
C4. rbx 0 diffs after the write, two readbacks.
DONE: C1 to C4 hold, the manual entry is written (the ASK 438 entry's Limits line and the ASK 406 entry sentence on the fixed words are replaced), and the ASK 417 entry is registered.

## 5. WRONG-IF
a. Any model-facing text changes.
b. Any field of the save body other than review_notes changes, or review_notes changes beyond the phrase.
c. The numbers in the new words differ from GLOSS_CAP and NUM_CAP in live L2 Gloss Plan at the write.

## 6. RUN EVIDENCE
ASK 417 entry. Mark: the first run with an f406 block shows "left out by the 250-gloss and 100-number caps" in its review_notes. NOT EXERCISED if no run carries the f406 block.

## 7. INPUTS IN GIT
This plan. The build adds the pair, the target, and the C2 output.

## 8. STEPS
1. W1 and W3 grade this plan.
2. W2 builds on a fresh fetch of live, runs C1 to C3, posts the build.
3. W1 and W3 grade the build.
4. W4 posts the card and writes on the operator's press; two readbacks (C4).
5. W3 writes the manual entry; W2 adds the ASK 417 entry.
