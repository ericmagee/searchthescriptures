# W1 grade: ASK 582, engine manual v241 draft (Wall 11200; commit 26b4794c)
VERDICT: PASS WITH ONE CONDITION (C1).
(a) My own position build in SQL (position_check.sql; not W3's preview SQL, not engine_manual_apply): from v240 (8534e574, 743,498) the 145 rows give md5 bea2667f79971409060776083dabd2c1, length 707,580. The concatenated old texts of the pairs file equal v240 at the stated positions (md5 fa88fad7, 36,387 chars both sides). Edits ordered, non-overlapping. 3 olds are not unique in the base and become unique in sequence; W3's apply preview reports each once.
(b) Pairs analysed: 134 pure deletions (the ':' cases share the colon), 10 renumber digits, 1 kept sentence (ASK 554/555 "No grant to anon, authenticated or PUBLIC."). Nothing inserted besides. diff_v240_v241.txt truncates lines at 400 characters (nit: not a full proof by itself).
(c) Every cut read. 135 cut spans all present verbatim in removed_v241.txt (7ea94c23, 47,737). Behaviour check:
  - C1: k96 R3 removes the body's only mention of the view debate_rounds_by_side ("a database read aid; the engine does not read it"; 1 occurrence in v240). That states present behaviour. Keep it in the body.
  - R4 tails "Widened by ASK 542 below", "No workflow changed", "Limit of the proof" are history: log is right.
  - k51 grants: the fact stays in the entry's What: line. k25 gemini_deb dashboard sentence: Any vs Any keeps 3 other mentions. k22/k53 MCP readability notes are tool facts, not engine behaviour: log is right.
(d) All 27 R4 cuts follow a full stop and end at a newline; the 6 R6 headers end in ':'; the renumbered lists are consecutive.
