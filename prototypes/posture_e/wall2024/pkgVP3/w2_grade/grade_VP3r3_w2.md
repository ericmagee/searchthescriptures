# W2 regrade of pkgVP3 rev 3 (W4, Wall 3816, commit a1f56c7e): PASS (record-only TRIAL)

Base live s90. Grader W2 (claimed Wall 3818).
- Build on fetchback_live_s90.json is byte-equal to parent_s90_VP3.json (parent_w2_r3.json).
- probe_VP3: 40 OK, 0 FAIL (probe_VP3_r3_w2.txt).
- Multi-run replay: 42 node runs equal except notes, 0 agreements, 0 listings (multi_r3_w2.txt).
- My plants (w2_plant_VP3.cjs on the rev 3 parent): 12 OK, 0 FAIL (w2_plant_VP3_r3.txt). T1 and T2 (truly bare answer, KEEP, live UNCURED) are LISTED; T3 (CHANGE TO MISSES), T4 (deferral to the real layered LINK 4), T5 (layered LINK 4 in [CR4]) and T6 (deferral "in [CR4]") are not listed.
- Code read (vp3_mod.js diff from rev 2): a LINK deferral is followed in the answer's round, then in every round of the same side; a LINK no round holds is not bare; any [CRn]/[DRn] named in the answer whose round holds text is not bare. Every new branch moves toward fewer listings, never more, so it cannot add a wrong removal; the true case still lists.
- Log rows: shape unchanged from rev 2 (only the appended note text differs); my rolled-back insert of rev 2 rows (2 rows, recorded, 0 after) stands.
