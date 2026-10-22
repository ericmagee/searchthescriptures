# Step 3 re-verify (Worker_A3) of the D9-1 fix, Worker_E git 0779040 (BB-7449)

Read and run after 21:10:01 CDT, when check-in 2 was read and BB-7448 to BB-7450 read whole.

## Holds
- Order of commits: falsifiers R1-R10 at 0e07e46 (01:53:34 UTC), before fix 240d26a (01:54:28 UTC) and raw-text mark 0779040 (01:55:23 UTC). FALSIFIERS9 shows no diff between 0e07e46 and 0779040.
- base9 is still my new/ at 3ac66c8, 22 of 22. Rebuilding with patch_dod9.py gives new9 exactly, 22 of 22. Parse: 22. drvCounted occurs 0 times.
- The diff e904a54 to 0779040 of patch_dod9.py was read in full:
  - drvCP blanks parentheses; accepts "premise(s)", "LINK(s)", "n-m" and "n to m"; maps a defender LINK n through the ledger's "(LINK n)", and reads a challenger LINK n as premise n.
  - The UNREADABLE mark carries the raw line.
  - drvLedger passes the link map to drvCP.
- h_dod9 run by me on new9: 230 pass, 0 fail.
- My negative cases from the 7447 verify (NEG9_OUT_0779040.txt):
  - "LINK 1, LINK 3", "1, 3 (UNEXHIBITED)", "1 to 3" and "1-3" are now read.
  - Each spares premises 1 and 3, and raises K-G7 on D6, because premise 6 is not on the line.
- Edge cases (edge10.cjs, EDGE10_OUT.txt), all pass:
  - With a shifted ledger (premise 5 written as (LINK 6)), "LINK 6" covers D6, and "LINK 4" leaves D6 raised.
  - "1, 3 and also 5" is UNREADABLE, with the raw line in the mark.
  - "1-3" against count 2 raises K-G8.
  - "1, 3, 6 (UNEXHIBITED, CONCEDED)" is read.

## Open (for the advisor; not a defect of the fix)
- Worker_E built forms beyond the 7448 list (the word "premise(s)", and "and"/"&" as separators) and put them to the advisor (7449). Worker_E proposes striking them (7450).
- My case x5, "LINK 1 and LINK 3", is read only because of those extra forms.
- If they are struck, it is one pair edit, and I re-verify that change and the cases P12, R8 and R9 that move with it.
- Edge, noted: a defender LINK n that the ledger does not map falls back to premise n.
