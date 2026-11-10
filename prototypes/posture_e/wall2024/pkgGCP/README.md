# pkgGCP (W1, offline): a cure-step count comes off when a later applied change corrects the line (W3 sweep path 2)
Base: live s111 (fe9e1ed0; fetch-back /mnt/project-files/wall2024/fetchback_live_s111.json), which already holds GCCN rev 3. Candidate: pkgGCP/parent_s111_GCP.json (copy in /mnt/project-files/wall2024/).
Build: BASESRC=S111 SET=GCPL node pkgKSR/build_KSR.cjs /mnt/project-files/wall2024/fetchback_live_s111.json pkgGCP/parent_s111_GCP.json
(strip_S111 = every library node of s111 rebuilt to full source; Alternate Build rebuilt from its stub head.) An s110 build on GCCN rev 3 (SET=GCP) is kept as pkgGCP/parent_s110_GCP.json.

Rule (Gate Record, Alt Gate Record, R2 Alt Gate Record; also when the gate is skipped because no seat has a gate item):
for each seat with send-back items and drv_uncured > 0, each cure report line "[AUDIT v21: DEBATE RULE VIOLATION REPORT -- ... ITEM: X; RULE: R; RESULT: <not CURED>" that counted
(R LIVE; not "NOT COUNTED (K-C UNCURED)"; not "WHY: no written response", so silence stays counted) comes off once (drv_uncured - 1, not below 0) when all three hold:
 (a) an applied send-back or gate change replaced the line the report names (sbApply2024 on the seat's send-back items plus the gate's added items, the same call Alternate Merge Seat makes to write the row);
 (b) the gate's own rule re-read (drvCheck + K-F + K-UNX, as gateNewK2024 runs it) raises R on X in the text before the changes;
 (c) the same re-read on the corrected text does not raise R on X.
Mark: "[AUDIT v52: CURE COUNT OFF (pkgGCP) -- SEAT; ITEM; RULE; ...]". A rule the re-read does not produce (K-W, K-RUL, K-CMT and others) never meets (b), so it stays counted.
Code: gateNewK2024's inner reader moved, unchanged, to gnkRun2024 (shared by the gate and pkgGCP); gcp2024 added; the gate-skip return moved below PB0 and given the call.

Size (measured): +2,470 Code text on s111, Shared Library only; no prompt text.
Tests (34626 chain, stored replies):
- rows_equal_34626_s111_out.txt: written rows of live s111 and candidate equal; no node output differs.
- plant_s111_gate_out.txt / plant_s111_skip_out.txt: plants A-J through the gate and with the gate skipped. A (K-B D6 vs C6, replaced by S8/S9): off, both branches. B (D6 vs C5; on s111 not replaced and still raised): stays. C (line never replaced), D (raised before and after), E (silent), F (K-C NOT COUNTED), G (TRIAL), H (raised only after): stay. I: one of two off. J: same item twice, one off.
- plant_GCP_gate_out.txt (s110 build): A, B, I (two) off.
- r2_plant_s111_GCP_out.txt: round 2 walk output identical to live s111.
Not reached: stored replay of 33371 / 33490 (no chain data); a qualify-mode alternate.
