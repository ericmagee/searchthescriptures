W2 replay harness for ASK 325 (close-enforcer misattribution). Read-only. No model calls.
Unpack rows.json.gz and debates.json.gz beside h325.py, then run: python3 h325.py [candidate.py]
candidate.py defines decide(row, deb) and returns 'COUNTED' or 'NOT COUNTED'.
Population: debate_enforcer_log, rule E-CLOSECON, seat 'close enforcer', response_line containing CONFIRMED. 35 rows, 13 debates (pulled 11-15 08:0x CST).
Sides: defender = claude_r1, claude_r2, engine_r3, defender_r4. Challenger = engine_r1, engine_r2, challenger_r3, challenger_r4.
W2 reference rule: flips 3 of 35 (40639, 40640, 40641; run 37372).
Plants 9 of 9: P0 the stored row; C1a empty, C1b missing, C1c paraphrased; C2 own tag; C3 symmetric; C4 adopted; A1 synthesis echo; A2 misattribution.
Control: with the A2 owner test switched off, the A2 plant fails, so the plant can fail.
