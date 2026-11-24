# W1 grade: section 0 pairs draft 1 (manual1123/w3/s0b/s0b_pairs_draft1.json b9bf60d1, W3 commit c9a7da43; Wall 11261)

GRADE: PASS.
RULES READ: engine manual section 0 (part 00.1 v243; no provenance in the body); scope rule; ruling 506; STAMP rule (Central time only).
OBJECTIVE MET: yes. Pair 1 puts the card press time in Central time; pair 2 names the guard that audits part inserts and the fields it writes.

Checks (run by W1 at 21:3x CST 2026-11-23):
1. File: md5 b9bf60d1 in the commit and on the mount.
2. Preview: base part 00.1 v243 8717b03f (the latest). Counts [1,1]. Result md5 5bc72deb04ef4c43fba112bdd1c6380d, length 3,185, equal to W3's claim.
3. Pair 2 against the live engine_manual_parts_guard: its audit note writes part, version, order_index, hash (left(md5,12)), len, card, session and from=v<prior version of the same part> hash=<12>. The new text names each of these and nothing else.
4. Live audit rows 40987 and 40988 (the ASK 584 part writes) carry card "... 21:29 CST W3 thread": the Central form pair 1 states is already the form in use.
5. No function parses truth.card. The three guards (engine_manual, operational_doc, engine_manual_parts) store it as text, at most 200 characters. Pair 1 changes no behavior.
6. Search of every part's latest row for engine_manual_guard and truth.card: part 00.1 only. Nothing else names the old guard.
7. The new text carries no history. "since ASK 477" leaves the body; "(ASK 477)" stays as a reference.

Note (not a condition):
N1. For a part's first version the guard writes from=none. The text gives only the from=v<...> form. That is acceptable, because every part has a version 242 row, so no part insert now writes from=none.
