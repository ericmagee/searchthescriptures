# THE DEBATE FIXED (BB-7397), step 3 verify of Worker_E's 2b build (BB-7443, git e904a54), Worker_A3

Read and run between 20:49:47 CDT (BB-7444 read) and 20:51:35 CDT (clock read by tool).

## Holds
- FALSIFIERS9.txt was committed at 6a086b0 (01:43:39 UTC), before the build commit e904a54. It is unchanged between the two commits.
- base9/ equals my new/ at 3ac66c8 for all 22 nodes.
- Rebuilding from base9 with patch_dod9.py gives new9/ exactly, 22 of 22. Parse: 22 nodes. drvCounted occurs 0 times.
- The sentence occurs once each in Panel_Build and Build_Independent_Verdict.
- I read patch_dod9.py in full (168 lines):
  - drvCP and drvLinkMap behave as described.
  - drvBroken: K-G8, the absence marks, defender K-G7 tested by the line with (A) where the line is absent, and challenger (c) unchanged.
  - drvLedger: K-G6 tested by the line, with (A) where it is absent.
  - Cure: K-G8 goes through kCount; cureSet covers K-G8.
- h_dod9.cjs, run by me on new9: 176 pass, 0 fail (H_DOD9_RUN_A3.txt).
- My own harnesses on new9:
  - h_cure: F3b and F5 unchanged, 14/14.
  - h_site: Gemini K-G6 D1, D3 and K-G7 D6 vs C3; Extract K-G6 D1, D3; the three cure tails write the columns.
  - h_ask: the labels hold. h_fm: unchanged.
  - h_k7 fails only M2c. That case is now the declared limit: no line and a count above 0 means no test by number.
  - h_f3a still shows challenger items for the single judge. That is my harness reading counts from report headers the single judge's section does not have. The node path (Extract) raises none.
- Corpus, my own read by SQL at 20:51:35 CDT: 0 of 186 stored judgments and 0 single-judge rows carry a COUNTED PREMISES line.
- Negative cases (neg9.cjs, NEG9_OUT.txt): "none" with count 0 and D6 BROKEN raises K-G6 and K-G7; "1, 3, 6" spares D6; bold, lowercase and a trailing period are read; "1, 1" against count 2 raises K-G8; no lines at all leaves both absence marks and no items.

## Defect (returned to the builder)
D9-1. The line reader marks UNREADABLE the forms judges already use to itemize these same counts:
- "LINK 1, LINK 3", "1-3" and "1 to 3" are UNREADABLE (cases a, m, n).
- A parenthesised tag, as in "1, 3 (UNEXHIBITED)", is UNREADABLE (case b).

Each such line falls back to (A), so a premise left out of the count while the count is above 0 goes untested, and nothing is raised for it.

Measured over the stored CONCEDED LINKS lines in debate_judgments (276 lines): 123 itemize with "LINK n", 105 with "premise n", and 60 use a range.

The new sentence asks for "ledger premise numbers". A judge that carries its habit into the new line defeats design (B) without any error, and the only trace is an UNREADABLE mark.

Falsifiers to declare first:
- "LINK 1, LINK 3" on the defender side reads {1, 3} through the ledger's (LINK n) map.
- "1-3" and "1 to 3" read {1, 2, 3}.
- "1, 3 (UNEXHIBITED)" reads {1, 3}.
- Each of the three, on a line whose integer differs, raises K-G8.

The challenger side has no LINK labels in its ledger. Whether "LINK n" there is read as n, or stays UNREADABLE, is the builder's choice and should be stated.

## Not a defect, noted
- The sentence's wording and its placement (after the CONCEDED LINKS line, inside the JSON reasoning) are the operator's text, decided at the publish request (BB-7436 item 3).
