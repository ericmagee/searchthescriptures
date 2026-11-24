# W1 grade: ASK 597 plan rev 0

GRADE: PASS with F1 to F4. ASK 597 plan rev 0 (ask597/w3/plan597.md 90299213, commit fee60ae9).
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.

RULES READ: ASK 587 item A; ASK 595; ASK 599 rule 3 and rule 4 (approved 01:57 CST); rulings 383, 428, 512; scope rule; build rule; "never touch reasoning unless instructed".
OBJECTIVE MET: yes, as a plan. One handler, whole words for judges and debaters, live stages each with its own card; nothing staged as a trial (512).
STANDARD (ASK 599): a plan, no code; rule 3 is the plan's own objective.

## Section 2, against my own read

Scan: fairjudge/w1/g597/cnt597.js, `.slice(0,N)` strict, on engine d819ff4c (my fetch g590r/live_d819.json and W4's fetchback_eng590.json 10b2bcc8 give the same) and child 31329164.

| Cut at | Engine | Shared Library node | Other nodes | Child |
|---|---|---|---|---|
| 1,500 | 24 | 19 | 5 | 20 |
| 700 | 27 | 24 | 3 | 24 |
| 600 | 42 | 31 | 11 | 32 |
| 500 | 10 | 1 | 9 | 1 |
| 400 | 48 | 27 | 21 | 28 |
| all | 151 | 102 | 49 | 105 |

W3's 151 is right, row by row. My 141 on Wall 11462 was WRONG: the strict pattern gives 151, so the difference is not W3's looser pattern. My mistake. No `substring(0,N)` or `substr(0,N)` form stands in either flow.

## Findings

F1. The objective is larger than section 2 sizes. Objective item 1 is zero `.slice(0,N)` on a text field outside the handler, at ANY length. The engine holds 689 more `.slice(0,N)` at other lengths (148 at 200, 102 at 300, 61 at 120, 56 at 160, 52 at 60, 43 at 80, and 9 at 1,200, 6 at 900, 3 at 2,000, 3 at 4,000, 1 at 8,000, among others); the child 269. Many cut arrays or ids, not text. S1 must cover every length and state the test for "a text field", or objective item 1 must name the five lengths. The 2,000 cut (QR reply) is also on the ASK 595 card.

F2. K1 to K5 have no class for words of a model that is neither a judge nor a debater: the enforcer's reply, the anti-cheat, assume check and cure replies, the question round's answers. The plan must say whether these are whole or K5.

F3. Two proofs to add to S5. (a) No text shortened by `shorten` with " [...]" reaches a reader that applies the ASK 587 A NOT READ rule, or that reader is named and settled. (b) The 102 cuts in the Shared Library node are its packed source text; S1 counts a library line once and names every node that runs it, so a stage's places are counted where they run.

F4. Limit 5.3 can be closed now: debate_enforcer_log, odv1_question_round_log and debate_results hold no varchar column with a length limit. Stored maxima: flagged_line 5,719, response_line 1,742. A response_line over 700 is already stored, so at least one path writes it whole; S1 names it.

## The proposal (S3)

Sound. Judges and debaters whole, only the engine's own text shortened and marked, is what ruling 383 needs (a judge grades the text it is shown) and what 587 A already assumes. Section 4.4 correctly sends any change to a count or removal to the card in plain words, which keeps "never touch reasoning" with the operator. The stage order (K2 first) is sound.
