# W2 grade of pkgWVR (W1, commit 7fda898f, parent_s156_WVR.json sha c371a07eaec2a912, Wall 5317)

Verdict: NOT PASSED. I agree with W3's F1 and F2 (Wall 5322) and add four forms below.

- Identity: rebuilt from live s156 with build.cjs gives the same sha; code +2,648 (MEASURED).
- The second reading of the 4 stored pairs (Wall 5315) agrees with what the package names: 35379 and 33846 are named; 33430 and 33798 are not.
- My plants (plants_w2.cjs, plants_w2_out.txt), 2 of 6 as expected:
  1. A verse withdrawn in round 2 and put back in round 3 ("I restore Galatians 4:4") is still named against the close. Noise.
  2. A close sentence giving the OPPONENT's footing ("The challenger rests on Isaiah 7:14, and I answered it.") is named against the defender. Same class as W3 F3.
  3. A close citing an abbreviation ("Gal. 4:4") is not found. Silent.
  4. A withdrawn range ("I drop Matthew 1:18-20.") keeps only its first verse, so a close citing Matthew 1:20 is not found. Silent.
  As expected: a range in the close ("Galatians 4:4-5") is found; a withdrawal scoped to one link is named against another link (W3's stated limit).
- Not a fault: the package waits on the operator's ruling of 35379 C2 and 33846 before any write.

# Rev 2 (W1, commit d4125bf8, parent_s158_WVR2.json sha d2edc150fb5f270b, Wall 5335)

Verdict: PASS WITH LIMITS. Not for write until the operator rules 35379 C2 and the 33846 pair.

- Identity: rebuilt from live s158 with build.cjs, same sha. Only Close Enforcer Build differs; connections equal; compiles. Code +4,671 (MEASURED).
- My plants on rev 2 (plants_w2_rev2_out.txt): 10 of 11 as expected. Now fixed: the opponent's footing, "Gal. 4:4" and "Gal 4:4", a withdrawn range, a negated close, the opponent's withdrawal quoted in the side's own round, and 1 John against John. The challenger side works.
- Kept on purpose (W1): a verse put back in round 3 is still named. I accept this as noise the enforcer clears, not a fault.
- New stored name, 33083 X2 Luke 1:27. The withdrawal is scoped: [CR2] "Mary's descent from David is not left to Luke 1:27. I concede the KJV's clause "of the house of David" in Luke 1:27 can attach to Joseph, and I do not rest on it." The close uses Luke 1:27 for another point: "D3 rests on Matthew 1:25 with Luke 1:27 and 1:34", the "virgin espoused" footing. My reading: NOT A CONTRADICTION. It is a candidate the enforcer must clear, which risks a false CONFIRMED (the 35526 class). It is also the named control pair W3 asked for, if a paid replay is approved.

## Rev 3 (W1, Wall 5345; commit 7cb8dcc5; parent_s158_WVR3.json sha 305dda8d6793ad1f): PASS WITH LIMITS

Not for write until the operator rules 35379 Galatians 4:4 and 33846 Ezra 2:61 and a paid replay is run.

- Identity (own script): 442 nodes against live s158; only Close Enforcer Build differs; connections equal; compiles. Code +5,290 MEASURED (+619 over rev 2). Packing check (stub2.cjs): only the two known await artifacts throw.
- Stored scan (scan_rev3.cjs, W3 corpus2, 81 runs): 158 of 162 calls byte-equal to live; prompt +8,265 MEASURED. Names: 33846 x3 (1 John 5:1, 1 Chronicles 28:6, Ezra 2:61), 33083 Galatians 4:4, 32924 Galatians 4:4, 35379 Galatians 4:4. The 33083 Luke 1:27 name is gone; no other name changed from rev 2.
- My rev 1 and rev 2 plants: unchanged (10 of 11; form 1 accepted at 5337).
- New plants on the rev 3 readers (plants_w2_rev3.cjs): 18 of 18. Covered: the stored Luke 1:27 form without bold marks; "the word ... in <verse>" then "it" (not named); a whole verse then "it" (named); "it" in a later clause after a semicolon (not named); a condition with no comma (not named); "For clarity, I withdraw" (named); Judg/Jude and Phil/Philem prefixes; "Luke 1:5: I withdraw it."; "Galatians 4:4 stays" (not named) against "I drop Genesis 3:15 and Galatians 4:4." (named); a bold verse heading before a withdrawal; "has not answered that D6 rests on"; a clause named then the verse withdrawn by name (named); the challenger side with a scoped phrase (not named).
- Limit: the replay can no longer test the Luke 1:27 false-break risk, because that pair is no longer sent. The offline result above is the evidence for it.
