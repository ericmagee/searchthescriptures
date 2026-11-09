# pkgWLD rev 2 (W2, 11-09): the answer reader missed a verse list with quoted words

Defect (mine, in pkgWLD, live in s71): a list item that names several verses, each followed by its quoted words, before the named verse, was not read
as an answer, so the ledger put those verses under NAMED ONLY IN OTHER TEXT. Found by the pkgWLG gate replay on 33617 (CR3, under "Answers to the
presses on LINK 4": `- **Isaiah 8:3** "I went unto the prophetess; and she conceived", **Isaiah 8:18** "for signs and for wonders", **Isaiah 7:16**, ...`).

Second miss of the same kind (found when the gate replay rerun showed 33083 Haggai 2:23): answer headings worded "Presses answered", "Pressed witnesses, answered",
"The presses answered", "Witnesses pressed, answered" or with a lettered prefix ("## B. Answers to the presses") were not read as answer headings.

Fix: (1) the verses-only prefix of a list item may carry a quoted phrase after each verse, and the named verse's own opening bold; (2) the answer
heading also matches "press(es|ed)/witness(es) ... answered" and an optional one- or two-character lettered or numbered prefix. Nothing else changes.
- Build: `node pkgWLD/rev2/build_WLD2.cjs` (base fetchback_live_s71). Panel Build 40a89f70b6d7 -> f15576b63f9c; Build Independent Verdict 91fc5d4bb579 -> dc38974175ad.
- Test `test_WLD2.cjs` (test_WLD2.txt): 2 OK. Over 32 saved runs, 300 ledger entries move from ONLY IN OTHER TEXT to IN AN ANSWER, 0 move back,
  nothing else in the judge bodies changes (33617 Galatians 4:4 stays IN AN ANSWER, now cited at its CR3 answer). BIV carries the same change.
- Over every saved Cure Build text: fix (1) flips 65 lines, fix (2) 127 more, all from other text to answer, none the other way; headings that newly count:
  Witnesses pressed, answered (41 lines), Pressed witnesses, answered (35), Presses answered (33), The pressed witnesses, each answered (10),
  The presses answered (4), ## B. The presses answered by the fit (1); 3 lines sat under a list item that itself says "answered" (read by eye: real answers).
- WLDDS needs no change (DeepSeek reads the ledger from Panel Build's text). pkgWLG carries the same fix in its gate copy.
