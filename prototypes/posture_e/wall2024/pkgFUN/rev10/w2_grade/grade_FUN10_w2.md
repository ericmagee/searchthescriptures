# W2 grade of pkgFUN rev 10 (W1, 33e87cce, Wall 4092): PASS (grading only; nothing is written until the operator answers ASK 7)

I am the second grader. The 16 new cases were labeled and committed before any run (91c7c308). The columns compare live s105 (`strip_KRO2_KSL`) with rev 10 (`strip_KRO2_KSL_FUN10`).

## Checks
- **Rebuild:** `build_FUN10.cjs` on `strip_KRO2_KSL` gives W1's strip file for file. Repacked on the s105 fetch-back, it equals `parent_s105_FUN10.json` node for node. Only the Shared Library differs from s105.
- **Size:** 604,776 to 605,515 characters, +739 (+0.12%). No prompt text, no model call.
- **Stored replay:** all 176 stored cure replies are byte-equal (`replay_FUN10_w2.txt`).
- **623 set** (`ks3_623_FUN10.txt`): 576 match. Rev 10 changes 47 rulings from s105, and all 47 move toward the label (46 refusals now refused, 1 correct answer now cured). All 310 real stored answers read as labeled. The 3 correct answers rev 10 refuses are also refused on s105.
- **Family sets** (my rev 8 set, my rev 9 set and the 16 new cases; 69 cases, 6 pairs set aside; `w2_fam_all10_run.txt`): 0 regressions, 12 fixed.
  - My two rev 9 findings ("TOUCHES NO LINK:\nI will not answer this.", "TOUCHES NO LINK:\nI decline to give a reason.") read UNCURED again, as on s105.
  - The 9 new correction forms all cure, as on s105. Each is an own-error or count-noun sentence followed by a CORRECTED COUNT line, for example "COUNTED. The count is wrong.\nCORRECTED COUNT: DEFENDER 3", "COUNTED. I withdraw my count.\nCORRECTED COUNT: ..." and "COUNTED.\nThe count I gave is wrong.\nCORRECTED COUNT: ...".
  - The 7 new refusals are all refused. Six were cured on s105: "COUNTED. It should not be counted.", "COUNTED. No.", "COUNTED. I do not count it.", the same with "CORRECTED COUNT: unchanged" under it, "COUNTED. My count stands.\nCORRECTED COUNT: unchanged", and "COUNTED.\nNo.". The seventh, "Yes.\nCOUNTED. It should not be counted.", is refused on both.

## Wrong on both s105 and rev 10 (not counted against rev 10)
- **Refusals still cured:** "COUNTED. The count is wrong." alone (now a note only, by design), "COUNTED is wrong.", "COUNTED. My count is right; the grant does not count.", "COUNTED. My count is correct as issued.", "COUNTED. Your count is wrong.", "TOUCHES NO LINK: I decline to give a reason.".
- **Correct answers still refused:** next-line TOUCHES reasons. E4 was dropped, so these read as on s105. That is the gap pkgTNR measures (ASK 8).
