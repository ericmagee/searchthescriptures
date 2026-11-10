# W3 labels: pkgF3A sketch (a) (W2, commit 0119cef7), on live s110, execution 34626. Committed before any run of the candidate by me.
Before this commit: I read the README, W2's labels, test and output, and diffed the node text (only Second Alternate? differs, 2,274 to 2,723, +449; connections equal).
FAIL rule: a silent drop, a missed case, or a finding I would want closed before a write.

- G0 Size and scope confirmed by my own diff.
- G1 34626 as stored (haiku "JSON did not parse" for luna): Second Alternate? says run, seat luna, haiku again; R2 Alternate Build builds the haiku call for luna.
- G2 PLANT good retry: the round 2 haiku reply is a usable verdict. Follow the round 2 nodes as far as they run offline (R2 Alternate Payloads, R2 Alternate Merge Seat, ..., Alternate Merge): the alternate is seated for luna or the chain says why not. State how far the replay reached; nodes not reached are NOT REACHED.
- G3 PLANT unusable twice: the round 2 reply is again unparseable: no third call (structure), the seat stays unfilled, the record says so (not silent), no error stops the run.
- G4 PLANT good first reply (round 1 seated, or no alternate tried, or NOT SEATED for uncured items): candidate output equals s110 apart from the new a2r.retry key (empty). State whether any reader of a2r is affected by the new key.
- G5 PLANT mixed, two removed seats and a pool of two: seat A got model X refused by the rules (uncured items), seat B got model Y unusable. Expected: Y retried for seat B; X not offered again; seat A gets nothing from the retry. If the retried model goes to seat A in place of seat B, or X is offered again, that is a finding (FAIL if a usable reply refused by the rules gets a second call of the same model for the same seat).
- G6 Why strings: the three patterns match the texts the live Alternate Payloads really writes; list other unusable forms that are not retried (timeout, HTTP error, empty) as findings, not failures.
- G7 a2r.tried no longer names the retried model: check every reader of a2r.tried (R2 Alternate Build, Alternate Merge) for a wrong record or a wrong exclusion.
- G8 Family rule: R2 Alternate Build and Alternate Build carry the haiku exemption today and live Second Alternate? does not (W2's claim); the sketch's test is the same expression.
- G9 W2's claim (b): live s110 Second Alternate? with a second model planted in the pool runs round 2 with that model (no code change).
