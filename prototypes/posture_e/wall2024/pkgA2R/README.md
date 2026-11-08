# pkgA2R: the second alternate round (W1, 11-08)

## v2 (W3 3224, W4 3225): rebuilt on s62 and the E4 target
- Base: fetchback_live_s62.json (live 0774fea5) and strip_RI3 (the live LIB v25). The 26 R2 clones and the library clones are byte-equal to v1, and nodes_A2R.json is unchanged.
- pkgE4 rebuilt on the A2R target: `node pkgE4/build_E4.cjs fetchback_live_s62.json pkgLIB_v26_A2R/patched/Alternate_Build.js`, with the outputs copied to pkgA2R/e4_on_v26/ (pkgE4/out is left as W2 committed it).
  - This gives E4's Alternate Build and Early Alternate Build on the v26 stub, so their library line numbers match Shared Library d30de903b762.
  - E4's string edits begin with a quote or bracket ("Alternate Call openrouter"), so they never touch an "R2 ..." name. The two packages commute.
- Panel Tokens is patched on E4's version (f022b14fde88 -> 7678d4a4fdcc). It carries Early Alternate Reply and both R2 calls. Format Markdown d8cd45e60231 -> e1c296a588da (E4 does not touch it).
- Tests on the combined target:
  - test_A2R (s62): 146 OK, 0 FAIL, with 28 parity runs (33705 added).
  - test_E4_on_v26: 56 OK, 0 FAIL (11 used, 6 not covered, the same as W2's test_E4.txt).
  - test_E4_carry_on_v26: 11 OK, 0 FAIL (10 reasoning_details turns carried).
  - Both E4 test copies are W2's tests with only their paths pointed at v26, strip_A2R, e4_on_v26 and s62.
- ONE WRITE for W4, after s62 (live v25):
  1. Shared Library -> d30de903b762, plus the 22 stubs from pkgLIB_v26_A2R. Alternate Build is the exception: it takes E4's version from e4_on_v26/main_nodes_patched.json, not the plain v26 stub.
  2. pkgE4 from e4_on_v26: the 5 new nodes, the other 38 patched nodes, the sub-workflow, e4.sql and the E4 edges. This still needs Eric's "write pkgE4".
  3. pkgA2R from out/nodes_A2R.json: rename Alternate Merge -> Alternate Merge 1, the 29 new nodes (8 of them library stubs from pkgLIB_v26_A2R), the edges, Format Markdown, and Panel Tokens from out/Panel_Tokens.js (this replaces E4's Panel Tokens).
- If E4 is not written, write A2R alone: v26 with its plain Alternate Build stub, and Panel Tokens rebuilt on live (`node pkgA2R/build_A2R.cjs` with no 5th argument).


Approved: Eric's even-panel reserve (10:14 CST 11-07), MiMo pool approval (WALL-2024 2889), W1 2887 option (a) and 2891. Design: Wall 3222. Not a DeepSeek fix. It changes no verdict on any saved run.

## What it does
- When a removed seat's round-1 alternate is tried and ends NOT SEATED, the seat is still unfilled, fewer than two alternates sit, and the pool still holds a model that was not tried in round 1 and passes G1 and G3, a second alternate is tried for that seat.
- Round 2 is a cloned chain (R2 Alternate Build through R2 Alternate Merge, 26 nodes). It is the item C pattern (pkgALT), not a loop. In a loop, n8n's $('X') reads the node's last run, so a Record node whose Call was skipped in round 2 would read round 1's replies.
- Each clone differs from its round-1 node only in names (R2 prefix). R2 Alternate Build also has three patches (names.cjs AB_PATCH): it offers only the seats Second Alternate? names, and a new guard, G5, refuses a model tried in round 1.
- The R2 nodes are built from pre-E4 sources: live s61 nodes and the library strip. Round 2 has no early start. The build refuses a source that names an Early Alternate node.

## Nodes (out/nodes_A2R.json)
- Rename: "Alternate Merge" becomes "Alternate Merge 1". Its code is unchanged (library stub Alternate_Merge_1.js).
- New:
  - Second Alternate? (code). Output: Gate Record's output plus a2r {run, seats, tried, free, why}.
  - Second Alternate Needed? (IF on a2r.run). True goes to R2 Alternate Build. False goes to Alternate Merge.
  - The 26 R2 clones. 8 are library stubs (pkgLIB_v26_A2R); the IF, HTTP and other code nodes carry their parameters.
  - Alternate Merge (code, alternate_merge_final.js), the final node.
    - No round 2: it returns Alternate Merge 1's output unchanged.
    - Round 2: it combines both rounds. A round-2 seated alternate takes the seat's body and summary. Otherwise round 1's body stays, and round 2's ALTERNATE TRIED and UNSEATED lines are appended.
    - alternates_seated, drv_removed and alternates_tried are round 1's followed by round 2's. The seated and removed lists stay aligned, at most two, as odv1_record_panel_alternates requires.
    - The enforcer log adds round 2's rows for its own alternates.
- Every node after Dry? still reads $('Alternate Merge') by name.
- Connections: Alternate Merge 1 -> Second Alternate? -> Second Alternate Needed? (0: R2 Alternate Build, 1: Alternate Merge); R2 Alternate Merge -> Alternate Merge -> Dry?. The round-1 edge from Alternate Merge 1 to Dry? is removed. The R2 edges mirror round 1's.
- Code updates:
  - Panel Tokens 1a9da686fe58 -> 03e224844dff: the round-2 call and cure tokens.
  - Format Markdown d8cd45e60231 -> e1c296a588da: the round-2 alternate and cure calls in the report, read only when executed.
- LIB v26_A2R: 30 nodes (the 22 and 8 R2 clones), on strip_RI3 (v25). Shared Library d30de903b762. 30/30 stubs unpack to their sources. pack.cjs takes LIB_N=30.
- No DDL. odv1_record_panel_alternates (md5 2967885d...) already takes two alternates and checks G1-G3 and the alignment.

## Live effect today: none (inert)
- The live pool is one model: Resolve Seats alternates = [sol] in 33617, 33627, 33644 and 33682. Live Init Seats filters mimo out of ALT_ORDER.
- With one model, round 1 tries it, and nothing is left for round 2. The round fires once the pool holds 2 or more models. TIE (pkgODD, live s53) stays the fallback.

## Test: test_A2R.cjs, 145 OK, 0 FAIL (test_A2R.txt)
- Clones:
  - The 22 base sources are unchanged.
  - The 8 library clones and 18 node clones differ only in names, and none names a round-1 chain node.
  - The three R2 Alternate Build patches are each present once.
- Parity on all 27 saved runs with the saved pool: no round 2, and the final Alternate Merge is byte-equal to the saved one (33218 included).
- Panel Tokens is unchanged with no R2 node run (27/27). Format Markdown is unchanged too (23/23; 4 runs skip on base and patched alike).
- Two-model replays. The saved pool plus mimo, from model_config: xiaomi/mimo-v2.6-pro, family xiaomi. Round 2's reply is simulated: round 1's reply with the seat and model renamed, since offline makes no call.
  - 33497 (sol NOT SEATED at the cure), 33222 and 33461 (grok unseated after its alt gate): Second Alternate? runs round 2 for gemini.
  - R2 Alternate Build offers mimo with round 1's system message and transcript. The posture acceptance turn appears only for a model that accepted.
  - G5 refuses the model tried in round 1.
  - Fails again (33497, 33222): gemini stays unfilled. Round 1's body is kept, and only round 2's lines are added.
  - Passes (33222, 33461): mimo sits in gemini's place with drv_uncured 0. Counted seats go 2 -> 3 and 1 -> 2. The removed ruling keeps round 1's lines and adds round 2's SEATED line. The lists are aligned.
- Pool-exhausted control (the same runs on the saved one-model pool): no round 2, the output is byte-equal, and the even count stays (TIE).

## Rebuild
- node pkgA2R/build_A2R.cjs [base strip, default pkgLIB/strip_RI3] [fetchback, default fetchback_live_s61] [out]
- cp -r pkgA2R/out/strip pkgLIB/strip_A2R; LIB_N=30 node pkgLIB/pack.cjs pkgLIB/strip_A2R
- If RI3 is not taken: node pkgA2R/build_A2R.cjs pkgLIB/strip_RMR.

## Revert
- Delete the 29 new nodes.
- Rename Alternate Merge 1 back to Alternate Merge and restore its Dry? edge.
- Restore Panel Tokens, Format Markdown and the LIB (Shared Library and the 22 stubs) from the prewrite copy.
