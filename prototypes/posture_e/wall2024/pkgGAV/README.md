# pkgGAV rev 2: grants finder reads a grant verb after an adverb (run 35696, W3 finding A)

- Parent: fetchback_live_s160.json (live s160). Output: /mnt/project-files/wall2024/parent_s160_GAV2.json (rev 1: parent_s160_GAV.json, NOT PASSED by W3, Wall 5407).
- Same three edits in the OGR finder of C4 Build, C4 Extract, C4G Extract and C4B Extract (build_GAV.cjs):
  1. RX: up to two adverbs between "I" and the verb (also, now, further, readily, freely, fully, plainly, openly, likewise, therefore, thus, hereby, still, so); four more grant verbs: admit, retract, give up, no longer rest. Rev 2 leaves out "set aside": it also rejects the other side's point (W3 FAIL 2) and opens method sentences (W1 limit 1).
  2. "nothing" skip: a verb list that ends in none, nothing or no is skipped ("I grant, withdraw, and drop nothing").
  3. Heading skip takes up to two words before the verb and all the new verbs, plus set aside and release (W3 FAIL 1). A question, and a sentence opened by If, Unless, Should or Nor, are skipped (W4 and W1 limits).
- Size, MEASURED: code +595 per node, +2,380 in all. Prompt: the grants block is +845 characters over 81 stored runs (9 runs gain one grant, 0 lost). This is the same as rev 1, since the new skips remove no stored grant.
- Proof: plants.cjs 37 of 37 (old and new counts both checked), scan.cjs, pkgSGJ/plants.cjs 10 of 10.
- Not built (reported): "I accept", "I agree", "I do not rest", "I rest nothing", "I yield", "I release". The key-word reader (kwLines421) holds the old verb line (W3); it needs the operator's ruling.
- Known limits: "I so grant." is listed; reported speech without quotation marks ("The defender says: I thus concede ...") is listed; three adverbs in a row are not read; "I likewise set aside my own ... limb" is not read (set aside left out).
