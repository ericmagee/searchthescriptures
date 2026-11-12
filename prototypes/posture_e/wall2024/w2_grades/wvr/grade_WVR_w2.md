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

## Rev 4 (W1, Wall 5352; commit e1519426; parent_s159x_WVR4.json sha dc2918ce2e3df4e9): NOT PASSED

- Identity: built on expected s159 (expected_s159_GUR_SJO.json sha 56ec019d). Only Close Enforcer Build differs; 443 nodes; connections equal; compiles. Code +5,527 against expected s159 (+237 over rev 3), MEASURED. Packing check: only the two known await artifacts throw; library sha e5df76c23a60d658.
- Stored scan (corpus2, 81 runs): 158 of 162 calls byte-equal, +8,265; the same six names as rev 3.
- My earlier plants: rev 2 set 10 of 11 (form 1 accepted), rev 3 set 18 of 18.
- F1 and F2 (W3 5351) are fixed: plants_w2_rev4.cjs, 12 of 13 (unless, should, once, provided, "If ..., then"; "Even though" and "As he asks" still named; "; so I drop it", "; then I withdraw it", challenger side).
- NEW FAULT G1, regression toward a false name, in the class rev 3 was built to close: "The clause "of the house of David" in Luke 1:27 is weak; I withdraw it." is named by rev 4 (rev 3: not named; rev 2: named). The F2 look-back takes the verse from the clause before the semicolon without the rev 3 rule that a verse named only as the place of a clause, phrase or word is not the thing withdrawn. The same path names "Isaiah 7:14 stands; the challenger's reading of Galatians 4:4 fails; I withdraw it." (rev 3: not named). Asked: apply the rev 3 clause-in-verse rule (and the opponent's-verse rule) to the clause before the semicolon.
- G2, silent miss, minor: "If anything, I withdraw Galatians 4:4 too." is not named (rev 3: named). "If anything" is an idiom, not a condition. Asked: exempt it, or state it as a limit.
- Neither form is in the stored corpus. I fail G1 because it is the 33083 Luke 1:27 class, the one rev 3 was built for.
- MY MISTAKE, rev 3 grade: I passed rev 3 without finding W3's F1 and F2. My condition plant had no comma ("If the court requires it I withdraw"), so it did not reach the rev 3 comma rule.

## Rev 5 (W1, Wall 5355; commit bd9fc3e5; parent_s159x_WVR5.json sha 0fb5e100fbf3df77): NOT PASSED, two small items

- Identity: on expected s159, only Close Enforcer Build differs; 443 nodes; connections equal; compiles. Code +7,185 against expected s159, MEASURED. Packing check: only the two known await artifacts throw. pkgWVR/wvr_fn.js is byte-equal to the function in the package node; I ran the set on the function cut from the package file.
- Stored scan (corpus2, 81 runs): output identical to rev 4: 158 of 162 byte-equal, +8,265 against live s158 (W1 reports +8,270; I did not find the 5-character difference), the same six names.
- Fixed set (pkgWVR/regress): 174 of 174 as stated. My rev 4 G1 and G2 plants now pass.
- Added to the set (harvest.cjs now reads plants_w2_rev4_cross.cjs and plants_w2_rev5.cjs): 224 plants, 199 unique. Rev 5: 197 of 199.
- G3, regression, silent miss, in the "it" look-back class W3 failed at rev 3 (F2): "Galatians 4:4 does not exclude a father. For that reason I withdraw it." is not named (rev 2, 3 and 4: named). The new rule takes the sentence before only when nothing stands before "I". Asked: allow a short lead phrase before "I" (for that reason, for this reason, so, therefore, thus, on that ground), as the clause rule already allows one adverb.
- G4, silent miss, not a regression (rev 2 to 4 also miss it): "Matthew 1:18, 20" in the close does not count verse 20, though the rule says each verse of a list counts. This form stands 56 times in stored closes; expanding every such list in corpus2 adds no stored name, so no stored pair is lost. Asked: read a bare verse number after a comma as the same chapter.
- New plants 21 of 23 otherwise: other-book bare "1:20" not named, range in close named, short names in the withdrawal (Mt, Gal., Rom) named, Jn against 1 John not named, "Once more" named, "But if" not named, a condition after the verse not named, a condition after a semicolon does not reach back, a question in the close not named, "stay withdrawn" and "<verse>: withdrawn" named, the clause-in-verse and "reading of" rules on the look-back, the opponent's words quoted in the close not named.

## Rev 6 (W1, Wall 5361; commit b9a24ad8; parent_s160_WVR6.json sha 3b8299b01cd36066): PASS WITH LIMITS

Not for write until the operator rules ASK 117 (33846 Ezra 2:61) and the paid replay is run.
- Identity: live s160 (fetchback_live_s160.json) equals my expected_s159_GUR_SJO.json node for node. Rev 6 against s160: only Close Enforcer Build differs; 443 nodes; connections equal; compiles. Code +7,597, MEASURED. Packing check: only the two known await artifacts throw.
- Stored scan (81 runs): output identical to rev 5 and rev 4: the same six names.
- Fixed set, run on the function cut from the package file: 233 of 233. I agree with the three overrides.
- G3 and G4 fixed: my rev 5 plants 23 of 23.
- New plants (plants_w2_rev6.cjs): 9 of 11. Added to the set with two overrides that state limits (overrides.json, with reasons). Set now 244 unique, 244 of 244 with the overrides.
  - Limit L1, toward naming: "Matthew 1:18, 2 witnesses agree" reads "2" as Matthew 1:2. No stored case (the 4 stored "1:3, 5 and" hits are true lists). The enforcer clears it.
  - Limit L2, silent: in the close, "Matthew 1:18; 20" does not count verse 20, though Wall 5361 lists "; 20" as read. No stored case found (stored "; <n>" hits are book prefixes such as "; 2 Samuel"). W1: fix it or state it in the rule text, then drop the override.
- Neither limit is a regression, and neither loses a stored pair.
- Replay plan moved to rev 6: replay_plan_WVR6.md. Sizes and candidates are the same as rev 3; 35379 X7, 32924 X1 and 33083 X1 must be CONFIRMED (ASK 116 ruling).
