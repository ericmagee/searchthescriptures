# pkgR1B: reader item 1b (ANSWER CHECK reads go through the shared reader)

Reader phase 2 (Eric approved 16:50 CST 11-07). Item 1b in W3's order (/mnt/project-files/w3/reader_p2_order.md).
This is a library change (one reader swap). It is not a DeepSeek-enforcer change, so it must ride with that gap's graded DeepSeek fix and never holds it.

## What changes
Two judge-text reads in the library used their own regexes on ANSWER CHECK lines. They now use the shared reader (`__acRead`, i.e. `__RL.readLine(...).f` for form ANSWER CHECK, not restated) whenever the reader reads the line with exactly one round. Otherwise the old regex runs unchanged.

1. `gateAnsGround2024` (verse, round, MISSES grade, MEANS NONE skip).
2. `dptCheck` (the DIFFERENT POINT check: verse, round, MEANS).

The same 3 edits are in the 6 nodes that carry these functions: Gate Build, Gate Record, Alt Gate Build, Alt Gate Record, Alternate Merge, Alternate Merge Seat. The other 16 library nodes are byte-identical to v14_KCR2.

| node | v14_KCR2 sha | R1B sha |
|---|---|---|
| Gate Build | 5a57a4ef100a | 725f11466838 |
| Gate Record | bef844609dfc | b3cc5b9f05e9 |
| Alt Gate Build | 57c4eb1fb193 | 59bf25bb52f9 |
| Alt Gate Record | cf00dcf0241d | fb2882398fbf |
| Alternate Merge | 7dd4f89aefdb | 03d019c96083 |
| Alternate Merge Seat | 5568bb638a08 | e936eceeb574 |

## Behaviour (test_R1B.txt)
- Corpus: there are 2162 distinct ANSWER CHECK lines in corpus/texts.jsonl, and the reader reads one round on 1972 of them.
  - gateAnsGround2024 fires on **0 lines that it did not fire on before, and stops firing on 0**.
    - 47 lines are newly read, all from 32998 gemini, which used `[Defender R3]` round labels. All 47 grade MEETS or FAILS, so none fires.
    - On 25 lines the MEANS reads `"none; ledger UNPROVEN"` (quoted), and they now count as MEANS NONE. All 25 grade FAILS, so none fires either way.
  - dptCheck reads the same 47 `[Defender R3]` lines from 32998 gemini, which it rejected before as "the ANSWER CHECK line was not read". The reader maps Defender R<n> to CR<n>, as it does everywhere. On every other line, MEANS is word-identical after dptCheck's own normalisation (krulNorm(kkjvNoMargin())).
  - The reader takes the FIRST grade on a line, while the old gate regex took the LAST MEETS/MISSES. No corpus line differs on this. **W3 to rule** whether first-grade is the wanted rule.
- Replay: the 6 nodes over every saved run (base strip_KCR2 vs strip_R1B) changed 0 outputs. The counts are in test_R1B.txt.
- The packed library pkgLIB_v15_R1B (base layers of v14_KCR2 plus pkgLIB/strip_R1B): all 22 stubs rebuild the strip_R1B sources byte for byte.

## Files
- build_R1B.cjs: anchored edits, from pkgLIB/strip_KCR2 to pkgLIB/strip_R1B/patched. It writes plan_R1B.json.
- test_R1B.cjs / test_R1B.txt: static checks, the corpus comparison, the replay and the stub rebuild.
- ../pkgLIB_v15_R1B/: what W4 writes (Shared Library plus 22 stubs, plan_LIB.json). The stubs all change because library line numbers shift.

## Write (W4, at a gap, stacked on that gap's DeepSeek fix)
Write pkgLIB_v15_R1B in the same way as v14_KCR2: Shared Library jsCode plus the 22 stub jsCodes. Fetch back and compare the shas.
Revert: the v14_KCR2 copies (pkgLIB_v14_KCR2/patched).
