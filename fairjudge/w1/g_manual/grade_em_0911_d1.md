# W1 GRADE: engine manual entries for ASK 641, 638 A, 645, 646, 634, draft 1 (six pair files in manual_0911/w3/)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
GRADE: PASS, all six.

## Reproduced in SQL
Each pair was applied to the highest version of its part. In every case the old text occurs once, and the result equals W3's preview:
| # | Part and base | Result |
|---|---|---|
| 1 | 13.0 v323 bbb1e3e4 | 19,298, 804faeba |
| 2 | 11.0 v327 a631296d | 37,585, 733a91fa |
| 3 | 09.0 v297 3ec23b92 | 40,947, b0d86b90 |
| 4 | 14.0 v296 cbb62f4a | 8,197, 1f513052 |
| 5 | 10.0 v321 438a0c8d | 63,636, c5e5a64c |
| 6 | 09.1 v317 6018f13c | 47,479, 38c2ebc1 |
For pairs 3, 5 and 6, the SQL was generated from the JSON files themselves.

## Facts checked against live engine 7f4e5503 (my readback copy)
- 641, the salvage path: Salvage Save -> Salvage Tokens -> Salvage Write Tokens? -> Salvage Write Tokens -> Save Incomplete to Drive.
  - The IF is true when Init Seats regrade !== true and dry !== true. Its false branch goes to the Drive save.
  - Salvage Write Tokens posts to rpc/record_debate_row_tokens: Failure Salvage's run_token, the four token arguments as null, and p_calls from Salvage Tokens.
  - Salvage Tokens and Salvage Write Tokens are set to continueRegularOutput.
  - The new entry in 13.0 is indented like its sibling entries.
- 641, 11.0: the deleted clause "NULL when the run stopped before Panel Tokens" is untrue since 641, as W3 says.
- 638 A: pkgCPD, cpDrop, "takes the premise out of the count", "not counted (SPARED)" and "STORED COUNTED PREMISES FOR THIS SIDE" are all present. The entry names the D38 BASIS and drv_uncured effect from my F1 (Wall 12059).
- 645: qfCheck appears in QR Merge, QR Follow Build and QR Follow Final.
- 646: seat_left_out is written by Init Seats and read by Build Save Body. The LEFT OUT text is present.
- 634: sbApply2024 is present.

## W3's question
One card listing the six is right: each entry records a change the operator already pressed. The writes still go one part at a time, each rebased on the highest version, and I read back each one.

STANDARD (ASK 599): not applicable; this is manual text.
NOT CHECKED: "When Salvage Save fails there is no row and no cost is written"; the filter-reason wording inside Init Seats; the Shared Library line content beyond the names found.
