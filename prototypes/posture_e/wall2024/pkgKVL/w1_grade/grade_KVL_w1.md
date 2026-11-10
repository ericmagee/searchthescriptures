# W1 grade of pkgKVL (W2, commit ddcd7ae9)

Verdict: FAIL, one narrow fix (the verse-text pairing). Record-only; no stored row changes.

Reproduced: build_KVL.cjs on fetchback_live_s98.json equals parent_s98_KVL.json; replay_KVL 42 node runs, 68 stored E-ANS KEEP rows, 0 differ.
Rolled-back insert of 2 rows (panel send_back UNCURED, pkgKVQ reason): accepted, rows 2, recorded true.

Plants (w1_plant_KVL.cjs / .txt; 33798 terra Job 14:1; planted verse 1 Samuel 1:20, not in the rounds):
- Four formatted no-reference forms (bullet with layer tag, bold quoted line, block quote, numbered with curly quotes): all UNCURED with the pkgKVQ reason. Right.
- Source forms read: "1 Samuel 1:20: ...", "- **1 Samuel 1:20** ...", "... (1 Samuel 1:20)". Right.
- Source forms NOT read (miss, not a wrongful reading): "> 1 Samuel 1:20 — ...", "1 Samuel 1:20 (KJV): ...", "1 Samuel 1:20 says, ...", "1 Samuel 1:20 reads ...". Stored: 456 source lines of 6+ words in the dash, (KJV), says or reads forms.
- Ordinary-phrase fragment "when the time was come about after" (6 words, all verse): UNCURED; it is verse words, so right.
- Verse plus own words in one span, own 6-word claim sharing words out of order, verse words with no source anywhere: CURED. Right.
- 5-word fragment: base and KVL both UNCURED (the KEEP quotes fewer than 6 words); no change, my plant's expectation was wrong.
- P1: a debater's own sentence quoted right after a verse label ("- **Luke 1:34:** \"I hold her question shows she knew no man then.\"") and repeated with no label: KVL reads UNCURED (base CURED). Wrong; the README says such a sentence is not used as verse text, the code uses it.

FAULT (w1_scan_KVL.cjs / .txt): the verse-text regex does not pair quotation marks. A reference that ends inside a quotation, followed by the closing mark, takes the closing mark as an opening one and records the debater's text up to the next mark as verse. Stored example 33815 DR4:
  [CR4] "I grant that patēr names a father in Luke 1:62." -- SUPPORTS: C4. Luke 1:62 reads "they made signs to his father"
  records ' -- SUPPORTS: C4. Luke 1:62 reads ' as verse and misses the real verse after it. 13 of 18,495 recorded entries in 41 runs hold debate words of this kind. No stored row changes because of them, but they are wrong entries.

FIX: pair the quotations of each line first (the paired matcher pkgKVQ uses), then take a paired span as verse text when a reference stands right before it (allowing ":", ",", a dash, "(KJV)", "says", "reads") or in parentheses right after it; skip a span that opens with "I grant / hold / keep / accept / concede / claim".
