# F3 sketches (W2, offline on live s110; NOT for writing until the operator chooses). 11-10.
Question: a removed judge's alternate returns an unusable reply (content null, no JSON object, JSON did not parse). Today: no retry; the seat
stays unfilled (debate_removals kind not_counted), so the panel counts two judges (one in run 33083).
## (a) pkgF3A: one retry of the same alternate. Write file pkgF3A/parent_s110_F3A.json. Build pkgF3A/build_F3A.cjs. Tests test_F3A.cjs: 10 OK.
- Only the plain Code node "Second Alternate?" (pkgA2R) changes: round 2, which already exists, may offer the SAME model once when round 1's
  reply was unusable; a2r.retry records it. A usable reply refused by the rules (uncured items, guards) is not retried. At most once.
- It also applies G1 with the haiku exemption R2 Alternate Build already applies (pkgJGR rev 6). Without it, Second Alternate? never offers
  haiku when an Anthropic model debates (34626: both debaters Anthropic). That gap is live today.
- Size (measured): +449 code (Second Alternate? 2,274 -> 2,723; the G1 exemption is part of it). Prompt: none (the round 1 body is rebuilt).
- Cost: one more full alternate call when it fires. 34626 haiku call: 107,977 prompt and 2,479 completion tokens, upstream $0.074 (measured);
  if seated, the round 2 enforcer, send-back and gate calls follow, as for any seated alternate.
## (b) a second pool model: NO CODE. pkgA2R (live since 11-08) already calls an untried pool model in round 2. test_F3B.cjs: with a second
  model planted in the pool (glm), live s110 code runs round 2 for luna with glm. In 34626 the pool held only haiku, so round 2 found no model.
  Change needed: a second model in the alternate pool (a seat data change, the operator's choice of model). Size 0 code, 0 prompt.
  Cost: one full call of that model when it fires (about 108,000 prompt tokens at 34626's size).
## Split (12:1x CST): SET=G1|RETRY|ALL node pkgF3A/build_F3A.cjs <fetch-back> <out>. test_F3A_split.cjs: 12 OK.
- G1 alone (parent_s110_F3A_G1.json): the haiku exemption in Second Alternate?'s family rule. +46 code (measured), no prompt.
- RETRY alone (parent_s110_F3A_RETRY.json): same model once after an unusable reply. +403 code (measured), no prompt.
- Both (parent_s110_F3A.json): +449. In 34626 only both together run round 2 (haiku is Anthropic and so are both debaters).
## Rev 2 (W3 FAIL, Wall 4231). Build pkgF3A/build_F3A2.cjs (SET=G1|RETRY|ALL); write files parent_s110_F3A2_<SET>.json. Tests test_F3A2.cjs: 17 OK.
- A: Alternate Merge reads a retried seat's round 2 lines against round 2's own base (Second Alternate?'s bodies), so a line equal to round 1's
  is kept: luna's row carries two ALTERNATE TRIED lines after two unusable replies.
- B and D: a2r.tried keeps naming every model tried in round 1; a2r.retry and a2r.retry_for name the retried model and its seat; the final
  record alternate_round2 carries retry and retry_for.
- C: R2 Alternate Build (library) offers a retried model only to the seat whose reply was unusable (G5 (pkgF3A) for any other seat), and lets it
  past G5 (pkgA2R) for that seat.
- Size (measured): G1 alone +46 (Second Alternate?). RETRY alone +1,144 (Shared Library +261, Second Alternate? +519, Alternate Merge +364).
  Both +1,190. No prompt text.
## Rev 2s (bloat rule): build_F3A2s.cjs (SET=RETRY|ALL), write files parent_s110_F3A2s_<SET>.json, tests test_F3A2s.cjs 16 OK.
- Meets W3's closing condition (the retry line is kept; alternate_round2.retry names the model) with no library change.
- Size (measured): retry alone +439 (Second Alternate? +303, Alternate Merge +136); with the family exemption +485. No prompt text.
- Leaves open: C (with two unfilled seats the retried model may go to the first in panel order) and D (a2r.tried omits it; a2r.retry names it).
- What rev 2's extra +705 over 2s bought: C (+261 library), D (tried kept, retry_for), a longer Alternate Merge form and the why text.
