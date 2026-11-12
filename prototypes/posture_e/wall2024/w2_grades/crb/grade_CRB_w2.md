# W2 grade of pkgCRB (W1, commit 5b098cad, Wall 5283)

Verdict: PASS WITH LIMITS.

## Identity
- Rebuilt with W1's build.cjs on fetchback_live_s156.json: sha256 d07fbc3b5e3af75c, equal to parent_s156_CRB.json. Code +1,615 (MEASURED).
- 442 nodes, connections equal, only Close Enforcer Build differs; the node compiles.

## Replay on stored prompts (my harness rp.cjs; rounds rebuilt from debate_enforcer_log prompt_sent)
- 35554 DEFENDER: 6 candidates, X1 to X6, +1,623 chars. X1 now carries the whole Romans 1:3 ANSWER block, rows [L2] to [L4], with [L3] Luke 1:35 "that holy thing which shall be born of thee." and the [L4] row "The challenger grants "born of thee" as out of the mother. So the flesh-descent ...". X2 to X6 share one closing sentence; the block is shown once and the rest say "as under X2."
- 35526 DEFENDER: X1, +550. CHALLENGER calls: +295 each (the sentence only). Figures match W1's replay_out.
- 35478 (the operator's ruled case, "in this case it didn't contradict itself"): X1 gets the Romans 1:3 block with the [L3] Galatians 4:4 row "made of a woman". The earlier sentence dropped a claim ("Heli is Mary's father, and Mary carries David's house"), not that row, so the new sentence does not fire by its letter. Effect on the verdict NOT MEASURED (paid call).

## My own plants (myplants_out.txt), all fail safe
1. Curly apostrophe in the close, straight in the quote ("Joseph’s" against "Joseph's"): no block. Same as live. Cause: the straight apostrophe sits in the word class. No stored case hit it.
2. The closing sentence also quoted earlier in the same close: the first hit wins, so the block shown can be the earlier quotation's.
3. A body line that begins "D2:" starts a new block, so a row above it is cut off (same class as W1's "LINK n" limit).
4. Blank lines, the next "##" heading, a blockquoted "**LINK 2**" heading and regex characters in the quote all behave as intended.

## Limits
- The new instruction sentence ("rested nothing on that row ... the close asserts it again") is a rule for the model. Read loosely it could confirm a close that only quotes a row the earlier sentence set aside for another purpose. A false CONFIRMED breaks a chain, the costlier error (35526). Graders of the next run should hand-read every CONFIRMED that cites a CLOSING BLOCK row.
- Prompt about +1,686 per run (W1, MEASURED over 14 runs).

# Rev 2 (W1, commit b7f748be, parent_s156_CRB2.json sha 46fe57cf34ce35c6, Wall 5294)

Verdict: PASS WITH LIMITS. The new prompt sentence stays UNPROVEN until the paid replay W3 listed.

- Identity: rebuilt from live s156 with build.cjs, same sha. Code +2,182 (MEASURED).
- Replay (rp2.cjs, prompts from debate_enforcer_log): 35554 defender +1,678. X1 still opens at the Romans 1:3 ANSWER line and holds rows [L2] to [L4]. X2 to X6 share one block. 35526 +550; 35478 +1,378, unchanged from rev 1; 35379 defender +3,297; every challenger call +295.
- My plants (myplants2_out.txt): 9 of 10 as expected. Now fixed are the rev 1 limits and W3's F1 and F2: the curly apostrophe, the quote taken earlier, bold row labels "**[L3]**" and whole-bold rows, two alike closings, and a bold lead-in on the sentence's own line. A cut quote ("...") gets no block. That fails safe.
- Limit (stated by W1): a bold lead-in row inside an answer block ("**Note.** ...") on an earlier line opens a new block, so rows above it are cut off.
- Timing: a 20,000-word close with no hit takes 1 ms.
