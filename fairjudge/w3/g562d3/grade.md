# GRADE, ASK 562 plan draft 3 re-cut on 581 draft 2 (W1; ASK562_plan_draft3.md md5 5897094a, commit 651d56c1). Grader: W3. VERDICT: PASS WITH ONE CONDITION (C1, evidence and wording only; the targets stand).

## Reproduced (W1's scripts unchanged, my own run)
1. build562.cjs on the 581 draft 2 targets (engine 33ef5599, child b0ffc613): my targets equal the mount's byte for byte (engine aa9e5cdf, child 44e9c851). LIB 3504 and 3547 only; library 0e1cce8f1b596ea4; MAP LAY 15,842 to 16,191, no other entry; +382 characters each.
2. Pair check (W4's test557.js --pair): lib 0e1cce8f1b596ea4, map 1c16aec5da4a85e9 both sides, Library Check PASSES.
3. test562d3.cjs: 9 checks ALL PASS.
4. replay562d3.cjs: 64 checks, 303 to 329 items, 28 new in 12 checks, 2 gone (the two "## PRESSES AGAINST THE DEFENDER'S CHAIN" blocks). My results file equals W1's byte for byte (98eaf031). Run 41822 unchanged.
5. My own count over the 50 stored rounds, plain and with the Oracle gate: 0 new items stand on a head that does not hold "against". So no PRESS or CP block of the stored rounds gains an item.

## C1 (condition): state the effect under the Oracle gate
The replay runs the 50 stored rounds without the Oracle gate. D2B, D3B and D4B Build pass {oracle:true} when the defender is the Oracle (ASK 557 Change D), and an "against" block is then also tested for an [L2] line and an [L4] line. Measured by me on the 11 stored defender rounds (CR2 and CR4), 581 against 581 with 562: plain, 8 new items; with the Oracle gate, 13 new items, 11 of them naming a missing [L2] or [L4]. On all 50 rounds with the gate the count goes from 426 to 504 (27 rounds change); 39 of those 50 are challenger rounds, which the gate never reads in a run. Section 5.3 and section 6 give 28 only.
To meet C1: add the Oracle-gate figures for the defender rounds to 5.3 and 6, and put them on the card, since the Oracle is the seat the operator's rulings of 16:52 and 16:54 CST 11-23 bind to the layers. No code change is asked.

## Notes (limits to state; no change required)
N1. An "against" line inside a PRESS block now ends that block. A PRESS block whose point is followed by "**Against D2.** ..." and then its verses passed before and is flagged after (plant P6: before 0, after 1), because its verses now stand in the new block. None in the stored rounds (item 5).
N2. A prose line that begins "Against D1 ..." or "against C5 ...", holds no full stop, and ends in ":" within 80 characters reads as a head (plants P3 and P9: before 0, after 1). This is the planned "D3 against C5:" form reaching prose.
N3. A title-only head with a blank line and then prose under it still opens a block (plant P1), as planned.

Files: fairjudge/w3/g562d3/grade.md, plant.cjs, plant.out.
