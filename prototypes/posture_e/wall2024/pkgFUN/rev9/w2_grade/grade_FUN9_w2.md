# W2 grade of pkgFUN rev 9 (W1, 2a8d082b, Wall 4087): FAIL

I am the second grader. Labels for the 32 new cases (26 family cases and 6 one-line against next-line pairs) were committed at b7aa4056, before any run. The columns compare live s105 (`strip_KRO2_KSL`) with rev 9 (`strip_KRO2_KSL_FUN9`).

## Passing checks
- **Rebuild:** `build_FUN9.cjs` on `strip_KRO2_KSL` matches W1's strip file for file. The repacked parent on the s105 fetch-back matches `parent_s105_FUN9.json` node for node, and only the Shared Library differs from s105.
- **Size:** 604,776 to 605,474 characters, +698. No prompt text and no model call are added.
- **Stored replay:** all 176 stored cure replies are byte-equal (`replay_FUN9_w2.txt`).
- **623 set** (`ks3_623_FUN9.txt`): 583 match. Rev 9 changes 54 rulings from s105, and all 54 move toward the label. All 310 real stored K-S3 answers read as labeled.
- **Rev 8 findings fixed:**
  - F1: "COUNTED. My count is wrong.\nCORRECTED COUNT: ..." and its family are now cured.
  - F2: "Yes.\nCOUNTED is wrong." and its family are now refused, while "Yes.\nCOUNTED.", "Yes.\nCOUNTED, ...", "Agreed.\n**COUNTED**: ..." and "Confirmed.\nCOUNTED - ..." are cured.
  - "TOUCHES NO LINK:\nI refuse to answer." and "TOUCHES NO LINK:\nNo." are refused.
- **Consistency:** in all 6 pairs the next-line form reads the same as the one-line form.

## Failing finding: two refusals that s105 refuses now read CURED
- "TOUCHES NO LINK:\nI will not answer this." reads UNCURED on s105 and CURED on rev 9.
- "TOUCHES NO LINK:\nI decline to give a reason." reads UNCURED on s105 and CURED on rev 9.

The cause is a gap already in live, which F3 carries over to the next-line form. On s105 the one-line form "TOUCHES NO LINK: I decline to give a reason." already reads CURED, so the TOUCHES reason reader accepts a refusal as a reason. A fix needs the next-line reason, or better the TOUCHES reason on any line, to pass the refusal list before it is accepted.

## Same as live (not counted against rev 9)
- These refusals are still cured on both s105 and rev 9:
  - "COUNTED. My count is right; the grant does not count."
  - "COUNTED. My count is correct as issued."
  - "COUNTED. Your count is wrong."
  - "COUNTED is wrong." (one line)
  - "TOUCHES NO LINK: I decline to give a reason." (one line)
- These TOUCHES reasons are refused on both s105 and rev 9: "None.", "see above.", "it is a limb.", "Not applicable.", "I will not say.".

## Measurement for the operator (sent to the coordinator)
Of the 310 real stored K-S3 answers, 0 are refusals that the record-only reader cures on s105, so rev 9 has 0 real cases to enforce. No stored K-S3 answer opens with COUNTED.

## Not tested by me
W3's rev 9 finding (Wall 4090) is a case my set does not hold: "COUNTED. The count is wrong." followed by a corrected count line. My set labels "COUNTED. The count is wrong." alone as a refusal.
