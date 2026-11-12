# pkgGAV rev 3: grants finder reads a grant verb after an adverb (run 35696, W3 finding A)

- Parent: fetchback_live_s160.json (live s160). Output: /mnt/project-files/wall2024/parent_s160_GAV3.json (rev 1 parent_s160_GAV.json NOT PASSED by W3, Wall 5407; rev 2 parent_s160_GAV2.json NOT PASSED by W4: the If-skip dropped a grant in the main clause).
- Same three edits in the OGR finder of C4 Build, C4 Extract, C4G Extract and C4B Extract (build_GAV.cjs):
  1. RX: up to two adverbs between "I" and the verb (also, now, further, readily, freely, fully, plainly, openly, likewise, therefore, thus, hereby, still, so); four more grant verbs: admit, retract, give up, no longer rest. Rev 2 leaves out "set aside": it also rejects the other side's point (W3 FAIL 2) and opens method sentences (W1 limit 1).
  2. "nothing" skip: a verb list that ends in none, nothing or no is skipped ("I grant, withdraw, and drop nothing").
  3. Heading skip takes up to two words before the verb and all the new verbs, plus set aside and release (W3 FAIL 1). A question is skipped, and so is a sentence opened by If, Unless, Should or Nor when no comma, semicolon or colon stands between that word and the verb, so the verb is inside the condition. Rev 3: "If the challenger presses Luke 3:23, I grant that ..." is read, as in the old code.
- Size, MEASURED: code +603 per node, +2,412 in all. Prompt: the grants block is +845 characters over 81 stored runs (9 runs gain one grant, 0 lost). This is the same as rev 1, since the new skips remove no stored grant.
- Proof: plants.cjs 40 of 40 (old and new counts both checked), scan.cjs, pkgSGJ/plants.cjs 10 of 10.
- Not built (reported): "I accept", "I agree", "I do not rest", "I rest nothing", "I yield", "I release". The key-word reader (kwLines421) holds the old verb line (W3); it needs the operator's ruling.
- Known limits: "I so grant." is listed; reported speech without quotation marks ("The defender says: I thus concede ...") is listed; three adverbs in a row are not read; "I likewise set aside my own ... limb" is not read (set aside left out).
