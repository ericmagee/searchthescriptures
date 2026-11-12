# W2 non-builder grade of pkgSGJ (W1, Wall 5266; parent_s155_SGJ.json sha 58451b145b917875; commit 2403bded)
MEASURED.
- Identity vs fetchback_live_s155: 442 nodes both; connections equal; only C4 Build, C4 Extract, C4G Extract, C4B Extract differ, each by the same harvester line, +415 each (+1,660). The new line reads only names already in scope (bf, ln, ls, m, W).
- Plants (plants.cjs, harvester taken from each file's C4 Build): 10 run, 8 with expectations, 8 of 8 as expected. Caught: lead restored (35478 form), no join across bullets (35526 form), bare heading skipped, grant word at sentence end, two grant words in one sentence now one item (old gave two).
- Replay (replay_w2.cjs) on rounds rebuilt from stored close-enforcer prompts, runs 34726, 34852, 35067, 35478: old 129 items, new 130; 123 identical; every new item is verbatim on one line of its round (0 not verbatim, 0 spanning a line); old had 1 item joined across a line (35478).
LIMITS:
1. A quoted sentence earlier on the line ends the lead early: `He wrote "I grant nothing." and moved on, so I concede the tense here.` gives "and moved on, so I concede the tense here." Still verbatim, so the word-for-word check is not harmed.
2. Longer G lines (lead up to 160 characters) are what the challenger must quote word for word in OPPONENT'S GRANTS. A misquote goes to the grants-fix call (C4G), so a send-back may be more likely. Not measurable offline. Prompt +1,651 per run (+4.3% of the grants block, W1 figure).
GRADE: PASS WITH LIMITS.
