# pkgCEC: the closing contradiction enforcer and the default break (item A of Wall 3714)

Builder W1. Graders W2 and W3. Base: live s83 (pkgSJR, written 14:51 CST), library strip_SJR.
Wording for the operator: Wall 3718 and `wording_rev1.md` (copy of /mnt/project-files/w1/itemA_closing_contradiction_wording.md, rev 1).
The operator approved the wording (ASK 1: "APPROVED") and answered ASK 2 "YES" at 15:15 CST 11-09. Rev 2 adds ASK 2. It is ready for W4's write after two PASS grades.

## The rule (the operator, 14:31 and 14:42 CST 11-09)
A debater confirmed to contradict itself in its closing round has the chain link broken by default; a withdrawal after the contradiction does not undo it; the withdrawal rules that already stand still stand.

## What changes
1. Four new nodes between Quote Report and Regrade After Quotes?, so the check runs before the single judge and before the panel:
   - **Close Enforcer Build** (Code). Gives DeepSeek each side's four rounds in full, its declared links (defender: the [CR1] DECLARED CHAIN, as Panel Build reads it; challenger: the [DR3] LINK blocks), and every candidate already named. Today that is item B's OPPONENT'S CONTRADICTIONS lines in [DR4], read from the form in W4's wording B2. The prompt is A2 rev 1. Skipped, with the reason, when there are no rounds, no closing round or no DeepSeek model row.
   - **Close Enforcer Needed?** (IF, a copy of Anticheat Needed?): `$json.cec_skip !== true`.
   - **Close Enforcer Call deepseek** (HTTP, a copy of Anticheat Call deepseek: DeepSeek Key, retry 3 x 10 s, continueRegularOutput, `={{ $json.body }}`).
   - **Close Enforcer Record** (Code). Reads `CLOSE-CONTRADICTION:` lines. A CONFIRMED line counts only when all of these hold, otherwise it is NOT CONFIRMED (form):
     - both quotations are found word for word in the rounds named;
     - the earlier round is one of that side's rounds 1 to 3;
     - the closing round is that side's round 4;
     - the link is one of its declared links.

     One break per side and link. It also writes log rows (`cec_log`: kind enforcer_check, rule E-CLOSECON, seat "close enforcer", seat_role "panel" since rev 4), with one row per answer, NO ANSWER for an unanswered candidate, and NONE FOUND or NOT CHECKED otherwise.
2. **Shown to the judges.** Panel Build and Build Independent Verdict append `__CEC(sd)` after the anti-cheat mark (`__ACX`) under each side's close round. The text is CONFIRMED CLOSING CONTRADICTIONS, with both quotes, the link and the A3.2 rev 1 statement. With no confirmed contradiction the output is byte-equal to the base.
3. **The default break** (library, all 26 files that hold the recompute):
   - `cecBroken2024()` reads `$('Close Enforcer Record')`. It returns [] when that node did not run, so every saved run is unchanged.
   - In `cureRecompute`, after the RETRACTED and RESTATED steps, every collision line of a broken link (Dn vs C* for the defender, D* vs Cn for the challenger) is set to `<SIDE> LINK BROKEN`. This holds whatever the judge or the cure gave it. The written line is `Dn vs Cm (verses): DEFENDER LINK BROKEN -- [AUDIT: LINK n BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- DEFENDER -- EARLIER [CR3] "..." -- CLOSING [CR4] "..."]`. The trigger carries `CLOSE-CONTRADICTION <line> (<old> to <new>)`. Counts, standings, CLAUSE, verdict and RESULT are then recomputed by the section 8 definitions already in the code, tie rule included.
   - A line that both sides' breaks reach keeps the defender's break, and the trigger names the challenger's.
   - A broken link that no collision line names still counts as one broken line (`brk` + `__cecX`), and the trigger says so.
   - The same step runs in `sbApply2024`, the send-back recompute, so a send-back cannot undo the break. A line the send-back left or changed is set back through the send-back's own line map, with sid `CLOSE-CONTRADICTION (pkgCEC)`.
   - Callers with no rule item now apply a recompute whose trigger has a CLOSE-CONTRADICTION line, as they already did for the tie: Panel Cure Check, Alternate Merge Seat and R2 Alternate Merge Seat. Cure Check (single judge) with no rule item now runs the recompute when a contradiction is confirmed.
   - No judge item is raised and no seat is removed by the break.
4. **Log.** Alternate Merge puts the E-CLOSECON rows at the head of `enforcer_log` (both the no-round-2 return and round 2), so Write Enforcer Log records them in debate_enforcer_log.
5. **Stub heads.** Alternate Build and Early Alternate Build take pkgLIB_CEC/e4_rebase. Live Early Alternate Build has been stale since s80 (W1 Wall finding 3726).

## Rev 4 (W3 3770: LIVE FAULT in s84/s85, the log rows the table refuses)
- The fault, mine: the two Record nodes wrote seat_role 'enforcer' and cure_status values such as CONFIRMED, NONE FOUND, NOT CHECKED. debate_enforcer_log allows seat_role panel, reserve, alternate, single or synthesis, and cure_status empty, CURED or UNCURED. record_enforcer_log inserts the whole run's log in one statement, so one such row loses every row of the run. I did not check the rows against the table.
- The fix, in code only (no table change): `log()` in the shared Record code writes seat_role 'panel' and leaves cure_status empty; the enforcer's own answer (CONFIRMED, NOT A CONTRADICTION, NOT CONFIRMED (form), NOT CONFIRMED (conflicting answers), NONE FOUND, NO ANSWER, NOT CHECKED, NOT A CANDIDATE) now leads cure_reason, as `<ANSWER> -- <reason>`. The seat name (close enforcer, judge contradiction enforcer) and rule E-CLOSECON still mark the rows. What breaks a link is unchanged: it reads cec.confirmed, not the log.
- Write file: parent_s85_CEC4.json (`node pkgCEC/build_CEC4.cjs`): live s85 with only Close Enforcer Record and Judge Contradiction Record changed (402 nodes; connections equal). parent_s83_CEC.json is rebuilt so the probe runs the same Record code.
- Proof: probe_CEC.txt 63 OK, 0 FAIL. 2j, 2k, 2o, 2p now read the answer from cure_reason. New 9a: all 33 log rows the probe makes pass the seat_role, cure_status and kind checks; 9b: every answer form leads cure_reason; 9c: both seats logged. rev4_logrows.json holds the distinct rows. A rolled-back call of record_enforcer_log with 10 of them (one of each answer form, both seats) and one ordinary panel row inserted 11 rows (`{"rows": 11, "recorded": true}`, then rolled back on purpose; 0 rows remain).

## Rev 3 (W2 3736, W3 3744: FAIL, two fixes)
- Fix 1: `cecStands` takes the round text. A quote stands whole; a quote with "..." stands only when all its parts (5+ words each) fall inside ONE sentence of the named round, in order. A splice of two sentences is refused (probe 2q; 2r keeps a one-sentence ellipsis).
- Fix 2: a candidate, or a NEW pair (side, link, both quotes), answered both CONFIRMED and NOT A CONTRADICTION is recorded NOT CONFIRMED (conflicting answers) and breaks nothing (2s, 2t).
- Both fixes are in the shared Record code, so they hold for the post-panel call too. W2's w2_edge_CEC E4 and E5, which asserted the faults, now show them gone.
- Library unchanged from rev 2 (strip_CEC, pkgLIB_CEC), so gate_CEC.txt stands. Only the two Record nodes change.

## Rev 2: ASK 2, judge-found contradictions confirmed after the panel
6. Four more nodes sit between Panel Payloads (output 0) and Panel Cure Needed?:
   - **Judge Contradiction Build.** Its candidates:
     - each panel judge's and the single judge's `CONTRADICTION -- <SIDE> -- EARLIER ([..], "..") -- LATER ([..], "..")` line whose LATER round is that side's round 4;
     - each contradiction question of the dry question round (QR Merge qa with earlier_quote).

     Pairs are de-duplicated across judges. A pair the pre-panel enforcer already answered is not sent again. No candidate means no call. The prompt is the same, but it answers candidates only.
   - **Judge Contradiction Needed?** and **Judge Contradiction Call deepseek**: copies, as for the pre-panel nodes.
   - **Judge Contradiction Record.** The same checks as Close Enforcer Record. A NEW line is recorded NOT A CANDIDATE and has no effect. It passes Panel Payloads' item on unchanged, with jcc and jcc_log added (Panel Cure Needed? and Panel Cure Build read $json).
   - `cecBroken2024` now reads both records, with one break per side and link. Alternate Merge logs both records' rows.
   - **Limit:** the single judge's recompute runs before the panel, so a break confirmed only after the panel does not reach the single judge's result. It does reach every panel, reserve and alternate seat.

## Proof
- **probe_CEC.txt: 60 OK, 0 FAIL** (rev 2 adds 8a to 8i, rev 3 adds 2q to 2t), on run 34108. The enforcer's reply is written by hand; no DeepSeek call is made offline.
  - **Build.** 151,166 characters, all 8 rounds in full, D1-D6 and C1-C6 read, the Oracle's X lines become candidates, and a missing model row means skip.
  - **Record, the two 34108 lines.**
    - The [CR3] drop of "no biological father" against the [CR4] close "Christ had no biological father." is CONFIRMED on D6.
    - Terra's Genesis 4:1 flag, answered NOT A CONTRADICTION, breaks nothing. In my reading [CR3] already limits that grant: "For this birth Matthew 1:18 states a different order".
  - **Record, refused as NOT CONFIRMED (form).** Eight forms are refused (2c to 2i):
    - a quote that is not word for word (earlier or closing);
    - reversed or wrong rounds;
    - an undeclared link;
    - the wrong side;
    - a quote from another round.
  - **Record, other replies.** NONE, an unreadable reply, a failed call, a duplicate, bold marks and an unanswered candidate are each handled.
  - **Display.** Panel Build and Build Independent Verdict are byte-equal to the base with no record. With the record, the block follows the defender's [CR4] in all 3 panel bodies and in the single judge's body.
  - **Recompute (Panel Cure Check).**
    - With no record, strip_CEC equals strip_SJR.
    - With D6 confirmed, all three seats (luna, terra, sol) read every D6 line DEFENDER LINK BROKEN with the AUDIT line. Each verdict goes from HELD to BROKEN, with RESULT CHALLENGER WINS. The other lines are unchanged, and the cure rows, alt_needed and enforcer_log are unchanged.
    - A challenger break, both sides on one line, and a link with no line each behave as stated.
  - **Send-back (Alternate Merge Seat, which applies 34108's real send-backs).** All three seats stay BROKEN, whether the input is the uncured or the cured texts.
  - **Single judge (Cure Check).** It is unchanged with no record. 34108's single judge was unreadable, so luna's text was put in its place: BROKEN with the record, HELD without it.
  - **Log.** 2 E-CLOSECON rows at the head of enforcer_log; the rest is unchanged.
  - **Rev 2 (8a to 8i).**
    - On 34108, terra's CONTRADICTION line becomes candidate J1. With the pre-panel record it is not sent again, because it was already answered.
    - A confirmed J1 breaks D1 in the recompute, and Panel Payloads' item passes on unchanged.
    - A NEW line breaks nothing.
    - Both records break their own links.
    - Alternate Merge logs both.
- **gate_CEC.txt: GATE PASS.** Base strip_SJR, candidate strip_CEC, fetch-back s82: 862 node runs, all byte-equal or the same error, 17 near-miss checks. No saved run has a Close Enforcer Record, so nothing changes. That path is tested by the probe above.

## Not tested offline
- What DeepSeek actually answers on 34108's rounds. The first dry regrade or run shows it.
- The call's time: one call of about 151,000 characters before the single judge.

## Files
- cec_nodes.cjs: all code text.
- build_CEC.cjs:
  - `strip` writes pkgLIB/strip_CEC and plan_CEC.json.
  - `parent` writes parent_s83_CEC.json from fetchback_live_s83.json: 402 nodes (+8), connections in the file.
- probe_CEC.cjs/.txt, gate_CEC.txt/.log, wording_rev1.md, manual_part_CEC.md.

## Write (W4, after the operator's approval)
- Write parent_s83_CEC.json on top of s83 (pkgSJR). It also carries the Early Alternate Build head (pkgEAB), so pkgEAB need not be written separately if this goes first.
- Or write the four new nodes, the four edited non-library nodes, pkgLIB_CEC/patched, e4_rebase, and the connections in build_CEC.cjs.
- Run n8n validation first.
