## pkgAMG: an E-ANS send-back changed to MEETS on the same answer is CURED (W1)

**What it changes.** This is the E-ANS cure reader, enf428Cure (Shared Library line 2669). It is used by Send Back Record, Alt Send Back Record and R2 Alt Send Back Record.

Take this case:
- the judge's ANSWER CHECK line graded the answer MISSES or FAILS;
- DeepSeek's E-ANS check said "(right: MEETS)";
- the send-back reply changes the line to MEETS, quoting the same answer or a shorter cut of it.

That reply is now CURED: the change of grade is the cure. Before, the test "the CHANGE TO MEETS quotes the flagged answer again" refused it. That test was written for a line already graded MEETS, which must cite a fuller answer.

A flagged MEETS line keeps the old test, and so does a change to MEETS that the enforcer did not call MEETS. Every other E-ANS rule is unchanged: the answer must still be found word for word in the answering side's named round, and the verse and side must match.

**Why.** Grok's 5 E-ANS rows in run 35173 read UNCURED although grok made the change DeepSeek asked for. The stored exports hold 14 such rows: 33149 1, 33371 1, 33490 1, 33497 1, 34780 4, 34852 1, 35173 5.

**Size, measured.**
- Code: +203 characters in the Shared Library. Each of the 3 Send Back Record stubs rebuilds +200.
- Prompt: 0.

**Effect.** Record-only. In the replay, nothing in the Send Back Record output changes except these cure rows.

**Limits.**
- It reads the enforcer's grade from the item's "(right: MEETS)" text. An item without it keeps the old test.
- Observation, not built: a FAILS line that DeepSeek called MEETS is also CURED by a CHANGE TO MISSES. That is the rule before and after.
