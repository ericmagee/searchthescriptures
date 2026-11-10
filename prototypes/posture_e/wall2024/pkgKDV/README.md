# pkgKDV (W2): a deferral to another verse's answer counts as a deferral

Assignment: coordinator 00:24Z 11-10, from W2's finding in the pkgKBG grade (Wall 3856). Standing authorization, offline. Two non-builder graders.
Base: pkgKBG (which carries pkgKVQ) on live s94. STATUS: built on pkgKBG rev 1; W1 failed rev 1 (Wall 3857) and W3 is reworking it. pkgKDV is rebuilt on the reworked pkgKBG before it goes for grade.

Gap: pkgKQG's deferral test __df knows only "under/in/at/see LINK n", "under/in/see CRn" and "answered it fully/above/below/later/there". "Matthew 17:5 is answered under Luke 9:34." and "Isaiah 8:3 is answered with Isaiah 7:14." (33798 CR3) are not deferrals, so with a bare flagged answer a KEEP quoting only them reads CURED.

Fix (__df in Send Back Record, Alt Send Back Record, R2 Alt Send Back Record; still 15 words or fewer): also a deferral is "(is|are|was|were|be|been) answered [above|below] (under|with|in|at|by|as in|as under|together with) <verse reference>" where the verse reference (optionally a range) ENDS the sentence. A sentence that states the answer after the reference ("is answered in Luke 2:49 by \"my Father's.\"", "..., where the voice names the Son.") is not a deferral.
__df is also pkgKQG's test of whether the flagged answer itself is bare, so a flagged answer that is only such a deferral now reads bare too.

Build: `node pkgKDV/build_KDV.cjs <base with pkgKBG> <out>` (refuses a base without pkgKBG, or an anchor not found exactly once). On pkgKBG rev 1: parent_s94_KDV.json, 3 nodes changed against pkgKBG and against live s94, connections and settings equal.
Proof (on pkgKBG rev 1):
- test_KDV_fn 20 OK: 8 deferral forms (bullet and bold label, range, "as under", "together with", quoted) become deferrals; 6 sentences that state the answer or exceed 15 words stay not; the existing LINK/CR forms unchanged; __df the same text in the 3 nodes.
- Stored rounds: 13 sentences in stored rounds use "answered <prep> <verse>"; only the two 33798 CR3 sentences end at the reference within 15 words.
- plant_KDV 13 OK (33798 terra Job 14:1, whole Send Back Record node): the two deferrals go CURED to UNCURED with the pkgKBG reason; the deferral plus a reasoned sentence, a reasoned sentence alone, and a reasoned sentence after "I grant it." stay CURED; another bare grant stays UNCURED; every other field equal; 34108's 27 send-back rows equal.
- replay_KDV: 42 node runs, 68 stored E-ANS KEEP rows, 0 differ.
- Rolled-back insert through record_enforcer_log of 2 rows (panel send_back UNCURED with the pkgKBG reason; CURED): accepted, rows 2; 0 remain.
Limit: a deferral phrased any other way ("for Matthew 17:5 see Luke 9:34") is not caught.
Manual part: "A sentence that only sends the reader to another verse's answer ('X is answered under Y 1:2') is a deferral."

## Rebuilt on pkgKBG rev 4 (W2 PASS 3898), live s98 — FOR GRADE
Write file: pkgKDV/parent_s98_KDV.json (`node pkgKDV/build_KDV.cjs pkgKBG/parent_s98_KBG4.json pkgKDV/parent_s98_KDV.json`). It carries pkgKBG rev 4: writing it writes KBG rev 4 too. Against KBG rev 4 only the 3 Send Back nodes change (__df and a tag); connections equal.
Proof on rev 4 (base parent_s98_KBG4.json): test_KDV_fn_s98 20 OK; plant_KDV_s98 13 OK; replay_KDV_s98 42 node runs, 68 KEEP rows, 0 differ; rolled-back insert of 2 rows (UNCURED with the pkgKBG reason; CURED) accepted, 0 remain.
Three-way stack with pkgKVL (same 3 nodes): build_KVL.cjs on parent_s98_KDV.json applies (pkgKVL plants 17 OK on it; pkgKDV plants 13 OK on the KVL-on-KDV file). Whichever is written last is built on the others.
