# pkgWLD (tracker D51, W2, 11-08): witness ledger stage 2, "NAMED IN AN ANSWER"

Approved redesign item 2 (Eric 07:42 CST 11-08; W3 3161/3167). Stage 1 (107bb8e, Wall 3172) measured the ledger's "named" test: about 5%
false-NAMED on the defender side, because any mention counted. W3 3174 (b): stage 2 builds from answer sections only.

## Change (Panel Build, Build Independent Verdict; the PRESSED-WITNESS LEDGER block, identical in both)
Counts, NOT NAMED lists and every other output line are unchanged. Each premise line now says where each named proven witness is named:
- `NAMED IN AN ANSWER: <verse> [<round>] "<words>"`: the verse is named as an answer, in one of these forms:
  1. a `MEANS [<round>]` header line;
  2. a bold label that opens with the verse (`**Genesis 4:1** ...`);
  3. a press answered by its id (pkgWLA: `MEANS [CR3] P<n>.<k>: "<the press's MEANS>"` with a layer-tagged block);
  4. a list item that opens with the verse under an `Answer ... press/witness` heading (to the next `---`, LINK, markdown or italic heading).
  A line that restates a press (PRESSED WITH, "The press means") never counts.
- `NAMED ONLY IN OTHER TEXT: <verse> [<round>] "<words>"`: named, but not in one of those forms.
- The closing sentence: NOT NAMED stays "unanswered by the rule". NAMED IN AN ANSWER: the judge may still find the answer MISSES and grade the
  link BROKEN with a FORCED line that quotes it, but may not write that the witness was unanswered. NAMED ONLY IN OTHER TEXT: the judge decides,
  as today. One rule for both sides.
- Reserve Build and Alternate Build reuse Panel Build's prompt, so they carry the same ledger.

| node | live s68 | pkgWLD (on s68) | on pkgKWI rev 2 + pkgJGR (pkgWLD/on_JGR_KWI) |
|---|---|---|---|
| Panel Build | d5544003283e | 0228b9e6c64d | 77c4eb2aafd0 -> 285e37faf258 |
| Build Independent Verdict | 6c4e6e4d004d | 91fc5d4bb579 | 51ebc43626e7 -> dcea708e1650 |

on_JGR_KWI is built on pkgJGR/on_KWI (JGR restacked on pkgKWI rev 2). Checked: its line changes against that base equal pkgWLD's line
changes against s68, for both nodes. Write it when KWI and JGR go in first.

## Test (test_WLD.cjs: 62 OK, 0 FAIL; test_WLD.txt, samples_WLD.txt)
- Replays both nodes, s68 vs patched, on every saved run. Bar on each run: only ledger premise lines and the closing sentence change; with the two
  new segments removed each premise line equals the base line; the listed witnesses equal the line's named count.
- Panel Build (3 judge prompts per run, 31 runs): NAMED IN AN ANSWER 3720, NAMED ONLY IN OTHER TEXT 1137 (77% / 23%).
- terra's removals: 33644 Hebrews 7:14, Isaiah 7:16, Luke 1:35 and 33617 Genesis 4:1, Isaiah 8:4 all read NAMED IN AN ANSWER.
- Hand sample: 25 random non-MEANS "answer" entries (seed 51) read from their quoted words: each one takes up the verse it names. A grader
  should read more of samples_WLD.txt against the rounds.
- Size: about 6,000 more characters per judge prompt (max 7,400). The quoted words are up to about 120 characters; they can be cut if cost matters.

## Not in this package (ASKs)
- Gate: kg4Split still rules a judge's "unanswered" claim false on any mention. Aligning it to NAMED IN AN ANSWER is a ruling change for W3.
- DeepSeek: the ledger is not yet shown to the DeepSeek builders (W3 3166 item 2). Needs a choice of which item kinds get it.
- D49 (pkgKGA + pkgG4R2) stays the held fallback until this is live and run-proven.

Build: `node pkgWLD/build_WLD.cjs` (s68) and `WLD_NODE_DIR=pkgJGR/on_KWI/patched node pkgWLD/build_WLD.cjs /mnt/project-files/wall2024/fetchback_live_s68.json pkgWLD/on_JGR_KWI/patched`.
Test: `node pkgWLD/test_WLD.cjs`. Revert: restore the two nodes from the prewrite copy.
