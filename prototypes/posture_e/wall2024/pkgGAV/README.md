# pkgGAV: grants finder reads a grant verb after an adverb (run 35696, W3 finding A)

- Parent: fetchback_live_s160.json (live s160). Output: /mnt/project-files/wall2024/parent_s160_GAV.json.
- Change: the OGR grants regex (RX) in C4 Build, C4 Extract, C4G Extract and C4B Extract (the same line in all four, replaced in all four):
  - allows up to two adverbs between "I" and the verb, from a fixed list: also, now, further, readily, freely, fully, plainly, openly, likewise, therefore, thus, hereby, still, so. "never", "hardly", "would", "cannot" and "do not" are not on the list, so those sentences stay unnamed.
  - adds five grant verbs found unread in stored debates: admit, set aside, retract, give up, no longer rest.
- Size: code +163 characters in each of the 4 nodes (+652). Prompt: grants block +845 characters over 81 stored runs (9 runs change, 9 grants added, 0 lost).
- Proof: plants.cjs (23 of 23, old and new counts both checked), scan.cjs (stored scan), pkgSGJ/plants.cjs 10 of 10 on the new file.
- Stored scan of 219 debate_results rows (SQL, all round columns): the new forms appear 16 times, all real concessions or withdrawals. Not built (reported only): "I accept" (112), "I agree" (59), "I do not rest" (244), "I rest nothing" (50), "I yield" (3), "I release" (3). These mix grants with method sentences and need a ruling first.
