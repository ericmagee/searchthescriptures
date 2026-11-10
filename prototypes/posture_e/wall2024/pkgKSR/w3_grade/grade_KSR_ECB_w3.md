# W3 grade: pkgKSR and pkgECB (W1, commit 62588cc0) on live s110, execution 34626 (the dry regrade of debate 34108)

Labels: labels_KSR_ECB_w3.md (commit 6cd7e2a7, before any candidate run). Scripts: chain.cjs (replay of every code node from
Panel Cure Check to Replay Rows, each stub run as n8n runs it, stored model replies), w3_KSR_ECB.cjs, w3_plants.cjs.
Outputs: w3_KSR_ECB_out.txt, w3_plants_out.txt.

## Verdict
- pkgKSR: FAIL.
- pkgECB: FAIL (two findings; the intended case works and luna's KEYSTONE case is closed).

## Sizes (measured against fetchback_live_s110.json)
Only the Shared Library differs; 418 nodes; connections equal. pkgKSR +418, pkgECB +462, both +880 code. No prompt text.

## Harness (H0)
The chain on the live file reproduces the stored outputs of all 46 nodes from Panel Cure Check to Replay Rows; the final
rows read KEYSTONE D6 STANDS for all three judges, as written by the dry regrade.
Limits of the replay: model replies are the stored ones. Where a candidate changes the item list, stored send-back and gate
answers are renumbered by item identity and answers to items no longer sent are removed. New items have no stored answer.

## pkgKSR
- K1 OK. Panel Cure Check: terra (seat key chatgpt) and sol read "KEYSTONE: D6 -- BROKEN -- LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION". luna keeps her own BROKEN line.
- K2 FAIL. pkgKSR alone, final rows: all three judges read "KEYSTONE: D6 -- STANDS -- derived by the engine ... after the change of S...".
  The break lines are still sent back, the judges change them, and the derived-keystone step writes STANDS over the engine's line.
  Same result with the stored enforcer replies on the two KEYSTONE lines set to AGREE. W2 reached the same failure by another route (Wall 4224).
- A1, both packages: final rows read BROKEN for all three. So pkgKSR holds only when pkgECB is in the same write.
- NEW FINDING, both packages: the gate raises an item against terra: "your RULING card grades KEYSTONE D6 STANDS, but your
  KEYSTONE line now reads D6 BROKEN. Change one of the two lines so they agree." (E-GATE D38). The engine rewrote the KEYSTONE
  line and the judge is then charged with the disagreement. The judge may answer by changing KEYSTONE back to STANDS. There is
  no stored answer, so the replay cannot show which way it goes. This must be closed in rev 2.
- K3 to K8 (plants: other link, challenger side, already BROKEN, formatted line, no confirmed line, other keystone): NOT RUN, because the package already fails. W2 ran the other-link and no-break plants (output equals live).

## pkgECB
- E1 OK. Send Back Build 30 items to 24. The 6 removed are the engine's break lines of D6 vs C5 and D6 vs C6, two per judge. Each is listed in sb_not_sent with a reason.
- E3 OK. luna's final row reads her own "KEYSTONE: D6 -- BROKEN". pkgECB alone closes luna's case. terra and sol still read STANDS with pkgECB alone.
- E4 FAIL. Plant: luna's own line "D2 vs C1 (Matthew 1:19): STANDS -- link 6 is BROKEN BY A CONFIRMED CLOSING CONTRADICTION, and ..." (link 2 has no confirmed contradiction; the enforcer flags it E-HOLD). Live sends it (S10). pkgECB withholds it and lists it as "the engine's closing-contradiction break".
- E5 FAIL. Plant: sol's own "KEYSTONE: D6 -- STANDS -- not BROKEN BY A CONFIRMED CLOSING CONTRADICTION; ...". Live sends it (S4). pkgECB withholds it.
  Reading: this is a fault. The test is on eight words anywhere in a line. A judge that writes those words on any line takes that
  line out of send-back, and an enforcer's finding on it is never put to the judge. It is listed, not silent, but a missed true positive is not safe.
  Closing condition (for the builder to write): withhold only a collision line that carries the engine's own mark
  "[AUDIT: LINK n BROKEN BY A CONFIRMED CLOSING CONTRADICTION" where the line is a collision line of link n on the side the mark names
  and that side and link are in the confirmed closing list (cecBroken2024). Any other line is sent as today.
- FINDING (E2). luna's two FORCED lines of D6 vs C5 and D6 vs C6 are still sent (the enforcer says "right: STANDS" on each).
  Her stored answer to both is "RETRACTED". With the collision line now held BROKEN, both answers are NOT APPLIED and become two
  new gate items. In the replay they have no gate answer and count uncured: luna's drv_uncured goes from 2 to 4.
  Limit: a live judge might keep the lines, or cure at the gate. The item is still one the judge cannot satisfy by a change,
  because the link is broken by the engine. Closing condition: also withhold a FORCED line whose pair's collision line is withheld under the rule above.
- E6 OK (the intended case, shown on 34626 itself). E7 Alt and R2 Alt copies: NOT REACHED with items (W2 confirmed the inserted code is identical). E8 enforcer_log insert: NOT RUN (package fails; owed at the next revision).

## Result lines
RESULT, tag (BROKEN), CHALLENGER WINS unchanged in every chain. luna stays out of the count in every chain (drv_uncured above 0).
