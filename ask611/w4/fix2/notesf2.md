# ASK 611 fix 2 (W4): the send-back and the late gate get the QR judges' requests again

Defect (run 42373, W3 Wall 11776, W1 Wall 11779; cause W4 Wall 11778): 53 of 58 panel send-backs (sol 28, sol62 14, spark 11) read "NOT SENT: no panel request for this seat".
Cause: ASK 611 made QR Merge put out the judges without body. build611.cjs replaced the reading text {judges:__m.judges,qa588:__m.qa_text} with the rebuilding form on LIB lines and two nodes only. The same text stands as an inline string in two MAP entries, Send Back Build and Late Gate Build, which were not changed. When the question round runs, they find no body. MISTAKE (W4, the 611 build); T1 compared panel send bodies only.

Base: live engine 3afa1c1f, child cd97165c (fetch-back of the ASK 579 write, 17:43 CST 11-24).
Change (buildf2.cjs 1928eb51): in each Shared Library (engine and child alike), the one snippet in each of the two MAP inline strings becomes the rebuilding form, copied from live LIB 620 (885 characters), with n recomputed. LIB unchanged (sha a3c1e42f5b0ebda6). No other node changes.
Targets: target_engine_f2.json 54ea737d, target_child_f2.json 755e6aed. Map sha fc5d86b4b1fece61.

Tests (tf2.cjs 246298e7, out_tf2.txt ac4a2b47): ALL PASS (18 checks).
- Only the Shared Library changes, LIB unchanged, only the two MAP entries change; each new text equals the old with the one snippet replaced; n matches.
- No MAP entry, LIB line or node holds an unrebuilt read of QR Merge judges any more (scan; the base had exactly these 2).
- Behaviour, each of the two: with bodyless QR judges the fixed text gives each judge the same request as before ASK 611 (Panel Build body + question-round text by QR Merge's own qrAdd), byte-equal; control: the live text gives no body (42373 reproduced); QR not run: Panel Build judges as today.
- Standing 31 PASS 0 FAIL (S4 290/290, 67/67); pair Library Check PASSES; ASK 579 C6 9 of 9 on the target; rebuild byte-equal.
Not read: the late gate's rows in 42373.

Write: writef2.sh 360b2748 (run gate; rebuild equals target; tf2; live Shared Library equals base; revert copies; standing and pair on the PUT bodies; PUT engine then child; fetch-back checks). Revert: revert_*_f2.json, Shared Library node only.
Proof: a live run in which QR runs and the panel enforcer sends back: rows answered, no "no panel request" row.
