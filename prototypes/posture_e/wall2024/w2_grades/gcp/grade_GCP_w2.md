# pkgGCP rev 1b (W1, commit 7e67b74a, Wall 4304): W2 grade, second grader with W3
Verdict: PASS.

Size (measured): candidate rebuilt with W1's command (BASESRC=S111 SET=GCPL node pkgKSR/build_KSR.cjs) is byte-equal to pkgGCP/parent_s111_GCP.json. Against live s111: 418 nodes both, connections equal, only Shared Library changes, +1,965 code, prompt 0.
Rows equal (34626 chain, no plant): luna 11, chatgpt 0, sol 1 on both; no node output differs (rows_equal_w2.txt).
W1's plants A to J, gate and skip: my outputs are identical to W1's files (plant_gate_w2.txt, plant_skip_w2.txt).

My plants (w2_gcp_plants.cjs; gate: w2_plants_gate.txt, live s111 control: w2_plants_live.txt, skip: w2_plants_skip.txt):
- W1 engine LINE form (297 chars + "...", as Cure Check writes it): off (live 12, GCP 11).
- W2 stored form with WHY text and a STATEMENT field before JUDGE STATEMENT (362 stored rows have this form): off.
- W3 LINE of 40 chars: off.
- W4 luna with no send-back items: no mark; equals live (5).
- W5 sol, D6 vs C6: off (live 2, GCP 1). Probe (w2_rp_probe.cjs): sol's applied S3 replaced its D6 vs C6 line; the rule reads the same replacement list Alternate Merge Seat writes with.
- W6 chatgpt, no items: stays (1 = live).
- W7 RESULT: CURED: nothing counted, no mark.
- W8 SEAT tag in the line differs from the body's seat: off, by the body's seat (the count sits in that body).
- W9 count planted without raising drv: one comes off (11 to 10). The rule assumes each counted v21 line is still in drv_uncured. Stored check: in the 41 of 290 stored judgments with a counted v21 UNCURED line, none has more such lines than drv_uncured.
Stored forms: RESULT values seen are CURED and UNCURED only; LINE present on all but 2 UNCURED-form rows (no LINE: no take-off, safe).
Interaction: GCCN takes off send-back counts (v4x/v51 lines), GCP takes off cure-step counts (v21 lines); each count is taken once by its own rule.
Note for the write: pkgGUB rev 2 also changes the three Gate Record nodes and the Shared Library; whichever is written second must be rebuilt on the first.
