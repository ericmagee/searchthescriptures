# W1 GRADE: ASK 586 J1 re-cut on live and on the 595 targets, and the Oracle-as-challenger replay
GRADE: PASS with R1 (the reader fix accepted, with its test). COMMIT deba0391 (build586j1.cjs, unchanged), re-cut dirs ask586/w4/j1recut_live and j1recut_fix595 (W4, Wall 11461). Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Not the builder.
RULES READ: the operator's "Keystone must break" (23:14 relay) and "Rule live now" (23:30), plan 586 rev 6 J1 incl. BOTH SEATINGS, 428, 512, 587 A.
OBJECTIVE MET: yes for the build; the replay is owed to the card and is done.

## Re-cut
- My rebuild of build586j1.cjs on my own fetch of live d819ff4c/31329164 equals j1recut_live's targets (0 node differences, connections equal); on my 595 targets it equals j1recut_fix595's targets. Library pair PASSES on both (df73a11aa012dd57 / 0dd2082299d376a7; b984c54cd268b528 / 2b8c212fcbb1d688).
- t586j1 ALL PASS on both (its reference file live_eng.json is the pre-587 engine 196402d0, by design).
- Note: the build also inserts the J1 sentence into Build Independent Verdict, which no start reaches (Wall 11462, W4 11463). Harmless; it acts through Panel Build and the library.

## Replay (my own SQL, last RESULT line and last KEYSTONE line of each judgment; 171 runs, 513 judgments, challenger_profile oracle, defender not oracle)
- CHALLENGER WINS beside KEYSTONE ... STANDS: 53 judgments in 32 runs by my parse (CHALLENGER WINS 136). My RESULT regex leaves 28 judgments unread where W4's leaves 5, so W4's 56 of 149 is consistent and not contradicted; the run count, 32, matches exactly.
- The only STANDS keystone line not in the "D<n> -- STANDS" form is judgment 1221: "KEYSTONE: D5 vs C2 (Numbers 1:2, Hebrews 2:16) -- STANDS -- GROUND: [...". Confirmed.
- For the card: under J1 with both seatings, about 56 of 149 stored Oracle-as-challenger wins would have been UNDERDETERMINED. That is the size of the change in the Oracle's favour-against direction, and the card must show it beside the 3 of 9 in the Oracle-as-defender replay.

## R1, the reader gap (W4's proposal)
ACCEPTED: ks586 also reads "KEYSTONE: D<n> vs C<m> (...) -- <word>" (with or without the parenthesis), taking the first grade word after the first dash. Test before the card: 1221's line reads STANDS (known-bad, fires); the same form with BROKEN reads BROKEN (control); a line "-- STANDS -- GROUND: [..." does not take a later word.
