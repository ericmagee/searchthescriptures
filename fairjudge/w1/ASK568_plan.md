# ASK 568 plan, draft 1b (W1, seat 34)

Draft 1a answers W3 Wall 11028 (PASS with C1, C2, N1). Draft 1b closes C1 with W4 Wall 11027.

## OBJECTIVE
Every Strong's number on the verses in dispute is served on the [L2] SHEET with its gloss. Luke 1:35 G2316 (theos) is the known hole: with ASK 565 alone, the D2 sheet drops it over the cap.

## FINDING (measured, not guessed)
1. The order is not the cause. sheet() already serves the PRESSED WITH verses first (sheetPlan). At D2 no round has a PRESSED WITH block yet (CR1 0, DR1 0), so the order is the order of first citation, and Luke 1:35 (cited only in DR1 at that point) is verse 40 of 58.
2. The cap is the cause. On the 41822 inputs, all content numbers on all cited verses need 105,160 row characters at D2 and 109,124 at D3 and D4. The cap is 26,000. With 565 alone the D2 sheet leaves 269 of 645 content numbers unserved, D3 273 of 682, D4 273 of 682.
3. No order rule fixes this inside 26,000. Only about a quarter of the rows fit. Any rule that picks "verses in dispute" from the text alone does not pick Luke 1:35 at D2: it is cited by one side only and not yet pressed. So the fix is the cap.
4. The reads already fetch everything. Lexicon Plan emits one URL per 250 numbers and the HTTP node runs once per URL. Words Plan emits all verse batches. The test harness used the same row set (354 lexicon rows at D2).

## CHANGE (6 nodes, engine moMxiV4Irg1uRBZN only)
In each of the 6 Builds (D2 Build, C2 Build, D3 Build, C3 Build, D4 Build, C4 Build), replace once:
- before: `const CAPC=26000;`
- after:  `const CAPC=130000;`

Notes:
1. The string occurs once in each Build. It also occurs in 13 Extract nodes, 7 Lexicon Plans and the Shared Library. Those copies do not build the served sheet, so they are not touched (scope rule). The Shared Library sha does not change.
2. The tail text "numbers over the sheet cap of N characters" reads CAPC, so it reports the new value with no other edit.
3. 130,000 is the largest 41822 sheet (109,124 row characters) plus about 19 percent. If a later debate goes over it, the existing LEFT OFF tail names the numbers. Nothing is dropped silently.
4. Ships with ASK 565 (cited numbers first). The tests below run 565 and 568 together.

## TESTS (41822 D2, D3, D4; harness fairjudge/w1/a568/m7.js, output m7_out.txt)
Inputs: W4's ow_d2_41822.json, lx_d2_41822_plus.json, p_c1b_41822.json, rounds41822.json; the L2C code taken from the 557 fetch-back D2 Build; REFP rebuilt from the fetch-back Shared Library. D3 and D4 add Luke 1:32, Acts 1:8 and 2 Samuel 7:14. Their words came from original_words, and the 31 new lexicon rows are padded to their true line lengths (SQL length of the served line). The other rows are real.

| Sheet | Build | Characters | Rows | Content numbers unserved | Luke 1:35 | G2316 | G1352 | Over-cap tail |
|---|---|---|---|---|---|---|---|---|
| D2 | 565 only | 28,639 | 85 | 269 of 645 | 10 of 15 | no | yes | yes |
| D2 | 565 + 568 | 105,949 | 354 | 0 of 645 | 15 of 15 | yes | yes | no |
| D3 | 565 only | 28,782 | 94 | 273 of 682 | 15 of 15 | yes | yes | yes |
| D3 | 565 + 568 | 109,913 | 367 | 0 of 682 | 15 of 15 | yes | yes | no |
| D4 | 565 only | 28,782 | 94 | 273 of 682 | 15 of 15 | yes | yes | yes |
| D4 | 565 + 568 | 109,913 | 367 | 0 of 682 | 15 of 15 | yes | yes | no |

The Luke 1:35 numbers checked are G611 G32 G3004 G4151 G40 G1904 G1411 G5310 G1982 G1352 G1080 G1537 G2564 G5207 G2316.

D4's prior rounds cite no verse that D3's do not, so the D3 and D4 rows are equal.

## COST (for the operator's card)
1. Each Build's user message grows by up to about 81,000 characters (105,949 minus the 26,000 cap rows on 41822). That is roughly 25,000 to 30,000 tokens per call. This is an estimate, NOT measured in tokens.
2. Calls that carry the sheet (W3 C2):
   a. The 6 Builds (D2, C2, D3, C3, D4, C4), every run.
   b. The 6 B re-calls (D2B, C2B, D3B, C3B, D4B, C4B Build). Each one copies the Build's call body (`JSON.parse(JSON.stringify(B.body))` from `$('<side><n> Build')`), so it carries the same sheet. A B re-call fires only when its BAR or LAY check fails.
3. Range per run: 6 calls (no re-sends) to 12 calls (every re-send fires). That is about 150,000 to 360,000 more input tokens. Against the 41822 run's 1,396,289 input tokens, that is about 11 to 26 percent. These figures are estimates, not measurements.
4. CONTEXT FIT (W3 C1), measured by W4 at Wall 11027 on the live engine 215e327a and 41822's own usage:
   a. Largest prompts: D4 (Oracle, meta/muse-spark-1.3) was 76,365 prompt tokens. C4 (challenger, claude-sonnet-5.5) was 28,966.
   b. Worst case with 568, taking 104,000 more characters at 2.5 characters per token and about 5,000 for a B re-call: about 123,000 tokens for the Oracle and about 71,000 for the challenger.
   c. Contexts per OpenRouter: muse-spark-1.3 1,048,576; sonnet-5.5 1,000,000. Both fit, and both would still fit under a 200,000 limit.
   d. Caching: on 41822 D4, 58,353 of 76,365 prompt tokens were read from cache. Whether the added rows are cached was not measured.
5. Token count for the card: at W4's 2.5 characters per token, the added rows are up to about 42,000 tokens per call. That puts the upper range above at about 500,000 tokens (12 calls). The card states the range as 150,000 to 500,000 more input tokens per run, which is an estimate.

## WHAT 565 DOES WITH 568 (W3 N1)
With the cap at 130,000, the 41822 sheets hold every content number with or without 565. So, with 568, 565 changes only the order (cited numbers first). It decides which rows survive only when a later debate goes past 130,000. The card says so.

## NOT CHANGED
Judges, guards, LAY/BAR/IMP, model settings, the Verse Sheet cap, the order (sheetPlan), and the 565 tier text.

## ROLLBACK
Set `const CAPC=26000;` back in the same 6 Builds.
