# ASK 604 FINDING: THE LAY-ONLY RE-CALL AND THE SIZE OF THE ROUND (draft 4)

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST. A finding by SQL only; no plan, no build, no card. For W1's grade.

SOURCE: every "AUDIT v47: BARRED MOVE RE-CALL (pkgBAR)" line in debate_results.review_notes, read by one pattern for the seat, the side, the round, "SENT BACK: <n> sentence(s)", which round was kept, and "(<before> -> <after> chars; barred sentences <a> -> <b>)". The pattern read 192 lines; the count of the phrase in the column is 192, so none was missed.

## 1. WHAT THE RECORD SHOWS
1. 192 re-calls stand in 90 rows of debate_results, the first on 2026-11-06.
2. EVERY ONE KEPT THE SECOND ROUND (the replacement). "KEPT: first" stands in 0 rows.
3. RE-CALLS WITH A BARRED SENTENCE SENT BACK: 158, in 89 rows. 147 of them made the round longer. Growth: 109,587 characters in all; 694 on average; the most 6,529; the least -511.
4. LAY-ONLY RE-CALLS (SENT BACK: 0 sentences): 34, in 24 rows, the first on 2026-11-15; 21 on the challenger and 13 on the defender. 19 made the round longer and 15 did not. Growth: 35,862 characters in all; 1,055 on average; the most 12,776; the least -864.
5. THE GROWTH IS IN FEW PLACES. Four LAY-only re-calls hold 31,612 of the 35,862 characters (88%):
   - run 42234 (row 8dd067f4, 2026-11-24), claude-opus-5.5 as defender: CR3 41,571 to 54,347 (+12,776); CR4 30,841 to 35,743 (+4,902); CR2 27,108 to 30,314 (+3,206);
   - row 2e62a85a (2026-11-20), muse-spark-1.3 as defender: CR4 21,618 to 32,346 (+10,728).
   The next largest is +1,522.
6. 34 rows of debate_results were created since 2026-11-15; 24 of them hold a LAY-only re-call.

## 2. WHAT IT MEANS FOR ASK 604
1. A LAY-only re-call is common (24 of 34 rows since it began) and is usually small. The harm is the rare large case: a debater that answers a re-call for its LAY items by writing a much longer round, which the engine then keeps, because the engine always keeps the replacement.
2. Run 42234 is the largest case stored, and it is the run that crashed in the judging with judge bodies 40% and close enforcer bodies 65% above the last run that finished (W4, Wall 11606). That size caused the crash is not proven.
3. A re-call with a barred sentence also makes the round longer (147 of 158), but by less on average, and it has a counted purpose (the barred sentence goes: the record shows "barred sentences 1 -> 0").

## 3. WHAT THE RECORD DOES NOT HOLD
1. Whether a LAY-only replacement had fewer LAY items than the round it replaced. The v47 line gives sizes and barred sentences only. So I cannot say from SQL that the 34 re-calls gained anything.
2. What the re-call asks of the debater, and why a re-call is sent when no sentence is barred. That is in the code and the execution; I do not read n8n. W4's read.
3. Whether any of the 90 rows is a regrade that repeats another row's lines. Not checked; it would lower the counts, not the largest cases.

## 3A. W4'S CODE READ (draft 2; W4's reply under Wall 11627, 11:57 CST 2026-11-24; not read by me)
1. A LAY-only re-call re-sends the whole original request, plus the round, plus a "LAYERS CHECK" note that asks for the whole round again with the missing verses.
2. The second round is kept if it is checked, is at least 60% of the first round's length, and is not worse by the round's fault test. That fault test stands in two rounds only (W1 N1, Wall 11636, read on live ff7ab4cf): the nodes C3B and C4B, which by W1's read (Wall 11639) check DR3 and DR4, the challenger's rounds, for press faults and grant faults; in the other five it is the constant false, so there the 60% floor alone decides. In run 42234 the Oracle defended, so the 60% floor alone kept all three of its LAY-only replacement rounds. (Draft 3 called C3B and C4B the Oracle's rounds; that was my mistake, a guess from the node names.) THERE IS NO UPPER BOUND, and the layer count plays no part in which round is kept.
3. The engine computes the layer counts before and after; they stay in the execution data and Build Save Body never writes them. So item 3.1 cannot be answered from the record today.
4. LAY.bare text can also be appended to the kept round.
WHAT THIS ADDS: the rule that keeps the replacement has a floor (60%) and no ceiling, and it does not ask whether the re-call cured the items it was sent for. Option A below would add the missing ceiling; storing the two layer counts would let any later run show whether a LAY-only re-call gains anything.

## 4. WHAT A PLAN COULD WEIGH (not decided; each keeps every debater's words whole, as ASK 597 was pressed)
A. Keep the first round when the re-call was LAY-only and the replacement is longer by more than a named share. No word is cut: one of two whole rounds is kept.
B. Change what the LAY-only re-call asks: correct the listed items and add no new matter. This changes a debater's instruction text and needs its own card.
C. Send no re-call for LAY items alone; record them. This removes a check the operator may want.
Which of these is right depends on item 3.1 and 3.2, so the next step is W4's read of the LAY-only re-call (what it sends, and whether the LAY count before and after is available to the engine). Then one question to the operator.
