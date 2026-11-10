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

## Rev 2 (W2, 2026-11-10; W1 FAIL 3892, W3 FAIL: a debater's quoted claim beside a reference was taken as verse text)

Fix (W3's way (a)): verse text now comes only from the run's own KJV rows (the "Cited Verses" node, which Send Back Record already reads), never from what a debater writes.
On a line with no verse reference, a quoted span of 6 words or more is cut when its words stand, in order and whole, in the KJV text of a verse the run serves. Lines with a verse reference are pkgKVQ's and unchanged. Rev 1's verse-quotation regex (__VA) and its pairing fault are gone.
Built on pkgKDV rev 2 (which carries pkgKBG rev 5): `node pkgKVL/build_KVL2.cjs pkgKDV/parent_s98_KDV2.json pkgKVL/parent_s98_KVL2.json`. Write file parent_s98_KVL2.json: 418 nodes; only the 3 Send Back Record nodes differ from parent_s98_KDV2.json; connections equal.

Proof:
- plant_KVL2.cjs / .txt (33798 terra Job 14:1, base KDV2 against KVL2): 29 OK, 0 FAIL. KJV words on a no-reference line in five markup forms and with commas read UNCURED; W3's A2 and A3 and W1's P1 (a debater's quoted claim beside a reference, repeated with none) stay CURED; verse plus own words, out-of-order words, W1's scan form stay CURED; a verse the run does not serve, and no Cited Verses at all, stay CURED (limit); every other row field equal; 34108 stored rows equal.
- W1's and W3's rev 1 plants on rev 2 (w1_grade/w1_plant_KVL_on_KVL2.txt, w3_grade/w3_plant_KVL_on_KVL2.txt): the planted verses 1 Samuel 1:20 and Luke 2:1 are not cited in 33798, so rev 2 does not cut them (limit). Rerun with those two verses served (serve_planted.cjs preload, KJV text from kjv_verses; files *_on_KVL2_served.txt): W3 7 of 7 as wanted; W1 14 of 16. W1's O3 (5-word fragment) was W1's own wrong expectation in the rev 1 grade. W1's O5 ("verse words with no reference in any round", wanted CURED) reads UNCURED once the verse is served: the words are KJV text, so the KEEP quotes only scripture. In a real run a verse no round cites is not served, so O5 reads CURED there.
- replay_KVL2.cjs / .txt: 42 stored runs, 68 KEEP rows, 0 differ. Every stored run with a send-back call has a stored Cited Verses output.
- Rolled-back insert (rollback_KVL2.sql, tag W2-ROLLBACK-TEST-KVL2, one UNCURED and one CURED row): accepted, {"rows": 2, "recorded": true}; 0 rows remain.
Limits (safe direction, stays CURED as on live): KJV words of a verse the run does not serve; a quotation that crosses two verses; unquoted verse words; a quotation whose wording differs from the KJV text.
