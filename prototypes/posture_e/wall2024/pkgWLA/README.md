# pkgWLA (tracker D57): the witness ledger reads a press answered by its id (W2, 11-08; W3 assigned; approved redesign item 2)

## Fault (33731)
- The PRESSED-WITNESS LEDGER in the judge prompts counted a proven press "named" only when the answering round wrote the verse reference.
- In [DR3], the challenger answered the [CR3] presses on Genesis 3:15 by press id:
  - `MEANS [CR3] P3.5: "seed is said of the woman"`, answered with [L1] Genesis 4:25 and [L2] zera'.
  - `MEANS [CR3] P4.4: "seed is said of the woman"`, answered the same way.
  Neither answer writes "3:15".
- The ledger printed "NOT NAMED: Genesis 3:15" for premises 3 and 4.
- sol counted 2 Oracle concedes on that line, and its K-UNX statement cites "the governing ledger". gemini's RULING cards followed the same line.
- In all 21 saved runs, the challenger answers [CR3] presses by id. The defender never answers [DR2] presses by id: 0 such headers in [CR3].

## Change (Panel Build, Build Independent Verdict; the two judge ledgers)
- Challenger side only: a proven press now counts as named when [DR3] has all of the following:
  1. A header `MEANS [CR3] P<n>.<k>: <quote>` for the same premise n.
  2. A quote that equals the press's own MEANS sentence after normalisation: case, quote marks and punctuation removed, and at least 8 characters.
  3. An answer block below the header, before the next MEANS header, `---` or LINK heading, that holds an [L1], [L2] or [L3] tag.
- Everything else is unchanged, including the reference test, early-round answers, UNPROVEN presses and the cap.

| node | live s63 | patched |
|---|---|---|
| Panel Build | 19a70deba2a7 | cce2da2ea6d2 |
| Build Independent Verdict | 4b43139b589e | c4eba96a04b2 |

## Test (test_WLA.cjs: 52 OK, 0 FAIL; test_WLA.txt)
- 52 node runs replayed, live s63 against patched. The skipped runs throw on base too: old runs, or empty transcripts.
- Only 33731 changes:
  - Panel Build: 6 lines, premises 3 and 4 in each of the 3 judge prompts.
  - Build Independent Verdict: 2 lines.
  - Each change moves "NOT NAMED: Genesis 3:15" to "none" and raises the named count by 1. No other line of any output changes.
- Before the patch, 33731 is the only saved run with a challenger-side NOT NAMED. After it, there are none.

## Live bar
- In the next run whose [DR3] answers a press only by id, the ledger shows it named.
- No judge counts an Oracle concede on such a press.

## Revert
Restore the two nodes from the prewrite copy.

Rebuild: node pkgWLA/build_WLA.cjs [fetchback, default s63].
