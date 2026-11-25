# ASK 647 PLAN (W4), rev 0: an unseated alternate's final judgment text is stored

Source: W4 Wall 12028 (cause and fix); W3's 42528 comparison AAR, items 8 and 12; the coordinator's assignment, 06:26 CST 11-25.
Live base: engine ee4e389d. Child aad0ad9c (not touched). Record only: nothing here touches reasoning, a model setting, a token limit, a prompt, who sits, or a count. No DDL.

## 1. OBJECTIVE
In 42528 chatgpt sat for qwen4max. It changed its judgment at the send-back and the gate, then was unseated. The record holds its first reply (enforcer row 54588), its enforcer rows, and the row line "[REMOVED SEAT: chatgpt (alternate for qwen4max); VERDICT WORD: ...]". Its judgment text as changed is stored nowhere. Judgment 1278 for that seat is qwen4max's own text.
- In the alternate apply (LIB 2466 to 2484), the changes go into the alternate's body b (LIB 2469). When drv_uncured > 0 the alternate is unseated (LIB 2474). The seat's body is put back to the removed judge's (LIB 2478 to 2480), and the changed text is kept only in alternates_tried[].verdict_raw (LIB 2482), which lives in the n8n execution alone.
Change: in that unseat branch, one enforcer log row is added for the alternate, carrying its final text.

## 2. ROLES
- Plans and builds: W4.
- Grades: W1.
- Writes: W4, on W4's card to the operator (engine).
- Reads back: W1. Manual entry and AAR rows: W3.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change: Shared Library, LIB 2482 (in MAP entries "Alternate Merge 1" and "R2 Alternate Merge", re-measured by the library tooling). After the tried update, one statement:
`log.push({run_token:AS.run_token,seat:s.seat,seat_role:'alternate',judge_model:s.api_model,kind:'alternate_reply',rule:'ALT-FINAL',item:'FINAL TEXT AS CHANGED (unseated; seat '+s.removed_seat+' left unfilled)',flagged_line:null,prompt_sent:null,full_reply:b.payload.verdict_raw,reply_error:null,response_line:null,cure_status:'RECORD-ONLY',cure_reason:why,at:T});`
- Its fields are the ones the branch's own E-APPLY rows use (LIB 2470), and log is the same enforcer_log the branch already returns.
- kind 'alternate_reply', seat_role 'alternate' and cure_status 'RECORD-ONLY' are allowed by the table's present checks (debate_enforcer_log_kind_check, _seat_role_check, _cure_status_check), so no DDL is needed.
- Tagged ASK 647.
Not changed: who sits; the body put back for the seat; alternates_tried; the REMOVED SEAT line; a seated alternate (its text is already its judgment row); every other node.

SEARCH:
- LIB 2462: log = AM.enforcer_log copied; the branch's rows reach the table by the same path as its E-APPLY rows.
- Round 1 (engine, "Alternate Merge 1") and round 2 (the child is served the engine library, "R2 Alternate Merge") both run this code, so both get the row.
- Readers of alternate_reply rows: no DB function names 'alternate_reply' (searched). The rule 'ALT-FINAL' tells this row from the first-reply row (rule null).
- Size: chatgpt's first reply was 33,143 characters; the log already stores rows up to 82,319 characters in 42528.

NOT SEARCHED:
- Dashboard pages that count alternate_reply rows. The build lists them by text search of the dashboard source if it is in reach; otherwise noted for W3's manual entry.

## 4. CRITERIA AND DONE
- C1. Replay the alternate apply (old and new library) on a 42528-shaped input: chatgpt seated for qwen4max, with send-back and gate items that leave drv_uncured 3. New: the log gains exactly one row: rule ALT-FINAL, seat chatgpt, full_reply equal to the alternate's changed text, cure_reason the unseat why. Every other output is byte-equal to the old.
- C2. Synthetic: a seated alternate (drv_uncured 0): no new row and byte-equal output; two alternates unseated: one row each.
- C3. Engine: only the Shared Library changes, by that statement and the re-measured MAP lengths; every other node byte-equal to ee4e389d; standing 31/0; pair check PASSES; reg385 PASS.
- C4. ASK 599: tagged; no dead code; no new catch.
- DONE: W1 PASS on plan and build; operator presses W4's card; W4 writes; W1 reads back; two clean live runs (section 6).

## 5. WRONG-IF
- The plan aims at the wrong thing if the text in b at the unseat is not the alternate's final word. Against that: b is the body after sbApply2024 and cureRewrite (LIB 2469), the last changes the engine makes before it counts drv_uncured (LIB 2473).
- A second wrong-if: the operator wants the text in debate_judgments. That table holds one row per panel seat, and an unseated alternate is not a seat's judgment. The enforcer log is where its other replies are.

## 6. RUN EVIDENCE
- Case: the first live run in which an alternate is unseated.
- Mark: one debate_enforcer_log row with rule ALT-FINAL for that alternate, whose full_reply is its changed judgment.
- If no alternate is unseated, the path is live and UNEXERCISED, and the two clean runs show no other change.
- Cost: nil. NO PROBE.

## 7. INPUTS IN GIT
ask647/w4/plan647.md (this file). The build goes in ask647/w4/b1/.

## 8. STEPS (each names its card)
1. W1 grades this plan (no card).
2. W4 builds and runs C1 to C4 offline (no card). W1 grades the build.
3. Card to the operator, from W4: "Write ASK 647 (an unseated alternate's final text is stored)?"
4. W4 writes; fetch back; audit row; Wall post; W1 readback.
5. W3: manual entry and AAR rows.
6. Two clean live runs.
