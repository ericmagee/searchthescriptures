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
- Rolled-back insert (rollback_VPD.sql, tag W2-ROLLBACK-TEST-VPD, one listed and one not-listed E-ANS row; prompt_sent and full_reply null): accepted, {"rows": 2, "recorded": true}; 0 rows remain.

## Rev 2 (W2, 2026-11-10; W3 FAIL 3919: a named round that answers the verse without the exact reference was read as holding no answer)

Fix (build_VPD2.cjs; the rev 1 changes stand): before a named round of the same side (its own, a later or an earlier round) is read as holding no answer, the verse is looked for there by other marks, through a new vp3Other2024: the reference written another way ("1:34", "Luke 1, verse 34", "verse 34", "v. 34"), or a run of three words of the verse's KJV text as the run serves it (Cited Verses), not all common words. Press lines (" -- MEANS:") and the answer's own lines are skipped. Each line found goes through the same bare check; one that is not bare makes the answer substance ("answers Luke 1:34 without its exact reference (line n: ...)").
The item's quoted words are not used as marks: its ANSWER quote is the bare grant itself, and in a first try it matched every "I grant the ..." line of the round.

Build: `node pkgVPD/build_VPD2.cjs /mnt/project-files/wall2024/fetchback_live_s98.json pkgVPD/parent_s98_VPD2.json` (write file; only the 3 Send Back Record nodes differ from live s98). Stacked on pkgKVL rev 2 for the write order: parent_s98_VPD2_on_KVL2.json.

Proof:
- plant_VPD2.cjs / .txt: 32 OK, 0 FAIL. W1-D, W1-E, W2-G and W2-H now plant rounds with nothing on her question by any mark (lines with "know not a man", "How shall this be", "1:34" or "verse 34" taken out): listed. Added W1-D2 and W1-E2: the rounds as stored keep layered lines on her question by its words ("grounded on \"I know not a man,\"", "For Mary it is \"seeing I know not ...\""), so not listed. That is the point of W3's finding: W1's D and E as first planted were not truly bare.
- W3's plants on rev 2 (w3_grade/w3_plant_VPD_on_rev2.cjs / .txt): 15 OK, 1 FAIL. G1 and G2 now not listed. The one FAIL is G6, which W3 listed as a miss in the safe direction (a round that names the verse only in the challenger's quoted press), not a fault; rev 2 still does not list it.
- probe_VP3_on_VPD2: 40 OK. probe_VP3_multi_on_VPD2: 42 stored runs, rows equal except notes, 0 agreements, 0 listings.
- Rolled-back insert (rollback_VPD2.sql, tag W2-ROLLBACK-TEST-VPD2, one listed and one rev 2 not-listed row): accepted, {"rows": 2, "recorded": true}; 0 rows remain.
Limits: a three-word run of the verse's KJV text in a line about something else makes that line count as an answer (safe direction: not listed). A paraphrase of the verse with no three KJV words in a row and no reference is not found (a listing could still happen; the live cure reading must also be UNCURED).
