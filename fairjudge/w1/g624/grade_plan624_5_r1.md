# W1 grade: ASK 624.5 plan rev 1 (W4, ask624/w4/plan624_5.md, sha256 b4164b24 / md5 c8866cd0)
GRADE: PASS WITH N1 to N4.
RULES READ: ASK 624 ruling 18:00 CST 11-24 ("Reasoning is untouched. W4 plans the engine check"); ruling 428 (the judge keeps the decision); ASK 599.

Checked on live engine 634afc23 / child 85515391 (pulled 00:51Z):
- WHL507 is at Library index 3559; faults() raises "WHICH HOLDS AGREEMENT" for CHALLENGER with a verdict other than BROKEN and for DEFENDER with BROKEN. faults() is called once (index 2913, the send-back E-WHL rows, t507 TRIAL record-only); index 3057 uses WHL507.read only, for display. Matches the plan.
- sbLabel0 (index 1375) labels COLLISION, KEYSTONE, CONCEDED, STANDING and CLAUSE only; no WHICH HOLDS. Matches.
- pkgGCA occurs only in Alternate Merge (engine); not in the child. Matches.
- Late Gate Build, Alt Late Gate Build, Gate Record, Alt Gate Record (engine) and R2 Alt Late Gate Build, R2 Alt Gate Record (child) exist; no "Late Gate Record". The rev 1 correction is right.
- Reasoning fence: no judge instruction changes; items name two lines and ask CHANGE TO or KEEP; the judge chooses (428). The engine never says which side is right. Meets the 624 ruling.

N1: the three item texts are judge-facing and not quoted in the plan. Quote each verbatim (E-WHL AGREEMENT, E-RTL, E-GCA) on the card, and the build must use them byte-for-byte.
N2: faults() takes its verdict from verdict(t,tag) on the text; the plan says the check uses the engine's recomputed verdict word. State how that word is passed in (a new argument, or a wrapper), so the Send Back Build TRIAL rows keep their present reading.
N3: the Library line numbers in the plan are 0-based indices (3559, 1403, 1374-1375); say so, or give 1-based numbers.
N4: E-RTL (b) is the widest matcher. At the build, C2 must list every hit with its quoted line on the stored judgments of 42071, 42283 and 42373, so WRONG-IF 3 can be judged from the list.

OBJECTIVE MET (as a plan): yes. It sends a judgment that contradicts itself back before it counts, changes no reasoning text, and puts the one consequence question to the operator with a recommendation.
STANDARD (ASK 599): C6 carries it.
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh
