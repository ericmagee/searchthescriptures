# ASK 532 PLAN rev 0 (W4, seat 35): a press needs a footed premise before the E-GATE calls it a BROKEN ground

Approved by the operator at 08:56 CST 11-23 ("Yes, require it (ASK 532)", as W3 relayed it). For grading by W1. W4 builds after it passes.
Base: live engine 48513907 (fetch-back ask523/w4/write/fetchback_engine_523.json, af95e833), child ac517c41 (e7f2c047), Library 76e1abbcf9524915.

## 1. OBJECTIVE
A judge's ANSWER CHECK graded MISSES or FAILS sets off the E-GATE M push ("ANSWER OPEN") and the E-GATE B item ("ANSWER GROUND"). After this change, neither fires on a press whose premise is not footed: the facts its MEANS sentence needs must be stated by verse words quoted in the record. The E-GATE sentence that cites ruling 392 for "a proven press left unanswered is a BROKEN ground" is corrected to cite what the records hold.

Where the rule comes from:
- Ruling 392 limits a press: "a press must have a premise behind it; a verse pressed without one isn't a witness".
- The new condition is that a premise is footed by the rows read together. That comes from the operator's 08:56 decision, not from ruling 392. Today the engine reads 392 as satisfied whenever a verse sits under a listed premise's PRESSED WITH (the source_ref of 392). In 41418, Jeremiah 22:30 sits under listed premise 5.
- "Proven" today means the press entry has a MEANS sentence plus an [L2] or [L3] layer, or a valid PROVEN IN round, and passes the floor check (classify0 and classify, Library lines 42 to 86). It does not test whether the MEANS is stated by rows.
- Ruling 372 stands unchanged: "I see no reason to undo it". A footed press left unanswered still binds. Only a press with no footed premise stops binding, which is ruling 392's own limit.

## 2. ROLES
- Plan and build: W4.
- Grade (one grader, op doc v139): W1.
- Write: W4, on the operator's card in W4's thread.
- Readback: one non-builder seat.

## 3. SCOPE
SEARCH (what I read):
- md_notes_rulings 372, 392, 398, 428, 459.
- engine_manual latest, section 8 ("A proven press left unanswered by the broken side's later rounds is also a BROKEN ground").
- Wall 10567, 10568, 10569, 10570, 10571, 10588.
- debate_enforcer_log 51435 to 51440 (full flagged, response and cure text).
- debate_results f333ef24 (run 41418), all eight round columns: the round 2 list, and the regex counts for Coniah, Jechonias and Jeremiah 22:24 to 29.
- Live Library 76e1abbc in full for "proven press", "ruling 392", gateAnsOpen2024, gateAnsGround2024, pwList, PRS.premise and classify0. Also the MAP entries of every node that holds those lines.
- Live engine nodes Assume Check Build, Assume Check Record, Gate Build, Gate Record, Late Gate Build; their if(false) lists; the engine connections around Assume Check.
- Child ac517c41: its Assume Check Record (a pass-through of the engine's record) and its gate nodes.
- SX4Z fetch-back 497ffa2c (ask502/w4/write): no hits.

NOT SEARCHED: c7366RPLb8vdMQg6 and Y1VIsNB6KBrs1znP (no fetch-back at hand; W4 searches them at build).

IN SCOPE (nodes):
- Assume Check Build: add the footing read to the existing E-ASSUME call. This is the same call and the same enforcer, with no new node.
- Assume Check Record: parse the footing read into acx.presses and log E-PRESS rows.
- Library gateAnsOpen2024 (line 1669) and gateAnsGround2024 (line 1661): skip a press that is not footed, and correct the sentence.
- Library: the comments at lines 1511 to 1517.
- Stubs whose if(false) list gains $("Assume Check Record"), so that the task runner sends its data:
  - engine: Gate Build, Gate Record, Late Gate Build, Alt Gate Build, Alt Gate Record, Alt Late Gate Build, R2 Alt Gate Build, R2 Alt Gate Record, R2 Alt Late Gate Build (whichever exist in the engine);
  - child: R2 Alt Gate Build, R2 Alt Gate Record, R2 Alt Late Gate Build.

FOUND, NOT IN SCOPE (scope rule; for the team):
- (a) Library line 3195, the E-COL enforcer rule text, also cites ruling 392 for "a link is also broken when a proven press against it was left unanswered". That is the enforcer's text, not the E-GATE.
- (b) A collision line graded BROKEN on a press with no footed premise (the K-G4 and K-U paths). This is ASK 530's area.
- (c) The E-VOID reading of premise 5 (sol 6.2 called it VOID in rows 51436 and 51437).
- (d) pkgBKC (Library line 461) reads $('Assume Check Record'), but the gate stubs do not name that node, so in gate nodes it may read nothing. This is not measured; the build will report it. Change (3) below names the node, which also reaches line 461 in those nodes, so the build reports any change in pkgBKC results as a side effect.

## 4. CRITERIA and DONE
1. THE FOOTING READ (Assume Check Build). The selection and the question:
   - The selection is every press in the list that closes [DR2] (against the defender) and in the list that closes [CR3] (against the challenger) that pwList counts as proven (its keys).
   - The selection does not depend on a judge's grades, so alternates and grades changed after a send-back are covered.
   - The enforcer gets one more task in the same call. For each press: do the verse words quoted anywhere in the record, rounds 1 to 3 of both sides read together (the 524 lists, both sides), state each fact the press's MEANS needs to reach the link?
   - Reply lines:
     - `PRESS-CHECK: <DEFENDER|CHALLENGER> PREMISE <n> -- <reference> -- FOOTED -- <reference> "<verse words>" [; ...] -- <one sentence>`
     - `PRESS-CHECK: <DEFENDER|CHALLENGER> PREMISE <n> -- <reference> -- NOT FOOTED -- FACT "<the fact no quoted verse states>" -- <one sentence>`
   - The row set is the whole record (both sides), because the operator's words are "a premise from the record", and a press may lean on the other side's own rows.
   - The Assume Check still skips when there is neither an ASSUMES premise nor a proven press. Today it skips when there is no ASSUMES premise.
2. TWO READERS, EITHER ONE FAILS (Assume Check Record). A press is NOT FOOTED when any of these holds:
   - (a) the enforcer says NOT FOOTED;
   - (b) the enforcer says FOOTED, but a quoted verse-words string (2 words or more) is not found in the record's quoted verses;
   - (c) the code's name test (vp4Code on the MEANS) finds a proper name in the MEANS that no quoted verse words of the record hold.
   It is NO READ when there is no line, no reply, or the Assume Check was skipped. Otherwise it is FOOTED.
   - Either reader suffices because this only withholds a push. It counts nothing against any seat.
   - Each press gets one E-PRESS enforcer_log row: FOOTED, NOT FOOTED (with the reason) or NO READ.
3. E-GATE M and E-GATE B (Library, the 9 or more gate nodes). Before raising an item on a press (side, reference, link):
   - FOOTED: raise as today, with the corrected sentence (criterion 4).
   - NOT FOOTED or NO READ: not raised. The judge's ANSWER CHECK line gets the mark `[AUDIT v65: ANSWER CHECK NOT A WITNESS (pkgPFT, ASK 532) -- <seat>; <reference> [<round>]: <the reason>; ruling 392: "a press must have a premise behind it; a verse pressed without one isn't a witness"; its MISSES grade raises no gate]`.
   - So the ANSWER CHECK MISSES on such a press counts for nothing: it raises no M and no B item. This is the ANSWER CHECK half (W1 10568 item 7).
   - NO READ fails closed: with no footing read, the push is not made and the mark says so. This follows "require it".
4. THE SENTENCE (Library line 1687 and the comments at 1511 to 1517). The cited ruling changes from 392 to what holds the rule:
   - Old: "... carries <ref> as a proven press against <link>, and a proven press left unanswered is a BROKEN ground (ruling 392); yet ..."
   - New: "... carries <ref> as a press against <link>, proven through its layers (ruling 398), and the system's footing read finds its premise stated by verse words quoted in the record (ruling 392: \"a press must have a premise behind it; a verse pressed without one isn't a witness\"): <the FOOTED quote, cut to 200 characters>. A proven press left unanswered by the broken side's later rounds is a BROKEN ground (engine manual section 8); yet ..."
5. RULING 428. The withholding (criterion 3) is LIVE from the write: the operator's "require it", and it removes a push rather than adding a count. The E-PRESS rows are record-only.
6. DONE:
   - All of the tests in section 5 pass.
   - Removal tests: on the 41418 replay, no seat's drv_uncured rises from this change.
   - The fetch-backs match the targets.

## 5. WRONG-IF (checked offline at build)
- KNOWN-BAD, 41418, Jeremiah 22:30 (rows 51437 and 51440).
  - Measured now: the record quotes Jeremiah 22:28 "Is this man Coniah a despised broken idol?" (challenger round 3) and Matthew 1:12 "Jechonias begat Salathiel".
  - No quoted row in the record says Coniah is Jechonias. Regex over all eight rounds: "Jeconiah" and "Jehoiachin" 0.
  - With a NOT FOOTED reply for Jeremiah 22:30, gate M items G3 for sol 6.2 and terra are not raised, and the ANSWER CHECK lines carry the v65 mark.
  - WRONG IF either item is still raised.
  - LIMIT, measured: the code's name test cannot catch this case alone. The MEANS names only "Jechonias", and Matthew 1:12's quote holds it. So the known-bad case rests on the enforcer's reply.
- KNOWN-GOOD, 41418, Isaiah 7:14 (rows 51436 and 51439).
  - Its MEANS ("the sign is a virgin who conceives, so the seed comes of the woman") names no person, so the code test passes.
  - With a FOOTED reply quoting Isaiah 7:14 "a virgin shall conceive, and bear a son" and Genesis 3:15 "her seed" (both quoted in the record), gate M items G2 are raised as today, with the new sentence.
  - WRONG IF they drop, or if the old "(ruling 392)" sentence remains.
- Synthetic tests:
  - FOOTED with verse words not in the record gives NOT FOOTED.
  - A missing line gives NO READ and no push.
  - acx_skip gives no push on any press, with the mark.
  - The same keys are produced at Gate Build and at Gate Record: the "cured" test re-runs gateItems2024 and must not see a raised item vanish because of a different footing read.
- Regression: every other gate item (E-APPLY, K re-read, D38, V, the K-RUD pair) is byte-equal on the 41418 Gate Build and Gate Record replays (ask523/w4/41418 inputs).

## 6. RUN EVIDENCE
- NO PROBE (ASK 417) for the enforcer's footing reply: model outputs cannot be forced offline. The code path is tested with recorded and synthetic replies.
- UNEXERCISED until a released run. The proof on a run is an E-PRESS row per proven press, and on any NOT FOOTED press, no E-GATE M row and a v65 mark.
- Cost: one existing call grows by the press lines (41418: 6 premises with 3 to 8 presses each, under about 15,000 characters of prompt). There are no new calls.

## 7. INPUTS IN GIT
The files below are in the project files. W3 commits them to the repository, as for ASK 526. No commit exists yet.
- This file (ask532/w4/plan532.md).
- The base fetch-backs: ask523/w4/write/fetchback_engine_523.json (af95e833) and fetchback_child_523.json (e7f2c047).
- The 41418 replay inputs: ask523/w4/41418/ (part_rr1.json, part_gr1.json, child41440_rr_gr.json).

## 8. STEPS
1. W1 grades this plan (no card).
2. W4 builds:
   - patch532.py on the live base;
   - tests per section 5;
   - search of c7366 and Y1VIsNB6;
   - BUILD532.md;
   - write532.sh with md5 asserts, and revert532.sh.
   - The build posts on root 2024 for W1's review (no card).
3. The write waits on the operator's card "Write 532" in W4's thread, posted only after the coordinator clears it (one card at a time).
4. A readback by one non-builder seat (no card).
5. The proof waits on the next released run (the operator's release card).
6. ORDER WITH ASK 531: 531 (W3 plan rev 1, Wall 10592) also changes Assume Check Record in the engine and the child. Whichever is written second is built on the first one's written result, and its build shows the first one's tests unchanged on the stack.
