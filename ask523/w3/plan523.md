# ASK 523 plan, rev 0 (W3). An uncured enforcer DISAGREE on a judge's deciding line counts against the seat. Plan only: nothing is built or written until the grade passes and the operator presses W4's write card. Times are CST.

## 1. OBJECTIVE
The operator chose "Yes, count it" on ASK 523: an enforcer DISAGREE on a judge's deciding line counts against that judge's seat when the judge does not cure it.

A deciding line is:
- the judge's RESULT line or KEYSTONE line itself; or
- an ANSWER CHECK line whose verse the judge's KEYSTONE line or RESULT line quotes.

Expected effect: the two 41418 findings (folded items 5 and 6) count.
- Sol 6.2, row 51401: ANSWER CHECK on Matthew 1:18 [CR4]; the enforcer reads MEETS, the judge kept MISSES, UNCURED. Sol 6.2's KEYSTONE ("KEYSTONE: D5 -- BROKEN ... [L1] Matthew 1:18 ...") and RESULT quote Matthew 1:18. Today it is not counted ("the judge keeps the decision", ruling 428). Under this change it counts 1 in sol 6.2's drv_uncured (today 0).
- Qwen 4 Max, row 51643: the second reading of its replaced RESULT line (S20 E-RES) is DISAGREE, "DOES NOT FOLLOW". Today it is record-only (pkgVP1). Under this change it counts 1 in qwen 4 max's drv_uncured (today 0).
What the counts then do to the seats and the outcome is the existing removal rule's result, not predicted here.

## 2. ROLES
- Planner: W3.
- Builder: W4.
- Grader: W2 (not the builder).
- Card: W4's write card in W4's thread, pressed by the operator.

## 3. SCOPE
Two changes, each in the engine and the same in the Alternate Pass child.

1. E-ANS ON A DECIDING LINE (Shared Library send-back block, internal lines 2768 to 2815 on the 519 fetch-back; built into Send Back Record, Alt Send Back Record and R2 Alt Send Back Record).
   - Today an E-ANS item gets its cure reading from enf428Cure, and line 2810 sets only cure_status; it is never counted.
   - New: an E-ANS item counts when all hold: its cure reading is UNCURED; not silent, not err, not grt2 (the gates the other counts use, line 2791); __oaSkip does not skip it; and the item's verse (the ANSWER CHECK reference before " -- [") appears in the seat's KEYSTONE line or RESULT line of the body's verdict_raw at that point. The verse match is the whole reference: "Matthew 1:1" does not match "Matthew 1:18".
   - It goes in a new list, counted into drv_uncured with an AUDIT line, as ECF is at lines 2817 to 2819: "[AUDIT: DECIDING LINE UNCURED (pkgDLU, ASK 523) -- SEAT: ...; ITEMS: ...; counted in drv_uncured.]"
   - The row's cure_reason adds: "DECIDING LINE (pkgDLU, ASK 523): the KEYSTONE or RESULT quotes <verse>; counted in drv_uncured".
2. E-REREAD ON A RESULT OR KEYSTONE LINE (the second reading of a replaced line, pkgVP1).
   - Today the Reread Record, Alt Reread Record and R2 Alt Reread Record nodes (plain Code nodes, not the Library) write the row with "RECORD-ONLY: nothing is sent back, nothing is counted, no seat is removed". Nothing reads them for a count.
   - New: a second reading DISAGREE on an item whose rule is E-RES or E-KEY counts. The Reread Record nodes write its row as "SECOND READING of the replaced line (pkgVP1; DECIDING LINE, pkgDLU, ASK 523: counted in drv_uncured)" and return the list of such items.
   - The count enters the seat's body where the bodies are next carried after the Reread Record: Gate Record for the panel (it takes bodies from Send Back Record, line 1921 onward, on both its gate_skip path and its call path, and Alternate Merge takes its bodies at line 1577); Alt Gate Record and R2 Alt Gate Record for the alternates. Same AUDIT line form as change 1.
   - W4 confirms in the build that the count reaches drv_uncured before each seat-removal test (panel: the alternate trial; alternate: Alternate Merge line 1611, "ok=a.qualify||b.payload.drv_uncured===0") and names the lines.
3. The label text near file line 3765 ("an uncured item counts against the seat only under an enforced package its CURE note names") stays true: pkgDLU is named on every counted row.

Not changed:
- Ruling 428 on every other line: an uncured DISAGREE on a line that is not a deciding line stays the judge's decision and is not counted.
- E-HOLD: it has no cure reading (only the pkgVP3 TRIAL), so counting it would count every answer. E-PREM: a premise line is not a deciding line under the definition.
- Every cure reading (enf428Cure, UND, LAY, ABS, PAB, MNP, IMP, KSC, B7), the silence count, the E-GATE, prompt text, model settings and every other node.

SEARCH (read from the 519 fetch-backs on disk, ask519/w4/write/; no n8n call):
- Engine moMxiV4Irg1uRBZN: "SECOND READING" is only in Reread Build, Reread Record, Alt Reread Build and Alt Reread Record. Connections: Send Back Record -> Reread Build -> Reread Needed? -> Reread Call / Reread Record -> Gate Build; the Alt path the same into Alt Gate Build. In the Library, "Reread Record" is read only at line 1631 (to log the rows).
- Child MqQHRl7mQQ0z8QdT: "SECOND READING" only in R2 Alt Reread Build and R2 Alt Reread Record (-> R2 Alt Gate Build).
- Library: the E-ANS cure reading (lines 2649 to 2659), the send-back count gates (2785 to 2811), the count lists (2816 onward), Gate Record's body source (1921 onward), Alternate Merge's body source (1577) and removal test (1611).
- NOT SEARCHED: SX4ZWtgHNs96uBOo, c7366RPLb8vdMQg6 and the workflow behind webhook wall2024-panel-judge-call (Y1VIsNB6KBrs1znP). They are not on disk. For 527, W4 searched them for a send-back reader and found none. W4 searches them again at build time for "SECOND READING", "E-REREAD" and "drv_uncured" and reports every hit.
- SQL: debate_enforcer_log (send_back rows, rules E-ANS and E-REREAD); debate_judgments (verdict_raw, drv_uncured) for the same debates.

## 4. CRITERIA and DONE
Populations, counted by SQL this turn:
- A. E-ANS send_back rows with cure_status UNCURED, a written answer (not silent) and no reply_error: 65 rows in 26 debates. Of these, 3 have their verse in the seat's stored KEYSTONE or RESULT line: 45173 (39266 sol62, Matthew 1:20, RESULT), 47402 (41024 sol62, Luke 1:34, KEYSTONE and RESULT) and 51401 (41418 sol62, Matthew 1:18, KEYSTONE and RESULT). 46 do not; 16 have no stored judgment for that seat (the seat was removed or replaced).
- B. E-REREAD rows: 808, of which 129 are UNCURED. 8 of the 129 are E-RES or E-KEY: 29885, 29886, 31680, 43290, 44059, 44877, 50933 and 51643.
Note: the stored KEYSTONE and RESULT are the final ones. The build reads the body at send-back time, so W4 reports the offline count from the stored bodies at that point, and any difference from the 3 above.

The criteria:
1. Row 51401 counts 1 for sol62 in 41418, with the AUDIT line and the row text. Row 51643 counts 1 for qwen4max. Report each seat's new drv_uncured and what the removal tests then do, whatever it is.
2. Of population A, only the rows on a deciding line count. The 46 others with a stored judgment, and the 16 without, are unchanged in cure status, row text and count. "Found nothing changed" is the legitimate result for them.
3. Of population B, only the 8 count. The other 121 UNCURED rows and all 679 others are unchanged.
4. No item is counted twice: an item counted here is not also counted by the E-GATE or another list (W4 shows it on 41418 and 41024).
5. Only the named blocks and nodes differ. Both Library copies compile; the Reread Record nodes compile.

DONE: criteria 1 to 5 shown offline on the build, the write on W4's card, W4's readback MATCH, and the run evidence in section 6.

## 5. WRONG-IF
The plan is wrong if the deciding test does not separate: if the KEYSTONE and RESULT lines quote so many verses that most uncured E-ANS items match, the change counts nearly every DISAGREE and overturns ruling 428 wholesale rather than for deciding lines.

Measured before posting (population A):
- Known bad, the case it must fix: row 51401 matches (Matthew 1:18 in sol62's KEYSTONE and RESULT).
- Known good, which must stay uncounted: 46 of the 49 rows with a stored judgment do not match, including 41418's other seats' items. 3 of 49 match. The wrong-if does not fire.

The plan is also wrong if the count enters drv_uncured after the seat-removal test reads it. Read on the fetch-back: the Reread Record runs before Gate Build and Gate Record, and Alternate Merge takes Gate Record's bodies (line 1577). W4 confirms on the live build (section 3, change 2).

## 6. RUN EVIDENCE
- Case: a released run in which a judge leaves an E-ANS DISAGREE uncured on a verse its KEYSTONE or RESULT quotes, or a second reading of a replaced RESULT or KEYSTONE line is DISAGREE.
- Mark: that seat's verdict_raw carries "DECIDING LINE UNCURED (pkgDLU, ASK 523)", its drv_uncured includes the item, and the row says "counted in drv_uncured".
- NO PROBE: the DISAGREE is the enforcer's reading of the judge's own line, which a run cannot force. Over the stored runs it happened on 3 of 65 uncured E-ANS rows and 8 of 129 uncured second readings. Until such a run, it is UNEXERCISED.

## 7. INPUTS IN GIT
- This plan, at ask523/w3/plan523.md on claude/untitled-9jle0o (commit given in the Wall post).
- The base is the 519 fetch-backs, ask519/w4/write/ (committed by W4).
- W4 commits the build, the offline test scripts and their outputs under ask523/w4/.

## 8. STEPS
1. W2 grades this plan. No card.
2. W4 builds on the live engine and child at build time (after any write of 526 or 527 that lands first), and runs criteria 1 to 5 offline. W2 grades the build. No card.
3. W4 writes both workflows in one write. This waits on the operator's card in W4's thread. The revert is the pre-write fetch.
4. W4 reads back. W3 writes the engine manual entry, which waits on the operator's card in W3's thread.
5. The run evidence is read at the next released run.
