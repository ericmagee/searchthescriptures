# W2 grade of pkgKSR + pkgECB rev 3 (W1, Wall 4251, commit 9aa9c4f0): PASS
Labels labels_KSR_ECB_rev3_w2.md (commit 0dd950da), before any run of the candidate.

M0 SIZE (measured): all Code text 3,838,702 -> 3,840,979 = +2,277. Shared Library +2,241; Send Back Build, Alt Send Back Build and R2 Alt Send Back Build +12 each.
No prompt text. Connections and non-code parameters equal. My rebuild with W1's build_KSR.cjs SET=ALL is byte-equal to the candidate.

M1 REGRESSION (w2_rev2b.cjs, L2 to L7): 7 OK, 0 FAIL (w2_rev3_regress_out.txt).

M2 KEYSTONE LINE FORMS (w2_ks_forms.cjs; outputs w2_ks_forms_out_rev3.txt and w2_ks_forms_out_rev2b.txt). Each form is planted on every copy of
"KEYSTONE: D6 -- STANDS" (60 strings) and the whole chain is run to Replay Rows; checked: final KEYSTONE D6 per seat, every written field but
verdict_raw, and the Gate Record rows, against the candidate's own unplanted run.
- Rev 3: 26 of 26 live-read forms rewritten to BROKEN for all three seats; fields and gate rows equal in every one. Forms: base; bullets "•", "-",
  "*", ">"; numbering "1." and "7)"; indent; bold label, bold whole line, bold value, "_" italic, backticks; bullet+bold, number+bold;
  "KEYSTONE :", wide spacing, no spacing; separators "—", "–", "-", ":", none; Title case, lower case, lower-case label.
- Rev 2b failed 7 of these (bullets "•", "-", ">", both numberings, bullet+bold, number+bold), measured.
- "RESTATED: KEYSTONE: D6 -- STANDS" is not rewritten by rev 3. It is not a live keystone form: the reader drops RESTATED lines (ri5Rd2024),
  and live s110 builds no E-KEY item on it (w2_ekey_restated.cjs: E-KEY for chatgpt and sol on the plain and bulleted forms, none on RESTATED).
  So this is not a fail.
- Stored forms (measured, debate_judgments 519 and debate_replay_judgments 342; 852 KEYSTONE label lines): "--" 827, "—" 17, "-" 3, no separator 1,
  inside a RULING line 4 (not a KEYSTONE line). 0 with bullet, number, bold, lower case or RESTATED. All 852 are upper case at line start.

M3 K2, K3, K5 (W1's claim). Ablation builds by W1's build_KSR.cjs (SET=ALLxK2 +2,210, ALLxK3 +2,212, ALLxK5 +2,211).
- W1's plant P1 (KEYNOLINE=1) on my builds: rev 3 luna drv_uncured 2, 0, 0; without K2 luna 7; without K3 luna 6; without K5 luna 6. Reproduced.
- My own plant: sol alone writes both D6 collision lines as DEFENDER LINK BROKEN with its own ground ("[CR4] asserts the wording [CR3] dropped"),
  before Panel Cure Check; cureRecompute leaves them unmarked (measured). Stored replies mapped by rule and item (W2KEY=ri), so sol's stored
  "STANDS" answers land on them. Rev 3: KEYSTONE BROKEN for all, no sol gate item. Without K2: sol gate items G1, G2 CONTRADICTION (E-APPLY) and
  G3 CONTRADICTION (E-APPLY KEYSTONE (derived)), all UNCURED. Without K3: sol G1, G2 CONTRADICTION UNCURED. Without K5: the same two.
  So each guard is needed in my plant too (measured at Gate Record). Limit: my chain keeps the stored IF branches and gate replies, so these sol
  gate items do not reach sol's drv_uncured in my replay.
- Without the item mapping (exact line keys), my plant reaches none of the three guards: the unmarked lines are sent back (E-COL) and get no
  stored answer. sol drv_uncured +1 per planted line in s110 and in rev 3 alike; that is the replay having no answer, not the package.
M4 W1's finding confirmed: a judge's own unmarked DEFENDER LINK BROKEN line on the confirmed link is still sent back (sol E-COL, one item per line).
