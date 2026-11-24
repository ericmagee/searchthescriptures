# W1 grade: ASK 582 second pass batch 1 (manual1123/w3/a582b/, W3 commit f250a9f6; Wall 11271)
Files: b1_README.md 817da6c7, b1_pairs_09.0.json f5f94007, b1_pairs_11.0.json 27411c9d, b1_pairs_11.1.json f68e88cb.

GRADE: PASS.
RULES READ: engine manual section 0 (00.1 v247); op doc v144 s0 (2)(3)(4); plan Wall 11269 and my P1 to P3 (Wall 11270); scope rule; ruling 506.
OBJECTIVE MET: yes for batch 1 (class A in 09.0, 11.0 and 11.1). The remaining hits are listed with a reason, and each is kept or assigned to batch 3.

Checks (W1, 21:5x CST 2026-11-23):
1. P1 met: the regex is stated. Its before counts on the bases equal the README: 09.0 2, 11.0 23, 11.1 12.
2. Previews (my SQL, chained replace on each base):
   - 09.0 v242 0b5f5612/38,944: counts 1,1; result 69e266ce6114f15c39ceeffba5ac4e0f, 38,813.
   - 11.0 v245 467c3c63/38,952: counts 1 x9; result cd97ea91ec29d369d832a481776eb51b, 38,048.
   - 11.1 v242 710e8cea/35,620: counts 1 x10; result 21ba90304e5bbd83c034caff38c35277, 34,701.
   - Each base is that part's latest row. All three equal the README.
3. Whole manual: 709,020 - (131 + 904 + 919) = 707,066, which agrees with the expected v250 6d7aa379. P3 met (order 09.0, 11.0, 11.1; mrb.cjs per part).
4. I read all 21 pairs. Each new text keeps the behaviour sentence and drops only cards, times, seats, Wall or audit numbers, file md5s, deployment ids and readbacks. No pair removes a rule.
5. 11.1 pair 1 (the REVERTED line): the kept text states that 516 is reverted, the crash on 41128 and 41155, and what the enforcer calls carry. The 516b entry that follows states the live fix (rounds held once per build).
   - The growth trace ("not proven") is history, and the log is the right place for it.
   - "(41147 also failed on 516, at Record Substitution, a separate fault)" states no rule or limit; it names a fault without its cause. Moving it loses no rule from the body.

Note for the coordinator (not a condition of this batch; scope rule):
N1. The 41147 fault itself (W4 Wall 10353: the retry path called odv1_record_panel_substitution without parameters) is not stated as a live limit anywhere in the manual. I searched every part's latest row for odv1_record_panel_substitution and found 10.0, 11.0, 17.0 and 17.1, none on the retry path. Whether that retry-path fault is still live belongs on the coordinator's failure list as its own item.
