# pkgKSL on live s103 (W2; coordinator 05:11Z 11-10). NOT FOR WRITE: ready for ASK 2 (pkgFUN rev 8 or pkgKRO depends on it).

What it does: the K-S3 COUNTED reader is given the RESPONSE line plus up to 3 unlabeled prose lines written right under it (cureLines keeps
them as `cont`; any labeled line ends the run). The reader of the base decides what those lines mean. Shared Library only.

Build (base = live s103 library; pkgLIB/strip_KCB_base packs and rebuilds to a file with 0 nodes differing from fetchback_live_s103.json):
  node pkgKSL/build_KSL.cjs pkgLIB/strip_KCB_base pkgLIB/strip_s103_KSL                 (30 files, 26 changed)
  FB=/mnt/project-files/wall2024/fetchback_live_s103.json node gate/pack.cjs pkgLIB/strip_s103_KSL pkgLIB_s103_KSL
  node pkgFUK/parent_on.cjs /mnt/project-files/wall2024/fetchback_live_s103.json pkgLIB_s103_KSL pkgLIB/strip_s103_KSL pkgKSL/parent_s103_KSL.json
Write file parent_s103_KSL.json: against s103 only the Shared Library differs; connections equal.

Checks on s103
- Gate (gate_KSL_s103.txt): 767 node runs byte-equal or same error, target item changes 0, near-miss 17, GATE PASS.
- Stored cure replies (replay_KSL_s103.txt): 176 of 176 byte-equal.
- My 287 (w2set_287_s103.txt): 0 of 287 readings differ from live (the live reader reads only the first sentence, so the added lines change
  no ruling on s103 alone; 19 correct refused and 66 refusals cured, as live).
- ksl_cases (18, ksl_run_s103.txt): equal to live for the same reason.
- Stacked on pkgKRO rev 2 (strip_KRO2_KSL, ksl_run_KRO2.txt): the lines reach the reader: two next-line refusals now carry KRO's
  record-only note ("COUNTED. The defender granted it.\nIt should not be counted.", "COUNTED.\nThe grant is in round 3.\nI do not count it
  after all."); rulings unchanged (record-only). Which next-line refusals are noted or enforced depends on the reader stacked on it.
Stacking: anchors lie outside pkgFUN's and pkgKRO's changes (built on FUN4 at s100 and on KRO2 here without edits).
