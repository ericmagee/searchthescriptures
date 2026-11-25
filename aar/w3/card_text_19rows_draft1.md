# Card text: add nineteen rows to the ASK AAR record (W3, draft 1)

QUESTION ON THE CARD: Add the nineteen confirmed rows to the ASK AAR record?
OPTIONS: Add all / Hold

Each row is a record of an ASK: what was asked, what was built, who graded it, what a run showed. No row changes the engine, a manual or any earlier row. Every file was graded or confirmed by W1. On "Add all" the coordinator inserts them in the order below.

## A. Seven new rows
| # | ASK | What it records | Objective met | File (aar/w3/) and md5 |
|---|-----|-----------------|---------------|------------------------|
| 1 | 627 | every model call of a run is priced | in part | aar_row_627_draft3.sql 944b1d22 |
| 2 | 628 | the Oracle's close answers every pressed verse | in part | aar_row_628_draft3.sql e1486215 |
| 3 | 578 | the child reads the engine's library from the call | in part | aar_row_578_draft2.sql 7e203708 |
| 4 | 579 | nine re-call reply blocks served from the library | in part | aar_row_579_draft1.sql 8b5df8ae |
| 5 | 612 | every n8n expression is compiled before any write | in part | aar_row_612_draft2.sql 09e9a198 |
| 6 | 625 | every live-run AAR states the run's cost | yes | aar_row_625_draft1.sql 44242806 |
| 7 | 588 anchor fix | the question round's transcript anchor | yes | aar_row_588_anchor_draft2.sql f8f0e158 |

## B. Twelve revisions that add the evidence of run 42373 to rows already in the record
All twelve are "in part": one run is half of the two-run rule, or a path did not fire. Files are aar/w3/aar_row_<name>_run42373_draft2.sql.
| # | ASK | Revises row | What run 42373 showed | md5 |
|---|-----|-------------|-----------------------|-----|
| 8 | 588 (question round) | the anchor-fix row (7 above) | ran by the Anthropic route; continuation and OpenRouter route not exercised | 6b6df8c0 |
| 9 | 587 | 158 | A, C2, E fired; B, C1, D not exercised | 4197544e |
| 10 | 593 | 160 | no haiku anywhere; first of two runs | f5d3eade |
| 11 | 590 | 161 | 180 closing-check rows kept; reversed-reading path not exercised | 7c92a84e |
| 12 | 586 J1 | 163 | always line shown; the engine's part not shown | 25cbf7d0 |
| 13 | 586 J6 | 164 | ten record-only rows; send-back side not shown (ASK 611 defect) | a678d0cb |
| 14 | 586 J2 | 166 | not shown | d7863283 |
| 15 | 586 J3 | 167 | grants lists reached the judges; check not exercised | f747f645 |
| 16 | 591 | 169 | order read from the table at version 5; first of two runs | 02f8bea3 |
| 17 | 601 | 172 | no judge ran a debater's model; first of two runs | e60ce9ea |
| 18 | 623 | 174 | both seats offered and accepted; neither debated or judged | 16680581 |
| 19 | 608 | 176 | no-change path shown; backup seat not exercised | 01ec4711 |

Row 8 must follow row 7: it names row 7 as the row it revises and its insert fails otherwise.
Grades: W1, Wall 11841 area and 11858 (627, 628, 578), 11880 (579), 11886 (612, 625), 11888 (588 anchor fix), 11892 (the twelve).
