# GRADE, ASK 581 plan draft 1 (W1; ASK581_plan.md md5 85440efd, commit 4a0c52fc). Grader: W3. VERDICT: FAIL on one defect (D1). Everything else reproduces.

## Reproduced (my own run; scripts taken from commit 4a0c52fc, unchanged)
1. build581.cjs on W4's stacked base (engine 21155110, child 417a53f7): LIB 3534, 3535, 3536 change and no other LIB line (my own line compare); 3,582 lines; library 89d25eb67157df22; MAP LAY 13,455 to 15,677 and no other MAP entry (my own compare over 56 entries); Shared Library 1,157,501 to 1,159,784 (engine) and 1,157,322 to 1,159,605 (child); LIB text of engine equals child.
2. My child target equals target_child_581.json (53d45cb6). My engine target differs from target_engine_581.json (4d0681d6) in one field only: the id of node D1 Check (148b09d8 in W4's stack file, 6269af9c in W1's). Every node's parameters are equal. The plan names W4's stack file as the base; the target was cut on W1's own reproduction. Not a defect; the builder re-cuts on a fresh fetch.
3. Pair check (W4's test557.js --pair) on my targets: lib 89d25eb67157df22, map 8dbe4aad6b92291c both sides, Library Check PASSES.
4. test581.cjs: 19 checks ALL PASS. replay581.cjs: 117 checks, 761 items before and after, 0 new, 0 gone. replay581_562.cjs: 562 alone 36, 562 with 581 28; the 8 cleared are the 8 named; 0 new; run 41822's eight rounds 4,4,0,1,0,0,0,0, unchanged.

## D1 (defect): ref581 credits a number that is not a verse, and plan section 7 item 2 states the opposite
Plan 7.2: a time such as "18:23" could be read as a verse, and "the credit test then looks for the quotation in that verse's row and fails". Measured (plant.cjs, with the plan's own rows.json): it does not fail when that verse's row is not among the rows. The block passes.
- D: '[L1] Luke 1:35: "The Holy Ghost shall come upon thee"' and '[L3] Luke 1:35 was read at 10:30 "in the morning service of the church".' Before: 1 item (one verse only). After: 0 items.
- F: the same with 'outweighs the rest 3:1, "..."'. Before 1, after 0.
- B: '[L3] Luke 1:35 again, and at 1:8 "after that the Holy Ghost is come upon you".' The words are Acts 1:8; ref581 reads Luke 1:8. Before 1, after 0.
- plant2.cjs: the plan's own P7 with a made-up quotation: row of Genesis 24:16 present, after = 1 item (the words test works); row absent, after = 0 items.
Cause: credit is permissive for a verse whose row is not held (existing behaviour: a full reference with no row passes today, control D0). ref581 makes a reference out of text that is not one, and such a reference will usually have no row. So for form (e) the sentence "The credit test is unchanged: the words must stand in the verse's row" holds only when the derived verse's row is held.
Not known to me, for W1 to read: whether the live sheet ever holds the row of a derived reference (the sheet is built from the references the scan reads; the scan does not read a bare chapter:verse).
To pass: (a) correct 7.2 to what is measured; (b) either ref581 gives the book only when the derived verse's row is held (verses() has RW in hand), or state the limit plainly and show what the live sheet holds for item #24; (c) add negative controls for a time, a ratio and a wrong-book bare reference with the row absent.

## Notes (no change required to pass; state them as limits)
N1. trail581, a sentence that speaks about a tag: 'My opponent offers "after that the Holy Ghost is come upon you" (Acts 1:8), but never tags it [L3].' Before 1 item, after 0. The stop list covers "no", "not" and the like directly before the tag only.
N2. A combined tag that holds 1 reads as [L1] whatever else it holds: "[L1-L4] ..." before 1 item, after 0. As the plan says; stated so the builder's grader sees it.
N3. The extra read line of trail581 can raise the "tagged verse(s) quoted with no reference" count in the why text of an item that is flagged anyway (plant G). No item is added or removed by it.

Files: fairjudge/w3/g581/grade.md, plant.cjs, plant2.cjs, plant.out.
