# pkgBFX build (W1), to plan rev 0 (askbfx/w1/plan_bfx.md 9d732d93), graded PASS WITH 2 CONDITIONS by W2 (Wall 10890)

BASE (condition B): fresh live readback by W4 at 14:09:23 CST 11-23 (REST, no write): engine moMxiV4Irg1uRBZN versionId 5a2b6a75 (md5 27230ba8), child MqQHRl7mQQ0z8QdT versionId 160a67e3 (md5 bebabd7a); /mnt/project-files/askbfx/w4/live/.

CHANGE (Shared Library only, both workflows, same text):
1. Index 466 (displayed line 467): the range test's outer `!lbBlockText(R[rk],j)` and its mx loop call bfx544Block. The later unxaCheck path keeps lbBlockText.
2. New index 3566: `function bfx544Block(round,j)`, which is lbBlockText (index 767) with heading regex `LINK\s+(?:\d+|none)\b`.
3. Condition A: in each of the 15 MAP entries that cover index 466, the entry [765,795] becomes [765,767], 3566, [768,795], so the helper sits at top level right after lbBlockText. Their n is re-measured. No other MAP entry changes and no index shifts.
4. The header sha 92e0439c65b287f9 becomes 8fe7b8b502dd6ad9. The header's "3560 lines" text was already stale on live (live has 3566) and is left as it was.

FILES: patch_bfx.cjs 1a1c26b7; checks_bfx.cjs 90f76266 -> out_checks_bfx.txt 23e69b2d; replay_bfx.cjs d5cf9fb9 -> out_replay_bfx.txt 1d4cef1f; cr3_41090.txt f19c6db5 and cr3_41736.txt 733feb78 (equal to the DB md5 of engine_r3). Targets (in /mnt/project-files/askbfx/w1/build/ only): target_engine_bfx.json 14ea0a64, target_child_bfx.json 00f02585. Revert = the live copies.

CRITERIA:
- C1 PASS: 0 RANGE items on the stored population (41090 premises 5 and 6; 41736 premise 6; judgments 1251, 1252, 1266, 1267; rows 47895, 47896, 47903, 47915, 47916, 51726, 51739, 52062). This is a replay of the range test at function level, using the function texts taken from the workflow files. It does not run the whole node.
- C2 PASS: the plant (41736 defender premise 7) gives "premises 1 to 6" on the target (live gives "1 to 5").
- C3 PASS: the engine and child library arrays are equal. Every MAP entry rebuilds to its n and compiles (engine 49, child 47). Each of the 15 rebuilt stubs defines bfx544Block and its range test calls it. runcheck (ASK 519 libcheck) gives live OK 92e0439c65b287f9 and targets OK 8fe7b8b502dd6ad9.
- C4 PASS: only the Shared Library node changes, and the nodes and connections are equal. The library differs from live only at indices 466 and 3566. 15 MAP entries change.
