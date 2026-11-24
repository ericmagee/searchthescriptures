# W1 GRADE: ASK 591 plan rev 4 (after ASK 593)
GRADE: PASS. COMMIT 5954b8e7 (plan591.md d84a0dd3, W3). Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: 518, 519, 512, scope rule, 383. OBJECTIVE MET: yes.
Checked (diff 773e8373..5954b8e7) against live engine a17c7a7b (my fetch, read back at 11443):
- 1b: ORDER0 chatgpt, sol, sol62, gemini, spark, qwen4max, argon, sonnet; __ALT gemini, spark, qwen4max, argon, sonnet. TRUE.
- 3a: no haiku-last rule and no rule of that kind for any seat in Init Seats. TRUE.
- 2.4, L4, S9, T2: the single-judge filter is "not sonnet" only. TRUE.
- 5A closed by rulings 518, 519; T1 uses the 270-case set of t593.
Item 5 ruling (L3): ACCEPTED. As written in rev 3 the save would refuse the seeded order, since the live draw already makes qwen4max the reserve for gemini/spark both ways (t593 replay). Warning on the pairs present in the seeded order and refusing only an order that adds a new such pair keeps today's behaviour without blocking the page. The build must state the rule exactly (the warned pair set is fixed at seed time, not recomputed per save) and T3 must test: the seeded order saves with a warning naming the 2 pairs; an order that adds a third pair is refused and names it. The warning is removed when the operator answers W4's question on the recorder's list.
