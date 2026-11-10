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

## Rev 2 (repacked on s104)

Base: s104 (pkgKRO rev 2 live). `pkgLIB/strip_KRO2` rebuilt on the s104 fetch-back equals s104 node for node, so the candidate is `pkgLIB/strip_KRO2_KSL` and the write file is `pkgKSL/parent_s104_KSL.json`. Only the Shared Library differs from s104.

Changes from rev 1:
1. A RESPONSE line ending in a colon ("COUNTED:" or "COUNTED:**") no longer joins the next line with a space; it joins with ". ", the same as a line ending in a full stop. Rev 1 joined "COUNTED: the grant is not withdrawn" into one first sentence and the strict reader refused it where live cures it (W3 FAIL, Wall 4057).
2. An unlabeled line that names another item ends the continuation: "#2", "Item 2", "point 3", "no. 2", a K-code not in the label (K-S9), or DEFENDER/CHALLENGER CRn/DRn not in the label. It stays in prose. A line naming the item's own number or code continues as before.

Size: Shared Library jsCode 605,188 bytes on s104, 606,270 with KSL rev 2, +1,082 bytes (+0.18%). Each of the 26 strip sources that carry the library grows by 1,052 bytes. No prompt text changes; no model call is added.

Checks on s104 (base `strip_KRO2`, candidate `strip_KRO2_KSL`):
- `gate_KSL_s104_rev2.txt`: 767 node runs equal, GATE PASS.
- `replay_KSL_s104_rev2.txt`: 176 stored cure replies byte-equal.
- `ksl_run_rev2.txt`: 26 labeled cases, 0 correct answers refused on any library; other-item lines not noted on KRO2+KSL, own-item refusal noted.
- `w3_plant_GOOD_rev2.txt`, `w3_plant_BAD_rev2.txt`: W3's 17 plants, 0 correct answers refused, 0 pkgKRO rev 2 rulings changed.
- `w2set_287_s104_rev2.txt`: 287 set per case, s104 vs s104+KSL.
