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
