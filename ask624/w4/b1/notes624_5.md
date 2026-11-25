# ASK 624.5 build (W4, 19:50 CST 11-24): a judgment's own disagreements go to the judge at the late gate; a KEEP is uncured (operator 19:08 CST)

Base: live engine 912dd47a / child aad0ad9c (after ASK 578), b1/base_eng.json 3600fafb, base_child.json 29b7f676 (sha256, 8).
Build: b624.cjs b66ce931 (rev 0 kept b624_rev0.cjs, rev 1 pre-fix b624_rev1pre.cjs), then fixhdr579.js on the engine target. Check: sck624.js 0bee7a19 (one line; the multi-line copy sck624_multiline.js is token-equal).
Targets: tg/target_engine_624.json 3f0c688c; tg/target_child_624.json 29b7f676 = base child (not written; it takes the engine text in the call). Rebuild byte-equal.

## What changes (engine Shared Library only; 11 LIB lines changed, 1 added; every one tagged ASK 624.5)
- LIB 3858 (new): SCK624, the three checks (plan N1 texts, each sent item ends "A KEEP does not cure this item.").
- MAP: SCK624 placed after WHL507 in the six late-gate keys (Late Gate Build, Alt Late Gate Build, R2 Alt Late Gate Build, Gate Record, Alt Gate Record, R2 Alt Gate Record). 13 MAP keys change text because they hold line 1370 or 1375; the other 61 rebuild the same.
- 1370 SB_FORM gains "WHICH HOLDS:" and 1375 sbLabel0 gains the WHICH HOLDS label, so a CHANGE TO a WHICH HOLDS line is applied (today NOT APPLIED, record-only since ASK 607). DEVIATION from plan step 2 for grade: the plan named sbLabel0 only; the pkgFRM form gate (SB_FORM) also refused the line, found by C3. Effect also at the first gate: a CHANGE TO a WHICH HOLDS line is now applied there too, as plan step 2 intends.
- 3482 Late Gate Build: computes the items from the text after the gate (C.R2.R1.text) and the recomputed verdict; the late gate now also sends when only self-check items exist.
- 3485 to 3487: E-SCK items get their own G numbers; the message intro is split (gate items and SELF-CHECK items); a SELF-CHECK item is shown as "ITEM G<n> (SELF-CHECK; <kind>):" and its text.
- 3467 Gate Record: gateCure2024 gets the gate items without E-SCK. 3471: E-SCK cure: a CHANGE is applied with the other changes and the item re-checked; cured only if the change was made and the re-check no longer finds it; a KEEP, no answer or a change that leaves it is uncured and adds to drv_uncured. 3474 AUDIT v60 SELF-CHECK line; 3475 the applied self-check changes join add; 3478 one enforcer row per item, rule E-SCK.
- E-RTL hits on RULING or APPLIED lines are recorded, not sent (no apply path for those lines): flag to W1 (plan C1(b) said sent).

## Judge-facing intro (new; one line beyond N1, for the card)
"The engine applied your gate answers and read your judgment again. [gate items: Your gate change(s) ... raised the new item(s) below, which the engine could read only after those answers.] [self-check: Lines of your judgment disagree with each other (the item(s) marked SELF-CHECK below); you choose which line changes.] This is one further answer on them, under the same rules and line forms as the gate message above. [gate items: An item raised by a gate change and left uncured keeps that change UNCURED, and that change counts against your seat once, as before.] [self-check: A SELF-CHECK item left uncured counts against your seat once.] There is no further round after this one."

## Results
- t624.cjs dc9192de: ALL PASS (out tg/out_t624.txt). C1 1276 chatgpt sends 3 (WHICH HOLDS AGREEMENT, RETRACTION LEFT STANDING, TWO GRADES), records 2; C2 the 11 other judgments send 0; C3 the WHICH HOLDS change applies on the target, not on the base, and the re-check clears it; C4 a KEEP stays open, and an applied change that still disagrees stays open; C5 scope; C6 tags and compile of the nine gate keys.
- Standing 31 PASS 0 FAIL (tg/out_standing_624.txt). Pair: Library Check PASSES on the engine text (tg/out_pair_624.txt). One-copy (ASK 578 tools, registry_578): PASS.

## Write
ask624/w4/write/write624.sh a9dda2f5: engine only. Refuses on a running execution, a live Shared Library or connections not the base, a live child not the base, a rebuild not byte-equal, t624, standing, pair or one-copy failing. PUT engine, fetchback compare, child checked unchanged, standing and pair on the fetchbacks. Revert revert_eng_624.json. lib_repo.cjs 37a92d98 is the repo tools/lib.cjs, for the one-copy step.

## REV 1 (20:00 CST 11-24): W1 F1 (Wall 11878, ASK 599 rule 7) fixed
Every catch the build adds now records the fault (b624.cjs 252d5e11, rev 1 kept b624_rev1.cjs; sck624.js f146d735, rev 1 kept sck624_rev1.js):
- LIB 3482 Late Gate Build: the fault is kept (__sckE) and carried as sck_fault on the sent item (LIB 3490, now changed too). Gate Record runs the same check on the same text, so the fault is also recorded there on every path.
- LIB 3474 Gate Record (new block, every seat, every path): runs SCK624 on the text after the gate. A throw writes "[AUDIT v60: SELF-CHECK FAULT (ASK 624.5) -- SEAT: <seat>; the self-check threw and was not run: <error>. REVIEW THIS ROW.]". Each item not sent is written as "[AUDIT v60: SELF-CHECK RECORD ONLY (ASK 624.5) -- SEAT: <seat>; <kind>: <item text> NOT SENT: no apply path for this line.]". This also makes the E-RTL record-only items real records; before rev 1 they were recorded nowhere, which was a defect in rev 0's notes ("recorded").
- LIB 3471 Gate Record re-check: a throw sets LG.sckErr, and the item's why reads "the change could not be applied for the re-check: <error>".
- LIB 3858 whl(): a WHL507 throw returns a SELF-CHECK FAULT item (never sent), which the 3474 block records.
Target engine bafa0a0c (child unchanged 29b7f676). t624 54cd2b9e ALL PASS, with C6 rule 7 tests: every new catch records; a forced WHL507 fault; a forced Gate Record fault writes the FAULT line; the 2 record-only items of 1276 are written. Standing 31/0; pair PASSES; one-copy PASS; rebuild byte-equal. On the 12 stored judgments only 1276 has items (3 sent, 2 record-only).
