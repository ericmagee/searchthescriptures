# BB-8792 step 1: known cases and clean set (Worker_A3)

Population: 13 judgments of runs 30196, 30268, 30304 (panel 858-866, 3 single, 1 removed). Units: index.txt (140: graded 86, reasoning 13, RESULT 13, cure 28), md5 1c161c21 = SQL md5 of the same listing. Cut code: index.sql (one statement; known.sql and clean.sql share its cut).

## Known cases (expected verdict fixed here, before any call)
| id | run | judgment | unit | rule | expected | ground at the row |
|---|---|---|---|---|---|---|
| K1 | 30268 | panel gemini 862 | reasoning | K-S2 | BREACH | "neither text states that Joseph begat the child ([L4])"; no code flag (WALL-1943 problem 8) |
| K2 | 30304 | panel glm 866 | cure report D2 vs C3 | K-G4 | CLEAN | RETRACTED line with the rounds named; code refused it as "malformed line" (WALL-1949 problem 5). EXCERPT: the stored report cuts the judge's text ("until ...", "challenge...]") |
| K3a | 30304 | single | D3 vs C6 | K-C | BREACH | code mark K-C before cure (review_notes, AUDIT v23) |
| K3b | 30304 | single | D6 vs C1 | K-C | BREACH | code mark K-C before cure (review_notes, AUDIT v23) |
| K4 | 30304 | panel gemini 865 | D2 vs C3 | K-G4 | BREACH | code mark K-G4 before retraction (judgment audit line) |
| K6 | 30304 | panel gemini 865 | RESULT + cure report D2 vs C3 | RESULT | BREACH | RESULT reads DEFENDER WINS after the seat retracted its only BROKEN line (J2, WALL-1954 point 5). EXCERPT: cure report cut ("prin e syne...") |

Unit texts: units/K*.txt, each equal to the SQL md5.

## Bias-guard lines
Lines the code flagged that the reads judged wrongly flagged: none found. One probe only (wording search of WALL-1938 to 1951: falsely, wrongly, false flag, false mark, flagged wrongly, should not have, overflag); its one hit is the citation check, not a judge rule. Re-checked by E at step 2.

## Clean set (population rule)
graded units with no K-C, K-S2 or K-G4 code mark on the same run, judgment and pair (review_notes, judgment text, drv_removed): 61; of those, pair string named in no read WALL-1938 to 1951: 30; drawn: the first 12 by md5(run|seat|kind|pair|occ). Files units/C_<key8>.txt, each equal to the SQL md5.

EXPECTED VERDICT OF THE CLEAN SET IS NOT YET FIXED. "No code mark and named in no read" is not "obeys the rule". On my reading three carry a stating ground the K-S2 rule may bar:
- C_2838a3b7 (30268 glm 863 D1 vs C3): "neither text's own words state the other reading's contrary"
- C_2539d24c (30304 glm 866 D5 vs C1): "without naming whose body is the channel, so the point stays open"
- C_3c15e8ee (30268 gemini 862 D6 vs C4): "without explicit textual resolution of paternity"
Each clean unit's expected verdict is fixed against the served rule text (step 3) before any call; a BREACH call on a unit fixed as BREACH is not a false BREACH.

## Cut falsifier
As written (an "answered in [CR3]" clause after a line break): UNEXERCISED, no such unit in the population (query: graded units with more than one line = 2, both the last graded line absorbing trailing audit text). That is a cut defect found by the check: a head with no colon ("OUT-OF-ROUND CONCESSIONS") did not start a unit. Fixed in index.sql (all-caps line starts a unit). The two units affected are not among the 18 drawn.
Two more cut defects found on the known cases and fixed before the index: a "D4:" line was swallowed into the D3 vs C6 unit; the panel reasoning unit carried the JSON header fields.
