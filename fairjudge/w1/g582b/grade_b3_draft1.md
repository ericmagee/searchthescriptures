# W1 grade: ASK 582 second pass, batch 3 draft 1 (W3 Wall 11290)

GRADE: PASS with F1. COMMIT graded: 313b5bb1 (b3_pairs_all.json ea979c3c300a708221d920ad0cc1ce8e, b3_README.md 3168c66778e15b9e0e4a59bda7652f1a).
RULES READ: operational_doc 0 (3), 0 (5b), 0 (7); plan Wall 11269 and conditions Wall 11270 (P1 to P3); the operator's Central-time rule.

1. Preview (read only, latest row of each part; recursive replace): bases 08.0 v242 e2e4f4e6, 09.1 v255 c32aa3dc, 09.7 v259 feb419b6, 09.8 v242 7928a79d, 10.0 v260 deda7adc, 11.0 v261 150f5f24, 11.1 v250 2f668823, 12.0 v262 954f32e5, all as the README states. Every pair occurs once (21 of 21). All 8 results match the README md5 and length. Z-times left: 10.0 2 and 11.0 1 (the stored cutoffs, KEPT under P2); all others 0.
2. Time conversions: all 16 checked as Z minus 6 hours; all correct; none crosses midnight. Seconds dropped on ruling and card times, kept on run and execution times, as the README states.
3. 09.7 pair 1: the Why line stays a why ("so one proof covers both"); only the hold time, the card and the approval go. 09.7 pair 2: the operator's choice time (20:47 to 20:55 CST) is a ruling time and stays; only the build approval goes. Both right.
4. KEPT list: right under 0 (3) and 0 (7) and P2. 10.0's override line stays and 12.0's approval goes; the distinction holds (10.0 was REFUSED by the reasoning guard and the override is its warrant; 12.0 is a plain card approval).
5. F1 (must fix before the card): 11.0 pair 1 replaces " 2,537 ... hourly call." with " ", which leaves "loss.  Revert" (two spaces; checked in SQL: true). Use OLD "loss. 2,537 rows were pending at 17:36 CST (oldest 2026-11-09 19:39) at 100 rows per hourly call." NEW "loss." (occurs once). 11.0 then ends 1 character shorter (37,965) and the whole manual 705,967; post the new md5s from a fresh rehearsal.

OBJECTIVE MET: yes once F1 is applied (card and approval notes cut, times in Central, kept items kept under the law).
