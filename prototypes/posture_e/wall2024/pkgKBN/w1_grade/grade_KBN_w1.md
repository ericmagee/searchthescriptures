# W1 grade of pkgKBN rev 1 (W2, Wall 3937)

Verdict: PASS, record-only. Every miss is in the safe direction (reads CURED, as live).

- Rebuild: build_KBN.cjs on fetchback_live_s100.json equals parent_s100_KBN.json (3 Send Back Record nodes).
- My labeled cases (cases.json, committed b39d4eeb before the run; run_cases.cjs / run_cases.txt; 33798 terra Job 14:1, live s100 against KBN): 13 of 16 as labeled.
  Now cut and right (live CURED, KBN UNCURED): "Regarding Job 14:1-2, I grant ...", "As to Job 14:1, granted, ...", "Under Job 14:1 I grant ...", "On Job 14:1, I affirm D6 stands as declared." (reason now says "affirmation").
  Left and right: a lead-in then a grant with an own clause, a lead-in then content, "For Job 14:1 names ...", a reason after ";", and the stored fuller answer.
  "I affirm that ..." reads UNCURED with the new reason text "another bare grant, affirmation or deferral".
- MISSES (safe direction, all read CURED as on live):
  K2 "- **On Job 14:1**, I grant ...": bold closing before the comma. The label pattern takes [.:,]? before [*_]*, so "**," is not taken off. Small fix: allow the marks on both sides of the comma.
  K10 "Online records aside, I grant ..." and K14 "On the reckoning in Job 14:1, I grant it.": a grant after other opening words (W3's stated limit).
- Rolled-back insert of 2 rows (UNCURED, CURED): accepted, rows 2, recorded true.
