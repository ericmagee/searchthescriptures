# ASK 527 plan, rev 3 (W3). Replaces rev 2 (md5 21adbb1c), whose PASS W2 withdrew at Wall 10546 because it lacked the ASK FORM headings (op doc section 29). Rev 0 failed on change 4 (Wall 10526); rev 1 failed on form, wording (Wall 10528). Plan only: nothing is built or written until the grade passes and the operator presses W4's write card. Times are CST.

## 1. OBJECTIVE
A judge's written reply to a send-back is read, and graded as today. An item counts under its rule as today when its answer was read and did not cure, or when no answer to it could be read.

Expected effect: a seat is no longer removed because its replies were written in a form the engine could not read. In 41418, sol 6.1 answered all its counted items and was removed with drv_uncured 6. Under this change its corrected lines are graded. Whether they cure is the cure readings' result, not predicted here.

Findings (run 41418; W4 trace, Wall 10518; W3 read):
1. sol 6.1 answered with "S1 RESPONSE: CHANGE ...", "S2-S5 RESPONSE: CHANGE the collision and FORCED lines to the corrected lines below ...", and "S6-S7 RESPONSE: CHANGE the two UNDERDETERMINED lines below ...". The corrected lines follow in the same reply (send-back row 51422, full_reply 44,705 characters). S1 points to "the CONCEDED LINKS line above".
2. The reader (Shared Library send-back block, lines 2768 to 2815 on the 519 fetch-back) takes an answer only from a "SENDBACK Sn || KEEP|CHANGE TO ..." line (lines 2770 to 2774; P.REPLY at line 313). No such line was found.
3. S3 and S4 appear only inside "S2-S5", so they were logged SILENT and counted. S2, S5, S6 and S7 were logged "WRITTEN, NOT READ ... not silence, not counted" (line 2789).
4. The count gates in the block test only "!silent&&!err" (E-COL at line 2791 and pkgUND at line 2795 fired). So S2, S5, S6 and S7 were counted although their rows say "not counted".

## 2. ROLES
- Planner: W3.
- Builder: W4.
- Grader: W2 (not the builder).
- Card: W4's write card in W4's thread, pressed by the operator.

## 3. SCOPE
The change touches one block, in one node: the Shared Library send-back block (lines 2768 to 2815). The engine and the Alternate Pass child each carry their own copy of the Library, and both copies change the same way.

1. READ A RESPONSE LINE. Besides the SENDBACK line, read a line of the form "Sn RESPONSE: <KEEP|CHANGE> ..." or a range "Sa-Sb RESPONSE: <KEEP|CHANGE> ...". A range answers every item from Sa to Sb. The answer is the first KEEP or CHANGE after the colon. The rest of that line is the WHY.
2. THE CHANGED LINE. For a CHANGE read this way, TO is the first line after the RESPONSE line whose head matches the flagged line's head. A head matches when it is the same collision pair of the same kind (a FORCED line matches only a FORCED line of that pair, and a plain collision line only a plain one), or the same line label (RESULT, KEYSTONE, CONCEDED LINKS, DEFENSE STANDING, or ANSWER CHECK with the same reference and round). W4 uses the key the E-APPLY step already uses to place a CHANGE, if there is one, and names it in the build. If no line matches, the item stays WRITTEN, NOT READ.
3. A SENDBACK line still wins when both forms are present (the reader keeps the first answer per item, as today).
4. THE ROW TEXT MATCHES THE COUNT. "WRITTEN, NOT READ" means only that the item's number appears in the reply. It is not an answer, so it keeps counting as today. Only the row text changes, from "not silence, not counted" to "not silence; counted when its rule counts against the seat (not record-only or TRIAL) and its cure reading is not CURED". No count gate changes (W2, Wall 10526).

Not changed:
- Every cure reading (enf428Cure, UND.cure, LAY, ABS, PAB, MNP, IMP, KSC, B7).
- The silence count, and how KEEP is graded.
- Prompt text, model settings and every other node.

Dropped from the proposal: writing panel_substitution (10519 item 3; folded item 12).
- odv1_record_panel_substitution records only a pre-judgment failure (error, timeout, no_usable_judgment, refused). It holds one per run, and it refuses once any judgment row exists.
- 41418 already records the removal: drv_removed holds sol, drv_uncured 6, replaced_by qwen4max, and panel_expected is chatgpt, qwen4max, sol62.
- How the transcript shows the removal belongs to ASK 529.

SEARCH (read from the 519 fetch-backs on disk, ask519/w4/write/; no n8n call):
- Engine moMxiV4Irg1uRBZN, every Code node, for "NOT READ", "__sbxRL(" and "SENDBACK\s": hits only in the Shared Library (4, 2 and 2). The reader is lines 2768 to 2815 and the P.REPLY form is at line 313.
- Child MqQHRl7mQQ0z8QdT, every Code node, for the same strings: hits only in its Shared Library (4, 2 and 2).
- Engine Execute Workflow targets: MqQHRl7mQQ0z8QdT (the child, searched), SX4ZWtgHNs96uBOo and c7366RPLb8vdMQg6. The child also calls c7366RPLb8vdMQg6. The engine names webhook path wall2024-panel-judge-call.
- NOT SEARCHED: SX4ZWtgHNs96uBOo, c7366RPLb8vdMQg6, and the workflow behind webhook wall2024-panel-judge-call. They are not on disk. W4 searches them at build time for the same strings and reports every hit. Nothing is reported gone while any of them is unsearched.
- SQL: debate_enforcer_log rows 51422 to 51428; debate_results for 41418; pg function odv1_record_panel_substitution.

## 4. CRITERIA and DONE
Population: every stored send-back reply. That is debate_enforcer_log where kind = 'send_back' and full_reply is not null: 665 rows, counted this turn. Of these:
- 355 use the SENDBACK form.
- 1 uses the RESPONSE form, and it is also the only range: row 51422 (41418, sol 6.1).
- The rest use neither form.

The criteria:
1. On row 51422, against sol's seven items:
   - S2 to S7 each read CHANGE and take TO from the matching corrected line below.
   - S1 reads CHANGE but has no TO, because its line is above. It stays WRITTEN, NOT READ and is record-only, so it is not counted.
   - Today's cure readings then run on S2 to S7. Report sol's new drv_uncured, whatever it is.
2. On the 664 other replies, every item's answer, cure status and drv_uncured is unchanged. Here "found nothing changed" is the legitimate result. A change on any of them is a failure to report.
3. A reply that names an item (for example "S3") but gives it no KEEP or CHANGE in either form still counts against the seat, and its row says so.
4. A named, unread record-only item (S1 in 41418) is not counted, and its row says so.
5. Only the send-back block of the two Shared Library copies differs. Both copies compile.

DONE: criteria 1 to 5 shown offline on the build, the write on W4's card, W4's readback MATCH, and the run evidence in section 6.

## 5. WRONG-IF
The plan is wrong if a range reply does not carry corrected lines that can be matched by head. In that case reading the range gives no TO, and nothing is graded.

Measured before posting, on row 51422 (full_reply read by SQL this turn):
- Known bad, the case it must fix: lines below "S2-S5 RESPONSE" are headed "D4 vs C1 (...)", "FORCED: D4 vs C1", "D5 vs C2 (...)" and "FORCED: D5 vs C2". Lines below "S6-S7 RESPONSE" are headed "D2 vs C6 (...): UNDERDETERMINED" and "D3 vs C5 (...): UNDERDETERMINED". The flagged lines are S2 "D4 vs C1 (...)", S3 "FORCED: D4 vs C1", S4 "D5 vs C2 (...)", S5 "FORCED: D5 vs C2", S6 "D2 vs C6 (...)" and S7 "D3 vs C5 (...)" (rows 51423 to 51428). Each matches exactly one corrected line of the same pair and kind. The wrong-if does not fire.
- Known good: the 355 SENDBACK-form replies, whose answers the reader already takes. The SENDBACK line wins, so they cannot move.

## 6. RUN EVIDENCE
- Case: a released run in which a judge answers a send-back in the RESPONSE form.
- Mark: that judge's send_back rows carry a response_line beginning "Sn RESPONSE" or "Sa-Sb RESPONSE", and a cure reading, not "WRITTEN, NOT READ".
- Until such a run, it is UNEXERCISED. Only one stored reply in 665 used this form, so it is NO PROBE: the form cannot be forced, because it is the judge's choice.

## 7. INPUTS IN GIT
- This plan, at ask527/w3/plan527.md on claude/untitled-9jle0o (commit given in the Wall post).
- The base is the 519 fetch-backs, ask519/w4/write/ (committed by W4).
- W4 commits the build, the offline test scripts and their outputs under ask527/w4/.

## 8. STEPS
1. W2 grades this plan. No card.
2. W4 builds on the live engine and child at build time, and runs criteria 1 to 5 offline. W2 grades the build. No card.
3. W4 writes both workflows in one stacked write (ASK 445). This waits on the operator's card in W4's thread. The revert is the pre-write fetch.
4. W4 reads back. W3 writes the engine manual entry, which waits on the operator's card in W3's thread.
5. The run evidence is read at the next released run.
