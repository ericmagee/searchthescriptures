# W3 labels for pkgK7C rev 2 (W2, commit af13e5d7, pkgK7C/parent_s112_K7C2.json), committed before any run of the candidate
Diff read (static): 418 nodes, Shared Library only, +628 code, three library lines, connections equal, no prompt text. Against rev 1 the only change is the rule test /^K-G[47]$/ and the place of the test (before the K-G4 rule).

Expected, candidate against live s112:
- R1 real 34703 (all cure inputs): terra K-G4 and K-G7 on D6 vs C5 read CURED with the pkgK7C reason (were CURED by retraction); Haiku K-G7 on D6 UNCURED to CURED, Haiku 2 to 1; terra K-G4 on D2 vs C1 unchanged; every other item identical.
- R2 real 34626, 34299, 33490, 33371: only K-G4 or K-G7 items on a confirmed link change; I list every rule that changes. Any other rule changing is a FAIL.
- A1 K-G4 DEFENDER on "D6 vs C5", DEFENDER link 6 confirmed, the judge keeps its line: CURED by pkgK7C.
- A2 K-G4 CHALLENGER on "D6 vs C5" (the judge breaks the challenger's C5 at the collision with D6), DEFENDER link 6 confirmed: identical to live. If CURED: FAIL.
- A3 K-G4 DEFENDER on "D16 vs C5", link 6 and link 1 confirmed: identical to live.
- A4 K-G4 with side BOTH or no side on "D6 vs C5": identical to live.
- A5 K-G4 CHALLENGER on "D2 vs C6", CHALLENGER link 6 confirmed: CURED by pkgK7C; with only DEFENDER link 6 confirmed: identical to live.
- A6 K-F, K-G1, K-C, K-B items on D6, link 6 confirmed: identical to live.
- A7 K-G4 on D6 with no written response to the item: identical to live (UNCURED), as the manual section says.
- A8 no confirmed line: everything identical to live.
- A9 my terra plant of the study (terra keeps its D6 vs C5 line): count live 2, rev 1 1, rev 2 0.
- A10 my 22 rev 1 plants (h.cjs to h5.cjs): same results as rev 1 except where a K-G4 item sits on a confirmed link.
- Chain of 34703 to the written rows: differences only in the cure rows named in R1; seats, tags and results unchanged. Rolled-back insert of the changed rows.
Is leaving K-F out right: I check what a K-F item carries (side, link) in the stored cases and whether the collision line would be needed to tell whose link the FORCED line breaks.
Limits carried from rev 1 and still expected: the judge is still asked; the cure goes by link, not by the ground the judge wrote; Haiku still not seated (K-C).
