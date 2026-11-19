# ASK 438 build (W2): raise the Part B gloss caps in L2 Gloss Plan

Plan: plan_rev0.md (PASS W3 9114, W1 9117). Base: engine moMxiV4Irg1uRBZN live version 2d40e6ad-5755-4826-af6d-44982301a458.

- build438.cjs: `node build438.cjs LIVE_ENGINE.json 2d40e6ad-5755-4826-af6d-44982301a458 eng438.json`. Target sha256 4404e5bd2620 (not committed, 3.8 MB; rebuild from the live version).
- Diff: only L2 Gloss Plan; lines 121 (constants, gloss cap), 143 (406 test and number slice), 148 (renderings reads slice). Connections and settings equal; 425 nodes.
- ASK 385 check (a385_w4/reg385.cjs on target plus live child aa9ed5c5): PASS. Reasoning guard: no model-setting change.
- C2: c438.cjs, run from a432_w2 beside the dumps (debates.json, ow.json, lexall.json): c438_full.txt.
- C3: c438_c3.cjs: c438_c3_out.txt (record size on the largest runs).
- C4: c438_c4.cjs with ren_c4.json (renderings word and phrase sets for 85 numbers, built by SQL from today's kjv_word_map the way the node builds them) and c4nums.json: c438_c4_out.txt.
  Limits: the REN builder is replaced by the injected sets in both live and target; col and kjv reads are answered as failed in both, so TF is null in both.
