# W3 labels for pkgEAD (W1, commit cf5f5212), committed before any run of the candidate
Read so far: the README and the diff of parent_s112_EAD.json against live s112 (static: 418 nodes both, Shared Library only, +1,574, connections equal). No run of the candidate yet.

Pass needs every label below. A silent drop is a FAIL.

L1. Stored replay. Send Back Build, Alt Send Back Build and R2 Alt Send Back Build, live s112 against the candidate, on every stored export I hold. Every difference must be a withheld item that stands in sb_not_sent with the pkgEAD reason. Any other byte difference is a FAIL.
L2. Hand reading of every stored item the candidate withholds. RIGHT = the DeepSeek reason treats a pointer as the whole answer, and the block behind the pointer speaks to the press. WRONG = the DeepSeek reason reads the full answer and still finds it misses. One WRONG withhold of a real stored item is a FAIL.
L3. Plants of my own. Expected before the run:
 a. bare grant, no block behind: SENT.
 b. deferral to a LINK that no round holds: SENT.
 c. deferral to a LINK of under 25 words without layers: SENT.
 d. full answer behind, but no deferral word in the reason: SENT.
 e. reason reads the full answer in substance and only names where it stands ("in LINK 4 the defender says ..., which does not meet the press"): by the README's own rule ("reads a deferral") SENT. If WITHHELD: REVISE, not a limit.
 f. negated or quoted form ("the answer does not defer", or the deferral word only inside the "(judge wrote ...)" part): SENT. If WITHHELD: REVISE.
 g. the same real item carrying und, abs or ecl: SENT.
 h. E-HOLD (right: BROKEN) with a deferral and a full answer behind: WITHHELD; E-HOLD naming no side or no witness: SENT.
 i. every item of one seat withheld: no call for that seat, the other seats' calls byte-equal, seat order unchanged.
 j. no Panel Cure Normalize executed: byte-equal to live.
L4. Downstream. Each withheld item is written (Send Back Record and the log rows) with a status that says it was not sent and why. A row that vanishes is a FAIL. Chain of 34703 to the written rows: only differences that follow from the withheld items. Rolled-back insert of the changed log rows through record_enforcer_log.
L5. Counted tags. List every counted tag the change can touch. Expected: none directly (E-ANS and E-HOLD DeepSeek items are TRIAL, ruling 428).
L6. Size re-measured by me: +1,574 code, 0 prompt.
