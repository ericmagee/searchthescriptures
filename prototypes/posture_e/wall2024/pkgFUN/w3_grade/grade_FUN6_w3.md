# W3 grade of pkgFUN rev 6 (W1, commit 1eb0a5df): FAIL, one class, with a measured fix

## Scoreboard
- My 24 NEW correct answers (w3_good6.json) through the nodes (w3_plant_FUN6_nodes.txt): 10 read UNCURED; live reads all 10 CURED. Rev 6 IS WORSE THAN LIVE on these 10.
- My earlier 88 correct answers (good2, 3, 4, 4n, 5): 0 enforced (reader level; rev 5's four are fixed).
- W2's 257, the 241 that open with COUNTED, narrow column, reader level: 0 correct refused.
- My 7 new refusals (w3_bad6.json): 6 UNCURED, 1 NOTED by design ("COUNTED. That is not right. The grant is a courtesy.").
- Write file against live s103: only the Shared Library differs, connections equal. Rolled-back insert (rows of the rev 5 shape, unchanged): rows 2, recorded true.

## The class
The first sentence is a list B sentence and the next sentence shows it is not a refusal:
1. "COUNTED. My count is wrong. I add this grant against D6."
2. "COUNTED. The count is incorrect. It should include this grant."
3. "COUNTED. My count is mistaken. The grant concedes D6."
4. "COUNTED. My count is in error. D6 is conceded by the grant."
5. "COUNTED. The grant is not a concession of D5. It is a concession of D6."
6. "COUNTED. It is not a concession of D5. It concedes D6."
7. "COUNTED. It does not apply to D5. It applies to D6."
8. "COUNTED. I do not count it against D5. I count it against D6."
9. "COUNTED. The defender never granted this. So I wrote at first; round 4 shows the grant."
10. "COUNTED. On reflection, no. My first answer cannot stand; the grant concedes D6."
1 to 4 are the plainest form of a correct follow-up: the judge admits its count was wrong and corrects it.
This is the same fault as rev 5, in the half of the rule I left standing: in grade_FUN5_w3.md I kept list B enforced as a first sentence. My miss.

## Fix, measured (w3_whole_answer_idea.cjs, sketch): one rule for both lists
A listed sentence (P or B) is ENFORCED only when it is the WHOLE answer after COUNTED. With any text after it, the reading is CURED with the NOTE.
- my correct answers, all tables: 0 of 112 enforced (rev 6: 10)
- W2's 241 COUNTED-opening cases, narrow column: same match count as rev 6 (230), 0 correct refused, NO case loses enforcement (W2's set holds no enforced case with text after the listed sentence)
- my refusals: bad6 4 of 7 enforced (rev 6: 6); "COUNTED. I do not count it. It is a courtesy." and "COUNTED. I refuse. The defender granted nothing." become NOTED
Why this is the end of the line: every failure of revs 2 to 6 was other text in the answer changing what a listed sentence means. Under the whole-answer rule there is no other text.
Cost, stated: a refusal that gives a reason after it is NOTED, not enforced.

## One label question (for W2, not part of the FAIL)
"COUNTED. My count is wrong." as the whole answer stays ENFORCED under the fix. I read "my count is wrong / mistaken / in error" as an admission, so a correct answer; "the count / that count is wrong" is the refusal. If W2 agrees, "my count" leaves the first pattern of list B.
