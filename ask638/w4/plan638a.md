# ASK 638 PLAN, PART A (W4), rev 1 (W1 F1, Wall 12059): when a cure takes named premises out of a count, the counted-premises array drops the same premises

Source: W4 Wall 12018 (cause and fix, part A); W3's 42528 comparison AAR, item 9; the coordinator's assignment, 06:26 CST 11-25.
Live base: engine ee4e389d. Child aad0ad9c (not touched). Nothing here touches reasoning, a model setting, a token limit, a prompt's instructions, or a count. Rev 1 correction: it DOES change two things a judge can be sent, both read from the stored array after the cure: (1) the judge enforcer prompt's line "STORED COUNTED PREMISES FOR THIS SIDE: ..." (LIB 2970), which lists the corrected array and marks a dropped premise "not counted (SPARED)"; (2) the gate's D38 BASIS check (LIB 1736, LIVE), which runs only on a side whose array length equals its count, so it can now raise a gate item to the judge on a side the cure lowered, and an uncured LIVE item counts in drv_uncured. Part B (a premise list in the CORRECTED COUNT form) changes a form judges write, so it is Eric's and is not planned here.

## 1. OBJECTIVE
In 42528 sol's cure lowered the challenger's count from 2 to 1. The stored judgment (debate_judgments 1279) keeps counted_premises_challenger [3,4] beside the count of 1. pkgCPD records "COUNT: 2 to 1; ARRAY: [3,4] (kept); WHY: the count line names 0 counted premise(s) (none) for a count of 1".
- The cure did name which premise left. Enforcer row 54271, K-UNX "CHALLENGER premise 4": CURED, "CORRECTED COUNT 1 takes the premise out of the count". Row 54270, K-UNX premise 3: CURED, "the count stands".
- The engine already carries cured items into the array in one direction: pkgB6 (LIB 1366, R.cpAdd) adds a premise that a cured item counts. There is no matching step for a premise a cured item takes out. pkgCPD then tries to derive the array from the count line, which names no premises, and keeps the old array.
Change: the cure result also carries R.cpDrop, the premises that CURED items took out of the count. cureRewrite drops them from the array when the drop matches the cut exactly. Otherwise nothing changes and pkgCPD records as now.

## 2. ROLES
- Plans and builds: W4.
- Grades: W1.
- Writes: W4, on W4's card to the operator (engine).
- Reads back: W1. Manual entry and AAR rows: W3.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change, Shared Library only (library tooling; every MAP entry that holds a changed line is re-measured):
1. LIB 1366, beside __cpAdd: __cpDrop = per side, the integer premise of each CURED item whose why matches "takes the premise out of the count". Those are the K-UNX, K-UNX-A, K-UNX range and E-ASM outcomes at LIB 1219, 1220, 1225 and 1228, the only places that text is made.
2. LIB 1368: the cure result returns cpDrop beside cpAdd. LIB 1501 (the send-back result) returns cpDrop:null, as it returns cpAdd:null.
3. cureRewrite (LIB 1554 to 1556), before cpdSync, for each side with a non-empty drop list: drop the premises only when all of these hold:
   - the count before the cure (__cpdPre) minus the count after (R.fields) equals the number of premises dropped;
   - every dropped premise is in the array;
   - no premise is in both the add list and the drop list.
   Then cpdSync finds the array length equal to the count and adds nothing, and one line is written: "[AUDIT v50: COUNTED PREMISES DERIVED (pkgCPD) -- SEAT: <seat>; SIDE: <side>; COUNT: <a> to <b>; WAS: [..]; NOW: [..]; FROM: the cure took premise(s) <list> out of the count; record-only, it removes no seat ; END]". When any condition fails, nothing is dropped and pkgCPD runs exactly as now.
- Tagged ASK 638.
Not changed: the count (R.fields); pkgCRG's grounds text; cpdSync; pkgB6 add; the send-back path; every cure rule's outcome; K-G8 (LIB 2089, run at LIB 2426 in Panel and Alternate Payloads, before the cure, on the array the judge wrote). Changed downstream (rev 1): the judge enforcer prompt's stored-premises line, and the D38 BASIS gate check (see the header). Build guard (rev 1): the drop also requires the array to have the count's length after it, and a count of 0 is left to pkgCPD.

SEARCH:
- "takes the premise out of the count" is made only at LIB 1219, 1220, 1225 and 1228, and read at LIB 1384 (rctOut, a reader of stored audit lines, unchanged).
- E-ASM items carry fact numbers (in 42528 premises 95 and 96), which are not in the array. The "every dropped premise is in the array" condition leaves those alone.
- cureRewrite is the one writer of the panel judgment's array after a cure. Panel seats and alternates both reach it through the same function.

NOT SEARCHED:
- 42373 (sol and sol62 per W3's AAR). The build replays it if its cure rows give the items, and reports the result.

## 4. CRITERIA AND DONE
- C1. Replay cureRewrite (old and new library) on sol's 42528 judgment before the cure and its cure result, rebuilt from the stored judgment and enforcer rows 54270 and 54271. New: counted_premises_challenger [3], count 1, with the AUDIT v50 DERIVED line naming premise 4. Old: [3,4], with the NOT DERIVED line (equal to the stored text).
- C2. Synthetic:
  - a drop that does not match the cut (2 dropped, cut 1): no change from the old result;
  - a dropped premise not in the array (E-ASM fact 95): no change;
  - an add and a drop of the same premise: no change;
  - no drop list: byte-equal to the old result;
  - a count of 0: as now (pkgCPD sets []).
- C3. Over every judgment and cure result in the replay fixtures, nothing changes except judgments whose cure has a non-empty drop list meeting the three conditions.
- C4. Engine: only the Shared Library changes, rebuilt by the tooling; every other node byte-equal to ee4e389d; standing 31/0; pair check PASSES; reg385 PASS.
- C5. ASK 599: tagged; no dead code; no new catch.
- DONE: W1 PASS on plan and build; operator presses W4's card; W4 writes; W1 reads back; two clean live runs (section 6).

## 5. WRONG-IF
- The plan aims at the wrong thing if "takes the premise out of the count" can be CURED while the count did not drop for that premise. Against that: each of the four outcomes is CURED only when every CORRECTED COUNT for that side is below the count that included the premise ("cs.every(c=>c.n<(x.conc||0))"), and the drop must equal the cut.
- A second wrong-if: the operator wants the array left as the judge wrote it and only flagged. Then part A records what the judge did not write. Against that: the premise removed is the judge's own cured answer (54271: "Premise 4 is removed from the count"), not the engine's choice.

## 6. RUN EVIDENCE
- Case: the first live run where a cure lowers a count by K-UNX or E-ASM.
- Mark: the stored array's length equals the count, and an AUDIT v50 DERIVED line names the premise the cure took out. No "NOT DERIVED ... names 0 counted premise(s)" line for that side.
- Cost: nil. NO PROBE.

## 7. INPUTS IN GIT
ask638/w4/plan638a.md (this file). The build goes in ask638/w4/b1/.

## 8. STEPS (each names its card)
1. W1 grades this plan (no card).
2. W4 builds and runs C1 to C5 offline (no card). W1 grades the build.
3. Card to the operator, from W4: "Write ASK 638 A (a cure's removed premise leaves the counted list too)?" The card says that a judge can now be sent a D38 BASIS gate item and a changed STORED COUNTED PREMISES line.
4. W4 writes; fetch back; audit row; Wall post; W1 readback.
5. W3: manual entry and AAR rows.
6. Two clean live runs.
