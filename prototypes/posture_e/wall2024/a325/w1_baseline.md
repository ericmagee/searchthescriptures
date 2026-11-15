# ASK 325 replay baseline (W1, independent, before build)

Population: debate_enforcer_log rule E-CLOSECON, seat 'close enforcer': 121 rows, 25 runs, first 2026-11-10 22:28Z; 35 rows with '-- CONFIRMED --' in response_line.
Side text: defender = claude_r1, claude_r2, engine_r3, defender_r4; challenger = engine_r1, engine_r2, challenger_r3, challenger_r4 (debate_results by run_token).
Normalization: lower case; strip quote marks (" “ ” ' ‘ ’) and * _; collapse whitespace. Exact substring.

EARLIER label forms seen: [CRn]/[DRn] (34 rows) and "[round 3]" (40639). In the close-enforcer prompt [CRn] = DEFENDER rounds, [DRn] = CHALLENGER rounds.

Result per CONFIRMED row (EARLIER quote found in: own side / other side):
- own only (24): 29896 29897 30366 30367 30368 30369 32054 32498 32499 32500 32501 32502 33367 33368 33369 33957 34703 34704 37710 38673 38674 38675 38676 40177  -> stay COUNTED
- both sides, own occurrence is the side's own unquoted prose (8): 28737 29380 30363 32053 33364 33365 37707 37711 (all DEFENDER; 1 own occurrence each; the challenger quoted it) -> stay COUNTED under rule 3
- both sides, own occurrence only under the other side's label "MEANS [CR3] P1.3:" (3): 40639 40640 40641 (run 37372, CHALLENGER) -> NOT COUNTED

EXPECTED of a correct build: exactly 3 flips (37372 40639-40641); 32 unchanged, including the 36530 true confirmations 34703/34704.
Not measured here: whether the defender's own occurrence in the 8 'both' rows sits inside a quote of the challenger (prefix read shows own prose for all 8).
