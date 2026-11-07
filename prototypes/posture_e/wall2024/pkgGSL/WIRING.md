# pkgGSL: superseded gate changes on one line cure NOT APPLIED items (run 33222 grok)

Gap: grok (first live alternate, in gemini's place) was unseated by 3 uncured E-GATE items, G1 to G3 NOT APPLIED (E-APPLY S35 to S37).
All four of its gate items (G1 to G4) flagged the same CONCEDED LINKS line. It answered each with a CHANGE TO for that line, and the
changes kept the item scope (premises 3 to 6 counted; 1 and 2 spared). E-APPLY wrote the last change (G4), so G4 was CURED. G1 to G3 were
superseded, not refused. But the NOT APPLIED branch of gateCure2024 cures only on KEEP, its own change applied, or its own text already in
the corrected text. Their wording differed from G4's, so all three counted in drv_uncured. pkgKY (b), "the last change wins", covers this
for other item kinds, but its branch sits after the NOT APPLIED branch.

Fix (gateCure2024, the 6 gate-library nodes; base live s16 7efcffc7): a NOT APPLIED item whose CHANGE was superseded by a later applied gate
change of the same judge on the same line (supBy) is CURED, with the reason naming that change. The pkgGL new-LIVE-K check still runs after.

Shas: Gate Build b898aba7 -> a25cb2ea; Gate Record 07f1c6cd -> c1c69125; Alt Gate Build 6be6444f -> ed2a1141; Alt Gate Record 9b8a2051 -> 9f3752b2;
Alternate Merge Seat 81e5346a -> 53579cf5; Alternate Merge 34fdeb5c -> 8044cd3f.

Tests (test_GSL.txt, 7 OK) on the real nodes with the saved 33222 and 33218 inputs:
- base reproduces the live result (grok G1-G3 UNCURED, G4 CURED);
- patched: G1-G4 CURED, grok drv_uncured 3 to 0, alt_needed true to false, nothing else changes;
- Alternate Merge on the patched gate seats grok (panel_effective chatgpt, grok, sol; all three HELD, so 3-0 HELD where the run counted 2-0);
- main-chain Gate Record on 33222 and 33218 is byte-equal.
Not replayed: older runs (no saved gate inputs). The stored log has 3 other seats that mix CURED and UNCURED NOT APPLIED items (33006 grok,
33040 grok, 33160 gemini). Their UNCURED ones are mostly "NEW NOT APPLIED" (the gate change itself refused), which this package does not touch.
Revert: base/*.js.
