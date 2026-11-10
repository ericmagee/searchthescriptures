# pkgVPD (W2): VP3 trial misses W1 noted in the VP3 rev 3 grade (Wall 3830). RECORD-ONLY

Coordinator 01:26Z 11-10. Changes only the pkgVP3 TRIAL code check (vp3Code2024) in Send Back Record, Alt Send Back Record, R2 Alt Send Back Record. No cure_status, count or removal changes.

Misses: a bare answer whose deferral names (C) a LINK no round of the side holds, (D) its own round, or (E) a round with nothing on the press was read "not bare", because rev 3 took any named round with text, and any LINK it could not find, as an answer.

Fix:
- A deferral to a LINK no round of the side holds defers to nothing; it no longer makes the answer substance.
- A deferral to a round of the same side that the check already reads (the item's round and later rounds) adds nothing; those rounds are already searched for every line naming the verse.
- A deferral to another round of the same side (an earlier one) is followed once: that round is read for the verse by the same check. It makes the answer substance only when that round answers the verse with substance. A further round deferral there is substance (one hop only).
- A deferral to the other side's round is unchanged (substance when that round holds text).
Each followed deferral is named in the TRIAL note. It can only add "bare" readings; a listing still needs the DeepSeek DISAGREE and a live UNCURED reading (VP3 rev 2 (a)).

Build: `node pkgVPD/build_VPD.cjs /mnt/project-files/wall2024/fetchback_live_s98.json pkgVPD/parent_s98_VPD.json`. Write file: 418 nodes; only the 3 Send Back Record nodes differ from live s98; connections equal.
Stacking: pkgKBG rev 5, pkgKDV rev 2 and pkgKVL rev 2 change the same 3 nodes; anchors are independent; whichever is written last is rebuilt on the others (build_VPD takes any base).

Proof:
- plant_VPD.cjs / .txt (W1's w1_plant_rev3 cases plus 9 of mine, 34108 terra Luke 1:34, base live s98): 28 OK, 0 FAIL. W1-C (LINK 9 no round holds), W1-D (its own round), W1-E ([CR4] with nothing on her question): now LISTED. W1-A, W1-B listed as before. Mine: earlier round [CR2] answering with a layer: not listed; [CR2] never naming the verse, or only a bare grant: listed; [CR2] deferring again: not listed; the challenger's round [DR3]: not listed; [CR4] answering with a layer: not listed; the stored LINK 4 with layers: not listed; grant only: listed; LINK 9 plus a layered LINK 4: not listed. cure_status unchanged in every case.
- probe_VP3_on_VPD.txt: W4's probe_VP3 on VPD, 40 OK.
- probe_VP3_multi_on_VPD.txt: 42 stored node runs, rows equal except notes, 0 agreements, 0 listings.
