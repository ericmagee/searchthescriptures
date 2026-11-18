# ASK 424 build (W4), plan W3 rev 3 (5ceee971); grades of the plan W1 8902, W2 8903

Base: engine moMxiV4Irg1uRBZN db091b9e, child MqQHRl7mQQ0z8QdT 0e006a24 (fresh fetch, 23:10Z).

    node build424.cjs ENG CHILD db091b9e-4a6b-4c2a-a35a-e83f1c4cbe5f 0e006a24-8100-4186-b32c-ae218eb0b236 ENG_OUT CHILD_OUT
    node t424.cjs ENG CHILD ENG_OUT CHILD_OUT d1_all.json      # writes t424_out.txt

- readers.json: the five old/new reader texts (R1 chain_count, R2 drvLinks, R3 drvChainOf, NUM = declared/cecDeclared line test, DL = dlinks/cecDlinks capture).
- pairs_424.json: the library pairs (R1 to R3), applied to the engine and the child by lib_apply.cjs (refuses if the two library shas differ).
- d1_all.json / d1_all.sql: the 245 stored claude_r1 texts with a DECLARED CHAIN heading, and the SQL that checks the set.
- t424_out.txt: DONE WHEN 1 to 4 and 7. DONE WHEN 5 is in the Wall post (rbx readback, ASK 385 check, $( count).
