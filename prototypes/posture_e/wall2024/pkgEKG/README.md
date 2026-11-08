# pkgEKG: DeepSeek K-W prompt: the flagged grant or withdrawal never counts as the side "still claiming" the fact

Node: Enforcer Build. live s55 ad7e363b555b -> pkgESH f1af9c2387d1 -> pkgEKG ee66d61f1339 (stacks on pkgESH, same node).

Fault: the K-W rule asks "does the side still claim that same fact?". DeepSeek answers it by quoting the flagged grant itself
("The side still claims "I grant Mary says "thy father""", 33490; "The side still claims it, "I grant he is called husband"", 33575),
writes NEEDS: YES, and then requires the judge's layer to carry the OTHER side's granted point, so it writes DISAGREE with STANDS WITHOUT IT.
Saved runs: of 31 K-W "ENFORCER DISAGREE: NEEDS: YES" rows, 19 quote the flagged sentence as the still-claim (33575 10, 33490 7, 33218 1, 33371 1).

Change: one passage added to the K-W rule after "still claim that same fact?": the flagged sentence never counts as a still-claim; for a grant,
X is the other side's point, the fact at risk is the link's footing that X answers, a still-claim must be other words of the side's own, and
the judge's layer is never required to carry X; for a withdrawal, a still-claim is other words asserting X again.

Test (node pkgEKG/test_EKG.cjs): 3 OK. On 17 saved runs each prompt differs from pkgESH only by the one 530-character passage.
Not testable offline: DeepSeek's new answers (needs a live call). Live check: the K-W NEEDS: YES rows whose quote is the flagged sentence go to 0.
