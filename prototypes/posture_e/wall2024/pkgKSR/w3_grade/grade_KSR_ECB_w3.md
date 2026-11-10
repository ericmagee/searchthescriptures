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


# REV 2b REGRADE (W1 commit b3b1305b; labels ae8eacb7 before any run). Outputs w3_KSR_ECB_rev2b_out.txt, w3_plants_rev2_out.txt, w3_plants_rev2b_out.txt, w3_ablate_out.txt, w3_ablate2_out.txt.

## Verdict (the two packages together, as W1 proposes): FAIL, narrow. One KEYSTONE line form is missed (R6). Everything else I tested passes.

## R1 Sizes (measured): pkgKSR +1,384, pkgECB +1,500, both +2,884. Shared Library, plus the three Send Back Build stubs for pkgECB (they now name the closing enforcer nodes). Connections equal. The repo file equals /mnt/project-files/wall2024/parent_s110_KSR_ECB_ALL_rev2.json.

## R2 Both, whole chain to the written rows: OK
KEYSTONE D6 BROKEN for luna (her own line), terra and sol (the engine's line). Tags, RESULT, drv_uncured (luna 2, terra 0, sol 0) as live. The gate holds luna's 5 items only: the item against terra's RULING card is gone, and luna's two FORCED lines of link 6 are not sent and raise nothing. 10 items withheld, each listed in sb_not_sent.

## R3 Alone
- pkgECB alone: luna BROKEN; terra and sol STANDS. Rows otherwise as live.
- pkgKSR alone: rows read BROKEN for all three, but the engine's KEYSTONE line is sent back to terra and sol as an E-KEY item (drv_uncured 1 each in the replay with stored replies). Not to be written alone.

## R4, R5 Withhold rules: OK (7 of 7)
My two rev 1 plants (a judge's own line carrying the eight words) are SENT now. A hand-typed mark for a link that is not confirmed, a mark for link 6 on a link 2 line, a KEYSTONE line in the engine's form for a link that is not confirmed, and the engine's KEYSTONE line with more words after it: all SENT. Every item withheld by both packages is a link 6 collision line, its FORCED line or the KEYSTONE D6 item; every other item equals live.

## R6 KEYSTONE line forms (sol's stored line rewritten before Panel Cure Check): FAIL on one form
- Rewritten to BROKEN in the written row: bold, em dash, colon, no separator, lower-case grade. OK.
- NOT rewritten: a line that opens with a bullet ("• KEYSTONE: D6 -- STANDS ..." and "- KEYSTONE: D6 -- STANDS ..."). Live reads that line as the KEYSTONE line (the enforcer step builds an E-KEY item on it), so the written row would read STANDS on a broken link: fault 2 again for that form.
  Stored judgments (measured): 495 of 519 carry a KEYSTONE line; none opens with a bullet or bold. So 0 real cases; found by plant only.
  Closing condition (for W1 to write): the KEYSTONE rewrite reads every line form the live KEYSTONE reader reads, a leading bullet included.
- "KEYSTONE: LINK 6 -- STANDS": left as written by live and by the candidate; live does not read it as a KEYSTONE line either (no E-KEY item). Not counted against the package.

## R7 Confirmed list planted: OK
Confirmed line moved to defender link 3, or to CHALLENGER link 6: pkgKSR alone gives rows equal to live; with both, every KEYSTONE line is as live has it and only that link's engine break lines are withheld. No confirmed line: rows equal live.

## R8 enforcer_log: OK
Both packages add 10 "SEND-BACK NOT SENT ... (pkgECB)" rows and 2 record-only K-RECHK rows on the engine's KEYSTONE line; the same fields as live rows. Rolled-back insert of three of them through record_enforcer_log: {"rows": 3, "recorded": true}; 0 rows left after the rollback.

## R9 Bloat (measured by building both packages without one patch at a time)
- Needed on 34626: K1 (the rewrite), K6 (+82: without it the gate item against terra's RULING card returns), E1 to E3.
- NO EFFECT in my two tests: K2 (+67), K3 (+65), K4 (+686), K5 (+66), together +884 of the +2,884. Test 1: 34626 whole chain. Test 2: a plant where sol has no collision line of the keystone link (the "no collision line names it" branch). In both, the written rows, the send-back items and the gate items are the same with and without each patch.
  K4 guards the KEYSTONE line through send-back; with pkgECB in the same write the engine's KEYSTONE line and the break lines are never sent, so nothing can change it there in my replays.
  A package without K2 to K5 would be +2,000 (measured sum) and would not change this grade. W1 may know a case that needs them; none is shown.

## Limits
Stored replies only; new items have no answer. The enforcer's stored DISAGREE on terra's and sol's KEYSTONE lines was written against STANDS; I ran the chain with those two replies as stored and as AGREE, with the same rows. Alt and R2 Alt Send Back Build: NOT REACHED with items.

# REV 3 (W1 commit 9aa9c4f0; candidate pkgKSR/parent_s110_ALL.json = /mnt/project-files/wall2024/parent_s110_KSR_ECB_rev3.json): PASS
Labels committed 6c9a3f40 before any run of the candidate. Offline, stored replies of execution 34626 (dry regrade of debate 34108). Graded independently of W2.

- V1 SIZE (measured by my own build from the patch files, byte-equal to the candidate): +2,277 code (Shared Library +2,241; Send Back Build, Alt Send Back Build, R2 Alt Send Back Build +12 each), connections equal, no prompt text. (Corrected before posting: I first wrote "Shared Library only" without reading the node list.) K2 +67, K3 +65, K5 +66 (each measured by leaving it out).
- V2 WHOLE CHAIN to the written rows: KEYSTONE D6 BROKEN for luna, terra, sol; tags BROKEN, CHALLENGER WINS; drv_uncured 2, 0, 0; rows differ from live in verdict_raw only; gate items are luna's five as live, none against terra or sol; 10 items withheld and every one listed (8 link 6 collision and FORCED items, 2 KEYSTONE items); luna's FORCED lines of link 6 not sent and no new gate item (E3 dropped without loss). Output w3_r3_chain_out.txt.
- V3 MY REV 2b FAILURE IS CLOSED. KEYSTONE forms on sol's line, 15 forms (w3_r3_forms_out.txt): "• ", "- ", "* ", indent, em dash, bold, bold bullet, "1. ", "> ", colon, no separator, lower case grade: all end BROKEN. Left as written: "– " (en dash bullet), "## ", and "KEYSTONE: LINK 6"; live builds no KEYSTONE item for those three either, and rev 3 uses the live reader itself, so the two read the same lines.
- V4 WITHHOLD RULES (unchanged patch files since rev 2b): a judge's own line carrying the mark or the eight words on a link not confirmed, or on another link: SENT. A judge's own KEYSTONE line in the engine's form for link 4, with more words after the engine line, or STANDS with the eight words: SENT under rev 3's withhold rules alone (my own build of them). Under the full candidate those three plants cannot occur as planted, because the KEYSTONE line of the confirmed link is already the engine's line; my first run of them under the candidate matched nothing and printed FAIL; that was my plant, not the package. Confirmed list moved to defender link 3, to challenger link 6, or emptied: every KEYSTONE line as the judge wrote it.
- V5 K2, K3, K5 ARE EACH SHOWN NEEDED, by my own plant made upstream of the recompute (w3_r3_p5_out.txt): sol's two link 6 collision lines judge-written DEFENDER LINK BROKEN; live code leaves such lines unmarked (W1's premise, confirmed), they are sent back, and sol's stored replies change them to STANDS. Candidate: the lines are broken again with the mark, KEYSTONE BROKEN, no gate item, sol uncured 0. Without K2: three gate CONTRADICTION items against sol ("KEYSTONE D6 STANDS while ... is graded DEFENDER LINK BROKEN"). Without K3: two ("KEYSTONE D6 BROKEN while no D6 collision line is graded DEFENDER LINK BROKEN"). Without K5: two ("KEYSTONE D6 BROKEN while the verdict derived ... is not BROKEN"). Each is a false item raised against a judge for the engine's own break. In my plant the uncured counts did not rise (no stored gate reply exists for the new items); W1 measures a rise in its plant, which I did not rerun.
- V6 ANTI-CHEAT: a judge that changes its own DEFENDER LINK BROKEN line of the confirmed link in a send-back reply still ends BROKEN on that link under the candidate.
- V7 enforcer_log: 42 rows differ from live's; they use only fields live rows use; rolled-back insert of four of the new kinds through record_enforcer_log: {"rows": 4, "recorded": true}, nothing left.
- V8 NOT DONE on execution 34299 (my chain harness holds 34626 only). In its place: 34626 with the confirmed list emptied gives written rows equal to live.
- NOT REACHED: Alt and R2 Alt Send Back Build.
- RECORD NOTES, not failures: (1) a judge's own unmarked DEFENDER LINK BROKEN line on a confirmed link is still sent back (W1's stated finding); the result stays right. (2) In the replay the stored enforcer answer on the KEYSTONE line (DISAGREE, right: BROKEN, given on a STANDS line) is recorded beside the engine's BROKEN line; in a live run the enforcer would read the BROKEN line. A replay cannot show that; it is for the next run's grade.

# JOINT FILE (W1 Wall 4254; JC = /mnt/project-files/wall2024/joint_GFS_QRD_F3A2s_plus_KSR_ECB_rev3.json; JB = pkgKSR/joint_GFS_QRD_F3A2s.json): rev 3 PASSES on the joint file
Labels b1693d93 before any run. I do not grade the pkgGFC part (my build); its effect is stated where it shows. pkgQRD and pkgF3A nodes are checked for byte equality only.
- J1 ASSEMBLY (w3_joint_asm_out.txt, 10 OK): JB differs from s110 in exactly QR Check, QR Final (equal to the pkgQRD file), Second Alternate?, Alternate Merge (equal to the pkgF3A rev 2s file with the exemption) and Shared Library (equal to the pkgGFC rev s file); +2,276 code measured. JC differs from JB in exactly Shared Library (+2,241) and the three Send Back Build nodes (+12 each): +2,277 measured; the three nodes are byte-equal to those of the s110 rev 3 candidate. JC against s110: +4,553 code measured. Connections and node count equal. No prompt text from rev 3.
- J2 SOURCE CHECK: 41 library stub nodes rebuilt; in each, JC differs from the s110 rev 3 candidate in exactly the lines the pkgGFC rev s file changes against s110. Alternate Build and Early Alternate Build are not unpacked by the tool; their stub text is equal in s110, s110 rev 3, the pkgGFC file and JC.
- J3 CHAIN on execution 34626 to the written rows: KEYSTONE D6 BROKEN for luna, terra, sol; CHALLENGER WINS; uncured 1, 0, 0 (JB also gives luna 1: that is pkgGFC reading luna's gate item G5; gate 5 of 5 cured). JC rows differ from JB rows in verdict_raw only. No gate item against terra or sol. 10 items withheld and listed, the same ten as on s110.
- J4 My 15 KEYSTONE line forms: outcome per form identical to s110 rev 3.
- J5 My upstream plant (sol's link 6 lines judge-written DEFENDER LINK BROKEN, changed by sol's stored replies): JC ends BROKEN on the link with the mark, KEYSTONE BROKEN, no gate item naming KEYSTONE or D6. K2, K3, K5 ablations NOT rebuilt on the joint base; J2 is the ground for carrying the s110 result over.
- J6 EXECUTION 34299 (no confirmed closing line), the check owed from the s110 grade (w3_joint_34299_out.txt, 10 OK): Panel Cure Check, Send Back Build, Send Back Record, Gate Build, Gate Record rerun on stored inputs. s110 rev 3 equals live s110 for all five. JC equals JB for all five. JB equals live s110 for four; Gate Record differs (pkgGFC, luna's three gate items). So rev 3 does nothing where no closing contradiction is confirmed.
- NOT REACHED on the joint file by me: round 2 and the alternate paths (W1 and W4 walked parts of them, Wall 4250, 4254, 4255); the withhold in the alternate send-back nodes.
