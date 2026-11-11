# W2: exact R1 and R3 wording, sizes, and a paid replay test plan (nothing run; a paid replay needs the operator's word)

## Wording (anchor: "or differs only in wording." occurs once in each of Judge Contradiction Build and Close Enforcer Build, live s116)
- R1, inserted right after that anchor in both nodes:
  ` Read each sentence within its own block, as that block narrowed or granted it; a contradiction must stand between the two sentences' own words, not between words your reason adds.`
- R3, the anchor becomes:
  `or differs only in wording, or holds again, on its rows, what the side dropped only as a bare statement.`

## Sizes (MEASURED, size_r1r3.cjs; each edited node parses)
| | DeepSeek-read text per node | Code per node (source, apostrophe escaped) | Both nodes, code |
|---|---|---|---|
| R1 | +180 | +181 | +362 |
| R3 | +77 | +77 | +154 |
| R1 + R3 | +257 | +258 | +516 |
Fixed judge prompts: 0. Only the two DeepSeek enforcer instructions change.

## Stored facts that shape the test (MEASURED)
- Close Enforcer input of 34626 equals that of 34703 byte for byte; both CONFIRMED link 6. Close Enforcer input of 34726 equals 34780; both CONFIRMED link 1. So the close enforcer gave the same answer twice on each input; the two-answer case is the Judge Contradiction call (34726 vs 34780, inputs differing only in the candidate quote marks).
- Consequence: R2 (two draws must agree) would NOT have stopped the link 6 confirmation (2 of 2 draws agreed). Only a wording remedy can.

## Test: replay stored bodies with the wording swapped, N draws each, temperature 0 as live
Bodies (taken from the stored Build outputs, only the instruction text changed):
- A: Judge Contradiction, 34726 (J1 link 4 wrongful; link 1 found as NEW, true)
- B: Judge Contradiction, 34780 (same debate; J1 not confirmed)
- C: Close Enforcer, 34703 (= 34626; link 6 NEW, wrongful on W2's reading, W3 to rule)
- D: Close Enforcer, 34726 (= 34780; link 1 X1, true)
Variants: A and B: live, R1, R1+R3. C and D: live, R1, R3, R1+R3.
Draws: 5 each. Calls: A, B 2 x 3 x 5 = 30; C, D 2 x 4 x 5 = 40; total 70. A 3-draw plan is 42 calls.

PASS for a remedy: link 4 (A, B) CONFIRMED in 0 of 5; link 6 (C) CONFIRMED in 0 of 5; link 1 CONFIRMED in 5 of 5 in A, B and D. Any other CONFIRMED line that appears is hand-read by two seats. The live draws give the split rate for R2 at no extra cost.

## Cost (tokens from the stored usage rows; dollars NOT estimated: no DeepSeek rate is in the record)
| Body | input tokens per call | output tokens per call (stored) | calls (5-draw plan) |
|---|---|---|---|
| A | 42,079 | 15,292 | 15 |
| B | 42,143 | 14,648 | 15 |
| C | 18,732 | 7,522 to 18,687 | 20 |
| D | 20,341 | 10,555 to 19,843 | 20 |
5-draw total (ESTIMATE): about 2.04 million input and about 1.0 million output tokens (output mostly reasoning tokens). The 3-draw plan is 60 percent of that. The variants add at most 65 input tokens per call.

## Revision after W3's ruling (18:45 CST): R1 only
- R3 dropped (see README section 6). Variants: live and R1 on all four bodies.
- Pass for body C (link 6): CONFIRMED in 5 of 5 draws (the break is right). Each draw's quoted closing sentence is recorded; a draw quoting "I keep D1 through D6 as declared." is the right pair, a draw quoting only "Christ had no biological father." is the right result on the wrong pair and is reported as such. A draw that drops link 6 is a FAIL for R1.
- Pass for A and B (link 4): CONFIRMED in 0 of 5. Pass for link 1 (A, B, D): CONFIRMED in 5 of 5.
- Calls: 4 bodies x 2 variants x 5 draws = 40 (3-draw plan: 24). Tokens (ESTIMATE from stored usage rows): about 1.23 million input and 0.58 million output for 40 calls. Dollars not estimated: no DeepSeek rate in the record.
- Size of R1 unchanged: +180 DeepSeek-read characters per node, +362 code over both nodes (MEASURED).
