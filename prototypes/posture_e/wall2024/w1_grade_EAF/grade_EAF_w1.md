# Grade of W2's pkgEAF (Wall 4731, 4732), W1: PASS WITH LIMITS, both forms (SU and AU)

Files: parent_s125_EAF_SU.json (sha 62a947015f93987f), parent_s125_EAF_AU.json (sha a2a0fe721f121441), checked. Base live s125. Offline, measured.

E1 Diff: Shared Library lines 3195 and 3196 only. No other node changes; connections are equal. Code SU +216, AU +69.
E2 Size (size.cjs): prompt characters over all DeepSeek check calls, against live.
- 34852: SU +49,500, AU +55,829.
- 34726: SU +46,264, AU +52,758.
- 34703: SU +42,629, AU +44,396.
- 34780: SU +48,408, AU +52,102.
Each run takes one more call (34852: 5 to 6). These agree with W2's figures to within 1 character.
E3 Right block (g.cjs, g3.cjs): every block served on SU and AU in 34852 holds the quote's opening words (69 and 80 of 69 and 80).
E4 Plants (plants.cjs; luna's Matthew 1:6 answer rewritten in stored 34852):
- P0, control (the stored quote): live none; SU and AU serve the Matthew 1:3, 1:5, 1:6 block. Right.
- P1, marks with backslashes: the block is served on SU and AU. The item merges with sol's equal answer (B12.1 and B12.2).
- P2, a long quote from another verse's answer (the Matthew 1:1 sentence quoted under 1:6): live none; SU and AU serve the Matthew 1:1 block, labelled "every line the answering side wrote under this pressed verse". LIMIT 2.
- P3, a quote in no round: no block on any version; the item is kept. Right.
- P4, a long second-half quote: the 1:6 block is served on SU and AU. Right.
- P5, a quote elided with "...": the 1:6 block is served on SU and AU. Right.
No item was dropped in any plant.

LIMITS
1. THE ANSWER IN FULL is cut at 900 characters (LIB 3197, unchanged). Served blocks cut before the end of the judge's quoted words, over the 4 stored runs: live 5; SU and AU 10 each (34852 B67, 34726 B45, 34703 B123, 34780 B43 and B110 added). In those items the enforcer is told to grade the full answer and receives a block without the quoted sentence. THE ANSWER line still shows the quote.
2. A long quote that stands under another verse is served with that verse's block, under a label that says "under this pressed verse". Live does this only for a grant or a short quote.
3. Size: +42.6K to +55.8K characters of check-visible text per run, and one more DeepSeek call per run.
