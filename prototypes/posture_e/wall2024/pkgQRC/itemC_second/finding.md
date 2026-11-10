# Item C: a second closing contradiction goes unasked (W2, 11-09 CST)

## What happened (dry regrade of 34108, execution 34299, W4)
All three judges asked the defender about the same pair: round 3 "I drop the wording" against round 4 "a not-knowing at each stage". No judge asked about the recorded pair: round 3 "the ordinary means" against round 4 "Genesis 4:1 ... cannot supply the sequence".

## Why, from the code (QR Ask Build, pkgQRC rev 2)
1. Each judge writes its questions in its own conversation, all three at once; no judge sees another's questions.
2. Each judge has one question per debater (ruling 413 and the operator's rule). The ask says: if the closing round contradicts an earlier round, the question must be about "that contradiction". It names one.
3. The question round runs before the judges judge. The recorded contradiction in 34108 came from terra's judgment, written after; the question round cannot see it.
So when a debater has two contradictions and all three judges notice the more obvious one first, the second is never asked. Nothing in the code prevents three identical questions.

## Does item C need a change
Yes, if every closing contradiction should be put to the debater. Code alone cannot do it: any fix needs a new sentence to the judges, and item C's approved wording (C1 to C5) cannot change without the operator.

## Options
1. Redirect duplicates (recommended). After the three judges reply, the program finds judges whose contradiction question to the same debater names the same earlier round and closing round as an earlier judge's (overlapping quotes). Each such judge gets one more turn, the way a failed question is returned once now, with one new sentence: "Another judge already asks this debater about the contradiction between <round> and <round>. If you see a different contradiction in this debater's closing round, ask about it instead; if you see none, keep your question." Extra calls happen only when questions repeat (in 34108: two). The one-question rule stays.
2. Let a judge ask one question per contradiction it finds (more than one question per debater). This changes the operator's one-question rule.
3. No change to item C. The closing enforcer (item A) still checks the closing round after the panel; an unasked contradiction can still break the chain there. Not checked yet: whether item A flags the "ordinary means" pair on 34108.
