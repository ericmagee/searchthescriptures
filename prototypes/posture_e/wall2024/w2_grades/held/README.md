# W2 study: why two of three judges first rule HELD (offline, stored text only; nothing built)

Scripts: first_texts.cjs (each judge's first text, Panel Judge N), grades.cjs (grades_out.txt), tally.cjs, ecol.cjs. Prompt: panel_prompt_34780.txt (the Panel Judges Prep body of 34780).

## Measured
- First verdicts in 5 stored executions (34299, 34626, 34703, 34726, 34780): 11 HELD, 4 BROKEN. Every execution has at least two HELD. Same shape in 34626, 34703 (34108's debate) and 34726, 34780.
- Of the 11 HELD texts, 10 write "RESULT: UNDERDETERMINED" and 1 (luna 34780) "RESULT: DEFENDER WINS".
- terra (seat chatgpt) grades EVERY collision pair UNDERDETERMINED in 4 of its 5 texts; sol does so in 3 of 5 (34626, 34703, 34726).
- The link carrying the true closing contradiction (D1 in 34726's debate, D6 in 34108's) is graded UNDERDETERMINED by every HELD judge, except luna 34780 who grades D1 vs C3 CHALLENGER LINK BROKEN (the opposite side).
- DeepSeek's E-HOLD check of UNDERDETERMINED lines answered AGREE 113 of 116 times across the 5 executions.

## Why the first verdict is HELD
1. The verdict scheme: BROKEN needs a judge's own DEFENDER LINK BROKEN grade (k >= 1); PARTIAL needs a withdrawn link; "HELD-1: none of the above". There is no verdict word for "nothing decided", so a text that grades every pair UNDERDETERMINED is HELD by definition, while its RESULT line says UNDERDETERMINED.
2. The judges ARE shown the confirmed closing contradiction before they judge (34780 prompt: "[CONFIRMED CLOSING CONTRADICTIONS ... DEFENDER LINK 1 (D1) ... This link is BROKEN by the contradiction rule; the system sets every collision line of D1 to DEFENDER LINK BROKEN after you judge. Grade every collision line as usual on its arguments, these links included; do not write a grade for the contradiction itself.]"). So the first verdict is told to leave the contradiction out, and the engine applies it after. HELD followed by BROKEN is the designed sequence when a judge breaks nothing on its own grades.
3. The enforcer does not press an UNDERDETERMINED grade: E-HOLD agrees 97 percent.

## So what is the fault
- Not the HELD word itself (designed). The open question is the judges' own grades: two of three judges break no link on the arguments in every stored debate, and the DeepSeek check of those UNDERDETERMINED grades almost always agrees. Whether those UNDERDETERMINED grades are wrong is a hand reading of each pair (the operator's VERDICT ruling: a fit with no answer back does not count toward a defender win). NOT DONE here.

## Candidate remedies (none built)
- M0, 0 size: report a first HELD whose RESULT is UNDERDETERMINED and whose seat breaks no link as "no link broken by the judge (UNDERDETERMINED)", not as "ruled for the defender", in run reports and the scoreboard.
- M1, judge prompt, for the operator: count the confirmed contradiction in the judge's own verdict word ("... after you judge; count that link in k"). Changes only the first verdict word, which the engine corrects anyway: cosmetic; not recommended.
- Substantive remedy for all-UNDERDETERMINED grading: not found in this study; it needs the hand reading above first.

## Not covered
- E-COL rows in these records are on engine-marked lines (AUDIT break marks); their DISAGREE counts are not read as judge errors here (pkgECB and pkgRTE now withhold such lines).
