# BB-6904 rev 8, D (7223 D, shape 7229): [old, new] pairs for engine_manual v82 from v81 (em81.txt, content md5 c838fbb7).
# P1-P4 change current-state sentences that describe the GUARD-INADMISSIBLE block; P5 adds the one dated removal line.
# P6 (posline, item F, 7235) is outside 7223 D and is kept in a separate file for the advisor's ruling.
import json
P=[
 ["Neither seat is given a seed-not-blood block; the judges' rulebook keeps it as the GUARD-INADMISSIBLE block, whose grading sentence takes a who-belongs verdict in any vocabulary, and an identity closed from circumcision status, as unexhibited (BB-5640, BB-5657).",
  "Neither seat is given a seed-not-blood block, and the judges' rulebook no longer carries the GUARD-INADMISSIBLE block (removed 2026-10-21, BB-7223)."],
 ["chain scope, GUARD-INADMISSIBLE (seed-not-blood in any vocabulary, circumcision closure), COUNTING RULE",
  "chain scope, COUNTING RULE"],
 ["chain scope, GUARD-INADMISSIBLE, counting rule",
  "chain scope, counting rule"],
 ["\"What else decides a link\" quoting the rulebook on who-belongs verdicts, UNEXHIBITED, VOID and KEYSTONE",
  "\"What else decides a link\" quoting the rulebook on UNEXHIBITED, VOID and KEYSTONE"],
 ["and an earlier [L4] label of it does not survive (W4).\n",
  "and an earlier [L4] label of it does not survive (W4).\n  Removed 2026-10-21 (BB-7223, rulings row 61; shape BB-7229; flow version 804b870a): the GUARD-INADMISSIBLE block, and the TERMS sentence that counted a link it ordered unexhibited as WITHDRAWN, from the single judge's and the panel's rulebook alike; the KEYSTONE reads WITHDRAWN if it is withdrawn or conceded. W2 and W3 above no longer apply; W4 stays. Drift guards are for the debating model only.\n"],
]
P6=[["goes to the synthesis, the single judge, the diagnostic and the panel. Grading is by ROLE.",
     "goes to the synthesis and the diagnostic; since 2026-10-21 not to the single judge or the panel (BB-7235). Grading is by ROLE."]]
json.dump(P,open('pairs_v82.json','w'),ensure_ascii=False,indent=1)
json.dump(P6,open('pairs_v82_F_for_ruling.json','w'),ensure_ascii=False,indent=1)
