# ASK 542 RE-CUT on the post-534 base (W3, seat 33), for W1's grade

This re-cut replaces the 542 targets in ask542/w3/build/, which were cut on daf5da98. It authorizes nothing. W4 alone writes to n8n.

## 1. BASE

534 was written at 12:31 CST. The base is the 534 write's fetch-backs, copied here:
- live_engine.json: 70e8760d, engine 6341b2c4, updatedAt 18:31:07.135Z.
- live_child.json: 878055e8, child d8503277, updatedAt 18:31:12.333Z.
- Library header sha 3a182107f407c262.

The stack is now 530, 536, 532, 528 (text only) and 534.

## 2. TARGETS

The graded patch542.js (8d8262df, unchanged) was run on the base. Its logs are patch_engine.txt and patch_child.txt.
- target_engine_542.json: 06e76d83.
- target_child_542.json: a631f299.
- Index 479 changes from 9b0d81f8 to 0e1691be, as in the build.
- MAP n is re-measured in the same 15 entries, +94 each.
- The header sha changes from 3a182107f407c262 to faf94f70c3f08609.

## 3. SAME CHANGE AS GRADED

cmp.cjs (W4's, from ask534/w4/recut) compares the graded change (build live542 to build target) with the re-cut change (out_checks.txt b3678ff7).
- The result is SAME CHANGE in the engine and the child.
- Only Library index 479 changes, to 0e1691be.
- No node other than Shared Library changes.
- The line count is 3,566.

## 4. CHECKS (out_checks.txt)

- runcheck is OK on both targets: faf94f70c3f08609.
- The ASK 539 pair check PASSES: map 6ec1f2c2022ab715.

## 5. CRITERIA RERUN ON THE NEW BASE

**kb542 (unit and known bad).** out_kb542_recut.txt (fdb867f4) is identical to the graded out_kb542.txt.

**W4's criterion 4 scripts.** These ran with only the base, target, sandbox and output paths changed. Copies are in replay/.

| output | graded (W4, Wall 10804) | new base |
|---|---|---|
| out_replay542.json (set B, 548 judgments) | 936b6df2 | 936b6df2, equal |
| out_detail542.txt (4(a) items) | 1e7a5565 | 1e7a5565, equal |
| out_first542.txt (set A) | acd17956 | 6653f461 |
| out_kb542_first.txt | 86af582c | 2e02dda3 |

out_first542.txt and out_kb542_first.txt differ only on 41418 sol62 (Panel Judge 1):
- Under the graded base, OLD and NEW both raised DEFENDER premises 1, 2 and 3 [474-478] and CHALLENGER premise 3 [460 ASSUMES].
- Under the new base, OLD and NEW both raise CHALLENGER premise 3 [460 ASSUMES] only.
- The three [474-478] items are gone under OLD as well as NEW. That is the effect of 536 (W4 RECUT533.md section 5), not of 542.
- OLD equals NEW in both outputs, as before.

## 6. NOTES

- On first replies, 536 already removes sol62's three items, which were the known-bad case. 542 still exempts them on the stored text (kb542, rows 51202 and 51203).
- Any write before 542 moves the base again, and the re-cut must then be run again.
