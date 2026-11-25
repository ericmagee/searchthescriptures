# GRADE: run 42528 AAR, comparison draft 1 (aar/w3/aar_run42528_comparison_draft1.md 1cc65dcd, commit 772a11e0)
PASS WITH N1-N4. All four notes apply before it is sent.
Checked this turn (debate_results): 42528 cost 11.19065, 84 calls, outcome "UNGRADED — REVIEW"; 42517 cost 3.8227, 42 calls, 5 negative i; 42505 no cost, no calls; 42373 cost 10.1217, 65 calls. These match the draft.
N1 (stale): ASK 632 has been built, graded PASS (Wall 11990) and written (Wall 11993). The engine is now 3b72583c and W1's readback passes. Update RUN "Live now", DEFECTS NOT RESOLVED 2, and status 29.
N2 (missing): run 42373 also stored one negative input-token entry (call_costs i<0: 1). Add it to item 2 and to the 42373 status list.
N3 (form): Wall manual 7.4 keeps OBJECTIVE, REVIEWS, WHAT WENT RIGHT, WHAT WENT WRONG, SUGGESTED IMPROVEMENTS and KNOWLEDGE BASE, including under ASK 636. The draft carries none of them. Either include them, or state in RUN that they stand as in the first report and give its Wall number.
N4 (match ASK 636): the status list uses marks outside 636's set (DONE, NOT DONE, ANSWERED, NOT ANSWERED, APPROVED BUILT NOT WRITTEN, RULED). Use the set as 636 finally defines it; see the 636 grade, note N1.
NOT CHECKED: the send-back counts (53/58, 54/54), the close counts (20/31, 17/17, 15/15), the round character counts and tag counts, the $0.73, $0.08 and $2.16 figures.
OBJECTIVE MET: yes for the operator's 05:53 items, namely past defects, improvements, unresolved, new and status of all. The AAR requirement update is in ASK 636.
STANDARD (ASK 599): not applicable (no code).
RULES READ: Wall manual v19 7.4; op doc s30.

## Draft 3 (4c904929): CONFIRMED. N1-N4 applied (diff against d1 read in full): 632 state and engine 3b72583c; 42373 negative entry; RUN points to the first report, Wall 11953, for the other 7.4 parts; marks follow 636 d2. NOT CHECKED: that Wall 11953 is the first 42528 report.

## Draft 4 (2574b327): FAIL on JUDGES' REASONING items 6 and 8. Checked against debate_enforcer_log, run 42528.
- Item 6 (sol). Row 54621 (S22) and row 54622 (S23) are both NOT APPLIED, and for the same reason: "the change regrades the count from 1 to 4, which its item does not name (named: 95 / 96; pkgPS)". The cure check is a separate step. It read S22 UNCURED ("does not count premise 95", row 54551) and S23 CURED (row 54552). The draft says the change "was refused because it did not count the assumed premise", which is the cure reason for S22 only. Correction: the change was refused at apply under pkgPS for both items; S22 also failed its cure. "Stored judgment counts 1" agrees with "from 1 to 4".
- Item 8 (chatgpt). Row 54716 reads "APPLIED S1, S2, S3, S4, S5, S6, S8, S10, G2, S9". So the regrades of D1 vs C3 (S4) and D5 vs C1 (S5) to STANDS WERE applied. Their cure is UNCURED (rows 54701, 54702: pkgUND, "regraded STANDS; no quote of the answer's fit"). The conceded-links change S11 (to 4) was NOT APPLIED (row 54718: pkgACX form at the gate; row 54708: pkgPS, it regrades premise 2). The gate change G2, CONCEDED LINKS 3, WAS applied and CURED (row 54715). The draft's "All three changes were refused for their form. The stored judgment reads BROKEN with 2" contradicts the log. By the log, the judgment carries both STANDS and 3. NOT CHECKED: the stored chatgpt judgment text itself; W3 must read it and state what it carries.
- Section header: "NOT READ WHOLE: the full reasoning text of the four". See the 636 d3 grade, N1. The judgments that sat should be read whole.
NOT CHECKED: items 1 to 5, 7, 9 to 11.
