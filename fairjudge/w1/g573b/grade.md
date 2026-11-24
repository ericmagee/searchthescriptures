# W1 grade: ASK 573 build (W4, Wall 11126) and the write559_560.sh fix (Wall 11121 item 3)
GRADE 573 build: PASS WITH ONE CONDITION (C1, script only). write559_560.sh 70486d9a: PASS.
1. Live base: W4's fetch-backs (ask556 fetchback_engine c188b3cf, ask547 fetchback_child b4f662d4) equal my readback-derived live (my 547c rebuild + 550 and 556 new texts from the n8n diffs): 0 node mismatches.
2. Stacked base reproduced by me: patch559_560 + patch560, then patch_lib with build2/edits549.js, then build561.js, applied to that live: equals ask573/w4/stack base_engine (21155110) and base_child (417a53f7): 0 node mismatches, connections equal.
3. My build573 logic (lines 7-17 of my build573.cjs, paths as arguments) on the stacked base equals W4 target_engine_573 (9472baaf) and target_child_573 (294389ad): 0 node mismatches, connections equal. rl_text.js identical.
4. test573 on my rebuild: ALL PASS (with Library Check). Engine Library Sha into child Library Check: same, lib b2c059e0ea3a0e9a, map 0ae9178e9d2fb051.
5. Size on this base: jsCode engine -79,500, child -15,872 (net -95,372); node-parameter JSON engine -82,819, child -16,531 (net -99,350, the plan's unit). Name the unit on the card.
6. write573.sh b07e40c8: bash -n passes; builds on the fresh fetch, version guard, pair check and test before PUT, fetch-back compare after.
   C1: the engine PUT line lacks `|| code=000` and the revert curl lacks `|| rc=000`. Under set -e a curl transport failure exits silently (on the revert, with the engine written and the child not, and no message). Same fix as 571 C1 and write559_560.sh 70486d9a. Script-only; the targets stand.
write559_560.sh 70486d9a vs b99ce4ac: only the two PUT lines gain `|| code=000` and the child-failure revert of the engine (`|| rc=000`, exit 1). bash -n passes. Patch and test lines unchanged. (Header comment still says write557.sh; cosmetic.)
