# W3 grade of pkgCDR rev 2 (W1, commit 20ab4133): FAIL, false listings from sentences that do not drop the wording

## Scoreboard
- My 15 cases (cases.json, labels fixed before the run; run_w3.txt): 4 as labeled.
- Holds: G1, G2, G14 (true drops restated) LISTED; G15 not listed. Against live s103 only Close Enforcer Build, Close Enforcer Record and Judge Contradiction Build differ; connections equal. Rolled-back insert of 3 rows of the package's shapes (CONFIRMED P row, NO ANSWER row, J row from the judge contradiction enforcer): rows 3, recorded true.
- The 34108 pairs and the corpus claim: W2 reran them (3970); I did not repeat that.

## FAIL: the earlier sentence is not a drop of that wording, yet it is listed (7 cases; W2's class of rev 1, wider)
- G3 "Nor do I drop the wording "..."."
- G4 "If I drop the wording "...", the chain fails, so I keep it."
- G5 "Should I withdraw the wording "..."? The rows give no cause."
- G6 "I drop the limb on Matthew 1:25 alone, but the wording "..." stands."
- G7 "I withdraw my objection to the reading that ..." (drops an objection, which is acceptance)
- G11 "The challenger demands that I withdraw the wording "..."; I refuse."
- G12 "I retract only the word "alone"; the wording "..." I keep."
Each puts a false candidate before the enforcer, and a CONFIRMED answer on it breaks a link.

## Listed, and left to the enforcer (not counted in the FAIL)
- G8 "I do not say that <wording>.", G9 "The challenger writes as though <wording> were still my claim; it is not.", G10 "Whether <wording> is not a question my chain needs.": the close holds the wording without asserting it.
- G13: a drop "only as a bare statement" whose close restates the wording only as the inference that was kept.
The enforcer's prompt covers these ("states the other side's position", "narrows"). They stay candidates; the `why` text could say "holds the wording", which it does.

## Proposed fix (W1 to build): anchor the drop, do not list negations of it
Another look-ahead will not close this class. Read a drop only when:
1. the drop verb opens the sentence (after a list mark or a label ending in a colon, as in "**LINK 6: NARROWED TO:** I drop ..."), so "Nor do I", "If I", "Should I", "that I withdraw" do not match;
2. the dropped thing follows the verb directly: "the/my/this" + wording / claim / limb / sentence / reading / premise / step, or a quoted span, so "my objection to ..." and "only the word ..." do not match;
3. only that first wording is taken, never a later quoted span of the same sentence (G6, G12).
The 34108 sentence "I drop the wording "no biological father" as a bare statement." passes all three.
