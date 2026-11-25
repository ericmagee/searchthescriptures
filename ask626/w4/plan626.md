# ASK 626 PLAN rev 1 (W4; rev 0 graded PASS WITH N1, N2 by W1, commit 665492b1): the premise-list reader reads a list written with bold or heading numbers, and a list it cannot read is reported, never forfeited

Source: WALL-11777 Finding 1, Solution 1 (a), (b), (c) (Worker_A3, run 42373). 1(d) (the Oracle prompt's list form) is DENIED by the operator (18:07 CST 11-24, W3 Wall 11812) and is not in this plan. W1's point taken in: no K-G10 item and no recompute on a list the reader failed on.

## OBJECTIVE
In run 42373 the defender's link round closed with "# CHALLENGER'S UNSUPPORTED-L4 PREMISES" and six premises numbered "**1.**" to "**6.**", each with STEP, ASSUMES, ROWS GIVE and PRESSED WITH. The engine read zero premises, wrote "LINK ROUND FORFEITED: DEFENDER", sent the judges an empty ledger against the challenger, raised K-G10 items on verses the list carries (Hebrews 7:14, Hebrews 7:5, Ruth 4:13) and recomputed two seats' challenger counts to 1. The list must be read, and if a list is there but cannot be read, the run must say so and not act on an empty reading.

## FINDINGS FROM SEARCH (live engine 6b2cc236, child 04704b68; debate_results e7f6922f engine_r3 read 00:15Z 11-25)
F1. The cause: every item-head pattern wants the number followed by "." or ")" and then a space: "1. " or "**1. ". In "**1.** " the character after "1." is "*", so no item is found. A "### 1." head fails the same way in the readers that do not allow "#".
F2. The readers (one pattern, many copies). Node code: D3 Build, D4 Build, Panel Build (2 forms), Build Independent Verdict (2 forms), Build Save Body (items, and listCount, which writes FORFEITED), Format Markdown (listCount), Assume Check Build. Shared Library (engine and child alike): LIB lines 998, 1027, 1672, 2035, 2550 (items, used by 29 MAP entries) and 2326 (sequence head, used by Panel, Alternate and R2 Alternate Payloads), and one MAP inline string (Extract Independent Verdict, sequence head and heading). The build repeats this search on its own fetch, over node code, LIB lines and MAP inline strings (the ASK 611 lesson), and the test fails on any reader not changed or not listed with a reason.
F3. The bullets ("- " before each PRESSED WITH entry) are named by 11777 as a second cause. The build tests whether they change any reading once F1 is fixed; it changes the bullet handling only if the stored round shows a verse lost to it.

## CHANGES
1. (a) One head pattern, accepting "1.", "1)", "**1.**", "**1.** ", "### 1.", "#### **1.**", and the existing "LINK k:" form, put in every reader of F2. Every list the readers read today reads the same (the test proves it on stored rounds).
2. (b) READER FAILED: where a round holds the list heading and the reader finds zero premises, the run writes "LIST NOT READ: <side> -- the heading is present but the system read no premise under it; grade the list from the round text" in place of LINK ROUND FORFEITED, and:
   - the ledger for that side is not sent empty; the judges are told the list was not read;
   - no K-G10 item is raised on that side's list, and no count is recomputed from it (W1);
   - the review notes carry the same line, so the AAR shows it.
   (W1 N2) How it meets the judges' own FORFEIT rule (Panel Build, Build Independent Verdict: "if the challenger listed no premises ... (an empty list, or PREMISE COUNT: 0), then L = 0"): that rule is untouched. The LIST NOT READ line tells the judge the list is there and not empty, so the rule does not apply and the judge reads the list from the round text. The system FORFEITED line is no longer printed for such a round.
   (W1 N1) LIST NOT READ is the one judge-facing change, and it is on the card.
   FORFEITED stays for a round with no heading, or a heading with "PREMISE COUNT: 0" or an empty list.
3. (c) Regression test: the stored 42373 link rounds (engine_r3 for the defender, challenger_r3 for the challenger) become a fixture.

## NOT IN SCOPE
The Oracle prompt and any list form it asks for (1d denied); judge reasoning text beyond the one LIST NOT READ line; the CLOSE PRESS LIST (ASK 628); any model setting.

## CRITERIA
C1 Search: every reader of F2 found again on the build base and changed, or listed with a reason.
C2 Offline on 42373: the live readers find 0 premises in engine_r3; the new readers find 6, with premise 5 carrying Hebrews 7:14 and Hebrews 7:5 and premise 6 carrying Ruth 4:13; no FORFEITED line; the K-G10 items on those verses are not raised.
C3 Offline on stored rounds of earlier runs (the challenger lists of 42373, 42071 and the last runs with a "1. LINK k:" list): every reader gives the same premises as live (byte-equal ledger and counts).
C4 (W1 N2) The 42373 judge packet built with the new code has no system FORFEITED line. A round with the heading and an unreadable list gives LIST NOT READ, no K-G10 rows on that side, and unchanged challenger counts (W1). A round with no heading still gives FORFEITED.
C5 Standing set 31/0 with S4 compile-all; pair Library Check; ASK 599 (tags, no dead code; one pattern, so a later form is added once).

## WRONG-IF
- A pattern that now reads "**1.**" also reads a numbered line inside a premise (a numbered step in ROWS GIVE) as a new premise: C3 on stored rounds catches a changed count.
- A reader missed in a MAP inline string (as in ASK 611): C1 fails on it.

## RUN EVIDENCE
The first live run whose link round writes bold or heading numbers: the ledger lists its premises, and no FORFEITED line. Two live runs.

## STEPS
1. W1 grades this plan. 2. Card to the operator. 3. Build on a fresh fetch; W1 grades. 4. Write card. 5. Fetch-back, audit, Wall, W1 readback; W3 manual entry and AAR row.
