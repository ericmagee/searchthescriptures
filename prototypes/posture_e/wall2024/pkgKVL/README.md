# pkgKVL (W2): verse words quoted on a line with no reference are scripture too

Assignment: coordinator 00:57Z 11-10 (W2 named it as the next unbuilt gap: pkgKVQ's stated limit, seen by W3 on stored text, Wall 3850). Standing authorization, offline. Record-only (enf428Cure, ruling 428). Two non-builder graders.
Base: live s98 (pkgKVQ live since s95). Nodes: Send Back Record, Alt Send Back Record, R2 Alt Send Back Record.
STACKING WITH pkgKBG: pkgKBG changes the same three nodes. pkgKVL's only anchor is pkgKVQ's __vq definition, which every pkgKBG revision keeps unchanged, so build_KVL.cjs runs on either base. Whichever of the two is written second is built on the first: build_KVL.cjs on the KBG write file (tested on pkgKBG rev 3: plants 17 OK), or KBG's build on parent_s98_KVL.json.

Gap: pkgKVQ cuts a quoted verse of 6 words or more only on a line that names a verse reference. 33798 CR4 line 136 '- [L1] "made of the seed of David according to the flesh."' has no reference, so a send-back KEEP quoting only that verse reads CURED (W2's plant W2-2 in the pkgKVQ grade; W3 3850).

Fix (__vq): on a line with no verse reference, a quoted span of 6 words or more is cut when its words stand inside a verse quotation of 6 words or more that some round of the debate (either side) gives right next to its reference: after it ('Romans 1:3: "..."', '**[L1] Romans 1:3:** "..."', 'Romans 1:3-4: "..."') or before it in parentheses ('"..." (Romans 1:3)'). A quoted debater sentence that merely stands on a reference line is not used as verse text. A quoted span that adds words of its own is not cut.
The reason text is pkgKVQ's ("... quotes only scripture the answering side quoted ...").

Build: `node pkgKVL/build_KVL.cjs <base with pkgKVQ> <out>`; `node pkgKVL/build_KVL.cjs /mnt/project-files/wall2024/fetchback_live_s98.json pkgKVL/parent_s98_KVL.json` (418 nodes, 3 changed, connections unchanged). Refuses a base without pkgKVQ, a base that has pkgKVL, or an anchor not found exactly once.
Proof:
- plant_KVL 17 OK (33798 terra, Job 14:1, whole Send Back Record node; base live s98): the stored CR4 Romans 1:3 words go CURED to UNCURED (pkgKVQ reason); a verse quoted with a reference only by the other side and quoted with none by this side goes UNCURED; the side's own sentence, an own claim in quotes, a verse plus own words in one span, and a 5-word fragment stay CURED; the pkgKVQ Job 14:1 case and the CR2 fuller answer keep their readings; every other field equal; 34108's 27 send-back rows equal. Same 17 OK with base pkgKBG rev 3 and pkgKVL built on it (plant_KVL_on_KBG3.txt).
- replay_KVL: 42 node runs, 68 stored E-ANS KEEP rows, 0 differ.
- scan_KVL (reach): in 41 stored runs, 336 quoted spans of 6+ words on lines with no reference now count as verse text; 1,654 do not. Read: all hits checked by a word filter (defender, challenger, I grant/claim/rest/drop/keep/hold, link, D1-D9, premise, keystone, biological): none; a random 25 are all KJV text.
- Rolled-back insert through record_enforcer_log of 2 rows (panel send_back UNCURED with the pkgKVQ reason; CURED): accepted, 0 remain. Row shape and reason text are pkgKVQ's.
Limits: verse words with no quotation marks are not cut; a verse quoted nowhere next to its reference is not known as verse.
Manual part: "A quoted span of six words or more that stands inside a verse quotation the debate gives next to its reference counts as scripture wherever it is quoted, not as the side's own words."
