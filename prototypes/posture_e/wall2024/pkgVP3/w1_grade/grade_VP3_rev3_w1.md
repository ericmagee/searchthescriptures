# W1 regrade of pkgVP3 rev 3 (Wall 3816, commit a1f56c7e): PASS for the record-only TRIAL

Reproduced: probe_VP3 40 OK, 0 FAIL. w1_plant_rev2.cjs on the rev 3 parent: 10 OK (true case listed, controls not listed).
Code read (vp3_mod_rev2.js against vp3_mod.js): both rev 3 branches return ok:false (not bare), so they can only remove a listing, never add one.

New plants, w1_plant_rev3.cjs (run 34108, terra, Luke 1:34 [CR3], whole Send Back Record node): 10 OK, 0 FAIL.
- W1-A TRUE: deferral to LINK 4, LINK 4 short (no layers, under 25 words) and only in [CR4]: LISTED. The new cross-round search keeps a true case.
- W1-B control (W2 T2 shape, short LINK 4 in [CR3]): LISTED.
- W1-C deferral to LINK 9, held by no round: not listed (as built).
- W1-D deferral to its own round "[CR3]": not listed.
- W1-E deferral "in [CR4]" where [CR4] holds text but nothing on her question: not listed.
cure_status unchanged by the package in all five.

NOTES (not a FAIL; trial is record-only and these only miss listings):
- W1-D and W1-E are true bare answers that rev 3 does not list: any named round that holds any text makes the answer "not bare", including the answer's own round and a round with nothing on the press. If VP3 is promoted, the round branch should look in the named round for a layered answer to the press, as the LINK branch does with its block.
- W1-C: a LINK no round holds is read as not bare; a deferral to nothing is arguably bare. Same direction (miss, not wrongful removal).
