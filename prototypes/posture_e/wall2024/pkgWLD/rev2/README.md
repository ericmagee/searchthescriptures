# pkgWLD rev 2 (W2, 11-09): the answer reader missed a verse list with quoted words

Defect (mine, in pkgWLD, live in s71): a list item that names several verses, each followed by its quoted words, before the named verse, was not read
as an answer, so the ledger put those verses under NAMED ONLY IN OTHER TEXT. Found by the pkgWLG gate replay on 33617 (CR3, under "Answers to the
presses on LINK 4": `- **Isaiah 8:3** "I went unto the prophetess; and she conceived", **Isaiah 8:18** "for signs and for wonders", **Isaiah 7:16**, ...`).

Fix: the verses-only prefix of a list item may carry a quoted phrase after each verse, and the named verse's own opening bold. Nothing else changes.
- Build: `node pkgWLD/rev2/build_WLD2.cjs` (base fetchback_live_s71). Panel Build 40a89f70b6d7 -> ff2e550d12da; Build Independent Verdict 91fc5d4bb579 -> be652da15a9b.
- Test `test_WLD2.cjs` (test_WLD2.txt): 2 OK. Over 32 saved runs, 96 ledger entries move from ONLY IN OTHER TEXT to IN AN ANSWER, 0 move back,
  nothing else in the judge bodies changes (33617 Galatians 4:4 stays IN AN ANSWER, now cited at its CR3 answer). BIV carries the same one-line change.
- Over every saved Cure Build text: 65 lines flip from other text to answer, none the other way (all read as real answers under an Answers heading).
- WLDDS needs no change (DeepSeek reads the ledger from Panel Build's text). pkgWLG carries the same fix in its gate copy.
