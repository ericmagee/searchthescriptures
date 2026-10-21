# BB-7212 item 2: stored debates whose grades the GUARD-INADMISSIBLE block touched (Worker_A3, read-only)
Scope: every stored judgment (single judge, panel seats, removed seats in drv_removed) on debate_results rows created on or after
13 Oct 01:27Z (published 30bd621c, 12 Oct 20:27 CDT) whose text names "guard-inadmissible" or "who-belongs": 80 judgments on 35 debates
(query in BB row). census2.py keeps a judgment when a sentence names the guard and grades WITHDRAWN or UNEXHIBITED with no negation;
"keystone turned" when that sentence is about the keystone or conclusion link. Output: CENSUS_RUN.txt, census2.json.
Hand correction: 26549 deepseek ("premise 2 (Mary Davidic) is guard-inadmissible UNEXHIBITED", counted toward the defender's conceded
links) is a real grade the negation filter drops ("is not" later in the sentence); keystone not turned; panel outcome UNDERDETERMINED.
Limits: sentence-level text match, not a reading; a judge who applied the guard without naming it is not found.
