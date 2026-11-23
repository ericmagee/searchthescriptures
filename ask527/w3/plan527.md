# ASK 527 plan, rev 2 (W3; rev 0 failed W2's grade on change 4, Wall 10526; rev 1 failed on form, wording, Wall 10528). Plan only: nothing is built or written until the grade passes and the operator presses W4's write card.

## Objective
A judge's written reply to a send-back is read, and graded as today. An item counts under its rule as today when its answer was read and did not cure, or when no answer to it could be read. Times are CST.

## Findings (run 41418; W4 trace, Wall 10518; W3 read, this plan)
1. sol 6.1 (seat sol) answered its seven items as "S1 RESPONSE: CHANGE ...", "S2-S5 RESPONSE: CHANGE the collision and FORCED lines to the corrected lines below ...", and "S6-S7 RESPONSE: CHANGE the two UNDERDETERMINED lines below ...". The corrected lines follow in the same reply (send-back row 51422, full_reply 44,705 characters).
2. The reader (Shared Library, send-back block, Library lines 2768 to 2815 on the 519 fetch-back) takes an answer only from a "SENDBACK Sn || KEEP|CHANGE TO ..." line (lines 2770 to 2774, P.REPLY at line 313). No such line was found.
3. S3 and S4 appear only inside "S2-S5", so they were logged SILENT and counted. S2, S5, S6 and S7 were logged "WRITTEN, NOT READ ... not silence, not counted" (line 2789).
4. The count gates in the same block test only "!silent&&!err" (11 gates; E-COL at line 2791 and pkgUND at line 2795 are the two that fired). So S2, S5, S6 and S7 were counted although their rows say "not counted". drv_uncured 6; the seat was removed and qwen 4 max seated.

## Change (Shared Library only, the send-back block; the engine and the Alternate Pass child carry the same Library)
1. READ A RESPONSE LINE. Besides the SENDBACK line, read a line of the form "Sn RESPONSE: <KEEP|CHANGE> ..." or a range "Sa-Sb RESPONSE: <KEEP|CHANGE> ...". A range answers every item from Sa to Sb. The answer is the first KEEP or CHANGE after the colon. The rest of that line is the WHY.
2. THE CHANGED LINE. For a CHANGE read this way, TO is the first line after the RESPONSE line whose head matches the flagged line's head: the same collision pair with or without "FORCED:", or the same line label (RESULT, KEYSTONE, CONCEDED LINKS, DEFENSE STANDING, ANSWER CHECK with the same reference and round). W4 uses the key the E-APPLY step already uses to place a CHANGE, if there is one, and names it in the build. If no line matches, the item stays WRITTEN, NOT READ.
3. A SENDBACK line still wins when both are present (the reader keeps the first answer per item, as today).
4. THE ROW TEXT MATCHES THE COUNT. "WRITTEN, NOT READ" means only that the item's number appears in the reply, so it is not an answer, and it keeps counting as today. Only the row text changes, from "not silence, not counted" to "not silence; counted when its rule counts against the seat (not record-only or TRIAL) and its cure reading is not CURED". No count gate changes (W2, Wall 10526).

## Not changed
- What cures: enf428Cure, UND.cure, LAY, ABS, PAB, MNP, IMP, KSC and B7 readings are untouched.
- Silence still counts. KEEP is graded as today. No prompt text, no model settings, no other node.

## Dropped from the proposal: writing panel_substitution (10519 item 3; folded item 12)
- panel_substitution is the record of a pre-judgment panel failure. odv1_record_panel_substitution takes only the failure kinds error, timeout, no_usable_judgment and refused; it holds one per run; and it refuses once any judgment row exists.
- A removal for an uncured count is recorded elsewhere, and 41418 has it: drv_removed holds seat sol, drv_uncured 6, replaced_by qwen4max; panel_expected is chatgpt, qwen4max, sol62.
- So folded item 12 is not a defect in the record. Whether the transcript shows the removal plainly belongs to ASK 529.

## DONE (offline, before any write card)
1. On 41418: run the new reader on sol's reply (row 51422) against its seven items. S1 to S7 each read an answer. S2 to S7 each take TO from the matching corrected line. Then run today's cure readings on those answers and report sol's new count, whatever it is.
2. Regression: on 41024, 41043, 41090, 41102, 41117 and the other 41418 seats, every item's answer, cure status and drv_uncured is unchanged.
3. A reply with neither form: unchanged (silent items count).
4. A reply that names an item (for example "S3") but gives it no KEEP or CHANGE in either form still counts against the seat, and its row says so. A named, unread record-only item (S1 in 41418) is not counted, and its row says so.

## Not yet
A live run.

## Owners
Build W4. Grade W2. Write: W4's card in W4's thread, pressed by the operator.
