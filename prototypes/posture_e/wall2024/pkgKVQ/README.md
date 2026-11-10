# pkgKVQ (W1): a KEEP that quotes only a verse the side quoted is not cured

Assignment: coordinator 23:57Z 11-09, from W3's note on Wall 3820. Standing authorization, offline. Graders W2 and W3.
Base: pkgKQG rev 2 parent (pkgKQG/parent_s90_KQG2.json, on live s90). STACKS ON pkgKQG rev 2 (same three nodes); if KQG rev 2 changes, KVQ is rebuilt on it.

Gap: enf428Cure (E-ANS send-back cure reader, record-only, ruling 428) reads a KEEP CURED when its reason holds six words in a row from the answering side's rounds. Six words of scripture the side quoted (33798: "of few days, and full of trouble", Job 14:1) pass, though a quoted verse is not the side's answer.

Fix (Send Back Record, Alt Send Back Record, R2 Alt Send Back Record; the E-ANS KEEP line only): each round is also searched with its verse quotations cut out. On a line that names a verse (Book c:v), each span in quotation marks ("..." or “...”, paired in order) of six words or more is cut. A window found only in such a span, or running into it, does not count; the reason is "KEEP whose reason quotes only scripture the answering side quoted (...), not the side's own answer (pkgKVQ)". Shorter quotes inside the side's own sentence (such as "my Father") are kept, so the side's sentence around them still counts. pkgKQG rev 2's bare-answer cut is unchanged.

Build: `node pkgKVQ/build_KVQ.cjs` -> parent_s90_KVQ.json (3 nodes changed, connections unchanged).
Proof:
- probe_KVQ.cjs 13 OK: W3's case UNCURED (KQG2 CURED); a verse quote followed by the side's own CR2 answer CURED; the CR2 fuller answer CURED; KQG2's straddle and bare-grant cases stay UNCURED; no-quote KEEP UNCURED; 34108 terra KEEP row byte-equal.
- replay_KVQ.cjs: 42 node runs, 68 stored KEEP rows, 0 status changes (1 row differs only in the quoted words). Two earlier forms of the cut were refused by this replay: cutting quotes of 6 characters turned 4 real answers UNCURED, and unpaired quote matching cut the defender's own sentence (33592).
- Rolled-back insert through record_enforcer_log of two rows (panel UNCURED with the new reason, panel CURED): accepted, rows 2.
Limit: a verse quoted with no reference on its line, or without quotation marks, is not cut.
Manual part: "A send-back KEEP is read as cured only by six words in a row from the answering side's own words: the flagged bare answer and any verse of six words or more that the side quoted on a verse line do not count."
