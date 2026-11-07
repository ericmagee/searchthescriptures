# pkgPMR (B5): the book named in the prose beside a bare reference

Cause (33175 CHALLENGER R3): `"the house and lineage of David" that Luke gives to Joseph (2:4)`.
lastBook carried 2 Samuel from `(2 Samuel 7:12)`, so the quote was checked against 2 Samuel 2:4
and stored WORDING DIFFERS. Luke 2:4 KJV holds the words.

Fix
- Citation Scan (3b45f2cf -> b6993559): a bare chapter:verse (no book in the match) whose clause
  names another book in plain words (not followed by its own chapter:verse; John, James, Jude, Mark,
  Timothy, Titus, Philemon skipped as person names) gets `alt` = that book. Quote Compare already
  tries `alt` only when the first reference fails, and sets rebound_from.
- Build Save Body (e1bc41bb -> 15819950): a citation_check row that is not MATCHES stores
  `quote` (300 chars) and `alt` ref, so a grader can see what was compared.

Evidence
- test_PMR.cjs: 12 OK, 0 FAIL. C2-C5 assert patched equals base on texts where no alt is due.
- scan_PMR.cjs over 2818 stored items: exactly one change, 33175 CHALLENGER R3 2 Samuel 2:4 -> alt Luke 2:4.

Write: two nodes, base live s12 (d5375c6e). Revert = put the base files back.
