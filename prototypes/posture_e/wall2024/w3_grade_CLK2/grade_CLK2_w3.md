# Grade of pkgCLK rev 2 (W1) by W3: PASS WITH LIMITS

Candidate: /mnt/project-files/wall2024/parent_s119_CLK2.json, sha256 aba1d25666966f88, against live s119. Diff: Close Enforcer Record only, +1,089 code (measured by me), prompt 0, connections equal. Plants and expectations were recorded before any run of the candidate (EXPECT.md, this folder). Scripts and output: repo prototypes/posture_e/wall2024/w3_grade_CLK2/ (stored.cjs, w3plants.cjs, out.txt). All results MEASURED.

## 1. Defects and limits first
No silent drop. No error. No row lost. Findings, none a fail on my reading:
- L1 (my plant W1; I had written "WRONG" before the run). A defender heading "## LINK 4 of the challenger: ..." sets the defender's LINK 4. After the run I scanned the stored rounds: the defender heads its OWN links "LINK n" in rounds 2 and 3 (runs 34299, 34726, 34852), and no stored close heads a block by the other side's link in that form. I lower it to a limit. It should be stated in the manual section.
- L2 (W3). A bold lead on the sentence's own line that names one link ("**D5 also stands.** <sentence>") is read as the block heading: LINK 5 set, though the block is headed D2. Limit to state.
- L3 (W4). A pair CONFIRMED on LINK 3 and answered NOT A CONTRADICTION on LINK 2 (two lines): live breaks D3; the candidate moves the confirmed row to LINK 2 and breaks D2, the link the reply cleared for the same pair. A link breaks in both; not a regression. Limit to state.
- L4 (W5). When the moved row lands on a link an earlier confirmed line already broke, its note is overwritten by "the same link is already broken by an earlier confirmed line"; link_named still shows the reply's link. One break (D2) where live gave two (D2, D3); right by the rule, since both sentences stand in the D2 block.
- L5 (W8). A reclaim sentence that stands in the D6 block ("I keep D1 to D6 as declared.") confirmed on LINK 1 is moved to LINK 6. This follows the prompt's rule as written (the block first). It matters to the open reclaim item of run 34852: a package that confirms that sentence will break D6, not the narrowed links.
- L6 (W11, W1's stated limit). With no "---" rule and no heading on the block, the code sets the block above (LINK 1 in the plant). Stated by the builder; no stored close has that shape.
- L7. The run 34299 close form ("## ANSWERS (C3 against D2)" over bold "ANSWER: ... -- D2 --" lines) is never relinked: the reply's link stands (W2a). Safe; the fix does not reach that form.

## 2. Stored replays
34299, 34626, 34703, 34726, 34780, 34852: live replay equals the stored output in all six; candidate equals live in five; 34852 row X2 DEFENDER LINK 3 becomes LINK 2 with the pkgCLK note and link_named 3.

## 3. W4's rev 1 failures, retested
| Plant | Live | Candidate | Reading |
|---|---|---|---|
| C5 heading line removed (rule present) | 3 | 3 | fixed |
| C8 bold heading "**D2: ...**" | 3 | 2 | fixed |
| C10 same pair, same link, both answers | NOT CONFIRMED, nothing broken | the same | fixed |

## 4. My plants
| Plant | Expected | Candidate | Reading |
|---|---|---|---|
| W1 "## LINK 4 of the challenger" | 3 | 4 | limit L1 |
| W2a "## ANSWERS (C3 against D2)" | 3 | 3 | as expected |
| W2b "## ANSWERS (D2 against C3)" | 2 | 2 | as expected |
| W3 bold lead on the sentence's line | 2 or 3 | 5 | limit L2 |
| W4 confirmed on 3, cleared on 2 | D2 not broken | D2 broken | limit L3 |
| W5 another confirmed line on 2 first | D2 once, note kept | D2 once, note overwritten | limit L4 |
| W6 "## D9" (not declared) | 3 | 3 | as expected |
| W7 "## 2. Mary was a virgin (D2)" | 3 or 2 | 3 | as expected |
| W8 reclaim sentence in the D6 block | recorded | 6 (reply 1) | L5 |
| W9 CRLF line ends | no error, 3 or 2 | 3, no error | as expected |
| W10 "#### **D2 — ...**" | 2 | 2 | as expected |
| W11 rule and heading removed | 1 by the stated limit | 1 | L6 |
| W12a challenger under "### C2" | C2 | C2 | as expected |
| W12b challenger sentence in the grants part | reply stands | C3 stands | as expected |

## 5. Verdict
PASS WITH LIMITS. Ask to the builder: add L1 to L5 to the manual section. Not graded by me: any effect on a verdict (the chain is broken by any confirmed line, so the link named changes the record, not the result).
