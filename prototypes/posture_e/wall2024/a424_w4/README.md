# ASK 424 build (W4), plan W3 rev 3 (5ceee971); grades of the plan W1 8902, W2 8903

Base: engine moMxiV4Irg1uRBZN db091b9e, child MqQHRl7mQQ0z8QdT 0e006a24 (fresh fetch, 23:10Z).

    node build424.cjs ENG CHILD db091b9e-4a6b-4c2a-a35a-e83f1c4cbe5f 0e006a24-8100-4186-b32c-ae218eb0b236 ENG_OUT CHILD_OUT
    node t424.cjs ENG CHILD ENG_OUT CHILD_OUT d1_all.json      # writes t424_out.txt

- readers.json: the five old/new reader texts (R1 chain_count, R2 drvLinks, R3 drvChainOf, NUM = declared/cecDeclared line test, DL = dlinks/cecDlinks capture).
- pairs_424.json: the library pairs (R1 to R3), applied to the engine and the child by lib_apply.cjs (refuses if the two library shas differ).
- d1_all.json / d1_all.sql: the 245 stored claude_r1 texts with a DECLARED CHAIN heading, and the SQL that checks the set.
- t424_out.txt: DONE WHEN 1 to 4 and 7. DONE WHEN 5 is in the Wall post (rbx readback, ASK 385 check, $( count).

## R6 rebuild (W3 8930): the inline MAP readers chainCount and chain_lines ("Extract Independent Verdict", parts 117 and 123)

OBJECTIVE: every reader of the DECLARED CHAIN in the engine and the child reads the same heads, so that "D1:", "D1." and "**1.**" chains are counted and listed, and no reader that reads a chain today reads it differently.

    node build424.cjs ENG CHILD db091b9e-4a6b-4c2a-a35a-e83f1c4cbe5f 0e006a24-8100-4186-b32c-ae218eb0b236 ENG_OUT CHILD_OUT   # build_out.txt; 4 pairs (3 lib, 1 map x2)
    node ../a418_w4/replay418.cjs --base ENG --cand ENG_OUT --spec r6/spec424_<r>.json --rows r6/rows_d1.json      # r6/out424_<r>.txt (engine)
    node ../a418_w4/childspec.cjs CHILD r6/spec424_<r>.json r6/spec424c_<r>.json                                   # child sources only
    node ../a418_w4/replay418.cjs --base CHILD --cand CHILD_OUT --spec r6/spec424c_<r>.json --rows r6/rows_d1.json  # r6/out424c_<r>.txt (child)
    node r6d.cjs ENG CHILD ENG_OUT CHILD_OUT        # r6d_out.txt
    node r6e.cjs ENG CHILD ENG_OUT CHILD_OUT > r6e_out.txt && node r6e_why.cjs r6e_out.txt r6e_why_out.txt

- replay418.cjs needs acorn under ../tools/node_modules (npm install acorn in tools/).
- lib_apply.cjs now applies "map" pairs to inline MAP parts (with a count) and refuses when the two MAPs differ in anything but the engine-only REFP entry.
- r6c_out.txt: the stored "AGAINST DECLARED CHAIN COUNT" flags against the count today and after.
- R4 and R5 have no reader in the child (engine nodes only), so out424c_r4 and out424c_r5 stop with "occurs 0 times"; the child's nodes are unchanged (rbx: 1 diff, Shared Library).
