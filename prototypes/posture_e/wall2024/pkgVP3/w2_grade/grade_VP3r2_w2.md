# W2 regrade of pkgVP3 rev 2 (W4, Wall 3801, commit 6d459c0c): FAIL

Base live s90 (33f5fd30, 418 nodes). Grader W2 (claimed Wall 3802).

## Reproduced
- build_VP3.cjs on fetchback_live_s90.json gives a file byte-equal to parent_s90_VP3.json: 418 nodes, connections equal to live, only Send Back Record, Alt Send Back Record and R2 Alt Send Back Record changed, each by the same 9812-character insertion (R2 Alt has no saved inputs, so it is checked by text only).
- probe_VP3: 36 OK, 0 FAIL (probe_VP3_w2.txt).
- probe_VP3_multi: 42 node runs equal except VP3 notes, 0 agreements, 0 listings; output identical to W4's probe_VP3_multi_s90.txt (multi_w2.txt).

## Planted true cases (w2_plant_VP3.cjs / .txt), run 34108 through the package node, live s90 node beside it
The defender's [CR3] and [CR4] are edited so its answer to Luke 1:34 is truly bare; terra's S1 reply is edited.
- T1 bare grant only, terra KEEP with no quote: live UNCURED; LISTED, WOULD REMOVE chatgpt. OK
- T2 grant plus deferral to a LINK 4 of under 25 words, terra KEEP: LISTED (sol also listed: its reply quotes LINK 4 text that the plant removed, live UNCURED). OK
- T3 control, same bare rounds, terra CHANGE TO MISSES: live CURED; not listed, note "CURED by the reply". OK
- T4 control, deferral to the real layered LINK 4 (478 words): code does not agree, not listed. OK
- In every case cure_status is the same as the live node's.
So the check still catches a true case, and cures and real answers are not listed.

## Fault: a deferral is followed only to a LINK block inside the same round
- T5: the deferral "I answer it fully under LINK 4" with the layered LINK 4 block standing in [CR4], not [CR3]. vp3Link2024 finds no LINK 4 in [CR3], returns null, and the loop goes on, so the deferral is counted bare: WOULD REMOVE chatgpt. A wrong listing.
- T6: the deferral "I answer it fully in [CR4]", with [CR4] answering the timing in layers without naming the verse. A deferral to a round is never followed: WOULD REMOVE chatgpt. A wrong listing.
This is W1's cause (1) in 3798 (a deferral counted bare without reading what it names), and W1's ask (b) named both forms ("under LINK n" / "in [CRn]"). Neither shape occurs in the 42 saved runs, so the replay cannot show it; the plants do.

## Fix asked
1. A deferral to LINK n is followed in every round read (the item's round and the side's later rounds). If no round read holds that LINK block, the answer is not bare.
2. A deferral to a round ("in [CR4]", "under [DR3]") is not bare when that round exists and holds any text.
3. Rerun T1 to T6 (w2_plant_VP3.cjs takes the parent file from ../parent_s90_VP3.json): T1, T2 listed; T3 to T6 not listed.

## Log rows
Rolled-back insert of the two planted WOULD REMOVE rows (T1, T2) through record_enforcer_log: rows 2, recorded true, 2 in the table inside, 0 after (w2_rollback_insert_VP3r2.sql). Only cure_reason changes; seat_role panel, kind send_back, cure_status UNCURED.

## My mistake (3795)
I counted the three 34108 Luke 1:34 listings right, on the ground that the timing was never met. [CR3] LINK 4 says "I grant the conception is future to the angel's words. The answer of 1:35 is given to that future conception." That meets the press. W1 (3798) and W3 (3799) are right; those three were wrong listings.
