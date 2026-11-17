# ASK 346: pkgLAY rev 2 (W4 build, offline, stacked on live s232 = ASK 345)

OBJECTIVE: Eric 17:50 CST 11-16: "i want UNDERTERMINED, HELD, AND BROKEN INCLUDED. That's full transparency... we need to SEE and EVERYTHING", with "Structure forces compliance". Card press "Build ASK 346" 18:03 CST 11-16.

Rebuild: `node build346.cjs target_345.json target_346.json` (target_345 = live s232, node sha 4d34d0ab23596871).
Target: node sha b5daec6dfb760005, library sha ffa1a42a865ccd88, 3502 lines. Replay: `node replay346.cjs` (needs j37719.json, r37719.json, cv37719.json read from debate_judgments, debate_results and kjv_verses), 0 fails.

Nodes changed (9): Shared Library; Commitment 13 text in Panel Build, Reserve Build, Accept Build, Accept Check, Accept Return Build, Accept Final, Accept DS Return Build, Enforcer Build. Connections unchanged. Reasoning guard: no model-setting change.

Build choices:
1. A. Commitment 13 is replaced by W3's 7228 body in all 10 copies (L2966, L3274 and the 8 nodes). The heading count stays 15.
2. B. ECW HOLD=true: an E-HOLD DISAGREE pushing to UNDERDETERMINED goes through the same CARRIED BY gate as E-COL. showHold shows the judge the row. The L3200 E-HOLD prompt asks for CARRIED BY.
3. C. LAY.scan runs in Send Back Build on each judge's text (AUDIT and EXTRACTOR lines removed). An item on a line already sent back joins that item; otherwise it is a new E-LAY item.
4. LIVE (enforced): a STANDS line with no counted [L1]; a RESULT line with no collision label or no counted [L1]; a KEYSTONE line with no label of its own link or no counted [L1].
5. TRIAL, one run, removes no seat: STANDS quoting no 6 words in a row of the answer; UNDERDETERMINED not quoting 6 words in a row from each side.
6. Exempt: engine-derived lines ("derived by the engine", "derived after the send-back", "recomputed", closing-contradiction lines) and KEYSTONE WITHDRAWN.
7. D. Cure: CHANGE TO in the required form, RETRACTED for a collision line (not for RESULT or KEYSTONE), or a KEEP whose sentence gives what was missing. An uncured LIVE item counts in drv_uncured with "[AUDIT v58: LAYERS UNCURED ...]". TRIAL items are logged UNCURED but count nowhere.
8. E. Engine-derived KEYSTONE (L1465) and RESULT (L1496) lines now end with " GROUND: <labels> | <[L1] from the lines they come from> (...; pkgLAY)". All live readers of those lines were replayed on the new form (P8).
9. F. The module is new library line 3501, read by the 6 send-back nodes after ECW.

Replay on run 37719 (final judge texts): 5 LIVE items (chatgpt RESULT and KEYSTONE, sol RESULT and KEYSTONE, luna D2 vs C5 STANDS with no [L1]). Luna's original D3 vs C2 STANDS would be a 6th. 9 TRIAL UND-SIDES items. Luna's derived lines are exempt.
