# Hand reading of the stored anti-cheat pairs not read before (W2, 11-10)

Source: the 34 anti-cheat pairs that pkgRAC's Close Enforcer Build hands to the closing enforcer on the stored debates (pkgRAC/parent_s107_RAC.json,
dumped by pkgRAC/w2_read/dump_pairs.cjs into pairs.json; context printed by ctx.cjs from each debate's Final Output rounds).
Read: the 29 pairs outside set C (set C = 33222, 33442, 33461, 33482, 33705, read by W3 in /mnt/project-files/w3/setBC_reading_w3.md).
Test applied: TRUE when the side's own closing sentence re-uses or re-asserts what the same side withdrew, dropped or denied in the earlier sentence.
FALSE when the two can stand together, or the earlier sentence is not the side's own position (it quotes or describes the opponent).

## Count: 15 TRUE, 9 FALSE, 5 DOUBTFUL (of 29)
If the closing enforcer confirmed every handed pair, 9 of 29 (31%) would be wrongful breaks and 5 more (17%) are doubtful.
Several pairs repeat one contradiction: the 15 TRUE pairs are 8 distinct contradictions; the 9 FALSE pairs are 9 distinct.

## TRUE (15)
- #5 33261 A53 defender: round 3 pressed Ezra 2:61 to read "[the son] of Heli" as Joseph called after his wife's father; closing says the two lines give different fathers for Joseph, Joseph's own line recorded at Heli.
- #6 33261 A89 defender: round 2 "Galatians 4:4 ... cannot by itself exclude a begetter, and I do not rest the conclusion on it"; closing summary "D5 stands on D1 to D4 with Galatians 4:4".
- #8, #10, #12, #13 33299 A33/A73/A83/A85 defender: round 2 "The Genesis 3:15 footing is withdrawn" (Link 3); closing "D3: held ... and Genesis 3:15 says 'her seed'" and Genesis 3:15 again as support under D3. One contradiction, four pairs.
- #16 33371 A60 challenger: round 1 "Of the Holy Ghost" is covenant-origin language and the Luke 1:35 verbs are empowering and presence; round 4 note "outside the round": the conception passages name the Holy Ghost as its source and state Joseph had not known her.
- #22 33592 A19 defender: round 3 "I drop Genesis 3:15, as earlier"; closing cites Genesis 3:15 "her seed" as support for D4.
- #26, #27 33798 A61/A63 defender: round 2 "The Solomon parallel does not fit" and round 3 "Luke 2:48-49 gives a contrast and not a pairing"; closing rests on 1 Chronicles 28:6 "two fathers beside one son in Solomon's case", a Father "set beside the house father". One contradiction, two pairs.
- #29, #30, #31 33846 A13/A19/A21 defender: round 3 "I drop any reliance on 1 John 5:1 as a proof"; closing "This stands on ... [L3] 1 John 5:1". One contradiction, three pairs.
- #33, #34 33846 A73/A75 defender: round 3 "I drop the Ezra 2:61 route"; closing "Ezra 2:61 shows a man called by a house not his by birth" as ground for D4. One contradiction, two pairs.

## FALSE (9)
Earlier sentence is the OPPONENT's, quoted or described by this side (the 33222 class W3 found); 4 pairs:
- #9 33299 A37: "Joseph knew Mary his wife within the espousal" is the challenger's premise, quoted in the defender's round 3 under the premise it answers.
- #14 33345 A49: "So the sign fits a conception after a husband approached" is the challenger's inference, quoted by the defender in round 3.
- #24 33644 A7: "So 'evident' fits a pedigree carried by the father's seed" is quoted under the defender's heading "CHALLENGER'S UNSUPPORTED-L4 PREMISES".
- #21 33530 A106: "D5 sets aside John 6:42 as the crowd's unbelief" describes the defender's move inside the challenger's round 1; the challenger's closing (John 6:42 among the voices naming Joseph) agrees with its own round 1.
The two sentences agree; 5 pairs:
- #2 33218 A131: Luke 1:36 and 1:5 "I do not rest on"; the closing quotation is the verse list heading an answer whose own [L4] gives the house to Joseph and does not rest on Luke 1:36.
- #3 33218 A135: "I do not rest the source ... on 'made of a woman'"; the closing quotation is the verse heading; its [L4] says "I do not rest the source on the woman alone".
- #15 33371 A43: "Elisabeth's impossibility was barrenness and age" against "It is the immediate seed, Solomon": no common subject.
- #28 33798 A67: Solomon's conception had no coming of the Holy Ghost; closing: for Jesus Luke 1:35 gives the source. The same contrast both times.
- #32 33846 A57: "1 Chronicles 28:6 ... does not carry over, so I drop it"; closing "Answered with 1 Chronicles 28:6 above", and the answer above sets it apart from Matthew 1:20 ("differ in ground"), as round 3 did.

## DOUBTFUL (5)
- #1 33218 A57 defender: round 2 "I do not claim Luke 2:49 withdraws the title from Joseph" (Luke 2:49 sets the Father "beside him"); closing "That reply sets another Father against it", while granting Joseph is "thy father" and obeyed. Beside becomes against; no withdrawal of the title is stated.
- #7 33261 A62 challenger: round 3 dropped the priesthood penalty limb of Ezra 2:62; closing quotes Ezra 2:61-62 with "put from the priesthood" as part of the register citation, arguing house reckoning, not the penalty.
- #11 33299 A79 defender: round 2 Galatians 4:4 "withdrawn as load-bearing ... stays in my chain as a verse consistent with the stated source"; closing D6 held on Matthew 1:20 and Luke 1:35 "with ginomai in Romans 1:3 and Galatians 4:4", "I do not rest it on 'made of a woman' alone".
- #17 33430 A51 defender: round 2 "I do not rest the source on Galatians 4:4" (beyond "born of thee"); closing "Mary's descent carries it [the seed], as Romans 1:3 and Galatians 4:4 together say": descent, not source, but on the same link.
- #23 33592 A49 defender: round 3 "the title is not grounded on the throne"; closing "The also adds a second ground to the first and does not erase it", where the first ground named just before is the throne from David.

## Finding for the builder (not built)
4 of the 9 FALSE pairs, and W3's 33222 pair, have an earlier quotation that is the opponent's sentence quoted inside this side's round (under a premise number with PRESSED WITH, or under a "CHALLENGER'S ... PREMISES" heading). That class is visible to code: a pair whose earlier quotation lies inside a quoted opponent premise block could be left out before it is handed. 5 of 34 stored pairs would go, all false. Not measured beyond these 34.
