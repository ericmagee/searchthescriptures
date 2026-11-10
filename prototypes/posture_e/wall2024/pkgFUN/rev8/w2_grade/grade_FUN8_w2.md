# W2 grade of pkgFUN rev 8 (W1, eae1253a; repack on s105): FAIL

I am the second grader. My labels were committed before each run: the 623 set at bbbf61d9 with a correction at 4e0bc5ae, and the family cases at 0c1cc661. The columns compare s105 (s104 + pkgKSL rev 2, `strip_KRO2_KSL`) with rev 8 (`strip_KRO2_KSL_FUN8`).

## Passing checks
- **Rebuild:** `build_FUN8.cjs` on `strip_KRO2_KSL` matches W1's strip file for file. The repacked parent matches `parent_s104KSL_FUN8.json` node for node, and only the Shared Library differs.
- **Size:** +665 characters (+679 bytes), 604,776 to 605,441. No prompt text and no model call are added.
- **Stored replay:** all 176 stored cure replies are byte-equal (`replay_FUN8_w2.txt`).
- **623 set** (`ks3_run_623_FUN8.txt`):
  - s105: 529 match, with 4 correct answers refused and 90 refusals cured.
  - Rev 8: 583 match, with 1 correct answer refused and 39 refusals cured.
  - Rev 8 changes 54 rulings, and every one moves toward the label: 51 refusals are now refused and 3 correct answers are now cured. No ruling moves away from its label.
  - All 310 real stored K-S3 answers read as labeled on both libraries.
  - The one correct answer still refused, "TOUCHES NO LINK.\nIt does not touch D1 to D6 ...", is also refused on s105. E4 reads only the colon form.

## Failing findings
The family cases (`w2_family_run.txt`, 15 cases) confirm all three of W3's findings (Wall 4085) and extend each to new wordings.

**1. Correct answers that live cures are refused.** "My count" is read as a refusal. Three cases:
- "COUNTED. My count is wrong.\nCORRECTED COUNT: DEFENDER 3" (W3's case)
- "COUNTED. My count is not right.\nCORRECTED COUNT: DEFENDER 2" (new)
- "COUNTED.\nMy count is incorrect.\nCORRECTED COUNT: DEFENDER 4" (new)

**2. E3 cures refusals that live refuses.** Three cases:
- "Yes.\nCOUNTED is wrong."
- "Agreed.\nCOUNTED cannot be right here." (new)
- "Correct.\nCOUNTED is not the right answer." (new)

**3. E4 cures refusals that live refuses.** Three cases:
- "TOUCHES NO LINK:\nI refuse to answer."
- "TOUCHES NO LINK:\nI will not answer this." (new)
- "TOUCHES NO LINK:\nNo reason is needed." (new)

## Still cured on rev 8 (same as live, not counted against rev 8)
39 refusals in the 623 set still read CURED. They include:
- 5 forms where a line naming another item stands before the refusal (W3 4076 note 1), for example "COUNTED.\nSee DEFENDER CR3.\nIt should not be counted.";
- 2 forms that name the item's own number and another number together;
- 4 multi-line refusals: "On reflection, NOT COUNTED.", "- But only for D5, not for this item.", "Correction: this grant does not count against the defender.", and "I keep my earlier answer.";
- the one-line "COUNTED is wrong.".

## Label notes
- Three of my "second-line" narrow labels were stale and are corrected (4e0bc5ae, my mistake).
- My set holds no "COUNTED. My count is wrong." case, so W1's open label N17 is not tested by it. W3 has withdrawn that label (Wall 4085), and I agree: "my count" is the judge's own count.
