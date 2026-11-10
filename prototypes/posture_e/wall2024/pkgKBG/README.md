# pkgKBG (W3): a KEEP that quotes only another bare grant of the side is not cured

Assignment: coordinator 00:15Z 11-10 (next unbuilt enforcer item; my open note on Wall 3831 and 3850). Standing authorization, offline. Two non-builder graders.
Base: live s94 with pkgKVQ built on it (base_s94_KVQ.json = `node pkgKVQ/build_KVQ.cjs <s94 fetch-back>`). STACKS ON pkgKVQ (same three nodes). If pkgKVQ changes, pkgKBG is rebuilt on it.

Gap: enf428Cure (the E-ANS send-back cure reader; record-only, ruling 428). When the flagged answer is a bare grant or deferral, a KEEP reads CURED on six words in a row of the answering side's rounds outside that answer. Six words of another bare grant of the same side pass. Run 33798, terra, the Job 14:1 item (flagged answer "I grant it is said of all men."): a KEEP quoting "I grant it is said of Joseph." (the side's Luke 2:4 grant) or "I grant it is a class phrase said of men with fathers." reads CURED. A second bare grant is not a fuller answer.

Fix (the E-ANS KEEP line only; Send Back Record, Alt Send Back Record, R2 Alt Send Back Record): when the flagged answer is bare, each round is also searched with its bare sentences cut out. A sentence is bare by pkgKQG's own test: a grant with no so/because/for/but/yet/therefore/thus/hence/since after it, or a deferral of 15 words or fewer. A window found only in such a sentence, or running into one, does not count; the reason is "KEEP whose reason quotes only another bare grant or deferral of the answering side (...), not a fuller answer (pkgKBG)". When the flagged answer is not bare, nothing changes. pkgKQG rev 2 and pkgKVQ are unchanged.

Build: `node pkgKBG/build_KBG.cjs pkgKBG/base_s94_KVQ.json pkgKBG/parent_s94_KBG.json` (418 nodes, 3 changed, connections unchanged). The build refuses a base without pkgKVQ and any anchor not found exactly once.

Proof:
- probe_KBG.cjs 18 OK (33798, whole Send Back Record node): two other bare grants, the same without quote marks, a straddle from a bare grant into the next sentence, and a planted deferral all go CURED to UNCURED; the side's reasoned sentence, the CR2 fuller answer, and a bare grant followed by a fuller answer stay CURED; the pkgKQG and pkgKVQ cases keep their reasons; only the Job 14:1 row of 60 differs; with a flagged answer that is not bare the reading is as before; enf428Cure is the same text in the 3 nodes and the nodes equal the base outside it.
- replay_KBG.cjs: 42 node runs, 68 stored E-ANS KEEP rows, 0 rows differ from the base (16 run and node pairs have no stored input, as in pkgKVQ's replay).
- W4's pkgVP3 probe on the stacked file: 40 OK; multi-run: 0 would remove.
- Rolled-back insert through record_enforcer_log of two send_back rows (panel UNCURED with the pkgKBG reason, panel CURED): accepted, rows 2.

Limits:
- When a KEEP quotes the flagged grant and another bare grant, the reason printed is pkgKQG's (its window comes first); the status is UNCURED either way.
- The code cannot tell whether a reasoned sentence of the side answers this witness or another one; such a KEEP still reads CURED.
- Record-only: no verdict changes.

Manual part: "With a bare flagged answer, a send-back KEEP is read as cured only by six words in a row of the answering side outside every bare grant or deferral sentence of that side."
