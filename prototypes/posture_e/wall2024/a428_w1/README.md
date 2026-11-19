# ASK 428 build (W1): remove code comments from Code nodes and form 3 pkgLIB stubs

Plan: a428_w3/plan_rev3.md (commit 71c82397; W2 PASS 9060 A). Graders W2 and W4. Written by W4 on the operator's card.
No prompt, model or reasoning setting changes; no token changes.

## Files
- `fb_engine.json`, `fb_child.json`: fresh fetch-backs, engine b780b2ae-26de-4e0f-aaf6-f4e1391b9985, child 7b043bab-71a0-47c5-9102-d3606756f9b2
  (fetched 11-19; nodes equal to the copies read for ASK 426).
- `build.cjs`: `node a428_w1/build.cjs <fetchback> <out_dir>` (run from wall2024/). Writes `<wf>_target.json` and `<wf>_nodes.json`
  (each changed node: kind a, b or c, proofs, original and new text).
- `out/moMxiV4Irg1uRBZN_b780b2ae_target.json`, `out/MqQHRl7mQQ0z8QdT_7b043bab_target.json`: the targets.
- `build_out.txt`, `checks_out.txt`: the outputs below. `step1.cjs`, `step1_out.txt`: step 1.
- `registry_entry_428.json`: the ASK 417 entry (plan item 6), for the registry owner to merge at write time.

## Scope as built
- Kept byte-equal by name (3(d)): Shared Library (both), Alternate Build, Early Alternate Build.
- (b) the form 3 standard stubs: direct text edit. Removed: the two header lines, the REFLINE comment after if(false){...}, and the comment
  that ends the run line, each with the spaces before it. Each stub held exactly these 4 comments. gate/pack.cjs and STUBV unchanged.
- (a) and (c): every other Code node, by strip.cjs's rule (a422b_w1, W3 8865 B). The 422(b) reader exclusion is narrowed to the names
  above and the (b) stubs (rev 3 item 3(c)). Every (c) node's Function( call runs library text (REFP loaders, Alternate Merge ert386),
  never its own text; "stack" hits are prompt words.

## Result
| | engine | child |
|---|---|---|
| Code nodes | 183 | 63 |
| changed | 108 | 58 |
| (a) non-stub nodes / chars removed | 45 / 46,081 | 44 / 3,941 |
| (b) form 3 stubs / chars removed | 31 / 22,471 | 13 / 9,478 |
| (c) Shared Library readers / chars removed | 32 / 76,548 | 1 / 863 |
| in scope, no comments | 72 | 4 |
| all Code node chars | 3,577,507 -> 3,432,407 | 1,134,191 -> 1,119,909 |

- C1: BUILD PASS both. onlyjs.cjs: jsCode changed in exactly the 108 and 58 listed nodes; other differences 0.
- C2: token equality, tree equality, no comment left, compiles in an async function wrapper: 108/108 and 58/58. Line count equal for (a)
  and (c); each (b) stub is 2 lines shorter (the header lines).
- C2a: reasoning_guard.cjs flags 1 engine node, Alternate Merge; child none. The flagged text is the word "reasoning" in a removed comment
  ("the reasoning's opening verdict word is replaced", ASK 297); the code hit (/"reasoning"\s*:/) stays. Token equality shows no setting changed.
- C2b: the set of literal $() names, comments included, is equal before and after in 108/108 and 58/58 (none dropped).
- C3: rebuild() output sha old stub against new stub equal 31/31 and 13/13 (44/44). Alternate Build and Early Alternate Build byte-equal.
- C4: ASK 385 (a385_w4/reg385.cjs) PASS before and after. lib_sha (a422a_w4/libsha.py on the targets): body = header = c91b9f1489e9c132
  on both, map_sha 99d7d2c673d59735, EQUAL.
- C5: NOT RUN. gate/replay.cjs replays saved runs from /mnt/project-files/wall2024/inputs, which is empty (0 runs; no _index.json in git).
  The plan says found nothing is not a pass, so C5 is open. Every (b) stub's rebuilt source is byte-equal (C3), so a replay would run the same
  source on both sides. All (a) and (c) nodes rest on C2, C2a and C2b.
