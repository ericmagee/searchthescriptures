# pkgWLDDS (D51 part 2, W2, 11-08): DeepSeek sees the witness ledger the judges saw

Scope: W3 ruling 3435 (E-HOLD; E-COL when it names a pressed verse), covered by Eric's 07:42 approval of D51. A DeepSeek change.

## Change (Judge Enforcer Build, Alt Judge Enforcer Build, R2 Alt Judge Enforcer Build; base pkgKWI/patched, KWI rev 2)
- The ledger is read from Panel Build's own judge prompt (its PRESSED-WITNESS LEDGER block, with pkgWLD's NAMED IN AN ANSWER / NAMED ONLY IN
  OTHER TEXT segments and the NOT NAMED list), so DeepSeek and the judges read one text. `__L` gains `Panel Build`.
- An E-COL item and an E-HOLD item get, after the line, one ledger entry for each pressed witness the line names (none when it names none; at most 6):
  `- Genesis 4:1 (pressed against the DEFENDER, premise 5): NAMED IN AN ANSWER [CR3] "<words>"`.
- RULE E-COL and RULE E-HOLD each open with one sentence: a witness NAMED IN AN ANSWER was answered by name, so a line that rests on it being
  unanswered is wrong on that ground (DISAGREE, and say so), though whether the answer meets is still read from its words; NOT NAMED was named
  in no later round of the answering side; NAMED ONLY IN OTHER TEXT decides neither.
- No ledger in the prompt, or none of the line's verses pressed: the item is unchanged.

| node | base (KWI rev 2) | patched |
|---|---|---|
| Judge Enforcer Build | 7cbf9922cf70 | 04b1c819dcf7 |
| Alt Judge Enforcer Build | 8ebcf2ec8b43 | 51cff28aa534 |
| R2 Alt Judge Enforcer Build | 7054489eb7be | 498b6a218df4 |

## Test (test_WLDDS.cjs: 66 OK, 0 FAIL; test_WLDDS.txt)
- Per saved run, Panel Build is run with pkgWLD (on_KWI), and JEB / Alt JEB are replayed base vs patched with $('Panel Build') set to it.
- Bar: with the ledger blocks and the rule sentence removed, the item stream, the id set and not_checked are unchanged on every run.
- 925 item blocks; entries: NAMED IN AN ANSWER 2081, NAMED ONLY IN OTHER TEXT 495, NOT NAMED 0 (no saved run has a NOT NAMED proven witness after pkgWLA).
- DeepSeek calls 287 -> 299 over the replayed runs (items move between calls under the 40,000-char cap; not_checked unchanged everywhere).
- With the live s68 Panel Build (old ledger: no NAMED IN AN ANSWER segments) the items are unchanged (33644, 33828): so pkgWLD must be live first.
- R2 Alt JEB has no saved run; it takes the same 6 edits as Alt JEB (same anchors, same text).

Write order: after pkgWLD (Panel Build, BIV). Build: `node pkgWLDDS/build_WLDDS.cjs [base dir=pkgKWI/patched]`. Revert: the 3 nodes from the prewrite copy.
