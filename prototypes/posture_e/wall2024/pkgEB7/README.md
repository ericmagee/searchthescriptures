# pkgEB7 (rulings item 13, Eric 10:42 CST 11-07): B7 as a DeepSeek enforcer check. DeepSeek enforcer fix, side-neutral. Panel and alternate seats.

B7 (selfLines421) only writes a mark and matches on the verse alone. E-B7 puts each hit to DeepSeek: a premise the judge counts UNEXHIBITED on a verse
whose ANSWER CHECK lines by the same judge, on that side's answers, all read MEETS. DeepSeek gets the premise list entry, the judge's count, and those
ANSWER CHECK lines, and rules SAME GROUND or DIFFERENT GROUND.
- SAME GROUND = DISAGREE: sent back (Send Back Build, with the rule note), and an uncured item adds 1 to drv_uncured (Send Back Record, AUDIT v51),
  as pkgKSC does. B7.LIVE=true (build with --live false for a one-run TRIAL: recorded, not counted).
- Cure: CHANGE TO the CONCEDED LINKS line without premise n counted UNEXHIBITED; CHANGE TO the ANSWER CHECK on that verse graded MISSES or FAILS;
  or KEEP with a sentence quoting 6 words in a row of the premise entry and 6 of a MEANS (or all of a shorter one).
- A DISAGREE written with RIGHT: DIFFERENT GROUND is CONTRADICTED and not sent.
- The single judge's B7 (Extract Independent Verdict) stays a mark; the Judge Enforcer reads panel and alternate seats only.

Nodes (8): Judge Enforcer Build, Judge Enforcer Record, Send Back Build, Send Back Record, and the four Alt nodes.
- patched: enforcer nodes on pkgEAI/patched_on_pkgEID; Send Back nodes on pkgL1Q/patched. Shas in patched.plan.json.
- patched_on_pkgESR: enforcer nodes on pkgESR/patched (JEB 922cfa34942e -> 580a1310dc18, Alt 8c562cf9a75f -> 97429878e557,
  JER 07a6babce7c2 -> f4f8752029fe, Alt 80f264ba62ad -> 07ae739f2926); Send Back nodes as in patched.
Test: node pkgEB7/test_EB7.cjs -> 102 OK, 0 FAIL (on ESR: EB=pkgESR/patched/ PD=patched_on_pkgESR, also 102 OK; test_EB7_on_pkgESR.txt).
- Every old enforcer id and row unchanged in every saved run 33218+; E-B7 rows NO VERDICT on the saved replies.
- Saved runs: Send Back Build/Record equal to base (the new b7:null field and empty b7_counted aside).
- Synthetic: SAME GROUND -> DISAGREE; DISAGREE + DIFFERENT GROUND -> CONTRADICTED; Send Back Build carries one E-B7 item with b7 and the note;
  Send Back Record: KEEP without the quotes UNCURED, drv_uncured +1, AUDIT v51; KEEP quoting both CURED, not counted. 10 cure units.
- E-B7 items in the saved Builds: 2 (33249 Alt grok, challenger premises 1 and 5).
Restack: W1's Send Back Record seat lookup, my pkgTRM (Send Back/Gate), pkgEAX (W1, Records) touch the same nodes; anchors are single lines.

## patched_full (W3 2916, live stack after 33411)
Built on --ebase pkgESR/patched_on_pkgEAX and --sbase = pkgTRM/patched (Send Back Build, Alt) + pkgTRM/patched_on_pkgDEC (Send Back Record, Alt).
Shas: JEB 580a1310dc18, Alt JEB 97429878e557, JER d44c21412695, Alt JER 297c7135383b, SBB b0a7604f6217, Alt SBB bd7c5109d7d1, SBR 31f9ac2c4181, Alt SBR 6b1cf152b6f4 (byte-equal to W3's /mnt/project-files/w3/restack_gap_after_33411/).
Test: EB=pkgESR/patched_on_pkgEAX/ SB=<that sbase dir>/ PD=patched_full node pkgEB7/test_EB7.cjs -> 102 OK (test_EB7_full.txt).
